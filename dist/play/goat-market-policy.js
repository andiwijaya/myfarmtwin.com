import {GOAT} from './goat-config.js';import {goatCapacities,goatStage} from './goat-state.js';
/** Live livestock only; biological stage, welfare and social group all matter. @param {import('./engine.js').State} state @param {string} id */
export function goatSaleReason(state,id){const g=state.goat;if(!g?.visited)return 'goatNotVisited';const goat=g.herd.find(h=>h.id===id);if(!goat)return 'goatMissing';if(g.herd.length<=2)return 'goatSocialMinimum';if(goatStage(goat)!=='marketReady')return 'goatNotReady';if(goat.condition<GOAT.readyCondition)return 'goatLowCondition';return '';}
/** Stable derived contract/quote. No UI-frame time, wall clock or new random stream. @param {import('./engine.js').State} state @param {string} id */
export function goatQuote(state,id){const reason=goatSaleReason(state,id),goat=state.goat?.herd.find(h=>h.id===id);return {id:'goat.contract.'+id,goatId:id,price:reason||!goat?0:Math.round(130+35*goat.condition+5*(Math.floor(state.tick/24)%4)),reason,herdAfter:Math.max(0,(state.goat?.herd.length||0)-1)};}
/** @param {import('./engine.js').State} state */
export function goatBuyReason(state){const g=state.goat;if(!g?.visited)return 'goatNotVisited';if(g.herd.length>=goatCapacities(g).herd)return 'goatShelterFull';if(g.nextGoat>GOAT.registryMax)return 'goatRegistryFull';if(state.coins<GOAT.weanedPrice)return 'noCoins';return '';}
