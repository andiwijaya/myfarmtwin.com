import { resolve, relative, join } from 'node:path';
import { readdir, mkdir, copyFile, lstat, readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

/** Copy game/client and the opt-in renderer's pinned vendor files into dist/play only. Never empties output. */
export async function build(root=process.cwd()) {
  const source=resolve(root,'game/client'), target=resolve(root,'dist/play');
  if(relative(resolve(root,'dist'),target)!=='play') throw new Error('Unsafe output');
  let preview=false;
  async function copy(src,dst){
    await mkdir(dst,{recursive:true});
    for(const entry of await readdir(src,{withFileTypes:true})){
      const from=join(src,entry.name),to=join(dst,entry.name);
      if((await lstat(from)).isSymbolicLink()) throw new Error('Symlinks are not build inputs');
      if(entry.isDirectory()) await copy(from,to);
      else if(['unified-world-preview.js','unified-world-canvas.js'].includes(entry.name)){
        const body=await readFile(from,'utf8');
        if(!body.includes("from 'three'"))throw new Error('Preview vendor import missing');
        await writeFile(to,body.replace("from 'three'","from './vendor/three/three.module.js'"));preview=true;
      }else if(/\.(html|css|js|svg|json|webp)$/.test(entry.name)) await copyFile(from,to);
    }
  }
  await copy(source,target);
  if(preview){
    const vendor=resolve(root,'node_modules/three'),pkg=JSON.parse(await readFile(join(vendor,'package.json'),'utf8'));
    if(pkg.version!=='0.187.0')throw new Error('Expected pinned Three.js 0.187.0');
    const output=join(target,'vendor/three');await mkdir(output,{recursive:true});
    for(const [input,name]of [['build/three.module.js','three.module.js'],['build/three.core.js','three.core.js'],['LICENSE','LICENSE.txt']]){
      const path=join(vendor,input);if((await lstat(path)).isSymbolicLink())throw new Error('Symlink vendor input');await copyFile(path,join(output,name));
    }
    await writeFile(join(output,'version.json'),JSON.stringify({name:'three',version:pkg.version,license:'MIT',sourceMaps:false})+'\n');
  }
  console.log('Built only dist/play; editorial files preserved.');
}
if(import.meta.url===pathToFileURL(process.argv[1]).href) await build();
