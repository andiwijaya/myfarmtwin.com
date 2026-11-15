import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createState} from '../client/engine.js';
import {serialize} from '../client/save-schema.js';
import {SAVE_KEY} from '../client/storage.js';
import {GLB_LAYOUT_KEY,GLB_TRANSACTION_KEY,createPrototypeLayout} from '../client/glb-prototype-state.js';
import {COZY_SAVE_KEY} from '../client/cozy-storage.js';
import {createCozyState} from '../client/cozy-domain.js';
import {recoverLegacyTransaction,exportCurrentP2} from '../client/cozy-legacy-recovery.js';
const store=entries=>{const data=new Map(entries);return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
async function pending(){const beforeNative=serialize(createState()),afterNative=await readFile(new URL('fixtures/cozy-world/v6-rich-all-areas.json',import.meta.url),'utf8'),beforeLayout=JSON.stringify(createPrototypeLayout()),afterLayout=await readFile(new URL('fixtures/cozy-world/p2-rich-moved-layout.json',import.meta.url),'utf8');return {format:'MyFarmTwinGLBTransaction',version:1,beforeNative,beforeLayout,afterNative,afterLayout};}
test('explicit P2 journal completion preserves an existing V2 primary and exports both valid branches',async()=>{const j=await pending(),cozy=JSON.stringify(createCozyState()),s=store([[SAVE_KEY,j.afterNative],[GLB_LAYOUT_KEY,j.beforeLayout],[GLB_TRANSACTION_KEY,JSON.stringify(j)],[COZY_SAVE_KEY,cozy]]);const result=recoverLegacyTransaction(s,{writable:true});assert.equal(result.ok,true);assert.equal(s.getItem(SAVE_KEY),j.afterNative);assert.equal(s.getItem(GLB_LAYOUT_KEY),j.afterLayout);assert.equal(s.getItem(GLB_TRANSACTION_KEY),null);assert.equal(s.getItem(COZY_SAVE_KEY),cozy);const bundle=JSON.parse(exportCurrentP2(s));assert.equal(bundle.native,j.afterNative);assert.deepEqual(bundle.layout,JSON.parse(j.afterLayout));const snapshot=[...s.data];assert.equal(recoverLegacyTransaction(s,{writable:true}).ok,false);assert.deepEqual([...s.data],snapshot);});
test('read-only or conflicting pending P2 recovery preserves every byte',async()=>{const j=await pending(),s=store([[SAVE_KEY,j.beforeNative],[GLB_LAYOUT_KEY,j.beforeLayout],[GLB_TRANSACTION_KEY,JSON.stringify(j)]]),before=[...s.data];assert.equal(recoverLegacyTransaction(s).ok,false);assert.deepEqual([...s.data],before);s.setItem(SAVE_KEY,serialize({...createState(),revision:1}));const conflicted=[...s.data];assert.equal(recoverLegacyTransaction(s,{writable:true}).ok,false);assert.deepEqual([...s.data],conflicted);});
