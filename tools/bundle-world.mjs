import {build as bundle,version} from 'esbuild';
import {resolve,relative,join,dirname,sep,isAbsolute} from 'node:path';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';

const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
/** Bundled default game + split CPU/WebGL Three. Only writes owned dist/play paths. */
export async function bundleWorld(root){
 if(version!=='0.28.2')throw new Error('Expected pinned esbuild 0.28.2');
 const target=resolve(root,'dist/play'),source=resolve(root,'game/client');
 const safe=name=>{const path=resolve(target,name),rel=relative(target,path);if(rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel))throw new Error('Unsafe bundle output');return path;};
 let previous=null;try{previous=JSON.parse(await readFile(join(target,'build-info.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const common={absWorkingDir:resolve(root),bundle:true,platform:'browser',format:'esm',target:'es2022',minify:true,charset:'utf8',legalComments:'eof',sourcemap:false,metafile:true,write:false,logLevel:'silent'};
 const core=await bundle({...common,entryPoints:[{in:join(source,'main.js'),out:'main'},{in:join(source,'unified-world-bootstrap.js'),out:'unified-world-bootstrap'}],outdir:target,splitting:true,chunkNames:'vendor/game/chunks/[name]-[hash]',external:['./unified-world-preview.js']});
 const graphics=await bundle({...common,entryPoints:[{in:resolve(root,'tools/three-cpu-entry.mjs'),out:'vendor/three/three.module'},{in:join(source,'unified-world-preview.js'),out:'unified-world-preview'}],outdir:target,splitting:true,chunkNames:'vendor/three/chunks/[name]-[hash]',plugins:[{name:'pinned-three-cpu-driver-split',setup(api){api.onResolve({filter:/^three$/},args=>({path:resolve(root,'node_modules/three/build',args.importer.endsWith('unified-world-webgl.js')?'three.module.js':'three.core.js')}));}}]});
 const emitted=[];
 for(const file of [...core.outputFiles,...graphics.outputFiles]){const name=relative(target,file.path).split(sep).join('/'),path=safe(name);if(path!==resolve(file.path)||!name.endsWith('.js'))throw new Error('Unexpected bundle output');await mkdir(dirname(path),{recursive:true});await writeFile(path,file.contents);emitted.push({name,bytes:file.contents.length,sha256:hash(file.contents)});}
 const current=new Set(emitted.map(f=>f.name));
 if(previous?.kind==='myfarmtwin-world-build-v1')for(const file of previous.emitted||[]){if(current.has(file.name)||(!/^vendor\/(?:three|game)\/chunks\/[\w-]+\.js$/.test(file.name)&&file.name!=='unified-world-webgl.js'))continue;const path=safe(file.name);let bytes;try{bytes=await readFile(path);}catch(error){if(error.code==='ENOENT')continue;throw error;}if(hash(bytes)!==file.sha256)throw new Error('Refusing to replace changed generated chunk');await unlink(path);}
 // Retire only our byte-verified, now-unreferenced prototype vendor copy.
 const oldCore=safe('vendor/three/three.core.js');try{const [old,original]=await Promise.all([readFile(oldCore),readFile(resolve(root,'node_modules/three/build/three.core.js'))]);if(hash(old)!==hash(original))throw new Error('Unexpected legacy vendor bytes');await unlink(oldCore);}catch(error){if(error.code!=='ENOENT')throw error;}
 const html=await readFile(join(target,'index.html'),'utf8'),active=new Set(['index.html','main.js']);
 for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){const url=match[1];if(url.startsWith('/')||url.startsWith('#')||/^[a-z]+:/i.test(url))continue;const name=url.replace(/^\.\//,'');if(/\.(js|css|webp|png|svg)$/.test(name)){safe(name);active.add(name);}}
 const coreOutputs=new Map(Object.entries(core.metafile.outputs).map(([name,output])=>[resolve(root,name),output]));
 for(const name of active){const output=coreOutputs.get(safe(name));for(const item of output?.imports||[]){if(item.kind!=='import-statement')continue;const imported=relative(target,resolve(root,item.path)).split(sep).join('/');safe(imported);active.add(imported);}}
 const defaultCore=[];for(const name of [...active].sort()){const bytes=await readFile(safe(name));defaultCore.push({name,bytes:bytes.length,sha256:hash(bytes)});}
 const lazyWebGL=emitted.find(f=>f.name.includes('unified-world-webgl-'))?.name;if(!lazyWebGL)throw new Error('Missing version-bound WebGL chunk');
 const receipt={kind:'myfarmtwin-world-build-v1',three:'0.187.0',esbuild:version,sourceMaps:false,defaultCore,emitted:emitted.sort((a,b)=>a.name.localeCompare(b.name)),lazyWebGL,retainedStandaloneModules:true};
 await writeFile(join(target,'build-info.json'),JSON.stringify(receipt,null,2)+'\n');
 return receipt;
}
