export const CAMERA_PREFERENCE_KEY='myfarmtwin.ui.camera.v1';
export const CAMERA_VIEW_PREFIX='myfarmtwin.ui.camera.view.v1:';
/** @typedef {{id:string,x:number,z:number,rotation:number}} CameraAnchor */
/** @typedef {{version:1,view:string,position:number[],target:number[],fov:number,zoom:number,anchor:CameraAnchor|null,changedAt:number}} CameraPreference */
/** @typedef {{id:string,kind:string,x:number,z:number,rotation:number}} CameraItem */
/** @typedef {Pick<Storage,'getItem'|'setItem'>} PreferenceStorage */
const names=['version','view','position','target','fov','zoom','anchor'];
/** @param {unknown} n @param {number} low @param {number} high */
const numberIn=(n,low,high)=>typeof n==='number'&&Number.isFinite(n)&&n>=low&&n<=high;
/** @param {unknown} value */
const identifier=value=>typeof value==='string'&&/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,95}$/.test(value);
/** @param {unknown} value */
const vector=value=>Array.isArray(value)&&value.length===3&&value.every(n=>numberIn(n,-500,500));
/** Local presentation data is untrusted; never coerce invalid coordinates.
 * @param {unknown} value @returns {CameraPreference|null} */
export function validateCameraPreference(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const d=/** @type {any} */(value);
 if(Object.keys(d).length!==names.length+(Object.hasOwn(d,'changedAt')?1:0)||!names.every(key=>Object.hasOwn(d,key))||(Object.hasOwn(d,'changedAt')&&!numberIn(d.changedAt,0,8.64e15))||d.version!==1||!identifier(d.view)||!vector(d.position)||!vector(d.target)||!numberIn(d.fov,20,80)||!numberIn(d.zoom,.25,4))return null;
 if(!numberIn(d.position[1],.32,300)||!numberIn(d.target[0],-42,42)||!numberIn(d.target[1],.08,4)||!numberIn(d.target[2],-32,32))return null;
 const distance=Math.hypot(...d.position.map((/** @type {number} */n,/** @type {number} */i)=>n-d.target[i]));
 if(distance<.2||distance>220)return null;
 const a=d.anchor;
 if(a!==null&&(!a||typeof a!=='object'||Array.isArray(a)||Object.keys(a).length!==4||!['id','x','z','rotation'].every(key=>Object.hasOwn(a,key))||!identifier(a.id)||!numberIn(a.x,-42,42)||!numberIn(a.z,-32,32)||!numberIn(a.rotation,-Math.PI*2-.0001,Math.PI*2+.0001)))return null;
 return{version:1,view:d.view,position:[...d.position],target:[...d.target],fov:d.fov,zoom:d.zoom,anchor:a===null?null:{id:a.id,x:a.x,z:a.z,rotation:a.rotation},changedAt:d.changedAt??0};
}
/** @param {PreferenceStorage} storage @param {string} key */
function readPreference(storage,key){
 let raw=null;try{raw=storage.getItem(key);if(raw===null||raw.length>4096)return{raw,value:null};return{raw,value:validateCameraPreference(JSON.parse(raw))};}
 catch{return{raw,value:null};}
}
/** @param {PreferenceStorage} storage */
export function readCameraPreference(storage){return readPreference(storage,CAMERA_PREFERENCE_KEY);}
/** @param {string} view */
export function cameraViewPreferenceKey(view){return identifier(view)?CAMERA_VIEW_PREFIX+view:null;}
/** Separate keys let different tabs retain different areas without replacing a shared map.
 * @param {PreferenceStorage} storage @param {string} view */
export function readCameraViewPreference(storage,view){
 const key=cameraViewPreferenceKey(view);if(!key)return{raw:null,value:null};const record=readPreference(storage,key);
 return{raw:record.raw,value:record.value?.view===view?record.value:null};
}
/** @param {PreferenceStorage} storage @param {unknown} value */
export function writeCameraViewPreference(storage,value){
 const valid=validateCameraPreference(value);if(!valid)return false;const key=cameraViewPreferenceKey(valid.view);if(!key)return false;
 try{const current=readCameraViewPreference(storage,valid.view).value;if(current&&current.changedAt>valid.changedAt)return false;storage.setItem(key,JSON.stringify(valid));return true;}catch{return false;}
}
/** A pending older tab may not replace a newer camera preference.
 * @param {PreferenceStorage} storage @param {unknown} value @param {string|null} expectedRaw */
export function writeCameraPreference(storage,value,expectedRaw){
 const valid=validateCameraPreference(value);if(!valid)return false;
 try{const currentRaw=storage.getItem(CAMERA_PREFERENCE_KEY);let current=null;try{current=validateCameraPreference(JSON.parse(currentRaw||'null'));}catch{/* Preserve an unrecognized concurrent value. */}if(current&&current.changedAt>valid.changedAt)return false;if(currentRaw!==expectedRaw&&(!current||current.changedAt>=valid.changedAt))return false;storage.setItem(CAMERA_PREFERENCE_KEY,JSON.stringify(valid));return true;}
 catch{return false;}
}
/** @param {CameraPreference} saved @param {(id:string)=>CameraItem|undefined} findItem */
export function resolveCameraPreference(saved,findItem){
 const inside=saved.view.startsWith('inside:'),id=inside?saved.view.slice(7):saved.view,item=findItem(id);
 const allowed=inside?!!item&&item.id===id&&['barn','coop','goatShelter','market'].includes(item.kind):!!item||['overview','garden','barn','coop','goatShelter','pond','market'].includes(id);
 if(!allowed)return{view:'overview',applyPose:false};
 const anchor=saved.anchor,match=item?!!anchor&&anchor.id===item.id&&Math.abs(anchor.x-item.x)<.0001&&Math.abs(anchor.z-item.z)<.0001&&Math.abs(anchor.rotation-item.rotation)<.0001:anchor===null;
 return{view:saved.view,applyPose:match};
}
