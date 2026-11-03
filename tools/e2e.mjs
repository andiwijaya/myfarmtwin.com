import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const server=process.env.BASE_URL?null:await startServer(0);
const base=process.env.BASE_URL||'http://127.0.0.1:'+server.address().port;
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-qa');await mkdir(qa,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--disable-webgl'],...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
const report={at:new Date().toISOString(),base,checks:[],errors:[]};
try{
 for(const [name,width,height]of [['desktop',1440,1000],['mobile',390,844]]){
  const context=await browser.newContext({viewport:{width,height},isMobile:name==='mobile',hasTouch:name==='mobile'});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  const response=await page.goto(base+'/',{waitUntil:'networkidle'});assert.equal(response.status(),200);
  assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://myfarmtwin.com/');
  if(name==='mobile'){await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');}
  for(const route of ['/learn/','/grow/','/farm/','/kitchen/','/projects/','/gear/','/about/','/robots.txt','/sitemap.xml']) assert.equal((await page.request.get(base+route)).status(),200,route);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const game=await page.request.get(base+'/play/');
  if(game.status()===200){
   const playLink=page.getByRole('link',{name:'Play Farm',exact:true}).first();await playLink.click();assert.match(page.url(),/\/play\/$/);
   await page.goto(base+'/play/',{waitUntil:'networkidle'});await page.locator('#language').selectOption('id');assert.equal(await page.locator('html').getAttribute('lang'),'id');
   await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('#language').inputValue(),'id');await page.locator('#language').selectOption('en');
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://myfarmtwin.com/play/');
   if(await page.locator('.farm-scene').count()){assert.equal(await page.locator('[data-tile]').count(),64);assert.equal(await page.locator('[data-plot]').count(),3);assert.equal(await page.locator('[data-facility]').count(),2);}
   if(await page.locator('[data-camera]').count()){
    await page.evaluate(()=>{window.selectionCount=0;document.addEventListener('plotselect',()=>window.selectionCount++);});
    await page.locator('[data-choose-plot="0"]').click();assert.equal(await page.evaluate(()=>window.selectionCount),1);
    await page.locator('[data-camera=in]').click();assert.match(await page.locator('#map-camera').getAttribute('transform'),/scale\(1.15\)/);
    await page.locator('[data-camera=reset]').click();assert.match(await page.locator('#map-camera').getAttribute('transform'),/scale\(1\)/);
    if(await page.locator('#plot-panel').count()){
     assert.equal(await page.locator('#plot-panel').isVisible(),true);assert.equal(await page.locator('#plot-heading').innerText(),'Plot 1');
     await page.locator('#close-plot').click();assert.equal(await page.locator('#plot-panel').isVisible(),false);
     await page.locator('[data-plot="1"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#plot-heading').innerText(),'Plot 2');
     await page.keyboard.press('Escape');assert.equal(await page.locator('#plot-panel').isVisible(),false);
     await page.evaluate(()=>document.dispatchEvent(new CustomEvent('plotselect',{detail:999})));assert.equal(await page.locator('#plot-panel').isVisible(),false);
    }
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);report.checks.push({device:name,gameEntry:true,localeResume:true});
   if(await page.locator('.hud').count()){assert.equal(await page.locator('#hud-coins').innerText(),'120');await page.locator('.inventory summary').click();assert.equal(await page.locator('#hud-seeds').innerText(),'3');await page.locator('.inventory summary').click();assert.equal(await page.locator('#mission-title').isVisible(),true);}
   if(await page.locator('#guide-toggle').count()){assert.equal(await page.locator('#guide-portrait').evaluate(i=>i.complete&&i.naturalWidth>0),true);await page.locator('#guide-toggle').click();assert.equal(await page.locator('#mission-detail').isVisible(),false);await page.locator('[data-choose-plot="0"]').click();assert.equal(await page.locator('#plot-panel').isVisible(),true);await page.locator('#guide-toggle').click();assert.equal(await page.locator('#mission-detail').isVisible(),true);}
   if(await page.locator('#graphics').count()){await page.locator('#graphics').click();assert.equal(await page.locator('#graphics').getAttribute('aria-pressed'),'true');await page.locator('[data-choose-plot="2"]').click();assert.equal(await page.locator('#plot-heading').innerText(),'Plot 3');assert.equal(await page.evaluate(()=>document.createElement('canvas').getContext('webgl')===null),true);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('#graphics').getAttribute('aria-pressed'),'true');await page.locator('#graphics').click();}
   if(await page.locator('#speed').count()){const forecast=await page.locator('#weather-forecast').count()?await page.locator('#weather-forecast').innerText():'';await page.locator('#next-day').click();assert.equal(await page.locator('#hud-day').innerText(),'2');if(forecast)assert.equal(await page.locator('#weather-name').innerText(),forecast.split(': ')[1]);await page.locator('#speed').click();assert.equal(await page.locator('#speed').innerText(),'2×');await page.locator('#pause').click();assert.equal(await page.locator('#pause').innerText(),'Pause');await page.locator('#pause').click();assert.equal(await page.locator('#pause').innerText(),'Play clock');}
   await page.locator('[data-choose-plot="0"]').click();
   if(await page.locator('#crop-choice').count()){await page.locator('#crop-choice').selectOption('tomato');assert.match(await page.locator('#crop-info').innerText(),/4 game days/);await page.locator('#language').selectOption('id');assert.equal(await page.locator('#crop-choice option:checked').innerText(),'Tomat');assert.match(await page.locator('#crop-info').innerText(),/4 hari game/);await page.locator('#language').selectOption('en');await page.locator('#crop-choice').selectOption('lettuce');}
   if(await page.locator('#plant').count()){await page.locator('#crop-choice').selectOption('tomato');await page.locator('#plant').click();assert.match(await page.locator('#notice').innerText(),/No seeds/);await page.locator('#crop-choice').selectOption('lettuce');await page.locator('#plant').click();assert.equal(await page.locator('[data-crop=lettuce]').count(),1);await page.locator('.inventory summary').click();assert.equal(await page.locator('#hud-seeds').innerText(),'2');await page.locator('.inventory summary').click();assert.match(await page.locator('#plot-status').innerText(),/Lettuce/);}
   if(await page.locator('#water').count()){const before=Number(await page.locator('[data-plot="0"]').getAttribute('data-moisture'));await page.locator('#water').click();assert.ok(Number(await page.locator('[data-plot="0"]').getAttribute('data-moisture'))>before);assert.equal(await page.locator('#hud-coins').innerText(),'118');await page.locator('#water').click();assert.match(await page.locator('#notice').innerText(),/Already watered/);assert.equal(await page.locator('#hud-coins').innerText(),'118');}
   if(await page.locator('[data-crop]').count()){await page.locator('#next-day').click();assert.ok(Number(await page.locator('[data-crop]').getAttribute('data-growth'))>0);assert.match(await page.locator('#plot-status').innerText(),/soil moisture/);for(let day=0;day<12&&await page.locator('[data-crop]').getAttribute('data-stage')!=='3';day++)await page.locator('#next-day').click();assert.equal(await page.locator('[data-crop]').getAttribute('data-stage'),'3');assert.match(await page.locator('#plot-status').innerText(),/100%/);}
  }
  await page.screenshot({path:join(qa,name+'-latest.png'),fullPage:true});
  report.checks.push({device:name,homepage:true,editorialRoutes:9,overflow:false});await context.close();
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));await writeFile(join(qa,'latest.json'),JSON.stringify(report,null,2));}
