import {COW} from './cow-config.js';import {consumeCowResource,approachCowIndex} from './cow-math.js';
/** Explicit per-cow integer division remainder gives exactly8000g per24 ordinary hours. @param {import('./engine.js').State} state */
export function tickCowFeed(state){const g=state.cow;if(!g?.visited)return {demand:0,intake:0,adequacy:0};let demand=0;for(const cow of g.cows){const numerator=COW.feedDayG+cow.feedDemandRemainder;demand+=Math.floor(numerator/24);cow.feedDemandRemainder=numerator%24;}const intake=consumeCowResource(g,'feed',demand),adequacy=demand?Math.floor(intake*COW.careScale/demand):0;for(const cow of g.cows)cow.nutrition=approachCowIndex(cow.nutrition,adequacy);return {demand,intake,adequacy};}
/** @param {import('./engine.js').State} state */
export function cowFeedBuyReason(state){const g=state.cow;if(!g?.visited)return 'cowNotVisited';return g.feedStoreG+COW.feedBagG>COW.feedStoreMaxG?'cowFeedStoreFull':state.coins<COW.feedBagPrice?'noCoins':'';}
