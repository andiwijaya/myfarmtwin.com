/** UI preference only: invalid values cannot alter the engine or save schema. */
export const QUALITY_LEVELS=Object.freeze(['auto','high','low']);
/** @param {unknown} value @returns {'auto'|'high'|'low'} */
export function validWorldQuality(value){return value==='high'||value==='low'?value:'auto';}
/** @param {'auto'|'high'|'low'} quality @param {boolean} coarse @param {number} ratio */
export function worldQualityProfile(quality,coarse,ratio){const low=quality==='low',compact=quality==='auto'&&coarse;return Object.freeze({quality,low,atlasLow:low||compact,pixelRatio:low?1:Math.max(1,Math.min(Number.isFinite(ratio)?ratio:1,compact?1.25:1.5)),fine:!low&&!compact,shadows:!low});}
