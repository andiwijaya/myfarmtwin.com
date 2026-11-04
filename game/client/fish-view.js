import {t} from './locales.js';
/** Presentation-only area scaffold; no clock, RNG, grants or persistence. @param {import('./engine.js').State} _state */
export function renderFishWorld(_state){const host=/** @type {HTMLElement} */(document.querySelector('#world'));host.replaceChildren();const box=document.createElement('div');box.className='fish-preview-copy';const title=document.createElement('h2');title.textContent=t('fishPreview');const copy=document.createElement('p');copy.textContent=t('fishPreviewCopy');box.append(title,copy);host.append(box);}
