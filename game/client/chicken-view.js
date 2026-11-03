import {t} from './locales.js';
import {iso,diamond} from './isometric.js';
import {YARD,YARD_OBJECTS,coopFootprint} from './chicken-layout.js';
import {bindCamera} from './camera.js';
const NS='http://www.w3.org/2000/svg';
/** @param {string} name @param {Record<string,string|number>} attrs @param {Element} parent */
function node(name,attrs,parent){const el=document.createElementNS(NS,name);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));parent.append(el);return el;}
/** @param {{x:number,y:number,w:number,d:number}} box */
function footprint(box){return [iso(box.x-.5,box.y-.5),iso(box.x+box.w-.5,box.y-.5),iso(box.x+box.w-.5,box.y+box.d-.5),iso(box.x-.5,box.y+box.d-.5)].map(p=>p.x+','+p.y).join(' ');}
/** Original, lightweight yard SVG; it does not advance simulation or persist data. */
export function renderChickenWorld(){
 const host=/** @type {HTMLElement} */(document.querySelector('#world'));host.replaceChildren();
 const svg=node('svg',{viewBox:'0 0 900 540',class:'farm-scene chicken-scene',role:'img','aria-label':t('chickenArea')},host);node('title',{},svg).textContent=t('chickenArea');
 node('ellipse',{cx:450,cy:347,rx:335,ry:138,fill:'#a6bd83',opacity:'.25'},svg);const camera=node('g',{id:'map-camera'},svg);
 node('polygon',{points:'98,236 450,412 802,236 802,263 450,439 98,263',fill:'#8eaa63'},camera);node('polygon',{points:'98,236 450,412 450,439 98,263',fill:'#769455'},camera);
 for(let y=0;y<YARD.size;y++)for(let x=0;x<YARD.size;x++){const p=iso(x,y);node('polygon',{points:diamond(p.x,p.y),fill:(x+y)%3===0?'#cfdb9b':'#c5d690',stroke:'#b8cb80','stroke-width':'.5','data-yard-tile':y*8+x},camera);}
 const edges=[[1,1,7,1],[1,1,1,7],[7,1,7,7],[1,7,7,7]];
 for(const [x1,y1,x2,y2]of edges){const group=node('g',{'data-yard-fence':''},camera),a=iso(x1-.5,y1-.5),b=iso(x2-.5,y2-.5);for(const h of [12,24])node('path',{d:`M${a.x},${a.y-h} L${b.x},${b.y-h}`,stroke:'#a28b58','stroke-width':4},group);for(let i=0;i<=6;i++){const p=iso(x1-.5+(x2-x1)*i/6,y1-.5+(y2-y1)*i/6);node('path',{d:`M${p.x},${p.y+3} v-32`,stroke:'#bba271','stroke-width':6,'stroke-linecap':'round'},group);}}
 node('polygon',{points:footprint(coopFootprint(0)),fill:'#e4ce9c',stroke:'#b9a275','stroke-width':2,'data-coop-footprint':''},camera);
 const ramp=YARD_OBJECTS.ramp;node('polygon',{points:footprint(ramp),fill:'#b99968',stroke:'#967a51','stroke-width':2,'data-yard-ramp':''},camera);
 for(let i=0;i<4;i++){const a=iso(ramp.x-.4+i*.2,ramp.y-.5),b=iso(ramp.x-.4+i*.2,ramp.y+.5);node('path',{d:`M${a.x},${a.y} L${b.x},${b.y}`,stroke:'#d9be8a','stroke-width':2},camera);}
 const caption=document.createElement('p');caption.className='world-caption';caption.textContent=t('chickenArea');host.append(caption);bindCamera(host);
}
