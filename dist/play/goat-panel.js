import {t} from './locales.js';
import {renderGoatActions} from './goat-panel-actions.js';
/** @type {Record<string,string>} */
const labels={shelter:'goatShelter',hay:'goatHayRack',water:'goatTrough',clean:'goatCleanStation',pasture:'goatBrowse',platform:'goatPlatform',contract:'goatContract','goat.starter.adult':'goatReadyAdult','goat.starter.young.1':'goatWeaned','goat.starter.young.2':'goatWeaned'};
/** @param {unknown} id */
export const validGoatSelection=id=>typeof id==='string'&&Object.hasOwn(labels,id);
/** @param {string} selected */
export function renderGoatPanel(selected){
 const panel=/** @type {HTMLElement} */(document.querySelector('#goat-panel'));panel.hidden=!validGoatSelection(selected);if(panel.hidden)return;
 const heading=/** @type {HTMLElement} */(document.querySelector('#goat-heading')),copy=/** @type {HTMLElement} */(document.querySelector('#goat-selection-copy'));heading.textContent=t(labels[selected]);copy.textContent=t('goatInspectHint');renderGoatActions(selected,/** @type {HTMLElement} */(document.querySelector('#goat-actions')));
}
