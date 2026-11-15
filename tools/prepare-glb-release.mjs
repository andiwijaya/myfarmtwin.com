import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';

const root=process.cwd(),files=new Set(['.gitattributes','dist/_headers','tools/build.mjs','tools/serve.mjs','tools/build-glb-prototype.mjs','tools/serve-glb-preview.mjs','tools/prepare-glb-release.mjs','tools/glb-prototype-e2e.mjs','tools/glb-prototype-journeys.mjs','tools/glb-prototype-browser-helper.mjs','game/client/index.html','dist/play/index.html','dist/play/build-info.json','game/client/glb-prototype-app.js','game/client/glb-prototype-world.js','game/client/glb-prototype-state.js','dist/play/glb-prototype-app.js','dist/play/glb-prototype-world.js','dist/play/glb-prototype-state.js','game/tests/glb-prototype-state.test.mjs','docs/PRD_MYFARMTWIN_GLB_UPGRADE_V1.md','docs/GLB_PROTOTYPE_PROGRESS.md','docs/GLB_PROTOTYPE_SAVE_CONTRACT.md','docs/GLB_PROTOTYPE_ASSET_CATALOG.md']);
files.add('tools/publish-glb-preview.mjs');
// These retained standalone files have newline-only canonical build changes;
// include their exact bytes so the complete deployed artifact matches the ZIP.
files.add('dist/play/chicken-market.js');files.add('dist/play/data-tools.js');
async function walk(dir){for(const item of await readdir(resolve(root,dir),{withFileTypes:true})){const name=dir+'/'+item.name;if(item.isSymbolicLink())throw Error('No release symlinks');if(item.isDirectory())await walk(name);else files.add(name);}}
for(const dir of ['game/client/glb','game/client/assets/models','dist/play/glb','dist/play/assets/models'])await walk(dir);
for(const item of await readdir(resolve(root,'tools/art')))if(/^glb-prototype-.*\.mjs$/.test(item))files.add('tools/art/'+item);
const manifest=[];for(const name of [...files].sort()){const path=resolve(root,name);if(!relative(root,path)||relative(root,path).startsWith('..'+sep))throw Error('Unsafe release input');const bytes=await readFile(path),gitSha=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');manifest.push({path:name,bytes:bytes.length,gitSha,sha256:createHash('sha256').update(bytes).digest('hex'),binary:name.endsWith('.glb')});}
await mkdir('qa-artifacts/glb-upgrade/release',{recursive:true});await writeFile('qa-artifacts/glb-upgrade/release/files.json',JSON.stringify(manifest,null,2));console.log(JSON.stringify({files:manifest.length,totalBytes:manifest.reduce((n,f)=>n+f.bytes,0),uniqueBlobs:new Set(manifest.map(f=>f.gitSha)).size}));
