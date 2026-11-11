import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gardenQATarget} from './garden-qa-target.mjs';
import {worldCamera} from './unified-shell-ui.mjs';
const qa=process.env.QA_DIR||'qa-artifacts/garden/performance';await mkdir(qa,{recursive:true});
const raw=await readFile('qa-artifacts/garden/growth/dense-mixed.json','utf8'),server=await gardenQATarget();let browser;
const report={base:server.base,live:server.live,profiles:[],errors:[],consoleErrors:[],failedRequests:[],limits:`One cold/warm ${server.live?'production':'local gzip'} sample/profile. Phone: 390×844 DPR2.75, CDP4x CPU, 150ms latency, 200000B/s down, 93750B/s up. Render submissions are not physical Android/display FPS; no VRAM/thermal claim.`};
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const mobile of [false,true]){
  const name=mobile?'phone-emulated':'desktop',context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},hasTouch:mobile,isMobile:mobile,deviceScaleFactor:mobile?2.75:1});
  try{
   await context.addInitScript(raw=>{if(!localStorage.getItem('garden-perf')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('garden-perf','1');}},raw);
   const page=await context.newPage(),cdp=await context.newCDPSession(page);page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url(),error:r.failure()}));
   if(mobile){await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});}
   const loads=[];
   for(const warm of [false,true]){const started=Date.now();if(warm)await page.reload({waitUntil:'domcontentloaded'});else await page.goto(server.base+'/play/',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true',{},{timeout:60000});const mapMs=Date.now()-started;await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.spriteActors===d?.spriteReady;},{},{timeout:60000});const artMs=Date.now()-started;loads.push({warm,mapMs,artMs});assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);}
   await page.evaluate(async()=>{const {Scene}=await import('/play/vendor/three/three.module.js'),original=Scene.prototype.onAfterRender;window.__gardenPerf=[];Scene.prototype.onAfterRender=function(renderer,...args){original.call(this,renderer,...args);window.__gardenPerf.push({t:performance.now(),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures});if(window.__gardenPerf.length>5000)window.__gardenPerf.shift();};});
   await cdp.send('HeapProfiler.collectGarbage');const before=await cdp.send('Runtime.getHeapUsage');await page.evaluate(()=>{window.__gardenPerf=[];});
   await page.waitForFunction(()=>{const a=window.__gardenPerf;return a.length>1&&a.at(-1).t-a[0].t>=20000;},{},{timeout:45000});
   const frames=await page.evaluate(()=>window.__gardenPerf);await cdp.send('HeapProfiler.collectGarbage');const after=await cdp.send('Runtime.getHeapUsage');
   const durationMs=frames.at(-1).t-frames[0].t,submissionsPerSecond=(frames.length-1)*1000/durationMs,maxCalls=Math.max(...frames.map(f=>f.calls)),maxTriangles=Math.max(...frames.map(f=>f.triangles)),heapChangeMiB=(after.usedSize-before.usedSize)/1048576;
   const row={name,loads,durationMs,submissions:frames.length,submissionsPerSecond,maxCalls,maxTriangles,heapChangeMiB,geometries:frames.at(-1).geometries,textures:frames.at(-1).textures,pausedSaveExact:await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1'))===raw};
   report.profiles.push(row);await writeFile(`${qa}/${name}-frames.json`,JSON.stringify(frames));console.log(JSON.stringify(row));
   assert.ok(loads.every(l=>l.mapMs<=5000),'Map readiness budget');assert.ok(submissionsPerSecond>=(mobile?30:50),'Render-submission budget');assert.ok(maxCalls<=(mobile?370:415));assert.ok(maxTriangles<=30000);assert.ok(heapChangeMiB<=20);assert.equal(row.pausedSaveExact,true);
   await worldCamera(page,'field');await page.screenshot({path:`${qa}/${name}.png`,fullPage:true});
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();await server.close();await writeFile(`${qa}/performance.json`,JSON.stringify(report,null,2));}
