import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {settledPage} from './settled-page.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-chicken-navigation');await mkdir(qa,{recursive:true});
const server=process.env.BASE_URL?null:await startServer(0),base=process.env.BASE_URL||'http://127.0.0.1:'+server.address().port;
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}),report={base,surfaces:[],errors:[]},key='myfarmtwin.save.v1';
const raw=page=>page.evaluate(k=>localStorage.getItem(k),key),state=async page=>JSON.parse(await raw(page)).state;
async function rapid(page,selector){await page.evaluate(selector=>{const button=document.querySelector(selector);button.click();button.click();},selector);for(let i=0;i<3;i++)await page.evaluate(async()=>{await navigator.locks.request('myfarmtwin.save.write',()=>{});await new Promise(r=>requestAnimationFrame(r));});}
try{for(const mobile of [false,true])for(const locale of ['en','id']){const context=await browser.newContext({viewport:{width:mobile?390:1440,height:900},isMobile:mobile,hasTouch:mobile}),native=await context.newPage(),page=settledPage(native);try{
 page.on('pageerror',e=>report.errors.push(e.message));await page.goto(base+'/play/',{waitUntil:'networkidle'});await page.locator('#language').selectOption(locale);await page.locator('#area-chicken')[mobile?'tap':'click']();await page.locator('[data-choose-chicken=coop]')[mobile?'tap':'click']();for(const id of ['feed','water','clean'])await page.locator('#chicken-'+id)[mobile?'tap':'click']();await page.locator('#next-day')[mobile?'tap':'click']();
 await rapid(page,'#chicken-collect');let s=await state(page);assert.equal(s.chicken.stats.collected,2);assert.equal(s.chicken.coop.pending.length,0);assert.equal(s.chicken.inventory.reduce((n,l)=>n+l.quantity,0),2);
 await page.locator('#market-open')[mobile?'tap':'click']();await rapid(page,'[data-sell-egg]');s=await state(page);assert.equal(s.coins,151);assert.equal(s.chicken.stats.sold,2);assert.equal(s.ledger.filter(l=>l.type==='egg_sale').length,1);assert.equal(s.chicken.grants.filter(g=>g==='chicken.chapter1').length,1);
 await rapid(page,'#upgrade-coop');s=await state(page);assert.equal(s.chicken.coop.level,1);assert.equal(s.coins,61);assert.equal(s.ledger.filter(l=>l.type==='coop_upgrade').length,1);
 await rapid(page,'#buy-feed');s=await state(page);assert.equal(s.coins,13);assert.equal(s.chicken.feedStoreG,4000);assert.equal(s.ledger.filter(l=>l.type==='feed_purchase').length,2);await page.locator('#close-market')[mobile?'tap':'click']();
 const saved=await raw(page);await Promise.all([native.waitForURL(base+'/'),native.locator('[data-i18n=journal]')[mobile?'tap':'click']()]);assert.equal(await raw(page),saved);
 await page.goBack({waitUntil:'networkidle'});assert.equal(new URL(page.url()).pathname,'/play/');assert.equal(await raw(page),saved);await page.locator('#area-chicken')[mobile?'tap':'click']();assert.equal(await page.locator('[data-hen]').count(),2);assert.equal(await raw(page),saved);
 await page.goForward({waitUntil:'networkidle'});assert.equal(new URL(page.url()).pathname,'/');assert.equal(await raw(page),saved);await page.goBack({waitUntil:'networkidle'});await page.locator('#area-chicken')[mobile?'tap':'click']();assert.equal(await raw(page),saved);assert.equal((await state(page)).chicken.grants.filter(g=>g==='chicken.starter.v1').length,1);await page.screenshot({path:join(qa,'navigation-'+(mobile?'mobile':'desktop')+'-'+locale+'.png'),fullPage:true});
 report.surfaces.push({mobile,locale,rapidCollectOnce:true,rapidSaleRewardOnce:true,rapidUpgradeFundsSafe:true,twoIntentionalFeedPurchasesChargedTwice:true,backForwardExact:true,starterOnce:true});
 }finally{await context.close();}}assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));}finally{await browser.close();if(server)await new Promise(r=>server.close(r));await writeFile(join(qa,'navigation.json'),JSON.stringify(report,null,2));}
