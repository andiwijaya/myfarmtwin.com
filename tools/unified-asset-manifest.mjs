import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const receipt=JSON.parse(await readFile('dist/play/build-info.json','utf8'));
assert.equal(receipt.three,'0.187.0');
const names=[...receipt.emitted.filter(f=>f.name.startsWith('vendor/three/')).map(f=>f.name),'vendor/three/LICENSE.txt','vendor/three/version.json'].sort();
const assets=[];
for(const name of names){const bytes=await readFile('dist/play/'+name);assets.push({path:'dist/play/'+name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),sourcePackage:'three@0.187.0',transformation:name.endsWith('.js')?'Tree-shaken/minified with esbuild@0.28.2; shared class identity and lazy WebGL split':'Exact upstream notice / pinned version receipt',license:'MIT',notice:'dist/play/vendor/three/LICENSE.txt'});}
const proceduralSources=[];for(const name of ['unified-world-preview.js','unified-world-art.js','unified-world-registry.js','unified-world-layout.js','unified-world-occlusion.js','unified-world-irrigation.js','unified-chicken-layout.js','unified-goat-layout.js','unified-cow-layout.js','unified-fish-layout.js']){const path='game/client/'+name,bytes=Buffer.from((await readFile(path,'utf8')).replaceAll('\r\n','\n'));proceduralSources.push({path,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),representation:'UTF-8 with LF; portable repository-source checksum',origin:'Original work authored for this repository under the current task; no external asset content'});}
const manifest={audited:'2026-11-07',purpose:'Hidden functional world preview; no MyZooTwin art or source copied',assets,proceduralSources,proceduralOrigin:'Original repository-authored primitive geometry and cosmetic hen breathing; provisional layouts, not M4/M5 acceptance',textures:0};
const output=JSON.stringify(manifest,null,2)+'\n',path='docs/UNIFIED_WORLD_ASSETS.json';
if(process.argv.includes('--write'))await writeFile(path,output);else assert.deepEqual(JSON.parse(await readFile(path,'utf8')),manifest,'Asset manifest differs from current build');
console.log('Unified graphics provenance '+(process.argv.includes('--write')?'updated':'verified'),assets.length);
