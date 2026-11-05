import {el} from './dom.js';import {t} from './locales.js';import {fishSnapshot} from './fish-snapshot.js';import {fishSupply,fishCount} from './fish-state.js';
export const FISH_STATIONS=Object.freeze(['pond','feed','aerator','harvest','water','market']);
/** @param {import('./engine.js').State} state @param {string} selected @param {(type:import('./engine.js').CommandType,extra?:Partial<import('./engine.js').Command>)=>void} send */
export function renderFishPanel(state,selected,send){
 el('fish-panel').hidden=!selected;if(!selected)return;const snap=fishSnapshot(state),g=state.fish,p=g?.ponds[0],pond=snap.ponds[0];el('fish-heading').textContent=t('fishStation_'+selected);el('fish-selection-copy').textContent=snap.preview?t('fishPreviewCopy'):t('fishStationInfo_'+selected);const values=el('fish-status');values.replaceChildren();
 for(const [key,value]of [['fishCount',String(snap.count)],['fishReady',String(snap.ready)],['fishAeration',t(pond?.aerating?'fishOn':'fishOff')],['fishFeedStore',String(g?fishSupply(g.feed):0)+' g'],['fishWaterCredit',String(g?fishSupply(g.water):0)+' L']]){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=t(key);dd.textContent=value;values.append(dt,dd);}
 const actions=el('fish-actions');actions.replaceChildren();
 /** @param {string} key @param {string} label @param {()=>void} run @param {string} [reason] */
 function button(key,label,run,reason=''){const b=document.createElement('button');b.type='button';b.className='action-button';b.dataset.fishAction=key;b.textContent=label;b.disabled=!!reason;if(reason){const help=document.createElement('p');help.id='fish-help-'+key;help.textContent=t(reason);b.title=t(reason);b.setAttribute('aria-describedby',help.id);actions.append(help);}b.addEventListener('click',run);actions.append(b);}
 const inspect=()=>button('inspect',t('fishAction_inspect'),()=>send('fish.inspect',{fishPond:1}),snap.preview?'fishNotVisited':'');
 if(selected==='feed'){const amount=p?Math.min(1000,fishCount(p)*48):0;button('feed',t('fishAction_feed'),()=>send('fish.feed',{fishPond:1}),!p?'fishNotVisited':!fishCount(p)?'fishEmpty':p.lastFeedTick===state.tick?'fishFedThisHour':g&&fishSupply(g.feed)<amount?'fishNoFeed':'');button('buyFeed',t('fishBuyFeed8'),()=>send('fish.buyFeed',{fishPond:1}),state.coins<8?'noCoins':'');inspect();}
 else if(selected==='aerator'){button('aerate',t(p?.aeratorOn?'fishTurnAirOff':'fishAction_aerate'),()=>send('fish.aerate',{fishPond:1}),!p||!g?'fishNotVisited':!p.aeratorOn&&g.air.starter+g.air.recovery+p.airPaidTicks===0&&state.coins<1?'fishNoEnergy':'');inspect();}
 else if(selected==='water'){button('exchange',t('fishExchange5'),()=>send('fish.exchange',{fishPond:1}),!p||!g?'fishNotVisited':fishSupply(g.water)<200&&state.coins<3?'fishNoWater':'');inspect();}
 else if(selected==='harvest')button('harvest',t('fishAction_harvest'),()=>{},'fishHarvestPending');
 else if(selected==='pond')inspect();
 button('market',t('fishAction_market'),()=>document.dispatchEvent(new Event('marketopen')));
 if(g&&g.stats.inspections>0){const why=document.createElement('p');why.dataset.fishInspection='';const oxygen=(pond?.oxygenMg||0)/4000,tan=(pond?.tanMg||0)/4000;why.textContent=t('fishOxygen')+': '+t(oxygen<3?'fishLow':oxygen<5?'fishWatch':'fishGood')+'. '+t(tan>=1?'fishWasteWatch':'fishWaterSteady')+' '+t('fishWaterDisclaimer');actions.append(why);}
}
