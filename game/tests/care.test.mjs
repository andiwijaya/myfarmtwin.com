import test from 'node:test';import assert from 'node:assert/strict';import {condition} from '../client/care.js';
test('care explanations track actual moisture thresholds including exact boundaries',()=>{for(const [mm,label]of [[0,'dry'],[9.99,'dry'],[10,'thirsty'],[20,'good'],[45,'good'],[46,'wet'],[50,'wet']])assert.equal(condition({soilWaterMm:mm,soilCapacityMm:50}),label);});
