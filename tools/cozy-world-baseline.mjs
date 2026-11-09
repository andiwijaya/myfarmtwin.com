import {chromium} from 'playwright';import {startServer} from './serve.mjs';import {worldCamera} from './unified-shell-ui.mjs';import {deserialize} from '../game/client/save-schema.js';import {readFile,writeFile,mkdir} from 'node:fs/promises';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';

// Do not run until the parent has granted this task an exclusive browser slot.
assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');
const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&Number.isFinite(end)&&end>Date.now()&&end-Date.now()<=15*60_000,'A current parent-coordinated UTC deadline of at most15 minutes is required');
const qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/baseline',raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),state=deserialize(raw),receipt=JSON.parse(await readFile('dist/play/build-info.json','utf8')),audit=JSON.parse(await readFile('qa-artifacts/cozy-world-v1/audit/source.json','utf8')),hash=v=>createHash('sha256').update(v).digest('hex');
assert.equal(hash(JSON.stringify(receipt)),audit.buildReceiptSHA256,'Baseline runtime changed before capture');
await mkdir(qa,{recursive:true});const server=await startServer(0,undefined,{assetCompression:true,assetCache:true}),report={source:audit.localSource,receiptSHA256:hash(JSON.stringify(receipt)),fixtureSHA256:hash(raw),nativeTick:state.tick,weather:state.weather,profiles:[],errors:[],scope:'Actual fixed-camera local captures and renderer.info object/call counts. Local gzip transport. Touch/DPR are emulated; no FPS, VRAM-byte, physical-phone or CPU/GPU benchmark claim.'};
let browser=null,timer=null,expired=false;const closeOwnBrowser=()=>{expired=true;if(browser)void browser.close();};process.once('SIGINT',closeOwnBrowser);
try{
 browser=await chromium.launch({headless:true,timeout:Math.min(30000,Math.max(1,end-Date.now())),executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});timer=setTimeout(closeOwnBrowser,Math.max(0,end-Date.now()));
 for(const [width,height,touch]of [[1900,741,false],[1440,900,false],[390,844,true],[568,320,true]]){
  assert.ok(!expired&&Date.now()<end,'Slot expired');const name=`${width}x${height}`,context=await browser.newContext({viewport:{width,height},isMobile:touch,hasTouch:touch,deviceScaleFactor:1,reducedMotion:'reduce'});
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaIntervals=0;const set=window.setInterval.bind(window);window.setInterval=(...a)=>{window.__qaIntervals++;return set(...a);};},raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));await page.goto(`http://127.0.0.1:${server.address().port}/play/`);
   await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.controlsReady==='true'&&Number(d.spriteActors)>0&&d.spriteReady===d.spriteActors;});
   await page.evaluate(async driver=>{const{WebGLRenderer}=await import('/play/'+driver),original=WebGLRenderer.prototype.render;WebGLRenderer.prototype.render=function(...args){const result=original.apply(this,args);window.__qaActualRenderer={calls:this.info.render.calls,triangles:this.info.render.triangles,lines:this.info.render.lines,points:this.info.render.points,geometries:this.info.memory.geometries,textures:this.info.memory.textures,programs:this.info.programs?.length,outputColorSpace:this.outputColorSpace,toneMapping:this.toneMapping,toneMappingExposure:this.toneMappingExposure};return result;};},receipt.lazyWebGL);
   const captures=[];
   for(const framing of ['normal','cow-focus']){
    await worldCamera(page,'reset');if(framing==='cow-focus')await worldCamera(page,'cow');
    for(let heading=0;heading<4;heading++){
     assert.ok(Date.now()<end,'Slot expired');if(heading)await worldCamera(page,'right');
     await page.waitForFunction(()=>!!window.__qaActualRenderer);const actual=await page.evaluate(()=>{const d=document.querySelector('#unified-preview').dataset,c=document.querySelector('.unified-preview-stage').getBoundingClientRect();return{camera:{x:Number(d.panX),z:Number(d.panZ),heading:Number(d.heading),zoom:Number(d.zoom)},stage:c.toJSON(),quality:d.worldQuality,atlasQuality:d.atlasQuality,actors:Number(d.spriteActors),ready:Number(d.spriteReady),staticBatches:Number(d.staticBatches),instances:Number(d.staticInstances),renderer:window.__qaActualRenderer,intervals:window.__qaIntervals,canvasCount:document.querySelectorAll('#world canvas').length,save:localStorage.getItem('myfarmtwin.save.v1')};});
     assert.equal(actual.save,raw);delete actual.save;assert.equal(actual.intervals,1);assert.equal(actual.canvasCount,1);assert.equal(actual.camera.heading,heading);if(framing==='normal')assert.equal(actual.camera.zoom,1.35);
     const path=`${qa}/${name}-${framing}-h${heading}.png`;await page.screenshot({path});captures.push({path,...actual});
    }
   }
   const network=await page.evaluate(()=>performance.getEntriesByType('resource').map(r=>({name:new URL(r.name).pathname,encoded:r.encodedBodySize,decoded:r.decodedBodySize,transfer:r.transferSize})));report.profiles.push({name,touch,captures,network});console.log(JSON.stringify({name,captures:captures.length,saveExact:true}));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.equal(report.profiles.length,4);assert.equal(expired,false);
}finally{if(timer)clearTimeout(timer);process.removeListener('SIGINT',closeOwnBrowser);await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));report.slotExpired=expired;await writeFile(qa+'/baseline.json',JSON.stringify(report,null,2));}
