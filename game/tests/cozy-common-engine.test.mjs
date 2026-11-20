import assert from 'node:assert/strict';
import test from 'node:test';
import {commonEngineQaDatabase, openCozyCommonEngine} from '../client/cozy-common-engine.js';

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
