import {Sprite,SpriteMaterial,Texture,LinearFilter,SRGBColorSpace} from 'three';
import {parseAtlas,createAtlasPlayer,stableArtHash} from './unified-world-atlas.js';
/** @typedef {{meta:Readonly<import('./unified-world-atlas.js').AtlasMetadata>,image:HTMLImageElement,pixels:Uint8ClampedArray,texture:Texture}} SpriteAsset */
/** @typedef {{entity:Readonly<import('./unified-world-model.js').WorldEntity>,group:import('three').Group,sprite:Sprite,asset:SpriteAsset|null,map:Texture|null,player:ReturnType<typeof createAtlasPlayer>|null,action:string}} Actor */
/** Alpha-aware picking shared by raycast and Canvas. UV is normalized, bottom-origin.
 * @param {import('three').Object3D} object @param {{x:number,y:number}|undefined} uv */
export function spriteOpaque(object,uv){const data=object.userData.atlas;if(!data||!uv)return true;const p=data.pose,m=data.asset.meta,x=p.x+uv.x*p.width-.5,y=p.y+(1-uv.y)*p.height-.5,ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,alpha=(/** @type {number} */px,/** @type {number} */py)=>data.asset.pixels[(Math.max(p.y,Math.min(p.y+p.height-1,py))*m.width+Math.max(p.x,Math.min(p.x+p.width-1,px)))*4+3];return(alpha(ix,iy)*(1-fx)+alpha(ix+1,iy)*fx)*(1-fy)+(alpha(ix,iy+1)*(1-fx)+alpha(ix+1,iy+1)*fx)*fy>=255*.08;}
/** Native activities only; pause breaks in an existing walk are cosmetic.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} entity @param {number} now */
export function chickenPose(entity,now){if(entity.inside||entity.activity==='roost')return'rest';if(entity.activity==='drink')return'drink';if(entity.activity==='peck')return'eat';if(entity.activity==='walk')return Math.floor(now/1800+stableArtHash(entity.id)%7)%4===0?'idle':'walk';return'idle';}
/** Cached local RGBA sprites. No RAF, game clock, reducer, save or game RNG.
 * @param {{changed:()=>void,low?:boolean}} options */
export function createWorldSprites(options){
 const cache=new Map(),assets=new Set(),actors=/** @type {Map<string,Actor>} */(new Map());let disposed=false,low=!!options.low,errors=0,lastTime=0;
 /** @param {'high'|'low'} lod @returns {Promise<SpriteAsset>} */
 function load(lod){if(cache.has(lod))return cache.get(lod);const promise=(async()=>{const base=new URL('./assets/world/',import.meta.url),module=await import(new URL('chicken.'+lod+'.js',base).href),meta=parseAtlas(module.default),image=new Image();image.src=new URL(meta.image,base).href;await image.decode();if(disposed)throw Error('Atlas disposed');if(image.width!==meta.width||image.height!==meta.height)throw Error('Atlas image dimensions differ');const canvas=document.createElement('canvas');canvas.width=meta.width;canvas.height=meta.height;const context=canvas.getContext('2d');if(!context)throw Error('Atlas alpha buffer unavailable');context.drawImage(image,0,0);const pixels=context.getImageData(0,0,meta.width,meta.height).data,texture=new Texture(image);texture.colorSpace=SRGBColorSpace;texture.minFilter=texture.magFilter=LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;const asset={meta,image,pixels,texture};assets.add(asset);return asset;})();cache.set(lod,promise);return promise;}
 /** @param {Actor} actor @param {SpriteAsset} asset */
 function install(actor,asset){if(disposed||actors.get(actor.entity.id)!==actor)return;actor.map?.dispose();actor.asset=asset;actor.map=asset.texture.clone();actor.map.needsUpdate=true;actor.sprite.material.map=actor.map;actor.sprite.material.needsUpdate=true;actor.player=createAtlasPlayer(asset.meta,actor.entity.id);actor.player.setAction(actor.action,0);actor.sprite.center.set(asset.meta.pivot[0],1-asset.meta.pivot[1]);actor.sprite.scale.setScalar(asset.meta.worldUnits);actor.group.clear();actor.group.add(actor.sprite);}
 /** @param {Actor} actor */
 function request(actor){const lod=low?'low':'high';load(lod).then(asset=>{if((low?'low':'high')!==lod)return;install(actor,asset);options.changed();}).catch(()=>{if(!disposed){errors++;options.changed();}});}
 return{
  /** @param {import('three').Group} group @param {Readonly<import('./unified-world-model.js').WorldEntity>} entity */
  bind(group,entity){if(disposed||entity.kind!=='hen')return;let actor=actors.get(entity.id);if(actor){actor.entity=entity;actor.group=group;if(actor.asset){group.clear();group.add(actor.sprite);}return;}const sprite=new Sprite(new SpriteMaterial({transparent:true,alphaTest:.08,depthWrite:false,toneMapped:false}));sprite.userData.entityId=entity.id;sprite.userData.kind='henSprite';actor={entity,group,sprite,asset:null,map:null,player:null,action:'idle'};actors.set(entity.id,actor);request(actor);},
  /** @param {Set<string>} ids */
  retain(ids){for(const[id,actor]of actors)if(!ids.has(id)){actor.sprite.removeFromParent();actor.map?.dispose();actor.sprite.material.dispose();actors.delete(id);}},
  /** @param {boolean} next */
  setLow(next){if(low===next||disposed)return;low=next;for(const actor of actors.values())request(actor);},
  /** @param {number} now @param {number} heading @param {boolean} still */
  update(now,heading,still){if(disposed)return 0;lastTime=now;let count=0;for(const actor of actors.values()){if(!actor.asset||!actor.player||!actor.map)continue;const action=chickenPose(actor.entity,now);if(action!==actor.action){actor.action=action;actor.player.setAction(action,now);}const sample=actor.player.sample(now,{heading,still}),pose=sample.pose,m=actor.asset.meta;actor.map.offset.set(pose.x/m.width,1-(pose.y+pose.height)/m.height);actor.map.repeat.set(pose.width/m.width,pose.height/m.height);actor.sprite.userData.atlas={asset:actor.asset,pose};actor.sprite.userData.action=action;actor.sprite.userData.direction=pose.direction;actor.sprite.userData.frame=pose.frame;const phase=now/700+stableArtHash(actor.entity.id)%31,moving=!still&&action==='walk';actor.sprite.position.set(moving?Math.sin(phase)*.1:0,actor.entity.groundY||0,moving?Math.cos(phase)*.1:0);count++;}return count;},
  inspect:()=>({actors:actors.size,ready:[...actors.values()].filter(a=>a.asset).length,assets:assets.size,errors,low,lastTime,actions:[...actors.values()].map(a=>({id:a.entity.id,action:a.action,ready:!!a.asset}))}),
  dispose(){if(disposed)return;disposed=true;for(const actor of actors.values()){actor.sprite.removeFromParent();actor.map?.dispose();actor.sprite.material.dispose();}actors.clear();for(const asset of assets){asset.texture.dispose();asset.image.src='';}assets.clear();cache.clear();}
 };
}
