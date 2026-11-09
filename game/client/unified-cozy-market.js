import {COZY_ART} from './unified-cozy-art.js';
/** @typedef {import('./unified-world-environment.js').EnvironmentPart} Part */
/** The one existing central Market, with empty display trays and blank tools.
 * This is not shop inventory, prices, a second market or an ownership grant.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e @returns {Part[]} */
export function marketParts(e){
 if(e.kind!=='market')return[];
 const p=COZY_ART.palette,w=e.width,d=e.depth,h=e.height,rise=.5,run=w/2+.15,slope=Math.atan2(rise,run),panel=Math.hypot(run,rise),parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'box',fixed:true,startupOptional:false,...extra});
 add(0,.03,0,w,.06,d,p.woodDark,'market-floor');
 for(let i=0;i<5;i++)add(0,.06015,-d/2+(i+.5)*d/5,w-.08,.0003,d/5-.018,i%2?p.wood:p.woodDark,'floor-plank',{shape:'surface',fine:true,startupOptional:true});
 for(const side of [-1,1]){
  for(const z of [-d/2+.12,d/2-.12]){
   const x=side*(w/2-.09);add(x,.05,z,.23,.10,.23,p.woodDark,'post-foot',{shape:'bevel'});add(x,h/2,z,.12,h,.12,p.wood,'market-post',{shape:'bevel'});
   add(x-side*.12,h-.265,z,.055,.45,.07,p.trim,'corner-brace',{tilt:side*.65});
  }
  add(0,h-.08,side*(d/2-.12),w,.11,.10,p.woodDark,'crossbeam');
  add(side*run/2,h+rise/2,0,panel,.1,d+.3,p.roof,'roof',{tilt:-side*slope});
  for(const z of [-d/2-.13,d/2+.13])add(side*run/2,h+rise/2+.006,z,panel,.11,.055,p.trim,'roof-frame',{tilt:-side*slope});
  // Both the roof and its flush cloth stripes share the same pitched normal.
  const lift=.0565;
  for(const z of [-.8,-.4,0,.4,.8])add(side*run/2+side*Math.sin(slope)*lift,h+rise/2+Math.cos(slope)*lift,z,panel,.012,.14,p.trim,'market-canopy',{tilt:-side*slope});
 }
 add(0,h+rise+.025,0,.09,.07,d+.34,p.roofDark,'roof-frame');
 add(0,.36,.58,w,.60,.55,p.wood,'body',{shape:'bevel'});
 add(0,.695,.58,w+.10,.07,.72,p.woodDark,'counter',{shape:'bevel'});
 for(const x of [-w*.32,0,w*.32])add(x,.36,.864,.045,.56,.018,p.trim,'counter-joinery',{fine:true,startupOptional:true});
 add(0,1.1,-d/2+.08,w-.12,1.35,.10,p.wood,'stall-back');
 for(const y of [.55,.9,1.25,1.6])add(0,y,-d/2+.022,w-.20,.024,.012,p.woodDark,'back-plank',{fine:true,startupOptional:true});
 for(const x of [-.65,.65]){
  add(x,.743,.54,.42,.026,.34,p.woodDark,'empty-crate');
  for(const side of [-1,1]){add(x+side*.2,.83,.54,.025,.18,.34,p.wood,'empty-crate');add(x,.83,.54+side*.157,.38,.18,.025,p.wood,'empty-crate');}
 }
 add(0,.735,.55,.28,.01,.24,p.roofDark,'blank-ledger');add(0,.75,.55,.25,.02,.21,p.trim,'blank-ledger');add(0,.76015,.55,.006,.0003,.19,p.wood,'ledger-spine',{shape:'surface',fine:true,startupOptional:true});
 for(const x of [-.21,.21])add(x,1.79,-d/2+.15,.025,.25,.025,p.metal,'sign-hanger');
 add(0,1.55,-d/2+.1575,.64,.28,.055,p.trim,'market-sign',{shape:'bevel'});add(0,1.55,-d/2+.191,.085,.085,.012,p.roof,'market-seal',{tilt:Math.PI/4,fine:true,startupOptional:true});
 return parts;
}
