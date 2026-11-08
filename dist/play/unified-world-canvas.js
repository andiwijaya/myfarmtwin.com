import {Mesh,Vector3,Matrix3,Matrix4,Sprite,Color,HemisphereLight,DirectionalLight,AmbientLight} from './vendor/three/three.module.js';
import {WORLD_ART} from './unified-world-art.js';
import {spriteOpaque} from './unified-world-sprites.js';
/** @typedef {{x:number,y:number}} Point */
/** @typedef {{points:Point[],depth:number,layer:number,color:string,owner:string|null,opacity?:number,pickThrough?:boolean,sprite?:Sprite,rect?:{x:number,y:number,width:number,height:number}}} CanvasFace */

/** Same linear-light Lambert irradiance/PI as the pinned WebGL material. One rig
 * per projection, never a second time/weather source. @param {import('three').Scene} scene */
export function createCanvasLighting(scene){
 const ambient=new Color(0,0,0),hemisphere=/** @type {{sky:Color,ground:Color,direction:Vector3}[]} */([]),directional=/** @type {{color:Color,direction:Vector3}[]} */([]);
 scene.traverseVisible(light=>{if(light instanceof HemisphereLight)hemisphere.push({sky:light.color.clone().multiplyScalar(light.intensity),ground:light.groundColor.clone().multiplyScalar(light.intensity),direction:light.getWorldPosition(new Vector3()).normalize()});else if(light instanceof DirectionalLight){light.target.updateWorldMatrix(true,false);directional.push({color:light.color.clone().multiplyScalar(light.intensity),direction:light.getWorldPosition(new Vector3()).sub(light.target.getWorldPosition(new Vector3())).normalize()});}else if(light instanceof AmbientLight)ambient.add(light.color.clone().multiplyScalar(light.intensity));});
 /** @param {Color} color @param {Vector3} normal */
 const shaded=new Map();const shade=(/** @type {Color} */color,/** @type {Vector3} */normal)=>{const key=[color.r,color.g,color.b,normal.x,normal.y,normal.z].join('|'),known=shaded.get(key);if(known!==undefined)return known;const irradiance=ambient.clone();for(const h of hemisphere)irradiance.add(h.ground.clone().lerp(h.sky,normal.dot(h.direction)*.5+.5));for(const d of directional)irradiance.add(d.color.clone().multiplyScalar(Math.max(0,normal.dot(d.direction))));const result=color.clone().multiply(irradiance).multiplyScalar(1/Math.PI).getStyle();shaded.set(key,result);return result;};
 shade.key=JSON.stringify({ambient:ambient.toArray(),hemisphere:hemisphere.map(h=>[h.sky.toArray(),h.ground.toArray(),h.direction.toArray()]),directional:directional.map(d=>[d.color.toArray(),d.direction.toArray()])});return shade;
}

/** Weak object keys release retired meshes with their scene groups. Only the
 * latest projection of each live mesh is retained; sprites remain dynamic. */
export function createCanvasProjectionCache(){
 /** @type {WeakMap<import('three').Mesh,{epoch:number,signature:string,matrix:number[],faces:CanvasFace[]}>} */let entries=new WeakMap();
 /** @type {WeakMap<import('three').Mesh,{signature:string,light:string,matrix:number[],normals:Vector3[],colors:(string|undefined)[]}>} */let surfaces=new WeakMap();/** @type {WeakSet<CanvasFace>} */let reused=new WeakSet();let key='',epoch=0,hits=0,misses=0;
 return{
  /** @param {string} next */
  begin(next){if(key!==next){key=next;epoch++;reused=new WeakSet();}hits=0;misses=0;},
  /** @param {import('three').Mesh} mesh @param {string} signature */
  get(mesh,signature){const entry=entries.get(mesh);if(entry&&entry.epoch===epoch&&entry.signature===signature&&entry.matrix.every((value,i)=>value===mesh.matrixWorld.elements[i])){hits++;for(const face of entry.faces)reused.add(face);return entry.faces;}misses++;return null;},
  /** @param {import('three').Mesh} mesh @param {string} signature @param {CanvasFace[]} faces */
  set(mesh,signature,faces){entries.set(mesh,{epoch,signature,matrix:[...mesh.matrixWorld.elements],faces});},
  /** World-space normals/shades survive camera movement, never geometry, light or ownership changes.
   * @param {import('three').Mesh} mesh @param {string} signature @param {string} light @param {()=>Vector3[]} build */
  surface(mesh,signature,light,build){let entry=surfaces.get(mesh);if(!entry||entry.signature!==signature||entry.light!==light||!entry.matrix.every((value,i)=>value===mesh.matrixWorld.elements[i])){entry={signature,light,matrix:[...mesh.matrixWorld.elements],normals:build(),colors:[]};surfaces.set(mesh,entry);}return entry;},
  wasReused:(/** @type {CanvasFace} */face)=>reused.has(face),
  clear(){entries=new WeakMap();surfaces=new WeakMap();reused=new WeakSet();key='';epoch=hits=misses=0;},
  inspect:()=>({hits,misses,epoch})
 };
}
/** Conservative viewport rejection preserves partially visible polygons and
 * their ownership. @param {readonly Point[]} points @param {number} width @param {number} height */
