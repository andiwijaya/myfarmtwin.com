import {cameraViewPreferenceKey,validateCameraPreference} from './cozy-camera-preference.js';

export const CAMERA_RESET_UNDO_PREFIX='myfarmtwin.ui.camera.undo-reset.v1:';
/** @typedef {import('./cozy-camera-preference.js').CameraPreference} CameraPreference */
/** @typedef {{version:1,view:string,before:CameraPreference|null,changedAt:number}} CameraResetUndo */
/** @typedef {Pick<Storage,'getItem'|'setItem'>} UndoStorage */
/** @param {string} view */
export const cameraResetUndoKey=view=>cameraViewPreferenceKey(view)?CAMERA_RESET_UNDO_PREFIX+view:null;
/** @param {unknown} value @returns {CameraResetUndo|null} */
export function validateCameraResetUndo(value){
 if(!value||typeof value!=='object'||Array.isArray(value))return null;const d=/** @type {any} */(value);
 if(Object.keys(d).length!==4||!['version','view','before','changedAt'].every(k=>Object.hasOwn(d,k))||d.version!==1||typeof d.view!=='string'||!cameraResetUndoKey(d.view)||typeof d.changedAt!=='number'||!Number.isFinite(d.changedAt)||d.changedAt<0||d.changedAt>8.64e15)return null;
 const before=d.before===null?null:validateCameraPreference(d.before);if(d.before!==null&&(!before||before.view!==d.view||before.changedAt>d.changedAt))return null;
 return{version:1,view:d.view,before,changedAt:d.changedAt};
}
/** @param {UndoStorage} storage @param {string} view */
export function readCameraResetUndo(storage,view){
 const key=cameraResetUndoKey(view);let raw=null;if(!key)return{raw,value:null,available:true};
 try{raw=storage.getItem(key);}catch{return{raw,value:null,available:false};}
 let value=null;try{value=raw===null||raw.length>8192?null:validateCameraResetUndo(JSON.parse(raw));}catch{/* A malformed optional value can be replaced by the next explicit reset. */}
 return{raw,value:value?.view===view?value:null,available:true};
}
/** A consumed record is a tombstone, so a delayed old write cannot resurrect undo.
 * @param {UndoStorage} storage @param {unknown} value @param {string|null} expectedRaw @param {boolean} [requireMatch]
 * @returns {'stored'|'conflict'|'unavailable'|'invalid'} */
export function writeCameraResetUndo(storage,value,expectedRaw,requireMatch=false){
 const valid=validateCameraResetUndo(value);if(!valid)return'invalid';const key=cameraResetUndoKey(valid.view);if(!key)return'invalid';
 try{const current=readCameraResetUndo(storage,valid.view);if(!current.available)return'unavailable';if(requireMatch&&current.raw!==expectedRaw)return'conflict';if(current.value&&current.value.changedAt>=valid.changedAt)return'conflict';if(current.raw!==expectedRaw&&!current.value)return'conflict';storage.setItem(key,JSON.stringify(valid));return'stored';}catch{return'unavailable';}
}
/** Ignore gesture timestamps when deciding whether reset changed the visible pose.
 * @param {CameraPreference|null} a @param {CameraPreference|null} b */
export function sameCameraPose(a,b){
 return!!a&&!!b&&a.view===b.view&&Math.abs(a.fov-b.fov)<.000001&&Math.abs(a.zoom-b.zoom)<.000001&&a.position.every((n,i)=>Math.abs(n-b.position[i])<.000001)&&a.target.every((n,i)=>Math.abs(n-b.target[i])<.000001)&&JSON.stringify(a.anchor)===JSON.stringify(b.anchor);
}
