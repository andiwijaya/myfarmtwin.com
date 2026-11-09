import {BoxGeometry,CylinderGeometry,SphereGeometry,BufferGeometry,Float32BufferAttribute,Mesh,Color,Matrix4,Matrix3,Euler,Vector3} from 'three';

/** Bake authored static parts by visibility semantics, with linear vertex color.
 * Real triangles retain picking; there are no invisible input proxies. This is
 * never mixes native fill with shells: callers bake each current fill alone.
 * It is not used for sprites, water animation or moving objects.
 * Caller owns/disposes the generated geometry, and owns the shared material.
 * @param {readonly import('./unified-world-environment.js').EnvironmentPart[]} parts
 * @param {import('three').MeshLambertMaterial} material
 * @returns {Mesh[]} */
export function compileWorldParts(parts,material){
 const sources={box:new BoxGeometry(1,1,1,2,2,2),cylinder:new CylinderGeometry(.5,.5,1,12),foliage:new SphereGeometry(.5,8,6)};
 /** @type {Map<string,{positions:number[],normals:number[],colors:number[],fixed:boolean,fine:boolean,optional:boolean,features:Set<string>}>} */
 const groups=new Map();
 const color=new Color(),matrix=new Matrix4(),normals=new Matrix3(),rotation=new Euler(),point=new Vector3(),direction=new Vector3(),inside=new Vector3();
 try{for(const part of parts){
  if(![part.x,part.y,part.z,part.width,part.height,part.depth].every(Number.isFinite)||Math.min(part.width,part.height,part.depth)<=0)throw new Error('Invalid authored part dimensions');
  if(part.opacity!==undefined&&part.opacity!==1)throw new Error('Transparent parts require independent sorting');
  if(part.shape&&!['bevel','gable','cylinder','foliage'].includes(part.shape))throw new Error('Unsupported static shape');
  const source=part.shape==='cylinder'?sources.cylinder:part.shape==='foliage'?sources.foliage:sources.box,position=source.getAttribute('position'),normal=source.getAttribute('normal'),indices=source.index;if(!indices)throw new Error('Missing indexed source geometry');
  const fixed=!!part.fixed,fine=!!part.fine,optional=!['body','roof','gable-infill','barn-floor','interior-post'].includes(part.feature||''),key=[fixed,fine,optional].join('|');
  let batch=groups.get(key);if(!batch){batch={positions:[],normals:[],colors:[],fixed,fine,optional,features:new Set()};groups.set(key,batch);}if(part.feature)batch.features.add(part.feature);
  color.set(part.color);rotation.set(0,part.rotation||0,part.tilt||0);matrix.makeRotationFromEuler(rotation);matrix.setPosition(part.x,part.y,part.z);normals.getNormalMatrix(matrix);
  const radius=Math.min(.08,part.width*.15,part.height*.15,part.depth*.15),half=[part.width/2,part.height/2,part.depth/2];
  const count=part.shape==='gable'?3:indices.count;
  for(let i=0;i<count;i++){
   if(part.shape==='gable'){
    const vertices=[[-.5,0,0],[.5,0,0],[0,1,0]],v=vertices[i];point.set(v[0]*part.width,v[1]*part.height,0);direction.set(0,0,1);
   }else{
    const index=indices.getX(i);point.fromBufferAttribute(position,index);point.set(point.x*part.width,point.y*part.height,point.z*part.depth);direction.fromBufferAttribute(normal,index);direction.set(direction.x/part.width,direction.y/part.height,direction.z/part.depth).normalize();
    if(part.shape==='bevel'){
     inside.set(Math.max(-half[0]+radius,Math.min(half[0]-radius,point.x)),Math.max(-half[1]+radius,Math.min(half[1]-radius,point.y)),Math.max(-half[2]+radius,Math.min(half[2]-radius,point.z)));
     direction.copy(point).sub(inside).normalize();point.copy(inside).addScaledVector(direction,radius);
    }
   }
   point.applyMatrix4(matrix);direction.applyNormalMatrix(normals);batch.positions.push(point.x,point.y,point.z);batch.normals.push(direction.x,direction.y,direction.z);batch.colors.push(color.r,color.g,color.b);
  }
 }}finally{for(const source of Object.values(sources))source.dispose();}
 return [...groups.values()].map(batch=>{
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(batch.positions,3));geometry.setAttribute('normal',new Float32BufferAttribute(batch.normals,3));geometry.setAttribute('color',new Float32BufferAttribute(batch.colors,3));geometry.computeBoundingBox();geometry.computeBoundingSphere();geometry.userData.worldOwned=true;
  const mesh=new Mesh(geometry,material);mesh.userData.environmentDetail=true;mesh.userData.cutawayFixed=batch.fixed;mesh.userData.cutawayShell=!batch.fixed;mesh.userData.fineDetail=batch.fine;mesh.userData.startupOptional=batch.optional;mesh.userData.structureFeatures=[...batch.features];mesh.userData.structureFeature=mesh.userData.structureFeatures.join(',');return mesh;
 });
}

/** Release only per-entity baked geometry; shared cubes/materials stay alive.
 * @param {import('three').Object3D} root */
export function disposePartMeshes(root){
 const seen=new Set();root.traverse(object=>{if(object instanceof Mesh&&object.geometry.userData.worldOwned&&!object.geometry.userData.worldReleased&&!seen.has(object.geometry)){seen.add(object.geometry);object.geometry.userData.worldReleased=true;object.geometry.dispose();}});
}
