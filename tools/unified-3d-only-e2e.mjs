import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {unifiedQATarget} from './unified-qa-target.mjs';
import {worldCamera,worldObject} from './unified-shell-ui.mjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const coordinated=!!process.env.COZY_QA_SLOT,end=Date.parse(process.env.COZY_SLOT_END_UTC||'');
if(coordinated){assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed');assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&Number.isFinite(end)&&end>Date.now()&&end-Date.now()<=15*60_000,'Current coordinated deadline required');}
if(coordinated&&process.env.COZY_WORK_STOP_UTC)assert.ok(/Z$/.test(process.env.COZY_WORK_STOP_UTC)&&Date.parse(process.env.COZY_WORK_STOP_UTC)>=end,'Current work cutoff must bound the slot');
const qa=process.env.QA_DIR||'qa-artifacts/unified-3d-only/entry';await mkdir(qa,{recursive:true});
const raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),target=await unifiedQATarget(),base=target.base;
let browser=null,timer=null,expired=false;const report={base,profiles:[],errors:[],limits:'Disposable headless contexts; mobile/touch emulation, no physical-device claim.'};
if(!process.env.BASE_URL)report.receiptSHA256=createHash('sha256').update(JSON.stringify(JSON.parse(await readFile('dist/play/build-info.json','utf8')))).digest('hex');
try{browser=await chromium.launch({headless:true,timeout:coordinated?Math.min(30000,end-Date.now()):30000,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});if(coordinated)timer=setTimeout(()=>{expired=true;void browser.close();},Math.max(0,end-Date.now()));for(const mobile of [false,true])for(const locale of ['en','id'])for(const mode of ['normal','no-webgl']){
 const name=`${mobile?'mobile':'desktop'}-${locale}-${mode}`,context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile,deviceScaleFactor:mobile?2.75:1});
 try{await context.route('https://www.googletagmanager.com/**',route=>route.abort());await context.addInitScript(({raw,locale,mode})=>{if(!localStorage.getItem('qa-entry')){localStorage.setItem('myfarmtwin.save.v1',raw);localStorage.setItem('myfarmtwin.locale',locale);localStorage.setItem('qa-entry','1');}window.__qaIntervals=0;const original=window.setInterval.bind(window);window.setInterval=(...args)=>{window.__qaIntervals++;return original(...args);};const get=HTMLCanvasElement.prototype.getContext;window.__qaAllowGL=mode!=='no-webgl'||sessionStorage.getItem('qa-gl-restored')==='1';HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')&&!window.__qaAllowGL?null:get.call(this,type,...args);};},{raw,locale,mode});
  const page=await context.newPage();page.on('pageerror',e=>report.errors.push({name,error:e.message}));const requests=[];page.on('request',r=>requests.push(r.url()));
  // The homepage's actual locale-aware CTA must enter the normal play route.
  await page.goto(base+'/',{waitUntil:'networkidle'});const play=page.locator('a[href="/play/"]').first();assert.ok(await play.count());await play.click();await page.waitForURL('**/play/');
  await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true');
  const host=page.locator('#unified-preview');assert.equal(await page.locator('#world canvas').count(),1);assert.equal(await page.locator('#world svg').count(),0);assert.equal(await page.locator('#farm-areas').count(),0);assert.equal(await page.locator('[data-preview-exit]').count(),0);
  const exact=async()=>{assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);assert.equal(await page.evaluate(()=>window.__qaIntervals),1);};await exact();
  if(mode==='no-webgl'){
   assert.equal(await host.getAttribute('data-renderer'),'unavailable');assert.equal(Number(await host.getAttribute('data-render-submissions')),0);assert.match(await host.locator(':scope > p[role=status]:not(#world-startup)').textContent(),/WebGL 2/);assert.ok(await page.locator('[data-preview-retry]').isVisible());const retryBox=await page.locator('[data-preview-retry]').boundingBox();assert.ok(retryBox.y>=0&&retryBox.y+retryBox.height<=(mobile?844:1000),'Retry must be within the first viewport');await page.screenshot({path:`${qa}/${name}-error.png`,fullPage:true});
   await page.evaluate(()=>{window.__qaAllowGL=true;sessionStorage.setItem('qa-gl-restored','1');});await page.locator('[data-preview-retry]').click();
  }
  await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.renderer==='three');await page.waitForFunction(()=>{const h=document.querySelector('#unified-preview');return h?.dataset.spriteReady===h?.dataset.spriteActors;});
  await worldCamera(page,'cow');await worldCamera(page,'right');await exact();
  await page.locator('select[data-world-quality]').selectOption('low');await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.atlasQuality==='low');assert.equal(await host.getAttribute('data-renderer'),'three');await exact();
  // Context loss must show an honest error; retry preserves camera and save.
  const view=await host.evaluate(h=>[h.dataset.heading,h.dataset.zoom,h.dataset.panX,h.dataset.panZ]);
  await page.evaluate(()=>document.querySelector('#world canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
  await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.renderer==='unavailable');assert.match(await host.locator(':scope > p[role=status]:not(#world-startup)').textContent(),/WebGL/);await exact();await page.locator('[data-preview-retry]').click();await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.renderer==='three');assert.deepEqual(await host.evaluate(h=>[h.dataset.heading,h.dataset.zoom,h.dataset.panX,h.dataset.panZ]),view);await exact();
  await worldObject(page,'cow.station.water');assert.equal(await page.locator('#cow-panel').isVisible(),true);await page.locator('#close-cow').click();await exact();
  await page.screenshot({path:`${qa}/${name}-3d.png`,fullPage:true});
  for(const query of ['?world=classic','?world=unified-preview','']){await page.goto(base+'/play/'+query);await page.waitForFunction(()=>document.querySelector('#unified-preview')?.dataset.controlsReady==='true'&&document.querySelector('#unified-preview')?.dataset.renderer==='three');await exact();assert.equal(await page.locator('[data-preview-exit]').count(),0);}
  assert.ok(!requests.some(url=>/\/(?:preview-loader|world|camera|isometric|chicken-view|goat-view|cow-view|fish-view|fish-scene|unified-world-canvas)\.js(?:\?|$)/.test(url)));
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  report.profiles.push({name,homepageNormal3D:true,bookmarks3D:true,lowStillWebGL:true,contextLossAndRetry:true,saveByteExact:true,oneOriginalInterval:true});console.log(name+' passed');
 }finally{await context.close();}
}assert.equal(report.profiles.length,8);assert.deepEqual(report.errors,[]);assert.equal(expired,false);}catch(error){report.failure=String(error.stack||error);throw error;}finally{if(timer)clearTimeout(timer);await browser?.close();await target.close();await writeFile(qa+'/entry.json',JSON.stringify({...report,slotExpired:expired},null,2));}
