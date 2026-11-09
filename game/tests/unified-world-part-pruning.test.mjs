import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';
import {Group,MeshLambertMaterial,DoubleSide,Vector3,Raycaster,OrthographicCamera,Box3} from 'three';
import {compileWorldParts,disposePartMeshes} from '../client/unified-world-part-meshes.js';import {configureFixedFarmParts,FARM_PART_MAX_Y_SCALE} from '../client/unified-world-part-pruning.js';import {WORLD_ART} from '../client/unified-world-art.js';import {createFarmCamera} from '../client/unified-world-camera.js';
import {cowBarnParts} from '../client/unified-cow-barn.js';import {chickenCoopParts} from '../client/unified-cozy-chicken.js';import {goatShelterParts,goatPaddockParts} from '../client/unified-cozy-goat.js';import {createCropMeshes} from '../client/unified-cozy-crops.js';import {readWorldSnapshot} from '../client/unified-world-model.js';import {deserialize,serialize} from '../client/save-schema.js';
import {cowCareParts} from '../client/unified-cow-care.js';import {cowSnapshot} from '../client/cow-scene-snapshot.js';import {createChickenCareMeshes} from '../client/unified-cozy-chicken.js';import {createGoatCareMeshes} from '../client/unified-cozy-goat.js';import {makeBasicWorldFarm} from '../../tools/unified-basic-world-farm.mjs';

const plain=new MeshLambertMaterial({vertexColors:true}),pruned=configureFixedFarmParts(new MeshLambertMaterial({vertexColors:true}));
const root=(parts,material)=>{const group=new Group();group.userData.entityId='same-native-owner';group.add(...compileWorldParts(parts,material));group.updateMatrixWorld(true);return group;};
const triangles=group=>group.children.reduce((n,m)=>n+m.geometry.getAttribute('position').count/3,0);
function matchingRays(before,after,grid,headings){
 const bounds=new Box3().setFromObject(before),center=bounds.getCenter(new Vector3()),extent=Math.max(...bounds.getSize(new Vector3()).toArray())*1.1,camera=new OrthographicCamera(-extent,extent,extent,-extent,.1,200),ray=new Raycaster();let hits=0;
 for(const scaleY of [.965,1,FARM_PART_MAX_Y_SCALE]){
  before.scale.y=after.scale.y=scaleY;before.updateMatrixWorld(true);after.updateMatrixWorld(true);
  for(let h=0;h<headings;h++){
   const angle=h/headings*Math.PI*2;camera.position.set(center.x+30*Math.sin(angle),center.y+30/Math.sqrt(2),center.z+30*Math.cos(angle));camera.lookAt(center);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);
   for(let y=0;y<grid;y++)for(let x=0;x<grid;x++){
    ray.setFromCamera({x:(x+.5)/grid*2-1,y:(y+.5)/grid*2-1},camera);const a=ray.intersectObjects(before.children,false)[0],b=ray.intersectObjects(after.children,false)[0];assert.equal(!!b,!!a,'Visible geometry disappeared');if(!a)continue;hits++;assert.ok(a.point.distanceTo(b.point)<1e-7,'Visible first hit moved');assert.ok(a.normal.distanceTo(b.normal)<1e-6,'Visible shading normal changed');assert.equal(b.object.parent.userData.entityId,a.object.parent.userData.entityId);const ca=a.object.geometry.getAttribute('color'),cb=b.object.geometry.getAttribute('color');assert.deepEqual([ca.getX(a.face.a),ca.getY(a.face.a),ca.getZ(a.face.a)],[cb.getX(b.face.a),cb.getY(b.face.a),cb.getZ(b.face.a)]);
   }
  }
 }
 assert.ok(hits>0);return hits;
}

test('pruned geometry preserves exact surviving attributes, original bounds/order, all visible rays and shading through the scale/view envelope',()=>{
 const parts=['box','bevel','cylinder','foliage','surface','disc','leaf','gable'].map((shape,i)=>({x:(i%4-1.5)*1.5,y:1+(i%2)*.5,z:(Math.floor(i/4)-.5)*2,width:.9,height:shape==='surface'||shape==='disc'?.001:1.1,depth:.8,color:i%2?'#ba8a59':'#97b866',shape,rotation:i*.13,pitch:i===2?.3:0,tilt:i===1?.2:0})),before=root(parts,plain),after=root(parts,pruned);
 assert.ok(triangles(after)<triangles(before));assert.equal(after.children.length,before.children.length);
 for(let i=0;i<before.children.length;i++){
  const a=before.children[i].geometry,b=after.children[i].geometry;assert.deepEqual(b.boundingBox,a.boundingBox);assert.deepEqual(b.boundingSphere,a.boundingSphere);const old=a.getAttribute('position').array,position=b.getAttribute('position').array,normal=b.getAttribute('normal').array,color=b.getAttribute('color').array;let cursor=0;
  for(let j=0;j<position.length;j+=9){while(cursor<old.length&&!position.subarray(j,j+9).every((v,k)=>v===old[cursor+k]))cursor+=9;assert.ok(cursor<old.length,'Surviving triangle order/coordinates changed');for(const [name,values]of [['normal',normal],['color',color]])assert.deepEqual(values.subarray(j,j+9),a.getAttribute(name).array.subarray(cursor,cursor+9));cursor+=9;}
  const stats=b.userData.worldTriangleStats;assert.equal(stats.before-stats.after,stats.removed);assert.ok(stats.removed>0);
 }
 matchingRays(before,after,13,16);disposePartMeshes(before);disposePartMeshes(after);
});

