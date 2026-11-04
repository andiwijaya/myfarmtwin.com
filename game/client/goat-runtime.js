import {createGoatKit,goatCapacities} from './goat-state.js';
import {GOAT} from './goat-config.js';
import {browseGoatHour} from './goat-pasture.js';
import {updateGoatCare} from './goat-welfare.js';
import {growGoats} from './goat-growth.js';
/** @typedef {(state:import('./engine.js').State,type:string,amount:number,id:string)=>void} Transaction */
/** The existing single logical hour owns age. Husbandry terms are added in their sequential gates. @param {import('./engine.js').State} state */
export function tickGoat(state){const g=state.goat;if(!g?.visited)return;for(const goat of g.herd)goat.ageHours++;const {remaining,browse,demand}=browseGoatHour(g,state.weather),hay=Math.min(g.feederG,remaining);g.feederG=Math.max(0,g.feederG-hay);g.stats.hayUsedG+=hay;const waterDemand=g.herd.length*GOAT.waterDayMl/24*(state.weather==='hot'?GOAT.hotWaterFactor:1),water=Math.min(g.troughMl,waterDemand);g.troughMl=Math.max(0,g.troughMl-water);g.stats.waterUsedMl+=water;if(g.shelter)g.shelter.cleanliness=Math.max(0,g.shelter.cleanliness-g.herd.length*GOAT.soilPerGoatDay/24);updateGoatCare(g,state.weather,{foodDemand:demand,food:browse+hay,browse,waterDemand,water});growGoats(g);}
/** Called only on dispatch's private clone; rejected commands never escape it. @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {Transaction} transact */
export function applyGoatCommand(state,command,events,transact){
 if(command.type==='enterGoat'){if(state.goat?.visited)return 'goatAlreadyEntered';state.goat=createGoatKit(state.tick);transact(state,'goat_starter_grant',0,'goat.starter.v1');events.push({type:'goatEntered'});return '';}
 const g=state.goat;if(!g?.visited)return 'goatNotVisited';
 const cap=goatCapacities(g);
 if(command.type==='buyHay'){if(g.hayStockG+GOAT.hayBagG>GOAT.hayStoreMaxG)return 'goatHayStoreFull';if(state.coins<GOAT.hayBagPrice)return 'noCoins';transact(state,'goat_feed_purchase',-GOAT.hayBagPrice,command.id+':goat.hay');g.hayStockG+=GOAT.hayBagG;g.stats.hayBoughtG+=GOAT.hayBagG;events.push({type:'goatHayBought',amount:GOAT.hayBagG});return '';}
 if(command.type==='feedGoats'){const space=cap.feederG-g.feederG;if(space<=.00001)return 'goatRackFull';if(g.hayStockG<=0)return 'goatNoHay';const amount=Math.min(space,g.hayStockG);g.hayStockG=Math.max(0,g.hayStockG-amount);g.feederG+=amount;g.stats.feedActions++;events.push({type:'goatFed',amount});return '';}
 if(command.type==='waterGoats'){const space=cap.troughMl-g.troughMl;if(space<=.00001)return 'goatTroughFull';if(state.water<=0)return 'noWater';const amount=Math.min(space,state.water*1000);state.water=Math.max(0,state.water-amount/1000);g.troughMl+=amount;g.stats.waterTransferredMl+=amount;g.stats.waterActions++;events.push({type:'goatWatered',amount});return '';}
 if(command.type==='cleanGoatShelter'){const shelter=g.shelter;if(!shelter)return 'goatNotVisited';if(shelter.cleanliness>=99.999)return 'goatShelterClean';if(state.tick-shelter.lastCleanTick<GOAT.cleanInterval)return 'goatCleanCooldown';shelter.cleanliness=Math.min(100,shelter.cleanliness+GOAT.cleanEffect);shelter.lastCleanTick=state.tick;g.stats.cleaned++;events.push({type:'goatShelterCleaned'});return '';}
 if(command.type==='inspectGoat'){const goat=g.herd.find(h=>h.id===command.goatId);if(!goat)return 'goatMissing';g.stats.inspected++;if(goat.growth===1)g.mission.inspectedAdult=true;events.push({type:'goatInspected'});return '';}
 return 'goatActionUnavailable';
}
