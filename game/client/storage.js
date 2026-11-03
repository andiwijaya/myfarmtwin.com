import {serialize,deserialize} from './save-schema.js';
export const SAVE_KEY='myfarmtwin.save.v1';export const BACKUP_KEY='myfarmtwin.save.backup.v1';
/** @typedef {Pick<Storage,'getItem'|'setItem'|'removeItem'>} Store */
export class SaveSession{
 /** @param {Store|null} storage */
 constructor(storage){this.storage=storage;/** @type {string|null} */this.raw=null;this.blocked=false;}
 /** @returns {{state:import('./engine.js').State|null,status:string}} */
 load(){if(!this.storage)return {state:null,status:'saveUnavailable'};try{this.raw=this.storage.getItem(SAVE_KEY);if(this.raw===null)return {state:null,status:'saveReady'};try{return {state:deserialize(this.raw),status:'saveResumed'};}catch{this.blocked=true;return {state:null,status:'saveCorrupt'};}}catch{return {state:null,status:'saveUnavailable'};}}
 /** @param {import('./engine.js').State} state */
 save(state){if(!this.storage)throw new Error('saveUnavailable');if(this.blocked)throw new Error('saveCorrupt');const text=serialize(state);if(this.storage.getItem(SAVE_KEY)!==this.raw)throw new Error('saveConflict');if(this.raw!==null)this.storage.setItem(BACKUP_KEY,this.raw);this.storage.setItem(SAVE_KEY,text);this.raw=text;}
}
/** @returns {Store|null} */
export function browserStorage(){try{return window.localStorage;}catch{return null;}}
