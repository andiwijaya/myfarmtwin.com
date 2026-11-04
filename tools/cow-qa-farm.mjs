import {runCowEconomy} from './cow-economy-policy.mjs';
import {dispatch} from '../game/client/engine.js';
import {serialize} from '../game/client/save-schema.js';
import {cowSupply} from '../game/client/cow-state.js';
import {cowMilkingReason} from '../game/client/cow-milking.js';
import assert from 'node:assert/strict';
/** Earned, isolated test farm; never reads a user profile or invents resources. */
export function cowQAFarm(){let s=runCowEconomy({days:30,mode:'mixed',progress:true}).state;function act(type,extra={}){const r=dispatch(s,{id:s.revision+1,type,...extra});assert.ok(r.ok,type+':'+r.error);s=r.state;}
 if(!s.paused)act('pause');for(const type of ['buyCowCooler','buyCowSanitation'])act(type);function fill(){while(s.cow.feedStoreG+cowSupply(s.cow.feedTrough)+s.cow.starterRation.feedG<24000)act('buyCowFeed');if(cowSupply(s.cow.feedTrough)<24000)act('feedCows');while(Math.floor(s.water*1000)+cowSupply(s.cow.waterTrough)+s.cow.starterRation.waterMl<150000)act('refill');if(cowSupply(s.cow.waterTrough)<150000)act('waterCows');}fill();act('nextDay');fill();
 for(const type of ['cleanCowBarn','cleanCowStand','cleanCowCan'])act(type);for(const cow of [...s.cow.cows])if(!cowMilkingReason(s,cow.id,'cooler'))act('milkCow',{cowId:cow.id,cowStorage:'cooler'});act('toggleCowCooler');
 assert.equal(s.cow.cows.length,3);assert.ok(s.cow.lots.length>0);serialize(s);return s;}
