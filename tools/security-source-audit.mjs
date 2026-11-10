import {readdir,readFile} from 'node:fs/promises';import {join} from 'node:path';import {pathToFileURL} from 'node:url';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
/** Read-only pattern audit of project-owned client text; never starts a server,
 * browser, network call or build, and never prints matched credential content. */
export async function auditSecuritySource(){
 let clientFiles=0;const digest=createHash('sha256');
 async function scan(dir){for(const e of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name<b.name?-1:a.name>b.name?1:0)){const p=join(dir,e.name);if(e.isDirectory()){await scan(p);continue;}if(!/\.(js|html|css|json|svg)$/.test(p))continue;const bytes=await readFile(p),text=bytes.toString('utf8');clientFiles++;digest.update(p.replaceAll('\\','/')+'\0').update(bytes).update('\0');
 if(/\b(?:innerHTML|outerHTML|insertAdjacentHTML)\b|\beval\s*\(/.test(text))assert.fail('Unsafe HTML/eval pattern in '+p);
 if(/gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{24,}/.test(text))assert.fail('Credential-like pattern in '+p);
 }}await scan('game/client');return{clientFiles,sourceSHA256:digest.digest('hex'),unsafeHTMLPatterns:0,credentialLikePatterns:0,scope:'Project-owned client text pattern checks; not a dependency-advisory audit or penetration test'};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(await auditSecuritySource()));
