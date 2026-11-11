import test from 'node:test';import assert from 'node:assert/strict';import {createState} from '../client/engine.js';import {command} from './helpers.mjs';import {assertInvariants} from '../client/invariants.js';
test('paid expansion preserves old cells, charges scaling cost, caps at 24 and survives strict save roundtrip',()=>{let s=createState();assert.equal(command(s,'expand').ok,false);s.mission.step=7;s.coins=10120;s.ledger=[{id:'fixture',type:'mission_reward',amount:10000,balance:10120,tick:0}];for(let i=0;i<21;i++){const r=command(s,'expand');assert.equal(r.ok,true);s=r.state;}assert.equal(s.plots.length,24);assert.equal(s.coins,6025);assert.equal(command(s,'expand').error,'farmFull');s=deserialize(serialize(s));assertInvariants(s);assert.deepEqual(s.plots.slice(0,8).map(p=>[p.x,p.y]),[[2,3],[3,3],[4,3],[2,4],[3,4],[4,4],[2,5],[3,5]]);for(const p of s.plots)assert.equal(command(s,'plant',{plot:p.id,crop:'lettuce'}).ok,true);});

import {serialize,deserialize} from '../client/save-schema.js';
import {GARDEN_SLOTS,GARDEN_PUMP,gardenPathParts} from '../client/garden-layout.js';
import {ZONE_REGISTRY,footprint,containsBounds,overlaps} from '../client/unified-world-registry.js';
import {WORLD_PATHS} from '../client/unified-world-layout.js';
test('24 beds and pump stay inside field, avoid roads, row paths and one another',()=>{
 assert.equal(GARDEN_SLOTS.length,24);const beds=GARDEN_SLOTS.map(p=>footprint({...p,width:.92,depth:.92})),pump=footprint({...GARDEN_PUMP,width:.8,depth:.8});
 for(const [i,bed]of beds.entries()){assert.ok(containsBounds(ZONE_REGISTRY.field.bounds,bed));assert.equal(overlaps(bed,pump),false);for(const other of beds.slice(i+1))assert.equal(overlaps(bed,other),false);for(const path of [...WORLD_PATHS,...gardenPathParts()])assert.equal(overlaps(bed,footprint(path)),false);}
 assert.ok(containsBounds(ZONE_REGISTRY.field.bounds,pump));
});
