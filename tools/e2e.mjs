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
  await page.screenshot({path:join(qa,name+'-latest.png'),fullPage:true});
  report.checks.push({device:name,homepage:true,editorialRoutes:9,overflow:false});await context.close();
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await browser.close();if(server)await new Promise(r=>server.close(r));await writeFile(join(qa,'latest.json'),JSON.stringify(report,null,2));}
