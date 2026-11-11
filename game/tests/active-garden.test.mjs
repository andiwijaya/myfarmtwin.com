import test from 'node:test';import assert from 'node:assert/strict';
import {createState,dispatch} from '../client/engine.js';
import {serialize,deserialize} from '../client/save-schema.js';
import {activateGarden} from '../client/active-garden.js';
import {SaveSession,SAVE_KEY,BACKUP_KEY,ACTIVE_GARDEN_KEY} from '../client/storage.js';
import {readFileSync} from 'node:fs';
function store(entries=[],fail=''){const map=new Map(entries);return {map,db:{getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(k===fail)throw Error('quota');map.set(k,v);},removeItem:k=>map.delete(k)}};}
test('new native farm immediately owns 24 selectable empty beds with original starting resources',()=>{
 const state=createState();assert.equal(state.plots.length,24);assert.equal(state.coins,120);assert.equal(state.water,120);assert.deepEqual(state.seeds,{lettuce:3,tomato:0,corn:0});assert.deepEqual(state.ledger,[]);
 for(const p of state.plots){assert.equal(p.crop,null);assert.equal(dispatch(state,{id:1,type:'select',plot:p.id}).ok,true);}
 assert.deepEqual(deserialize(serialize(state)),state);
});
test('existing V6 farms receive only missing beds, retain every original value, archive exact bytes and upgrade once',()=>{
 for(const count of [3,8,17,24]){
  let state=createState(44);state.plots=state.plots.slice(0,count);state=dispatch(state,{id:1,type:'plant',plot:0,crop:'lettuce'}).state;state=dispatch(state,{id:2,type:'water',plot:0}).state;state=dispatch(state,{id:3,type:'nextDay'}).state;
  const raw=serialize(state),{map,db}=store([[SAVE_KEY,raw]]),session=new SaveSession(db,{expandGarden:true}),r=session.load();assert.equal(r.state.plots.length,24);assert.deepEqual({...r.state,plots:r.state.plots.slice(0,count)},state);
  assert.ok(r.state.plots.slice(count).every(p=>p.crop===null&&p.history.length===0));assert.equal(r.status,count<24?'saveMigrated':'saveResumed');if(count<24){assert.equal(map.get(ACTIVE_GARDEN_KEY),raw);assert.equal(map.get(BACKUP_KEY),raw);}
  const before=[...map];assert.equal(new SaveSession(db,{expandGarden:true}).load().status,'saveResumed');assert.deepEqual([...map],before);assert.deepEqual(deserialize(map.get(SAVE_KEY)),r.state);
 }
});
test('V0 through V5 player loads get 24 active beds after strict validation while originals remain recoverable',()=>{
 for(const name of ['v0-fresh','v1-mixed','v2-mixed','v3-mixed','v4-mixed','v5-mixed']){
  const raw=readFileSync(new URL('./fixtures/unified-world/'+name+'.json',import.meta.url),'utf8'),old=deserialize(raw),{map,db}=store([[SAVE_KEY,raw]]),r=new SaveSession(db,{expandGarden:true}).load();assert.equal(r.status,'saveMigrated');assert.deepEqual(r.state,activateGarden(old));assert.deepEqual({...r.state,plots:r.state.plots.slice(0,old.plots.length)},old);assert.equal(map.get(ACTIVE_GARDEN_KEY),raw);assert.equal(map.get(BACKUP_KEY),raw);
 }
});
test('active-bed archive collision and archive/backup/primary quota preserve original V6 and block writes',()=>{
 const state=createState();state.plots=state.plots.slice(0,3);const raw=serialize(state);
 for(const fail of ['collision',ACTIVE_GARDEN_KEY,BACKUP_KEY,SAVE_KEY]){
  const {map,db}=store([[SAVE_KEY,raw],...(fail==='collision'?[[ACTIVE_GARDEN_KEY,'other original']]:[])],fail),session=new SaveSession(db,{expandGarden:true}),r=session.load();assert.equal(r.status,'saveMigrationPreview');assert.equal(r.state.plots.length,24);assert.equal(map.get(SAVE_KEY),raw);assert.throws(()=>session.save(r.state));if(fail==='collision')assert.equal(map.get(ACTIVE_GARDEN_KEY),'other original');
 }
});
test('active-bed import and recovery preserve replaced bytes; invalid short saves and future versions cannot be normalized into validity',()=>{
 const state=createState();state.plots=state.plots.slice(0,8);const raw=serialize(state),{map,db}=store([[SAVE_KEY,'broken'],[BACKUP_KEY,raw]]),session=new SaveSession(db,{expandGarden:true}),r=session.load();assert.equal(r.status,'saveRecovered');assert.equal(r.state.plots.length,24);assert.equal(map.get(ACTIVE_GARDEN_KEY),raw);
 const invalid=createState();invalid.plots=invalid.plots.slice(0,2);assert.throws(()=>session.replace(invalid));const future=JSON.stringify({format:'MyFarmTwin',saveVersion:7,state:{}}),a=store([[SAVE_KEY,future],[BACKUP_KEY,raw]]),before=[...a.map];assert.equal(new SaveSession(a.db,{expandGarden:true}).load().status,'saveNewer');assert.deepEqual([...a.map],before);
});
