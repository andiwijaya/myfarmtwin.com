export const MISSION_STEPS=[['missionSelect','tipSelect'],['missionPlant','tipPlant'],['missionWater','tipWater'],['missionGrow','tipGrow'],['missionHarvest','tipHarvest'],['missionSell','tipSell'],['missionBuild','tipBuild'],['missionComplete','tipComplete']];
export const FOLLOWUPS=Object.freeze(/** @type {const} */([{id:'order',title:'questOrder',tip:'questOrderTip'},{id:'hotCare',title:'questHot',tip:'questHotTip'},{id:'efficiency',title:'questEfficiency',tip:'questEfficiencyTip'}]));
/** @param {import('./engine.js').State} state */
export function currentObjective(state){if(state.mission.step<7)return MISSION_STEPS[state.mission.step];const next=FOLLOWUPS.find(q=>!state.followups[q.id]);return next?[next.title,next.tip]:['allMissions','allMissionsTip'];}
/** @param {import('./engine.js').State} state @param {import('./engine.js').DomainEvent[]} events */
export function advanceMission(state,events){
 /** @type {number[]} */const advanced=[];
 const has=(/** @type {string} */type)=>events.some(e=>e.type===type);
 let changed=true;
 while(changed){changed=false;const step=state.mission.step;
  const advance=(step===0&&(has('selected')||state.stats.planted>0))||(step===1&&state.stats.planted>0)||(step===2&&state.stats.cared>0)||(step===3&&(state.stats.harvested>0||state.plots.some(p=>p.crop&&p.crop.progress>=1)))||(step===4&&state.stats.harvested>0)||(step===5&&state.stats.sold>0)||(step===6&&state.pump.built);
  if(advance){state.mission.step++;advanced.push(state.mission.step);changed=true;}
 }
 return advanced;
}
