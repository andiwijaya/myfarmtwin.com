import {readdir,readFile,writeFile,mkdir} from 'node:fs/promises';import {join,relative} from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
import {digest} from './unified-save-baseline.mjs';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-build');await mkdir(qa,{recursive:true});
const files=[];async function walk(dir){for(const e of await readdir(dir,{withFileTypes:true})){const path=join(dir,e.name);if(e.isDirectory())await walk(path);else{const name=relative('dist',path).replaceAll('\\','/');if(!name.startsWith('play/')||/\.(webp|png|svg)$/.test(name)){const bytes=await readFile(path);files.push({name,bytes:bytes.length,sha256:digest(bytes)});}}}}
await walk('dist');files.sort((a,b)=>a.name.localeCompare(b.name));
if(process.argv.includes('--before')){await writeFile(join(qa,'preserved-before.json'),JSON.stringify(files,null,2));console.log('Frozen editorial and original media files:',files.length);}
else{const before=JSON.parse(await readFile(join(qa,'preserved-before.json'),'utf8'));assert.deepEqual(files,before,'Editorial or original media changed');
 const license=await readFile('dist/play/vendor/three/LICENSE.txt','utf8');assert.equal(license,await readFile('node_modules/three/LICENSE','utf8'));
 const version=JSON.parse(await readFile('dist/play/vendor/three/version.json','utf8'));assert.equal(version.version,'0.187.0');
 const preview=await readFile('dist/play/unified-world-preview.js','utf8');assert.match(preview,/from '\.\/vendor\/three\/three\.module\.js'/);assert.doesNotMatch(preview,/sourceMappingURL|https:\/\//);
 for(const name of ['three.module.js','three.core.js'])assert.doesNotMatch(await readFile('dist/play/vendor/three/'+name,'utf8'),/sourceMappingURL/);
 await writeFile(join(qa,'build-audit.json'),JSON.stringify({editorialAndOriginalMedia:files.length,byteExact:true,three:version,noticeExact:true},null,2));console.log('Editorial/media, pinned vendor and MIT notice PASS:',files.length);
}
