import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const receipt=JSON.parse(await readFile('dist/play/build-info.json','utf8'));
assert.equal(receipt.three,'0.187.0');
const names=[...receipt.emitted.filter(f=>f.name.startsWith('vendor/three/')).map(f=>f.name),'vendor/three/LICENSE.txt','vendor/three/version.json'].sort();
const assets=[];
for(const name of names){const bytes=await readFile('dist/play/'+name);assets.push({path:'dist/play/'+name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex'),sourcePackage:'three@0.187.0',transformation:name.endsWith('.js')?'Tree-shaken/minified with esbuild@0.28.2; shared class identity and lazy WebGL split':'Exact upstream notice / pinned version receipt',license:'MIT',notice:'dist/play/vendor/three/LICENSE.txt'});}
const manifest={audited:'2026-11-07',purpose:'Hidden world feasibility preview; no MyZooTwin art or source copied',assets,proceduralSource:'game/client/unified-world-preview.js',proceduralOrigin:'Original repository-authored primitive geometry and cosmetic hen breathing; feasibility placeholders, not M4/M5 acceptance',textures:0};
const output=JSON.stringify(manifest,null,2)+'\n',path='docs/UNIFIED_WORLD_ASSETS.json';
if(process.argv.includes('--write'))await writeFile(path,output);else assert.deepEqual(JSON.parse(await readFile(path,'utf8')),manifest,'Asset manifest differs from current build');
console.log('Unified graphics provenance '+(process.argv.includes('--write')?'updated':'verified'),assets.length);
