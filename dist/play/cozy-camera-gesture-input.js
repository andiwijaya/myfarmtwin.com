/** @typedef {'touch'|'pointer'} CameraGestureInput */
/** @typedef {{type:string,pointerType?:string,pointerId?:number,clientX?:number,clientY?:number,movementX?:number,movementY?:number,deltaX?:number,deltaY?:number,deltaZ?:number,sourceCapabilities?:{firesTouchEvents?:boolean}|null}} GestureInputEvent */
/** @param {number|undefined} value */
const moved=value=>typeof value==='number'&&Number.isFinite(value)&&value!==0;

/** Observe input without consuming events or changing camera/farm state.
 * The primary pointer is only a fallback until a real input stream is seen.
 * @param {EventTarget} target
 * @param {EventTarget & {readonly matches:boolean}} coarsePointer
 * @param {(input:CameraGestureInput)=>void} onChange
 */
export function watchCameraGestureInput(target,coarsePointer,onChange){
 /** @type {CameraGestureInput} */let input=coarsePointer.matches?'touch':'pointer';
 let observed=false,disposed=false;
 /** @type {Map<string,{x:number,y:number}>} */const positions=new Map();
 /** @param {CameraGestureInput} next @param {boolean} explicit */
 function choose(next,explicit){
  if(disposed)return;
  const changed=input!==next||explicit&&!observed;
  input=next;if(explicit)observed=true;
  if(changed)onChange(input);
 }
 /** @param {Event} raw */
 function observe(raw){
  if(disposed)return;
  const event=/** @type {GestureInputEvent} */(raw);
  if(event.type==='wheel'){
   if(!event.sourceCapabilities?.firesTouchEvents&&(moved(event.deltaX)||moved(event.deltaY)||moved(event.deltaZ)))choose('pointer',true);
   return;
  }
  const type=event.pointerType;
  if(type!=='touch'&&type!=='mouse'||type==='mouse'&&event.sourceCapabilities?.firesTouchEvents)return;
  const key=type+':'+(event.pointerId??0);
  if(event.type==='pointerup'||event.type==='pointercancel'){positions.delete(key);return;}
  const previous=positions.get(key),point=typeof event.clientX==='number'&&Number.isFinite(event.clientX)&&typeof event.clientY==='number'&&Number.isFinite(event.clientY)?{x:event.clientX,y:event.clientY}:null;
  if(point)positions.set(key,point);
  const moving=moved(event.movementX)||moved(event.movementY)||!!(point&&previous&&(point.x!==previous.x||point.y!==previous.y));
  if(event.type==='pointerdown'||event.type==='pointermove'&&moving)choose(type==='touch'?'touch':'pointer',true);
 }
 function fallbackChanged(){if(!observed)choose(coarsePointer.matches?'touch':'pointer',false);}
 const events=['pointerdown','pointermove','pointerup','pointercancel','wheel'],options={capture:true,passive:true};
 for(const type of events)target.addEventListener(type,observe,options);
 coarsePointer.addEventListener('change',fallbackChanged);
 return{
  getInput:()=>input,
  hasInput:()=>observed,
  dispose(){if(disposed)return;disposed=true;for(const type of events)target.removeEventListener(type,observe,options);coarsePointer.removeEventListener('change',fallbackChanged);positions.clear();}
 };
}
