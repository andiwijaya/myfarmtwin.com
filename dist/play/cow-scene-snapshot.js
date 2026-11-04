import {cowCapacity} from './cow-state.js';
/** Read-only detached presentation of actual saved ownership. @param {import('./engine.js').State} state */
export function cowSnapshot(state){const g=state.cow;return {herd:g?.visited?g.cows.map(c=>({id:c.id,lactating:c.lactationStatus==='lactating',priorCalving:c.priorCalving,milkReadyMl:c.milkReadyMl,stage:c.lactationStage})):[],capacity:g?cowCapacity(g).cows:2};}
