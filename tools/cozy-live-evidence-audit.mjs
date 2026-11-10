import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const root='qa-artifacts/cozy-world-v1',source='f2836be675bcde489617c8e354d01390be594546';
const hash=b=>createHash('sha256').update(b).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const evidence=p=>({path:p,sha256:hash(fs.readFileSync(p))});
const accepted=read(root+'/e01-proof.json'),published=read(root+'/e02-proof.json');
assert.equal(accepted.E01Accepted,true);assert.equal(published.E02Accepted,true);
assert.equal(published.publishedSource,source);assert.equal(published.distTree,accepted.distTree);
assert.equal(execFileSync('git',['rev-parse','HEAD:dist'],{encoding:'utf8'}).trim(),accepted.distTree);
assert.equal(execFileSync('git',['diff','--name-only','--','dist','game/client','package.json','package-lock.json'],{encoding:'utf8'}),'');
for(const item of read(root+'/e01-core-preview-safe/artifact-before.json').files){
  const bytes=fs.readFileSync(item.path);assert.equal(bytes.length,item.bytes,item.path);assert.equal(hash(bytes),item.sha256,item.path);
}
for(const item of accepted.retainedProofs)assert.equal(hash(fs.readFileSync(item.path)),item.sha256,item.path);
assert.equal(hash(JSON.stringify(read('dist/play/build-info.json'))),accepted.receiptSHA256);

function healthy(report,name){
  assert.equal(report.base,'https://myfarmtwin.com',name+' must be actual public production');
  assert.ok(!report.failure,name+' failure');assert.equal(report.slotExpired,false,name+' deadline');
  for(const key of ['errors','consoleErrors','violations','externalRequests'])if(key in report)assert.deepEqual(report[key],[],name+' '+key);
  if(report.receiptSHA256)assert.equal(report.receiptSHA256,accepted.receiptSHA256);
}

