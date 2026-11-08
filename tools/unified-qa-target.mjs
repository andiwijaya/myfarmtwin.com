import assert from 'node:assert/strict';
import {startServer} from './serve.mjs';

/** The same UI assertions can target localhost or the explicitly approved site.
 * Browser runners always create disposable contexts with synthetic local saves.
 */
export async function unifiedQATarget() {
  if (process.env.BASE_URL) {
    const url = new URL(process.env.BASE_URL);
    assert.ok(url.protocol === 'https:' || url.protocol === 'http:');
    assert.ok(['127.0.0.1', 'localhost', 'myfarmtwin.com', 'www.myfarmtwin.com'].includes(url.hostname)
      || url.hostname.endsWith('.myfarmtwin-com.pages.dev'), 'Unapproved QA origin');
    assert.equal(url.username + url.password + url.search + url.hash, '');
    assert.equal(url.pathname, '/', 'BASE_URL must identify an origin');
    return {base: url.origin, close: async () => {}};
  }
  const server = await startServer(0);
  return {base: 'http://127.0.0.1:' + server.address().port,
    close: () => new Promise(resolve => server.close(resolve))};
}
