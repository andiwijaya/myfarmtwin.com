import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

// Publish only this reviewed artifact to the existing repository's preview
// branch. No credential is printed or copied, and production main is not moved.
const branch='codex/glb-prototype-20261115';
const git=(args,options={})=>execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe'],...options}).trim();
assert.equal(git(['rev-parse','--show-toplevel']).replaceAll('\\','/').toLowerCase(),'c:/myfarmtwin');
assert.equal(git(['remote','get-url','origin']),'https://github.com/andiwijaya/myfarmtwin.com.git');
const files=JSON.parse(await readFile('qa-artifacts/glb-upgrade/release/files.json','utf8'));
const alreadyStaged=git(['diff','--cached','--name-only']).split('\n').filter(Boolean);
assert.ok(alreadyStaged.every(path=>files.some(file=>file.path===path)),'Preserve any unrelated staged work.');
for(const file of files){if(file.deleted){assert.equal(git(['rev-parse','HEAD:'+file.path]),file.beforeGitSha);try{await readFile(file.path);throw Error('Deleted release file unexpectedly exists: '+file.path);}catch(error){if(error.code!=='ENOENT')throw error;}continue;}const bytes=await readFile(file.path);assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,'Source changed after review: '+file.path);}
await writeFile('qa-artifacts/glb-upgrade/release/pathspec.txt',files.map(f=>f.path).join('\n')+'\n');
git(['fetch','--no-tags','origin','main']);
assert.equal(git(['merge-base','--is-ancestor','FETCH_HEAD','HEAD']),'','Remote source advanced; reconcile before publishing.');
const current=git(['branch','--show-current']);if(current!==branch)git(['switch','-c',branch]);
git(['add','--pathspec-from-file=qa-artifacts/glb-upgrade/release/pathspec.txt']);
const staged=git(['diff','--cached','--name-only']).split('\n').filter(Boolean);assert.ok(staged.every(path=>files.some(file=>file.path===path)),'Stage only the declared release files.');
for(const file of files.filter(f=>f.path.startsWith('dist/')&&!f.deleted)){const actual=git(['rev-parse',':'+file.path]);assert.equal(actual,file.gitSha,'The deployed artifact must retain exact bytes: '+file.path);}
if(staged.length)git(['-c','user.name=MyFarmTwin','-c','user.email=hello@myfarmtwin.com','commit','-m',process.argv[2]||'Add tropical GLB garden and cow-barn prototype with protected native saves']);
const sha=git(['rev-parse','HEAD']);
git(['push','origin','HEAD:refs/heads/'+branch]);
const remote=git(['ls-remote','origin','refs/heads/'+branch]).split(/\s+/)[0];assert.equal(remote,sha);
const receipt={atUTC:new Date().toISOString(),repository:'andiwijaya/myfarmtwin.com',branch,sha,productionChanged:false,files:files.length};await writeFile('qa-artifacts/glb-upgrade/release/preview-source.json',JSON.stringify(receipt,null,2));console.log(JSON.stringify(receipt));
