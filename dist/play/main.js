import {getLocale,setLocale,translate,t} from './locales.js';
import {renderWorld,initialPlots} from './world.js';
import {el} from './dom.js';
import {createState,dispatch} from './engine.js';
/** @type {import('./engine.js').State} */let state=createState();
const language=/** @type {HTMLSelectElement} */(document.querySelector('#language'));
const panel=/** @type {HTMLElement} */(document.querySelector('#plot-panel'));
/** @type {number|null} */let selected=null;
let guideExpanded=true;
let lowGraphics=false;try{lowGraphics=localStorage.getItem('myfarmtwin.graphics')==='low';}catch{/* Optional preference. */}
function renderGraphics(){document.body.classList.toggle('low-graphics',lowGraphics);el('graphics').setAttribute('aria-pressed',String(lowGraphics));}
el('graphics').addEventListener('click',()=>{lowGraphics=!lowGraphics;renderGraphics();try{localStorage.setItem('myfarmtwin.graphics',lowGraphics?'low':'full');}catch{/* Optional preference. */}});
function renderGuide(){el('mission-detail').hidden=!guideExpanded;el('guide-portrait').hidden=!guideExpanded;el('guide-toggle').textContent=t(guideExpanded?'hideGuide':'showGuide');el('guide-toggle').setAttribute('aria-expanded',String(guideExpanded));}
el('guide-toggle').addEventListener('click',()=>{guideExpanded=!guideExpanded;renderGuide();});
function renderSelection(){
 panel.hidden=selected===null;
 document.querySelectorAll('[data-plot]').forEach(p=>{const active=Number(p.getAttribute('data-plot'))===selected;p.classList.toggle('selected',active);p.setAttribute('aria-pressed',String(active));});
 document.querySelectorAll('[data-choose-plot]').forEach(p=>p.setAttribute('aria-pressed',String(Number(p.getAttribute('data-choose-plot'))===selected)));
 if(selected===null)return;
 el('plot-heading').textContent=t('plot')+' '+(selected+1);
 el('plot-status').textContent=t('emptyBed');
}
function closePlot(){const old=selected;selected=null;renderSelection();if(old!==null){const button=/** @type {HTMLButtonElement|null} */(document.querySelector(`[data-choose-plot="${old}"]`));button?.focus();}}
document.addEventListener('plotselect',event=>{const id=/** @type {CustomEvent<number>} */(event).detail;if(!Number.isInteger(id)||!state.plots.some(p=>p.id===id))return;selected=id;renderSelection();});
el('close-plot').addEventListener('click',closePlot);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePlot();});
language.value=getLocale();
language.addEventListener('change',()=>{setLocale(language.value);render();});
function render(){translate();renderWorld(state.plots);renderSelection();renderGuide();renderGraphics();el('hud-day').textContent=String(Math.floor(state.tick/24)+1);el('hud-coins').textContent=String(state.coins);el('hud-water').textContent=String(state.water);el('hud-seeds').textContent=String(state.seeds.lettuce+state.seeds.tomato);el('pause').textContent=t(state.paused?'playClock':'pause');el('speed').textContent=state.speed+'×';}
/** @param {import('./engine.js').CommandType} type */
function send(type){const result=dispatch(state,{id:state.revision+1,type});if(result.ok){state=result.state;render();}else el('notice').textContent=t(result.error);}
el('next-day').addEventListener('click',()=>send('nextDay'));el('pause').addEventListener('click',()=>send('pause'));el('speed').addEventListener('click',()=>send('speed'));
setInterval(()=>{if(!state.paused&&!document.hidden){for(let i=0;i<state.speed;i++)send('tick');}},3000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!state.paused)send('pause');});
render();
