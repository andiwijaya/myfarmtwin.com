import {readFile,writeFile} from 'node:fs/promises';
import {writeGLB} from './glb-prototype-export.mjs';

// Extend the established deterministic writer with embedded original tangent-
// space normal maps. The public result is still one self-contained glTF 2 GLB.
export async function writeWorldGLB(path,root,{textures,animations=[]}){
 const record=await writeGLB(path,root,{textures,animations}),source=await readFile(path),jsonLength=source.readUInt32LE(12),json=JSON.parse(source.subarray(20,20+jsonLength).toString()),binStart=20+jsonLength+8;
 const chunks=[source.subarray(binStart)],materialData=new Map();let length=chunks[0].length;
 root.traverse(o=>{if(o.isMesh)materialData.set(o.material.name,o.material.userData);});
 const normalTextures=[...new Set([...materialData.values()].filter(d=>d.normalTexture!==undefined).map(d=>d.normalTexture))].sort((a,b)=>a-b),textureIds=new Map();
 if(normalTextures.length){json.images??=[];json.textures??=[];json.samplers??=[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}];}
 for(const id of normalTextures){const t=textures[id],view=json.bufferViews.length;json.bufferViews.push({buffer:0,byteOffset:length,byteLength:t.bytes.length});chunks.push(t.bytes);length+=t.bytes.length;const pad=(4-length%4)%4;if(pad){chunks.push(Buffer.alloc(pad));length+=pad;}json.images.push({name:t.name,bufferView:view,mimeType:'image/png'});textureIds.set(id,json.textures.length);json.textures.push({source:json.images.length-1,sampler:0});}
 for(const m of json.materials){const d=materialData.get(m.name);if(d?.normalTexture!==undefined)m.normalTexture={index:textureIds.get(d.normalTexture),scale:d.normalScale??.4};}
 json.buffers[0].byteLength=length;json.asset.generator='MyFarmTwin original cozy-world metric authoring v2, 2026-11-15';
 const raw=Buffer.from(JSON.stringify(json)),jsonChunk=Buffer.concat([raw,Buffer.alloc((4-raw.length%4)%4,32)]),bin=Buffer.concat(chunks),header=Buffer.alloc(12),jhead=Buffer.alloc(8),bhead=Buffer.alloc(8);
 header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(28+jsonChunk.length+bin.length,8);jhead.writeUInt32LE(jsonChunk.length);jhead.writeUInt32LE(0x4e4f534a,4);bhead.writeUInt32LE(bin.length);bhead.writeUInt32LE(0x004e4942,4);
 const bytes=Buffer.concat([header,jhead,jsonChunk,bhead,bin]);await writeFile(path,bytes);return{...record,bytes:bytes.length,textures:json.textures?.length??0,normalMaps:normalTextures.length};
}
