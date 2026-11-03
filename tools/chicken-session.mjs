import {createState,dispatch,pumpCovers,expansionPrice} from '../game/client/engine.js';import {assertInvariants} from '../game/client/invariants.js';import {serialize,deserialize} from '../game/client/save-schema.js';import {SaveSession,SAVE_KEY} from '../game/client/storage.js';import {CROPS,ORDERS,CROP_IDS} from '../game/client/config.js';import {CHICKEN} from '../game/client/chicken-config.js';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';
/** Paid mixed-farm strategy; all stocks/progression come from real commands, never injected money/resources. */
export function runChickenSession(days=35,seed=6321){
 let state=createState(seed),minimumCoins=state.coins,peakSaveBytes=0,replayRejections=0;const trace=[],values=new Map(),store={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};let session=new SaveSession(store);session.load();session.save(state);
 function act(type,extra={}){const command={id:state.revision+1,type,...extra},before=structuredClone(state),r=dispatch(state,command);assert.equal(r.ok,true,type+': '+r.error);assert.deepEqual(state,before,'input mutation');state=r.state;trace.push(command);assertInvariants(state);minimumCoins=Math.min(minimumCoins,state.coins);session.save(state);peakSaveBytes=Math.max(peakSaveBytes,Buffer.byteLength(store.getItem(SAVE_KEY)));if(trace.length%5===0){const replay=dispatch(state,command);assert.equal(replay.error,'staleCommand');assert.equal(replay.state,state);replayRejections++;}}
 act('enterYard');
 for(let day=0;day<days;day++){
  for(const p of [...state.plots])if(p.crop?.progress===1)act('harvest',{plot:p.id});
  if(state.mission.step===7)for(const o of ORDERS)if(!state.completedOrders.includes(o.id)&&CROP_IDS.every(c=>state.inventory.filter(l=>l.type===c).reduce((n,l)=>n+l.quantity,0)>=(o.needs[c]||0)))act('order',{order:o.id});
  if(state.mission.step<7||state.completedOrders.length===3||state.coins<100||state.inventory.reduce((n,l)=>n+l.quantity,0)>20)for(const lot of [...state.inventory])act('sell',{lot:lot.id});
  if(state.stats.sold>0&&!state.pump.built&&state.coins>=120)act('buyPump');
  if(state.mission.step===7&&state.plots.length<8&&state.coins>=expansionPrice(state)+150)act('expand');
  if(state.mission.step===7&&!state.pump.efficient&&state.coins>=240)act('upgradeEfficiency');
  const c=state.chicken,q=c.coop;
  if(q.feedG<500){if(c.feedStoreG===0&&state.coins>=CHICKEN.feedBagPrice)act('buyFeed');if(state.chicken.feedStoreG>0)act('feedHens');}
  if(state.water<70&&state.coins>=6)act('refill');
  if(state.chicken.coop.waterL<1&&state.water>0)act('waterHens');
  if(state.chicken.coop.cleanliness<90&&state.coins>=CHICKEN.cleanPrice)act('cleanCoop');
  if(state.chicken.mission.step>=7&&state.chicken.coop.level===0&&state.coins>=140)act('upgradeCoop');
  for(const p of [...state.plots])if(!p.crop){const crop=day<4?'lettuce':p.id%2?'tomato':'lettuce';if(state.seeds[crop]===0&&state.coins>=CROPS[crop].seedPrice+30)act('buySeed',{crop});if(state.seeds[crop]>0)act('plant',{plot:p.id,crop});}
  if(state.pump.built){const covered=state.plots.filter(pumpCovers),mean=covered.reduce((n,p)=>n+p.soilWaterMm,0)/covered.length,shouldRun=mean<28&&state.water>=50&&state.coins>=30;if(shouldRun!==state.pump.on)act('togglePump');}
  for(const p of [...state.plots])if(p.crop&&p.soilWaterMm<22&&p.lastWaterTick!==state.tick){if(state.water<25&&state.coins>=6)act('refill');if(state.water>=25&&state.coins>=2)act('water',{plot:p.id});}
  act('nextDay');if(state.chicken.coop.pending.length)act('collectEggs');for(const lot of [...state.chicken.inventory])act('sellEggs',{eggLot:lot.id});
  const roundtrip=deserialize(serialize(state));assert.deepEqual(roundtrip,state);session=new SaveSession(store);const loaded=session.load();assert.equal(loaded.status,'saveResumed');assert.deepEqual(loaded.state,state);state=loaded.state;assert.equal(state.chicken.hens.length,2);assert.equal(new Set(state.ledger.map(l=>l.id)).size,state.ledger.length);
 }
 let replay=createState(seed);for(const command of trace){const r=dispatch(replay,command);assert.equal(r.ok,true,r.error);replay=r.state;}assert.deepEqual(replay,state,'full shared farm replay drift');
 return {days,seed,commands:trace.length,replayRejections,peakSaveBytes,minimumCoins,coins:state.coins,plots:state.plots.length,cropHarvested:state.stats.harvested,cropSold:state.stats.sold,cropOrders:state.completedOrders.length,pumpHours:state.pump.runHours,eggsLaid:state.chicken.stats.laid,eggsSold:state.chicken.stats.sold,feedBoughtG:state.chicken.stats.feedBoughtG,feedUsedG:state.chicken.stats.feedUsedG,waterUsedL:state.chicken.stats.waterUsedL,chickenMission:state.chicken.mission.step,state};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {state,...report}=runChickenSession(Number(process.argv[2])||35);console.log(JSON.stringify(report));}
