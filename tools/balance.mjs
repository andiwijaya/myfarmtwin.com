import {createState,dispatch,recoveryAvailable} from '../game/client/engine.js';import {assertInvariants} from '../game/client/invariants.js';import {CROPS} from '../game/client/config.js';import {pathToFileURL} from 'node:url';
export function runBalance(crop,days=60,seed=6321,refillInterval=1){
 let state=createState(seed),waterUsed=0,harvests=0,minCoins=120,lastRefill=-refillInterval;
 function act(type,extra={}){const before=state;const result=dispatch(state,{id:state.revision+1,type,...extra});if(!result.ok)throw new Error(type+': '+result.error);state=result.state;if(type==='water')waterUsed+=before.water-state.water;assertInvariants(state);minCoins=Math.min(minCoins,state.coins);}
 for(let day=0;day<days;day++){
  for(const p of [...state.plots])if(p.crop?.progress===1){act('harvest',{plot:p.id});harvests++;}
  for(const lot of [...state.inventory])act('sell',{lot:lot.id});
  for(const p of [...state.plots])if(!p.crop){if(state.seeds[crop]===0&&state.coins>=CROPS[crop].seedPrice)act('buySeed',{crop});if(state.seeds[crop]>0)act('plant',{plot:p.id,crop});}
  for(const p of [...state.plots])if(p.crop&&p.soilWaterMm/p.soilCapacityMm<.55){if(state.water<25&&state.coins>=6&&day-lastRefill>=refillInterval){act('refill');lastRefill=day;}if(state.water>=25&&state.coins>=2)act('water',{plot:p.id});}
  act('nextDay');
 }
 for(const p of [...state.plots])if(p.crop?.progress===1){act('harvest',{plot:p.id});harvests++;}for(const lot of [...state.inventory])act('sell',{lot:lot.id});
 return {crop,days,seed,refillInterval,coins:state.coins,netCoins:state.coins-120,harvests,waterUsed:Math.round(waterUsed),minimumCoins:minCoins,sales:state.ledger.filter(l=>l.type==='sale_revenue').reduce((s,l)=>s+l.amount,0),costs:-state.ledger.filter(l=>l.amount<0).reduce((s,l)=>s+l.amount,0),softlocked:recoveryAvailable(state),state};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)for(const refillInterval of [1,7])for(const crop of ['lettuce','tomato']){const {state,...report}=runBalance(crop,60,6321,refillInterval);console.log(JSON.stringify(report));}
