import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,join,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {Box3,Matrix4,Quaternion,Vector3} from 'three';

// Independent binary/resource/semantic checks. No browser, external process,
// network, desktop takeover, full Khronos conformance or visual claims.
const root=process.cwd(),base=resolve(root,'game/client/assets/models'),manifestPath=join(base,'world-manifest.json');
let manifest=JSON.parse(await readFile(manifestPath,'utf8')),determinism={checked:false};
if(process.argv.includes('--deterministic')){
 const before=await readFile(manifestPath),{buildCozyWorldAssets}=await import('./cozy-world-build.mjs');await buildCozyWorldAssets(root);const after=await readFile(manifestPath);assert.ok(before.equals(after),'deterministic second build must reproduce manifest/hashes exactly');manifest=JSON.parse(after);determinism={checked:true,manifestByteIdentical:true,assetsCompared:22};
}
assert.equal(manifest.version,2);assert.equal(manifest.externalResources,false);assert.equal(manifest.units,'meters');assert.equal(manifest.up,'+Y');
const required=['terrain','barn','cow','bed','crops','props','vegetation','path','fence','coop','chicken','goatShelter','goat','goatKid','pond','fish','market'];for(const id of required)assert.ok(manifest.assets[id],id);
const records=Object.values(manifest.assets).flatMap(a=>[a,...(a.lod?[a.lod.far]:[])]),results=[];
const widths={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16},types={5126:[4,'readFloatLE'],5125:[4,'readUInt32LE'],5123:[2,'readUInt16LE'],5121:[1,'readUInt8']};
const strings=value=>typeof value==='string'?[value]:Array.isArray(value)?value.flatMap(strings):value&&typeof value==='object'?Object.values(value).flatMap(strings):[];
for(const asset of records){
 assert.ok(asset.url.startsWith('/play/assets/models/'),'absolute application-relative asset URL');
 const path=resolve(base,asset.url.slice('/play/assets/models/'.length));assert.ok(path.startsWith(base+sep));const bytes=await readFile(path);assert.equal(bytes.length,asset.bytes);assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
 assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);assert.equal(bytes.readUInt32LE(16),0x4e4f534a);
 const len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len).toString()),binHead=20+len,bin=bytes.subarray(binHead+8);assert.equal(bytes.readUInt32LE(binHead+4),0x004e4942);assert.equal(bytes.readUInt32LE(binHead),bin.length);
 assert.equal(json.asset.version,'2.0');assert.equal(json.buffers.length,1);assert.equal(json.buffers[0].byteLength,bin.length);assert.equal(json.buffers[0].uri,undefined);
 for(const view of json.bufferViews){assert.equal(view.buffer,0);assert.equal((view.byteOffset||0)%4,0);assert.ok(view.byteLength>0);assert.ok((view.byteOffset||0)+view.byteLength<=bin.length);}
 function values(id){const a=json.accessors[id],view=json.bufferViews[a.bufferView],[size,method]=types[a.componentType],out=[];assert.ok(widths[a.type]);assert.ok(a.count>0);assert.ok(size*widths[a.type]*a.count<=view.byteLength);for(let i=0;i<a.count*widths[a.type];i++){const n=bin[method]((view.byteOffset||0)+(a.byteOffset||0)+i*size);assert.ok(Number.isFinite(n),'finite accessor');out.push(n);}return out;}
 for(let id=0;id<json.accessors.length;id++)values(id);
 for(const image of json.images||[]){assert.equal(image.uri,undefined);assert.equal(image.mimeType,'image/png');const view=json.bufferViews[image.bufferView],png=bin.subarray(view.byteOffset,view.byteOffset+view.byteLength);assert.deepEqual([...png.subarray(0,8)],[137,80,78,71,13,10,26,10]);assert.ok(png.readUInt32BE(16)>=1&&png.readUInt32BE(16)<=1024);assert.ok(png.readUInt32BE(20)>=1&&png.readUInt32BE(20)<=1024);}
 for(const mesh of json.meshes)for(const p of mesh.primitives){assert.ok(json.materials[p.material]);const count=json.accessors[p.attributes.POSITION].count;assert.ok(p.attributes.NORMAL!==undefined);assert.equal(json.accessors[p.attributes.NORMAL].count,count);assert.equal(values(p.indices).length%3,0);for(const index of values(p.indices))assert.ok(index<count,'index inside position accessor');}
 for(const m of json.materials){const p=m.pbrMetallicRoughness;assert.ok(p.roughnessFactor>=0&&p.roughnessFactor<=1);assert.ok(p.metallicFactor>=0&&p.metallicFactor<=1);if(p.baseColorTexture)assert.ok(json.textures[p.baseColorTexture.index]);if(m.normalTexture){assert.ok(json.textures[m.normalTexture.index]);assert.ok(m.normalTexture.scale>0&&m.normalTexture.scale<=1);}}
 const names=new Set(json.nodes.map(n=>n.name));for(const name of strings(asset.roles))assert.ok(names.has(name),asset.id+' semantic node '+name);
 for(const a of json.animations||[])for(const c of a.channels){assert.ok(json.nodes[c.target.node]);assert.ok(['translation','rotation','scale'].includes(c.target.path));const s=a.samplers[c.sampler],times=values(s.input),out=values(s.output);assert.equal(json.accessors[s.input].count,json.accessors[s.output].count);for(let i=0;i<times.length;i++)assert.ok(times[i]>=0&&(!i||times[i]>times[i-1]));if(c.target.path==='rotation')for(let i=0;i<out.length;i+=4)assert.ok(Math.abs(Math.hypot(...out.slice(i,i+4))-1)<1e-5,'unit animation quaternion');}
 assert.deepEqual(json.animations?.map(a=>a.name)||[],asset.animations);
 const bounds=new Box3();
 function walk(id,parent){const n=json.nodes[id],matrix=new Matrix4().compose(new Vector3(...(n.translation||[0,0,0])),new Quaternion(...(n.rotation||[0,0,0,1])),new Vector3(...(n.scale||[1,1,1]))).premultiply(parent);if(n.mesh!==undefined)for(const p of json.meshes[n.mesh].primitives){const v=values(p.attributes.POSITION);for(let i=0;i<v.length;i+=3)bounds.expandByPoint(new Vector3(...v.slice(i,i+3)).applyMatrix4(matrix));}for(const child of n.children||[])walk(child,matrix);}
 for(const id of json.scenes[json.scene||0].nodes)walk(id,new Matrix4());for(const[key,v]of [['min',bounds.min],['max',bounds.max]])for(let i=0;i<3;i++)assert.ok(Math.abs(v.getComponent(i)-asset.bounds[key][i])<.0001,'manifest bounds agree with decoded GLB');
 if(['chicken','goat','goatKid','fish','chickenFar','goatFar','goatKidFar','fishFar'].includes(asset.id)){assert.ok(bounds.min.y>=-.01,'animal floor pivot');assert.ok(asset.animations.length>=2);}
 if(asset.id==='terrain'){assert.equal(bounds.min.x,-44);assert.equal(bounds.max.x,44);assert.equal(bounds.min.z,-34);assert.equal(bounds.max.z,34);assert.equal(bounds.max.y,0);}
 if(asset.lod)assert.ok(asset.lod.far.uniqueTriangles<asset.uniqueTriangles*.5,'purposeful far LOD reduces triangles by over half');
 results.push({id:asset.id,sha256:asset.sha256,bytes:bytes.length,nodes:json.nodes.length,meshes:json.meshes.length,images:json.images?.length??0,normalMaps:json.materials.filter(m=>m.normalTexture).length,animations:asset.animations,bounds:asset.bounds,passed:true});
}
const report={kind:'cozy-world-glb-resource-validation-v2',authoringDate:'2026-11-15',scope:'Independent GLB headers/chunks; all embedded PNG/resources; buffer/accessor finite/ranges; index/material/normal-map references; articulated animation timestamps/quaternions/targets; semantic nodes; decoded world bounds; authored LOD reduction; no browser or full Khronos/visual certification',determinism,logicalAssets:required.length,files:results.length,bytes:results.reduce((n,a)=>n+a.bytes,0),results};
await writeFile(join(base,'world/resource-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:results.length,total:records.length,bytes:report.bytes,determinism}));
