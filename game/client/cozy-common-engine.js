import {createIndexedDbCheckpointStore, openTransactionalSession} from '@andiwijaya/common-engine';
import {createCozyState, dispatchCozy, placementIssue, validateCozyState} from './cozy-domain.js';

/** @typedef {ReturnType<typeof createCozyState>} FarmState */
/** @typedef {{type:string,args:Record<string,any>}} FarmAction */
/** @typedef {{ok:boolean,error:string,events:any[],id?:string}} FarmResult */
/** @typedef {import('@andiwijaya/common-engine').CheckpointStore<import('@andiwijaya/common-engine').SessionCheckpoint<FarmState,FarmResult>>} FarmStore */

const HOUR_MS = 2000;
const MAX_MANUAL_HOURS = 168;

/** @param {URL} url */
export function commonEngineQaDatabase(url) {
  const names = url.searchParams.getAll('qa-session');
  if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)
      || names.length !== 1 || !/^[a-z0-9][a-z0-9-]{7,47}$/.test(names[0])) return null;
  return 'myfarmtwin.qa.common-engine.cozy.v2-' + names[0];
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

/** @param {FarmStore} store */
export async function openCozyCommonEngine(store) {
  const open = () => openTransactionalSession({
    initialState: createCozyState(),
    isState: isFarmState,
    stepMs: HOUR_MS,
    maxFrameMs: HOUR_MS,
    maxManualSteps: MAX_MANUAL_HOURS,
    initialSpeed: 1,
    stepsPerFrame: {1:1},
    store,
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
  let status = engine.inspect().revision === null ? 'saveReady' : 'saveResumed';
  let readOnly = false;
  let disposed = false;

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

  /** @param {string} type @param {Record<string,any>} [args] */
  async function command(type, args={}) {
    if (readOnly || disposed) return failed(status);
    const result = await engine.dispatch(crypto.randomUUID(), {type,args});
    if (result.status === 'rejected') return failed(result.reason);
    if (result.status === 'blocked') return blocked(result.reason);
    saved();
    return result.receipt.result;
  }

  return {
    get state() { return state; },
    get layout() { return state.layout; },
    get readOnly() { return readOnly; },
    get status() { return status; },
    command,
    /** @param {number} hours */
    async advance(hours) {
      if (readOnly || disposed) return failed(status);
      if (!Number.isInteger(hours) || hours < 1 || hours > MAX_MANUAL_HOURS) return failed('invalidCommand');
      const previous = engine.inspect().revision;
      const ticks = engine.advanceSteps(hours);
      return ticks > 0 ? saveHours(previous, ticks) : failed('saveUnavailable');
    },
    /** @param {number} now */
    async frame(now) {
      if (readOnly || disposed) return null;
      const previous = engine.inspect().revision;
      const ticks = engine.frame(now);
      return ticks > 0 ? saveHours(previous, ticks) : null;
    },
    resetClock() {
      engine.setPaused(true);
      engine.setPaused(false);
    },
    async checkpoint() {
      if (readOnly || disposed) return failed(status);
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
    exportBundle() { return JSON.stringify({format:'MyFarmTwinCozyBackup',version:2,state}); },
    dispose() {
      disposed = true;
      engine.dispose();
    },
  };
}

/** @param {IDBFactory} factory @param {string} database */
export function openCozyCommonEngineQa(factory, database) {
  return openCozyCommonEngine(createIndexedDbCheckpointStore(factory, database));
}
