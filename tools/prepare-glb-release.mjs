import {readFile,writeFile,mkdir,lstat} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
// The checkout was clean at the P3-P7 start. Own only the declared game,
// source-art, build, documentation and editorial-promotion release paths.
const git=args=>execFileSync('git',args,{encoding:'utf8'});
const modified=git(['diff','--name-only','-z','HEAD']).split('\0').filter(Boolean),added=git(['ls-files','--others','--exclude-standard','-z']).split('\0').filter(Boolean);
const paths=[...new Set([...modified,...added])].sort();
const owned=p=>/^game\/(?:client|tests)\//.test(p)||/^dist\/play\//.test(p)||/^tools\/(?:art\/|(?:build|prepare-glb-release|prepare-cozy-rollback|publish-glb-preview|pages-headers|cozy-world-fixtures)[\w-]*\.mjs$)/.test(p)||/^docs\/(?:COZY_WORLD|PRD_MYFARMTWIN|GLB_PROTOTYPE)[\w./-]*/.test(p)||['package.json','package-lock.json','README.md','.gitattributes','dist/_headers','dist/index.html','dist/home-promo-v3.js'].includes(p)||/^dist\/assets\/myfarmtwin-cozy-/.test(p);
if(!paths.length)throw Error('No release changes');for(const p of paths)if(!owned(p))throw Error('Unrelated path requires review: '+p);
const files=[];for(const path of paths){let bytes;try{if((await lstat(path)).isSymbolicLink())throw Error('No symlinks');bytes=await readFile(path);}catch(error){if(error.code!=='ENOENT')throw error;files.push({path,deleted:true,beforeGitSha:git(['rev-parse','HEAD:'+path]).trim()});continue;}files.push({path,bytes:bytes.length,gitSha:createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex'),sha256:createHash('sha256').update(bytes).digest('hex'),binary:path.endsWith('.glb')});}
await mkdir('qa-artifacts/glb-upgrade/release',{recursive:true});await writeFile('qa-artifacts/glb-upgrade/release/files.json',JSON.stringify(files,null,2)+'\n');console.log(JSON.stringify({files:files.length,deletions:files.filter(f=>f.deleted).length,totalBytes:files.reduce((n,f)=>n+(f.bytes||0),0)}));
