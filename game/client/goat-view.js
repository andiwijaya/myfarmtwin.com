import {t} from './locales.js';
/** Presentation only: entering this staged scene does not grant or save animals. */
export function renderGoatWorld(){
 const host=/** @type {HTMLElement} */(document.querySelector('#world'));
 host.replaceChildren();const note=document.createElement('p');note.className='world-placeholder';note.textContent=t('goatMeet');host.append(note);
}
