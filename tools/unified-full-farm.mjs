import {deserialize,serialize} from '../game/client/save-schema.js';import {runCowEconomy} from './cow-economy-policy.mjs';
import {makeOwnedGoatFarm} from './unified-goat-farm.mjs';import {makeOwnedChickenFarm} from './unified-chicken-farm.mjs';import {makeOwnedFishFarm} from './unified-fish-farm.mjs';import {makeOwnedCropFarm} from './unified-crop-farm.mjs';
/** Earn every upgrade through 14 native mixed-farm days plus replayable paid commands.
 * No zero-wallet/cash-sweep strategy, resource edits or invented animals/stages are used.
 */
export function makeFullWorldFarm(raw){const earned=runCowEconomy({days:14,mode:'mixed',source:deserialize(raw),progress:false});let current=serialize(earned.state);const commands=[];for(const make of [makeOwnedGoatFarm,makeOwnedChickenFarm,makeOwnedFishFarm,makeOwnedCropFarm]){const farm=make(current);current=farm.raw;commands.push(...farm.commands);}return{state:deserialize(current),raw:current,commands,funding:{recipe:'runCowEconomy',days:14,mode:'mixed',strategy:'paid',source:'frozen v5-mixed.json',commands:earned.commands}};}
