import {t} from './locales.js';import {openGoatContract} from './goat-market.js';import {GOAT} from './goat-config.js';import {goatCapacities} from './goat-state.js';import {goatSaleReason} from './goat-market-policy.js';
/** @typedef {(type:import('./engine.js').CommandType,extra?:Partial<import('./engine.js').Command>)=>unknown} GoatSend */
let expanded='';export function clearGoatDisclosure(){expanded='';}
/** Real commands only. Disclosure openness is bounded presentation state, not simulation state. @param {import('./engine.js').State} state @param {string} selected @param {HTMLElement} host @param {GoatSend} send */
export function renderGoatActions(state,selected,host,send){
 host.replaceChildren();const g=state.goat,q=g?.shelter;if(!g?.visited||!q)return;const goat=g.herd.find(h=>h.id===selected),adult=goat?.growth===1,cap=goatCapacities(g);
 /** @param {string} name @param {string} label @param {()=>void} action @param {string} [reason] */
 function button(name,label,action,reason=''){const b=document.createElement('button');b.type='button';b.className='action-button';b.dataset.goatAction=name;b.textContent=t(label);b.disabled=!!reason;b.addEventListener('click',action);host.append(b);if(reason){const note=document.createElement('p');note.id='goat-action-reason-'+name;note.className='goat-action-reason';note.textContent=t(reason);b.setAttribute('aria-describedby',note.id);b.title=t(reason);host.append(note);}return b;}
 const detail=document.createElement('p');detail.id='goat-inspect-info';detail.hidden=expanded!==selected;const info=goat?(adult?'goatSocialInfo':'goatGrowthTime'):({hay:'goatHayInfo',water:'goatWaterInfo',shelter:'goatShelterInfo',clean:'goatShelterInfo',pasture:'goatBrowseInfo',platform:'goatPlatformInfo',contract:'goatContractInfo'}[selected]||'goatSocialInfo');detail.textContent=t(info)+' '+t('goatModelInfo');
 const inspect=button('inspect','goatInspectAction',()=>{const opening=expanded!==selected;expanded=opening?selected:'';detail.hidden=!opening;inspect.setAttribute('aria-expanded',String(opening));if(goat&&opening)send('inspectGoat',{goatId:goat.id});});inspect.setAttribute('aria-expanded',String(expanded===selected));inspect.setAttribute('aria-controls',detail.id);
 if(selected==='hay')button('feed','goatFeedAction',()=>{send('feedGoats');},g.feederG>=cap.feederG-.00001?'goatRackFull':g.hayStockG<=0?'goatNoHay':'');
 if(selected==='water')button('water','goatWaterAction',()=>{send('waterGoats');},g.troughMl>=cap.troughMl-.00001?'goatTroughFull':state.water<=0?'noWater':'');
 if(selected==='clean'||selected==='shelter')button('clean','goatCleanAction',()=>{send('cleanGoatShelter');},q.cleanliness>=99.999?'goatShelterClean':state.tick-q.lastCleanTick<GOAT.cleanInterval?'goatCleanCooldown':'');
 if(selected==='pasture'){if(g.paddocks.length<2)button('unlock','goatUnlockPaddock',()=>{send('unlockPaddock');},state.coins<GOAT.paddockPrice?'noCoins':'');for(const p of g.paddocks){const b=button('rotate'+p.id,'goatRotate',()=>{send('rotatePaddock',{paddock:p.id});},p.id===g.activePaddock?'goatPaddockActive':'');b.textContent+=' '+(p.id+1);}}
 if(goat)button('sell','goatReviewContract',()=>openGoatContract(goat.id),goatSaleReason(state,goat.id));
 if(selected==='contract')button('market','marketTitle',()=>document.dispatchEvent(new Event('marketopen')));
 host.append(detail);
}
