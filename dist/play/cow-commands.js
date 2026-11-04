export const COW_COMMANDS=Object.freeze(/** @type {const} */(['enterCow']));
/** @typedef {typeof COW_COMMANDS[number]} CowCommandType */
/** @param {string} type */
export const isCowCommand=type=>COW_COMMANDS.some(k=>k===type);
/** @param {unknown} value */
export function validateCowCommand(value){if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)return 'invalidCowCommand';const c=/** @type {Record<string,unknown>} */(value);if(Reflect.ownKeys(c).length!==2||Object.keys(c).length!==2||Object.values(Object.getOwnPropertyDescriptors(c)).some(d=>!Object.hasOwn(d,'value'))||!Number.isSafeInteger(c.id)||c.type!=='enterCow')return 'invalidCowCommand';return '';}
