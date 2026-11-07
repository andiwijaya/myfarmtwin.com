import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from '../../tools/build.mjs';
test('isolated build preserves homepage, shared styles, content and existing game save-independent assets',async()=>{
 const root=await mkdtemp(join(tmpdir(),'mft-build-'));
 try{
  for(const dir of ['game/client','dist/grow','dist/play']) await mkdir(join(root,dir),{recursive:true});
  const existing={'dist/index.html':'HOME','dist/styles.css':'STYLES','dist/grow/index.html':'CONTENT','dist/play/retained.svg':'RETAIN'};
  for(const [p,v] of Object.entries(existing)) await writeFile(join(root,p),v);
  await writeFile(join(root,'game/client/index.html'),'GAME\r\n');
  await writeFile(join(root,'game/client/cow.css'),'cow{}\r\n');
  await build(root);
  for(const [p,v] of Object.entries(existing)) assert.equal(await readFile(join(root,p),'utf8'),v);
  assert.equal(await readFile(join(root,'dist/play/index.html'),'utf8'),'GAME\n');
  assert.equal(await readFile(join(root,'dist/play/cow.css'),'utf8'),'cow{}\n');
  await writeFile(join(root,'game/client/index.html'),'UPDATE');await build(root);
  assert.equal(await readFile(join(root,'dist/index.html'),'utf8'),'HOME');
 }finally{await rm(root,{recursive:true,force:true});}
});
