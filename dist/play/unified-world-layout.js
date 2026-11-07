import {PATH_NETWORK,PATH_NODES,ZONE_REGISTRY} from './unified-world-registry.js';
/** Static presentation footprints. No visited state, grants or simulation inputs. */
export const WORLD_PATHS=Object.freeze(PATH_NETWORK.map(edge=>{const a=PATH_NODES[edge.from],b=PATH_NODES[edge.to];return Object.freeze({id:edge.id,x:(a.x+b.x)/2,z:(a.z+b.z)/2,width:a.x===b.x?edge.width:Math.abs(a.x-b.x)+.2,depth:a.z===b.z?edge.width:Math.abs(a.z-b.z)+.2});}));
export const MARKET_PLAZA=Object.freeze({id:'market.plaza',x:5,z:2.2,width:4,depth:2});
export const WORLD_SIGNS=Object.freeze(Object.values(ZONE_REGISTRY).map(zone=>Object.freeze({id:'zone.'+zone.id,zone:zone.id,x:zone.entry.x,z:zone.entry.z,width:.9,depth:.12,height:1.5})));
/** @param {string} id @param {string} locale */
export function zoneLabel(id,locale){const names=/** @type {Record<string,readonly [string,string]>} */({field:['Crop Field','Kebun'],chicken:['Chicken area','Area ayam'],goat:['Goat area','Area kambing'],cow:['Cow area','Area sapi'],fish:['Pond area','Area ikan'],market:['Market','Pasar'],future:['Reserved land','Lahan cadangan']});return names[id]?.[locale==='id'?1:0]||'';}
