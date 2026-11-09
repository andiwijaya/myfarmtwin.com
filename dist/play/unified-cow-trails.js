import {ZONE_REGISTRY} from './unified-world-registry.js';
import {visibilityRoute} from './unified-world-motion.js';
import {COZY_ART} from './unified-cozy-art.js';

/** Decorative footpaths, not new simulation routes or obstacles. Their geometry
 * is memoized by native layout only; stock/clock changes never rerun routing.
 * @typedef {Readonly<{x:number,z:number}>} Point
 * @typedef {Readonly<{id:string,points:readonly Point[]}>} Trail
 */
const WIDTH=.72,MARGIN=WIDTH/2+.08;
/** @type {string} */let cachedKey='';
/** @type {readonly Trail[]} */let cachedRoutes=Object.freeze([]);
/** @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot
 * @returns {readonly Trail[]} */
export function cowTrailRoutes(snapshot){
 if(!snapshot.cowStarted)return Object.freeze([]);
 const objects=snapshot.entities.filter(e=>e.zone==='cow'&&['cowBarn','cowStation'].includes(e.kind)),key=JSON.stringify(objects.map(e=>[e.id,e.kind,e.domainId,e.x,e.z,e.width,e.depth]));if(key===cachedKey)return cachedRoutes;
 const entry=ZONE_REGISTRY.cow.entry,barn=objects.find(e=>e.kind==='cowBarn'),stand=objects.find(e=>e.domainId==='stand'),junction={x:entry.x+.85,z:stand?Math.min(entry.z+1.2,stand.z-stand.depth/2-MARGIN-.12):entry.z+1.2};
 /** @type {Trail[]} */const routes=[{id:'cow.trail.entry',points:[{...entry},junction]}];
 for(const target of objects){
  const isBarn=target.kind==='cowBarn',dx=junction.x-target.x,dz=junction.z-target.z,t=Math.min((target.width/2+.24)/Math.max(.00001,Math.abs(dx)),(target.depth/2+.24)/Math.max(.00001,Math.abs(dz))),end=isBarn?{x:target.x,z:target.z+target.depth/2+.52}:{x:target.x+dx*t,z:target.z+dz*t};
  const obstacles=[];for(const e of [barn,stand])if(e&&e!==target)obstacles.push({minX:e.x-e.width/2-MARGIN,maxX:e.x+e.width/2+MARGIN,minZ:e.z-e.depth/2-MARGIN,maxZ:e.z+e.depth/2+MARGIN});
  // Barn approaches still avoid the barn itself, ending outside its doorway.
  if(isBarn)obstacles.push({minX:target.x-target.width/2-MARGIN,maxX:target.x+target.width/2+MARGIN,minZ:target.z-target.depth/2-MARGIN,maxZ:target.z+target.depth/2+MARGIN});
  routes.push({id:'cow.trail.'+target.id,points:visibilityRoute(junction,end,obstacles)});
 }
 cachedRoutes=Object.freeze(routes.map(route=>Object.freeze({id:route.id,points:Object.freeze(route.points.map(p=>Object.freeze({...p})))})));cachedKey=key;return cachedRoutes;
}

/** Baked two-triangle strips and twelve-triangle round joins. These ground
 * planes use less geometry than thin 3D cylinders and remain visible on Low.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function cowTrailParts(snapshot){
 const p=COZY_ART.palette,parts=/** @type {import('./unified-world-environment.js').EnvironmentPart[]} */([]);
 for(const route of cowTrailRoutes(snapshot))for(const [width,y,color]of [[WIDTH+.16,.00085,p.trailEdge],[WIDTH,.0014,p.dirt]]){
  const w=/** @type {number} */(width),level=/** @type {number} */(y),tone=/** @type {string} */(color);
  for(const point of route.points)parts.push({x:point.x,y:level,z:point.z,width:w,height:.0001,depth:w,color:tone,feature:'care-trail',shape:'disc'});
  for(let i=1;i<route.points.length;i++){
   const a=route.points[i-1],b=route.points[i],length=Math.hypot(b.x-a.x,b.z-a.z);if(length<.00001)continue;
   parts.push({x:(a.x+b.x)/2,y:level,z:(a.z+b.z)/2,width:length,height:.0001,depth:w,color:tone,rotation:-Math.atan2(b.z-a.z,b.x-a.x),feature:'care-trail',shape:'surface'});
  }
 }
 return parts;
}
