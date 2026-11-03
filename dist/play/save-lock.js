/** All browser primary/backup/archive writes share this origin-scoped lock. */
export const writeLockAvailable=()=>typeof navigator!=='undefined'&&!!navigator.locks;
/** Unsupported browsers receive a read-only storage adapter; memory play/export remain available. @template T @param {()=>T|Promise<T>} action @returns {Promise<T>} */
export async function withSaveLock(action){if(!writeLockAvailable())return action();return navigator.locks.request('myfarmtwin.save.write',()=>action());}
