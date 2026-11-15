import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {PerspectiveCamera,Vector3} from 'three';
import {createState,dispatch} from '../game/client/engine.js';
import {serialize,deserialize} from '../game/client/save-schema.js';
import {activateGarden} from '../game/client/active-garden.js';
import {cowSaleQuote} from '../game/client/cow-sales.js';
import {validatePrototypeLayout} from '../game/client/glb-prototype-state.js';
import {freezeArtifact,routeArtifact,browserEntry,observePage,openPrototype,protectedStore,nativeText,layoutValue,noOverflow,assertClean} from './glb-prototype-browser-helper.mjs';

// Offline, actual-artifact tests: no server, network exception, personal profile,
// upload, download, clipboard permission, or extension is required.
if(process.env.BASE_URL)throw Error('This journey is offline artifact QA, not a live transport test.');
const qa=resolve(process.env.QA_DIR||'qa-artifacts/glb-upgrade/journeys');await mkdir(qa,{recursive:true});
const artifact=await freezeArtifact();
const report={atUTC:new Date().toISOString(),artifact:artifact.proof,transport:'offline-artifact-request-fulfilment',profiles:[],scenarios:[],limits:['Actual dist bytes and dist/_headers are fulfilled offline; no live HTTP/CDN/network-latency claim.','Phone and tablet are browser emulation on the laptop, not physical-device GPU/FPS/thermal proof.','No upload/download or clipboard-permission tests.'],currentArtifactUnchanged:null};
const allProfiles=[{name:'desktop-id',width:1440,height:1000,locale:'id',touch:false},{name:'desktop-en',width:1440,height:900,locale:'en',touch:false},{name:'phone-id',width:390,height:844,locale:'id',touch:true},{name:'tablet-en',width:1024,height:768,locale:'en',touch:true}];
const profiles=process.env.GLB_JOURNEY_QUICK==='1'?allProfiles.slice(0,1):allProfiles;
let browser;
let currentPage;
let currentEntry;
const check=(entry,name)=>entry.checks.push(name);
const action=(page,name)=>page.locator('[data-action="'+name+'"]');
const readState=async page=>{const raw=await nativeText(page);return raw?deserialize(raw):createState();};

async function capture(page,entry,name){const path=join(qa,entry.name+'-'+name+'.png');await page.screenshot({path,fullPage:true});entry.captures.push(path);}
async function contextFor(entry,profile,{seed,layout,failModel}={}){
 const context=await browser.newContext({viewport:{width:profile.width,height:profile.height},hasTouch:profile.touch,isMobile:profile.touch,reducedMotion:'reduce'});
 await routeArtifact(context,artifact,entry,{failModel});
 await context.addInitScript(({locale,seed,layout})=>{localStorage.setItem('myfarmtwin.locale',locale);if(seed!==undefined&&localStorage.getItem('myfarmtwin.save.v1')===null)localStorage.setItem('myfarmtwin.save.v1',seed);if(layout!==undefined&&localStorage.getItem('myfarmtwin.glb.layout.v1')===null)localStorage.setItem('myfarmtwin.glb.layout.v1',layout);},{locale:profile.locale,seed,layout});
 return context;
}
function nativeOracle(state,type,args={}){const result=dispatch(state,{id:state.revision+1,type,...args});assert.equal(result.ok,true,'Native oracle rejected '+type+': '+result.error);return result.state;}
async function commandUI(page,name,type,args={}){
 const before=await readState(page),expected=nativeOracle(before,type,args);await action(page,name).click();
 await page.waitForFunction(revision=>{const raw=localStorage.getItem('myfarmtwin.save.v1');return raw&&JSON.parse(raw).state.revision===revision;},expected.revision,{timeout:10_000});
 assert.deepEqual(await readState(page),expected,'UI command differs from native '+type);return expected;
}
async function advanceUI(page,hours=6){
 let expected=await readState(page);const paused=expected.paused;for(const type of [...(paused?['pause']:[]),...Array(hours).fill('tick'),...(paused?['pause']:[])])expected=nativeOracle(expected,type);
 await page.locator('#advance').click();await page.waitForFunction(revision=>JSON.parse(localStorage.getItem('myfarmtwin.save.v1')).state.revision===revision,expected.revision,{timeout:10_000});assert.deepEqual(await readState(page),expected,'Player-controlled advance must match native ticks');return expected;
}
async function coordinates(page,x,z,rotation=0){await page.locator('#place-x').fill(String(x));await page.locator('#place-z').fill(String(z));await page.locator('#place-rotation').selectOption(String(rotation));}
async function placementConfirm(page){const before=await layoutValue(page);await page.locator('#placement-confirm').click();await page.waitForFunction(revision=>{const raw=localStorage.getItem('myfarmtwin.glb.layout.v1');return raw&&JSON.parse(raw).revision>revision;},before?.revision??-1,{timeout:10_000});await page.locator('#placement').waitFor({state:'hidden'});}
async function openCatalog(page,kind){await page.locator('#build-open').click();await action(page,'catalog-'+kind).click();await page.locator('#placement').waitFor({state:'visible'});}
/** Choose a known visible mesh using the documented garden camera framing.
 * This provides real mouse/touch ray-picking coverage, independent of the HTML
 * object list. The numeric camera setup only locates the click; native effects
 * and the selected bed are checked through the rendered UI/storage. */
