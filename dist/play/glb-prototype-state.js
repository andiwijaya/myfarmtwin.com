import {createState,dispatch} from './engine.js';
import {activateGarden} from './active-garden.js';
import {serialize,deserialize,MAX_SAVE_BYTES} from './save-schema.js';
import {SaveSession,SAVE_KEY,BACKUP_KEY,PRE_V2_KEY,PRE_V3_KEY,PRE_V4_KEY,PRE_V5_KEY,PRE_V6_KEY,ACTIVE_GARDEN_KEY} from './storage.js';

export const GLB_LAYOUT_KEY='myfarmtwin.glb.layout.v1';
export const GLB_LAYOUT_BACKUP_KEY='myfarmtwin.glb.layout.backup.v1';
export const GLB_NATIVE_ARCHIVE_KEY='myfarmtwin.save.before-glb-prototype.v1';
export const GLB_LAYOUT_ARCHIVE_KEY='myfarmtwin.glb.layout.before-import.v1';
export const GLB_TRANSACTION_KEY='myfarmtwin.glb.transaction.v1';
export const GLB_OWNED_BOUNDS=Object.freeze({minX:-22,maxX:22,minZ:-18,maxZ:18});

/** @typedef {'bed'|'barn'|'pump'|'path'|'fence'|'tree'|'banana'|'grass'} BuildKind */
/** @typedef {{id:string,kind:BuildKind,x:number,z:number,rotation:number}} Placement */
/** @typedef {{format:'MyFarmTwinLayout',version:1,revision:number,nextId:number,items:Placement[]}} PrototypeLayout */
/** @typedef {{width:number,depth:number,kitLimit:number,price:number,nativeCommand?:import('./engine.js').CommandType}} BuildDefinition */
/** @typedef {{ok:boolean,error:string,events:import('./engine.js').DomainEvent[],id?:string}} ActionResult */
/** @typedef {{format:'MyFarmTwinGLBTransaction',version:1,beforeNative:string|null,beforeLayout:string|null,afterNative:string,afterLayout:string}} Transaction */
/** @typedef {Pick<Storage,'getItem'|'setItem'|'removeItem'>} Store */

/** Prices are native facility prices, not a second economy. Decorative kits
 * are explicitly free and bounded; removing one returns it to the kit.
 * @type {Readonly<Record<BuildKind,Readonly<BuildDefinition>>>} */
