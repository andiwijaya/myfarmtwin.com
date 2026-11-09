import assert from 'node:assert/strict';import {dispatch} from '../game/client/engine.js';import {deserialize,serialize} from '../game/client/save-schema.js';import {fishSupply} from '../game/client/fish-state.js';import {fishReady} from '../game/client/fish-stock.js';import {FISH_CONTRACTS,fishContractReason} from '../game/client/fish-goals.js';import {fishEnergyTrial} from '../game/client/fish-energy.js';
/** The existing Fish parity journey, executed through native commands only.
 * Browser QA replays these same commands through the actual visible interface.
 * No fixture field, clock, resource, weather or RNG is edited or granted here. */
export function cozyFishJourney(raw){
 let state=deserialize(raw);const commands=[],start=state,act=(type,fishPond=1,extra={})=>{const command={id:state.revision+1,type,...(type==='nextDay'?{}:{fishPond}),...extra},r=dispatch(state,command);assert.ok(r.ok,type+': '+r.error);state=r.state;commands.push(command);};
 const water=start.fish.ponds[0];act('fish.expand');assert.equal(state.fish.ponds[1].cohorts.length,0);
 for(const id of [1,2]){if(!state.fish.ponds.find(p=>p.id===id).efficient)act('fish.upgradeAir',id);act('fish.buyFilter',id);act('fish.buyFeeder',id);act('fish.toggleFeeder',id);act('fish.toggleFeeder',id);}
 assert.equal(state.fish.ponds[0].oxygenMg,water.oxygenMg);assert.equal(state.fish.ponds[0].tanMg,water.tanMg);
 for(let n=0;n<3;n++)act('fish.stock',2,{fishCount:4});
 while(fishSupply(state.fish.feed)<4000)act('fish.buyFeed');for(let n=0;n<2;n++)act('fish.buyWater');
 for(const id of [1,2]){act('fish.feed',id);act('fish.exchange',id);if(id===1)act('fish.aerate',id);act('fish.aerate',id);}
 const feeds=state.fish.stats.feedActions,filters=state.fish.stats.filterUsedTicks;let days=0,firstReadyDay=0;
 while((!fishReady(state.fish.ponds[0].cohorts[0],state.tick)||state.fish.stats.feedActions===feeds)&&days<14){act('nextDay');days++;if(!firstReadyDay&&fishReady(state.fish.ponds[0].cohorts[0],state.tick))firstReadyDay=days;}
 const cohort=state.fish.ponds[0].cohorts[0];assert.ok(fishReady(cohort,state.tick));assert.ok(state.fish.stats.feedActions>feeds);assert.ok(state.fish.stats.filterUsedTicks>filters);const trial=fishEnergyTrial(state,2);assert.equal(trial.hours,48);assert.equal(trial.eligible,true);
 act('fish.inspect');act('fish.harvest',1,{fishCohort:cohort.id});const lot=state.fish.lots[0];assert.equal(lot.massG,2000);act('fish.sell',1,{fishLot:lot.id});
 for(const contract of FISH_CONTRACTS)if(!fishContractReason(state.fish,contract.id))act('fish.claimContract',1,{fishContract:contract.id});
 act('fish.claimEnergy',2);act('fish.stock',1,{fishCount:4});assert.equal(new Set(state.ledger.map(l=>l.id)).size,state.ledger.length);
 return{start,state,raw:serialize(state),commands,days,firstReadyDay,cohortId:cohort.id,lot,trial,filterHours:state.fish.stats.filterUsedTicks-filters,scheduledRations:state.fish.stats.feedActions-feeds};
}
