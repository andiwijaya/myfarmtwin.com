import {CozySession} from './cozy-storage.js';
import {browserStorage} from './storage.js';
const session=new CozySession(browserStorage(false),{writable:false});
/** @param {string} id */
function el(id){const node=document.getElementById(id);if(!node)throw Error('Missing recovery control');return node;}
function show(){/** @type {HTMLTextAreaElement} */(el('recovery-text')).value=session.exportBundle();el('recovery-status').textContent='Cadangan lengkap termasuk tata letak dan arsip sumber. / Complete backup includes your layout and source archives.';}
el('recovery-export').addEventListener('click',show);
el('recovery-legacy').addEventListener('click',()=>{/** @type {HTMLTextAreaElement} */(el('recovery-text')).value=session.exportLegacy();el('recovery-status').textContent=session.exportLegacy()?'Arsip asli sebelum migrasi. / Original archive from before migration.':'Farm ini tidak mempunyai arsip lama. / This farm has no legacy archive.';});
const state=session.state;el('recovery-summary').textContent=['saveCorrupt','saveImportInvalid','saveNewer','saveTooLarge'].includes(session.status)?'Data dilindungi; cadangan asli tetap dapat ditampilkan. / Protected data; the original bytes remain exportable.':state.plots.length+' bed · '+state.coins+' koin · '+state.facilities.length+' fasilitas · revisi '+state.revision;
document.body.dataset.recoveryReady='true';show();
