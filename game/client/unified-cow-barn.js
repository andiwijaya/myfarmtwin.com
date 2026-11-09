import {COZY_ART} from './unified-cozy-art.js';

/** Original authored cow barn. Coordinates stay within the native building and
 * paid upgrade footprints; decorative bedding does not represent feed stock.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {import('./unified-world-environment.js').EnvironmentPart[]} */
export function cowBarnParts(e){
 if(e.kind!=='cowBarn')return[];
 const w=e.width,d=e.depth,h=e.height,p=COZY_ART.palette,wall=.14,rise=.65,run=w/2+.15,slope=Math.atan2(rise,run),panel=Math.hypot(run,rise),parts=/** @type {import('./unified-world-environment.js').EnvironmentPart[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<import('./unified-world-environment.js').EnvironmentPart>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'bevel',...extra});
 const doorW=1.5,doorH=1.95,sideW=(w-doorW)/2;
 // Separate solid wall slabs leave a real doorway, rather than a dark rectangle.
 for(const side of [-1,1]){
  add(side*(w-wall)/2,h/2,0,wall,h,d,p.barn,'body');
  add(side*(doorW/2+sideW/2),h/2,(d-wall)/2,sideW,h,wall,p.barn,'body');
 }
 add(0,h/2,-(d-wall)/2,w-wall*2,h,wall,p.barn,'body');
 add(0,doorH+(h-doorH)/2,(d-wall)/2,doorW,h-doorH,wall,p.barn,'body');
 // Batten rhythm and varied plank color are authored deterministically.
 const nx=Math.max(6,Math.ceil(w/.48)),nz=Math.max(6,Math.ceil(d/.48));
 for(const side of [-1,1]){
  for(let i=0;i<nx;i++){
   const x=-w/2+(i+.5)*w/nx,front=side===1,aboveDoor=front&&Math.abs(x)<doorW/2+.04,base=aboveDoor?doorH:.13,top=h-.09;
   add(x,(base+top)/2,side*(d/2+.017),.032,top-base,.025,i%3===0?p.barnLight:p.barnDark,'siding',{fine:true});
  }
  for(let i=0;i<nz;i++)add(side*(w/2+.017),h/2,-d/2+(i+.5)*d/nz,.025,h-.22,.032,i%3===0?p.barnLight:p.barnDark,'siding',{fine:true});
  add(0,h,side*(d/2+.025),w,rise,.05,p.barn,'gable-infill',{shape:'gable',rotation:side===1?0:Math.PI});
  add(side*run/2,h+rise/2,0,panel,.14,d+.4,p.roof,'roof',{shape:undefined,tilt:-side*slope});
  for(const z of [-d/2-.2,d/2+.2])add(side*run/2,h+rise/2+.015,z,panel,.1,.09,p.trim,'roof-frame',{fixed:true,tilt:-side*slope});
  // Roof seams follow the slope, with restrained contrast and no tiny shingles.
  for(let i=0;i<5;i++)add(side*run/2,h+rise/2+.084,-d*.4+i*d*.2,panel,.012,.024,p.roofDark,'roof-seam',{tilt:-side*slope,fine:true});
  add(side*(w/2+.1),h-.015,0,.1,.17,d+.42,p.trim,'eave-trim');
 }
 add(0,h+rise+.065,0,.15,.12,d+.48,p.roofDark,'roof-frame',{fixed:true});
 // Cream corner boards, bottom rail, and framed opening create a legible barn.
 for(const side of [-1,1]){
  for(const z of [-d/2,d/2])add(side*(w/2-.035),h/2,z,.18,h,.18,p.trim,'corner-trim');
  add(side*(w/2+.045),.18,0,.08,.16,d,p.woodDark,'sill');
  add(side*(doorW/2+.03),(doorH+.06)/2,d/2+.06,.13,doorH+.06,.12,p.trim,'door-trim');
  // Open sliding doors sit beside the opening; the opening stays selectable
  // only where actual geometry exists (floor/posts/door panels).
  const x=side*(doorW/2+.43);
  add(x,1.03,d/2+.13,.7,1.82,.09,p.barnDark,'door');
  add(x,1.03,d/2+.187,Math.hypot(.6,1.55),.065,.045,p.trim,'barn-cross',{tilt:side*Math.atan2(1.55,.6)});
  add(x,2.03,d/2+.15,.055,.26,.05,p.woodDark,'door-hanger');
 }
 add(0,doorH+.07,d/2+.065,doorW+.26,.15,.13,p.trim,'door-trim');
 add(0,doorH+.23,d/2+.1,w*.75,.07,.07,p.woodDark,'door-track');
 const vents=e.expanded?2:1;
 for(const side of [-1,1])for(let i=0;i<vents;i++){
  const z=(i-(vents-1)/2)*1.25,y=h*.65;
  add(side*(w/2+.035),y,z,.07,.48,.65,p.woodDark,'native-vent');
  for(const dz of [-.36,.36])add(side*(w/2+.08),y,z+dz,.07,.64,.07,p.trim,'vent-trim');
  for(const dy of [-.28,.28])add(side*(w/2+.08),y+dy,z,.07,.08,.77,p.trim,'vent-trim');
  add(side*(w/2+.09),y,z,.07,.04,.64,p.wood,'vent-louver',{fine:true});
 }
 // Low interior remains visible when the shell opens; it cannot hide cows.
 add(0,.06,0,w,.12,d,p.woodDark,'barn-floor',{fixed:true});
 for(let i=0;i<7;i++)add(0,.12015,-d/2+(i+.5)*d/7,w-.2,.0003,d/7-.025,i%2?p.wood:p.woodDark,'floor-plank',{fixed:true,fine:true});
 for(const side of [-1,1]){
  add(side*w*.29,.135,-d*.22,w*.31,.03,d*.39,p.straw,'bedding',{fixed:true});
  for(const z of [-d/2+.12,d/2-.12]){
   add(side*(w/2-.12),h/2,z,.17,h,.17,p.wood,'interior-post',{fixed:true});
   add(side*(w/2-.29),h-.32,z,.61,.08,.11,p.wood,'interior-brace',{fixed:true,tilt:side*Math.PI/4});
  }
 }
 // Native ownership flags are the only way to add these upgrade silhouettes.
 if(e.shade){
  add(-w*.3,h*.65,d/2+.35,w*.4,.12,.9,p.roof,'shade',{fixed:true});
  for(const x of [-w*.48,-w*.12])add(x,h*.325,d/2+.65,.09,h*.65,.09,p.wood,'shade',{fixed:true});
  add(0,h+rise+.18,0,.55,.25,1,p.trim,'ventilation');
  add(0,h+rise+.34,0,.7,.08,1.1,p.roof,'ventilation');
 }
 if(e.sanitation){
  add(w/2+.18,.62,0,.3,.65,.5,p.metal,'sanitation',{fixed:true});
  add(w/2+.18,.98,0,.36,.08,.55,p.trim,'sanitation',{fixed:true});
  add(w/2+.18,1.1,-.16,.045,.25,.045,p.woodDark,'sanitation',{fixed:true});
  add(w/2+.18,1.22,-.09,.045,.045,.18,p.woodDark,'sanitation',{fixed:true});
 }
 return parts;
}
