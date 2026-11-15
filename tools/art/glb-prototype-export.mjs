import {deflateSync} from 'node:zlib';
import {writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {Box3,Mesh} from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

/** Bake direct static mesh children per material while retaining named group
 * boundaries, including articulation pivots and template-library children. */
export function packStaticMeshes(root){
 for(const child of [...root.children])if(!child.isMesh)packStaticMeshes(child);
 const byMaterial=new Map();for(const child of root.children)if(child.isMesh){const list=byMaterial.get(child.material)||[];list.push(child);byMaterial.set(child.material,list);}
 for(const [material,objects]of byMaterial){if(objects.length<2)continue;const geometries=objects.map(object=>{object.updateMatrix();return object.geometry.clone().applyMatrix4(object.matrix);}),geometry=mergeGeometries(geometries,false);if(!geometry)throw Error('Static model merge failed in '+root.name);const combined=new Mesh(geometry,material);combined.name=root.name+'_'+material.name.replace(/[^a-z0-9]+/gi,'_');combined.userData={authoredParts:objects.map(o=>o.name)};for(const object of objects)root.remove(object);root.add(combined);for(const g of geometries)g.dispose();}
 return root;
}

// Repository-authored deterministic GLB writer. Geometry/material authoring stays
// in Node; the deployed scene never reconstructs these models with primitives.
export function png(width,height,sample){
 const raw=Buffer.alloc((width*4+1)*height);
 for(let y=0;y<height;y++)for(let x=0;x<width;x++){
  const c=sample(x/width,y/height,x,y),i=y*(width*4+1)+1+x*4;
  for(let k=0;k<4;k++)raw[i+k]=Math.round(Math.max(0,Math.min(255,c[k]??255)));
 }
 const table=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[n]=c;}
 const crc=data=>{let c=0xffffffff;for(const byte of data)c=table[(c^byte)&255]^(c>>>8);return(c^0xffffffff)>>>0;};
 const chunk=(type,data)=>{const name=Buffer.from(type),out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length);name.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([name,data])),data.length+8);return out;};
 const header=Buffer.alloc(13);header.writeUInt32BE(width);header.writeUInt32BE(height,4);header[8]=8;header[9]=6;
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))]);
}

