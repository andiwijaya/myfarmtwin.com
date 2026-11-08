import {openGameSession} from './game-session.js';
import {chickenSnapshot} from './chicken-snapshot.js';import {goatSnapshot} from './goat-scene-snapshot.js';import {cowSnapshot} from './cow-scene-snapshot.js';import {fishSnapshot} from './fish-snapshot.js';import {ownsFishFeeder} from './fish-feeder.js';import {pumpCovers} from './engine.js';

/** @type {Promise<Awaited<ReturnType<typeof prepare>>>|null} */
let pending=null;
/** @param {Promise<typeof import('./unified-world-preview.js')>} [renderer] */
async function prepare(renderer=import('./unified-world-preview.js')){
 const [api,shared]=await Promise.all([renderer,openGameSession()]),state=shared.state,world=document.querySelector('#world');if(!(world instanceof HTMLElement))throw Error('Original farm map unavailable');
 const host=document.createElement('section');host.id='unified-preview';let locale=navigator.language.startsWith('id')?'id':'en',low=false;try{const saved=localStorage.getItem('myfarmtwin.locale');if(saved)locale=saved==='id'?'id':'en';low=localStorage.getItem('myfarmtwin.graphics')==='low';}catch{/* Optional UI preferences. */}
 const language=document.querySelector('#language');if(language instanceof HTMLSelectElement)language.value=locale;document.documentElement.lang=locale;
 let release=()=>{};
 /** @type {Promise<void>} */
 const wait=new Promise(resolve=>{release=()=>resolve();});const assetLoadGate={wait,release:()=>release()};
 const presentation=api.createWorldPresentation(),previewOptions=/** @type {NonNullable<Parameters<typeof api.mountUnifiedPreview>[3]>} */({assetLoadGate,lowGraphics:low,chickenView:chickenSnapshot,goatView:goatSnapshot,cowView:cowSnapshot,fishView:next=>({snapshot:fishSnapshot(next),feederIds:next.fish?.ponds.filter(p=>ownsFishFeeder(next,p.id)).map(p=>p.id)||[]}),pumpCoverage:next=>next.plots.filter(pumpCovers).map(p=>p.id),onFocusZone:zone=>{presentation.focus(zone);shell?.focusZone(zone);}}),shellOptions=/** @type {NonNullable<Parameters<typeof api.createWorldShell>[0]>} */({isLoading:()=>true});
 /** @type {ReturnType<typeof api.mountUnifiedPreview>|null} */
 let preview=null;
 /** @type {ReturnType<typeof api.createWorldShell>|null} */
 let shell=null;
 const disabled=/** @type {{node:HTMLButtonElement|HTMLSelectElement,disabled:boolean}[]} */([]),notice=document.createElement('p');notice.id='world-startup';notice.className='world-startup';notice.setAttribute('role','status');notice.textContent=locale==='id'?'Peta siap dijelajahi. Sedang menyiapkan kontrol perawatan.':'Explore the map. Loading care controls.';
 let controlsReady=false,assetsFinished=false;
 /** @param {number} ready @param {number} total @param {number} errors */
 function assetProgress(ready,total,errors){if(!controlsReady||assetsFinished)return;if(ready>=total){assetsFinished=true;notice.remove();}else notice.textContent=errors?(locale==='id'?'Sebagian grafis hewan gagal dimuat. Kontrol perawatan tetap tersedia.':'Some animal art could not load. Care controls remain available.'):(locale==='id'?'Memuat grafis hewan: ':'Loading animal art: ')+ready+'/'+total;dispatchEvent(new Event('resize'));}
 previewOptions.onAssetProgress=assetProgress;previewOptions.onDispose=()=>restoreControls();
 function restoreControls(remove=true){for(const {node,disabled:value}of disabled)node.disabled=value;disabled.length=0;if(remove)notice.remove();}
 try{
  for(const id of ['hud-day','hud-coins','hud-water','hud-seeds']){const node=document.getElementById(id);if(node)node.textContent=String(id==='hud-day'?Math.floor(state.tick/24)+1:id==='hud-coins'?state.coins:id==='hud-water'?Math.floor(state.water):state.seeds.lettuce+state.seeds.tomato);}
  world.replaceChildren(host);world.hidden=false;world.classList.add('unified-world');preview=api.mountUnifiedPreview(host,state,locale,previewOptions);shell=api.createWorldShell(shellOptions);shell.update(locale);const bar=host.querySelector('.world-map-bar');bar?.after(notice);
  for(const node of document.querySelectorAll('#pause,#speed,#next-day,#language,#world-menus button,#world-current-task'))if(node instanceof HTMLButtonElement||node instanceof HTMLSelectElement){disabled.push({node,disabled:node.disabled});node.disabled=true;}
  const weather=document.querySelector('#weather-event');if(weather instanceof HTMLElement)weather.hidden=true;
  shellOptions.onGoTo=zone=>preview?.focusZone(zone);shellOptions.onReveal=rect=>preview?.revealSelection(rect);shellOptions.onCloseContext=()=>preview?.clearSelection();host.dataset.controlsReady='false';
  const firstPaint=new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
  return {host,preview,shell,presentation,previewOptions,shellOptions,firstPaint,fail(){assetLoadGate.release();notice.setAttribute('role','alert');notice.textContent=locale==='id'?'Kontrol perawatan gagal dimuat. Muat ulang halaman. ':'Care controls could not load. Reload this page. ';const reload=document.createElement('a');reload.href=location.href;reload.textContent=locale==='id'?'Muat ulang':'Reload';notice.append(reload);},finish(){assetLoadGate.release();shellOptions.isLoading=()=>false;controlsReady=true;restoreControls(false);assetProgress(Number(host.dataset.spriteReady),Number(host.dataset.spriteActors),Number(host.dataset.spriteErrors));if(weather instanceof HTMLElement)weather.hidden=false;host.dataset.controlsReady='true';dispatchEvent(new Event('resize'));}};
 }catch(error){assetLoadGate.release();restoreControls();shell?.dispose();preview?.dispose();host.remove();world.classList.remove('unified-world');document.documentElement.classList.remove('unified-preview-requested');throw error;}
}
/** @param {Promise<typeof import('./unified-world-preview.js')>} [renderer] */
export function prepareUnifiedWorld(renderer){return pending??=prepare(renderer);}
