import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,dispatch} from '../client/engine.js';
import {serialize,deserialize} from '../client/save-schema.js';
import {readWorldSnapshot} from '../client/unified-world-model.js';

function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
test('unvisited Chicken is an honest available footprint, without grants or imaginary hens',()=>{
 const state=freeze(createState()),before=serialize(state),snapshot=readWorldSnapshot(state);
 assert.equal(snapshot.chickenStarted,false);assert.equal(snapshot.entities.filter(e=>e.kind==='hen'||e.kind==='coop').length,0);
 assert.equal(snapshot.entities.filter(e=>e.kind==='available').length,1);assert.equal(serialize(state),before);
 assert.equal(snapshot.entities.filter(e=>e.kind==='market').length,1);
});
test('snapshot detaches crops, preserves stable domain IDs and never consumes time/RNG/ledger',()=>{
 const planted=dispatch(createState(),{id:1,type:'plant',plot:0,crop:'lettuce'}).state;
 const started=dispatch(planted,{id:2,type:'enterYard'}).state,state=freeze(started),before=serialize(state),snapshot=readWorldSnapshot(state);
 const plot=snapshot.entities.find(e=>e.id==='field.plot.0');assert.equal(plot.domainId,0);assert.notEqual(plot.crop,state.plots[0].crop);
 assert.throws(()=>{plot.crop.stage=3;},TypeError);
 const hens=snapshot.entities.filter(e=>e.kind==='hen');assert.deepEqual(hens.map(e=>e.domainId),state.chicken.hens.map(h=>h.id));
 assert.equal(new Set(snapshot.entities.map(e=>e.id)).size,snapshot.entities.length);
 for(let n=0;n<100;n++)assert.deepEqual(readWorldSnapshot(state),snapshot);assert.equal(serialize(state),before);
});
test('all frozen V0–V5 fixtures render without mutating original or migrated save semantics',()=>{
 const base=new URL('./fixtures/unified-world/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',base),'utf8'));
 for(const file of manifest.fixtures){const raw=readFileSync(new URL(file.name,base),'utf8'),state=freeze(deserialize(raw)),before=serialize(state),snapshot=readWorldSnapshot(state);
  assert.equal(snapshot.revision,state.revision);assert.equal(snapshot.tick,state.tick);assert.equal(snapshot.entities.filter(e=>e.kind==='plot').length,state.plots.length);
  assert.equal(serialize(state),before);assert.equal(readFileSync(new URL(file.name,base),'utf8'),raw);
 }
});
