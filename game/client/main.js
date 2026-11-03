import {getLocale,setLocale,translate} from './locales.js';
import {renderWorld} from './world.js';
const language=/** @type {HTMLSelectElement} */(document.querySelector('#language'));
language.value=getLocale();
language.addEventListener('change',()=>{setLocale(language.value);translate();renderWorld();});
translate();
renderWorld();
