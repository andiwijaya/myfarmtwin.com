import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve,join,sep} from 'node:path';
import {createHash} from 'node:crypto';
import validator from 'gltf-validator';

// The official Khronos validator runs on repository bytes with no network,
// desktop automation or browser launch. No issues are suppressed/reclassified.
const root=process.cwd(),base=resolve(root,'game/client/assets/models'),manifest=JSON.parse(await readFile(join(base,'world-manifest.json'),'utf8')),out=resolve(root,'qa-artifacts/cozy-world/gltf-validation');await mkdir(out,{recursive:true});
const assets=Object.values(manifest.assets).flatMap(a=>[a,...(a.lod?[a.lod.far]:[])]),results=[];
for(const a of assets){
 assert.ok(a.url.startsWith('/play/assets/models/'));const path=resolve(base,a.url.slice('/play/assets/models/'.length));assert.ok(path.startsWith(base+sep));const data=await readFile(path);assert.equal(createHash('sha256').update(data).digest('hex'),a.sha256);
 const report=await validator.validateBytes(new Uint8Array(data),{uri:a.url,format:'glb',writeTimestamp:false,maxIssues:0,externalResourceFunction:async uri=>{throw Error('Self-contained GLBs must never request external resources: '+uri);}});
 await writeFile(join(out,a.id+'.json'),JSON.stringify(report,null,2)+'\n');const codes={};for(const m of report.issues.messages)codes[m.code]=(codes[m.code]||0)+1;
 results.push({id:a.id,url:a.url,sha256:a.sha256,bytes:data.length,errors:report.issues.numErrors,warnings:report.issues.numWarnings,infos:report.issues.numInfos,hints:report.issues.numHints,codes});
}
const summary={kind:'official-khronos-gltf-validator-v2',validatorVersion:validator.version(),logicalAssets:Object.keys(manifest.assets).length,files:assets.length,noSuppression:true,errors:results.reduce((n,r)=>n+r.errors,0),warnings:results.reduce((n,r)=>n+r.warnings,0),results};
await writeFile(join(out,'summary.json'),JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));if(summary.errors)process.exitCode=1;
