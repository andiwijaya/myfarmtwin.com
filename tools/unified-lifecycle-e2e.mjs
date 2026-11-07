import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-lifecycle');await mkdir(qa,{recursive:true});
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),server=await startServer(0),base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}),report={runs:[],errors:[]};
try{for(const scenario of ['dispose-before-context','dispose-pending','quality-race']){
 const context=await browser.newContext();try{
  await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaContexts=[];const get=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){const result=get.call(this,type,...args);if(type==='webgl2'&&result)window.__qaContexts.push(result);return result;};},raw);
  let release;const gate=new Promise(resolve=>{release=resolve;});await context.route('**/unified-world-webgl-*.js',async route=>{await gate;await route.continue();});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));await page.goto(base+'/play/',{waitUntil:'networkidle'});
  const requested=scenario==='dispose-before-context'?null:page.waitForRequest(/unified-world-webgl-.*\.js/);
  const initial=await page.evaluate(async()=>{const {mountUnifiedPreview}=await import('/play/unified-world-preview.js'),host=document.createElement('section');host.id='qa-lifecycle';document.body.prepend(host);window.__qaPreview=mountUnifiedPreview(host,JSON.parse(localStorage.getItem('myfarmtwin.save.v1')).state,'en');return window.__qaPreview.inspect();});assert.equal(initial.renderer,'canvas');assert.equal(initial.startupPending,1);if(requested)await requested;
  if(scenario!=='quality-race'){
   await page.evaluate(()=>window.__qaPreview.dispose());release();const result=await page.evaluate(async()=>{await window.__qaPreview.ready();await new Promise(resolve=>requestAnimationFrame(resolve));return {inspect:window.__qaPreview.inspect(),children:document.querySelector('#qa-lifecycle').childElementCount,contexts:window.__qaContexts.length,contextsReleased:window.__qaContexts.every(c=>c.isContextLost())};});assert.equal(result.inspect.disposed,true);assert.equal(result.inspect.visualPending,0);assert.equal(result.inspect.startupPending,0);assert.equal(result.children,0);assert.equal(result.contextsReleased,true);assert.equal(result.contexts,scenario==='dispose-before-context'?0:1);report.runs.push({scenario,...result});
  }else{
   await page.evaluate(()=>{window.__qaPreview.setLowGraphics(true);window.__qaPreview.setLowGraphics(false);window.__qaPreview.setLowGraphics(true);window.__qaPreview.setLowGraphics(false);});release();await page.evaluate(()=>window.__qaPreview.ready());await page.waitForFunction(()=>window.__qaPreview.inspect().renderer==='three');
   const live=await page.evaluate(()=>({inspect:window.__qaPreview.inspect(),liveContexts:window.__qaContexts.filter(c=>!c.isContextLost()).length,canvases:document.querySelectorAll('#qa-lifecycle canvas').length}));assert.equal(live.liveContexts,1);assert.equal(live.canvases,1);assert.equal(live.inspect.visualPending,1);
   const cleaned=await page.evaluate(()=>{window.__qaPreview.dispose();return {inspect:window.__qaPreview.inspect(),contextsReleased:window.__qaContexts.every(c=>c.isContextLost())};});assert.equal(cleaned.inspect.visualPending,0);assert.equal(cleaned.inspect.startupPending,0);assert.equal(cleaned.contextsReleased,true);report.runs.push({scenario,live,cleaned});
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);
 }finally{await context.close();}
}assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'lifecycle.json'),JSON.stringify(report,null,2));}