async function pickFirstBed(page,profile){
 const box=await page.locator('#world canvas').boundingBox();assert.ok(box);const camera=new PerspectiveCamera(43,box.width/box.height,.08,150);camera.position.set(-1,12.5,11);camera.lookAt(-10,.5,-3);camera.updateMatrixWorld();
 const point=new Vector3(-15,.12,-7.5).project(camera),x=box.x+(point.x+1)*box.width/2,y=box.y+(1-point.y)*box.height/2;
 assert.ok(x>=0&&x<profile.width&&y>=0&&y<profile.height,'Known bed must be in the viewport for trusted picking');if(profile.touch)await page.touchscreen.tap(x,y);else await page.mouse.click(x,y);await page.waitForFunction(()=>/^Bed 1$/.test(document.querySelector('#care-content h2').textContent));
}

async function journey(profile){
 const entry=browserEntry(profile.name);Object.assign(entry,{profile});report.profiles.push(entry);currentEntry=entry;
 const context=await contextFor(entry,profile);
 try{
  const page=await context.newPage();currentPage=page;observePage(page,entry);await openPrototype(page);
  assert.equal(await page.locator('[data-plot]').count(),24);assert.equal(await nativeText(page),null);assert.equal(await layoutValue(page),null);check(entry,'fresh-open-exposes-24-beds-without-save-or-starter-grant');
  const emptyStore=await protectedStore(page);for(const view of ['garden','barn','interior','overview']){await page.locator('[data-view="'+view+'"]').click();for(const camera of ['left','right','in','out','back'])await page.locator('[data-camera="'+camera+'"]').click();}
  assert.deepEqual(await protectedStore(page),emptyStore);check(entry,'camera-and-interior-only-never-mutate-farm');await capture(page,entry,'overview');
  await page.locator('[data-view="garden"]').click();await pickFirstBed(page,profile);assert.deepEqual(await protectedStore(page),emptyStore);check(entry,'trusted-pointer-picks-a-visible-glb-bed-without-saving');await commandUI(page,'plant-lettuce','plant',{plot:0,crop:'lettuce'});await commandUI(page,'water','water',{plot:0});
  let advances=0;for(;advances<40;advances++){const state=await readState(page);if(state.plots[0].crop.progress>=1)break;await advanceUI(page);const next=await readState(page);if(next.plots[0].soilWaterMm<25&&next.plots[0].crop.progress<1){if(next.water<25)await commandUI(page,'refill','refill');await commandUI(page,'water','water',{plot:0});}}
  const mature=await readState(page);assert.equal(mature.plots[0].crop.progress,1,'Crop did not mature through native time');assert.ok(mature.tick>=48);assert.equal(mature.paused,true);await action(page,'focus-bed').click();await capture(page,entry,'garden-grown');
  await commandUI(page,'harvest','harvest',{plot:0});const lot=(await readState(page)).inventory[0];assert.ok(lot.quantity>0);await commandUI(page,'sell-'+lot.id,'sell',{lot:lot.id});assert.equal((await readState(page)).inventory.length,0);check(entry,'real-plant-water-grow-harvest-sale-matches-complete-native-state');
  for(const [crop,plot]of [['tomato',0],['corn',1]]){await commandUI(page,'seed-'+crop,'buySeed',{crop});await commandUI(page,'plant-'+crop,'plant',{plot,crop});if(crop==='tomato'){// Leave this crop growing and use a second bed for corn.
    await page.locator('[data-plot="1"]').click();
   }}
  check(entry,'seed-purchase-and-three-crop-model-families');
  // Move/cancel/rotate is presentation only, including funds and native geometry.
  await page.locator('[data-plot="0"]').click();const beforeMove=await protectedStore(page);await action(page,'move-bed').click();await coordinates(page,7,-4);assert.equal(await page.locator('#placement-confirm').isDisabled(),true);assert.match(await page.locator('#placement-valid').textContent(),/bertabrakan|overlap/i);assert.deepEqual(await protectedStore(page),beforeMove);
  await coordinates(page,22,18);assert.equal(await page.locator('#placement-confirm').isDisabled(),true);await page.locator('#placement-cancel').click();assert.deepEqual(await protectedStore(page),beforeMove);check(entry,'invalid-collision-outside-and-cancel-are-no-ops');
  const beforeNative=await nativeText(page);await action(page,'move-bed').click();await coordinates(page,-16,8,Math.PI/2);assert.equal(await page.locator('#placement-confirm').isEnabled(),true);await capture(page,entry,'builder');await placementConfirm(page);assert.equal(await nativeText(page),beforeNative);let layout=await layoutValue(page);assert.deepEqual(layout.items.find(p=>p.id==='bed.0'),{id:'bed.0',kind:'bed',x:-16,z:8,rotation:Math.PI/2});check(entry,'free-bed-move-and-rotation-preserve-complete-native-save');
  // Bounded decoration pieces have an honest free-kit label and no wallet debit.
  await page.locator('#build-open').click();assert.match(await action(page,'catalog-path').textContent(),/gratis|free/i);await action(page,'catalog-path').click();await coordinates(page,0,12);const beforeKit=await nativeText(page);await placementConfirm(page);assert.equal(await nativeText(page),beforeKit);layout=await layoutValue(page);assert.equal(layout.items.filter(p=>p.kind==='path').length,1);check(entry,'free-decoration-kit-placement-does-not-invent-or-charge-currency');
  // Buy a native pump through the builder: one actual transaction and placement.
  const beforePump=await readState(page),expectedPump=nativeOracle(beforePump,'buyPump');await openCatalog(page,'pump');await coordinates(page,16,12);await placementConfirm(page);assert.deepEqual(await readState(page),expectedPump);assert.equal(expectedPump.ledger.slice(beforePump.ledger.length).filter(l=>l.type==='facility_purchase').reduce((n,l)=>n+l.amount,0),-60);assert.equal((await layoutValue(page)).items.find(p=>p.id==='pump').x,16);check(entry,'native-pump-builder-debits-60-preserves-native-rewards-and-saves-position');
  await page.locator('[data-view="barn"]').click();await commandUI(page,'start-cow','enterCow');assert.equal((await readState(page)).cow.cows.length,2);await capture(page,entry,'barn-exterior');
  for(const [name,type]of [['feed-cows','feedCows'],['water-cows','waterCows'],['buy-feed','buyCowFeed'],['clean-barn','cleanCowBarn'],['clean-stand','cleanCowStand'],['clean-can','cleanCowCan']])await commandUI(page,name,type);
  await commandUI(page,'milk-0','milkCow',{cowId:'cow.starter.a',cowStorage:'can'});const milkState=await readState(page),milkIds=milkState.cow.lots.map(l=>l.id);assert.equal(milkState.cow.lots[0].remainingVolumeMl,4000);await commandUI(page,'sell-milk','sellCowMilk',{cowLots:milkIds,cowOrder:'',cowQuote:cowSaleQuote(milkState,milkIds)});assert.equal((await readState(page)).cow.soldMilkMl,4000);check(entry,'explicit-cow-start-care-milking-and-quoted-sale-match-native-state');
  await page.locator('[data-view="interior"]').click();await capture(page,entry,'interior');await action(page,'focus-cow.starter.a').click();await capture(page,entry,'cow-close');
  const herdBeforeMove=await nativeText(page);await action(page,'move-barn').click();await coordinates(page,9,8,Math.PI/2);await placementConfirm(page);assert.equal(await nativeText(page),herdBeforeMove);await page.locator('[data-view="interior"]').click();check(entry,'moved-and-rotated-barn-retains-native-herd-and-production');
  // Native + sidecar backup is text only. Confirmation itself is read-only.
  await page.locator('#data-open').click();await page.locator('#export-data').click();const backup=await page.locator('#save-text').inputValue(),parsed=JSON.parse(backup);assert.deepEqual(deserialize(parsed.native),await readState(page));assert.deepEqual(validatePrototypeLayout(parsed.layout),await layoutValue(page));const exportedStore=await protectedStore(page);await page.locator('#import-data').click();assert.deepEqual(await protectedStore(page),exportedStore);await page.locator('#data-dialog .dialog-heading button').click();assert.deepEqual(await protectedStore(page),exportedStore);check(entry,'text-backup-complete-and-cancelled-import-confirmation-is-read-only');
  await page.locator('[data-view="garden"]').click();await page.locator('[data-plot="0"]').click();await action(page,'move-bed').click();await coordinates(page,-18,10,0);await placementConfirm(page);assert.notDeepEqual(await layoutValue(page),parsed.layout);
  await page.locator('#data-open').click();await page.locator('#save-text').fill(backup);await page.locator('#import-data').click();await page.locator('#import-data').click();await page.waitForFunction(expected=>localStorage.getItem('myfarmtwin.glb.layout.v1')===expected,JSON.stringify(parsed.layout),{timeout:10_000});assert.deepEqual(await readState(page),deserialize(parsed.native));assert.deepEqual(await layoutValue(page),parsed.layout);check(entry,'confirmed-text-import-restores-complete-native-and-layout-data');
  const beforeBad=await protectedStore(page);await page.locator('#save-text').fill('{"untrusted":true}');await page.locator('#import-data').click();await page.locator('#import-data').click();await page.waitForFunction(()=>/tidak valid|invalid/i.test(document.querySelector('#data-status').textContent));assert.deepEqual(await protectedStore(page),beforeBad);await page.locator('#data-dialog .dialog-heading button').click();check(entry,'invalid-text-import-preserves-all-protected-storage');
  const beforeReload=await protectedStore(page);await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>document.body.dataset.prototypeReady==='true');assert.deepEqual(await protectedStore(page),beforeReload);assert.equal((await readState(page)).cow.cows.length,2);assert.equal((await readState(page)).plots.length,24);assert.deepEqual(await layoutValue(page),parsed.layout);check(entry,'reload-preserves-herd-all-24-beds-economy-and-layout-without-duplicate-grants');
  await noOverflow(page);assert.equal(await page.locator('[data-plot]').count(),24);entry.render=await page.locator('#world').evaluate(el=>({...el.dataset}));const modelResponses=Object.keys(entry.resources).filter(p=>p.endsWith('.glb'));assert.equal(modelResponses.length,9);assert.ok(modelResponses.every(p=>entry.resources[p].contentType==='model/gltf-binary'));check(entry,'all-nine-glb-assets-load-and-responsive-view-has-no-overflow');await assertClean(entry);entry.completed=true;console.log(profile.name+': '+entry.checks.length+' journey groups PASS');
 }finally{if(currentPage&&!entry.completed)try{await capture(currentPage,entry,'failure');}catch{/* Preserve the original assertion failure. */}await context.close();currentPage=null;}
}

