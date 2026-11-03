import {assertInvariants} from './invariants.js';import {INITIAL_PLOTS,EXPANSION,CROP_IDS,CROPS,ORDERS,WEATHER} from './config.js';
export const SAVE_VERSION=1;export const MAX_SAVE_BYTES=2_000_000;
/** @param {unknown} value @param {string[]} keys @returns {Record<string,any>} */
function object(value,keys){if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)throw new Error('Invalid save object');const v=/** @type {Record<string,any>} */(value);if(Object.keys(v).length!==keys.length||keys.some(k=>!Object.hasOwn(v,k)))throw new Error('Unknown or missing save fields');return v;}
/** @param {unknown} value @param {number} [min] @param {number} [max] */
function number(value,min=0,max=1e9){if(typeof value!=='number'||!Number.isFinite(value)||value<min||value>max)throw new Error('Invalid save number');return value;}
/** @param {unknown} value @param {number} [min] @param {number} [max] */
function integer(value,min=0,max=1e9){const n=number(value,min,max);if(!Number.isSafeInteger(n))throw new Error('Invalid save integer');return n;}
/** @param {unknown} value */
function boolean(value){if(typeof value!=='boolean')throw new Error('Invalid save flag');}
/** @param {unknown} value @param {number} max @returns {any[]} */
function array(value,max){if(!Array.isArray(value)||value.length>max)throw new Error('Invalid save array');return value;}
/** Validate untrusted data before it reaches engine/UI. @param {unknown} value @returns {import('./engine.js').State} */
export function validateState(value){
 const s=object(value,['saveVersion','revision','tick','seed','rng','weather','paused','speed','coins','water','careCredits','seeds','plots','inventory','ledger','mission','pump','stats','completedOrders','nextLot']);
 if(s.saveVersion!==SAVE_VERSION)throw new Error('Unsupported save version');integer(s.revision);integer(s.tick);integer(s.seed,0,0xffffffff);integer(s.rng,0,0xffffffff);if(!Object.keys(WEATHER).includes(s.weather))throw new Error('Invalid weather');boolean(s.paused);if(![1,2].includes(s.speed))throw new Error('Invalid speed');integer(s.coins);number(s.water,0,240);integer(s.careCredits,0,1);integer(s.nextLot,1);
 const seeds=object(s.seeds,['lettuce','tomato']);for(const c of CROP_IDS)integer(seeds[c],0,99);
 const positions=[...INITIAL_PLOTS,...EXPANSION.cells],plots=array(s.plots,8);if(plots.length<3)throw new Error('Missing beds');
 for(let i=0;i<plots.length;i++){
  const p=object(plots[i],['id','x','y','soilWaterMm','soilCapacityMm','crop','waterAppliedMm','careCost','lastWaterTick','history']);if(p.id!==i||p.x!==positions[i].x||p.y!==positions[i].y||p.soilCapacityMm!==50)throw new Error('Invalid plot placement');number(p.soilWaterMm,0,50);number(p.waterAppliedMm);number(p.careCost);integer(p.lastWaterTick,-1,s.tick);
  let previous=-1;for(const item of array(p.history,48)){const h=object(item,['tick','water','growth']);integer(h.tick,0,s.tick);if(h.tick<=previous)throw new Error('History order');previous=h.tick;number(h.water,0,50);number(h.growth,0,1);}
  if(p.crop!==null){const c=object(p.crop,['type','progress','quality','stage','plantedTick']);if(!CROP_IDS.includes(c.type))throw new Error('Invalid crop');number(c.progress,0,1);number(c.quality,.35,1);integer(c.plantedTick,0,s.tick);const config=CROPS[/** @type {'lettuce'|'tomato'} */(c.type)];if(c.stage!==config.stages.filter(n=>c.progress>=n).length-1)throw new Error('Invalid growth stage');}
 }
 const lots=array(s.inventory,80),lotIds=new Set();let quantity=0;for(const item of lots){const l=object(item,['id','type','quantity','quality']);integer(l.id,1,s.nextLot-1);if(lotIds.has(l.id)||!CROP_IDS.includes(l.type))throw new Error('Invalid lot');lotIds.add(l.id);integer(l.quantity,1,80);number(l.quality,.35,1);quantity+=l.quantity;}
 for(const item of array(s.ledger,20000)){const l=object(item,['id','tick','type','amount','balance']);if(typeof l.id!=='string'||!/^[A-Za-z0-9:._-]{1,100}$/.test(l.id)||!['seed_purchase','water_cost','facility_purchase','sale_revenue','mission_reward'].includes(l.type))throw new Error('Invalid ledger entry');integer(l.tick,0,s.tick);integer(l.amount,-1e9,1e9);integer(l.balance);if(['seed_purchase','water_cost','facility_purchase'].includes(l.type)&&l.amount>0)throw new Error('Invalid cost');if(['sale_revenue','mission_reward'].includes(l.type)&&l.amount<0)throw new Error('Invalid revenue');}
 const mission=object(s.mission,['step','rewards']);integer(mission.step,0,7);const rewards=array(mission.rewards,4);if(new Set(rewards).size!==rewards.length||rewards.some(n=>![2,5,6,7].includes(n)||n>mission.step))throw new Error('Invalid mission rewards');
 const pump=object(s.pump,['built','on','runHours','stopReason']);boolean(pump.built);boolean(pump.on);integer(pump.runHours,0,s.tick);if(!['','noWater','noCoins'].includes(pump.stopReason))throw new Error('Invalid pump status');
 const stats=object(s.stats,['planted','watered','cared','harvested','sold','hotCare','orders']);for(const n of Object.values(stats))integer(n);if(stats.cared>stats.watered||stats.hotCare>stats.cared||stats.harvested-stats.sold!==quantity)throw new Error('Invalid farm totals');
 const orders=array(s.completedOrders,3);if(new Set(orders).size!==orders.length||orders.some(id=>!ORDERS.some(o=>o.id===id))||stats.orders!==orders.length||(orders.length&&mission.step<7))throw new Error('Invalid orders');
 const state=/** @type {import('./engine.js').State} */(/** @type {unknown} */(s));assertInvariants(state);return structuredClone(state);
}
/** @param {import('./engine.js').State} state */
export function serialize(state){validateState(state);const text=JSON.stringify({format:'MyFarmTwin',saveVersion:SAVE_VERSION,state});if(new TextEncoder().encode(text).length>MAX_SAVE_BYTES)throw new Error('Save too large');return text;}
/** @param {string} text @returns {import('./engine.js').State} */
export function deserialize(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_SAVE_BYTES)throw new Error('Save too large');const envelope=object(JSON.parse(text),['format','saveVersion','state']);if(envelope.format!=='MyFarmTwin'||envelope.saveVersion!==SAVE_VERSION)throw new Error('Unsupported save version');return validateState(envelope.state);}
