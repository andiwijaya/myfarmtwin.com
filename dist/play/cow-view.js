import {t} from './locales.js';
/** Presentation only; area entry itself cannot create resources or alter the farm. */
export function renderCowWorld(){const host=/** @type {HTMLElement} */(document.querySelector('#world'));host.replaceChildren();const box=document.createElement('div');box.className='cow-welcome';const heading=document.createElement('h2'),copy=document.createElement('p');heading.textContent=t('cowWelcome');copy.textContent=t('cowWelcomeDetail');box.append(heading,copy);host.append(box);}
