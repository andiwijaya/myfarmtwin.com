import {cp,mkdir,copyFile,readFile,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
import {build} from './build.mjs';
// Build beside ignored QA data; never replace the user's existing dist preview.
const root=resolve('qa-artifacts/garden/build');
await mkdir(root,{recursive:true});
await cp('game/client',join(root,'game/client'),{recursive:true});
await cp('dist',join(root,'dist'),{recursive:true});
for(const p of ['package.json','package-lock.json','tools/three-cpu-entry.mjs','node_modules/three/package.json','node_modules/three/LICENSE','node_modules/three/build/three.module.js','node_modules/three/build/three.core.js']){
 await mkdir(resolve(root,p,'..'),{recursive:true});await copyFile(p,resolve(root,p));
}
await build(root);
const bytes=await readFile(join(root,'dist/play/build-info.json'));
await writeFile('qa-artifacts/garden/build-result.json',JSON.stringify({root,receiptSHA256:createHash('sha256').update(bytes).digest('hex'),rootDistWritten:false},null,2));
console.log(root);
