import {WORLD_ART} from './unified-world-art.js';
/** @typedef {{left:number,right:number,top:number,bottom:number}} Rect */
/** Pure screen-space free rectangles, excluding actual modeless UI. No DOM,
 * state, renderer, clock or input handler. @param {Rect} stage @param {readonly Rect[]} occluders */
export function selectionFreeRects(stage,occluders){
 const valid=/** @param {Rect} r */r=>[r.left,r.right,r.top,r.bottom].every(Number.isFinite)&&r.right>r.left&&r.bottom>r.top;
 if(!valid(stage))return[];
 const outer={left:stage.left+8,right:stage.right-8,top:stage.top+8,bottom:stage.bottom-8};if(!valid(outer))return[];
 const obstacles=occluders.filter(valid).map(r=>({left:Math.max(outer.left,r.left-6),right:Math.min(outer.right,r.right+6),top:Math.max(outer.top,r.top-6),bottom:Math.min(outer.bottom,r.bottom+6)})).filter(valid);
 const xs=[...new Set([outer.left,outer.right,...obstacles.flatMap(r=>[r.left,r.right])])].sort((a,b)=>a-b),ys=[...new Set([outer.top,outer.bottom,...obstacles.flatMap(r=>[r.top,r.bottom])])].sort((a,b)=>a-b),result=/** @type {Rect[]} */([]);
 for(const left of xs)for(const right of xs)for(const top of ys)for(const bottom of ys){if(right-left<60||bottom-top<32)continue;const r={left,right,top,bottom};if(obstacles.some(o=>left<o.right&&right>o.left&&top<o.bottom&&bottom>o.top))continue;result.push(r);}
 return result.sort((a,b)=>(b.right-b.left)*(b.bottom-b.top)-(a.right-a.left)*(a.bottom-a.top)||a.top-b.top||a.left-b.left);
}
/** Conservative whole atlas cell, or actual structure projection. Padding may
 * be transparent; this never invents clickable opaque pixels.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} entity */
export function selectionExtent(entity){
 const species=/** @type {Record<string,keyof typeof WORLD_ART.species>} */({hen:'chicken',goat:'goat',cow:'cow',fishSchool:'fish'}),spec=WORLD_ART.species[species[entity.kind]];
 if(spec){const size=spec.frameWorldUnits*(entity.scale||1);return{width:size,up:size*spec.pivot[1],down:size*(1-spec.pivot[1])};}
 const width=(entity.width+entity.depth)/Math.SQRT2,depth=(entity.width+entity.depth)/Math.sqrt(6)/2;return{width,up:entity.height*Math.sqrt(2/3)+depth,down:depth};
}
/** @param {string} action @param {string} focused @param {string} selected @param {boolean} previouslyVisible */
export function revealAfterShortcut(action,focused,selected,previouslyVisible){return !!selected&&focused===selected&&(action===selected||previouslyVisible&&['in','out','left','right'].includes(action));}
/** Reframe a selected foot beside actual UI, using the existing bounded camera.
 * Keep manual zoom intent where possible; no continuous follow or timer.
 * @param {ReturnType<typeof import('./unified-world-camera.js').createFarmCamera>} control
 * @param {{x:number,z:number,y?:number}} foot @param {{width:number,up:number,down:number}} extent
 * @param {Rect} stage @param {readonly Rect[]} occluders @param {boolean} [preserveZoom] */
export function revealCamera(control,foot,extent,stage,occluders,preserveZoom=false){
 const regions=selectionFreeRects(stage,occluders),width=stage.right-stage.left,height=stage.bottom-stage.top;if(!regions.length||![foot.x,foot.z,foot.y||0,extent.width,extent.up,extent.down].every(Number.isFinite))return false;
 const before=control.view(),point=()=>{const p=control.project(foot,width/height);return{x:stage.left+(p.x+1)*width/2,y:stage.top+(p.y+1)*height/2};},ppu=()=>width/(2*control.frame(width/height).halfWidth),inside=/** @param {Rect} r */r=>{const p=point(),s=ppu();return p.x-extent.width*s/2>=r.left&&p.x+extent.width*s/2<=r.right&&p.y-extent.up*s>=r.top&&p.y+extent.down*s<=r.bottom;};
 if(regions.some(inside))return false;
 for(const free of regions){
  // Restore the requested camera before trying another reachable free region.
  const current=control.view();control.zoomBy(before.zoom/current.zoom);control.pan(before.x-current.x,before.z-current.z);
  const factor=Math.min(1,(free.right-free.left-4)/Math.max(1,extent.width*ppu()),(free.bottom-free.top-4)/Math.max(1,(extent.up+extent.down)*ppu()));if(!preserveZoom&&factor<1)control.zoomBy(factor);
  const maxZoom=preserveZoom?before.zoom:Math.min(8,control.view().zoom*(free.right-free.left-4)/Math.max(1,extent.width*ppu()));
  for(let i=0;i<12;i++){
   const p=point(),x=(free.left+free.right)/2,y=Math.min(free.bottom-2,Math.max(free.top+2,(free.top+free.bottom)/2+(extent.up-extent.down)*ppu()/2));control.panPixels(x-p.x,y-p.y,width,height);
   const moved=point();if(moved.x>=free.left&&moved.x<=free.right&&moved.y>=free.top&&moved.y<=free.bottom)return JSON.stringify(control.view())!==JSON.stringify(before);
   if(control.view().zoom>=maxZoom)break;control.zoomBy(Math.min(1.35,maxZoom/control.view().zoom));
  }
 }
 const current=control.view();control.zoomBy(before.zoom/current.zoom);control.pan(before.x-current.x,before.z-current.z);return false;
}
