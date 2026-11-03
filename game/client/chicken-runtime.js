import {CHICKEN,COOP_LEVELS,WELFARE} from './chicken-config.js';
import {chickenWelfare} from './chicken-welfare.js';
/** One existing farm hour; no wall clock and no additional random stream. @param {import('./engine.js').State} state */
export function tickChicken(state){
 const c=state.chicken,coop=c?.coop;if(!c?.visited||!coop)return;
 const feedNeed=c.hens.length*CHICKEN.feedPerHenDayG/24,waterNeed=c.hens.length*CHICKEN.waterPerHenDayL/24*(state.weather==='hot'?(coop.shade?CHICKEN.shadeHotWater:CHICKEN.hotWater):1);
 const feed=Math.min(coop.feedG,feedNeed),water=Math.min(coop.waterL,waterNeed);
 coop.feedG=Math.max(0,coop.feedG-feed);coop.waterL=Math.max(0,coop.waterL-water);c.stats.feedUsedG+=feed;c.stats.waterUsedL+=water;coop.dayFeedUsedG+=feed;coop.dayWaterUsedL+=water;
 coop.cleanliness=Math.max(0,coop.cleanliness-c.hens.length*CHICKEN.soilPerHenDay/24);
 coop.feedCare+=(feed/feedNeed-coop.feedCare)*WELFARE.recovery;coop.waterCare+=(water/waterNeed-coop.waterCare)*WELFARE.recovery;
 const welfare=chickenWelfare(state);if(welfare.score>=WELFARE.healthy&&welfare.feed>=WELFARE.healthy&&welfare.water>=WELFARE.healthy)coop.healthyHours=Math.min(24,coop.healthyHours+1);
}
/** @typedef {(state:import('./engine.js').State,type:string,amount:number,id:string)=>void} Transaction */
/** Headless commands run only on the existing dispatch clone, using its shared ledger. */
/** @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {Transaction} transact */
export function applyChickenCommand(state,command,events,transact){
 const c=state.chicken,coop=c?.coop;if(!c?.visited||!coop)return 'chickenNotReady';const cfg=COOP_LEVELS[coop.level];
 switch(command.type){
  case 'enterYard':events.push({type:'chickenEntered'});return '';
  case 'buyFeed':if(c.feedStoreG+CHICKEN.feedBagG>CHICKEN.feedStoreMaxG)return 'feedStoreFull';if(state.coins<CHICKEN.feedBagPrice)return 'noCoins';transact(state,'feed_purchase',-CHICKEN.feedBagPrice,command.id+':chicken.feed');c.feedStoreG+=CHICKEN.feedBagG;c.stats.feedBoughtG+=CHICKEN.feedBagG;events.push({type:'chickenFeedBought',amount:CHICKEN.feedBagG});return '';
  case 'feedHens':{const space=cfg.feedG-coop.feedG;if(space<=0)return 'feederFull';if(c.feedStoreG<=0)return 'noChickenFeed';const amount=Math.min(space,c.feedStoreG);c.feedStoreG-=amount;coop.feedG+=amount;c.stats.feedActions++;events.push({type:'chickenFed',amount});return '';}
  case 'waterHens':{const space=cfg.waterL-coop.waterL;if(space<=0)return 'drinkerFull';if(state.water<=0)return 'noWater';const amount=Math.min(space,state.water);state.water-=amount;coop.waterL+=amount;c.stats.waterTransferredL+=amount;c.stats.waterActions++;events.push({type:'chickenWatered',amount});return '';}
  case 'cleanCoop':if(coop.cleanliness>=99.999)return 'alreadyClean';if(state.tick-coop.lastCleanTick<CHICKEN.cleanIntervalHours)return 'cleanCooldown';if(state.coins<CHICKEN.cleanPrice)return 'noCoins';transact(state,'care_cost',-CHICKEN.cleanPrice,command.id+':chicken.clean');coop.cleanliness=100;coop.lastCleanTick=state.tick;c.stats.cleaned++;events.push({type:'chickenCleaned'});return '';
  default:return 'chickenNotReady';
 }
}
