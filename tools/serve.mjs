import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
export async function startServer(port=4177,root=resolve(process.env.QA_DIST_ROOT||'dist'),options={assetCache:false}){
 const rules=[];let active=null;let policy='';try{policy=await readFile(resolve(root,'_headers'),'utf8');}catch{/* No custom policy in a baseline fixture. */}for(const line of policy.split(/\r?\n/)){if(!line.trim()||line.trim().startsWith('#'))continue;if(!/^\s/.test(line)){active={pattern:line.trim(),headers:{}};rules.push(active);}else if(active){const colon=line.indexOf(':');if(colon>0)active.headers[line.slice(0,colon).trim().toLowerCase()]=line.slice(colon+1).trim();}}
 const server=http.createServer(async(req,res)=>{
  try{
   const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(pathname==='/_headers'){res.writeHead(404);res.end('Not found');return;}
   let file=resolve(root,'.'+pathname);
   if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403);res.end();return;}
   if((await stat(file)).isDirectory())file=resolve(file,'index.html');
   let body=await readFile(file);
   const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.json':'application/json','.xml':'application/xml','.txt':'text/plain'};
   const security={};for(const rule of rules)if(rule.pattern.endsWith('*')?pathname.startsWith(rule.pattern.slice(0,-1)):pathname===rule.pattern)Object.assign(security,rule.headers);
   const headers={'content-type':mime[extname(file)]||'application/octet-stream','cache-control':'no-store',...security};
   // Explicit QA mode reproduces the observed live browser asset cache. It is
   // never part of dist or Cloudflare configuration; normal local serving stays unchanged.
   if(options.assetCache){const protectedTransform=/\bno-transform\b/.test(headers['cache-control']);if(options.assetCompression&&!protectedTransform&&/\.(?:js|css)$/.test(file)&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){body=gzipSync(body);headers['content-encoding']='gzip';headers.vary='Accept-Encoding';headers['content-length']=String(body.length);}headers.etag='"'+createHash('sha256').update(body).digest('hex')+'"';if(extname(file)!=='.html')headers['cache-control']='public, max-age=14400, must-revalidate'+(protectedTransform?', no-transform':'');if(req.headers['if-none-match']===headers.etag){res.writeHead(304,headers);res.end();return;}}
   res.writeHead(200,headers);res.end(body);
  }catch{res.writeHead(404);res.end('Not found');}
 });
 return new Promise(resolve=>server.listen(port,'127.0.0.1',()=>resolve(server)));
}
if(import.meta.url===pathToFileURL(process.argv[1]).href){const server=await startServer(Number(process.env.PORT||4177));console.log('Local: http://127.0.0.1:'+server.address().port);}
