import {resolveWorldSelection} from './unified-world-model.js';
/** Map the native guide's existing target to a real current scene object.
 * This resolves coordinates only; it never selects, enters, or dispatches.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot
 * @param {string|null|undefined} target
 * @param {{contextZone?:string,plotId?:number|null,fishPondId?:number}} [context]
 * @returns {string|null}
 */
export function objectiveEntity(snapshot,target,context={}){
 if(!target)return null;
 const entities=snapshot.entities,first=(/** @type {string} */zone)=>entities.find(e=>e.zone===zone)?.id||null;
 const area=target.match(/^#area-(field|chicken|goat|cow|fish)$/);if(area)return first(area[1]);
 if(['#market-open','#buy-pump','#expand','#upgrade-efficiency'].includes(target))return entities.find(e=>e.kind==='market')?.id||null;
 const choose=target.match(/^\[data-choose-(plot|chicken|goat|cow|fish)=(?:"([^"]+)"|'([^']+)'|([^\]\s]+))\]$/);
 if(choose){const kind=choose[1],id=choose[2]??choose[3]??choose[4];return entities.find(e=>{const selection=resolveWorldSelection(snapshot,e.id);return selection?.kind===kind&&String(selection.domainId)===id&&(kind!=='fish'||selection.pondId===(context.fishPondId??1));})?.id||null;}
 if(['.plot-shortcuts','#plant','#water','#harvest','#weather-name'].includes(target)||(target==='#next-day'&&(context.contextZone??'field')==='field'))return entities.find(e=>e.kind==='plot'&&e.domainId===context.plotId)?.id||entities.find(e=>e.kind==='plot')?.id||null;
 if(target==='#next-day')return first(context.contextZone||'field');
 return null;
}
