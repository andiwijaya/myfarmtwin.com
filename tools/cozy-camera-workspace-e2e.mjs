import {createHash} from 'node:crypto';import {observeCameraScene} from './cozy-camera-gestures.mjs';import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {worldCamera} from './unified-shell-ui.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';

// Local-only camera workspace acceptance. No live URL or personal browser data.
assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate with parent; Zebra has priority');const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&end>Date.now()&&end-Date.now()<=15*60_000,'Current coordinated deadline required');if(process.env.COZY_WORK_STOP_UTC){const stop=Date.parse(process.env.COZY_WORK_STOP_UTC);assert.ok(/Z$/.test(process.env.COZY_WORK_STOP_UTC)&&stop>Date.now()&&end<=stop,'Current work cutoff must bound the slot');}assert.ok(!process.env.BASE_URL,'Local isolated QA only; no remote target');
const selected=process.env.COZY_WORKSPACE_PROFILE||null;assert.ok(!selected||['1894x822','1440x900','390x844','568x320'].includes(selected),'Unknown workspace profile');const receiptSHA256=createHash('sha256').update(JSON.stringify(JSON.parse(await readFile('dist/play/build-info.json','utf8')))).digest('hex');
const qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/d05-workspace';
await mkdir(qa,{recursive:true});
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),server=await startServer(0,undefined,{assetCache:true,assetCompression:true}),report={receiptSHA256,selectedProfile:selected,profiles:[],errors:[],consoleErrors:[],limitations:'Isolated actual mouse/touch input in headless desktop/phone contexts; no physical Android, FPS or screen-reader-user claim.'};let browser=null,timer=null,expired=false;
try{browser=await chromium.launch({headless:true,timeout:Math.min(30000,end-Date.now()),executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});timer=setTimeout(()=>{expired=true;void browser.close();},Math.max(0,end-Date.now()));
 for(const [width,height,touch]of [[1894,822,false],[1440,900,false],[390,844,true],[568,320,true]]){
  const name=`${width}x${height}`;if(selected&&selected!==name)continue;assert.ok(Date.now()<end,'Slot expired');report.activeProfile={name,width,height,touch};const context=await browser.newContext({viewport:{width,height},isMobile:touch,hasTouch:touch,reducedMotion:'reduce'});
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaProtectedWrites=[];window.__qaCameraInputs=[];const put=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k.startsWith('myfarmtwin.save.'))window.__qaProtectedWrites.push(k);return put.call(this,k,v);};document.addEventListener('pointerup',e=>{const action=e.target?.closest?.('[data-preview-camera]')?.dataset.previewCamera;if(action)window.__qaCameraInputs.push({action,trusted:e.isTrusted,pointerType:e.pointerType});},true);window.__qaIntervals=0;const original=setInterval;window.setInterval=(...args)=>{window.__qaIntervals++;return original(...args);};},raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);
   await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true'&&document.querySelector('#unified-preview')?.dataset.renderer==='three'&&document.querySelector('#unified-preview')?.dataset.spriteReady===document.querySelector('#unified-preview')?.dataset.spriteActors);
   await observeCameraScene(page);const host=page.locator('#unified-preview'),view=()=>host.evaluate(h=>({x:h.dataset.panX,z:h.dataset.panZ,zoom:Number(h.dataset.zoom),heading:Number(h.dataset.heading)}));const camera=async action=>{if(!touch)return worldCamera(page,action);const button=page.locator('[data-preview-camera='+action+']');if(!await button.isVisible())await page.locator('#world-camera-tools summary').tap();await button.tap();await page.waitForFunction(()=>document.querySelector('#unified-preview').dataset.cameraDetail!=='reduced');};
   const exact=async()=>{assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);assert.equal(await page.evaluate(()=>window.__qaIntervals),1);assert.equal(await host.locator('canvas').count(),1);assert.equal(await page.locator('[data-preview-camera]').count(),17);assert.deepEqual(await page.evaluate(()=>[window.__qaScenes.size,window.__qaCameras.size]),[1,1]);assert.equal(await page.evaluate(()=>window.__qaCanvas===document.querySelector('#world canvas')),true);assert.equal(await page.locator('#world svg').count(),0);assert.equal(await page.evaluate(()=>window.__qaProtectedWrites.length),0);assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).filter(k=>k.startsWith('myfarmtwin.save.')).sort().map(k=>[k,localStorage.getItem(k)]))),{'myfarmtwin.save.v1':raw});};
   assert.equal((await view()).zoom,1.35);
   const stage=await page.locator('.unified-preview-stage').boundingBox();
   if(!touch){assert.ok(stage.width>=width*.85);assert.ok(stage.height>=height*.69);assert.equal(await page.locator('#world-current-task').evaluate(n=>n.parentElement.classList.contains('world-map-bar')),true);}
   const actions=touch?['out','in','left','right','fit','reset']:['out','in','left','right','pan-up','pan-left','pan-down','pan-right','fit','reset'];
   for(const action of actions){const button=page.locator('#world-camera-dock [data-preview-camera='+action+']');assert.equal(await button.isVisible(),true);const b=await button.boundingBox();assert.ok(b.width>=44&&b.height>=44);assert.equal(await button.getAttribute('aria-label'),await button.getAttribute('data-en'));}
   await page.screenshot({path:`${qa}/${name}-initial.png`,fullPage:true});
   for(const locale of ['en','id']){
    await page.locator('#language').selectOption(locale);
    for(const action of actions){const b=page.locator('#world-camera-dock [data-preview-camera='+action+']');assert.equal(await b.getAttribute('aria-label'),await b.getAttribute('data-'+locale));}
    for(const action of actions){await camera(action);await exact();}
    for(let h=1;h<=4;h++){await camera('right');assert.equal((await view()).heading,h%4);assert.equal(await page.locator('[data-world-camera-readout=angle]').textContent(),(h%4+1)+'/4');assert.equal(await page.locator('#world-camera-tools').getAttribute('open'),null);}
    await camera('fit');assert.equal((await view()).zoom,1);assert.equal(await page.locator('[data-preview-camera=out]').isDisabled(),true);
    for(let i=0;i<13;i++)if(await page.locator('[data-preview-camera=in]').isEnabled())await camera('in');
    assert.equal((await view()).zoom,8);assert.equal(await page.locator('[data-preview-camera=in]').isDisabled(),true);assert.equal(await page.locator('[data-world-camera-readout=zoom]').textContent(),'800%');
    await camera('reset');assert.deepEqual(await view(),{x:'5',z:'0',zoom:1.35,heading:0});
    await exact();
   }
   for(const zone of ['field','chicken','goat','cow','fish','market','future']){await camera(zone);assert.equal(await host.getAttribute('data-focused-zone'),zone);await exact();}await camera('reset');
   if(!touch){
    const canvas=host.locator('canvas'),r=await canvas.boundingBox();await page.mouse.move(r.x+r.width*.4,r.y+r.height*.65);await page.mouse.wheel(0,-100);
    await page.waitForFunction(()=>Number(document.querySelector('#unified-preview').dataset.zoom)>1.35);
    const before=await view();await page.mouse.wheel(100,0);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.deepEqual(await view(),before);
    for(const action of ['pan-up','pan-down','pan-left','pan-right']){const before=await view();await camera(action);assert.notDeepEqual(await view(),before);}
    // Width changes move the same controls, task and canvas; no remount/ticker.
    const canvasHandle=await canvas.elementHandle();
    await page.setViewportSize({width:800,height:900});await page.waitForFunction(()=>document.querySelector('#world-camera-dock')?.dataset.layout==='touch');
    assert.equal(await page.locator('#world-camera-tools [data-preview-camera=pan-up]').count(),1);
    await camera('pan-up');
    await page.setViewportSize({width,height});await page.waitForFunction(()=>document.querySelector('#world-camera-dock')?.dataset.layout==='desktop');
    assert.equal(await page.locator('#world-camera-dock [data-preview-camera=pan-up]').isVisible(),true);assert.equal(await canvasHandle.evaluate(c=>c===document.querySelector('#unified-preview canvas')),true);
   }
   await exact();const directInput=await page.evaluate(()=>window.__qaCameraInputs);for(const action of actions)assert.ok(directInput.some(e=>e.action===action&&e.trusted&&e.pointerType===(touch?'touch':'mouse')),'Actual direct '+action);await page.screenshot({path:`${qa}/${name}-controls.png`,fullPage:true});report.activeProfile=null;report.profiles.push({name,touch,directInput,actualSceneCameraCanvas:true,allProtectedBytesExact:true,noProtectedWrites:true,allSevenCameraOnlyFocuses:true,directButtons:actions.length,stage,initialZoom:1.35,fitZoom:1,bilingual:true,allHeadings:true,zoomLimits:true,saveExact:true,oneClockCanvas:true,mouseWheelAndResize:!touch});console.log(JSON.stringify({name,pass:true}));
  }finally{await context.close();}
 }
 assert.equal(report.profiles.length,selected?1:4);assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.equal(expired,false);
}catch(error){report.failure=String(error.stack||error);throw error;}finally{if(timer)clearTimeout(timer);try{await browser?.close();}finally{server.closeAllConnections();await new Promise(r=>server.close(r));report.slotExpired=expired;await writeFile(`${qa}/workspace.json`,JSON.stringify(report,null,2));}}
