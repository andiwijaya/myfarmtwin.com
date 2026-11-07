import {WORLD_BOUNDS,ZONE_REGISTRY} from './unified-world-registry.js';
import {WORLD_PATHS,MARKET_PLAZA,zoneLabel} from './unified-world-layout.js';
export const MINIMAP_SIZE=294;
/** North-up UI projection of the actual shared world registry. @param {{x:number,z:number}} point */
export function minimapPoint(point){return Object.freeze({x:22+(point.x-WORLD_BOUNDS.minX)*5,y:22+(point.z-WORLD_BOUNDS.minZ)*5});}
/** HTML navigation, never a second Three scene/camera or a simulation input.
 * @param {{go:(zone:string)=>void}} options */
export function createWorldMinimap(options){
 const root=document.createElement('details'),summary=document.createElement('summary'),map=document.createElement('nav');root.id='world-minimap';root.className='world-minimap';map.className='world-minimap-map';root.append(summary,map);
 const close=document.createElement('button');close.type='button';close.className='world-minimap-close';close.dataset.worldMinimapClose='true';close.textContent='×';close.addEventListener('click',()=>{root.open=false;summary.focus({preventScroll:true});});map.append(close);root.addEventListener('keydown',event=>{if(event.key==='Escape'&&root.open){event.preventDefault();event.stopPropagation();root.open=false;summary.focus({preventScroll:true});}});
 for(const path of [MARKET_PLAZA,...WORLD_PATHS]){const p=minimapPoint(path),road=document.createElement('span');road.className='world-minimap-path';road.style.cssText=`left:${p.x-path.width*2.5}px;top:${p.y-path.depth*2.5}px;width:${path.width*5}px;height:${path.depth*5}px`;map.append(road);}
 const buttons=/** @type {Map<string,HTMLButtonElement>} */(new Map());for(const [zone,entry]of Object.entries(ZONE_REGISTRY)){const p=minimapPoint(entry.anchor),button=document.createElement('button');button.type='button';button.dataset.worldGo=zone;button.style.left=p.x-22+'px';button.style.top=p.y-22+'px';button.addEventListener('click',()=>{root.open=false;options.go(zone);});buttons.set(zone,button);map.append(button);}
 return{
  root,
  /** @param {string} locale */
  update(locale){const id=locale==='id',short=/** @type {Record<string,string>} */(id?{field:'Kebun',chicken:'Ayam',goat:'Kambing',cow:'Sapi',fish:'Ikan',market:'Pasar',future:'Lahan'}:{field:'Crops',chicken:'Chicken',goat:'Goats',cow:'Cows',fish:'Fish',market:'Market',future:'Land'});summary.textContent=id?'Ke area':'Go to';close.setAttribute('aria-label',id?'Tutup peta kecil':'Close minimap');map.setAttribute('aria-label',id?'Peta kecil, utara di atas. Fokus kamera ke area.':'Minimap, north up. Focus camera on an area.');for(const [zone,button]of buttons){button.textContent=short[zone];button.setAttribute('aria-label',(id?'Fokus kamera: ':'Focus camera: ')+zoneLabel(zone,locale));}},
  /** @param {string} zone */
  focus(zone){for(const [id,button]of buttons)if(id===zone)button.setAttribute('aria-current','location');else button.removeAttribute('aria-current');}
 };
}
