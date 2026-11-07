/** Read-only presentation model for the unified farm world.
 * No storage, commands, clocks, game RNG or renderer dependency belongs here.
 */
import {worldPoint} from './unified-world-registry.js';
import {PUMP} from './config.js';
import {COOP_LEVELS} from './chicken-config.js';
import {chickenLayout} from './unified-chicken-layout.js';
import {goatWorldEntities} from './unified-goat-layout.js';
import {cowWorldEntities} from './unified-cow-layout.js';
export {TWO_ZONE_BOUNDS,TWO_ZONE_ANCHORS} from './unified-world-registry.js';
/** @typedef {'field'|'chicken'|'goat'|'cow'|'market'} PreviewZone */
/** @typedef {{id:string,zone:PreviewZone,kind:'plot'|'pump'|'coop'|'station'|'hen'|'market'|'available'|'goatShelter'|'goatStation'|'goat'|'paddock'|'cowBarn'|'cowStation'|'cow',domainId:string|number,x:number,z:number,width:number,depth:number,height:number,value:number,covered?:boolean,level?:number,shade?:boolean,automatic?:boolean,capacity?:number,expanded?:boolean,sanitation?:boolean,lactating?:boolean,status?:string,equipment?:string,careUpgrade?:boolean,active?:boolean,paddockId?:number,scale?:number,stage?:string,ready?:boolean,activity?:string,crop?:{type:string,stage:number,progress:number,quality:number}}} WorldEntity */
/** @typedef {{revision:number,tick:number,weather:string,paused:boolean,chickenStarted:boolean,goatStarted:boolean,cowStarted:boolean,chickenLayout:ReturnType<typeof chickenLayout>,irrigationKnown:boolean,coveredPlotIds:readonly number[],entities:readonly Readonly<WorldEntity>[]}} WorldSnapshot */
/** @typedef {{kind:'plot'|'chicken'|'goat'|'cow'|'pump'|'market'|'startChicken'|'startZone',entityId:string,domainId:string|number,animalId?:string,zone?:PreviewZone}} WorldSelection */


/** Detached immutable snapshot; existing domain IDs remain the command targets.
 * Coverage is supplied by the existing engine selector, never reimplemented here.
 * @param {import('./engine.js').State} state @param {{coveredPlotIds?:readonly number[],goat?:import('./goat-scene-snapshot.js').GoatRanchSnapshot ,cow?:ReturnType<typeof import('./cow-scene-snapshot.js').cowSnapshot>}} [options] @returns {Readonly<WorldSnapshot>}
 */
export function readWorldSnapshot(state,options={}){
 const irrigationKnown=Array.isArray(options.coveredPlotIds),coverage=new Set(options.coveredPlotIds||[]),coveredPlotIds=Object.freeze(state.pump.built&&irrigationKnown?state.plots.filter(p=>coverage.has(p.id)).map(p=>p.id):[]),installed=new Set(coveredPlotIds);
 /** @type {WorldEntity[]} */const entities=state.plots.map(p=>({id:'field.plot.'+p.id,zone:'field',kind:'plot',domainId:p.id,...worldPoint('field',p.x-4,p.y-3),width:.92,depth:.92,height:.13,value:p.soilWaterMm/p.soilCapacityMm,...(irrigationKnown?{covered:installed.has(p.id)}:{}),...(p.crop?{crop:Object.freeze({type:p.crop.type,stage:p.crop.stage,progress:p.crop.progress,quality:p.crop.quality})}:{})}));
 if(state.pump.built)entities.push({id:'field.pump',zone:'field',kind:'pump',domainId:'pump',...worldPoint('field',PUMP.x-4,PUMP.y-3),width:.8,depth:.8,height:1,value:Number(state.pump.on)});
 entities.push({id:'market.central',zone:'market',kind:'market',domainId:'market',...worldPoint('market'),width:2.5,depth:2,height:2,value:0});
 const chicken=state.chicken,coop=chicken?.visited?chicken.coop:null,yard=chickenLayout(chicken);
 if(coop&&chicken){
  const capacity=COOP_LEVELS[coop.level];entities.push({id:'chicken.coop',zone:'chicken',kind:'coop',domainId:'coop',...worldPoint('chicken',-1,-2),width:2+coop.level,depth:2+coop.level,height:1.7,value:coop.pending.length,level:coop.level,shade:coop.shade});
  for(const [id,x,z,value]of /** @type {[string,number,number,number][]} */([['nest',-1,0,coop.pending.length],['feeder',2,0,coop.feedG],['drinker',2,-2,coop.waterL],['clean',-3,1,coop.cleanliness]]))entities.push({id:'chicken.'+id,zone:'chicken',kind:'station',domainId:id,...(id==='nest'&&yard?yard.nest:worldPoint('chicken',x,z)),width:id==='nest'?1:.65,depth:.65,height:.5,value,capacity:id==='nest'?capacity.nests:id==='feeder'?capacity.feedG:id==='drinker'?capacity.waterL:100,automatic:id==='feeder'&&coop.autoFeeder,level:coop.level});
  for(const [i,hen]of chicken.hens.entries()){const {x,z}=/** @type {NonNullable<typeof yard>} */(yard).hens[i%6];entities.push({id:'chicken.hen.'+hen.id,zone:'chicken',kind:'hen',domainId:hen.id,x,z,width:.4,depth:.66,height:.73,value:0});}
 }else entities.push({id:'chicken.available',zone:'chicken',kind:'available',domainId:'enterYard',...worldPoint('chicken',-1,-2),width:2,depth:2,height:.2,value:0});
 entities.push(...goatWorldEntities(state,options.goat));
 entities.push(...cowWorldEntities(state,options.cow));
 return Object.freeze({revision:state.revision,tick:state.tick,weather:state.weather,paused:state.paused,chickenStarted:!!coop,goatStarted:!!state.goat?.visited,cowStarted:!!state.cow?.visited,chickenLayout:yard,irrigationKnown,coveredPlotIds,entities:Object.freeze(entities.map(e=>Object.freeze(e)))});
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
 if(entity.kind==='available')return Object.freeze({...base,kind:entity.zone==='chicken'?'startChicken':'startZone',zone:entity.zone});
 if(entity.zone==='goat')return Object.freeze({...base,kind:'goat'});
 if(entity.zone==='cow')return Object.freeze({...base,kind:'cow'});
 if(entity.kind==='pump'||entity.kind==='market')return Object.freeze({...base,kind:entity.kind});
 return null;
}
