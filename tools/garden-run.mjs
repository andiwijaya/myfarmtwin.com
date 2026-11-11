import {spawn,execFile} from 'node:child_process';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
// Own only the child launched here. A hard stop never enumerates or targets
// personal browser processes, an unrelated Node server or the user's preview.
const qa=resolve('qa-artifacts/garden');await mkdir(qa,{recursive:true});
const window=JSON.parse(await readFile(resolve(qa,'run-window.json'),'utf8'));
const untilComplete=window.mode==='until-complete'&&window.authority==='owner-resumed-2026-11-11';
const end=untilComplete?null:Date.parse(window.stopAtUTC);assert.ok(untilComplete||(Number.isFinite(end)&&end>Date.now()),'Owner work window ended; record checkpoint instead of launching work');
const [script,...args]=process.argv.slice(2);assert.ok(script,'Node script required');
const startedAtUTC=new Date().toISOString(),child=spawn(process.execPath,[script,...args],{stdio:'inherit',windowsHide:true});
await writeFile(resolve(qa,'owned-command.json'),JSON.stringify({pid:child.pid,script,args,startedAtUTC,stopAtUTC:window.stopAtUTC},null,2));
let stopped=false;
const timer=untilComplete?null:setTimeout(()=>{if(child.exitCode!==null)return;stopped=true;console.error('Owner work-window stop reached; terminating this owned command tree.');if(process.platform==='win32')execFile('taskkill',['/PID',String(child.pid),'/T','/F'],{windowsHide:true},()=>{});else child.kill('SIGTERM');},end-Date.now());
let result;
try{result=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}));});}
finally{clearTimeout(timer);}
await writeFile(resolve(qa,'last-command.json'),JSON.stringify({pid:child.pid,script,args,startedAtUTC,finishedAtUTC:new Date().toISOString(),stopped,...result},null,2));
process.exitCode=stopped?124:result.code??1;
