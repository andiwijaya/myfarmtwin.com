export {};
/** Read-only same-origin checks, visible in the internal browser. No farm
 * storage, clipboard, file picker, download, or third-party request is used. */
const status=document.getElementById('integrity-status'),report=document.getElementById('integrity-report');
/** @param {ArrayBuffer} bytes */
async function hash(bytes){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(n=>n.toString(16).padStart(2,'0')).join('');}
try{
 const receiptResponse=await fetch('/play/build-info.json',{cache:'reload'});if(!receiptResponse.ok)throw Error('Build receipt missing');const receipt=await receiptResponse.json();
 const files=[{url:'/play/',sha256:receipt.htmlSha256},{url:'/play/glb/',sha256:receipt.htmlSha256},{url:'/play/cozy/style.css',sha256:receipt.cssSha256},{url:'/play/assets/models/world-manifest.json',sha256:receipt.manifestSha256},...receipt.emitted.map((/** @type {any} */f)=>({url:'/play/cozy/'+f.name,...f})),...Object.values(receipt.assets).flatMap((/** @type {any} */a)=>[a,a.lod?.far].filter(Boolean))];
 if(receipt.panorama)files.push(receipt.panorama);
 /** @type {any[]} */const results=[];let index=0;
 await Promise.all(Array.from({length:3},async()=>{while(index<files.length){const file=files[index++];if(typeof file.url!=='string'||!file.url.startsWith('/play/')||file.url.includes('..'))throw Error('Unsafe resource URL');const response=await fetch(file.url,{cache:'reload'}),bytes=await response.arrayBuffer(),actual=await hash(bytes),mime=response.headers.get('content-type')||'',isGlb=file.url.endsWith('.glb');const validMime=file.mime?mime.split(';')[0]===file.mime:!isGlb||/model\/gltf-binary|application\/octet-stream/.test(mime);const ok=response.ok&&actual===file.sha256&&(!file.bytes||bytes.byteLength===file.bytes)&&validMime;results.push({url:file.url,status:response.status,bytes:bytes.byteLength,mime,sha256:actual,expected:file.sha256,ok});if(status)status.textContent='Checked '+results.length+' / '+files.length;}}));
 const result={kind:'myfarmtwin-internal-browser-integrity-v2',origin:location.origin,entry:receipt.entry,manifestSha256:receipt.manifestSha256,files:results.length,glbs:results.filter(f=>f.url.endsWith('.glb')).length,ok:results.every(f=>f.ok),results:results.sort((a,b)=>a.url.localeCompare(b.url))};if(report)report.textContent=JSON.stringify(result,null,2);if(status)status.textContent=result.ok?'PASS — all deployed bytes match the release receipt':'FAIL — resource mismatch';document.body.dataset.integrity=result.ok?'pass':'fail';
}catch(error){if(status)status.textContent='FAIL — '+(error instanceof Error?error.message:'Release check failed');document.body.dataset.integrity='fail';}
