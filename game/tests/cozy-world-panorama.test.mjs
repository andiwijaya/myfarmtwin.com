import test from 'node:test';
import assert from 'node:assert/strict';
import {Color,PerspectiveCamera,Vector2,Vector3} from 'three';
import {FarmPanorama,splitFarmViewport} from '../client/cozy-panorama.js';
import {CozyWorld} from '../client/cozy-world.js';

test('the upper panorama and lower map always have a gap while the panorama is visible',()=>{
 for(const height of [1,150,260,452,600,900]){
  assert.deepEqual(splitFarmViewport(height,0),{panoramaHeight:0,gap:0,mapHeight:height});
  for(const visibility of [.02,.25,.5,1]){
   const {panoramaHeight,gap,mapHeight}=splitFarmViewport(height,visibility);
   assert.equal(panoramaHeight+gap+mapHeight,height);
   assert.ok(mapHeight>0);
   if(panoramaHeight)assert.ok(gap>=1);
  }
 }
 assert.deepEqual(splitFarmViewport(452,1),{panoramaHeight:117,gap:17,mapHeight:318});
});

test('panorama sampling changes with heading and is independent of pitch and zoom',()=>{
 const panorama=new FarmPanorama(new Color('#d6e1ce'),{dataset:{}});
 const camera=new PerspectiveCamera(43,2,.08,340);
 const viewports=[];
 const renderer={
  autoClear:true,
  setViewport(...viewport){viewports.push(viewport);},
  render(){assert.equal(this.autoClear,false);}
 };
 const draw=()=>{
  panorama.draw(renderer,camera,938,335,117);
  assert.equal(renderer.autoClear,true);
  return panorama.uniforms.heading.value;
 };
 try{
  camera.position.set(20,12,25);
  camera.lookAt(0,0,0);
  const start=draw();
  camera.position.multiplyScalar(.45);
  camera.position.y*=2;
  camera.fov=50;
  camera.zoom=2;
  camera.updateProjectionMatrix();
  camera.lookAt(0,0,0);
  assert.ok(Math.abs(draw()-start)<1e-12);
  camera.position.applyAxisAngle(new Vector3(0,1,0),Math.PI/2);
  camera.lookAt(0,0,0);
  const turn=draw()-start;
  assert.ok(Math.abs((turn+1)%1-.25)<1e-12);
  assert.deepEqual(viewports,Array.from({length:3},()=>[0,335,938,117]));
 }finally{
  panorama.dispose();
 }
});

test('clicks in the panorama and gap are ignored and the map center maps to the camera center',()=>{
 const rays=[],placed=[];
 const world=Object.assign(Object.create(CozyWorld.prototype),{
  viewportSize:{y:500},mapHeight:352,placing:true,pointer:new Vector2(),
  renderer:{domElement:{getBoundingClientRect:()=>({left:100,top:50,width:400,height:500})}},
  raycaster:{
   setFromCamera(pointer){rays.push(pointer.toArray());},
   ray:{intersectPlane(_plane,point){return point.set(1.1,0,-2.4);}}
  },
  options:{onPlacement:point=>placed.push(point)}
 });
 world.pick(300,120);
 world.pick(300,190);
 assert.deepEqual(rays,[]);
 world.pick(300,374);
 assert.deepEqual(rays,[[0,0]]);
 assert.deepEqual(placed,[{x:1,z:-2.5}]);
});
