import {chromium} from 'playwright';import {startServer} from './serve.mjs';import {worldCamera} from './unified-shell-ui.mjs';import {deserialize} from '../game/client/save-schema.js';import {readFile,writeFile,mkdir} from 'node:fs/promises';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';import {COZY_ART} from '../game/client/unified-cozy-art.js';

// Do not run until the parent has granted this task an exclusive browser slot.
assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');
const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&Number.isFinite(end)&&end>Date.now()&&end-Date.now()<=15*60_000,'A current parent-coordinated UTC deadline of at most15 minutes is required');
const stage=process.env.COZY_CAPTURE_STAGE||'baseline';assert.ok(['baseline','cow-candidate','crop-baseline','crop-candidate','cozy-final'].includes(stage));
const qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/'+stage,raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),state=deserialize(raw),receipt=JSON.parse(await readFile('dist/play/build-info.json','utf8')),audit=JSON.parse(await readFile('qa-artifacts/cozy-world-v1/audit/source.json','utf8')),hash=v=>createHash('sha256').update(v).digest('hex');
let before=null,runtimeReference=null;
if(stage==='baseline')assert.equal(hash(JSON.stringify(receipt)),audit.buildReceiptSHA256,'Baseline runtime changed before capture');
else if(stage==='crop-baseline'){
 runtimeReference=JSON.parse(await readFile('qa-artifacts/cozy-world-v1/cow-candidate-v3-final/baseline.json','utf8'));
 assert.equal(hash(JSON.stringify(receipt)),runtimeReference.receiptSHA256,'Capture the accepted Cow package BEFORE building the Crop candidate');
 assert.equal(hash(raw),runtimeReference.fixtureSHA256,'Crop baseline must preserve the accepted canonical save bytes');
}else{
 before=JSON.parse(await readFile(stage==='crop-candidate'?'qa-artifacts/cozy-world-v1/crop-baseline/baseline.json':'qa-artifacts/cozy-world-v1/baseline/baseline.json','utf8'));
 assert.equal(hash(raw),before.fixtureSHA256,'Comparison must use identical canonical save bytes');
 assert.notEqual(hash(JSON.stringify(receipt)),before.receiptSHA256,'Candidate source must be built before comparison');
}
const sourceFiles=['game/client/unified-world-preview.js','game/client/unified-world-style.js','game/client/unified-world-lighting.js','game/client/unified-world-sprites.js','game/client/unified-cozy-art.js','game/client/unified-cozy-contact.js','game/client/unified-cow-barn.js','game/client/unified-cow-care.js','game/client/unified-cow-yard.js','game/client/unified-cow-trails.js','game/client/unified-cozy-crops.js','game/client/unified-world-crops.js','game/client/unified-world-irrigation.js','game/client/unified-world-visual-key.js','game/client/unified-world-part-meshes.js','tools/three-cpu-entry.mjs','tools/art/cow.mjs'],sourceHashes={};for(const path of sourceFiles)sourceHashes[path]=hash(Buffer.from((await readFile(path,'utf8')).replaceAll('\r\n','\n')));
const baselineOnly=stage==='baseline'||stage==='crop-baseline';
await mkdir(qa,{recursive:true});const server=await startServer(0,undefined,{assetCompression:true,assetCache:true}),report={stage,source:stage==='baseline'?audit.localSource:runtimeReference?.source||execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8',windowsHide:true}).trim(),workingSourceStatus:execFileSync('git',['status','--short'],{encoding:'utf8',windowsHide:true}).trim(),sourceHashes:baselineOnly?runtimeReference?.sourceHashes:sourceHashes,runtimeReference:runtimeReference?'qa-artifacts/cozy-world-v1/cow-candidate-v3-final/baseline.json':undefined,receiptSHA256:hash(JSON.stringify(receipt)),fixtureSHA256:hash(raw),nativeTick:state.tick,weather:state.weather,profiles:[],errors:[],scope:'Actual fixed-camera local captures and renderer.info object/call counts. Local gzip transport. Touch/DPR are emulated; no FPS, VRAM-byte, physical-phone or CPU/GPU benchmark claim. Baseline runtime provenance comes from the accepted built receipt, not the unbuilt working tree.'};
let browser=null,timer=null,expired=false;const closeOwnBrowser=()=>{expired=true;if(browser)void browser.close();};process.once('SIGINT',closeOwnBrowser);
try{
 browser=await chromium.launch({headless:true,timeout:Math.min(30000,Math.max(1,end-Date.now())),executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});timer=setTimeout(closeOwnBrowser,Math.max(0,end-Date.now()));
 for(const [width,height,touch]of [[1900,741,false],[1440,900,false],[390,844,true],[568,320,true]]){
  assert.ok(!expired&&Date.now()<end,'Slot expired');const name=`${width}x${height}`,context=await browser.newContext({viewport:{width,height},isMobile:touch,hasTouch:touch,deviceScaleFactor:1,reducedMotion:'reduce'});
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaIntervals=0;const set=window.setInterval.bind(window);window.setInterval=(...a)=>{window.__qaIntervals++;return set(...a);};},raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));await page.goto(`http://127.0.0.1:${server.address().port}/play/`);
   await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.controlsReady==='true'&&Number(d.spriteActors)>0&&d.spriteReady===d.spriteActors;});
   // WebGLRenderer.render is an own instance method. The public scene callback
   // receives that actual renderer after its draw, without constructing another.
   await page.evaluate(async()=>{const{Scene}=await import('/play/vendor/three/three.module.js'),original=Scene.prototype.onAfterRender;Scene.prototype.onAfterRender=function(renderer,...args){original.call(this,renderer,...args);window.__qaActualScene=this;window.__qaActualRenderer={calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,lines:renderer.info.render.lines,points:renderer.info.render.points,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs?.length,outputColorSpace:renderer.outputColorSpace,toneMapping:renderer.toneMapping,toneMappingExposure:renderer.toneMappingExposure};};});
   const captures=[];
   for(const framing of ['normal',stage.startsWith('crop-')?'field-focus':'cow-focus']){
    await worldCamera(page,'reset');if(framing.endsWith('-focus'))await worldCamera(page,framing==='field-focus'?'field':'cow');
    for(let heading=0;heading<4;heading++){
     assert.ok(Date.now()<end,'Slot expired');if(heading)await worldCamera(page,'right');
     await page.waitForFunction(()=>!!window.__qaActualRenderer);const actual=await page.evaluate(()=>{const d=document.querySelector('#unified-preview').dataset,c=document.querySelector('.unified-preview-stage').getBoundingClientRect(),art=new Map();window.__qaActualScene.traverse(o=>{const m=o.userData.atlas?.asset?.meta;if(m)art.set(m.species,{lod:m.lod,imageSha256:m.imageSha256,modelSha256:m.source.modelSha256});});return{camera:{x:Number(d.panX),z:Number(d.panZ),heading:Number(d.heading),zoom:Number(d.zoom)},stage:c.toJSON(),quality:d.worldQuality,atlasQuality:d.atlasQuality,actors:Number(d.spriteActors),ready:Number(d.spriteReady),staticBatches:Number(d.staticBatches),instances:Number(d.staticInstances),loadedArt:Object.fromEntries(art),renderer:window.__qaActualRenderer,intervals:window.__qaIntervals,canvasCount:document.querySelectorAll('#world canvas').length,save:localStorage.getItem('myfarmtwin.save.v1')};});
     assert.equal(actual.save,raw);delete actual.save;assert.equal(actual.intervals,1);assert.equal(actual.canvasCount,1);assert.equal(actual.camera.heading,heading);if(framing==='normal')assert.equal(actual.camera.zoom,1.35);
     if(before){const reference=before.profiles.find(p=>p.name===name).captures[captures.length];assert.deepEqual(actual.camera,reference.camera,'Fixed-camera comparison changed');assert.deepEqual(actual.stage,reference.stage,'Drawable comparison viewport changed');assert.equal(actual.actors,reference.actors);assert.ok(actual.renderer.calls<=reference.renderer.calls,'Draw calls exceed the corresponding baseline');assert.ok(actual.renderer.triangles<=COZY_ART.budgets.normalTriangles,'Triangle budget exceeded');assert.equal(actual.loadedArt.cow.modelSha256,sourceHashes['tools/art/cow.mjs'],'Cow rig was not regenerated into the actual loaded atlas');}
     const path=`${qa}/${name}-${framing}-h${heading}.png`;await page.screenshot({path});captures.push({path,...actual});
    }
   }
   const network=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,encoded:r.encodedBodySize,decoded:r.decodedBodySize,transfer:r.transferSize})));report.profiles.push({name,touch,captures,network});console.log(JSON.stringify({name,captures:captures.length,saveExact:true}));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.equal(report.profiles.length,4);assert.equal(expired,false);
}finally{if(timer)clearTimeout(timer);process.removeListener('SIGINT',closeOwnBrowser);await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));report.slotExpired=expired;await writeFile(qa+'/baseline.json',JSON.stringify(report,null,2));}
