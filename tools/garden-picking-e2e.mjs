import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {startServer} from './serve.mjs';
import {worldCamera} from './unified-shell-ui.mjs';
import {makeGardenScenario} from './garden-scenario.mjs';
const qa=process.env.QA_DIR||'qa-artifacts/garden/picking';await mkdir(qa,{recursive:true});
const farm=await makeGardenScenario({cornOnly:true});await writeFile(`${qa}/24-mature-corn.json`,farm.raw);
const server=await startServer(0,resolve('qa-artifacts/garden/build/dist'));let browser;
const report={profiles:[],errors:[],consoleErrors:[],failedRequests:[],scope:'All 24 mature 2–3-unit corn beds. Actual first-hit visible triangles, trusted mouse/touch input; no invisible picking proxies. Four camera headings. Phone is emulated.'};
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const touch of [false,true]){
  const name=touch?'phone':'desktop',context=await browser.newContext({viewport:touch?{width:390,height:844}:{width:1440,height:1000},hasTouch:touch,isMobile:touch,reducedMotion:'reduce'});
  try{
   await context.addInitScript(raw=>localStorage.setItem('myfarmtwin.save.v1',raw),farm.raw);const page=await context.newPage();
   page.on('pageerror',e=>report.errors.push({name,error:e.message}));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({name,error:m.text()});});page.on('requestfailed',r=>report.failedRequests.push({name,url:r.url()}));
   await page.goto(`http://127.0.0.1:${server.address().port}/play/`);await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');
   await page.evaluate(async()=>{const api=await import('/play/vendor/three/three.module.js'),original=api.Scene.prototype.onAfterRender;window.__gardenThree=api;api.Scene.prototype.onAfterRender=function(renderer,scene,camera,...args){original.call(this,renderer,scene,camera,...args);window.__gardenScene=this;window.__gardenCamera=camera;};});
   const focus=async()=>{await worldCamera(page,'field');for(let i=0;i<3;i++)await worldCamera(page,'in');if(await page.locator('#world-camera-tools').evaluate(d=>d.open))await page.locator('#world-camera-tools summary').click();await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));};
   const visiblePoint=async id=>page.evaluate(id=>{
    const {Vector3,Vector2,Raycaster}=window.__gardenThree,scene=window.__gardenScene,camera=window.__gardenCamera,canvas=document.querySelector('#unified-preview canvas'),rect=canvas.getBoundingClientRect(),group=scene.children.find(o=>o.userData.entityId==='field.plot.'+id),visible=[];scene.traverseVisible(o=>{if((o.isMesh||o.isSprite)&&!o.userData.pickThrough)visible.push(o);});
    const ray=new Raycaster(),candidates=[];
    for(const x of [0,-.2,.2,-.34,.34])for(const z of [0,-.2,.2,-.34,.34])candidates.push(new Vector3(x,.14,z).add(group.position));
    for(const mesh of group.children.filter(m=>m.userData.cropPlant)){const p=mesh.geometry.getAttribute('position');for(let i=0;i<p.count;i+=Math.max(3,Math.floor(p.count/24/3)*3))candidates.push(mesh.localToWorld(new Vector3().fromBufferAttribute(p,i)));}
    for(const world of candidates){const p=world.project(camera),x=rect.left+(p.x+1)*rect.width/2,y=rect.top+(1-p.y)*rect.height/2;if(x<rect.left+2||x>rect.right-2||y<rect.top+2||y>rect.bottom-2||document.elementFromPoint(x,y)!==canvas)continue;ray.setFromCamera(new Vector2(p.x,p.y),camera);const hit=ray.intersectObjects(visible,false)[0];if(!hit)continue;let owner=hit.object;while(owner.parent&&!owner.userData.entityId)owner=owner.parent;if(owner.userData.entityId==='field.plot.'+id)return{x,y,worldVisible:true};}return null;
   },id);
   const picks=[];
   for(let h=0;h<4;h++){
    if(h)await worldCamera(page,'right');await focus();
    for(let id=0;id<24;id++){
     await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));let point=await visiblePoint(id),recentered=false;
     if(!point){await focus();point=await visiblePoint(id);recentered=true;}
     if(!point){await page.screenshot({path:`${qa}/${name}-occluded-h${h}-plot${id}.png`});report.blockedPick={name,h,id};}
     assert.ok(point,`${name}/${h}/${id}: no visible geometry target after garden framing`);
     if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
     assert.equal(await page.locator('#unified-preview').getAttribute('data-selected-entity'),'field.plot.'+id,`${name}/${h}/${id}`);assert.equal(await page.locator('#harvest').isEnabled(),true);await page.keyboard.press('Escape');picks.push({h,id,recentered});
    }
    await focus();await page.screenshot({path:`${qa}/${name}-all-corn-h${h}.png`,fullPage:true});
   }
   assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),farm.raw);report.profiles.push({name,picks,all24FourHeadings:true,saveExact:true});console.log(JSON.stringify({name,picks:picks.length,pass:true}));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);assert.deepEqual(report.failedRequests,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));await writeFile(`${qa}/picking.json`,JSON.stringify(report,null,2));}
