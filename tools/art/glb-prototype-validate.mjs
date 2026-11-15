import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';

// Independent GLB resource/buffer validator for this bounded asset contract.
// It does not claim complete Khronos extension, skin, or visual validation.
const root=process.cwd(),manifest=JSON.parse(await readFile(join(root,'game/client/assets/models/prototype-manifest.json'),'utf8')),results=[];
for(const asset of Object.values(manifest.assets)){
 const bytes=await readFile(join(root,'game/client/assets/models',asset.url));assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);assert.equal(bytes.readUInt32LE(16),0x4e4f534a);
 const jsonLength=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+jsonLength).toString()),binHead=20+jsonLength;assert.equal(bytes.readUInt32LE(binHead+4),0x004e4942);const bin=bytes.subarray(binHead+8);assert.equal(json.buffers.length,1);assert.equal(json.buffers[0].byteLength,bin.length);assert.equal(json.buffers[0].uri,undefined);assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
 for(const view of json.bufferViews){assert.equal(view.buffer,0);assert.equal((view.byteOffset||0)%4,0);assert.ok(view.byteLength>0);assert.ok((view.byteOffset||0)+view.byteLength<=bin.length);}
 const sizes={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16},read={5126:[4,'readFloatLE'],5125:[4,'readUInt32LE'],5123:[2,'readUInt16LE'],5121:[1,'readUInt8']};
 for(const accessor of json.accessors){const view=json.bufferViews[accessor.bufferView],[size,method]=read[accessor.componentType];assert.ok(accessor.count>0);assert.ok(size*sizes[accessor.type]*accessor.count<=view.byteLength);for(let i=0;i<accessor.count*sizes[accessor.type];i++)assert.ok(Number.isFinite(bin[method]((view.byteOffset||0)+i*size)),'finite accessor');}
 for(const image of json.images||[]){assert.equal(image.uri,undefined);assert.equal(image.mimeType,'image/png');const view=json.bufferViews[image.bufferView];assert.deepEqual([...bin.subarray(view.byteOffset,view.byteOffset+8)],[137,80,78,71,13,10,26,10]);}
 for(const mesh of json.meshes)for(const primitive of mesh.primitives){assert.ok(json.materials[primitive.material]);const count=json.accessors[primitive.attributes.POSITION].count;assert.ok(primitive.attributes.NORMAL!==undefined);if(primitive.indices!==undefined){const accessor=json.accessors[primitive.indices],view=json.bufferViews[accessor.bufferView],[size,method]=read[accessor.componentType];for(let i=0;i<accessor.count;i++)assert.ok(bin[method](view.byteOffset+i*size)<count,'index range');}}
 for(const material of json.materials){const texture=material.pbrMetallicRoughness.baseColorTexture;if(texture)assert.ok(json.textures[texture.index]);}
 for(const animation of json.animations||[])for(const channel of animation.channels){assert.ok(json.nodes[channel.target.node]);const sampler=animation.samplers[channel.sampler];assert.equal(json.accessors[sampler.input].count,json.accessors[sampler.output].count);}
 results.push({id:asset.id,bytes:bytes.length,accessors:json.accessors.length,animations:json.animations?.map(a=>a.name)||[],passed:true});
}
const directory=resolve(root,'qa-artifacts/glb-upgrade/assets');await mkdir(directory,{recursive:true});await writeFile(join(directory,'resource-validation.json'),JSON.stringify({kind:'original-glb-resource-validation-v1',scope:'GLB header/chunks, embedded resources, accessor finite values/ranges, indices/materials/textures/animation targets; not full Khronos or visual validation',results},null,2)+'\n');console.log(JSON.stringify({passed:results.length,total:results.length,bytes:results.reduce((n,a)=>n+a.bytes,0)}));
