import {FISH_COST_TYPES,FISH_REVENUE_TYPES,FISH_LEDGER_TYPES} from './fish-config.js';
import {createFishState} from './fish-state.js';
import {createGoatState} from './goat-state.js';
import {createCowState} from './cow-state.js';
import {COW_COST_TYPES,COW_LEDGER_TYPES} from './cow-config.js';
import {GOAT_COST_TYPES,GOAT_LEDGER_TYPES} from './goat-config.js';
import {validateChickenEconomy} from './chicken-save-checks.js';
import {CURRENT_SAVE_VERSION} from './config.js';import {createChickenState} from './chicken-state.js';
import {assertInvariants} from './invariants.js';import {INITIAL_PLOTS,EXPANSION,CROP_IDS,LEGACY_CROP_IDS,CROPS,ORDERS,WEATHER,LIMITS} from './config.js';
const COST_TYPES=[...FISH_COST_TYPES,...COW_COST_TYPES,...GOAT_COST_TYPES,'seed_purchase','water_cost','facility_purchase','feed_purchase','care_cost','coop_upgrade','hen_purchase','feeder_upgrade','feeder_service','shade_purchase'];const REVENUE_TYPES=[...FISH_REVENUE_TYPES,'cow_recovery_grant','cow_starter_grant','cow_milk_sale','cow_order_bonus','goat_sale','goat_starter_grant','sale_revenue','mission_reward','egg_sale'];const CHICKEN_TYPES=['feed_purchase','care_cost','coop_upgrade','hen_purchase','feeder_upgrade','feeder_service','shade_purchase','egg_sale'];
export const SAVE_VERSION=CURRENT_SAVE_VERSION;export const MAX_SAVE_BYTES=2_000_000;
/** @param {unknown} value @param {string[]} keys @returns {Record<string,any>} */
function object(value,keys){if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)throw new Error('Invalid save object');const v=/** @type {Record<string,any>} */(value);if(Reflect.ownKeys(v).some(k=>{const d=Object.getOwnPropertyDescriptor(v,k);return typeof k!=='string'||!d||!Object.hasOwn(d,'value')||!d.enumerable;}))throw new Error('Hidden save field');if(Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw new Error('Unknown or missing save fields');return v;}
/** @param {unknown} value @param {number} [min] @param {number} [max] */
function number(value,min=0,max=1e9){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw new Error('Invalid save number');return value;}
/** @param {unknown} value @param {number} [min] @param {number} [max] */
function integer(value,min=0,max=1e9){const n=number(value,min,max);if(!Number.isSafeInteger(n))throw new Error('Invalid save integer');return n;}
/** @param {unknown} value */
function boolean(value){if(typeof value!=='boolean')throw new Error('Invalid save flag');}
/** @param {unknown} value @param {number} max @returns {any[]} */
function array(value,max){if(!Array.isArray(value)||value.length>max)throw new Error('Invalid save array');return value;}
/** Validate untrusted data before it reaches engine/UI. @param {unknown} value @param {number} version @param {boolean} [copy] @returns {import('./engine.js').State} */
function validateVersion(value,version,copy=true){
 const s=object(value,['saveVersion','revision','tick','seed','rng','weather','paused','speed','coins','water','careCredits','seeds','plots','inventory','ledger','mission','pump','stats','completedOrders','followups','nextLot',...(version>=2?['chicken']:[]),...(version>=3?['goat']:[]),...(version>=4?['cow']:[]),...(version>=5?['fish']:[])]);
 if(s.saveVersion!==version)throw new Error('Unsupported save version');integer(s.revision);integer(s.tick);integer(s.seed,0,0xffffffff);integer(s.rng,0,0xffffffff);if(!Object.keys(WEATHER).includes(s.weather))throw new Error('Invalid weather');boolean(s.paused);if(![1,2].includes(s.speed))throw new Error('Invalid speed');integer(s.coins);number(s.water,0,240);integer(s.careCredits,0,1);integer(s.nextLot,1);
 const cropIds=version<6?LEGACY_CROP_IDS:CROP_IDS,seeds=object(s.seeds,[...cropIds]);for(const c of cropIds)integer(seeds[c],0,99);
 const positions=[...INITIAL_PLOTS,...EXPANSION.cells],plots=array(s.plots,version<6?8:LIMITS.plots);if(plots.length<3)throw new Error('Missing beds');
 for(let i=0;i<plots.length;i++){
  const p=object(plots[i],['id','x','y','soilWaterMm','soilCapacityMm','crop','waterAppliedMm','careCost','lastWaterTick','history']);if(p.id!==i||p.x!==positions[i].x||p.y!==positions[i].y||p.soilCapacityMm!==50)throw new Error('Invalid plot placement');number(p.soilWaterMm,0,50);number(p.waterAppliedMm);number(p.careCost);integer(p.lastWaterTick,-1,s.tick);
  let previous=-1;for(const item of array(p.history,48)){const h=object(item,['tick','water','growth']);integer(h.tick,0,s.tick);if(h.tick<=previous)throw new Error('History order');previous=h.tick;number(h.water,0,50);number(h.growth,0,1);}
  if(p.crop!==null){const c=object(p.crop,['type','progress','quality','stage','plantedTick']);if(!cropIds.includes(c.type))throw new Error('Invalid crop');number(c.progress,0,1);number(c.quality,.35,1);integer(c.plantedTick,0,s.tick);const config=CROPS[/** @type {import('./engine.js').CropId} */(c.type)];if(c.stage!==config.stages.filter(n=>c.progress>=n).length-1)throw new Error('Invalid growth stage');}
 }
 const lots=array(s.inventory,80),lotIds=new Set();let quantity=0;for(const item of lots){const l=object(item,['id','type','quantity','quality']);integer(l.id,1,s.nextLot-1);if(lotIds.has(l.id)||!cropIds.includes(l.type))throw new Error('Invalid lot');lotIds.add(l.id);integer(l.quantity,1,80);number(l.quality,.35,1);quantity+=l.quantity;}
 for(const item of array(s.ledger,20000)){const l=object(item,['id','tick','type','amount','balance']);if(typeof l.id!=='string'||!/^[A-Za-z0-9:._-]{1,100}$/.test(l.id)||![...COST_TYPES,...REVENUE_TYPES].filter(t=>(version>=2||!CHICKEN_TYPES.includes(t))&&(version>=3||!GOAT_LEDGER_TYPES.includes(t))&&(version>=4||!COW_LEDGER_TYPES.includes(t))&&(version>=5||!FISH_LEDGER_TYPES.includes(t))).includes(l.type))throw new Error('Invalid ledger entry');integer(l.tick,0,s.tick);integer(l.amount,-1e9,1e9);integer(l.balance);if(COST_TYPES.includes(l.type)&&l.amount>0)throw new Error('Invalid cost');if(REVENUE_TYPES.includes(l.type)&&l.amount<0)throw new Error('Invalid revenue');}
 const mission=object(s.mission,['step','rewards']);integer(mission.step,0,7);const rewards=array(mission.rewards,4);if(new Set(rewards).size!==rewards.length||rewards.some(n=>![2,5,6,7].includes(n)||n>mission.step))throw new Error('Invalid mission rewards');
 const pump=object(s.pump,['built','on','efficient','runHours','stopReason']);boolean(pump.built);boolean(pump.on);boolean(pump.efficient);integer(pump.runHours,0,s.tick);if(!['','noWater','noCoins'].includes(pump.stopReason))throw new Error('Invalid pump status');
 const stats=object(s.stats,['planted','watered','cared','harvested','sold','hotCare','orders']);for(const n of Object.values(stats))integer(n);if(stats.cared>stats.watered||stats.hotCare>stats.cared||stats.harvested-stats.sold!==quantity)throw new Error('Invalid farm totals');
 const orders=array(s.completedOrders,3);if(new Set(orders).size!==orders.length||orders.some(id=>!ORDERS.some(o=>o.id===id))||stats.orders!==orders.length||(orders.length&&mission.step<7))throw new Error('Invalid orders');
 const followups=object(s.followups,['order','hotCare','efficiency']);for(const flag of Object.values(followups))boolean(flag);if((followups.order&&stats.orders<1)||(followups.hotCare&&stats.hotCare<1)||(followups.efficiency&&!pump.efficient)||(Object.values(followups).some(Boolean)&&mission.step<7))throw new Error('Invalid follow-up missions');
 const state=/** @type {import('./engine.js').State} */(/** @type {unknown} */(s));assertInvariants(state);if(version>=2)validateChickenEconomy(state);return copy?structuredClone(state):state;
}
/** @param {unknown} value @returns {import('./engine.js').State} */
export function validateState(value){return validateVersion(value,SAVE_VERSION);}
/** Add only the new zero-count seed entry; retain all old gameplay values.
 * @param {import('./engine.js').State} state */
