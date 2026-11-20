import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');

test('delivered full-world entry and recovery share an exact receipt without a legacy renderer graph',async()=>{
 const receipt=JSON.parse(await readFile('dist/play/build-info.json','utf8'));
 assert.equal(receipt.kind,'myfarmtwin-cozy-world-v2');assert.equal(receipt.legacyVisibleModules,false);assert.equal(receipt.saveVersion,2);
 assert.deepEqual(receipt.areas,['garden','chicken','goat','cow','fish','market','house']);
 for(const path of ['dist/play/index.html','dist/play/glb/index.html','dist/play/cozy/index.html'])assert.equal(sha(await readFile(path)),receipt.htmlSha256,path);
 const html=await readFile('dist/play/index.html','utf8');assert.ok(html.includes('/play/cozy/'+receipt.entry));assert.ok(!html.includes('world-loader'));
 assert.ok((await readFile('dist/play/recovery/index.html','utf8')).includes('/play/cozy/'+receipt.recoveryEntry));
 for(const file of receipt.emitted){const bytes=await readFile('dist/play/cozy/'+file.name);assert.equal(bytes.length,file.bytes);assert.equal(sha(bytes),file.sha256);}
 const bundle=await readFile('dist/play/cozy/'+receipt.entry,'utf8');
 assert.ok(bundle.includes('/play/assets/models/world-manifest.json?v='+receipt.manifestSha256.slice(0,16)));
 assert.ok(receipt.inputs.includes('game/client/cozy-domain.js'));assert.ok(!receipt.inputs.some(p=>/unified-world-(?:preview|sprites)/.test(p)));
});

test('every shipped world GLB including far LODs matches its authored manifest and source bytes',async()=>{
 const manifest=JSON.parse(await readFile('game/client/assets/models/world-manifest.json','utf8'));
 for(const name of ['terrain','bed','crops','barn','cow','coop','chicken','goatShelter','goat','goatKid','pond','fish','market','house','windPump','workerMan','workerWoman','infrastructure','props','vegetation','path','fence'])assert.ok(manifest.assets[name],name);
 let files=0;for(const asset of Object.values(manifest.assets))for(const entry of [asset,asset.lod?.far].filter(Boolean)){
  assert.ok(/^\/play\/assets\/models\/(?:world|prototype)\/[\w-]+\.glb$/.test(entry.url));
  const bytes=await readFile('dist'+entry.url),source=await readFile('game/client'+entry.url.slice('/play'.length));
  assert.deepEqual(bytes,source,entry.url);assert.equal(sha(bytes),entry.sha256,entry.url);assert.equal(bytes.length,entry.bytes,entry.url);
  assert.equal(bytes.readUInt32LE(0),0x46546c67);assert.equal(bytes.readUInt32LE(4),2);assert.equal(bytes.readUInt32LE(8),bytes.length);files++;
 }assert.equal(files,27);
});

test('the shared terrain including the paddy fields and mountain ridges is in the delivery receipt',async()=>{
 const receipt=JSON.parse(await readFile('dist/play/build-info.json','utf8'));
 const terrain=receipt.assets.terrain;
 const delivered=await readFile('dist'+terrain.url);
 assert.equal(sha(delivered),terrain.sha256);
 assert.equal(delivered.length,terrain.bytes);
 const json=JSON.parse(delivered.subarray(20,20+delivered.readUInt32LE(12)));
 for(const role of Object.values(terrain.roles))assert.ok(json.nodes.some(node=>node.name===role),role);
 assert.ok(receipt.inputs.includes('game/client/cozy-sky.js'));
 assert.equal(receipt.panorama,undefined);
});
