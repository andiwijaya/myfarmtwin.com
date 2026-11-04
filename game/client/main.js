import {getLocale,setLocale,translate,t} from './locales.js';
import {renderWorld} from './world.js';
import {renderChickenWorld} from './chicken-view.js';
import {renderGoatWorld} from './goat-view.js';
import {renderCowWorld} from './cow-view.js';
import {cowObjective} from './cow-missions.js';
import {cowSnapshot} from './cow-scene-snapshot.js';
import {renderCowPanel,renderCowHud,validCowSelection} from './cow-panel.js';
import {renderGoatPanel,validGoatSelection} from './goat-panel.js';
import {goatSnapshot} from './goat-scene-snapshot.js';
import {goatObjective} from './goat-missions.js';
import {FEATURES} from './features.js';
import {renderChickenPanel} from './chicken-panel.js';
import {chickenSnapshot} from './chicken-snapshot.js';
import {chickenObjective} from './chicken-missions.js';
import {el} from './dom.js';
import {createState,dispatch,forecastWeather,pumpCovers} from './engine.js';
import {CROPS,CROP_IDS,STAGE_KEYS,WATER} from './config.js';
import {currentObjective,FOLLOWUPS} from './missions.js';
import {setupMarket,renderMarket,renderShop,renderOrders} from './market.js';
import {condition,causality} from './care.js';
import {SaveSession,browserStorage,SAVE_KEY} from './storage.js';
import {withSaveLock,writeLockAvailable} from './save-lock.js';
import {setupData,renderData} from './data-tools.js';
import {setupInspect,showInspect,renderInspect,renderReasons,renderTrends} from './inspect.js';
let saveSession=new SaveSession(browserStorage(writeLockAvailable()));
function openSession(){const result=saveSession.load();if(result.status==='saveReady'){try{saveSession.save(createState());result.status='saveSaved';}catch{result.status='saveUnavailable';}}else if(!writeLockAvailable()&&result.status==='saveResumed')result.status='saveUnavailable';return result;}
/** @type {ReturnType<SaveSession['load']>} */
let loaded;try{loaded=await withSaveLock(openSession);}catch{saveSession=new SaveSession(browserStorage(false));loaded=openSession();if(loaded.status==='saveResumed')loaded.status='saveUnavailable';}
/** @type {import('./engine.js').State} */let state=loaded.state||createState();
let saveStatus=loaded.status,externalChange=false;
let resumeVisible=!!loaded.state;

