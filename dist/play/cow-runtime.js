import {createCowKit} from './cow-state.js';
import {applyCowCare} from './cow-care.js';
import {COW} from './cow-config.js';
import {tickCowFeed,cowFeedBuyReason} from './cow-feed.js';
import {tickCowWater} from './cow-water.js';
import {tickCowWelfare} from './cow-welfare.js';
import {tickCowMilk} from './cow-milk.js';
import {applyCowMilking} from './cow-milking.js';
/** @typedef {(state:import('./engine.js').State,type:string,amount:number,id:string)=>void} CowTransaction */
/** @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {CowTransaction} transact */
export function applyCowCommand(state,command,events,transact){if(command.type==='enterCow'){if(state.cow?.visited)return 'cowAlreadyEntered';state.cow=createCowKit(state.tick);transact(state,'cow_starter_grant',0,'cow.starter.v1');events.push({type:'cowEntered'});return '';}if(command.type==='milkCow')return applyCowMilking(state,command,events);if(command.type==='buyCowFeed'){const reason=cowFeedBuyReason(state);if(reason)return reason;const g=state.cow;if(!g)return 'cowNotVisited';transact(state,'cow_feed_purchase',-COW.feedBagPrice,command.id+':cow.feed');g.feedStoreG+=COW.feedBagG;g.stats.feedBoughtG+=COW.feedBagG;events.push({type:'cowFeedBought',amount:COW.feedBagG});return '';}return applyCowCare(state,command,events);}
/** Owned Cow care advances only through the existing shared farm hour. @param {import('./engine.js').State} state */
export function tickCow(state){if(!state.cow?.visited)return;tickCowFeed(state);tickCowWater(state);tickCowWelfare(state);tickCowMilk(state);}
