import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {worldCamera} from './unified-shell-ui.mjs';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {compareCozyPng} from './compare-cozy-png.mjs';

assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');
const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&end>Date.now()&&end-Date.now()<=15*60_000,'Current coordinated deadline required');assert.ok(!process.env.BASE_URL,'Local isolated QA only');
const mode=process.env.COZY_ALPHA_STAGE;assert.ok(['before','after'].includes(mode),'Explicit before/after required');
const root='qa-artifacts/cozy-world-v1/',qa=process.env.QA_DIR||root+'d07-alpha-'+mode,hash=b=>createHash('sha256').update(b).digest('hex'),receipt=hash(JSON.stringify(JSON.parse(await readFile('dist/play/build-info.json','utf8'))));
const original=JSON.parse(await readFile(root+'d05-proof.json','utf8'));let before=null;
if(mode==='before')assert.equal(receipt,original.receiptSHA256,'Capture old built RGBA before building candidate');else{before=JSON.parse(await readFile(root+'d07-alpha-before/visual.json','utf8'));assert.equal(before.mode,'before');assert.equal(before.profiles.length,4);assert.ok(!before.failure);assert.deepEqual(before.errors,[]);assert.deepEqual(before.consoleErrors,[]);assert.notEqual(receipt,before.receiptSHA256);}
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8');await mkdir(qa,{recursive:true});const server=await startServer(0,undefined,{assetCache:true,assetCompression:true}),report={mode,receiptSHA256:receipt,fixtureSHA256:hash(raw),runtimeBaselineCommit:mode==='before'?'267632cf5246f7d2ff5caa5006b5d5cae02af6e2':null,sourceCandidateMayBeUnbuilt:mode==='before',profiles:[],errors:[],consoleErrors:[],scope:'Actual unchanged-camera reduced-motion pixels and loaded mask representation; runtime identity uses built receipt, not the unbuilt working tree. Private headless contexts only.'};let browser=null,timer=null,expired=false;
try{
 browser=await chromium.launch({headless:true,timeout:Math.min(30000,end-Date.now()),executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});timer=setTimeout(()=>{expired=true;void browser.close();},Math.max(0,end-Date.now()));
 for(const[width,height,touch]of[[1900,741,false],[1440,900,false],[390,844,true],[568,320,true]]){
  const name=width+'x'+height;report.activeProfile={name,mode};const context=await browser.newContext({viewport:{width,height},isMobile:touch,hasTouch:touch,deviceScaleFactor:1,reducedMotion:'reduce',locale:'en-US'});
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaIntervals=0;const set=window.setInterval.bind(window);window.setInterval=(...a)=>{window.__qaIntervals++;return set(...a);};},raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});await page.goto('http://127.0.0.1:'+server.address().port+'/play/');
   await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.renderer==='three'&&d.controlsReady==='true'&&Number(d.spriteActors)>0&&d.spriteActors===d.spriteReady;});
   await page.evaluate(async()=>{const{Scene}=await import('/play/vendor/three/three.module.js'),after=Scene.prototype.onAfterRender;window.__qaScenes=new Set();window.__qaCameras=new Set();Scene.prototype.onAfterRender=function(renderer,...args){after.call(this,renderer,...args);window.__qaScene=this;window.__qaCamera=args[1];window.__qaScenes.add(this);window.__qaCameras.add(args[1]);window.__qaRender={calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs?.length};};});
   const captures=[];for(const framing of ['normal','cow-focus']){
    await worldCamera(page,'reset');if(framing==='cow-focus')await worldCamera(page,'cow');
    for(let heading=0;heading<4;heading++){
     assert.ok(Date.now()<end,'Slot expired');if(heading)await worldCamera(page,'right');
     const actual=await page.evaluate(mode=>{const h=document.querySelector('#unified-preview'),d=h.dataset,assets=new Set(),art={},masks={};window.__qaScene.traverse(o=>{const a=o.userData.atlas?.asset;if(a)assets.add(a);});for(const a of assets){const m=a.meta;art[m.species]={lod:m.lod,image:m.imageSha256,model:m.source.modelSha256,width:a.image.width,height:a.image.height};if(a.texture.image!==a.image)throw Error('Original Image is not the color texture source');if(mode==='before'){if(!(a.pixels instanceof Uint8ClampedArray)||a.alpha!==undefined||a.pixels.byteLength!==m.width*m.height*4)throw Error('Expected old actual RGBA asset');masks[m.species]=a.pixels.byteLength;}else{if(!(a.alpha instanceof Uint8Array)||a.pixels!==undefined||a.alpha.byteLength!==m.width*m.height||a.alpha.buffer.byteLength!==a.alpha.byteLength)throw Error('Expected independent compact alpha allocation');masks[m.species]=a.alpha.byteLength;}}return{camera:{x:Number(d.panX),z:Number(d.panZ),heading:Number(d.heading),zoom:Number(d.zoom)},stage:document.querySelector('.unified-preview-stage').getBoundingClientRect().toJSON(),art,masks,actors:Number(d.spriteActors),ready:Number(d.spriteReady),render:window.__qaRender,scenes:window.__qaScenes.size,cameras:window.__qaCameras.size,intervals:window.__qaIntervals,canvas:document.querySelectorAll('#world canvas').length,save:localStorage.getItem('myfarmtwin.save.v1')};},mode);
     assert.equal(actual.save,raw);delete actual.save;assert.equal(actual.scenes,1);assert.equal(actual.cameras,1);assert.equal(actual.intervals,1);assert.equal(actual.canvas,1);assert.equal(actual.camera.heading,heading);if(framing==='normal')assert.equal(actual.camera.zoom,1.35);assert.equal(Object.keys(actual.art).length,4);
     const path=qa+'/'+name+'-'+framing+'-h'+heading+'.png',png=await page.screenshot({path});let pixels=null;
     if(before){const ref=before.profiles.find(p=>p.name===name).captures[captures.length];assert.deepEqual(actual.camera,ref.camera);assert.deepEqual(actual.stage,ref.stage);assert.deepEqual(actual.art,ref.art);assert.equal(actual.actors,ref.actors);assert.equal(actual.render.calls,ref.render.calls);assert.equal(actual.render.triangles,ref.render.triangles);for(const species of Object.keys(actual.masks))assert.equal(actual.masks[species]*4,ref.masks[species]);pixels=compareCozyPng(await readFile(ref.path),png);if(!pixels.exact){await writeFile(qa+'/pixel-failure.json',JSON.stringify({name,framing,heading,pixels},null,2));}assert.equal(pixels.exact,true,'Actual visible pixels changed');}
     captures.push({path,framing,heading,...actual,pixels});
    }
   }
   report.profiles.push({name,touch,captures});report.activeProfile=null;await writeFile(qa+'/partial.json',JSON.stringify(report,null,2));console.log(JSON.stringify({mode,name,captures:captures.length,exactPixels:mode==='after'}));
  }finally{await context.close();}
 }
 assert.equal(report.profiles.length,4);assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.equal(expired,false);
}catch(error){report.failure=String(error.stack||error);throw error;}finally{if(timer)clearTimeout(timer);try{await browser?.close();}finally{server.closeAllConnections();await new Promise(r=>server.close(r));report.slotExpired=expired;await writeFile(qa+'/visual.json',JSON.stringify(report,null,2));}}