const language=/** @type {HTMLSelectElement} */(document.querySelector('#language'));
const panel=/** @type {HTMLElement} */(document.querySelector('#plot-panel'));
/** @type {number|null} */let selected=null;
/** @type {import('./engine.js').CropId} */let chosenCrop='lettuce';
let guideExpanded=true;
let celebrationDismissed=false;
let activeArea='field';
let selectedChicken='';let selectedGoat='';let selectedCow='';
function renderCowSelection(){if(selectedCow&&!validCowSelection(selectedCow,state))selectedCow='';document.querySelectorAll('[data-cow-object]').forEach(p=>{const active=p.getAttribute('data-cow-object')===selectedCow;p.classList.toggle('cow-selected',active);p.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-choose-cow]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-choose-cow')===selectedCow)));renderCowPanel(state,selectedCow,send);}
document.addEventListener('cowobjectselect',event=>{const id=/** @type {CustomEvent<string>} */(event).detail;if(activeArea==='cow'&&validCowSelection(id,state)){selectedCow=id;renderCowSelection();}});
function closeCow(){const old=selectedCow;selectedCow='';renderCowSelection();/** @type {HTMLButtonElement|null} */(document.querySelector('[data-choose-cow="'+old+'"]'))?.focus();}
el('close-cow').addEventListener('click',closeCow);
function renderGoatSelection(){if(selectedGoat&&!validGoatSelection(selectedGoat,state))selectedGoat='';document.querySelectorAll('[data-goat-object]').forEach(p=>{const active=p.getAttribute('data-goat-object')===selectedGoat;p.classList.toggle('goat-selected',active);p.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-choose-goat]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-choose-goat')===selectedGoat)));renderGoatPanel(state,selectedGoat,send);}
document.addEventListener('goatobjectselect',event=>{const id=/** @type {CustomEvent<string>} */(event).detail;if(activeArea==='goat'&&validGoatSelection(id,state)){selectedGoat=id;renderGoatSelection();}});
function closeGoat(){const old=selectedGoat;selectedGoat='';renderGoatSelection();/** @type {HTMLButtonElement|null} */(document.querySelector('[data-choose-goat="'+old+'"]'))?.focus();}
el('close-goat').addEventListener('click',closeGoat);
function yardSnapshot(){return chickenSnapshot(state)||{level:0,doorOpen:true,pendingEggs:0,feedG:0,waterL:0,cleanliness:100,storeFeedG:0,tankWaterL:state.water,coins:state.coins};}
function renderChickenSelection(){el('world').dataset.selectedChicken=selectedChicken;document.querySelectorAll('[data-chicken-object]').forEach(p=>{const active=p.getAttribute('data-chicken-object')===selectedChicken;p.classList.toggle('chicken-selected',active);p.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-choose-chicken]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-choose-chicken')===selectedChicken)));renderChickenPanel(yardSnapshot(),selectedChicken);}
document.addEventListener('chickenobjectselect',event=>{const id=/** @type {CustomEvent<string>} */(event).detail;if(activeArea==='chicken'&&['coop','nest','feeder','drinker','clean'].includes(id)){selectedChicken=id;renderChickenSelection();}});
document.addEventListener('chickenaction',event=>{if(activeArea!=='chicken')return;const id=/** @type {CustomEvent<string>} */(event).detail,types=/** @type {Record<string,import('./engine.js').CommandType>} */({feed:'feedHens',water:'waterHens',clean:'cleanCoop',collect:'collectEggs'});if(Object.hasOwn(types,id))send(types[id]);});
document.addEventListener('camerachanged',()=>{if(activeArea==='cow')renderCowSelection();else if(activeArea==='goat')renderGoatSelection();else if(activeArea==='chicken')renderChickenSelection();else renderSelection();});
function closeChicken(){const old=selectedChicken;selectedChicken='';renderChickenSelection();/** @type {HTMLButtonElement|null} */(document.querySelector('[data-choose-chicken='+old+']'))?.focus();}
el('close-chicken').addEventListener('click',closeChicken);
el('area-cow').addEventListener('click',()=>{if(FEATURES.cow){clearNotice();if(!state.cow?.visited&&externalChange){notify(t('saveConflict'));return;}activeArea='cow';if(!state.cow?.visited)send('enterCow');else render();}});
el('area-field').addEventListener('click',()=>{clearNotice();activeArea='field';render();});
el('area-goat').addEventListener('click',()=>{clearNotice();if(!state.goat?.visited&&externalChange){notify(t('saveConflict'));return;}activeArea='goat';if(!state.goat?.visited)send('enterGoat');else render();});
el('area-chicken').addEventListener('click',()=>{if(FEATURES.chicken){clearNotice();if(!state.chicken?.visited&&externalChange){notify(t('saveConflict'));return;}activeArea='chicken';if(!state.chicken?.visited)send('enterYard');else render();}});
el('continue-farm').addEventListener('click',()=>{celebrationDismissed=true;chosenCrop='tomato';const empty=state.plots.find(p=>!p.crop);if(empty)selected=empty.id;render();});
el('resume-continue').addEventListener('click',()=>{resumeVisible=false;render();});
/** @type {ReturnType<typeof setTimeout>|undefined} */let noticeTimer;
/** @param {string} text */
function notify(text){if(noticeTimer)clearTimeout(noticeTimer);el('notice').textContent=text;noticeTimer=setTimeout(()=>{el('notice').textContent='';},4500);}
function clearNotice(){if(noticeTimer)clearTimeout(noticeTimer);el('notice').textContent='';}
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
 const actions=el('plot-actions');actions.replaceChildren();const plot=state.plots.find(p=>p.id===selected);if(!plot)return;
 const inspect=document.createElement('button');inspect.id='inspect';inspect.type='button';inspect.className='action-button';inspect.textContent=t('inspect');inspect.addEventListener('click',()=>showInspect(state,plot.id));actions.append(inspect);
 el('care-feedback').textContent=causality(state,plot).slice(0,2).map(t).join(' ');el('care-feedback').dataset.condition=condition(plot);
 const water=document.createElement('button');water.type='button';water.id='water';water.className='action-button';water.textContent=t('waterAction')+' · '+(state.careCredits>0?0:WATER.coinCost)+' '+t('coins');water.addEventListener('click',()=>{if(selected!==null)send('water',{plot:selected});});actions.append(water);
 const moisture=Math.round(100*plot.soilWaterMm/plot.soilCapacityMm)+'% '+t('moisture');if(plot.crop){el('plot-status').textContent=t(plot.crop.type)+' · '+t(STAGE_KEYS[plot.crop.stage])+' · '+Math.floor(plot.crop.progress*100)+'% · '+moisture+' · '+Math.round(plot.crop.quality*100)+'% '+t('quality');const harvest=document.createElement('button');harvest.id='harvest';harvest.type='button';harvest.className='action-button primary';harvest.textContent=t('harvest');harvest.disabled=plot.crop.progress<1;harvest.title=t(plot.crop.progress<1?'notReady':'readyHarvest');harvest.addEventListener('click',()=>{if(selected!==null)send('harvest',{plot:selected});});actions.append(harvest);return;}
 el('plot-status').textContent=t('emptyBed')+' '+moisture;
 const label=document.createElement('label');label.className='crop-picker';label.textContent=t('chooseCrop');const picker=document.createElement('select');picker.id='crop-choice';picker.setAttribute('aria-label',t('chooseCrop'));
 for(const id of CROP_IDS){const option=document.createElement('option');option.value=id;option.textContent=t(id);picker.append(option);}picker.value=chosenCrop;picker.addEventListener('change',()=>{chosenCrop=/** @type {import('./engine.js').CropId} */(picker.value);renderSelection();});label.append(picker);actions.append(label);
 const info=document.createElement('p');info.id='crop-info';const c=CROPS[chosenCrop];info.textContent=`${c.hours/24} ${t('gameDays')} (${t('idealCare')}) · ${c.waterPerDayMm} mm/${t('day').toLowerCase()} · ${c.seedPrice} ${t('coins')}/${t('seed')}`;actions.append(info);
 const plant=document.createElement('button');plant.type='button';plant.id='plant';plant.className='action-button primary';plant.textContent=t('plant')+' '+t(chosenCrop)+' · '+state.seeds[chosenCrop]+' '+t('seeds');plant.addEventListener('click',()=>{if(selected!==null)send('plant',{plot:selected,crop:chosenCrop});});actions.append(plant);
}
function closePlot(){const old=selected;selected=null;renderSelection();if(old!==null){const button=/** @type {HTMLButtonElement|null} */(document.querySelector(`[data-choose-plot="${old}"]`));button?.focus();}}
document.addEventListener('plotselect',event=>{const id=/** @type {CustomEvent<number>} */(event).detail;if(!Number.isInteger(id)||!state.plots.some(p=>p.id===id))return;selected=id;renderSelection();send('select',{plot:id});});
el('close-plot').addEventListener('click',closePlot);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')){if(activeArea==='cow'&&selectedCow)closeCow();else if(activeArea==='goat'&&selectedGoat)closeGoat();else if(activeArea==='chicken'&&selectedChicken)closeChicken();else closePlot();}});
language.value=getLocale();
language.addEventListener('change',()=>{setLocale(language.value);render();});
function renderGoatMission(){const objective=goatObjective(state);el('guide-chapter').textContent=t(objective.step<8?'goatChapter1':'goatRanchGoals');el('mission-title').textContent=t(objective.title)+(objective.progress?' · '+objective.progress:'');el('mission-detail').textContent=t(objective.detail);el('mission-track').hidden=false;el('mission-track').setAttribute('aria-valuemax','8');el('mission-track').setAttribute('aria-valuenow',String(objective.step));el('mission-track').setAttribute('aria-label',t('goatChapter1'));el('mission-progress').style.width=100*objective.step/8+'%';document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));if(objective.target)document.querySelector(objective.target)?.classList.add('mission-target');}
function renderMission(){const step=state.mission.step,copy=currentObjective(state);el('mission-title').textContent=t(copy[0]);el('mission-detail').textContent=t(copy[1]);el('guide-chapter').textContent=t(step<7?'firstHarvest':'nextChapter');el('mission-progress').style.width=100*step/7+'%';el('mission-track').setAttribute('aria-valuenow',String(step));el('celebration').hidden=step<7||celebrationDismissed;document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));const next=FOLLOWUPS.find(q=>!state.followups[q.id]);const target=step<7?['.plot-shortcuts','#plant','#water','#next-day','#harvest','#market-open','#buy-pump'][step]:next?.id==='hotCare'?'#weather-name':next?'#market-open':null;if(target)document.querySelector(target)?.classList.add('mission-target');el('followup-missions').hidden=step<7;const list=el('followup-list');list.replaceChildren();for(const quest of FOLLOWUPS){const item=document.createElement('li');item.dataset.quest=quest.id;item.dataset.done=String(state.followups[quest.id]);item.textContent=(state.followups[quest.id]?'✓ ':'○ ')+t(quest.title);list.append(item);}}
function render(redrawWorld=true){
 if(activeArea==='chicken'&&(!FEATURES.chicken||!state.chicken?.visited))activeArea='field';
 if(activeArea==='goat'&&!state.goat?.visited)activeArea='field';
 if(activeArea==='cow'&&(!FEATURES.cow||!state.cow?.visited))activeArea='field';
 translate();if(redrawWorld){if(activeArea==='cow')renderCowWorld(cowSnapshot(state));else if(activeArea==='goat')renderGoatWorld(goatSnapshot(state));else if(activeArea==='chicken')renderChickenWorld(yardSnapshot());else renderWorld(state.plots,state.tick,state.pump);}renderSelection();renderGuide();renderGraphics();renderMarket(state,send);renderOrders(state,send);renderShop(state,send);renderMission();renderData(saveSession);renderInspect(state,selected);renderReasons(state,selected);renderTrends(state,selected);
 el('hud-day').textContent=String(Math.floor(state.tick/24)+1);el('hud-coins').textContent=String(state.coins);el('hud-water').textContent=String(Math.floor(state.water));el('hud-seeds').textContent=String(state.seeds.lettuce+state.seeds.tomato);
 el('inventory-harvest').textContent=state.inventory.length?state.inventory.map(lot=>t(lot.type)+' ×'+lot.quantity+' · '+Math.round(lot.quality*100)+'% '+t('quality')).join(' | '):t('noHarvest');
 if(state.chicken?.inventory.length)el('inventory-harvest').textContent=(state.inventory.length?el('inventory-harvest').textContent+' | ':'')+t('eggs')+' ×'+state.chicken.inventory.reduce((n,l)=>n+l.quantity,0);
 el('pause').textContent=t(state.paused?'playClock':'pause');el('speed').textContent=state.speed+'×';el('weather-name').textContent=t(state.weather);el('weather-forecast').textContent=t('forecast')+': '+t(forecastWeather(state));
 el('speed').setAttribute('aria-label',t('clockSpeed'));el('world').setAttribute('aria-label',t('farmMap'));document.querySelector('.hud')?.setAttribute('aria-label',t('farmResources'));el('mission-track').setAttribute('aria-label',t('firstHarvest'));
 el('weather-advice').textContent=t('weather_'+state.weather);
 el('save-status').textContent=t(saveStatus);el('save-status').classList.toggle('save-warning',!['saveSaved','saveResumed'].includes(saveStatus));
 el('resume-summary').hidden=!resumeVisible;el('resume-stats').textContent=t('day')+' '+(Math.floor(state.tick/24)+1)+' · '+state.coins+' '+t('coins')+' · '+state.plots.filter(p=>p.crop).length+' '+t('growingCrops');el('resume-next').textContent=t('nextObjective')+': '+t(currentObjective(state)[0])+' '+t('noOfflineDamage');if(state.goat?.visited){el('resume-stats').textContent+=' · '+t('goatArea')+': '+state.goat.herd.length;el('resume-next').textContent+=' '+t('goatArea')+': '+t(goatObjective(state).title)+'.';}
 el('pump-panel').hidden=!state.pump.built;el('pump-status').textContent=t(state.pump.on?'pumpRunning':'pumpStopped')+(state.pump.stopReason?' · '+t(state.pump.stopReason):'');el('pump-coverage').textContent=state.plots.filter(pumpCovers).length+' '+t('coveredBeds');el('quick-pump').textContent=t(state.pump.on?'turnPumpOff':'turnPumpOn');el('quick-pump').setAttribute('aria-pressed',String(state.pump.on));
 el('farm-areas').hidden=!FEATURES.chicken;el('farm-areas').setAttribute('aria-label',t('farmAreas'));el('area-field').setAttribute('aria-pressed',String(activeArea==='field'));el('area-chicken').setAttribute('aria-pressed',String(activeArea==='chicken'));el('world').dataset.area=activeArea;el('weather-care').hidden=activeArea!=='field';el('area-goat').setAttribute('aria-pressed',String(activeArea==='goat'));
 el('map-hint').textContent=t(activeArea==='goat'?'goatMapHint':activeArea==='chicken'?'yardMapHint':'fieldMapHint');if(activeArea==='chicken')el('weather-advice').textContent=t('yardWeather_'+state.weather);
 if(activeArea==='chicken'){renderChickenSelection();panel.hidden=true;el('pump-panel').hidden=true;el('mission-track').hidden=false;el('followup-missions').hidden=true;el('celebration').hidden=true;el('guide-chapter').textContent=t('chickenArea');const objective=chickenObjective(state);el('mission-title').textContent=t(objective.title)+(objective.progress?' · '+objective.progress:'');el('mission-detail').textContent=t(objective.detail);el('mission-track').setAttribute('aria-valuemax','8');el('mission-track').setAttribute('aria-valuenow',String(objective.step));el('mission-track').setAttribute('aria-label',t('chickenArea'));el('mission-progress').style.width=100*objective.step/8+'%';document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));if(objective.target)document.querySelector(objective.target)?.classList.add('mission-target');el('world').setAttribute('aria-label',t('chickenArea'));}else{el('mission-track').hidden=false;el('mission-track').setAttribute('aria-valuemax','7');el('chicken-panel').hidden=true;}
 el('area-cow').hidden=!FEATURES.cow;el('area-cow').setAttribute('aria-pressed',String(activeArea==='cow'));
 renderCowHud(state,activeArea==='cow');el('cow-panel').hidden=true;if(activeArea==='cow'){renderCowSelection();panel.hidden=true;el('chicken-panel').hidden=true;el('pump-panel').hidden=true;el('followup-missions').hidden=true;el('celebration').hidden=true;el('mission-track').hidden=false;el('mission-track').setAttribute('aria-valuemax','8');el('mission-track').setAttribute('aria-valuenow',String(state.cow?.mission.step||0));el('mission-track').setAttribute('aria-label',t('cowFirstDelivery'));el('mission-progress').style.width=100*(state.cow?.mission.step||0)/8+'%';document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));el('guide-chapter').textContent=t('cowFirstDelivery');const cowGoal=cowObjective(state);el('mission-title').textContent=t(cowGoal.title);el('mission-detail').textContent=t(cowGoal.detail);if(cowGoal.target)document.querySelector(cowGoal.target)?.classList.add('mission-target');el('world').setAttribute('aria-label',t('cowArea'));el('map-hint').textContent=t('cowMapHint');}
 el('goat-panel').hidden=true;if(activeArea==='goat'){renderGoatSelection();panel.hidden=true;el('chicken-panel').hidden=true;el('pump-panel').hidden=true;el('followup-missions').hidden=true;el('celebration').hidden=true;renderGoatMission();el('world').setAttribute('aria-label',t('goatArea'));}
}
let writeQueue=Promise.resolve();
/** @param {()=>void|Promise<void>} action */
function queueSave(action){const next=writeQueue.then(()=>withSaveLock(action));writeQueue=next.catch(()=>{});return next;}
/** @param {import('./engine.js').CommandType} type @param {Partial<import('./engine.js').Command>} [extra] */
function send(type,extra={}){return queueSave(()=>{
 if(type==='tick'&&document.hidden)return;if(externalChange){notify(t('saveConflict'));return;}
 const previousMission=state.mission.step;const result=dispatch(state,{...extra,id:state.revision+1,type});if(!result.ok){notify(t(result.error));return;}
 try{saveSession.save(result.state);saveStatus='saveSaved';}catch(error){const prior=saveStatus;saveStatus=error instanceof Error&&['saveConflict','saveCorrupt'].includes(error.message)?error.message:'saveUnavailable';if(saveStatus==='saveCorrupt'&&['saveNewer','saveRecoveryPreview','saveMigrationPreview'].includes(prior))saveStatus=prior;if(saveStatus==='saveConflict'){externalChange=true;notify(t('saveConflict'));render();return;}}
 state=result.state;resumeVisible=false;const goatSale=result.events.find(e=>e.type==='goatSold'),reward=result.events.find(e=>e.type==='missionReward');notify((result.events.length?t(result.events[0].type):'')+(goatSale?' +'+goatSale.amount+' '+t('coins'):'')+(reward?' +'+reward.amount+' '+t('coins')+' · '+t('mission_reward'):''));if(type==='select'&&activeArea==='field'&&previousMission===state.mission.step&&result.events.every(e=>e.type==='selected')){
  // A selection changes revision and backup, but no farm resources or forecast.
  renderSelection();renderMission();renderData(saveSession);
  if(el('inspect-dialog').hasAttribute('open')){renderInspect(state,selected);renderReasons(state,selected);renderTrends(state,selected);}
  el('resume-summary').hidden=true;el('save-status').textContent=t(saveStatus);el('save-status').classList.toggle('save-warning',!['saveSaved','saveResumed'].includes(saveStatus));
 }else render(type!=='select');if(goatSale&&/** @type {HTMLDialogElement} */(el('market-dialog')).open)(document.getElementById('goat-sale-receipt')||document.getElementById('goat-market-title'))?.focus();
}).catch(()=>{saveStatus='saveUnavailable';notify(t('saveUnavailable'));render();});}
el('next-day').addEventListener('click',()=>send('nextDay'));el('pause').addEventListener('click',()=>send('pause'));el('speed').addEventListener('click',()=>send('speed'));
el('quick-pump').addEventListener('click',()=>send('togglePump'));
el('weather-care').addEventListener('click',()=>{const plots=[...state.plots].sort((a,b)=>Number(!!b.crop)-Number(!!a.crop)||a.soilWaterMm-b.soilWaterMm);selected=plots[0].id;send('select',{plot:selected});});
setInterval(()=>{if(!state.paused&&!document.hidden&&!externalChange){for(let i=0;i<state.speed;i++)send('tick');}},3000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!state.paused)send('pause');});
window.addEventListener('storage',event=>{if(event.key!==SAVE_KEY)return;let changed=true;try{changed=saveSession.storage?.getItem(SAVE_KEY)!==saveSession.raw;}catch{/* Unreadable current storage cannot be treated as current. */}if(changed){externalChange=true;saveStatus='saveConflict';notify(t('saveConflict'));render();}});
setupMarket();setupInspect();setupData({getState:()=>state,replace:next=>queueSave(()=>{saveSession.replace(next);state=next;selected=null;selectedChicken='';activeArea='field';resumeVisible=false;celebrationDismissed=false;saveStatus='saveSaved';externalChange=false;render();}),session:saveSession});render();
