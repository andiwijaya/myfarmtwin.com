import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {parseHeaderRules,headersForPath} from '../../tools/pages-headers.mjs';

test('prototype GLB requests are permitted by one scoped CSP while native game keeps connect-src none',async()=>{
 const rules=parseHeaderRules(await readFile('dist/_headers','utf8'));
 for(const path of ['/play/glb/','/play/glb/index.html','/play/glb/app-example.js']){
  const h=headersForPath(rules,path),csp=h['content-security-policy'];assert.match(csp,/connect-src 'self' blob:/);assert.doesNotMatch(csp,/connect-src 'none'/);assert.equal(csp.split('default-src').length,2,'One effective policy');assert.match(csp,/frame-ancestors 'none'/);assert.equal(h['x-frame-options'],'DENY');assert.equal(h['x-content-type-options'],'nosniff');
 }
 for(const path of ['/play','/play/','/play/index.html','/play/main.js'])assert.match(headersForPath(rules,path)['content-security-policy'],/connect-src 'none'/);
});
test('Pages-style merge retains both policies without a detach and narrows the replacement by path',()=>{
 const rules=parseHeaderRules("/play/*\n  Content-Security-Policy: connect-src 'none'\n/play/other/*\n  Content-Security-Policy: connect-src 'self'\n/play/glb/*\n  ! Content-Security-Policy\n  Content-Security-Policy: connect-src 'self' blob:\n");
 assert.equal(headersForPath(rules,'/play/other/')['content-security-policy'],"connect-src 'none', connect-src 'self'");assert.equal(headersForPath(rules,'/play/glb/')['content-security-policy'],"connect-src 'self' blob:");assert.equal(headersForPath(rules,'/play/')['content-security-policy'],"connect-src 'none'");
});
