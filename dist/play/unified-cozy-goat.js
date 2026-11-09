import {COZY_ART} from './unified-cozy-art.js';import {compileWorldParts} from './unified-world-part-meshes.js';import {nativeFill} from './unified-world-cues.js';import {ranchFenceParts} from './unified-world-environment.js';
/** @typedef {import('./unified-world-environment.js').EnvironmentPart} Part */
/** Open-front timber shelter. Native size/level and the existing0.12 contact
 * floor remain authoritative. Thin planar joinery uses low-cost straight boxes.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e @returns {Part[]} */
export function goatShelterParts(e){
 if(e.kind!=='goatShelter')return[];
 const p=COZY_ART.palette,w=e.width,d=e.depth,h=e.height,rise=.65,run=w/2+.15,slope=Math.atan2(rise,run),panel=Math.hypot(run,rise),doorW=1.6,doorH=1.68,wall=.12,sideW=(w-doorW)/2,parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'box',startupOptional:false,...extra});
 for(const side of [-1,1]){
  add(side*(w-wall)/2,h/2,0,wall,h,d,p.wood,'body',{shape:'bevel'});
  add(side*(doorW/2+sideW/2),h/2,(d-wall)/2,sideW,h,wall,p.wood,'body',{shape:'bevel'});
  add(0,h,side*(d/2+.015),w,rise,.04,p.wood,'gable-infill',{shape:'gable',rotation:side===1?0:Math.PI});
  add(side*run/2,h+rise/2,0,panel,.13,d+.3,p.barn,'roof',{tilt:-side*slope});
  for(const z of [-d/2-.15,d/2+.15])add(side*run/2,h+rise/2+.01,z,panel,.075,.08,p.trim,'roof-frame',{fixed:true,tilt:-side*slope});
  add(side*(w/2+.045),h-.015,0,.09,.12,d+.3,p.trim,'eave');
  for(let row=0;row<5;row++)add(side*(w/2+.015),.35+row*(h-.5)/5,0,.025,.025,d-.12,row%2?p.woodDark:p.barnLight,'siding',{fine:true,startupOptional:true});
  for(let i=0;i<(e.level||0)+1;i++){
   const z=(i-(e.level||0)/2)*.75,y=h*.68;
   add(side*(w/2+.025),y,z,.04,.35,.43,p.woodDark,'native-vent');
   for(const dy of [-.2,.2])add(side*(w/2+.05),y+dy,z,.05,.05,.53,p.trim,'vent-trim');
   for(const dz of [-.24,.24])add(side*(w/2+.05),y,z+dz,.05,.45,.05,p.trim,'vent-trim');
  }
  for(const z of [-d/2,d/2])add(side*(w/2-.02),h/2,z,.13,h,.13,p.trim,'corner-trim');
  add(side*(doorW/2+.04),doorH/2,d/2+.04,.1,doorH,.09,p.trim,'door-trim');
 }
 add(0,h/2,-(d-wall)/2,w-wall*2,h,wall,p.wood,'body',{shape:'bevel'});
 add(0,doorH+(h-doorH)/2,(d-wall)/2,doorW,h-doorH,wall,p.wood,'body');
 add(0,doorH+.04,d/2+.04,doorW+.2,.08,.09,p.trim,'door-trim');
 add(0,h+rise+.04,0,.12,.08,d+.38,p.barnDark,'roof-frame',{fixed:true});
 for(let i=0;i<5;i++)add(0,.35+i*(h-.5)/5,-d/2-.015,w-.12,.025,.025,p.woodDark,'siding',{fine:true,startupOptional:true});
 add(0,.06,0,w,.12,d,p.woodDark,'shelter-floor',{fixed:true});
 for(let i=0;i<5;i++)add(0,.12015,-d/2+(i+.5)*d/5,w-.16,.0003,d/5-.025,i%2?p.wood:p.woodDark,'floor-plank',{fixed:true,fine:true,startupOptional:true});
 for(const x of [-w/2+.1,w/2-.1])for(const z of [-d/2+.1,d/2-.1])add(x,h/2,z,.12,h,.12,p.woodDark,'interior-post',{fixed:true});
 return parts;
}

