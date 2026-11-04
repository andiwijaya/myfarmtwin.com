import {createCowKit} from './cow-state.js';
import {applyCowCare} from './cow-care.js';
import {COW,COW_ORDERS} from './cow-config.js';
import {tickCowFeed,cowFeedBuyReason} from './cow-feed.js';
import {tickCowWater} from './cow-water.js';
import {tickCowWelfare} from './cow-welfare.js';
import {tickCowMilk} from './cow-milk.js';
import {applyCowRecovery} from './cow-recovery.js';
import {applyCowUpgrade} from './cow-upgrades.js';
import {applyCowSale} from './cow-sales.js';
import {applyCowStorage,tickCowStorage} from './cow-storage.js';
import {applyCowMilking} from './cow-milking.js';
/** @typedef {(state:import('./engine.js').State,type:string,amount:number,id:string)=>void} CowTransaction */
/** @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {CowTransaction} transact */
export function applyCowCommand(state,command,events,transact){if(command.type==='enterCow'){if(state.cow?.visited)return 'cowAlreadyEntered';state.cow=createCowKit(state.tick);transact(state,'cow_starter_grant',0,'cow.starter.v1');events.push({type:'cowEntered'});return '';}if(['startCowCareJob','completeCowCareJob'].includes(command.type))return applyCowRecovery(state,command,events,transact);if(['viewCowUpgrade','buyCowTrough'].includes(command.type))return applyCowUpgrade(state,command,events,transact);if(command.type==='acceptCowOrder'){const g=state.cow;if(!g?.visited||!g.grants.includes('cow.welcome')||!COW_ORDERS.some(o=>o.id===command.cowOrder)||g.orders.completedIds.includes(command.cowOrder||'')||g.orders.acceptedId===command.cowOrder)return 'cowOrderLocked';g.orders.acceptedId=command.cowOrder||'';events.push({type:'cowOrderAccepted'});return '';}if(command.type==='sellCowMilk')return applyCowSale(state,command,events,transact);if(['moveCowMilk','discardCowMilk','toggleCowCooler'].includes(command.type))return applyCowStorage(state,command,events);if(command.type==='milkCow')return applyCowMilking(state,command,events);if(command.type==='buyCowFeed'){const reason=cowFeedBuyReason(state);if(reason)return reason;const g=state.cow;if(!g)return 'cowNotVisited';transact(state,'cow_feed_purchase',-COW.feedBagPrice,command.id+':cow.feed');g.feedStoreG+=COW.feedBagG;g.stats.feedBoughtG+=COW.feedBagG;events.push({type:'cowFeedBought',amount:COW.feedBagG});return '';}return applyCowCare(state,command,events);}
/** Owned Cow care advances only through the existing shared farm hour. @param {import('./engine.js').State} state @param {CowTransaction} transact */
export function tickCow(state,transact){if(!state.cow?.visited)return;tickCowStorage(state,transact);tickCowFeed(state);tickCowWater(state);tickCowWelfare(state);tickCowMilk(state);}
