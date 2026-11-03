import {STARTER,INITIAL_PLOTS,CROP_IDS,CROPS} from './config.js';
/** @typedef {'sunny'|'cloudy'|'rainy'|'hot'} Weather */
/** @typedef {'lettuce'|'tomato'} CropId */
/** @typedef {{type:CropId,progress:number,quality:number,stage:number,plantedTick:number}} Crop */
/** @typedef {{id:number,x:number,y:number,soilWaterMm:number,soilCapacityMm:number,crop:Crop|null,waterAppliedMm:number,careCost:number,lastWaterTick:number,history:{tick:number,water:number,growth:number}[]}} Plot */
/** @typedef {{id:number,tick:number,type:string,amount:number,balance:number}} LedgerEntry */
/** @typedef {{id:number,type:CropId,quantity:number,quality:number}} Lot */
/** @typedef {{saveVersion:number,revision:number,tick:number,seed:number,rng:number,weather:Weather,paused:boolean,speed:number,coins:number,water:number,seeds:Record<CropId,number>,plots:Plot[],inventory:Lot[],ledger:LedgerEntry[],mission:{step:number,rewards:number[]},pump:{built:boolean,on:boolean},stats:{planted:number,watered:number,harvested:number,sold:number,hotCare:number,orders:number},nextLot:number}} State */
/** @typedef {'tick'|'nextDay'|'pause'|'speed'|'plant'|'water'|'harvest'|'sell'|'buySeed'|'buyPump'|'togglePump'|'refill'|'recovery'|'expand'|'order'} CommandType */
/** @typedef {{id:number,type:CommandType,plot?:number,crop?:CropId,lot?:number}} Command */
/** @typedef {{type:string,plot?:number,amount?:number}} DomainEvent */
/** @param {number} [seed] @returns {State} */
export function createState(seed=6321){return {saveVersion:1,revision:0,tick:0,seed:seed>>>0,rng:seed>>>0,weather:'sunny',paused:true,speed:1,coins:STARTER.coins,water:STARTER.water,seeds:{lettuce:STARTER.seeds,tomato:0},plots:INITIAL_PLOTS.map(p=>({...p,soilWaterMm:12,soilCapacityMm:50,crop:null,waterAppliedMm:0,careCost:0,lastWaterTick:-1,history:[]})),inventory:[],ledger:[],mission:{step:0,rewards:[]},pump:{built:false,on:false},stats:{planted:0,watered:0,harvested:0,sold:0,hotCare:0,orders:0},nextLot:1};}
/** @param {State} state */
function nextWeather(state){state.rng=(Math.imul(1664525,state.rng)+1013904223)>>>0;const names=/** @type {Weather[]} */(['sunny','cloudy','rainy','hot']);state.weather=names[(state.rng>>>16)%names.length];}
/** @param {State} state */
function hour(state){for(const plot of state.plots){if(plot.crop){const crop=plot.crop,config=CROPS[crop.type];crop.progress=Math.min(1,crop.progress+1/config.hours);crop.stage=config.stages.filter(threshold=>crop.progress>=threshold).length-1;}}state.tick++;if(state.tick%24===0)nextWeather(state);}
/** @param {State} input @param {Command} command @returns {{state:State,ok:boolean,error:string,events:DomainEvent[]}} */
export function dispatch(input,command){
 const reject=(/** @type {string} */error)=>({state:input,ok:false,error,events:[]});
 if(!command||!Number.isSafeInteger(command.id)||command.id!==input.revision+1)return reject('staleCommand');
 const state=structuredClone(input);/** @type {DomainEvent[]} */const events=[];
 switch(command.type){
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
 state.revision=command.id;return {state,ok:true,error:'',events};
}