/** Only actual native stock/cleanliness/care upgrades affect equipment art.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e @returns {Part[]} */
export function goatCareParts(e){
 if(e.kind!=='goatStation')return[];
 const p=COZY_ART.palette,parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'box',startupOptional:false,...extra});
 if(e.domainId==='platform'){
  for(let i=0;i<3;i++){
   const x=(i-1)*.38,h=(i+1)*.2;add(x,h/2,0,.4,h,.9,p.woodDark,'platform-step');
   add(x,h+.00015,0,.36,.0003,.86,p.wood,'platform-tread',{fine:true,startupOptional:true});
  }
 }else if(e.domainId==='hay'||e.domainId==='water'){
  const size=e.careUpgrade?1:.8,w=e.width*size,d=e.depth*size,feature=e.careUpgrade?'enlarged-container':'care-container';
  add(0,.22,0,w,.04,d,e.domainId==='water'?p.metal:p.woodDark,feature);
  for(const x of [-1,1])for(const z of [-1,1])add(x*(w-.06)/2,.13,z*(d-.06)/2,.06,.26,.06,p.woodDark,feature,{shape:'bevel'});
  for(const side of [-1,1]){add(side*(w-.035)/2,.32,0,.035,.16,d,e.domainId==='water'?p.metal:p.wood,feature);add(0,.32,side*(d-.035)/2,w-.07,.16,.035,e.domainId==='water'?p.metal:p.wood,feature);}
  if(e.domainId==='hay')for(const x of [-w*.4,0,w*.4])add(x,.47,-d*.45,.035,.27,.035,p.wood,'hay-rack');
  else for(const side of [-1,1])add(side*(w-.08)/2,.405,0,.035,.04,d-.06,p.roofDark,'water-rim');
 }else if(e.domainId==='clean'){
  add(0,.04,0,.5,.08,.5,p.woodDark,'clean-base',{shape:'cylinder'});
  for(let i=0;i<10;i++){const a=i*Math.PI/5;add(Math.sin(a)*.22,.2,Math.cos(a)*.22,.145,.24,.035,p.metal,'clean-bucket',{rotation:a});}
  add(.23,.47,.1,.035,.86,.035,p.wood,'broom');add(.23,.07,.1,.16,.14,.1,p.straw,'broom');
  for(let i=0;i<Math.max(0,Math.min(5,Math.ceil((100-e.value)/20)));i++){const a=i*2.4;add(Math.sin(a)*.12,.0805,Math.cos(a)*.12,.06,.0001,.055,p.soil,'native-dirt',{shape:'disc'});}
 }else if(e.domainId==='contract'){
  add(0,.04,0,.65,.08,.6,p.woodDark,'contract-base',{shape:'bevel'});add(0,.44,0,.08,.8,.08,p.wood,'contract-post');
  add(0,.72,0,.62,.32,.08,p.trim,'contract-board',{shape:'bevel'});add(0,.72,.044,.5,.22,.014,p.roof,'contract-board');
 }
 return parts;
}

/** Independent native contents have linear height/quantity and no fake hay.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e @param {import('three').MeshLambertMaterial} material @returns {import('three').Mesh[]} */
export function createGoatCareMeshes(e,material){
 const meshes=compileWorldParts(goatCareParts(e),material);
 if(e.kind==='goatStation'&&['hay','water'].includes(String(e.domainId))){const ratio=nativeFill(e.value,e.capacity),size=e.careUpgrade?1:.8;if(ratio>0)for(const mesh of compileWorldParts([{x:0,y:.24+.06*ratio,z:0,width:e.width*size*.75,height:.12*ratio,depth:e.depth*size*.75,color:e.domainId==='water'?'#76b9bf':COZY_ART.palette.straw,shape:'box',feature:'native-contents',startupOptional:false}],material)){mesh.userData.nativeFill=true;mesh.userData.fillRatio=ratio;mesh.userData.nativeFillHeight=.12*ratio;meshes.push(mesh);}}
 return meshes;
}

/** Native biomass alone controls living forage. Flat ground corrects the old
 * raised patch; goat feet and platform contacts retain the original floor.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e @returns {Part[]} */
export function goatPaddockParts(e){
 if(e.kind!=='paddock')return[];
 const amount=nativeFill(e.value,e.capacity),p=COZY_ART.palette,parts=/** @type {Part[]} */([{x:0,y:.0003,z:0,width:e.width,height:.0001,depth:e.depth,color:amount>0?(e.active?'#94b869':'#b0c887'):'#b7a17b',shape:'surface',feature:'native-pasture',startupOptional:false}]);
 if(amount>0)for(const x of [-e.width*.28,0,e.width*.28])for(const z of [-e.depth*.28,0,e.depth*.28])for(let i=0;i<3;i++)parts.push({x:x+(i-1)*.055,y:.003+amount*.025,z,width:.06,height:.08*amount,depth:.19,color:i%2?p.grassLight:'#6b964f',shape:'leaf',rotation:i*2.4,feature:'native-forage',startupOptional:false});
 return parts;
}

/** Existing native perimeter and entrance, with rounded timber rails.
 * @returns {Part[]} */
export function goatFenceParts(){return ranchFenceParts('goat').map(part=>{
 const post=part.height>.2,horizontal=part.width>part.depth;
 return{...part,width:post?.12:.07,height:post?part.height:Math.max(part.width,part.depth),depth:post?.12:.07,shape:'cylinder',color:post?COZY_ART.palette.woodDark:COZY_ART.palette.wood,feature:'goat-fence',startupOptional:false,...(post?{}:horizontal?{tilt:-Math.PI/2}:{pitch:Math.PI/2})};
});}

/** Noninteractive flat care ground, never feed/forage or newly granted land.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot @returns {Part[]} */
export function goatGroundParts(snapshot){
 if(!snapshot.goatStarted)return[];
 const p=COZY_ART.palette,parts=/** @type {Part[]} */([]);
 for(const e of snapshot.entities.filter(e=>e.zone==='goat'&&['goatShelter','goatStation'].includes(e.kind)))parts.push({x:e.x,y:.001,z:e.z,width:e.width+(e.kind==='goatShelter'?.8:.35),height:.0001,depth:e.depth+(e.kind==='goatShelter'?.6:.3),color:e.domainId==='water'?'#a5b996':p.dirt,shape:'disc',feature:'goat-care-pad',startupOptional:true});
 return parts;
}
