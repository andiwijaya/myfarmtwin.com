import {chromium} from 'playwright';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {execFileSync} from 'node:child_process';
import {digest} from './unified-save-baseline.mjs';

const qa=process.env.QA_DIR||join(tmpdir(),'myfarmtwin-unified-reference');await mkdir(qa,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE});
const report={at:new Date().toISOString(),browser:browser.version(),method:'Read-only public runtime, new temporary contexts; no owner save, account or hosting settings.',farm:{},zoo:{}};
try{
 for(const [key,url]of [['farm','https://myfarmtwin.com/play/'],['zoo','https://myzootwin.com/play/']]){
  const context=await browser.newContext({viewport:{width:1440,height:1000}}),page=await context.newPage(),responses=[];
  const item=report[key]={url,resources:[],errors:[]};page.on('pageerror',e=>item.errors.push(e.message));
  page.on('response',res=>{const path=new URL(res.url()).pathname;if(key==='farm'&&res.status()===200&&path.startsWith('/play/')&&/\.(js|css)$/.test(path))responses.push((async()=>{const actual=await res.body(),relative='dist'+path;let expected;try{expected=execFileSync('git',['show','HEAD:'+relative]);}catch{}item.resources.push({path,status:res.status(),bytes:actual.length,sha256:digest(actual),matchesSource:expected?digest(expected)===digest(actual):null});})());});
  try{
   const response=await page.goto(url,{waitUntil:'networkidle',timeout:30000});item.status=response?.status();item.title=await page.title();
   if(!response?.ok()){item.blocked=true;continue;}
   if(key==='farm'){
    const actual=await response.body(),expected=await readFile('dist/play/index.html');item.htmlMatchesLocal=digest(actual)===digest(expected);
    item.areaButtons=await page.locator('#farm-areas button').allTextContents();item.saveVersion=await page.evaluate(()=>{const raw=localStorage.getItem('myfarmtwin.save.v1');return raw?JSON.parse(raw).saveVersion:null;});
   }else{const explore=page.getByRole('button',{name:'Explore the sanctuary',exact:true});if(await explore.isVisible()){await explore.click();await page.locator('canvas').waitFor({state:'visible',timeout:20000});}item.canvasCount=await page.locator('canvas').count();item.visibleButtons=await page.getByRole('button').allTextContents();}
   await page.screenshot({path:join(qa,key+'-reference.png'),fullPage:true});item.screenshot=key+'-reference.png';
  }catch(error){item.blocked=true;item.failure=String(error);}finally{await Promise.allSettled(responses);await context.close();}
 }
 console.log(JSON.stringify({farm:{status:report.farm.status,resources:report.farm.resources?.length,sourceMatches:report.farm.resources?.filter(r=>r.matchesSource).length,errors:report.farm.errors},zoo:{status:report.zoo.status,canvasCount:report.zoo.canvasCount,failure:report.zoo.failure,errors:report.zoo.errors}}));
}finally{await browser.close();await writeFile(join(qa,'reference-audit.json'),JSON.stringify(report,null,2));}
