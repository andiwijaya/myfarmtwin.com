import {WORLD_ART} from './unified-world-art.js';
/** @typedef {{x:number,y:number,z:number,w:number,h:number,d:number,color:string,rx:number,ry:number,rz:number,leaf:boolean}} CropPart */
/** Original bounded crop art. Native type/stage is the only growth input; no elapsed-time growth.
 * @param {Readonly<{type:string,stage:number,progress:number,quality:number}>} crop @returns {readonly Readonly<CropPart>[]} */
export function cropParts(crop){if(!['lettuce','tomato'].includes(crop.type)||!Number.isSafeInteger(crop.stage)||crop.stage<0||crop.stage>3)return Object.freeze([]);const parts=/** @type {CropPart[]} */([]),stage=crop.stage,p=WORLD_ART.palette;
 /** @param {number} x @param {number} y @param {number} z @param {number} w @param {number} h @param {number} d @param {string} color @param {number} [rx] @param {number} [ry] @param {number} [rz] @param {boolean} [leaf] */
 const add=(x,y,z,w,h,d,color,rx=0,ry=0,rz=0,leaf=false)=>parts.push({x,y,z,w,h,d,color,rx,ry,rz,leaf});
 if(crop.type==='lettuce'){const size=[.065,.095,.13,.15][stage];for(const x of [-.23,.23])for(const z of [-.22,.22]){add(x,.14+size*.4,z,size*.7,size*.65,size*.7,p.leaf);for(let i=0;i<(stage===0?2:6);i++){const a=i*Math.PI/3,r=size*.48;add(x+Math.sin(a)*r,.14+size*.6,z+Math.cos(a)*r,size*.7,.025+size*.1,size*1.15,i%2?p.leaf:'#8db861',-.35,a,0,true);}}}
 else{const height=[.12,.24,.43,.65][stage];for(const x of [-.22,.22]){add(x,.13+height/2,0,.035,height,.035,'#688e4d');for(let i=0;i<(stage===0?2:6);i++){const side=i%2?1:-1,y=.15+height*(.25+Math.floor(i/2)*.23);add(x+side*.065,y,Math.floor(i/2)%2?.035:-.035,.14,.025,.07,p.leaf,0,side*.2,side*.45,true);}if(stage===3)for(const [dx,y,z]of [[-.07,.43,.04],[.07,.53,.035],[.04,.35,-.05]])add(x+dx,y,z,.095,.095,.095,'#c96642');}if(stage>=2){for(const x of [-.36,.36])add(x,.48,.1,.025,.72,.025,p.wood);add(0,.76,.1,.75,.025,.025,p.wood);}}
 return Object.freeze(parts.map(part=>Object.freeze(part)));
}
/** Bounded cosmetic sway, sampled by the existing single world RAF. @param {number} time @param {number} phase @param {boolean} still */
export function cropSway(time,phase,still){return still?0:Math.sin(time/1100+phase)*.022;}
