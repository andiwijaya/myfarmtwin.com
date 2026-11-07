import {dispatch} from './engine.js';
/** Query the existing pure reducer, discarding its cloned candidate state/events.
 * No save, command queue, clock or RNG instance is owned by this UI helper.
 * @param {import('./engine.js').State} state
 * @param {import('./engine.js').CommandType} type
 * @param {Partial<import('./engine.js').Command>} [extra] */
export function worldActionAvailability(state,type,extra={}){const result=dispatch(state,{...extra,id:state.revision+1,type});return Object.freeze({allowed:result.ok,reason:result.error});}
