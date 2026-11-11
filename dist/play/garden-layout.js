/** Presentation only: retain native IDs and simulation/irrigation coordinates. */
const slots=[[1,0],[2,0],[3,0],[1,1],[2,1],[3,1],[1,2],[2,2]];
for(let row=0;row<4;row++)for(let col=0;col<6;col++)if(!slots.some(([c,r])=>c===col&&r===row))slots.push([col,row]);
export const GARDEN_SLOTS=Object.freeze(slots.map(([col,row])=>Object.freeze({col,row,x:-9+col*1.4,z:3.55+row*1.17})));
export const GARDEN_PUMP=Object.freeze({x:-.65,z:4.72});
/** @param {number} id */
export function gardenPlotPoint(id){const slot=GARDEN_SLOTS[id];if(!slot)throw new RangeError('Unknown garden plot');return {x:slot.x,z:slot.z};}
/** Walkways between rows; no gameplay or collision state.
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function gardenPathParts(){return [0,1,2].map(row=>({x:-5.5,y:0,z:4.135+row*1.17,width:8.1,height:.0001,depth:.2,color:'#bca77d',shape:'surface',feature:'garden-row-path',startupOptional:false}));}
