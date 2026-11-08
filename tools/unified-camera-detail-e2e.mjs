import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {unifiedQATarget} from './unified-qa-target.mjs';
import {worldCamera} from './unified-shell-ui.mjs';

const qa=process.env.QA_DIR||'qa-artifacts/unified-camera-detail';
await mkdir(qa,{recursive:true});
const target=await unifiedQATarget();
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
const report={base:target.base,profiles:[],errors:[],scope:'Actual Auto Canvas camera frames, settled detail, owned sprites/native fills and the single existing cosmetic RAF. Disposable synthetic farms; touch and capability loss are simulated.'};
try{
 for(const mobile of [false,true])for(const earned of [false,true])for(const reduced of [false,true]){
  const name=`${mobile?'touch':'desktop'}-${earned?'earned':'fresh'}-${reduced?'reduced-motion':'normal'}`;
  const raw=await readFile(`game/tests/fixtures/unified-world/v5-${earned?'mixed':'fresh'}.json`,'utf8');
  const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:900},isMobile:mobile,hasTouch:mobile,reducedMotion:reduced?'reduce':'no-preference'});
  try{
   await context.addInitScript(raw=>{
    localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaIntervals=0;window.__qaOwned=new Set();window.__qaMaxOwned=0;
    const get=HTMLCanvasElement.prototype.getContext,interval=window.setInterval.bind(window),raf=window.requestAnimationFrame.bind(window),cancel=window.cancelAnimationFrame.bind(window);
    HTMLCanvasElement.prototype.getContext=function(t,...a){return t.startsWith('webgl')?null:get.call(this,t,...a);};
    window.setInterval=(...a)=>{window.__qaIntervals++;return interval(...a);};
    window.requestAnimationFrame=callback=>{const owned=new Error().stack.includes('unified-world-preview');let id;id=raf(t=>{if(owned)window.__qaOwned.delete(id);callback(t);});if(owned){window.__qaOwned.add(id);window.__qaMaxOwned=Math.max(window.__qaMaxOwned,window.__qaOwned.size);}return id;};
    window.cancelAnimationFrame=id=>{window.__qaOwned.delete(id);return cancel(id);};
   },raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));
   await page.goto(target.base+'/play/?world=unified-preview',{waitUntil:'networkidle'});
   await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.renderer==='canvas'&&d.controlsReady==='true'&&d.spriteActors===d.spriteReady;});
   await page.evaluate(async()=>{
    const T=await import('/play/vendor/three/three.module.js'),update=T.Scene.prototype.updateMatrixWorld;
    T.Scene.prototype.updateMatrixWorld=function(...a){window.__qaScene=this;return update.apply(this,a);};
   });
   await worldCamera(page,'fit');
   await page.evaluate(()=>{
    window.__qaCameraTrace=[];
    window.__qaReadCamera=()=>{const host=document.querySelector('#unified-preview'),actors=[],fills=[];let optional=0;window.__qaScene.traverseVisible(o=>{if(o.userData.startupOptional)optional++;if(o.isSprite&&o.userData.atlas)actors.push(o.userData.entityId);if(o.userData.nativeFill)fills.push(o.userData.fillRatio);});return{detail:host.dataset.cameraDetail,heading:host.dataset.heading,time:performance.now(),optional,actors:actors.sort(),fills:fills.sort((a,b)=>a-b)};};
    new MutationObserver(()=>{const p=window.__qaReadCamera();if(window.__qaCameraTrace.at(-1)?.detail!==p.detail)window.__qaCameraTrace.push(p);}).observe(document.querySelector('#unified-preview'),{attributes:true,attributeFilter:['data-camera-detail']});
   });
   const before=await page.evaluate(()=>window.__qaReadCamera());
   const right=page.locator('[data-preview-camera=right]');
   const reveal=async()=>{if(!await right.isVisible())await page.locator('#world-camera-tools summary').click();await page.waitForFunction(()=>document.querySelector('#unified-preview').dataset.cameraDetail==='full');};
   await reveal();
   await page.evaluate(()=>{window.__qaCameraTrace=[];});await right.click();
   await page.waitForFunction(()=>document.querySelector('#unified-preview').dataset.cameraDetail==='full');
   const trace=await page.evaluate(()=>window.__qaCameraTrace),after=await page.evaluate(()=>window.__qaReadCamera());
   assert.equal(after.heading,'1');assert.equal(after.optional,before.optional);assert.deepEqual(after.actors,before.actors);assert.deepEqual(after.fills,before.fills);
   if(reduced)assert.ok(!trace.some(p=>p.detail==='reduced'));
   else{
    const first=trace.find(p=>p.detail==='reduced'),full=trace.find(p=>p.detail==='full');assert.ok(first&&full);
    assert.equal(first.optional,0);assert.deepEqual(first.actors,before.actors);assert.deepEqual(first.fills,before.fills);
    assert.ok(full.time-first.time<=500,'Secondary detail must actually be repainted within500ms');
   }
   if(!earned)await page.waitForFunction(()=>window.__qaOwned.size===0);
   for(const quality of ['high','low']){
    await page.locator('select[data-world-quality]').selectOption(quality);await reveal();await page.evaluate(()=>{window.__qaCameraTrace=[];});await right.click();
    assert.ok(!(await page.evaluate(()=>window.__qaCameraTrace)).some(p=>p.detail==='reduced'));
   }
   await page.locator('select[data-world-quality]').selectOption('auto');
   await page.waitForFunction(()=>document.querySelector('#unified-preview').dataset.renderer==='canvas');
   let disposedWhileReduced=false;
   if(!reduced){
    await reveal();await right.click();disposedWhileReduced=await page.evaluate(async()=>{const b=await(await import('/play/unified-world-bootstrap.js')).prepareUnifiedWorld(),pending=document.querySelector('#unified-preview').dataset.cameraDetail==='reduced';b.preview.dispose();return pending;});
    assert.equal(disposedWhileReduced,true);await page.waitForFunction(()=>window.__qaOwned.size===0);
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);assert.equal(await page.evaluate(()=>window.__qaIntervals),1);assert.ok(await page.evaluate(()=>window.__qaMaxOwned<=1));
   report.profiles.push({name,trace,fullDetailRestored:true,ownedSpritesAndNativeFillsExact:true,highLowAndReducedMotionUnchanged:true,disposedWhileReduced,singleCosmeticRaf:true,wholeSaveExact:true});
   console.log(JSON.stringify({name,pass:true}));await writeFile(qa+'/partial.json',JSON.stringify(report,null,2));
  }finally{await context.close();}
 }
 assert.equal(report.profiles.length,8);assert.deepEqual(report.errors,[]);
}finally{await browser.close();await target.close();await writeFile(qa+'/camera-detail.json',JSON.stringify(report,null,2));}
