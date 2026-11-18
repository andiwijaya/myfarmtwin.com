/** @typedef {'touch'|'pointer'} CameraGestureInput */
/** @typedef {{type:string,pointerType?:string,pointerId?:number,clientX?:number,clientY?:number,movementX?:number,movementY?:number,deltaX?:number,deltaY?:number,deltaZ?:number,sourceCapabilities?:{firesTouchEvents?:boolean}|null}} GestureInputEvent */
const preferenceKey = 'myfarmtwin.ui.camera-gesture-input.v1';
/** @param {number|undefined} value */
const moved=value=>typeof value==='number'&&Number.isFinite(value)&&value!==0;

/** Observe input without consuming events or changing camera/farm state.
 * Use the primary pointer only while there is no known input preference.
 * @param {EventTarget} target Pass the window to receive cross-tab storage events.
 * @param {EventTarget & {readonly matches:boolean}} coarsePointer
 * @param {(input:CameraGestureInput)=>void} onChange
 * @param {Pick<Storage,'getItem'|'setItem'>|null} [storage]
 */
export function watchCameraGestureInput(target,coarsePointer,onChange,storage=null){
 /** @returns {CameraGestureInput|null} */
 function readPreference() {
  try {
   const saved = storage?.getItem(preferenceKey);
   if (saved === 'touch' || saved === 'pointer') return saved;
  } catch { /* Optional browser preference. */ }
  return null;
 }
 let cachedPreference = readPreference();
 let observed = cachedPreference !== null;
 /** @type {CameraGestureInput} */let input = cachedPreference ?? (coarsePointer.matches ? 'touch' : 'pointer');
 let disposed = false;
 /** @type {Map<string,{x:number,y:number}>} */const positions=new Map();
 /** @param {CameraGestureInput} next */
 function savePreference(next) {
  if (!storage || cachedPreference === next) return;
  cachedPreference = next;
  try { storage.setItem(preferenceKey, next); } catch { /* Keep the hint usable in memory. */ }
 }
 /** @param {Event} raw */
 function refreshWriteCache(raw) {
  const event = /** @type {StorageEvent} */(raw);
  if (event.storageArea !== storage || (event.key !== preferenceKey && event.key !== null)) return;
  // A different tab can save a newer preference. Keep this tab's hint until
  // its next input, and read storage instead of trusting a queued event value.
  cachedPreference = readPreference();
 }
 /** @param {CameraGestureInput} next @param {boolean} explicit */
 function choose(next,explicit){
  if(disposed)return;
  const changed=input!==next||explicit&&!observed;
  input=next;
  if (explicit) {
   observed = true;
   savePreference(next);
  }
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
 if (storage) target.addEventListener('storage', refreshWriteCache);
 return{
  getInput:()=>input,
  hasInput:()=>observed,
  dispose(){
   if (disposed) return;
   disposed = true;
   for (const type of events) target.removeEventListener(type, observe, options);
   coarsePointer.removeEventListener('change', fallbackChanged);
   if (storage) target.removeEventListener('storage', refreshWriteCache);
   positions.clear();
  }
 };
}
