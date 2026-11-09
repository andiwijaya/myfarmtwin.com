import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {MeshLambertMaterial,Group} from 'three';
import {contactHeight} from '../client/unified-world-contact.js';import {cowBarnParts} from '../client/unified-cow-barn.js';
import {cowCareParts} from '../client/unified-cow-care.js';import {cowYardParts,cowFenceParts} from '../client/unified-cow-yard.js';import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';import {readWorldSnapshot} from '../client/unified-world-model.js';import {cowSnapshot} from '../client/cow-scene-snapshot.js';import {makeFullWorldFarm} from '../../tools/unified-full-farm.mjs';import {serialize} from '../client/save-schema.js';import {ZONE_REGISTRY,WORLD_BOUNDS} from '../client/unified-world-registry.js';

const farm=makeFullWorldFarm(await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8'));
test('authored floor and milking platform match the existing actual sprite contact surfaces',()=>{
 const snapshot=readWorldSnapshot(farm.state),barn=snapshot.entities.find(e=>e.kind==='cowBarn'),stand=snapshot.entities.find(e=>e.id==='cow.station.stand'),parts=cowBarnParts(barn),floor=parts.find(p=>p.feature==='barn-floor');assert.equal(floor.y+floor.height/2,contactHeight(barn,snapshot.entities));for(const p of parts.filter(p=>p.feature==='floor-plank'))assert.ok(Math.abs(p.y+p.height/2-contactHeight(barn,snapshot.entities))<.001);for(const p of parts.filter(p=>p.feature==='bedding'))assert.ok(Math.abs(p.y-p.height/2-contactHeight(barn,snapshot.entities))<.001);
 const care=cowCareParts(stand).shell,base=care.find(p=>p.feature==='body');assert.equal(base.y+base.height/2,contactHeight(stand,snapshot.entities));for(const p of care.filter(p=>p.feature==='stand-plank'))assert.ok(Math.abs(p.y+p.height/2-contactHeight(stand,snapshot.entities))<.001);
});
test('care geometry follows exact native supply, upgrades, cleanliness and cooler status',()=>{
 const before=serialize(farm.state),snapshot=readWorldSnapshot(farm.state,{cow:cowSnapshot(farm.state)}),stations=snapshot.entities.filter(e=>e.kind==='cowStation'),material=new MeshLambertMaterial({vertexColors:true});assert.equal(stations.length,7);
 for(const e of stations){
  const original=cowCareParts(e);assert.ok(original.shell.length>0);assert.deepEqual(cowCareParts(e),original);
  for(const value of [0,1,e.capacity/2,e.capacity,e.capacity*2]){
   const copy={...e,value},parts=cowCareParts(copy),ratio=Number.isFinite(value)&&e.capacity>0?Math.max(0,Math.min(1,value/e.capacity)):0;assert.equal(parts.fills.length,ratio>0?1:0);
   for(const f of parts.fills){assert.equal(f.ratio,ratio);assert.ok(f.part.height>0);assert.ok(f.part.color!=='');}
   const root=new Group();root.add(...compileWorldParts(parts.shell,material));for(const fill of parts.fills)root.add(...compileWorldParts([fill.part],material));for(const m of root.children){assert.ok(m.geometry.boundingBox.min.y>=-.00001);assert.ok(m.geometry.boundingBox.max.y<1.5);}disposePartMeshes(root);
  }
  assert.equal(cowCareParts({...e,value:0}).shell.some(p=>p.feature==='native-feed-strand'),false);
  if(e.domainId==='water')for(const careUpgrade of [false,true])assert.equal(cowCareParts({...e,careUpgrade}).shell.some(p=>p.feature==='upgraded-trough'),careUpgrade);
  if(e.equipment==='cooler')assert.notDeepEqual(cowCareParts({...e,status:'off'}),cowCareParts({...e,status:'cooling'}));
  if(e.domainId==='stand')assert.equal(cowCareParts({...e,value:20}).shell.some(p=>p.feature==='native-stand-dirt'),true);
 }
 assert.deepEqual(cowCareParts({...stations[0],kind:'cow'}),{shell:[],fills:[]});material.dispose();assert.equal(serialize(farm.state),before);
});

test('cow scenery has no invented stock, keeps care corridor open, bounds and native gate',()=>{
 const snapshot=readWorldSnapshot(farm.state),before=serialize(farm.state),parts=cowYardParts(snapshot),fence=cowFenceParts();assert.deepEqual(cowYardParts({...snapshot,cowStarted:false}),[]);assert.deepEqual(cowYardParts(snapshot),parts);
 for(const p of parts){assert.ok(p.x-p.width/2>=WORLD_BOUNDS.minX&&p.x+p.width/2<=WORLD_BOUNDS.maxX);assert.ok(p.z-p.depth/2>=WORLD_BOUNDS.minZ&&p.z+p.depth/2<=WORLD_BOUNDS.maxZ);if(p.feature==='grass-tuft'){assert.ok(p.x>=18.8||p.z>=12.4);assert.ok(p.height<.25);}}
 const b=ZONE_REGISTRY.cow.bounds,gate=ZONE_REGISTRY.cow.entry.x;for(const p of fence)if(p.z<b.minZ)assert.ok(Math.abs(p.x-gate)>=2.2||p.height<.2&&p.width/2<Math.abs(p.x-gate)-2.2);
 const mat=new MeshLambertMaterial({vertexColors:true}),root=new Group();root.add(...compileWorldParts(parts,mat));assert.ok(root.children.length<=2);disposePartMeshes(root);mat.dispose();assert.equal(serialize(farm.state),before);
});
