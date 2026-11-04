import {GOAT} from './goat-config.js';
/** Compressed game maturation, not real goat biology. Only the existing hour invokes this. @param {import('./goat-state.js').GoatState} g */
export function growGoats(g){for(const goat of g.herd)if(goat.growth<1){const care=g.nutrition*g.hydration*(.65+.35*goat.condition);goat.growth=Math.min(1,goat.growth+care/GOAT.growthHours);}}
