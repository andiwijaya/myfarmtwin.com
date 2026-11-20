import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join, resolve} from 'node:path';
import {mkdir, readFile} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
import {chromium} from 'playwright';
import {createCozyState, COZY_CROPS} from '../game/client/cozy-domain.js';
import {commonEngineDefaultDatabase, commonEngineQaDatabase} from '../game/client/cozy-common-engine.js';
import {CozySession, COZY_SAVE_KEY, COZY_BACKUP_KEY, COZY_ARCHIVE_KEY} from '../game/client/cozy-storage.js';
import {GLB_LAYOUT_KEY} from '../game/client/glb-prototype-state.js';
import {SAVE_KEY} from '../game/client/storage.js';
import {startCozyCommonEngineQa} from './cozy-common-engine-qa.mjs';

const baselineKeys = Object.fromEntries(
  [COZY_SAVE_KEY, COZY_BACKUP_KEY, COZY_ARCHIVE_KEY, SAVE_KEY].map(key => [key, 'untouched-' + key])
);
const initial = createCozyState();
const plotId = initial.plots[0].id;
const ripeTick = initial.tick + COZY_CROPS.lettuce.hours;
const evidence = process.env.MYFARM_QA_EVIDENCE;
const qa = await startCozyCommonEngineQa();
let browser;

async function stored(page, database) {
  return page.evaluate(name => new Promise((resolve, reject) => {
    const open = indexedDB.open(name, 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const db = open.result;
      const tx = db.transaction('checkpoints', 'readonly');
      const record = tx.objectStore('checkpoints').get('session');
      tx.oncomplete = () => { db.close(); resolve(record.result ?? null); };
      tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }), database);
}

async function waitStored(page, database, predicate, timeout=15_000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) {
    const next = await stored(page, database);
    if (next && predicate(next)) return next;
    await delay(150);
  }
  throw new Error('Timed out waiting for checkpoint in ' + database);
}

async function openGame(page, url, runtime = 'common-engine') {
  await page.goto(url, {waitUntil:'domcontentloaded'});
  const body = page.locator('body[data-cozy-ready="true"]');
  await body.waitFor({timeout:60_000});
  assert.equal(await body.getAttribute('data-farm-runtime'),runtime);
  assert.equal(await body.getAttribute('data-common-engine-version'),runtime === 'common-engine' ? '0.3.0' : null);
  const isNamedPilot = new URL(url).searchParams.has('qa-session');
  assert.equal(await body.getAttribute('data-common-engine-pilot'),isNamedPilot ? '0.3.0' : null);
  assert.equal(page.url(),url);
}

async function openPlot(page, click) {
  const garden = page.locator('.destinations [data-view="garden"]');
  if (!await garden.isVisible()) await click(page.locator('#farm-toolbar > summary'));
  await click(garden);
  await click(page.locator('[data-action="focus-bed-' + plotId + '"]'));
}

async function verifyIsolation(page, database) {
  const proof = await page.evaluate(async keys => ({
    saved:Object.fromEntries(keys.map(key => [key,localStorage.getItem(key)])),
    databases:(await indexedDB.databases()).map(entry => entry.name),
  }),Object.keys(baselineKeys));
  assert.deepEqual(proof.saved,baselineKeys);
  assert.deepEqual(proof.databases,[database]);
}

