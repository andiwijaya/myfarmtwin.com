import {PlaneGeometry,DataTexture,RGBAFormat,LinearFilter,MeshBasicMaterial,Mesh} from './vendor/three/three.module.js';

/** Original radial contact-AO pixels, not a photographed/generated external asset.
 * @param {number} [size] */
export function contactPixels(size=32){
 if(!Number.isInteger(size)||size<8||size>128)throw new RangeError('Contact texture size');
 const pixels=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const r=Math.hypot((x+.5-size/2)/(size/2-1),(y+.5-size/2)/(size/2-1)),a=r>=1?0:Math.pow(1-r*r,2),i=(y*size+x)*4;pixels[i]=pixels[i+1]=pixels[i+2]=255;pixels[i+3]=Math.round(a*255);
 }
 return pixels;
}

/** One shared soft ellipse per cow. A contact pad, not dynamic physical shadow.
 * No framebuffer/readback, external image request, timer or simulation input.
 */
export function createCozyContacts(){
 const geometry=new PlaneGeometry(1,1).rotateX(-Math.PI/2),texture=new DataTexture(contactPixels(),32,32,RGBAFormat);texture.minFilter=texture.magFilter=LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;
 const material=new MeshBasicMaterial({map:texture,color:'#314b38',transparent:true,opacity:.27,depthWrite:false,toneMapped:false});let disposed=false;
 return{
  /** @param {number} width @param {number} depth */
  mesh(width,depth){if(disposed)throw new Error('Contact resources disposed');const mesh=new Mesh(geometry,material);mesh.scale.set(width,1,depth);mesh.userData.canvasLayer=2;mesh.userData.pickThrough=true;mesh.userData.contactAo=true;mesh.renderOrder=1;return mesh;},
  dispose(){if(disposed)return;disposed=true;geometry.dispose();material.dispose();texture.dispose();}
 };
}
