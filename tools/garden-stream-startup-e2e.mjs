import assert from 'node:assert/strict';import {createServer} from 'node:http';import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';import {resolve} from 'node:path';import {startServer} from './serve.mjs';
import {createState} from '../game/client/engine.js';import {serialize} from '../game/client/save-schema.js';
const qa=process.env.QA_DIR||'qa-artifacts/garden/stream-startup',negative=process.env.STREAM_EXPECT_RACE==='1';await mkdir(qa,{recursive:true});
const source=await startServer(0,resolve(process.env.QA_DIST_ROOT||'dist'),{assetCache:true}),timers=new Set(),report={negative,profiles:[],errors:[]};let browser;
const proxy=createServer(async(req,res)=>{try{const up=await fetch('http://127.0.0.1:'+source.address().port+req.url),body=Buffer.from(await up.arrayBuffer()),headers=Object.fromEntries(up.headers);for(const k of ['content-encoding','content-length','transfer-encoding','connection'])delete headers[k];res.writeHead(up.status,headers);const split=body.indexOf('<dialog id="market-dialog"');if(req.url.startsWith('/play/')&&headers['content-type']?.includes('text/html')&&split>=0){res.write(body.subarray(0,split));await new Promise(r=>{const t=setTimeout(()=>{timers.delete(t);r();},4000);timers.add(t);});res.end(body.subarray(split));}else res.end(body);}catch(e){if(!res.headersSent)res.writeHead(500);res.end();report.errors.push(String(e));}});
await new Promise(r=>proxy.listen(0,'127.0.0.1',r));
try{browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const mobile of (negative?[false]:[false,true]))for(const locale of (negative?['en']:['en','id'])){const context=await browser.newContext({viewport:mobile?{width:360,height:740}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'}),name=`${mobile?'phone':'desktop'}-${locale}`,errors=[];
  try{await context.addInitScript(locale=>localStorage.setItem('myfarmtwin.locale',locale),locale);const page=await context.newPage();page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:'+proxy.address().port+'/play/',{waitUntil:'load'});
   if(negative){assert.ok(errors.some(e=>e.includes('Missing interface: market-dialog')),JSON.stringify(errors));assert.equal(await page.locator('#unified-preview').getAttribute('data-controls-ready'),'false');}
   else{await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');await page.locator('[data-world-menu=market]').click();assert.equal(await page.locator('#market-dialog').isVisible(),true);await page.locator('#close-market').click();assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),serialize(createState()));assert.deepEqual(errors,[]);}
   await page.screenshot({path:`${qa}/${name}.png`,fullPage:true});report.profiles.push({name,tailDelayedMs:4000,originalRaceReproduced:negative,controlsAndMarketReady:!negative,consoleErrors:errors,saveExact:!negative});console.log(JSON.stringify(report.profiles.at(-1)));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();for(const t of timers)clearTimeout(t);proxy.closeAllConnections();source.closeAllConnections();await Promise.all([new Promise(r=>proxy.close(r)),new Promise(r=>source.close(r))]);await writeFile(`${qa}/startup.json`,JSON.stringify(report,null,2));}
