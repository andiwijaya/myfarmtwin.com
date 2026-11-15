import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {createState,dispatch} from '../game/client/engine.js';
import {serialize,deserialize} from '../game/client/save-schema.js';
import {activateGarden} from '../game/client/active-garden.js';
import {PrototypeSession,validatePrototypeLayout} from '../game/client/glb-prototype-state.js';
import {cowSupply} from '../game/client/cow-state.js';
import {cowMilkingReason} from '../game/client/cow-milking.js';
import {cowSaleQuote} from '../game/client/cow-sales.js';
import {fishCount,fishSupply} from '../game/client/fish-state.js';
import {fishReady} from '../game/client/fish-stock.js';
import {fishContractReason} from '../game/client/fish-goals.js';

const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
const accepted=result=>{assert.equal(result.ok,true,result.error);return result;};

/** Valid native fixture from the immutable historical all-area fixture followed
 * by ordinary native dispatch commands only. No wallet, yield, history,
 * ownership, mission, order, cohort, or accounting field is edited directly. */
export async function makeRichNativeFixture(){
 const sourcePath='game/tests/fixtures/unified-world/v5-mixed.json',sourceRaw=await readFile(resolve(sourcePath),'utf8');
 let state=activateGarden(deserialize(sourceRaw));
 const commands=[];
 const act=(type,args={})=>{const command={id:state.revision+1,type,...args},result=dispatch(state,command);assert.equal(result.ok,true,type+': '+result.error);state=result.state;commands.push(command);return result;};
 const refill=()=>{if(state.water<200)act('refill');};
 const waterPlants=()=>{for(const plot of state.plots)if(plot.crop&&plot.soilWaterMm<25){if(state.water<25)refill();act('water',{plot:plot.id});}};
 function care(){
  const chicken=state.chicken;if(chicken.coop.feedG<800){if(chicken.feedStoreG<2000)act('buyFeed');act('feedHens');}if(state.chicken.coop.waterL<3){refill();act('waterHens');}if(state.chicken.coop.cleanliness<90&&state.tick-state.chicken.coop.lastCleanTick>=6)act('cleanCoop');
  const goat=state.goat;if(goat.hayStockG<9000)act('buyHay');if(state.goat.feederG<7000)act('feedGoats');if(state.goat.troughMl<15000){refill();act('waterGoats');}if(state.goat.shelter.cleanliness<80&&state.tick-state.goat.shelter.lastCleanTick>=6)act('cleanGoatShelter');
  while(state.cow.feedStoreG+cowSupply(state.cow.feedTrough)<32000)act('buyCowFeed');if(cowSupply(state.cow.feedTrough)<24000)act('feedCows');while(state.water*1000+cowSupply(state.cow.waterTrough)<150000)refill();if(cowSupply(state.cow.waterTrough)<150000)act('waterCows');act('cleanCowBarn');
  while(fishSupply(state.fish.feed)<1000)act('fish.buyFeed',{fishPond:1});
  for(const pond of state.fish.ponds){if(fishCount(pond)&&!pond.pendingFeedG&&(pond.lastFeedTick<0||state.tick-pond.lastFeedTick>=24))act('fish.feed',{fishPond:pond.id});}
  waterPlants();
 }
 assert.equal(state.plots.length,24);assert.ok(state.chicken.visited&&state.goat.visited&&state.cow.visited&&state.fish.visited);
 // Keep the third old crop, old animal identities and old spoiled milk intact.
 for(const id of [0,1])act('harvest',{plot:id});
 act('buyPump');act('upgradeEfficiency');act('order',{order:'salad'});
 for(const [crop,id]of [['tomato',3],['corn',4],['tomato',6],['tomato',7],['tomato',8],['corn',9]]){act('buySeed',{crop});act('plant',{crop,plot:id});}
 act('collectEggs');act('upgradeCoop');act('buyHen');act('buyHen');act('upgradeFeeder');act('toggleFeeder');act('addShade');
 act('upgradeGoatShelter');act('upgradeGoatCare');act('unlockPaddock');act('rotatePaddock',{paddock:1});act('buyGoat');
 act('fish.buyFilter',{fishPond:1});act('fish.buyFeeder',{fishPond:1});act('fish.expand',{fishPond:1});act('fish.stock',{fishPond:2,fishCount:2});act('fish.aerate',{fishPond:2});act('fish.buyWater',{fishPond:1});
 for(let day=0;day<6;day++){
  care();act('nextDay');
  if(day<5&&state.chicken.coop.pending.length)act('collectEggs');
  if(!state.chicken.stats.eggOrders&&state.chicken.inventory.reduce((n,l)=>n+l.quantity,0)>=4)act('chickenOrder');
 }
 care();
 // Crop inventory, completed orders, mature crop, and newly planted stages coexist.
 assert.equal(state.plots[3].crop.progress,1);for(const id of [2,3,4,6,7,8])act('harvest',{plot:id});act('order',{order:'tomatoBox'});act('order',{order:'mixedBasket'});
 for(const [crop,id]of [['lettuce',0],['tomato',1],['corn',5]]){act('buySeed',{crop});act('plant',{crop,plot:id});if(state.plots[id].soilWaterMm<25){if(state.water<25)refill();act('water',{plot:id});}}
 // Leave old zero-freshness lots in place as a deliberate preservation edge case.
 for(const type of ['cleanCowStand','cleanCowCan'])act(type);
 for(const cow of [...state.cow.cows]){const storage=cow.id==='cow.bought.1'?'cooler':'can';if(!cowMilkingReason(state,cow.id,storage))act('milkCow',{cowId:cow.id,cowStorage:storage});}
 const fresh=state.cow.lots.filter(l=>l.freshnessScore>0).map(l=>l.id);assert.ok(fresh.length>0);
 act('acceptCowOrder',{cowOrder:'cow.delivery'});act('sellCowMilk',{cowLots:fresh,cowOrder:'cow.delivery',cowQuote:cowSaleQuote(state,fresh,'cow.delivery')});act('acceptCowOrder',{cowOrder:'cow.volume'});
 const ready=state.fish.ponds[0].cohorts.find(c=>fishReady(c,state.tick));assert.ok(ready,'Native fish cohort should be mature after six more days');act('fish.harvest',{fishPond:1,fishCohort:ready.id,fishCount:2});
 for(const contract of ['fish.delivery','fish.quality','fish.volume'])if(!fishContractReason(state.fish,contract))act('fish.claimContract',{fishPond:1,fishContract:contract});
 // One paid operating hour leaves explicit cold-chain/aeration credits for the
 // migration audit, rather than ending only on an exact 24-hour boundary.
 if(state.paused)act('pause');act('tick');act('pause');
 if(!state.paused)act('pause');
 const raw=serialize(state);assert.deepEqual(deserialize(raw),state);
 assert.equal(state.plots.length,24);assert.ok(state.coins>0);assert.ok(state.inventory.length>0);assert.ok(state.chicken.inventory.length>0);assert.ok(state.chicken.coop.pending.length>0);assert.equal(state.chicken.hens.length,4);assert.equal(state.goat.herd.length,4);assert.equal(state.cow.cows.length,3);assert.ok(state.cow.lots.some(l=>l.freshnessScore===0));assert.ok(state.cow.lots.some(l=>l.freshnessScore>0));assert.equal(state.fish.ponds.length,2);assert.ok(state.fish.lots.length>0);assert.equal(state.completedOrders.length,3);assert.ok(state.chicken.stats.eggOrders);assert.equal(state.cow.orders.acceptedId,'cow.volume');assert.ok(state.cow.orders.completedIds.includes('cow.delivery'));
 return {sourcePath,sourceRaw,commands,state,raw};
}

