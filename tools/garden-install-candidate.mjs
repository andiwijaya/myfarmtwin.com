import assert from 'node:assert/strict';
import {readFile,readdir,writeFile,cp,unlink,lstat} from 'node:fs/promises';
import {resolve,join} from 'node:path';import {createHash} from 'node:crypto';
const root=resolve('dist'),stage=resolve(process.env.GARDEN_FINAL_COPY==='1'?'qa-artifacts/garden/final-build/dist':'qa-artifacts/garden/build/dist'),hash=b=>createHash('sha256').update(b).digest('hex');
assert.equal(root,join(process.cwd(),'dist'));assert.equal((await lstat(root)).isSymbolicLink(),false);
const next=JSON.parse(await readFile(join(stage,'play/build-info.json'),'utf8')),old=JSON.parse(await readFile(join(root,'play/build-info.json'),'utf8'));
const bound=new Set([...next.emitted,...next.defaultCore].map(f=>'play/'+f.name));
// Canonicalize only unbound text; receipt-bound bytes and upstream vendor stay exact.
async function canonical(dir,rel=''){for(const e of await readdir(join(dir,rel),{withFileTypes:true})){assert.equal(e.isSymbolicLink(),false);const p=rel?rel+'/'+e.name:e.name;if(e.isDirectory())await canonical(dir,p);else if(/\.(js|css|html|svg|json|txt)$/.test(p)&&!p.startsWith('play/vendor/')&&!bound.has(p)){const b=await readFile(join(dir,p),'utf8');if(b.includes('\r\n'))await writeFile(join(dir,p),b.replaceAll('\r\n','\n'));}}}
await canonical(stage);
for(const f of [...next.emitted,...next.defaultCore]){const b=await readFile(join(stage,'play',f.name));assert.equal(hash(b),f.sha256);assert.equal(b.length,f.bytes);}
const current=new Set(next.emitted.map(f=>f.name)),retired=[];
for(const f of old.emitted)if(!current.has(f.name)){assert.match(f.name,/^[\w/.-]+\.js$/);assert.ok(!f.name.includes('..'));const p=join(root,'play',f.name);assert.equal(hash(await readFile(p)),f.sha256);await unlink(p);retired.push(f.name);}
await cp(stage,root,{recursive:true});console.log(JSON.stringify({installedFrom:stage,receiptRawSHA256:hash(await readFile(join(root,'play/build-info.json'))),retiredOwnedModules:retired,editorialRemoved:false}));
