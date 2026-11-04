import {COW_ORDERS} from './cow-config.js';
/** Orders have no timer or fees; the first real delivery unlocks the two larger objectives. @param {import('./engine.js').State} state @param {string} id */
export function cowOrderUnlockReason(state,id){const g=state.cow;if(!g?.visited||!g.grants.includes('cow.welcome')||!COW_ORDERS.some(o=>o.id===id))return 'cowOrderLocked';if(g.orders.completedIds.includes(id))return 'cowOrderDone';if(id!=='cow.delivery'&&!g.orders.completedIds.includes('cow.delivery'))return 'cowFirstContractFirst';return '';}
/** @param {import('./engine.js').State} state @param {string} id */
export function cowOrderAcceptReason(state,id){return cowOrderUnlockReason(state,id)||(state.cow?.orders.acceptedId===id?'cowOrderActive':'');}
