import {openGameSession} from './game-session.js';
import {worldZoneStatuses} from './unified-world-status.js';
import {worldActionAvailability} from './unified-world-availability.js';
import {fishSnapshot} from './fish-snapshot.js';import {ownsFishFeeder} from './fish-feeder.js';
import {selectedFishPond,chooseFishPond,resetFishPond} from './fish-selection.js';
import {getLocale,setLocale,translate,t} from './locales.js';
import {fishObjective} from './fish-missions.js';
import {renderFishPanel,FISH_STATIONS} from './fish-panel.js';
import {cowInventorySummary} from './cow-market.js';
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
import {dispatch,forecastWeather,pumpCovers} from './engine.js';
import {CROPS,CROP_IDS,cropStageKey,WATER} from './config.js';
import {currentObjective,FOLLOWUPS} from './missions.js';
import {setupMarket,renderMarket,renderShop,renderOrders} from './market.js';
import {condition,causality} from './care.js';
import {SAVE_KEY} from './storage.js';
import {withSaveLock} from './save-lock.js';
import {setupData,renderData} from './data-tools.js';
import {setupInspect,showInspect,renderInspect,renderReasons,renderTrends} from './inspect.js';
const initialSession=await openGameSession();
let saveSession=initialSession.saveSession,loaded=initialSession.loaded;
/** @type {import('./engine.js').State} */let state=initialSession.state;
let saveStatus=loaded.status,externalChange=false;
let resumeVisible=!!loaded.state;

