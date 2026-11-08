import {Mesh,Vector3,Matrix3,Sprite,Color,HemisphereLight,DirectionalLight,AmbientLight} from './vendor/three/three.module.js';
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
 const shade=(/** @type {Color} */color,/** @type {Vector3} */normal)=>{const irradiance=ambient.clone();for(const h of hemisphere)irradiance.add(h.ground.clone().lerp(h.sky,normal.dot(h.direction)*.5+.5));for(const d of directional)irradiance.add(d.color.clone().multiplyScalar(Math.max(0,normal.dot(d.direction))));return color.clone().multiply(irradiance).multiplyScalar(1/Math.PI).getStyle();};
 shade.key=JSON.stringify({ambient:ambient.toArray(),hemisphere:hemisphere.map(h=>[h.sky.toArray(),h.ground.toArray(),h.direction.toArray()]),directional:directional.map(d=>[d.color.toArray(),d.direction.toArray()])});return shade;
}

/** Weak object keys release retired meshes with their scene groups. Only the
 * latest projection of each live mesh is retained; sprites remain dynamic. */
export function createCanvasProjectionCache(){
 /** @type {WeakMap<import('three').Mesh,{epoch:number,signature:string,matrix:number[],faces:CanvasFace[]}>} */
 let entries=new WeakMap();let key='',epoch=0,hits=0,misses=0;
 return{
  /** @param {string} next */
  begin(next){if(key!==next){key=next;epoch++;}hits=0;misses=0;},
  /** @param {import('three').Mesh} mesh @param {string} signature */
  get(mesh,signature){const entry=entries.get(mesh);if(entry&&entry.epoch===epoch&&entry.signature===signature&&entry.matrix.every((value,i)=>value===mesh.matrixWorld.elements[i])){hits++;return entry.faces;}misses++;return null;},
  /** @param {import('three').Mesh} mesh @param {string} signature @param {CanvasFace[]} faces */
  set(mesh,signature,faces){entries.set(mesh,{epoch,signature,matrix:[...mesh.matrixWorld.elements],faces});},
  clear(){entries=new WeakMap();key='';epoch=hits=misses=0;},
  inspect:()=>({hits,misses,epoch})
 };
}
/** Conservative viewport rejection preserves partially visible polygons and
 * their ownership. @param {readonly Point[]} points @param {number} width @param {number} height */
function outside(points,width,height){return points.every(p=>p.x<-.5)||points.every(p=>p.x>width+.5)||points.every(p=>p.y<-.5)||points.every(p=>p.y>height+.5);}

/** Visible faces of the SAME scene/camera; no second world model or simulation.
 * Ground, paths and marker are explicit paint layers; object faces use camera depth.
 * @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} width @param {number} height @param {ReturnType<typeof createCanvasProjectionCache>} [cache] @param {boolean} [cull] @returns {CanvasFace[]}
 */
