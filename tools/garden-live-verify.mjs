import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdir,open,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {cozyQATarget} from './cozy-qa-target.mjs';

// One owned browser suite at a time, always with synthetic disposable contexts.
// A fresh production receipt gate also protects legacy unified runners.
const local=process.env.GARDEN_LOCAL_QA==='1',qa=resolve(process.env.QA_DIR||(local?'qa-artifacts/garden/active-local-regression':'qa-artifacts/garden/live-active'));await mkdir(qa,{recursive:true});
const available=[
 ['active-beds','garden-active-beds-e2e'],
 ['corn','garden-corn-e2e'],['all-beds','garden-all-beds-loop-e2e'],
 ['five-area','unified-five-area-gate-e2e'],['save-protection','unified-save-protection-e2e'],
 ['picking','garden-picking-e2e'],['growth','garden-growth-e2e'],
 ['entry','unified-3d-only-e2e'],['responsive','cozy-responsive-care-e2e'],
 ['security','security-e2e'],['homepage','homepage-e2e'],['seo','seo-e2e'],
 ['performance','garden-performance']
];
const selected=process.argv.slice(2);assert.ok(selected.every(n=>available.some(([name])=>name===n)));const suites=selected.length?available.filter(([n])=>selected.includes(n)):available;
const report={startedAtUTC:new Date().toISOString(),base:local?'isolated-loopback':'https://myfarmtwin.com',local,downloadTests:'skipped-owner-instruction',suites:[]};
try{
 for(const [name,script] of suites){
  process.env.COZY_LIVE_RELEASE='parent-authorized';process.env.COZY_QA_SLOT='parent-confirmed';process.env.COZY_SLOT_END_UTC=new Date(Date.now()+14*60_000).toISOString();process.env.COZY_WORK_STOP_UTC=process.env.COZY_SLOT_END_UTC;
  delete process.env.QA_ALLOW_DOWNLOADS;delete process.env.GARDEN_ROLLBACK_PREVIEW;delete process.env.QA_DIST_ROOT;
  let target;if(local){delete process.env.BASE_URL;process.env.QA_DIST_ROOT='qa-artifacts/garden/build/dist';target={live:false,receiptRawSHA256:createHash('sha256').update(await readFile('qa-artifacts/garden/build/dist/play/build-info.json')).digest('hex')};}else{process.env.BASE_URL=report.base;target=await cozyQATarget();assert.equal(target.live,true);}
  const out=resolve(qa,name);await mkdir(out,{recursive:true});const log=await open(resolve(qa,name+'.log'),'w');
  const row={name,script,startedAtUTC:new Date().toISOString(),receiptRawSHA256:target.receiptRawSHA256};console.log(JSON.stringify({starting:name,...row}));
  try{const child=spawn(process.execPath,['tools/'+script+'.mjs'],{windowsHide:true,stdio:['ignore',log.fd,log.fd],env:{...process.env,QA_DIR:out,PLAYWRIGHT_CHROMIUM_EXECUTABLE:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',GAME_CHANGE_UNDER_TEST:'1',HOME_PRESERVATION_BASELINE:'f2836be675bcde489617c8e354d01390be594546'}});row.exitCode=await new Promise((res,rej)=>{child.once('error',rej);child.once('exit',res);});}
  finally{await log.close();}
  row.finishedAtUTC=new Date().toISOString();report.suites.push(row);await writeFile(resolve(qa,'verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({finished:name,...row}));assert.equal(row.exitCode,0,name+' failed; inspect retained log before continuing');
 }
 report.complete=true;
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{report.finishedAtUTC=new Date().toISOString();await writeFile(resolve(qa,'verification.json'),JSON.stringify(report,null,2));}
