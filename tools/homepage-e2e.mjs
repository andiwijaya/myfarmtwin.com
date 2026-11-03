import {chromium} from 'playwright';
import {startServer} from './serve.mjs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import assert from 'node:assert/strict';
const server=await startServer(0),base='http://127.0.0.1:'+server.address().port,qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-homepage');await mkdir(qa,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE}),report={at:new Date().toISOString(),base,surfaces:[],checks:[],errors:[]};
const saveKey='myfarmtwin.save.v1',sentinel='existing-user-save-preserved-verbatim';
try{
 for(const width of [320,360,390,768,800,801,1024,1440])for(const locale of ['en','id']){
  const context=await browser.newContext({viewport:{width,height:width<801?844:1000},locale:locale==='id'?'id-ID':'en-US',isMobile:width<801,hasTouch:width<801}),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  try{
   console.log('Checking single card',width,locale);await context.route('https://www.googletagmanager.com/**',route=>route.abort());await context.addInitScript(({locale,saveKey,sentinel})=>{if(!localStorage.getItem('qa-home-set')){localStorage.setItem(saveKey,sentinel);localStorage.setItem('myfarmtwin.locale',locale);localStorage.setItem('qa-home-set','yes');}}, {locale,saveKey,sentinel});
   await page.goto(base+'/',{waitUntil:'networkidle'});await page.locator('.card-preview img').evaluate(i=>i.decode());assert.equal(await page.locator('main > *').count(),1);assert.equal(await page.locator('main > .game-card').count(),1);assert.equal(await page.locator('a[href="/play/"]').count(),1);assert.equal(await page.locator('img').count(),1);assert.doesNotMatch(await page.content(),/farmgirl/i);assert.equal(await page.locator('nav, .menu-toggle, section, footer').count(),0);
   assert.equal(await page.locator('html').getAttribute('lang'),locale);assert.equal(await page.locator('#home-language').inputValue(),locale);assert.equal(await page.locator('h1').count(),1);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,'Overflow '+width+' '+locale);
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://myfarmtwin.com/');assert.equal(await page.locator('meta[property="og:url"]').getAttribute('content'),'https://myfarmtwin.com/');assert.equal(await page.locator('a[href^="/"]:not([href="/"]):not([href="/play/"])').count(),0,'Homepage advertises an unavailable route');
   for(const a of await page.locator('a[href="/play/"]').all())assert.equal(await a.getAttribute('href'),'/play/');
   const title=await page.locator('h1').innerText();assert.equal(title,locale==='id'?'Mainkan Farm':'Play Farm');
   const target=await page.locator('.card-action').boundingBox();assert.ok(target.height>=44&&target.width>=44);assert.ok(target.y+target.height<=844,'Primary CTA below first mobile viewport');await page.locator('.game-card').focus();assert.equal(await page.locator('.game-card').evaluate(e=>e===document.activeElement),true);
   const next=locale==='en'?'id':'en';await page.locator('#home-language').selectOption(next);assert.equal(await page.locator('html').getAttribute('lang'),next);assert.equal(await page.title(),next==='id'?'MyFarmTwin — Mainkan Farm':'MyFarmTwin — Play Farm');assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),sentinel);await page.reload({waitUntil:'networkidle'});assert.equal(await page.locator('#home-language').inputValue(),next);assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),sentinel);await page.locator('#home-language').selectOption(locale);
   if([390,1440].includes(width))await page.screenshot({path:join(qa,`home-${locale}-${width}.png`),fullPage:true});
   // Use a real game save for the transition: the homepage must leave every byte intact.
   await page.evaluate(async key=>{const {createState}=await import('/play/engine.js'),{serialize}=await import('/play/save-schema.js');localStorage.setItem(key,serialize(createState()));},saveKey);
   const prior=await page.evaluate(key=>localStorage.getItem(key),saveKey);await page.reload({waitUntil:'networkidle'});assert.equal(await page.evaluate(key=>localStorage.getItem(key),saveKey),prior);await page.locator('.game-card').focus();await Promise.all([page.waitForURL('**/play/'),page.keyboard.press('Enter')]);await page.waitForLoadState('networkidle');assert.equal(new URL(page.url()).pathname,'/play/');assert.equal(await page.locator('#language').inputValue(),locale);assert.equal(await page.locator('[data-plot]').count(),3);assert.equal(await page.locator('#hud-coins').innerText(),'120');assert.equal(await page.locator('[data-i18n="journal"]').innerText(),locale==='id'?'Kembali ke beranda':'Back to home');
   report.surfaces.push({width,locale,singleCard:true,noFarmGirl:true,overflow:false,ctaAboveFold:true,keyboardEntry:true,localePersists:true,gameSavePreserved:true,gameEntry:true});
  }finally{await context.close();}
 }
 for(const options of [{javaScriptEnabled:false},{locale:'id-ID'},{reducedMotion:'reduce',blockedStorage:true}]){
  const context=await browser.newContext(options),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));try{if(options.blockedStorage)await context.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Storage disabled','SecurityError');}}));await page.goto(base+'/',{waitUntil:'networkidle'});assert.equal(await page.locator('.game-card').isVisible(),true);if(options.locale)assert.equal(await page.locator('html').getAttribute('lang'),'id');if(options.blockedStorage){await page.locator('#home-language').selectOption('id');assert.equal(await page.locator('html').getAttribute('lang'),'id');}report.checks.push(options);}finally{await context.close();}
 }
 // The only existing game-file differences are the EN/ID back-link presentation labels.
 const files=execFileSync('git',['ls-tree','-r','--name-only','ddec510','--','dist'],{encoding:'utf8'}).trim().split('\n');for(const file of files)if(file!=='dist/index.html'){const original=execFileSync('git',['show','ddec510:'+file],{maxBuffer:5*1024*1024});if(['dist/play/index.html','dist/play/locales.js'].includes(file)){const expected=original.toString().replaceAll('Back to journal','Back to home').replaceAll('Kembali ke jurnal','Kembali ke beranda');assert.equal(await readFile(file,'utf8'),expected,file+' has an unexpected gameplay difference');}else assert.deepEqual(await readFile(file),original,file+' changed');}
 report.protectedReleaseFiles=files.length-3;report.backLinkLabelsOnly=true;assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'homepage.json'),JSON.stringify(report,null,2));}
