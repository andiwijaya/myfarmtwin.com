import {GOAT} from './goat-config.js';import {goatCapacities,goatStage} from './goat-state.js';
/** Live livestock only; biological stage, welfare and social group all matter. @param {import('./engine.js').State} state @param {string} id */
export function goatSaleReason(state,id){const g=state.goat;if(!g?.visited)return 'goatNotVisited';const goat=g.herd.find(h=>h.id===id);if(!goat)return 'goatMissing';if(g.herd.length<=2)return 'goatSocialMinimum';if(goatStage(goat)!=='marketReady')return 'goatNotReady';if(goat.condition<GOAT.readyCondition)return 'goatLowCondition';return '';}
/** Deterministic historical quote used by both live Market and save validation. @param {number} condition @param {number} tick */
export const goatPrice=(condition,tick)=>Math.round(130+35*condition+5*(Math.floor(tick/24)%4));
/** Stable derived contract/quote. No UI-frame time, wall clock or new random stream. @param {import('./engine.js').State} state @param {string} id */
export function goatQuote(state,id){const reason=goatSaleReason(state,id),goat=state.goat?.herd.find(h=>h.id===id);return {id:'goat.contract.'+id,goatId:id,price:reason||!goat?0:goatPrice(goat.condition,state.tick),reason,herdAfter:Math.max(0,(state.goat?.herd.length||0)-1)};}

/** The one-time tutorial sale teaches actual care before the ready-adult contract. @param {import('./engine.js').State} state @param {string} id */
export function goatContractReason(state,id){const reason=goatSaleReason(state,id),g=state.goat;if(reason)return reason;if(!g)return 'goatNotVisited';if(g.stats.sold===0&&(!g.stats.feedActions||!g.stats.waterActions||!g.stats.cleaned||!g.mission.inspectedAdult))return 'goatCareFirst';return '';}
/** @param {import('./engine.js').State} state */
export function goatBuyReason(state){const g=state.goat;if(!g?.visited)return 'goatNotVisited';if(g.herd.length>=goatCapacities(g).herd)return 'goatShelterFull';if(g.nextGoat>GOAT.registryMax)return 'goatRegistryFull';if(state.coins<GOAT.weanedPrice)return 'noCoins';return '';}
