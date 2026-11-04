import {GOAT} from './goat-config.js';
/** Actual current rate; shared by simulation and the optional explanation. @param {import('./goat-state.js').GoatState} g @param {import('./goat-state.js').Goat} goat */
export const goatGrowthRate=(g,goat)=>goat.growth>=1?0:g.nutrition*g.hydration*(.65+.35*goat.condition)/GOAT.growthHours;
/** Compressed game maturation, not real goat biology. Only the existing hour invokes this. @param {import('./goat-state.js').GoatState} g */
export function growGoats(g){for(const goat of g.herd)if(goat.growth<1){goat.growth=Math.min(1,goat.growth+goatGrowthRate(g,goat));}}
