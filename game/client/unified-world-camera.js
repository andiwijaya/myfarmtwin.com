import {TWO_ZONE_BOUNDS,TWO_ZONE_ANCHORS} from './unified-world-model.js';
const clamp=(/** @type {number} */n,/** @type {number} */lo,/** @type {number} */hi)=>Math.max(lo,Math.min(hi,n));
/** One presentation-only camera. Four headings share the same target and zoom.
 * Projection is also usable by the unified low-graphics fallback.
 */
export function createWorldCamera(){
 const bounds=TWO_ZONE_BOUNDS,center={x:(bounds.minX+bounds.maxX)/2,z:(bounds.minZ+bounds.maxZ)/2};
 let x=center.x,z=center.z,heading=0,zoom=1;
 const view=()=>Object.freeze({x,z,heading,zoom});
 /** @param {number} aspect */
 function frame(aspect){
  if(!Number.isFinite(aspect)||aspect<=0)throw new RangeError('Invalid viewport aspect');
  const angle=heading*Math.PI/2,dx=Math.round(Math.cos(angle)+Math.sin(angle)),dz=Math.round(Math.cos(angle)-Math.sin(angle));
  let halfWidth=0,halfHeight=0;
  for(const px of [bounds.minX,bounds.maxX])for(const pz of [bounds.minZ,bounds.maxZ])for(const y of [0,3]){
   halfWidth=Math.max(halfWidth,Math.abs(((px-center.x)*dz-(pz-center.z)*dx)/Math.sqrt(2)));
   halfHeight=Math.max(halfHeight,Math.abs(-((px-center.x)*dx+(pz-center.z)*dz)/Math.sqrt(6)+y*Math.sqrt(2/3)));
  }
  halfHeight=Math.max(halfHeight,halfWidth/aspect)*1.08/zoom;
  return {halfWidth:halfHeight*aspect,halfHeight,dx,dz,x,z,heading,zoom};
 }
 return {
  view,frame,
  /** @param {number} amount */
  rotate(amount){if(Number.isInteger(amount))heading=((heading+amount)%4+4)%4;return view();},
  /** @param {number} factor */
  zoomBy(factor){if(Number.isFinite(factor)&&factor>0)zoom=clamp(zoom*factor,1,3.2);return view();},
  /** World-space movement; never receives a farm state or command function. @param {number} dx @param {number} dz */
  pan(dx,dz){if(Number.isFinite(dx)&&Number.isFinite(dz)){x=clamp(x+dx,bounds.minX,bounds.maxX);z=clamp(z+dz,bounds.minZ,bounds.maxZ);}return view();},
  /** Camera bookmark only. @param {string} zone */
  focus(zone){if(Object.hasOwn(TWO_ZONE_ANCHORS,zone)){const anchor=TWO_ZONE_ANCHORS[/** @type {keyof typeof TWO_ZONE_ANCHORS} */(zone)];x=anchor.x;z=anchor.z;zoom=2.2;}return view();},
  fit(){x=center.x;z=center.z;zoom=1;return view();},
  reset(){heading=0;x=center.x;z=center.z;zoom=1;return view();},
  /** Normalized screen coordinates, with positive Y down. @param {{x:number,z:number,y?:number}} point @param {number} aspect */
  project(point,aspect){const f=frame(aspect);return {x:((point.x-x)*f.dz-(point.z-z)*f.dx)/Math.sqrt(2)/f.halfWidth,y:(((point.x-x)*f.dx+(point.z-z)*f.dz)/Math.sqrt(6)-(point.y||0)*Math.sqrt(2/3))/f.halfHeight};}
 };
}
