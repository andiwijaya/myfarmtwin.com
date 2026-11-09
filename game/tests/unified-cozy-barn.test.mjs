import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {Group,MeshLambertMaterial,Raycaster,Vector3,DoubleSide,Color} from 'three';
import {cowBarnParts} from '../client/unified-cow-barn.js';
import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';
import {COZY_ART} from '../client/unified-cozy-art.js';
import {readWorldSnapshot} from '../client/unified-world-model.js';
import {makeBasicWorldFarm} from '../../tools/unified-basic-world-farm.mjs';
import {makeFullWorldFarm} from '../../tools/unified-full-farm.mjs';
import {serialize} from '../client/save-schema.js';

const farms=[makeBasicWorldFarm(),makeFullWorldFarm(await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8'))];
test('crafted barn keeps exact native ownership, real doorway and bounded stable geometry',()=>{
 for(const farm of farms){
  const before=serialize(farm.state),entity=readWorldSnapshot(farm.state).entities.find(e=>e.kind==='cowBarn'),parts=cowBarnParts(entity),material=new MeshLambertMaterial({vertexColors:true,side:DoubleSide}),meshes=compileWorldParts(parts,material),root=new Group();root.add(...meshes);root.updateMatrixWorld(true);
  assert.deepEqual(cowBarnParts(entity),parts);assert.deepEqual(cowBarnParts({...entity,kind:'available'}),[]);
  assert.ok(meshes.length<=COZY_ART.budgets.cowBarnMeshes);const triangles=meshes.reduce((n,m)=>n+m.geometry.getAttribute('position').count/3,0);assert.ok(triangles<=COZY_ART.budgets.cowBarnTriangles,triangles);
  for(const mesh of meshes){const g=mesh.geometry;assert.ok(g.boundingBox.min.y>=-.00001);assert.ok(g.boundingBox.max.y<=4);for(const key of ['position','normal','color'])assert.ok([...g.getAttribute(key).array].every(Number.isFinite));const normals=g.getAttribute('normal');for(let i=0;i<normals.count;i++)assert.ok(Math.abs(Math.hypot(normals.getX(i),normals.getY(i),normals.getZ(i))-1)<1e-5);}
  // Test only front wall triangles: the doorway must actually be open.
  const front=cowBarnParts(entity).filter(p=>p.feature==='body'&&p.z>0),frontMeshes=compileWorldParts(front,material),ray=new Raycaster(new Vector3(0,1,entity.depth/2+1),new Vector3(0,0,-1));for(const m of frontMeshes)m.updateMatrixWorld(true);assert.equal(ray.intersectObjects(frontMeshes).length,0);ray.ray.origin.x=entity.width*.35;assert.ok(ray.intersectObjects(frontMeshes).length>0);
  assert.equal(parts.some(p=>p.feature==='shade'),entity.shade);assert.equal(parts.some(p=>p.feature==='sanitation'),entity.sanitation);assert.equal(parts.filter(p=>p.feature==='native-vent').length,entity.expanded?4:2);
  for(const feature of ['barn-floor','interior-post','bedding'])assert.ok(meshes.some(m=>m.userData.structureFeatures.includes(feature)&&m.userData.cutawayFixed&&!m.userData.cutawayShell));
  const disposals=new Map();for(const mesh of meshes){disposals.set(mesh.geometry,0);mesh.geometry.addEventListener('dispose',()=>disposals.set(mesh.geometry,disposals.get(mesh.geometry)+1));}let materialDisposals=0;material.addEventListener('dispose',()=>materialDisposals++);disposePartMeshes(root);disposePartMeshes(root);assert.ok([...disposals.values()].every(n=>n===1));assert.equal(materialDisposals,0);for(const m of frontMeshes)m.geometry.dispose();material.dispose();assert.equal(serialize(farm.state),before);
 }
});

test('baking preserves linear vertex colors, fixed/fine/startup separation and real ray ownership',()=>{
 const parts=[{x:2,y:1,z:3,width:2,height:2,depth:2,color:'#b8644b',feature:'body',shape:'bevel'},{x:0,y:.1,z:0,width:1,height:.2,depth:1,color:'#fff0ce',feature:'barn-floor',fixed:true},{x:0,y:.2,z:0,width:1,height:.01,depth:1,color:'#ba8a59',feature:'floor-plank',fixed:true,fine:true}],material=new MeshLambertMaterial({vertexColors:true}),meshes=compileWorldParts(parts,material),color=new Color('#b8644b');assert.equal(meshes.length,3);
 const body=meshes.find(m=>m.userData.structureFeatures.includes('body'));const c=body.geometry.getAttribute('color');assert.ok(Math.abs(c.getX(0)-color.r)<1e-6);assert.equal(body.userData.startupOptional,false);assert.equal(body.userData.cutawayShell,true);const owner=new Group();owner.userData.entityId='cow.barn';owner.position.set(19,0,8.5);owner.add(...meshes);owner.updateMatrixWorld(true);const ray=new Raycaster(new Vector3(21,1,20),new Vector3(0,0,-1)),hit=ray.intersectObjects(owner.children)[0];assert.ok(hit);assert.equal(hit.object.parent.userData.entityId,'cow.barn');
 assert.throws(()=>compileWorldParts([{...parts[0],width:NaN}],material),/dimensions/);assert.throws(()=>compileWorldParts([{...parts[0],opacity:.5}],material),/sorting/);disposePartMeshes(owner);material.dispose();
});
