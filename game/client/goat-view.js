import {t} from './locales.js';
import {iso,diamond} from './isometric.js';
import {GOAT_LAYOUT as L} from './goat-layout.js';
const NS='http://www.w3.org/2000/svg';
/** @param {string} name @param {Record<string,string|number>} attrs @param {Element} parent */
function node(name,attrs,parent){const child=document.createElementNS(NS,name);for(const [key,value]of Object.entries(attrs))child.setAttribute(key,String(value));parent.append(child);return child;}
/** @param {{x:number,y:number,w:number,d:number}} box */
function corners(box){return [iso(box.x-.5,box.y-.5),iso(box.x+box.w-.5,box.y-.5),iso(box.x+box.w-.5,box.y+box.d-.5),iso(box.x-.5,box.y+box.d-.5)];}
/** @param {{x:number,y:number}[]} points */
const points=points=>points.map(p=>p.x+','+p.y).join(' ');
/** @param {Element} parent @param {number[]} edge */
function fence(parent,[x1,y1,x2,y2]){const g=node('g',{'data-goat-fence':'','pointer-events':'none'},parent),a=iso(x1,y1),b=iso(x2,y2);for(const h of [12,25])node('path',{d:`M${a.x},${a.y-h} L${b.x},${b.y-h}`,stroke:'#a18d62','stroke-width':4},g);for(let i=0;i<7;i++){const p=iso(x1+(x2-x1)*i/6,y1+(y2-y1)*i/6);node('path',{d:`M${p.x},${p.y+3} v-34`,stroke:'#bca779','stroke-width':6,'stroke-linecap':'round'},g);}}
/** @param {Element} parent */
function shelter(parent){const [a,b,c,d]=corners(L.shelter),h=54,g=node('g',{'data-goat-shelter':'goat.shelter.1','data-shelter-level':0,'aria-label':t('goatShelter')},parent);node('polygon',{points:points([a,b,c,d]),fill:'#ddc795',stroke:'#bda574'},g);for(const [p,q]of [[b,c],[c,d]]){node('polygon',{points:points([p,q,{x:q.x,y:q.y-h},{x:p.x,y:p.y-h}]),fill:p===b?'#b49c70':'#cdb383',stroke:'#9c8159','stroke-width':2},g);}const center={x:(c.x+d.x)/2,y:(c.y+d.y)/2};node('path',{d:`M${center.x-17},${center.y} v-37 h34 v37`,fill:'#485d43',stroke:'#9c8159','stroke-width':3},g);node('polygon',{points:points([a,b,c,d].map(p=>({x:p.x,y:p.y-h}))),fill:'#9c6b4c',stroke:'#79563e','stroke-width':3},g);for(let i=1;i<5;i++){const r=i/5,p={x:a.x+(d.x-a.x)*r,y:a.y+(d.y-a.y)*r-h},q={x:b.x+(c.x-b.x)*r,y:b.y+(c.y-b.y)*r-h};node('path',{d:`M${p.x},${p.y} L${q.x},${q.y}`,stroke:'#bb8e63','stroke-width':2},g);}node('text',{x:center.x,y:center.y-43,'text-anchor':'middle','font-size':11,fill:'#fff4d8'},g).textContent=t('goatShelter');}
/** @param {Element} parent */
function pasture(parent){const g=node('g',{'data-goat-station':'pasture','aria-label':t('goatBrowse')},parent);node('polygon',{points:points(corners(L.pasture)),fill:'#a7c079',stroke:'#7f9f58','stroke-width':2},g);for(let i=0;i<10;i++){const p=iso(1.2+(i%5)*.58,4.2+Math.floor(i/5)*1.3);node('path',{d:`M${p.x-5},${p.y+3} q1,-15 5,-6 q4,-13 9,-7`,fill:'none',stroke:'#5e874b','stroke-width':2},g);}for(const [x,y]of [[1.4,4.8],[2.8,5.9],[3.6,4.5]]){const p=iso(x,y);node('path',{d:`M${p.x},${p.y} v-24`,stroke:'#8e8556','stroke-width':3},g);for(const [dx,dy]of [[-10,-18],[1,-25],[11,-19]])node('ellipse',{cx:p.x+dx,cy:p.y+dy,rx:12,ry:8,fill:'#78a25e',stroke:'#5d864b'},g);}}
/** @param {Element} parent */
function stations(parent){
 const hay=iso(L.hay.x,L.hay.y),h=node('g',{'data-goat-station':'hay','aria-label':t('goatHayRack')},parent);node('path',{d:`M${hay.x-26},${hay.y-30} l5,36 M${hay.x+26},${hay.y-30} l-5,36`,stroke:'#997a50','stroke-width':5},h);node('path',{d:`M${hay.x-27},${hay.y-27} l8,22 h38 l8,-22 Z`,fill:'#d8bd76',stroke:'#967c50','stroke-width':3},h);for(const dx of [-16,-7,2,11,20])node('path',{d:`M${hay.x+dx},${hay.y-25} l-5,17`,stroke:'#ad8b4e','stroke-width':2},h);
 const water=iso(L.water.x,L.water.y),w=node('g',{'data-goat-station':'water','aria-label':t('goatTrough')},parent);node('path',{d:`M${water.x-29},${water.y-11} v14 q29,18 58,0 v-14 Z`,fill:'#9bb5a8',stroke:'#648c82','stroke-width':2},w);node('ellipse',{cx:water.x,cy:water.y-11,rx:29,ry:12,fill:'#d5e0d1',stroke:'#648c82','stroke-width':2},w);
 const clean=iso(L.clean.x,L.clean.y),c=node('g',{'data-goat-station':'clean','aria-label':t('goatCleanStation')},parent);node('path',{d:`M${clean.x},${clean.y+2} l20,-37`,stroke:'#a68a5b','stroke-width':4},c);node('path',{d:`M${clean.x-5},${clean.y-7} l14,7 l-5,9 l-18,-8 Z`,fill:'#ddbd70',stroke:'#a68a5b','stroke-width':2},c);
 const [a,b,d,e]=corners(L.platform),platform=node('g',{'data-goat-station':'platform','aria-label':t('goatPlatform')},parent);node('polygon',{points:points([a,b,d,e].map(p=>({x:p.x,y:p.y-12}))),fill:'#c2aa74',stroke:'#9b845c','stroke-width':2},platform);for(const p of [b,d,e])node('path',{d:`M${p.x},${p.y-12} v16`,stroke:'#8d7951','stroke-width':4},platform);
 const sign=iso(L.contract.x,L.contract.y),s=node('g',{'data-goat-station':'contract','aria-label':t('goatContract')},parent);node('path',{d:`M${sign.x},${sign.y+5} v-51`,stroke:'#a28a5f','stroke-width':5},s);node('rect',{x:sign.x-36,y:sign.y-51,width:72,height:28,rx:4,fill:'#e6d5ab',stroke:'#ad9566','stroke-width':2},s);node('text',{x:sign.x,y:sign.y-34,'text-anchor':'middle','font-size':10,fill:'#37523b'},s).textContent=t('goatContract');
}
/** Original SVG presentation. No gameplay clock, grants or persistence. */
export function renderGoatWorld(){
 const host=/** @type {HTMLElement} */(document.querySelector('#world'));
 host.replaceChildren();const svg=node('svg',{viewBox:'0 0 900 540',class:'farm-scene goat-scene',role:'img','aria-label':t('goatArea')},host);node('title',{},svg).textContent=t('goatArea');node('ellipse',{cx:450,cy:355,rx:337,ry:137,fill:'#94ad74',opacity:'.23'},svg);const camera=node('g',{id:'map-camera'},svg);
 node('polygon',{points:'98,236 450,412 802,236 802,263 450,439 98,263',fill:'#91a96d'},camera);for(let y=0;y<L.size;y++)for(let x=0;x<L.size;x++){const p=iso(x,y);node('polygon',{points:diamond(p.x,p.y),fill:(x+y)%4===0?'#d3dfac':'#c6d89c',stroke:'#b4c98c','stroke-width':'.5','data-goat-tile':y*L.size+x},camera);}
 const edges=[[.3,.3,6.8,.3],[.3,.3,.3,6.8],[6.8,.3,6.8,6.8],[.3,6.8,6.8,6.8]];for(const edge of edges.slice(0,2))fence(camera,edge);pasture(camera);shelter(camera);stations(camera);
 const foreground=node('g',{'data-goat-foreground':''},camera);for(const edge of edges.slice(2))fence(foreground,edge);
}
