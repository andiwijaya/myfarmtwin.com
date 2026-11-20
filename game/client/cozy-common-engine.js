import {createIndexedDbCheckpointStore, openTransactionalSession} from '@andiwijaya/common-engine';
import {COZY_REALTIME_HOUR_MS, createCozyState, dispatchCozy, placementIssue, validateCozyState} from './cozy-domain.js';

/** @typedef {ReturnType<typeof createCozyState>} FarmState */
/** @typedef {{type:string,args:Record<string,any>}} FarmAction */
/** @typedef {{ok:boolean,error:string,events:any[],id?:string}} FarmResult */
/** @typedef {import('@andiwijaya/common-engine').SessionCheckpoint<FarmState,FarmResult>} FarmCheckpoint */
/** @typedef {import('@andiwijaya/common-engine').CheckpointStore<FarmCheckpoint>} FarmStore */
/** @typedef {import('./cozy-storage.js').CozySession} CozySession */

const MAX_MANUAL_HOURS = 168;
const QA_DATABASE_PREFIX = 'myfarmtwin.qa.common-engine.cozy.v2-';

/** @param {URL} url */
function isLoopback(url) {
  return url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
}

/** @param {URL} url @param {boolean} qaBuild */
export function commonEngineDefaultDatabase(url, qaBuild) {
  if (!qaBuild) return 'myfarmtwin.common-engine.cozy.v2';
  return isLoopback(url) ? QA_DATABASE_PREFIX + 'default' : null;
}

/** @param {URL} url */
export function commonEngineQaDatabase(url) {
  const names = url.searchParams.getAll('qa-session');
  if (!isLoopback(url) || names.length !== 1 || !/^[a-z0-9][a-z0-9-]{7,47}$/.test(names[0])) return null;
  return QA_DATABASE_PREFIX + names[0];
}

/** @param {unknown} value @returns {value is FarmState} */
function isFarmState(value) {
  try {
    validateCozyState(value);
    return true;
  } catch {
    return false;
  }
}

/** @param {string} error @returns {FarmResult} */
const failed = error => ({ok:false, error, events:[]});

/**
 * The existing save is authoritative in both runtimes. IndexedDB retains
 * engine receipts only for the exact save bytes that were last persisted.
 * @param {CozySession} native @param {FarmStore|null} cache
 * @param {boolean} [restoreReceipts] @returns {FarmStore}
 */
function nativeCheckpointStore(native, cache, restoreReceipts = true) {
  /** @type {FarmCheckpoint|null} */ let current = null;
  /** @type {number|null} */ let cacheRevision = null;
  let loaded = false;
  return {
    async read() {
      if (!loaded && cache) {
        loaded = true;
        try {
          const saved = /** @type {FarmCheckpoint|null} */ (await cache.read());
          cacheRevision = saved?.revision ?? null;
          if (restoreReceipts && saved && native.raw !== null && JSON.stringify(saved.state) === native.raw) current = saved;
        } catch {
          cache = null;
        }
      }
      return current;
    },
    async commit(expectedRevision, checkpoint) {
      if ((current?.revision ?? null) !== expectedRevision) return 'conflict';
      const saved = native.saveEngineState(checkpoint.state);
      if (saved.error === 'saveConflict') return 'conflict';
      if (!saved.ok) throw new Error(saved.error);
      current = checkpoint;
      if (cache) {
        try {
          const result = await cache.commit(cacheRevision, checkpoint);
          if (result === 'committed') cacheRevision = checkpoint.revision;
          else cache = null;
        } catch {
          // Native can reopen the accepted save even if IndexedDB is unavailable.
          cache = null;
        }
      }
      return 'committed';
    },
  };
}

