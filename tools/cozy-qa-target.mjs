import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

// Remote QA is a separate, explicit release mode. Local acceptance remains local.
export function cozyLiveSlot() {
  assert.equal(process.env.COZY_LIVE_RELEASE,'parent-authorized','Remote cozy QA requires explicit release authorization');
  assert.equal(process.env.COZY_QA_SLOT,'parent-confirmed','Coordinate the exclusive browser slot');
  const end=Date.parse(process.env.COZY_SLOT_END_UTC||'');
  assert.ok(/Z$/.test(process.env.COZY_SLOT_END_UTC||'')&&end>Date.now()&&end-Date.now()<=15*60_000,'Fresh bounded live QA deadline required');
  if(process.env.COZY_WORK_STOP_UTC)assert.ok(end<=Date.parse(process.env.COZY_WORK_STOP_UTC),'Respect the current work cutoff');
  return end;
}

export async function cozyQATarget(options={assetCache:true,assetCompression:true}) {
  if (!process.env.BASE_URL) {
    const {startServer}=await import('./serve.mjs');
    const server=await startServer(0,undefined,options);
    return {base:'http://127.0.0.1:'+server.address().port,live:false,
      close:async()=>{server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}};
  }
  cozyLiveSlot();
  const url=new URL(process.env.BASE_URL);
  assert.equal(url.protocol,'https:');
  assert.ok(['myfarmtwin.com','www.myfarmtwin.com'].includes(url.hostname),'Only the authorized public production origins');
  assert.equal(url.username+url.password+url.search+url.hash+url.port,'');
  assert.equal(url.pathname,'/');
  const expected=await readFile('dist/play/build-info.json');
  const response=await fetch(url.origin+'/play/build-info.json',{signal:AbortSignal.timeout(20000)});
  assert.equal(response.status,200);
  assert.equal(new URL(response.url).origin,url.origin,'Unexpected production redirect');
  const actual=Buffer.from(await response.arrayBuffer());
  assert.deepEqual(actual,expected,'Production build receipt must match the accepted artifact before creating a browser');
  return {base:url.origin,live:true,receiptRawSHA256:createHash('sha256').update(actual).digest('hex'),close:async()=>{}};
}
