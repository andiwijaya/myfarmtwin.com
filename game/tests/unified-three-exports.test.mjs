import test from 'node:test';import assert from 'node:assert/strict';import {readFile} from 'node:fs/promises';

test('retained standalone graphics modules use the same fully exported pinned CPU classes',async()=>{
 const entry=await readFile(new URL('../../tools/three-cpu-entry.mjs',import.meta.url),'utf8'),exports=new Set(entry.match(/export\s*\{([^}]+)\}/)[1].split(',').map(s=>s.trim()));
 for(const name of ['unified-world-preview.js','unified-world-sprite-hit.js','unified-world-sprites.js','unified-world-batches.js','unified-world-part-meshes.js','unified-cozy-contact.js']){
  const source=await readFile(new URL('../client/'+name,import.meta.url),'utf8'),imports=source.match(/import\s*\{([^}]+)\}\s*from 'three'/)[1].split(',').map(s=>s.trim().split(/\s+as\s+/)[0]);assert.deepEqual(imports.filter(name=>!exports.has(name)),[],name+' imports a missing CPU alias export');
 }
 assert.equal(exports.has('WebGLRenderer'),false,'Keep the GPU driver lazy');
});
