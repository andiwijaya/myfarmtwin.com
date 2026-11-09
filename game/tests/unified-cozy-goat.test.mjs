import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {Group,Mesh,BoxGeometry,MeshLambertMaterial,Vector3,Raycaster} from 'three';
import {goatShelterParts,goatCareParts,createGoatCareMeshes,goatPaddockParts,goatFenceParts,goatGroundParts} from '../client/unified-cozy-goat.js';
import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';import {contactHeight} from '../client/unified-world-contact.js';import {readWorldSnapshot} from '../client/unified-world-model.js';import {goatSnapshot} from '../client/goat-scene-snapshot.js';
import {createState} from '../client/engine.js';import {serialize} from '../client/save-schema.js';import {makeOwnedGoatFarm} from '../../tools/unified-goat-farm.mjs';import {ZONE_REGISTRY} from '../client/unified-world-registry.js';
const raw=await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8'),farm=makeOwnedGoatFarm(raw),snapshot=readWorldSnapshot(farm.state,{goat:goatSnapshot(farm.state)}),material=new MeshLambertMaterial({vertexColors:true}),count=(parts,name)=>parts.filter(p=>p.feature===name).length;

test('straight boxes preserve six lit planes, bounds and real rays with fewer triangles; bevels retain their curved edge mesh',()=>{
 const [plain]=compileWorldParts([{x:0,y:0,z:0,width:1,height:1,depth:1,color:'#ba8a59',shape:'box'}],material),old=new Mesh(new BoxGeometry(1,1,1,2,2,2),material),[bevel]=compileWorldParts([{x:0,y:0,z:0,width:1,height:1,depth:1,color:'#ba8a59',shape:'bevel'}],material),root=new Group();root.userData.entityId='real-box';root.add(plain,bevel);assert.equal(plain.geometry.getAttribute('position').count/3,12);assert.equal(bevel.geometry.getAttribute('position').count/3,48);assert.deepEqual(plain.geometry.boundingBox.min.toArray(),[-.5,-.5,-.5]);assert.deepEqual(plain.geometry.boundingBox.max.toArray(),[.5,.5,.5]);
 const normals=plain.geometry.getAttribute('normal');assert.equal(new Set(Array.from({length:normals.count},(_,i)=>[normals.getX(i),normals.getY(i),normals.getZ(i)].join(','))).size,6);
 for(let axis=0;axis<3;axis++)for(const side of [-1,1])for(const a of [-.4,-.1,.3])for(const b of [-.35,.05,.4]){const origin=new Vector3(),direction=new Vector3();origin.setComponent(axis,side*2);origin.setComponent((axis+1)%3,a);origin.setComponent((axis+2)%3,b);direction.setComponent(axis,-side);const ray=new Raycaster(origin,direction),p=ray.intersectObject(plain)[0],o=ray.intersectObject(old)[0];assert.ok(p&&o);assert.ok(p.point.distanceTo(o.point)<1e-10);assert.ok(p.face.normal.distanceTo(o.face.normal)<1e-10);assert.equal(p.object.parent.userData.entityId,'real-box');}
 disposePartMeshes(root);old.geometry.dispose();
});

test('crafted shelter preserves native level vents, actual doorway, stable floor/cutaway and strict geometry budget',()=>{
 const base=snapshot.entities.find(e=>e.kind==='goatShelter');
 for(let level=0;level<3;level++){
  const e={...base,level,width:4+level*.8,depth:3+level*.4,height:2.1+level*.15},before=JSON.stringify(e),parts=goatShelterParts(e),root=new Group();root.userData.entityId=e.id;root.add(...compileWorldParts(parts,material));assert.equal(count(parts,'native-vent'),2*(level+1));assert.equal(count(parts,'roof'),2);assert.ok(root.children.length<=4);assert.ok(root.children.reduce((n,m)=>n+m.geometry.getAttribute('position').count/3,0)<3000);
  for(const m of root.children){const b=m.geometry.boundingBox;assert.ok(b.min.y>=-.00001&&b.max.y<4);assert.ok(b.min.x>=-e.width/2-.21&&b.max.x<=e.width/2+.21);assert.ok(b.min.z>=-e.depth/2-.21&&b.max.z<=e.depth/2+.21);}
  const hit=new Raycaster(new Vector3(0,.9,e.depth/2+.5),new Vector3(0,0,-1)).intersectObjects(root.children.filter(m=>m.userData.cutawayShell))[0];assert.ok(hit&&hit.distance>e.depth-.1,'An authored triangle blocks the native front opening');const floor=parts.find(p=>p.feature==='shelter-floor');assert.equal(floor.y+floor.height/2,.12);assert.equal(floor.fixed,true);assert.equal(contactHeight({x:e.x,z:e.z},[e]),.12);assert.equal(JSON.stringify(e),before);disposePartMeshes(root);
 }
});

