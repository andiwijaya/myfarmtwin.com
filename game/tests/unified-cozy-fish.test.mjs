import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {Group,MeshLambertMaterial,Box3,Vector3,Raycaster} from 'three';
import {fishPondParts,fishCareParts} from '../client/unified-cozy-fish.js';import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';import {configureFixedFarmParts} from '../client/unified-world-part-pruning.js';
import {WORLD_ART} from '../client/unified-world-art.js';import {waterStyle,pondSurfaceParts} from '../client/unified-world-water.js';import {readWorldSnapshot,resolveWorldSelection} from '../client/unified-world-model.js';import {createState} from '../client/engine.js';import {deserialize,serialize} from '../client/save-schema.js';import {fishSnapshot} from '../client/fish-snapshot.js';import {ownsFishFeeder} from '../client/fish-feeder.js';import {makeOwnedFishFarm} from '../../tools/unified-fish-farm.mjs';
const raw=await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8'),owned=makeOwnedFishFarm(raw),material=configureFixedFarmParts(new MeshLambertMaterial({vertexColors:true})),view=s=>readWorldSnapshot(s,{fish:{snapshot:fishSnapshot(s),feederIds:s.fish.ponds.filter(p=>ownsFishFeeder(s,p.id)).map(p=>p.id)}}),parts=e=>e.kind==='fishPond'?fishPondParts(e):fishCareParts(e);
const features=e=>new Set(parts(e).map(p=>p.feature));

test('crafted basins and distinct tools stay inside their native footprint/height and preserve exact state and real input ownership',()=>{
 for(const state of [deserialize(raw),owned.state]){
  const before=serialize(state),snapshot=view(state);let triangles=0,meshes=0,entities=0;
  for(const e of snapshot.entities.filter(e=>e.zone==='fish')){
   const authored=parts(e);if(!authored.length)continue;entities++;const group=new Group();group.userData.entityId=e.id;group.add(...compileWorldParts(authored,material));group.updateMatrixWorld(true);assert.ok(group.children.length<=2,e.id+' batching budget');meshes+=group.children.length;
   const actual=new Box3();let disposed=0;
   for(const mesh of group.children){assert.equal(mesh.material,material);assert.equal(mesh.userData.pickThrough,undefined);mesh.geometry.addEventListener('dispose',()=>disposed++);const p=mesh.geometry.getAttribute('position');triangles+=p.count/3;for(let i=0;i<p.count;i++){const v=new Vector3().fromBufferAttribute(p,i);assert.ok(v.toArray().every(Number.isFinite));actual.expandByPoint(v);}}
   const tolerance=1e-6;assert.ok(actual.min.x>=-e.width/2-tolerance&&actual.max.x<=e.width/2+tolerance,e.id+' width');assert.ok(actual.min.z>=-e.depth/2-tolerance&&actual.max.z<=e.depth/2+tolerance,e.id+' depth');assert.ok(actual.min.y>=-tolerance&&actual.max.y<=e.height+.001,e.id+' height');
   const hit=new Raycaster(new Vector3(0,5,0),new Vector3(0,-1,0)).intersectObjects(group.children,false)[0];assert.ok(hit,e.id+' no actual top target');assert.equal(hit.object.parent.userData.entityId,e.id);assert.equal(resolveWorldSelection(snapshot,e.id).pondId,e.pondId);
   disposePartMeshes(group);disposePartMeshes(group);assert.equal(disposed,group.children.length);
  }
  assert.ok(entities>=6&&meshes>=entities);assert.ok(triangles<=3200,'Two-pond authored geometry budget: '+triangles);assert.equal(serialize(state),before);
 }
});

test('water tint remains the native five-step clarity view and the transparent film/fish water pivot are unchanged',()=>{
 const pond=view(owned.state).entities.find(e=>e.kind==='fishPond');
 for(const clarity of [undefined,0,250,500,750,1000]){const e={...pond,clarity},authored=fishPondParts(e),bed=authored.find(p=>p.feature==='native-water-bed');assert.equal(bed.color,waterStyle(clarity).water);assert.ok(bed.y+bed.height/2<WORLD_ART.species.fish.waterPlane);const film=pondSurfaceParts(e).find(p=>p.feature==='water-film');assert.equal(film.y,.27);assert.equal(film.y,WORLD_ART.species.fish.waterPlane);}
 assert.equal(fishPondParts({...pond,value:0}).some(p=>/fish|stock|feed/.test(p.feature)),false);
});

test('unstarted land and unowned equipment create no decorative purchase, starter fish or grant',()=>{
 const state=createState(),before=serialize(state),snapshot=view(state),fish=snapshot.entities.filter(e=>e.zone==='fish');assert.deepEqual(fish.map(e=>e.id),['fish.available']);for(const e of fish){assert.deepEqual(fishPondParts(e),[]);assert.deepEqual(fishCareParts(e),[]);}assert.equal(serialize(state),before);
 const s=deserialize(raw),es=view(s).entities.filter(e=>e.zone==='fish');for(const p of s.fish.ponds){assert.equal(es.some(e=>e.pondId===p.id&&e.equipment==='filter'),p.biofilter);assert.equal(es.some(e=>e.pondId===p.id&&e.equipment==='feeder'),ownsFishFeeder(s,p.id));}
});

test('motor, scheduled-feed and paid-credit cues follow distinct native fields without inventing contents',()=>{
 const es=view(owned.state).entities,air=es.find(e=>e.domainId==='aerator'),filter=es.find(e=>e.equipment==='filter'),feeder=es.find(e=>e.equipment==='feeder'),feed=es.find(e=>e.kind==='fishStation'&&e.domainId==='feed');
 for(const active of [false,true]){assert.equal(features({...air,active}).has('native-air-active'),active);assert.equal(features({...feeder,active}).has('native-feed-active'),active);assert.equal(features({...feed,active}).has('native-feed-pending'),active);}
 for(const automatic of [false,true])assert.equal(features({...air,automatic}).has('native-efficient-air'),automatic);
 for(const value of [0,1]){assert.equal(features({...filter,value}).has('native-filter-credit'),value>0);assert.equal(features({...feeder,value}).has('native-feeder-enabled'),value>0);}
 assert.deepEqual(fishCareParts({...feed,value:0,active:false}),fishCareParts({...feed,value:1000,active:false}),'Queued feed is not stored stock');for(const e of es)assert.equal(parts(e).some(p=>/contents|fish-stock/.test(p.feature)),false);
});
