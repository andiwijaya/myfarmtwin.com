import {Mesh,Vector3,Matrix3} from 'three';
/** @typedef {{x:number,y:number}} Point */
/** @typedef {{points:Point[],depth:number,layer:number,color:string,owner:string|null}} CanvasFace */

/** Visible faces of the SAME scene/camera; no second world model or simulation.
 * Ground, paths and marker are explicit paint layers; object faces use camera depth.
 * @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} width @param {number} height @returns {CanvasFace[]}
 */
export function projectSceneFaces(scene,camera,width,height){
 if(width<=0||height<=0)return [];scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 const direction=camera.getWorldDirection(new Vector3()),light=new Vector3(-8,18,10).normalize();
 /** @type {CanvasFace[]} */const faces=[];
 scene.traverseVisible(object=>{
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
export function pickCanvasFace(faces,x,y){for(let i=faces.length-1;i>=0;i--)if(containsPoint(faces[i].points,x,y))return faces[i].owner;return null;}

/** @param {HTMLCanvasElement} canvas @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera @param {number} [pixelRatio] */
export function createCanvasWorldRenderer(canvas,scene,camera,pixelRatio=1){
 const context=canvas.getContext('2d');if(!context)throw new Error('Canvas2D unavailable');
 const ratio=Number.isFinite(pixelRatio)?Math.max(1,Math.min(1.5,pixelRatio)):1;
 /** @type {CanvasFace[]} */let faces=[];let disposed=false;
 return {
  /** @param {number} width @param {number} height */
  render(width,height){if(disposed)return;const w=Math.max(1,Math.round(width*ratio)),h=Math.max(1,Math.round(height*ratio));if(canvas.width!==w)canvas.width=w;if(canvas.height!==h)canvas.height=h;context.setTransform(ratio,0,0,ratio,0,0);context.fillStyle='#e5eddc';context.fillRect(0,0,width,height);faces=projectSceneFaces(scene,camera,width,height);for(const face of faces){context.beginPath();for(const [i,p]of face.points.entries())if(i===0)context.moveTo(p.x,p.y);else context.lineTo(p.x,p.y);context.closePath();context.fillStyle=face.color;context.fill();}},
  /** @param {number} x @param {number} y */
  pick:(x,y)=>disposed?null:pickCanvasFace(faces,x,y),
  dispose(){disposed=true;faces=[];},
  inspect:()=>({disposed,paintedFaces:faces.length})
 };
}