async function runCrop(mode, mobile) {
  const viewport = mobile ? {width:390,height:844} : {width:1360,height:900};
  const context = await browser.newContext({viewport,hasTouch:mobile,isMobile:mobile,locale:'id-ID'});
  const errors = [];
  context.on('page',page => page.on('pageerror',error => errors.push(error.message)));
  const slot = 'crop-' + mode + '-' + randomUUID().slice(0,8);
  const url = qa.origin + '/play/?qa-session=' + slot;
  const database = commonEngineQaDatabase(new URL(url));
  assert.ok(database);
  const click = locator => mobile ? locator.tap() : locator.click();
  try {
    const page = await context.newPage();
    await page.goto(qa.origin + '/play/build-info.json');
    await page.evaluate(seeds => {
      for (const [key, value] of Object.entries(seeds)) localStorage.setItem(key,value);
    },baselineKeys);
    await openGame(page,url);
    assert.equal(await stored(page,database),null);
    await openPlot(page,click);
    await click(page.locator('[data-action="plant-lettuce"]'));
    const planted = await waitStored(page,database,cp => cp.revision === 1);
    assert.equal(planted.state.plots[0].crop.type,'lettuce');
    assert.equal(planted.state.tick,initial.tick);
    assert.equal(planted.state.seeds.lettuce,initial.seeds.lettuce-1);
    await click(page.locator('#care-content [data-action="water"]'));
    await waitStored(page,database,cp => cp.revision === 2 && cp.state.stats.watered === 1);

    if (mode === 'manual') {
      for (let elapsed=6; elapsed<=COZY_CROPS.lettuce.hours; elapsed+=6) {
        await click(page.locator('#advance'));
        await waitStored(page,database,cp => cp.state.tick === initial.tick + elapsed);
      }
    } else {
      const pause = page.locator('#pause');
      const stoppedLabel = await pause.textContent();
      const hour = String(ripeTick % 24).padStart(2,'0') + ':00';
      const day = Math.floor(ripeTick / 24) + 1;
      await page.evaluate(({hour,day}) => {
        const clock = document.getElementById('clock-time');
        const pause = document.getElementById('pause');
        const prefix = document.documentElement.lang === 'en' ? 'Day ' : 'Hari ';
        const target = prefix + day + ' · ' + hour;
        // Stop via the same UI action as soon as the committed tick is shown.
        const observer = new MutationObserver(() => {
          if (clock.textContent !== target) return;
          observer.disconnect();
          pause.click();
        });
        observer.observe(clock,{childList:true,characterData:true,subtree:true});
      },{hour,day});
      await click(pause);
      await waitStored(page,database,cp => cp.state.tick >= ripeTick,60_000);
      await page.waitForFunction(label => document.getElementById('pause').textContent === label,stoppedLabel);
    }

    const grown = await stored(page,database);
    assert.equal(grown.state.tick,ripeTick);
    assert.equal(grown.state.plots[0].crop.progress,1);
    await click(page.locator('#care-content [data-action="harvest"]:enabled'));
    const picked = await waitStored(page,database,cp => cp.state.stats.harvested > 0 && cp.state.plots[0].crop === null);
    assert.equal(picked.state.tick,ripeTick);
    assert.equal(picked.state.inventory.length,1);
    const produce = picked.state.inventory[0];
    assert.equal(produce.type,'lettuce');
    assert.equal(produce.quantity,3);
    assert.deepEqual(picked.receipts.map(receipt => JSON.parse(receipt.actionKey).type),['plant','water','harvest']);

    await click(page.locator('#common-engine-checkpoint'));
    const checkpoint = await waitStored(page,database,cp => cp.revision === picked.revision+1);
    assert.deepEqual(checkpoint.state,picked.state);
    assert.deepEqual(checkpoint.receipts,picked.receipts);
    await verifyIsolation(page,database);
    await page.close();

    const reopened = await context.newPage();
    await openGame(reopened,url);
    assert.deepEqual(await stored(reopened,database),checkpoint);
    await verifyIsolation(reopened,database);
    await openPlot(reopened,click);
    await reopened.locator('[data-action="plant-lettuce"]').waitFor();
    assert.equal(await reopened.locator('#care-content [data-action="harvest"]').count(),0);
    if (evidence) await reopened.screenshot({path:join(resolve(evidence),'myfarm-common-engine-' + mode + '-reopened.png'),fullPage:true});
    assert.deepEqual(errors,[]);
    return {
      checkpoint,
      result:{mode, viewport, database, initialTick:initial.tick, ripeTick, revision:checkpoint.revision,
        crop:produce.type, quantity:produce.quantity, receipts:checkpoint.receipts.length, exactReopen:true},
    };
  } finally {await context.close();}
}


async function legacyFixture(mobile) {
  const values = new Map();
  const storage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key,value) => values.set(key,value),
    removeItem: key => values.delete(key),
  };
  if (mobile) {
    const path = name => new URL('../game/tests/fixtures/cozy-world/' + name,import.meta.url);
    values.set(SAVE_KEY,await readFile(path('v6-rich-all-areas.json'),'utf8'));
    values.set(GLB_LAYOUT_KEY,await readFile(path('p2-rich-moved-layout.json'),'utf8'));
  } else {
    // Produce a save with the same native code that previously powered /play/.
    const native = new CozySession(storage);
    assert.equal(native.command('plant',{plot:plotId,crop:'lettuce'}).ok,true);
    assert.equal(native.advance(6).ok,true);
  }
  return {keys:Object.fromEntries(values),state:new CozySession(storage).state};
}

async function exportFarm(page, click) {
  await click(page.locator('#data-open'));
  await click(page.locator('#export-data'));
  const backup = JSON.parse(await page.locator('#save-text').inputValue());
  await click(page.locator('#data-dialog form button'));
  return backup.state;
}

async function advanceFarm(page, click) {
  const advance = page.locator('#advance');
  if (!await advance.isVisible()) await click(page.locator('#farm-toolbar > summary'));
  await click(advance);
}

