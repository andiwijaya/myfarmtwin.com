import test from 'node:test';import assert from 'node:assert/strict';
import {FEATURES} from '../client/features.js';import {createState,dispatch} from '../client/engine.js';import {fishPondPreview} from '../client/fish-scene.js';
test('Fish gate remains OFF; preview cannot grant, tick or consume RNG',()=>{assert.equal(FEATURES.fish,false);const s=createState(),raw=JSON.stringify(s);for(let n=0;n<8;n++)fishPondPreview(n%4);assert.equal(JSON.stringify(s),raw);const r=dispatch(s,{id:1,type:'enterFishPond'});assert.equal(r.ok,false);assert.equal(JSON.stringify(s),raw);});
