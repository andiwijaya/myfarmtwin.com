import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {settledPage} from './settled-page.mjs';
import {startServer} from './serve.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {deserialize} from '../game/client/save-schema.js';

const root=process.env.FISH_ROLLBACK_ROOT,qa=process.env.QA_DIR;
assert.ok(root&&qa&&process.env.FISH_STRESS_FIXTURE);
await mkdir(qa,{recursive:true});
const fixture=await readFile(process.env.FISH_STRESS_FIXTURE,'utf8'),original=await readFile('game/tests/fixtures/fish-v4/mixed.json','utf8'),first=deserialize(fixture),onFeatures=await readFile('dist/play/features.js','utf8');
assert.match(onFeatures,/\bfish\s*:\s*true\b/);
assert.match(await readFile(join(root,'play/features.js'),'utf8'),/\bfish\s*:\s*false\b/);
const server=await startServer(0,root),base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
const report={profiles:[],errors:[],external:[],scope:'Isolated canonicalV5 flagOFF artifact -> same-origin flagON reactivation. No production publication or owner data.'};
const primary='myfarmtwin.save.v1',backup='myfarmtwin.save.backup.v1',archive='myfarmtwin.save.before-fish.v4';
const ids=s=>({hens:s.chicken.hens.map(x=>x.id),goats:s.goat.herd.map(x=>x.id),cows:s.cow.cows.map(x=>x.id),fish:s.fish.ponds.map(p=>p.cohorts.map(x=>x.id))});
try{
 for(const mobile of [false,true])for(const locale of ['en','id']){
  const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile});
  await context.addInitScript(({fixture,original,primary,backup,archive})=>{if(!localStorage.getItem('qa-v5-rollback')){localStorage.setItem(primary,fixture);localStorage.setItem(backup,fixture);localStorage.setItem(archive,original);localStorage.setItem('qa-v5-rollback','1');}},{fixture,original,primary,backup,archive});
  const page=settledPage(await context.newPage());page.on('pageerror',e=>report.errors.push(e.message));page.on('request',r=>{if(!r.url().startsWith(base+'/'))report.external.push(r.url());});
  const raw=()=>page.evaluate(k=>localStorage.getItem(k),primary);
  try{
   await page.goto(base+'/play/',{waitUntil:'networkidle'});await page.locator('#language').selectOption(locale);
   assert.equal(await page.locator('#area-fish').isVisible(),false);assert.equal(await raw(),fixture);
   await page.locator('#area-cow').click();await page.locator('#next-day').click();
   const offRaw=await raw(),off=deserialize(offRaw);assert.equal(off.saveVersion,5);assert.equal(off.tick,first.tick+24);assert.deepEqual(off.fish,first.fish);assert.deepEqual(ids(off),ids(first));
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),backup),fixture);assert.equal(await page.evaluate(k=>localStorage.getItem(k),archive),original);
   await page.reload({waitUntil:'networkidle'});assert.equal(await raw(),offRaw);
   await page.route('**/features.js',route=>route.fulfill({contentType:'text/javascript',body:onFeatures}));
   await page.reload({waitUntil:'networkidle'});assert.equal(await raw(),offRaw);assert.equal(await page.locator('#area-fish').isVisible(),true);
   await page.locator('#area-fish').click();assert.deepEqual(deserialize(await raw()).fish,first.fish,'Reactivation must not repeat the starter or catch up OFF hours');
   await page.locator('#next-day').click();const onRaw=await raw(),on=deserialize(onRaw);assert.equal(on.tick,off.tick+24);assert.deepEqual(ids(on),ids(first));
   for(const p of on.fish.ponds){assert.equal(p.history.filter(h=>h.tick>off.tick&&h.tick<=on.tick).length,24);assert.equal(p.history.some(h=>h.tick>first.tick&&h.tick<=off.tick),false);}
   assert.equal(await page.evaluate(k=>localStorage.getItem(k),backup),offRaw);assert.equal(await page.evaluate(k=>localStorage.getItem(k),archive),original);
   await page.reload({waitUntil:'networkidle'});assert.equal(await raw(),onRaw);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   if(locale==='id')await page.locator('#world').screenshot({path:join(qa,'reactivated-'+(mobile?'mobile':'desktop')+'.png')});
   report.profiles.push({mobile,locale,offFishHidden:true,off24OldAreaHoursFishExact:true,schemaV5Preserved:true,backupAndOriginalV4ArchiveExact:true,onStarterNotRepeated:true,on24HoursNoOffCatchup:true,allCompanionCohortIdsExact:true,reloadExact:true,noOverflow:true});
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.external,[]);await writeFile(join(qa,'rollback.json'),JSON.stringify(report,null,2));console.log('PASS4actual V5 OFF/ON rollback-reactivation browser profiles',JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));}
