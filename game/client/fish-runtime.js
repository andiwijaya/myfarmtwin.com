import {stepFishOxygen} from './fish-oxygen.js';
import {fishFeedCommand,digestFishFeed} from './fish-feed.js';
import {fishBiomass} from './fish-state.js';
import {FISH} from './fish-config.js';
import {createFishKit} from './fish-state.js';
import {CURRENT_SAVE_VERSION} from './config.js';
/** Fish uses the same revision/clone/commit boundary as every prior area. @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {import('./fish-feed.js').FishTransaction} transact @returns {string|undefined} */
export function applyFishCommand(state,command,events,transact){if(state.saveVersion!==CURRENT_SAVE_VERSION)return 'fishMigrationRequired';const g=state.fish;if(command.type==='enterFishPond'){if(g?.visited)return 'fishAlreadyEntered';state.fish=createFishKit(state.tick);events.push({type:'fishEntered'});return;}if(!g?.visited)return 'fishNotVisited';const pond=g.ponds.find(p=>p.id===command.fishPond);if(!pond)return 'fishPondMissing';if(command.type==='fish.feed'||command.type==='fish.buyFeed'){const error=fishFeedCommand(state,command,transact);if(error)return error;events.push({type:command.type==='fish.feed'?'fishFed':'fishFeedBought'});return;}if(command.type==='fish.inspect'){g.stats.inspections++;events.push({type:'fishInspected'});return;}return 'invalidFishCommand';}

/** Last old-area update is Cow; stable pond order follows it, without RNG draws. @param {import('./engine.js').State} state */
export function tickFish(state){const g=state.fish;if(!g?.visited)return;for(const pond of g.ponds){const eaten=digestFishFeed(pond,state.tick+1);stepFishOxygen(pond,state.tick,state.weather);pond.history.push({tick:state.tick+1,oxygenMg:pond.oxygenMg,tanMg:pond.tanMg,biomassG:fishBiomass(pond),feedUsedG:eaten,growthG:0});if(pond.history.length>FISH.historyMax)pond.history.shift();}}
