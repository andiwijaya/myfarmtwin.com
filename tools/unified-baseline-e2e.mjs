import {chromium} from 'playwright';
import {settledPage} from './settled-page.mjs';
import {startServer} from './serve.mjs';
import {mkdir,readFile,writeFile,readdir} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir,cpus,totalmem} from 'node:os';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
import {digest} from './unified-save-baseline.mjs';

const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-baseline');await mkdir(qa,{recursive:true});
const fixture=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8');
assert.equal(JSON.parse(fixture).state.paused,true);
const server=await startServer(0),base='http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
const report={at:new Date().toISOString(),browser:browser.version(),hardware:{cpu:cpus()[0].model,memoryGiB:+(totalmem()/1024**3).toFixed(1)},method:'Headless isolated Playwright contexts. Touch/viewport emulation only; no physical Android, display FPS, iOS or Safari claim.',fixtureSha256:digest(fixture),profiles:[],errors:[],assets:[]};
async function inventory(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())await inventory(path);else{const bytes=await readFile(path);report.assets.push({path,bytes:bytes.length,gzipEquivalent:gzipSync(bytes).length,sha256:digest(bytes)});}}}
await inventory('dist/play');
try{
 for(const mobile of [false,true])for(const locale of ['en','id']){
  const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},hasTouch:mobile,isMobile:mobile,reducedMotion:'reduce'});
  await context.tracing.start({screenshots:true,snapshots:true});
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);},fixture);
   const page=settledPage(await context.newPage());page.on('pageerror',e=>report.errors.push(e.message));
   const start=performance.now();await page.goto(base+'/play/',{waitUntil:'networkidle'});
   await page.locator('#language').selectOption(locale);
   const saved=await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1'));
   for(const area of ['field','chicken','goat','cow','fish']){
    await page.locator('#area-'+area).click();
    const selector={field:'[data-choose-plot="0"]',chicken:'[data-choose-chicken=coop]',goat:'[data-choose-goat=shelter]',cow:'[data-choose-cow=feed]',fish:'[data-choose-fish=pond]'}[area];
    await page.locator(selector).click();
    assert.equal(await page.locator('#world').getAttribute('data-area'),area);
    assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),saved,'visited-area selection must preserve fixture');
    assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    const name=`before-${mobile?'mobile':'desktop'}-${locale}-${area}.png`;
    await page.screenshot({path:join(qa,name),fullPage:true});
    report.profiles.push({mobile,locale,area,screenshot:name,saveExact:true,overflow:false,objectButtons:await page.locator('.plot-shortcuts button').count(),elapsedFromNavigationMs:Math.round(performance.now()-start)});
   }
  }finally{await context.tracing.stop({path:join(qa,`before-${mobile?'mobile':'desktop'}-${locale}-trace.zip`)});await context.close();}
 }
 assert.equal(report.profiles.length,20);assert.deepEqual(report.errors,[]);
 console.log(JSON.stringify({profiles:report.profiles.length,errors:report.errors,rawBytes:report.assets.reduce((n,a)=>n+a.bytes,0),gzipEquivalent:report.assets.reduce((n,a)=>n+a.gzipEquivalent,0)}));
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'baseline-visuals.json'),JSON.stringify(report,null,2));}