/** @param {FarmStore|null} checkpoints @param {{native?:CozySession}} [options] */
export async function openCozyCommonEngine(checkpoints, {native} = {}) {
  let store = native ? nativeCheckpointStore(native, checkpoints) : checkpoints;
  if (!store) throw new Error('Missing Farm checkpoint store');
  const open = () => openTransactionalSession({
    initialState: native?.state ?? createCozyState(),
    isState: isFarmState,
    stepMs: COZY_REALTIME_HOUR_MS,
    maxFrameMs: COZY_REALTIME_HOUR_MS,
    maxManualSteps: MAX_MANUAL_HOURS,
    initialSpeed: 1,
    stepsPerFrame: {1:1},
    store: /** @type {FarmStore} */ (store),
    step(state) {
      const advanced = dispatchCozy(state, {type:'advance',hours:1,revision:state.revision});
      if (!advanced.ok) throw new Error(advanced.error);
      return advanced.state;
    },
    /** @param {FarmState} state @param {FarmAction} action */
    applyAction(state, action) {
      const result = dispatchCozy(state, {...action.args,type:action.type,revision:state.revision});
      if (!result.ok) return {ok:false,reason:result.error};
      /** @type {FarmResult} */
      const receipt = {ok:true,error:'',events:result.events};
      if (result.id !== undefined) receipt.id = result.id;
      return {ok:true,state:result.state,result:receipt};
    },
    actionKey(action) {
      return JSON.stringify(action, (_key, value) => value && typeof value === 'object' && !Array.isArray(value)
        ? Object.fromEntries(Object.keys(value).sort().map(key => [key,value[key]]))
        : value);
    },
  });
  let engine = await open();
  let state = engine.snapshot();
  let status = native?.status ?? (engine.inspect().revision === null ? 'saveReady' : 'saveResumed');
  let readOnly = false;
  let disposed = false;
  const isReadOnly = () => readOnly || Boolean(native?.readOnly);
  const saveStatus = () => native?.readOnly ? native.status : status;

  function saved() {
    state = engine.snapshot();
    status = 'saveSaved';
  }

  /** @param {string} reason */
  function blocked(reason) {
    if (reason === 'conflict') {
      readOnly = true;
      status = 'saveConflict';
    } else {
      status = 'saveUnavailable';
    }
    return failed(status);
  }

  /** @param {number|null} previousRevision @param {number} hours */
  async function saveHours(previousRevision, hours) {
    const result = await engine.checkpoint();
    if (result.status === 'saved') {
      saved();
      return {ok:true,error:'',events:[{type:'timeAdvanced',amount:hours}]};
    }

    // Tick changes are in memory until the checkpoint commits. Restore the
    // last durable state before letting the player retry a failed write.
    engine.dispose();
    if (!disposed && result.reason !== 'conflict') {
      try {
        engine = await open();
        if (disposed) engine.dispose();
        if (engine.inspect().revision !== previousRevision) {
          engine.dispose();
          return blocked('conflict');
        }
      } catch {
        readOnly = true;
      }
    }
    return blocked(result.reason);
  }

  /** @param {() => FarmResult} replace */
  async function replaceProgress(replace) {
    if (!native || readOnly || disposed) return failed(saveStatus());
    const result = replace();
    if (!result.ok) return result;
    engine.dispose();
    store = nativeCheckpointStore(native, checkpoints, false);
    engine = await open();
    if (disposed) engine.dispose();
    saved();
    return result;
  }

  /** @param {string} type @param {Record<string,any>} [args] */
  async function command(type, args={}) {
    if (isReadOnly() || disposed) return failed(saveStatus());
    const result = await engine.dispatch(crypto.randomUUID(), {type,args});
    if (result.status === 'rejected') return failed(result.reason);
    if (result.status === 'blocked') return blocked(result.reason);
    saved();
    return result.receipt.result;
  }

  return {
    get state() { return state; },
    get layout() { return state.layout; },
    get readOnly() { return isReadOnly(); },
    get status() { return saveStatus(); },
    command,
    /** @param {number} hours */
    async advance(hours) {
      if (isReadOnly() || disposed) return failed(saveStatus());
      if (!Number.isInteger(hours) || hours < 1 || hours > MAX_MANUAL_HOURS) return failed('invalidCommand');
      const previous = engine.inspect().revision;
      const ticks = engine.advanceSteps(hours);
      return ticks > 0 ? saveHours(previous, ticks) : failed('saveUnavailable');
    },
    /** @param {number} now */
    async frame(now) {
      if (isReadOnly() || disposed) return null;
      const previous = engine.inspect().revision;
      const ticks = engine.frame(now);
      return ticks > 0 ? saveHours(previous, ticks) : null;
    },
    resetClock() {
      engine.setPaused(true);
      engine.setPaused(false);
    },
    async checkpoint() {
      if (isReadOnly() || disposed) return failed(saveStatus());
      const result = await engine.checkpoint();
      if (result.status !== 'saved') return blocked(result.reason);
      saved();
      return {ok:true,error:'',events:[]};
    },
    /** @param {string} kind @param {{x:number,z:number,rotation:number}} transform */
    build(kind, {x,z,rotation}) { return command('build', {kind,transform:{x,z,rotation}}); },
    /** @param {string} id @param {{x:number,z:number,rotation:number}} transform */
    move(id, {x,z,rotation}) { return command('move', {id,transform:{x,z,rotation}}); },
    /** @param {any} candidate */
    previewPlacement(candidate) { return placementIssue(state, candidate); },
    exportBundle() { return native?.exportBundle() ?? JSON.stringify({format:'MyFarmTwinCozyBackup',version:2,state}); },
    exportLegacy() { return native?.exportLegacy() ?? ''; },
    /** @param {string} raw */
    importBundle(raw) { return native ? replaceProgress(() => native.importBundle(raw)) : failed('saveUnavailable'); },
    recoverBackup() { return native ? replaceProgress(() => native.recoverBackup()) : failed('saveUnavailable'); },
    dispose() {
      disposed = true;
      engine.dispose();
    },
  };
}

/** @param {CozySession} native @param {string} database */
export function openCozyCommonEngineDefault(native, database) {
  /** @type {FarmStore|null} */ let cache = null;
  try { cache = createIndexedDbCheckpointStore(indexedDB, database); } catch { /* The existing save still works. */ }
  return openCozyCommonEngine(cache, {native});
}

/** @param {IDBFactory} factory @param {string} database */
export function openCozyCommonEngineQa(factory, database) {
  return openCozyCommonEngine(createIndexedDbCheckpointStore(factory, database));
}
