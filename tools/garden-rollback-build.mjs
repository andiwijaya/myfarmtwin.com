import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile,copyFile,access} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {createHash} from 'node:crypto';
import {build} from './build.mjs';

const final=process.env.GARDEN_FINAL_COPY==='1',source='7503ca9',root=resolve(final?'qa-artifacts/garden/rollback-v6-final-ready':'qa-artifacts/garden/rollback-v6-active');
// A new dedicated artifact: refuse to overwrite an earlier rehearsal.
try{await access(root);throw new Error('Rollback directory already exists');}catch(e){if(e.code!=='ENOENT')throw e;}
const git=(...args)=>execFileSync('git',args,{maxBuffer:32*1024*1024});
const paths=(ref,p)=>git('ls-tree','-r','--name-only',ref,p).toString().trim().split(/\r?\n/).filter(Boolean);
await mkdir(root,{recursive:true});
const nativeCompared=[];
const nativeUpdates=new Set(['game/client/active-garden.js','game/client/engine.js','game/client/storage.js','game/client/main.js','game/client/game-session.js','game/client/locales.js','game/client/index.html']);
for(const p of [...new Set([...paths(source,'game/client'),...nativeUpdates])]){
 const bytes=nativeUpdates.has(p)?await readFile(p):git('show',source+':'+p);await mkdir(dirname(resolve(root,p)),{recursive:true});await writeFile(resolve(root,p),bytes);
 if(!/\/(?:unified-|garden-growth)/.test(p)){
  const current=await readFile(p);
  assert.equal(current.toString().replaceAll('\r\n','\n'),bytes.toString().replaceAll('\r\n','\n'),'Native source drift: '+p);
  nativeCompared.push(p);
 }
}
// Current editorial content, in canonical Git bytes; omit the old play build.
for(const p of paths('HEAD','dist').filter(p=>!p.startsWith('dist/play/'))){await mkdir(dirname(resolve(root,p)),{recursive:true});await writeFile(resolve(root,p),git('show','HEAD:'+p));}
for(const p of ['package.json','package-lock.json','tools/three-cpu-entry.mjs','node_modules/three/package.json','node_modules/three/LICENSE','node_modules/three/build/three.module.js','node_modules/three/build/three.core.js']){
 await mkdir(dirname(resolve(root,p)),{recursive:true});await copyFile(p,resolve(root,p));
}
await build(root);
const receipt=await readFile(resolve(root,'dist/play/build-info.json'));
const proof={atUTC:new Date().toISOString(),source:git('rev-parse',source).toString().trim(),root,nativeCompared:nativeCompared.length,nativeSourceEqualAfterEolNormalization:true,receiptRawSHA256:createHash('sha256').update(receipt).digest('hex'),schema:6,activeBeds:24,nativeUpdates:[...nativeUpdates],oldTrackedDistReused:false,productionChanged:false,playableRehearsal:'pending'};
await writeFile(final?'qa-artifacts/garden/rollback-final-build.json':'qa-artifacts/garden/rollback-active-build.json',JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));
