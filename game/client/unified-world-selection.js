import {resolveWorldSelection} from './unified-world-model.js';import {ZONE_REGISTRY} from './unified-world-registry.js';
/** Camera focus and selected objects are independent UI state. No commands, storage or clocks.
 * Legacy area UI may read contextZone, but it never chooses a scene in the unified world.
 */
export function createWorldPresentation(){
 /** @type {{selectedEntity:string|null,focusZone:string,contextZone:string}} */let current=Object.freeze({selectedEntity:null,focusZone:'market',contextZone:'field'});
 return{
  view:()=>current,
  /** Only IDs present in the current immutable adapter snapshot may become selected.
   * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot @param {unknown} id
   */
  select(snapshot,id){const target=resolveWorldSelection(snapshot,id);if(!target)return null;const contextZone=target.kind==='plot'||target.kind==='pump'?'field':['chicken','goat','cow','fish'].includes(target.kind)?target.kind:current.contextZone;current=Object.freeze({...current,selectedEntity:target.entityId,contextZone});return target;},
  /** A camera bookmark preserves selection and context. @param {string} zone */
  focus(zone){if(Object.hasOwn(ZONE_REGISTRY,zone))current=Object.freeze({...current,focusZone:zone});return current;},
  /** Closing/removing an object retains the district context. @param {string} id */
  clear(id){if(current.selectedEntity===id)current=Object.freeze({...current,selectedEntity:null});return current;},
  /** New/imported saves clear selection/context, preserving camera-only focus. */
  reset(){current=Object.freeze({...current,selectedEntity:null,contextZone:'field'});return current;}
 };
}
