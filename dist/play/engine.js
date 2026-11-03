import {STARTER,INITIAL_PLOTS,CROP_IDS,CROPS,WATER,WEATHER,LIMITS,MISSION_REWARDS,PUMP,ORDERS} from './config.js';
import {waterBalance,clamp} from './water.js';
import {advanceMission} from './missions.js';
import {assertInvariants} from './invariants.js';
/** @typedef {'sunny'|'cloudy'|'rainy'|'hot'} Weather */
/** @typedef {'lettuce'|'tomato'} CropId */
/** @typedef {{type:CropId,progress:number,quality:number,stage:number,plantedTick:number}} Crop */
/** @typedef {{id:number,x:number,y:number,soilWaterMm:number,soilCapacityMm:number,crop:Crop|null,waterAppliedMm:number,careCost:number,lastWaterTick:number,history:{tick:number,water:number,growth:number}[]}} Plot */
/** @typedef {{id:string,tick:number,type:string,amount:number,balance:number}} LedgerEntry */
/** @typedef {{id:number,type:CropId,quantity:number,quality:number}} Lot */
/** @typedef {{saveVersion:number,revision:number,tick:number,seed:number,rng:number,weather:Weather,paused:boolean,speed:number,coins:number,water:number,careCredits:number,seeds:Record<CropId,number>,plots:Plot[],inventory:Lot[],ledger:LedgerEntry[],mission:{step:number,rewards:number[]},pump:{built:boolean,on:boolean,runHours:number,stopReason:string},stats:{planted:number,watered:number,cared:number,harvested:number,sold:number,hotCare:number,orders:number},completedOrders:string[],nextLot:number}} State */
/** @typedef {'select'|'tick'|'nextDay'|'pause'|'speed'|'plant'|'water'|'harvest'|'sell'|'buySeed'|'buyPump'|'togglePump'|'refill'|'recovery'|'expand'|'order'} CommandType */
/** @typedef {{id:number,type:CommandType,plot?:number,crop?:CropId,lot?:number,order?:string}} Command */
/** @typedef {{type:string,plot?:number,amount?:number}} DomainEvent */
/** @param {number} [seed] @returns {State} */
export function createState(seed=6321){return {saveVersion:1,revision:0,tick:0,seed:seed>>>0,rng:seed>>>0,weather:'sunny',paused:true,speed:1,coins:STARTER.coins,water:STARTER.water,careCredits:0,seeds:{lettuce:STARTER.seeds,tomato:0},plots:INITIAL_PLOTS.map(p=>({...p,soilWaterMm:12,soilCapacityMm:50,crop:null,waterAppliedMm:0,careCost:0,lastWaterTick:-1,history:[]})),inventory:[],ledger:[],mission:{step:0,rewards:[]},pump:{built:false,on:false,runHours:0,stopReason:''},stats:{planted:0,watered:0,cared:0,harvested:0,sold:0,hotCare:0,orders:0},completedOrders:[],nextLot:1};}
/** @param {State} state */
export const recoveryAvailable=state=>state.coins<CROPS.lettuce.seedPrice&&state.seeds.lettuce+state.seeds.tomato===0&&state.inventory.length===0&&!state.plots.some(p=>p.crop);
/** @param {{x:number,y:number}} plot */
export const pumpCovers=plot=>Math.abs(plot.x-PUMP.x)+Math.abs(plot.y-PUMP.y)<=PUMP.range;
/** @param {State} state */
function nextWeather(state){state.rng=(Math.imul(1664525,state.rng)+1013904223)>>>0;const names=/** @type {Weather[]} */(['sunny','cloudy','rainy','hot']);state.weather=names[(state.rng>>>16)%names.length];}
/** @param {State} state @returns {Weather} */
export function forecastWeather(state){const next=structuredClone(state);nextWeather(next);return next.weather;}
/** @param {State} state */
function hour(state){
 const covered=state.plots.filter(pumpCovers),waterNeeded=covered.length*PUMP.mmHour;
 let running=state.pump.built&&state.pump.on;
 if(running){const cost=state.pump.runHours%PUMP.energyHours===0?PUMP.energyCoins:0;if(state.water<waterNeeded||state.coins<cost){state.pump.on=false;state.pump.stopReason=state.water<waterNeeded?'noWater':'noCoins';running=false;}else{state.water-=waterNeeded;if(cost)transact(state,'water_cost',-cost,(state.revision+1)+':pump:'+state.tick);state.pump.runHours++;}}
 for(const plot of state.plots){
  const crop=plot.crop,config=crop?CROPS[crop.type]:null,weather=WEATHER[state.weather];
  const irrigationMm=running&&pumpCovers(plot)?PUMP.mmHour:0;plot.waterAppliedMm+=irrigationMm;
  const balance=waterBalance({waterMm:plot.soilWaterMm,capacityMm:plot.soilCapacityMm,rainMm:weather.rainMmDay/24,irrigationMm,etMm:(config?config.waterPerDayMm/24:.15)*weather.et});plot.soilWaterMm=balance.waterMm;
  if(crop&&config){crop.progress=Math.min(1,crop.progress+balance.waterFactor*weather.growth/config.hours);crop.stage=config.stages.filter(threshold=>crop.progress>=threshold).length-1;crop.quality=clamp(crop.quality+(balance.moisturePercent<20||balance.moisturePercent>90?-.004:.003),.35,1);}
  plot.history.push({tick:state.tick+1,water:plot.soilWaterMm,growth:crop?.progress||0});if(plot.history.length>48)plot.history.shift();
 }state.tick++;if(state.tick%24===0)nextWeather(state);
}
/** @param {State} state @param {string} type @param {number} amount @param {string} id */
function transact(state,type,amount,id){state.coins+=amount;state.ledger.push({id,tick:state.tick,type,amount,balance:state.coins});}
/** @param {Lot} lot */
export const saleValue=lot=>Math.max(1,Math.round(lot.quantity*CROPS[lot.type].price*lot.quality));
/** @param {State} input @param {Command} command @returns {{state:State,ok:boolean,error:string,events:DomainEvent[]}} */
export function dispatch(input,command){
 const reject=(/** @type {string} */error)=>({state:input,ok:false,error,events:[]});
 if(!command||!Number.isSafeInteger(command.id)||command.id!==input.revision+1)return reject('staleCommand');
 const state=structuredClone(input);/** @type {DomainEvent[]} */const events=[];
 switch(command.type){
  case 'order':{
   const order=ORDERS.find(o=>o.id===command.order);if(!order)return reject('invalidOrder');if(state.mission.step<7)return reject('ordersLocked');if(state.completedOrders.includes(order.id))return reject('orderDone');
   for(const crop of CROP_IDS)if(state.inventory.filter(l=>l.type===crop).reduce((n,l)=>n+l.quantity,0)<(order.needs[crop]||0))return reject('orderMissing');
   let revenue=0,quantity=0;for(const crop of CROP_IDS){let need=order.needs[crop]||0;for(const lot of state.inventory.filter(l=>l.type===crop)){const take=Math.min(need,lot.quantity);if(take){revenue+=saleValue({...lot,quantity:take});lot.quantity-=take;need-=take;quantity+=take;}}}
   state.inventory=state.inventory.filter(l=>l.quantity>0);transact(state,'sale_revenue',revenue,command.id+':orderSale');transact(state,'mission_reward',order.bonus,command.id+':orderBonus');state.completedOrders.push(order.id);state.stats.orders++;state.stats.sold+=quantity;events.push({type:'orderFilled',amount:revenue+order.bonus});break;
  }
  case 'recovery':if(!recoveryAvailable(state))return reject('recoveryUnavailable');state.seeds.lettuce=1;state.water=Math.max(50,state.water);state.careCredits=1;events.push({type:'recovered'});break;
  case 'buyPump':if(state.pump.built)return reject('pumpExists');if(state.stats.sold<1)return reject('sellFirst');if(state.coins<PUMP.price)return reject('noCoins');transact(state,'facility_purchase',-PUMP.price,command.id+':pumpBuild');state.pump.built=true;events.push({type:'pumpBuilt'});break;
  case 'togglePump':if(!state.pump.built)return reject('noPump');if(!state.pump.on&&state.water<state.plots.filter(pumpCovers).length*PUMP.mmHour)return reject('noWater');if(!state.pump.on&&state.coins<PUMP.energyCoins)return reject('noCoins');state.pump.on=!state.pump.on;state.pump.stopReason='';events.push({type:state.pump.on?'pumpOn':'pumpOff'});break;
  case 'buySeed':{
   if(!command.crop||!CROP_IDS.includes(command.crop))return reject('invalidCrop');if(state.seeds[command.crop]>=99)return reject('seedCapacity');const price=CROPS[command.crop].seedPrice;if(state.coins<price)return reject('noCoins');state.seeds[command.crop]++;transact(state,'seed_purchase',-price,command.id+':seed');events.push({type:'seedBought'});break;
  }
  case 'refill':{
   const litres=Math.min(WATER.refillLitres,WATER.tankCapacity-state.water);if(litres<=0)return reject('tankFull');const price=Math.ceil(litres/WATER.refillLitres*WATER.refillCost);if(state.coins<price)return reject('noCoins');state.water+=litres;transact(state,'water_cost',-price,command.id+':refill');events.push({type:'refilled',amount:litres});break;
  }
  case 'sell':{
   const index=state.inventory.findIndex(lot=>lot.id===command.lot);if(index<0)return reject('noProduce');const lot=state.inventory[index],revenue=saleValue(lot);state.inventory.splice(index,1);transact(state,'sale_revenue',revenue,command.id+':sale');state.stats.sold+=lot.quantity;events.push({type:'sold',amount:revenue});break;
  }
  case 'select':if(!state.plots.some(p=>p.id===command.plot))return reject('invalidPlot');events.push({type:'selected',plot:command.plot});break;
  case 'harvest':{
   const plot=state.plots.find(p=>p.id===command.plot);if(!plot)return reject('invalidPlot');if(!plot.crop)return reject('noCrop');if(plot.crop.progress<1)return reject('notReady');
   const crop=plot.crop,quantity=Math.max(1,Math.floor(CROPS[crop.type].yield*crop.quality));if(state.inventory.reduce((sum,lot)=>sum+lot.quantity,0)+quantity>LIMITS.inventory)return reject('inventoryFull');
   state.inventory.push({id:state.nextLot++,type:crop.type,quantity,quality:crop.quality});plot.crop=null;state.stats.harvested+=quantity;events.push({type:'harvested',plot:plot.id,amount:quantity});break;
  }
  case 'water':{
   const plot=state.plots.find(p=>p.id===command.plot);if(!plot)return reject('invalidPlot');if(plot.lastWaterTick===state.tick)return reject('alreadyWatered');if(plot.soilWaterMm/plot.soilCapacityMm>=.9)return reject('alreadyWet');
   const amount=Math.min(WATER.amountMm,plot.soilCapacityMm-plot.soilWaterMm),cost=state.careCredits>0?0:WATER.coinCost;if(state.water<amount)return reject('noWater');if(state.coins<cost)return reject('noCoins');
   if(state.careCredits>0)state.careCredits--;plot.soilWaterMm+=amount;plot.waterAppliedMm+=amount;plot.careCost+=cost;plot.lastWaterTick=state.tick;state.water-=amount;transact(state,'water_cost',-cost,command.id+':water');state.stats.watered++;if(plot.crop)state.stats.cared++;events.push({type:'watered',plot:plot.id,amount});break;
  }
  case 'plant':{
   const plot=state.plots.find(p=>p.id===command.plot);if(!plot)return reject('invalidPlot');if(plot.crop)return reject('occupied');
   if(!command.crop||!CROP_IDS.includes(command.crop))return reject('invalidCrop');if(state.seeds[command.crop]<1)return reject('noSeeds');
   state.seeds[command.crop]--;plot.crop={type:command.crop,progress:0,quality:1,stage:0,plantedTick:state.tick};state.stats.planted++;events.push({type:'planted',plot:plot.id});break;
  }
  case 'nextDay':for(let i=0;i<24;i++)hour(state);events.push({type:'timeAdvanced',amount:24});break;
  case 'tick':if(state.paused)return reject('paused');hour(state);break;
  case 'pause':state.paused=!state.paused;break;
  case 'speed':state.speed=state.speed===1?2:1;break;
  default:return reject('unknownCommand');
 }
 for(const step of advanceMission(state,events)){const reward=MISSION_REWARDS[step];if(reward&&!state.mission.rewards.includes(step)){state.mission.rewards.push(step);transact(state,'mission_reward',reward,command.id+':mission:'+step);events.push({type:'missionReward',amount:reward});}}
 state.revision=command.id;assertInvariants(state);return {state,ok:true,error:'',events};
}
