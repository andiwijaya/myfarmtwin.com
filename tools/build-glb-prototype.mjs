import {build as bundle} from 'esbuild';
import {readFile,writeFile,mkdir,unlink} from 'node:fs/promises';
import {resolve,join,relative,sep} from 'node:path';
import {createHash} from 'node:crypto';

/** Build the isolated P2 entry without changing the current full-farm graph. */
export async function buildGLBPrototype(root=process.cwd()){
 const out=resolve(root,'dist/play/glb');await mkdir(out,{recursive:true});
 const result=await bundle({absWorkingDir:root,entryPoints:[{in:'game/client/glb-prototype-app.js',out:'app'}],bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true,splitting:true,write:false,metafile:true,outdir:out,entryNames:'[name]-[hash]',chunkNames:'chunks/[name]-[hash]',legalComments:'eof',sourcemap:false});
 const hash=bytes=>createHash('sha256').update(bytes).digest('hex');const emitted=[];
 for(const file of result.outputFiles){const name=relative(out,file.path).split(sep).join('/');if(name.startsWith('..')||!name.endsWith('.js'))throw Error('Unsafe prototype output');await mkdir(resolve(file.path,'..'),{recursive:true});await writeFile(file.path,file.contents);emitted.push({name,bytes:file.contents.length,sha256:hash(file.contents)});}
 const entry=Object.entries(result.metafile.outputs).find(([,data])=>data.entryPoint==='game/client/glb-prototype-app.js');if(!entry)throw Error('Prototype entry missing');const main=relative(out,resolve(root,entry[0])).split(sep).join('/');
 let html=(await readFile(resolve(root,'game/client/glb/index.html'),'utf8')).replaceAll('\r\n','\n');html=html.replace('./app.js','./'+main);const css=Buffer.from((await readFile(resolve(root,'game/client/glb/style.css'),'utf8')).replaceAll('\r\n','\n'));html=html.replace('./style.css','./style.css?v='+hash(css).slice(0,16));await writeFile(join(out,'index.html'),html);await writeFile(join(out,'style.css'),css);
 const manifest=JSON.parse(await readFile(resolve(root,'game/client/assets/models/prototype-manifest.json'),'utf8'));
 const receipt={kind:'myfarmtwin-glb-prototype-v1',phase:'P2',areas:['garden','cow'],three:'0.187.0',entry:main,emitted,assets:manifest.assets,htmlSha256:hash(Buffer.from(html)),cssSha256:hash(css)};
 let previous;try{previous=JSON.parse(await readFile(join(out,'build-info.json'),'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
 if(previous?.kind===receipt.kind)for(const file of previous.emitted||[]){if(emitted.some(n=>n.name===file.name)||!/^((chunks\/)?[\w-]+-[A-Z0-9]{8}\.js)$/.test(file.name))continue;const path=join(out,file.name);let bytes;try{bytes=await readFile(path);}catch(error){if(error.code==='ENOENT')continue;throw error;}if(hash(bytes)!==file.sha256)throw Error('Unexpected generated prototype file');await unlink(path);}
 await writeFile(join(out,'build-info.json'),JSON.stringify(receipt,null,2)+'\n');console.log('Built GLB prototype /play/glb/ ('+emitted.reduce((n,f)=>n+f.bytes,0)+' JS bytes).');return receipt;
}
