import {t} from './locales.js';
import {bindCamera} from './camera.js';
import {INITIAL_PLOTS} from './config.js';
const NS='http://www.w3.org/2000/svg';
/** @param {number} x @param {number} y */
export const iso=(x,y)=>({x:450+(x-y)*44,y:82+(x+y)*22});
/** @param {string} name @param {Record<string,string|number>} attrs @param {Element} parent */
function node(name,attrs,parent){const el=document.createElementNS(NS,name);for(const [key,val]of Object.entries(attrs))el.setAttribute(key,String(val));parent.append(el);return el;}
/** @param {number} x @param {number} y @param {number} w @param {number} h */
const diamond=(x,y,w=43,h=21)=>`${x},${y-h} ${x+w},${y} ${x},${y+h} ${x-w},${y}`;
/** @typedef {{id:number,x:number,y:number,crop?:import('./engine.js').Crop|null}} WorldPlot */
/** @type {readonly WorldPlot[]} */
export const initialPlots=INITIAL_PLOTS;
/** @param {readonly WorldPlot[]} [plots] */
export function renderWorld(plots=initialPlots){
 const host=/** @type {HTMLElement} */(document.querySelector('#world'));host.replaceChildren();
 const svg=node('svg',{viewBox:'0 0 900 540',class:'farm-scene',role:'img','aria-label':t('farmMap')},host);
 const title=node('title',{},svg);title.textContent=t('farmMap');
 node('ellipse',{cx:450,cy:347,rx:335,ry:138,fill:'#a6bd83',opacity:'.25'},svg);
 const camera=node('g',{id:'map-camera'},svg);
 node('polygon',{points:'98,236 450,412 802,236 802,263 450,439 98,263',fill:'#8eaa63'},camera);
 node('polygon',{points:'98,236 450,412 450,439 98,263',fill:'#769455'},camera);
 for(let y=0;y<8;y++)for(let x=0;x<8;x++){
  const p=iso(x,y);node('polygon',{points:diamond(p.x,p.y),fill:(x+y)%3===0?'#bfce8a':'#b7cb80','data-tile':y*8+x,stroke:'#a6bd70','stroke-width':'.5'},camera);
 }
 for(const [x,y]of [[1,0],[6,0],[0,5],[7,6],[1,7]]){
  const p=iso(x,y),g=node('g',{'data-decoration':'tree'},camera);
  node('ellipse',{cx:p.x,cy:p.y+5,rx:22,ry:10,fill:'#6e935e',opacity:'.3'},g);
  node('path',{d:`M ${p.x-3} ${p.y} v-35 h7 v35`,fill:'#89724b'},g);
  node('polygon',{points:`${p.x},${p.y-92} ${p.x+30},${p.y-28} ${p.x},${p.y-16} ${p.x-29},${p.y-29}`,fill:'#4e8550'},g);
  node('polygon',{points:`${p.x},${p.y-92} ${p.x},${p.y-16} ${p.x-29},${p.y-29}`,fill:'#3f7047'},g);
 }
 for(const p of plots){
  const c=iso(p.x,p.y),g=node('g',{'data-plot':p.id,class:'plot'},camera);
  node('polygon',{points:diamond(c.x,c.y,40,19),fill:'#775238',stroke:'#bd9464','stroke-width':4},g);
  for(let row=-1;row<=1;row++)node('path',{d:`M${c.x-24+row*8},${c.y+row*4-9} l35,17`,stroke:'#936744','stroke-width':3,'stroke-linecap':'round'},g);
  if(p.crop){const crop=node('g',{'data-crop':p.crop.type,'data-stage':p.crop.stage},g);node('path',{d:`M${c.x},${c.y} v-14`,stroke:'#386740','stroke-width':3},crop);node('ellipse',{cx:c.x-5,cy:c.y-12,rx:7,ry:3,fill:'#74a348',transform:`rotate(25 ${c.x-5} ${c.y-12})`},crop);node('ellipse',{cx:c.x+6,cy:c.y-17,rx:8,ry:4,fill:'#8db653',transform:`rotate(-30 ${c.x+6} ${c.y-17})`},crop);}
  else{const n=node('text',{x:c.x,y:c.y+5,'text-anchor':'middle',class:'bed-number'},g);n.textContent=String(p.id+1);}
 }
 const w=iso(1,2),well=node('g',{'data-facility':'well'},camera);
 node('ellipse',{cx:w.x,cy:w.y+6,rx:27,ry:13,fill:'#819a68',opacity:'.4'},well);
 node('path',{d:`M${w.x-22},${w.y-20} v24 q22,16 44,0 v-24`,fill:'#b5c2bd',stroke:'#8b9f94','stroke-width':2},well);
 node('ellipse',{cx:w.x,cy:w.y-20,rx:22,ry:10,fill:'#cbd5c8',stroke:'#8b9f94','stroke-width':3},well);
 node('ellipse',{cx:w.x,cy:w.y-20,rx:15,ry:6,fill:'#719fa9'},well);
 node('path',{d:`M${w.x-23},${w.y-17} v-40 m46,40 v-40`,stroke:'#957348','stroke-width':5},well);
 node('polygon',{points:`${w.x-34},${w.y-54} ${w.x},${w.y-76} ${w.x+34},${w.y-54} ${w.x},${w.y-44}`,fill:'#a96745'},well);
 const m=iso(5,1),market=node('g',{'data-facility':'market'},camera);
 node('path',{d:`M${m.x-25},${m.y} v-52 m50,52 v-52`,stroke:'#94774e','stroke-width':5},market);
 node('rect',{x:m.x-43,y:m.y-76,width:86,height:48,rx:5,fill:'#365c43',stroke:'#d1b77c','stroke-width':5},market);
 const label=node('text',{x:m.x,y:m.y-47,'text-anchor':'middle',fill:'#fff8dc','font-size':14,'font-weight':700},market);label.textContent=t('market');
 const bed=iso(5,4);node('polygon',{points:diamond(bed.x,bed.y,37,18),fill:'none',stroke:'#7e9c65','stroke-width':2,'stroke-dasharray':'5 5'},camera);
 const plus=node('text',{x:bed.x,y:bed.y+6,'text-anchor':'middle',fill:'#71905e','font-size':24},camera);plus.textContent='+';
 const caption=document.createElement('p');caption.className='world-caption';caption.textContent=t('farmMap');host.append(caption);
 bindCamera(host);
}