function pngEvidence(dir){
  const results=[];
  for(const name of fs.readdirSync(dir)){
    const file=path.join(dir,name);if(fs.statSync(file).isDirectory())results.push(...pngEvidence(file));
    else if(name.endsWith('.png')){const b=fs.readFileSync(file);assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a',file);assert.ok(b.readUInt32BE(16)>0&&b.readUInt32BE(20)>0,file);results.push({path:file,bytes:b.length,sha256:hash(b)});}
  }
  return results;
}

if(process.argv.includes('--accept-e03')){
  const runs=read(root+'/e03-live/run-index.json');assert.equal(runs.pass,true);assert.equal(runs.source,source);
  assert.equal(runs.steps.length,9);assert.equal(new Set(runs.steps.map(x=>x.name)).size,9);
  for(const step of runs.steps){assert.equal(step.exitCode,0,step.name);assert.equal(hash(fs.readFileSync(step.script)),step.scriptSHA256,step.name+' executed source');}
  const groups=[['entry','entry.json',8],['five-area','five-area-gate.json',4],['input','input.json',6],['save','save-protection.json',21],['home-entry','entry.json',8],['menus','menus.json',4],['contact','contact.json',4],['responsive-rerun','responsive.json',16]];
  let profiles=0;const reports=[];
  for(const [name,file,count]of groups){const p=root+'/e03-live/'+name+'/'+file,r=read(p);healthy(r,name);assert.equal(r.profiles.length,count,name);assert.equal(new Set(r.profiles.map(x=>x.name)).size,count,name+' unique profiles');profiles+=count;reports.push({...evidence(p),profiles:count,consoleErrorsMonitored:'consoleErrors' in r});}
  const homePath=root+'/e03-live/homepage/homepage.json',home=read(homePath);healthy(home,'homepage');assert.equal(home.surfaces.length,24);assert.equal(home.checks.length,3);reports.push({...evidence(homePath),surfaces:24,fallbackCases:3});
  const securityPath=root+'/e03-live/security/security.json',security=read(securityPath);healthy(security,'security');assert.equal(security.checks.length,2);reports.push({...evidence(securityPath),securityProfiles:2});
  assert.equal(profiles,71);
  const five=read(root+'/e03-live/five-area/five-area-gate.json');assert.ok(five.profiles.every(p=>p.commands.length===235&&p.wholeSaveWeatherRngEconomyLedgerExactAfterEveryCommand&&p.reloadExact));
  const images=[...groups.map(x=>x[0]),'homepage','security'].flatMap(name=>pngEvidence(root+'/e03-live/'+name));assert.ok(images.length>=30,'Actual visual evidence required');
  for(const attempt of runs.retainedAttempts||[]){assert.equal(attempt.exitCode,1);assert.equal(hash(fs.readFileSync(attempt.report)),attempt.reportSHA256);}
  const proof={E03Accepted:true,completedFeatures:28,totalFeatures:30,at:new Date().toISOString(),source,deployment:published.deployment,base:runs.base,browserSuites:10,gameAndDataProfiles:profiles,securityProfiles:2,homepageSurfaces:24,homepageFallbackCases:3,totalDeclaredCases:100,fiveAreaNativeCommands:940,profilesAreSynthetic:true,physicalAndroid:false,preview4177Stopped:false,toolTargetHelper:evidence('tools/cozy-qa-target.mjs'),runRegistry:evidence(root+'/e03-live/run-index.json'),retainedFailedAttempts:runs.retainedAttempts||[],failedAttemptImagesCounted:false,reports,actualPNGs:images.length,images};
  fs.writeFileSync(root+'/e03-proof.json',JSON.stringify(proof,null,2)+'\n');console.log({E03Accepted:true,completed:28,cases:100,actualPNGs:images.length});
}

if(process.argv.includes('--accept-e04')){
  const p=root+'/e04-live/controlled/feasibility.json',r=read(p),status=read(root+'/e04-live/controlled/run-status.json');healthy(r,'controlled live loading');
  assert.equal(status.exitCode,0);assert.equal(r.liveActualTransport,true);assert.equal(r.localActualGzip,false);assert.equal(r.loadOnly,false);assert.equal(r.sampleMs,60000);assert.equal(r.runs.length,2);assert.deepEqual(r.failures,[]);assert.equal(r.buildReceiptSHA256,accepted.receiptSHA256);
  assert.deepEqual(r.runs.map(x=>x.mobile),[false,true]);
  for(const row of r.runs){
    assert.ok(row.firstMapMs<=5000);assert.ok(row.warmBoot.firstMapMs<=5000);assert.ok(row.trustedInputResponseMs<=100);assert.ok(row.warmBoot.trustedInputResponseMs<=100);
    assert.ok(row.windowMs>=60000);assert.ok(row.renderSubmissions>0);assert.ok(row.successfulRenderHz>=(row.mobile?30:50));assert.ok(row.medianRenderHz>=(row.mobile?30:50));assert.ok(row.heapGrowthMiB<20);assert.equal(row.intervals,1);assert.equal(row.warmBoot.intervals,1);assert.equal(row.saveAndLedgerExact,true);assert.equal(row.reducedMotionStopsAndResumes,true);assert.ok(row.responseHeaders.some(x=>x.phase==='cold'&&x.encoding==='br'));
  }
  const transport=read(root+'/e02-release/origins-transport.json');assert.equal(transport.objects.length,12);assert.ok(transport.objects.every(x=>x.exact&&x.encoding==='br'));
  const proof={E04Accepted:true,completedFeatures:29,totalFeatures:30,at:new Date().toISOString(),source,deployment:published.deployment,base:r.base,method:r.method,oneColdWarmSamplePerProfile:true,physicalAndroid:false,displayFPS:false,VRAM:false,userPreview4177Preserved:true,report:evidence(p),status:evidence(root+'/e04-live/controlled/run-status.json'),transport:evidence(root+'/e02-release/origins-transport.json'),runs:r.runs.map(x=>({mobile:x.mobile,coldMapMs:x.firstMapMs,coldCareMs:x.controlsReadyMs,coldArtMs:x.spriteReadyMs,warmMapMs:x.warmBoot.firstMapMs,warmCareMs:x.warmBoot.controlsReadyMs,warmArtMs:x.warmBoot.spriteReadyMs,successfulRenderHz:x.successfulRenderHz,medianRenderHz:x.medianRenderHz,heapGrowthMiB:x.heapGrowthMiB,trustedResponseMs:x.trustedInputResponseMs,warmTrustedResponseMs:x.warmBoot.trustedInputResponseMs,windowMs:x.windowMs,renderSubmissions:x.renderSubmissions}))};
  fs.writeFileSync(root+'/e04-proof.json',JSON.stringify(proof,null,2)+'\n');console.log({E04Accepted:true,completed:29,runs:proof.runs});
}

if(process.argv.includes('--accept-e05')){
  const functional=read(root+'/e03-proof.json'),loading=read(root+'/e04-proof.json');assert.equal(functional.E03Accepted,true);assert.equal(loading.E04Accepted,true);
  const rollback=read(root+'/e02-release/rollback-available.json'),native=read(root+'/e02-preflight/rollback-native.json'),lint=read(root+'/final-live-lint.json');assert.equal(rollback.stage.status,'success');assert.equal(rollback.source,'ee47d531d145930c18fe046bd2b9b409ebb9d828');assert.equal(rollback.rollbackExecuted,false);assert.equal(native.nativeModulesExact,117);assert.equal(native.saveSchema,5);assert.equal(lint.exitCode,0);
  const closed=Date.parse(process.env.COZY_QA_CLOSED_OBSERVED_UTC||'');assert.ok(Number.isFinite(closed)&&closed<=Date.now(),'Record actual owned-resource closure after all tests');
  const proof={E05Accepted:true,completedFeatures:30,totalFeatures:30,at:new Date().toISOString(),source,deployment:published.deployment,distTree:accepted.distTree,previous3DOnlySource:rollback.source,previous3DOnlyDeployment:rollback.id,saveSchema:5,saveKey:native.saveKey,rollbackAvailable:true,rollbackExecuted:false,qaResourcesClosedObservedUTC:new Date(closed).toISOString(),preview4177Preserved:true,physicalAndroid:false,displayFPS:false,VRAM:false,oneNonForcePush:true,providerSettingsChanged:false,proofs:['e01-proof.json','e02-proof.json','e03-proof.json','e04-proof.json'].map(p=>evidence(root+'/'+p)),finalLint:evidence(root+'/final-live-lint.json')};
  fs.writeFileSync(root+'/final-acceptance.json',JSON.stringify(proof,null,2)+'\n');console.log({E05Accepted:true,completed:'30/30',source,deployment:published.deployment});
}
