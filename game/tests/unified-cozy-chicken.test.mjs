import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {Group,MeshLambertMaterial,Raycaster,Vector3} from 'three';
import {chickenCoopParts,chickenCareParts,createChickenCareMeshes,chickenYardParts,chickenGroundParts} from '../client/unified-cozy-chicken.js';
import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';
import {readWorldSnapshot} from '../client/unified-world-model.js';import {chickenSnapshot} from '../client/chicken-snapshot.js';import {contactHeight} from '../client/unified-world-contact.js';
import {createState,dispatch} from '../client/engine.js';import {serialize} from '../client/save-schema.js';
import {makeOwnedChickenFarm} from '../../tools/unified-chicken-farm.mjs';

const raw=await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8'),farm=makeOwnedChickenFarm(raw),material=new MeshLambertMaterial({vertexColors:true});
const snapshot=state=>readWorldSnapshot(state,{chicken:chickenSnapshot(state)});
const count=(parts,name)=>parts.filter(p=>p.feature===name).length;
test('crafted coop has a true opening, native door state/vents, cutaway floor and bounded owned geometry',()=>{
 const e=snapshot(farm.state).entities.find(e=>e.kind==='coop');
 for(let level=0;level<3;level++)for(const doorOpen of [false,true]){
  const coop={...e,level,width:2+level,depth:2+level,doorOpen},before=JSON.stringify(coop),parts=chickenCoopParts(coop),root=new Group();root.userData.entityId=coop.id;root.add(...compileWorldParts(parts,material));assert.equal(count(parts,'native-vent'),2*(level+1));assert.equal(count(parts,'roof'),2);assert.equal(count(parts,'native-door'),1);assert.equal(parts.find(p=>p.feature==='native-door').x===0,!doorOpen);assert.ok(root.children.length<=5);
  for(const mesh of root.children){const b=mesh.geometry.boundingBox;assert.ok(b.min.y>=-.00001&&b.max.y<3);assert.ok(b.min.x>=-coop.width/2-.21&&b.max.x<=coop.width/2+.21);assert.ok(b.min.z>=-coop.depth/2-.21&&b.max.z<=coop.depth/2+.21);}
  const shell=root.children.filter(m=>m.userData.cutawayShell),ray=new Raycaster(new Vector3(0,.5,coop.depth/2+.4),new Vector3(0,0,-1));const first=ray.intersectObjects(shell)[0];assert.ok(first);assert.equal(first.distance>.5,doorOpen,'Actual doorway triangles disagree with native door');
  const floor=parts.find(p=>p.feature==='coop-floor');assert.equal(floor.y+floor.height/2,.12);assert.equal(floor.fixed,true);assert.equal(contactHeight({x:coop.x,z:coop.z},[coop]),.12);assert.equal(JSON.stringify(coop),before);
  const released=new Map();for(const m of root.children){released.set(m.geometry,0);m.geometry.addEventListener('dispose',()=>released.set(m.geometry,released.get(m.geometry)+1));}disposePartMeshes(root);disposePartMeshes(root);assert.ok([...released.values()].every(n=>n===1));
 }
 assert.deepEqual(chickenCoopParts({...e,kind:'available'}),[]);
});

test('native read-only care snapshot supplies door/inside flags without new clock or save changes',()=>{
 let state=farm.state;const initial=serialize(state),without=readWorldSnapshot(state);assert.equal(without.entities.find(e=>e.kind==='coop').doorOpen,undefined);assert.equal(serialize(state),initial);const unpaused=dispatch(state,{id:state.revision+1,type:'pause'});assert.ok(unpaused.ok);state=unpaused.state;
 for(let n=0;n<24;n++){
  const before=serialize(state),care=chickenSnapshot(state),view=snapshot(state),coop=view.entities.find(e=>e.kind==='coop');assert.equal(coop.doorOpen,care.doorOpen);assert.ok(view.entities.filter(e=>e.kind==='hen').every(e=>e.inside===!care.doorOpen));assert.equal(serialize(state),before);const r=dispatch(state,{id:state.revision+1,type:'tick'});assert.ok(r.ok);state=r.state;
 }
 assert.equal(serialize(farm.state),initial);
});

test('native nest counts and exact stock volume remain independent from shells and paid feeder equipment',()=>{
 for(const e of snapshot(farm.state).entities.filter(e=>e.kind==='station')){
  if(e.domainId==='nest')for(const capacity of [4,6,8])for(const value of [0,1,capacity]){const parts=chickenCareParts({...e,capacity,value});assert.equal(count(parts,'native-egg'),value);assert.equal(count(parts,'nest-bedding'),capacity);for(const egg of parts.filter(p=>p.feature==='native-egg'))assert.ok(Math.abs(egg.y-egg.height/2-.17)<1e-9);}
  if(['feeder','drinker'].includes(String(e.domainId)))for(const ratio of [0,.25,1])for(const automatic of [false,true]){
   const entity={...e,value:e.capacity*ratio,automatic,active:true},before=JSON.stringify(entity),root=new Group();root.userData.entityId=e.id;root.add(...createChickenCareMeshes(entity,material));const fill=root.children.filter(m=>m.userData.nativeFill);assert.equal(fill.length,ratio>0?1:0);for(const m of fill){assert.equal(m.userData.fillRatio,ratio);assert.ok(Math.abs(m.geometry.boundingBox.min.y-.2)<1e-6);assert.ok(Math.abs(m.geometry.boundingBox.max.y-m.geometry.boundingBox.min.y-ratio*.2)<1e-6);assert.ok(m.geometry.boundingBox.max.y<.46);}
   const parts=chickenCareParts(entity);assert.equal(count(parts,'auto-feeder')>0,e.domainId==='feeder'&&automatic);assert.ok(root.children.length<=2);for(const m of root.children){const b=m.geometry.boundingBox;assert.ok(b.min.y>=-.00001&&b.max.y<=1.1);assert.ok(b.min.x>=-e.width/2-.00001&&b.max.x<=e.width/2+.00001);assert.ok(b.min.z>=-e.depth/2-.00001&&b.max.z<=e.depth/2+.00001);}assert.equal(JSON.stringify(entity),before);disposePartMeshes(root);
  }
  if(e.domainId==='clean'){assert.equal(count(chickenCareParts({...e,value:100}),'native-dirt'),0);assert.equal(count(chickenCareParts({...e,value:0}),'native-dirt'),5);}
 }
});

test('rounded native yard preserves the front gate, actual shade only and flat noninteractive ground',()=>{
 const unvisited=snapshot(createState());assert.deepEqual(chickenGroundParts(unvisited),[]);
 const before=serialize(farm.state),s=snapshot(farm.state),layout=s.chickenLayout;
 for(const shade of [null,layout.shade]){const parts=chickenYardParts({...layout,shade}),root=new Group();root.add(...compileWorldParts(parts,material));assert.equal(count(parts,'native-shade'),shade?5:0);assert.equal(count(parts,'chicken-fence'),19);const b=layout.fence,ray=new Raycaster(new Vector3(b.gateX,.36,b.maxZ+1),new Vector3(0,0,-1)),hits=ray.intersectObjects(root.children);assert.ok(hits.length);assert.ok(hits[0].distance>1.5,'Native gate was blocked');disposePartMeshes(root);}
 const ground=chickenGroundParts(s);assert.ok(ground.length>0);assert.ok(ground.every(p=>p.y+p.height/2<.003));assert.equal(serialize(farm.state),before);
});

test.after(()=>material.dispose());
