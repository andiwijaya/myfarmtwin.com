/** Scene-only reference for the M1 presentation gate. This never grants or persists animals. */
/** @typedef {{id:string,stage:'weaned'|'growing'|'marketReady',activity?:'idle'|'walk'|'browse'|'chew'|'rest'|'climb'}} GoatView */
/** @type {{herd:readonly GoatView[]}} */
export const GOAT_SCENE_PREVIEW=Object.freeze({herd:Object.freeze([
 Object.freeze({id:'goat.starter.adult',stage:'marketReady'}),
 Object.freeze({id:'goat.starter.young.1',stage:'weaned'}),
 Object.freeze({id:'goat.starter.young.2',stage:'weaned'})
])});
/** Cosmetic activity only. Never uses wall-clock time or advances a simulation. @param {number} tick */
export function goatSceneSnapshot(tick){
 const activities=/** @type {const} */(['idle','walk','browse','chew','rest','climb']);
 return {herd:GOAT_SCENE_PREVIEW.herd.map((goat,index)=>({...goat,activity:activities[(Math.floor(tick/3)+index)%activities.length]}))};
}
