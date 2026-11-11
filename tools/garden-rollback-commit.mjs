import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';

// Prepare a deployable rollback with a separate temporary Git index.
// No checkout, reset, user index changes or production activation.
const final=process.env.GARDEN_FINAL_COPY==='1',root=resolve(final?'qa-artifacts/garden/rollback-v6-final-ready':'qa-artifacts/garden/rollback-v6-active'),qa=resolve(final?'qa-artifacts/garden/rollback-final-publication':'qa-artifacts/garden/rollback-active-publication');await mkdir(qa,{recursive:true});
const env={...process.env,GIT_INDEX_FILE:join(qa,'index')};
const git=(args,input)=>execFileSync('git',args,{env,input,maxBuffer:32*1024*1024});
const parent=git(['rev-parse','HEAD']).toString().trim(),branch=final?'codex/garden-final-v6-rollback':'codex/garden-active-v6-rollback';
try{git(['show-ref','--verify','--quiet','refs/heads/'+branch]);throw new Error('Rollback branch already exists; inspect instead of overwriting');}catch(e){if(e.status!==1)throw e;}
git(['read-tree',parent]);
const old=git(['ls-files','-z','--','game/client','dist']);git(['update-index','--force-remove','-z','--stdin'],old);
for(const p of git(['ls-tree','-r','--name-only',parent,'game/client']).toString().trim().split(/\r?\n/)){
 let bytes;try{bytes=await readFile(join(root,p));}catch(e){if(e.code==='ENOENT')continue;throw e;}const blob=git(['hash-object','-w','--stdin'],bytes).toString().trim();git(['update-index','--add','--cacheinfo','100644',blob,p]);}

const files=[];async function walk(rel){for(const e of await readdir(join(root,rel),{withFileTypes:true})){assert.equal(e.isSymbolicLink(),false);const p=rel+'/'+e.name;if(e.isDirectory())await walk(p);else files.push(p);}}await walk('dist');
const lines=[];for(const p of files.sort()){const bytes=await readFile(join(root,p)),blob=git(['hash-object','-w','--stdin'],bytes).toString().trim();lines.push('100644 '+blob+'\t'+p+'\n');}
git(['update-index','--index-info'],lines.join(''));const tree=git(['write-tree']).toString().trim();
const message=join(qa,'message.txt');await writeFile(message,'Prepare playable V6-compatible garden rollback\n\nRebuild checkpoint 7503ca9 source; retain schema V6, 24 immediately active beds, corn and current editorial output. Native 24-bed gameplay and save safety rehearsed without download tests.\n');
const commit=git(['commit-tree',tree,'-p',parent,'-F',message]).toString().trim();git(['update-ref','refs/heads/'+branch,commit,'0000000000000000000000000000000000000000']);
const proof={atUTC:new Date().toISOString(),branch,commit,parent,tree,distTree:git(['rev-parse',commit+':dist']).toString().trim(),files:files.length,receiptRawSHA256:createHash('sha256').update(await readFile(join(root,'dist/play/build-info.json'))).digest('hex'),primaryCheckoutChanged:false,productionActivated:false};await writeFile(join(qa,'commit.json'),JSON.stringify(proof,null,2));console.log(JSON.stringify(proof));
