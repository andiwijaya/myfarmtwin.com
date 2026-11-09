/** Cache only what changes generated geometry. Plot progress/quality and all
 * live UI eligibility still come from each new read-only world snapshot.
 * Other entities retain the complete key so their actor bindings stay fresh.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e */
export function worldVisualKey(e){
 if(e.kind!=='plot')return JSON.stringify(e);
 return JSON.stringify([e.id,e.kind,e.x,e.z,e.width,e.height,e.depth,e.value>.4,e.covered,e.crop?e.crop.type:null,e.crop?e.crop.stage:null]);
}
