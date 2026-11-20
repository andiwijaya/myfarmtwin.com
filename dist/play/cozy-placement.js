/** Invisible mathematical placement bounds; all visible geometry is loaded from GLB. */
import {HOUSE_CLEARANCE,HOUSE_KIND,HOUSE_LEVELS,HOUSE_PLOT,HOUSE_SITE} from './cozy-houses.js';

/** @type {Readonly<Record<string,{width:number,depth:number,price:number,limit:number,starter?:boolean}>>} */
export const COZY_BUILD_CATALOG=Object.freeze({
 bed:{width:1.5,depth:1.8,price:18,limit:64},barn:{width:10,depth:8,price:220,limit:4,starter:true},coop:{width:9,depth:7,price:100,limit:4,starter:true},goatShelter:{width:11,depth:9,price:180,limit:4,starter:true},pond:{width:12,depth:10,price:150,limit:4,starter:true},market:{width:7,depth:6,price:140,limit:2},house:{...HOUSE_PLOT,price:HOUSE_LEVELS[0].price,limit:1},pump:{width:1,depth:1,price:80,limit:4},path:{width:2,depth:2,price:1,limit:180},fence:{width:2,depth:.16,price:2,limit:120},tree:{width:2.2,depth:2.2,price:8,limit:30},banana:{width:1.8,depth:1.8,price:6,limit:30},grass:{width:.7,depth:.7,price:0,limit:80}
});
export const COZY_FACILITY_KINDS=Object.freeze(['barn','coop','goatShelter','pond','market','pump']);
export const COZY_LAND_BOUNDS=Object.freeze([{minX:-28,maxX:28,minZ:-24,maxZ:24},{minX:-35,maxX:35,minZ:-28,maxZ:28},{minX:-42,maxX:42,minZ:-32,maxZ:32}]);
const TAU=Math.PI*2,passable=new Set(['path','grass']);
const livestockBuildings=new Set(['barn','coop','goatShelter']);
/** @param {number} n */
export function normalizeRotation(n){return ((n%TAU)+TAU)%TAU;}
/** @param {import("./cozy-domain.js").Placement} p */
export function placementBox(p){const d=COZY_BUILD_CATALOG[p.kind];if(!d)throw Error('layoutInvalid');const c=Math.cos(p.rotation),s=Math.sin(p.rotation);return {p,axes:[{x:c,z:-s},{x:s,z:c}],half:[d.width/2,d.depth/2],xExtent:Math.abs(c)*d.width/2+Math.abs(s)*d.depth/2,zExtent:Math.abs(s)*d.width/2+Math.abs(c)*d.depth/2};}
/** @param {import("./cozy-domain.js").Placement} a @param {import("./cozy-domain.js").Placement} b @param {number} [clearance] */
export function placementsOverlap(a,b,clearance=0){const aa=placementBox(a),bb=placementBox(b),dx=b.x-a.x,dz=b.z-a.z;for(const axis of [...aa.axes,...bb.axes]){const d=Math.abs(dx*axis.x+dz*axis.z),ra=aa.half.reduce((n,h,i)=>n+h*Math.abs(aa.axes[i].x*axis.x+aa.axes[i].z*axis.z),0),rb=bb.half.reduce((n,h,i)=>n+h*Math.abs(bb.axes[i].x*axis.x+bb.axes[i].z*axis.z),0);if(d>=ra+rb+clearance-1e-5)return false;}return true;}
/** @param {import("./cozy-domain.js").Placement} p */
function door(p){if(!['barn','coop','goatShelter','market'].includes(p.kind))return null;const d=COZY_BUILD_CATALOG[p.kind],r=p.rotation;return {id:p.id+'.door',kind:'path',x:p.x+Math.sin(r)*(d.depth/2+1),z:p.z+Math.cos(r)*(d.depth/2+1),rotation:r};}
/** @param {import("./cozy-domain.js").CozyState} state @param {import("./cozy-domain.js").Placement} p */
export function placementIssue(state,p){
 if(!p||typeof p!=='object'||!Object.hasOwn(COZY_BUILD_CATALOG,p.kind)||typeof p.id!=='string'||!p.id||p.id.length>90||![p.x,p.z,p.rotation].every(n=>typeof n==='number'&&Number.isFinite(n))||p.rotation<0||p.rotation>=TAU)return 'layoutInvalid';
 const b=placementBox(p),bounds=COZY_LAND_BOUNDS[state.land.level];if(!bounds||p.x-b.xExtent<bounds.minX||p.x+b.xExtent>bounds.maxX||p.z-b.zExtent<bounds.minZ||p.z+b.zExtent>bounds.maxZ)return 'layoutOutsideFarm';
 const doorway=door(p);if(doorway){const db=placementBox(doorway);if(doorway.x-db.xExtent<bounds.minX||doorway.x+db.xExtent>bounds.maxX||doorway.z-db.zExtent<bounds.minZ||doorway.z+db.zExtent>bounds.maxZ)return 'layoutAccess';}
 for(const other of state.layout.items){
  if(other.id===p.id)continue;
  const houseAndLivestock=(p.kind===HOUSE_KIND&&livestockBuildings.has(other.kind))||(other.kind===HOUSE_KIND&&livestockBuildings.has(p.kind));
  if(houseAndLivestock&&placementsOverlap(p,other,HOUSE_CLEARANCE))return 'houseLivestockClearance';
  if(placementsOverlap(p,other)&&!(passable.has(p.kind)&&passable.has(other.kind)))return 'layoutOccupied';
  if(!passable.has(other.kind)&&doorway&&placementsOverlap(doorway,other))return 'layoutAccess';
  const od=door(other);if(!passable.has(p.kind)&&od&&placementsOverlap(p,od))return 'layoutAccess';
 }
 return '';
}
/** @param {import("./cozy-domain.js").CozyState} state @param {string} kind @param {string} id @param {{x:number,z:number,rotation:number}} [preferred] */
export function findPlacement(state,kind,id,preferred){
 const candidates=preferred?[{id,kind,...preferred}]:[];
 if(kind===HOUSE_KIND){
  candidates.push({id,kind,...HOUSE_SITE});
  const bounds=COZY_LAND_BOUNDS[state.land.level];
  const xInset=Math.ceil(HOUSE_PLOT.width/2),zInset=Math.ceil(HOUSE_PLOT.depth/2);
  for(let z=bounds.minZ+zInset;z<=bounds.maxZ-zInset;z+=2)for(let x=bounds.minX+xInset;x<=bounds.maxX-xInset;x+=2)candidates.push({id,kind,x,z,rotation:0});
 }else{
  /** @type {Record<string,number[]>} */
  const defaults={barn:[7,-4],coop:[-20,13],goatShelter:[9,-18],pond:[16,13],market:[-4,14],pump:[-3,3.5]};
  const [x,z]=defaults[kind]||[0,9];
  candidates.push({id,kind,x,z,rotation:0});
  for(let z=-21;z<=22;z+=2)for(let x=-25;x<=25;x+=2)candidates.push({id,kind,x,z,rotation:0});
 }
 return candidates.find(p=>!placementIssue(state,p))||null;
}
