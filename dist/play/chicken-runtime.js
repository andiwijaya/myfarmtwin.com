import {CHICKEN,COOP_LEVELS} from './chicken-config.js';
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
  default:return 'chickenNotReady';
 }
}
