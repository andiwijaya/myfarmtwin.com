import test from 'node:test';import assert from 'node:assert/strict';
import {createState,dispatch} from '../client/engine.js';
export function command(s,type,extra={}){return dispatch(s,{id:s.revision+1,type,...extra});}
test('same seed and commands replay identical fixed ticks/weather without mutating input',()=>{
 const initial=createState();let a=initial,b=createState();for(let i=0;i<20;i++){a=command(a,'nextDay').state;b=command(b,'nextDay').state;}assert.deepEqual(a,b);assert.equal(a.tick,480);assert.equal(initial.tick,0);assert.notEqual(a.rng,initial.rng);
});
test('pause blocks clock ticks; explicit Next Day remains a deliberate 24-hour step',()=>{let s=createState();assert.equal(command(s,'tick').ok,false);assert.equal(command(s,'nextDay').state.tick,24);s=command(s,'pause').state;assert.equal(command(s,'tick').state.tick,1);assert.equal(command(s,'speed').state.speed,2);});
test('sequential command ids reject stale/replayed commands forever',()=>{const s=createState(),c={id:1,type:'nextDay'};const once=dispatch(s,c).state;assert.equal(dispatch(once,c).ok,false);assert.equal(dispatch(s,{id:0,type:'nextDay'}).ok,false);assert.equal(dispatch(s,{id:1,type:'invalid'}).ok,false);assert.equal(once.tick,24);});