async function legacyScenario(name){
 const entry=browserEntry('legacy-'+name.replace('.json',''));report.scenarios.push(entry);currentEntry=entry;const raw=await readFile(resolve('game/tests/fixtures/unified-world',name),'utf8'),baseline=activateGarden(deserialize(raw)),context=await contextFor(entry,allProfiles[0],{seed:raw});
 try{const page=await context.newPage();currentPage=page;observePage(page,entry);await openPrototype(page);assert.equal(await nativeText(page),raw);assert.equal(await page.locator('[data-plot]').count(),24);const before=await protectedStore(page);for(const view of ['garden','interior','barn','overview'])await page.locator('[data-view="'+view+'"]').click();assert.deepEqual(await protectedStore(page),before);check(entry,'frozen-legacy-camera-only-preserves-exact-original-bytes');
  const expected=nativeOracle(baseline,'pause');await page.locator('#pause').click();await page.waitForFunction(revision=>JSON.parse(localStorage.getItem('myfarmtwin.save.v1')).state.revision===revision,expected.revision);assert.deepEqual(await readState(page),expected);const storage=await protectedStore(page);assert.equal(storage['myfarmtwin.save.before-glb-prototype.v1'],raw);assert.equal(storage['myfarmtwin.save.backup.v1'],raw);assert.equal(expected.plots.length,24);for(const field of ['chicken','goat','cow','fish','inventory','coins'])assert.deepEqual(expected[field],baseline[field]);check(entry,'first-native-action-migrates-all-24-beds-and-archives-source-exactly');await assertClean(entry);entry.completed=true;console.log(entry.name+': PASS');
 }finally{if(currentPage&&!entry.completed)try{await capture(currentPage,entry,'failure');}catch{/* Preserve the original assertion failure. */}await context.close();currentPage=null;}
}

