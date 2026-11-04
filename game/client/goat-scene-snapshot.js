/** Scene-only reference for the M1 presentation gate. This never grants or persists animals. */
/** @typedef {{id:string,stage:'weaned'|'growing'|'marketReady'}} GoatView */
/** @type {{herd:readonly GoatView[]}} */
export const GOAT_SCENE_PREVIEW=Object.freeze({herd:Object.freeze([
 Object.freeze({id:'goat.starter.adult',stage:'marketReady'}),
 Object.freeze({id:'goat.starter.young.1',stage:'weaned'}),
 Object.freeze({id:'goat.starter.young.2',stage:'weaned'})
])});
