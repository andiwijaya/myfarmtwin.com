import {BoxGeometry,CylinderGeometry,SphereGeometry,PlaneGeometry,CircleGeometry,BufferGeometry,Float32BufferAttribute,Mesh,Color,Matrix4,Matrix3,Euler,Vector3} from 'three';

/** Closed pointed leaf with a curved midrib and a thin underside. */
function leafGeometry(){
 const ring=[[0,0,-.5],[-.5,.06,-.2],[-.42,.1,.17],[0,.18,.5],[.42,.1,.17],[.5,.06,-.2]],positions=ring.flat().concat([0,.5,0,0,-.2,0]),indices=[];
 for(let i=0;i<6;i++){const next=(i+1)%6;indices.push(6,i,next,7,next,i);}
 const geometry=new BufferGeometry().setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}

/** Bake authored static parts by visibility semantics, with linear vertex color.
 * Real triangles retain picking; there are no invisible input proxies. This
 * never mixes native fill with shells: callers bake each current fill alone.
 * It is not used for sprites, water animation or moving objects.
 * Caller owns/disposes the generated geometry, and owns the shared material.
 * @param {readonly import('./unified-world-environment.js').EnvironmentPart[]} parts
 * @param {import('three').MeshLambertMaterial} material
 * @returns {Mesh[]} */
export function compileWorldParts(parts,material){
 /** @type {Map<string,BufferGeometry>} */const sources=new Map();
 /** @param {import('./unified-world-environment.js').EnvironmentPart['shape']} shape */
 const sourceFor=shape=>{const key=shape==='bevel'?'bevel':shape==='cylinder'||shape==='foliage'||shape==='surface'||shape==='disc'||shape==='leaf'?shape:'box';let geometry=sources.get(key);if(!geometry){geometry=key==='cylinder'?new CylinderGeometry(.5,.5,1,12):key==='foliage'?new SphereGeometry(.5,8,6):key==='surface'?new PlaneGeometry(1,1).rotateX(-Math.PI/2):key==='disc'?new CircleGeometry(.5,12).rotateX(-Math.PI/2):key==='leaf'?leafGeometry():key==='bevel'?new BoxGeometry(1,1,1,2,2,2):new BoxGeometry(1,1,1);sources.set(key,geometry);}return geometry;};
 /** @type {Map<string,{positions:number[],normals:number[],colors:number[],fixed:boolean,fine:boolean,optional:boolean,features:Set<string>,counts:Record<string,number>}>} */
 const groups=new Map();
 const color=new Color(),matrix=new Matrix4(),normals=new Matrix3(),rotation=new Euler(),point=new Vector3(),direction=new Vector3(),inside=new Vector3();
 try{for(const part of parts){
  if(![part.x,part.y,part.z,part.width,part.height,part.depth].every(Number.isFinite)||Math.min(part.width,part.height,part.depth)<=0)throw new Error('Invalid authored part dimensions');
  if(part.opacity!==undefined&&part.opacity!==1)throw new Error('Transparent parts require independent sorting');
  if(part.shape&&!['box','bevel','gable','cylinder','foliage','surface','disc','leaf'].includes(part.shape))throw new Error('Unsupported static shape');
  const source=sourceFor(part.shape),position=source.getAttribute('position'),normal=source.getAttribute('normal'),indices=source.index;if(!indices)throw new Error('Missing indexed source geometry');
  const fixed=!!part.fixed,fine=!!part.fine,optional=part.startupOptional??!['body','roof','gable-infill','barn-floor','interior-post'].includes(part.feature||''),key=[fixed,fine,optional].join('|');
  let batch=groups.get(key);if(!batch){batch={positions:[],normals:[],colors:[],fixed,fine,optional,features:new Set(),counts:{}};groups.set(key,batch);}if(part.feature){batch.features.add(part.feature);batch.counts[part.feature]=(batch.counts[part.feature]||0)+1;}
  color.set(part.color);rotation.set(part.pitch||0,part.rotation||0,part.tilt||0,'YXZ');matrix.makeRotationFromEuler(rotation);matrix.setPosition(part.x,part.y,part.z);normals.getNormalMatrix(matrix);
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
 }}finally{for(const source of sources.values())source.dispose();}
 return [...groups.values()].map(batch=>{
  const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(batch.positions,3));geometry.setAttribute('normal',new Float32BufferAttribute(batch.normals,3));geometry.setAttribute('color',new Float32BufferAttribute(batch.colors,3));geometry.computeBoundingBox();geometry.computeBoundingSphere();geometry.userData.worldOwned=true;
  const mesh=new Mesh(geometry,material);mesh.userData.environmentDetail=true;mesh.userData.cutawayFixed=batch.fixed;mesh.userData.cutawayShell=!batch.fixed;mesh.userData.fineDetail=batch.fine;mesh.userData.startupOptional=batch.optional;mesh.userData.structureFeatures=[...batch.features];mesh.userData.structureFeatureCounts=Object.freeze({...batch.counts});mesh.userData.structureFeature=mesh.userData.structureFeatures.join(',');return mesh;
 });
}

/** Release only per-entity baked geometry; shared cubes/materials stay alive.
 * @param {import('three').Object3D} root */
export function disposePartMeshes(root){
 const seen=new Set();root.traverse(object=>{if(object instanceof Mesh&&object.geometry.userData.worldOwned&&!object.geometry.userData.worldReleased&&!seen.has(object.geometry)){seen.add(object.geometry);object.geometry.userData.worldReleased=true;object.geometry.dispose();}});
}