export async function writeGLB(path,root,{textures=[],animations=[]}={}){
 const json={asset:{version:'2.0',generator:'MyFarmTwin original procedural authoring 2026-11-15',copyright:'Original MyFarmTwin repository authoring'},scene:0,scenes:[{nodes:[0]}],nodes:[],meshes:[],materials:[],accessors:[],bufferViews:[],buffers:[{byteLength:0}]};
 const chunks=[],materialIds=new Map(),geometryIds=new Map(),nodeIds=new Map(),nameIds=new Map(),textureIds=new Map();let length=0,triangles=0;
 const append=(bytes,target)=>{const buffer=Buffer.from(bytes.buffer||bytes,bytes.byteOffset||0,bytes.byteLength??bytes.length);const index=json.bufferViews.length;json.bufferViews.push({buffer:0,byteOffset:length,byteLength:buffer.length,...(target?{target}:{})});chunks.push(buffer);length+=buffer.length;const padding=(4-length%4)%4;if(padding){chunks.push(Buffer.alloc(padding));length+=padding;}return index;};
 const accessor=(array,size,{target,normalized=false,bounds=false}={})=>{const componentType=array instanceof Float32Array?5126:array instanceof Uint32Array?5125:array instanceof Uint16Array?5123:5121;const record={bufferView:append(array,target),componentType,count:array.length/size,type:({1:'SCALAR',2:'VEC2',3:'VEC3',4:'VEC4',16:'MAT4'})[size],...(normalized?{normalized:true}:{})};if(bounds){record.min=Array(size).fill(Infinity);record.max=Array(size).fill(-Infinity);for(let i=0;i<array.length;i++){const k=i%size;record.min[k]=Math.min(record.min[k],array[i]);record.max[k]=Math.max(record.max[k],array[i]);}}const id=json.accessors.length;json.accessors.push(record);return id;};
 const usedTextures=new Set();root.traverse(o=>{if(o.isMesh&&o.material.userData.baseTexture!==undefined)usedTextures.add(o.material.userData.baseTexture);});
 if(usedTextures.size){json.images=[];json.textures=[];json.samplers=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];for(const original of [...usedTextures].sort()){const texture=textures[original];textureIds.set(original,json.textures.length);json.images.push({name:texture.name,bufferView:append(texture.bytes),mimeType:'image/png'});json.textures.push({source:json.images.length-1,sampler:0});}}
 const material=mat=>{if(materialIds.has(mat.uuid))return materialIds.get(mat.uuid);const record={name:mat.name,pbrMetallicRoughness:{baseColorFactor:[mat.color.r,mat.color.g,mat.color.b,mat.opacity],metallicFactor:mat.metalness??0,roughnessFactor:mat.roughness??.8},...(mat.side===2?{doubleSided:true}:{}),...(mat.transparent?{alphaMode:'BLEND'}:{})};if(mat.userData.baseTexture!==undefined)record.pbrMetallicRoughness.baseColorTexture={index:textureIds.get(mat.userData.baseTexture)};if(mat.emissive?.getHex())record.emissiveFactor=[mat.emissive.r,mat.emissive.g,mat.emissive.b];const id=json.materials.length;json.materials.push(record);materialIds.set(mat.uuid,id);return id;};
 const geometry=mesh=>{const g=mesh.geometry,key=g.uuid+'|'+mesh.material.uuid;if(geometryIds.has(key))return geometryIds.get(key);const attributes={};for(const [name,semantic]of Object.entries({position:'POSITION',normal:'NORMAL',uv:'TEXCOORD_0',color:'COLOR_0'})){const attr=g.getAttribute(name);if(!attr)continue;attributes[semantic]=accessor(attr.array,attr.itemSize,{target:34962,normalized:attr.normalized,bounds:name==='position'});}const primitive={attributes,material:material(mesh.material)};if(g.index)primitive.indices=accessor(g.index.array,1,{target:34963});triangles+=(g.index?.count??g.getAttribute('position').count)/3;const id=json.meshes.length;json.meshes.push({name:mesh.name||g.name||'authored-mesh',primitives:[primitive]});geometryIds.set(key,id);return id;};
 const node=object=>{const id=json.nodes.length;nodeIds.set(object,id);if(object.name)nameIds.set(object.name,id);const record={name:object.name||'part'};json.nodes.push(record);if(object.isMesh)record.mesh=geometry(object);if(object.position.lengthSq())record.translation=object.position.toArray();if(object.quaternion.x||object.quaternion.y||object.quaternion.z||object.quaternion.w!==1)record.rotation=object.quaternion.toArray();if(object.scale.x!==1||object.scale.y!==1||object.scale.z!==1)record.scale=object.scale.toArray();if(Object.keys(object.userData).length)record.extras=object.userData;if(object.children.length)record.children=object.children.map(node);return id;};node(root);
 if(animations.length){json.animations=animations.map(animation=>{const samplers=[],channels=[];for(const track of animation.tracks){if(!nameIds.has(track.node))throw Error('Animation target missing: '+track.node);const output=accessor(new Float32Array(track.values),track.path==='rotation'?4:3),input=accessor(new Float32Array(track.times),1,{bounds:true});channels.push({sampler:samplers.length,target:{node:nameIds.get(track.node),path:track.path}});samplers.push({input,output,interpolation:'LINEAR'});}return{name:animation.name,samplers,channels};});}
 json.buffers[0].byteLength=length;const data=Buffer.from(JSON.stringify(json)),jsonPadding=(4-data.length%4)%4,jsonChunk=Buffer.concat([data,Buffer.alloc(jsonPadding,32)]),bin=Buffer.concat(chunks);const header=Buffer.alloc(12),jhead=Buffer.alloc(8),bhead=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+jsonChunk.length+8+bin.length,8);jhead.writeUInt32LE(jsonChunk.length);jhead.writeUInt32LE(0x4e4f534a,4);bhead.writeUInt32LE(bin.length);bhead.writeUInt32LE(0x004e4942,4);const bytes=Buffer.concat([header,jhead,jsonChunk,bhead,bin]);await mkdir(dirname(path),{recursive:true});await writeFile(path,bytes);root.updateMatrixWorld(true);const bounds=new Box3().setFromObject(root);return{bytes:bytes.length,uniqueTriangles:triangles,meshes:json.meshes.length,nodes:json.nodes.length,textures:usedTextures.size,animations:animations.map(a=>a.name),bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()},templates:root.children.map(c=>c.name)};
}
