/** Headless Chicken command boundary; care mechanics are added one feature at a time. */
/** @param {import('./engine.js').State} state @param {import('./engine.js').Command} command @param {import('./engine.js').DomainEvent[]} events */
export function applyChickenCommand(state,command,events){if(!state.chicken?.visited||!state.chicken.coop)return 'chickenNotReady';if(command.type==='enterYard'){events.push({type:'chickenEntered'});return '';}return 'chickenNotReady';}
