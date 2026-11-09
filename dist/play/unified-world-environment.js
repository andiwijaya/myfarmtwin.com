import {WORLD_STYLE as S} from './unified-world-style.js';
import {ZONE_REGISTRY} from './unified-world-registry.js';
import {chickenFenceParts} from './unified-chicken-layout.js';
/** @typedef {{x:number,y:number,z:number,width:number,height:number,depth:number,color:string,rotation?:number,pitch?:number,tilt?:number,opacity?:number,fine?:boolean,fixed?:boolean,startupOptional?:boolean,feature?:string,shape?:'box'|'gable'|'bevel'|'cylinder'|'foliage'|'surface'|'disc'|'leaf',coveredTop?:boolean}} EnvironmentPart */
/** Bounded paving inside the existing path footprint. No new route or land grant.
 * @param {{x:number,z:number,width:number,depth:number}} path @returns {EnvironmentPart[]} */
export function pathDetailParts(path){
 const horizontal=path.width>=path.depth,length=horizontal?path.width:path.depth,cross=horizontal?path.depth:path.width,n=Math.min(8,Math.max(1,Math.floor(length/2.6))),parts=/** @type {EnvironmentPart[]} */([]);
 for(const side of [-1,1])parts.push({x:path.x+(horizontal?0:side*(cross/2-.035)),y:.031,z:path.z+(horizontal?side*(cross/2-.035):0),width:horizontal?length:.055,height:.012,depth:horizontal?.055:length,color:'#a48c60'});
 for(let i=0;i<n;i++){const along=(i-(n-1)/2)*length/n;parts.push({x:path.x+(horizontal?along:0),y:.036,z:path.z+(horizontal?0:along),width:horizontal?Math.min(.7,length/n*.6):cross*.72,height:.015,depth:horizontal?cross*.72:Math.min(.7,length/n*.6),color:i%2?'#dfcda4':'#d9c398',fine:true});}return parts;
}
/** Faceted foliage stays inside the already-audited boundary tree footprint.
 * @param {{x:number,z:number}} tree @returns {EnvironmentPart[]} */
export function treeParts(tree){const{x,z}=tree;return[
 {x:x+.2,y:.003,z:z-.2,width:1.35,height:.003,depth:1.05,color:'#344b38',opacity:.1},
 {x,y:.8,z,width:.22,height:1.6,depth:.22,color:S.trunk},
 ...[[-.3,1.9,0],[.3,2,0],[0,1.8,-.3],[0,1.9,.3],[0,2.5,0]].map(([dx,y,dz],i)=>({x:x+dx,y,z:z+dz,width:i===4?.8:.72,height:i===4?.65:.85,depth:i===4?.8:.72,color:i%2?'#6b8c49':'#789b50',fine:i===3}))
 ];}
/** Native plot-owned timber rim and furrows, contained within its footprint.
 * @param {{width:number,depth:number,value:number}} plot @returns {EnvironmentPart[]} */
export function bedDetailParts(plot){const w=plot.width,d=plot.depth,t=.035;return[
 ...[-1,1].map(side=>({x:side*(w-t)/2,y:.075,z:0,width:t,height:.15,depth:d,color:'#9b7a50'})),
 ...[-1,1].map(side=>({x:0,y:.075,z:side*(d-t)/2,width:w-2*t,height:.15,depth:t,color:'#9b7a50'})),
 ...[-.22,.22].map(x=>({x,y:.123,z:0,width:.018,height:.005,depth:d*.72,color:plot.value>.4?'#503e30':'#85603d',fine:true}))
 ];}
/** Perimeter fences surround all native care routes, with real path openings.
 * @param {'goat'|'cow'} zone @returns {EnvironmentPart[]} */
export function ranchFenceParts(zone){const b=ZONE_REGISTRY[zone].bounds,pad=zone==='goat'?.6:.4,minX=b.minX-pad,maxX=b.maxX+(zone==='goat'?1:.4),minZ=b.minZ-(zone==='cow'?.3:.4),maxZ=b.maxZ+.4,gateX=ZONE_REGISTRY[zone].entry.x;
 return chickenFenceParts({minX,maxX,minZ,maxZ,gateX,gap:zone==='goat'?4:4.5}).map(p=>({x:p.x,y:p.y,z:zone==='cow'?minZ+maxZ-p.z:p.z,width:p.width,height:p.height,depth:p.depth,color:'#96774f'}));}
