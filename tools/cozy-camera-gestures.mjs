import assert from 'node:assert/strict';
import {worldCamera} from './unified-shell-ui.mjs';

export async function observeCameraScene(page){
 await page.evaluate(async()=>{
  const {Scene}=await import('/play/vendor/three/three.module.js'),after=Scene.prototype.onAfterRender;
  window.__qaCanvas=document.querySelector('#world canvas');window.__qaScenes=new Set();window.__qaCameras=new Set();
  Scene.prototype.onAfterRender=function(renderer,...args){after.call(this,renderer,...args);window.__qaScene=this;window.__qaCamera=args[1];window.__qaScenes.add(this);window.__qaCameras.add(args[1]);};
 });
 await worldCamera(page,'reset');
}
const point=box=>({x:box.x+box.width*.45,y:box.y+box.height*.62});
const samePan=(a,b)=>{assert.ok(Math.abs(Number(a.x)-Number(b.x))<1e-6);assert.ok(Math.abs(Number(a.z)-Number(b.z))<1e-6);};
const sequence=page=>page.evaluate(()=>window.__qaInputSeq);
const eventsSince=(page,n)=>page.evaluate(n=>window.__qaInputs.filter(e=>e.seq>n),n);

/** Actual CDP touch / trusted mouse input in the runner's private headless tab.
 * Tests camera deltas and original save separately; no JS-dispatched gesture. */
export async function exerciseCameraGestures(page,context,mobile,canvas,view,exact){
 const records=[],cdp=mobile?await context.newCDPSession(page):null;
 const touch=(type,touchPoints)=>cdp.send('Input.dispatchTouchEvent',{type,touchPoints});
 try{for(let heading=0;heading<4;heading++){
  await worldCamera(page,'reset');for(let n=0;n<heading;n++)await worldCamera(page,'right');
  await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox();assert.ok(box);const {x,y}=point(box),before=await view();assert.equal(before.heading,String(heading));
  const seq=await sequence(page);
  if(mobile){
   await touch('touchStart',[{id:1,x,y}]);await touch('touchCancel',[]);
   assert.equal((await view()).selection,'');assert.ok((await eventsSince(page,seq)).some(e=>e.type==='pointercancel'&&e.trusted));
   await touch('touchStart',[{id:1,x,y}]);for(let n=1;n<=5;n++)await touch('touchMove',[{id:1,x:x+7*n,y:y+2*n}]);
  }else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+35,y+10,{steps:5});}
  const moved=await view();assert.notDeepEqual({x:moved.x,z:moved.z},{x:before.x,z:before.z},'Actual drag must pan');
  if(mobile){for(let n=4;n>=0;n--)await touch('touchMove',[{id:1,x:x+7*n,y:y+2*n}]);await touch('touchEnd',[]);}
  else{await page.mouse.move(x,y,{steps:5});await page.mouse.up();}
  assert.equal((await view()).selection,'','Round-trip drag cannot turn into a tap');samePan(await view(),before);await exact();
  const trace=await eventsSince(page,seq);assert.ok(trace.some(e=>e.type==='pointermove'&&e.trusted&&e.pointerType===(mobile?'touch':'mouse')));assert.ok(trace.some(e=>e.type==='pointerup'&&e.trusted&&e.pointerType===(mobile?'touch':'mouse')));
  if(mobile){
   const start=(await view()).zoom;await touch('touchStart',[{id:1,x:x-30,y},{id:2,x:x+30,y}]);await touch('touchMove',[{id:1,x:x-60,y},{id:2,x:x+60,y}]);
   await page.waitForFunction(z=>Number(document.querySelector('#unified-preview').dataset.zoom)>z,start);const expanded=(await view()).zoom;
   await touch('touchMove',[{id:1,x:x-15,y},{id:2,x:x+15,y}]);await touch('touchEnd',[]);assert.ok((await view()).zoom<expanded,'Actual pinch inward must zoom out');assert.equal((await view()).selection,'');await exact();
   records.push({heading,kind:'trusted-touch',cancelCleared:true,oneFingerPan:true,roundTripNoTap:true,pinchInOut:true});
  }else{
   await page.mouse.move(x,y);const start=(await view()).zoom;await page.mouse.wheel(0,-100);await page.waitForFunction(z=>Number(document.querySelector('#unified-preview').dataset.zoom)>z,start);
   const vertical=await view();await page.mouse.wheel(100,0);await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));assert.deepEqual(await view(),vertical);await exact();
   assert.ok((await eventsSince(page,seq)).some(e=>e.type==='wheel'&&e.trusted));records.push({heading,kind:'trusted-mouse',roundTripNoTap:true,wheelZoom:true,horizontalWheelNoZoom:true});
  }
 }}finally{await cdp?.detach();}
 return records;
}

/** A selected object deliberately moved offscreen must stay away on zoom. */
export async function exercisePanAway(page,canvas,host,view,exact){
 const writes=await page.evaluate(()=>window.__qaProtectedWrites.length);await worldCamera(page,'field');await worldCamera(page,'in');await canvas.focus();
 const outside=()=>page.evaluate(()=>{const group=window.__qaScene.children.find(o=>o.userData.entityId==='field.plot.0');if(!group)throw Error('Actual selected plot not found');const p=group.getWorldPosition(group.position.clone()).project(window.__qaCamera);return Math.abs(p.x)>1.05||Math.abs(p.y)>1.05;});
 let steps=0;while(!await outside()&&steps<40){await page.keyboard.press('ArrowRight');steps++;}
 assert.equal(await outside(),true,'Selected plot must actually leave the camera');const before=await view();await page.keyboard.press('+');const after=await view();samePan(after,before);assert.equal(after.heading,before.heading);assert.ok(Math.abs(after.zoom-Math.min(8,before.zoom*1.2))<1e-9);assert.equal(after.selection,'field.plot.0');assert.equal(await page.locator('#world').getAttribute('data-context-zone'),'field');assert.equal(await page.locator('#plot-panel').isVisible(),true);await exact();assert.equal(await page.evaluate(()=>window.__qaProtectedWrites.length),writes);await worldCamera(page,'field');assert.equal(await host.getAttribute('data-selected-entity'),'field.plot.0');
 return {steps,actualSelectedFootOffscreen:true,zoomDidNotPullBack:true,contextAndProtectedSaveExact:true};
}
