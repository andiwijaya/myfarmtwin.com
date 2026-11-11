import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
import {startServer} from './serve.mjs';
import {worldCamera} from './unified-shell-ui.mjs';
const qa=process.env.QA_DIR||'qa-artifacts/garden/home-capture';await mkdir(qa,{recursive:true});
const raw=await readFile('qa-artifacts/garden/growth/dense-mixed.json','utf8'),hash=b=>createHash('sha256').update(b).digest('hex'),receipt=await readFile('qa-artifacts/garden/build/dist/play/build-info.json'),server=await startServer(0,resolve('qa-artifacts/garden/build/dist'));let browser;
const report={fixtureSHA256:hash(raw),receiptRawSHA256:hash(receipt),method:'Unedited actual rendered game canvas/viewport. Native paid synthetic 24-bed garden. No image generation, CSS art changes, compositing, personal save or browser takeover.',captures:[],errors:[],consoleErrors:[]};
try{
 browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE||'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const [name,width,height]of [['hero',1504,1000],['social',1200,630]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,reducedMotion:'reduce'});
  try{await context.addInitScript(raw=>localStorage.setItem('myfarmtwin.save.v1',raw),raw);const page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push(m.text());});await page.goto(`http://127.0.0.1:${server.address().port}/play/`);await page.waitForFunction(()=>{const d=document.querySelector('#unified-preview')?.dataset;return d?.controlsReady==='true'&&d.spriteActors===d.spriteReady;});await worldCamera(page,'fit');
   for(let heading=0;heading<4;heading++){if(heading)await worldCamera(page,'right');const path=`${qa}/${name}-h${heading}.png`,bytes=await (name==='hero'?page.locator('#world canvas'):page).screenshot({path});assert.equal(await page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1')),raw);report.captures.push({name,heading,path,width:bytes.readUInt32BE(16),height:bytes.readUInt32BE(20),sha256:hash(bytes)});}
  }finally{await context.close();}
 }
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.consoleErrors,[]);
}catch(e){report.failure=String(e.stack||e);throw e;}
finally{await browser?.close();server.closeAllConnections();await new Promise(r=>server.close(r));await writeFile(`${qa}/captures.json`,JSON.stringify(report,null,2));}
console.log(JSON.stringify({captures:report.captures.length,unedited:true}));
