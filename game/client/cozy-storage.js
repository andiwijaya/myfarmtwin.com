import {createCozyState,migrateLegacy,validateCozyState,dispatchCozy,placementIssue} from './cozy-domain.js';
import {SAVE_KEY as LEGACY_SAVE_KEY} from './storage.js';
import {GLB_LAYOUT_KEY,GLB_TRANSACTION_KEY,validatePrototypeLayout} from './glb-prototype-state.js';
export const COZY_SAVE_KEY='myfarmtwin.cozy.save.v2';
export const COZY_BACKUP_KEY='myfarmtwin.cozy.backup.v2';
export const COZY_ARCHIVE_KEY='myfarmtwin.cozy.original.v2';
export const COZY_IMPORT_ARCHIVE_KEY='myfarmtwin.cozy.before-import.v2';
export const COZY_RECOVERY_ARCHIVE_KEY='myfarmtwin.cozy.before-recovery.v2';
export const COZY_MAX_SAVE_BYTES=8_000_000;
export const COZY_WATCH_KEYS=Object.freeze([COZY_SAVE_KEY,LEGACY_SAVE_KEY,GLB_LAYOUT_KEY,GLB_TRANSACTION_KEY]);
/** @typedef {Pick<Storage,'getItem'|'setItem'|'removeItem'>} Store */
/** @typedef {{ok:boolean,error:string,events:any[],id?:string}} Result */
/** @param {string} [error] @returns {Result} */
const fail=(error='saveUnavailable')=>({ok:false,error,events:[]});
/** @param {string} raw */
function parse(raw){if(typeof raw!=='string'||new TextEncoder().encode(raw).length>COZY_MAX_SAVE_BYTES)throw Error('saveTooLarge');let data;try{data=JSON.parse(raw);}catch{throw Error('saveImportInvalid');}return validateCozyState(data);}
/** @param {any} state */
function encode(state){validateCozyState(state);const raw=JSON.stringify(state);if(new TextEncoder().encode(raw).length>COZY_MAX_SAVE_BYTES)throw Error('saveTooLarge');return raw;}
/** @param {unknown} error */
function errorCode(error){if(error instanceof Error&&['saveNewer','saveTooLarge','saveImportInvalid','layoutInvalid','migrationLayoutFull','saveConflict','saveImportPending'].includes(error.message))return error.message;return 'saveUnavailable';}
/** The browser owns the Web Lock. This class owns exact-byte conflict checks and
 * one atomic primary write, with a verified preimage stored before replacement.
 * Opening and exporting never write, migrate on disk, grant assets or run time.
 */
