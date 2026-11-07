import {Mesh,Vector3,Matrix3,Sprite} from 'three';
import {WORLD_ART} from './unified-world-art.js';
import {spriteOpaque} from './unified-world-sprites.js';
/** @typedef {{x:number,y:number}} Point */
/** @typedef {{points:Point[],depth:number,layer:number,color:string,owner:string|null,sprite?:Sprite,rect?:{x:number,y:number,width:number,height:number}}} CanvasFace */

/** Visible faces of the SAME scene/camera; no second world model or simulation.
 * Ground, paths and marker are explicit paint layers; object faces use camera depth.
 * @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} width @param {number} height @returns {CanvasFace[]}
 */
export function projectSceneFaces(scene,camera,width,height){
 if(width<=0||height<=0)return [];scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 const position=WORLD_ART.light.keyPosition,direction=camera.getWorldDirection(new Vector3()),light=new Vector3(position[0],position[1],position[2]).normalize();
 /** @type {CanvasFace[]} */const faces=[];
 scene.traverseVisible(object=>{
  if(object instanceof Sprite&&object.userData.atlas){const p=object.getWorldPosition(new Vector3()).project(camera),scale=object.getWorldScale(new Vector3()),w=scale.x*camera.zoom/(camera.right-camera.left)*width,h=scale.y*camera.zoom/(camera.top-camera.bottom)*height,x=(p.x+1)*width/2-object.center.x*w,y=(1-p.y)*height/2-(1-object.center.y)*h;faces.push({points:[{x,y},{x:x+w,y},{x:x+w,y:y+h},{x,y:y+h}],depth:p.z,layer:3,color:'',owner:object.userData.entityId,sprite:object,rect:{x,y,width:w,height:h}});return;}
  if(!(object instanceof Mesh))return;const mesh=/** @type {import('three').Mesh<import('three').BoxGeometry,import('three').MeshLambertMaterial>} */(object),positions=mesh.geometry.getAttribute('position'),normals=mesh.geometry.getAttribute('normal');
  if(mesh.geometry.type!=='BoxGeometry'||positions.count!==24)return;
  let ancestor=/** @type {import('three').Object3D} */(mesh);while(ancestor.parent&&!ancestor.userData.entityId)ancestor=ancestor.parent;
  const owner=typeof ancestor.userData.entityId==='string'?ancestor.userData.entityId:null,normalMatrix=new Matrix3().getNormalMatrix(mesh.matrixWorld);
  for(let face=0;face<6;face++){
   const normal=new Vector3().fromBufferAttribute(normals,face*4).applyMatrix3(normalMatrix).normalize();if(normal.dot(direction)>=-1e-8)continue;
   const vertices=Array.from({length:4},(_,i)=>new Vector3().fromBufferAttribute(positions,face*4+i).applyMatrix4(mesh.matrixWorld).project(camera));
   const points=vertices.map(p=>({x:(p.x+1)*width/2,y:(1-p.y)*height/2})),center={x:points.reduce((n,p)=>n+p.x,0)/4,y:points.reduce((n,p)=>n+p.y,0)/4};points.sort((a,b)=>Math.atan2(a.y-center.y,a.x-center.x)-Math.atan2(b.y-center.y,b.x-center.x));
   faces.push({points,depth:vertices.reduce((n,p)=>n+p.z,0)/4,layer:Number(mesh.userData.canvasLayer??3),color:mesh.material.color.clone().multiplyScalar(.72+.28*Math.max(0,normal.dot(light))).getStyle(),owner});
  }
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
export function pickCanvasFace(faces,x,y){for(let i=faces.length-1;i>=0;i--){const face=faces[i];if(!containsPoint(face.points,x,y))continue;if(face.sprite&&face.rect&&!spriteOpaque(face.sprite,{x:(x-face.rect.x)/face.rect.width,y:1-(y-face.rect.y)/face.rect.height}))continue;return face.owner;}return null;}

/** @param {HTMLCanvasElement} canvas @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} [pixelRatio] */
export function createCanvasWorldRenderer(canvas,scene,camera,pixelRatio=1){
 const context=canvas.getContext('2d');if(!context)throw new Error('Canvas2D unavailable');
 const ratio=Number.isFinite(pixelRatio)?Math.max(1,Math.min(1.5,pixelRatio)):1;
 /** @type {CanvasFace[]} */let faces=[];let disposed=false;
 return {
  /** @param {number} width @param {number} height */
  render(width,height){if(disposed)return;const w=Math.max(1,Math.round(width*ratio)),h=Math.max(1,Math.round(height*ratio));if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;context.setTransform(ratio,0,0,ratio,0,0);context.fillStyle=WORLD_ART.light.background;context.fillRect(0,0,width,height);faces=projectSceneFaces(scene,camera,width,height);for(const face of faces){if(face.sprite&&face.rect){const{asset,pose,from,mix}=face.sprite.userData.atlas;if(from&&mix<1){let blend=face.sprite.userData.blendCanvas;if(!blend){blend=document.createElement('canvas');face.sprite.userData.blendCanvas=blend;}if(blend.width!==pose.width||blend.height!==pose.height){blend.width=pose.width;blend.height=pose.height;}const c=blend.getContext('2d');c.clearRect(0,0,blend.width,blend.height);c.globalCompositeOperation='source-over';c.globalAlpha=1-mix;c.drawImage(asset.image,from.x,from.y,from.width,from.height,0,0,pose.width,pose.height);c.globalCompositeOperation='lighter';c.globalAlpha=mix;c.drawImage(asset.image,pose.x,pose.y,pose.width,pose.height,0,0,pose.width,pose.height);context.drawImage(blend,face.rect.x,face.rect.y,face.rect.width,face.rect.height);}else context.drawImage(asset.image,pose.x,pose.y,pose.width,pose.height,face.rect.x,face.rect.y,face.rect.width,face.rect.height);continue;}context.beginPath();for(const [i,p]of face.points.entries())if(i===0)context.moveTo(p.x,p.y);else context.lineTo(p.x,p.y);context.closePath();context.fillStyle=face.color;context.fill();}},
  /** @param {number} x @param {number} y */
  pick:(x,y)=>disposed?null:pickCanvasFace(faces,x,y),
  dispose(){disposed=true;faces=[];},
  inspect:()=>({disposed,paintedFaces:faces.length})
 };
}
