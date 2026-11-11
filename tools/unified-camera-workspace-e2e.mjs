import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {worldCamera} from './unified-shell-ui.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {deserialize,serialize} from '../game/client/save-schema.js';

// Local-only camera workspace acceptance. No live URL or personal browser data.
const qa=process.env.QA_DIR||'qa-artifacts/camera-layout/workspace';
await mkdir(qa,{recursive:true});
const raw=serialize(deserialize(await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'))),server=await startServer(0),browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}),report={profiles:[],errors:[],limitations:'Isolated desktop and touch emulation; no physical Android or hardware performance claim.'};
try{
 for(const [width,height,touch]of [[1894,822,false],[1440,900,false],[390,844,true],[568,320,true]]){
  const name=`${width}x${height}`,context=await browser.newContext({viewport:{width,height},isMobile:touch,hasTouch:touch,reducedMotion:'reduce'});
  try{
   await context.addInitScript(raw=>{localStorage.setItem('myfarmtwin.save.v1',raw);window.__qaIntervals=0;const original=setInterval;window.setInterval=(...args)=>{window.__qaIntervals++;return original(...args);};},raw);
   const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);
   await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true'&&document.querySelector('#unified-preview')?.dataset.spriteReady===document.querySelector('#unified-preview')?.dataset.spriteActors);
   const host=page.locator('#unified-preview'),view=()=>host.evaluate(h=>({x:h.dataset.panX,z:h.dataset.panZ,zoom:Number(h.dataset.zoom),heading:Number(h.dataset.heading)}));
   const exact=async()=>{assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);assert.equal(await page.evaluate(()=>window.__qaIntervals),1);assert.equal(await host.locator('canvas').count(),1);assert.equal(await page.locator('[data-preview-camera]').count(),17);};
   assert.equal((await view()).zoom,1.35);
   const stage=await page.locator('.unified-preview-stage').boundingBox();
   if(!touch){assert.ok(stage.width>=width*.85);assert.ok(stage.height>=height*.69);assert.equal(await page.locator('#world-current-task').evaluate(n=>n.parentElement.classList.contains('world-map-bar')),true);}
   const actions=touch?['out','in','left','right','fit','reset']:['out','in','left','right','pan-up','pan-left','pan-down','pan-right','fit','reset'];
   for(const action of actions){const button=page.locator('#world-camera-dock [data-preview-camera='+action+']');assert.equal(await button.isVisible(),true);const b=await button.boundingBox();assert.ok(b.width>=44&&b.height>=44);assert.equal(await button.getAttribute('aria-label'),await button.getAttribute('data-en'));}
   await page.screenshot({path:`${qa}/${name}-initial.png`,fullPage:true});
   for(const locale of ['en','id']){
    await page.locator('#language').selectOption(locale);
    for(const action of actions){const b=page.locator('#world-camera-dock [data-preview-camera='+action+']');assert.equal(await b.getAttribute('aria-label'),await b.getAttribute('data-'+locale));}
    for(let h=1;h<=4;h++){await worldCamera(page,'right');assert.equal((await view()).heading,h%4);assert.equal(await page.locator('[data-world-camera-readout=angle]').textContent(),(h%4+1)+'/4');assert.equal(await page.locator('#world-camera-tools').getAttribute('open'),null);}
    await worldCamera(page,'fit');assert.equal((await view()).zoom,1);assert.equal(await page.locator('[data-preview-camera=out]').isDisabled(),true);
    for(let i=0;i<13;i++)if(await page.locator('[data-preview-camera=in]').isEnabled())await worldCamera(page,'in');
    assert.equal((await view()).zoom,8);assert.equal(await page.locator('[data-preview-camera=in]').isDisabled(),true);assert.equal(await page.locator('[data-world-camera-readout=zoom]').textContent(),'800%');
    await worldCamera(page,'reset');assert.deepEqual(await view(),{x:'5',z:'0',zoom:1.35,heading:0});
    await exact();
   }
   if(!touch){
    const canvas=host.locator('canvas'),r=await canvas.boundingBox();await page.mouse.move(r.x+r.width*.4,r.y+r.height*.65);await page.mouse.wheel(0,-100);
    await page.waitForFunction(()=>Number(document.querySelector('#unified-preview').dataset.zoom)>1.35);
    const before=await view();await canvas.dispatchEvent('wheel',{deltaX:100,deltaY:0});assert.deepEqual(await view(),before);
    for(const action of ['pan-up','pan-down','pan-left','pan-right']){const before=await view();await worldCamera(page,action);assert.notDeepEqual(await view(),before);}
    // Width changes move the same controls, task and canvas; no remount/ticker.
    const canvasHandle=await canvas.elementHandle();
    await page.setViewportSize({width:800,height:900});await page.waitForFunction(()=>document.querySelector('#world-camera-dock')?.dataset.layout==='touch');
    assert.equal(await page.locator('#world-camera-tools [data-preview-camera=pan-up]').count(),1);
    await worldCamera(page,'pan-up');
    await page.setViewportSize({width,height});await page.waitForFunction(()=>document.querySelector('#world-camera-dock')?.dataset.layout==='desktop');
    assert.equal(await page.locator('#world-camera-dock [data-preview-camera=pan-up]').isVisible(),true);assert.equal(await canvasHandle.evaluate(c=>c===document.querySelector('#unified-preview canvas')),true);
   }
   await exact();report.profiles.push({name,touch,directButtons:actions.length,stage,initialZoom:1.35,fitZoom:1,bilingual:true,allHeadings:true,zoomLimits:true,saveExact:true,oneClockCanvas:true,mouseWheelAndResize:!touch});console.log(JSON.stringify({name,pass:true}));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);
}finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));await writeFile(`${qa}/workspace.json`,JSON.stringify(report,null,2));}
