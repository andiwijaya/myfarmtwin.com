import assert from 'node:assert/strict';import {join} from 'node:path';import {writeFile} from 'node:fs/promises';
export async function runVerticalSlice(base,browser,qa){
 const results=[];
 for(const [device,width,height]of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:device==='mobile',hasTouch:device==='mobile',locale:'en-US'});const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const start=performance.now();
  try{
   await page.goto(base+'/play/',{waitUntil:'networkidle'});assert.equal(await page.locator('#hud-coins').innerText(),'120');
   await page.locator('[data-plot="0"] polygon').first().click();assert.equal(await page.locator('#plot-panel').isVisible(),true);assert.equal(await page.locator('#mission-track').getAttribute('aria-valuenow'),'1');
   await page.locator('#plant').click();assert.equal(await page.locator('#mission-track').getAttribute('aria-valuenow'),'2');assert.equal(await page.locator('[data-crop]').count(),1);
   await page.locator('#water').dblclick();assert.equal(await page.locator('#hud-coins').innerText(),'123');assert.equal(await page.locator('#mission-track').getAttribute('aria-valuenow'),'3');
   let days=0;while(await page.locator('#harvest').isDisabled()&&days<6){await page.locator('#next-day').click();days++;if(await page.locator('#harvest').isDisabled()&&Number(await page.locator('[data-plot="0"]').getAttribute('data-moisture'))<40)await page.locator('#water').click();}
   assert.equal(await page.locator('#harvest').isEnabled(),true);assert.ok(days<=3,'Cared lettuce should mature in at most three tutorial days');
   await page.locator('#harvest').click();assert.equal(await page.locator('#mission-track').getAttribute('aria-valuenow'),'5');
   await page.locator('[data-facility=market]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#market-dialog').isVisible(),true);
   const before=Number(await page.locator('#hud-coins').innerText()),sale=Number((await page.locator('[data-sell]').innerText()).match(/\+(\d+)/)[1]);await page.locator('[data-sell]').click();assert.equal(Number(await page.locator('#hud-coins').innerText()),before+sale+10);assert.equal(await page.locator('[data-sell]').count(),0);
   assert.match(await page.locator('#buy-pump').getAttribute('class'),/mission-target/);
   const preUpgrade=Number(await page.locator('#hud-coins').innerText());await page.locator('#buy-pump').click();assert.equal(Number(await page.locator('#hud-coins').innerText()),preUpgrade-60+15);assert.equal(await page.locator('#mission-track').getAttribute('aria-valuenow'),'7');
   const seconds=+(performance.now()-start).toFixed(0)/1000;assert.ok(seconds<180);
   await page.locator('#pump-toggle').click();await page.locator('#close-market').click();const water=Number(await page.locator('#hud-water').innerText());await page.locator('#next-day').click();assert.equal(Number(await page.locator('#hud-water').innerText()),water-36);assert.equal(await page.locator('[data-irrigation-range]').count(),2);
   await page.locator('#market-open').click();await page.locator('.ledger summary').click();const balance=Number(await page.locator('#hud-coins').innerText());assert.match(await page.locator('#ledger-balance').innerText(),new RegExp(String(balance)));assert.match(await page.locator('.ledger').innerText(),/Farm upgrade -60/);await page.locator('#close-market').click();
   assert.deepEqual(errors,[]);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await page.screenshot({path:join(qa,device+'-vertical-slice.png'),fullPage:true});
   results.push({device,secondsToSaleAndUpgrade:seconds,tutorialDays:days,firstSale:sale,finalCoins:balance,ledgerMatches:true,pumpCoverage:2,uncaughtErrors:errors.length});
  }finally{await context.close();}
 }
 await writeFile(join(qa,'vertical-slice.json'),JSON.stringify(results,null,2));console.log('VERTICAL SLICE PASS '+JSON.stringify(results));return results;
}
