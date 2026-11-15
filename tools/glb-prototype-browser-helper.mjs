import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {resolve,relative,join,extname,sep} from 'node:path';
import {createHash} from 'node:crypto';

export const ORIGIN='https://myfarmtwin.local';
const contentTypes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.glb':'model/gltf-binary','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
export const hash=bytes=>createHash('sha256').update(bytes).digest('hex');

/** Keep all responses from one actual artifact, even when source work continues.
 * A final current-build check distinguishes an accepted run from exploration. */
export async function freezeArtifact(root=resolve('dist')){
 const files=new Map();
 async function walk(directory){for(const item of await readdir(directory,{withFileTypes:true})){const path=join(directory,item.name);if(item.isSymbolicLink())throw Error('Artifact symlink is not an accepted input');if(item.isDirectory())await walk(path);else files.set('/'+relative(root,path).split(sep).join('/'),await readFile(path));}}
 await walk(join(root,'play'));
 for(const name of ['_headers','favicon.svg']){try{files.set('/'+name,await readFile(join(root,name)));}catch(error){if(error.code!=='ENOENT')throw error;}}
 const rules=[];let active=null;
 for(const line of files.get('/_headers').toString('utf8').split(/\r?\n/)){if(!line.trim()||line.trim().startsWith('#'))continue;if(!/^\s/.test(line)){active={pattern:line.trim(),headers:{}};rules.push(active);}else if(active){const colon=line.indexOf(':');if(colon>0)active.headers[line.slice(0,colon).trim().toLowerCase()]=line.slice(colon+1).trim();}}
 const receipt=files.get('/play/glb/build-info.json');assert.ok(receipt,'Build the prototype before the browser journey');
 const proof={receiptSHA256:hash(receipt),headersSHA256:hash(files.get('/_headers')),files:files.size,bytes:[...files.values()].reduce((n,b)=>n+b.length,0)};
 return {files,rules,proof,async current(){const [receiptNow,headersNow]=await Promise.all([readFile(join(root,'play/glb/build-info.json')),readFile(join(root,'_headers'))]);return hash(receiptNow)===proof.receiptSHA256&&hash(headersNow)===proof.headersSHA256;}};
}

export async function routeArtifact(context,artifact,entry,{failModel}={}){
 await context.route('**/*',async route=>{
  const raw=route.request().url();
  try{
   const url=new URL(raw);if(!['https:','http:'].includes(url.protocol))return route.continue();
   assert.equal(url.origin,ORIGIN,'Unexpected external runtime request');
   let path=decodeURIComponent(url.pathname);assert.ok(!path.split('/').includes('..'),'Traversal request');if(path.endsWith('/'))path+='index.html';
   if(failModel?.(path)){entry.expectedFailures.push({url:raw,kind:'injected-model-404'});await route.fulfill({status:404,contentType:'text/plain',body:'Synthetic model failure'});return;}
   const body=artifact.files.get(path);if(!body){entry.unexpectedRequests.push(raw);await route.fulfill({status:404,body:'Artifact file not found'});return;}
   const headers={'content-type':contentTypes[extname(path)]||'application/octet-stream'};
   for(const rule of artifact.rules)if(rule.pattern.endsWith('*')?url.pathname.startsWith(rule.pattern.slice(0,-1)):url.pathname===rule.pattern)Object.assign(headers,rule.headers);
   entry.resources[path]={bytes:body.length,sha256:hash(body),contentType:headers['content-type']};
   await route.fulfill({status:200,headers,body});
  }catch(error){entry.unexpectedRequests.push({url:raw,error:String(error)});await route.fulfill({status:500,body:'Artifact routing error'});}
 });
}

export function browserEntry(name){return {name,checks:[],captures:[],resources:{},errors:[],consoleErrors:[],failedRequests:[],expectedFailures:[],unexpectedRequests:[]};}
export function observePage(page,entry){page.on('pageerror',error=>entry.errors.push(error.message));page.on('console',message=>{if(message.type()==='error')entry.consoleErrors.push(message.text());});page.on('requestfailed',request=>entry.failedRequests.push({url:request.url(),failure:request.failure()}));}
export async function openPrototype(page,{expected='true'}={}){await page.goto(ORIGIN+'/play/glb/',{waitUntil:'networkidle'});await page.waitForFunction(value=>document.body.dataset.prototypeReady===value,expected,{timeout:45_000});}
export async function protectedStore(page){return page.evaluate(()=>Object.fromEntries(Object.keys(localStorage).filter(key=>key.startsWith('myfarmtwin.save.')||key.startsWith('myfarmtwin.glb.')).sort().map(key=>[key,localStorage.getItem(key)])));}
export async function nativeText(page){return page.evaluate(()=>localStorage.getItem('myfarmtwin.save.v1'));}
export async function layoutValue(page){return page.evaluate(()=>{const text=localStorage.getItem('myfarmtwin.glb.layout.v1');return text?JSON.parse(text):null;});}
export async function noOverflow(page){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'Horizontal overflow');}
export async function assertClean(entry){assert.deepEqual(entry.errors,[],'Uncaught page errors');assert.deepEqual(entry.consoleErrors,[],'Console errors');assert.deepEqual(entry.failedRequests,[],'Failed runtime requests');assert.deepEqual(entry.unexpectedRequests,[],'Unexpected runtime asset request');}
