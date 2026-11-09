import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {settledPage} from './settled-page.mjs';
import {worldCamera} from './unified-shell-ui.mjs';
import {settleWorldProjection} from './unified-sprite-point.mjs';
import {deserialize,serialize} from '../game/client/save-schema.js';
import {dispatch} from '../game/client/engine.js';

assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');
const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');
assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&end>Date.now()&&end-Date.now()<=15*60_000,'Current coordinated deadline required');
const qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/environment-motion',hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8');assert.equal(deserialize(raw).paused,true);
const report={receiptSHA256:hash(JSON.stringify(JSON.parse(await readFile('dist/play/build-info.json','utf8')))),profiles:[],errors:[],consoleErrors:[],scope:'Existing scene-graph cosmetic samples while original simulation is paused; real original clock pause/resume with full command oracle; reduced-motion/Low static poses and finite no-new-render checks. No second tick, mock time/visibility, per-Sprite GPU telemetry, FPS, hidden-tab, physical-device or loading claim. Weather/solar matrix is separate retained evidence.'};
await mkdir(qa,{recursive:true});
const server=await startServer(0,undefined,{assetCompression:true,assetCache:true});let browser=null,timer=null,expired=false;
try{
 browser=await chromium.launch({headless:true,timeout:Math.min(30000,end-Date.now()),executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 timer=setTimeout(()=>{expired=true;void browser.close();},Math.max(0,end-Date.now()));
 for(const mobile of [false,true])for(const locale of ['en','id']){
  assert.ok(Date.now()<end,'Slot expired');
  const name=`${mobile?'phone':'desktop'}-${locale}`,context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:900},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,reducedMotion:'no-preference'}),commands=[],captures=[];let expected=deserialize(raw);
  report.activeProfile={name,commands,captures};
  try{
   await context.addInitScript(raw=>{if(!localStorage.getItem('qa-cozy-environment-motion')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('qa-cozy-environment-motion','1');}window.__qaIntervals=0;const set=window.setInterval.bind(window);window.setInterval=(...args)=>{window.__qaIntervals++;return set(...args);};},raw);
   const page=settledPage(await context.newPage());page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);await page.locator('#language').selectOption(locale);
   await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.renderer==='three'&&d.controlsReady==='true'&&Number(d.spriteActors)>0&&d.spriteActors===d.spriteReady;});
   await page.evaluate(async()=>{const{Scene}=await import('/play/vendor/three/three.module.js'),after=Scene.prototype.onAfterRender;window.__qaScenes=new Set();window.__qaCameras=new Set();Scene.prototype.onAfterRender=function(renderer,...args){after.call(this,renderer,...args);window.__qaScene=this;window.__qaCamera=args[1];window.__qaScenes.add(this);window.__qaCameras.add(args[1]);};window.__qaCanvas=document.querySelector('#world canvas');});
   const host=page.locator('#unified-preview');await worldCamera(page,'field');
   const exact=async()=>{assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),serialize(expected));assert.deepEqual(await page.evaluate(()=>({intervals:window.__qaIntervals,scenes:window.__qaScenes.size,cameras:window.__qaCameras.size,canvas:window.__qaCanvas===document.querySelector('#world canvas')})),{intervals:1,scenes:1,cameras:1,canvas:true});assert.equal(await page.locator('#world canvas').count(),1);assert.equal(await page.locator('#world svg').count(),0);assert.equal(await host.getAttribute('data-sprite-errors'),'0');};
   const act=type=>{const c={id:expected.revision+1,type},result=dispatch(expected,c);assert.ok(result.ok,type+': '+result.error);expected=result.state;commands.push(c);};
   const click=async(selector,type)=>{assert.ok(Date.now()<end,'Slot expired');await page.locator(selector).click();const actual=await page.evaluate(()=>JSON.parse(localStorage.getItem('myfarmtwin.save.v1')).state);if(!expected.paused)while(expected.tick<actual.tick)act('tick');act(type);if(!expected.paused)while(expected.tick<actual.tick)act('tick');await exact();};
   const frames=async(count=24)=>page.evaluate(async count=>{for(let i=0;i<count;i++)await new Promise(requestAnimationFrame);},count);
   const sample=()=>page.evaluate(()=>{const leaves=[],water=[],sprites=[];window.__qaScene.traverse(o=>{if(o.userData.cropLeaf)leaves.push(o.rotation.z-o.userData.restZ);if(o.userData.waterRest){const r=o.userData.waterRest;water.push({x:o.position.x-r.x,z:o.position.z-r.z,sx:o.scale.x/r.w,sz:o.scale.z/r.d});}if(o.isSprite&&o.userData.atlas)sprites.push({id:o.userData.entityId,frame:o.userData.frame,position:o.position.toArray(),lod:o.userData.atlas.asset.meta.lod});});return{leaves,water,sprites,submissions:Number(document.querySelector('#unified-preview').dataset.renderSubmissions)};});
   const capture=async label=>{const path=`${qa}/${name}-${label}.png`;await page.screenshot({path});captures.push({label,path});await exact();};
   const bounded=sample=>{assert.ok(sample.leaves.length>0&&sample.water.length>0&&sample.sprites.length>0,'Native fixture must exercise all cosmetic categories');for(const a of sample.leaves)assert.ok(Math.abs(a)<=.02200001);for(const p of sample.water){assert.ok(Math.abs(p.x)<=.02500001&&Math.abs(p.z)<=.02500001);assert.ok(p.sx>=.9549999&&p.sx<=1.0450001&&p.sz>=.9549999&&p.sz<=1.0450001);}};
   await page.locator('select[data-world-quality]').selectOption('high');await worldCamera(page,'field');await page.waitForFunction(()=>{let ready=true,count=0;window.__qaScene.traverse(o=>{const m=o.userData.atlas?.asset?.meta;if(m){count++;if(m.lod!=='high')ready=false;}});return count>0&&ready;});await settleWorldProjection(page);await exact();
   const before=await sample();await frames(36);const moving=await sample();bounded(before);bounded(moving);
   assert.ok(moving.leaves.some((a,i)=>Math.abs(a-before.leaves[i])>1e-7),'Paused atmosphere should actually sway');assert.ok(moving.water.some((p,i)=>Math.abs(p.x-before.water[i].x)>1e-7||Math.abs(p.sx-before.water[i].sx)>1e-7),'Paused water details should actually move');assert.ok(moving.submissions>before.submissions);await exact();await capture('paused-cosmetic');
   // Original PRD permits nonproductive atmosphere while paused. Only these
   // original UI commands may advance the deterministic native simulation.
   await click('#speed','speed');const cycles=[];
   for(let cycle=0;cycle<2;cycle++){const tick=expected.tick;await click('#pause','pause');assert.equal(expected.paused,false);await page.waitForFunction(tick=>JSON.parse(localStorage.getItem('myfarmtwin.save.v1')).state.tick>=tick,tick+4,{timeout:10000});await click('#pause','pause');assert.equal(expected.paused,true);assert.ok(expected.tick>=tick+4);cycles.push({startTick:tick,endTick:expected.tick});await frames();await exact();}
   await capture('native-clock-paused-again');
   const staticCheck=async label=>{await settleWorldProjection(page);await frames(6);const a=await sample();await frames(24);const b=await sample();assert.equal(b.submissions,a.submissions,'Static mode must stop repeated submissions');assert.deepEqual(b,a,'Static scene poses/transforms must remain exact');assert.ok(b.leaves.every(a=>a===0));assert.ok(b.water.every(p=>p.x===0&&p.z===0&&p.sx===1&&p.sz===1));assert.ok(b.sprites.every(s=>s.frame===0));assert.equal(await host.getAttribute('data-animated-entities'),'0');await capture(label);return{leaves:b.leaves.length,water:b.water.length,sprites:b.sprites.length,noNewSubmissions:true};};
   await page.emulateMedia({reducedMotion:'reduce'});await worldCamera(page,'field');const reduced=await staticCheck('reduced-motion');
   await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('select[data-world-quality]').selectOption('low');await worldCamera(page,'field');
   await page.waitForFunction(()=>{let ready=true,count=0;window.__qaScene.traverse(o=>{const m=o.userData.atlas?.asset?.meta;if(m){count++;if(m.lod!=='low')ready=false;}});return count>0&&ready;});const low=await staticCheck('low-webgl');assert.equal(await host.getAttribute('data-renderer'),'three');
   await page.locator('select[data-world-quality]').selectOption('high');await worldCamera(page,'field');await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview').dataset;let ready=true,count=0;window.__qaScene.traverse(o=>{const m=o.userData.atlas?.asset?.meta;if(m){count++;if(m.lod!=='high')ready=false;}});return count>0&&ready&&d.spriteActors===d.spriteReady&&d.atlasQuality==='high';});await settleWorldProjection(page);
   const resumeBefore=await sample();await frames(36);const resumeAfter=await sample();bounded(resumeAfter);assert.ok(resumeAfter.leaves.some((a,i)=>Math.abs(a-resumeBefore.leaves[i])>1e-7));assert.ok(resumeAfter.submissions>resumeBefore.submissions);await exact();await capture('motion-resumed');
   report.profiles.push({name,commands,cycles,captures,pausedCosmeticsPreserveWholeSave:true,nativeClockOracleExact:true,oneOriginalSceneCameraInterval:true,reduced,low,animationResumes:true});report.activeProfile=null;await writeFile(qa+'/partial.json',JSON.stringify(report,null,2));console.log(JSON.stringify({name,ticks:commands.filter(c=>c.type==='tick').length,pass:true}));
  }finally{await context.close();}
 }
 assert.equal(report.profiles.length,4);assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.equal(expired,false);
}catch(error){report.failure=String(error.stack||error);throw error;}
finally{if(timer)clearTimeout(timer);try{await browser?.close();}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await writeFile(qa+'/environment-motion.json',JSON.stringify({...report,slotExpired:expired},null,2));}}
