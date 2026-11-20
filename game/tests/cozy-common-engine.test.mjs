import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {commonEngineDefaultDatabase, commonEngineQaDatabase, openCozyCommonEngine} from '../client/cozy-common-engine.js';
import {CozySession, COZY_SAVE_KEY, COZY_ARCHIVE_KEY} from '../client/cozy-storage.js';
import {SAVE_KEY} from '../client/storage.js';

test('the Farm pilot opens only explicitly named loopback QA databases', () => {
  assert.equal(commonEngineQaDatabase(new URL('http://127.0.0.1:4189/play/?qa-session=crop-test')),
    'myfarmtwin.qa.common-engine.cozy.v2-crop-test');
  for (const address of [
    'http://127.0.0.1:4189/play/',
    'http://127.0.0.1:4189/play/?qa-session=bad',
    'http://127.0.0.1:4189/play/?qa-session=crop-test&qa-session=other-test',
    'https://myfarmtwin.com/play/?qa-session=crop-test',
  ]) assert.equal(commonEngineQaDatabase(new URL(address)),null);
});

test('the default runtime uses a dedicated database in the loopback QA build', () => {
  const loopback = new URL('http://127.0.0.1:4189/play/');
  const publicGame = new URL('https://myfarmtwin.com/play/');
  assert.equal(commonEngineDefaultDatabase(loopback,true),'myfarmtwin.qa.common-engine.cozy.v2-default');
  assert.equal(commonEngineDefaultDatabase(publicGame,true),null);
  assert.equal(commonEngineDefaultDatabase(publicGame,false),'myfarmtwin.common-engine.cozy.v2');
  assert.equal(commonEngineQaDatabase(new URL('?qa-session=default',loopback)),null);
});

test('a failed tick checkpoint can be retried once and a stale tab cannot overwrite it', async () => {
  let checkpoint = null;
  let failNext = false;
  const store = {
    read: async () => structuredClone(checkpoint),
    async commit(expected, next) {
      if (failNext) { failNext=false; throw new Error('simulated write failure'); }
      if ((checkpoint?.revision ?? null) !== expected) return 'conflict';
      checkpoint = structuredClone(next);
      return 'committed';
    },
  };
  const session = await openCozyCommonEngine(store);
  const plot = session.state.plots[0].id;
  const start = session.state.tick;
  assert.equal((await session.command('plant',{plot,crop:'lettuce'})).ok,true);
  const stale = await openCozyCommonEngine(store);
  try {
    const before = structuredClone(checkpoint);
    failNext = true;
    assert.equal((await session.advance(6)).error,'saveUnavailable');
    assert.deepEqual(checkpoint,before);
    assert.deepEqual(session.state,before.state);
    assert.equal((await session.advance(6)).ok,true);
    assert.equal(session.state.tick,start+6);
    assert.equal(checkpoint.revision,2);
    assert.equal((await stale.advance(6)).error,'saveConflict');
    assert.equal(stale.readOnly,true);
    assert.equal(stale.state.tick,start);
    assert.deepEqual(checkpoint.state,session.state);
  } finally { session.dispose(); stale.dispose(); }
});

function nativeStorage(seed = {}) {
  const contents = new Map(Object.entries(seed));
  return {
    getItem: key => contents.get(key) ?? null,
    setItem: (key, value) => contents.set(key,value),
    removeItem: key => contents.delete(key),
  };
}

test('default Common Engine and native rollback share the latest legacy-compatible save', async () => {
  const legacy = readFileSync(new URL('./fixtures/unified-world/v2-mixed.json',import.meta.url),'utf8');
  const storage = nativeStorage({[SAVE_KEY]:legacy});
  const native = new CozySession(storage);
  const nativeBefore = structuredClone(native.state);
  let cached = null;
  const checkpoints = {
    read: async () => cached,
    async commit(expected, next) {
      if ((cached?.revision ?? null) !== expected) return 'conflict';
      cached = next;
      return 'committed';
    },
  };

  const engine = await openCozyCommonEngine(checkpoints,{native});
  assert.equal(engine.status,'saveMigrationPreview');
  assert.deepEqual(engine.state,nativeBefore);
  assert.equal(cached,null);
  assert.equal(storage.getItem(COZY_SAVE_KEY),null);
  assert.equal((await engine.advance(6)).ok,true);
  assert.deepEqual(cached.state,engine.state);
  assert.equal(JSON.parse(storage.getItem(COZY_ARCHIVE_KEY)).native,legacy);

  const rollback = new CozySession(storage);
  assert.deepEqual(rollback.state,engine.state);
  assert.equal(rollback.advance(6).ok,true);
  assert.equal((await engine.advance(6)).error,'saveConflict');

  const next = await openCozyCommonEngine(checkpoints,{native:new CozySession(storage)});
  assert.deepEqual(next.state,rollback.state);
  assert.equal((await next.recoverBackup()).ok,true);
  assert.equal(next.state.tick,nativeBefore.tick+6);
  assert.deepEqual(next.state,new CozySession(storage).state);
  assert.equal(storage.getItem(SAVE_KEY),legacy);
  engine.dispose();
  next.dispose();
});

test('loss of the receipt database does not undo an accepted native save', async () => {
  const storage = nativeStorage();
  const checkpoints = {
    read: async () => null,
    async commit() { throw new Error('IndexedDB unavailable'); },
  };
  const engine = await openCozyCommonEngine(checkpoints,{native:new CozySession(storage)});
  assert.equal((await engine.advance(6)).ok,true);
  assert.deepEqual(engine.state,new CozySession(storage).state);
  const backup = engine.exportBundle();
  assert.equal((await engine.advance(6)).ok,true);
  assert.equal((await engine.importBundle(backup)).ok,true);
  assert.deepEqual(engine.state,new CozySession(storage).state);
  assert.equal(engine.exportBundle(),backup);
  engine.dispose();
});
