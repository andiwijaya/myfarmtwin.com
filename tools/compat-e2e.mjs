import {chromium} from 'playwright';import {startServer} from './serve.mjs';import {runVerticalSlice} from './vertical-slice.mjs';import {runLongSession} from './long-session.mjs';import {serialize} from '../game/client/save-schema.js';import {mkdir,writeFile} from 'node:fs/promises';import {join} from 'node:path';import {tmpdir} from 'node:os';import assert from 'node:assert/strict';
const server=await startServer(0),base='http://127.0.0.1:'+server.address().port,qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-qa');await mkdir(qa,{recursive:true});const report={at:new Date().toISOString(),surfaces:[],issues:[]};
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
try{
 report.chromium=browser.version();
 for(const width of [320,360,390,768,1024,1440])for(const language of ['en','id']){
  const context=await browser.newContext({viewport:{width,height:900},isMobile:width<700,hasTouch:width<700});const page=await context.newPage();await page.goto(base+'/play/',{waitUntil:'networkidle'});await page.locator('#language').selectOption(language);await page.locator('[data-choose-plot="0"]').click();await page.locator('#data-tools summary').click();
  const audit=await page.evaluate(()=>{
   const issues=[];if(document.documentElement.scrollWidth>innerWidth)issues.push({type:'overflow',width:innerWidth,scroll:document.documentElement.scrollWidth});
   const rgb=text=>{const nums=text.match(/[\d.]+/g)?.map(Number)||[0,0,0];return [...nums.slice(0,3),nums.length>3?nums[3]:1];};
   const luminance=values=>values.slice(0,3).map(c=>c/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4).reduce((n,c,i)=>n+c*[.2126,.7152,.0722][i],0);
   const background=element=>{let color=[255,255,255,1];const chain=[];for(let p=element;p;p=p.parentElement)chain.unshift(p);for(const p of chain){const c=rgb(getComputedStyle(p).backgroundColor);color=[c[0]*c[3]+color[0]*(1-c[3]),c[1]*c[3]+color[1]*(1-c[3]),c[2]*c[3]+color[2]*(1-c[3]),1];}return color;};
   for(const element of document.querySelectorAll('button,summary,select,a[href],label.file-button')){
    const r=element.getBoundingClientRect(),s=getComputedStyle(element);if(!r.width||!r.height||s.visibility==='hidden'||element.closest('[hidden],dialog:not([open])')||element.classList.contains('skip-link'))continue;
    const label=element.getAttribute('aria-label')||element.textContent?.trim()||element.getAttribute('title')||'';
    if(!label)issues.push({type:'unnamed',tag:element.tagName});if(r.height<43.5||r.width<43.5)issues.push({type:'touch',label,width:+r.width.toFixed(1),height:+r.height.toFixed(1)});if(parseFloat(s.fontSize)<11)issues.push({type:'small-action-text',label,font:s.fontSize});
    if(!element.matches(':disabled')){const a=luminance(rgb(s.color)),b=luminance(background(element)),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);if(ratio<4.5)issues.push({type:'contrast',label,ratio:+ratio.toFixed(2)});}
   }
   return issues;
  });
  report.surfaces.push({width,language,issues:audit.length});report.issues.push(...audit.map(i=>({...i,width,language})));await context.close();
 }
 const state=runLongSession(90).state;state.pump.on=true;state.water=120;const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:'reduce'});await context.addInitScript(raw=>localStorage.setItem('myfarmtwin.save.v1',raw),serialize(state));const page=await context.newPage();await page.goto(base+'/play/',{waitUntil:'networkidle'});assert.equal(await page.locator('.pump-flow').evaluate(e=>getComputedStyle(e).animationName),'none');await page.locator('[data-plot="0"]').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#plot-panel').isVisible(),true);await page.locator('#inspect').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('#inspect-dialog').isVisible(),true);await page.keyboard.press('Escape');assert.equal(await page.locator('#inspect').evaluate(e=>e===document.activeElement),true);report.keyboardAndReducedMotion=true;await context.close();
}finally{await browser.close();}
try{
 const {firefox}=await import(process.env.PLAYWRIGHT_SECONDARY_MODULE||'playwright');const other=await firefox.launch({headless:true,...(process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_FIREFOX_EXECUTABLE}:{})});try{report.firefox=other.version();const directory=join(qa,'firefox');await mkdir(directory,{recursive:true});report.firefoxSlice=await runVerticalSlice(base,other,directory,[['desktop',1440,1000]]);}finally{await other.close();}
}catch(error){report.issues.push({type:'firefox',message:error.message});}
await new Promise(r=>server.close(r));await writeFile(join(qa,'compatibility.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));if(report.issues.length)process.exitCode=1;
