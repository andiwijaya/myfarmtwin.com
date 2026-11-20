import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,join,sep} from 'node:path';
import {createHash} from 'node:crypto';
import {Box3,Matrix4,Quaternion,Vector3} from 'three';
import {HOUSE_LEVELS,HOUSE_PLOT} from '../../game/client/cozy-houses.js';

// Independent binary/resource/semantic checks. No browser, external process,
// network, desktop takeover, full Khronos conformance or visual claims.
const root=process.cwd(),base=resolve(root,'game/client/assets/models'),manifestPath=join(base,'world-manifest.json');
let manifest=JSON.parse(await readFile(manifestPath,'utf8')),determinism={checked:false};
if(process.argv.includes('--deterministic')){
 const before=await readFile(manifestPath),{buildCozyWorldAssets}=await import('./cozy-world-build.mjs');await buildCozyWorldAssets(root);const after=await readFile(manifestPath);assert.ok(before.equals(after),'deterministic second build must reproduce manifest/hashes exactly');manifest=JSON.parse(after);determinism={checked:true,manifestByteIdentical:true,assetsCompared:Object.values(manifest.assets).reduce((count,asset)=>count+(asset.lod?2:1),0)};
}
assert.equal(manifest.version,2);assert.equal(manifest.externalResources,false);assert.equal(manifest.units,'meters');assert.equal(manifest.up,'+Y');
const required=['terrain','barn','cow','bed','crops','props','vegetation','path','fence','coop','chicken','goatShelter','goat','goatKid','pond','fish','market','house','windPump','workerMan','workerWoman','infrastructure'];for(const id of required)assert.ok(manifest.assets[id],id);
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
 function walk(id,parent,box){const n=json.nodes[id],matrix=new Matrix4().compose(new Vector3(...(n.translation||[0,0,0])),new Quaternion(...(n.rotation||[0,0,0,1])),new Vector3(...(n.scale||[1,1,1]))).premultiply(parent);if(n.mesh!==undefined)for(const p of json.meshes[n.mesh].primitives){const v=values(p.attributes.POSITION);for(let i=0;i<v.length;i+=3)box.expandByPoint(new Vector3(...v.slice(i,i+3)).applyMatrix4(matrix));}for(const child of n.children||[])walk(child,matrix,box);}
 for(const id of json.scenes[json.scene||0].nodes)walk(id,new Matrix4(),bounds);for(const[key,v]of [['min',bounds.min],['max',bounds.max]])for(let i=0;i<3;i++)assert.ok(Math.abs(v.getComponent(i)-asset.bounds[key][i])<.0001,asset.id+' manifest bounds agree with decoded GLB');
 if(['chicken','goat','goatKid','fish','chickenFar','goatFar','goatKidFar','fishFar'].includes(asset.id)){assert.ok(bounds.min.y>=-.01,'animal floor pivot');assert.ok(asset.animations.length>=2);}
 if(asset.id==='terrain'){
  const [width,depth]=asset.footprint;
  const floor=asset.buildableSurfaceY;
  assert.deepEqual([width,depth,floor],[88,68,0]);
  const primitive=name=>json.meshes[json.nodes.find(node=>node.name===name).mesh].primitives[0];
  const ground=primitive(asset.roles.ground),surround=primitive(asset.roles.surround);
  const lowlands=primitive(asset.roles.lowlands),mountains=primitive(asset.roles.mountains);
  const groundPosition=json.accessors[ground.attributes.POSITION];
  assert.deepEqual(groundPosition.min,[-width/2,floor,-depth/2]);
  assert.deepEqual(groundPosition.max,[width/2,floor,depth/2]);
  assert.ok(bounds.min.x<-1500&&bounds.max.x>1500&&bounds.min.z<-1500&&bounds.max.z>1500);
  assert.ok(json.accessors[mountains.attributes.POSITION].max[1]>floor+30,'mountains rise from the surrounding ground');
  const groundMaterial=json.materials[ground.material],surroundMaterial=json.materials[surround.material];
  assert.notEqual(surroundMaterial.alphaMode,'BLEND');
  assert.deepEqual(surroundMaterial.pbrMetallicRoughness,groundMaterial.pbrMetallicRoughness);
  assert.deepEqual(surroundMaterial.normalTexture,groundMaterial.normalTexture);

  const groundPoints=values(ground.attributes.POSITION),groundUv=values(ground.attributes.TEXCOORD_0),groundColor=values(ground.attributes.COLOR_0);
  const edge=new Map();
  for(let i=0;i<groundPosition.count;i++){
   const x=groundPoints[i*3],z=groundPoints[i*3+2];
   if(Math.abs(x)===width/2||Math.abs(z)===depth/2){
    edge.set(x+':'+z,[...groundUv.slice(i*2,i*2+2),...groundColor.slice(i*3,i*3+3)]);
   }
  }
  const surroundPoints=values(surround.attributes.POSITION),surroundUv=values(surround.attributes.TEXCOORD_0),surroundColor=values(surround.attributes.COLOR_0);
  assert.equal(json.accessors[surround.attributes.COLOR_0].type,'VEC3');
  for(let i=0;i<surroundPoints.length/3;i++){
   const [x,y,z]=surroundPoints.slice(i*3,i*3+3);
   const key=x+':'+z;
   assert.ok(Math.abs(x)>=width/2||Math.abs(z)>=depth/2,'surround stays outside the farm surface');
   if(edge.has(key)){
    assert.equal(y,floor);
    assert.deepEqual([...surroundUv.slice(i*2,i*2+2),...surroundColor.slice(i*3,i*3+3)],edge.get(key));
    edge.delete(key);
   }
  }
  assert.equal(edge.size,0,'every field edge vertex continues across the surround');

  const lowlandPoints=values(lowlands.attributes.POSITION);
  const surroundOuter=json.accessors[surround.attributes.POSITION];
  for(const x of [surroundOuter.min[0],surroundOuter.max[0]]){
   for(const z of [surroundOuter.min[2],surroundOuter.max[2]]){
    assert.ok(lowlandPoints.some((n,i)=>i%3===0&&n===x&&lowlandPoints[i+1]===surroundOuter.min[1]&&lowlandPoints[i+2]===z),
     'the fields begin at the surround corners');
   }
  }

  const ridgePoints=values(mountains.attributes.POSITION),lowlandVertices=new Set();
  for(let i=0;i<lowlandPoints.length;i+=3)lowlandVertices.add(lowlandPoints.slice(i,i+3).join(','));
  const edgeDirections=new Set();
  for(let i=0;i<ridgePoints.length;i+=3){
   const point=ridgePoints.slice(i,i+3),[x,,z]=point;
   if(lowlandVertices.has(point.join(',')))edgeDirections.add(Math.abs(x)>Math.abs(z)?Math.sign(x):2*Math.sign(z));
  }
  assert.equal(edgeDirections.size,4,'the mountain terrain continues from the rice fields on every side');

  for(const role of ['floodedPaddies','plantedPaddies']){
   const plot=primitive(asset.roles[role]),vertices=values(plot.attributes.POSITION),indices=values(plot.indices);
   assert.notEqual(json.materials[plot.material].alphaMode,'BLEND');
   const levels=new Set();
   for(let i=0;i<indices.length;i+=3){
    const y=vertices[indices[i]*3+1];
    assert.equal(vertices[indices[i+1]*3+1],y,'individual paddy terraces are level');
    assert.equal(vertices[indices[i+2]*3+1],y,'individual paddy terraces are level');
    levels.add(y);
   }
   assert.ok(levels.size>1,'different terraces follow the relief of the fields');
  }
 }
 if(asset.id==='house'){
  assert.deepEqual(asset.roles.levels,HOUSE_LEVELS.map(level=>level.model));
  assert.equal(new Set(asset.roles.levels).size,10);
  assert.deepEqual(asset.footprint,[HOUSE_PLOT.width,HOUSE_PLOT.depth]);
  const library=json.nodes[json.scenes[0].nodes[0]];
  assert.equal(library.children.length,HOUSE_LEVELS.length);
  let lastArea=0;
  for(const [i,level] of HOUSE_LEVELS.entries()){
   const template=library.children[i];
   assert.equal(json.nodes[template].name,level.model);
   assert.equal(json.nodes[template].extras.level,i+1);
   const home=new Box3();
   walk(template,new Matrix4(),home);
   const [width,depth,height]=level.dimensions;
   assert.ok(home.min.y>=-.001&&home.min.y<.001&&home.max.y<=height,level.model+' ground pivot and height');
   assert.ok(home.min.x>=-width/2&&home.max.x<=width/2&&home.min.z>=-depth/2&&home.max.z<=depth/2,level.model+' fits its footprint');
   assert.ok(width<=HOUSE_PLOT.width&&depth<=HOUSE_PLOT.depth,level.model+' fits the residential plot');
   assert.ok(Math.abs(level.entrance[0])<width/2&&Math.abs(level.entrance[2])<depth/2&&level.entrance[1]<1,level.model+' usable entrance');
   const size=home.getSize(new Vector3()),area=size.x*size.z;
   assert.ok(area>lastArea,level.model+' expands the house footprint');
   lastArea=area;
  }
 }
 if(['workerMan','workerWoman'].includes(asset.id)){
  assert.deepEqual(asset.animations,['walk','carry','idle','fill','pour','tend']);
  assert.ok(bounds.min.y>=-.001&&bounds.min.y<.01&&bounds.max.y>1.65,'standing worker scale and floor contact');
 }
 if(asset.id==='infrastructure'){
  assert.equal(json.nodes.filter(node=>node.extras?.truckWheel).length,4);
  for(const template of ['market_truck','road_strip','road_joint','wind_solar_station','farm_street_lamp']){
   assert.ok(asset.templates.includes(template),template+' can be instantiated independently');
  }
 }
 if(asset.lod)assert.ok(asset.lod.far.uniqueTriangles<asset.uniqueTriangles*.5,'purposeful far LOD reduces triangles by over half');
 results.push({id:asset.id,sha256:asset.sha256,bytes:bytes.length,nodes:json.nodes.length,meshes:json.meshes.length,images:json.images?.length??0,normalMaps:json.materials.filter(m=>m.normalTexture).length,animations:asset.animations,bounds:asset.bounds,passed:true});
}
const report={kind:'cozy-world-glb-resource-validation-v2',authoringDate:'2026-11-15',scope:'Independent GLB headers/chunks; all embedded PNG/resources; buffer/accessor finite/ranges; index/material/normal-map references; articulated animation timestamps/quaternions/targets; semantic nodes; decoded world bounds; authored LOD reduction; no browser or full Khronos/visual certification',determinism,logicalAssets:required.length,files:results.length,bytes:results.reduce((n,a)=>n+a.bytes,0),results};
await writeFile(join(base,'world/resource-validation.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({passed:results.length,total:records.length,bytes:report.bytes,determinism}));
