import {PrototypeSession,GLB_LAYOUT_KEY,GLB_TRANSACTION_KEY} from './glb-prototype-state.js';
import {SAVE_KEY} from './storage.js';

/** Call inside the shared write lock. A fresh session checks the complete P2
 * journal before completing its recorded afterimages; no command is replayed.
 * @param {Pick<Storage,'getItem'|'setItem'|'removeItem'>|null} storage
 * @param {{writable?:boolean}} [options] */
export function recoverLegacyTransaction(storage,{writable=false}={}){
 if(!writable)return {ok:false,error:'saveReadOnly',events:[]};
 const previous=new PrototypeSession(storage,{writable});
 if(previous.readOnly)return {ok:false,error:previous.status,events:[]};
 if(!previous.pending)return {ok:false,error:'noLegacyPending',events:[]};
 return previous.recoverPending();
}

/** @param {Pick<Storage,'getItem'|'setItem'|'removeItem'>|null} storage */
export function exportCurrentP2(storage){try{if(!storage||[SAVE_KEY,GLB_LAYOUT_KEY,GLB_TRANSACTION_KEY].every(key=>storage.getItem(key)===null))return '';}catch{return '';}return new PrototypeSession(storage,{writable:false}).exportBundle();}
