import {Mesh,Sprite,InstancedMesh,Frustum,Matrix4,Sphere,DoubleSide} from 'three';
import {COZY_ART} from './unified-cozy-art.js';
/** @typedef {import('./unified-world-part-meshes.js').WorldPartLod} PartLod */
/** @param {import('three').Material} material */
const passes=material=>!material.visible?0:material.transparent&&material.side===DoubleSide&&!material.forceSinglePass?2:1;
/** @param {import('three').BufferGeometry} geometry @param {{start:number,count:number}|undefined} group */
function triangleCount(geometry,group){const range=geometry.drawRange,count=geometry.index?.count||geometry.getAttribute('position').count,start=Math.max(range.start,group?.start||0),end=Math.min(count,range.start+range.count,group?group.start+group.count:Infinity);return Math.floor(Math.max(0,end-start)/3);}

/** Choose actual visible geometry only; no clock, RNG, save, grants or engine
 * commands. Full meshes are retained for close views. The budget estimate is
 * explicitly an estimate; renderer.info remains the independent QA authority.
 * @param {{budget?:number}} [options] */
export function createWorldPartLod({budget=COZY_ART.budgets.normalTriangles}={}){
 if(!Number.isFinite(budget)||budget<=0)throw new RangeError('Positive render budget required');
 const frustum=new Frustum(),matrix=new Matrix4(),sphere=new Sphere();let mode='overview';
 let last={mode,reason:'initial',estimatedFullTriangles:0,swappedMeshes:0};Object.freeze(last);
 return{
  /** @param {import('three').Scene} scene @param {import('three').Camera} camera @param {number} pixelsPerUnit */
  update(scene,camera,pixelsPerUnit){
   if(!Number.isFinite(pixelsPerUnit)||pixelsPerUnit<=0)throw new RangeError('Positive CSS pixel scale required');
   scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);matrix.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(matrix);let fullTriangles=0;
   scene.traverseVisible(object=>{
    if(!(object instanceof Mesh||object instanceof Sprite)||!camera.layers.test(object.layers))return;
    /** @type {PartLod|undefined} */const lod=object.userData.worldPartLod,geometry=lod?.full||object.geometry;
    if(object.frustumCulled){if(object instanceof Sprite){if(!frustum.intersectsSprite(object))return;}else{if(object instanceof InstancedMesh){if(!object.boundingSphere)object.computeBoundingSphere();if(!object.boundingSphere)return;sphere.copy(object.boundingSphere);}else{if(!geometry.boundingSphere)geometry.computeBoundingSphere();if(!geometry.boundingSphere)return;sphere.copy(geometry.boundingSphere);}sphere.applyMatrix4(object.matrixWorld);if(!frustum.intersectsSphere(sphere))return;}}
    const instances=object instanceof InstancedMesh?object.count:1;
    if(Array.isArray(object.material))for(const group of geometry.groups){const material=object.material[group.materialIndex||0];if(material)fullTriangles+=triangleCount(geometry,group)*instances*passes(material);}else fullTriangles+=triangleCount(geometry,undefined)*instances*passes(object.material);
   });
   let reason='hysteresis';if(fullTriangles>budget){mode='overview';reason='triangle-budget';}else if(pixelsPerUnit<22){mode='overview';reason='pixel-size';}else if(pixelsPerUnit>=26){mode='full';reason='close-view';}
   let swappedMeshes=0;scene.traverseVisible(object=>{if(!(object instanceof Mesh))return;/** @type {PartLod|undefined} */const lod=object.userData.worldPartLod;if(!lod||lod.disposed)return;let geometry=lod.full;if(mode==='overview'){if(!lod.overview){if(!lod.createOverview)return;lod.overview=lod.createOverview();}geometry=lod.overview;}if(object.geometry!==geometry){object.geometry=geometry;swappedMeshes++;}});
   last=Object.freeze({mode,reason,estimatedFullTriangles:fullTriangles,swappedMeshes});return last;
  },
  inspect:()=>last
 };
}
