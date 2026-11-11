import {WORLD_ART} from './unified-world-art.js';
/** @typedef {{x:number,y:number,z:number,w:number,h:number,d:number,color:string,rx:number,ry:number,rz:number,leaf:boolean,plant:number,feature:string,shape:import('./unified-world-environment.js').EnvironmentPart['shape']}} CropPart */
/** Original bounded crop art. Native type/stage is the only growth input.
 * Leaf/root positions share the existing soil surface; no elapsed-time growth.
 * @param {Readonly<{type:string,stage:number,progress:number,quality:number}>} crop @returns {readonly Readonly<CropPart>[]} */
export function cropParts(crop){
 if(!['lettuce','tomato','corn'].includes(crop.type)||!Number.isSafeInteger(crop.stage)||crop.stage<0||crop.stage>(crop.type==='corn'?4:3))return Object.freeze([]);
 const parts=/** @type {CropPart[]} */([]),stage=crop.stage,p=WORLD_ART.palette;
 /** @param {number} plant @param {string} feature @param {CropPart['shape']} shape @param {number} x @param {number} y @param {number} z @param {number} w @param {number} h @param {number} d @param {string} color @param {number} [rx] @param {number} [ry] @param {number} [rz] @param {boolean} [leaf] */
 const add=(plant,feature,shape,x,y,z,w,h,d,color,rx=0,ry=0,rz=0,leaf=false)=>parts.push({plant,feature,shape,x,y,z,w,h,d,color,rx,ry,rz,leaf});
 if(crop.type==='corn'){
  const height=[.045,.22,.85,1.85,2.45][stage],count=[0,2,4,6,8][stage];
  for(const [plant,x]of [-.15,.15].entries()){
   const z=plant===0?-.055:.055;
   if(stage===0){add(plant,'corn-seed','foliage',x,.135,z,.045,.03,.035,'#d7b263');continue;}
   add(plant,'corn-stem','cylinder',x,.12+height/2,z,.022+stage*.004,height,.022+stage*.004,'#71994b');
   for(let i=0;i<count;i++){
    const side=i%2?1:-1,y=.12+height*(.16+i*.075),length=[0,.11,.22,.32,.38][stage];
    add(plant,'corn-leaf','leaf',x+side*length*.24,y,z+(i%3-1)*.025,.045+stage*.015,.025,length,i%2?'#7eac52':'#5f9146',-.3,side*Math.PI/2,side*.18,true);
   }
   if(stage>=3){
    const y=.12+height*.57;
    add(plant,'corn-husk','foliage',x+.065,y,z,.085,.22,.085,'#92ad53',0,0,-.22,true);
    if(stage===4){add(plant,'corn-cob','cylinder',x+.08,y+.035,z+.032,.062,.18,.062,'#e6be55',0,0,-.22,true);add(plant,'corn-silk','foliage',x+.095,y+.145,z+.032,.04,.055,.04,'#b9854a',0,0,0,true);}
    add(plant,'corn-tassel','cylinder',x,.12+height+.065,z,.015,.13,.015,'#c4ad66',0,0,0,true);
    for(const side of [-1,1])add(plant,'corn-tassel-branch','cylinder',x+side*.035,.12+height+.04,z,.012,.09,.012,'#c4ad66',0,0,side*.65,true);
   }
  }
 }else if(crop.type==='lettuce'){
  const size=[.065,.1,.135,.165][stage],centers=[[-.23,-.22],[.23,-.22],[-.23,.22],[.23,.22]],count=stage===0?2:stage===1?4:6;
  for(const [plant,[x,z]]of centers.entries()){
   add(plant,'lettuce-heart','foliage',x,.12+size*.35,z,size*.8,size*.7,size*.8,'#84b35c');
   for(let i=0;i<count;i++){const a=i*Math.PI*2/count+plant*.18,depth=size*1.35,r=depth/2-.006;add(plant,'lettuce-leaf','leaf',x+Math.sin(a)*r,.14+size*.3,z+Math.cos(a)*r,size*.92,.022+size*.06,depth,i%2?'#79a954':'#96be68',-.35,a,0,true);}
  }
 }else{
  const height=[.13,.28,.49,.7][stage],count=stage===0?2:stage===1?4:6;
  for(const [plant,x]of [-.22,.22].entries()){
   add(plant,'tomato-stem','cylinder',x,.12+height/2,0,.028,height,.028,'#65894b');
   for(let i=0;i<count;i++){const side=i%2?1:-1,y=.12+height*(.25+Math.floor(i/2)*.23),depth=[.12,.15,.18,.2][stage],a=side*Math.PI/2,offset=depth/2-.006;add(plant,'tomato-leaf','leaf',x+side*offset,y,Math.floor(i/2)%2?.035:-.035,[.085,.11,.14,.16][stage],.025,depth,i%2?'#6d9d4e':p.leaf,-.25,a,side*.08,true);}
   if(stage===2)for(const [dx,dz]of [[-.025,0],[.025,0],[0,.025]])add(plant,'tomato-flower','foliage',x+dx,.51,dz,.045,.035,.045,'#e5c66f');
   if(stage===3)for(const [dx,y,z]of [[-.07,.43,.04],[.07,.53,.035],[.04,.35,-.05]]){add(plant,'tomato-fruit','foliage',x+dx,y,z,.1,.105,.1,'#c96642');add(plant,'tomato-calyx','leaf',x+dx,y+.053,z,.055,.012,.055,'#6d914b');}
  }
  if(stage>=2){for(const x of [-.36,.36])add(-1,'tomato-stake','cylinder',x,.48,.1,.035,.72,.035,'#ba8a59');add(-1,'tomato-tie','bevel',0,.85,.1,.75,.035,.035,'#ba8a59');}
 }
 return Object.freeze(parts.map(part=>Object.freeze(part)));
}
/** Bounded cosmetic sway on the existing world RAF. Static preferences freeze it.
 * @param {number} time @param {number} phase @param {boolean} still */
export function cropSway(time,phase,still){return still?0:Math.sin(time/1100+phase)*.022;}
