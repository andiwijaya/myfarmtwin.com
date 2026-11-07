/** Camera/selection-only dollhouse rule. No domain commands, transparency or invisible picking proxies. */
export const CUTAWAY_KINDS=Object.freeze(['coop','goatShelter','cowBarn']);
/** Solid shells open only in the focused or selected livestock district. Other buildings keep their roofs.
 * The remaining real floor/posts retain building selection in both renderers.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} entity @param {string} focusedZone @param {string|undefined} selectedZone
 */
export function useCutaway(entity,focusedZone,selectedZone){return CUTAWAY_KINDS.includes(entity.kind)&&(entity.zone===focusedZone||entity.zone===selectedZone);}
