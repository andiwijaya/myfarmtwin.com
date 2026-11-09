import {COZY_ART} from './unified-cozy-art.js';
import {compileWorldParts} from './unified-world-part-meshes.js';
import {nativeFill} from './unified-world-cues.js';
import {chickenFenceParts} from './unified-chicken-layout.js';

/** @typedef {import('./unified-world-environment.js').EnvironmentPart} Part */
/** Original honey-wood coop on the existing native floor/footprint. Native
 * level controls vents/size; the native care snapshot alone controls the door.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {Part[]} */
export function chickenCoopParts(e){
 if(e.kind!=='coop')return[];
 const p=COZY_ART.palette,w=e.width,d=e.depth,h=e.height,rise=.65,run=w/2+.15,slope=Math.atan2(rise,run),panel=Math.hypot(run,rise),parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:extra.fine?'box':'bevel',startupOptional:false,...extra});
 // Tiny fine battens/seams/planks use straight boxes; rounded main shells and
 // paid/native silhouettes retain their authored bevels and exact footprints.
 const doorW=.72,doorH=1.1,wall=.12,sideW=(w-doorW)/2;
 for(const side of [-1,1]){
  add(side*(w-wall)/2,h/2,0,wall,h,d,p.wood,'body');
  add(side*(doorW/2+sideW/2),h/2,(d-wall)/2,sideW,h,wall,p.wood,'body');
  add(0,h,side*(d/2+.015),w,rise,.04,p.wood,'gable-infill',{shape:'gable',rotation:side===1?0:Math.PI});
  add(side*run/2,h+rise/2,0,panel,.12,d+.34,p.roof,'roof',{shape:undefined,tilt:-side*slope});
  for(const z of [-d/2-.15,d/2+.15])add(side*run/2,h+rise/2+.02,z,panel,.075,.085,p.trim,'roof-frame',{fixed:true,tilt:-side*slope});
  add(side*(w/2+.055),h-.03,0,.1,.13,d+.3,p.trim,'eave');
  for(let i=0;i<4;i++)add(side*run/2,h+rise/2+.067,-d*.38+i*d*.25,panel,.012,.025,p.roofDark,'roof-seam',{fine:true,startupOptional:true,tilt:-side*slope});
 }
 add(0,h/2,-(d-wall)/2,w-wall*2,h,wall,p.wood,'body');
 add(0,doorH+(h-doorH)/2,(d-wall)/2,doorW,h-doorH,wall,p.wood,'body');
 add(0,h+rise+.04,0,.11,.09,d+.4,p.roofDark,'roof-frame',{fixed:true});
 for(const side of [-1,1]){
  for(const z of [-d/2,d/2])add(side*(w/2-.025),h/2,z,.13,h,.13,p.trim,'corner-trim');
  add(side*(doorW/2+.025),(doorH+.12)/2,d/2+.04,.09,doorH-.07,.08,p.trim,'door-trim');
  add(0,.21,side*(d/2+.02),w,.09,.05,p.woodDark,'sill');
  for(let i=0;i<(e.level||0)+1;i++){
   const z=(i-(e.level||0)/2)*.62,y=h*.67;
   add(side*(w/2+.02),y,z,.035,.28,.35,p.woodDark,'native-vent');
   for(const dy of [-.16,.16])add(side*(w/2+.045),y+dy,z,.05,.045,.43,p.trim,'vent-trim');
   for(const dz of [-.2,.2])add(side*(w/2+.045),y,z+dz,.05,.36,.045,p.trim,'vent-trim');
   add(side*(w/2+.05),y,z,.05,.035,.34,p.wood,'vent-louver',{fine:true,startupOptional:true});
  }
 }
 add(0,doorH+.045,d/2+.04,doorW+.18,.09,.08,p.trim,'door-trim');
 if(e.doorOpen!==undefined){
  const x=e.doorOpen?doorW+.02:0;
  add(x,(doorH+.12)/2,d/2+.09,doorW,doorH-.12,.075,p.barnDark,'native-door');
  add(x,(doorH+.12)/2,d/2+.135,.06,doorH-.2,.035,p.wood,'door-brace');
  add(x+doorW*.27,.65,d/2+.16,.055,.055,.035,p.metal,'door-handle');
 }
 add(doorW/2,doorH+.14,d/2+.09,doorW*2+.1,.045,.045,p.woodDark,'door-track');
 // Horizontal siding is restrained; it is decoration rather than capacity.
 for(let row=0;row<5;row++)for(const side of [-1,1]){
  const y=.32+row*.27;
  add(side*(w/2+.013),y,0,.025,.028,d-.16,row%2?p.woodDark:p.barnLight,'siding',{fine:true,startupOptional:true});
  if(side===-1||y>doorH+.13)add(0,y,side*(d/2+.013),w-.16,.028,.025,p.woodDark,'siding',{fine:true,startupOptional:true});
  else for(const x of [-1,1])add(x*(doorW/2+sideW/2),y,side*(d/2+.013),sideW-.13,.028,.025,p.woodDark,'siding',{fine:true,startupOptional:true});
 }
 add(0,.06,0,w,.12,d,p.woodDark,'coop-floor',{fixed:true});
 for(let i=0;i<6;i++)add(0,.12015,-d/2+(i+.5)*d/6,w-.16,.0003,d/6-.025,i%2?p.wood:p.woodDark,'floor-plank',{fixed:true,fine:true,startupOptional:true});
 for(const side of [-1,1])for(const z of [-d/2+.1,d/2-.1])add(side*(w/2-.1),h/2,z,.13,h,.13,p.wood,'interior-post',{fixed:true});
 return parts;
}

