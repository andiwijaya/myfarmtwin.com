import {GOAT_REWARDS} from './goat-config.js';
/** @param {import('./engine.js').State} state */
export function advanceGoatMission(state){const g=state.goat;if(!g?.visited)return;const checks=[g.visited,g.stats.feedActions>0,g.stats.waterActions>0,g.stats.cleaned>0,g.mission.inspectedAdult,g.stats.sold>0,g.grants.includes('goat.chapter1'),g.stats.bought>0||(g.shelter?.level||0)>0];while(g.mission.step<checks.length&&checks[g.mission.step])g.mission.step++;}
/** Actual monotonic evidence; no click-count or wall-clock rewards. @param {import('./engine.js').State} state */
export function goatFollowups(state){const g=state.goat;return [
 {id:'goat.healthy',title:'goatGoalHealthy',detail:'goatGoalHealthyTip',target:'[data-choose-goat=hay]',ready:!!g&&g.stats.healthyHours>=72,progress:Math.min(72,g?.stats.healthyHours||0)+'/72 h'},
 {id:'goat.growing',title:'goatGoalGrowing',detail:'goatGoalGrowingTip',target:'[data-choose-goat=pasture]',ready:!!g&&(g.herd.some(h=>h.id!=='goat.starter.adult'&&h.growth>=.25)||g.sales.some(h=>h.id!=='goat.starter.adult')),progress:''},
 {id:'goat.pasture',title:'goatGoalPasture',detail:'goatGoalPastureTip',target:'[data-choose-goat=pasture]',ready:!!g&&g.paddocks.length===2&&g.stats.rotations>=2&&g.stats.restedBrowseG>0,progress:''},
 {id:'goat.bigger',title:'goatGoalBigger',detail:'goatGoalBiggerTip',target:'#market-open',ready:!!g&&(g.shelter?.level||0)>=1&&g.herd.length>=4,progress:''},
 {id:'goat.contract',title:'goatGoalContract',detail:'goatGoalContractTip',target:'#market-open',ready:!!g&&g.stats.sold>=2&&g.stats.bought>0,progress:''}
 ];}
/** Exactly-once awards within the existing atomic transaction. @param {import('./engine.js').State} state @param {import('./engine.js').DomainEvent[]} events @param {import('./chicken-runtime.js').Transaction} transact @param {number} commandId */
export function awardGoatRewards(state,events,transact,commandId){const g=state.goat;if(!g?.visited)return;const award=(/** @type {string} */id)=>{if(g.grants.includes(id))return;g.grants.push(id);const amount=GOAT_REWARDS[/** @type {keyof typeof GOAT_REWARDS} */(id)];transact(state,'mission_reward',amount,commandId+':'+id);events.push({type:'missionReward',amount});};if(g.mission.step>=6)award('goat.chapter1');advanceGoatMission(state);if(g.mission.step>=8)for(const goal of goatFollowups(state))if(goal.ready)award(goal.id);}
/** @param {import('./engine.js').State} state */
export function goatObjective(state){const g=state.goat,step=g?.mission.step||0,adult=g?.herd.find(h=>h.growth===1)?.id||g?.herd[0]?.id||'',targets=['#area-goat','[data-choose-goat=hay]','[data-choose-goat=water]','[data-choose-goat=clean]','[data-choose-goat="'+adult+'"]','#market-open','#market-open','#market-open',''];if(step===8){const next=goatFollowups(state).find(goal=>!g?.grants.includes(goal.id));if(next)return {...next,step};}return {step,title:'goatMission'+step,detail:'goatDetail'+step,target:targets[step]||'',progress:''};}
