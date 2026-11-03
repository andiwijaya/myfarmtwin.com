export const MISSION_STEPS=[['missionSelect','tipSelect'],['missionPlant','tipPlant'],['missionWater','tipWater'],['missionGrow','tipGrow'],['missionHarvest','tipHarvest'],['missionSell','tipSell'],['missionBuild','tipBuild'],['missionComplete','tipComplete']];
/** @param {import('./engine.js').State} state @param {import('./engine.js').DomainEvent[]} events */
export function advanceMission(state,events){
 /** @type {number[]} */const advanced=[];
 const has=(/** @type {string} */type)=>events.some(e=>e.type===type);
 let changed=true;
 while(changed){changed=false;const step=state.mission.step;
  const advance=(step===0&&(has('selected')||has('planted')))||(step===1&&has('planted'))||(step===2&&events.some(e=>e.type==='watered'&&state.plots.find(p=>p.id===e.plot)?.crop))||(step===3&&state.plots.some(p=>p.crop&&p.crop.progress>=1))||(step===4&&has('harvested'))||(step===5&&has('sold'))||(step===6&&has('pumpBuilt'));
  if(advance){state.mission.step++;advanced.push(state.mission.step);changed=true;}
 }
 return advanced;
}
