import assert from 'node:assert/strict';
import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {dispatch} from '../game/client/engine.js';
import {deserialize,serialize} from '../game/client/save-schema.js';
import {fiveAreaJourney} from './unified-five-area-journey.mjs';
import {cozyFishJourney} from './unified-cozy-fish-journey.mjs';

// Read-only, CPU-only audit of complete local browser reports. It never opens a
// browser, runs a server, modifies fixtures or changes the production checklist.
assert.ok(process.argv.slice(2).every(a=>a==='--accept-d03'));
const accept=process.argv.includes('--accept-d03'),qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1';
const hash=b=>createHash('sha256').update(b).digest('hex');
const bundle=JSON.parse(await readFile('dist/play/build-info.json','utf8')),receipt=hash(JSON.stringify(bundle));
const specs={
 fiveArea:['d03-five-area-first/five-area-gate.json',['allFiveNativeCareProductionAndSales','actualOneSceneOneCameraOneCanvasOneInterval','noOldAreaTabs','oneOriginalInterval','wholeSaveWeatherRngEconomyLedgerExactAfterEveryCommand','reloadExact']],
 crop:['d03-crop-first/crop-parity.json',['paidPumpAndEfficientMotor','paidEightBeds','pump24HourNativeCoverageExact','pumpClearsStalePlotPanel','contextSurvivesRemoteCameraFocus','fullFiveAreaEngineLedgerExact','reloadExact']],
 chicken:['d03-chicken-native/chicken-parity.json',['nativeBakedGeometryAndContents','paidSixHensLevelTwoShadeFeeder','savedOnOffSwitchExact','originalFourEggOrder','nativeCareCollectSales','individualIdsAtFourHeadings','fullFiveAreaEngineLedgerExact','reloadExact']],
 goat:['d03-goat-native/goat-parity.json',['doubleSaleAcceptedOnce','minimumTwoCompanionsProtected','paidMaximumHerdShelterCare','realPaddockRestRegrowth','threeExplicitRotations','allSavedIdsAtFourHeadings','fullFiveAreaEngineLedgerExact','reloadExact']],
 market:['d03-market-native/interactions.json',['allFiveNativeSales','oneSameModalBothEntrypoints','twelveActualMarketPicks','sevenActualWaymarkPicks','oneCanvasOneInterval','fullFiveAreaSaveLedgerExact','reloadExact']],
 objectives:['d03-objective-rewards/objectives.json',['scriptedOnlyNotHumanStudy','cameraElsewhereDuringActions','firstObjectiveDoesNotSelectOrComplete','allFiveNativeContexts','oneCanvasOneClock','fullFiveAreaEngineLedgerExact','reloadExact']],
 cow:['d03-cow-native/cow-activity.json',['thirdCowHasNoOpeningMilk','doubleMilkingAndSaleAcceptedOnce','lotMovementConservesMilk','paidAllCowUpgrades','originalCoopOrderAndOrdinaryDelivery','actualCoolerStatuses','fullFiveAreaEngineLedgerExact','reloadExact']],
 fish:['d03-fish-native/fish.json',['emptyPaidBasinNoStarterGrant','allStockAndEquipmentPaid','threeBatchesSixBoundedRepresentatives','rapidDuplicateHarvestSaleAcceptedOnce','actualNativeQuantitiesStageScaleWaterPivot','wholeFiveAreaSaveWeatherRngEconomyLedgerExact','reloadExact']]
};
const out={receiptSHA256:receipt,reports:{},D03Accepted:accept,completedFeatures:accept?20:19,totalFeatures:30,commands:0,profiles:0,captures:0,actualPointerPicks:0,physicalAndroid:false,push:false,deploy:false};
for(const [name,[path,flags]]of Object.entries(specs)){
 const bytes=await readFile(join(qa,path)),r=JSON.parse(bytes);
 assert.equal(r.receiptSHA256,receipt,name+' receipt');assert.equal(r.profiles.length,4,name+' profiles');
 assert.deepEqual(r.profiles.map(p=>p.name),['desktop-en','desktop-id','mobile-en','mobile-id'].map(n=>n+(name==='fish'?'':'-three')));
 assert.equal(r.activeProfile,null,name+' incomplete');assert.equal(r.slotExpired,false);assert.ok(!r.failure);assert.deepEqual(r.errors,[]);if(r.consoleErrors)assert.deepEqual(r.consoleErrors,[]);
 for(const p of r.profiles)for(const flag of flags)assert.equal(p[flag],true,name+' '+p.name+' '+flag);
 if(name==='fiveArea')for(const p of r.profiles){assert.equal(p.commands.length,235);assert.equal(p.days,9);assert.equal(p.coins,2708);}
 if(name==='crop')for(const p of r.profiles){assert.deepEqual(p.realPlantWaterHarvestSales,['lettuce','tomato']);assert.equal(p.actualPlotPicks,32);}
 if(name==='chicken')for(const p of r.profiles){assert.deepEqual(p.seenLevels,[0,1,2]);assert.ok(p.newEggs>0&&p.actualPaidFeederServices>0);}
 if(name==='goat')for(const p of r.profiles){assert.equal(p.realGrowthDays,9);assert.equal(p.salePrice,162);}
 if(name==='market')for(const p of r.profiles){assert.equal(p.picks.length,19);assert.ok(p.closingCoins>p.openingCoins);}
 if(name==='cow')for(const p of r.profiles){assert.equal(p.picks,4);assert.equal(p.collectedFirstDayMl,15420);assert.equal(p.milkFreshnessAfterCooling,400);assert.ok(p.milkCues>=3);for(const a of ['idle','walk','feed','drink','rest','milk'])assert.ok(p.observedAtlasFrames[a].length>=2);}
 if(name==='objectives')for(const p of r.profiles){assert.equal(p.jumps,22);assert.deepEqual(p.fieldRewards,[2,5,6,7]);assert.deepEqual(p.nativeRewardEvents,[{type:'missionReward',amount:5},{type:'missionReward',amount:10},{type:'missionReward',amount:10},{type:'missionReward',amount:15},{type:'missionReward',amount:20}]);}
 if(name==='fish'){
  assert.equal(r.selectedProfiles,null,'Full Fish matrix required');
  for(const p of r.profiles){assert.equal(p.commands.length,35);assert.equal(p.days,2);assert.equal(p.harvestedActualMassG,2000);assert.equal(p.paidEnergyHours,48);assert.equal(p.filterHours,95);assert.equal(p.scheduledRations,2);assert.equal(p.pointers.length,28);assert.equal(p.captures.length,12);assert.equal(p.ordinaryHtmlMenuTouchPreserved,p.name.startsWith('mobile'));for(const v of p.pointers){assert.equal(v.selected,v.id);assert.equal(v.marketOpen,false);assert.ok(v.inputTrace.some(e=>e.type==='pointerup'&&e.target==='CANVAS'&&e.trusted===true&&Math.abs(e.x-v.x)<=2&&Math.abs(e.y-v.y)<=2),'Real trusted Canvas input required');}assert.deepEqual([...new Set(p.captures.map(c=>c.quality))].sort(),['auto','high','low']);assert.deepEqual([...new Set(p.captures.map(c=>c.heading))].sort(),[0,1,2,3]);}
 }
 const dir=path.slice(0,path.lastIndexOf('/')),captures=(await readdir(join(qa,dir))).filter(n=>n.endsWith('.png')).length;
 const commands=r.profiles.reduce((s,p)=>s+(Array.isArray(p.commands)?p.commands.length:p.commands),0);assert.ok(Number.isInteger(commands)&&commands>0);
 const picks=r.profiles.reduce((s,p)=>s+(p.actualPlotPicks||0)+(Array.isArray(p.picks)?p.picks.length:p.picks||0)+(p.pointers?.length||0),0);
 out.reports[name]={path:join(qa,path),sha256:hash(bytes),profiles:4,commands,captures,actualPointerPicks:picks,consoleErrorsMonitored:Array.isArray(r.consoleErrors)};out.commands+=commands;out.profiles+=4;out.captures+=captures;out.actualPointerPicks+=picks;
}

