import {execFileSync} from 'node:child_process';
import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const baseline='dd8184e1beb95685ded536dcef022eb4e7306f6f',git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim(),changed=git('diff','--name-only',baseline).split(/\r?\n/).filter(Boolean);
assert.deepEqual(changed.filter(n=>n.startsWith('dist/')&&!n.startsWith('dist/play/')),[],'Homepage/editorial/assets changed');
const protectedPaths=['package.json','package-lock.json','wrangler.toml','wrangler.json','wrangler.jsonc','.github','dist/_headers','dist/_redirects','game/tests/fixtures/chicken-v1','game/tests/fixtures/goat-v2'];assert.equal(git('diff',baseline,'--',...protectedPaths),'','Protected configuration/dependencies/legacy fixtures changed');
git('-c','core.whitespace=blank-at-eol,blank-at-eof,space-before-tab,cr-at-eol','diff','--check',baseline);
async function list(root){const out=[];for(const e of await readdir(root,{withFileTypes:true})){assert.ok(!e.isSymbolicLink());if(e.isDirectory())for(const p of await list(join(root,e.name)))out.push(e.name+'/'+p);else out.push(e.name);}return out.sort();}
const source=await list('game/client'),built=await list('dist/play');assert.deepEqual(source,built);const hashes=[];
for(const name of source){const a=await readFile(join('game/client',name)),b=await readFile(join('dist/play',name));assert.ok(a.equals(b),name);hashes.push({name,bytes:a.length,gzip:gzipSync(a).length,checkoutSha256:createHash('sha256').update(a).digest('hex'),committedDistBlob:git('rev-parse','HEAD:dist/play/'+name)});}
const additions=git('diff','--name-only','--diff-filter=A',baseline).split(/\r?\n/).filter(Boolean);assert.deepEqual(additions.filter(n=>/(^|\/)(qa|node_modules|\.cache|test-results|playwright-report)(\/|$)|\.(png|mp4|zip|har)$/i.test(n)),[]);for(const n of additions)assert.ok((await readFile(n)).length<250000,n);
const report={baseline,sourceCommit:git('rev-parse','HEAD'),branch:git('branch','--show-current'),distTree:git('rev-parse','HEAD:dist'),clientFiles:source.length,rawBytes:hashes.reduce((n,x)=>n+x.bytes,0),gzipEquivalent:hashes.reduce((n,x)=>n+x.gzip,0),protectedHomepageEditorialAssets:true,unchangedDependenciesDeploymentSecurity:true,legacyFixturesUnchanged:true,sourceBuildExact:true,noTrackedQA:true,publication:'LOCAL ONLY; no push/deploy authorized. Checkout hashes can differ from canonical Git blobs solely through existing EOL checkout conversion; production must be verified against exact committed blobs after authorization.',hashes};
assert.equal(report.branch,'cow-farm-v1');assert.ok(report.rawBytes<512*1024&&report.gzipEquivalent<200*1024);if(process.env.QA_DIR){await mkdir(process.env.QA_DIR,{recursive:true});await writeFile(join(process.env.QA_DIR,'cow-release-audit.json'),JSON.stringify(report,null,2));}console.log(JSON.stringify({...report,hashes:undefined}));
