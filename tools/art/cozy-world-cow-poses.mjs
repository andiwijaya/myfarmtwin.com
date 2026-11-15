import {Group,BufferGeometry,Float32BufferAttribute,Quaternion,Vector3} from 'three';
import {groundRest} from './cozy-world-pose-tools.mjs';

// Partition the original authored rings without changing any triangle or
// standing-position vertex. Duplication occurs only on an existing knee ring.
function limbPart(source,cut,lower){
 const out=new BufferGeometry(),map=new Map(),arrays=Object.fromEntries(Object.keys(source.attributes).map(k=>[k,[]])),indices=[],sourceIndices=source.index.array,p=source.getAttribute('position');
 for(let i=0;i<sourceIndices.length;i+=3){const tri=[...sourceIndices.slice(i,i+3)],isLower=Math.max(...tri.map(v=>p.getY(v)))<=cut+1e-6;if(isLower!==lower)continue;for(const old of tri){if(!map.has(old)){map.set(old,map.size);for(const[name,attr]of Object.entries(source.attributes))for(let c=0;c<attr.itemSize;c++)arrays[name].push(attr.array[old*attr.itemSize+c]);}indices.push(map.get(old));}}
 for(const[name,values]of Object.entries(arrays))out.setAttribute(name,new Float32BufferAttribute(values,source.getAttribute(name).itemSize));out.setIndex(indices);return out;
}
export function extendCowPoses(created){
 const{root,animations}=created,neck=new Group();neck.name='neck';neck.position.set(.55,1.1,0);root.add(neck);root.updateMatrixWorld(true);
 for(const name of ['rising_neck','throat_dewlap','head','woven_collar','collar_buckle','ear_tag']){const o=root.getObjectByName(name);if(o)neck.attach(o);}
 for(const label of ['front_left','front_right','rear_left','rear_right']){
  const leg=root.getObjectByName('leg_'+label),limb=leg.getObjectByName('sculpted_limb_'+label),rear=label.startsWith('rear'),kx=rear?-.12:0,upper=limbPart(limb.geometry,-.29,false),lowerGeo=limbPart(limb.geometry,-.29,true);lowerGeo.translate(-kx,.29,0);limb.geometry=upper;limb.name='upper_limb_'+label;
  const lower=new Group();lower.name='lower_'+label;lower.position.set(kx,-.29,0);leg.add(lower);const lowerMesh=limb.clone();lowerMesh.geometry=lowerGeo;lowerMesh.name='lower_limb_'+label;lower.add(lowerMesh);
  const foot=new Group();foot.name='foot_'+label;foot.position.set(.025-kx,-.438,0);lower.add(foot);root.updateMatrixWorld(true);
  for(const child of [...leg.children])if(child.name.startsWith('cloven_hoof_'))foot.attach(child);else if(child.name.startsWith('dewclaw_'))lower.attach(child);
 }
 const rot=(node,angles,times)=>({node,path:'rotation',times,values:angles.flatMap(a=>new Quaternion().setFromAxisAngle(new Vector3(0,0,1),a).toArray())});
 const eat=animations.find(a=>a.name==='eat');eat.tracks=[rot('neck',[0,-.88,-.82,-.88,0],[0,1,2,3,4]),rot('head',[0,-.25,-.29,-.25,0],[0,1,2,3,4])];
 animations.push({name:'drink',tracks:[rot('neck',[0,-.92,-.88,-.92,-.88,0],[0,.8,1.2,1.6,2.2,3]),rot('head',[0,-.2,-.23,-.2,-.18,0],[0,.8,1.2,1.6,2.2,3])]},
  {name:'rest',tracks:[...['front_left','front_right','rear_left','rear_right'].flatMap(label=>{const rear=label.startsWith('rear'),upper=rear?1.3:-1.25,lower=rear?-3.2:2.5;return[rot('leg_'+label,[0,upper,upper,0],[0,1,5,6]),rot('lower_'+label,[0,lower,lower,0],[0,1,5,6]),rot('foot_'+label,[0,-upper-lower,-upper-lower,0],[0,1,5,6])];}),rot('neck',[0,-.12,-.12,0],[0,1,5,6])]});
 groundRest(root,animations);return created;
}
