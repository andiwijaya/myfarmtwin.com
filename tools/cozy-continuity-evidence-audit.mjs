import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {dispatch} from '../game/client/engine.js';
import {deserialize,serialize} from '../game/client/save-schema.js';

// Read-only CPU replay of completed measurements; never starts a browser,
// advances the real game, changes fixtures or writes the production checklist.
assert.ok(process.argv.slice(2).every(a=>a==='--accept-d07'));
const accept=process.argv.includes('--accept-d07'),qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1';
const hash=b=>createHash('sha256').update(b).digest('hex'),json=async p=>JSON.parse(await readFile(p,'utf8'));
// New attempts keep the failed first run and its receipt-bound loading proof intact.
const loadingName=process.env.COZY_D07_LOADING_PROOF||'d07-loading-proof.json',soakName=process.env.COZY_D07_SOAK_DIR||'d07-soak-first';
assert.match(loadingName,/^[a-z0-9-]+\.json$/);assert.match(soakName,/^[a-z0-9-]+$/);
const receipt=hash(JSON.stringify(await json('dist/play/build-info.json'))),loading=await json(join(qa,loadingName));
assert.equal(loading.receiptSHA256,receipt);assert.equal(loading.controlledProfilesPassed,2);assert.equal(loading.coldWarmSamplesPerProfile,1);assert.equal(loading.real15MinuteSoakExecuted,false);
const loadBytes=await readFile(loading.report.path),load=JSON.parse(loadBytes);assert.equal(hash(loadBytes),loading.report.sha256);assert.equal(load.buildReceiptSHA256,receipt);assert.equal(load.loadOnly,false);assert.equal(load.runs.length,2);assert.deepEqual(load.errors,[]);assert.deepEqual(load.consoleErrors,[]);assert.deepEqual(load.failures,[]);assert.equal(load.slotExpired,false);
for(const p of load.runs){assert.ok(p.windowMs>=60000);assert.ok(p.firstMapMs<=5000&&p.warmBoot.firstMapMs<=5000);assert.ok(p.trustedInputResponseMs<=100&&p.warmBoot.trustedInputResponseMs<=100);assert.ok(p.successfulRenderHz>=(p.mobile?30:50)&&p.medianRenderHz>=(p.mobile?30:50));assert.ok(p.heapGrowthMiB<20);assert.equal(p.intervals,1);assert.equal(p.saveAndLedgerExact,true);assert.equal(p.reducedMotionStopsAndResumes,true);}
const dir=join(qa,soakName),bytes=await readFile(join(dir,'animation-soak.json')),r=JSON.parse(bytes);
assert.equal(r.buildReceiptSHA256,receipt);assert.ok(!r.failure);assert.deepEqual(r.errors,[]);assert.deepEqual(r.consoleErrors,[]);assert.equal(r.slotExpired,false);assert.equal(r.minimumAcceptanceWallMs,900000);assert.ok(r.requestedWallDurationMs>=900000);assert.ok(r.wallElapsedMs>=r.requestedWallDurationMs);assert.equal(r.acceptanceDurationMet,true);
for(const flag of ['fullNativeSaveLedgerExact','oneSceneCameraClockCanvas','noHistoricalOrDuplicateAnimals','reloadExact'])assert.equal(r[flag],true,flag);
assert.ok(r.samples.length>=25);assert.ok(r.samples[0].elapsedMs<10000);assert.ok(r.samples.at(-1).elapsedMs>=r.requestedWallDurationMs-60000);for(let i=1;i<r.samples.length;i++)assert.ok(r.samples[i].elapsedMs>r.samples[i-1].elapsedMs&&r.samples[i].tick>=r.samples[i-1].tick);
assert.ok(r.modeChanges>=4);assert.ok(r.cameraMoves>=60);assert.ok(r.postGCHeapGrowthMiB<20);assert.ok(r.postGCBackingGrowthMiB<32);
assert.equal(r.postGCHeapGrowthMiB,(r.finalHeap.usedSize-r.baselineHeap.usedSize)/1024**2);assert.equal(r.postGCBackingGrowthMiB,(r.finalHeap.backingStorageSize-r.baselineHeap.backingStorageSize)/1024**2);
const initialRaw=await readFile(join(dir,'initial.json'),'utf8'),finalRaw=await readFile(join(dir,'final.json'),'utf8');let state=deserialize(initialRaw);const startTick=state.tick;assert.equal(state.paused,true);assert.equal(state.speed,1);assert.equal(r.commands[0].type,'pause');assert.equal(r.commands.at(-1).type,'pause');assert.equal(r.commands.filter(c=>c.type==='pause').length,2);
for(const c of r.commands){assert.ok(['pause','tick'].includes(c.type),'No accelerated day or fabricated action in real soak');assert.equal(c.id,state.revision+1);const result=dispatch(state,c);assert.equal(result.ok,true);state=result.state;}
assert.equal(serialize(state),finalRaw);assert.equal(state.paused,true);assert.equal(state.speed,1);assert.equal(state.tick,r.finalTick);assert.equal(state.revision,r.finalRevision);const ticks=r.commands.filter(c=>c.type==='tick').length;assert.equal(ticks,r.acceptedClockCommands);assert.equal(state.tick-startTick,ticks);assert.ok(ticks>=Math.floor(r.requestedWallDurationMs/3000*.85)&&ticks<=Math.ceil(r.requestedWallDurationMs/3000*1.2)+2);assert.equal(new Set(state.ledger.map(e=>e.id)).size,state.ledger.length);
const guard=await json(join(qa,'d07-controlled-first/soak-preparation-guards.json'));assert.equal(hash(await readFile('tools/cozy-continuity-soak.mjs')),guard.runnerSHA256);assert.equal(guard.realSoakExecuted,false);assert.equal(guard.tested.length,5);
const png=await readFile(join(dir,'final-actual-world.png'));assert.equal(png.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
const out={D07Accepted:accept,completedFeatures:accept?23:22,totalFeatures:30,receiptSHA256:receipt,loadingReportSHA256:hash(loadBytes),soakReportSHA256:hash(bytes),wallElapsedMs:r.wallElapsedMs,requestedWallDurationMs:r.requestedWallDurationMs,actualNativeTicks:ticks,commands:r.commands.length,samples:r.samples.length,cameraMoves:r.cameraMoves,modeChanges:r.modeChanges,postGCHeapGrowthMiB:r.postGCHeapGrowthMiB,postGCBackingGrowthMiB:r.postGCBackingGrowthMiB,initialSHA256:hash(initialRaw),finalSHA256:hash(finalRaw),independentOriginalDispatchReplayExact:true,foregroundContinuityOnly:true,physicalAndroid:false,actualHiddenTabTested:false,VRAMBytesMeasured:false,displayFPSMeasured:false,push:false,deploy:false};
if(process.env.QA_RESOURCES_CLOSED_UTC){assert.ok(Date.parse(process.env.QA_RESOURCES_CLOSED_UTC)<=Date.now());out.resourcesClosedObservedUTC=process.env.QA_RESOURCES_CLOSED_UTC;}
await writeFile(join(qa,'d07-proof.json'),JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out,null,2));
