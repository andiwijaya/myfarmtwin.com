import {FISH,FISH_STATS} from './fish-config.js';
/** @typedef {{starter:number,normal:number,recovery:number}} FishSupply */
/** @typedef {{id:string,species:'tilapia',source:'starter-ready'|'starter-young'|'purchase'|'advance',acquiredTick:number,count:number,massG:number,condition:number,lastFedTick:number,growthRemainder:number}} FishCohort */
/** @typedef {{tick:number,oxygenMg:number,tanMg:number,biomassG:number,feedUsedG:number,growthG:number}} FishHistory */
/** @typedef {{id:number,createdTick:number,volumeL:number,oxygenMg:number,tanMg:number,tempCentiC:number,phMilli:number,aeratorOn:boolean,efficient:boolean,biofilter:boolean,autoFeeder:boolean,serviceStatus:'off'|'running'|'noCoins',lastFeedTick:number,pendingFeedG:number,sludgeG:number,airPaidTicks:number,filterPaidTicks:number,cohorts:FishCohort[],history:FishHistory[],balance:{oxygenOpeningMg:number,oxygenInMg:number,oxygenUsedMg:number,oxygenOutMg:number,tanInMg:number,tanRemovedMg:number,tanConvertedMg:number,feedOfferedG:number,feedEatenG:number,feedWasteG:number,sludgeDecomposedG:number,sludgeEffluentG:number,stockCount:number,stockMassG:number,growthG:number,harvestCount:number,harvestG:number,exchangedL:number}}} FishPond */
/** @typedef {{id:string,pondId:number,cohortId:string,count:number,massG:number,grade:'A'|'B'|'C',harvestedTick:number}} FishLot */
/** @typedef {{id:number,tick:number,kind:'efficiency'|'pond'|'filter'|'feeder'|'stock'|'sale'|'recovery'|'advance',pondId:number,count:number,massG:number,coins:number}} FishReceipt */
/** @typedef {ReturnType<typeof createFishState>} FishState */
/** Reading or constructing an empty module never grants fish, water, feed or Coins. */
export function createFishState(){return {visited:false,enteredTick:-1,starterGrantId:'',balanceVersion:FISH.balanceVersion,ponds:/** @type {FishPond[]} */([]),feed:/** @type {FishSupply} */({starter:0,normal:0,recovery:0}),water:/** @type {FishSupply} */({starter:0,normal:0,recovery:0}),air:/** @type {{starter:number,recovery:number}} */({starter:0,recovery:0}),lots:/** @type {FishLot[]} */([]),nextCohort:1,nextLot:1,nextReceipt:1,receipts:/** @type {FishReceipt[]} */([]),mission:{step:0,completed:/** @type {string[]} */([])},contracts:/** @type {string[]} */([]),recovery:/** @type {{active:boolean,mode:''|'care'|'restock',episode:number,completed:number,startedTick:number,lastCompletedTick:number,advanceCoins:number,advanceCount:number,repaymentCoins:number}} */({active:false,mode:'',episode:0,completed:0,startedTick:-1,lastCompletedTick:-24,advanceCoins:0,advanceCount:0,repaymentCoins:0}),stats:/** @type {Record<typeof FISH_STATS[number],number>} */(Object.fromEntries(FISH_STATS.map(k=>[k,0])))};}
/** Pure empty-pond construction; only an accepted later command may attach it to state. @param {number} id @param {number} tick @returns {FishPond} */
export function createFishPond(id,tick){const oxygen=FISH.pondLitres*FISH.initialDoMgL;return {id,createdTick:tick,volumeL:FISH.pondLitres,oxygenMg:oxygen,tanMg:FISH.initialTanMg,tempCentiC:FISH.tempCentiC,phMilli:FISH.phMilli,aeratorOn:false,efficient:false,biofilter:false,autoFeeder:false,serviceStatus:'off',lastFeedTick:-1,pendingFeedG:0,sludgeG:0,airPaidTicks:0,filterPaidTicks:0,cohorts:[],history:[],balance:{oxygenOpeningMg:oxygen,oxygenInMg:0,oxygenUsedMg:0,oxygenOutMg:0,tanInMg:FISH.initialTanMg,tanRemovedMg:0,tanConvertedMg:0,feedOfferedG:0,feedEatenG:0,feedWasteG:0,sludgeDecomposedG:0,sludgeEffluentG:0,stockCount:0,stockMassG:0,growthG:0,harvestCount:0,harvestG:0,exchangedL:0}};}
/** @param {FishSupply} value */
export const fishSupply=value=>value.starter+value.normal+value.recovery;
/** @param {FishPond} pond */
export const fishCount=pond=>pond.cohorts.reduce((n,c)=>n+c.count,0);
/** @param {FishPond} pond */
export const fishBiomass=pond=>pond.cohorts.reduce((n,c)=>n+c.count*c.massG,0);
/** Reserve mature mass now; ordinary growth must never overflow or delete stock. @param {FishPond} pond @param {number} count */
export const fishCanStock=(pond,count)=>Number.isSafeInteger(count)&&count>0&&fishCount(pond)+count<=FISH.maxFish&&(fishCount(pond)+count)*FISH.maxMassG<=FISH.biomassMaxG&&pond.cohorts.length<FISH.maxCohorts;
/** @param {FishCohort} cohort @param {number} tick */
export function fishStage(cohort,tick){if(cohort.massG>=FISH.maxMassG&&(cohort.source==='starter-ready'||tick-cohort.acquiredTick>=240))return 'ready';if(cohort.massG>=250)return 'grow-out';return cohort.massG>=100?'juvenile':'fingerling';}
/** @param {FishPond} pond */
export const fishOxygen=pond=>pond.oxygenMg/pond.volumeL;
/** TAN, not unionized NH3. @param {FishPond} pond */
export const fishTan=pond=>pond.tanMg/pond.volumeL;

/** Exactly-once finite kit, attached only by an accepted explicit enterFishPond command. @param {number} tick */
export function createFishKit(tick){const g=createFishState(),p=createFishPond(1,tick);g.visited=true;g.enteredTick=tick;g.starterGrantId='fish.starter.v1';g.feed.starter=FISH.starterFeedG;g.water.starter=FISH.starterWaterL;g.air.starter=FISH.starterAirTicks;g.mission.step=1;g.nextCohort=3;p.cohorts=[{id:'fish.cohort.1',species:'tilapia',source:'starter-ready',acquiredTick:tick,count:FISH.readyCount,massG:FISH.maxMassG,condition:1000,lastFedTick:-1,growthRemainder:0},{id:'fish.cohort.2',species:'tilapia',source:'starter-young',acquiredTick:tick,count:FISH.fingerlingCount,massG:FISH.fingerlingG,condition:1000,lastFedTick:-1,growthRemainder:0}];p.balance.stockCount=FISH.readyCount+FISH.fingerlingCount;p.balance.stockMassG=FISH.readyCount*FISH.maxMassG+FISH.fingerlingCount*FISH.fingerlingG;g.ponds.push(p);return g;}
