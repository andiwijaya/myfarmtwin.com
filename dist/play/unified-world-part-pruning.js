import {FrontSide,Float32BufferAttribute} from './vendor/three/three.module.js';
import {WORLD_ART} from './unified-world-art.js';

/** The only current compiled-part animation scales nest Y by at most1.035.
 * The renderer clamps it to this conservative envelope. Rotating/rolling
 * geometry (crop canopies, future moving equipment) must preserve all faces. */
export const FARM_PART_MAX_Y_SCALE=1.05;
const enabled=new WeakSet(),horizontalPerVertical=1/Math.tan(WORLD_ART.projection.elevationDegrees*Math.PI/180);

/** Opt in only the fixed-elevation opaque farm part material. This changes no
 * shader/material appearance and never receives simulation or save data.
 * @param {import('three').MeshLambertMaterial} material */
export function configureFixedFarmParts(material){
 if(material.side!==FrontSide)throw new RangeError('Fixed farm pruning requires front-side culling');
 enabled.add(material);return material;
}

/** Remove triangles back-facing for EVERY azimuth at the canonical farm
 * elevation or above, with extra angular and Y-scale safety margins. Surviving
 * float attributes/order/normals and the original bounds stay bit-identical.
 * No silhouette/position decimation or alternate input geometry is introduced.
 * @param {import('three').BufferGeometry} geometry
 * @param {import('three').MeshLambertMaterial} material
 * @param {boolean} preserveFaces */
export function pruneFixedFarmParts(geometry,material,preserveFaces=false){
 const position=geometry.getAttribute('position'),before=position.count/3,keep=[];
 if(!Number.isInteger(before)||geometry.index)throw new RangeError('Nonindexed authored triangles required');
 const active=enabled.has(material)&&material.side===FrontSide&&!preserveFaces;
 if(active)for(let i=0;i<position.count;i+=3){
  const ux=position.getX(i+1)-position.getX(i),uy=position.getY(i+1)-position.getY(i),uz=position.getZ(i+1)-position.getZ(i),vx=position.getX(i+2)-position.getX(i),vy=position.getY(i+2)-position.getY(i),vz=position.getZ(i+2)-position.getZ(i),nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,length=Math.hypot(nx,ny,nz);
  // For any horizontal heading, max(N dot eye) <= Ny + cot(elevation)*|Nh|.
  // Scaling world Y scales horizontal face-normal components, hence the bound.
  const hidden=length>1e-10&&ny+horizontalPerVertical*FARM_PART_MAX_Y_SCALE*Math.hypot(nx,nz)<-.02*length;
  if(!hidden)keep.push(i);
 }
 const after=active?keep.length:before;
 if(after<before)for(const name of ['position','normal','color']){
  const original=geometry.getAttribute(name);
  if(!(original instanceof Float32BufferAttribute)||original.itemSize!==3||original.count!==position.count)throw new RangeError('Authored float position/normal/color attributes required');
  const packed=new Float32Array(after*9);for(const [j,i]of keep.entries())packed.set(original.array.subarray(i*3,i*3+9),j*9);
  geometry.setAttribute(name,new Float32BufferAttribute(packed,3));
 }
 geometry.userData.worldTriangleStats=Object.freeze({before,after,removed:before-after,preserveFaces,active});
}