/** Open polygonal bowls, grounded tools and real nest contents. Decorative
 * straw is bedding, not feed. Stock volumes are added separately below.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {Part[]} */
export function chickenCareParts(e){
 if(e.kind!=='station'||e.zone!=='chicken')return[];
 const p=COZY_ART.palette,parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'bevel',startupOptional:false,...extra});
 if(e.domainId==='nest'){
  add(0,.06,0,e.width,.12,e.depth,p.woodDark,'nest-base');
  for(const side of [-1,1]){add(side*(e.width-.045)/2,.17,0,.045,.22,e.depth,p.wood,'nest-rail');add(0,.17,side*(e.depth-.045)/2,e.width-.09,.22,.045,p.wood,'nest-rail');}
  const slots=Math.min(8,e.capacity||4),columns=slots/2,spacing=(e.width-.12)/columns;
  for(let i=0;i<slots;i++){
   const x=(i%columns-(columns-1)/2)*spacing,z=i<columns?-.145:.145;
   add(x,.145,z,spacing*.85,.05,.24,p.straw,'nest-bedding',{shape:'foliage'});
   if(i<e.value)add(x,.225,z,Math.min(.115,spacing*.65),.11,.09,p.trim,'native-egg',{shape:'foliage'});
  }
  return parts;
 }
 const radius=e.domainId==='clean'?.23:.29,base=e.domainId==='clean'?.045:.2,rim=e.domainId==='clean'?.24:.26;
 add(0,base/2,0,radius*2+.04,base,radius*2+.04,p.woodDark,'care-base',{shape:'cylinder'});
 for(let i=0;i<12;i++){
  const angle=i*Math.PI/6;
  add(Math.sin(angle)*radius,base+rim/2,Math.cos(angle)*radius,radius*.54,rim,.055,p.metal,'care-rim',{rotation:angle});
 }
 if(e.domainId==='feeder'&&e.automatic){
  add(-.12,.75,-.06,.29,.36,.29,p.wood,'auto-feeder');
  add(-.12,.95,-.06,.35,.065,.35,p.trim,'auto-feeder');
  add(-.12,.52,-.06,.12,.15,.12,p.roofDark,'auto-feeder');
  for(const x of [-.25,.01])add(x,.51,-.18,.045,.7,.045,p.roofDark,'auto-feeder');
  add(-.277,.76,.015,.025,.065,.065,e.active?'#659a7b':'#788476','native-auto-switch');
 }
 if(e.domainId==='drinker'){
  for(const x of [-.26,.26])add(x,.56,0,.035,.25,.035,p.woodDark,'water-handle');
  add(0,.685,0,.55,.035,.035,p.woodDark,'water-handle');
 }
 if(e.domainId==='clean'){
  add(.2,.45,.12,.035,.82,.035,p.wood,'broom-handle');
  add(.2,.065,.12,.17,.13,.08,p.straw,'broom-head');
  add(0,.3,0,.31,.025,.025,p.woodDark,'bucket-handle');
  const dirt=Math.max(0,Math.min(5,Math.ceil((100-e.value)/20)));
  for(let i=0;i<dirt;i++){const a=i*2.399;add(Math.sin(a)*.12,base+.0005,Math.cos(a)*.12,.07,.003,.055,p.soil,'native-dirt',{shape:'disc'});}
 }
 return parts;
}

