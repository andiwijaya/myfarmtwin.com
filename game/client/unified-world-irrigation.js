/** Read-only pipe geometry from installed pump and authoritative coverage IDs.
 * It conveys installed plumbing, never visual water flow or additional growth.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot
 */
export function irrigationRuns(snapshot){
 const pump=snapshot.entities.find(e=>e.kind==='pump');if(!pump||!snapshot.irrigationKnown)return Object.freeze([]);
 const runs=[];for(const id of snapshot.coveredPlotIds){const plot=snapshot.entities.find(e=>e.kind==='plot'&&e.domainId===id);if(!plot)continue;const dx=Math.abs(pump.x-plot.x),dz=Math.abs(pump.z-plot.z);if(dx>0)runs.push(Object.freeze({id:'pipe.'+id+'.x',plotId:id,x:(pump.x+plot.x)/2,z:pump.z,width:dx+.04,depth:.055,enabled:pump.value===1}));if(dz>0)runs.push(Object.freeze({id:'pipe.'+id+'.z',plotId:id,x:plot.x,z:(pump.z+plot.z)/2,width:.055,depth:dz+.04,enabled:pump.value===1}));}
 return Object.freeze(runs);
}
