/** Bounded pointer bookkeeping; emits camera deltas/taps only. No clock/state/RNG. */
export function createWorldGestures(){
 /** @type {Map<number,{x:number,y:number,startX:number,startY:number,lastX:number,lastY:number,moved:boolean,touch:boolean}>} */const pointers=new Map();
 /** @type {{distance:number,x:number,y:number}|null} */let pinch=null;
 function pair(){const [a,b]=[...pointers.values()];return a&&b?{distance:Math.max(1,Math.hypot(a.x-b.x,a.y-b.y)),x:(a.x+b.x)/2,y:(a.y+b.y)/2}:null;}
 return{
  /** @param {number} id @param {number} x @param {number} y @param {boolean} touch */
  down(id,x,y,touch){if(pointers.has(id)||pointers.size>=2||pointers.size&&(!touch||![...pointers.values()][0].touch))return false;pointers.set(id,{x,y,startX:x,startY:y,lastX:x,lastY:y,moved:false,touch});if(pointers.size===2){for(const point of pointers.values())point.moved=true;pinch=pair();}return true;},
  /** @param {number} id @param {number} x @param {number} y */
  move(id,x,y){const point=pointers.get(id);if(!point)return null;point.x=x;point.y=y;if(pointers.size===2){const next=pair();if(!next||!pinch)return null;const delta={x:next.x-pinch.x,y:next.y-pinch.y,zoom:next.distance/pinch.distance};pinch=next;return delta;}if(!point.moved&&Math.hypot(x-point.startX,y-point.startY)<=7)return null;point.moved=true;const delta={x:x-point.lastX,y:y-point.lastY,zoom:1};point.lastX=x;point.lastY=y;return delta;},
  /** @param {number} id @param {number} x @param {number} y @param {boolean} [cancel] */
  up(id,x,y,cancel=false){const point=pointers.get(id);if(!point)return null;pointers.delete(id);const tap=!cancel&&!point.moved&&Math.hypot(x-point.startX,y-point.startY)<=7;pinch=null;for(const remaining of pointers.values()){remaining.moved=true;remaining.lastX=remaining.x;remaining.lastY=remaining.y;}return{tap,x,y,touch:point.touch};},
  reset(){pointers.clear();pinch=null;},
  inspect:()=>({pointers:pointers.size,pinching:!!pinch})
 };
}
