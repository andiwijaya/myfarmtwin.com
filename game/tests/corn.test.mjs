import test from 'node:test';import assert from 'node:assert/strict';
import {createState,dispatch,saleValue,recoveryAvailable} from '../client/engine.js';
import {CROPS,cropStageKey} from '../client/config.js';
import {serialize,deserialize} from '../client/save-schema.js';
import {cropParts,cropSway} from '../client/unified-world-crops.js';
function send(s,type,extra={}){const r=dispatch(s,{id:s.revision+1,type,...extra});assert.ok(r.ok,type+': '+r.error);return r.state;}
export function growCorn(){
 let s=createState(),stages=new Set();s=send(s,'buySeed',{crop:'corn'});s=send(s,'plant',{plot:0,crop:'corn'});stages.add(0);s=send(s,'pause');
 for(let hour=0;s.plots[0].crop.progress<1;hour++){
  assert.ok(hour<700,'Bounded corn maturity');const p=s.plots[0];
  if(p.soilWaterMm<22&&p.lastWaterTick!==s.tick){if(s.water<25)s=send(s,'refill');s=send(s,'water',{plot:0});}
  s=send(s,'tick');stages.add(s.plots[0].crop.stage);
 }
 return {state:s,stages:[...stages]};
}
test('corn consumes paid seeds, observes five fixed-time stages, harvests, sells and replants with exact saves',()=>{
 const {state,stages}=growCorn();assert.deepEqual(stages,[0,1,2,3,4]);assert.equal(state.plots[0].crop.progress,1);
 let s=deserialize(serialize(state));assert.equal(s.seeds.corn,0);assert.equal(cropStageKey('corn',4),'readyHarvest');
 const prior=serialize(s);s=send(s,'harvest',{plot:0});assert.equal(s.plots[0].crop,null);assert.equal(s.inventory[0].type,'corn');assert.ok(s.inventory[0].quantity>=1&&s.inventory[0].quantity<=CROPS.corn.yield);
 assert.equal(serialize(state),prior);const lot=s.inventory[0],coins=s.coins,ledger=s.ledger.length;s=send(s,'sell',{lot:lot.id});const added=s.ledger.slice(ledger);assert.equal(added.find(l=>l.type==='sale_revenue').amount,saleValue(lot));assert.equal(s.coins,coins+saleValue(lot)+added.filter(l=>l.type==='mission_reward').reduce((n,l)=>n+l.amount,0));assert.equal(s.inventory.length,0);
 s=send(s,'buySeed',{crop:'corn'});s=send(s,'plant',{plot:0,crop:'corn'});assert.equal(s.plots[0].crop.progress,0);assert.deepEqual(deserialize(serialize(s)),s);
});
test('corn cannot harvest early, overwrite crops, mint seeds or allow recovery with corn stock',()=>{
 let s=send(createState(),'buySeed',{crop:'corn'}),prior=serialize(s);assert.equal(dispatch(s,{id:s.revision+1,type:'harvest',plot:0}).ok,false);assert.equal(serialize(s),prior);
 s=send(s,'plant',{plot:0,crop:'corn'});assert.equal(dispatch(s,{id:s.revision+1,type:'harvest',plot:0}).error,'notReady');assert.equal(dispatch(s,{id:s.revision+1,type:'plant',plot:0,crop:'corn'}).error,'occupied');
 const poor=createState();poor.coins=0;poor.seeds={lettuce:0,tomato:0,corn:1};assert.equal(recoveryAvailable(poor),false);
});
test('corn models have real stem/leaves/husk/cobs, five distinct heights, bounded footprint and 2–3 unit maturity',()=>{
 const heights=[];
 for(let stage=0;stage<5;stage++){
  const parts=cropParts({type:'corn',stage,progress:stage/4,quality:1});assert.ok(parts.length>0&&parts.length<=40);assert.ok(parts.every(p=>p.w>0&&p.h>0&&p.d>0));
  heights.push(Math.max(...parts.map(p=>p.y+p.h/2)));
  for(const p of parts){assert.ok(Math.abs(p.x)+Math.max(p.w,p.d)/2<.5,p.feature);assert.ok(Math.abs(p.z)+Math.min(p.w,p.d)/2<.46,p.feature);}
  if(stage>0)assert.ok(parts.some(p=>p.feature==='corn-stem')&&parts.some(p=>p.feature==='corn-leaf'));
  assert.equal(parts.some(p=>p.feature==='corn-cob'),stage===4);
 }
 for(let i=1;i<heights.length;i++)assert.ok(heights[i]>heights[i-1]);assert.ok(heights[4]>=2&&heights[4]<=3);
 assert.equal(cropSway(1200,4,true),0);assert.notEqual(cropSway(1200,4,false),0);
});