export function projectSceneFaces(scene,camera,width,height,cache,cull=true){
 if(width<=0||height<=0)return [];scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 const direction=camera.getWorldDirection(new Vector3()),shade=createCanvasLighting(scene);
 cache?.begin(cull+'|'+width+'|'+height+'|'+camera.matrixWorld.elements.join(',')+'|'+camera.projectionMatrix.elements.join(',')+'|'+shade.key);
 /** @type {CanvasFace[]} */const faces=[];
 scene.traverseVisible(object=>{
  if(object instanceof Sprite&&object.userData.atlas){const p=object.getWorldPosition(new Vector3()).project(camera),scale=object.getWorldScale(new Vector3()),w=scale.x*camera.zoom/(camera.right-camera.left)*width,h=scale.y*camera.zoom/(camera.top-camera.bottom)*height,x=(p.x+1)*width/2-object.center.x*w,y=(1-p.y)*height/2-(1-object.center.y)*h,points=[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}];if(!cull||!outside(points,width,height))faces.push({points,depth:p.z,layer:3,color:'',owner:object.userData.entityId,sprite:object,rect:{x,y,width:w,height:h}});return;}
  if(!(object instanceof Mesh)||object.userData.worldBatch)return;const mesh=/** @type {import('three').Mesh<import('three').BufferGeometry,import('three').MeshLambertMaterial>} */(object),positions=mesh.geometry.getAttribute('position'),normals=mesh.geometry.getAttribute('normal'),gable=!!mesh.userData.worldGable;
  if(gable?positions.count!==3:mesh.geometry.type!=='BoxGeometry'||positions.count!==24)return;
  let ancestor=/** @type {import('three').Object3D} */(mesh);while(ancestor.parent&&!ancestor.userData.entityId)ancestor=ancestor.parent;
  const owner=typeof ancestor.userData.entityId==='string'?ancestor.userData.entityId:null,signature=[mesh.geometry.uuid,'version'in positions?positions.version:positions.data.version,'version'in normals?normals.version:normals.data.version,owner,mesh.material.color.r,mesh.material.color.g,mesh.material.color.b,mesh.material.opacity,mesh.userData.canvasLayer,mesh.userData.pickThrough,mesh.userData.coveredTop,gable].join('|'),cached=cache?.get(mesh,signature);if(cached){faces.push(...cached);return;}
  const normalMatrix=new Matrix3().getNormalMatrix(mesh.matrixWorld);
  /** @type {CanvasFace[]} */const projected=[];
  for(let face=0;face<(gable?1:6);face++){
   const normal=new Vector3().fromBufferAttribute(normals,face*4).applyMatrix3(normalMatrix).normalize();if(normal.dot(direction)>=-1e-8||mesh.userData.coveredTop&&normal.y>.99)continue;
   const vertices=Array.from({length:gable?3:4},(_,i)=>new Vector3().fromBufferAttribute(positions,face*4+i).applyMatrix4(mesh.matrixWorld).project(camera));
   const points=vertices.map(p=>({x:(p.x+1)*width/2,y:(1-p.y)*height/2})),center={x:points.reduce((n,p)=>n+p.x,0)/points.length,y:points.reduce((n,p)=>n+p.y,0)/points.length};points.sort((a,b)=>Math.atan2(a.y-center.y,a.x-center.x)-Math.atan2(b.y-center.y,b.x-center.x));
   if(!outside(points,width,height))projected.push({points,depth:vertices.reduce((n,p)=>n+p.z,0)/vertices.length,layer:Number(mesh.userData.canvasLayer??3),opacity:mesh.material.opacity,pickThrough:!!mesh.userData.pickThrough,color:shade(mesh.material.color,normal),owner});
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

/** Pooled crossfade and multiplicative underwater tint preserve the actual atlas
 * alpha mask; neither a solid rectangle nor a new per-frame canvas is painted.
 * @param {CanvasRenderingContext2D} context @param {Sprite} sprite @param {{x:number,y:number,width:number,height:number}} rect */
function paintSprite(context,sprite,rect){const{asset,pose,from,mix}=sprite.userData.atlas;/** @type {HTMLImageElement|HTMLCanvasElement} */let source=asset.image;let sx=pose.x,sy=pose.y;
 if(from&&mix<1){let blend=sprite.userData.blendCanvas;if(!blend){blend=document.createElement('canvas');sprite.userData.blendCanvas=blend;}if(blend.width!==pose.width||blend.height!==pose.height){blend.width=pose.width;blend.height=pose.height;}const c=blend.getContext('2d');c.clearRect(0,0,blend.width,blend.height);c.globalCompositeOperation='source-over';c.globalAlpha=1-mix;c.drawImage(asset.image,from.x,from.y,from.width,from.height,0,0,pose.width,pose.height);c.globalCompositeOperation='lighter';c.globalAlpha=mix;c.drawImage(asset.image,pose.x,pose.y,pose.width,pose.height,0,0,pose.width,pose.height);source=blend;sx=0;sy=0;}
 if(sprite.material.color.getHex()!==0xffffff){let tint=sprite.userData.tintCanvas;if(!tint){tint=document.createElement('canvas');sprite.userData.tintCanvas=tint;}if(tint.width!==pose.width||tint.height!==pose.height){tint.width=pose.width;tint.height=pose.height;}const c=tint.getContext('2d'),draw=()=>c.drawImage(source,sx,sy,pose.width,pose.height,0,0,pose.width,pose.height);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.clearRect(0,0,tint.width,tint.height);draw();c.globalCompositeOperation='multiply';c.fillStyle=sprite.material.color.getStyle();c.fillRect(0,0,tint.width,tint.height);c.globalCompositeOperation='destination-in';draw();source=tint;sx=0;sy=0;}
 context.drawImage(source,sx,sy,pose.width,pose.height,rect.x,rect.y,rect.width,rect.height);
}

/** @param {HTMLCanvasElement} canvas @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} [pixelRatio] @param {boolean} [cacheEnabled] @param {boolean} [cull] */
export function createCanvasWorldRenderer(canvas,scene,camera,pixelRatio=1,cacheEnabled=true,cull=true){
 const context=canvas.getContext('2d');if(!context)throw new Error('Canvas2D unavailable');
 const ratio=Number.isFinite(pixelRatio)?Math.max(1,Math.min(1.5,pixelRatio)):1;
 /** @type {CanvasFace[]} */let faces=[];let disposed=false;const projection=createCanvasProjectionCache();
 return {
  /** @param {number} width @param {number} height */
  render(width,height){if(disposed)return;const w=Math.max(1,Math.round(width*ratio)),h=Math.max(1,Math.round(height*ratio));if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;context.setTransform(ratio,0,0,ratio,0,0);context.globalAlpha=1;context.fillStyle=scene.background instanceof Color?scene.background.getStyle():WORLD_ART.light.background;context.fillRect(0,0,width,height);faces=projectSceneFaces(scene,camera,width,height,cacheEnabled?projection:undefined,cull);for(const face of faces){context.globalAlpha=face.opacity??1;if(face.sprite&&face.rect){paintSprite(context,face.sprite,face.rect);continue;}context.beginPath();for(const [i,p]of face.points.entries())if(i===0)context.moveTo(p.x,p.y);else context.lineTo(p.x,p.y);context.closePath();context.fillStyle=face.color;context.fill();}},
  /** @param {number} x @param {number} y */
  pick:(x,y)=>disposed?null:pickCanvasFace(faces,x,y),
  dispose(){disposed=true;faces=[];projection.clear();},
  inspect:()=>({disposed,paintedFaces:faces.length,projection:projection.inspect()})
 };
}