test('native care upgrades preserve bounds and exact positive/zero contents; three actual steps agree with contact heights',()=>{
 for(const e of snapshot.entities.filter(e=>e.kind==='goatStation')){
  if(['hay','water'].includes(String(e.domainId)))for(const careUpgrade of [false,true])for(const ratio of [0,.25,1]){
   const native={...e,careUpgrade,value:e.capacity*ratio},before=JSON.stringify(native),parts=goatCareParts(native),root=new Group();root.add(...createGoatCareMeshes(native,material));assert.equal(count(parts,'enlarged-container')>0,careUpgrade);assert.equal(count(parts,'care-container')>0,!careUpgrade);assert.ok(root.children.length<=2);const fill=root.children.filter(m=>m.userData.nativeFill);assert.equal(fill.length,ratio>0?1:0);for(const m of fill){const b=m.geometry.boundingBox;assert.equal(m.userData.fillRatio,ratio);assert.ok(Math.abs(b.min.y-.24)<1e-6&&Math.abs(b.max.y-b.min.y-ratio*.12)<1e-6);assert.ok(b.max.y<.4);}
   for(const m of root.children){const b=m.geometry.boundingBox;assert.ok(b.min.y>=-.00001&&b.max.y<.66);assert.ok(b.min.x>=-e.width/2-.00001&&b.max.x<=e.width/2+.00001&&b.min.z>=-e.depth/2-.00001&&b.max.z<=e.depth/2+.00001);}assert.equal(JSON.stringify(native),before);disposePartMeshes(root);
  }
  if(e.domainId==='platform'){
   const root=new Group();root.position.set(e.x,0,e.z);root.userData.entityId=e.id;root.add(...createGoatCareMeshes(e,material));root.updateMatrixWorld(true);assert.equal(count(goatCareParts(e),'platform-step'),3);
   for(const dx of [-.5,-.38,-.1,0,.1,.38,.5])for(const dz of [-.4,0,.4]){const point={x:e.x+dx,z:e.z+dz},height=contactHeight(point,[e]),hit=new Raycaster(new Vector3(point.x,2,point.z),new Vector3(0,-1,0)).intersectObjects(root.children)[0];assert.ok(hit);assert.ok(Math.abs(hit.point.y-height)<.001);assert.equal(hit.object.parent.userData.entityId,e.id);}disposePartMeshes(root);
  }
  if(e.domainId==='clean'){assert.equal(count(goatCareParts({...e,value:100}),'native-dirt'),0);assert.equal(count(goatCareParts({...e,value:0}),'native-dirt'),5);}
 }
});

test('native paddock biomass alone creates forage and its new flat surface cannot bury goat feet',()=>{
 for(const e of snapshot.entities.filter(e=>e.kind==='paddock'))for(const ratio of [0,.001,.25,1]){
  const native={...e,value:e.capacity*ratio},before=JSON.stringify(native),parts=goatPaddockParts(native),root=new Group();root.add(...compileWorldParts(parts,material));assert.equal(count(parts,'native-forage'),ratio>0?27:0);assert.equal(parts.find(p=>p.feature==='native-pasture').y,.0003);for(const m of root.children){const b=m.geometry.boundingBox;assert.ok(b.min.y>=-.00001&&b.max.y<.1);assert.ok(b.min.x>=-e.width/2&&b.max.x<=e.width/2&&b.min.z>=-e.depth/2&&b.max.z<=e.depth/2);}
  const released=new Map();for(const m of root.children){released.set(m.geometry,0);m.geometry.addEventListener('dispose',()=>released.set(m.geometry,released.get(m.geometry)+1));}disposePartMeshes(root);disposePartMeshes(root);assert.ok([...released.values()].every(n=>n===1));assert.equal(JSON.stringify(native),before);
 }
});

test('Goat scenery needs ownership, stays flat/noninteractive and the existing fence entrance remains open',()=>{
 assert.deepEqual(goatGroundParts(readWorldSnapshot(createState())),[]);const before=serialize(farm.state),ground=goatGroundParts(snapshot);assert.ok(ground.length);assert.ok(ground.every(p=>p.y+p.height/2<.003));assert.equal(serialize(farm.state),before);
 const parts=goatFenceParts(),root=new Group();root.add(...compileWorldParts(parts,material));assert.equal(count(parts,'goat-fence'),19);const entry=ZONE_REGISTRY.goat.entry,maxZ=Math.max(...parts.map(p=>p.z)),hit=new Raycaster(new Vector3(entry.x,.36,maxZ+1),new Vector3(0,0,-1)).intersectObjects(root.children)[0];assert.ok(hit&&hit.distance>1.5,'Native fence opening was filled');disposePartMeshes(root);
});

test.after(()=>material.dispose());
