import {t} from './locales.js';
import {bindCamera} from './camera.js';
import {INITIAL_PLOTS,PUMP} from './config.js';
import {pumpCovers} from './engine.js';
const NS='http://www.w3.org/2000/svg';
/** @param {number} x @param {number} y */
export const iso=(x,y)=>({x:450+(x-y)*44,y:82+(x+y)*22});
/** @param {string} name @param {Record<string,string|number>} attrs @param {Element} parent */
function node(name,attrs,parent){const el=document.createElementNS(NS,name);for(const [key,val]of Object.entries(attrs))el.setAttribute(key,String(val));parent.append(el);return el;}
/** @param {number} x @param {number} y @param {number} w @param {number} h */
const diamond=(x,y,w=43,h=21)=>`${x},${y-h} ${x+w},${y} ${x},${y+h} ${x-w},${y}`;
/** @typedef {{id:number,x:number,y:number,crop?:import('./engine.js').Crop|null,soilWaterMm?:number,soilCapacityMm?:number,lastWaterTick?:number}} WorldPlot */
/** @type {readonly WorldPlot[]} */
export const initialPlots=INITIAL_PLOTS;
/** @param {readonly WorldPlot[]} [plots] @param {number} [tick] @param {{built:boolean,on:boolean}} [pump] */
export function renderWorld(plots=initialPlots,tick=0,pump={built:false,on:false}){
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
 if(pump.built)for(const p of plots.filter(pumpCovers)){const c=iso(p.x,p.y);node('polygon',{points:diamond(c.x,c.y,44,22),fill:'none',stroke:'#589ca6','stroke-width':3,'stroke-dasharray':'5 4','data-irrigation-range':p.id},camera);}
 for(const [x,y]of [[1,0],[6,0],[0,5],[7,6],[1,7]]){
  const p=iso(x,y),g=node('g',{'data-decoration':'tree'},camera);
  node('ellipse',{cx:p.x,cy:p.y+5,rx:22,ry:10,fill:'#6e935e',opacity:'.3'},g);
  node('path',{d:`M ${p.x-3} ${p.y} v-35 h7 v35`,fill:'#89724b'},g);
  node('polygon',{points:`${p.x},${p.y-92} ${p.x+30},${p.y-28} ${p.x},${p.y-16} ${p.x-29},${p.y-29}`,fill:'#4e8550'},g);
  node('polygon',{points:`${p.x},${p.y-92} ${p.x},${p.y-16} ${p.x-29},${p.y-29}`,fill:'#3f7047'},g);
 }
 for(const p of plots){
  const moisture=100*(p.soilWaterMm??12)/(p.soilCapacityMm??50),c=iso(p.x,p.y),g=node('g',{'data-plot':p.id,'data-moisture':Math.round(moisture),class:'plot'},camera);
  node('polygon',{points:diamond(c.x,c.y,40,19),fill:moisture>=40?'#614d38':'#92704a',stroke:'#bd9464','stroke-width':4},g);
  for(let row=-1;row<=1;row++)node('path',{d:`M${c.x-24+row*8},${c.y+row*4-9} l35,17`,stroke:'#936744','stroke-width':3,'stroke-linecap':'round'},g);
  if(p.crop){
   const stage=p.crop.stage,crop=node('g',{'data-crop':p.crop.type,'data-stage':stage,'data-growth':Math.floor(p.crop.progress*100),'data-quality':Math.round(p.crop.quality*100)},g),scale=.55+stage*.24,leafDark=p.crop.quality<.65?'#8b8644':'#5d964c',leafLight=p.crop.quality<.65?'#b6ac66':'#8ab455';
   if(stage===3)node('ellipse',{cx:c.x,cy:c.y+1,rx:26,ry:12,fill:'none',stroke:'#f4d576','stroke-width':3,class:'harvest-ring'},crop);
   for(const [dx,dy]of [[-15,-5],[0,3],[15,-4]]){
    const x=c.x+dx,y=c.y+dy,plant=node('g',{transform:`translate(${x} ${y}) scale(${scale})`},crop);
    if(p.crop.type==='tomato'&&stage>1){node('path',{d:'M0,1 V-38 M0,-20 L-12,-27 M0,-27 L12,-35',stroke:'#487748','stroke-width':3},plant);for(const [tx,ty]of [[-10,-25],[10,-33],[3,-17]]){node('ellipse',{cx:tx,cy:ty,rx:8,ry:4,fill:'#61914e'},plant);node('circle',{cx:tx-2,cy:ty+6,r:5,fill:stage===3?'#d57945':'#9db663'},plant);}}
    else{node('path',{d:'M0,0 V-12',stroke:'#487748','stroke-width':3},plant);node('ellipse',{cx:-5,cy:-9,rx:8,ry:5,fill:leafDark,transform:'rotate(25 -5 -9)'},plant);node('ellipse',{cx:6,cy:-14,rx:9,ry:5,fill:leafLight,transform:'rotate(-30 6 -14)'},plant);if(stage>0){node('ellipse',{cx:0,cy:-13,rx:5,ry:10,fill:leafLight},plant);node('ellipse',{cx:0,cy:-7,rx:7,ry:5,fill:leafDark},plant);}}
   }
  }
  else{const n=node('text',{x:c.x,y:c.y+5,'text-anchor':'middle',class:'bed-number'},g);n.textContent=String(p.id+1);}
  if(p.lastWaterTick===tick){const splash=node('text',{x:c.x+22,y:c.y-24,fill:'#387f9b','font-size':22,class:'water-splash','aria-hidden':'true'},g);splash.textContent='◆';}
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
 const bed=iso(PUMP.x,PUMP.y);
 if(pump.built){const g=node('g',{'data-facility':'pump','data-on':String(pump.on)},camera);node('path',{d:`M${bed.x},${bed.y} l-42,-21 l-44,-22`,fill:'none',stroke:pump.on?'#619eb0':'#8c9a92','stroke-width':5,'stroke-dasharray':pump.on?'6 4':'none',class:pump.on?'pump-flow':''},g);node('polygon',{points:diamond(bed.x,bed.y,25,12),fill:'#a6b7a8'},g);node('rect',{x:bed.x-14,y:bed.y-28,width:28,height:27,rx:5,fill:'#6c9c9f',stroke:'#476f75','stroke-width':2},g);node('ellipse',{cx:bed.x,cy:bed.y-28,rx:14,ry:7,fill:'#c3ded6'},g);node('circle',{cx:bed.x+10,cy:bed.y-10,r:4,fill:pump.on?'#d8eb8c':'#778b83'},g);}
 else{node('polygon',{points:diamond(bed.x,bed.y,37,18),fill:'none',stroke:'#7e9c65','stroke-width':2,'stroke-dasharray':'5 5'},camera);const plus=node('text',{x:bed.x,y:bed.y+6,'text-anchor':'middle',fill:'#71905e','font-size':24},camera);plus.textContent='+';}
 const caption=document.createElement('p');caption.className='world-caption';caption.textContent=t('farmMap');host.append(caption);
 bindCamera(host);
}
