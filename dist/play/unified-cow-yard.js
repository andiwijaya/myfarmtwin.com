import {COZY_ART} from './unified-cozy-art.js';
import {ZONE_REGISTRY} from './unified-world-registry.js';
import {ranchFenceParts} from './unified-world-environment.js';
import {cowTrailParts} from './unified-cow-trails.js';

/** Rounded, warm fence on exactly the existing native ranch footprint/gate.
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function cowFenceParts(){return ranchFenceParts('cow').map((part,i)=>({...part,shape:'bevel',color:part.height>.2?COZY_ART.palette.woodDark:COZY_ART.palette.wood,feature:'cow-fence',...((part.height>.2)?{width:.14,depth:.14,height:part.height+(i%3)*.025,y:part.height/2+(i%3)*.0125}:{})}));}

/** Original static scenery, never food/water/animals or new native obstacles.
 * Tall pieces stay outside the pen. Inside it, decoration stays below ankle
 * height and avoids native object footprints and the care circulation corridor.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function cowYardParts(snapshot){
 if(!snapshot.cowStarted)return[];
 const p=COZY_ART.palette,b=ZONE_REGISTRY.cow.bounds,parts=/** @type {import('./unified-world-environment.js').EnvironmentPart[]} */([]),native=snapshot.entities.filter(e=>e.zone==='cow');
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<import('./unified-world-environment.js').EnvironmentPart>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'foliage',...extra});
 // Soft edge of the pasture; it has no gameplay/capacity meaning.
 add((b.minX+b.maxX)/2,.00025,(b.minZ+b.maxZ)/2,b.maxX-b.minX+.2,.0005,b.maxZ-b.minZ+.2,'#a5c176','pasture',{shape:'disc'});
 const barn=native.find(e=>e.kind==='cowBarn');if(barn){
  const left=barn.x-barn.width/2,back=barn.z-barn.depth/2;
  add((b.minX+left)/2,.0006,(back+b.maxZ)/2,left-b.minX-.6,.0001,b.maxZ-back-.25,p.pasture,'pasture-contrast',{shape:'disc'});
  add(barn.x,.001,barn.z,barn.width+1.25,.001,barn.depth+1.05,p.dirt,'barn-apron',{shape:'disc'});
  if(barn.value<40)add(barn.x-barn.width*.25,.0025,barn.z+barn.depth*.35,.7,.001,.5,p.soil,'native-barn-dirt');
 }
 parts.push(...cowTrailParts(snapshot));
 for(const station of native.filter(e=>e.kind==='cowStation'))add(station.x,.0018,station.z,station.width+.5,.001,station.depth+.4,station.domainId==='water'?'#aac1a5':p.dirt,'care-pad',{shape:'disc'});
 // Authored repeatable placements, with no random generator or engine inputs.
 for(let i=0;i<28;i++){
  const x=b.minX+.5+(i*2.37)%(b.maxX-b.minX-1),z=b.minZ+.5+(i*3.71)%(b.maxZ-b.minZ-1);
  if(native.some(e=>Math.abs(x-e.x)<e.width/2+.7&&Math.abs(z-e.z)<e.depth/2+.7))continue;
  // The western care/animal corridor is deliberately free of raised props.
  if(x<19&&z<12.5)continue;
  for(const side of [-1,0,1])add(x+side*.1,.085+Math.abs(side)*.015,z+side*.045,.13,.17+Math.abs(side)*.03,.095,i%2?p.grassLight:'#7fa65d','grass-tuft',{fine:true,tilt:side*.3});
 }
 for(const [x,z,scale]of [[10.8,15.8,.9],[28.5,15.3,1]]){
  add(x,1.02*scale,z,.24*scale,2.04*scale,.26*scale,p.woodDark,'tree-trunk',{shape:'cylinder',tilt:.055});
  for(const [dx,y,dz,size]of [[-.36,2.1,.08,1.25],[.32,2.35,-.08,1.2],[0,2.75,.02,1.1],[.02,2.15,.38,1.05]])add(x+dx*scale,y*scale,z+dz*scale,size*scale,size*.92*scale,size*scale,y>2.5?p.grassLight:'#729a56','tree-crown');
  add(x+.12,.001,z+.05,1.35*scale,.001,1.1*scale,'#79965d','tree-contact',{shape:'disc'});
 }
 return parts;
}
