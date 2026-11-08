import {build as bundle,version} from 'esbuild';
import {resolve,relative,join,dirname,sep,isAbsolute} from 'node:path';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
/** Content-addressed entry graph prevents cached 2D entries mixing with 3D.
 * Only owned output files under dist/play are written or retired. */
export async function bundleWorld(root){
 if(version!=='0.28.2')throw new Error('Expected pinned esbuild 0.28.2');
 const target=resolve(root,'dist/play'),source=resolve(root,'game/client');
 const safe=name=>{const path=resolve(target,name),rel=relative(target,path);if(rel==='..'||rel.startsWith('..'+sep)||isAbsolute(rel))throw new Error('Unsafe bundle output');return path;};
 let previous=null;try{previous=JSON.parse(await readFile(join(target,'build-info.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const common={absWorkingDir:resolve(root),bundle:true,platform:'browser',format:'esm',target:'es2022',minify:true,charset:'utf8',legalComments:'eof',sourcemap:false,metafile:true,write:false,logLevel:'silent',outdir:target,splitting:true,entryNames:'[dir]/[name]-[hash]'};
 // Rotate the content-addressed URLs once: legacy public Pages cache entries
 // retain no-transform after revalidation, while a fresh URL uses compression.
 // A stable banner refreshes those URLs without splitting the shared graph.
 const graphics=await bundle({...common,banner:{js:'// MyFarmTwin graphics transport v2: refreshed asset metadata; shared Three graph.'},entryPoints:[{in:resolve(root,'tools/three-cpu-entry.mjs'),out:'vendor/three/three.module'},{in:join(source,'unified-world-preview.js'),out:'unified-world-preview'}],chunkNames:'vendor/three/chunks/[name]-[hash]',plugins:[{name:'pinned-three-cpu-driver-split',setup(api){api.onResolve({filter:/^three$/},args=>({path:resolve(root,'node_modules/three/build',args.importer.endsWith('unified-world-webgl.js')?'three.module.js':'three.core.js')}));}}]});
 const outputs=result=>new Map(Object.entries(result.metafile.outputs).map(([name,data])=>[resolve(root,name),data]));
 const graphicOutputs=outputs(graphics),entry=(map,input)=>{const found=[...map].find(([,data])=>data.entryPoint&&resolve(root,data.entryPoint)===resolve(input));if(!found)throw Error('Missing entry '+input);return relative(target,found[0]).split(sep).join('/');};
 const world=entry(graphicOutputs,join(source,'unified-world-preview.js'));
 const core=await bundle({...common,entryPoints:[{in:join(source,'world-loader.js'),out:'world-loader'},{in:join(source,'main.js'),out:'main'},{in:join(source,'unified-world-bootstrap.js'),out:'unified-world-bootstrap'}],chunkNames:'vendor/game/chunks/[name]-[hash]',plugins:[{name:'version-bound-world',setup(api){api.onResolve({filter:/^\.\/unified-world-preview\.js$/},()=>({path:'./'+world,external:true}));}}]});
 const coreOutputs=outputs(core),allOutputs=new Map([...graphicOutputs,...coreOutputs]),emitted=[];
 for(const file of [...graphics.outputFiles,...core.outputFiles]){const name=relative(target,file.path).split(sep).join('/'),path=safe(name);if(path!==resolve(file.path)||!name.endsWith('.js'))throw Error('Unexpected bundle output');await mkdir(dirname(path),{recursive:true});await writeFile(path,file.contents);emitted.push({name,bytes:file.contents.length,sha256:hash(file.contents)});}
 const entries={loader:entry(coreOutputs,join(source,'world-loader.js')),main:entry(coreOutputs,join(source,'main.js')),bootstrap:entry(coreOutputs,join(source,'unified-world-bootstrap.js')),world,cpu:entry(graphicOutputs,resolve(root,'tools/three-cpu-entry.mjs'))};
 for(const [alias,name]of Object.entries({'world-loader.js':entries.loader,'main.js':entries.main,'unified-world-bootstrap.js':entries.bootstrap,'unified-world-preview.js':entries.world,'vendor/three/three.module.js':entries.cpu})){const module=relative(dirname(safe(alias)),safe(name)).split(sep).join('/');await writeFile(safe(alias),"export * from './"+module+"';\n");}
 const current=new Set(emitted.map(f=>f.name));
 if(previous?.kind==='myfarmtwin-world-build-v1')for(const file of previous.emitted||[]){if(current.has(file.name)||(!/^vendor\/(?:three|game)\/chunks\/[\w-]+\.js$/.test(file.name)&&!/[\w.-]+-[A-Z0-9]{8}\.js$/.test(file.name)&&file.name!=='unified-world-webgl.js'))continue;const path=safe(file.name);let bytes;try{bytes=await readFile(path);}catch(error){if(error.code==='ENOENT')continue;throw error;}if(hash(bytes)!==file.sha256)throw new Error('Refusing to retire changed generated chunk');await unlink(path);}
 const oldCore=safe('vendor/three/three.core.js');try{const [old,original]=await Promise.all([readFile(oldCore),readFile(resolve(root,'node_modules/three/build/three.core.js'))]);if(hash(old)!==hash(original))throw new Error('Unexpected old vendor bytes');await unlink(oldCore);}catch(error){if(error.code!=='ENOENT')throw error;}
 const lazyWebGL=emitted.find(f=>f.name.includes('unified-world-webgl-'))?.name;if(!lazyWebGL)throw new Error('Missing WebGL chunk');
 const critical=new Set([entries.loader,entries.bootstrap,entries.world,lazyWebGL]);
 for(const name of critical){const output=allOutputs.get(safe(name));for(const item of output?.imports||[]){if(item.kind!=='import-statement')continue;const imported=item.external?item.path.replace(/^\.\//,''):relative(target,resolve(root,item.path)).split(sep).join('/');safe(imported);critical.add(imported);}}
 let html=await readFile(join(target,'index.html'),'utf8');html=html.replace('./world-loader.js','./'+entries.loader);
 for(const name of ['style.css','goat.css','cow.css','fish.css'])html=html.replace('./'+name,'./'+name+'?v='+hash(await readFile(safe(name))).slice(0,16));
 html=html.replace('</head>',[...critical].filter(n=>n!==entries.loader).map(n=>'<link rel="modulepreload" href="./'+n+'">').join('\n')+'\n</head>');await writeFile(join(target,'index.html'),html);
 const active=new Set(['index.html',...critical]);for(const match of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)){const url=match[1];if(url.startsWith('/')||url.startsWith('#')||/^[a-z]+:/i.test(url))continue;const name=url.replace(/^\.\//,'').split('?')[0];if(/\.(js|css|webp|png|svg)$/.test(name)){safe(name);active.add(name);}}
 const defaultCore=[];for(const name of [...active].sort()){const bytes=await readFile(safe(name));defaultCore.push({name,bytes:bytes.length,sha256:hash(bytes)});}
 const receipt={kind:'myfarmtwin-world-build-v1',experience:'webgl-3d-only',three:'0.187.0',esbuild:version,sourceMaps:false,entries,defaultCore,emitted:emitted.sort((a,b)=>a.name.localeCompare(b.name)),lazyWebGL,retainedStandaloneModules:true};await writeFile(join(target,'build-info.json'),JSON.stringify(receipt,null,2)+'\n');return receipt;
}