function outside(points,width,height){return points.every(p=>p.x<-.5)||points.every(p=>p.x>width+.5)||points.every(p=>p.y<-.5)||points.every(p=>p.y>height+.5);}

/** Visible faces of the SAME scene/camera; no second world model or simulation.
 * Ground, paths and marker are explicit paint layers; object faces use camera depth.
 * @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} width @param {number} height @param {ReturnType<typeof createCanvasProjectionCache>} [cache] @param {boolean} [cull] @param {boolean} [fastProjection] @returns {CanvasFace[]}
 */
export function projectSceneFaces(scene,camera,width,height,cache,cull=true,fastProjection=!!cache){
 if(width<=0||height<=0)return [];scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 const direction=camera.getWorldDirection(new Vector3()),shade=createCanvasLighting(scene),viewProjection=fastProjection?new Matrix4().multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse):null;
 cache?.begin(fastProjection+'|'+cull+'|'+width+'|'+height+'|'+camera.matrixWorld.elements.join(',')+'|'+camera.projectionMatrix.elements.join(',')+'|'+shade.key);
 /** @type {CanvasFace[]} */const faces=[];
 scene.traverseVisible(object=>{
  if(object instanceof Sprite&&object.userData.atlas){const p=object.getWorldPosition(new Vector3()).project(camera),scale=object.getWorldScale(new Vector3()),w=scale.x*camera.zoom/(camera.right-camera.left)*width,h=scale.y*camera.zoom/(camera.top-camera.bottom)*height,x=(p.x+1)*width/2-object.center.x*w,y=(1-p.y)*height/2-(1-object.center.y)*h,points=[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}];if(!cull||!outside(points,width,height))faces.push({points,depth:p.z,layer:3,color:'',owner:object.userData.entityId,sprite:object,rect:{x,y,width:w,height:h}});return;}
  if(!(object instanceof Mesh)||object.userData.worldBatch)return;const mesh=/** @type {import('three').Mesh<import('three').BufferGeometry,import('three').MeshLambertMaterial>} */(object),positions=mesh.geometry.getAttribute('position'),normals=mesh.geometry.getAttribute('normal'),gable=!!mesh.userData.worldGable;
  if(gable?positions.count!==3:mesh.geometry.type!=='BoxGeometry'||positions.count!==24)return;
  let ancestor=/** @type {import('three').Object3D} */(mesh);while(ancestor.parent&&!ancestor.userData.entityId)ancestor=ancestor.parent;
  const owner=typeof ancestor.userData.entityId==='string'?ancestor.userData.entityId:null,signature=[mesh.geometry.uuid,'version'in positions?positions.version:positions.data.version,'version'in normals?normals.version:normals.data.version,owner,mesh.material.color.r,mesh.material.color.g,mesh.material.color.b,mesh.material.opacity,mesh.userData.canvasLayer,mesh.userData.pickThrough,mesh.userData.coveredTop,gable].join('|'),cached=cache?.get(mesh,signature);if(cached){faces.push(...cached);return;}
  const surface=cache?.surface(mesh,signature,shade.key,()=>{const m=new Matrix3().getNormalMatrix(mesh.matrixWorld);return Array.from({length:gable?1:6},(_,face)=>new Vector3().fromBufferAttribute(normals,face*4).applyMatrix3(m).normalize());}),normalMatrix=surface?null:new Matrix3().getNormalMatrix(mesh.matrixWorld),objectProjection=viewProjection?new Matrix4().multiplyMatrices(viewProjection,mesh.matrixWorld):null;
  /** @type {CanvasFace[]} */const projected=[];
  for(let face=0;face<(gable?1:6);face++){
   const normal=surface?surface.normals[face]:new Vector3().fromBufferAttribute(normals,face*4).applyMatrix3(/** @type {Matrix3} */(normalMatrix)).normalize();if(normal.dot(direction)>=-1e-8||mesh.userData.coveredTop&&normal.y>.99)continue;
   const vertices=Array.from({length:gable?3:4},(_,i)=>{const index=face*4+i;if(!objectProjection)return new Vector3().fromBufferAttribute(positions,index).applyMatrix4(mesh.matrixWorld).project(camera);const x=positions.getX(index),y=positions.getY(index),z=positions.getZ(index),m=mesh.matrixWorld.elements,v=camera.matrixWorldInverse.elements,p=camera.projectionMatrix.elements,q=objectProjection.elements,wx=m[0]*x+m[4]*y+m[8]*z+m[12],wy=m[1]*x+m[5]*y+m[9]*z+m[13],wz=m[2]*x+m[6]*y+m[10]*z+m[14],w=1/(q[3]*x+q[7]*y+q[11]*z+q[15]),vw=1/(v[3]*wx+v[7]*wy+v[11]*wz+v[15]);/* Exact original depth arithmetic preserves coplanar draw-order ties. */return{x:(q[0]*x+q[4]*y+q[8]*z+q[12])*w,y:(q[1]*x+q[5]*y+q[9]*z+q[13])*w,z:p[10]*((v[2]*wx+v[6]*wy+v[10]*wz+v[14])*vw)+p[14]};});
   const points=vertices.map(p=>({x:(p.x+1)*width/2,y:(1-p.y)*height/2}));if(fastProjection){/* Fixed BoxGeometry grid perimeter; triangles are already convex. */if(!gable)[points[2],points[3]]=[points[3],points[2]];}else{const center={x:points.reduce((n,p)=>n+p.x,0)/points.length,y:points.reduce((n,p)=>n+p.y,0)/points.length};points.sort((a,b)=>Math.atan2(a.y-center.y,a.x-center.x)-Math.atan2(b.y-center.y,b.x-center.x));}
   if(!cull||!outside(points,width,height))projected.push({points,depth:vertices.reduce((n,p)=>n+p.z,0)/vertices.length,layer:Number(mesh.userData.canvasLayer??3),opacity:mesh.material.opacity,pickThrough:!!mesh.userData.pickThrough,color:surface?(surface.colors[face]??=shade(mesh.material.color,normal)):shade(mesh.material.color,normal),owner});
  }
  cache?.set(mesh,signature,projected);faces.push(...projected);
 });
 return faces.sort((a,b)=>a.layer-b.layer||b.depth-a.depth);
}
/** @param {readonly Point[]} points @param {number} x @param {number} y */
export function containsPoint(points,x,y){
 let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){
  const a=points[i],b=points[j],cross=(x-a.x)*(b.y-a.y)-(y-a.y)*(b.x-a.x);
  if(Math.abs(cross)<1e-7&&x>=Math.min(a.x,b.x)&&x<=Math.max(a.x,b.x)&&y>=Math.min(a.y,b.y)&&y<=Math.max(a.y,b.y))return true;
  if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)inside=!inside;
 }return inside;
}
/** Topmost actually painted polygon owns the input; nonselectable faces occlude.
 * @param {readonly CanvasFace[]} faces @param {number} x @param {number} y
 */