export const GLB_BUILD_CATALOG=Object.freeze({
 bed:Object.freeze({width:1.5,depth:1.8,kitLimit:24,price:0}),
 barn:Object.freeze({width:10,depth:8,kitLimit:1,price:0,nativeCommand:'enterCow'}),
 pump:Object.freeze({width:1,depth:1,kitLimit:1,price:60,nativeCommand:'buyPump'}),
 path:Object.freeze({width:2,depth:2,kitLimit:40,price:0}),
 fence:Object.freeze({width:2,depth:.16,kitLimit:40,price:0}),
 tree:Object.freeze({width:2.2,depth:2.2,kitLimit:8,price:0}),
 banana:Object.freeze({width:1.8,depth:1.8,kitLimit:8,price:0}),
 grass:Object.freeze({width:.7,depth:.7,kitLimit:24,price:0})
});
const TAU=Math.PI*2,MAX_LAYOUT_BYTES=80_000,MAX_BUNDLE_BYTES=MAX_SAVE_BYTES+MAX_LAYOUT_BYTES+100_000;
/** @param {string} [error] @returns {ActionResult} */
const fail=(error='saveUnavailable')=>({ok:false,error,events:[]});
/** @param {import('./engine.js').DomainEvent[]} [events] @param {string} [id] @returns {ActionResult} */
const success=(events=[],id)=>({ok:true,error:'',events,...(id?{id}:{})});
/** @param {unknown} value @param {readonly string[]} keys @returns {Record<string,any>} */
function record(value,keys){
 if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)throw Error('layoutInvalid');
 if(Reflect.ownKeys(value).length!==keys.length||keys.some(k=>!Object.hasOwn(value,k))||Object.values(Object.getOwnPropertyDescriptors(value)).some(d=>!Object.hasOwn(d,'value')||!d.enumerable))throw Error('layoutInvalid');
 return /** @type {Record<string,any>} */(value);
}
/** @param {unknown} value @param {number} [max] @returns {number} */
function integer(value,max=1e9){if(typeof value!=='number'||!Number.isSafeInteger(value)||value<0||value>max)throw Error('layoutInvalid');return value;}
/** @param {unknown} value @returns {BuildKind} */
function kind(value){if(typeof value!=='string'||!Object.hasOwn(GLB_BUILD_CATALOG,value))throw Error('layoutInvalid');return /** @type {BuildKind} */(value);}
/** @param {unknown} value @returns {Placement} */
function validatePlacement(value){
 const p=record(value,['id','kind','x','z','rotation']),k=kind(p.kind);
 if(typeof p.id!=='string'||p.id.length>48||!new RegExp('^'+k+'(?:\\.(?:0|[1-9][0-9]*))?$').test(p.id))throw Error('layoutInvalid');
 if(![p.x,p.z,p.rotation].every(v=>typeof v==='number'&&Number.isFinite(v))||p.rotation<0||p.rotation>=TAU)throw Error('layoutInvalid');
 return {id:p.id,kind:k,x:p.x,z:p.z,rotation:p.rotation};
}
/** @returns {PrototypeLayout} */
export function createPrototypeLayout(){
 const items=Array.from({length:24},(_,i)=>({id:'bed.'+i,kind:/** @type {BuildKind} */('bed'),x:-15+(i%6)*2,z:-7.5+Math.floor(i/6)*2.4,rotation:0}));
 items.push({id:'barn',kind:'barn',x:7,z:-4,rotation:0},{id:'pump',kind:'pump',x:-3,z:3.5,rotation:0});
 return {format:'MyFarmTwinLayout',version:1,revision:0,nextId:1,items};
}
/** @param {Placement} p */
function box(p){const d=GLB_BUILD_CATALOG[p.kind],c=Math.cos(p.rotation),s=Math.sin(p.rotation);return {p,axes:[{x:c,z:-s},{x:s,z:c}],half:[d.width/2,d.depth/2],xExtent:Math.abs(c)*d.width/2+Math.abs(s)*d.depth/2,zExtent:Math.abs(s)*d.width/2+Math.abs(c)*d.depth/2};}
/** Oriented rectangle overlap, allowing touching footprints without imposing
 * conservative AABB collisions at diagonal angles. @param {Placement} a @param {Placement} b */
export function placementsOverlap(a,b){
 const aa=box(a),bb=box(b),dx=b.x-a.x,dz=b.z-a.z;
 for(const axis of [...aa.axes,...bb.axes]){
  const distance=Math.abs(dx*axis.x+dz*axis.z),radiusA=aa.half.reduce((n,h,i)=>n+h*Math.abs(aa.axes[i].x*axis.x+aa.axes[i].z*axis.z),0),radiusB=bb.half.reduce((n,h,i)=>n+h*Math.abs(bb.axes[i].x*axis.x+bb.axes[i].z*axis.z),0);
  if(distance>=radiusA+radiusB-1e-5)return false;
 }
 return true;
}
/** @param {PrototypeLayout} layout @param {Placement} candidate */
export function placementIssue(layout,candidate){
 let p;try{p=validatePlacement(candidate);}catch{return 'layoutInvalid';}
 const b=box(p),bounds=GLB_OWNED_BOUNDS;
 if(p.x-b.xExtent<bounds.minX||p.x+b.xExtent>bounds.maxX||p.z-b.zExtent<bounds.minZ||p.z+b.zExtent>bounds.maxZ)return 'layoutOutsideFarm';
 if(layout.items.some(other=>other.id!==p.id&&placementsOverlap(p,other)))return 'layoutOccupied';
 return '';
}
/** Strict import/storage boundary; native bed coordinates are deliberately
 * unaffected by this presentation-only transform map.
 * @param {unknown} value @returns {PrototypeLayout} */
