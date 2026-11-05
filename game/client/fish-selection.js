/** Transient presentation selection. Never serialized, dispatched or used as a resource. */
let selected=1;
/** @param {import('./engine.js').State} state */
export function selectedFishPond(state){if(!state.fish?.ponds.some(p=>p.id===selected))selected=1;return selected;}
/** @param {number} id @param {import('./engine.js').State} state */
export function chooseFishPond(id,state){if(!state.fish?.ponds.some(p=>p.id===id))return false;selected=id;return true;}
export function resetFishPond(){selected=1;}
