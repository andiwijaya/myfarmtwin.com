import {t,getLocale} from './locales.js';import {goatStage,goatCapacities} from './goat-state.js';import {goatWelfare} from './goat-welfare.js';import {goatSaleReason} from './goat-market-policy.js';import {renderGoatActions,clearGoatDisclosure} from './goat-panel-actions.js';
/** @type {Record<string,string>} */
const labels={shelter:'goatShelter',hay:'goatHayRack',water:'goatTrough',clean:'goatCleanStation',pasture:'goatBrowse',platform:'goatPlatform',contract:'goatContract'};
/** @param {unknown} id @param {import('./engine.js').State} state */
export const validGoatSelection=(id,state)=>typeof id==='string'&&(Object.hasOwn(labels,id)||!!state.goat?.herd.some(g=>g.id===id));
/** @param {import('./engine.js').State} state @param {string} selected @param {import('./goat-panel-actions.js').GoatSend} send */
export function renderGoatPanel(state,selected,send){
 const panel=/** @type {HTMLElement} */(document.querySelector('#goat-panel')),g=state.goat;panel.hidden=!validGoatSelection(selected,state)||!g?.visited;if(panel.hidden||!g){clearGoatDisclosure();return;}
 const active=panel.contains(document.activeElement)?document.activeElement?.getAttribute('data-goat-action'):null,heading=/** @type {HTMLElement} */(document.querySelector('#goat-heading')),copy=/** @type {HTMLElement} */(document.querySelector('#goat-selection-copy')),values=/** @type {HTMLElement} */(document.querySelector('#goat-status')),goat=g.herd.find(h=>h.id===selected),stage=goat?goatStage(goat):'',welfare=goatWelfare(g,state.weather),cap=goatCapacities(g);heading.tabIndex=-1;
 heading.textContent=t(goat?(stage==='marketReady'?(!goatSaleReason(state,selected)?'goatReadyAdult':'goatAdult'):stage==='growing'?'goatGrowing':'goatWeaned'):labels[selected]);copy.textContent=welfare.reasons.map(t).join(' ');values.replaceChildren();
 const number=(/** @type {number} */n)=>new Intl.NumberFormat(getLocale(),{maximumFractionDigits:2}).format(n),add=(/** @type {string} */key,/** @type {string} */value)=>{const item=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=t(key);dd.textContent=value;item.append(dt,dd);values.append(item);};
 if(goat){add('goatGrowth',Math.floor(goat.growth*100)+'%');add('goatBodyCondition',Math.round(goat.condition*100)+'%');add('goatDaysAtRanch',number(goat.ageHours/24)+' '+t('gameDays'));}
 else if(selected==='hay'){add('goatStoredHay',number(g.hayStockG/1000)+' kg');add('goatRackHay',number(g.feederG/1000)+' / '+number(cap.feederG/1000)+' kg');}
 else if(selected==='water'){add('goatTankShared',number(state.water)+' L');add('goatDrinkingWater',number(g.troughMl/1000)+' / '+number(cap.troughMl/1000)+' L');}
 else if(selected==='pasture'){add('goatPastureBiomass',number((g.paddocks[g.activePaddock]?.biomassG||0)/1000)+' kg');}
 else{add('goatHerdCount',g.herd.length+' / '+cap.herd);add('goatCleanliness',Math.round(g.shelter?.cleanliness||0)+'%');}
 add('goatComfort',Math.round(welfare.score*100)+'%');renderGoatActions(state,selected,/** @type {HTMLElement} */(document.querySelector('#goat-actions')),send);
 if(active){const next=/** @type {HTMLButtonElement|null} */(panel.querySelector('[data-goat-action="'+active+'"]'));if(next&&!next.disabled)next.focus({preventScroll:true});else heading.focus({preventScroll:true});}
}
