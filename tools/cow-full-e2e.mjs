import {spawnSync} from 'node:child_process';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import assert from 'node:assert/strict';
const qa=process.env.QA_DIR;assert.ok(qa);await mkdir(qa,{recursive:true});
const suites=['first-loop','ui','feed','water','care','milking','storage','sales','contract','upgrade','recovery','shade','cooler','sanitation','orders','purchase','lab'];
const report=[];
for(const name of suites){const dir=join(qa,name);await mkdir(dir,{recursive:true});const started=performance.now(),args=['tools/cow-'+name+'-e2e.mjs',...(name==='ui'?['selection']:[])];const result=spawnSync(process.execPath,args,{env:{...process.env,QA_DIR:dir},encoding:'utf8',timeout:180000});await writeFile(join(dir,'run.log'),(result.stdout||'')+(result.stderr||'')+(result.error?'\n'+result.error:''));report.push({name,exitCode:result.status,milliseconds:Math.round(performance.now()-started)});await writeFile(join(qa,'cow-full.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.at(-1)));assert.equal(result.status,0,name+': '+(result.stderr||result.error||'see run.log'));}
console.log('Cow complete black-box gate PASS',report.length,'suites');
