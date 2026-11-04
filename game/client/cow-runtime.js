import {createCowKit} from './cow-state.js';
/** @typedef {(state:import('./engine.js').State,type:string,amount:number,id:string)=>void} CowTransaction */
/** @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events @param {CowTransaction} transact */
export function applyCowCommand(state,command,events,transact){if(command.type==='enterCow'){if(state.cow?.visited)return 'cowAlreadyEntered';state.cow=createCowKit(state.tick);transact(state,'cow_starter_grant',0,'cow.starter.v1');events.push({type:'cowEntered'});return '';}return 'invalidCowCommand';}
