import {t} from './locales.js';
/** Presentation entry; the next increment adds the original yard SVG. */
export function renderChickenWorld(){const host=/** @type {HTMLElement} */(document.querySelector('#world'));host.replaceChildren();const text=document.createElement('p');text.className='world-placeholder';text.textContent=t('chickenArea');host.append(text);}
