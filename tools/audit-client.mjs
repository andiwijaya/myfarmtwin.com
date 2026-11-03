import {readdir,readFile} from 'node:fs/promises';import assert from 'node:assert/strict';
globalThis.localStorage={getItem:()=>null,setItem:()=>{}};
const {messages}=await import('../game/client/locales.js'),used=new Set();let bytes=0,modules=0;
for(const name of await readdir('game/client')){const text=await readFile('game/client/'+name,'utf8');bytes+=Buffer.byteLength(text);if(name.endsWith('.js')){modules++;assert.doesNotMatch(text,/console\.(log|debug)|\bdebugger\b/,'Debug code: '+name);assert.doesNotMatch(text,/from\s+['"](?:https?:|[a-z@])/,'External runtime import: '+name);}for(const m of text.matchAll(/\bt\(['"]([A-Za-z0-9_]+)['"]\)|data-i18n="([A-Za-z0-9_]+)"/g))used.add(m[1]||m[2]);}
assert.deepEqual(Object.keys(messages.en).sort(),Object.keys(messages.id).sort(),'Locale key sets differ');for(const key of used)for(const locale of ['en','id'])assert.ok(messages[locale][key],'Missing '+locale+':'+key);
console.log(JSON.stringify({runtimeDependencies:0,clientModules:modules,clientBytes:bytes,localeKeys:Object.keys(messages.en).length,staticReferencedKeys:used.size,debugStatements:0,externalRuntimeImports:0}));
