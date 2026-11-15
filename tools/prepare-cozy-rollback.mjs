import {readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';
// A safe emergency release keeps the tested V2 reader and all local data.
// It disables the 3D default entry while the graphical release is repaired.
const root=process.cwd(),target=resolve(root,process.argv[2]||'qa-artifacts/cozy-world/rollback/dist');
if(!target.startsWith(resolve(root,'qa-artifacts/cozy-world')+sep))throw Error('Rollback output must remain inside QA workspace');
await mkdir(target,{recursive:true});await cp(resolve(root,'dist'),target,{recursive:true});
const html=await readFile(resolve(root,'dist/play/recovery/index.html'));
for(const path of ['play/index.html','play/glb/index.html','play/cozy/index.html'])await writeFile(resolve(target,path),html);
const source=JSON.parse(await readFile(resolve(root,'dist/play/build-info.json'),'utf8'));
const receipt={kind:'myfarmtwin-cozy-recovery-v2',sourceEntry:source.entry,recoveryEntry:source.recoveryEntry,htmlSha256:createHash('sha256').update(html).digest('hex'),preservesKeys:['myfarmtwin.cozy.save.v2','myfarmtwin.save.v1','myfarmtwin.glb.layout.v1'],mode:'read-export-and-explicit-legacy-recovery',recoveryTestURL:'/play/recovery/'};
await writeFile(resolve(target,'play/build-info.json'),JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({output:relative(root,target),...receipt}));
