import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {createState} from '../game/client/engine.js';
import {serialize,deserialize,SAVE_VERSION} from '../game/client/save-schema.js';
import {fishQAFarm} from './fish-qa-farm.mjs';

const root=new URL('../game/tests/fixtures/unified-world/',import.meta.url);
export const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
/** Full semantic projection, including all five systems and transaction/mission history. */
export function farmSemantics(state){const copy=structuredClone(state);delete copy.saveVersion;return copy;}

export async function freeze(){
 await mkdir(root,{recursive:true});
 const legacy=createState();legacy.saveVersion=0;
 for(const key of ['chicken','goat','cow','fish'])delete legacy[key];
 legacy.plots.forEach(p=>delete p.history);
 const inputs=[['v0-fresh.json',JSON.stringify({format:'MyFarmTwin',saveVersion:0,state:legacy})],
  ...await Promise.all([['v1-mixed.json','chicken-v1/mixed.json'],['v2-mixed.json','goat-v2/mixed.json'],['v3-mixed.json','cow-v3/mixed.json'],['v4-mixed.json','fish-v4/mixed.json']].map(async([name,path])=>[name,await readFile(new URL('../game/tests/fixtures/'+path,import.meta.url),'utf8')])),
  ['v5-fresh.json',serialize(createState())],['v5-mixed.json',serialize(fishQAFarm())]];
 const manifest={sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),saveVersion:SAVE_VERSION,synthetic:true,containsUserData:false,fixtures:[]};
 for(const [name,raw] of inputs){
  const state=deserialize(raw),expected=serialize(state);
  await writeFile(new URL(name,root),raw);
  await writeFile(new URL(name+'.expected',root),expected);
  manifest.fixtures.push({name,bytes:Buffer.byteLength(raw),sha256:digest(raw),expectedSha256:digest(expected),sourceVersion:JSON.parse(raw).saveVersion,tick:state.tick,revision:state.revision,coins:state.coins,ledgerEntries:state.ledger.length});
 }
 await writeFile(new URL('manifest.json',root),JSON.stringify(manifest,null,2)+'\n');
 return verify();
}

export async function verify(){
 const manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
 assert.equal(manifest.synthetic,true);assert.equal(manifest.containsUserData,false);
 for(const file of manifest.fixtures){
  const raw=await readFile(new URL(file.name,root)),expected=await readFile(new URL(file.name+'.expected',root),'utf8');
  assert.equal(digest(raw),file.sha256,file.name+' input bytes');
  assert.equal(raw.length,file.bytes,file.name+' size');assert.equal(digest(expected),file.expectedSha256,file.name+' expected bytes');
  const state=deserialize(raw.toString()),prior=JSON.parse(expected).state,projected=structuredClone(state);projected.saveVersion=prior.saveVersion;assert.equal(projected.seeds.corn,0);delete projected.seeds.corn;
  assert.deepEqual(projected,prior,file.name+' original fields changed');
  assert.equal(serialize(state),serialize(deserialize(expected)),file.name+' migration changed');
  assert.deepEqual(farmSemantics(deserialize(serialize(state))),farmSemantics(state));
 }
 return {fixtures:manifest.fixtures.length,versions:[...new Set(manifest.fixtures.map(f=>f.sourceVersion))],saveVersion:SAVE_VERSION,exact:true,synthetic:true};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)console.log(JSON.stringify(await(process.argv.includes('--freeze')?freeze():verify())));
