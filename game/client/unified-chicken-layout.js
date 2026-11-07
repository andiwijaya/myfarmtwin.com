import {ZONE_REGISTRY,worldPoint} from './unified-world-registry.js';
/** Owned-yard presentation only. Unvisited yards get no fence or phantom flock.
 * @param {import('./chicken-state.js').ChickenState|undefined} chicken
 */
export function chickenLayout(chicken){
 if(!chicken?.visited||!chicken.coop)return null;const level=chicken.coop.level,b=ZONE_REGISTRY.chicken.bounds;
 const fence=Object.freeze({minX:b.minX+.8,maxX:b.maxX-.8,minZ:b.minZ+.8,maxZ:b.maxZ-.8,gateX:ZONE_REGISTRY.chicken.entry.x,gap:1.5});
 const spots=[[-2,1],[0,1],[1,1],[0,0],[-2,0],[1,-1]];if(level===2){spots[3]=[0,2.5];spots[4]=[-2,2.5];spots[5]=[1.5,2.2];}
 const coop=worldPoint('chicken',-1,-2);return Object.freeze({fence,nest:worldPoint('chicken',-1,Math.max(0,-2+(2+level)/2+.65)),hens:Object.freeze(spots.map(([x,z])=>worldPoint('chicken',x,z))),roosts:Object.freeze([[-.5,-.25],[.5,-.25],[-.5,.55],[.5,.55],[-1.2,.55],[1.2,.55]].map(([x,z])=>Object.freeze({x:coop.x+x,z:coop.z+z}))),shade:chicken.coop.shade?Object.freeze({x:coop.x-((2+level)/2+1),z:coop.z,width:1.6,depth:2.5}):null});
}
/** Bounded lightweight fence segments and posts, with an actual front gate. @param {NonNullable<ReturnType<typeof chickenLayout>>['fence']} b */
export function chickenFenceParts(b){
 const edges=[{x:(b.minX+b.maxX)/2,z:b.minZ,width:b.maxX-b.minX,depth:.065},{x:b.minX,z:(b.minZ+b.maxZ)/2,width:.065,depth:b.maxZ-b.minZ},{x:b.maxX,z:(b.minZ+b.maxZ)/2,width:.065,depth:b.maxZ-b.minZ},{x:(b.minX+b.gateX-b.gap/2)/2,z:b.maxZ,width:b.gateX-b.gap/2-b.minX,depth:.065},{x:(b.gateX+b.gap/2+b.maxX)/2,z:b.maxZ,width:b.maxX-b.gateX-b.gap/2,depth:.065}];
 const posts=[[b.minX,b.minZ],[b.maxX,b.minZ],[b.minX,b.maxZ],[b.maxX,b.maxZ],[b.gateX-b.gap/2,b.maxZ],[b.gateX+b.gap/2,b.maxZ],[(b.minX+b.maxX)/2,b.minZ],[b.minX,(b.minZ+b.maxZ)/2],[b.maxX,(b.minZ+b.maxZ)/2]];
 return Object.freeze([...edges.flatMap(e=>[.36,.64].map(y=>Object.freeze({...e,y,height:.07}))),...posts.map(([x,z])=>Object.freeze({x,z,y:.4,width:.1,depth:.1,height:.8}))]);
}
