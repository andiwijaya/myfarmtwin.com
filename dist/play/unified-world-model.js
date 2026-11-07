/** Read-only presentation model for the Crop + Chicken feasibility slice.
 * No storage, commands, clocks, game RNG or renderer dependency belongs here.
 */
import {worldPoint} from './unified-world-registry.js';
import {PUMP} from './config.js';
export {TWO_ZONE_BOUNDS,TWO_ZONE_ANCHORS} from './unified-world-registry.js';
/** @typedef {'field'|'chicken'|'market'} PreviewZone */
/** @typedef {{id:string,zone:PreviewZone,kind:'plot'|'pump'|'coop'|'station'|'hen'|'market'|'available',domainId:string|number,x:number,z:number,width:number,depth:number,height:number,value:number,covered?:boolean,crop?:{type:string,stage:number,progress:number,quality:number}}} WorldEntity */
/** @typedef {{revision:number,tick:number,weather:string,paused:boolean,chickenStarted:boolean,irrigationKnown:boolean,coveredPlotIds:readonly number[],entities:readonly Readonly<WorldEntity>[]}} WorldSnapshot */
/** @typedef {{kind:'plot'|'chicken'|'pump'|'market'|'startChicken',entityId:string,domainId:string|number,animalId?:string}} WorldSelection */

const henSpots=Object.freeze([[-2,1],[0,1],[1,1],[0,0],[-2,0],[1,-1]].map(([x,z])=>worldPoint('chicken',x,z)));

/** Detached immutable snapshot; existing domain IDs remain the command targets.
 * Coverage is supplied by the existing engine selector, never reimplemented here.
 * @param {import('./engine.js').State} state @param {{coveredPlotIds?:readonly number[]}} [options] @returns {Readonly<WorldSnapshot>}
 */
export function readWorldSnapshot(state,options={}){
 const irrigationKnown=Array.isArray(options.coveredPlotIds),coverage=new Set(options.coveredPlotIds||[]),coveredPlotIds=Object.freeze(state.pump.built&&irrigationKnown?state.plots.filter(p=>coverage.has(p.id)).map(p=>p.id):[]),installed=new Set(coveredPlotIds);
 /** @type {WorldEntity[]} */const entities=state.plots.map(p=>({id:'field.plot.'+p.id,zone:'field',kind:'plot',domainId:p.id,...worldPoint('field',p.x-4,p.y-3),width:.92,depth:.92,height:.13,value:p.soilWaterMm/p.soilCapacityMm,...(irrigationKnown?{covered:installed.has(p.id)}:{}),...(p.crop?{crop:Object.freeze({type:p.crop.type,stage:p.crop.stage,progress:p.crop.progress,quality:p.crop.quality})}:{})}));
 if(state.pump.built)entities.push({id:'field.pump',zone:'field',kind:'pump',domainId:'pump',...worldPoint('field',PUMP.x-4,PUMP.y-3),width:.8,depth:.8,height:1,value:Number(state.pump.on)});
 entities.push({id:'market.central',zone:'market',kind:'market',domainId:'market',...worldPoint('market'),width:2.5,depth:2,height:2,value:0});
 const chicken=state.chicken,coop=chicken?.visited?chicken.coop:null;
 if(coop&&chicken){
  entities.push({id:'chicken.coop',zone:'chicken',kind:'coop',domainId:'coop',...worldPoint('chicken',-1,-2),width:2+coop.level,depth:2+coop.level,height:1.7,value:coop.pending.length});
  for(const [id,x,z,value]of /** @type {[string,number,number,number][]} */([['nest',-1,0,coop.pending.length],['feeder',2,0,coop.feedG],['drinker',2,-2,coop.waterL],['clean',-3,1,coop.cleanliness]]))entities.push({id:'chicken.'+id,zone:'chicken',kind:'station',domainId:id,...worldPoint('chicken',x,z),width:.65,depth:.65,height:.5,value});
  for(const [i,hen]of chicken.hens.entries()){const {x,z}=henSpots[i%henSpots.length];entities.push({id:'chicken.hen.'+hen.id,zone:'chicken',kind:'hen',domainId:hen.id,x,z,width:.4,depth:.4,height:.45,value:0});}
 }else entities.push({id:'chicken.available',zone:'chicken',kind:'available',domainId:'enterYard',...worldPoint('chicken',-1,-2),width:2,depth:2,height:.2,value:0});
 return Object.freeze({revision:state.revision,tick:state.tick,weather:state.weather,paused:state.paused,chickenStarted:!!coop,irrigationKnown,coveredPlotIds,entities:Object.freeze(entities.map(e=>Object.freeze(e)))});
}
/** Selection routing only. Entry remains a separate explicit player command.
 * @param {Readonly<WorldSnapshot>} snapshot @param {unknown} id @returns {Readonly<WorldSelection>|null}
 */
export function resolveWorldSelection(snapshot,id){
 if(typeof id!=='string')return null;const entity=snapshot.entities.find(e=>e.id===id);if(!entity)return null;
 const base={entityId:entity.id,domainId:entity.domainId};
 if(entity.kind==='plot'&&typeof entity.domainId==='number')return Object.freeze({...base,kind:'plot'});
 if(entity.kind==='hen'&&typeof entity.domainId==='string')return Object.freeze({...base,kind:'chicken',domainId:'coop',animalId:entity.domainId});
 if(entity.kind==='coop'||entity.kind==='station')return Object.freeze({...base,kind:'chicken'});
 if(entity.kind==='available')return Object.freeze({...base,kind:'startChicken'});
 if(entity.kind==='pump'||entity.kind==='market')return Object.freeze({...base,kind:entity.kind});
 return null;
}
