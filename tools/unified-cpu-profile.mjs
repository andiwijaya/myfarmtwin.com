import {chromium} from 'playwright';import {startServer} from './serve.mjs';import {settledPage} from './settled-page.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';import {join} from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-cpu');await mkdir(qa,{recursive:true});
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),server=await startServer(0),base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}),report={method:'CDP CPU sampling and main-thread TaskDuration during ten camera rotations plus a 5-second idle window on the frozen legacy build. Mobile = viewport/touch + 4x CPU emulation, not physical Android.',runs:[]};
try{
 for(const mobile of [false,true]){
  const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile});
  try{
   await context.addInitScript(raw=>localStorage.setItem('myfarmtwin.save.v1',raw),raw);const page=settledPage(await context.newPage()),cdp=await context.newCDPSession(page);
   if(mobile)await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Performance.enable');await cdp.send('Profiler.enable');
   await page.goto(base+'/play/',{waitUntil:'networkidle'});await page.locator('#area-chicken').click();const beforeRaw=await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1'));
   const metrics=async()=>Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m=>[m.name,m.value]));await cdp.send('HeapProfiler.collectGarbage');const before=await metrics(),start=performance.now();await cdp.send('Profiler.start');
   for(let i=0;i<10;i++)await page.locator('[data-camera=right]').click();await page.waitForTimeout(5000);
   const {profile}=await cdp.send('Profiler.stop');const after=await metrics(),windowMs=Math.round(performance.now()-start);assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),beforeRaw);
   await writeFile(join(qa,`${mobile?'mobile':'desktop'}.cpuprofile`),JSON.stringify(profile));
   report.runs.push({mobile,cpuThrottle:mobile?4:1,windowMs,mainThreadTaskMs:+((after.TaskDuration-before.TaskDuration)*1000).toFixed(1),heapBeforeMiB:+(before.JSHeapUsedSize/1024**2).toFixed(2),heapAfterMiB:+(after.JSHeapUsedSize/1024**2).toFixed(2),samplingNodes:profile.nodes.length,saveExact:true,topGameFrames:profile.nodes.filter(n=>n.callFrame.url.startsWith(base+'/play/')).sort((a,b)=>(b.hitCount||0)-(a.hitCount||0)).slice(0,8).map(n=>({function:n.callFrame.functionName,path:new URL(n.callFrame.url).pathname,hits:n.hitCount||0}))});
  }finally{await context.close();}
 }
 console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'cpu-profile.json'),JSON.stringify(report,null,2));}
