import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';import {join,relative} from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
import {digest} from './unified-save-baseline.mjs';
import {execFileSync} from 'node:child_process';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-build');await mkdir(qa,{recursive:true});
const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())await walk(path);else{const name=relative('dist',path).replaceAll('\\','/');if(!name.startsWith('play/')||/\.(webp|png|svg)$/.test(name)){const bytes=await readFile(path);files.push({name,bytes:bytes.length,sha256:digest(bytes)});}}}}
await walk('dist');files.sort((a,b)=>a.name.localeCompare(b.name));
if(process.argv.includes('--before')){await writeFile(join(qa,'preserved-before.json'),JSON.stringify(files,null,2));console.log('Frozen editorial and original media files:',files.length);}
else{const before=JSON.parse(await readFile(join(qa,'preserved-before.json'),'utf8'));assert.deepEqual(files,before,'Editorial or original media changed');
 const license=await readFile('dist/play/vendor/three/LICENSE.txt','utf8');assert.equal(license,await readFile('node_modules/three/LICENSE','utf8'));
 const version=JSON.parse(await readFile('dist/play/vendor/three/version.json','utf8'));assert.equal(version.version,'0.187.0');
 const bundle=JSON.parse(await readFile('dist/play/build-info.json','utf8'));assert.equal(bundle.kind,'myfarmtwin-world-build-v1');assert.equal(bundle.esbuild,'0.28.2');assert.equal(bundle.three,'0.187.0');assert.equal(bundle.sourceMaps,false);
 for(const file of [...bundle.emitted,...bundle.defaultCore]){assert.ok(!file.name.includes('..')&&!file.name.startsWith('/'));const bytes=await readFile('dist/play/'+file.name);assert.equal(bytes.length,file.bytes);assert.equal(digest(bytes),file.sha256);if(file.name.endsWith('.js'))assert.doesNotMatch(bytes.toString(),/sourceMappingURL/);}
 const preview=await readFile('dist/play/unified-world-preview.js','utf8');assert.ok(preview.includes('./'+bundle.lazyWebGL),'WebGL driver is version-bound and lazy');await assert.rejects(readFile('dist/play/vendor/three/three.core.js'),{code:'ENOENT'});
 for(const name of new Set(['build-info.json',...bundle.emitted.map(f=>f.name),...bundle.defaultCore.map(f=>f.name)])){const path='dist/play/'+name,raw=execFileSync('git',['hash-object','--no-filters',path],{encoding:'utf8'}).trim(),filtered=execFileSync('git',['hash-object','--path='+path,path],{encoding:'utf8'}).trim();assert.equal(raw,filtered,'Git checkout would change receipt-bound bytes: '+name);}
 const coreBytes=bundle.defaultCore.reduce((n,f)=>n+f.bytes,0);assert.ok(coreBytes<640*1024);
 await writeFile(join(qa,'build-audit.json'),JSON.stringify({editorialAndOriginalMedia:files.length,byteExact:true,three:version,bundler:bundle.esbuild,defaultCoreBytes:coreBytes,noticeExact:true,generatedHashesExact:true,lazyDriver:bundle.lazyWebGL},null,2));console.log('Editorial/media, bundle hashes and full MIT notice PASS:',files.length,'default bytes',coreBytes);
}