const language=/** @type {HTMLSelectElement} */(document.querySelector('#language'));
const panel=/** @type {HTMLElement} */(document.querySelector('#plot-panel'));
/** @type {number|null} */let selected=null;
/** @type {import('./engine.js').CropId} */let chosenCrop='lettuce';
let guideExpanded=true;
let celebrationDismissed=false;
/** @type {ReturnType<typeof import('./unified-world-preview.js')['mountUnifiedPreview']>|null} */
let unifiedPreview=null;
/** @type {ReturnType<typeof import('./unified-world-selection.js')['createWorldPresentation']>|null} */
let worldPresentation=null;
/** @type {ReturnType<typeof import('./unified-world-shell.js')['createWorldShell']>|null} */
let worldShell=null;
/** @type {string|null} */let fieldObjectiveTarget=null;
/** @type {HTMLButtonElement|null} */let objectiveJump=null;
function renderObjectiveJump(){
 if(!unifiedPreview)return;
 if(!objectiveJump){objectiveJump=document.createElement('button');objectiveJump.id='world-objective';objectiveJump.type='button';objectiveJump.className='action-button';objectiveJump.addEventListener('click',()=>{const id=objectiveJump?.dataset.entity;if(id){worldShell?.closeMenu('missions');unifiedPreview?.focusEntity(id);}});el('mission-detail').after(objectiveJump);}
 const area=uiArea(),target=area==='chicken'?chickenObjective(state).target:area==='goat'?goatObjective(state).target:area==='cow'?cowObjective(state).target:area==='fish'?fishObjective(state).target:fieldObjectiveTarget,id=unifiedPreview.objectiveTarget(target,{contextZone:area,plotId:selected,fishPondId:selectedFishPond(state)});
 objectiveJump.textContent=getLocale()==='id'?'Lihat tujuan':'View objective';objectiveJump.hidden=!id;objectiveJump.dataset.entity=id||'';unifiedPreview.setObjective(id);
}
function uiArea(){return worldPresentation?.view().contextZone||'field';}
function syncWorldPresentation(){if(!worldPresentation)return;const v=worldPresentation.view(),world=el('world');world.dataset.selectedEntity=v.selectedEntity||'';world.dataset.focusZone=v.focusZone;world.dataset.contextZone=v.contextZone;}
let selectedFish='';
function renderFishSelection(){if(selectedFish&&!FISH_STATIONS.includes(selectedFish))selectedFish='';document.querySelectorAll('[data-fish-object]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-fish-object')===selectedFish)));document.querySelectorAll('[data-choose-fish]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-choose-fish')===selectedFish)));renderFishPanel(state,selectedFish,send);}
document.addEventListener('fishobjectselect',event=>{const id=/** @type {CustomEvent<string>} */(event).detail;if(unifiedPreview){unifiedPreview.selectDomain('fish',id,selectedFishPond(state));return;}if(uiArea()==='fish'&&FISH_STATIONS.includes(id)){selectedFish=id;renderFishSelection();}});
document.addEventListener('fishpondselect',event=>{const id=/** @type {CustomEvent<number>} */(event).detail;if(unifiedPreview){const inMarket=!!document.querySelector('#market-dialog[open]');if(unifiedPreview.selectDomain('fish','pond',id)){/** @type {HTMLElement|null} */(document.querySelector(inMarket?'#fish-stock-pond':'[data-fish-choose-pond="'+id+'"]'))?.focus();}return;}if(chooseFishPond(id,state)){const inMarket=!!document.querySelector('#market-dialog[open]');selectedFish='';render();/** @type {HTMLElement|null} */(document.querySelector(inMarket?'#fish-stock-pond':'[data-fish-choose-pond="'+id+'"]'))?.focus();}});
function closeFish(){const old=selectedFish;selectedFish='';renderFishSelection();if(unifiedPreview?.releaseSelection('fish',old))return;/** @type {HTMLButtonElement|null} */(document.querySelector('[data-choose-fish="'+old+'"]'))?.focus();}
el('close-fish').addEventListener('click',closeFish);
let selectedChicken='';let selectedGoat='';let selectedCow='';
function renderCowSelection(){if(selectedCow&&!validCowSelection(selectedCow,state))selectedCow='';document.querySelectorAll('[data-cow-object]').forEach(p=>{const active=p.getAttribute('data-cow-object')===selectedCow;p.classList.toggle('cow-selected',active);p.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-choose-cow]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-choose-cow')===selectedCow)));renderCowPanel(state,selectedCow,send);}
document.addEventListener('cowobjectselect',event=>{const id=/** @type {CustomEvent<string>} */(event).detail;if(unifiedPreview){unifiedPreview.selectDomain('cow',id);return;}if(uiArea()==='cow'&&validCowSelection(id,state)){selectedCow=id;renderCowSelection();}});
function closeCow(){const old=selectedCow;selectedCow='';renderCowSelection();if(unifiedPreview?.releaseSelection('cow',old))return;/** @type {HTMLButtonElement|null} */(document.querySelector('[data-choose-cow="'+old+'"]'))?.focus();}
el('close-cow').addEventListener('click',closeCow);
function renderGoatSelection(){if(selectedGoat&&!validGoatSelection(selectedGoat,state))selectedGoat='';document.querySelectorAll('[data-goat-object]').forEach(p=>{const active=p.getAttribute('data-goat-object')===selectedGoat;p.classList.toggle('goat-selected',active);p.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-choose-goat]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-choose-goat')===selectedGoat)));renderGoatPanel(state,selectedGoat,send);}
document.addEventListener('goatobjectselect',event=>{const id=/** @type {CustomEvent<string>} */(event).detail;if(unifiedPreview){unifiedPreview.selectDomain('goat',id);return;}if(uiArea()==='goat'&&validGoatSelection(id,state)){selectedGoat=id;renderGoatSelection();}});
function closeGoat(){const old=selectedGoat;selectedGoat='';renderGoatSelection();if(unifiedPreview?.releaseSelection('goat',old))return;/** @type {HTMLButtonElement|null} */(document.querySelector('[data-choose-goat="'+old+'"]'))?.focus();}
el('close-goat').addEventListener('click',closeGoat);
/** @type {{state:import('./engine.js').State,snapshot:import('./chicken-panel.js').CareSnapshot}|null} */let yardCache=null;
function yardSnapshot(){if(!yardCache||yardCache.state!==state)yardCache={state,snapshot:chickenSnapshot(state)||{level:0,doorOpen:true,pendingEggs:0,feedG:0,waterL:0,cleanliness:100,storeFeedG:0,tankWaterL:state.water,coins:state.coins}};return yardCache.snapshot;}
function renderChickenSelection(){el('world').dataset.selectedChicken=selectedChicken;document.querySelectorAll('[data-chicken-object]').forEach(p=>{const active=p.getAttribute('data-chicken-object')===selectedChicken;p.classList.toggle('chicken-selected',active);p.setAttribute('aria-pressed',String(active));});document.querySelectorAll('[data-choose-chicken]').forEach(p=>p.setAttribute('aria-pressed',String(p.getAttribute('data-choose-chicken')===selectedChicken)));renderChickenPanel(yardSnapshot(),selectedChicken);}
document.addEventListener('chickenobjectselect',event=>{const id=/** @type {CustomEvent<string>} */(event).detail;if(unifiedPreview){unifiedPreview.selectDomain('chicken',id);return;}if(uiArea()==='chicken'&&['coop','nest','feeder','drinker','clean'].includes(id)){selectedChicken=id;renderChickenSelection();}});
document.addEventListener('chickenaction',event=>{if(uiArea()!=='chicken')return;const id=/** @type {CustomEvent<string>} */(event).detail,types=/** @type {Record<string,import('./engine.js').CommandType>} */({feed:'feedHens',water:'waterHens',clean:'cleanCoop',collect:'collectEggs'});if(Object.hasOwn(types,id))send(types[id]);});
document.addEventListener('camerachanged',()=>{if(uiArea()==='fish')renderFishSelection();else if(uiArea()==='cow')renderCowSelection();else if(uiArea()==='goat')renderGoatSelection();else if(uiArea()==='chicken')renderChickenSelection();else renderSelection();});
function closeChicken(){const old=selectedChicken;selectedChicken='';renderChickenSelection();if(unifiedPreview?.releaseSelection('chicken',old))return;/** @type {HTMLButtonElement|null} */(document.querySelector('[data-choose-chicken='+old+']'))?.focus();}
el('close-chicken').addEventListener('click',closeChicken);
el('continue-farm').addEventListener('click',()=>{celebrationDismissed=true;chosenCrop='tomato';const empty=state.plots.find(p=>!p.crop);if(empty)selected=empty.id;render();});
el('resume-continue').addEventListener('click',()=>{resumeVisible=false;render();});
/** @type {ReturnType<typeof setTimeout>|undefined} */let noticeTimer;
/** @param {string} text */
function notify(text){if(noticeTimer)clearTimeout(noticeTimer);el('notice').textContent=text;noticeTimer=setTimeout(()=>{el('notice').textContent='';},4500);}
let lowGraphics=false;try{lowGraphics=localStorage.getItem('myfarmtwin.graphics')==='low';}catch{/* Optional preference. */}
function renderGraphics(){document.body.classList.toggle('low-graphics',lowGraphics);el('graphics').setAttribute('aria-pressed',String(lowGraphics));unifiedPreview?.setLowGraphics(lowGraphics);}
el('graphics').addEventListener('click',()=>{lowGraphics=!lowGraphics;renderGraphics();try{localStorage.setItem('myfarmtwin.graphics',lowGraphics?'low':'full');}catch{/* Optional preference. */}});
function renderGuide(){el('mission-detail').hidden=!guideExpanded;el('guide-portrait').hidden=!guideExpanded;el('guide-toggle').textContent=t(guideExpanded?'hideGuide':'showGuide');el('guide-toggle').setAttribute('aria-expanded',String(guideExpanded));}
el('guide-toggle').addEventListener('click',()=>{guideExpanded=!guideExpanded;renderGuide();});
/** @param {HTMLButtonElement} button @param {import('./engine.js').CommandType} type @param {Partial<import('./engine.js').Command>} [extra] */
function worldActionReason(button,type,extra={}){if(!unifiedPreview)return;const status=worldActionAvailability(state,type,extra),reason=externalChange?'saveConflict':status.reason;button.disabled=externalChange||!status.allowed;button.title=reason?t(reason):'';const key=button.id+'-world-reason';document.getElementById(key)?.remove();button.removeAttribute('aria-describedby');if(reason){const text=document.createElement('p');text.id=key;text.className='world-action-reason';text.textContent=t(reason);button.setAttribute('aria-describedby',key);button.after(text);}}
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
 const water=document.createElement('button');water.type='button';water.id='water';water.className='action-button';water.textContent=t('waterAction')+' · '+(state.careCredits>0?0:WATER.coinCost)+' '+t('coins');water.addEventListener('click',()=>{if(selected!==null)send('water',{plot:selected});});actions.append(water);worldActionReason(water,'water',{plot:plot.id});
 const moisture=Math.round(100*plot.soilWaterMm/plot.soilCapacityMm)+'% '+t('moisture');if(plot.crop){el('plot-status').textContent=t(plot.crop.type)+' · '+t(cropStageKey(plot.crop.type,plot.crop.stage))+' · '+Math.floor(plot.crop.progress*100)+'% · '+moisture+' · '+Math.round(plot.crop.quality*100)+'% '+t('quality');const harvest=document.createElement('button');harvest.id='harvest';harvest.type='button';harvest.className='action-button primary';harvest.textContent=t('harvest');harvest.disabled=plot.crop.progress<1;harvest.title=t(plot.crop.progress<1?'notReady':'readyHarvest');harvest.addEventListener('click',()=>{if(selected!==null)send('harvest',{plot:selected});});actions.append(harvest);worldActionReason(harvest,'harvest',{plot:plot.id});return;}
 el('plot-status').textContent=t('emptyBed')+' '+moisture;
 const label=document.createElement('label');label.className='crop-picker';label.textContent=t('chooseCrop');const picker=document.createElement('select');picker.id='crop-choice';picker.setAttribute('aria-label',t('chooseCrop'));
 for(const id of CROP_IDS){const option=document.createElement('option');option.value=id;option.textContent=t(id);picker.append(option);}picker.value=chosenCrop;picker.addEventListener('change',()=>{chosenCrop=/** @type {import('./engine.js').CropId} */(picker.value);renderSelection();});label.append(picker);actions.append(label);
 const info=document.createElement('p');info.id='crop-info';const c=CROPS[chosenCrop];info.textContent=`${c.hours/24} ${t('gameDays')} (${t('idealCare')}) · ${c.waterPerDayMm} mm/${t('day').toLowerCase()} · ${c.seedPrice} ${t('coins')}/${t('seed')}`;actions.append(info);
 const plant=document.createElement('button');plant.type='button';plant.id='plant';plant.className='action-button primary';plant.textContent=t('plant')+' '+t(chosenCrop)+' · '+state.seeds[chosenCrop]+' '+t('seeds');plant.addEventListener('click',()=>{if(selected!==null)send('plant',{plot:selected,crop:chosenCrop});});actions.append(plant);worldActionReason(plant,'plant',{plot:plot.id,crop:chosenCrop});
}
function closePlot(){const old=selected;selected=null;renderSelection();if(old!==null){if(unifiedPreview?.releaseSelection('plot',old))return;const button=/** @type {HTMLButtonElement|null} */(document.querySelector(`[data-choose-plot="${old}"]`));button?.focus();}}
function renderPlotChoice(){renderSelection();renderMission();renderData(saveSession);if(el('inspect-dialog').hasAttribute('open')){renderInspect(state,selected);renderReasons(state,selected);renderTrends(state,selected);}resumeVisible=false;el('resume-summary').hidden=true;}
/** @param {number} id */
function handlePlotSelection(id){if(!Number.isInteger(id)||!state.plots.some(p=>p.id===id))return;selected=id;if(state.mission.step===0){renderSelection();send('select',{plot:id});}else renderPlotChoice();}
document.addEventListener('plotselect',event=>{const id=/** @type {CustomEvent<number>} */(event).detail;if(unifiedPreview){unifiedPreview.selectDomain('plot',id);return;}handlePlotSelection(id);});
el('close-plot').addEventListener('click',closePlot);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!document.querySelector('dialog[open]')){if(unifiedPreview&&el('world').dataset.selectedEntity?.endsWith('.available')){unifiedPreview.clearSelection();render();return;}if(unifiedPreview&&el('world').dataset.selectedEntity==='field.pump'){unifiedPreview.releaseSelection('pump','pump');render();return;}if(uiArea()==='fish'&&selectedFish)closeFish();else if(uiArea()==='cow'&&selectedCow)closeCow();else if(uiArea()==='goat'&&selectedGoat)closeGoat();else if(uiArea()==='chicken'&&selectedChicken)closeChicken();else closePlot();}});
language.value=getLocale();
language.addEventListener('change',()=>{setLocale(language.value);render();});
function renderGoatMission(){const objective=goatObjective(state);el('guide-chapter').textContent=t(objective.step<8?'goatChapter1':'goatRanchGoals');el('mission-title').textContent=t(objective.title)+(objective.progress?' · '+objective.progress:'');el('mission-detail').textContent=t(objective.detail);el('mission-track').hidden=false;el('mission-track').setAttribute('aria-valuemax','8');el('mission-track').setAttribute('aria-valuenow',String(objective.step));el('mission-track').setAttribute('aria-label',t('goatChapter1'));el('mission-progress').style.width=100*objective.step/8+'%';document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));if(objective.target)document.querySelector(objective.target)?.classList.add('mission-target');}
function renderMission(){const step=state.mission.step,copy=currentObjective(state);el('mission-title').textContent=t(copy[0]);el('mission-detail').textContent=t(copy[1]);el('guide-chapter').textContent=t(step<7?'firstHarvest':'nextChapter');el('mission-progress').style.width=100*step/7+'%';el('mission-track').setAttribute('aria-valuenow',String(step));el('celebration').hidden=step<7||celebrationDismissed;document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));const next=FOLLOWUPS.find(q=>!state.followups[q.id]);const target=step<7?['.plot-shortcuts','#plant','#water','#next-day','#harvest','#market-open','#buy-pump'][step]:next?.id==='hotCare'?'#weather-name':next?'#market-open':null;fieldObjectiveTarget=target;renderObjectiveJump();if(target)document.querySelector(target)?.classList.add('mission-target');el('followup-missions').hidden=step<7;const list=el('followup-list');list.replaceChildren();for(const quest of FOLLOWUPS){const item=document.createElement('li');item.dataset.quest=quest.id;item.dataset.done=String(state.followups[quest.id]);item.textContent=(state.followups[quest.id]?'✓ ':'○ ')+t(quest.title);if(unifiedPreview&&!state.followups[quest.id]){const button=document.createElement('button');button.type='button';button.className='action-button';button.dataset.worldQuest=quest.id;button.textContent=getLocale()==='id'?'Lihat lokasi':'View location';button.setAttribute('aria-label',t(quest.title)+' — '+button.textContent);button.addEventListener('click',()=>{const id=unifiedPreview?.objectiveTarget(quest.id==='hotCare'?'#weather-name':'#market-open',{contextZone:'field',plotId:selected});if(id){worldShell?.closeMenu('missions');unifiedPreview?.focusEntity(id);}});item.append(' ',button);}list.append(item);}}
function render(_redrawWorld=true){
 unifiedPreview?.update(state,getLocale());syncWorldPresentation();
 if(uiArea()==='fish'&&!FEATURES.fish){worldPresentation?.reset();}
 if(uiArea()==='chicken'&&(!FEATURES.chicken||!state.chicken?.visited)){worldPresentation?.reset();}
 if(uiArea()==='goat'&&!state.goat?.visited){worldPresentation?.reset();}
 if(uiArea()==='cow'&&(!FEATURES.cow||!state.cow?.visited)){worldPresentation?.reset();}
 translate();renderSelection();renderGuide();renderGraphics();renderMarket(state,send);renderOrders(state,send);renderShop(state,send);renderMission();renderData(saveSession);renderInspect(state,selected);renderReasons(state,selected);renderTrends(state,selected);
 el('hud-day').textContent=String(Math.floor(state.tick/24)+1);el('hud-coins').textContent=String(state.coins);el('hud-water').textContent=String(Math.floor(state.water));el('hud-seeds').textContent=String(Object.values(state.seeds).reduce((a,b)=>a+b,0));
 el('inventory-harvest').textContent=state.inventory.length?state.inventory.map(lot=>t(lot.type)+' ×'+lot.quantity+' · '+Math.round(lot.quality*100)+'% '+t('quality')).join(' | '):t('noHarvest');
 if(state.chicken?.inventory.length)el('inventory-harvest').textContent=(state.inventory.length?el('inventory-harvest').textContent+' | ':'')+t('eggs')+' ×'+state.chicken.inventory.reduce((n,l)=>n+l.quantity,0);const dairyInventory=cowInventorySummary(state);if(dairyInventory)el('inventory-harvest').textContent=(state.inventory.length||state.chicken?.inventory.length?el('inventory-harvest').textContent+' | ':'')+dairyInventory;if(FEATURES.fish&&state.fish?.lots.length){const kg=state.fish.lots.reduce((n,l)=>n+l.massG,0)/1000;el('inventory-harvest').textContent=(state.inventory.length||state.chicken?.inventory.length||dairyInventory?el('inventory-harvest').textContent+' | ':'')+t('fishHarvestLots')+' '+kg.toLocaleString(getLocale())+' kg';}
 el('pause').textContent=t(state.paused?'playClock':'pause');el('speed').textContent=state.speed+'×';el('weather-name').textContent=t(state.weather);el('weather-forecast').textContent=t('forecast')+': '+t(forecastWeather(state));
 el('speed').setAttribute('aria-label',t('clockSpeed'));el('world').setAttribute('aria-label',t('farmMap'));document.querySelector('.hud')?.setAttribute('aria-label',t('farmResources'));el('mission-track').setAttribute('aria-label',t('firstHarvest'));
 el('weather-advice').textContent=t('weather_'+state.weather);
 el('save-status').textContent=t(saveStatus);el('save-status').classList.toggle('save-warning',!['saveSaved','saveResumed'].includes(saveStatus));
 el('resume-summary').hidden=!resumeVisible;el('resume-stats').textContent=t('day')+' '+(Math.floor(state.tick/24)+1)+' · '+state.coins+' '+t('coins')+' · '+state.plots.filter(p=>p.crop).length+' '+t('growingCrops');el('resume-next').textContent=t('nextObjective')+': '+t(currentObjective(state)[0])+' '+t('noOfflineDamage');if(state.goat?.visited){el('resume-stats').textContent+=' · '+t('goatArea')+': '+state.goat.herd.length;el('resume-next').textContent+=' '+t('goatArea')+': '+t(goatObjective(state).title)+'.';}
 el('pump-panel').hidden=!state.pump.built;el('pump-status').textContent=t(state.pump.on?'pumpRunning':'pumpStopped')+(state.pump.stopReason?' · '+t(state.pump.stopReason):'');el('pump-coverage').textContent=state.plots.filter(pumpCovers).length+' '+t('coveredBeds');el('quick-pump').textContent=t(state.pump.on?'turnPumpOff':'turnPumpOn');el('quick-pump').setAttribute('aria-pressed',String(state.pump.on));worldActionReason(/** @type {HTMLButtonElement} */(el('quick-pump')),'togglePump');
 el('world').dataset.area='unified';el('weather-care').hidden=uiArea()!=='field';
 if(uiArea()==='chicken')el('weather-advice').textContent=t('yardWeather_'+state.weather);
 if(uiArea()==='chicken'){renderChickenSelection();panel.hidden=true;el('pump-panel').hidden=true;el('mission-track').hidden=false;el('followup-missions').hidden=true;el('celebration').hidden=true;el('guide-chapter').textContent=t('chickenArea');const objective=chickenObjective(state);el('mission-title').textContent=t(objective.title)+(objective.progress?' · '+objective.progress:'');el('mission-detail').textContent=t(objective.detail);el('mission-track').setAttribute('aria-valuemax','8');el('mission-track').setAttribute('aria-valuenow',String(objective.step));el('mission-track').setAttribute('aria-label',t('chickenArea'));el('mission-progress').style.width=100*objective.step/8+'%';document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));if(objective.target)document.querySelector(objective.target)?.classList.add('mission-target');}else{el('mission-track').hidden=false;el('mission-track').setAttribute('aria-valuemax','7');el('chicken-panel').hidden=true;}

 renderCowHud(state,uiArea()==='cow');el('cow-panel').hidden=true;if(uiArea()==='cow'){renderCowSelection();panel.hidden=true;el('chicken-panel').hidden=true;el('pump-panel').hidden=true;el('followup-missions').hidden=true;el('celebration').hidden=true;el('mission-track').hidden=false;el('mission-track').setAttribute('aria-valuemax','8');el('mission-track').setAttribute('aria-valuenow',String(state.cow?.mission.step||0));el('mission-track').setAttribute('aria-label',t('cowFirstDelivery'));el('mission-progress').style.width=100*(state.cow?.mission.step||0)/8+'%';document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));el('guide-chapter').textContent=t('cowFirstDelivery');const cowGoal=cowObjective(state);el('mission-title').textContent=t(cowGoal.title)+(cowGoal.progress?' · '+cowGoal.progress:'');el('mission-detail').textContent=t(cowGoal.detail);if(cowGoal.target)document.querySelector(cowGoal.target)?.classList.add('mission-target');}
 el('goat-panel').hidden=true;if(uiArea()==='goat'){renderGoatSelection();panel.hidden=true;el('chicken-panel').hidden=true;el('pump-panel').hidden=true;el('followup-missions').hidden=true;el('celebration').hidden=true;renderGoatMission();}
 const pondNav=el('fish-ponds');pondNav.replaceChildren();pondNav.hidden=uiArea()!=='fish'||(state.fish?.ponds.length||0)<2;pondNav.setAttribute('aria-label',t('fishChoosePond'));if(!pondNav.hidden)for(const p of state.fish?.ponds||[]){const b=document.createElement('button');b.type='button';b.dataset.fishChoosePond=String(p.id);b.textContent=t('fishPondLabel')+' '+p.id;b.setAttribute('aria-pressed',String(p.id===selectedFishPond(state)));b.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('fishpondselect',{detail:p.id})));pondNav.append(b);}
 el('fish-panel').hidden=true;
 if(uiArea()==='fish'){renderFishSelection();for(const id of ['plot-panel','chicken-panel','goat-panel','cow-panel','cow-hud','pump-panel','followup-missions','celebration','mission-track'])el(id).hidden=true;const goal=fishObjective(state);el('guide-chapter').textContent=t(state.fish?.mission.completed.includes('first')?'fishNextChapter':'fishFirstHarvest');el('mission-title').textContent=t(goal.title);el('mission-detail').textContent=t(goal.detail);el('mission-track').hidden=false;el('mission-track').setAttribute('aria-valuemax',String(goal.max));el('mission-track').setAttribute('aria-valuenow',String(goal.step));el('mission-track').setAttribute('aria-label',t(state.fish?.mission.completed.includes('first')?goal.title:'fishFirstHarvest'));el('mission-progress').style.width=100*goal.step/goal.max+'%';document.querySelectorAll('.mission-target').forEach(e=>e.classList.remove('mission-target'));if(goal.target)document.querySelector(goal.target)?.classList.add('mission-target');}
 renderObjectiveJump();worldShell?.update(getLocale(),worldZoneStatuses(state));
}
let writeQueue=Promise.resolve();
/** @param {()=>void|Promise<void>} action */
function queueSave(action){const next=writeQueue.then(()=>withSaveLock(action));writeQueue=next.catch(()=>{});return next;}
/** @param {import('./engine.js').CommandType} type @param {Partial<import('./engine.js').Command>} [extra] */
function send(type,extra={}){return queueSave(()=>{
 if(type==='select'&&state.mission.step>0){renderPlotChoice();return;}if(type==='tick'&&document.hidden)return;if(externalChange){notify(t('saveConflict'));return;}
 const previousMission=state.mission.step,command={...extra,id:state.revision+1,type};const result=dispatch(state,command);if(!result.ok){notify(t(result.error));return;}
 try{saveSession.save(result.state);saveStatus='saveSaved';}catch(error){const prior=saveStatus;saveStatus=error instanceof Error&&['saveConflict','saveCorrupt'].includes(error.message)?error.message:'saveUnavailable';if(saveStatus==='saveCorrupt'&&['saveNewer','saveRecoveryPreview','saveMigrationPreview'].includes(prior))saveStatus=prior;if(saveStatus==='saveConflict'){externalChange=true;notify(t('saveConflict'));render();return;}}
 state=result.state;unifiedPreview?.events(result.events,command);resumeVisible=false;const goatSale=result.events.find(e=>e.type==='goatSold'),reward=result.events.find(e=>e.type==='missionReward');notify((result.events.length?t(result.events[0].type):'')+(goatSale?' +'+goatSale.amount+' '+t('coins'):'')+(reward?' +'+reward.amount+' '+t('coins')+' · '+t('mission_reward'):''));if(type==='select'&&uiArea()==='field'&&previousMission===state.mission.step&&result.events.every(e=>e.type==='selected')){
  // A selection changes revision and backup, but no farm resources or forecast.
  renderSelection();renderMission();renderData(saveSession);
  if(el('inspect-dialog').hasAttribute('open')){renderInspect(state,selected);renderReasons(state,selected);renderTrends(state,selected);}
  el('resume-summary').hidden=true;el('save-status').textContent=t(saveStatus);el('save-status').classList.toggle('save-warning',!['saveSaved','saveResumed'].includes(saveStatus));
 }else render(type!=='select');if(result.events.some(e=>e.type==='cowMilkSold'))document.getElementById('cow-sale-receipt')?.focus({preventScroll:false});if(goatSale&&/** @type {HTMLDialogElement} */(el('market-dialog')).open)(document.getElementById('goat-sale-receipt')||document.getElementById('goat-market-title'))?.focus();
}).catch(()=>{saveStatus='saveUnavailable';notify(t('saveUnavailable'));render();});}
el('next-day').addEventListener('click',()=>send('nextDay'));el('pause').addEventListener('click',()=>send('pause'));el('speed').addEventListener('click',()=>send('speed'));
el('quick-pump').addEventListener('click',()=>send('togglePump'));
el('weather-care').addEventListener('click',()=>{const plots=[...state.plots].sort((a,b)=>Number(!!b.crop)-Number(!!a.crop)||a.soilWaterMm-b.soilWaterMm);selected=plots[0].id;send('select',{plot:selected});});
window.addEventListener('storage',event=>{if(event.key!==SAVE_KEY)return;let changed=true;try{changed=saveSession.storage?.getItem(SAVE_KEY)!==saveSession.raw;}catch{/* Unreadable current storage cannot be treated as current. */}if(changed){externalChange=true;saveStatus='saveConflict';notify(t('saveConflict'));render();}});
setupMarket();setupInspect();setupData({getState:()=>state,replace:next=>queueSave(()=>{saveSession.replace(next);state=next;selected=null;selectedChicken='';selectedGoat='';selectedCow='';selectedFish='';resetFishPond();unifiedPreview?.clearSelection();unifiedPreview?.resetEffects();worldPresentation?.reset();syncWorldPresentation();resumeVisible=false;celebrationDismissed=false;saveStatus='saveSaved';externalChange=false;render();}),session:saveSession});
// The normal game always attaches to the same unified 3D session.
{
 try{const {prepareUnifiedWorld}=await import('./unified-world-bootstrap.js'),boot=await prepareUnifiedWorld();worldPresentation=boot.presentation;unifiedPreview=boot.preview;worldShell=boot.shell;await boot.firstPaint;lowGraphics=boot.host.dataset.worldQuality==='low';Object.assign(boot.previewOptions,/** @type {typeof boot.previewOptions} */({lowGraphics,onQualityChange:low=>{lowGraphics=low;renderGraphics();try{localStorage.setItem('myfarmtwin.graphics',low?'low':'full');}catch{/* Optional UI preference. */}},chickenView:chickenSnapshot,goatView:goatSnapshot,cowView:cowSnapshot,fishView:next=>({snapshot:fishSnapshot(next),feederIds:next.fish?.ponds.filter(p=>ownsFishFeeder(next,p.id)).map(p=>p.id)||[]}),pumpCoverage:next=>next.plots.filter(pumpCovers).map(p=>p.id),onFocusZone:zone=>{worldPresentation?.focus(zone);syncWorldPresentation();worldShell?.focusZone(zone);},onSelectionCleared:id=>{worldPresentation?.clear(id);syncWorldPresentation();worldShell?.update(getLocale(),worldZoneStatuses(state));},onSelect:(candidate,snapshot)=>{const target=worldPresentation?.select(snapshot,candidate.entityId);if(!target)return;syncWorldPresentation();if(target.kind==='market'){worldShell?.update(getLocale(),worldZoneStatuses(state));document.dispatchEvent(new Event('marketopen'));return;}if(target.kind==='plot'&&typeof target.domainId==='number'){render();handlePlotSelection(target.domainId);}else if(target.kind==='chicken'&&state.chicken?.visited&&typeof target.domainId==='string'){selectedChicken=target.domainId;render();}else if(target.kind==='goat'&&state.goat?.visited&&typeof target.domainId==='string'&&validGoatSelection(target.domainId,state)){selectedGoat=target.domainId;render();}else if(target.kind==='cow'&&state.cow?.visited&&typeof target.domainId==='string'&&validCowSelection(target.domainId,state)){selectedCow=target.domainId;render();}else if(target.kind==='fish'&&state.fish?.visited&&typeof target.domainId==='string'&&FISH_STATIONS.includes(target.domainId)&&target.pondId&&chooseFishPond(target.pondId,state)){selectedFish=target.domainId;render();}else if(target.kind==='pump'){selected=null;render();}else{selected=null;selectedChicken='';selectedGoat='';selectedCow='';selectedFish='';render();}worldShell?.focusContext();},onStartZone:async zone=>{if(zone==='fish')await send('enterFishPond');else if(zone==='cow')await send('enterCow');else if(zone==='goat')await send('enterGoat');},onStartChicken:async()=>{await send('enterYard');}}));Object.assign(boot.shellOptions,/** @type {typeof boot.shellOptions} */({onReveal:rect=>unifiedPreview?.revealSelection(rect),describeIssue:t,onGoTo:zone=>unifiedPreview?.focusZone(zone),onInspect:()=>showInspect(state,selected??state.plots[0].id),onCloseContext:()=>{unifiedPreview?.releaseSelection('pump','pump');render();}}));boot.finish();unifiedPreview.update(state,getLocale());unifiedPreview.clearSelection();unifiedPreview.refreshOptions();worldShell.update(getLocale(),worldZoneStatuses(state));syncWorldPresentation();}
 catch(error){worldShell?.dispose();unifiedPreview?.dispose();throw error;}
}
// The read-only bootstrap can precede this controller; detect writes from another
// tab during that interval before accepting any native action.
if(saveSession.storage&&saveStatus!=='saveUnavailable'){let changed=true;try{changed=saveSession.storage.getItem(SAVE_KEY)!==saveSession.raw;}catch{/* Unreadable is not current. */}if(changed){externalChange=true;saveStatus='saveConflict';notify(t('saveConflict'));}}
render();
setInterval(()=>{if(!state.paused&&!document.hidden&&!externalChange){for(let i=0;i<state.speed;i++)send('tick');}},3000);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!state.paused)send('pause');});
