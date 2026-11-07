import {chromium} from 'playwright';import {settledPage} from './settled-page.mjs';import {startServer} from './serve.mjs';
import {mkdir,readFile,writeFile} from 'node:fs/promises';import {join} from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-preview');await mkdir(qa,{recursive:true});
const server=await startServer(0),base='http://127.0.0.1:'+server.address().port,report={profiles:[],errors:[],limitations:'Local headless Chrome and touch emulation. Snapshot/camera smoke only; production and the full two-zone gameplay gate are not claimed.'};
const launch=()=>chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});let browser=await launch();
try{
 const defaultContext=await browser.newContext();try{const page=await defaultContext.newPage(),requests=[];page.on('request',r=>requests.push(r.url()));await page.goto(base+'/play/',{waitUntil:'networkidle'});assert.equal(await page.locator('#unified-preview').count(),0);assert.equal(requests.some(u=>u.includes('/vendor/')||u.includes('unified-world-')),false);report.defaultNoPreviewFetch=true;}finally{await defaultContext.close();}
 for(const existing of [false,true])for(const mobile of [false,true])for(const locale of ['en','id']){
  const raw=await readFile('game/tests/fixtures/unified-world/v5-'+(existing?'mixed':'fresh')+'.json','utf8');
  const context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile});
  await context.addInitScript(raw=>{if(!localStorage.getItem('qa-unified')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('qa-unified','1');}window.__qaIntervalCount=0;const interval=window.setInterval.bind(window);window.setInterval=(...args)=>{window.__qaIntervalCount++;return interval(...args);};},raw);
  try{
   const page=settledPage(await context.newPage());page.on('pageerror',e=>report.errors.push(e.message));await page.goto(base+'/play/?world=unified-preview',{waitUntil:'networkidle'});await page.locator('#language').selectOption(locale);
   const host=page.locator('#unified-preview');await page.waitForFunction(()=>document.querySelector('#unified-preview').dataset.renderer==='three');assert.equal(await host.getAttribute('data-chicken-started'),String(existing));
   assert.equal(await host.getByRole('status').innerText(),locale==='id'?'Pratinjau 3D aktif':'3D preview active');
   const before=await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1'));assert.equal(before,raw);
   for(let h=0;h<4;h++){
    assert.equal(await host.getAttribute('data-heading'),String(h));
    await host.screenshot({path:join(qa,`${existing?'mixed':'fresh'}-${mobile?'mobile':'desktop'}-${locale}-${h}.png`)});
    await page.locator('[data-preview-camera=right]').click();
   }
   for(const action of ['chicken','in','out','field','fit','reset'])await page.locator('[data-preview-camera='+action+']').click();
   assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),before);
   assert.equal(await page.evaluate(()=>window.__qaIntervalCount),1,'Only the existing fixed clock interval');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   const cleanup=await page.evaluate(async()=>{const {mountUnifiedPreview}=await import('/play/unified-world-preview.js'),state=JSON.parse(localStorage.getItem('myfarmtwin.save.v1')).state,host=document.createElement('section');host.style.width='400px';document.body.append(host);const preview=mountUnifiedPreview(host,state,'en');await preview.ready();const before=preview.inspect();preview.dispose();preview.dispose();preview.update(state,'id');const after=preview.inspect(),children=host.childElementCount;host.remove();return {before,after,children};});
   assert.equal(cleanup.before.renderer,'three');assert.equal(cleanup.after.disposed,true);assert.equal(cleanup.after.entities,0);assert.equal(cleanup.children,0);
   await page.reload({waitUntil:'networkidle'});assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),before);
   report.profiles.push({existing,mobile,locale,headings:4,saveExact:true,oneClockInterval:true,cleanup:true,defaultGameplayRetained:true});
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'preview.json'),JSON.stringify(report,null,2));}