async function conflictScenario(){
 const entry=browserEntry('stale-multi-tab');report.scenarios.push(entry);currentEntry=entry;const seed=serialize(createState()),context=await contextFor(entry,allProfiles[0],{seed});
 try{const first=await context.newPage(),second=await context.newPage();currentPage=first;observePage(first,entry);observePage(second,entry);await openPrototype(first);await openPrototype(second);await second.locator('[data-plot="0"]').click();await commandUI(second,'plant-lettuce','plant',{plot:0,crop:'lettuce'});const accepted=await nativeText(second);await first.waitForFunction(()=>/tab lain|another tab/.test(document.querySelector('#save-status').textContent));await first.locator('[data-plot="1"]').click();assert.equal(await action(first,'plant-lettuce').isDisabled(),true);assert.equal(await nativeText(first),accepted);check(entry,'stale-native-tab-is-blocked-with-latest-save-preserved');
  await first.reload({waitUntil:'networkidle'});await first.waitForFunction(()=>document.body.dataset.prototypeReady==='true');await second.locator('[data-action="move-bed"]').click();await coordinates(second,-16,8,0);await placementConfirm(second);const acceptedLayout=await layoutValue(second);await first.waitForFunction(()=>/tab lain|another tab/.test(document.querySelector('#save-status').textContent));assert.equal(await nativeText(first),accepted);assert.deepEqual(await layoutValue(first),acceptedLayout);await first.locator('[data-plot="1"]').click();assert.equal(await action(first,'plant-lettuce').isDisabled(),true);check(entry,'stale-layout-tab-also-blocks-native-actions');await assertClean(entry);entry.completed=true;console.log(entry.name+': PASS');
 }finally{if(currentPage&&!entry.completed)try{await capture(currentPage,entry,'failure');}catch{/* Preserve the original assertion failure. */}await context.close();currentPage=null;}
}

