import assert from 'node:assert/strict';
import {dispatch} from '../game/client/engine.js';
import {deserialize,serialize} from '../game/client/save-schema.js';
import {goatCapacities} from '../game/client/goat-state.js';
import {goatQuote} from '../game/client/goat-market-policy.js';
import {fishReady} from '../game/client/fish-stock.js';
import {cowMilkingReason} from '../game/client/cow-milking.js';
/** Produce all five saleable outputs through original commands only. Never edits resources. */
export function makeSharedMarketFarm(raw){
 let state=deserialize(raw);const commands=[];
 const send=(type,extra={})=>{const command={id:state.revision+1,type,...extra},r=dispatch(state,command);assert.ok(r.ok,type+': '+r.error);state=r.state;commands.push(command);};
 const care=()=>{const cap=goatCapacities(state.goat);if(state.goat.feederG<cap.feederG*.75){const space=cap.feederG-state.goat.feederG;while(state.goat.hayStockG<space)send('buyHay');send('feedGoats');}if(state.goat.troughMl<cap.troughMl*.75){while(state.water*1000<cap.troughMl-state.goat.troughMl)send('refill');send('waterGoats');}if(state.goat.shelter.cleanliness<85&&state.tick-state.goat.shelter.lastCleanTick>=6)send('cleanGoatShelter');};
 let days=0;send('fish.feed',{fishPond:1});send('fish.exchange',{fishPond:1});care();send('nextDay');days++;
 const cohort=state.fish.ponds[0].cohorts.find(c=>fishReady(c,state.tick));assert.ok(cohort);send('fish.harvest',{fishPond:1,fishCohort:cohort.id});
 for(const plot of [...state.plots])if(plot.crop?.progress>=1)send('harvest',{plot:plot.id});
 if(state.chicken.coop.pending.length)send('collectEggs');
 while(!state.goat.herd.some(g=>goatQuote(state,g.id).price>0)&&days<30){care();send('nextDay');days++;}
 assert.ok(state.goat.herd.some(g=>goatQuote(state,g.id).price>0));
 for(const lot of [...state.cow.lots])send('discardCowMilk',{cowLot:lot.id});
 if(state.cow.barn.standCleanliness<85)send('cleanCowStand');if(state.cow.barn.canCleanliness<85)send('cleanCowCan');
 for(const cow of state.cow.cows)if(!cowMilkingReason(state,cow.id,'cooler'))send('milkCow',{cowId:cow.id,cowStorage:'cooler'});
 assert.ok(state.inventory.length&&state.chicken.inventory.length&&state.cow.lots.length&&state.fish.lots.length);
 const goatId=state.goat.herd.find(g=>goatQuote(state,g.id).price>0)?.id;assert.ok(goatId);
 return{state,raw:serialize(state),commands,days,goatId};
}
