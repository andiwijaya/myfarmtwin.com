import {WORLD_ART,atlasDirection} from './unified-world-art.js';
/** @typedef {'chicken'|'goat'|'cow'|'fish'} ArtSpecies */
/** @typedef {{version:1,species:ArtSpecies,lod:'high'|'low',image:string,imageSha256:string,cell:number,columns:number,width:number,height:number,worldUnits:number,pivot:number[],directions:number,framesPerAction:number,fps:number,actions:string[],source:{generator:string,modelSha256:string,artSha256:string,three:string,chromium:string,renderer:string}}} AtlasMetadata */
/** @template T @param {T} value @returns {Readonly<T>} */
function freeze(value){if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
/** @param {unknown} value @param {string[]} keys @returns {Record<string,any>} */
function record(value,keys){if(!value||typeof value!=='object'||Array.isArray(value)||Object.getPrototypeOf(value)!==Object.prototype)throw Error('Invalid atlas record');const descriptors=Object.getOwnPropertyDescriptors(value);if(Reflect.ownKeys(value).length!==keys.length||keys.some(k=>!Object.hasOwn(descriptors,k)||!Object.hasOwn(descriptors[k],'value')))throw Error('Invalid atlas fields');return /** @type {Record<string,any>} */(value);}
/** @param {unknown} input @param {readonly unknown[]} expected */
function arrayEquals(input,expected){if(!Array.isArray(input)||Object.getPrototypeOf(input)!==Array.prototype||Reflect.ownKeys(input).length!==expected.length+1||input.length!==expected.length)return false;const descriptors=Object.getOwnPropertyDescriptors(input);return expected.every((value,index)=>Object.hasOwn(descriptors,index)&&Object.hasOwn(descriptors[index],'value')&&descriptors[index].value===value);}
/** Reject malformed assets before allocating a texture or resolving a URL.
 * @param {unknown} input @returns {Readonly<AtlasMetadata>} */
export function parseAtlas(input){
 const m=record(input,['version','species','lod','image','imageSha256','cell','columns','width','height','worldUnits','pivot','directions','framesPerAction','fps','actions','source']);
 if(m.version!==1||typeof m.species!=='string'||!Object.hasOwn(WORLD_ART.species,m.species)||(m.lod!=='high'&&m.lod!=='low'))throw Error('Unsupported atlas');
 const spec=WORLD_ART.species[/** @type {ArtSpecies} */(m.species)],a=WORLD_ART.atlas,cell=spec.framePixels*(m.lod==='low'?WORLD_ART.lowScale:1),rows=Math.ceil(spec.actions.length*4*a.framesPerAction/a.columns);
 if(m.image!==m.species+'.'+m.lod+'.png'||typeof m.imageSha256!=='string'||! /^[a-f0-9]{64}$/.test(m.imageSha256)||m.cell!==cell||m.columns!==a.columns||m.width!==cell*a.columns||m.height!==cell*rows||m.worldUnits!==spec.frameWorldUnits||m.directions!==4||m.framesPerAction!==a.framesPerAction||m.fps!==a.framesPerSecond)throw Error('Invalid atlas dimensions or image');
 if(!arrayEquals(m.actions,spec.actions)||!arrayEquals(m.pivot,spec.pivot))throw Error('Invalid atlas frames');
 const source=record(m.source,['generator','modelSha256','artSha256','three','chromium','renderer']);if(source.generator!=='myfarmtwin-world-atlas-v1'||source.three!=='0.187.0'||['modelSha256','artSha256'].some(k=>typeof source[k]!=='string'||! /^[a-f0-9]{64}$/.test(source[k]))||['chromium','renderer'].some(k=>typeof source[k]!=='string'||!source[k]||source[k].length>500))throw Error('Invalid atlas provenance');
 return freeze(/** @type {AtlasMetadata} */(JSON.parse(JSON.stringify(m))));
}
/** Deterministic cosmetic hash; never calls the simulation RNG. @param {string} id */
export function stableArtHash(id){if(typeof id!=='string'||!id||id.length>200)throw Error('Invalid art identity');let hash=2166136261;for(const character of id){hash^=character.charCodeAt(0);hash=Math.imul(hash,16777619);}return hash>>>0;}
/** @param {Readonly<AtlasMetadata>} atlas @param {string} action @param {number} direction @param {number} frame */
export function atlasFrame(atlas,action,direction,frame){const row=atlas.actions.indexOf(action);if(row<0||!Number.isInteger(direction)||direction<0||direction>=4||!Number.isInteger(frame)||frame<0||frame>=atlas.framesPerAction)throw Error('Invalid atlas pose');const index=row*4*atlas.framesPerAction+direction*atlas.framesPerAction+frame;return Object.freeze({index,action,direction,frame,x:index%atlas.columns*atlas.cell,y:Math.floor(index/atlas.columns)*atlas.cell,width:atlas.cell,height:atlas.cell});}
/** A timer-free player, sampled by the one world cosmetic controller.
 * @param {Readonly<AtlasMetadata>} atlas @param {string} stableId */
export function createAtlasPlayer(atlas,stableId){
 const phase=stableArtHash(stableId)%atlas.framesPerAction;let action=atlas.actions[0],started=0,previous=action,previousStarted=0;
 /** @param {number} now */const clock=now=>{if(!Number.isFinite(now)||now<0)throw Error('Invalid cosmetic sample time');return now;};
 return{
  /** @param {string} next @param {number} now */
  setAction(next,now){clock(now);if(!atlas.actions.includes(next))throw Error('Unknown atlas action');if(next===action)return false;previous=action;previousStarted=started;action=next;started=now;return true;},
  /** @param {number} now @param {{heading:number,actorHeading?:number,still?:boolean}} options */
  sample(now,{heading,actorHeading=0,still=false}){clock(now);const direction=atlasDirection(heading,actorHeading),index=(/** @type {number} */start)=>still?0:(Math.floor(Math.max(0,now-start)*atlas.fps/1000)+phase)%atlas.framesPerAction,mix=still?1:Math.min(1,Math.max(0,now-started)/120);return Object.freeze({pose:atlasFrame(atlas,action,direction,index(started)),from:mix<1?atlasFrame(atlas,previous,direction,index(previousStarted)):null,mix,phase});},
  inspect:()=>Object.freeze({action,started,phase})
 };
}
