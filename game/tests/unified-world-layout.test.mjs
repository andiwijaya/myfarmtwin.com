import test from 'node:test';import assert from 'node:assert/strict';
import {WORLD_PATHS,MARKET_PLAZA,WORLD_SIGNS,zoneLabel} from '../client/unified-world-layout.js';
import {WORLD_BOUNDS,PATH_NETWORK,PATH_NODES,ZONE_REGISTRY,containsBounds,footprint,overlaps} from '../client/unified-world-registry.js';
import {readWorldSnapshot} from '../client/unified-world-model.js';import {deserialize,serialize} from '../client/save-schema.js';import {readFile} from 'node:fs/promises';
test('all real path footprints contain their connected endpoints, fit terrain, and bridge the Market plaza',()=>{
 assert.equal(WORLD_PATHS.length,11);for(const path of WORLD_PATHS){const b=footprint(path),edge=PATH_NETWORK.find(e=>e.id===path.id);assert.ok(containsBounds(WORLD_BOUNDS,b));for(const p of [PATH_NODES[edge.from],PATH_NODES[edge.to]])assert.ok(containsBounds(b,{minX:p.x,maxX:p.x,minZ:p.z,maxZ:p.z}));assert.throws(()=>{path.x=0;},TypeError);}assert.ok(containsBounds(WORLD_BOUNDS,footprint(MARKET_PLAZA)));assert.ok(WORLD_PATHS.some(p=>overlaps(footprint(p),footprint(MARKET_PLAZA))));
});
test('paths/plaza avoid actual owned plot, pump, coop and Market body footprints without changing farm state',async()=>{
 const state=deserialize(await readFile(new URL('./fixtures/unified-world/v5-mixed.json',import.meta.url),'utf8')),before=serialize(state);for(const entity of readWorldSnapshot(state).entities.filter(e=>['plot','pump','coop','market'].includes(e.kind)))for(const p of [...WORLD_PATHS,MARKET_PLAZA])assert.equal(overlaps(footprint(entity),footprint(p)),false,entity.id+' / '+p.id);assert.equal(serialize(state),before);
});
test('seven bilingual camera-only sign definitions use registered entries and never masquerade as saved entities',()=>{
 assert.equal(WORLD_SIGNS.length,7);for(const sign of WORLD_SIGNS){assert.equal(sign.id,'zone.'+sign.zone);assert.equal(sign.x,ZONE_REGISTRY[sign.zone].entry.x);assert.equal(sign.z,ZONE_REGISTRY[sign.zone].entry.z);assert.ok(containsBounds(WORLD_BOUNDS,footprint(sign)));assert.ok(zoneLabel(sign.zone,'en'));assert.ok(zoneLabel(sign.zone,'id'));}assert.equal(zoneLabel('unknown','en'),'');
});
