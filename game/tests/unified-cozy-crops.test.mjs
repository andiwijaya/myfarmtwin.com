import test from 'node:test';import assert from 'node:assert/strict';
import {Group,MeshLambertMaterial,Vector3,Raycaster} from 'three';
import {cropParts,cropSway} from '../client/unified-world-crops.js';import {cropBedParts,createCropMeshes,cropPumpParts} from '../client/unified-cozy-crops.js';import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';import {worldVisualKey} from '../client/unified-world-visual-key.js';import {irrigationRuns,irrigationParts} from '../client/unified-world-irrigation.js';import {readWorldSnapshot} from '../client/unified-world-model.js';import {createState,pumpCovers} from '../client/engine.js';import {serialize} from '../client/save-schema.js';import {makeBasicWorldFarm} from '../../tools/unified-basic-world-farm.mjs';

const base={id:'field.plot.0',kind:'plot',zone:'field',domainId:0,x:-10,z:0,width:.92,depth:.92,height:.13,value:.2,covered:false};
test('curved crops stay inside the native bed through all stages and bounded sway, with real fruit/leaf metadata',()=>{
 const material=new MeshLambertMaterial({vertexColors:true}),point=new Vector3();
 for(const type of ['lettuce','tomato'])for(let stage=0;stage<4;stage++){
  const e={...base,crop:{type,stage,progress:.5,quality:.8}},before=JSON.stringify(e),root=new Group(),parts=cropParts(e.crop);root.userData.entityId=e.id;root.add(...createCropMeshes(e,material));const leaves=root.children.filter(m=>m.userData.cropLeaf);assert.equal(leaves.length,type==='lettuce'?4:2);assert.equal(leaves.reduce((n,m)=>n+m.userData.cropLeafCount,0),parts.filter(p=>p.leaf).length);assert.ok(root.children.length<=6,'Bound native draw groups');
  const features={};for(const m of root.children)for(const[k,v]of Object.entries(m.userData.structureFeatureCounts))features[k]=(features[k]||0)+v;assert.equal(features['tomato-fruit']||0,type==='tomato'&&stage===3?6:0);assert.equal(features['tomato-stake']||0,type==='tomato'&&stage>=2?2:0);
  for(const sway of [-.022,0,.022]){for(const m of leaves)m.rotation.z=sway;root.updateMatrixWorld(true);for(const m of root.children){const vertices=m.geometry.getAttribute('position'),normals=m.geometry.getAttribute('normal');for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(m.matrixWorld);assert.ok(Math.abs(point.x)<=.46001&&Math.abs(point.z)<=.46001,`Footprint ${type}/${stage}: ${point.toArray()}`);assert.ok(point.y>=-.00001&&point.y<=1,`Bed floor/ceiling ${point.y}`);if(m.userData.cropLeaf)assert.ok(point.y>=.115,`Plant base exceeded soil allowance ${type}/${stage}: ${point.y}`);assert.ok(Math.abs(Math.hypot(normals.getX(i),normals.getY(i),normals.getZ(i))-1)<1e-5);}}}
  for(const m of leaves)m.rotation.z=cropSway(5000,1,true);assert.ok(leaves.every(m=>m.rotation.z===0));root.updateMatrixWorld(true);const hit=new Raycaster(new Vector3(0,2,0),new Vector3(0,-1,0)).intersectObjects(root.children)[0];assert.ok(hit);assert.equal(hit.object.parent.userData.entityId,e.id);assert.equal(JSON.stringify(e),before);
  const released=new Map();for(const m of root.children){released.set(m.geometry,0);m.geometry.addEventListener('dispose',()=>released.set(m.geometry,released.get(m.geometry)+1));}disposePartMeshes(root);disposePartMeshes(root);assert.ok([...released.values()].every(n=>n===1));
 }
 material.dispose();
});

test('soil and installed drip follow actual native water/coverage, without changing values or adding water',()=>{
 const dry=cropBedParts(base),wet=cropBedParts({...base,value:.9}),body=parts=>parts.find(p=>p.feature==='native-soil');assert.notEqual(body(dry).color,body(wet).color);assert.equal(body(dry).y+body(dry).height/2,.12);assert.equal(body(wet).y+body(wet).height/2,.12);assert.equal(dry.some(p=>p.feature==='installed-drip'),false);assert.ok(cropBedParts({...base,covered:true}).some(p=>p.feature==='installed-drip'));assert.equal(cropBedParts({...base,kind:'cow'}).length,0);
 const state=createState(),raw=serialize(state),snapshot=readWorldSnapshot(state,{coveredPlotIds:state.plots.map(p=>p.id)});assert.equal(snapshot.coveredPlotIds.length,0);assert.deepEqual(irrigationParts(snapshot),[]);assert.equal(serialize(state),raw);
});

test('rounded pump and pipe geometry represents only installed native coverage and paid motor flags',()=>{
 const farm=makeBasicWorldFarm(),raw=serialize(farm.state),snapshot=readWorldSnapshot(farm.state,{coveredPlotIds:farm.state.plots.filter(pumpCovers).map(p=>p.id)}),pump=snapshot.entities.find(e=>e.kind==='pump'),runs=irrigationRuns(snapshot),pipes=irrigationParts(snapshot),material=new MeshLambertMaterial({vertexColors:true});assert.ok(runs.length>0);assert.equal(pipes.filter(p=>p.feature==='installed-pipe').length,runs.length);assert.equal(pipes.filter(p=>p.feature==='pipe-collar').length,runs.length*2);assert.deepEqual(irrigationParts({...snapshot,irrigationKnown:false}),[]);
 for(const efficient of [false,true]){const e={...pump,efficient},parts=cropPumpParts(e),root=new Group();root.add(...compileWorldParts(parts,material));assert.equal(parts.filter(p=>p.feature==='efficient-motor').length,efficient?3:0);for(const m of root.children){const b=m.geometry.boundingBox;assert.ok(b.min.x>=-.40001&&b.max.x<=.40001&&b.min.z>=-.40001&&b.max.z<=.40001);assert.ok(b.min.y>=-.00001&&b.max.y<=1);}disposePartMeshes(root);}
 const root=new Group();root.add(...compileWorldParts(pipes,material));for(const m of root.children)assert.ok(m.geometry.boundingBox.min.y>=-.00001,'Installed pipe floats below the ground');assert.ok(root.children.length<=2);disposePartMeshes(root);material.dispose();assert.equal(serialize(farm.state),raw);
});

test('plot geometry cache ignores nonvisual progress but preserves stage, moisture, ownership and live actor changes',()=>{
 const e={...base,crop:{type:'tomato',stage:1,progress:.25,quality:.9}},key=worldVisualKey(e);assert.equal(worldVisualKey({...e,value:.3,crop:{...e.crop,progress:.4,quality:.1}}),key);for(const other of [{...e,value:.8},{...e,covered:true},{...e,crop:{...e.crop,stage:2}},{...e,crop:{...e.crop,type:'lettuce'}},{...e,crop:undefined},{...e,x:e.x+1}])assert.notEqual(worldVisualKey(other),key);
 const cow={...base,kind:'cow',id:'cow.animal.a',value:1};assert.notEqual(worldVisualKey(cow),worldVisualKey({...cow,value:2}));
});
