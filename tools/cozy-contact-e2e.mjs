import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {worldCamera,worldObject} from './unified-shell-ui.mjs';
import {visibleSpritePoint,settleWorldProjection} from './unified-sprite-point.mjs';
import {touchPoint} from './unified-touch-point.mjs';
import {makeFullWorldFarm} from './unified-full-farm.mjs';
import {readWorldSnapshot} from '../game/client/unified-world-model.js';
import {chickenSnapshot} from '../game/client/chicken-snapshot.js';
import {goatSnapshot} from '../game/client/goat-scene-snapshot.js';
import {cowSnapshot} from '../game/client/cow-scene-snapshot.js';
import {fishSnapshot} from '../game/client/fish-snapshot.js';
import {contactHeight} from '../game/client/unified-world-contact.js';
import {contactPixels} from '../game/client/unified-cozy-contact.js';

// This is a coordinated, disposable browser test, never a user's saved profile.
assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');
const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');
assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&end>Date.now()&&end-Date.now()<=15*60_000,'Current coordinated deadline required');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex'),qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/contact';
const profiles=[false,true].flatMap(mobile=>['en','id'].map(locale=>({mobile,locale,name:`${mobile?'mobile':'desktop'}-${locale}-three`})));
const selected=process.env.COZY_CONTACT_PROFILES?.split(',');
if(selected){assert.equal(new Set(selected).size,selected.length);for(const name of selected)assert.ok(profiles.some(p=>p.name===name),'Unknown contact profile '+name);}
const farm=makeFullWorldFarm(await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'));
assert.equal(farm.state.paused,true,'Contact-only QA must not run the native simulation clock');
const snapshot=readWorldSnapshot(farm.state,{chicken:chickenSnapshot(farm.state),goat:goatSnapshot(farm.state),cow:cowSnapshot(farm.state),fish:{snapshot:fishSnapshot(farm.state),feederIds:[]}});
const species={henSprite:{zone:'chicken',art:'chicken'},goatSprite:{zone:'goat',art:'goat'},cowSprite:{zone:'cow',art:'cow'},fishSchoolSprite:{zone:'fish',art:'fish'}},models={};
for(const {art} of Object.values(species)){
 models[art]=hash((await readFile(`tools/art/${art}.mjs`,'utf8')).replaceAll('\r\n','\n'));
 for(const lod of ['high','low'])assert.equal(JSON.parse(await readFile(`dist/play/assets/world/${art}.${lod}.json`,'utf8')).source.modelSha256,models[art],'Current rig must match the built atlas');
}
await mkdir(qa,{recursive:true});
await writeFile(qa+'/native-preparation.json',JSON.stringify({raw:farm.raw,commands:farm.commands,funding:farm.funding},null,2));
const report={receiptSHA256:hash(JSON.stringify(JSON.parse(await readFile('dist/play/build-info.json','utf8')))),fixtureSHA256:hash(farm.raw),modelSHA256:models,selectedProfiles:selected||null,profiles:[],errors:[],consoleErrors:[],scope:(selected?'Explicit subset; not a fresh full four-profile matrix. ':'')+'Four species/four headings, real frontmost opaque-ray picks from a different selection, native feet and current radial contact-AO at forced High, exact paused native save. Mobile also checks a real 20 CSS-pixel silhouette miss within the production 22px alpha-aware reach. Still/reduced-motion geometry only; animation activity coverage is separate. Isolated Windows headless touch emulation, not physical Android/performance/loading.'};
assert.ok(Date.now()<end,'Slot expired during native fixture preparation');
const server=await startServer(0,undefined,{assetCompression:true,assetCache:true});let browser=null,timer=null,expired=false;
try{
 browser=await chromium.launch({headless:true,timeout:Math.min(30000,end-Date.now()),executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 timer=setTimeout(()=>{expired=true;void browser.close();},Math.max(0,end-Date.now()));
 for(const {mobile,locale,name} of profiles.filter(p=>!selected||selected.includes(p.name))){
  assert.ok(Date.now()<end,'Slot expired');
  const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:1,reducedMotion:'reduce'}),details=[];
  report.activeProfile={name,details};
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaIntervals=0;const set=window.setInterval.bind(window);window.setInterval=(...args)=>{window.__qaIntervals++;return set(...args);};},farm.raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);await page.locator('#language').selectOption(locale);
   await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.renderer==='three'&&d.controlsReady==='true'&&Number(d.spriteActors)>0&&d.spriteActors===d.spriteReady;});
   await page.evaluate(async()=>{const{Scene}=await import('/play/vendor/three/three.module.js'),after=Scene.prototype.onAfterRender;window.__qaScenes=new Set();window.__qaCameras=new Set();Scene.prototype.onAfterRender=function(renderer,...args){after.call(this,renderer,...args);window.__qaScene=this;window.__qaCamera=args[1];window.__qaScenes.add(this);window.__qaCameras.add(args[1]);};window.__qaCanvas=document.querySelector('#world canvas');});
   await page.locator('select[data-world-quality]').selectOption('high');await worldCamera(page,'fit');
   await page.waitForFunction(()=>{let count=0,ok=true;window.__qaScene?.traverse(o=>{const m=o.userData.atlas?.asset?.meta;if(m){count++;if(m.lod!=='high')ok=false;}});return count>0&&ok;});
   const host=page.locator('#unified-preview'),canvas=page.locator('#world canvas');
   const exact=async()=>{
    assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),farm.raw,'Camera/picking must not write native state');
    assert.deepEqual(await page.evaluate(()=>({scenes:window.__qaScenes.size,cameras:window.__qaCameras.size,intervals:window.__qaIntervals,canvas:window.__qaCanvas===document.querySelector('#world canvas')})),{scenes:1,cameras:1,intervals:1,canvas:true});
    assert.equal(await canvas.count(),1);assert.equal(await page.locator('#world svg').count(),0);assert.equal(await host.getAttribute('data-sprite-errors'),'0');assert.equal(await host.getAttribute('data-animated-entities'),'0');
   };
   const close=async()=>{for(const zone of ['chicken','goat','cow','fish','market']){const button=page.locator('#close-'+zone);if(await button.isVisible())await button.click();}};
   const frame=async(zone,heading)=>{await worldCamera(page,'reset');for(let i=0;i<heading;i++)await worldCamera(page,'right');await worldCamera(page,zone);for(let i=0;i<6;i++)await worldCamera(page,'in');await canvas.scrollIntoViewIfNeeded();await settleWorldProjection(page);};
   const neutral=async()=>{await close();await worldObject(page,'market.central');await close();assert.equal(await host.getAttribute('data-selected-entity'),'market.central');};
   for(let heading=0;heading<4;heading++)for(const [kind,{zone,art}] of Object.entries(species)){
    assert.ok(Date.now()<end,'Slot expired');await neutral();await frame(zone,heading);
    const ids=await page.evaluate(kind=>{const ids=new Set();window.__qaScene.traverseVisible(o=>{if(o.isSprite&&o.userData.kind===kind)ids.add(o.userData.entityId);});return[...ids];},kind);
    let point=null,id=null;
    for(const candidate of ids){point=await visibleSpritePoint(page,candidate);if(point){id=candidate;break;}}
    assert.ok(id&&point,`${name} ${kind} heading${heading}: no frontmost opaque pixel`);
    assert.notEqual(await host.getAttribute('data-selected-entity'),id,'Pick must change the selected entity');
    if(mobile)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
    assert.equal(await host.getAttribute('data-selected-entity'),id);await settleWorldProjection(page);
    const visual=await page.evaluate(async({id,kind})=>{
     const{Vector3}=await import('/play/vendor/three/three.module.js');let actor,shadow,marker;window.__qaScene.traverse(o=>{if(o.isSprite&&o.userData.entityId===id&&!actor)actor=o;if(o.parent?.userData.contactShadows&&o.userData.entityId===id)shadow=o;if(o.userData.selectionMarker)marker=o;});
     const material=actor.material,m=actor.userData.atlas.asset.meta;return{position:actor.getWorldPosition(new Vector3()).toArray(),scale:actor.getWorldScale(new Vector3()).x,worldUnits:m.worldUnits,model:m.source.modelSha256,lod:m.lod,stage:actor.userData.stage,action:actor.userData.action,actorHeading:actor.userData.actorHeading,direction:actor.userData.direction,frame:actor.userData.frame,pivot:actor.center.toArray(),alphaTest:material.alphaTest,transparent:material.transparent,depthWrite:material.depthWrite,marker:{visible:marker.visible,position:marker.position.toArray()},shadow:shadow?{position:shadow.position.toArray(),visible:shadow.visible,children:shadow.children.map(o=>({contactAo:o.userData.contactAo,pickThrough:o.userData.pickThrough,opacity:o.material.opacity,color:o.material.color.getHexString(),transparent:o.material.transparent,depthWrite:o.material.depthWrite,width:o.material.map.image.width,height:o.material.map.image.height,pixels:Array.from(o.material.map.image.data)}))}:null};
    },{id,kind});
    assert.equal(visual.model,models[art]);assert.equal(visual.lod,'high');assert.equal(visual.direction,((heading-visual.actorHeading)%4+4)%4);assert.equal(visual.frame,0);
    assert.equal(visual.alphaTest,.08);assert.equal(visual.transparent,true);assert.equal(visual.depthWrite,false);
    const native=snapshot.entities.find(e=>e.id===id);assert.ok(native,'Stable native entity');assert.equal(visual.scale,visual.worldUnits*(native.scale||1));
    if(zone==='fish'){assert.equal(visual.position[1],.27);assert.equal(visual.shadow,null);}
    else{
     assert.ok(Math.abs(visual.position[1]-contactHeight({x:visual.position[0],z:visual.position[2]},snapshot.entities))<1e-7,'Feet must match the actual owned surface');
     assert.equal(visual.shadow.visible,true);assert.equal(visual.shadow.position[0],visual.position[0]);assert.equal(visual.shadow.position[2],visual.position[2]);assert.ok(Math.abs(visual.shadow.position[1]-visual.position[1]-.004)<1e-10);
     assert.equal(visual.shadow.children.length,1);const pad=visual.shadow.children[0];assert.equal(pad.contactAo,true);assert.equal(pad.pickThrough,true);assert.equal(pad.opacity,.27);assert.equal(pad.transparent,true);assert.equal(pad.depthWrite,false);assert.equal(pad.width,32);assert.equal(pad.height,32);assert.deepEqual(pad.pixels,Array.from(contactPixels()));
     assert.equal(visual.marker.visible,true);assert.equal(visual.marker.position[0],visual.position[0]);assert.equal(visual.marker.position[2],visual.position[2]);assert.ok(Math.abs(visual.marker.position[1]-visual.position[1]-.006)<1e-10);
    }
    await exact();const path=`${qa}/${name}-${zone}-h${heading}.png`;await canvas.screenshot({path});
    let reach=null;
    if(mobile){
     await neutral();await frame(zone,heading);reach=await touchPoint(page,id);assert.ok(reach,`Visible 20px silhouette miss for ${name} ${kind} heading${heading}`);assert.equal(reach.opaqueMissPixels,20);
     assert.equal(await page.evaluate(({x,y})=>document.elementFromPoint(x,y)===document.querySelector('#world canvas'),reach),true,'Expanded tap must hit the visible canvas');
     assert.notEqual(await host.getAttribute('data-selected-entity'),id);await page.touchscreen.tap(reach.x,reach.y);assert.equal(await host.getAttribute('data-selected-entity'),id);await exact();
    }
    // Store a digest instead of repeating 4096 AO bytes in every report frame.
    if(visual.shadow)for(const pad of visual.shadow.children){pad.pixelSHA256=hash(Buffer.from(pad.pixels));delete pad.pixels;}
    details.push({heading,kind,id,point,reach,visual,path});
   }
   assert.equal(details.length,16);report.profiles.push({name,picks:details.length,expandedPicks:details.filter(d=>d.reach).length,details,wholeSaveExact:true,oneOriginalSceneCameraInterval:true});report.activeProfile=null;
   await writeFile(qa+'/partial.json',JSON.stringify(report,null,2));console.log(JSON.stringify({name,picks:details.length,expandedPicks:details.filter(d=>d.reach).length,pass:true}));
  }finally{await context.close();}
 }
 assert.equal(report.profiles.length,selected?.length||4);assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.equal(expired,false);
}catch(error){report.failure=String(error.stack||error);throw error;}
finally{if(timer)clearTimeout(timer);try{await browser?.close();}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await writeFile(qa+'/contact.json',JSON.stringify({...report,slotExpired:expired},null,2));}}
