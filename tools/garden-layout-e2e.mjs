import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {startServer} from './serve.mjs';
import {worldCamera,worldObject} from './unified-shell-ui.mjs';
import {runCowEconomy} from './cow-economy-policy.mjs';
import {dispatch} from '../game/client/engine.js';
import {serialize,deserialize} from '../game/client/save-schema.js';
import {LIMITS} from '../game/client/config.js';

const qa=process.env.QA_DIR||'qa-artifacts/garden/layout';await mkdir(qa,{recursive:true});
const source=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8');
let initial=runCowEconomy({days:30,mode:'mixed',source:deserialize(source),progress:false}).state;
function native(s,type,extra={}){const r=dispatch(s,{id:s.revision+1,type,...extra});assert.ok(r.ok,type+': '+r.error);return r.state;}
if(!initial.paused)initial=native(initial,'pause');
if(!initial.pump.built)initial=native(initial,'buyPump');
for(const p of [...initial.plots])if(p.crop){assert.equal(p.crop.progress,1);initial=native(initial,'harvest',{plot:p.id});}
for(const lot of [...initial.inventory])initial=native(initial,'sell',{lot:lot.id});
const raw=serialize(initial);assert.ok(initial.coins>5000);assert.equal(initial.mission.step,7);
const server=await startServer(0,resolve('qa-artifacts/garden/build/dist'));
let browser;const report={profiles:[],errors:[],consoleErrors:[],failedRequests:[],funding:{recipe:'30 native mixed economy days',coins:initial.coins},limits:'Phone is touch emulation on desktop Chrome.'};
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const touch of (process.env.GARDEN_PROFILE==='phone'?[true]:[false,true]))for(const locale of ['en','id']){
  const name=`${touch?'phone':'desktop'}-${locale}`,context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1440,height:1000},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});let expected=structuredClone(initial),commands=0;
  try{
   await context.addInitScript(raw=>{if(!localStorage.getItem('garden-qa-installed')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('garden-qa-installed','1');}},raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url()}));
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');await page.locator('#language').selectOption(locale);
   const exact=async()=>{await page.waitForFunction(raw=>localStorage.getItem('myfarmtwin.save.v1')===raw,serialize(expected));};
   const send=async(type,selector,extra={})=>{await page.locator(selector).click();expected=native(expected,type,extra);commands++;await exact();};
   await page.locator('[data-world-menu=build]').click();
   while(expected.plots.length<LIMITS.plots)await send('expand','#expand');
   assert.equal(await page.locator('#expand').isDisabled(),true);await page.locator('#close-market').click();
   // Buy, plant and water every bed through the ordinary UI, with exact native
   // state/ledger checks after each accepted command, including the new IDs.
   await page.locator('[data-world-menu=market]').click();
   while(expected.seeds.lettuce<24)await send('buySeed','[data-buy-seed=lettuce]',{crop:'lettuce'});
   await page.locator('#close-market').click();
   for(let id=0;id<24;id++){
    await worldObject(page,'field.plot.'+id);await send('plant','#plant',{plot:id,crop:'lettuce'});
    if(expected.water<25){await page.locator('[data-world-menu=market]').click();await send('refill','#refill');await page.locator('#close-market').click();await worldObject(page,'field.plot.'+id);}
    if(expected.plots[id].soilWaterMm<45&&expected.plots[id].lastWaterTick!==expected.tick)await send('water','#water',{plot:id});
    await page.keyboard.press('Escape');
   }
   await page.evaluate(async()=>{const {Scene}=await import('/play/vendor/three/three.module.js');const original=Scene.prototype.onAfterRender;Scene.prototype.onAfterRender=function(renderer,scene,camera,...args){original.call(this,renderer,scene,camera,...args);window.__gardenScene=this;window.__gardenCamera=camera;};});
   const picks=[];
   for(let h=0;h<4;h++){
    if(h)await worldCamera(page,'right');
    // Selection intentionally reframes mobile care. Restore the garden
    // bookmark before rotating/testing the entire district again.
    await worldCamera(page,'field');for(let i=0;i<3;i++)await worldCamera(page,'in');
    await page.waitForFunction(()=>!!window.__gardenCamera);
    if(await page.locator('#world-camera-tools').evaluate(d=>d.open))await page.locator('#world-camera-tools summary').click();
    for(let id=0;id<24;id++){
     // Care-panel resize/reveal runs on the existing animation frame. Project
     // only after its final camera/canvas geometry settles, including touch.
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const point=await page.evaluate(id=>{const canvas=document.querySelector('#unified-preview canvas'),r=canvas.getBoundingClientRect(),g=window.__gardenScene.children.find(o=>o.userData.entityId==='field.plot.'+id),p=g.position.clone();p.y=.13;p.project(window.__gardenCamera);return{x:r.x+(p.x+1)*r.width/2,y:r.y+(1-p.y)*r.height/2};},id);
     if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
     const selected=await page.locator('#unified-preview').getAttribute('data-selected-entity');
     if(selected!=='field.plot.'+id){await page.screenshot({path:`${qa}/${name}-failed-h${h}-plot${id}.png`,fullPage:true});report.pickFailure={name,h,id,point,selected,underPointer:await page.evaluate(p=>document.elementFromPoint(p.x,p.y)?.outerHTML.slice(0,300),point)};}
     assert.equal(selected,'field.plot.'+id,`${name} heading ${h} plot ${id}`);
     assert.equal(await page.locator('#plot-panel').isVisible(),true);await page.keyboard.press('Escape');picks.push({h,id});
    }
    await page.screenshot({path:`${qa}/${name}-24-beds-h${h}.png`,fullPage:true});
   }
   await exact();await page.reload();await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');await exact();
   if(!touch&&locale==='en')await writeFile(`${qa}/24-planted.json`,serialize(expected));
   report.profiles.push({name,commands,plots:expected.plots.length,picks:picks.length,allPlantWater:true,exactStateLedger:true,reload:true});console.log(JSON.stringify(report.profiles.at(-1)));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));await writeFile(`${qa}/layout.json`,JSON.stringify(report,null,2));}