/** Separate real native quantity volume, never merged with an enclosing shell.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @param {import('three').MeshLambertMaterial} material
 * @returns {import('three').Mesh[]} */
export function createChickenCareMeshes(e,material){
 const meshes=compileWorldParts(chickenCareParts(e),material);
 if(e.kind==='station'&&e.zone==='chicken'&&['feeder','drinker'].includes(String(e.domainId))){
  const ratio=nativeFill(e.value,e.capacity);
  if(ratio>0)for(const mesh of compileWorldParts([{x:0,y:.2+ratio*.1,z:0,width:.49,height:ratio*.2,depth:.49,color:e.domainId==='drinker'?'#76b9bf':COZY_ART.palette.straw,shape:'cylinder',feature:'native-contents',startupOptional:false}],material,{preserveFaces:true})){
   mesh.userData.nativeFill=true;mesh.userData.fillRatio=ratio;mesh.userData.nativeFillHeight=ratio*.2;meshes.push(mesh);
  }
 }
 return meshes;
}

/** Native perimeter/gate and actually paid shade only. @param {NonNullable<ReturnType<typeof import('./unified-chicken-layout.js').chickenLayout>>} layout @returns {Part[]} */
export function chickenYardParts(layout){
 const p=COZY_ART.palette,parts=/** @type {Part[]} */(chickenFenceParts(layout.fence).map(part=>{
  const post=part.height>.2,horizontal=part.width>part.depth;
  return{...part,width:post?.12:.07,height:post?part.height:Math.max(part.width,part.depth),depth:post?.12:.07,shape:/** @type {const} */('cylinder'),color:post?p.woodDark:p.wood,feature:'chicken-fence',startupOptional:false,...(post?{}:horizontal?{tilt:-Math.PI/2}:{pitch:Math.PI/2})};
 }));
 if(layout.shade){
  const s=layout.shade;
  parts.push({x:s.x,y:1.55,z:s.z,width:s.width,height:.1,depth:s.depth,color:p.roof,shape:'bevel',feature:'native-shade',startupOptional:false});
  for(const x of [-s.width*.42,s.width*.42])for(const z of [-s.depth*.42,s.depth*.42])parts.push({x:s.x+x,y:.75,z:s.z+z,width:.085,height:1.5,depth:.085,color:p.wood,shape:'cylinder',feature:'native-shade',startupOptional:false});
 }
 return parts;
}

/** Flat noninteractive presentation ground; never feed, forage or new land.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot @returns {Part[]} */
export function chickenGroundParts(snapshot){
 if(!snapshot.chickenStarted||!snapshot.chickenLayout)return[];
 const b=snapshot.chickenLayout.fence,p=COZY_ART.palette,parts=/** @type {Part[]} */([{x:(b.minX+b.maxX)/2,y:.0004,z:(b.minZ+b.maxZ)/2,width:b.maxX-b.minX,depth:b.maxZ-b.minZ,height:.0001,color:'#9fbb74',shape:'disc',feature:'chicken-pasture',startupOptional:true}]);
 for(const e of snapshot.entities.filter(e=>e.zone==='chicken'&&['coop','station'].includes(e.kind)))parts.push({x:e.x,y:.001,z:e.z,width:e.width+.35,height:.0001,depth:e.depth+.3,color:e.domainId==='drinker'?'#a5b996':p.dirt,shape:'disc',feature:'chicken-care-pad',startupOptional:true});
 return parts;
}