export function pickCanvasFace(faces,x,y){for(let i=faces.length-1;i>=0;i--){const face=faces[i];if(face.pickThrough)continue;if(!containsPoint(face.points,x,y))continue;if(face.sprite&&face.rect&&!spriteOpaque(face.sprite,{x:(x-face.rect.x)/face.rect.width,y:1-(y-face.rect.y)/face.rect.height}))continue;return face.owner;}return null;}

/** @typedef {{image:CanvasImageSource,source:CanvasImageSource,sx:number,sy:number,x:number,y:number,width:number,height:number,fx:number,fy:number,fw:number,fh:number,mix:number,r:number,g:number,b:number}} CanvasSpriteFrame */
/** @typedef {{readback:boolean,blendCanvas?:HTMLCanvasElement,tintCanvas?:HTMLCanvasElement,frame?:CanvasSpriteFrame}} CanvasSpritePaint */

/** Pooled crossfade and multiplicative underwater tint preserve the actual atlas
 * alpha mask; neither a solid rectangle nor a new per-frame canvas is painted.
 * @param {CanvasRenderingContext2D} context @param {Sprite} sprite @param {{x:number,y:number,width:number,height:number}} rect @param {CanvasSpritePaint} buffers @param {boolean} [cacheEnabled] */
function paintSprite(context,sprite,rect,buffers,cacheEnabled=true){const{asset,pose,from,mix}=sprite.userData.atlas,color=sprite.material.color,blending=!!from&&mix<1,previous=buffers.frame;
 if(cacheEnabled&&previous&&previous.image===asset.image&&previous.x===pose.x&&previous.y===pose.y&&previous.width===pose.width&&previous.height===pose.height&&previous.fx===(blending?from.x:-1)&&previous.fy===(blending?from.y:-1)&&previous.fw===(blending?from.width:-1)&&previous.fh===(blending?from.height:-1)&&previous.mix===(blending?mix:1)&&previous.r===color.r&&previous.g===color.g&&previous.b===color.b){context.drawImage(previous.source,previous.sx,previous.sy,pose.width,pose.height,rect.x,rect.y,rect.width,rect.height);return true;}/** @type {HTMLImageElement|HTMLCanvasElement} */let source=asset.image;let sx=pose.x,sy=pose.y;
 if(from&&mix<1){let blend=buffers.blendCanvas;if(!blend){blend=document.createElement('canvas');buffers.blendCanvas=blend;}if(blend.width!==pose.width||blend.height!==pose.height){blend.width=pose.width;blend.height=pose.height;}const c=blend.getContext('2d',{willReadFrequently:buffers.readback});if(c){c.clearRect(0,0,blend.width,blend.height);c.globalCompositeOperation='source-over';c.globalAlpha=1-mix;c.drawImage(asset.image,from.x,from.y,from.width,from.height,0,0,pose.width,pose.height);c.globalCompositeOperation='lighter';c.globalAlpha=mix;c.drawImage(asset.image,pose.x,pose.y,pose.width,pose.height,0,0,pose.width,pose.height);source=blend;sx=0;sy=0;}}
 if(sprite.material.color.getHex()!==0xffffff){let tint=buffers.tintCanvas;if(!tint){tint=document.createElement('canvas');buffers.tintCanvas=tint;}if(tint.width!==pose.width||tint.height!==pose.height){tint.width=pose.width;tint.height=pose.height;}const c=tint.getContext('2d',{willReadFrequently:buffers.readback});if(c){const draw=()=>c.drawImage(source,sx,sy,pose.width,pose.height,0,0,pose.width,pose.height);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.clearRect(0,0,tint.width,tint.height);draw();c.globalCompositeOperation='multiply';c.fillStyle=sprite.material.color.getStyle();c.fillRect(0,0,tint.width,tint.height);c.globalCompositeOperation='destination-in';draw();source=tint;sx=0;sy=0;}}
 context.drawImage(source,sx,sy,pose.width,pose.height,rect.x,rect.y,rect.width,rect.height);
 buffers.frame={image:asset.image,source,sx,sy,x:pose.x,y:pose.y,width:pose.width,height:pose.height,fx:blending?from.x:-1,fy:blending?from.y:-1,fw:blending?from.width:-1,fh:blending?from.height:-1,mix:blending?mix:1,r:color.r,g:color.g,b:color.b};return false;
}

