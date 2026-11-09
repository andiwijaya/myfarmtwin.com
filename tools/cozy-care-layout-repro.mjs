import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {makeFullWorldFarm} from './unified-full-farm.mjs';
import {worldCamera,worldObject} from './unified-shell-ui.mjs';
import {visibleSpritePoint,settleWorldProjection} from './unified-sprite-point.mjs';

// Exploratory reproduction only: exit success does NOT accept D06. The report
// distinguishes opening a sheet, explicitly moving a camera and resizing it.
assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');
const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');
assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&end>Date.now()&&end-Date.now()<=15*60_000,'Current coordinated deadline required');
const qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/care-layout-repro',hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const farm=makeFullWorldFarm(await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'));assert.equal(farm.state.paused,true);
const report={receiptSHA256:hash(JSON.stringify(JSON.parse(await readFile('dist/play/build-info.json','utf8')))),fixtureSHA256:hash(farm.raw),profiles:[],findings:[],errors:[],consoleErrors:[],D06Accepted:false,scope:'Exploratory actual viewport/care/opaque-pixel visibility measurements at open, explicit camera focus/zoom and viewport resize; a finding never counts as acceptance. Reduced-motion headless touch emulation with native paid saves; no physical-device, virtual-keyboard hardware, performance or auto-follow claim.'};
await mkdir(qa,{recursive:true});const server=await startServer(0,undefined,{assetCompression:true,assetCache:true});let browser=null,timer=null,expired=false;
try{
 browser=await chromium.launch({headless:true,timeout:Math.min(30000,end-Date.now()),executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});timer=setTimeout(()=>{expired=true;void browser.close();},Math.max(0,end-Date.now()));
 for(const [width,height]of [[390,844],[568,320]])for(const locale of ['en','id']){
  const name=`${width}x${height}-${locale}`,context=await browser.newContext({viewport:{width,height},isMobile:true,hasTouch:true,deviceScaleFactor:1,reducedMotion:'reduce'}),cases=[];report.activeProfile={name,cases};
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaIntervals=0;const set=window.setInterval.bind(window);window.setInterval=(...args)=>{window.__qaIntervals++;return set(...args);};},farm.raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);await page.locator('#language').selectOption(locale);await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.renderer==='three'&&d.controlsReady==='true'&&Number(d.spriteActors)>0&&d.spriteActors===d.spriteReady;});
   await page.evaluate(async()=>{const{Scene}=await import('/play/vendor/three/three.module.js'),after=Scene.prototype.onAfterRender;window.__qaScenes=new Set();window.__qaCameras=new Set();Scene.prototype.onAfterRender=function(renderer,...args){after.call(this,renderer,...args);window.__qaScene=this;window.__qaCamera=args[1];window.__qaScenes.add(this);window.__qaCameras.add(args[1]);};});await worldCamera(page,'fit');
   const exact=async()=>{assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),farm.raw);assert.deepEqual(await page.evaluate(()=>({scenes:window.__qaScenes.size,cameras:window.__qaCameras.size,intervals:window.__qaIntervals})),{scenes:1,cameras:1,intervals:1});assert.equal(await page.locator('#world canvas').count(),1);assert.equal(await page.locator('#world svg').count(),0);};
   const close=async()=>{for(const zone of ['goat','cow']){const button=page.locator('#close-'+zone);if(await button.isVisible())await button.click();}};
   const inspect=async(id,zone,heading,phase)=>{
    await settleWorldProjection(page);const opaquePoint=await visibleSpritePoint(page,id),layout=await page.evaluate(({id,zone})=>{const rect=node=>node.getBoundingClientRect().toJSON(),panel=document.querySelector('#'+zone+'-panel'),stage=document.querySelector('#world canvas'),dock=document.querySelector('#world-camera-dock'),nav=document.querySelector('#world-menus'),host=document.querySelector('#unified-preview'),sprites=[];window.__qaScene.traverseVisible(o=>{if(o.isSprite&&o.userData.entityId===id)sprites.push({id:o.userData.entityId,position:o.position.toArray(),action:o.userData.action,frame:o.userData.frame});});const close=document.querySelector('#close-'+zone),r=close.getBoundingClientRect();return{viewport:{width:innerWidth,height:innerHeight},panel:rect(panel),stage:rect(stage),dock:rect(dock),nav:rect(nav),panelScroll:{top:panel.scrollTop,height:panel.clientHeight,total:panel.scrollHeight},closeButton:{rect:r.toJSON(),receivesPointer:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('button')===close},camera:{heading:host.dataset.heading,x:host.dataset.panX,z:host.dataset.panZ,zoom:host.dataset.zoom},selected:host.dataset.selectedEntity,sprites,horizontalOverflow:document.documentElement.scrollWidth>innerWidth,scrollY};},{id,zone});
    assert.equal(layout.selected,id);assert.ok(layout.closeButton.rect.width>=43.9&&layout.closeButton.rect.height>=43.9);assert.equal(layout.closeButton.receivesPointer,true);assert.equal(layout.horizontalOverflow,false);await exact();
    const path=`${qa}/${name}-${zone}-h${heading}-${phase}.png`;await page.screenshot({path});const value={phase,id,zone,heading,opaquePoint,actualFrontmostPixelVisible:!!opaquePoint,path,...layout};if(!opaquePoint)report.findings.push({name,phase,id,zone,heading,path,interpretation:phase==='explicit-camera'?'After deliberate camera move; distinguish from panel-open reveal failure':'No unobscured opaque pixel after panel-open/viewport-layout settle; investigate geometry, occlusion and reveal timing'});return value;
   };
   for(const zone of ['goat','cow'])for(const heading of [0,2]){
    assert.ok(Date.now()<end,'Slot expired');await close();await page.setViewportSize({width,height});await worldCamera(page,'reset');if(heading)for(let i=0;i<heading;i++)await worldCamera(page,'right');await worldCamera(page,zone);for(let i=0;i<2;i++)await worldCamera(page,'in');
    const ids=await page.evaluate(kind=>{const ids=[];window.__qaScene.traverse(o=>{if(o.isSprite&&o.userData.kind===kind)ids.push({id:o.userData.entityId,stage:o.userData.stage});});return ids;},zone+'Sprite'),id=(ids.find(g=>g.stage==='marketReady')||ids[0])?.id;assert.ok(id,'Native owned target required');
    await worldObject(page,id);const opened=await inspect(id,zone,heading,'panel-open');
    await page.setViewportSize({width,height:height>width?740:390});const resized=await inspect(id,zone,heading,'viewport-resize');
    await page.setViewportSize({width,height});await worldCamera(page,zone);for(let i=0;i<2;i++)await worldCamera(page,'in');const reframed=await inspect(id,zone,heading,'explicit-camera');
    cases.push({zone,heading,id,opened,resized,reframed});await writeFile(qa+'/partial.json',JSON.stringify(report,null,2));
   }
   assert.equal(cases.length,4);report.profiles.push({name,cases,wholeNativeSaveExact:true,oneOriginalSceneCameraInterval:true});report.activeProfile=null;console.log(JSON.stringify({name,cases:cases.length,findings:report.findings.filter(f=>f.name===name).length,D06Accepted:false}));
  }finally{await context.close();}
 }
 assert.equal(report.profiles.length,4);assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.equal(expired,false);
}catch(error){report.failure=String(error.stack||error);throw error;}
finally{if(timer)clearTimeout(timer);try{await browser?.close();}finally{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await writeFile(qa+'/care-layout.json',JSON.stringify({...report,slotExpired:expired},null,2));}}
