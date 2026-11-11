import {INITIAL_PLOTS,EXPANSION,LIMITS} from './config.js';

/** Empty functional beds use the existing stable native coordinates and IDs.
 * No wallet, seeds, clock, crop, mission or inventory grant accompanies layout.
 * @param {number} id */
export function createGardenPlot(id){const position=[...INITIAL_PLOTS,...EXPANSION.cells][id];return {id,x:position.x,y:position.y,soilWaterMm:12,soilCapacityMm:50,crop:null,waterAppliedMm:0,careCost:0,lastWaterTick:-1,history:[]};}
/** @returns {import('./engine.js').Plot[]} */
export function createGardenPlots(){return Array.from({length:LIMITS.plots},(_,id)=>createGardenPlot(id));}
/** Add the requested active beds, preserving every existing subtree exactly.
 * Schema V6 already supports all 24 beds; this is an additive layout upgrade.
 * @param {import('./engine.js').State} state @returns {import('./engine.js').State} */
export function activateGarden(state){
 if(state.plots.length===LIMITS.plots)return state;
 return {...state,plots:[...state.plots,...Array.from({length:LIMITS.plots-state.plots.length},(_,i)=>createGardenPlot(state.plots.length+i))]};
}
