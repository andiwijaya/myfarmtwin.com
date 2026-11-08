import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const qa=process.env.QA_DIR||'qa-artifacts/unified-m8-cleanup';await mkdir(qa,{recursive:true});
const receipt=JSON.parse(await readFile('dist/play/build-info.json','utf8')),pkg=JSON.parse(await readFile('package.json','utf8')),owned=new Map(receipt.emitted.map(f=>[f.name,f]));
const vendor=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=dir+'/'+e.name;if(e.isDirectory())await walk(path);else vendor.push(path.replace('dist/play/',''));}}await walk('dist/play/vendor');
for(const path of vendor){if(path.endsWith('LICENSE.txt')||path.endsWith('version.json'))continue;if(path==='vendor/three/three.module.js'){assert.equal(await readFile('dist/play/'+path,'utf8'),"export * from './"+receipt.entries.cpu.split('/').at(-1)+"';\n");continue;}assert.ok(owned.has(path),'Unowned stale vendor output: '+path);const b=await readFile('dist/play/'+path);assert.equal(createHash('sha256').update(b).digest('hex'),owned.get(path).sha256);}
assert.deepEqual(pkg.dependencies,{three:'0.187.0'});assert.equal(receipt.sourceMaps,false);assert.ok(!vendor.some(p=>p.endsWith('.map')||p.endsWith('/three.core.js')));
const tracked=execFileSync('git',['ls-files','--','qa-artifacts'],{encoding:'utf8'});assert.equal(tracked.trim(),'','QA must remain ignored');
const retired=['world.js','camera.js','isometric.js','chicken-view.js','chicken-layout.js','goat-view.js','cow-view.js','fish-view.js','fish-scene.js','unified-world-canvas.js','preview-loader.js'];for(const name of retired)for(const dir of ['game/client/','dist/play/'])await assert.rejects(readFile(dir+name),{code:'ENOENT'});
const report={vendorFiles:vendor,receiptOwnedChunksExact:true,noRawCoreCopyOrSourceMaps:true,pinnedProductionPackages:pkg.dependencies,trackedQaFiles:0,authorizedRetired2D:retired,scope:'Removes only build-receipt-owned stale chunks through the existing safe build. The owner explicitly requested removal of 2D; rollback is a Git/Pages deployment, not a player-facing mode.'};await writeFile(qa+'/cleanup.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
