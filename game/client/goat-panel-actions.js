import {t} from './locales.js';
/** Contextual presentation only until the M2/M3 command gates. */
/** @param {string} selected @param {HTMLElement} host */
export function renderGoatActions(selected,host){
 host.replaceChildren();const adult=selected==='goat.starter.adult',animal=selected.startsWith('goat.');
 /** @param {string} name @param {string} label @param {()=>void} action @param {string} [reason] */
 function button(name,label,action,reason=''){const b=document.createElement('button');b.type='button';b.className='action-button';b.dataset.goatAction=name;b.textContent=t(label);b.disabled=!!reason;b.addEventListener('click',action);host.append(b);if(reason){const note=document.createElement('p');note.id='goat-action-reason-'+name;note.className='goat-action-reason';note.textContent=t(reason);b.setAttribute('aria-describedby',note.id);b.title=t(reason);host.append(note);}return b;}
 const detail=document.createElement('p');detail.id='goat-inspect-info';detail.hidden=true;
 const info=animal?(adult?'goatSocialInfo':'goatGrowthInfo'):({hay:'goatHayInfo',water:'goatWaterInfo',shelter:'goatShelterInfo',clean:'goatShelterInfo',pasture:'goatBrowseInfo',platform:'goatPlatformInfo',contract:'goatContractInfo'}[selected]||'goatSocialInfo');detail.textContent=t(info)+' '+t('goatModelInfo');
 const inspect=button('inspect','goatInspectAction',()=>{detail.hidden=!detail.hidden;inspect.setAttribute('aria-expanded',String(!detail.hidden));});inspect.setAttribute('aria-expanded','false');inspect.setAttribute('aria-controls',detail.id);
 if(selected==='hay')button('feed','goatFeedAction',()=>{},'goatKitPending');
 if(selected==='water')button('water','goatWaterAction',()=>{},'goatKitPending');
 if(selected==='clean'||selected==='shelter')button('clean','goatCleanAction',()=>{},'goatKitPending');
 if(animal)button('sell','goatSellAction',()=>{},adult?'goatNoContract':'goatNotReady');
 if(selected==='contract')button('market','marketTitle',()=>document.dispatchEvent(new Event('marketopen')));
 host.append(detail);
}