export function nativeFixtureSummary(state){return {saveVersion:state.saveVersion,revision:state.revision,tick:state.tick,coins:state.coins,water:state.water,beds:state.plots.length,plants:state.plots.filter(p=>p.crop).map(p=>({id:p.id,type:p.crop.type,progress:p.crop.progress,stage:p.crop.stage})),seeds:state.seeds,cropLots:state.inventory,completedOrders:state.completedOrders,pump:state.pump,chicken:{hens:state.chicken.hens.map(h=>h.id),pending:state.chicken.coop.pending.length,inventory:state.chicken.inventory,feedStoreG:state.chicken.feedStoreG,coop:state.chicken.coop,eggOrders:state.chicken.stats.eggOrders},goat:{ids:state.goat.herd.map(h=>h.id),hayStockG:state.goat.hayStockG,feederG:state.goat.feederG,troughMl:state.goat.troughMl,shelter:state.goat.shelter,paddocks:state.goat.paddocks,activePaddock:state.goat.activePaddock,sales:state.goat.sales.length},cow:{ids:state.cow.cows.map(c=>c.id),reservoirs:state.cow.cows.map(c=>({id:c.id,milkReadyMl:c.milkReadyMl})),lots:state.cow.lots,feedStoreG:state.cow.feedStoreG,feedTrough:state.cow.feedTrough,waterTrough:state.cow.waterTrough,barn:state.cow.barn,cooler:state.cow.cooler,orders:state.cow.orders},fish:{ponds:state.fish.ponds.map(p=>({id:p.id,volumeL:p.volumeL,cohorts:p.cohorts,aeratorOn:p.aeratorOn,efficient:p.efficient,biofilter:p.biofilter,autoFeeder:p.autoFeeder,airPaidTicks:p.airPaidTicks,filterPaidTicks:p.filterPaidTicks})),lots:state.fish.lots,feed:state.fish.feed,water:state.fish.water,air:state.fish.air,contracts:state.fish.contracts},ledgerEntries:state.ledger.length};}

