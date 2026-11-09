import {WORLD_STYLE as S} from './unified-world-style.js';
import {cowBarnParts} from './unified-cow-barn.js';
import {chickenCoopParts} from './unified-cozy-chicken.js';
/** Actual owned building silhouette/upgrade detail, sharing the same unit cube.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function structureParts(e){
 if(e.kind==='cowBarn')return cowBarnParts(e);
 if(e.kind==='coop')return chickenCoopParts(e);
 if(!['market','goatShelter'].includes(e.kind))return[];
 const w=e.width,d=e.depth,h=e.height,market=e.kind==='market',rise=market?.55:.65,run=w/2+.15,slope=Math.atan2(rise,run),panel=Math.hypot(run,rise),cream='#fff1cd',dark='#5f5941',wood=S.trunk,parts=/** @type {import('./unified-world-environment.js').EnvironmentPart[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {{tilt?:number,rotation?:number,fixed?:boolean,feature?:string,fine?:boolean,shape?:'gable',coveredTop?:boolean}} [extra] */
 const add=(x,y,z,width,height,depth,color,extra={})=>parts.push({x,y,z,width,height,depth,color,...extra});
 const wall='#e4c994';add(0,market?.325:h/2,market?.58:0,w,market?.65:h,market?.65:d,wall,{feature:'body',coveredTop:!market});
 if(!market)for(const side of [-1,1])add(0,h,side*(d/2+.02),w,rise,.04,wall,{shape:'gable',rotation:side===1?0:Math.PI,feature:'gable-infill'});
 for(const side of [-1,1]){add(side*run/2,h+rise/2,0,panel,.13,d+.3,S.roof,{tilt:-side*slope,feature:'roof'});for(const z of [-d/2-.025,d/2+.025])add(side*run/2,h+rise/2+.03,z,panel,.065,.085,wood,{tilt:-side*slope,fixed:true,feature:'roof-frame'});}
 add(0,h+rise+.035,0,.12,.1,d+.35,wood,{fixed:true,feature:'roof-frame'});
 if(market){
  add(0,.69,.58,w+.08,.08,.75,wood,{feature:'counter'});add(0,1.23,-d/2+.05,w,1.4,.1,S.wood,{feature:'stall-back'});
  for(const x of [-w/2+.08,w/2-.08])for(const z of [-d/2+.08,d/2-.08])add(x,h/2,z,.1,h,.1,wood,{feature:'market-post'});
  for(const side of [-1,1])for(const z of [-.6,0,.6])add(side*run/2,h+rise/2+.075,z,panel,.025,.22,cream,{tilt:-side*slope,feature:'market-canopy'});
  for(const x of [-.7,.7]){add(x,.755,.58,.4,.03,.32,wood,{feature:'empty-crate'});for(const dx of [-.19,.19])add(x+dx,.9,.58,.025,.28,.32,S.wood,{feature:'empty-crate'});for(const dz of [-.15,.15])add(x,.9,.58+dz,.36,.28,.025,S.wood,{feature:'empty-crate'});}return parts;
 }
 const doorWidth=.65,doorHeight=1.05;add(0,doorHeight/2+.12,d/2+.025,doorWidth,doorHeight,.06,dark,{feature:'door'});
 for(const x of [-doorWidth/2,doorWidth/2])add(x,doorHeight/2+.12,d/2+.07,.065,doorHeight+.08,.06,cream,{feature:'door-trim'});add(0,doorHeight+.15,d/2+.07,doorWidth+.12,.065,.06,cream,{feature:'door-trim'});
 const vents=Math.min(3,(e.level||0)+1);for(const side of [-1,1]){add(side*(w/2+.025),.22,0,.055,.1,d,wood,{feature:'sill'});add(side*(w/2+.025),h-.06,0,.065,.1,d,wood,{feature:'eave'});for(let i=0;i<vents;i++){const z=(i-(vents-1)/2)*.7;add(side*(w/2+.035),h*.68,z,.05,.3,.4,dark,{feature:'native-vent'});for(const dy of [-.18,.18])add(side*(w/2+.05),h*.68+dy,z,.06,.055,.48,cream,{feature:'vent-trim',fine:true});}}
 return parts;
}