export function validatePrototypeLayout(value){
 const v=record(value,['format','version','revision','nextId','items']);
 if(v.format!=='MyFarmTwinLayout')throw Error('layoutInvalid');if(v.version!==1)throw Error('layoutNewer');
 const revision=integer(v.revision),nextId=integer(v.nextId);if(nextId<1||!Array.isArray(v.items)||v.items.length>170||Object.getPrototypeOf(v.items)!==Array.prototype||Reflect.ownKeys(v.items).length!==v.items.length+1||Object.values(Object.getOwnPropertyDescriptors(v.items)).some(d=>!Object.hasOwn(d,'value')))throw Error('layoutInvalid');
 const items=v.items.map(validatePlacement),layout=/** @type {PrototypeLayout} */({format:v.format,version:1,revision,nextId,items}),ids=new Set();
 for(const item of items){if(ids.has(item.id))throw Error('layoutInvalid');ids.add(item.id);if(item.kind==='bed'&&(!/^bed\.(?:[0-9]|1[0-9]|2[0-3])$/.test(item.id)))throw Error('layoutInvalid');if(item.kind==='barn'&&item.id!=='barn'||item.kind==='pump'&&item.id!=='pump')throw Error('layoutInvalid');if(!['bed','barn','pump'].includes(item.kind)&&(!item.id.includes('.')||Number(item.id.split('.')[1])>=nextId))throw Error('layoutInvalid');if(placementIssue(layout,item))throw Error('layoutInvalid');}
 for(let i=0;i<24;i++)if(!ids.has('bed.'+i))throw Error('layoutInvalid');if(!ids.has('barn')||!ids.has('pump'))throw Error('layoutInvalid');
 for(const [k,d]of Object.entries(GLB_BUILD_CATALOG))if(items.filter(p=>p.kind===k).length>d.kitLimit)throw Error('layoutInvalid');
 return layout;
}
/** @param {PrototypeLayout} layout */
function layoutText(layout){const text=JSON.stringify(validatePrototypeLayout(layout));if(new TextEncoder().encode(text).length>MAX_LAYOUT_BYTES)throw Error('layoutTooLarge');return text;}
/** @param {string} text @returns {PrototypeLayout} */
function parseLayout(text){if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_LAYOUT_BYTES)throw Error('layoutTooLarge');let value;try{value=JSON.parse(text);}catch{throw Error('layoutInvalid');}return validatePrototypeLayout(value);}
/** @param {string} text @returns {Transaction} */
function parseTransaction(text){
 if(new TextEncoder().encode(text).length>2*MAX_BUNDLE_BYTES+100_000)throw Error('saveImportPending');
 const j=record(JSON.parse(text),['format','version','beforeNative','beforeLayout','afterNative','afterLayout']);
 if(j.format!=='MyFarmTwinGLBTransaction'||j.version!==1||!(j.beforeNative===null||typeof j.beforeNative==='string')||!(j.beforeLayout===null||typeof j.beforeLayout==='string')||typeof j.afterNative!=='string'||typeof j.afterLayout!=='string')throw Error('saveImportPending');
 deserialize(j.afterNative);parseLayout(j.afterLayout);return /** @type {Transaction} */(j);
}
/** @param {string|null} raw */
function archiveKeys(raw){if(raw===null)return [];const old=JSON.parse(raw),version=old.saveVersion;return [...(version<2?[PRE_V2_KEY]:[]),...(version<3?[PRE_V3_KEY]:[]),...(version<4?[PRE_V4_KEY]:[]),...(version<5?[PRE_V5_KEY]:[]),...(version<6?[PRE_V6_KEY]:[]),...(old.state.plots.length<24?[ACTIVE_GARDEN_KEY]:[])];}

/** Canonical native V6 state plus a presentation sidecar. Opening is read-only.
 * Wrap every mutating method in withSaveLock() in the browser. Browsers without
 * Web Locks should pass {writable:false}; no personal profile is needed by tests.
 */
