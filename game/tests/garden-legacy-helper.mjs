import assert from 'node:assert/strict';
/** Explicit additive V6 projection for frozen V0–V5 oracles. Assert the new
 * seed entry is zero before removing it; every original subtree stays exact. */
export function legacyGarden(state){const copy=structuredClone(state);if(Object.hasOwn(copy.seeds,'corn')){assert.equal(copy.seeds.corn,0,'Legacy comparison cannot hide earned corn');delete copy.seeds.corn;}return copy;}
