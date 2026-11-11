import assert from 'node:assert/strict';import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {gardenQATarget} from './garden-qa-target.mjs';
import {worldObject,worldCamera} from './unified-shell-ui.mjs';
import {createState,dispatch} from '../game/client/engine.js';
import {deserialize,serialize} from '../game/client/save-schema.js';
import {activateGarden} from '../game/client/active-garden.js';
const qa=process.env.QA_DIR||'qa-artifacts/garden/active-local';await mkdir(qa,{recursive:true});
const v5=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),v6=serialize(deserialize(v5)),target=await gardenQATarget();let browser;
const report={base:target.base,live:target.live,profiles:[],errors:[],consoleErrors:[],failedRequests:[],downloadTests:'skipped-owner-instruction',scope:'Fresh, frozen V5 and already-published V6 player entry. No fixture plot grants before load; all 24 beds must be owned immediately. Existing native values and original archives remain exact.'};
try{browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const mobile of [false,true])for(const [mode,raw] of [['fresh',null],['old-v5',v5],['published-v6',v6]]){
  const name=`${mobile?'phone-id':'desktop-en'}-${mode}`,context=await browser.newContext({viewport:mobile?{width:390,height:844}:{width:1440,height:1000},isMobile:mobile,hasTouch:mobile,reducedMotion:'reduce'});let expected=raw?activateGarden(deserialize(raw)):createState();
  try{await context.addInitScript(({raw,v5})=>{if(!localStorage.getItem('qa-active-beds')){if(raw){localStorage.setItem('myfarmtwin.save.v1',raw);if(JSON.parse(raw).saveVersion===6)localStorage.setItem('myfarmtwin.save.before-garden.v5',v5);}localStorage.setItem('qa-active-beds','1');}},{raw,v5});const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url()}));
   await page.goto(target.base+'/play/');await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');await page.locator('#language').selectOption(mobile?'id':'en');
   const exact=async()=>{try{await page.waitForFunction(raw=>localStorage.getItem('myfarmtwin.save.v1')===raw,serialize(expected),{timeout:5000});}catch(e){report.mismatch={name,expected:serialize(expected),actual:await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1'))};await page.screenshot({path:qa+'/mismatch.png',fullPage:true});throw e;}};await exact();assert.equal(expected.plots.length,24);
   assert.equal(await page.locator('[data-preview-select^="field.plot."]').count(),24);
   if(raw){assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.before-active-garden')),raw);assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.before-garden.v5')),v5);const old=deserialize(raw);assert.deepEqual({...expected,plots:expected.plots.slice(0,old.plots.length)},old);}
   await worldCamera(page,'field');await page.screenshot({path:`${qa}/${name}-immediate-24.png`,fullPage:true});
   let commands=0;if(expected.seeds.lettuce===0){await page.locator('[data-world-menu=market]').click();await page.locator('[data-buy-seed=lettuce]').click();const bought=dispatch(expected,{id:expected.revision+1,type:'buySeed',crop:'lettuce'});assert.ok(bought.ok);expected=bought.state;commands++;await exact();await page.locator('#close-market').click();}
   await worldObject(page,'field.plot.23');if(expected.mission.step===0){const selected=dispatch(expected,{id:expected.revision+1,type:'select',plot:23});assert.ok(selected.ok);expected=selected.state;commands++;await exact();}await page.locator('#crop-choice').selectOption('lettuce');
   for(const [type,selector] of [['plant','#plant'],['water','#water']]){await page.locator(selector).click();const r=dispatch(expected,{id:expected.revision+1,type,plot:23,crop:'lettuce'});assert.ok(r.ok);expected=r.state;await exact();}
   await page.keyboard.press('Escape');await page.reload();await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');await exact();assert.equal(expected.plots[23].crop.type,'lettuce');
   report.profiles.push({name,immediateActiveBeds:24,lastBedPlantWater:true,commands:commands+2,originalValuesAndArchivesExact:true,reloadExact:true});console.log(JSON.stringify(report.profiles.at(-1)));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();await target.close();await writeFile(`${qa}/active-beds.json`,JSON.stringify(report,null,2));}
