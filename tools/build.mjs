import { resolve, relative, join } from 'node:path';
import { readdir, mkdir, copyFile, lstat } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

/** Copy only game/client into dist/play. Never empties any output directory. */
export async function build(root=process.cwd()) {
  const source=resolve(root,'game/client'), target=resolve(root,'dist/play');
  if(relative(resolve(root,'dist'),target)!=='play') throw new Error('Unsafe output');
  async function copy(src,dst){
    await mkdir(dst,{recursive:true});
    for(const entry of await readdir(src,{withFileTypes:true})){
      const from=join(src,entry.name),to=join(dst,entry.name);
      if((await lstat(from)).isSymbolicLink()) throw new Error('Symlinks are not build inputs');
      if(entry.isDirectory()) await copy(from,to);
      else if(/\.(html|css|js|svg|json)$/.test(entry.name)) await copyFile(from,to);
    }
  }
  await copy(source,target);
  console.log('Built only dist/play; editorial files preserved.');
}
if(import.meta.url===pathToFileURL(process.argv[1]).href) await build();
