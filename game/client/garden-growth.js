import {CROPS} from './config.js';
/** Authored stem/heart sizes; visual interpolation never advances the engine. */
const SIZES=Object.freeze({lettuce:[.065,.1,.135,.165],tomato:[.13,.28,.49,.7],corn:[.045,.22,.85,1.85,2.45]});
/** @param {string} type @param {number} stage */
export function cropModelSize(type,stage){return SIZES[/** @type {keyof typeof SIZES} */(type)]?.[stage]||1;}
/** Exact size at the saved native progress. Corn's first pose is a buried seed.
 * @param {{type:string,stage:number,progress:number}} crop */
export function cropGrowthSize(crop){
 const config=CROPS[/** @type {import('./engine.js').CropId} */(crop.type)],sizes=SIZES[/** @type {keyof typeof SIZES} */(crop.type)];
 if(!config||!sizes)return 1;const stage=crop.stage,current=sizes[stage];
 if(crop.type==='corn'){
  if(stage===0)return sizes[0];if(stage===4)return sizes[4];
  const start=[.045,.14,.65,1.7,2.45][stage],end=[.045,.65,1.7,2.45,2.45][stage],a=config.stages[stage],b=config.stages[stage+1];
  return start+(end-start)*Math.max(0,Math.min(1,(crop.progress-a)/(b-a)));
 }
 const next=sizes[stage+1];if(next===undefined)return current;
 const a=config.stages[stage],b=config.stages[stage+1];return current+(next-current)*Math.max(0,Math.min(1,(crop.progress-a)/(b-a)));
}
/** Stable cosmetic diversity. Never use Math.random or the simulation RNG.
 * @param {string} id @param {number} plant */
export function gardenVariant(id,plant){let n=2166136261;for(const c of id+':'+plant)n=Math.imul(n^c.charCodeAt(0),16777619)>>>0;return Object.freeze({turn:((n%101)/100-.5)*.3,width:.88+((n>>>8)%101)/100*.12,height:.94+((n>>>16)%101)/100*.08,phase:(n%1000)/79});}
/** Bounded cosmetic easing on the existing render RAF. Observations are exact
 * native snapshots; no wall-clock growth, command, save or resource writes. */
export function createGardenGrowth(){
 /** @type {Map<string,{identity:string,stage:number,from:number,to:number,started:number}>} */const poses=new Map();
 const value=(/** @type {{from:number,to:number,started:number}} */p,/** @type {number} */now)=>{const u=Math.max(0,Math.min(1,(now-p.started)/320)),smooth=u*u*(3-2*u);return p.from+(p.to-p.from)*smooth;};
 return{
  /** @param {readonly Readonly<import('./unified-world-model.js').WorldEntity>[]} entities @param {number} now */
  observe(entities,now){const retained=new Set();for(const e of entities){if(e.kind!=='plot'||!e.crop)continue;retained.add(e.id);const c=e.crop,identity=c.type+':'+(c.plantedTick??0),to=cropGrowthSize(c),previous=poses.get(e.id);if(!previous||previous.identity!==identity)poses.set(e.id,{identity,stage:c.stage,from:to,to,started:now});else if(previous.to!==to||previous.stage!==c.stage)poses.set(e.id,{identity,stage:c.stage,from:value(previous,now),to,started:now});}for(const id of poses.keys())if(!retained.has(id))poses.delete(id);},
  /** @param {string} id @param {number} now @param {boolean} still */
  sample(id,now,still){const p=poses.get(id);if(!p)return 1;if(still){p.from=p.to;p.started=now;}return (still?p.to:value(p,now))/cropModelSize(p.identity.split(':')[0],p.stage);},
  reset(){poses.clear();}
 };
}
