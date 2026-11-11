import {cp,mkdir,copyFile,readFile,writeFile,rm,lstat,realpath} from 'node:fs/promises';
import {resolve,join,sep} from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {build} from './build.mjs';
// Build beside ignored QA data; never replace the user's existing dist preview.
const final=process.env.GARDEN_FINAL_COPY==='1',name=final?'final-build':'build',root=resolve('qa-artifacts/garden',name);
assert.equal(root,join(resolve('qa-artifacts/garden'),name));
assert.ok(root.startsWith(resolve('qa-artifacts/garden')+sep));
try{assert.equal((await lstat(root)).isSymbolicLink(),false);assert.equal((await realpath(root)).toLowerCase(),root.toLowerCase());}catch(e){if(e.code!=='ENOENT')throw e;}
// Exact verified generated build only. Failed receipts/captures live beside it.
await rm(root,{recursive:true,force:true});
await mkdir(root,{recursive:true});
await cp('game/client',join(root,'game/client'),{recursive:true});
await cp('dist',join(root,'dist'),{recursive:true});
for(const p of ['package.json','package-lock.json','tools/three-cpu-entry.mjs','node_modules/three/package.json','node_modules/three/LICENSE','node_modules/three/build/three.module.js','node_modules/three/build/three.core.js']){
 await mkdir(resolve(root,p,'..'),{recursive:true});await copyFile(p,resolve(root,p));
}
await build(root);
const bytes=await readFile(join(root,'dist/play/build-info.json'));
await writeFile(final?'qa-artifacts/garden/final-build-result.json':'qa-artifacts/garden/build-result.json',JSON.stringify({root,receiptSHA256:createHash('sha256').update(bytes).digest('hex'),rootDistWritten:false},null,2));
console.log(root);
