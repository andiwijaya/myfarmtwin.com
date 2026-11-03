export const CHICKEN_COMMANDS=Object.freeze(/** @type {const} */(['enterYard','feedHens','waterHens','cleanCoop','collectEggs','sellEggs','buyFeed','upgradeCoop','buyHen','upgradeFeeder','toggleFeeder','addShade','chickenOrder','chickenRecovery']));
/** @typedef {typeof CHICKEN_COMMANDS[number]} ChickenCommandType */
/** @param {string} type */
export const isChickenCommand=type=>CHICKEN_COMMANDS.some(name=>name===type);
/** @param {unknown} value */
export function validateChickenCommand(value){if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)return 'invalidChickenCommand';const c=/** @type {Record<string,unknown>} */(value);if(Object.keys(c).some(k=>!['id','type','eggLot'].includes(k))||!Number.isSafeInteger(c.id)||typeof c.type!=='string'||!isChickenCommand(c.type))return 'invalidChickenCommand';if(c.type==='sellEggs'){if(typeof c.eggLot!=='string'||!/^chicken\.lot\.[1-9][0-9]*$/.test(c.eggLot))return 'invalidChickenCommand';}else if(Object.hasOwn(c,'eggLot'))return 'invalidChickenCommand';return '';}
/** @param {import('./engine.js').State} state @param {ChickenCommandType} type @param {{eggLot?:string}} [extra] @returns {import('./engine.js').Command} */
export function chickenCommand(state,type,extra={}){if(!extra||typeof extra!=='object'||Object.keys(extra).some(k=>k!=='eggLot'))throw Error('invalidChickenCommand');const command={id:state.revision+1,type,...(Object.hasOwn(extra,'eggLot')?{eggLot:extra.eggLot}:{})};if(validateChickenCommand(command))throw Error('invalidChickenCommand');return command;}
