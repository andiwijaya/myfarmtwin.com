import {resolve} from 'node:path';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {cozyQATarget,cozyLiveSlot} from './cozy-qa-target.mjs';
import {startServer} from './serve.mjs';

// Production uses the existing origin/authorization/deadline/receipt guard.
// Local rollback rehearsal can select its isolated, rebuilt V6 artifact.
export async function gardenQATarget(options={assetCache:true,assetCompression:true}) {
 if(process.env.BASE_URL&&process.env.GARDEN_ROLLBACK_PREVIEW==='owner-authorized'){
  cozyLiveSlot();
  const deployment=JSON.parse(await readFile('qa-artifacts/garden/rollback-publication/preview/deployment.json','utf8'));
  const url=new URL(process.env.BASE_URL);
  assert.equal(url.origin,deployment.url);assert.equal(deployment.environment,'preview');assert.equal(deployment.stage.status,'success');
  assert.match(url.hostname,/^[a-f0-9]{8}\.myfarmtwin-com\.pages\.dev$/);assert.equal(url.protocol,'https:');assert.equal(url.pathname,'/');assert.equal(url.username+url.password+url.search+url.hash+url.port,'');
  const response=await fetch(url.origin+'/play/build-info.json',{signal:AbortSignal.timeout(20000)});assert.equal(response.status,200);assert.equal(new URL(response.url).origin,url.origin);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()),await readFile(resolve('qa-artifacts/garden/rollback-v6/dist/play/build-info.json')));
  return {base:url.origin,live:true,rollback:true,close:async()=>{}};
 }
 if(process.env.BASE_URL)return cozyQATarget(options);
 const root=resolve(process.env.QA_DIST_ROOT||'qa-artifacts/garden/build/dist');
 const server=await startServer(0,root,options);
 return {base:'http://127.0.0.1:'+server.address().port,live:false,root,
  close:async()=>{server.closeAllConnections();await new Promise(r=>server.close(r));}};
}
