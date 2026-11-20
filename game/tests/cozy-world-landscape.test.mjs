import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,Plane,Raycaster,Scene,Vector2,Vector3} from 'three';
import {FarmSky} from '../client/cozy-sky.js';
import {CozyWorld} from '../client/cozy-world.js';

test('the sky uses the same camera projection and respects terrain depth',()=>{
 const camera=new PerspectiveCamera(43,2,.08,2500);
 const scene=new Scene(),sky=new FarmSky(camera);
 scene.add(sky.mesh);
 try{
  assert.equal(sky.mesh.material.depthTest,true);
  assert.equal(sky.mesh.material.depthWrite,false);
  assert.equal(sky.uniforms.cameraToWorld.value,camera.matrixWorld);
  assert.equal(sky.uniforms.inverseProjection.value,camera.projectionMatrixInverse);
  const day=sky.haze.getHex();
  sky.setHour(2);
  assert.notEqual(sky.haze.getHex(),day);
  sky.setHour(12);
  assert.equal(sky.haze.getHex(),day);
 }finally{
  sky.dispose();
 }
 assert.equal(scene.children.length,0);
});

test('the full camera viewport maps to the farm, while rays above the horizon do not place items',()=>{
 const camera=new PerspectiveCamera(43,.8,.08,2500);
 camera.position.set(0,5,22);
 camera.lookAt(1,0,-2.5);
 camera.updateMatrixWorld();
 const placed=[];
 const world=Object.assign(Object.create(CozyWorld.prototype),{
  camera,placing:true,pointer:new Vector2(),raycaster:new Raycaster(),
  groundPlane:new Plane(new Vector3(0,1,0),0),
  renderer:{domElement:{getBoundingClientRect:()=>({left:100,top:50,width:400,height:500})}},
  options:{onPlacement:point=>placed.push(point)},
 });
 world.pick(300,49);
 world.pick(300,50);
 assert.deepEqual(placed,[]);
 world.pick(300,300);
 assert.deepEqual(placed,[{x:1,z:-2.5}]);
});
