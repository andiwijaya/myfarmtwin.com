import {selectedFishPond} from './fish-selection.js';
import {t} from './locales.js';
import {fishPondScene} from './fish-scene.js';
import {fishSnapshot} from './fish-snapshot.js';
import {bindCamera,cameraRotation} from './camera.js';
/** Presentation-only area; no clock, RNG, grants or persistence. @param {import('./engine.js').State} state */
export function renderFishWorld(state){
 const host=/** @type {HTMLElement} */(document.querySelector('#world'));host.replaceChildren();
 const snapshot=fishSnapshot(state),pond=snapshot.ponds.find(p=>p.id===selectedFishPond(state))||snapshot.ponds[0],source=new DOMParser().parseFromString(fishPondScene(cameraRotation('fish'),pond?.cohorts||[],{feeding:pond?.feeding,aerator:pond?.aerating,efficient:pond?.efficient,biofilter:pond?.biofilter,autoFeeder:pond?.autoFeeder}),'image/svg+xml');
 const svg=/** @type {SVGSVGElement} */(/** @type {unknown} */(document.importNode(source.documentElement,true)));
 svg.setAttribute('viewBox','0 0 900 540');svg.setAttribute('class','farm-scene fish-scene');svg.dataset.paused=String(state.paused);svg.setAttribute('aria-label',t('fishArea'));svg.setAttribute('data-fish-pond',String(pond.id));
 const ns='http://www.w3.org/2000/svg',title=document.createElementNS(ns,'title');title.textContent=t(snapshot.preview?'fishPreview':'fishArea');svg.prepend(title);
 const map=document.createElementNS(ns,'g');map.id='map-camera';for(const child of [...svg.children])if(!['defs','title'].includes(child.tagName))map.append(child);svg.append(map);host.append(svg);if((pond?.clarity??1000)<500)svg.querySelector('[data-fish-water]')?.setAttribute('fill','#91ad8d');
 const copy=document.createElement('p');copy.className='world-caption fish-preview-copy';copy.textContent=(snapshot.preview?t('fishPreview')+' · ':'')+pond.count+' '+t('fishCount')+' · '+pond.ready+' '+t('fishReady');copy.dataset.fishCount=String(pond.count);copy.dataset.fishReady=String(pond.ready);host.append(copy);
 const info=document.createElement('p');info.className='fish-school-note';info.textContent=t('fishSchoolHint');host.append(info);if(!snapshot.preview&&pond.count===0){const empty=document.createElement('p');empty.id='fish-empty';empty.className='fish-school-note';empty.textContent=t('fishEmpty');host.append(empty);}
 host.querySelectorAll('[data-fish-object]').forEach(object=>{const id=object.getAttribute('data-fish-object')||'';object.setAttribute('aria-label',t('fishStation_'+id));});
 bindCamera(host,{area:'fish',redraw:()=>renderFishWorld(state)});
}
