import test from 'node:test';import assert from 'node:assert/strict';
import {Group,MeshLambertMaterial,Vector3} from 'three';
import {cropGrowthSize,cropModelSize,gardenVariant,createGardenGrowth} from '../client/garden-growth.js';
import {createCropMeshes} from '../client/unified-cozy-crops.js';
import {disposePartMeshes} from '../client/unified-world-part-meshes.js';
import {CROPS} from '../client/config.js';
const entity=(id,progress=.5)=>({id,kind:'plot',zone:'field',domainId:0,x:0,z:0,width:.92,depth:.92,height:.13,value:.5,crop:{type:'tomato',stage:2,progress,quality:1,plantedTick:1}});

test('garden growth remains bounded by observed native progress, eases once and never grows from elapsed render time',()=>{
 const growth=createGardenGrowth(),a=entity('field.plot.0'),before=JSON.stringify(a);growth.observe([a],0);const size=growth.sample(a.id,0,false);assert.equal(growth.sample(a.id,99999,false),size);
 const b=entity(a.id,.8);growth.observe([b],100000);const start=growth.sample(a.id,100000,false),middle=growth.sample(a.id,100160,false),end=growth.sample(a.id,100320,false);assert.ok(start<middle&&middle<end);assert.equal(end,cropGrowthSize(b.crop)/cropModelSize('tomato',2));assert.equal(growth.sample(a.id,200000,false),end);
 growth.observe([entity(a.id,.95)],200001);assert.equal(growth.sample(a.id,200002,true),cropGrowthSize(entity(a.id,.95).crop)/cropModelSize('tomato',2));assert.equal(JSON.stringify(a),before);
 growth.observe([],200003);assert.equal(growth.sample(a.id,200004,false),1);growth.reset();
});
test('all species derive monotone size from native stage/progress; corn remains seed first then grows to 2.45',()=>{
 for(const type of ['lettuce','tomato','corn']){let previous=0;for(let i=0;i<=1000;i++){const progress=i/1000,stage=CROPS[type].stages.filter(p=>progress>=p).length-1,size=cropGrowthSize({type,stage,progress});assert.ok(size>=previous-1e-9,type+' size regression');previous=size;}assert.ok(previous>0);}
 assert.equal(cropGrowthSize({type:'corn',stage:4,progress:1}),2.45);
});
test('variation is stable, bounded and distinct without any simulation RNG',()=>{
 const variants=Array.from({length:24},(_,i)=>gardenVariant('field.plot.'+i,0));assert.ok(new Set(variants.map(v=>JSON.stringify(v))).size>20);
 for(let i=0;i<24;i++){assert.deepEqual(variants[i],gardenVariant('field.plot.'+i,0));assert.ok(variants[i].width>=.88&&variants[i].width<=1);assert.ok(variants[i].height>=.94&&variants[i].height<=1.02);assert.ok(Math.abs(variants[i].turn)<=.15);}
});
test('plant meshes share geometry and keep it alive until every owning bed releases, exactly once',()=>{
 const material=new MeshLambertMaterial({vertexColors:true}),a=new Group(),b=new Group();a.add(...createCropMeshes(entity('field.plot.0'),material));b.add(...createCropMeshes(entity('field.plot.1'),material));
 const x=a.children.find(m=>m.userData.cropPlant),y=b.children.find(m=>m.userData.cropPlant);assert.equal(x.geometry,y.geometry);assert.equal(x.material,y.material);assert.notDeepEqual(x.userData.gardenVariant,y.userData.gardenVariant);
 let released=0;x.geometry.addEventListener('dispose',()=>released++);disposePartMeshes(a);disposePartMeshes(a);assert.equal(released,0);assert.equal(x.geometry.userData.gardenRefs,1);disposePartMeshes(b);disposePartMeshes(b);assert.equal(released,1);material.dispose();
});
test('all growth stages, variation and wind remain inside a clear plot slot with bounded corn height',()=>{
 const material=new MeshLambertMaterial({vertexColors:true}),v=new Vector3();
 for(const type of ['lettuce','tomato','corn'])for(let stage=0;stage<CROPS[type].stages.length;stage++)for(const phase of [0,.5,.999]){
  const a=CROPS[type].stages[stage],b=CROPS[type].stages[stage+1]??a,progress=a+(b-a)*phase,e={...entity('field.plot.23'),crop:{type,stage,progress,quality:1,plantedTick:1}},group=new Group();group.add(...createCropMeshes(e,material));
  for(const m of group.children)if(m.userData.cropPlant){const variant=m.userData.gardenVariant;m.scale.set(variant.width,cropGrowthSize(e.crop)/cropModelSize(type,stage)*variant.height,variant.width);m.rotation.z=.022;}
  group.updateMatrixWorld(true);for(const m of group.children){const p=m.geometry.getAttribute('position');for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(m.matrixWorld);assert.ok(Math.abs(v.x)<=.62&&Math.abs(v.z)<=.55,`${type}/${stage} overlaps path/neighbor envelope`);assert.ok(v.y>=-.00001&&v.y<3,`${type}/${stage} height envelope`);}}
  disposePartMeshes(group);
 }
 material.dispose();
});
