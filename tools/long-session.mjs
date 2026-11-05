import {spawnSync} from 'node:child_process';
import {createState,dispatch,pumpCovers,expansionPrice} from '../game/client/engine.js';import {assertInvariants} from '../game/client/invariants.js';import {serialize,deserialize} from '../game/client/save-schema.js';import {CROPS,ORDERS,CROP_IDS} from '../game/client/config.js';import {pathToFileURL} from 'node:url';import assert from 'node:assert/strict';
export function runLongSession(days=90){
 let state=createState(),commands=0,replayRejections=0,peakSaveBytes=0,minCoins=120;
 function act(type,extra={}){const c={id:state.revision+1,type,...extra},r=dispatch(state,c);if(!r.ok)throw new Error(type+': '+r.error);state=r.state;commands++;minCoins=Math.min(minCoins,state.coins);assertInvariants(state);if(commands%5===0){const replay=dispatch(state,c);assert.equal(replay.ok,false);assert.equal(replay.state,state);replayRejections++;}}
 for(let day=0;day<days;day++){
  for(const p of [...state.plots])if(p.crop?.progress===1)act('harvest',{plot:p.id});
  if(state.mission.step===7)for(const o of ORDERS)if(!state.completedOrders.includes(o.id)&&CROP_IDS.every(c=>state.inventory.filter(l=>l.type===c).reduce((n,l)=>n+l.quantity,0)>=(o.needs[c]||0)))act('order',{order:o.id});
  if(state.mission.step<7||state.completedOrders.length===3||state.coins<60||state.inventory.reduce((n,l)=>n+l.quantity,0)>20)for(const lot of [...state.inventory])act('sell',{lot:lot.id});
  if(state.stats.sold>0&&!state.pump.built&&state.coins>=60)act('buyPump');
  if(state.mission.step===7&&state.plots.length<8&&state.coins>=expansionPrice(state)+100)act('expand');
  if(state.mission.step===7&&!state.pump.efficient&&state.coins>=180)act('upgradeEfficiency');
  for(const p of [...state.plots])if(!p.crop){const crop=day<4?'lettuce':p.id%2?'tomato':'lettuce';if(state.seeds[crop]===0&&state.coins>=CROPS[crop].seedPrice+2)act('buySeed',{crop});if(state.seeds[crop]>0)act('plant',{plot:p.id,crop});}
  if(state.water<50&&state.coins>=6)act('refill');
  if(state.pump.built){const covered=state.plots.filter(pumpCovers),mean=covered.reduce((n,p)=>n+p.soilWaterMm,0)/covered.length,shouldRun=mean<28&&state.water>=20&&state.coins>=4;if(shouldRun!==state.pump.on)act('togglePump');}
  for(const p of [...state.plots])if(p.crop&&p.soilWaterMm<22&&p.lastWaterTick!==state.tick){if(state.water<25&&state.coins>=6)act('refill');if(state.water>=25&&state.coins>=2)act('water',{plot:p.id});}
  act('nextDay');const text=serialize(state);peakSaveBytes=Math.max(peakSaveBytes,Buffer.byteLength(text));const before=state;state=deserialize(text);assert.deepEqual(state,before);
 }
 return {days,commands,replayRejections,peakSaveBytes,minimumCoins:minCoins,coins:state.coins,plots:state.plots.length,harvested:state.stats.harvested,sold:state.stats.sold,orders:state.completedOrders.length,mission:state.mission.step,followups:state.followups,pumpHours:state.pump.runHours,state};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {state,...report}=runLongSession();console.log(JSON.stringify(report));}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {FEATURES}=await import('../game/client/features.js');if(FEATURES.fish)for(const script of ["fish-endurance.mjs", "fish-max-endurance.mjs"]){const result=spawnSync(process.execPath,['tools/'+script],{stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status??1);}}
