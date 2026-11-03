import {CHICKEN,COOP_LEVELS,WELFARE} from './chicken-config.js';
import {chickenWelfare} from './chicken-welfare.js';
import {finishChickenDay,eggSaleValue} from './chicken-eggs.js';
import {createChickenState,createCoop} from './chicken-state.js';
import {WATER} from './config.js';
/** Bounded one-time bridge; later shortages use normal egg/crop commerce or existing crop recovery. @param {import('./engine.js').State} state */
export function chickenRecoveryReason(state){const c=state.chicken,q=c?.coop;if(!c?.visited||!q)return 'chickenNotReady';if(c.grants.includes('chicken.rescue'))return 'chickenAidUsed';if(c.inventory.length||q.pending.length)return 'sellEggsFirst';const hungry=c.feedStoreG+q.feedG<c.hens.length*CHICKEN.feedPerHenDayG&&state.coins<CHICKEN.feedBagPrice,thirsty=state.water+q.waterL<c.hens.length*CHICKEN.waterPerHenDayL&&state.coins<WATER.refillCost;return hungry||thirsty?'':'chickenAidNotNeeded';}
/** One existing farm hour; no wall clock and no additional random stream. @param {import('./engine.js').State} state @param {Transaction} transact */
export function tickChicken(state,transact){
 const c=state.chicken,coop=c?.coop;if(!c?.visited||!coop)return;
 const feedNeed=c.hens.length*CHICKEN.feedPerHenDayG/24,waterNeed=c.hens.length*CHICKEN.waterPerHenDayL/24*(state.weather==='hot'?(coop.shade?CHICKEN.shadeHotWater:CHICKEN.hotWater):1);
 if(coop.autoFeeder&&coop.autoOn&&coop.feedG<feedNeed*24&&c.feedStoreG>0&&state.coins>=CHICKEN.autoCost&&state.tick-coop.lastAutoTick>=24){const amount=Math.min(COOP_LEVELS[coop.level].feedG-coop.feedG,c.feedStoreG);if(amount>0){c.feedStoreG-=amount;coop.feedG+=amount;coop.lastAutoTick=state.tick;transact(state,'feeder_service',-CHICKEN.autoCost,(state.revision+1)+':chicken.auto:'+state.tick);}}
 const feed=Math.min(coop.feedG,feedNeed),water=Math.min(coop.waterL,waterNeed);
 coop.feedG=Math.max(0,coop.feedG-feed);coop.waterL=Math.max(0,coop.waterL-water);c.stats.feedUsedG+=feed;c.stats.waterUsedL+=water;coop.dayFeedUsedG+=feed;coop.dayWaterUsedL+=water;
 coop.cleanliness=Math.max(0,coop.cleanliness-c.hens.length*CHICKEN.soilPerHenDay/24);
 coop.feedCare+=(feed/feedNeed-coop.feedCare)*WELFARE.recovery;coop.waterCare+=(water/waterNeed-coop.waterCare)*WELFARE.recovery;
 const welfare=chickenWelfare(state);if(welfare.score>=WELFARE.healthy&&welfare.feed>=WELFARE.healthy&&welfare.water>=WELFARE.healthy)coop.healthyHours=Math.min(24,coop.healthyHours+1);
 if((state.tick+1)%24===0)finishChickenDay(state,(state.tick+1)/24);
}
/** @typedef {(state:import('./engine.js').State,type:string,amount:number,id:string)=>void} Transaction */
/** Headless commands run only on the existing dispatch clone, using its shared ledger. */
/** @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {Transaction} transact */
export function applyChickenCommand(state,command,events,transact){
 if(command.type==='enterYard'){
  if(!state.chicken?.visited){const c=state.chicken||createChickenState();state.chicken=c;c.visited=true;c.coop=createCoop(state.tick);c.hens=[1,2].map(n=>({id:'chicken.hen.'+n,adultLayer:true,lastLayDay:Math.floor(state.tick/24)}));c.nextHen=3;c.feedStoreG=CHICKEN.starterFeedG;c.stats.feedGrantedG=CHICKEN.starterFeedG;c.grants.push('chicken.starter.v1');c.mission.step=1;}
  events.push({type:'chickenEntered'});return '';
 }
 const c=state.chicken,coop=c?.coop;if(!c?.visited||!coop)return 'chickenNotReady';const cfg=COOP_LEVELS[coop.level];
 switch(command.type){
  case 'buyFeed':if(c.feedStoreG+CHICKEN.feedBagG>CHICKEN.feedStoreMaxG)return 'feedStoreFull';if(state.coins<CHICKEN.feedBagPrice)return 'noCoins';transact(state,'feed_purchase',-CHICKEN.feedBagPrice,command.id+':chicken.feed');c.feedStoreG+=CHICKEN.feedBagG;c.stats.feedBoughtG+=CHICKEN.feedBagG;events.push({type:'chickenFeedBought',amount:CHICKEN.feedBagG});return '';
  case 'sellEggs':{const index=c.inventory.findIndex(l=>l.id===command.eggLot);if(index<0)return 'noEggLot';const lot=c.inventory[index],amount=eggSaleValue(lot);c.inventory.splice(index,1);c.stats.sold+=lot.quantity;transact(state,'egg_sale',amount,command.id+':chicken.sale');events.push({type:'chickenEggsSold',amount});return '';}
  case 'upgradeCoop':{const next=COOP_LEVELS[coop.level+1];if(!next)return 'coopMax';if(c.mission.step<7)return 'chickenSellFirst';if(state.coins<next.price)return 'noCoins';transact(state,'coop_upgrade',-next.price,command.id+':chicken.coop');coop.level++;events.push({type:'chickenCoopUpgraded'});return '';}
  case 'buyHen':{if(c.hens.length>=cfg.capacity)return 'coopFull';if(c.mission.step<8)return 'chickenChapterFirst';if(state.coins<CHICKEN.henPrice)return 'noCoins';const id='chicken.hen.'+c.nextHen++;transact(state,'hen_purchase',-CHICKEN.henPrice,command.id+':'+id);c.hens.push({id,adultLayer:true,lastLayDay:Math.floor(state.tick/24)});events.push({type:'chickenHenBought'});return '';}
  case 'upgradeFeeder':if(coop.autoFeeder)return 'feederInstalled';if(c.mission.step<8)return 'chickenChapterFirst';if(state.coins<CHICKEN.autoPrice)return 'noCoins';transact(state,'feeder_upgrade',-CHICKEN.autoPrice,command.id+':chicken.feeder');coop.autoFeeder=true;events.push({type:'chickenFeederBuilt'});return '';
  case 'toggleFeeder':if(!coop.autoFeeder)return 'noAutoFeeder';coop.autoOn=!coop.autoOn;events.push({type:coop.autoOn?'chickenFeederOn':'chickenFeederOff'});return '';
  case 'addShade':if(coop.shade)return 'shadeInstalled';if(c.mission.step<8)return 'chickenChapterFirst';if(state.coins<CHICKEN.shadePrice)return 'noCoins';transact(state,'shade_purchase',-CHICKEN.shadePrice,command.id+':chicken.shade');coop.shade=true;events.push({type:'chickenShadeBuilt'});return '';
  case 'chickenRecovery':{const reason=chickenRecoveryReason(state);if(reason)return reason;c.grants.push('chicken.rescue');c.feedStoreG+=CHICKEN.aidFeedG;c.stats.feedGrantedG+=CHICKEN.aidFeedG;state.water=Math.min(WATER.tankCapacity,state.water+CHICKEN.aidWaterL);events.push({type:'chickenRecovered'});return '';}
  case 'feedHens':{const space=cfg.feedG-coop.feedG;if(space<=0)return 'feederFull';if(c.feedStoreG<=0)return 'noChickenFeed';const amount=Math.min(space,c.feedStoreG);c.feedStoreG-=amount;coop.feedG+=amount;c.stats.feedActions++;events.push({type:'chickenFed',amount});return '';}
  case 'waterHens':{const space=cfg.waterL-coop.waterL;if(space<=0)return 'drinkerFull';if(state.water<=0)return 'noWater';const amount=Math.min(space,state.water);state.water-=amount;coop.waterL+=amount;c.stats.waterTransferredL+=amount;c.stats.waterActions++;events.push({type:'chickenWatered',amount});return '';}
  case 'cleanCoop':if(coop.cleanliness>=99.999)return 'alreadyClean';if(state.tick-coop.lastCleanTick<CHICKEN.cleanIntervalHours)return 'cleanCooldown';if(state.coins<CHICKEN.cleanPrice)return 'noCoins';transact(state,'care_cost',-CHICKEN.cleanPrice,command.id+':chicken.clean');coop.cleanliness=100;coop.lastCleanTick=state.tick;c.stats.cleaned++;events.push({type:'chickenCleaned'});return '';
  case 'collectEggs':{if(!coop.pending.length)return 'noEggs';const count=coop.pending.length;if(c.inventory.reduce((n,l)=>n+l.quantity,0)+count>CHICKEN.eggInventoryMax)return 'eggInventoryFull';const day=Math.floor(state.tick/24);for(const grade of /** @type {import('./chicken-state.js').Grade[]} */(['A','B','C'])){const quantity=coop.pending.filter(e=>e.grade===grade).length;if(quantity)c.inventory.push({id:'chicken.lot.'+c.nextLot++,grade,quantity,collectedDay:day,sourceCoop:coop.id});}coop.pending=[];c.stats.collected+=count;events.push({type:'chickenCollected',amount:count});return '';}
  default:return 'chickenNotReady';
 }
}
