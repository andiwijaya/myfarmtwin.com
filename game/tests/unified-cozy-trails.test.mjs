import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {MeshLambertMaterial,Group,Raycaster,Vector3} from 'three';
import {cowTrailRoutes,cowTrailParts} from '../client/unified-cow-trails.js';import {cowYardParts} from '../client/unified-cow-yard.js';import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';import {crossesObstacle} from '../client/unified-world-motion.js';import {ZONE_REGISTRY,WORLD_BOUNDS} from '../client/unified-world-registry.js';import {readWorldSnapshot} from '../client/unified-world-model.js';import {makeBasicWorldFarm} from '../../tools/unified-basic-world-farm.mjs';import {makeFullWorldFarm} from '../../tools/unified-full-farm.mjs';import {serialize} from '../client/save-schema.js';

const farms=[makeBasicWorldFarm(),makeFullWorldFarm(await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8'))];
test('every owned cow facility has a connected gate trail that avoids foreign barn/stand footprints',()=>{
 for(const farm of farms){
  const raw=serialize(farm.state),snapshot=readWorldSnapshot(farm.state),routes=cowTrailRoutes(snapshot),entry=routes.find(r=>r.id==='cow.trail.entry'),targets=snapshot.entities.filter(e=>e.zone==='cow'&&['cowBarn','cowStation'].includes(e.kind));assert.equal(routes.length,targets.length+1);assert.deepEqual(entry.points[0],ZONE_REGISTRY.cow.entry);const junction=entry.points.at(-1);assert.deepEqual(cowTrailRoutes({...snapshot,cowStarted:false}),[]);
  assert.equal(cowTrailRoutes(snapshot),routes,'Identical layout must reuse immutable route data');assert.ok(Object.isFrozen(routes)&&routes.every(r=>Object.isFrozen(r.points)&&r.points.every(Object.isFrozen)));
  for(const target of targets){
   const route=routes.find(r=>r.id==='cow.trail.'+target.id);assert.deepEqual(route.points[0],junction);assert.ok(route.points.length>=2,'Unreachable facility trail: '+target.id);
   const end=route.points.at(-1);assert.ok(Math.abs(end.x-target.x)<=target.width/2+.8&&Math.abs(end.z-target.z)<=target.depth/2+.8);
   for(const obstacle of targets.filter(e=>e.kind==='cowBarn'||e.domainId==='stand'))if(obstacle!==target||target.kind==='cowBarn')for(let i=1;i<route.points.length;i++)assert.equal(crossesObstacle(route.points[i-1],route.points[i],{minX:obstacle.x-obstacle.width/2-.36,maxX:obstacle.x+obstacle.width/2+.36,minZ:obstacle.z-obstacle.depth/2-.36,maxZ:obstacle.z+obstacle.depth/2+.36}),false,'Trail crosses '+obstacle.id);
  }
  const stocks=snapshot.entities.map(e=>({...e,value:e.value+1}));assert.equal(cowTrailRoutes({...snapshot,entities:stocks}),routes,'Stock-only changes must not recompute geometry');assert.equal(serialize(farm.state),raw);
 }
});

test('ground hierarchy uses real low-cost upward surfaces and stays below native contacts',()=>{
 for(const farm of farms){
  const snapshot=readWorldSnapshot(farm.state),paths=cowTrailParts(snapshot),yard=cowYardParts(snapshot),material=new MeshLambertMaterial({vertexColors:true}),root=new Group();assert.ok(paths.length>0);assert.ok(yard.some(p=>p.feature==='pasture-contrast'));for(const part of paths){assert.ok(!part.fine,'Footpaths must remain visible on phone/Low');assert.ok(part.y>0&&part.y<.003);}
  root.add(...compileWorldParts(yard,material));assert.ok(root.children.length<=2,'Added ground colors must share existing visibility groups');let triangles=0;for(const mesh of root.children){const g=mesh.geometry;triangles+=g.getAttribute('position').count/3;assert.ok(g.boundingBox.min.x>=WORLD_BOUNDS.minX&&g.boundingBox.max.x<=WORLD_BOUNDS.maxX);assert.ok(g.boundingBox.min.z>=WORLD_BOUNDS.minZ&&g.boundingBox.max.z<=WORLD_BOUNDS.maxZ);}assert.ok(triangles<6000,'Scenery geometry budget');
  // Ground paint must be an actual upward-facing selectable triangle, with
  // the exact specified planar height and no underneath/thick cylinder faces.
  const surface=compileWorldParts([{x:0,y:.0014,z:0,width:3,height:.0001,depth:1,color:'#cdb07e',shape:'surface',rotation:Math.PI/4}],material)[0];surface.updateMatrixWorld(true);assert.equal(surface.geometry.getAttribute('position').count,6);const hit=new Raycaster(new Vector3(0,1,0),new Vector3(0,-1,0)).intersectObject(surface)[0];assert.ok(hit);assert.ok(Math.abs(hit.point.y-.0014)<1e-7);assert.ok(hit.face.normal.y>.999);surface.geometry.dispose();disposePartMeshes(root);material.dispose();
 }
});