/** @param {HTMLCanvasElement} canvas @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} [pixelRatio] @param {boolean} [cacheEnabled] @param {boolean} [cull] @param {boolean} [fastProjection] */
export function createCanvasWorldRenderer(canvas,scene,camera,pixelRatio=1,cacheEnabled=true,cull=true,fastProjection=cacheEnabled){
 const ratio=Number.isFinite(pixelRatio)?Math.max(1,Math.min(1.5,pixelRatio)):1;
 const context=canvas.getContext('2d');if(!context)throw new Error('Canvas2D unavailable');const readback=!!context.getContextAttributes?.().willReadFrequently;
 /** @type {CanvasFace[]} */let faces=[];let disposed=false;const projection=createCanvasProjectionCache();
 /** @type {WeakMap<CanvasFace,Path2D|null>|null} */let paths=cacheEnabled&&typeof Path2D==='function'?new WeakMap():null;let pathHits=0,pathBuilds=0,spriteReuses=0;
 /** Buffers belong to this renderer, never to shared scene sprites. @type {WeakMap<Sprite,CanvasSpritePaint>} */let spritePaint=new WeakMap();
 /** Cache a polygon only after its projection survives more than one frame. Dynamic leaves keep the reference painter. @param {CanvasFace} face */
 const paintFace=(/** @type {CanvasFace} */face,/** @type {CanvasRenderingContext2D} */target=context)=>{const makePath=()=>new Path2D('M'+face.points.map(p=>p.x+','+p.y).join('L')+'Z');if(paths){const known=paths.has(face);let path=paths.get(face);if(known){if(!path){path=makePath();paths.set(face,path);pathBuilds++;}else pathHits++;target.fillStyle=face.color;target.fill(path);return;}paths.set(face,null);}if(typeof Path2D==='function'){target.fillStyle=face.color;target.fill(makePath());return;}target.beginPath();for(let i=0;i<face.points.length;i++){const p=face.points[i];if(i===0)target.moveTo(p.x,p.y);else target.lineTo(p.x,p.y);}target.closePath();target.fillStyle=face.color;target.fill();};
 /** One bounded background buffer. Only an unchanged consecutive prefix can be
  * reused; every animated face/sprite still paints at its original depth. The
  * prefix can shrink as actors move, and resets on projection invalidation.
  * @type {{canvas:HTMLCanvasElement,context:CanvasRenderingContext2D,faces:CanvasFace[],background:string}|null} */
 let prefix=null;let prefixFaces=0,prefixReused=false;
 /** @param {number} w @param {number} h @param {string} background */
 const paintPrefix=(w,h,background)=>{
  prefixFaces=0;prefixReused=false;if(!cacheEnabled||typeof document==='undefined')return;
  let count=0;while(count<faces.length&&!faces[count].sprite&&projection.wasReused(faces[count]))count++;
  if(count<32){if(prefix){prefix.faces=[];prefix.background='';}return;}
  if(prefix&&prefix.faces.length&&prefix.background===background&&prefix.canvas.width===w&&prefix.canvas.height===h)count=Math.min(count,prefix.faces.length);
  const reusable=!!prefix&&prefix.background===background&&prefix.canvas.width===w&&prefix.canvas.height===h&&prefix.faces.length===count&&prefix.faces.every((face,i)=>face===faces[i]);
  if(!prefix){const buffer=document.createElement('canvas'),ctx=buffer.getContext('2d',{willReadFrequently:readback});if(!ctx)return;prefix={canvas:buffer,context:ctx,faces:[],background:''};}
  if(!reusable){const p=prefix.context;prefix.canvas.width=w;prefix.canvas.height=h;p.setTransform(ratio,0,0,ratio,0,0);p.globalAlpha=1;p.fillStyle=background;p.fillRect(0,0,w/ratio,h/ratio);for(let i=0;i<count;i++){p.globalAlpha=faces[i].opacity??1;paintFace(faces[i],p);}prefix.faces=faces.slice(0,count);prefix.background=background;}
  context.save();context.setTransform(1,0,0,1,0,0);context.globalAlpha=1;context.globalCompositeOperation='copy';context.drawImage(prefix.canvas,0,0);context.restore();prefixFaces=count;prefixReused=reusable;
 };
 return {
  /** @param {number} width @param {number} height */
  render(width,height){if(disposed)return;pathHits=pathBuilds=spriteReuses=0;const w=Math.max(1,Math.round(width*ratio)),h=Math.max(1,Math.round(height*ratio));if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;context.setTransform(ratio,0,0,ratio,0,0);context.globalAlpha=1;const background=scene.background instanceof Color?scene.background.getStyle():WORLD_ART.light.background;context.fillStyle=background;context.fillRect(0,0,w/ratio,h/ratio);faces=projectSceneFaces(scene,camera,width,height,cacheEnabled?projection:undefined,cull,fastProjection);paintPrefix(w,h,background);for(let i=prefixFaces;i<faces.length;i++){const face=faces[i];context.globalAlpha=face.opacity??1;if(face.sprite&&face.rect){let buffers=spritePaint.get(face.sprite);if(!buffers){buffers={readback};spritePaint.set(face.sprite,buffers);}if(paintSprite(context,face.sprite,face.rect,buffers,cacheEnabled))spriteReuses++;continue;}paintFace(face);}},
  /** @param {number} x @param {number} y */
  pick:(x,y)=>disposed?null:pickCanvasFace(faces,x,y),
  dispose(){disposed=true;faces=[];paths=null;spritePaint=new WeakMap();pathHits=pathBuilds=spriteReuses=prefixFaces=0;prefixReused=false;if(prefix){prefix.canvas.width=prefix.canvas.height=0;prefix=null;}projection.clear();},
  inspect:()=>({disposed,paintedFaces:faces.length,projection:projection.inspect(),paths:{enabled:!!paths,hits:pathHits,builds:pathBuilds},spriteReuses,prefix:{faces:prefixFaces,reused:prefixReused,backingBytes:prefix?prefix.canvas.width*prefix.canvas.height*4:0}})
 };
}
