import test from 'node:test';import assert from 'node:assert/strict';
import {createState,dispatch} from '../client/engine.js';import {serialize} from '../client/save-schema.js';
import {readWorldSnapshot,resolveWorldSelection} from '../client/unified-world-model.js';
test('world selection accepts only current stable entities and does not dispatch entry or selection',()=>{
 const state=createState(),before=serialize(state),snapshot=readWorldSnapshot(state);
 assert.deepEqual(resolveWorldSelection(snapshot,'field.plot.0'),{entityId:'field.plot.0',domainId:0,kind:'plot'});
 assert.equal(resolveWorldSelection(snapshot,'chicken.available').kind,'startChicken');
 for(const id of ['chicken.coop','chicken.hen.fake','__proto__','field.plot.99',1,null,{}])assert.equal(resolveWorldSelection(snapshot,id),null);
 assert.equal(serialize(state),before);assert.equal(state.chicken.visited,false);assert.equal(state.chicken.grants.length,0);
});
test('hens retain individual domain identity while routing existing coop-wide actions',()=>{
 const state=dispatch(createState(),{id:1,type:'enterYard'}).state,snapshot=readWorldSnapshot(state),before=serialize(state);
 const hen=snapshot.entities.find(e=>e.kind==='hen'),target=resolveWorldSelection(snapshot,hen.id);assert.equal(target.animalId,state.chicken.hens[0].id);assert.equal(target.domainId,'coop');assert.equal(target.entityId,hen.id);
 assert.equal(resolveWorldSelection(snapshot,'chicken.feeder').domainId,'feeder');assert.equal(resolveWorldSelection(snapshot,'chicken.available'),null);
 assert.equal(resolveWorldSelection(snapshot,'market.central').kind,'market');assert.equal(serialize(state),before);assert.ok(Object.isFrozen(target));
});