export class PrototypeSession{
 /** @param {Store|null} storage @param {{writable?:boolean}} [options] */
 constructor(storage,{writable=true}={}){
  this.storage=storage;this.writable=writable;this.state=createState();this.layout=createPrototypeLayout();this.status='saveReady';this.layoutStatus='layoutReady';this.readOnly=!storage||!writable;
  /** @type {string|null} */
  this.raw=null;
  /** @type {string|null} */
  this.layoutRaw=null;
  /** @type {Transaction|null} */
  this.pending=null;
  /** @type {string|null} */
  this.transactionRaw=null;
  this.native=new SaveSession(storage,{expandGarden:true});
  this._open();
 }
 _open(){
  if(!this.storage){this.status='saveUnavailable';this.readOnly=true;return;}
  try{
   this.raw=this.storage.getItem(SAVE_KEY);this.layoutRaw=this.storage.getItem(GLB_LAYOUT_KEY);this.transactionRaw=this.storage.getItem(GLB_TRANSACTION_KEY);
  }catch{this.status='saveUnavailable';this.readOnly=true;return;}
  if(this.transactionRaw){
   try{
    this.pending=parseTransaction(this.transactionRaw);const p=this.pending;if(![p.beforeNative,p.afterNative].includes(this.raw)||![p.beforeLayout,p.afterLayout].includes(this.layoutRaw))throw Error('saveConflict');
    this.state=activateGarden(deserialize(p.afterNative));this.layout=parseLayout(p.afterLayout);this.status='saveImportPending';this.layoutStatus='layoutImportPending';
   }catch(error){
    this.readOnly=true;this.status=error instanceof Error&&error.message==='saveConflict'?'saveConflict':'saveImportPending';
    // Expose valid current native progress even when the journal needs manual
    // attention. Never show a fabricated fresh farm over a valid stored farm.
    try{if(this.raw!==null)this.state=activateGarden(deserialize(this.raw));}catch{/* The native source remains protected. */}
    try{if(this.layoutRaw!==null){this.layout=parseLayout(this.layoutRaw);this.layoutStatus='layoutResumed';}}catch(error){this.layoutStatus=error instanceof Error&&error.message.startsWith('layout')?error.message:'layoutInvalid';}
   }
  }else{
   try{if(this.raw!==null){this.state=activateGarden(deserialize(this.raw));this.status=JSON.parse(this.raw).saveVersion===6&&JSON.parse(this.raw).state.plots.length===24?'saveResumed':'saveMigrationPreview';}}catch(error){this.readOnly=true;this.status=error instanceof Error&&error.message==='saveNewer'?'saveNewer':'saveCorrupt';}
   try{if(this.layoutRaw!==null){this.layout=parseLayout(this.layoutRaw);this.layoutStatus='layoutResumed';}}catch(error){this.readOnly=true;this.layoutStatus=error instanceof Error&&error.message.startsWith('layout')?error.message:'layoutInvalid';}
  }
  this.native.raw=this.raw;this.native.blocked=this.readOnly;
 }
 /** @returns {ActionResult} */
 _fresh(){
  if(this.readOnly||!this.storage)return fail(!this.writable?'saveReadOnly':!['layoutReady','layoutResumed','layoutSaved','layoutImportPending'].includes(this.layoutStatus)?this.layoutStatus:this.status==='saveReady'?'saveUnavailable':this.status);
  try{if(this.storage.getItem(SAVE_KEY)!==this.raw||this.storage.getItem(GLB_LAYOUT_KEY)!==this.layoutRaw||this.storage.getItem(GLB_TRANSACTION_KEY)!==this.transactionRaw)throw Error('saveConflict');return success();}catch(error){this.readOnly=true;this.status=error instanceof Error&&error.message==='saveConflict'?'saveConflict':'saveUnavailable';return fail(this.status);}
 }
 /** @param {string|null} raw */
 _archiveNative(raw){
  if(!this.storage||raw===null)return;for(const key of archiveKeys(raw)){const old=this.storage.getItem(key);if(old!==null&&old!==raw)throw Error('savePreserveFirst');}
  for(const key of archiveKeys(raw))if(this.storage.getItem(key)===null)this.storage.setItem(key,raw);
  if(this.storage.getItem(GLB_NATIVE_ARCHIVE_KEY)===null)this.storage.setItem(GLB_NATIVE_ARCHIVE_KEY,raw);
 }
 /** Complete a previously durable, explicitly requested operation; no action or
  * purchase is replayed. Constructor itself never performs recovery writes.
  * @returns {ActionResult} */
 recoverPending(){
  const fresh=this._fresh();if(!fresh.ok)return fresh;if(!this.pending)return success();if(!this.storage)return fail();
  try{
   const p=this.pending;this._archiveNative(p.beforeNative);if(p.beforeNative!==null)this.storage.setItem(BACKUP_KEY,p.beforeNative);if(p.beforeLayout!==null)this.storage.setItem(GLB_LAYOUT_BACKUP_KEY,p.beforeLayout);
   if(this.raw!==p.afterNative)this.storage.setItem(SAVE_KEY,p.afterNative);if(this.layoutRaw!==p.afterLayout)this.storage.setItem(GLB_LAYOUT_KEY,p.afterLayout);this.storage.removeItem(GLB_TRANSACTION_KEY);
   this.raw=p.afterNative;this.layoutRaw=p.afterLayout;this.native.raw=this.raw;this.state=activateGarden(deserialize(this.raw));this.layout=parseLayout(this.layoutRaw);this.pending=null;this.transactionRaw=null;this.status='saveSaved';this.layoutStatus='layoutSaved';return success();
  }catch{this.status='saveImportPending';return fail('saveImportPending');}
 }
 /** @returns {ActionResult} */
 _prepare(){return this.pending?this.recoverPending():this._fresh();}
 /** @param {import('./engine.js').State} next @param {import('./engine.js').DomainEvent[]} events @returns {ActionResult} */
 _saveNative(next,events){
  const fresh=this._prepare();if(!fresh.ok)return fresh;
  try{serialize(next);this._archiveNative(this.raw);this.native.raw=this.raw;this.native.save(next);this.raw=this.native.raw;this.state=next;this.status='saveSaved';return success(events);}catch(error){return fail(error instanceof Error&&error.message==='savePreserveFirst'?'savePreserveFirst':'saveUnavailable');}
 }
 /** @param {PrototypeLayout} next @param {string} [id] @returns {ActionResult} */
 _saveLayout(next,id){
  const fresh=this._prepare();if(!fresh.ok)return fresh;if(!this.storage)return fail();
  try{const text=layoutText(next);if(this.layoutRaw!==null)this.storage.setItem(GLB_LAYOUT_BACKUP_KEY,this.layoutRaw);this.storage.setItem(GLB_LAYOUT_KEY,text);this.layoutRaw=text;this.layout=next;this.layoutStatus='layoutSaved';return success([],id);}catch{return fail('layoutSaveUnavailable');}
 }
 /** Durable two-key transaction. On interruption, its validated postimage is
  * completed after reload/next action; snapshot conflicts always block recovery.
  * @param {import('./engine.js').State} state @param {PrototypeLayout} layout @param {import('./engine.js').DomainEvent[]} [events] @param {string} [id] @returns {ActionResult} */
 _savePair(state,layout,events=[],id){
  const fresh=this._prepare();if(!fresh.ok)return fresh;if(!this.storage)return fail();
  try{
   const afterNative=serialize(state),afterLayout=layoutText(layout);this._archiveNative(this.raw);if(this.layoutRaw!==null&&this.storage.getItem(GLB_LAYOUT_ARCHIVE_KEY)===null)this.storage.setItem(GLB_LAYOUT_ARCHIVE_KEY,this.layoutRaw);
   const journal=/** @type {Transaction} */({format:'MyFarmTwinGLBTransaction',version:1,beforeNative:this.raw,beforeLayout:this.layoutRaw,afterNative,afterLayout});
   const text=JSON.stringify(journal);this.storage.setItem(GLB_TRANSACTION_KEY,text);this.transactionRaw=text;this.pending=journal;const done=this.recoverPending();return done.ok?success(events,id):done;
  }catch{return fail('saveUnavailable');}
 }
 /** @param {import('./engine.js').CommandType} type @param {Omit<Partial<import('./engine.js').Command>,'id'|'type'>} [args] @returns {ActionResult} */
 command(type,args={}){
  const fresh=this._prepare();if(!fresh.ok)return fresh;let result;
  try{result=dispatch(this.state,/** @type {import('./engine.js').Command} */({...args,id:this.state.revision+1,type}));}catch{return fail('invalidCommand');}
  if(!result.ok)return fail(result.error);return this._saveNative(result.state,result.events);
 }
 /** Player-controlled native simulation hours, never synthetic harvest/yields.
  * Original pause state is restored; one final validated snapshot is saved.
  * @param {number} hours @returns {ActionResult} */
 advance(hours){
  if(!Number.isSafeInteger(hours)||hours<1||hours>24)return fail('invalidHours');const fresh=this._prepare();if(!fresh.ok)return fresh;
  let next=this.state;const events=/** @type {import('./engine.js').DomainEvent[]} */([]),wasPaused=next.paused;
  for(const type of [...(wasPaused?['pause']:[]),...Array.from({length:hours},()=> 'tick'),...(wasPaused?['pause']:[])]){
   const result=dispatch(next,{id:next.revision+1,type:/** @type {import('./engine.js').CommandType} */(type)});if(!result.ok)return fail(result.error);next=result.state;events.push(...result.events);
  }
  return this._saveNative(next,events);
 }
 /** @param {Placement} item */
 previewPlacement(item){return placementIssue(this.layout,item);}
 /** @param {string} id @param {{x:number,z:number,rotation:number}} transform @returns {ActionResult} */
 move(id,transform){
  const item=this.layout.items.find(p=>p.id===id);if(!item)return fail('layoutMissing');const candidate={...item,...transform,rotation:((transform.rotation%TAU)+TAU)%TAU};const error=this.previewPlacement(candidate);if(error)return fail(error);
  return this._saveLayout({...this.layout,revision:this.layout.revision+1,items:this.layout.items.map(p=>p.id===id?candidate:{...p})},id);
 }
 /** Native barn/pump ownership is confirmed with its actual engine command.
  * Decorative kits have no cost and cannot create farm income or stock.
  * @param {BuildKind} buildKind @param {{x:number,z:number,rotation:number}} transform @returns {ActionResult} */
 build(buildKind,transform){
  if(!Object.hasOwn(GLB_BUILD_CATALOG,buildKind)||buildKind==='bed')return fail('layoutKitExhausted');const d=GLB_BUILD_CATALOG[buildKind],native=!!d.nativeCommand;
  if(buildKind==='barn'&&this.state.cow?.visited||buildKind==='pump'&&this.state.pump.built)return fail('layoutAlreadyOwned');if(!native&&this.layout.items.filter(p=>p.kind===buildKind).length>=d.kitLimit)return fail('layoutKitExhausted');
  const id=native?buildKind:buildKind+'.'+this.layout.nextId,candidate={id,kind:buildKind,...transform,rotation:((transform.rotation%TAU)+TAU)%TAU},error=this.previewPlacement(candidate);if(error)return fail(error);
  const layout={...this.layout,revision:this.layout.revision+1,nextId:this.layout.nextId+(native?0:1),items:native?this.layout.items.map(p=>p.id===id?candidate:{...p}):[...this.layout.items.map(p=>({...p})),candidate]};
  if(!d.nativeCommand)return this._saveLayout(layout,id);const fresh=this._prepare();if(!fresh.ok)return fresh;
  const result=dispatch(this.state,{id:this.state.revision+1,type:d.nativeCommand});if(!result.ok)return fail(result.error);return this._savePair(result.state,layout,result.events,id);
 }
 /** Remove only a free decorative kit part; native property is never deleted.
  * @param {string} id @returns {ActionResult} */
 remove(id){const item=this.layout.items.find(p=>p.id===id);if(!item)return fail('layoutMissing');if(['bed','barn','pump'].includes(item.kind))return fail('layoutOwnedFacility');return this._saveLayout({...this.layout,revision:this.layout.revision+1,items:this.layout.items.filter(p=>p.id!==id)},id);}
 exportNative(){return serialize(this.state);}
 exportBundle(){return JSON.stringify({format:'MyFarmTwinGLBPrototype',version:1,native:serialize(this.state),layout:validatePrototypeLayout(this.layout)});}
 /** Root UI owns explicit confirmation before calling this replacement.
  * @param {string} text @returns {ActionResult} */
 importNative(text){let next;try{next=activateGarden(deserialize(text));}catch(error){return fail(error instanceof Error&&error.message==='saveNewer'?'saveNewer':'saveImportInvalid');}return this._savePair(next,this.layout);}
 /** Native save plus complete validated layout; no partial permissive import.
  * Root UI confirms replacement before invoking this method.
  * @param {string} text @returns {ActionResult} */
 importBundle(text){
  try{if(typeof text!=='string'||new TextEncoder().encode(text).length>MAX_BUNDLE_BYTES)return fail('saveImportInvalid');const b=record(JSON.parse(text),['format','version','native','layout']);if(b.format!=='MyFarmTwinGLBPrototype'||b.version!==1||typeof b.native!=='string')return fail('saveImportInvalid');const next=activateGarden(deserialize(b.native)),layout=validatePrototypeLayout(b.layout);return this._savePair(next,layout);}catch(error){return fail(error instanceof Error&&error.message==='saveNewer'?'saveNewer':'saveImportInvalid');}
 }
}

/** @param {Store|null} storage @param {{writable?:boolean}} [options] */
export const createPrototypeSession=(storage,options)=>new PrototypeSession(storage,options);
