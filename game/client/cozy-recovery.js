import {CozySession} from './cozy-storage.js';
import {browserStorage} from './storage.js';
import {withSaveLock,writeLockAvailable} from './save-lock.js';
import {recoverLegacyTransaction,exportCurrentP2} from './cozy-legacy-recovery.js';
const session=new CozySession(browserStorage(false),{writable:false});
/** @param {string} id */
function el(id){const node=document.getElementById(id);if(!node)throw Error('Missing recovery control');return node;}
function show(){/** @type {HTMLTextAreaElement} */(el('recovery-text')).value=session.exportBundle();el('recovery-status').textContent='Cadangan lengkap termasuk tata letak dan arsip sumber. / Complete backup includes your layout and source archives.';}
el('recovery-export').addEventListener('click',show);
el('recovery-legacy').addEventListener('click',()=>{/** @type {HTMLTextAreaElement} */(el('recovery-text')).value=session.exportLegacy();el('recovery-status').textContent=session.exportLegacy()?'Arsip asli sebelum migrasi. / Original archive from before migration.':'Farm ini tidak mempunyai arsip lama. / This farm has no legacy archive.';});
el('recovery-p2').addEventListener('click',()=>{/** @type {HTMLTextAreaElement} */(el('recovery-text')).value=exportCurrentP2(browserStorage(false));el('recovery-status').textContent='Bundle cabang P2 tersimpan. Progres Cozy terbaru tetap pada cadangan lengkap. / Stored P2 branch; latest Cozy progress remains in the complete backup.';});
el('recovery-p2').hidden=session.legacyRaw===null&&session.legacyLayoutRaw===null&&session.transactionRaw===null;
el('recovery-pending').hidden=session.status!=='saveImportPending';
el('recovery-pending').addEventListener('click',async()=>{const result=await withSaveLock(()=>recoverLegacyTransaction(browserStorage(writeLockAvailable()),{writable:writeLockAvailable()}));el('recovery-status').textContent=result.ok?'Simpanan P2 diselesaikan tanpa mengubah farm Cozy yang sudah ada. Simpan kedua cadangan bila perlu, lalu Buka farm. / P2 save completed; existing Cozy progress is unchanged. Keep both backups if needed, then Open farm.':'Pemulihan belum dapat diselesaikan; jurnal dan progres asli dipertahankan. / Recovery could not finish; the original journal and progress are preserved.';if(result.ok)el('recovery-pending').hidden=true;});
const state=session.state;el('recovery-summary').textContent=['saveCorrupt','saveImportInvalid','saveNewer','saveTooLarge'].includes(session.status)?'Data dilindungi; cadangan asli tetap dapat ditampilkan. / Protected data; the original bytes remain exportable.':state.plots.length+' bed · '+state.coins+' koin · '+state.facilities.length+' fasilitas · revisi '+state.revision;
document.body.dataset.recoveryReady='true';show();
