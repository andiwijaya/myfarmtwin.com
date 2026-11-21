import {COZY_BUILD_CATALOG} from './cozy-placement.js';

export const WIND_PUMP_SITE=Object.freeze({x:7,z:-35.4,rotation:0});
export const WORKER_LODGE_SITE=Object.freeze({x:-37,z:-36.6,rotation:0});
const bounds={minX:-46,maxX:46,minZ:-39,maxZ:35};
const columns=bounds.maxX-bounds.minX+1,rows=bounds.maxZ-bounds.minZ+1;
const neighbors=[[0,1],[1,0],[0,-1],[-1,0],[1,1],[-1,1],[1,-1],[-1,-1]];

/** @typedef {{x:number,z:number}} Point */
/** @typedef {{x:number,y:number,z:number}} Waypoint */
/** @typedef {import('./cozy-domain.js').Placement} Placement */
/** @typedef {{x:number,z:number,rotation:number}} Site */

/** @param {number} x @param {number} z */
export function groundHeight(x,z){
 const t=Math.max(0,(Math.abs(x)-44)/11,(Math.abs(z)-34)/10);
 return -.38*t*t;
}

/** @param {Site} site @param {number} x @param {number} z @returns {Point} */
export function worldPoint(site,x,z){
 const c=Math.cos(site.rotation),s=Math.sin(site.rotation);
 return {x:site.x+x*c+z*s,z:site.z+z*c-x*s};
}

/** @param {Site} site @param {number} x @param {number} z @param {number} [y] @returns {Waypoint} */
export function groundPoint(site,x,z,y=0){
 const point=worldPoint(site,x,z);
 return {...point,y:groundHeight(point.x,point.z)+y};
}

/** Front path and counter position shared by the package and its worker. @param {Site} market */
export function marketMealStation(market){
 return {
  entry:groundPoint(market,0,4.04),
  porch:groundPoint(market,0,2.43,.025),
  counter:groundPoint(market,3.02,2.43,.025),
  facing:worldPoint(market,3.02,1.68),
  parcel:groundPoint(market,2.86,1.86,.906),
 };
}

/** @param {number} x @param {number} z */
function index(x,z){
 if(x<bounds.minX||x>bounds.maxX||z<bounds.minZ||z>bounds.maxZ)return -1;
 return (z-bounds.minZ)*columns+x-bounds.minX;
}
/** @param {number} cell @returns {Point} */
function cellPoint(cell){return {x:cell%columns+bounds.minX,z:Math.floor(cell/columns)+bounds.minZ};}
/** @param {Point} point @returns {Waypoint} */
function waypoint(point){return {...point,y:groundHeight(point.x,point.z)};}

export class WorkerRoutes{
 /** @param {Placement[]} layout @param {boolean} hasHouse @param {{clearance?:number,fences?:boolean}} [options] */
 constructor(layout,hasHouse,{clearance=.27,fences=false}={}){
  this.blocked=new Uint8Array(columns*rows);
  this.clearance=clearance;
  for(const item of layout){
   if(item.kind==='path'||item.kind==='grass'||item.kind==='fence'&&!fences)continue;
   const measure=COZY_BUILD_CATALOG[item.kind];
   if(measure)this.block(item,measure.width,measure.depth);
  }
  this.block(WIND_PUMP_SITE,2.32,2.95);
  if(!hasHouse)this.block(WORKER_LODGE_SITE,4.65,4.5);
 }

 /** @param {Site} site @param {number} width @param {number} depth */
 block(site,width,depth){
  const {x,z,rotation}=site,c=Math.cos(rotation),s=Math.sin(rotation);
  const halfWidth=width/2+this.clearance,halfDepth=depth/2+this.clearance;
  const rx=Math.abs(c)*halfWidth+Math.abs(s)*halfDepth,rz=Math.abs(s)*halfWidth+Math.abs(c)*halfDepth;
  for(let px=Math.ceil(Math.max(bounds.minX,x-rx));px<=Math.min(bounds.maxX,x+rx);px++){
   for(let pz=Math.ceil(Math.max(bounds.minZ,z-rz));pz<=Math.min(bounds.maxZ,z+rz);pz++){
    const dx=px-x,dz=pz-z;
    if(Math.abs(dx*c-dz*s)<=halfWidth&&Math.abs(dx*s+dz*c)<=halfDepth)this.blocked[index(px,pz)]=1;
   }
  }
 }

 /** @param {number} x @param {number} z */
 free(x,z){const cell=index(x,z);return cell>=0&&this.blocked[cell]===0;}

 /** @param {Point} point */
 nearest(point){
  const x=Math.round(point.x),z=Math.round(point.z);
  if(this.free(x,z))return index(x,z);
  for(let radius=1;radius<=9;radius++){
   let best=-1,distance=Infinity;
   for(let a=x-radius;a<=x+radius;a++)for(let b=z-radius;b<=z+radius;b++){
    if(Math.max(Math.abs(a-x),Math.abs(b-z))!==radius||!this.free(a,b))continue;
    const gap=(a-point.x)**2+(b-point.z)**2;
    if(gap<distance){best=index(a,b);distance=gap;}
   }
   if(best>=0)return best;
  }
  return -1;
 }

 /** @param {Point} from @param {Point} to */
 clear(from,to){
  const count=Math.max(1,Math.ceil(Math.hypot(to.x-from.x,to.z-from.z)*3));
  for(let i=0;i<=count;i++){
   const x=Math.round(from.x+(to.x-from.x)*i/count),z=Math.round(from.z+(to.z-from.z)*i/count);
   if(!this.free(x,z))return false;
  }
  return true;
 }

 /** @param {Point} from @param {Point} to @returns {Waypoint[]} */
 route(from,to){
  const first=this.nearest(from),last=this.nearest(to);
  if(first<0||last<0)return [];
  if(this.clear(from,to))return [waypoint(to)];
  const previous=new Int32Array(this.blocked.length).fill(-1),queue=new Int32Array(previous.length);
  previous[first]=first;
  queue[0]=first;
  let size=1;
  for(let i=0;i<size&&previous[last]<0;i++){
   const cell=queue[i],{x,z}=cellPoint(cell);
   for(const [dx,dz] of neighbors){
    const nx=x+dx,nz=z+dz;
    if(!this.free(nx,nz)||dx&&dz&&(!this.free(x+dx,z)||!this.free(x,z+dz)))continue;
    const step=index(nx,nz);
    if(previous[step]>=0)continue;
    previous[step]=cell;
    queue[size++]=step;
   }
  }
  if(previous[last]<0)return [];
  const fromGrid=cellPoint(first),toGrid=cellPoint(last),path=[];
  for(let cell=last;cell!==first;cell=previous[cell])path.push(cellPoint(cell));
  path.push(fromGrid);
  path.reverse();
  if(this.clear(toGrid,to))path.push(to);
  const result=[];
  let anchor=from,i=0;
  while(i<path.length){
   let end=i;
   while(end+1<path.length&&this.clear(anchor,path[end+1]))end++;
   anchor=path[end];
   result.push(waypoint(anchor));
   i=end+1;
  }
  return result;
 }
}
