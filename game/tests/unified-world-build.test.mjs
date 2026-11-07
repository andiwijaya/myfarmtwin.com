import test from 'node:test';import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,readdir,rm} from 'node:fs/promises';import {join,resolve} from 'node:path';import {tmpdir} from 'node:os';
import {build} from '../../tools/build.mjs';
test('preview build pins local Three modules and notice, without changing editorial files or copying maps',async()=>{
 const temp=resolve(tmpdir()),root=await mkdtemp(join(temp,'mft-unified-build-'));
 try{
  for(const dir of ['game/client','dist','node_modules/three/build'])await mkdir(join(root,dir),{recursive:true});
  await writeFile(join(root,'dist/index.html'),'EDITORIAL');await writeFile(join(root,'game/client/unified-world-preview.js'),"import {Scene} from 'three';\n");
  await writeFile(join(root,'node_modules/three/package.json'),JSON.stringify({version:'0.187.0'}));
  for(const [path,body]of [['build/three.module.js','MODULE'],['build/three.core.js','CORE'],['LICENSE','UPSTREAM MIT NOTICE'],['build/private.map','DO NOT SHIP']])await writeFile(join(root,'node_modules/three',path),body);
  await build(root,{bundle:false});assert.equal(await readFile(join(root,'dist/index.html'),'utf8'),'EDITORIAL');
  assert.equal(await readFile(join(root,'dist/play/unified-world-preview.js'),'utf8'),"import {Scene} from './vendor/three/three.module.js';\n");
  assert.deepEqual((await readdir(join(root,'dist/play/vendor/three'))).sort(),['LICENSE.txt','three.core.js','three.module.js','version.json']);
  assert.equal(await readFile(join(root,'dist/play/vendor/three/LICENSE.txt'),'utf8'),'UPSTREAM MIT NOTICE');
  await writeFile(join(root,'node_modules/three/package.json'),JSON.stringify({version:'0.188.0'}));await assert.rejects(build(root,{bundle:false}),/Expected pinned/);
 }finally{assert.ok(root.startsWith(join(temp,'mft-unified-build-')));await rm(root,{recursive:true,force:true});}
});
