import {getLocale,setLocale,translate,t} from './locales.js';
import {renderWorld,initialPlots} from './world.js';
import {el} from './dom.js';
const language=/** @type {HTMLSelectElement} */(document.querySelector('#language'));
const panel=/** @type {HTMLElement} */(document.querySelector('#plot-panel'));
/** @type {number|null} */let selected=null;
function renderSelection(){
 panel.hidden=selected===null;
 document.querySelectorAll('[data-plot]').forEach(p=>{const active=Number(p.getAttribute('data-plot'))===selected;p.classList.toggle('selected',active);p.setAttribute('aria-pressed',String(active));});
 document.querySelectorAll('[data-choose-plot]').forEach(p=>p.setAttribute('aria-pressed',String(Number(p.getAttribute('data-choose-plot'))===selected)));
 if(selected===null)return;
 el('plot-heading').textContent=t('plot')+' '+(selected+1);
 el('plot-status').textContent=t('emptyBed');
}
function closePlot(){const old=selected;selected=null;renderSelection();if(old!==null){const button=/** @type {HTMLButtonElement|null} */(document.querySelector(`[data-choose-plot="${old}"]`));button?.focus();}}
document.addEventListener('plotselect',event=>{const id=/** @type {CustomEvent<number>} */(event).detail;if(!Number.isInteger(id)||!initialPlots.some(p=>p.id===id))return;selected=id;renderSelection();});
el('close-plot').addEventListener('click',closePlot);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePlot();});
language.value=getLocale();
language.addEventListener('change',()=>{setLocale(language.value);translate();renderWorld();renderSelection();});
translate();
renderWorld();
