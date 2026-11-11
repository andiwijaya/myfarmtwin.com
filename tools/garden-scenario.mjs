import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runCowEconomy} from './cow-economy-policy.mjs';
import {dispatch} from '../game/client/engine.js';
import {deserialize,serialize} from '../game/client/save-schema.js';
import {GARDEN_SLOTS} from '../game/client/garden-layout.js';
/** Paid synthetic dense garden, replayable through native commands. No edited
 * wallet, crops, progress, resources, animals, RNG, clock or mission flags. */
export async function makeGardenScenario({mature=true,cornOnly=false}={}){
 const source=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),earned=runCowEconomy({days:45,mode:'mixed',source:deserialize(source),progress:false});
 let state=earned.state;const commands=[];
 const send=(type,extra={})=>{const c={id:state.revision+1,type,...extra},r=dispatch(state,c);assert.ok(r.ok,type+': '+r.error);state=r.state;commands.push(c);};
 if(!state.paused)send('pause');if(!state.pump.built)send('buyPump');if(state.pump.on)send('togglePump');
 for(const p of [...state.plots])if(p.crop){assert.equal(p.crop.progress,1);send('harvest',{plot:p.id});}
 for(const lot of [...state.inventory])send('sell',{lot:lot.id});
 while(state.plots.length<24)send('expand');
 const empty=serialize(state);
 for(const p of [...state.plots]){const row=GARDEN_SLOTS[p.id].row,crop=cornOnly?'corn':row===0?'corn':row===1?'tomato':row===2?'lettuce':['lettuce','tomato','corn'][p.id%3];if(!state.seeds[crop])send('buySeed',{crop});send('plant',{plot:p.id,crop});}
 const planted=serialize(state);
 const care=()=>{for(const p of [...state.plots])if(p.crop&&p.crop.progress<1&&p.soilWaterMm<22&&p.lastWaterTick!==state.tick){if(state.water<25)send('refill');send('water',{plot:p.id});}};
 if(mature){send('pause');let hours=0;while(state.plots.some(p=>p.crop?.progress<1)){assert.ok(hours++<700,'Bounded dense growth');care();send('tick');}send('pause');}
 return{state,raw:serialize(state),empty,planted,commands,funding:{nativeDays:45,nativeCommandCount:earned.commands,coins:earned.coins}};
}