// All non-unified native client modules and frozen fixtures must still match
// the upgrade baseline in Git's text representation (normal Windows EOL rules).
const baseline='d7fa65d446cd15ce3bb675baf3915ee9f3592854';
const native=execFileSync('git',['ls-tree','-r','--name-only',baseline,'--','game/client'],{encoding:'utf8'}).trim().split(/\r?\n/).filter(p=>/^game\/client\/(?!unified-)[^/]+\.js$/.test(p)).sort();
const actual=(await readdir('game/client')).filter(n=>n.endsWith('.js')&&!n.startsWith('unified-')).map(n=>'game/client/'+n).sort();assert.deepEqual(actual,native);
assert.equal(execFileSync('git',['diff','--name-only',baseline,'--',...native,'game/tests/fixtures/unified-world'],{encoding:'utf8'}).trim(),'','Native modules/fixtures changed');
out.nativeBaseline={commit:baseline,gitTextExact:true,modules:[]};for(const p of native)out.nativeBaseline.modules.push({path:p,sha256:hash(await readFile(p))});
const manifest=JSON.parse(await readFile('game/tests/fixtures/unified-world/manifest.json','utf8'));assert.equal(manifest.synthetic,true);assert.equal(manifest.containsUserData,false);out.fixtures=[];
for(const f of manifest.fixtures){const b=await readFile('game/tests/fixtures/unified-world/'+f.name);assert.equal(b.length,f.bytes);assert.equal(hash(b),f.sha256);assert.equal(hash(serialize(deserialize(b.toString()))),f.expectedSha256);out.fixtures.push({name:f.name,sha256:f.sha256,expectedSha256:f.expectedSha256});}
out.bundleFiles=[];for(const f of [...bundle.emitted,...bundle.defaultCore]){const b=await readFile('dist/play/'+f.name);assert.equal(b.length,f.bytes);assert.equal(hash(b),f.sha256);out.bundleFiles.push({name:f.name,sha256:f.sha256});}
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8');out.nativeRecipes={};
for(const [name,recipe]of Object.entries({fiveArea:fiveAreaJourney,fish:cozyFishJourney})){
 const a=recipe(raw),b=recipe(raw);assert.deepEqual(a.commands,b.commands);assert.equal(a.raw,b.raw);let state=deserialize(raw);for(const command of a.commands){assert.equal(command.id,state.revision+1);const result=dispatch(state,command);assert.equal(result.ok,true);state=result.state;}assert.equal(serialize(state),a.raw);out.nativeRecipes[name]={commands:a.commands.length,days:a.days,resultSHA256:hash(a.raw),independentReplayExact:true,repeatedRecipeExact:true};
}
out.mandatoryStopUTC='2026-11-10T01:00:00Z';out.pending=accept?['D04-D05/D07-D09 and E release gates']:['Explicit D03 evidence review/acceptance'];
if(process.env.QA_RESOURCES_CLOSED_UTC){assert.ok(Date.parse(process.env.QA_RESOURCES_CLOSED_UTC)<=Date.now());out.resourcesClosedObservedUTC=process.env.QA_RESOURCES_CLOSED_UTC;}
await writeFile(join(qa,'d03-proof.json'),JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify({...out,nativeBaseline:{...out.nativeBaseline,modules:out.nativeBaseline.modules.length},bundleFiles:out.bundleFiles.length},null,2));
