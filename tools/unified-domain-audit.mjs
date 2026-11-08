import {execFileSync} from 'node:child_process';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {verify} from './unified-save-baseline.mjs';

// Frozen pre-presentation checkpoint, not a moving branch or generated baseline.
const baseline='0061b73b89eb5c13dc770ecd56c730fd38f73649',allowed=new Set(['game/client/main.js','game/client/index.html','game/client/style.css','game/client/chicken-panel.js','game/client/chicken-snapshot.js','game/client/goat.css','game/client/cow.css','game/client/fish.css']),retired=new Set(['world.js','camera.js','isometric.js','chicken-view.js','chicken-layout.js','goat-view.js','cow-view.js','fish-view.js','fish-scene.js'].map(n=>'game/client/'+n));
const git=(args,input)=>execFileSync('git',args,{encoding:'utf8',input});
const original=git(['ls-tree','-rz',baseline,'--','game/client']).split('\0').filter(Boolean).map(row=>{const [metadata,path]=row.split('\t');return {path,blob:metadata.split(' ')[2]};});
const frozen=original.filter(file=>!allowed.has(file.path)&&!retired.has(file.path));
const hashes=git(['hash-object','--stdin-paths'],frozen.map(file=>file.path).join('\n')+'\n').trim().split('\n');
const rawHashes=git(['hash-object','--no-filters','--stdin-paths'],frozen.map(file=>file.path).join('\n')+'\n').trim().split('\n');
for(const [index,file]of frozen.entries()){assert.ok(hashes[index]===file.blob||rawHashes[index]===file.blob,'Original client source/media changed: '+file.path);file.checkoutLineEndingOnly=rawHashes[index]!==file.blob;}
assert.equal(original.length,129);assert.equal(frozen.length,112);for(const path of retired)await assert.rejects(readFile(path),{code:'ENOENT'});for(const name of ['chicken-panel.js','chicken-snapshot.js'])assert.equal((await readFile('game/client/'+name,'utf8')).replaceAll("'./chicken-view-types.js'","'./chicken-view.js'").replaceAll('\r\n','\n'),git(['show',baseline+':game/client/'+name]).replaceAll('\r\n','\n'),'Only moved renderer-independent JSDoc types');
const fixtures=await verify(),schema=await readFile('game/client/save-schema.js','utf8'),storage=await readFile('game/client/storage.js','utf8');
assert.equal(fixtures.saveVersion,5);assert.ok(storage.includes('myfarmtwin.save.v1'));
const main=await readFile('game/client/main.js','utf8');assert.equal((main.match(/setInterval\(/g)||[]).length,1,'Exactly one original simulation interval');
const report={baseline,originalFiles:original.length,unchangedFiles:frozen.length,originalFilesVerified:frozen,allowedPresentationIntegration:[...allowed],authorizedRetired2D:[...retired],sharedTypeReferencesOnly:true,legacyCssRetirement:['goat.css','cow.css','fish.css'],schemaSHA256:createHash('sha256').update(schema).digest('hex'),saveKey:'myfarmtwin.save.v1',saveVersion:5,fixtures,oneOriginalSimulationInterval:true,scope:'Original source/media blobs (raw bytes or Git checkout line-ending filter) and frozen save migrations. This audit does not replace UI replay, concurrency, runtime lifecycle or release tests.'};
const qa=process.env.QA_DIR||'qa-artifacts/unified-m7-domain';await mkdir(qa,{recursive:true});await writeFile(qa+'/domain-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({baseline,originalFiles:original.length,unchangedFiles:frozen.length,fixtures,oneOriginalSimulationInterval:true}));
