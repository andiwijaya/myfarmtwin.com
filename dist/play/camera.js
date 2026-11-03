import {t} from './locales.js';
export const view={x:0,y:0,scale:1};
const clamp=(/** @type {number} */n,/** @type {number} */min,/** @type {number} */max)=>Math.max(min,Math.min(max,n));
function apply(){document.querySelector('#map-camera')?.setAttribute('transform',`translate(${view.x} ${view.y}) translate(450 270) scale(${view.scale}) translate(-450 -270)`);}
/** @param {number} id */
function select(id){document.dispatchEvent(new CustomEvent('plotselect',{detail:id}));}
/** @param {HTMLElement} host */
export function bindCamera(host){
 const svg=/** @type {SVGSVGElement} */(host.querySelector('svg'));svg.setAttribute('role','group');
 /** @type {{x:number,y:number,id:number,plot:number|null,moved:boolean}|null} */let start=null;
 svg.style.touchAction='none';
 svg.addEventListener('pointerdown',e=>{
  if(e.button!==0||!e.isPrimary)return;
  const target=/** @type {Element} */(e.target);const p=target.closest('[data-plot]');
  start={x:e.clientX,y:e.clientY,id:e.pointerId,plot:p?Number(p.getAttribute('data-plot')):null,moved:false};svg.setPointerCapture(e.pointerId);
 });
 svg.addEventListener('pointermove',e=>{if(!start||start.id!==e.pointerId)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>7||start.moved){start.moved=true;view.x=clamp(view.x+dx*900/svg.getBoundingClientRect().width,-180,180);view.y=clamp(view.y+dy*540/svg.getBoundingClientRect().height,-100,100);start.x=e.clientX;start.y=e.clientY;apply();}});
 svg.addEventListener('pointerup',e=>{if(!start||start.id!==e.pointerId)return;const s=start;start=null;if(!s.moved&&s.plot!==null)select(s.plot);if(svg.hasPointerCapture(e.pointerId))svg.releasePointerCapture(e.pointerId);});
 svg.addEventListener('pointercancel',()=>{start=null;});
 host.querySelectorAll('[data-plot]').forEach(p=>{p.setAttribute('tabindex','0');p.setAttribute('role','button');p.setAttribute('aria-label',t('plot')+' '+(Number(p.getAttribute('data-plot'))+1));p.addEventListener('keydown',e=>{const key=/** @type {KeyboardEvent} */(e).key;if(key==='Enter'||key===' '){e.preventDefault();select(Number(p.getAttribute('data-plot')));}});});
 const controls=document.createElement('div');controls.className='camera-controls';
 for(const [label,title,action]of [['−',t('zoomOut'),'out'],['+',t('zoomIn'),'in'],['↺',t('resetView'),'reset']]){
  const b=document.createElement('button');b.type='button';b.textContent=label;b.title=title;b.setAttribute('aria-label',title);b.dataset.camera=action;
  b.addEventListener('click',()=>{if(action==='reset'){view.x=0;view.y=0;view.scale=1;}else view.scale=clamp(view.scale+(action==='in'?.15:-.15),.85,1.75);apply();});controls.append(b);
 }host.append(controls);
 const list=document.createElement('div');list.className='plot-shortcuts';list.setAttribute('aria-label',t('choosePlot'));
 host.querySelectorAll('[data-plot]').forEach(p=>{const id=Number(p.getAttribute('data-plot'));const b=document.createElement('button');b.type='button';b.textContent=t('plot')+' '+(id+1);b.dataset.choosePlot=String(id);b.addEventListener('click',()=>select(id));list.append(b);});host.append(list);apply();
}
