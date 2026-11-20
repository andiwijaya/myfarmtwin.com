import {build as bundle} from 'esbuild';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {resolve,relative,dirname,sep} from 'node:path';
import {createHash} from 'node:crypto';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

/** One versioned entry for both the full game and the former GLB preview URL. */
export async function buildCozyWorld(root=process.cwd(),{qaDistRoot=null}={}){
 const play=qaDistRoot?resolve(qaDistRoot,'play'):resolve(root,'dist/play');
 const target=resolve(play,'cozy');await mkdir(target,{recursive:true});
 if(qaDistRoot)await Promise.all(['glb','recovery','integrity'].map(name=>mkdir(resolve(play,name),{recursive:true})));let previous;try{previous=JSON.parse(await readFile(resolve(target,'build-info.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 const result=await bundle({absWorkingDir:root,entryPoints:[{in:'game/client/cozy-app.js',out:'app'},{in:'game/client/cozy-recovery.js',out:'recovery'},{in:'game/client/cozy-integrity.js',out:'integrity'}],bundle:true,format:'esm',platform:'browser',target:'es2022',define:{'globalThis.MYFARMTWIN_COMMON_ENGINE_QA':String(Boolean(qaDistRoot))},minify:true,charset:'utf8',splitting:true,write:false,metafile:true,outdir:target,entryNames:'[name]-[hash]',chunkNames:'chunks/[name]-[hash]',legalComments:'eof',sourcemap:false});
 const emitted=[];for(const file of result.outputFiles){const name=relative(target,file.path).split(sep).join('/');if(name.startsWith('..')||!name.endsWith('.js'))throw Error('Unsafe world output');await mkdir(dirname(file.path),{recursive:true});await writeFile(file.path,file.contents);emitted.push({name,bytes:file.contents.length,sha256:hash(file.contents)});}
 const main=Object.entries(result.metafile.outputs).find(([,data])=>data.entryPoint==='game/client/cozy-app.js');if(!main)throw Error('Missing cozy world entry');const entry=relative(target,resolve(root,main[0])).split(sep).join('/');const recoveryOutput=Object.entries(result.metafile.outputs).find(([,data])=>data.entryPoint==='game/client/cozy-recovery.js');if(!recoveryOutput)throw Error('Recovery entry missing');const recoveryEntry=relative(target,resolve(root,recoveryOutput[0])).split(sep).join('/');
 const integrityOutput=Object.entries(result.metafile.outputs).find(([,data])=>data.entryPoint==='game/client/cozy-integrity.js');if(!integrityOutput)throw Error('Integrity entry missing');const integrityEntry=relative(target,resolve(root,integrityOutput[0])).split(sep).join('/');const integrityHtml=(await readFile(resolve(root,'game/client/integrity/index.html'),'utf8')).replace('/play/cozy/integrity.js','/play/cozy/'+integrityEntry);await writeFile(resolve(play,'integrity/index.html'),integrityHtml);
 const css=Buffer.from((await readFile(resolve(root,'game/client/cozy/style.css'),'utf8')).replaceAll('\r\n','\n'));
 const html=(await readFile(resolve(root,'game/client/cozy/index.html'),'utf8')).replaceAll('\r\n','\n').replace('/play/cozy/app.js','/play/cozy/'+entry).replace('/play/cozy/style.css','/play/cozy/style.css?v='+hash(css).slice(0,16));
 await writeFile(resolve(target,'style.css'),css);for(const name of ['index.html','glb/index.html','cozy/index.html'])await writeFile(resolve(play,name),html);
 const recoveryHtml=(await readFile(resolve(root,'game/client/recovery/index.html'),'utf8')).replaceAll('\r\n','\n').replace('/play/cozy/recovery.js','/play/cozy/'+recoveryEntry);await writeFile(resolve(play,'recovery/index.html'),recoveryHtml);
 const models=JSON.parse(await readFile(resolve(root,'game/client/assets/models/world-manifest.json'),'utf8'));
 const inputs=Object.keys(result.metafile.inputs).filter(p=>p.startsWith('game/')).sort();if(inputs.some(p=>/unified-world-(?:preview|sprites)|unified-cozy-landscape/.test(p)))throw Error('Legacy visible geometry entered production graph');
 const receipt={kind:'myfarmtwin-cozy-world-v2',phase:'P3-P7',experience:'tropical-glb-world',areas:['garden','chicken','goat','cow','fish','market'],saveVersion:2,three:'0.187.0',entry,recoveryEntry,integrityEntry,emitted,assets:models.assets,manifestSha256:hash(await readFile(resolve(root,'game/client/assets/models/world-manifest.json'))),htmlSha256:hash(Buffer.from(html)),cssSha256:hash(css),inputs,legacyVisibleModules:false,...(qaDistRoot?{commonEngineQa:'0.3.0'}:{})};
 if(previous?.kind===receipt.kind)for(const file of previous.emitted||[]){if(emitted.some(f=>f.name===file.name)||!/^((chunks\/)?[\w-]+-[A-Z0-9]{8}\.js)$/.test(file.name))continue;const path=resolve(target,file.name);try{if(hash(await readFile(path))!==file.sha256)throw Error('Unexpected generated world file');await unlink(path);}catch(error){if(error.code!=='ENOENT')throw error;}}
 const encoded=JSON.stringify(receipt,null,2)+'\n';for(const name of ['build-info.json','cozy/build-info.json','glb/build-info.json'])await writeFile(resolve(play,name),encoded);
 console.log(JSON.stringify({kind:receipt.kind,entry,bytes:emitted.reduce((n,f)=>n+f.bytes,0),models:Object.keys(models.assets).length,legacyVisibleModules:false}));return receipt;
}
