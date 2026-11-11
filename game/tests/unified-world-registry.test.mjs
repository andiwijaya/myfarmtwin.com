import test from 'node:test';import assert from 'node:assert/strict';
import {WORLD_BOUNDS,ZONE_REGISTRY,FARM_ZONE_IDS,PATH_NODES,PATH_NETWORK,worldPoint,containsBounds,overlaps,footprint} from '../client/unified-world-registry.js';
import {readWorldSnapshot} from '../client/unified-world-model.js';import {createState} from '../client/engine.js';import {deserialize,serialize} from '../client/save-schema.js';import {readFile} from 'node:fs/promises';
test('five immutable zone footprints, central Market and reserved land stay inside one world without overlap',()=>{
 assert.deepEqual(FARM_ZONE_IDS,['field','chicken','goat','cow','fish']);const zones=Object.values(ZONE_REGISTRY);
 for(const z of zones){assert.ok(containsBounds(WORLD_BOUNDS,z.bounds));for(const p of [z.anchor,z.entry])assert.ok(containsBounds(z.bounds,{minX:p.x,maxX:p.x,minZ:p.z,maxZ:p.z}));for(const other of zones)if(z!==other)assert.equal(overlaps(z.bounds,other.bounds),false,z.id+' / '+other.id);assert.throws(()=>{z.anchor.x=100;},TypeError);assert.throws(()=>{z.bounds.minX=100;},TypeError);}
 assert.equal(ZONE_REGISTRY.market.anchor.x,(WORLD_BOUNDS.minX+WORLD_BOUNDS.maxX)/2);assert.equal(ZONE_REGISTRY.market.anchor.z,(WORLD_BOUNDS.minZ+WORLD_BOUNDS.maxZ)/2);assert.ok(!FARM_ZONE_IDS.includes('future'));
});
test('explicit path junctions connect every farm, Market and future entry with axis-aligned bounded segments',()=>{
 const graph=new Map(Object.keys(PATH_NODES).map(k=>[k,new Set()]));
 for(const edge of PATH_NETWORK){const a=PATH_NODES[edge.from],b=PATH_NODES[edge.to];assert.ok((a.x===b.x)!==(a.z===b.z),'Nonzero axis-aligned path');assert.ok(containsBounds(WORLD_BOUNDS,footprint({x:(a.x+b.x)/2,z:(a.z+b.z)/2,width:Math.max(Math.abs(a.x-b.x),edge.width),depth:Math.max(Math.abs(a.z-b.z),edge.width)})));graph.get(edge.from).add(edge.to);graph.get(edge.to).add(edge.from);}
 const reached=new Set(['plaza']),pending=['plaza'];while(pending.length)for(const n of graph.get(pending.pop()))if(!reached.has(n)){reached.add(n);pending.push(n);}assert.equal(reached.size,Object.keys(PATH_NODES).length);for(const id of [...FARM_ZONE_IDS,'market','future'])assert.deepEqual(PATH_NODES[id],ZONE_REGISTRY[id].entry);
});
test('registry transforms use centered garden bookmark and preserve chicken positions and reject invalid coordinates/footprints',()=>{
 assert.deepEqual(worldPoint('field',-2,0),{x:-7.5,z:5.3});assert.deepEqual(worldPoint('chicken',-1,-2),{x:-5,z:-8});assert.deepEqual(worldPoint('market'),{x:5,z:0});for(const args of [['unknown',0,0],['field',NaN,0],['field',0,Infinity]])assert.throws(()=>worldPoint(...args),RangeError);assert.throws(()=>footprint({x:0,z:0,width:0,depth:1}),RangeError);
});
test('snapshot objects fit their registered zone and registry use cannot mutate fresh or mature all-area saves',async()=>{
 for(const state of [createState(),deserialize(await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8'))]){const before=serialize(state),snapshot=readWorldSnapshot(state);for(const entity of snapshot.entities)assert.ok(containsBounds(ZONE_REGISTRY[entity.zone].bounds,footprint(entity)),entity.id);for(const id of Object.keys(ZONE_REGISTRY))worldPoint(id);assert.equal(serialize(state),before);}
});
