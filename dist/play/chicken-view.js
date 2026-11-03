import {t} from './locales.js';
import {iso,diamond} from './isometric.js';
import {YARD,YARD_OBJECTS,coopFootprint} from './chicken-layout.js';
import {bindCamera} from './camera.js';
const NS='http://www.w3.org/2000/svg';
/** @param {string} name @param {Record<string,string|number>} attrs @param {Element} parent */
function node(name,attrs,parent){const el=document.createElementNS(NS,name);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));parent.append(el);return el;}
/** @param {{x:number,y:number,w:number,d:number}} box */
function footprint(box){return [iso(box.x-.5,box.y-.5),iso(box.x+box.w-.5,box.y-.5),iso(box.x+box.w-.5,box.y+box.d-.5),iso(box.x-.5,box.y+box.d-.5)].map(p=>p.x+','+p.y).join(' ');}
/** @typedef {{level:number,doorOpen:boolean,pendingEggs:number}} YardSnapshot */
/** @param {Element} camera @param {YardSnapshot} snapshot */
function coop(camera,snapshot){
 const box=coopFootprint(snapshot.level),a=iso(box.x-.5,box.y-.5),b=iso(box.x+box.w-.5,box.y-.5),c=iso(box.x+box.w-.5,box.y+box.d-.5),d=iso(box.x-.5,box.y+box.d-.5),h=60;
 const group=node('g',{'data-chicken-object':'coop','data-coop-level':snapshot.level,'data-door':snapshot.doorOpen?'open':'closed','aria-label':t('coop')},camera);
 node('polygon',{points:`${d.x},${d.y} ${c.x},${c.y} ${c.x},${c.y-h} ${d.x},${d.y-h}`,fill:'#d7b783',stroke:'#9e8058','stroke-width':2},group);
 node('polygon',{points:`${b.x},${b.y} ${c.x},${c.y} ${c.x},${c.y-h} ${b.x},${b.y-h}`,fill:'#bea06e',stroke:'#9e8058','stroke-width':2},group);
 const back={x:(a.x+b.x)/2,y:(a.y+b.y)/2-h-30},front={x:(d.x+c.x)/2,y:(d.y+c.y)/2-h-30};
 node('polygon',{points:`${a.x-5},${a.y-h} ${back.x},${back.y} ${front.x},${front.y} ${d.x-5},${d.y-h}`,fill:'#bf7651'},group);
 node('polygon',{points:`${back.x},${back.y} ${b.x+5},${b.y-h} ${c.x+5},${c.y-h} ${front.x},${front.y}`,fill:'#965c42'},group);
 const door={x:d.x*.3+c.x*.7,y:d.y*.3+c.y*.7};node('path',{d:`M${door.x-13},${door.y-4} v-29 q13,-13 26,0 v42 Z`,fill:snapshot.doorOpen?'#405440':'#9c794e',stroke:'#8c704d','stroke-width':3},group);
 node('circle',{cx:(b.x+c.x)/2,cy:(b.y+c.y)/2-39,r:10,fill:'#e4edcf',stroke:'#8a7854','stroke-width':3},group);
 const nest=node('g',{'data-chicken-object':'nest','data-eggs-ready':snapshot.pendingEggs,'aria-label':t('nest')},camera),n={x:d.x+8,y:d.y-12};
 node('ellipse',{cx:n.x,cy:n.y,rx:26,ry:14,fill:'#a98b51',stroke:'#d2b774','stroke-width':4},nest);node('ellipse',{cx:n.x,cy:n.y-3,rx:21,ry:9,fill:'#7f7144'},nest);
 for(let i=0;i<Math.min(snapshot.pendingEggs,6);i++)node('ellipse',{cx:n.x-12+(i%3)*11,cy:n.y-8-Math.floor(i/3)*6,rx:5,ry:7,fill:'#fff3d5',stroke:'#ddc895','stroke-width':1,'data-egg':i},nest);
}
/** Original, lightweight yard SVG; it does not advance simulation or persist data. */
/** @param {YardSnapshot} [snapshot] */
export function renderChickenWorld(snapshot={level:0,doorOpen:true,pendingEggs:0}){
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
 coop(camera,snapshot);
 const caption=document.createElement('p');caption.className='world-caption';caption.textContent=t('chickenArea');host.append(caption);bindCamera(host);
}
