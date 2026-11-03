import {STARTER,LIMITS,WATER,CROP_IDS} from './config.js';
/** @param {import('./engine.js').State} state */
export function assertInvariants(state){
 if(!Number.isSafeInteger(state.coins)||state.coins<0||!Number.isSafeInteger(state.revision)||state.revision<0||!Number.isSafeInteger(state.tick)||state.tick<0)throw new Error('Invalid economy/time');
 if(!Number.isFinite(state.water)||state.water<0||state.water>WATER.tankCapacity)throw new Error('Invalid tank');
 if((state.pump.on&&!state.pump.built)||!Number.isSafeInteger(state.pump.runHours)||state.pump.runHours<0||!Number.isInteger(state.careCredits)||state.careCredits<0||state.careCredits>1)throw new Error('Invalid facility/care state');
 for(const crop of CROP_IDS)if(!Number.isSafeInteger(state.seeds[crop])||state.seeds[crop]<0||state.seeds[crop]>99)throw new Error('Invalid seeds');
 if(state.inventory.reduce((n,l)=>n+l.quantity,0)>LIMITS.inventory)throw new Error('Inventory capacity');
 for(const l of state.inventory)if(!CROP_IDS.includes(l.type)||!Number.isSafeInteger(l.quantity)||l.quantity<1||!Number.isFinite(l.quality)||l.quality<.35||l.quality>1)throw new Error('Invalid produce');
 for(const p of state.plots){if(!Number.isFinite(p.soilWaterMm)||p.soilWaterMm<0||p.soilWaterMm>p.soilCapacityMm)throw new Error('Invalid soil');if(p.crop&&(!CROP_IDS.includes(p.crop.type)||!Number.isFinite(p.crop.progress)||p.crop.progress<0||p.crop.progress>1||p.crop.quality<.35||p.crop.quality>1))throw new Error('Invalid crop');}
 const ids=new Set();let balance=STARTER.coins;for(const line of state.ledger){if(ids.has(line.id)||!Number.isSafeInteger(line.amount))throw new Error('Duplicate/invalid transaction');ids.add(line.id);balance+=line.amount;if(balance<0||line.balance!==balance)throw new Error('Ledger drift');}if(balance!==state.coins)throw new Error('Balance drift');
}
