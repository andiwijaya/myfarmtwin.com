import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {gardenQATarget} from './garden-qa-target.mjs';
import {worldCamera,worldObject,openWorldSettings} from './unified-shell-ui.mjs';
import {dispatch} from '../game/client/engine.js';
import {serialize} from '../game/client/save-schema.js';import {deserialize} from './active-garden-qa.mjs';

const qa=process.env.QA_DIR||'qa-artifacts/garden/corn';await mkdir(qa,{recursive:true});
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8');
const server=await gardenQATarget();
let browser;const report={profiles:[],errors:[],consoleErrors:[],failedRequests:[],limits:'Isolated Chrome; phone is touch emulation, not physical Android.'};
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const touch of [false,true])for(const locale of ['en','id']){
  const name=`${touch?'phone':'desktop'}-${locale}`,context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1440,height:1000},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});let expected=deserialize(raw),commands=0;
  try{
   await context.addInitScript(raw=>{if(!localStorage.getItem('garden-corn-qa')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('garden-corn-qa','1');}},raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url()}));
   await page.goto(server.base+'/play/');await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');await page.locator('#language').selectOption(locale);
   const exact=async()=>page.waitForFunction(raw=>localStorage.getItem('myfarmtwin.save.v1')===raw,serialize(expected));
   const send=async(type,selector,extra={})=>{await page.locator(selector).click();const r=dispatch(expected,{id:expected.revision+1,type,...extra});assert.ok(r.ok,type+': '+r.error);expected=r.state;commands++;await exact();};
   await exact();assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.before-garden.v5')),raw);
   await page.locator('[data-world-menu=market]').click();await send('buySeed','[data-buy-seed=corn]',{crop:'corn'});await page.locator('#close-market').click();
   await worldObject(page,'field.plot.0');await send('harvest','#harvest',{plot:0});
   await page.locator('#crop-choice').selectOption('corn');await send('plant','#plant',{plot:0,crop:'corn'});await page.keyboard.press('Escape');
   await page.evaluate(async()=>{const {Scene}=await import('/play/vendor/three/three.module.js');const original=Scene.prototype.onAfterRender;Scene.prototype.onAfterRender=function(renderer,scene,camera,...args){original.call(this,renderer,scene,camera,...args);window.__gardenScene=this;window.__gardenCamera=camera;};});
   const stages=[],seen=new Set();let days=0;
   while(true){
    const crop=expected.plots[0].crop;
    if(!seen.has(crop.stage)){
     await worldCamera(page,'field');for(let i=0;i<4;i++)await worldCamera(page,'in');
     if(await page.locator('#world-camera-tools').evaluate(d=>d.open))await page.locator('#world-camera-tools summary').click();
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
     const geometry=await page.evaluate(()=>{const g=window.__gardenScene.children.find(o=>o.userData.entityId==='field.plot.0');let minY=Infinity,maxY=-Infinity,vertices=0;g.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.getAttribute('position');vertices+=p.count;for(let i=0;i<p.count;i++){const v=o.position.clone().fromBufferAttribute(p,i);o.localToWorld(v);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);}});return{cropType:g.userData.cropType,stage:g.userData.cropStage,vertices,minY,maxY,leaves:g.children.filter(o=>o.userData.cropLeaf).length};});
     assert.equal(geometry.cropType,'corn');assert.equal(geometry.stage,crop.stage);assert.ok(geometry.vertices>100);
     if(crop.stage===4)assert.ok(geometry.maxY>=2&&geometry.maxY<=3);
     const path=`${qa}/${name}-corn-stage${crop.stage}.png`;await page.screenshot({path,fullPage:true});
     stages.push({stage:crop.stage,progress:crop.progress,geometry,path});seen.add(crop.stage);
    }
    if(crop.progress>=1)break;assert.ok(days++<30,'Bounded native corn days');
    if(expected.plots[0].soilWaterMm<30&&expected.plots[0].lastWaterTick!==expected.tick){
     if(expected.water<25){await page.locator('[data-world-menu=market]').click();await send('refill','#refill');await page.locator('#close-market').click();}
     await worldObject(page,'field.plot.0');await send('water','#water',{plot:0});await page.keyboard.press('Escape');
    }
    await send('nextDay','#next-day');
   }
   assert.deepEqual([...seen],[0,1,2,3,4]);
   const mature=serialize(expected);await writeFile(`${qa}/${name}-mature.json`,mature);
   await page.reload();await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');await exact();
   await worldObject(page,'field.plot.0');await send('harvest','#harvest',{plot:0});assert.equal(expected.inventory.at(-1).type,'corn');await page.keyboard.press('Escape');
   await page.locator('[data-world-menu=market]').click();const lot=expected.inventory.at(-1);await send('sell',`[data-sell="${lot.id}"]`,{lot:lot.id});await send('buySeed','[data-buy-seed=corn]',{crop:'corn'});await page.locator('#close-market').click();
   await worldObject(page,'field.plot.0');await page.locator('#crop-choice').selectOption('corn');await send('plant','#plant',{plot:0,crop:'corn'});await page.keyboard.press('Escape');
   let exportDownload='skipped-owner-instruction';
   if(process.env.QA_ALLOW_DOWNLOADS==='owner-authorized'){
    await openWorldSettings(page);if(!await page.locator('#data-tools').evaluate(d=>d.open))await page.locator('#data-tools summary').click();
    const [file]=await Promise.all([page.waitForEvent('download'),page.locator('#export-save').click()]);const exported=await readFile(await file.path(),'utf8');assert.equal(exported,serialize(expected));assert.deepEqual(deserialize(exported),expected);exportDownload='passed';
   }
   assert.deepEqual(deserialize(serialize(expected)),expected);
   report.profiles.push({name,commands,days,stages,paidCornLoop:true,originalArchived:true,exactStateLedgerAfterEveryCommand:true,matureReload:true,exportDownload,serializedRoundtrip:true,replant:true});console.log(JSON.stringify({name,commands,days,stages:[...seen],pass:true}));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();await server.close();await writeFile(`${qa}/corn.json`,JSON.stringify(report,null,2));}
