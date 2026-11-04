import {createState} from '../game/client/engine.js';
import {serialize,deserialize} from '../game/client/save-schema.js';
import {cowQAFarm} from './cow-qa-farm.mjs';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const dir='game/tests/fixtures/fish-v4';mkdirSync(dir+'/rollback',{recursive:true});
const manifest={sourceCommit:'c3de361699b5dda4a131cf829f7d2a8ccff0b52f',saveVersion:4,synthetic:true,containsUserData:false,fixtures:[],readers:[]};
for(const [name,state]of [['fresh',createState()],['mixed',cowQAFarm()]]){const raw=serialize(state);assert.equal(state.saveVersion,4);assert.deepEqual(deserialize(raw),state);writeFileSync(`${dir}/${name}.json`,raw+'\n');manifest.fixtures.push({name:name+'.json',sha256:createHash('sha256').update(raw+'\n').digest('hex'),bytes:Buffer.byteLength(raw+'\n'),tick:state.tick,revision:state.revision,coins:state.coins,cows:state.cow.cows.length,cowSales:state.cow.stats.saleCount});}
for(const name of ['config.js','save-schema.js','storage.js']){const raw=readFileSync('game/client/'+name);writeFileSync(`${dir}/rollback/${name}.txt`,raw);manifest.readers.push({name,sha256:createHash('sha256').update(raw).digest('hex')});}
writeFileSync(dir+'/manifest.json',JSON.stringify(manifest,null,2)+'\n');console.log(JSON.stringify(manifest));
