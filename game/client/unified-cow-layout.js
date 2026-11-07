import {worldPoint} from './unified-world-registry.js';import {cowCapacity} from './cow-state.js';
/** Native snapshot owns eligibility/supply calculations. This adapter only lays out actual saved objects.
 * @param {import('./engine.js').State} state @param {ReturnType<typeof import('./cow-scene-snapshot.js').cowSnapshot>|undefined} view
 * @returns {import('./unified-world-model.js').WorldEntity[]}
 */
export function cowWorldEntities(state,view){
 const g=state.cow,home=worldPoint('cow',4,2);if(!g?.visited||!g.barn)return[{id:'cow.available',zone:'cow',kind:'available',domainId:'enterCow',...home,width:3,depth:2.8,height:.2,value:0}];
 const b=g.barn,cap=cowCapacity(g),entities=/** @type {import('./unified-world-model.js').WorldEntity[]} */([{id:'cow.barn',zone:'cow',kind:'cowBarn',domainId:'barn',...home,width:b.expanded?6:5,depth:b.expanded?5.5:5,height:2.8,value:b.cleanliness,expanded:b.expanded,shade:b.shade,sanitation:b.sanitation}]);
 const stations=/** @type {[string,number,number,number][]} */([['feed',-5,-3.5,view?.feedG||0],['water',-2,-4,view?.waterMl||0],['stand',-.5,-2,b.standCleanliness],['can',2,-3.5,view?.canMilkMl||0],['clean',6,-3.5,b.cleanliness],['coop',6,-1.5,0]]);
 for(const [id,dx,dz,value]of stations)entities.push({id:'cow.station.'+id,zone:'cow',kind:'cowStation',domainId:id,...worldPoint('cow',dx,dz),width:id==='stand'?2:1,depth:id==='stand'?2:1,height:id==='stand'?1.1:id==='can'?1.1:.8,value,...(id==='water'?{careUpgrade:b.troughUpgrade}:{}),...(id==='feed'?{capacity:cap.feedG}:id==='water'?{capacity:cap.waterMl}:id==='can'?{capacity:cap.canMl}:{})});
 if(g.cooler.owned)entities.push({id:'cow.cooler',zone:'cow',kind:'cowStation',domainId:'can',...worldPoint('cow',3.5,-2),width:1.2,depth:1.1,height:1.2,value:view?.cooler.storedMl||0,status:view?.cooler.status||'off',capacity:cap.coolerMl,equipment:'cooler'});
 if(view){const native=new Map(view.herd.map(c=>[c.id,c])),slots=[[-4,1],[-1.8,2],[-3.5,3.5]];for(const [i,cow]of g.cows.entries()){const c=native.get(cow.id);if(!c)continue;const [dx,dz]=slots[i%slots.length];entities.push({id:'cow.animal.'+cow.id,zone:'cow',kind:'cow',domainId:cow.id,...worldPoint('cow',dx,dz),width:1.2,depth:1.8,height:1.8,value:c.milkReadyMl,ready:c.canMilk,lactating:c.lactating,stage:c.stage,activity:c.activity});}}
 return entities;
}
