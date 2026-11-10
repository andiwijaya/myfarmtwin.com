import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {SAVE_KEY} from '../game/client/storage.js';
import {SAVE_VERSION} from '../game/client/save-schema.js';

// Read-only CPU audit of an entire D04 browser matrix. No browser/server/save
// fixture is created or edited, and this never writes the production checklist.
assert.ok(process.argv.slice(2).every(a=>a==='--accept-d04'));
const accept=process.argv.includes('--accept-d04'),qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/d04-save-statusfix';
const hash=b=>createHash('sha256').update(b).digest('hex');
const bytes=await readFile(join(qa,'save-protection.json')),r=JSON.parse(bytes);
const bundle=JSON.parse(await readFile('dist/play/build-info.json','utf8')),receipt=hash(JSON.stringify(bundle));
assert.equal(r.receiptSHA256,receipt);assert.equal(r.suite,'all');assert.equal(r.expectedProfiles,21);assert.equal(r.profiles.length,21);assert.equal(r.activeProfile,null);assert.equal(r.slotExpired,false);assert.ok(!r.failure);assert.deepEqual(r.errors,[]);assert.deepEqual(r.consoleErrors,[]);
const fixtures=['v0-fresh.json','v1-mixed.json','v2-mixed.json','v3-mixed.json','v4-mixed.json','v5-fresh.json','v5-mixed.json'];
const loads=[...fixtures,'recovered-all-five','corrupt-preserved','future-preserved','archive-collision','quarantine-collision','all-five-no-graphics'];
const statuses=['saveMigrated','saveMigrated','saveMigrated','saveMigrated','saveMigrated','saveResumed','saveResumed','saveRecovered','saveCorrupt','saveNewer','saveMigrationPreview','saveRecoveryPreview','saveResumed'];
const cycles=['desktop-three-data-cycle','desktop-unavailable-data-cycle','touch-three-data-cycle','touch-unavailable-data-cycle'];
const quotas=['desktop-quota','touch-quota'],races=['desktop-cross-tab-race','touch-cross-tab-race'];
assert.deepEqual(r.profiles.map(p=>p.name),[...loads,...cycles,...quotas,...races]);
function flags(p,names){for(const n of names)assert.equal(p[n],true,p.name+' '+n);}
for(const [i,p]of r.profiles.slice(0,13).entries()){
 assert.equal(p.nativeLoadStatus,statuses[i]);assert.equal(p.mode,i===12||i%2?'unavailable':'three');
 flags(p,['allProtectedBytesExact','archiveQuarantineAndOriginalExportExact','allVisibleArchiveExportsByteExact','cameraDoesNotWriteProtectedStorage','cameraNoGrantOrSaveWrite','reloadExact']);
}
for(const p of r.profiles.slice(13,17)){flags(p,['fullFiveAreaExportImportExact','invalidImportAndCancelPreserved','corruptFutureOversizeImportRejected','resetBackupRestoreExact','legacyBookmarkSameUnifiedEntry','normalEntryAndExplicitGraphicsStateExact']);assert.equal(p.mode,p.name.includes('-unavailable-')?'unavailable':'three');assert.equal(p.locale,p.name.startsWith('touch')?'id':'en');}
for(const p of r.profiles.slice(17,19))flags(p,['actualPrimaryQuotaInjected','inMemoryExportAfterFailedSaveExact','durableAllFiveProgressPreserved','nativeBackupBytesExact','reloadExact']);
for(const p of r.profiles.slice(19))flags(p,['realPointerAttemptsOnBothInterfaces','trustedTouchOrMouseOnBothTabs','allProtectedBytesExact','oneNativeHarvestOnly','wholeFiveAreaSaveAndLedgerExact']);
assert.equal(SAVE_KEY,'myfarmtwin.save.v1');assert.equal(SAVE_VERSION,5);
const d03Bytes=await readFile('qa-artifacts/cozy-world-v1/d03-proof.json'),d03=JSON.parse(d03Bytes);assert.equal(d03.D03Accepted,true);assert.equal(d03.receiptSHA256,receipt);
for(const f of d03.nativeBaseline.modules)assert.equal(hash(await readFile(f.path)),f.sha256,'Native module changed since accepted D03: '+f.path);
for(const f of [...bundle.defaultCore,...bundle.emitted]){const b=await readFile('dist/play/'+f.name);assert.equal(b.length,f.bytes);assert.equal(hash(b),f.sha256);}
const cpuBytes=await readFile('qa-artifacts/cozy-world-v1/d04-cpu/result.json'),cpu=JSON.parse(cpuBytes),log=await readFile('qa-artifacts/cozy-world-v1/d04-cpu/native-save-tests.log');assert.equal(cpu.exitCode,0);assert.equal(cpu.error,null);for(const [kind,n]of [['tests',19],['pass',19],['fail',0]])assert.match(log.toString(),new RegExp('(?:#|ℹ)\\s+'+kind+'\\s+'+n+'(?:\\r?\\n|$)'));
const captures=[];for(const name of [...loads,...cycles,...races]){const p=join(qa,name+'.png'),b=await readFile(p);assert.equal(b.subarray(0,8).toString('hex'),'89504e470d0a1a0a');const width=b.readUInt32BE(16),height=b.readUInt32BE(20),mobile=loads.includes(name)?loads.indexOf(name)%2===1:name.startsWith('touch');assert.equal(width,mobile?390:1440);assert.equal(height,mobile?844:900);captures.push({path:p,sha256:hash(b),width,height});}
assert.equal((await readdir(qa)).filter(n=>n.endsWith('.png')).length,19);
const out={D04Accepted:accept,completedFeatures:accept?21:20,totalFeatures:30,receiptSHA256:receipt,report:{path:join(qa,'save-protection.json'),sha256:hash(bytes)},profiles:21,categories:{loadMigrationRecovery:13,dataCycles:4,injectedQuota:2,sameOriginRace:2},captures,nativeModulesExactSinceD03:d03.nativeBaseline.modules.length,d03ProofSHA256:hash(d03Bytes),cpu:{tests:19,pass:19,fail:0,resultSHA256:hash(cpuBytes),logSHA256:hash(log)},runnerSHA256:hash(await readFile('tools/cozy-save-protection-e2e.mjs')),saveKey:SAVE_KEY,saveVersion:SAVE_VERSION,physicalAndroid:false,physicalStorageExhaustion:false,push:false,deploy:false};
if(process.env.QA_RESOURCES_CLOSED_UTC){assert.ok(Date.parse(process.env.QA_RESOURCES_CLOSED_UTC)<=Date.now());out.resourcesClosedObservedUTC=process.env.QA_RESOURCES_CLOSED_UTC;}
await writeFile('qa-artifacts/cozy-world-v1/d04-proof.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({...out,captures:captures.length},null,2));
