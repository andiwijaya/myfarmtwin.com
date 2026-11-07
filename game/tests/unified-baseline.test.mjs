import test from 'node:test';
import assert from 'node:assert/strict';
import {verify} from '../../tools/unified-save-baseline.mjs';
test('unified world baseline retains exact V0–V5 inputs and every migrated farm field',async()=>{
 const report=await verify();assert.equal(report.fixtures,7);assert.deepEqual(report.versions,[0,1,2,3,4,5]);assert.equal(report.saveVersion,5);
});
