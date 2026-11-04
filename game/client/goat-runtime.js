import {createGoatKit} from './goat-state.js';
/** @typedef {(state:import('./engine.js').State,type:string,amount:number,id:string)=>void} Transaction */
/** The existing single logical hour owns age. Husbandry terms are added in their sequential gates. @param {import('./engine.js').State} state */
export function tickGoat(state){const g=state.goat;if(!g?.visited)return;for(const goat of g.herd)goat.ageHours++;}
/** Called only on dispatch's private clone; rejected commands never escape it. @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {Transaction} transact */
export function applyGoatCommand(state,command,events,transact){
 if(command.type==='enterGoat'){if(state.goat?.visited)return 'goatAlreadyEntered';state.goat=createGoatKit(state.tick);transact(state,'goat_starter_grant',0,'goat.starter.v1');events.push({type:'goatEntered'});return '';}
 const g=state.goat;if(!g?.visited)return 'goatNotVisited';
 if(command.type==='inspectGoat'){const goat=g.herd.find(h=>h.id===command.goatId);if(!goat)return 'goatMissing';g.stats.inspected++;if(goat.growth===1)g.mission.inspectedAdult=true;events.push({type:'goatInspected'});return '';}
 return 'goatActionUnavailable';
}