async function runDefault(mobile) {
  const mode = mobile ? 'touch' : 'desktop';
  const viewport = mobile ? {width:390,height:844} : {width:1360,height:900};
  const context = await browser.newContext({viewport,hasTouch:mobile,isMobile:mobile,locale:'id-ID',reducedMotion:'reduce'});
  const errors = [];
  context.on('page',page => page.on('pageerror',error => errors.push(error.message)));
  const url = qa.origin + '/play/';
  const database = commonEngineDefaultDatabase(new URL(url),true);
  assert.match(database,/^myfarmtwin\.qa\./);
  const click = locator => mobile ? locator.tap() : locator.click();
  const fixture = await legacyFixture(mobile);
  const gameKeys = [COZY_SAVE_KEY,COZY_BACKUP_KEY,COZY_ARCHIVE_KEY,SAVE_KEY,GLB_LAYOUT_KEY];
  const saveBytes = page => page.evaluate(keys => Object.fromEntries(keys.map(key => [key,localStorage.getItem(key)])),gameKeys);
  try {
    const page = await context.newPage();
    await page.goto(qa.origin + '/play/build-info.json');
    await page.evaluate(entries => {
      for (const [key,value] of Object.entries(entries)) localStorage.setItem(key,value);
    },fixture.keys);

    await openGame(page,url);
    assert.deepEqual(await exportFarm(page,click),fixture.state);
    assert.deepEqual(await saveBytes(page),Object.fromEntries(gameKeys.map(key => [key,fixture.keys[key] ?? null])));
    assert.equal(await stored(page,database),null);

    await advanceFarm(page,click);
    const progress = await waitStored(page,database,cp => cp.state.tick === fixture.state.tick+6);
    const primary = await saveBytes(page);
    assert.deepEqual(JSON.parse(primary[COZY_SAVE_KEY]),progress.state);
    assert.equal(primary[SAVE_KEY],fixture.keys[SAVE_KEY] ?? null);
    assert.equal(primary[GLB_LAYOUT_KEY],fixture.keys[GLB_LAYOUT_KEY] ?? null);
    if (mobile) {
      assert.equal(JSON.parse(primary[COZY_ARCHIVE_KEY]).native,fixture.keys[SAVE_KEY]);
      assert.equal(JSON.parse(primary[COZY_ARCHIVE_KEY]).layout,fixture.keys[GLB_LAYOUT_KEY]);
    } else assert.equal(primary[COZY_BACKUP_KEY],fixture.keys[COZY_SAVE_KEY]);

    await page.close();
    const reopened = await context.newPage();
    await openGame(reopened,url);
    assert.deepEqual(await exportFarm(reopened,click),progress.state);
    assert.deepEqual(await stored(reopened,database),progress);
    assert.deepEqual(await saveBytes(reopened),primary);

    await openGame(reopened,url + '?engine=native','native');
    assert.deepEqual(await exportFarm(reopened,click),progress.state);
    assert.equal(await reopened.locator('#common-engine-checkpoint').count(),0);
    assert.deepEqual(await saveBytes(reopened),primary);
    await advanceFarm(reopened,click);
    const nativeTick = progress.state.tick+6;
    await reopened.waitForFunction(({key,tick}) => JSON.parse(localStorage.getItem(key))?.tick === tick,
      {key:COZY_SAVE_KEY,tick:nativeTick});
    const latest = JSON.parse((await saveBytes(reopened))[COZY_SAVE_KEY]);
    assert.deepEqual(await stored(reopened,database),progress);
    if (evidence) await reopened.screenshot({path:join(resolve(evidence),'myfarm-native-rollback-' + mode + '.png')});

    await openGame(reopened,url);
    assert.deepEqual(await exportFarm(reopened,click),latest);
    assert.deepEqual(await reopened.evaluate(async () => (await indexedDB.databases()).map(entry => entry.name)),[database]);
    assert.deepEqual(errors,[]);
    return {
      mode, viewport, database, oldSave: mobile ? 'legacy farm and layout' : 'Cozy V2',
      initialTick:fixture.state.tick, engineTick:progress.state.tick, nativeTick,
      reopened:true, rollback:true, nativeProgressResumed:true,
    };
  } finally { await context.close(); }
}

try {
  assert.equal(qa.receipt.commonEngineQa,'0.3.0');
  assert.equal(qa.receipt.defaultRuntime,'common-engine');
  assert.equal(qa.receipt.commonEngineVersion,'0.3.0');
  if (evidence) await mkdir(resolve(evidence),{recursive:true});
  browser = await chromium.launch({
    headless:true, executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args:['--use-angle=swiftshader','--enable-unsafe-swiftshader'],
  });
  const manual = await runCrop('manual',false);
  const auto = await runCrop('autoplay',true);
  assert.deepEqual(auto.checkpoint.state,manual.checkpoint.state);
  assert.notEqual(auto.result.database,manual.result.database);

  const desktopDefault = await runDefault(false);
  const touchDefault = await runDefault(true);
  console.log(JSON.stringify({engine:qa.receipt.commonEngineQa, profiles:[manual.result,auto.result],
    sameDomainState:true, nativeSaveUntouched:true, defaultProfiles:[desktopDefault,touchDefault], output:qa.output, evidence}));
} finally {
  await browser?.close();
  await qa.close();
}
