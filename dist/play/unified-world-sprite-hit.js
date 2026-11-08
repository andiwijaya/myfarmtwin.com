import {Sprite,Vector3} from './vendor/three/three.module.js';
/** Screen rectangles are input candidates only. The WebGL Raycaster verifies
 * visibility and occlusion before selecting an opaque atlas pixel.
 * @param {import('three').Scene} scene @param {import('three').OrthographicCamera} camera
 * @param {number} width @param {number} height */
export function projectSpriteHits(scene,camera,width,height){
 /** @type {{owner:string,sprite:Sprite,rect:{x:number,y:number,width:number,height:number}}[]} */
 const hits=[];if(width<=0||height<=0)return hits;
 scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 scene.traverseVisible(object=>{if(!(object instanceof Sprite)||!object.userData.atlas)return;
  const p=object.getWorldPosition(new Vector3()).project(camera),scale=object.getWorldScale(new Vector3()),w=scale.x*camera.zoom/(camera.right-camera.left)*width,h=scale.y*camera.zoom/(camera.top-camera.bottom)*height;
  hits.push({owner:object.userData.entityId,sprite:object,rect:{x:(p.x+1)*width/2-object.center.x*w,y:(1-p.y)*height/2-(1-object.center.y)*h,width:w,height:h}});
 });return hits;
}
