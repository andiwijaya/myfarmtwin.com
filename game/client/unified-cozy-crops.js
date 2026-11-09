import {COZY_ART} from './unified-cozy-art.js';
import {cropParts} from './unified-world-crops.js';
import {compileWorldParts} from './unified-world-part-meshes.js';

/** @typedef {import('./unified-world-environment.js').EnvironmentPart} Part */
/** Native bed footprint and soil surface stay unchanged; water affects soil
 * color, not decorative water volumes or growth/production.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {Part[]} */
export function cropBedParts(e){
 if(e.kind!=='plot')return[];
 const p=COZY_ART.palette,w=e.width,d=e.depth,wet=e.value>.4,parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'bevel',startupOptional:false,...extra});
 add(0,.0125,0,w,.025,d,p.woodDark,'bed-base');
 add(0,.0725,0,w-.11,.095,d-.11,wet?'#70513d':p.soil,'native-soil');
 for(const side of [-1,1]){add(side*(w-.055)/2,.08,0,.055,.16,d-.14,p.wood,'bed-rail');add(0,.08,side*(d-.055)/2,w-.14,.16,.055,p.wood,'bed-rail');}
 for(const x of [-1,1])for(const z of [-1,1])add(x*(w-.07)/2,.09,z*(d-.07)/2,.07,.18,.07,p.woodDark,'bed-post',{shape:'cylinder'});
 for(const x of [-w*.22,w*.22])add(x,.12025,0,.012,.0001,d*.7,wet?'#5e4737':'#7f5b3e','soil-furrow',{shape:'surface'});
 for(const [i,[x,z]]of [[-.3,-.24],[.12,-.3],[-.08,.28],[.3,.21]].entries())add(x,.1205,z,wet?.095:.025,.0001,wet?.065:.02,wet?'#816347':i%2?'#aa8258':'#b28b60','soil-grain',{shape:'disc',fine:true,startupOptional:true});
 if(e.covered){add(0,.11,-d*.4,.07,.18,.07,p.metal,'installed-drip',{shape:'cylinder'});add(0,.2,-d*.34,.07,.05,.17,p.metal,'installed-drip');}
 return parts;
}

/** Existing plot owns every real triangle, including the separately swaying
 * canopies. No new clock, renderer, object count or native values are created.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @param {import('three').MeshLambertMaterial} material
 * @returns {import('three').Mesh[]} */
export function createCropMeshes(e,material){
 const parts=e.crop?cropParts(e.crop):[],staticParts=cropBedParts(e),canopies=/** @type {Map<number,import('./unified-world-crops.js').CropPart[]>} */(new Map());
 /** @param {Readonly<import('./unified-world-crops.js').CropPart>} p @returns {Part} */
 const convert=p=>({x:p.x,y:p.y,z:p.z,width:p.w,height:p.h,depth:p.d,color:p.color,pitch:p.rx,rotation:p.ry,tilt:p.rz,shape:p.shape,feature:p.feature,startupOptional:false});
 for(const part of parts){if(part.leaf){const list=canopies.get(part.plant)||[];list.push(part);canopies.set(part.plant,list);}else staticParts.push(convert(part));}
 const meshes=compileWorldParts(staticParts,material);
 for(const [plant,leaves]of canopies){
  const stem=parts.find(p=>p.plant===plant&&(p.feature==='lettuce-heart'||p.feature==='tomato-stem'));if(!stem)throw new Error('Missing native plant anchor');
  const relative=leaves.map(p=>({...convert(p),x:p.x-stem.x,y:p.y-.12,z:p.z-stem.z}));
  for(const mesh of compileWorldParts(relative,material,{preserveFaces:true})){mesh.position.set(stem.x,.12,stem.z);mesh.userData.cropLeaf=true;mesh.userData.cropLeafCount=leaves.length;mesh.userData.restZ=0;meshes.push(mesh);}
 }
 return meshes;
}

/** Original pump shape and already-owned motor fins. Native status is a static
 * switch cue; only accepted pumpRan events may show actual service effects.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {Part[]} */
export function cropPumpParts(e){
 if(e.kind!=='pump')return[];
 const p=COZY_ART.palette,parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'bevel',startupOptional:false,...extra});
 add(0,.05,0,.8,.1,.8,p.woodDark,'pump-base');
 for(const x of [-.19,.19])add(x,.12,0,.1,.12,.48,p.metal,'pump-mount');
 add(0,.35,0,.42,.52,.42,p.metal,'pump-body',{shape:'cylinder',tilt:Math.PI/2});
 for(const side of [-1,1])add(side*.27,.35,0,.46,.035,.46,p.roofDark,'pump-end',{shape:'cylinder',tilt:Math.PI/2});
 for(const x of [-.2,.2])add(x,.7,0,.055,.3,.055,p.wood,'pump-handle');add(0,.88,0,.46,.06,.055,p.wood,'pump-handle');
 add(.17,.37,.25,.11,.25,.11,p.metal,'pump-outlet',{shape:'cylinder',pitch:Math.PI/2});add(.17,.37,.375,.18,.04,.18,p.roofDark,'pump-outlet',{shape:'cylinder',pitch:Math.PI/2});
 add(0,.38,.2,.22,.16,.045,p.trim,'control-panel');add(0,.38,.23,.12,.08,.02,e.value===1?'#4b9eb2':'#788476','native-switch');
 if(e.efficient)for(const x of [-.14,0,.14])add(x,.55,-.015,.04,.065,.3,p.roofDark,'efficient-motor');
 return parts;
}