function gardenMigration(state){return {...state,seeds:{...state.seeds,corn:0}};}
/** V1 was strictly validated before this additive migration. @param {import('./engine.js').State} state */
function migrateV1(state){return validateState({...gardenMigration(state),saveVersion:SAVE_VERSION,chicken:createChickenState(),goat:createGoatState(),cow:createCowState(),fish:createFishState()});}
/** @param {import('./engine.js').State} state */
export function serialize(state){validateVersion(state,SAVE_VERSION,false);const text=JSON.stringify({format:'MyFarmTwin',saveVersion:SAVE_VERSION,state});if(new TextEncoder().encode(text).length>MAX_SAVE_BYTES)throw new Error('Save too large');return text;}
/** @param {string} text @returns {import('./engine.js').State} */
export function deserialize(text){
 if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_SAVE_BYTES)throw new Error('Save too large');const envelope=object(JSON.parse(text),['format','saveVersion','state']);if(envelope.format!=='MyFarmTwin')throw new Error('Unsupported save format');
 if(envelope.saveVersion===0){const legacy=structuredClone(envelope.state);if(!legacy||legacy.saveVersion!==0||!Array.isArray(legacy.plots))throw new Error('Invalid legacy save');for(const plot of legacy.plots){object(plot,['id','x','y','soilWaterMm','soilCapacityMm','crop','waterAppliedMm','careCost','lastWaterTick']);plot.history=[];}legacy.saveVersion=1;return migrateV1(validateVersion(legacy,1));}
 if(envelope.saveVersion===1)return migrateV1(validateVersion(envelope.state,1));
 if(envelope.saveVersion===2){const old=validateVersion(envelope.state,2);return validateState({...gardenMigration(old),saveVersion:SAVE_VERSION,goat:createGoatState(),cow:createCowState(),fish:createFishState()});}
 if(envelope.saveVersion===3){const old=validateVersion(envelope.state,3);return validateState({...gardenMigration(old),saveVersion:SAVE_VERSION,cow:createCowState(),fish:createFishState()});}
 if(envelope.saveVersion===4){const old=validateVersion(envelope.state,4);return validateState({...gardenMigration(old),saveVersion:SAVE_VERSION,fish:createFishState()});}
 if(envelope.saveVersion===5){const old=validateVersion(envelope.state,5);return validateState({...gardenMigration(old),saveVersion:SAVE_VERSION});}
 if(typeof envelope.saveVersion==='number'&&envelope.saveVersion>SAVE_VERSION)throw new Error('saveNewer');if(envelope.saveVersion!==SAVE_VERSION)throw new Error('Unsupported save version');return validateState(envelope.state);
}
