import {worldPoint} from './unified-world-registry.js';import {fishStage} from './fish-state.js';import {FISH} from './fish-config.js';import {fishGrowthFactors} from './fish-growth.js';
/** Cosmetic members of actual cohorts, never new authoritative fish IDs. Offsets are shared across cohorts in a pond.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} entity
 */
export function fishSchoolMembers(entity){const scale=entity.scale||1;return Object.freeze(Array.from({length:Math.max(0,Math.min(6,entity.value,entity.visualCount??Math.min(3,entity.value)))},(_,i)=>{const slot=(entity.fishOffset||0)+i;return Object.freeze({slot,x:(slot%3-1)*1.1,z:(Math.floor(slot/3)-.5)*2.1,scale,width:.38*scale,depth:.61*scale,centerZ:-.055*scale});}));}
/** @typedef {{snapshot:ReturnType<typeof import('./fish-snapshot.js').fishSnapshot>,feederIds:readonly number[]}} UnifiedFishView */
/** Native water/equipment view and real cohorts only; the legacy illustrative unvisited preview is excluded.
 * @param {import('./engine.js').State} state @param {UnifiedFishView|undefined} view
 * @returns {import('./unified-world-model.js').WorldEntity[]}
 */
export function fishWorldEntities(state,view){
 const g=state.fish;if(!g?.visited)return[{id:'fish.available',zone:'fish',kind:'available',domainId:'enterFishPond',...worldPoint('fish',-3,0),width:4.4,depth:6,height:.2,value:0}];
 const entities=/** @type {import('./unified-world-model.js').WorldEntity[]} */([]);
 for(const p of g.ponds){const home=worldPoint('fish',p.id===1?-3:2.5,p.id===1?0:1),native=view&&!view.snapshot.preview?view.snapshot.ponds.find(n=>n.id===p.id):null,id='fish.pond.'+p.id;
  entities.push({id,zone:'fish',kind:'fishPond',domainId:'pond',...home,width:4.4,depth:6,height:.35,value:native?.count||0,pondId:p.id,clarity:native?.clarity,oxygenMg:p.oxygenMg,tanMg:p.tanMg});
  entities.push({id:id+'.aerator',zone:'fish',kind:'fishEquipment',domainId:'aerator',x:home.x+1.8,z:home.z-3.6,width:.7,depth:.7,height:.6,value:Number(p.aeratorOn),pondId:p.id,automatic:p.efficient,status:p.serviceStatus,active:native?.aerating||false});
  for(const [station,dx,dz]of /** @type {[string,number,number][]} */([['feed',-1,-4],['water',1,-4],['harvest',1,4],['market',-1,4.2]]))entities.push({id:id+'.'+station,zone:'fish',kind:'fishStation',domainId:station,x:home.x+dx,z:home.z+dz,width:.8,depth:.8,height:.6,value:station==='feed'?p.pendingFeedG:0,pondId:p.id,active:station==='feed'&&!!native?.feeding});
  if(p.biofilter)entities.push({id:id+'.filter',zone:'fish',kind:'fishEquipment',domainId:'water',x:home.x+1.8,z:home.z+3.5,width:.6,depth:.5,height:.7,value:p.filterPaidTicks,pondId:p.id,equipment:'filter',status:p.serviceStatus});
  if(view?.feederIds.includes(p.id))entities.push({id:id+'.feeder',zone:'fish',kind:'fishEquipment',domainId:'feed',x:home.x-1.8,z:home.z+3.5,width:.6,depth:.5,height:.8,value:Number(p.autoFeeder),pondId:p.id,equipment:'feeder',active:!!native?.feeding});
  if(native){const quotas=p.cohorts.map(()=>0);let total=0;for(let round=0;round<3;round++)for(const[i,c]of p.cohorts.entries())if(total<6&&quotas[i]<c.count){quotas[i]++;total++;}let offset=0;for(const[i,c]of p.cohorts.entries()){const visualCount=quotas[i];entities.push({id:id+'.school.'+c.id,zone:'fish',kind:'fishSchool',domainId:'pond',...home,width:3.5,depth:5,height:.35,value:c.count,pondId:p.id,scale:.35+.65*c.massG/FISH.maxMassG,stage:fishStage(c,state.tick),fishOffset:offset,visualCount,massG:c.massG,clarity:native.clarity,groundY:.27,activity:native.feeding?'feed':fishGrowthFactors(p).oxygen<500?'surface':state.tick%24<6||state.tick%24>=18?'rest':'swim'});offset+=visualCount;}}
 }
 return entities;
}
