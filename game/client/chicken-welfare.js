import {COOP_LEVELS,WELFARE} from './chicken-config.js';import {clamp} from './water.js';
/** Derived from the same live care factors; no mutation or random decoration. @param {import('./engine.js').State} state */
export function chickenWelfare(state){
 const c=state.chicken,q=c?.coop;if(!c?.visited||!q)return {score:0,feed:0,water:0,hygiene:0,space:0,shelter:0,reason:'chickenNotReady'};
 const feed=q.feedCare,water=q.waterCare,hygiene=q.cleanliness/100,space=clamp(1-.2*c.hens.length/COOP_LEVELS[q.level].capacity,0,1),shelter=state.weather==='hot'&&!q.shade?WELFARE.hotShelter:1;
 const score=clamp(feed*WELFARE.feedWeight+water*WELFARE.waterWeight+hygiene*WELFARE.hygieneWeight+space*WELFARE.spaceWeight+shelter*WELFARE.shelterWeight,0,1);
 const reason=water<.75?'chickenThirsty':feed<.75?'chickenHungry':hygiene<.7?'chickenDirty':shelter<1?'chickenHot':'chickenComfortable';
 return {score,feed,water,hygiene,space,shelter,reason};
}
