import {chromium} from 'playwright';
import {settledPage} from './settled-page.mjs';
import {startServer} from './serve.mjs';
import {cowQAFarm} from './cow-qa-farm.mjs';
import {serialize} from '../game/client/save-schema.js';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const qa=process.env.QA_DIR;await mkdir(qa,{recursive:true});
const fixture=serialize(cowQAFarm()),server=await startServer(0),base='http://127.0.0.1:'+server.address().port;
const {firefox}=await import(process.env.PLAYWRIGHT_SECONDARY_MODULE||'playwright');
const report={browsers:[],profiles:[],errors:[],limits:'Headless Chromium touch emulation and Firefox responsive layouts; not physical mobile or Safari.'};let browser;
try{for(const [name,launcher,path]of [['chromium',chromium,process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE],['firefox',firefox,process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE]]){
 if(process.env.COW_VISUAL_BROWSER&&process.env.COW_VISUAL_BROWSER!==name)continue;browser=await launcher.launch({headless:true,executablePath:path});report.browsers.push({name,version:browser.version()});
 for(const [width,height]of [[320,844],[360,780],[390,844],[844,390],[768,1024],[1024,800],[1440,1000]])for(const locale of ['en','id']){
  if(process.env.COW_VISUAL_WIDTH&&Number(process.env.COW_VISUAL_WIDTH)!==width)continue;const context=await browser.newContext({viewport:{width,height},...(name==='chromium'&&width<=390?{isMobile:true,hasTouch:true}:{})});context.setDefaultTimeout(15000);
  try{await context.addInitScript(raw=>{if(!localStorage.getItem('qa-cow-advanced')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('qa-cow-advanced','1');}},fixture);
   const page=settledPage(await context.newPage());page.on('pageerror',e=>report.errors.push(e.message));await page.goto(base+'/play/',{waitUntil:'networkidle'});await page.locator('#language').selectOption(locale);
   await page.locator('.skip-link').focus();assert.ok((await page.locator('.skip-link').boundingBox()).y>=0);await page.keyboard.press('Enter');await page.locator('#area-cow').focus();await page.keyboard.press('Enter');
   const raw=await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1'));assert.equal(await page.locator('[data-cow]').count(),3);
   for(let n=0;n<4;n++){await page.locator('[data-camera=right]').click();await page.locator('[data-choose-cow="cow.bought.1"]').focus();await page.keyboard.press('Enter');assert.match(await page.locator('#cow-heading').innerText(),/C/);await page.keyboard.press('Escape');assert.equal(await page.locator('[data-choose-cow="cow.bought.1"]').evaluate(e=>e===document.activeElement),true);}
   for(const e of await page.locator('[data-choose-cow],.camera-controls button').all()){const box=await e.boundingBox();assert.ok(box.width>=44-0.001&&box.height>=44-0.001,JSON.stringify({name,width,text:await e.innerText(),box}));assert.ok((await e.getAttribute('aria-label'))||(await e.innerText()).trim());}
   await page.locator('[data-choose-cow=barn]').click();await page.locator('#cow-lab summary').click();assert.equal(await page.locator('.cow-lab-rate').count(),3);assert.equal(await page.locator('.cow-lab-sample').count(),12);
   await page.locator('.cow-lab-table-wrap').focus();assert.ok(await page.locator('.cow-lab-table-wrap').getAttribute('aria-label'));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const skip=await page.locator('.skip-link').evaluate(e=>({bottom:e.getBoundingClientRect().bottom,focused:e===document.activeElement}));assert.equal(skip.focused,false);assert.ok(skip.bottom<=0);await page.locator('#cow-panel').screenshot({path:join(qa,`${name}-${width}-${locale}-lab.png`),style:'.skip-link:not(:focus-visible){visibility:hidden!important}'});await page.locator('#close-cow').click();
   await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.locator('.cow-motion').first().evaluate(e=>getComputedStyle(e).animationName),'none');await page.emulateMedia({reducedMotion:'no-preference'});await page.locator('#graphics').click();assert.equal(await page.locator('.cow-motion').first().evaluate(e=>getComputedStyle(e).animationName),'none');await page.locator('#graphics').click();
   await page.locator('#world').screenshot({path:join(qa,`${name}-${width}-${locale}-world.png`),style:'.skip-link:not(:focus-visible){visibility:hidden!important}'});
   await page.locator('#market-open').click();assert.equal(await page.locator('#market-dialog').evaluate(e=>e.tagName==='DIALOG'&&e.matches(':modal')),true);
   for(const selector of ['#cow-more-contracts','#cow-advanced-upgrades']){const details=page.locator(selector);if(await details.count()&&!await details.evaluate(e=>e.open))await details.locator('summary').click();}
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.doesNotMatch(await page.locator('#cow-market').innerText(),/undefined|NaN|cow[A-Z][A-Za-z]+/);
   await page.locator('#sell-cow-milk').scrollIntoViewIfNeeded();await page.locator('#market-dialog').screenshot({path:join(qa,`${name}-${width}-${locale}-market.png`),style:'.skip-link:not(:focus-visible){visibility:hidden!important}'});await page.keyboard.press('Escape');assert.equal(await page.locator('#market-dialog').isVisible(),false);
   assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);await page.reload();await page.locator('#area-cow').click();assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);
   report.profiles.push({name,width,height,locale,threeCowsAndAllUpgrades:true,keyboardSelectionFourRotations:true,focusReturns:true,min44px:true,labAccessibleRegion:true,reducedMotionAndLowGraphics:true,marketModal:true,noOverflow:true,exactSave:true});console.log(JSON.stringify(report.profiles.at(-1)));
  }finally{await context.close();}
 }await browser.close();browser=null;
}assert.equal(report.profiles.length,(process.env.COW_VISUAL_BROWSER?1:2)*(process.env.COW_VISUAL_WIDTH?1:7)*2);assert.deepEqual(report.errors,[]);
}finally{if(browser?.isConnected())await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'cow-visual.json'),JSON.stringify(report,null,2));}
