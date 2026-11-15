import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {resolve,join,extname,sep} from 'node:path';

const qa=resolve(process.env.QA_DIR||'qa-artifacts/glb-upgrade/browser');await mkdir(qa,{recursive:true});
const base=process.env.BASE_URL||'https://myfarmtwin.local';
const report={base,transport:process.env.BASE_URL?'public-http':'offline-artifact-request-fulfilment',profiles:[],errors:[],limits:['Browser phone emulation is not physical-device performance.','Local browser checks fulfil requests from the actual dist artifact; they do not measure HTTP or CDN transport.','No upload/download or clipboard-permission tests.']};
let browser;
try{
 if(process.env.BASE_URL){assert.equal(process.env.GLB_LIVE_RELEASE,'owner-authorized');const url=new URL(base);assert.ok(['myfarmtwin.com','www.myfarmtwin.com'].includes(url.hostname));assert.equal(url.protocol,'https:');const actual=await fetch(base+'/play/glb/build-info.json',{signal:AbortSignal.timeout(20000)});assert.equal(actual.status,200);assert.deepEqual(Buffer.from(await actual.arrayBuffer()),await readFile('dist/play/glb/build-info.json'));}
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 const profiles=process.env.GLB_QUICK==='1'?[{name:'desktop-id',width:1440,height:1000,locale:'id',touch:false}]:[{name:'desktop-id',width:1440,height:1000,locale:'id',touch:false},{name:'desktop-en',width:1440,height:900,locale:'en',touch:false},{name:'phone-id',width:390,height:844,locale:'id',touch:true},{name:'tablet-en',width:1024,height:768,locale:'en',touch:true}];
 for(const profile of profiles){
  const context=await browser.newContext({viewport:{width:profile.width,height:profile.height},hasTouch:profile.touch,isMobile:profile.touch,reducedMotion:'reduce'});const entry={...profile,captures:[],consoleErrors:[],failedRequests:[],checks:[]};report.profiles.push(entry);
  try{
   if(!process.env.BASE_URL)await context.route('**/*',async route=>{try{const url=new URL(route.request().url());if(!['http:','https:'].includes(url.protocol))return route.continue();assert.equal(url.origin,base,'Unexpected external request');const root=resolve('dist'),relative=decodeURIComponent(url.pathname).replace(/^\//,'');let path=resolve(root,relative);assert.ok(path.startsWith(root+sep));if(url.pathname.endsWith('/'))path=join(path,'index.html');const bytes=await readFile(path),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};await route.fulfill({status:200,body:bytes,headers:{'content-type':types[extname(path)]||'application/octet-stream','content-security-policy':"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self' blob:; object-src 'none'; frame-src 'none'; worker-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"}});}catch(error){entry.failedRequests.push({url:route.request().url(),failure:String(error)});await route.fulfill({status:404,body:'Not found'});}});
   await context.addInitScript(locale=>localStorage.setItem('myfarmtwin.locale',locale),profile.locale);
   const page=await context.newPage();page.on('pageerror',error=>report.errors.push({profile:profile.name,error:error.message}));page.on('console',message=>{if(message.type()==='error')entry.consoleErrors.push(message.text());});page.on('requestfailed',request=>entry.failedRequests.push({url:request.url(),failure:request.failure()}));
   await page.goto(base+'/play/glb/',{waitUntil:'networkidle'});await page.waitForFunction(()=>document.body.dataset.prototypeReady==='true',{timeout:45000});
   assert.equal(await page.locator('[data-plot]').count(),24);assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),null);entry.checks.push('read-only-open-24-beds');
   for(const view of ['garden','barn','interior','overview']){await page.locator('[data-view="'+view+'"]').click();await page.waitForTimeout(180);assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),null);}
   entry.checks.push('camera-does-not-grant-or-write');
   const capture=async name=>{const path=qa+'/'+profile.name+'-'+name+'.png';await page.screenshot({path,fullPage:true});entry.captures.push(path);};
   await capture('overview');await page.locator('[data-view="barn"]').click();await page.locator('[data-action="start-cow"]').click();await page.waitForFunction(()=>JSON.parse(localStorage.getItem('myfarmtwin.save.v1')||'null')?.state.cow.visited);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('myfarmtwin.save.v1')).state.cow.cows.length),2);entry.checks.push('explicit-native-cow-starter');
   await page.locator('[data-view="interior"]').click();await page.waitForTimeout(200);await capture('interior');
   await page.locator('[data-action="focus-cow.starter.a"]').click();await page.waitForTimeout(200);await capture('cow-close');
   entry.render=await page.locator('#world').evaluate(el=>({...el.dataset}));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(entry.consoleErrors,[]);assert.deepEqual(entry.failedRequests,[]);entry.checks.push('no-errors-no-overflow');console.log(profile.name+': '+entry.checks.join(', '));
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);
}catch(error){report.failure=String(error.stack||error);throw error;}
finally{await browser?.close();await writeFile(qa+'/report.json',JSON.stringify(report,null,2));}
console.log('GLB prototype browser checks passed.');
