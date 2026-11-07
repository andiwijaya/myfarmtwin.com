import {chromium} from 'playwright';import {settledPage} from './settled-page.mjs';import {startServer} from './serve.mjs';import {readFile,mkdir,writeFile} from 'node:fs/promises';import {join} from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-camera');await mkdir(qa,{recursive:true});
const noWebgl=process.env.UNIFIED_NO_WEBGL==='1',server=await startServer(0),base='http://127.0.0.1:'+server.address().port,browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,args:noWebgl?['--disable-webgl']:[]}),report={profiles:[],errors:[],noWebgl,method:'Headless isolated Chrome; mobile touch input through CDP emulation, not a physical touchscreen.'};
try{
 for(const existing of [false,true])for(const mobile of [false,true])for(const locale of ['en','id']){
  const raw=await readFile('game/tests/fixtures/unified-world/v5-'+(existing?'mixed':'fresh')+'.json','utf8'),context=await browser.newContext({viewport:{width:mobile?390:1440,height:mobile?844:1000},isMobile:mobile,hasTouch:mobile});
  try{
   await context.addInitScript(raw=>localStorage.setItem('myfarmtwin.save.v1',raw),raw);const page=settledPage(await context.newPage());page.on('pageerror',e=>report.errors.push(e.message));await page.goto(base+'/play/?world=unified-preview',{waitUntil:'networkidle'});await page.locator('#language').selectOption(locale);
   const host=page.locator('#unified-preview'),canvas=host.locator('canvas'),camera=async()=>({x:await host.getAttribute('data-pan-x'),z:await host.getAttribute('data-pan-z'),heading:await host.getAttribute('data-heading'),zoom:await host.getAttribute('data-zoom')});
   for(let heading=0;heading<4;heading++){
    await page.locator('[data-preview-camera=reset]').click();for(let i=0;i<heading;i++)await page.locator('[data-preview-camera=right]').click();await page.locator('[data-preview-camera=chicken]').click();assert.equal((await camera()).heading,String(heading));
    await canvas.focus();const keysBefore=await camera();await page.keyboard.press('ArrowLeft');assert.notDeepEqual(await camera(),keysBefore);await page.keyboard.press('+');assert.ok(Number((await camera()).zoom)>Number(keysBefore.zoom));
    await canvas.scrollIntoViewIfNeeded();const box=await canvas.boundingBox(),before=await camera(),x=box.x+box.width*.4,y=box.y+box.height*.45;
    if(mobile){const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y}]});for(let step=1;step<=4;step++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+step*15,y:y+step*5}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();}
    else{await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+60,y+20,{steps:4});await page.mouse.up();}
    assert.notDeepEqual(await camera(),before);await host.screenshot({path:join(qa,`${existing?'mixed':'fresh'}-${mobile?'touch':'mouse'}-${locale}-${heading}.png`)});
   }
   await page.locator('[data-preview-camera=reset]').click();const reset=await camera();await page.locator('[data-preview-camera=field]').focus();await page.keyboard.press('ArrowRight');assert.deepEqual(await camera(),reset,'Keys outside map must not move camera');
   await canvas.scrollIntoViewIfNeeded();await canvas.hover();await page.mouse.wheel(0,120);await page.waitForTimeout(100);assert.equal((await camera()).zoom,reset.zoom,'Unmodified wheel must not zoom');
   await canvas.scrollIntoViewIfNeeded();await canvas.hover();await page.keyboard.down('Control');await page.mouse.wheel(0,-200);await page.keyboard.up('Control');await page.waitForTimeout(100);assert.ok(Number((await camera()).zoom)>1);
   await canvas.focus();await page.keyboard.press('Home');assert.deepEqual(await camera(),reset);
   assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);assert.equal(await host.getAttribute('data-chicken-started'),String(existing));
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
   report.profiles.push({existing,mobile,locale,headings:4,keyboard:true,drag:mobile?'emulated touch':'mouse',scopedWheel:true,reset:true,saveExact:true,noGrant:true});
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);console.log(JSON.stringify(report));
}finally{await browser.close();await new Promise(r=>server.close(r));await writeFile(join(qa,'camera.json'),JSON.stringify(report,null,2));}
