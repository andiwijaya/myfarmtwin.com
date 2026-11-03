import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const server=process.env.BASE_URL?null:await startServer(0);
const base=process.env.BASE_URL||'http://127.0.0.1:'+server.address().port;
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-qa');await mkdir(qa,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}:{})});
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
   }
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);report.checks.push({device:name,gameEntry:true,localeResume:true});
  }
  await page.screenshot({path:join(qa,name+'-latest.png'),fullPage:true});
  report.checks.push({device:name,homepage:true,editorialRoutes:9,overflow:false});await context.close();
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));await writeFile(join(qa,'latest.json'),JSON.stringify(report,null,2));}
