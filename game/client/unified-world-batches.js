import {Group,Mesh,InstancedMesh} from 'three';

/** Static decoration uses the same geometry, materials, transforms and ownership.
 * Originals stay on layer 1 for Canvas projection; GPU batches occupy layer 0.
 * Never batch animated crops, water, animals or selectable native fill volumes.
 * @param {import('three').Scene} scene */
export function createWorldBatches(scene){
 const group=new Group();group.userData.worldBatches=true;scene.add(group);
 /** @type {Mesh[]} */let originals=[];let disposed=false;
 function clear(){for(const mesh of originals)mesh.layers.set(0);originals=[];for(const mesh of group.children)if(mesh instanceof InstancedMesh)mesh.dispose();group.clear();}
 return {
  /** @param {readonly Group[]} roots */
  rebuild(roots){if(disposed)return;clear();scene.updateMatrixWorld(true);
   /** @type {Map<string,{source:Mesh,owner:string|null,meshes:Mesh[]}>} */const sets=new Map();
   for(const root of roots)root.traverse(object=>{if(!(object instanceof Mesh)||Array.isArray(object.material)||object.material.transparent)return;let parent=/** @type {import('three').Object3D} */(object);while(parent.parent&&!parent.userData.entityId)parent=parent.parent;const owner=typeof parent.userData.entityId==='string'?parent.userData.entityId:null,key=[object.geometry.uuid,object.material.uuid,owner,!!object.userData.pickThrough,!!object.userData.fineDetail,object.renderOrder].join('|');let set=sets.get(key);if(!set){set={source:object,owner,meshes:[]};sets.set(key,set);}set.meshes.push(object);});
   for(const {source,owner,meshes}of sets.values()){if(meshes.length<2)continue;const batch=new InstancedMesh(source.geometry,source.material,meshes.length);batch.renderOrder=source.renderOrder;batch.userData.worldBatch=true;batch.userData.entityId=owner;batch.userData.pickThrough=!!source.userData.pickThrough;batch.userData.fineDetail=!!source.userData.fineDetail;for(const [i,mesh]of meshes.entries()){batch.setMatrixAt(i,mesh.matrixWorld);mesh.layers.set(1);originals.push(mesh);}batch.instanceMatrix.needsUpdate=true;batch.computeBoundingSphere();group.add(batch);}
  },
  inspect:()=>({batches:group.children.length,instances:originals.length}),
  dispose(){if(disposed)return;disposed=true;clear();group.removeFromParent();}
 };
}
