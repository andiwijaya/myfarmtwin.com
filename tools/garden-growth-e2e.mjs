import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {startServer} from './serve.mjs';
import {worldCamera,worldObject} from './unified-shell-ui.mjs';
import {makeGardenScenario} from './garden-scenario.mjs';
import {dispatch} from '../game/client/engine.js';
import {deserialize,serialize} from '../game/client/save-schema.js';

const qa=process.env.QA_DIR||'qa-artifacts/garden/growth';await mkdir(qa,{recursive:true});
const farm=await makeGardenScenario();await writeFile(`${qa}/dense-mixed.json`,farm.raw);await writeFile(`${qa}/dense-planted.json`,farm.planted);
const server=await startServer(0,resolve('qa-artifacts/garden/build/dist'));let browser;
const report={profiles:[],errors:[],consoleErrors:[],failedRequests:[],funding:farm.funding,limits:'Phone is desktop touch emulation. Timing measures render submissions and scene transforms, not physical display FPS.'};
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const touch of [false,true]){
  const name=touch?'phone':'desktop',context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1440,height:1000},hasTouch:touch,isMobile:touch});
  try{
   await context.addInitScript(raw=>{if(!localStorage.getItem('garden-growth-installed')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('garden-growth-installed','1');}window.__gardenIntervals=0;const set=window.setInterval.bind(window);window.setInterval=(...args)=>{window.__gardenIntervals++;return set(...args);};},farm.planted);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url()}));
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.controlsReady==='true'&&d.spriteActors===d.spriteReady;});
   await page.evaluate(async()=>{const {Scene}=await import('/play/vendor/three/three.module.js'),original=Scene.prototype.onAfterRender;window.__gardenFrames=[];Scene.prototype.onAfterRender=function(renderer,scene,camera,...args){original.call(this,renderer,scene,camera,...args);window.__gardenScene=this;window.__gardenCamera=camera;const group=this.children.find(o=>o.userData.entityId==='field.plot.3'),mesh=group?.children.find(o=>o.userData.cropPlant);if(mesh){window.__gardenFrames.push({time:performance.now(),scale:mesh.scale.y,wind:mesh.rotation.z,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles});if(window.__gardenFrames.length>300)window.__gardenFrames.shift();}};});
   await worldCamera(page,'field');await page.waitForFunction(()=>window.__gardenFrames?.length>=5);
   let expected=deserialize(farm.planted);const next=dispatch(expected,{id:expected.revision+1,type:'nextDay'});assert.ok(next.ok);expected=next.state;
   await page.evaluate(()=>{window.__gardenFrames=[];});await page.locator('#next-day').click();await page.waitForFunction(raw=>localStorage.getItem('myfarmtwin.save.v1')===raw,serialize(expected));
   await page.waitForFunction(()=>{const a=window.__gardenFrames;return a.length>15&&a.at(-1).time-a[0].time>=500;});
   const samples=await page.evaluate(()=>window.__gardenFrames);assert.ok(new Set(samples.map(p=>p.scale.toFixed(5))).size>=3,'Growth must ease through actual intermediate transforms');assert.ok(new Set(samples.map(p=>p.wind.toFixed(5))).size>=3,'Whole plant must sway');
   const exact=serialize(expected);await page.emulateMedia({reducedMotion:'reduce'});await page.waitForFunction(()=>document.querySelector('#unified-preview').dataset.animatedEntities==='0');
   const calm=await page.evaluate(()=>window.__gardenFrames.at(-1));assert.equal(calm.wind,0);assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),exact);
   // Import a mature native paid garden via the ordinary data tools; the save
   // replacement needs confirmation and archives the previously played state.
   await page.locator('[data-world-menu=settings]').click();if(!await page.locator('#data-tools').evaluate(d=>d.open))await page.locator('#data-tools summary').click();
   await page.locator('#import-save').setInputFiles({name:'dense-garden.json',mimeType:'application/json',buffer:Buffer.from(farm.raw)});await page.locator('#data-apply').click();await page.waitForFunction(raw=>localStorage.getItem('myfarmtwin.save.v1')===raw,farm.raw);await page.locator('[data-world-close=settings]').click();
   assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.backup.v1')),exact);
   await worldCamera(page,'field');for(let i=0;i<3;i++)await worldCamera(page,'in');if(await page.locator('#world-camera-tools').evaluate(d=>d.open))await page.locator('#world-camera-tools summary').click();
   const captures=[];for(let h=0;h<4;h++){if(h)await worldCamera(page,'right');const path=`${qa}/${name}-dense-h${h}.png`;await page.screenshot({path,fullPage:true});captures.push(path);}
   await worldObject(page,'field.plot.0');assert.equal(await page.locator('#harvest').isEnabled(),true);await page.keyboard.press('Escape');
   const geometry=await page.evaluate(()=>{const plants=[],unique=new Set();window.__gardenScene.traverse(o=>{if(o.userData.cropPlant){plants.push(o);unique.add(o.geometry.uuid);}});return{plants:plants.length,uniquePlantGeometries:unique.size,intervals:window.__gardenIntervals,canvas:document.querySelectorAll('#world canvas').length,sourceTick:document.querySelector('#unified-preview').dataset.sourceTick};});assert.ok(geometry.plants>48&&geometry.uniquePlantGeometries<geometry.plants);assert.equal(geometry.intervals,1);assert.equal(geometry.canvas,1);
   assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),farm.raw);
   await page.locator('select[data-world-quality]').selectOption('low');await page.waitForFunction(()=>document.querySelector('#unified-preview').dataset.animatedEntities==='0');
   await page.locator('select[data-world-quality]').selectOption('high');await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForFunction(()=>Number(document.querySelector('#unified-preview').dataset.animatedEntities)>0);
   await worldObject(page,'field.plot.0');await page.locator('#harvest').click();const harvested=dispatch(farm.state,{id:farm.state.revision+1,type:'harvest',plot:0});assert.ok(harvested.ok);await page.waitForFunction(raw=>localStorage.getItem('myfarmtwin.save.v1')===raw,serialize(harvested.state));
   await page.locator('[data-world-cue=receipt][data-cue-kind=harvest][data-entity-id="field.plot.0"]').waitFor({state:'visible'});
   for(const key of ['chicken','goat','cow','fish'])assert.deepEqual(harvested.state[key],farm.state[key]);
   report.profiles.push({name,growthSamples:samples,calm,geometry,allSpecies:true,captures,confirmedImport:true,priorBackupExact:true,noRenderDrivenGrowth:true,lowStopsMotion:true,motionResumes:true,acceptedHarvestPop:true,otherAreasExact:true});console.log(JSON.stringify({name,pass:true,geometry}));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));await writeFile(`${qa}/growth.json`,JSON.stringify(report,null,2));}
