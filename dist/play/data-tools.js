import {el} from './dom.js';import {t} from './locales.js';import {serialize,deserialize,MAX_SAVE_BYTES} from './save-schema.js';import {createState} from './engine.js';
/** @param {string} text @param {string} name */
function download(text,name){const url=URL.createObjectURL(new Blob([text],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
/** @param {import('./storage.js').SaveSession} session */
export function renderData(session){el('export-original').hidden=!session.original();const archive=session.migrationOriginal();el('export-pre-chicken').hidden=!archive||archive===session.original();el('restore-backup').hidden=!session.backup();/** @type {HTMLInputElement} */(el('import-save')).setAttribute('aria-label',t('importSave'));}
/** @param {{getState:()=>import('./engine.js').State,replace:(state:import('./engine.js').State)=>void,session:import('./storage.js').SaveSession}} options */
export function setupData({getState,replace,session}){
 const dialog=/** @type {HTMLDialogElement} */(el('data-confirm')),input=/** @type {HTMLInputElement} */(el('import-save'));
 /** @type {{state:import('./engine.js').State}|null} */let pending=null;
 /** @param {import('./engine.js').State} state @param {string} kind */
 function confirm(state,kind){pending={state};el('data-confirm-title').textContent=t(kind==='reset'?'resetQuestion':'importQuestion');const c=state.chicken;el('data-confirm-copy').textContent=t('replaceWarning')+' '+t('day')+' '+(Math.floor(state.tick/24)+1)+' · '+state.coins+' '+t('coins')+' · '+state.plots.length+' '+t('bedsBuilt')+' · '+t('hensCount')+' '+(c?.hens.length||0)+' · '+t('eggsReady')+' '+(c?.coop?.pending.length||0)+' · '+t('eggsInInventory')+' '+(c?.inventory.reduce((n,l)=>n+l.quantity,0)||0);dialog.showModal();}
 el('export-save').addEventListener('click',()=>{try{download(serialize(getState()),'myfarmtwin-save.json');el('data-message').textContent=t('saveExported');}catch{el('data-message').textContent=t('invalidSave');}});
 el('export-original').addEventListener('click',()=>{const raw=session.original();if(raw)download(raw,'myfarmtwin-stored-original.json');});
 el('export-pre-chicken').addEventListener('click',()=>{const raw=session.migrationOriginal();if(raw)download(raw,'myfarmtwin-before-chicken.json');});
 input.addEventListener('change',async()=>{const file=input.files?.[0];if(!file)return;try{if(file.size>MAX_SAVE_BYTES)throw new Error('large');const state=deserialize(await file.text());confirm(state,'import');}catch{el('data-message').textContent=t('invalidSave');input.value='';}});
 el('reset-save').addEventListener('click',()=>confirm(createState(),'reset'));
 el('restore-backup').addEventListener('click',()=>{const backup=session.backup();if(backup)confirm(backup,'backup');else el('data-message').textContent=t('invalidSave');});
 el('data-cancel').addEventListener('click',()=>{pending=null;input.value='';dialog.close();});dialog.addEventListener('cancel',()=>{pending=null;input.value='';});
 el('data-apply').addEventListener('click',()=>{if(!pending)return;try{replace(pending.state);el('data-message').textContent=t('saveReplaced');}catch(error){el('data-message').textContent=t(error instanceof Error&&['saveConflict','savePreserveFirst'].includes(error.message)?error.message:'saveUnavailable');}pending=null;input.value='';dialog.close();renderData(session);});
}
