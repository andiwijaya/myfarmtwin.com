import {createState} from './engine.js';
import {COW_ORDERS,COW_PRICES} from './cow-config.js';
import {CROPS as LEGACY_CROPS} from './config.js';
import {EGG_PRICES} from './chicken-config.js';
import {FISH_PRICES} from './fish-config.js';
import {cowEffectiveGrade} from './cow-storage.js';
import {fishSupportAccount} from './fish-support.js';
import {deserialize} from './save-schema.js';
import {activateGarden} from './active-garden.js';
import {validatePrototypeLayout} from './glb-prototype-state.js';
import {COZY_BUILD_CATALOG,COZY_FACILITY_KINDS,COZY_LAND_BOUNDS,placementIssue,findPlacement,normalizeRotation} from './cozy-placement.js';
import {HOUSE_KIND,HOUSE_LEVELS} from './cozy-houses.js';
export {COZY_BUILD_CATALOG,COZY_FACILITY_KINDS,COZY_LAND_BOUNDS,placementIssue};

/** @typedef {{id:string,kind:string,x:number,z:number,rotation:number}} Placement */
/** @typedef {{id:string,species:string,growth:number,condition:number,ready:number,count:number,massG:number,lactating:boolean}} Animal */
/** @typedef {{id:string,kind:string,level:number,feedStockG:number,feedG:number,waterStockMl:number,waterMl:number,cleanliness:number,auto:boolean,shade:boolean,enabled:boolean,pending:number,productionHours:number,animals:Animal[],forageG:number,foragePlots:number,pendingLots:{quantity:number,quality:number,sourceId:string,value3000:number}[]}} Facility */
/** @typedef {{id:string,type:string,quantity:number,quality:number,sourceId:string,value3000:number}} ProduceLot */
/** @typedef {{id:string,needs:Record<string,number>,bonus:number,completed:boolean}} Order */
/** @typedef {{level:number,salesCoins:number}} HouseProgress */
/** @typedef {{format:string,version:number,revision:number,tick:number,seed:number,rng:number,weather:string,coins:number,water:number,careCredits:number,seeds:Record<string,number>,plots:import('./engine.js').Plot[],inventory:ProduceLot[],ledger:import('./engine.js').LedgerEntry[],stats:{planted:number,watered:number,harvested:number,sold:number,orders:number,income:number,expense:number},progression:{xp:number,level:number,achievements:string[],completedOrders:string[],startedKinds:string[],credit3000:number,debtCoins:number},orders:Order[],land:{level:number},layout:{items:Placement[],nextId:number},facilities:Facility[],nextLot:number,provenance:{native:string|null,layout:string|null},house?:HouseProgress}} CozyState */
/** @typedef {{state:CozyState,ok:boolean,error:string,events:any[],id?:string}} DispatchResult */

export const COZY_VERSION=2;
export const COZY_MORNING_HOUR=6;
export const COZY_REALTIME_HOUR_MS=12_000;
/** @type {Readonly<Record<string,{hours:number,seedPrice:number,yield:number,price:number,stages:number}>>} */
export const COZY_CROPS=Object.freeze({lettuce:{hours:18,seedPrice:4,yield:3,price:8,stages:4},tomato:{hours:30,seedPrice:8,yield:5,price:10,stages:4},corn:{hours:42,seedPrice:10,yield:4,price:14,stages:5}});
/** @type {Readonly<Record<string,{price:number,scale:number,unit:string}>>} */
export const COZY_GOODS=Object.freeze({lettuce:{price:8,scale:1,unit:'buah'},tomato:{price:10,scale:1,unit:'buah'},corn:{price:14,scale:1,unit:'buah'},egg:{price:7,scale:1,unit:'butir'},milk:{price:7,scale:1000,unit:'L'},fish:{price:36,scale:1000,unit:'kg'}});
const CROP_IDS=Object.keys(COZY_CROPS), GOODS=Object.keys(COZY_GOODS),MAX_NUMBER=1e12,MAX_ITEMS=10000,ANIMAL_KINDS=/** @type {Record<string,string>} */({barn:'cow',coop:'chicken',goatShelter:'goat',pond:'fish'});
/** @type {Record<string,{feed:number,price:number,demand:number,water:number,capacity:number}>} */
const STOCK={barn:{feed:20000,price:12,demand:300,water:1500,capacity:3},coop:{feed:2000,price:5,demand:4,water:12,capacity:6},goatShelter:{feed:10000,price:10,demand:35,water:150,capacity:5},pond:{feed:2000,price:8,demand:1,water:0,capacity:60}};
export const COZY_SUPPLIES=Object.freeze(STOCK);
/** @type {{feed:Record<string,{amount:number,price:number}>,animal:Record<string,number>,animalCount:Record<string,number>,upgradeBase:number,expandBase:number,waterPer20L:number}} */
export const COZY_COSTS=Object.freeze({feed:Object.fromEntries(Object.entries(STOCK).map(([k,v])=>[k,{amount:v.feed,price:v.price}])),animal:{barn:180,coop:25,goatShelter:45,pond:20},animalCount:{barn:1,coop:1,goatShelter:1,pond:8},upgradeBase:50,expandBase:180,waterPer20L:1});
/** @template T @param {T} v @returns {T} */
const clone=v=>structuredClone(v);
/** @param {number} n @param {number} [a] @param {number} [b] */
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
/** @param {CozyState} input @param {string} error @returns {DispatchResult} */
function fail(input,error){return {state:input,ok:false,error,events:[]};}
/** @param {any} v */
function plain(v){return !!v&&typeof v==='object'&&!Array.isArray(v)&&Object.getPrototypeOf(v)===Object.prototype&&Object.values(Object.getOwnPropertyDescriptors(v)).every(d=>Object.hasOwn(d,'value')&&d.enumerable)&&Reflect.ownKeys(v).every(k=>typeof k==='string');}
/** @param {any} v @param {string[]} keys @returns {any} */
function object(v,keys){if(!plain(v)||Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw Error('saveImportInvalid');return v;}
/** @param {any} v @param {number} [min] @param {number} [max] @returns {number} */
function num(v,min=0,max=MAX_NUMBER){if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max)throw Error('saveImportInvalid');return v;}
/** @param {any} v @param {number} [min] @param {number} [max] @returns {number} */
function integer(v,min=0,max=MAX_NUMBER){if(!Number.isSafeInteger(num(v,min,max)))throw Error('saveImportInvalid');return v;}
/** @param {any} v @param {number} [max] @returns {string} */
function text(v,max=100){if(typeof v!=='string'||v.length>max)throw Error('saveImportInvalid');return v;}
/** @param {any} v @returns {boolean} */
function flag(v){if(typeof v!=='boolean')throw Error('saveImportInvalid');return v;}
/** @param {any} v @param {number} [max] @returns {any[]} */
function list(v,max=MAX_ITEMS){if(!Array.isArray(v)||Object.getPrototypeOf(v)!==Array.prototype||v.length>max||Reflect.ownKeys(v).length!==v.length+1||Object.values(Object.getOwnPropertyDescriptors(v)).some(d=>!Object.hasOwn(d,'value')))throw Error('saveImportInvalid');return v;}
/** @param {any} v @param {number} [max] @returns {string[]} */
function strings(v,max=200){list(v,max);for(const s of v)text(s,160);if(new Set(v).size!==v.length)throw Error('saveImportInvalid');return v;}
const salesTypes=new Set(['produce_sale','order_revenue','animal_sale','sale_revenue','egg_sale','goat_sale','cow_milk_sale','fish.sale']);

