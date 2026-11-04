import {serialize,deserialize,SAVE_VERSION} from './save-schema.js';
export const SAVE_KEY='myfarmtwin.save.v1';export const BACKUP_KEY='myfarmtwin.save.backup.v1';
export const QUARANTINE_KEY='myfarmtwin.save.unreadable.v1';
export const PRE_V2_KEY='myfarmtwin.save.before-chicken.v1';
/** @typedef {Pick<Storage,'getItem'|'setItem'|'removeItem'>} Store */
export class SaveSession{
 /** @param {Store|null} storage */
 constructor(storage){this.storage=storage;/** @type {string|null} */this.raw=null;this.blocked=false;
 /** @type {string|null} */
 this.verifiedBackupRaw=null;}
 /** @returns {{state:import('./engine.js').State|null,status:string}} */
 load(){
  if(!this.storage)return {state:null,status:'saveUnavailable'};
  try{
   this.raw=this.storage.getItem(SAVE_KEY);if(this.raw===null)return {state:null,status:'saveReady'};
   try{const state=deserialize(this.raw);if(JSON.parse(this.raw).saveVersion<SAVE_VERSION){try{const original=this.storage.getItem(PRE_V2_KEY);if(original!==null&&original!==this.raw)throw Error('savePreserveFirst');if(this.storage.getItem(SAVE_KEY)!==this.raw)throw Error('saveConflict');if(original===null)this.storage.setItem(PRE_V2_KEY,this.raw);this.save(state);return {state,status:'saveMigrated'};}catch{this.blocked=true;return {state,status:'saveMigrationPreview'};}}return {state,status:'saveResumed'};}
   catch(error){
    this.blocked=true;if(error instanceof Error&&error.message==='saveNewer')return {state:null,status:'saveNewer'};
    const original=this.raw,backup=this.storage.getItem(BACKUP_KEY);if(backup){try{const state=deserialize(backup);const prior=this.storage.getItem(QUARANTINE_KEY);if(prior!==null&&prior!==original)return {state,status:'saveRecoveryPreview'};if(this.storage.getItem(SAVE_KEY)!==original)return {state:null,status:'saveConflict'};this.storage.setItem(QUARANTINE_KEY,original);const text=serialize(state);this.storage.setItem(SAVE_KEY,text);this.raw=text;this.blocked=false;return {state,status:'saveRecovered'};}catch{/* Keep the original if backup validation or preservation fails. */}}
    return {state:null,status:'saveCorrupt'};
   }
  }catch{return {state:null,status:'saveUnavailable'};}
 }
 /** @param {import('./engine.js').State} state */
 save(state){if(!this.storage)throw new Error('saveUnavailable');if(this.blocked)throw new Error('saveCorrupt');const text=serialize(state);if(this.storage.getItem(SAVE_KEY)!==this.raw)throw new Error('saveConflict');if(this.raw!==null){this.storage.setItem(BACKUP_KEY,this.raw);this.verifiedBackupRaw=this.raw;}this.storage.setItem(SAVE_KEY,text);this.raw=text;}
 /** Explicit user-confirmed import/reset; always preserve the replaced bytes first. @param {import('./engine.js').State} state */
 replace(state){if(!this.storage)throw new Error('saveUnavailable');const text=serialize(state),current=this.storage.getItem(SAVE_KEY);if(current!==this.raw)throw new Error('saveConflict');if(current!==null){let valid=true;try{deserialize(current);}catch{valid=false;}if(valid){this.storage.setItem(BACKUP_KEY,current);this.verifiedBackupRaw=current;}else{const prior=this.storage.getItem(QUARANTINE_KEY);if(prior!==null&&prior!==current)throw new Error('savePreserveFirst');this.storage.setItem(QUARANTINE_KEY,current);}}this.storage.setItem(SAVE_KEY,text);this.raw=text;this.blocked=false;}
 original(){try{return this.blocked?this.raw:this.storage?.getItem(QUARANTINE_KEY)||this.storage?.getItem(PRE_V2_KEY)||null;}catch{return null;}}
 migrationOriginal(){try{return this.storage?.getItem(PRE_V2_KEY)||null;}catch{return null;}}
 /** Read-only validity indicator; trusted written bytes are immutable and compared on every read. */
 hasBackup(){try{const raw=this.storage?.getItem(BACKUP_KEY);if(!raw)return false;if(raw===this.verifiedBackupRaw)return true;deserialize(raw);this.verifiedBackupRaw=raw;return true;}catch{return false;}}
 backup(){try{const raw=this.storage?.getItem(BACKUP_KEY);return raw?deserialize(raw):null;}catch{return null;}}
}
/** @param {boolean} [allowWrite] @returns {Store|null} */
export function browserStorage(allowWrite=true){try{const storage=window.localStorage;if(allowWrite)return storage;return {getItem:key=>storage.getItem(key),setItem:()=>{throw Error('saveUnavailable');},removeItem:()=>{throw Error('saveUnavailable');}};}catch{return null;}}
