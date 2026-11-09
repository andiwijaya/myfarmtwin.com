import {COZY_ART} from './unified-cozy-art.js';
import {ZONE_REGISTRY} from './unified-world-registry.js';
import {chickenFenceParts} from './unified-chicken-layout.js';
/** @typedef {{x:number,y:number,z:number,width:number,height:number,depth:number,color:string,rotation?:number,pitch?:number,tilt?:number,opacity?:number,fine?:boolean,fixed?:boolean,startupOptional?:boolean,feature?:string,shape?:'box'|'gable'|'bevel'|'cylinder'|'foliage'|'surface'|'disc'|'leaf',coveredTop?:boolean}} EnvironmentPart */
/** Bounded paving inside the existing path footprint. No new route or land grant.
 * @param {{x:number,z:number,width:number,depth:number}} path @returns {EnvironmentPart[]} */
export function pathDetailParts(path){
 const horizontal=path.width>=path.depth,length=horizontal?path.width:path.depth,cross=horizontal?path.depth:path.width,n=Math.min(5,Math.max(1,Math.floor(length/3))),parts=/** @type {EnvironmentPart[]} */([]);
 for(const side of [-1,1])parts.push({x:path.x+(horizontal?0:side*(cross/2-.05)),y:.0001,z:path.z+(horizontal?side*(cross/2-.05):0),width:horizontal?length:.09,height:.0001,depth:horizontal?.09:length,color:'#b69b68',shape:'surface',fixed:true,feature:'trail-edge'});
 for(let i=0;i<n;i++){const along=(i-(n-1)/2)*length/n;parts.push({x:path.x+(horizontal?along:0),y:.00012,z:path.z+(horizontal?0:along),width:horizontal?Math.min(1.4,length/n*.6):cross*.55,height:.0001,depth:horizontal?cross*.55:Math.min(1.4,length/n*.6),color:i%2?'#d5bc8a':'#ceb37f',shape:'disc',fixed:true,fine:true,feature:'worn-trail'});}return parts;
}
/** Rounded original trees retain the four audited boundary footprints. Branches
 * connect to trunks/crowns; their contact shade is a modest flat decal.
 * @param {{x:number,z:number}} tree @returns {EnvironmentPart[]} */
export function treeParts(tree){const{x,z}=tree,p=COZY_ART.palette;return[
 {x:x+.08,y:.003,z:z-.08,width:1.25,height:.0002,depth:1.05,color:p.shade,opacity:.12,shape:'disc',feature:'tree-contact'},
 {x,y:.825,z,width:.16,height:1.65,depth:.18,color:p.woodDark,shape:'cylinder',fixed:true,feature:'tree-trunk'},
 {x:x-.13,y:1.45,z,width:.08,height:.7,depth:.09,color:p.woodDark,tilt:.5,fixed:true,fine:true,feature:'tree-branch'},
 {x:x+.13,y:1.6,z,width:.08,height:.7,depth:.09,color:p.wood,tilt:-.5,fixed:true,fine:true,feature:'tree-branch'},
 {x:x-.08,y:2.12,z:z-.13,width:1.16,height:1.1,depth:1,color:'#799a55',shape:'foliage',fixed:true,feature:'tree-crown'},
 {x:x+.15,y:2.3,z:z+.12,width:.96,height:.95,depth:1.03,color:'#8ca75e',shape:'foliage',fixed:true,feature:'tree-crown'},
 {x:x-.1,y:2.75,z:z+.06,width:.92,height:.85,depth:.9,color:'#a3ba6b',shape:'foliage',fixed:true,feature:'tree-crown'}
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
