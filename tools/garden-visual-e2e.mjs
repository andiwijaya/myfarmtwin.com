import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {startServer} from './serve.mjs';
import {worldCamera} from './unified-shell-ui.mjs';

// Disposable contexts and synthetic fixtures only; never attach to personal Chrome.
const qa=process.env.QA_DIR||'qa-artifacts/garden/before';
await mkdir(qa,{recursive:true});
const raw=await readFile(process.env.GARDEN_FIXTURE||'game/tests/fixtures/unified-world/v5-mixed.json','utf8');
const server=await startServer(0,resolve(process.env.GARDEN_DIST||'dist'));
let browser;
const report={profiles:[],errors:[],consoleErrors:[],failedRequests:[],limits:'Desktop and phone emulation, not physical Android.'};
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const touch of [false,true])for(const locale of ['en','id']){
  const name=`${touch?'phone':'desktop'}-${locale}`,context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1440,height:1000},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
  try{
   await context.addInitScript(raw=>localStorage.setItem('myfarmtwin.save.v1',raw),raw);
   const page=await context.newPage();
   page.on('pageerror',e=>report.errors.push({name,error:e.message}));
   page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});
   page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url(),error:r.failure()}));
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);
   await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.controlsReady==='true'&&d.spriteReady===d.spriteActors;});
   await page.locator('#language').selectOption(locale);
   await worldCamera(page,'field');
   for(let i=0;i<2;i++)await worldCamera(page,'in');
   const captures=[];
   for(let h=0;h<4;h++){
    if(h)await worldCamera(page,'right');
    const path=`${qa}/${name}-garden-h${h}.png`;
    await page.screenshot({path,fullPage:true});captures.push(path);
   }
   report.profiles.push({name,captures,renderer:await page.locator('#unified-preview').getAttribute('data-renderer'),plots:await page.locator('[data-preview-select^="field.plot."]').count()});
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));await writeFile(`${qa}/visual.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify(report));
