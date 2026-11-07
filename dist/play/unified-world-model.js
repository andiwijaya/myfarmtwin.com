/** Read-only presentation model for the Crop + Chicken feasibility slice.
 * No storage, commands, clocks, game RNG or renderer dependency belongs here.
 */
/** @typedef {'field'|'chicken'|'market'} PreviewZone */
/** @typedef {{id:string,zone:PreviewZone,kind:'plot'|'pump'|'coop'|'station'|'hen'|'market'|'available',domainId:string|number,x:number,z:number,width:number,depth:number,height:number,value:number,crop?:{type:string,stage:number,progress:number,quality:number}}} WorldEntity */
/** @typedef {{revision:number,tick:number,weather:string,paused:boolean,chickenStarted:boolean,entities:readonly Readonly<WorldEntity>[]}} WorldSnapshot */
/** @typedef {{kind:'plot'|'chicken'|'pump'|'market'|'startChicken',entityId:string,domainId:string|number,animalId?:string}} WorldSelection */

export const TWO_ZONE_BOUNDS=Object.freeze({minX:-11,maxX:11,minZ:-11,maxZ:10});
export const TWO_ZONE_ANCHORS=Object.freeze({field:Object.freeze({x:-4,z:4}),chicken:Object.freeze({x:-4,z:-6}),market:Object.freeze({x:5,z:0})});
const henSpots=Object.freeze([[-6,-5],[-4,-5],[-3,-5],[-4,-6],[-6,-6],[-3,-7]]);

/** Detached immutable snapshot; existing domain IDs remain the command targets.
 * @param {import('./engine.js').State} state @returns {Readonly<WorldSnapshot>}
 */
export function readWorldSnapshot(state){
 /** @type {WorldEntity[]} */const entities=state.plots.map(p=>({id:'field.plot.'+p.id,zone:'field',kind:'plot',domainId:p.id,x:p.x-8,z:p.y+1,width:.92,depth:.92,height:.13,value:p.soilWaterMm/p.soilCapacityMm,...(p.crop?{crop:Object.freeze({type:p.crop.type,stage:p.crop.stage,progress:p.crop.progress,quality:p.crop.quality})}:{})}));
 if(state.pump.built)entities.push({id:'field.pump',zone:'field',kind:'pump',domainId:'pump',x:-3,z:5,width:.8,depth:.8,height:1,value:Number(state.pump.on)});
 entities.push({id:'market.central',zone:'market',kind:'market',domainId:'market',x:5,z:0,width:2.5,depth:2,height:2,value:0});
 const chicken=state.chicken,coop=chicken?.visited?chicken.coop:null;
 if(coop&&chicken){
  entities.push({id:'chicken.coop',zone:'chicken',kind:'coop',domainId:'coop',x:-5,z:-8,width:2+coop.level,depth:2+coop.level,height:1.7,value:coop.pending.length});
  for(const [id,x,z,value]of /** @type {[string,number,number,number][]} */([['nest',-5,-6,coop.pending.length],['feeder',-2,-6,coop.feedG],['drinker',-2,-8,coop.waterL],['clean',-7,-5,coop.cleanliness]]))entities.push({id:'chicken.'+id,zone:'chicken',kind:'station',domainId:id,x,z,width:.65,depth:.65,height:.5,value});
  for(const [i,hen]of chicken.hens.entries()){const [x,z]=henSpots[i%henSpots.length];entities.push({id:'chicken.hen.'+hen.id,zone:'chicken',kind:'hen',domainId:hen.id,x,z,width:.4,depth:.4,height:.45,value:0});}
 }else entities.push({id:'chicken.available',zone:'chicken',kind:'available',domainId:'enterYard',x:-5,z:-8,width:2,depth:2,height:.2,value:0});
 return Object.freeze({revision:state.revision,tick:state.tick,weather:state.weather,paused:state.paused,chickenStarted:!!coop,entities:Object.freeze(entities.map(e=>Object.freeze(e)))});
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
