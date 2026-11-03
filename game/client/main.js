import {getLocale,setLocale,translate,t} from './locales.js';
import {renderWorld,initialPlots} from './world.js';
import {el} from './dom.js';
import {createState,dispatch} from './engine.js';
import {CROPS,CROP_IDS} from './config.js';
/** @type {import('./engine.js').State} */let state=createState();
const language=/** @type {HTMLSelectElement} */(document.querySelector('#language'));
const panel=/** @type {HTMLElement} */(document.querySelector('#plot-panel'));
/** @type {number|null} */let selected=null;
/** @type {import('./engine.js').CropId} */let chosenCrop='lettuce';
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
 const actions=el('plot-actions');actions.replaceChildren();const plot=state.plots.find(p=>p.id===selected);if(plot?.crop){el('plot-status').textContent=t(plot.crop.type)+' · '+t('seedling');return;}
 const label=document.createElement('label');label.className='crop-picker';label.textContent=t('chooseCrop');const picker=document.createElement('select');picker.id='crop-choice';picker.setAttribute('aria-label',t('chooseCrop'));
 for(const id of CROP_IDS){const option=document.createElement('option');option.value=id;option.textContent=t(id);picker.append(option);}picker.value=chosenCrop;picker.addEventListener('change',()=>{chosenCrop=/** @type {import('./engine.js').CropId} */(picker.value);renderSelection();});label.append(picker);actions.append(label);
 const info=document.createElement('p');info.id='crop-info';const c=CROPS[chosenCrop];info.textContent=`${c.hours/24} ${t('gameDays')} · ${c.waterPerDayMm} mm/${t('day').toLowerCase()} · ${c.seedPrice} ${t('coins')}/${t('seed')}`;actions.append(info);
 const plant=document.createElement('button');plant.type='button';plant.id='plant';plant.className='action-button primary';plant.textContent=t('plant')+' '+t(chosenCrop)+' · '+state.seeds[chosenCrop]+' '+t('seeds');plant.addEventListener('click',()=>{if(selected!==null)send('plant',{plot:selected,crop:chosenCrop});});actions.append(plant);
}
function closePlot(){const old=selected;selected=null;renderSelection();if(old!==null){const button=/** @type {HTMLButtonElement|null} */(document.querySelector(`[data-choose-plot="${old}"]`));button?.focus();}}
document.addEventListener('plotselect',event=>{const id=/** @type {CustomEvent<number>} */(event).detail;if(!Number.isInteger(id)||!state.plots.some(p=>p.id===id))return;selected=id;renderSelection();});
el('close-plot').addEventListener('click',closePlot);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePlot();});
language.value=getLocale();
language.addEventListener('change',()=>{setLocale(language.value);render();});
function render(){translate();renderWorld(state.plots);renderSelection();renderGuide();renderGraphics();el('hud-day').textContent=String(Math.floor(state.tick/24)+1);el('hud-coins').textContent=String(state.coins);el('hud-water').textContent=String(state.water);el('hud-seeds').textContent=String(state.seeds.lettuce+state.seeds.tomato);el('pause').textContent=t(state.paused?'playClock':'pause');el('speed').textContent=state.speed+'×';}
/** @param {import('./engine.js').CommandType} type @param {Partial<import('./engine.js').Command>} [extra] */
function send(type,extra={}){const result=dispatch(state,{...extra,id:state.revision+1,type});if(result.ok){state=result.state;el('notice').textContent=result.events.length?t(result.events[0].type):'';render();}else el('notice').textContent=t(result.error);}
el('next-day').addEventListener('click',()=>send('nextDay'));el('pause').addEventListener('click',()=>send('pause'));el('speed').addEventListener('click',()=>send('speed'));
setInterval(()=>{if(!state.paused&&!document.hidden){for(let i=0;i<state.speed;i++)send('tick');}},3000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!state.paused)send('pause');});
render();