/** Eligible coins in the shared balance. Older saves can recover sales still in their ledger. @param {CozyState} state */
export function houseSalesCoins(state){
 if(state.house)return state.house.salesCoins;
 let salesCoins=0;
 for(const entry of state.ledger){
  if(salesTypes.has(entry.type))salesCoins+=Math.max(0,entry.amount);
  salesCoins=Math.min(salesCoins,entry.balance);
 }
 return Math.min(salesCoins,state.coins);
}

/** @param {CozyState} s @param {string} type @param {number} amount */
function trans(s,type,amount){
 const housing=type==='build_house'||type==='house_upgrade';
 const availableCredit=housing?0:Math.floor(s.progression.credit3000/3000);
 if(!Number.isSafeInteger(amount)||s.coins+amount>MAX_NUMBER)throw Error('noCoins');
 const house=s.house??(s.house={level:0,salesCoins:houseSalesCoins(s)});
 if(housing&&house.salesCoins< -amount)throw Error('houseSalesRequired');
 if(s.coins+amount+availableCredit<0)throw Error('noCoins');
 if(!housing&&amount<0&&s.progression.credit3000>0){
  const demand=-amount*3000,used=Math.min(s.progression.credit3000,demand),remaining=demand-used,charge=Math.ceil(remaining/3000);
  s.progression.credit3000-=used;
  s.progression.credit3000+=charge*3000-remaining;
  amount=-charge;
 }
 s.coins+=amount;
 if(housing)house.salesCoins+=amount;
 else if(salesTypes.has(type))house.salesCoins+=Math.max(0,amount);
 else house.salesCoins=Math.min(house.salesCoins,s.coins);
 s.ledger.push({id:'cozy.'+(s.revision+1)+'.'+s.ledger.length,tick:s.tick,type,amount,balance:s.coins});
 if(s.ledger.length>5000)s.ledger.shift();
 if(amount>0)s.stats.income+=amount;else s.stats.expense-=amount;
 return house;
}
/** @param {CozyState} s @param {string} type @param {number} value3000 */
function receiveValue(s,type,value3000){const remainder=value3000%3000,carry=Math.floor((s.progression.credit3000%3000+remainder)/3000);s.progression.credit3000+=remainder-carry*3000;trans(s,type,Math.floor(value3000/3000)+carry);}
/** @param {CozyState} s @param {number} n */
function xp(s,n){s.progression.xp+=n;s.progression.level=1+Math.floor(s.progression.xp/100);}
/** @param {CozyState} s @param {string} type @param {number} quantity @param {number} [quality] @param {string} [sourceId] @param {number} [value3000] */
function inventoryLot(s,type,quantity,quality=1,sourceId='',value3000=Math.floor(quantity*COZY_GOODS[type].price*quality*3000/COZY_GOODS[type].scale)){if(quantity<=0)return;s.inventory.push({id:'cozy.lot.'+s.nextLot++,type,quantity,quality:clamp(quality,0,1),sourceId,value3000});}
/** @param {string} id @param {string} kind @returns {Facility} */
function makeFacility(id,kind){return {id,kind,level:0,feedStockG:0,feedG:0,waterStockMl:0,waterMl:kind==='pond'?4000000:0,cleanliness:90,auto:false,shade:false,enabled:true,pending:0,productionHours:0,animals:[],forageG:0,foragePlots:0,pendingLots:[]};}
/** @param {string} id @param {string} species @param {{growth?:number,condition?:number,ready?:number,count?:number,massG?:number,lactating?:boolean}} [options] @returns {Animal} */
function animal(id,species,{growth=1,condition=1,ready=0,count=1,massG=0,lactating=true}={}){return {id,species,growth,condition,ready,count,massG,lactating};}
/** @param {Facility} f */
export function facilityCapacity(f){const base=STOCK[f.kind];return {animals:base?base.capacity+f.level*(f.kind==='pond'?20:f.kind==='barn'?1:2):0,feedG:base?base.feed*(1+f.level):0,waterMl:f.kind==='barn'?150000*(1+f.level):f.kind==='goatShelter'?30000*(1+f.level):f.kind==='coop'?12000*(1+f.level):600000,autoAvailable:f.level>=1};}
/** @param {CozyState} s @param {string} kind */
export function buildPrice(s,kind){const def=COZY_BUILD_CATALOG[kind];if(!def)return Infinity;return def.starter&&!s.progression.startedKinds.includes(kind)?0:def.price;}
/** @param {CozyState} s @param {string} id */
export function quoteLot(s,id){const l=s.inventory.find(l=>l.id===id);return l?{revision:s.revision,price:l.quality<=0?0:Math.floor((l.value3000+s.progression.credit3000%3000)/3000)}:null;}
/** @param {CozyState} s @param {string} facility @param {string} id */
export function quoteAnimal(s,facility,id){const f=s.facilities.find(f=>f.id===facility),a=f?.animals.find(a=>a.id===id);return a&&a.species==='goat'?{revision:s.revision,price:Math.round((35+85*a.growth)*(.7+.3*a.condition))}:null;}
/** @param {CozyState} s */
export function availableOrders(s){return s.orders.filter(o=>!o.completed);}
/** @returns {Order[]} */
function defaultOrders(){return [{id:'cozy.vegetables',needs:{lettuce:3},bonus:15,completed:false},{id:'cozy.breakfast',needs:{egg:6,milk:4000},bonus:40,completed:false},{id:'cozy.kitchen',needs:{tomato:5,corn:4,fish:2000},bonus:60,completed:false},{id:'cozy.harvest',needs:{lettuce:12,tomato:10,corn:8},bonus:100,completed:false},{id:'cozy.fish-market',needs:{fish:5000},bonus:70,completed:false},{id:'cozy.dairy',needs:{milk:12000},bonus:65,completed:false}];}
/** @returns {CozyState} */
export function createCozyState(){
 const n=createState();
 /** @type {CozyState} */
 const s={format:'MyFarmTwinCozy',version:COZY_VERSION,revision:0,tick:COZY_MORNING_HOUR,seed:n.seed,rng:n.rng,weather:'sunny',coins:n.coins,water:n.water,careCredits:n.careCredits,seeds:clone(n.seeds),plots:clone(n.plots),inventory:[],ledger:[],stats:{planted:0,watered:0,harvested:0,sold:0,orders:0,income:0,expense:0},progression:{xp:0,level:1,achievements:[],completedOrders:[],startedKinds:[],credit3000:0,debtCoins:0},orders:defaultOrders(),land:{level:0},layout:{items:[],nextId:1},facilities:[],nextLot:1,provenance:{native:null,layout:null}};
 for(let i=0;i<24;i++)s.layout.items.push({id:'bed.'+i,kind:'bed',x:-15+(i%6)*2,z:-7.5+Math.floor(i/6)*2.4,rotation:0});
 s.layout.items.push({id:'market',kind:'market',x:-4,z:14,rotation:0});s.facilities.push(makeFacility('market','market'));return s;
}
/** @param {Record<string,number>|undefined} v */
function sumSupply(v){return Object.values(v||{}).reduce((n,v)=>n+(typeof v==='number'?v:0),0);}
/** Lossless source bytes travel with the new economy; every live holding is also mapped below. */
/** @param {string|null} nativeRaw @param {string|null} [layoutRaw] @returns {CozyState} */
export function migrateLegacy(nativeRaw,layoutRaw=null){
 const native=nativeRaw===null?createState():activateGarden(deserialize(nativeRaw)),s=createCozyState();if(nativeRaw===null)native.tick=COZY_MORNING_HOUR;s.provenance={native:nativeRaw,layout:layoutRaw};
 Object.assign(s,{revision:native.revision,tick:native.tick,seed:native.seed,rng:native.rng,weather:native.weather,coins:native.coins,water:native.water,careCredits:native.careCredits,seeds:clone(native.seeds),plots:clone(native.plots),ledger:clone(native.ledger).slice(-5000)});
 for(const k of /** @type {const} */(['planted','watered','harvested','sold','orders']))s.stats[k]=native.stats[k]||0;
 s.stats.income=native.ledger.reduce((n,e)=>n+Math.max(0,e.amount),0);s.stats.expense=native.ledger.reduce((n,e)=>n+Math.max(0,-e.amount),0);s.progression.xp=(native.stats.harvested+native.stats.sold)*2+native.stats.orders*20;s.progression.level=1+Math.floor(s.progression.xp/100);s.progression.completedOrders=clone(native.completedOrders);s.progression.achievements=['legacy.garden.mission.'+native.mission.step,...Object.entries(native.followups).filter(([,v])=>v).map(([k])=>k).map(k=>'legacy.garden.'+k)];
 /** @type {import('./glb-prototype-state.js').PrototypeLayout|null} */ let oldLayout=null;if(layoutRaw!==null)oldLayout=validatePrototypeLayout(JSON.parse(layoutRaw));
 if(oldLayout){for(const p of oldLayout.items){if(p.kind==='barn'&&!native.cow?.visited||p.kind==='pump'&&!native.pump.built)continue;const old=s.layout.items.findIndex(i=>i.id===p.id);if(old>=0)s.layout.items[old]=clone(p);else s.layout.items.push(clone(p));}s.layout.nextId=Math.max(s.layout.nextId,oldLayout.nextId);}
 /** @param {string} id @param {string} kind @param {{x:number,z:number,rotation:number}} [preferred] @returns {Facility} */
 const owned=(id,kind,preferred)=>{let p=s.layout.items.find(p=>p.id===id);if(!p){const found=findPlacement(s,kind,id,preferred);if(!found)throw Error('migrationLayoutFull');p=found;s.layout.items.push(p);}const f=makeFacility(id,kind);s.facilities.push(f);if(!s.progression.startedKinds.includes(kind)&&STOCK[kind])s.progression.startedKinds.push(kind);return f;};
 for(const lot of native.inventory)inventoryLot(s,lot.type,lot.quantity,lot.quality,'legacy.crop.'+lot.id,Math.max(1,Math.round(lot.quantity*LEGACY_CROPS[lot.type].price*lot.quality))*3000);
 if(native.pump.built){const f=owned('pump','pump',{x:-3,z:3.5,rotation:0});f.enabled=native.pump.on;f.level=native.pump.efficient?1:0;}
 const h=native.chicken;if(h?.visited&&h.coop){const f=owned('coop','coop');f.level=Math.max(h.coop.level,h.coop.autoFeeder?1:0);f.feedStockG=h.feedStoreG;f.feedG=h.coop.feedG;f.waterMl=h.coop.waterL*1000;f.cleanliness=h.coop.cleanliness;f.auto=h.coop.autoFeeder&&h.coop.autoOn;f.shade=h.coop.shade;f.pending=h.coop.pending.length;f.pendingLots=h.coop.pending.map(e=>({quantity:1,quality:e.grade==='A'?1:e.grade==='B'?.85:.65,sourceId:e.id,value3000:EGG_PRICES[e.grade]*3000}));f.productionHours=h.coop.healthyHours%8;f.animals=h.hens.map(a=>animal(a.id,'chicken'));for(const l of h.inventory)inventoryLot(s,'egg',l.quantity,l.grade==='A'?1:l.grade==='B'?.85:.65,l.id,l.quantity*EGG_PRICES[l.grade]*3000);s.progression.achievements.push('legacy.chicken.mission.'+h.mission.step,...h.grants.map(g=>'legacy.'+g));}
 const g=native.goat;if(g?.visited&&g.shelter){const f=owned('goatShelter','goatShelter');f.level=Math.max(g.shelter.level,g.shelter.careUpgrade?1:0);f.auto=g.shelter.careUpgrade;f.feedStockG=g.hayStockG;f.forageG=g.paddocks.reduce((n,p)=>n+p.biomassG,0);f.foragePlots=g.paddocks.length;f.feedG=g.feederG;f.waterMl=g.troughMl;f.cleanliness=g.shelter.cleanliness;f.animals=g.herd.map(a=>animal(a.id,'goat',{growth:a.growth,condition:a.condition}));s.progression.achievements.push('legacy.goat.mission.'+g.mission.step,...g.grants.map(k=>'legacy.'+k));}
 const c=native.cow;if(c?.visited&&c.barn){const f=owned('barn','barn',{x:7,z:-4,rotation:0});f.level=c.barn.expanded||c.barn.troughUpgrade||c.barn.sanitation?1:0;f.auto=c.barn.troughUpgrade;f.shade=c.barn.shade;f.feedStockG=c.feedStoreG+c.starterRation.feedG+c.recoveryRation.feedG;f.feedG=sumSupply(c.feedTrough);f.waterStockMl=c.starterRation.waterMl+c.recoveryRation.waterMl;f.waterMl=sumSupply(c.waterTrough);f.cleanliness=c.barn.cleanliness;f.animals=c.cows.map(a=>animal(a.id,'cow',{condition:(a.nutrition+a.hydration+a.comfort)/3000,ready:a.milkReadyMl,lactating:a.lactationStatus==='lactating'}));for(const l of c.lots){const grade=cowEffectiveGrade(l);inventoryLot(s,'milk',l.remainingVolumeMl,grade==='A'?1:grade==='B'?.85:grade==='C'?.65:0,l.id,grade?l.remainingVolumeMl*COW_PRICES[grade]*3:0);}s.progression.achievements.push('legacy.cow.mission.'+c.mission.step,...c.grants.map(k=>'legacy.'+k));for(const id of c.orders.completedIds)if(!s.progression.completedOrders.includes(id))s.progression.completedOrders.push(id);if(c.cooler.owned)s.progression.achievements.push('legacy.cow.cooler');if(c.barn.sanitation)s.progression.achievements.push('legacy.cow.sanitation');}
 const q=native.fish;if(q?.visited){for(let i=0;i<q.ponds.length;i++){const p=q.ponds[i],f=owned(i===0?'pond':'pond.legacy.'+p.id,'pond');f.level=Math.max(Number(p.efficient)+Number(p.biofilter),p.autoFeeder?1:0);f.auto=p.autoFeeder;f.enabled=p.aeratorOn;f.feedStockG=i===0?sumSupply(q.feed):0;f.feedG=p.pendingFeedG;f.waterStockMl=i===0?sumSupply(q.water)*1000:0;f.waterMl=p.volumeL*1000;f.cleanliness=clamp(1-p.tanMg/Math.max(1,p.volumeL*20),.35,1)*100;f.animals=p.cohorts.map(a=>animal(a.id,'fish',{growth:clamp(a.massG/500),condition:a.condition/1000,count:a.count,massG:a.massG}));}for(const l of q.lots)inventoryLot(s,'fish',l.massG,l.grade==='A'?1:l.grade==='B'?.85:.65,l.id,Math.floor(l.massG*FISH_PRICES[l.grade]/1000)*3000);s.progression.achievements.push('legacy.fish.mission.'+q.mission.step,...q.mission.completed.map(k=>'legacy.fish.'+k));for(const id of q.contracts)if(!s.progression.completedOrders.includes(id))s.progression.completedOrders.push(id);}
 if(c?.visited){s.progression.credit3000+=c.milkRevenueRemainder*3+c.cooler.paidTicks*500;const active=COW_ORDERS.find(o=>o.id===c.orders.acceptedId);if(active&&!c.orders.completedIds.includes(active.id))s.orders.push({id:active.id,needs:{milk:active.volumeMl},bonus:active.bonus,completed:false});}
 if(q?.visited)s.progression.debtCoins=q.recovery.advanceCoins+fishSupportAccount(native).debtCoins;
 if(q?.visited)for(const p of q.ponds)s.progression.credit3000+=p.airPaidTicks*(p.efficient?250:500)+p.filterPaidTicks*125;
 s.progression.achievements=[...new Set(s.progression.achievements)];
 // The public market is a new shared facility. Place it around the player's preserved P2 layout.
 const market=s.layout.items.find(p=>p.id==='market');if(market&&placementIssue(s,market)){s.layout.items=s.layout.items.filter((/** @type {Placement} */p)=>p.id!=='market');const p=findPlacement(s,'market','market');if(!p)throw Error('migrationLayoutFull');s.layout.items.push(p);}
 validateCozyState(s);return s;
}
/** @param {CozyState} s @param {Facility} f */
function attachStarter(s,f){const species=ANIMAL_KINDS[f.kind];s.progression.startedKinds.push(f.kind);if(f.kind==='barn'){f.animals=[animal(f.id+'.cow.1',species,{ready:4000}),animal(f.id+'.cow.2',species)];f.feedStockG=32000;f.waterStockMl=180000;}if(f.kind==='coop'){f.animals=[1,2,3].map(i=>animal(f.id+'.hen.'+i,species));f.feedStockG=2000;f.waterStockMl=12000;}if(f.kind==='goatShelter'){f.animals=[animal(f.id+'.goat.1',species),animal(f.id+'.goat.2',species,{growth:0}),animal(f.id+'.goat.3',species,{growth:0})];f.feedStockG=6000;f.forageG=6000;f.foragePlots=1;f.waterStockMl=30000;}if(f.kind==='pond'){f.animals=[animal(f.id+'.fish.1',species,{count:4,massG:500}),animal(f.id+'.fish.2',species,{count:8,massG:30,growth:.06})];f.feedStockG=2000;f.waterMl=4000000;f.waterStockMl=200000;f.enabled=true;}}
/** @param {CozyState} s @param {string} kind @param {{x:number,z:number,rotation:number}} transform */
function build(s,kind,transform){
 const d=COZY_BUILD_CATALOG[kind];
 if(!d||!transform)throw Error('layoutInvalid');
 if(s.layout.items.filter(p=>p.kind===kind).length>=d.limit)throw Error('farmFull');
 const facility=COZY_FACILITY_KINDS.includes(kind),house=kind===HOUSE_KIND;
 const fixedId=(facility||house)&&!s.layout.items.some(p=>p.id===kind);
 const id=kind==='bed'?'bed.'+s.plots.length:fixedId?kind:kind+'.'+s.layout.nextId++;
 const p={id,kind,x:transform.x,z:transform.z,rotation:normalizeRotation(transform.rotation||0)};
 const error=placementIssue(s,p);
 if(error)throw Error(error);
 const price=buildPrice(s,kind);
 if(price){
  const progress=trans(s,'build_'+kind,-price);
  if(house)progress.level=1;
 }
 s.layout.items.push(p);
 if(kind==='bed'){
  const base=clone(s.plots[0]);
  Object.assign(base,{id:s.plots.length,crop:null,soilWaterMm:20,waterAppliedMm:0,careCost:0,lastWaterTick:-1,history:[]});
  s.plots.push(base);
 }
 if(facility){
  const f=makeFacility(id,kind);
  s.facilities.push(f);
  if(d.starter&&!s.progression.startedKinds.includes(kind))attachStarter(s,f);
 }
 xp(s,5);
 return id;
}
/** @param {CozyState} s @param {any} args @returns {Facility} */
function needFacility(s,args){const f=s.facilities.find(f=>f.id===args.facility);if(!f||!STOCK[f.kind])throw Error('facilityMissing');return f;}
/** @param {Facility} f */
function fillFeed(f){const amount=Math.min(f.feedStockG,Math.max(0,facilityCapacity(f).feedG-f.feedG));if(amount<=0)throw Error(f.feedStockG<=0?'noFeed':'feedFull');f.feedStockG-=amount;f.feedG+=amount;}
/** @param {CozyState} s @param {Facility} f */
function fillWater(s,f){if(f.kind==='pond'){const desired=200000,fromStock=Math.min(f.waterStockMl,desired),fromShared=Math.min(Math.floor(s.water*1000),desired-fromStock);if(fromStock+fromShared<=0)throw Error('noWater');f.waterStockMl-=fromStock;s.water-=fromShared/1000;f.cleanliness=Math.min(100,f.cleanliness+20*(fromStock+fromShared)/desired);return;}const desired=Math.max(0,facilityCapacity(f).waterMl-f.waterMl);if(desired<=0)throw Error('waterFull');const fromStock=Math.min(f.waterStockMl,desired);const fromShared=Math.min(Math.floor(s.water*1000),desired-fromStock);if(fromStock+fromShared<=0)throw Error('noWater');f.waterStockMl-=fromStock;s.water-=fromShared/1000;f.waterMl+=fromStock+fromShared;}
/** @param {CozyState} s @param {import("./engine.js").Plot} p */
function waterPlot(s,p){if(p.soilWaterMm>=45)throw Error('alreadyWet');const amount=Math.min(30,50-p.soilWaterMm);if(s.water<amount)throw Error('noWater');s.water-=amount;p.soilWaterMm+=amount;p.waterAppliedMm+=amount;p.lastWaterTick=s.tick;s.stats.watered++;}
/** @param {CozyState} s @param {import("./engine.js").Plot} p */
function harvestPlot(s,p){if(!p.crop||p.crop.progress<1)throw Error('notReady');const c=p.crop,y=Math.max(1,Math.floor(COZY_CROPS[c.type].yield*c.quality));inventoryLot(s,c.type,y,c.quality,'bed.'+p.id);p.crop=null;s.stats.harvested+=y;xp(s,5);}
/** @param {CozyState} s */
function hour(s){
 for(const p of s.plots){const crop=p.crop;if(s.weather==='rainy')p.soilWaterMm=Math.min(50,p.soilWaterMm+1.5);p.soilWaterMm=Math.max(0,p.soilWaterMm-(crop?.6:.15));if(crop){const factor=p.soilWaterMm>=8?1:.25;crop.progress=Math.min(1,crop.progress+factor/COZY_CROPS[crop.type].hours);crop.stage=Math.min(COZY_CROPS[crop.type].stages-1,Math.floor(crop.progress*(COZY_CROPS[crop.type].stages-1)+1e-8));crop.quality=clamp(crop.quality+(factor===1?.001:-.001),.6,1);}}
 const pump=s.facilities.find(f=>f.kind==='pump'&&f.enabled);if(pump){for(const p of s.plots){if(p.soilWaterMm<20&&s.water>=1){p.soilWaterMm++;s.water--;}}}
 for(const f of s.facilities){const cfg=STOCK[f.kind];if(!cfg)continue;if(!f.animals.length){f.forageG=Math.min(9000*f.foragePlots,f.forageG+25*f.foragePlots);continue;}if(f.auto&&f.level>=1){if(f.feedG<cfg.feed*.2&&f.feedStockG>0)fillFeed(f);if(f.kind!=='pond'&&f.waterMl<facilityCapacity(f).waterMl*.2&&(f.waterStockMl>0||Math.floor(s.water*1000)>0))fillWater(s,f);}
 const count=f.animals.reduce((n,a)=>n+a.count,0),totalFeedNeed=cfg.demand*count,browse=Math.min(f.forageG,totalFeedNeed),feedNeed=totalFeedNeed-browse,waterNeed=cfg.water*count,feed=Math.min(f.feedG,feedNeed),water=Math.min(f.waterMl,waterNeed);f.forageG=Math.min(9000*f.foragePlots,f.forageG-browse+25*f.foragePlots);f.feedG-=feed;f.waterMl-=water;f.cleanliness=Math.max(35,f.cleanliness-(f.kind==='pond'?.15:.2)*count);const fed=feedNeed===0||feed>=feedNeed,watered=waterNeed===0||water>=waterNeed,healthy=fed&&watered&&f.cleanliness>=45;
 for(const a of f.animals){a.condition=clamp(a.condition+(healthy?.006:-.003),.5,1);const factor=(healthy?1:.2)*(.7+.3*a.condition);if(a.species==='cow'&&a.lactating)a.ready=Math.min(12000,a.ready+Math.floor(500*factor));if(a.species==='goat')a.growth=Math.min(1,a.growth+factor/48);if(a.species==='fish'){const air=f.enabled?1:.4;if(a.massG<500)a.massG=Math.min(500,a.massG+Math.max(1,Math.floor(10*factor*air)));a.growth=Math.max(a.growth,Math.min(1,a.massG/500));}}
 if(f.kind==='coop'){f.productionHours+=healthy?1:.2;while(f.productionHours>=8){f.productionHours-=8;f.pending+=count;}}}
 s.tick++;if(s.tick%24===0){s.rng=(Math.imul(1664525,s.rng)+1013904223)>>>0;s.weather=['sunny','cloudy','rainy','hot'][(s.rng>>>16)%4];}
}
/** @type {Record<string,string[]>} */
const COMMAND_FIELDS={advance:['hours'],plant:['plot','crop'],water:['plot'],waterAll:[],harvest:['plot'],harvestAll:[],buySeed:['crop','quantity'],refill:['litres'],recovery:[],start:['kind'],build:['kind','transform'],move:['id','transform'],feed:['facility'],waterFacility:['facility'],clean:['facility'],buyFeed:['facility'],collect:['facility'],buyAnimal:['facility'],sellAnimal:['facility','animal','quote'],upgrade:['facility'],upgradeHouse:['level'],toggleAuto:['facility'],togglePump:['facility'],toggleAerator:['facility'],sell:['lot','quote'],discard:['lot'],sellAll:[],order:['order'],refreshOrders:[],repayDebt:[],expand:[]};
/** Every rejected operation returns the exact original state, with no side effects. */
/** @param {CozyState} input @param {Record<string,any>} command @returns {DispatchResult} */
export function dispatchCozy(input,command){
 if(!plain(command)||typeof command.type!=='string'||command.revision!==undefined&&command.revision!==input.revision)return fail(input,'staleCommand');
 const fields=COMMAND_FIELDS[command.type];if(!fields)return fail(input,'unknownCommand');if(Object.keys(command).some(k=>!['type','revision',...fields].includes(k)))return fail(input,'invalidCommand');if(command.transform&&(!plain(command.transform)||Object.keys(command.transform).some(k=>!['x','z','rotation'].includes(k))||!['x','z','rotation'].every(k=>typeof command.transform[k]==='number'&&Number.isFinite(command.transform[k]))))return fail(input,'layoutInvalid');if(command.quote&&(!plain(command.quote)||Object.keys(command.quote).length!==2||!Number.isSafeInteger(command.quote.revision)||!Number.isSafeInteger(command.quote.price)))return fail(input,'quoteExpired');
 const s=clone(input),events=[];try{let id;switch(command.type){
 case 'advance':{integer(command.hours,1,168);for(let i=0;i<command.hours;i++)hour(s);events.push({type:'timeAdvanced',amount:command.hours});break;}
 case 'plant':{const p=s.plots.find(p=>p.id===command.plot),crop=command.crop;if(!p)throw Error('invalidPlot');if(p.crop)throw Error('occupied');if(!CROP_IDS.includes(crop))throw Error('invalidCrop');if(s.seeds[crop]<=0)throw Error('noSeeds');s.seeds[crop]--;p.crop={type:crop,progress:0,quality:1,stage:0,plantedTick:s.tick};s.stats.planted++;break;}
 case 'water':{const p=s.plots.find(p=>p.id===command.plot);if(!p)throw Error('invalidPlot');waterPlot(s,p);break;}
 case 'waterAll':{let n=0;for(const p of s.plots)if(p.crop&&p.soilWaterMm<35&&s.water>=Math.min(30,50-p.soilWaterMm)){waterPlot(s,p);n++;}if(!n)throw Error('noWaterNeeded');break;}
 case 'harvest':{const p=s.plots.find(p=>p.id===command.plot);if(!p)throw Error('invalidPlot');harvestPlot(s,p);break;}
 case 'harvestAll':{const ready=s.plots.filter(p=>p.crop!==null&&p.crop.progress>=1);if(!ready.length)throw Error('notReady');for(const p of ready)harvestPlot(s,p);break;}
 case 'buySeed':{const c=command.crop,n=command.quantity??1;if(!CROP_IDS.includes(c))throw Error('invalidCrop');integer(n,1,99);if(s.seeds[c]+n>9999)throw Error('seedCapacity');trans(s,'seed_purchase',-COZY_CROPS[c].seedPrice*n);s.seeds[c]+=n;break;}
 case 'refill':{const litres=command.litres??120;integer(litres,1,1000);if(s.water+litres>10000)throw Error('waterFull');trans(s,'water_purchase',-Math.ceil(litres/20));s.water+=litres;break;}
 case 'recovery':{if(s.coins>=4||CROP_IDS.some(c=>s.seeds[c]>0)||s.inventory.length||s.plots.some(p=>p.crop))throw Error('recoveryUnavailable');s.seeds.lettuce=1;s.water=Math.max(60,s.water);break;}
 case 'start':{const kind=command.kind;if(!STOCK[kind])throw Error('layoutInvalid');if(s.progression.startedKinds.includes(kind))throw Error('starterUsed');const p=findPlacement(s,kind,kind);if(!p)throw Error('layoutOccupied');id=build(s,kind,p);break;}
 case 'build':{id=build(s,command.kind,command.transform);break;}
 case 'move':{const p=s.layout.items.find(p=>p.id===command.id);if(!p)throw Error('facilityMissing');const candidate={...p,x:command.transform.x,z:command.transform.z,rotation:normalizeRotation(command.transform.rotation||0)},error=placementIssue(s,candidate);if(error)throw Error(error);Object.assign(p,candidate);id=p.id;break;}
 case 'feed':{fillFeed(needFacility(s,command));break;}
 case 'waterFacility':{fillWater(s,needFacility(s,command));break;}
 case 'clean':{const f=needFacility(s,command);if(f.cleanliness>=99)throw Error('alreadyClean');f.cleanliness=100;break;}
 case 'buyFeed':{const f=needFacility(s,command),p=STOCK[f.kind];if(f.feedStockG+p.feed>1e9)throw Error('feedFull');trans(s,'feed_purchase',-p.price);f.feedStockG+=p.feed;break;}
 case 'collect':{const f=needFacility(s,command);if(f.kind==='coop'){if(f.pending<1)throw Error('notReady');let legacy=0;for(const lot of f.pendingLots){inventoryLot(s,'egg',lot.quantity,lot.quality,lot.sourceId,lot.value3000);legacy+=lot.quantity;}inventoryLot(s,'egg',f.pending-legacy,f.cleanliness>=65?1:.85,f.id);s.stats.harvested+=f.pending;f.pending=0;f.pendingLots=[];}else if(f.kind==='barn'){let qty=0;for(const a of f.animals){qty+=a.ready;a.ready=0;}if(qty<1)throw Error('notReady');inventoryLot(s,'milk',qty,f.cleanliness>=65?1:.85,f.id);s.stats.harvested+=qty/1000;}else if(f.kind==='pond'){const ready=f.animals.filter(a=>a.massG>=500);if(!ready.length)throw Error('notReady');const mass=ready.reduce((n,a)=>n+a.massG*a.count,0);inventoryLot(s,'fish',mass,ready.reduce((n,a)=>n+a.condition,0)/ready.length,f.id);f.animals=f.animals.filter(a=>a.massG<500);s.stats.harvested+=mass/1000;}else throw Error('sellGoatInstead');xp(s,8);break;}
 case 'buyAnimal':{const f=needFacility(s,command),cap=facilityCapacity(f),count=f.animals.reduce((n,a)=>n+a.count,0),n=f.kind==='pond'?8:1;if(count+n>cap.animals)throw Error('animalCapacity');const price=COZY_COSTS.animal[/** @type {keyof typeof COZY_COSTS.animal} */(f.kind)];trans(s,'animal_purchase',-price);f.animals.push(animal('cozy.animal.'+s.nextLot++,ANIMAL_KINDS[f.kind],{count:n,growth:f.kind==='goatShelter'?0:f.kind==='pond'?.06:1,massG:f.kind==='pond'?30:0}));break;}
 case 'sellAnimal':{const f=needFacility(s,command),a=f.animals.find(a=>a.id===command.animal),quote=quoteAnimal(s,f.id,command.animal);if(!a||!quote)throw Error('animalMissing');if(command.quote&&(command.quote.revision!==s.revision||command.quote.price!==quote.price))throw Error('quoteExpired');trans(s,'animal_sale',quote.price);f.animals=f.animals.filter(v=>v.id!==a.id);s.stats.sold++;xp(s,10);break;}
 case 'upgrade':{const f=s.facilities.find(f=>f.id===command.facility);if(!f)throw Error('facilityMissing');if(f.level>=3)throw Error('upgradeMax');const price=50*(f.level+1);trans(s,'facility_upgrade',-price);f.level++;f.shade=true;xp(s,15);break;}
 case 'upgradeHouse':{
  const house=s.house,home=s.layout.items.find(p=>p.kind===HOUSE_KIND);
  if(!house?.level||!home)throw Error('houseNotBuilt');
  const next=HOUSE_LEVELS[house.level];
  if(!next)throw Error('houseMax');
  if(command.level!==house.level)throw Error('houseLevelChanged');
  trans(s,'house_upgrade',-next.price);
  house.level++;
  id=home.id;
  xp(s,15);
  break;
 }
 case 'toggleAuto':{const f=needFacility(s,command);if(f.level<1)throw Error('upgradeFirst');f.auto=!f.auto;break;}
 case 'togglePump':{const f=s.facilities.find(f=>f.id===command.facility&&f.kind==='pump');if(!f)throw Error('facilityMissing');f.enabled=!f.enabled;break;}
 case 'toggleAerator':{const f=needFacility(s,command);if(f.kind!=='pond')throw Error('facilityMissing');f.enabled=!f.enabled;break;}
 case 'sell':{const l=s.inventory.find(l=>l.id===command.lot),q=quoteLot(s,command.lot);if(!l||!q)throw Error('noProduce');if(l.value3000<=0)throw Error('spoiledProduce');if(command.quote&&(command.quote.revision!==s.revision||command.quote.price!==q.price))throw Error('quoteExpired');receiveValue(s,'produce_sale',l.value3000);s.inventory=s.inventory.filter(v=>v.id!==l.id);s.stats.sold+=l.quantity/COZY_GOODS[l.type].scale;xp(s,4);break;}
 case 'discard':{if(!s.inventory.some(l=>l.id===command.lot))throw Error('noProduce');s.inventory=s.inventory.filter(l=>l.id!==command.lot);break;}
 case 'sellAll':{const ready=s.inventory.filter(l=>l.quality>0);if(!ready.length)throw Error('noProduce');let value=0;for(const l of ready){value+=l.value3000;s.stats.sold+=l.quantity/COZY_GOODS[l.type].scale;}receiveValue(s,'produce_sale',value);s.inventory=s.inventory.filter(l=>l.quality<=0);xp(s,8);break;}
 case 'order':{const o=s.orders.find(o=>o.id===command.order);if(!o)throw Error('invalidOrder');if(o.completed)throw Error('orderDone');for(const [type,n]of Object.entries(o.needs))if(s.inventory.filter(l=>l.type===type&&l.quality>0).reduce((n,l)=>n+l.quantity,0)<n)throw Error('orderMissing');let value=o.bonus*3000;for(const [type,n]of Object.entries(o.needs)){let left=n;for(const l of s.inventory.filter(l=>l.type===type&&l.quality>0)){const take=Math.min(left,l.quantity);const part=take===l.quantity?l.value3000:Math.floor(l.value3000*take/l.quantity);value+=part;l.value3000-=part;l.quantity-=take;left-=take;s.stats.sold+=take/COZY_GOODS[type].scale;}}s.inventory=s.inventory.filter(l=>l.quantity>0);receiveValue(s,'order_revenue',value);o.completed=true;s.progression.completedOrders.push(o.id);s.stats.orders++;xp(s,30);break;}
 case 'repayDebt':{if(s.progression.debtCoins<=0)throw Error('noDebt');const amount=Math.min(s.coins,s.progression.debtCoins);if(amount<=0)throw Error('noCoins');trans(s,'legacy_advance_repayment',-amount);s.progression.debtCoins-=amount;break;}
 case 'refreshOrders':{if(s.orders.some(o=>!o.completed))throw Error('ordersRemaining');s.orders=defaultOrders().map(o=>({...o,id:o.id+'.'+s.revision}));break;}
 case 'expand':{if(s.land.level>=COZY_LAND_BOUNDS.length-1)throw Error('farmFull');trans(s,'land_expansion',-(s.land.level+1)*180);s.land.level++;xp(s,25);break;}
 default:throw Error('unknownCommand');}
 s.revision++;events.push({type:command.type,...(id?{id}:{})});validateCozyState(s);return {state:s,ok:true,error:'',events,...(id?{id}:{})};
 }catch(error){return fail(input,error instanceof Error?error.message:'invalidCommand');}
}
/** Strict bounded JSON boundary, including identity, holdings and placement referential integrity. */
/** @param {any} v @returns {CozyState} */
export function validateCozyState(v){
 if(plain(v)&&v.format==='MyFarmTwinCozy'&&typeof v.version==='number'&&v.version>COZY_VERSION)throw Error('saveNewer');
 const keys=['format','version','revision','tick','seed','rng','weather','coins','water','careCredits','seeds','plots','inventory','ledger','stats','progression','orders','land','layout','facilities','nextLot','provenance'];
 if(plain(v)&&Object.hasOwn(v,'house'))keys.push('house');
 const s=object(v,keys);if(s.format!=='MyFarmTwinCozy')throw Error('saveImportInvalid');if(s.version!==COZY_VERSION)throw Error(s.version>COZY_VERSION?'saveNewer':'saveImportInvalid');for(const k of ['revision','tick','seed','rng','coins','careCredits','nextLot'])integer(s[k]);if(s.nextLot<1)throw Error('saveImportInvalid');num(s.water);if(!['sunny','cloudy','rainy','hot'].includes(s.weather))throw Error('saveImportInvalid');object(s.seeds,CROP_IDS);for(const n of Object.values(s.seeds))integer(n);
 if(Object.hasOwn(s,'house')){
  object(s.house,['level','salesCoins']);
  integer(s.house.level,0,HOUSE_LEVELS.length);
  integer(s.house.salesCoins,0,s.coins);
 }
 list(s.plots,64);if(s.plots.length<24)throw Error('saveImportInvalid');const plotIds=new Set();for(const p of s.plots){object(p,['id','x','y','soilWaterMm','soilCapacityMm','crop','waterAppliedMm','careCost','lastWaterTick','history']);integer(p.id,0,63);if(plotIds.has(p.id))throw Error('saveImportInvalid');plotIds.add(p.id);for(const k of ['x','y'])num(p[k],-1000,1000);for(const k of ['soilWaterMm','soilCapacityMm','waterAppliedMm','careCost'])num(p[k]);if(p.soilWaterMm>p.soilCapacityMm||p.soilCapacityMm<=0)throw Error('saveImportInvalid');integer(p.lastWaterTick,-1,s.tick);list(p.history,48);for(const h of p.history){object(h,['tick','water','growth']);integer(h.tick,0,s.tick);num(h.water);num(h.growth,0,1);}if(p.crop){object(p.crop,['type','progress','quality','stage','plantedTick']);if(!CROP_IDS.includes(p.crop.type))throw Error('saveImportInvalid');num(p.crop.progress,0,1);num(p.crop.quality,.35,1);integer(p.crop.stage,0,4);integer(p.crop.plantedTick,0,s.tick);}}for(let i=0;i<s.plots.length;i++)if(!plotIds.has(i))throw Error('saveImportInvalid');
 list(s.inventory,10000);const lotIds=new Set();for(const l of s.inventory){object(l,['id','type','quantity','quality','sourceId','value3000']);text(l.id);text(l.sourceId,160);if(!GOODS.includes(l.type)||lotIds.has(l.id))throw Error('saveImportInvalid');lotIds.add(l.id);integer(l.quantity,1);num(l.quality,0,1);integer(l.value3000);if(l.quality===0&&l.value3000!==0)throw Error('saveImportInvalid');}
 list(s.ledger,5000);for(const l of s.ledger){object(l,['id','tick','type','amount','balance']);text(l.id,160);text(l.type);integer(l.tick,0,s.tick);integer(l.amount,-MAX_NUMBER,MAX_NUMBER);integer(l.balance);}if(s.ledger.length&&s.ledger.at(-1).balance!==s.coins)throw Error('saveImportInvalid');
 object(s.stats,['planted','watered','harvested','sold','orders','income','expense']);for(const n of Object.values(s.stats))num(n);object(s.progression,['xp','level','achievements','completedOrders','startedKinds','credit3000','debtCoins']);integer(s.progression.debtCoins);integer(s.progression.credit3000);integer(s.progression.xp);integer(s.progression.level,1);if(s.progression.level!==1+Math.floor(s.progression.xp/100))throw Error('saveImportInvalid');strings(s.progression.achievements,1000);strings(s.progression.completedOrders,1000);strings(s.progression.startedKinds,4);if(s.progression.startedKinds.some((/** @type {string} */k)=>!STOCK[k]))throw Error('saveImportInvalid');
 list(s.orders,20);const orderIds=new Set();for(const o of s.orders){object(o,['id','needs','bonus','completed']);text(o.id,160);if(orderIds.has(o.id)||!plain(o.needs)||!Object.keys(o.needs).length)throw Error('saveImportInvalid');orderIds.add(o.id);for(const [k,n]of Object.entries(o.needs)){if(!GOODS.includes(k))throw Error('saveImportInvalid');integer(n,1);}integer(o.bonus);flag(o.completed);if(o.completed&&!s.progression.completedOrders.includes(o.id))throw Error('saveImportInvalid');}
 object(s.land,['level']);integer(s.land.level,0,COZY_LAND_BOUNDS.length-1);object(s.layout,['items','nextId']);integer(s.layout.nextId,1);list(s.layout.items,600);const ids=new Set();for(const p of s.layout.items){object(p,['id','kind','x','z','rotation']);text(p.id);if(ids.has(p.id))throw Error('saveImportInvalid');ids.add(p.id);if(placementIssue(s,p))throw Error('layoutInvalid');}for(const [kind,d]of Object.entries(COZY_BUILD_CATALOG))if(s.layout.items.filter((/** @type {Placement} */p)=>p.kind===kind).length>d.limit)throw Error('farmFull');for(const p of s.plots)if(!s.layout.items.some((/** @type {Placement} */x)=>x.id==='bed.'+p.id&&x.kind==='bed'))throw Error('saveImportInvalid');if(s.layout.items.filter((/** @type {Placement} */p)=>p.kind==='bed').length!==s.plots.length)throw Error('saveImportInvalid');
 list(s.facilities,26);const facilities=new Set(),animalIds=new Set();for(const f of s.facilities){object(f,['id','kind','level','feedStockG','feedG','waterStockMl','waterMl','cleanliness','auto','shade','enabled','pending','productionHours','animals','forageG','foragePlots','pendingLots']);text(f.id);if(facilities.has(f.id)||!COZY_FACILITY_KINDS.includes(f.kind)||!s.layout.items.some((/** @type {Placement} */p)=>p.id===f.id&&p.kind===f.kind))throw Error('saveImportInvalid');facilities.add(f.id);integer(f.level,0,3);for(const k of ['feedStockG','feedG','waterStockMl','waterMl'])num(f[k]);integer(f.pending);num(f.forageG);integer(f.foragePlots,0,8);if(f.forageG>9000*f.foragePlots||f.kind!=='goatShelter'&&(f.forageG!==0||f.foragePlots!==0))throw Error('saveImportInvalid');num(f.cleanliness,0,100);num(f.productionHours,0,8);for(const k of ['auto','shade','enabled'])flag(f[k]);list(f.pendingLots,200);let oldPending=0;for(const l of f.pendingLots){object(l,['quantity','quality','sourceId','value3000']);integer(l.quantity,1);num(l.quality,0,1);text(l.sourceId,160);integer(l.value3000);oldPending+=l.quantity;}if(oldPending>f.pending)throw Error('saveImportInvalid');list(f.animals,80);let count=0;for(const a of f.animals){object(a,['id','species','growth','condition','ready','count','massG','lactating']);text(a.id,160);if(animalIds.has(a.id)||ids.has(a.id)||a.species!==ANIMAL_KINDS[f.kind])throw Error('saveImportInvalid');animalIds.add(a.id);num(a.growth,0,1);num(a.condition,0,1);integer(a.ready);integer(a.count,1,100);integer(a.massG);flag(a.lactating);if(a.species!=='fish'&&a.count!==1)throw Error('saveImportInvalid');count+=a.count;}if(STOCK[f.kind]&&count>facilityCapacity(f).animals)throw Error('animalCapacity');if(STOCK[f.kind]&&!s.progression.startedKinds.includes(f.kind))throw Error('saveImportInvalid');}
 for(const p of s.layout.items)if(COZY_FACILITY_KINDS.includes(p.kind)&&!facilities.has(p.id))throw Error('saveImportInvalid');
 if(s.layout.items.some((/** @type {Placement} */p)=>p.kind===HOUSE_KIND)!==Boolean(s.house?.level))throw Error('saveImportInvalid');
 object(s.provenance,['native','layout']);for(const k of ['native','layout'])if(s.provenance[k]!==null)text(s.provenance[k],2_100_000);if(s.provenance.native!==null)deserialize(s.provenance.native);if(s.provenance.layout!==null)validatePrototypeLayout(JSON.parse(s.provenance.layout));return s;
}
