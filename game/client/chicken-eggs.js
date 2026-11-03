import {CHICKEN,COOP_LEVELS,EGG_PRICES} from './chicken-config.js';import {chickenWelfare} from './chicken-welfare.js';
/** @param {import('./chicken-state.js').EggLot} lot */
export const eggSaleValue=lot=>lot.quantity*EGG_PRICES[lot.grade];
/** Counter-based deterministic draw; independent of the crop/weather RNG. @param {number} seed @param {number} day @param {string} henId */
export function eggDraw(seed,day,henId){let h=(seed^Math.imul(day,0x9e3779b1)^Math.imul(Number(henId.split('.').at(-1)),0x85ebca6b))>>>0;h^=h>>>16;h=Math.imul(h,0x85ebca6b);h^=h>>>13;h=Math.imul(h,0xc2b2ae35);h^=h>>>16;return(h>>>0)/4294967296;}
/** @param {import('./engine.js').State} state */
export function eggOutlook(state){const w=chickenWelfare(state);return {...w,probability:CHICKEN.layChance*w.score*Math.min(w.feed,w.water),grade:/** @type {import('./chicken-state.js').Grade} */(w.score>=.85&&w.hygiene>=.75&&Math.min(w.feed,w.water)>=.85?'A':w.score>=.6&&w.hygiene>=.45?'B':'C')};}
/** Resolve a day once per adult hen, including failed/full-nest attempts. @param {import('./engine.js').State} state @param {number} day */
export function finishChickenDay(state,day){
 const c=state.chicken,q=c?.coop;if(!c?.visited||!q||(c.history.at(-1)?.day||0)>=day)return;const w=eggOutlook(state);let laid=0;
 for(const h of c.hens){if(h.lastLayDay>=day)continue;h.lastLayDay=day;if(q.pending.length>=COOP_LEVELS[q.level].nests||eggDraw(state.seed,day,h.id)>=w.probability)continue;q.pending.push({id:'chicken.egg.'+day+'.'+h.id.split('.').at(-1),henId:h.id,day,grade:w.grade});laid++;c.stats.laid++;}
 c.history.push({day,feedUsedG:q.dayFeedUsedG,waterUsedL:q.dayWaterUsedL,comfort:w.score,laid,pending:q.pending.length});if(c.history.length>CHICKEN.historyMax)c.history.shift();if(q.healthyHours>=18)c.stats.healthyDays++;q.healthyHours=0;q.dayFeedUsedG=0;q.dayWaterUsedL=0;
}
