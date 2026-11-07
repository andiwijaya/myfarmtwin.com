import {chromium} from 'playwright';import {settledPage} from './settled-page.mjs';import {startServer} from './serve.mjs';
import {dispatch} from '../game/client/engine.js';import {serialize,deserialize} from '../game/client/save-schema.js';
import {readFile,mkdir,writeFile} from 'node:fs/promises';import {join} from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-picking');await mkdir(qa,{recursive:true});
const server=await startServer(0),base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}),report={profiles:[],errors:[],method:'Actual Three mesh raycasts and accessible HTML selection; isolated Chrome desktop / touch emulation. Complete state compared with the unchanged engine after every accepted command.'};
async function settle(page){for(let i=0;i<2;i++)await page.evaluate(async()=>{await navigator.locks.request('myfarmtwin.save.write',()=>{});await new Promise(resolve=>requestAnimationFrame(resolve));});}
try{
 for(const existing of [false,true])for(const mobile of [false,true])for(const locale of ['en','id']){
  const raw=await readFile('game/tests/fixtures/unified-world/v5-'+(existing?'mixed':'fresh')+'.json','utf8'),context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile});let expected=deserialize(raw);const commands=[];
  const act=(type,extra={})=>{const command={id:expected.revision+1,type,...extra},result=dispatch(expected,command);assert.ok(result.ok,type+':'+result.error);expected=result.state;commands.push(command);};
  try{
   await context.addInitScript(raw=>localStorage.setItem('myfarmtwin.save.v1',raw),raw);const page=settledPage(await context.newPage());page.on('pageerror',e=>report.errors.push(e.message));await page.goto(base+'/play/?world=unified-preview',{waitUntil:'networkidle'});await page.locator('#language').selectOption(locale);const host=page.locator('#unified-preview'),canvas=host.locator('canvas');
   const exact=async()=>{await settle(page);assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),serialize(expected));};
   async function hit(point,id){await canvas.scrollIntoViewIfNeeded();const pos=await page.evaluate(async point=>{const {createWorldCamera}=await import('/play/unified-world-camera.js'),host=document.querySelector('#unified-preview'),rect=host.querySelector('canvas').getBoundingClientRect(),c=createWorldCamera(),initial=c.view();c.rotate(Number(host.dataset.heading));c.pan(Number(host.dataset.panX)-initial.x,Number(host.dataset.panZ)-initial.z);c.zoomBy(Number(host.dataset.zoom));const p=c.project(point,rect.width/rect.height);return {x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(p.y+1)*rect.height/2};},point);if(mobile)await page.touchscreen.tap(pos.x,pos.y);else await page.mouse.click(pos.x,pos.y);await settle(page);assert.equal(await host.getAttribute('data-selected-entity'),id);}
   for(let heading=0;heading<4;heading++){
    await page.locator('[data-preview-camera=reset]').click();for(let i=0;i<heading;i++)await page.locator('[data-preview-camera=right]').click();
    const first=expected.mission.step===0;await hit({x:-6,y:.13,z:4},'field.plot.0');if(first)act('select',{plot:0});assert.equal(await page.locator('#plot-panel').isVisible(),true);await exact();
   }
   if(existing){await page.locator('#harvest').click();act('harvest',{plot:0});}else{await page.locator('#plant').click();act('plant',{plot:0,crop:'lettuce'});}await exact();await page.locator('#water').click();act('water',{plot:0});await exact();await page.locator('#close-plot').click();assert.equal(await page.evaluate(()=>document.activeElement.dataset.previewSelect),'field.plot.0');await exact();
   await page.locator('[data-preview-camera=reset]').click();await hit({x:5,y:2.3,z:0},'market.central');assert.equal(await page.locator('#market-dialog').isVisible(),true);await page.locator('#close-market').click();await exact();
   await page.locator('[data-preview-camera=chicken]').click();await exact();
   if(!existing){await hit({x:-5,y:1.43,z:-8},'chicken.available');await exact();assert.equal(await page.locator('[data-preview-select^="chicken.hen."]').count(),0);await page.locator('[data-preview-start-chicken]').dblclick();act('enterYard');await exact();assert.equal(expected.chicken.grants.length,1);assert.equal(await page.locator('[data-preview-start-chicken]').isVisible(),false);}
   await hit({x:-2,y:.52,z:-6},'chicken.feeder');assert.equal(await page.locator('#chicken-panel').isVisible(),true);await exact();
   assert.equal(await page.locator('#chicken-feed').isEnabled(),true);await page.locator('#chicken-feed').click();act('feedHens');await exact();await page.locator('#chicken-water').click();act('waterHens');await exact();
   const henId='chicken.hen.'+expected.chicken.hens[0].id;await hit({x:-5.96,y:.73,z:-4.88},henId);await exact();
   await page.locator('[data-preview-select="chicken.nest"]').focus();await page.keyboard.press('Enter');assert.equal(await host.getAttribute('data-selected-entity'),'chicken.nest');await exact();await page.locator('#close-chicken').click();assert.equal(await page.evaluate(()=>document.activeElement.dataset.previewSelect),'chicken.nest');await exact();
   await page.locator('[data-preview-select="field.plot.1"]').focus();await page.keyboard.press('Enter');assert.equal(await host.getAttribute('data-selected-entity'),'field.plot.1');await exact();
   await canvas.scrollIntoViewIfNeeded();const rect=await canvas.boundingBox(),selection=await host.getAttribute('data-selected-entity');await page.mouse.move(rect.x+rect.width*.5,rect.y+rect.height*.5);await page.mouse.down();await page.mouse.move(rect.x+rect.width*.5+80,rect.y+rect.height*.5+20,{steps:5});await page.mouse.up();assert.equal(await host.getAttribute('data-selected-entity'),selection);await exact();
   await host.screenshot({path:join(qa,`${existing?'mixed':'fresh'}-${mobile?'touch':'mouse'}-${locale}.png`)});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   report.profiles.push({existing,mobile,locale,meshHeadings:4,market:true,explicitEntryOnly:true,starterExactlyOnce:true,cropAndCareCommandsExact:true,stableHenId:true,keyboardSelection:true,dragDidNotSelect:true,commands});
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'picking.json'),JSON.stringify(report,null,2));}