export async function writeCozyFixtures(destination=resolve('game/tests/fixtures/cozy-world')){
 await mkdir(destination,{recursive:true});const files=[],legacySources=[];
 const save=async(name,content)=>{const bytes=typeof content==='string'?content:JSON.stringify(content,null,2)+'\n';await writeFile(join(destination,name),bytes);files.push({name,bytes:Buffer.byteLength(bytes),sha256:digest(bytes)});};
 for(const name of ['v0-fresh.json','v1-mixed.json','v2-mixed.json','v3-mixed.json','v4-mixed.json','v5-mixed.json']){const path='game/tests/fixtures/unified-world/'+name,raw=await readFile(resolve(path),'utf8');assert.equal(activateGarden(deserialize(raw)).plots.length,24);legacySources.push({path,bytes:Buffer.byteLength(raw),sha256:digest(raw)});}
 await save('v6-fresh.json',serialize(createState()));
 const generated=await makeRichNativeFixture();await save('v6-all-areas-baseline.json',serialize(activateGarden(deserialize(generated.sourceRaw))));await save('v6-rich-all-areas.json',generated.raw);await save('v6-rich-summary.json',nativeFixtureSummary(generated.state));
 const db=new Map([['myfarmtwin.save.v1',generated.raw]]),storage={getItem:key=>db.get(key)??null,setItem:(key,value)=>db.set(key,value),removeItem:key=>db.delete(key)},session=new PrototypeSession(storage);
 for(const [id,transform]of [['bed.0',{x:-16,z:8,rotation:Math.PI/2}],['barn',{x:9,z:8,rotation:Math.PI/2}]])accepted(session.move(id,transform));
 for(const [kind,transform]of [['path',{x:0,z:12,rotation:0}],['fence',{x:-20,z:14,rotation:0}],['banana',{x:-19,z:9,rotation:0}]])accepted(session.build(kind,transform));
 assert.equal(db.get('myfarmtwin.save.v1'),generated.raw);assert.deepEqual(validatePrototypeLayout(session.layout),session.layout);const bundle=session.exportBundle();await save('p2-rich-moved-bundle.json',bundle);await save('p2-rich-moved-layout.json',JSON.stringify(session.layout));
 await save('dispatch-recipe.json',{sourcePath:generated.sourcePath,sourceSHA256:digest(generated.sourceRaw),sourceMigration:'deserialize then activateGarden; no raw native field edits',commands:generated.commands,resultNativeSHA256:digest(generated.raw),layoutOperations:[{type:'move',id:'bed.0',x:-16,z:8,rotation:Math.PI/2},{type:'move',id:'barn',x:9,z:8,rotation:Math.PI/2},{type:'build',kind:'path',x:0,z:12,rotation:0},{type:'build',kind:'fence',x:-20,z:14,rotation:0},{type:'build',kind:'banana',x:-19,z:9,rotation:0}]});
 const manifest={format:'MyFarmTwinCozyFixtureSources',version:1,createdFor:'P3-P7 migration and all-area acceptance',source:'Synthetic valid native history only; never a personal browser profile',generation:'node tools/cozy-world-fixtures.mjs',optionalQACopy:'node tools/cozy-world-fixtures.mjs --qa',canonicalSchema:6,sourceValidation:'Every native output passes serialize/deserialize roundtrip; source legacy fixtures pass strict deserialization; P2 layout passes validatePrototypeLayout.',legacySources,files,summary:nativeFixtureSummary(generated.state)};
 await writeFile(join(destination,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');return {destination,files,summary:manifest.summary};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){const result=await writeCozyFixtures();if(process.argv.includes('--qa')){const qa=resolve('qa-artifacts/cozy-world/fixture-source');await mkdir(qa,{recursive:true});for(const file of [...result.files,{name:'manifest.json'}])await copyFile(join(result.destination,file.name),join(qa,file.name));for(const name of ['v0-fresh.json','v1-mixed.json','v2-mixed.json','v3-mixed.json','v4-mixed.json','v5-mixed.json'])await copyFile(resolve('game/tests/fixtures/unified-world',name),join(qa,name));}console.log(JSON.stringify({destination:result.destination,files:result.files.length,qaCopy:process.argv.includes('--qa'),coins:result.summary.coins,beds:result.summary.beds,animals:{hens:result.summary.chicken.hens.length,goats:result.summary.goat.ids.length,cows:result.summary.cow.ids.length,fish:result.summary.fish.ponds.flatMap(p=>p.cohorts).reduce((n,c)=>n+c.count,0)}}));}
