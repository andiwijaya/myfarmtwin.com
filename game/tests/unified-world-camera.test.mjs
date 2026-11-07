import test from 'node:test';import assert from 'node:assert/strict';
import {createWorldCamera} from '../client/unified-world-camera.js';
import {TWO_ZONE_BOUNDS as bounds} from '../client/unified-world-model.js';
import {OrthographicCamera,Vector3} from 'three';
test('four headings fit every terrain/roof bound on portrait and desktop',()=>{
 const camera=createWorldCamera();for(let heading=0;heading<4;heading++){
  for(const aspect of [320/640,390/440,1440/600,2.4])for(const x of [bounds.minX,bounds.maxX])for(const z of [bounds.minZ,bounds.maxZ])for(const y of [0,3]){const p=camera.project({x,y,z},aspect);assert.ok(Math.abs(p.x)<1&&Math.abs(p.y)<1,JSON.stringify({heading,aspect,p}));}
  camera.rotate(1);
 }assert.equal(camera.view().heading,0);
});
test('focus uses one shared camera and rejects invalid values without storing domain state',()=>{
 const camera=createWorldCamera(),initial=camera.view();camera.focus('chicken');const hen=camera.view();assert.notDeepEqual(hen,initial);camera.rotate(1);camera.focus('field');assert.equal(camera.view().heading,1);assert.equal(camera.view().zoom,2.2);
 const focused=camera.view();camera.focus('__proto__');camera.focus('fish');camera.pan(NaN,Infinity);camera.zoomBy(-1);camera.rotate(.2);assert.deepEqual(camera.view(),focused);
 camera.pan(1e9,-1e9);assert.equal(camera.view().x,bounds.maxX);assert.equal(camera.view().z,bounds.minZ);camera.zoomBy(1e9);assert.equal(camera.view().zoom,3.2);
 camera.fit();assert.equal(camera.view().heading,1);assert.equal(camera.view().zoom,1);camera.reset();assert.deepEqual(camera.view(),initial);assert.throws(()=>camera.frame(0),RangeError);
});
test('fallback projection agrees with the actual pinned Three camera in every heading',()=>{
 const control=createWorldCamera(),camera=new OrthographicCamera();control.focus('chicken');control.pan(1,2);
 for(let h=0;h<4;h++){
  const f=control.frame(1.3);Object.assign(camera,{left:-f.halfWidth,right:f.halfWidth,top:f.halfHeight,bottom:-f.halfHeight,near:.1,far:200});camera.position.set(f.x+32*f.dx,32,f.z+32*f.dz);camera.lookAt(f.x,0,f.z);camera.updateProjectionMatrix();camera.updateMatrixWorld();
  for(const [x,y,z]of [[0,0,0],[-6,.13,4],[-5,2,-8],[5,1,0]]){const p=new Vector3(x,y,z).project(camera),q=control.project({x,y,z},1.3);assert.ok(Math.abs(p.x-q.x)<1e-12);assert.ok(Math.abs(p.y+q.y)<1e-12);}
  control.rotate(1);
 }
});
