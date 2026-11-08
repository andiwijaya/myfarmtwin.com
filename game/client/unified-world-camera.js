import {TWO_ZONE_BOUNDS,TWO_ZONE_ANCHORS} from './unified-world-model.js';
import {WORLD_BOUNDS,ZONE_REGISTRY} from './unified-world-registry.js';
const clamp=(/** @type {number} */n,/** @type {number} */lo,/** @type {number} */hi)=>Math.max(lo,Math.min(hi,n));
/** One presentation-only camera. Four headings share the same target and zoom.
 * Fit shows every terrain corner; reset returns to the readable starting view.
 * @param {{bounds?:Readonly<import('./unified-world-registry.js').Bounds>,anchors?:Readonly<Record<string,Readonly<import('./unified-world-registry.js').Point>>>,maxZoom?:number,maxHeight?:number,initialZoom?:number}} [options]
 */
export function createWorldCamera(options={}){
 const bounds=Object.freeze({...options.bounds||TWO_ZONE_BOUNDS}),anchors=options.anchors||TWO_ZONE_ANCHORS,maxZoom=options.maxZoom??3.2,maxHeight=options.maxHeight??3,initialZoom=options.initialZoom??1;
 if(![bounds.minX,bounds.maxX,bounds.minZ,bounds.maxZ].every(Number.isFinite)||bounds.minX>=bounds.maxX||bounds.minZ>=bounds.maxZ||!Number.isFinite(maxZoom)||maxZoom<1||!Number.isFinite(maxHeight)||maxHeight<0||!Number.isFinite(initialZoom)||initialZoom<1||initialZoom>maxZoom)throw new RangeError('Invalid camera bounds');
 const center={x:(bounds.minX+bounds.maxX)/2,z:(bounds.minZ+bounds.maxZ)/2};
 let x=center.x,z=center.z,heading=0,zoom=initialZoom;
 const view=()=>Object.freeze({x,z,heading,zoom});
 /** @param {number} dx @param {number} dz */
 function pan(dx,dz){if(Number.isFinite(dx)&&Number.isFinite(dz)){x=clamp(x+dx,bounds.minX,bounds.maxX);z=clamp(z+dz,bounds.minZ,bounds.maxZ);}return view();}
 /** @param {number} aspect */
 function frame(aspect){
  if(!Number.isFinite(aspect)||aspect<=0)throw new RangeError('Invalid viewport aspect');
  const angle=heading*Math.PI/2,dx=Math.round(Math.cos(angle)+Math.sin(angle)),dz=Math.round(Math.cos(angle)-Math.sin(angle));
  let halfWidth=0,halfHeight=0;
  for(const px of [bounds.minX,bounds.maxX])for(const pz of [bounds.minZ,bounds.maxZ])for(const y of [0,maxHeight]){
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
  zoomBy(factor){if(Number.isFinite(factor)&&factor>0)zoom=clamp(zoom*factor,1,maxZoom);return view();},
  /** World-space movement; never receives a farm state or command function. @param {number} dx @param {number} dz */
  pan,
  /** Drag-ground inverse of project(), shared across all headings. @param {number} dx @param {number} dy @param {number} width @param {number} height */
  panPixels(dx,dy,width,height){if(![dx,dy,width,height].every(Number.isFinite)||width<=0||height<=0)return view();const f=frame(width/height),a=-2*dx*f.halfWidth/width,b=-2*dy*f.halfHeight/height;return pan((Math.sqrt(2)*a*f.dz+Math.sqrt(6)*b*f.dx)/2,(-Math.sqrt(2)*a*f.dx+Math.sqrt(6)*b*f.dz)/2);},
  /** Camera bookmark only. @param {string} zone */
  focus(zone){if(Object.hasOwn(anchors,zone)){const anchor=anchors[/** @type {keyof typeof anchors} */(zone)];x=anchor.x;z=anchor.z;zoom=Math.min(2.2,maxZoom);}return view();},
  fit(){x=center.x;z=center.z;zoom=1;return view();},
  reset(){heading=0;x=center.x;z=center.z;zoom=initialZoom;return view();},
  /** Normalized screen coordinates, with positive Y down. @param {{x:number,z:number,y?:number}} point @param {number} aspect */
  project(point,aspect){const f=frame(aspect);return {x:((point.x-x)*f.dz-(point.z-z)*f.dx)/Math.sqrt(2)/f.halfWidth,y:(((point.x-x)*f.dx+(point.z-z)*f.dz)/Math.sqrt(6)-(point.y||0)*Math.sqrt(2/3))/f.halfHeight};}
 };
}
/** The unified renderer instantiates one control using the full registered world. */
export const FARM_INITIAL_ZOOM=1.35;
export function createFarmCamera(){return createWorldCamera({bounds:WORLD_BOUNDS,anchors:Object.fromEntries(Object.entries(ZONE_REGISTRY).map(([id,zone])=>[id,zone.anchor])),maxZoom:8,maxHeight:4,initialZoom:FARM_INITIAL_ZOOM});}