test('actual Cow/Chicken/Goat native parts keep visible ownership, bounds, colors, normals and immutable source saves',async()=>{
 const state=deserialize(await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8')),raw=serialize(state),snapshot=readWorldSnapshot(state),builders={cowBarn:cowBarnParts,coop:chickenCoopParts,goatShelter:goatShelterParts,paddock:goatPaddockParts};
 for(const e of snapshot.entities){const build=builders[e.kind];if(!build)continue;const parts=build(e),before=root(parts,plain),after=root(parts,pruned);assert.ok(triangles(after)<triangles(before),e.kind+' has no proven reduction');matchingRays(before,after,7,8);assert.deepEqual(new Box3().setFromObject(after),new Box3().setFromObject(before));let disposed=0;for(const mesh of after.children)mesh.geometry.addEventListener('dispose',()=>disposed++);disposePartMeshes(before);disposePartMeshes(after);disposePartMeshes(after);assert.equal(disposed,after.children.length);}
 assert.equal(serialize(state),raw);
});

test('rolling crop canopies explicitly retain every face while native static beds can prune',()=>{
 const e={id:'field.plot.0',zone:'field',kind:'plot',domainId:0,x:0,z:0,width:.92,depth:.92,height:.13,value:.9,covered:true,crop:{type:'lettuce',stage:3,progress:1,quality:.8}},before=new Group(),after=new Group();before.add(...createCropMeshes(e,plain));after.add(...createCropMeshes(e,pruned));let removed=0;
 for(let i=0;i<after.children.length;i++){const a=before.children[i],b=after.children[i],stats=b.geometry.userData.worldTriangleStats;removed+=stats.removed;if(!b.userData.cropLeaf)continue;assert.equal(stats.removed,0);assert.equal(stats.preserveFaces,true);for(const name of ['position','normal','color'])assert.deepEqual(b.geometry.getAttribute(name).array,a.geometry.getAttribute(name).array);}
 assert.ok(removed>0);disposePartMeshes(before);disposePartMeshes(after);
});

test('native quantity volumes preserve their actual vertex height and every face, not only original metadata bounds',()=>{
 const state=makeBasicWorldFarm().state,snapshot=readWorldSnapshot(state,{cow:cowSnapshot(state)}),groups=[];
 for(const e of snapshot.entities){
  if(e.kind==='cowStation')for(const {part}of cowCareParts(e).fills){const root=new Group();root.add(...compileWorldParts([part],pruned,{preserveFaces:true}));groups.push(root);for(const mesh of root.children){const p=mesh.geometry.getAttribute('position');let low=Infinity,high=-Infinity;for(let i=0;i<p.count;i++){low=Math.min(low,p.getY(i));high=Math.max(high,p.getY(i));}assert.ok(Math.abs(high-low-part.height)<1e-6);assert.equal(mesh.geometry.userData.worldTriangleStats.removed,0);}}
  if(e.kind==='station'||e.kind==='goatStation')for(const ratio of [.25,1]){const native={...e,value:(e.capacity||1)*ratio},root=new Group();root.add(...(e.kind==='station'?createChickenCareMeshes(native,pruned):createGoatCareMeshes(native,pruned)));groups.push(root);for(const mesh of root.children.filter(m=>m.userData.nativeFill)){const p=mesh.geometry.getAttribute('position');let low=Infinity,high=-Infinity;for(let i=0;i<p.count;i++){low=Math.min(low,p.getY(i));high=Math.max(high,p.getY(i));}assert.ok(Math.abs(high-low-mesh.userData.nativeFillHeight)<1e-6);assert.equal(mesh.geometry.userData.worldTriangleStats.removed,0);}}
 }
 assert.ok(groups.length>0);for(const root of groups)disposePartMeshes(root);
});

test('unconfigured or double-sided geometry is never pruned; the actual camera remains inside the supported elevation cone',()=>{
 const double=new MeshLambertMaterial({side:DoubleSide});assert.throws(()=>configureFixedFarmParts(double),RangeError);const parts=[{x:0,y:.5,z:0,width:1,height:1,depth:1,color:'#ffffff',shape:'box'}],a=root(parts,plain),b=root(parts,pruned);assert.equal(triangles(a),12);assert.ok(triangles(b)<12);pruned.side=DoubleSide;const c=root(parts,pruned);assert.equal(triangles(c),12);pruned.side=plain.side;double.dispose();for(const g of [a,b,c])disposePartMeshes(g);
 const camera=createFarmCamera();for(let h=0;h<4;h++){const f=camera.frame(1),actual=Math.atan2(1,Math.hypot(f.dx,f.dz))*180/Math.PI;assert.ok(Math.abs(actual-WORLD_ART.projection.elevationDegrees)<1e-10);camera.rotate(1);}assert.ok(1+.035<=FARM_PART_MAX_Y_SCALE);
});
test.after(()=>{plain.dispose();pruned.dispose();});