async function failureScenario(){
 const entry=browserEntry('model-failure-and-retry');report.scenarios.push(entry);currentEntry=entry;const seed=await readFile(resolve('game/tests/fixtures/unified-world/v5-mixed.json'),'utf8');let fail=true;const context=await contextFor(entry,allProfiles[0],{seed,failModel:path=>fail&&path.endsWith('/cow.glb')});
 try{const page=await context.newPage();currentPage=page;observePage(page,entry);await openPrototype(page,{expected:'error'});assert.equal(await page.locator('#retry').isVisible(),true);assert.equal(await nativeText(page),seed);const before=await protectedStore(page);assert.equal(await page.locator('[data-plot]').count(),24);check(entry,'missing-glb-shows-explicit-retry-and-keeps-native-save');
  assert.equal(entry.errors.length,0,'Failure must be caught by the application');assert.equal(entry.unexpectedRequests.length,0);entry.expectedConsoleErrors=entry.consoleErrors.splice(0);entry.expectedFailedRequests=entry.failedRequests.splice(0);fail=false;await page.locator('#retry').click();await page.waitForFunction(()=>document.body.dataset.prototypeReady==='true',null,{timeout:45_000});assert.deepEqual(await protectedStore(page),before);assert.equal(await page.locator('#loading').isHidden(),true);check(entry,'retry-loads-model-without-reset-or-silent-replacement');await assertClean(entry);entry.completed=true;console.log(entry.name+': PASS');
 }finally{if(currentPage&&!entry.completed)try{await capture(currentPage,entry,'failure');}catch{/* Preserve the original assertion failure. */}await context.close();currentPage=null;}
}

try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const profile of profiles)await journey(profile);
 if(process.env.GLB_JOURNEY_QUICK!=='1'){for(const fixture of ['v0-fresh.json','v5-mixed.json'])await legacyScenario(fixture);await conflictScenario();await failureScenario();}
 report.currentArtifactUnchanged=await artifact.current();if(!report.currentArtifactUnchanged){report.acceptance='exploratory-current-artifact-changed';throw Error('Build receipt or headers changed while the frozen-artifact journey ran. Preserve results as exploratory and rerun on the final artifact.');}
 report.acceptance='passed';
}catch(error){report.failure=String(error.stack||error);if(currentPage){try{await capture(currentPage,currentEntry||browserEntry('failure'),'failure');}catch{/* Page may have been disposed by the failing scenario. */}}throw error;}
finally{await browser?.close();report.currentArtifactUnchanged??=await artifact.current();report.finishedAtUTC=new Date().toISOString();report.checkGroups=report.profiles.concat(report.scenarios).reduce((n,p)=>n+p.checks.length,0);await writeFile(join(qa,'report.json'),JSON.stringify(report,null,2));}
console.log('GLB prototype journeys: '+report.checkGroups+' groups PASS.');
