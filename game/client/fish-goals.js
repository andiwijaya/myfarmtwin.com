/** Fixed one-time milestones; no randomness, state mutation, clock or wallet work here. */
export const FISH_GOAL_REWARDS=Object.freeze({water:10,grow:15});
export const FISH_CONTRACTS=Object.freeze([{id:'fish.delivery',coins:10,grams:4000,gradeA:false},{id:'fish.quality',coins:15,grams:4000,gradeA:true},{id:'fish.volume',coins:20,grams:12000,gradeA:false}]);
/** @param {import('./fish-state.js').FishState} g @param {string} id */
export function fishGoalReady(g,id){return g.mission.completed.includes('first')&&(id==='water'?g.stats.healthyHours>=72:id==='grow'?g.stats.growOutCount>=4:false);}
/** @param {import('./fish-state.js').FishState} g @param {string} id */
export function fishContractReason(g,id){const c=FISH_CONTRACTS.find(c=>c.id===id);if(!c)return 'invalidFishCommand';if(g.contracts.includes(id))return 'fishContractDone';if(!g.mission.completed.includes('first')||g.stats.growOutCount<4||(c.gradeA?g.stats.soldAG:g.stats.soldG)<c.grams)return 'fishContractLocked';return '';}
