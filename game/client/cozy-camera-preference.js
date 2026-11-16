export const CAMERA_PREFERENCE_KEY='myfarmtwin.ui.camera.v1';
/** @typedef {{id:string,x:number,z:number,rotation:number}} CameraAnchor */
/** @typedef {{version:1,view:string,position:number[],target:number[],fov:number,zoom:number,anchor:CameraAnchor|null}} CameraPreference */
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
 if(Object.keys(d).length!==names.length||!names.every(key=>Object.hasOwn(d,key))||d.version!==1||!identifier(d.view)||!vector(d.position)||!vector(d.target)||!numberIn(d.fov,20,80)||!numberIn(d.zoom,.25,4))return null;
 if(!numberIn(d.position[1],.32,300)||!numberIn(d.target[0],-42,42)||!numberIn(d.target[1],.08,4)||!numberIn(d.target[2],-32,32))return null;
 const distance=Math.hypot(...d.position.map((/** @type {number} */n,/** @type {number} */i)=>n-d.target[i]));
 if(distance<.2||distance>220)return null;
 const a=d.anchor;
 if(a!==null&&(!a||typeof a!=='object'||Array.isArray(a)||Object.keys(a).length!==4||!['id','x','z','rotation'].every(key=>Object.hasOwn(a,key))||!identifier(a.id)||!numberIn(a.x,-42,42)||!numberIn(a.z,-32,32)||!numberIn(a.rotation,-Math.PI*2-.0001,Math.PI*2+.0001)))return null;
 return{version:1,view:d.view,position:[...d.position],target:[...d.target],fov:d.fov,zoom:d.zoom,anchor:a===null?null:{id:a.id,x:a.x,z:a.z,rotation:a.rotation}};
}
/** @param {PreferenceStorage} storage */
export function readCameraPreference(storage){
 let raw=null;try{raw=storage.getItem(CAMERA_PREFERENCE_KEY);if(raw===null||raw.length>4096)return{raw,value:null};return{raw,value:validateCameraPreference(JSON.parse(raw))};}
 catch{return{raw,value:null};}
}
/** A pending older tab may not replace a newer camera preference.
 * @param {PreferenceStorage} storage @param {unknown} value @param {string|null} expectedRaw */
export function writeCameraPreference(storage,value,expectedRaw){
 const valid=validateCameraPreference(value);if(!valid)return false;
 try{if(storage.getItem(CAMERA_PREFERENCE_KEY)!==expectedRaw)return false;storage.setItem(CAMERA_PREFERENCE_KEY,JSON.stringify(valid));return true;}
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
