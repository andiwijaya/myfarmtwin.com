import {COW_LEDGER_TYPES} from './cow-config.js';
/** @param {import('./engine.js').State} state */
export function validateCowEconomy(state){const g=state.cow;if(!g)return;const lines=state.ledger.filter(l=>COW_LEDGER_TYPES.includes(l.type)||l.id.includes(':cow.')||l.id==='cow.starter.v1');if(!g.visited){if(lines.length)throw Error('Cow transactions before entry');return;}const grants=lines.filter(l=>l.type==='cow_starter_grant');if(grants.length!==1||grants[0].id!=='cow.starter.v1'||grants[0].tick!==g.enteredTick||grants[0].amount!==0)throw Error('Cow starter ledger mismatch');}
