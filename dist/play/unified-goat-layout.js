import {worldPoint} from './unified-world-registry.js';import {GOAT} from './goat-config.js';import {goatCapacities} from './goat-state.js';
const paddocks=Object.freeze([{...worldPoint('goat',-4.5,-1),width:5,depth:7},{...worldPoint('goat',3.5,3),width:7,depth:4}].map(p=>Object.freeze(p)));
const slots0=[[-1.4,-2],[0,-2],[1.4,-2],[-1.4,0],[.1,0],[1.4,0],[-1,2],[1,2]],slots1=[[-2.8,-1],[-.95,-1],[.9,-1],[2.7,-1],[-2.8,1],[-.95,1],[.9,1],[2.7,1]];
/** Geometry reads actual ownership and a native stage/policy view; it never classifies growth or grants a herd.
 * @param {import('./engine.js').State} state @param {import('./goat-scene-snapshot.js').GoatRanchSnapshot|undefined} view
 * @returns {import('./unified-world-model.js').WorldEntity[]}
 */
export function goatWorldEntities(state,view){
 const g=state.goat,home=worldPoint('goat',4,-3.5);if(!g?.visited||!g.shelter)return[{id:'goat.available',zone:'goat',kind:'available',domainId:'enterGoat',...home,width:2.8,depth:2.4,height:.2,value:0}];
 const level=g.shelter.level,cap=goatCapacities(g),entities=/** @type {import('./unified-world-model.js').WorldEntity[]} */([{id:'goat.shelter',zone:'goat',kind:'goatShelter',domainId:'shelter',...home,width:4+level*.8,depth:3+level*.4,height:2.1+level*.15,value:g.shelter.cleanliness,level,careUpgrade:g.shelter.careUpgrade}]);
 for(const p of g.paddocks){const area=paddocks[p.id];if(area)entities.push({id:'goat.paddock.'+p.id,zone:'goat',kind:'paddock',domainId:'pasture',...area,height:.04,value:p.biomassG,capacity:GOAT.paddockMaxG,active:p.id===g.activePaddock,paddockId:p.id});}
 for(const [id,x,z,value]of /** @type {[string,number,number,number][]} */([['hay',17,-14,g.feederG],['water',16.5,-11.5,g.troughMl],['clean',24,-12,g.shelter.cleanliness],['platform',16,-9,0],['contract',24.5,-7.1,0]]))entities.push({id:'goat.station.'+id,zone:'goat',kind:'goatStation',domainId:id,x,z,width:id==='platform'?1.3:.7,depth:id==='platform'?1:.7,height:id==='platform'?.65:.6,value,...(['hay','water'].includes(id)?{careUpgrade:g.shelter.careUpgrade}:{}),...(id==='hay'?{capacity:cap.feederG}:id==='water'?{capacity:cap.troughMl}:{})});
 if(view?.visited){const actual=new Map(view.herd.map(animal=>[animal.id,animal])),area=paddocks[g.activePaddock]||paddocks[0],slots=g.activePaddock===1?slots1:slots0;for(const [i,goat]of g.herd.entries()){const native=actual.get(goat.id);if(!native)continue;const scale=native.stage==='weaned'?.62:native.stage==='growing'?.82:1,[dx,dz]=slots[i%slots.length];entities.push({id:'goat.animal.'+goat.id,zone:'goat',kind:'goat',domainId:goat.id,x:area.x+dx,z:area.z+dz,width:.8*scale,depth:1.1*scale,height:1.3*scale,value:goat.growth,scale,stage:native.stage,ready:native.ready,activity:native.activity,waterUsed:g.stats.waterUsedMl,forageAvailable:g.feederG>0||(g.paddocks.find(p=>p.id===g.activePaddock)?.biomassG||0)>0});}}
 return entities;
}
