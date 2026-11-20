import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {join, resolve} from 'node:path';
import {mkdir} from 'node:fs/promises';
import {setTimeout as delay} from 'node:timers/promises';
import {chromium} from 'playwright';
import {createCozyState, COZY_CROPS} from '../game/client/cozy-domain.js';
import {commonEngineQaDatabase} from '../game/client/cozy-common-engine.js';
import {COZY_SAVE_KEY, COZY_BACKUP_KEY, COZY_ARCHIVE_KEY} from '../game/client/cozy-storage.js';
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

async function openGame(page, url) {
  await page.goto(url, {waitUntil:'domcontentloaded'});
  await page.locator('body[data-cozy-ready="true"]').waitFor({timeout:60_000});
  assert.equal(await page.locator('body').getAttribute('data-common-engine-pilot'),'0.3.0');
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

try {
  assert.equal(qa.receipt.commonEngineQa,'0.3.0');
  if (evidence) await mkdir(resolve(evidence),{recursive:true});
  browser = await chromium.launch({
    headless:true, executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
    args:['--use-angle=swiftshader','--enable-unsafe-swiftshader'],
  });
  const manual = await runCrop('manual',false);
  const auto = await runCrop('autoplay',true);
  assert.deepEqual(auto.checkpoint.state,manual.checkpoint.state);
  assert.notEqual(auto.result.database,manual.result.database);

  const ordinary = await browser.newContext({viewport:{width:1360,height:900}});
  try {
    const page = await ordinary.newPage();
    await page.goto(qa.origin + '/play/');
    await page.locator('body[data-cozy-ready="true"]').waitFor({timeout:60_000});
    assert.equal(await page.locator('body').getAttribute('data-common-engine-pilot'),null);
    assert.equal(await page.locator('#common-engine-checkpoint').count(),0);
    assert.deepEqual(await page.evaluate(async () => (await indexedDB.databases()).map(entry => entry.name)),[]);
  } finally {await ordinary.close();}
  console.log(JSON.stringify({engine:qa.receipt.commonEngineQa, profiles:[manual.result,auto.result],
    sameDomainState:true, nativeSaveUntouched:true, ordinaryRouteUsesNativeSession:true, output:qa.output, evidence}));
} finally {
  await browser?.close();
  await qa.close();
}
