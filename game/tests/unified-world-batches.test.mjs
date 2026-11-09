import test from 'node:test';import assert from 'node:assert/strict';import {Scene,Group,Mesh,BoxGeometry,MeshLambertMaterial} from 'three';import {createWorldBatches} from '../client/unified-world-batches.js';
test('static batches preserve explicit background/native draw order and never combine different layers',()=>{
 const scene=new Scene(),root=new Group(),geometry=new BoxGeometry(1,1,1),material=new MeshLambertMaterial({vertexColors:true,depthTest:false,depthWrite:false});scene.add(root);
 for(const order of [-3,-3,-1,-1]){const mesh=new Mesh(geometry,material);mesh.renderOrder=order;root.add(mesh);}const batches=createWorldBatches(scene);batches.rebuild([root]);assert.deepEqual(batches.inspect(),{batches:2,instances:4});const group=scene.children.find(g=>g.userData.worldBatches);assert.deepEqual(group.children.map(m=>m.renderOrder).sort(),[-1,-3]);assert.ok(group.children.every(m=>m.material===material&&m.count===2));
 let released=0;geometry.addEventListener('dispose',()=>released++);batches.dispose();batches.dispose();assert.equal(released,0);assert.ok(root.children.every(m=>m.layers.mask===1));geometry.dispose();material.dispose();assert.equal(released,1);
});
