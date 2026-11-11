import {serialize,deserialize,SAVE_VERSION} from './save-schema.js';
import {activateGarden} from './active-garden.js';
export const SAVE_KEY='myfarmtwin.save.v1';export const BACKUP_KEY='myfarmtwin.save.backup.v1';
export const QUARANTINE_KEY='myfarmtwin.save.unreadable.v1';
export const PRE_V2_KEY='myfarmtwin.save.before-chicken.v1';
export const PRE_V3_KEY='myfarmtwin.save.before-goat.v2';
export const PRE_V4_KEY='myfarmtwin.save.before-cow.v3';
export const PRE_V5_KEY='myfarmtwin.save.before-fish.v4';
export const PRE_V6_KEY='myfarmtwin.save.before-garden.v5';
export const ACTIVE_GARDEN_KEY='myfarmtwin.save.before-active-garden';
/** Applicable archive names reflect the actual original envelope, never a fabricated intermediate save. @param {string} raw */
function migrationKeys(raw,expandGarden=false){const envelope=JSON.parse(raw),oldVersion=envelope.saveVersion;return [...(oldVersion<2?[PRE_V2_KEY]:[]),...(SAVE_VERSION>=3&&oldVersion<3?[PRE_V3_KEY]:[]),...(SAVE_VERSION>=4&&oldVersion<4?[PRE_V4_KEY]:[]),...(SAVE_VERSION>=5&&oldVersion<5?[PRE_V5_KEY]:[]),...(SAVE_VERSION>=6&&oldVersion<6?[PRE_V6_KEY]:[]),...(expandGarden&&envelope.state.plots.length<24?[ACTIVE_GARDEN_KEY]:[])];}
/** @typedef {Pick<Storage,'getItem'|'setItem'|'removeItem'>} Store */
export class SaveSession{
 /** @param {Store|null} storage @param {{expandGarden?:boolean}} [options] */
 constructor(storage,{expandGarden=false}={}){this.storage=storage;this.expandGarden=expandGarden;/** @type {string|null} */this.raw=null;this.blocked=false;
 /** @type {string|null} */
 this.verifiedBackupRaw=null;}
 /** @returns {{state:import('./engine.js').State|null,status:string}} */
 load(){
  if(!this.storage)return {state:null,status:'saveUnavailable'};
  try{
   this.raw=this.storage.getItem(SAVE_KEY);if(this.raw===null)return {state:null,status:'saveReady'};
   try{const parsed=deserialize(this.raw),state=this.expandGarden?activateGarden(parsed):parsed;if(JSON.parse(this.raw).saveVersion<SAVE_VERSION||state!==parsed){try{const keys=migrationKeys(this.raw,this.expandGarden);for(const key of keys){const original=this.storage.getItem(key);if(original!==null&&original!==this.raw)throw Error('savePreserveFirst');}if(this.storage.getItem(SAVE_KEY)!==this.raw)throw Error('saveConflict');for(const key of keys)if(this.storage.getItem(key)===null)this.storage.setItem(key,this.raw);this.save(state);return {state,status:'saveMigrated'};}catch{this.blocked=true;return {state,status:'saveMigrationPreview'};}}return {state,status:'saveResumed'};}
   catch(error){
    this.blocked=true;if(error instanceof Error&&error.message==='saveNewer')return {state:null,status:'saveNewer'};
    const original=this.raw,backup=this.storage.getItem(BACKUP_KEY);if(backup){try{const parsed=deserialize(backup),state=this.expandGarden?activateGarden(parsed):parsed,keys=migrationKeys(backup,this.expandGarden);for(const key of keys){const archive=this.storage.getItem(key);if(archive!==null&&archive!==backup)return {state,status:'saveRecoveryPreview'};}const prior=this.storage.getItem(QUARANTINE_KEY);if(prior!==null&&prior!==original)return {state,status:'saveRecoveryPreview'};if(this.storage.getItem(SAVE_KEY)!==original||this.storage.getItem(BACKUP_KEY)!==backup)return {state:null,status:'saveConflict'};try{for(const key of keys)if(this.storage.getItem(key)===null)this.storage.setItem(key,backup);}catch{return {state,status:'saveRecoveryPreview'};}this.storage.setItem(QUARANTINE_KEY,original);const text=serialize(state);this.storage.setItem(SAVE_KEY,text);this.raw=text;this.blocked=false;return {state,status:'saveRecovered'};}catch{/* Keep the original if backup validation or preservation fails. */}}
    return {state:null,status:'saveCorrupt'};
   }
  }catch{return {state:null,status:'saveUnavailable'};}
 }
 /** @param {import('./engine.js').State} state */
 save(state){if(!this.storage)throw new Error('saveUnavailable');if(this.blocked)throw new Error('saveCorrupt');const text=serialize(state);if(this.storage.getItem(SAVE_KEY)!==this.raw)throw new Error('saveConflict');if(this.raw!==null){this.storage.setItem(BACKUP_KEY,this.raw);this.verifiedBackupRaw=this.raw;}this.storage.setItem(SAVE_KEY,text);this.raw=text;}
 /** Explicit user-confirmed import/reset; always preserve the replaced bytes first. @param {import('./engine.js').State} state */
 replace(state){serialize(state);if(this.expandGarden)state=activateGarden(state);if(!this.storage)throw new Error('saveUnavailable');const text=serialize(state),current=this.storage.getItem(SAVE_KEY);if(current!==this.raw)throw new Error('saveConflict');if(current!==null){let valid=true;try{deserialize(current);}catch{valid=false;}if(valid){this.storage.setItem(BACKUP_KEY,current);this.verifiedBackupRaw=current;}else{const prior=this.storage.getItem(QUARANTINE_KEY);if(prior!==null&&prior!==current)throw new Error('savePreserveFirst');this.storage.setItem(QUARANTINE_KEY,current);}}this.storage.setItem(SAVE_KEY,text);this.raw=text;this.blocked=false;}
 original(){try{return this.blocked?this.raw:this.storage?.getItem(QUARANTINE_KEY)||this.storage?.getItem(ACTIVE_GARDEN_KEY)||this.storage?.getItem(PRE_V6_KEY)||this.storage?.getItem(PRE_V5_KEY)||this.storage?.getItem(PRE_V4_KEY)||this.storage?.getItem(PRE_V3_KEY)||this.storage?.getItem(PRE_V2_KEY)||null;}catch{return null;}}
 beforeFishOriginal(){try{return this.storage?.getItem(PRE_V5_KEY)||null;}catch{return null;}}
 beforeCowOriginal(){try{return this.storage?.getItem(PRE_V4_KEY)||null;}catch{return null;}}
 beforeGoatOriginal(){try{return this.storage?.getItem(PRE_V3_KEY)||null;}catch{return null;}}
 migrationOriginal(){try{return this.storage?.getItem(PRE_V2_KEY)||null;}catch{return null;}}
 /** Read-only validity indicator; trusted written bytes are immutable and compared on every read. */
 hasBackup(){try{const raw=this.storage?.getItem(BACKUP_KEY);if(!raw)return false;if(raw===this.verifiedBackupRaw)return true;deserialize(raw);this.verifiedBackupRaw=raw;return true;}catch{return false;}}
 backup(){try{const raw=this.storage?.getItem(BACKUP_KEY);return raw?deserialize(raw):null;}catch{return null;}}
}
/** @param {boolean} [allowWrite] @returns {Store|null} */
export function browserStorage(allowWrite=true){try{const storage=window.localStorage;if(allowWrite)return storage;return {getItem:key=>storage.getItem(key),setItem:()=>{throw Error('saveUnavailable');},removeItem:()=>{throw Error('saveUnavailable');}};}catch{return null;}}
