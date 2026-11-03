import {t} from './locales.js';
import {iso as projectIso,diamond} from './isometric.js';
import {YARD,YARD_OBJECTS,HEN_PATH,coopFootprint} from './chicken-layout.js';
import {bindCamera,cameraRotation} from './camera.js';
const iso=(/** @type {number} */x,/** @type {number} */y)=>projectIso(x,y,cameraRotation('chicken'));
const NS='http://www.w3.org/2000/svg';
/** @param {string} name @param {Record<string,string|number>} attrs @param {Element} parent */
function node(name,attrs,parent){const el=document.createElementNS(NS,name);for(const [key,value]of Object.entries(attrs))el.setAttribute(key,String(value));parent.append(el);return el;}
/** @param {{x:number,y:number,w:number,d:number}} box */
function footprint(box){return [iso(box.x-.5,box.y-.5),iso(box.x+box.w-.5,box.y-.5),iso(box.x+box.w-.5,box.y+box.d-.5),iso(box.x-.5,box.y+box.d-.5)].map(p=>p.x+','+p.y).join(' ');}
/** @typedef {{id:string,activity:'idle'|'walk'|'peck'|'drink'|'roost'}} HenView */
/** @typedef {{level:number,doorOpen:boolean,pendingEggs:number,hens?:HenView[],feedG?:number,waterL?:number,cleanliness?:number}} YardSnapshot */
/** @param {Element} camera @param {YardSnapshot} snapshot @param {'feeder'|'drinker'|'clean'} kind */
function careStations(camera,snapshot,kind){
 if(kind==='feeder'){
 const f=iso(YARD_OBJECTS.feeder.x,YARD_OBJECTS.feeder.y),feeder=node('g',{'data-chicken-object':'feeder','aria-label':t('feeder')},camera);node('ellipse',{cx:f.x,cy:f.y+4,rx:24,ry:11,fill:'#9caf70',opacity:'.5'},feeder);node('path',{d:`M${f.x-22},${f.y-15} v17 q22,13 44,0 v-17 Z`,fill:'#b38d53',stroke:'#987642','stroke-width':2},feeder);node('ellipse',{cx:f.x,cy:f.y-15,rx:22,ry:10,fill:'#dbc39a',stroke:'#987642','stroke-width':2},feeder);if((snapshot.feedG||0)>0)for(const dx of [-9,0,9])node('circle',{cx:f.x+dx,cy:f.y-15,r:3,fill:'#d8ad4b'},feeder);
 }else if(kind==='drinker'){
 const w=iso(YARD_OBJECTS.drinker.x,YARD_OBJECTS.drinker.y),drinker=node('g',{'data-chicken-object':'drinker','aria-label':t('drinker')},camera);node('path',{d:`M${w.x-20},${w.y-10} v13 q20,15 40,0 v-13 Z`,fill:'#96b6af',stroke:'#6a928c','stroke-width':2},drinker);node('ellipse',{cx:w.x,cy:w.y-10,rx:20,ry:10,fill:(snapshot.waterL||0)>0?'#75adba':'#d4ded1',stroke:'#6a928c','stroke-width':2},drinker);node('path',{d:`M${w.x-9},${w.y-12} q8,-4 17,0`,fill:'none',stroke:'#e8f1d9','stroke-width':2},drinker);
 }else{
 const c=iso(YARD_OBJECTS.clean.x,YARD_OBJECTS.clean.y),clean=node('g',{'data-chicken-object':'clean','aria-label':t('cleanStation')},camera);node('ellipse',{cx:c.x,cy:c.y+4,rx:18,ry:9,fill:'#d7c38a'},clean);node('path',{d:`M${c.x-4},${c.y+3} l21,-39`,stroke:'#9a7a4f','stroke-width':5,'stroke-linecap':'round'},clean);node('polygon',{points:`${c.x-10},${c.y-10} ${c.x+3},${c.y-4} ${c.x-1},${c.y+9} ${c.x-19},${c.y+1}`,fill:'#d4af5d',stroke:'#b28d43','stroke-width':2},clean);
 }
}
/** @param {Element} parent @param {HenView} hen @param {number} index */
function drawHen(parent,hen,index){
 const spot=HEN_PATH[index%HEN_PATH.length],p=iso(spot.x,spot.y),base=node('g',{transform:`translate(${p.x} ${p.y})`,'data-hen':hen.id,'data-adult-layer':'true','aria-label':t('adultHen')+' '+(index+1)},parent);node('ellipse',{cx:0,cy:4,rx:15,ry:7,fill:'#81995b',opacity:'.3'},base);
 const motion=node('g',{class:'hen-motion','data-activity':hen.activity},base);node('path',{d:'M-6,0 v7 l-5,2 M6,0 v7 l5,2',stroke:'#b58b35','stroke-width':2,'stroke-linecap':'round'},motion);
 node('path',{d:'M-12,-7 l-10,-10 l4,14 Z',fill:'#c8ae76'},motion);node('ellipse',{cx:0,cy:-7,rx:16,ry:11,fill:index%2?'#d9b583':'#fff2cd',stroke:'#a78d5a','stroke-width':1},motion);node('ellipse',{cx:-3,cy:-7,rx:10,ry:6,fill:index%2?'#bc915e':'#ddcc9c'},motion);
 const head=node('g',{class:'hen-head'},motion);node('circle',{cx:12,cy:-19,r:8,fill:index%2?'#e4c797':'#fff2cd'},head);node('path',{d:'M9,-26 q0,-8 4,-3 q6,-8 6,2',fill:'#bd6249'},head);node('polygon',{points:'19,-20 27,-17 19,-14',fill:'#ce9c3d'},head);node('circle',{cx:15,cy:-21,r:1.8,fill:'#304634'},head);node('ellipse',{cx:17,cy:-12,rx:3,ry:4,fill:'#bd6249'},head);
}
/** @param {Element} camera @param {YardSnapshot} snapshot */
function coop(camera,snapshot){
 const box=coopFootprint(snapshot.level),a=iso(box.x-.5,box.y-.5),b=iso(box.x+box.w-.5,box.y-.5),c=iso(box.x+box.w-.5,box.y+box.d-.5),d=iso(box.x-.5,box.y+box.d-.5),h=60;
 const group=node('g',{'data-chicken-object':'coop','data-coop-level':snapshot.level,'data-door':snapshot.doorOpen?'open':'closed','aria-label':t('coop')},camera),center=(a.x+b.x+c.x+d.x)/4;
 const back={x:(a.x+b.x)/2,y:(a.y+b.y)/2-h-30},front={x:(d.x+c.x)/2,y:(d.y+c.y)/2-h-30};
 const walls=[[a,b],[b,c],[c,d],[d,a]].map(([p,q],i)=>({p,q,i})).sort((one,two)=>one.p.y+one.q.y-two.p.y-two.q.y);
 for(const {p,q,i}of walls){const fill=(p.x+q.x)/2<center?'#d7b783':'#bea06e',wall=node('g',{'data-coop-wall':i},group);node('polygon',{points:`${p.x},${p.y} ${q.x},${q.y} ${q.x},${q.y-h} ${p.x},${p.y-h}`,fill,stroke:'#9e8058','stroke-width':2},wall);if(i===0||i===2){const ridge=i===0?back:front;node('polygon',{points:`${p.x},${p.y-h} ${q.x},${q.y-h} ${ridge.x},${ridge.y}`,fill,stroke:'#9e8058','stroke-width':1},wall);}if(i===2){const door={x:d.x*.3+c.x*.7,y:d.y*.3+c.y*.7};node('path',{d:`M${door.x-12},${door.y} v-31 q12,-12 24,0 v31 Z`,fill:snapshot.doorOpen?'#405440':'#9c794e',stroke:'#8c704d','stroke-width':3},wall);}if(i===1)node('circle',{cx:(b.x+c.x)/2,cy:(b.y+c.y)/2-39,r:10,fill:'#e4edcf',stroke:'#8a7854','stroke-width':3},wall);}
 const roofs=[{depth:a.y+d.y,points:`${a.x-4},${a.y-h} ${back.x},${back.y} ${front.x},${front.y} ${d.x-4},${d.y-h}`,fill:'#bf7651'},{depth:b.y+c.y,points:`${back.x},${back.y} ${b.x+4},${b.y-h} ${c.x+4},${c.y-h} ${front.x},${front.y}`,fill:'#965c42'}];for(const roof of roofs.sort((a,b)=>a.depth-b.depth))node('polygon',{points:roof.points,fill:roof.fill,'data-coop-roof':''},group);
 const nest=node('g',{'data-chicken-object':'nest','data-eggs-ready':snapshot.pendingEggs,'aria-label':t('nest')},camera),n={x:d.x+8,y:d.y-12};node('ellipse',{cx:n.x,cy:n.y,rx:26,ry:14,fill:'#a98b51',stroke:'#d2b774','stroke-width':4},nest);node('ellipse',{cx:n.x,cy:n.y-3,rx:21,ry:9,fill:'#7f7144'},nest);for(let i=0;i<Math.min(snapshot.pendingEggs,6);i++)node('ellipse',{cx:n.x-12+(i%3)*11,cy:n.y-8-Math.floor(i/3)*6,rx:5,ry:7,fill:'#fff3d5',stroke:'#ddc895','stroke-width':1,'data-egg':i},nest);
}
/** @param {Element} camera @param {number[]} edge */
function fence(camera,[x1,y1,x2,y2]){const group=node('g',{'data-yard-fence':'','pointer-events':'none'},camera),a=iso(x1-.5,y1-.5),b=iso(x2-.5,y2-.5);for(const h of [12,24])node('path',{d:`M${a.x},${a.y-h} L${b.x},${b.y-h}`,stroke:'#a28b58','stroke-width':4},group);for(let i=0;i<=6;i++){const p=iso(x1-.5+(x2-x1)*i/6,y1-.5+(y2-y1)*i/6);node('path',{d:`M${p.x},${p.y+3} v-32`,stroke:'#bba271','stroke-width':6,'stroke-linecap':'round'},group);}}
/** Original, lightweight yard SVG; it does not advance simulation or persist data. */
/** @param {YardSnapshot} [snapshot] */
export function renderChickenWorld(snapshot={level:0,doorOpen:true,pendingEggs:0}){
 const host=/** @type {HTMLElement} */(document.querySelector('#world'));host.replaceChildren();
 const svg=node('svg',{viewBox:'0 0 900 540',class:'farm-scene chicken-scene',role:'img','aria-label':t('chickenArea')},host);node('title',{},svg).textContent=t('chickenArea');
 node('ellipse',{cx:450,cy:347,rx:335,ry:138,fill:'#a6bd83',opacity:'.25'},svg);const camera=node('g',{id:'map-camera'},svg);
 node('polygon',{points:'98,236 450,412 802,236 802,263 450,439 98,263',fill:'#8eaa63'},camera);node('polygon',{points:'98,236 450,412 450,439 98,263',fill:'#769455'},camera);
 for(let y=0;y<YARD.size;y++)for(let x=0;x<YARD.size;x++){const p=iso(x,y);node('polygon',{points:diamond(p.x,p.y),fill:(x+y)%3===0?'#cfdb9b':'#c5d690',stroke:'#b8cb80','stroke-width':'.5','data-yard-tile':y*8+x},camera);}
 const edges=[[1,1,7,1],[1,1,1,7],[7,1,7,7],[1,7,7,7]].sort((a,b)=>iso((a[0]+a[2])/2,(a[1]+a[3])/2).y-iso((b[0]+b[2])/2,(b[1]+b[3])/2).y);for(const edge of edges.slice(0,2))fence(camera,edge);
 node('polygon',{points:footprint(coopFootprint(snapshot.level)),fill:'#e4ce9c',stroke:'#b9a275','stroke-width':2,'data-coop-footprint':''},camera);
 const ramp=YARD_OBJECTS.ramp;node('polygon',{points:footprint(ramp),fill:'#b99968',stroke:'#967a51','stroke-width':2,'data-yard-ramp':''},camera);
 for(let i=0;i<4;i++){const a=iso(ramp.x-.4+i*.2,ramp.y-.5),b=iso(ramp.x-.4+i*.2,ramp.y+.5);node('path',{d:`M${a.x},${a.y} L${b.x},${b.y}`,stroke:'#d9be8a','stroke-width':2},camera);}
 const box=coopFootprint(snapshot.level),depth=Math.max(...[[box.x-.5,box.y-.5],[box.x+box.w-.5,box.y-.5],[box.x+box.w-.5,box.y+box.d-.5],[box.x-.5,box.y+box.d-.5]].map(([x,y])=>iso(x,y).y));
 const jobs=[{depth,draw:()=>coop(camera,snapshot)}],hens=snapshot.hens||[{id:'chicken.preview.1',activity:'walk'},{id:'chicken.preview.2',activity:'peck'}];for(const [index,hen]of hens.entries()){const p=HEN_PATH[index%HEN_PATH.length];jobs.push({depth:iso(p.x,p.y).y,draw:()=>drawHen(camera,/** @type {HenView} */(hen),index)});}
 for(const id of /** @type {('feeder'|'drinker'|'clean')[]} */(['feeder','drinker','clean'])){const p=YARD_OBJECTS[id];jobs.push({depth:iso(p.x,p.y).y,draw:()=>careStations(camera,snapshot,id)});}for(const job of jobs.sort((a,b)=>a.depth-b.depth))job.draw();for(const edge of edges.slice(2))fence(camera,edge);
 const caption=document.createElement('p');caption.className='world-caption';caption.textContent=t('chickenArea');host.append(caption);bindCamera(host,{area:'chicken',redraw:()=>renderChickenWorld(snapshot)});
}