export class CozySession{
 /** @param {Store|null} storage @param {{writable?:boolean}} [options] */
 constructor(storage,{writable=true}={}){
  this.storage=storage;this.writable=writable;this.state=createCozyState();this.status='saveReady';this.readOnly=!storage||!writable;
  /** @type {string|null} */ this.raw=null;
  /** @type {string|null} */ this.legacyRaw=null;
  /** @type {string|null} */ this.legacyLayoutRaw=null;
  /** @type {string|null} */ this.transactionRaw=null;
  if(!storage){this.status='saveUnavailable';return;}
  try{this.raw=storage.getItem(COZY_SAVE_KEY);this.legacyRaw=storage.getItem(LEGACY_SAVE_KEY);this.legacyLayoutRaw=storage.getItem(GLB_LAYOUT_KEY);this.transactionRaw=storage.getItem(GLB_TRANSACTION_KEY);if(this.raw!==null){this.state=parse(this.raw);this.status='saveResumed';}else if(this.legacyRaw!==null){this.state=migrateLegacy(this.legacyRaw,this.legacyLayoutRaw);this.status='saveMigrationPreview';}else if(this.legacyLayoutRaw!==null){this.state=migrateLegacy(null,this.legacyLayoutRaw);this.status='saveMigrationPreview';}
   if(this.transactionRaw!==null){this.readOnly=true;this.status='saveImportPending';}
  }catch(error){this.readOnly=true;this.status=errorCode(error)==='saveUnavailable'?'saveCorrupt':errorCode(error);}
 }
 get layout(){return this.state.layout;}
 get backupAvailable(){try{return !!this.storage?.getItem(COZY_BACKUP_KEY);}catch{return false;}}
 /** @param {boolean} [allowProtected] @returns {Result} */
 _fresh(allowProtected=false){if(!this.writable)return fail('saveReadOnly');if(!this.storage)return fail('saveUnavailable');if(this.readOnly&&!allowProtected)return fail(this.status);try{if(this.storage.getItem(COZY_SAVE_KEY)!==this.raw||this.storage.getItem(LEGACY_SAVE_KEY)!==this.legacyRaw||this.storage.getItem(GLB_LAYOUT_KEY)!==this.legacyLayoutRaw||this.storage.getItem(GLB_TRANSACTION_KEY)!==this.transactionRaw){this.readOnly=true;this.status='saveConflict';return fail('saveConflict');}return {ok:true,error:'',events:[]};}catch{this.readOnly=true;this.status='saveUnavailable';return fail('saveUnavailable');}}
 /** @param {any} next @param {Result} result @param {{archiveImport?:boolean,allowProtected?:boolean,recovery?:boolean}} [options] @returns {Result} */
 _save(next,result,{archiveImport=false,allowProtected=false,recovery=false}={}){
  const fresh=this._fresh(allowProtected);if(!fresh.ok)return fresh;if(!this.storage)return fail();
  try{const after=encode(next);if(this.storage.getItem(COZY_ARCHIVE_KEY)===null){const original=JSON.stringify({format:'MyFarmTwinOriginal',version:2,cozy:this.raw,native:this.legacyRaw,layout:this.legacyLayoutRaw});this.storage.setItem(COZY_ARCHIVE_KEY,original);if(this.storage.getItem(COZY_ARCHIVE_KEY)!==original)throw Error('saveUnavailable');}
   if(archiveImport&&this.storage.getItem(COZY_IMPORT_ARCHIVE_KEY)===null)this.storage.setItem(COZY_IMPORT_ARCHIVE_KEY,JSON.stringify({cozy:this.raw,native:this.legacyRaw,layout:this.legacyLayoutRaw}));
   if(recovery&&this.raw!==null)this.storage.setItem(COZY_RECOVERY_ARCHIVE_KEY,this.raw);
   // A protected corrupt preimage must not replace a known-good backup.
   if(this.raw!==null&&!recovery&&!allowProtected){parse(this.raw);this.storage.setItem(COZY_BACKUP_KEY,this.raw);if(this.storage.getItem(COZY_BACKUP_KEY)!==this.raw)throw Error('saveUnavailable');}
   this.storage.setItem(COZY_SAVE_KEY,after);if(this.storage.getItem(COZY_SAVE_KEY)!==after)throw Error('saveUnavailable');this.raw=after;this.state=next;this.status='saveSaved';this.readOnly=false;return result;
  }catch(error){this.status=errorCode(error);return fail(this.status);}
 }
 /** @param {string} type @param {Record<string,any>} [args] @returns {Result} */
 command(type,args={}){const fresh=this._fresh();if(!fresh.ok)return fresh;const result=dispatchCozy(this.state,{...args,type,revision:this.state.revision});if(!result.ok)return result;return this._save(result.state,result);}
 /** @param {number} hours */ advance(hours){return this.command('advance',{hours});}
 /** @param {string} kind @param {{x:number,z:number,rotation:number}} transform */ build(kind,transform){return this.command('build',{kind,transform:{x:transform.x,z:transform.z,rotation:transform.rotation}});}
 /** @param {string} id @param {{x:number,z:number,rotation:number}} transform */ move(id,transform){return this.command('move',{id,transform:{x:transform.x,z:transform.z,rotation:transform.rotation}});}
 /** @param {any} candidate */ previewPlacement(candidate){return placementIssue(this.state,candidate);}
 /** Exact protected bytes remain exportable even when the primary cannot be read. */
 exportBundle(){if(this.readOnly&&this.raw!==null&&this.status!=='saveConflict'){try{parse(this.raw);}catch{return this.raw;}}return JSON.stringify({format:'MyFarmTwinCozyBackup',version:2,state:this.state});}
 exportLegacy(){return this.state.provenance.native||this.legacyRaw||'';}
 /** @param {string} raw @returns {Result} */
 importBundle(raw){if(this.status==='saveNewer'||this.status==='saveConflict'||this.transactionRaw!==null)return fail(this.status==='saveNewer'?'saveNewer':this.status==='saveConflict'?'saveConflict':'saveImportPending');const protectedImport=this.readOnly&&['saveCorrupt','saveImportInvalid','layoutInvalid','saveTooLarge'].includes(this.status);const fresh=this._fresh(protectedImport);if(!fresh.ok)return fresh;try{if(typeof raw!=='string'||new TextEncoder().encode(raw).length>COZY_MAX_SAVE_BYTES)throw Error('saveTooLarge');const v=JSON.parse(raw);let next;if(v?.format==='MyFarmTwinCozyBackup'){if(Object.keys(v).length!==3||v.version!==2)throw Error(v.version>2?'saveNewer':'saveImportInvalid');next=validateCozyState(v.state);}else if(v?.format==='MyFarmTwinGLBPrototype'){if(Object.keys(v).length!==4||v.version!==1||typeof v.native!=='string')throw Error('saveImportInvalid');next=migrateLegacy(v.native,JSON.stringify(validatePrototypeLayout(v.layout)));}else if(v?.format==='MyFarmTwinCozy')next=validateCozyState(v);else next=migrateLegacy(raw);return this._save(structuredClone(next),{ok:true,error:'',events:[{type:'imported'}]},{archiveImport:true,allowProtected:protectedImport,recovery:protectedImport});}catch(error){return fail(errorCode(error)==='saveUnavailable'?'saveImportInvalid':errorCode(error));}}
 /** @returns {Result} */
 recoverBackup(){if(this.status==='saveNewer'||this.status==='saveConflict')return fail(this.status);const fresh=this._fresh(true);if(!fresh.ok)return fresh;if(this.transactionRaw!==null)return fail('saveImportPending');try{const raw=this.storage?.getItem(COZY_BACKUP_KEY);if(!raw)return fail('backupMissing');const next=parse(raw);return this._save(next,{ok:true,error:'',events:[{type:'recovered'}]},{allowProtected:true,recovery:true});}catch{return fail('backupInvalid');}}
}
