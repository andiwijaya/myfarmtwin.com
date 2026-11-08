import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resolve,basename} from 'node:path';
import {build,transform} from 'esbuild';

const root=resolve('game/client');
async function ast(path){return (await transform(await readFile(path,'utf8'),{loader:'js',legalComments:'none',minifySyntax:true})).code;}
async function graph(entries){const result=await build({entryPoints:entries.map(name=>resolve(root,name)),outdir:'architecture-check',bundle:true,write:false,metafile:true,platform:'neutral',logLevel:'silent'});return new Map(await Promise.all(Object.keys(result.metafile.inputs).map(async path=>[resolve(path),await ast(path)])));}
function calls(code){return [...code.matchAll(/\b([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g)].map(m=>m[1]);}

test('authoritative engine and save dependency graphs never depend on unified presentation',async()=>{
 const domain=await graph(['engine.js','save-schema.js','storage.js']);assert.ok(domain.size>40,'Exercise the complete native graph');for(const [path,tree]of domain){assert.doesNotMatch(basename(path),/unified-|preview|game-session|three/);assert.ok(!calls(tree).some(c=>/^(requestAnimationFrame|setInterval)$/.test(c)),path);}
});

test('read-only world projection graph cannot reach storage, command reducers or browser clocks',async()=>{
 const model=await graph(['unified-world-model.js','unified-world-camera.js','unified-world-registry.js','unified-world-selection.js']);for(const [path,tree]of model){assert.doesNotMatch(basename(path),/^(engine|storage|save-schema|game-session)\.js$/);assert.ok(!calls(tree).some(c=>/^(dispatch|setInterval|setTimeout|requestAnimationFrame)$|(?:localStorage|sessionStorage)\./.test(c)),path);}
});

test('unified renderer modules cannot create a simulation interval',async()=>{
 const files=(await readdir(root)).filter(name=>name.startsWith('unified-')||['game-session.js','world-loader.js'].includes(name));assert.ok(files.length>30);for(const name of files){const tree=await ast(resolve(root,name));assert.ok(!calls(tree).some(c=>/(?:^|\.)setInterval$/.test(c)),name);}const main=await ast(resolve(root,'main.js'));assert.equal(calls(main).filter(c=>/(?:^|\.)setInterval$/.test(c)).length,1,'Only the original application controller owns the fixed interval');
});
