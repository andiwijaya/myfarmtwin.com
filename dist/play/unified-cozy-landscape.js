import {BoxGeometry,Mesh,MeshLambertMaterial,Color,Float32BufferAttribute} from './vendor/three/three.module.js';
import {COZY_ART} from './unified-cozy-art.js';import {WORLD_STYLE} from './unified-world-style.js';import {ZONE_REGISTRY,WORLD_BOUNDS} from './unified-world-registry.js';
/** @typedef {import('./unified-world-environment.js').EnvironmentPart} Part */
export const LANDSCAPE_ORDER=Object.freeze({terrain:-4,ground:-3,path:-2,detail:-1});
/** Flat colour layers draw before every native object and never write depth.
 * No depth-bias precision assumption can cover native pasture/foot surfaces. */
export function createLandscapePaintMaterial(){return new MeshLambertMaterial({vertexColors:true,depthTest:false,depthWrite:false});}
/** Original terrain cross-section. The existing flat top remains exactly y=0,
 * with the same bounds, centre and inspection scale. No new height physics.
 * @param {import('three').MeshLambertMaterial} material */
export function createCozyTerrain(material){
 const b=WORLD_BOUNDS,geometry=new BoxGeometry(1,1,1),position=geometry.getAttribute('position'),normal=geometry.getAttribute('normal'),colors=[],grass=new Color(WORLD_STYLE.ground),earth=new Color('#9b7b50'),edge=new Color('#b19b68'),color=new Color();
 for(let i=0;i<position.count;i++){if(normal.getY(i)>.5)color.copy(grass);else if(normal.getY(i)<-.5)color.copy(earth);else color.lerpColors(earth,edge,position.getY(i)+.5).lerp(grass,position.getY(i)>.49?.55:0);colors.push(color.r,color.g,color.b);}
 geometry.setAttribute('color',new Float32BufferAttribute(colors,3));geometry.userData.worldOwned=true;const mesh=new Mesh(geometry,material);mesh.position.set((b.minX+b.maxX)/2,-.3,(b.minZ+b.maxZ)/2);mesh.scale.set(b.maxX-b.minX,.6,b.maxZ-b.minZ);mesh.renderOrder=LANDSCAPE_ORDER.terrain;mesh.userData.worldGround=true;mesh.userData.canvasLayer=0;return mesh;
}
/** Decorative ground paint, not pasture stock, soil moisture or land unlocks.
 * A dedicated background material draws these flat surfaces at y=0;
 * registered native pasture/soil/contact surfaces remain above them.
 * @param {Readonly<import('./unified-world-model.js').WorldSnapshot>} snapshot @returns {Part[]} */
export function landscapeGroundParts(snapshot){
 const parts=/** @type {Part[]} */([]);
 for(const[zone,started,color]of /** @type {[keyof typeof ZONE_REGISTRY,boolean,string][]} */([['field',true,'#a2b875'],['chicken',snapshot.chickenStarted,'#a9b880'],['goat',snapshot.goatStarted,'#91a96b'],['cow',snapshot.cowStarted,'#91ac70'],['fish',snapshot.fishStarted,'#9eaf7b']])){
  if(!started)continue;const b=ZONE_REGISTRY[zone].bounds;parts.push({x:(b.minX+b.maxX)/2,y:0,z:(b.minZ+b.maxZ)/2,width:b.maxX-b.minX-.4,height:.0001,depth:b.maxZ-b.minZ-.4,color,shape:'disc',fixed:true,startupOptional:true,feature:'owned-ground-'+zone});
 }
 parts.push({x:5,y:0,z:1,width:5.5,height:.0001,depth:4.4,color:'#c0aa78',shape:'disc',fixed:true,startupOptional:true,feature:'market-approach'});return parts;
}
/** Same bilingual camera-sign owners/locations; no simulation entities added.
 * @param {{width:number,depth:number}} sign @returns {Part[]} */
export function waymarkParts(sign){const p=COZY_ART.palette;return[
 {x:0,y:.6,z:0,width:.085,height:1.2,depth:.085,color:p.woodDark,shape:'cylinder',fixed:true,startupOptional:false,feature:'waymark-post'},
 {x:0,y:1.3,z:0,width:sign.width,height:.4,depth:sign.depth,color:p.trim,shape:'bevel',fixed:true,startupOptional:false,feature:'waymark-board'},
 ...[-1,1].map(side=>({x:side*sign.width*.34,y:1.3,z:sign.depth/2+.006,width:.035,height:.035,depth:.012,color:p.woodDark,fixed:true,fine:true,startupOptional:true,feature:'waymark-fastener'}))
 ];}
