import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {deserialize,serialize,SAVE_VERSION} from '../client/save-schema.js';
import {SaveSession,SAVE_KEY,BACKUP_KEY,PRE_V6_KEY,QUARANTINE_KEY} from '../client/storage.js';
import {createState} from '../client/engine.js';
const raw=readFileSync(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8');
function memory(entries=[],fail=''){const map=new Map(entries);return {map,storage:{getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(k===fail)throw Error('quota');map.set(k,v);},removeItem:k=>map.delete(k)}};}
test('V5 migration preserves every original farm field and exact original bytes before writing V6',()=>{
 const old=JSON.parse(raw).state,{map,storage}=memory([[SAVE_KEY,raw]]),session=new SaveSession(storage),result=session.load();
 assert.equal(result.status,'saveMigrated');assert.equal(result.state.saveVersion,SAVE_VERSION);
 const prior=structuredClone(result.state);prior.saveVersion=5;assert.deepEqual(prior,old);
 assert.equal(map.get(PRE_V6_KEY),raw);assert.equal(map.get(BACKUP_KEY),raw);assert.equal(session.original(),raw);
 const before=[...map];assert.equal(new SaveSession(storage).load().status,'saveResumed');assert.deepEqual([...map],before);
});
test('garden archive collision and archive/backup/primary quota failures never replace V5 source',()=>{
 for(const fail of ['collision',PRE_V6_KEY,BACKUP_KEY,SAVE_KEY]){
  const {map,storage}=memory([[SAVE_KEY,raw],...(fail==='collision'?[[PRE_V6_KEY,'retain other source']]:[])],fail),session=new SaveSession(storage),result=session.load();
  assert.equal(result.status,'saveMigrationPreview');assert.equal(session.blocked,true);assert.equal(map.get(SAVE_KEY),raw);assert.ok(result.state);assert.throws(()=>session.save(result.state));
  if(fail==='collision')assert.equal(map.get(PRE_V6_KEY),'retain other source');
 }
});
test('future save is never downgraded; corrupt-primary recovery archives V5 backup without losing raw primary',()=>{
 const future=JSON.stringify({format:'MyFarmTwin',saveVersion:SAVE_VERSION+1,state:{}}),a=memory([[SAVE_KEY,future],[BACKUP_KEY,raw]]),before=[...a.map];
 assert.equal(new SaveSession(a.storage).load().status,'saveNewer');assert.deepEqual([...a.map],before);
 const b=memory([[SAVE_KEY,'unreadable original'],[BACKUP_KEY,raw]]),session=new SaveSession(b.storage),result=session.load();
 assert.equal(result.status,'saveRecovered');assert.equal(b.map.get(QUARANTINE_KEY),'unreadable original');assert.equal(b.map.get(PRE_V6_KEY),raw);assert.equal(b.map.get(BACKUP_KEY),raw);assert.deepEqual(deserialize(b.map.get(SAVE_KEY)),result.state);
});
test('legacy V5 cannot smuggle new plots; V6 rejects changed placement and stale tabs cannot overwrite',()=>{
 const bad=JSON.parse(raw);bad.state.plots.push({...bad.state.plots[0],id:3});assert.throws(()=>deserialize(JSON.stringify(bad)));
 const state=createState(),wrong=JSON.parse(serialize(state));wrong.state.plots[0].x=0;assert.throws(()=>deserialize(JSON.stringify(wrong)));
 const {map,storage}=memory([[SAVE_KEY,raw]]),a=new SaveSession(storage);a.load();map.set(SAVE_KEY,serialize(createState(22)));assert.throws(()=>a.save(state),/saveConflict/);
});
