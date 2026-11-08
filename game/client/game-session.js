import {createState} from './engine.js';
import {SaveSession,browserStorage} from './storage.js';
import {withSaveLock,writeLockAvailable} from './save-lock.js';

/** One existing save session shared by progressive presentation and the native
 * controller. No DOM, simulation interval, command queue or second farm key. */
async function load(){
 let saveSession=new SaveSession(browserStorage(writeLockAvailable()));
 function open(){const result=saveSession.load();if(result.status==='saveReady'){try{saveSession.save(createState());result.status='saveSaved';}catch{result.status='saveUnavailable';}}else if(!writeLockAvailable()&&result.status==='saveResumed')result.status='saveUnavailable';return result;}
 /** @type {ReturnType<SaveSession['load']>} */
 let loaded;try{loaded=await withSaveLock(open);}catch{saveSession=new SaveSession(browserStorage(false));loaded=open();if(loaded.status==='saveResumed')loaded.status='saveUnavailable';}
 return {saveSession,loaded,state:loaded.state||createState()};
}
/** @type {ReturnType<typeof load>|null} */
let pending=null;
export function openGameSession(){return pending??=load();}
