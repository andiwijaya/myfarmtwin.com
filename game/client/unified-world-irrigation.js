/** Read-only pipe geometry from installed pump and authoritative coverage IDs.
 * It conveys installed plumbing, never visual water flow or additional growth.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot
 */
export function irrigationRuns(snapshot){
 const pump=snapshot.entities.find(e=>e.kind==='pump');if(!pump||!snapshot.irrigationKnown)return Object.freeze([]);
 const runs=[];for(const id of snapshot.coveredPlotIds){const plot=snapshot.entities.find(e=>e.kind==='plot'&&e.domainId===id);if(!plot)continue;const dx=Math.abs(pump.x-plot.x),dz=Math.abs(pump.z-plot.z);if(dx>0)runs.push(Object.freeze({id:'pipe.'+id+'.x',plotId:id,x:(pump.x+plot.x)/2,z:pump.z,width:dx+.04,depth:.055,enabled:pump.value===1}));if(dz>0)runs.push(Object.freeze({id:'pipe.'+id+'.z',plotId:id,x:plot.x,z:(pump.z+plot.z)/2,width:.055,depth:dz+.04,enabled:pump.value===1}));}
 return Object.freeze(runs);
}

/** Rounded installed pipes, without animated/imagined water flow.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function irrigationParts(snapshot){
 const parts=/** @type {import('./unified-world-environment.js').EnvironmentPart[]} */([]);
 for(const run of irrigationRuns(snapshot)){
  const horizontal=run.width>run.depth,length=horizontal?run.width:run.depth,axis=horizontal?{tilt:-Math.PI/2}:{pitch:Math.PI/2};
  parts.push({x:run.x,y:.035,z:run.z,width:.07,height:length,depth:.07,color:run.enabled?'#689eac':'#889e87',shape:'cylinder',feature:'installed-pipe',startupOptional:false,...axis});
  for(const side of [-1,1])parts.push({x:run.x+(horizontal?side*length*.3:0),y:.04,z:run.z+(horizontal?0:side*length*.3),width:.08,height:.05,depth:.08,color:'#7c8c83',shape:'cylinder',feature:'pipe-collar',fine:true,startupOptional:true,...axis});
 }
 return parts;
}
