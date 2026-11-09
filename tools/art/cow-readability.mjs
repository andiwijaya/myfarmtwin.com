import {Group,Mesh,SphereGeometry,CylinderGeometry,ConeGeometry,MeshLambertMaterial,DataTexture,RGBAFormat,SRGBColorSpace,LinearFilter,RepeatWrapping,Box3} from './vendor/three.module.js';

// Original readability authoring rig. Same geometry scale/camera as the V2 rig.
// Paint edges use UVs rather than broad interpolated triangle vertex colors.
// No engine, RNG or clock. Render acceptance belongs to the living checklist.
/** Original normalized sphere paint field; never detached spot geometry. */
export function coatRole(x,y,z,face=false){
 if(face)return Math.abs(x)>.48&&z>-.55&&y>-.42?'patch':'coat';
 const left=((x+.78)/.65)**2+((y-.14)/.63)**2+((z+.24)/.55)**2,right=((x-.8)/.68)**2+((y-.05)/.58)**2+((z-.28)/.53)**2;
 return left<1||right<1||z<-.74&&y>-.15?'patch':y<-.58?'cream':'coat';
}
export function createModel(){
 const root=new Group(),body=new Group(),head=new Group(),udder=new Group(),tail=new Group(),legs=[],materials=new Map(),geometries=new Set(),textures=new Set();
 const p={coat:'#f5efe0',patch:'#29352f',cream:'#e4d6ba',pink:'#ce8c83',inner:'#e9b7a7',hoof:'#41433a',white:'#fffaf0'};
 const sphere=new SphereGeometry(1,20,12),cylinder=new CylinderGeometry(.8,1,1,10),cone=new ConeGeometry(1,1,10),bounds=new Box3();
 for(const g of [sphere,cylinder,cone])geometries.add(g);
 const material=(color,vertex=false)=>{const key=color+'|'+vertex;if(!materials.has(key))materials.set(key,new MeshLambertMaterial({color,vertexColors:vertex,flatShading:false}));return materials.get(key);};
 const mesh=(parent,geometry,color,x,y,z,sx,sy,sz,vertex=false)=>{const m=new Mesh(geometry,material(color,vertex));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
 const round=(parent,color,x,y,z,sx,sy,sz)=>mesh(parent,sphere,color,x,y,z,sx,sy,sz);
 root.add(body);body.add(head,udder,tail);

 function paint(parent,geometry,face,x,y,z,sx,sy,sz){
  const width=256,height=128,data=new Uint8Array(width*height*4),rgb=Object.fromEntries(['coat','patch','cream'].map(role=>{const hex=parseInt(p[role].slice(1),16);return[role,[hex>>16,(hex>>8)&255,hex&255]];}));
  for(let py=0;py<height;py++)for(let px=0;px<width;px++){
   const phi=(px+.5)/width*Math.PI*2,theta=(1-(py+.5)/height)*Math.PI,x=-Math.cos(phi)*Math.sin(theta),y=Math.cos(theta),z=Math.sin(phi)*Math.sin(theta),color=rgb[coatRole(x,y,z,face)],i=(py*width+px)*4;data[i]=color[0];data[i+1]=color[1];data[i+2]=color[2];data[i+3]=255;
  }
  const texture=new DataTexture(data,width,height,RGBAFormat);texture.colorSpace=SRGBColorSpace;texture.minFilter=texture.magFilter=LinearFilter;texture.wrapS=RepeatWrapping;texture.generateMipmaps=false;texture.needsUpdate=true;texture.userData.cowPaint=face?'face':'body';textures.add(texture);
  const material=new MeshLambertMaterial({map:texture,flatShading:false});materials.set(face?'face-paint':'body-paint',material);const m=new Mesh(geometry,material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;
 }
 const coat=new SphereGeometry(1,24,16);geometries.add(coat);paint(body,coat,false,0,1.02,-.04,.6,.48,.75);
 round(body,p.coat,0,1.16,.48,.32,.32,.34);
 head.position.set(0,1.18,.67);
 paint(head,sphere,true,0,.1,.01,.3,.29,.29);
 const muzzle=round(head,p.pink,0,-.1,.3,.33,.17,.22);
 round(head,p.cream,0,-.19,.28,.3,.055,.18);
 for(const side of [-1,1]){
  const ear=round(head,p.coat,side*.37,.27,0,.2,.075,.11);ear.rotation.z=side*.14;
  const inner=round(head,p.inner,side*.39,.297,.04,.14,.03,.07);inner.rotation.z=side*.14;
  const horn=mesh(head,cone,p.cream,side*.17,.45,-.035,.045,.18,.045);horn.rotation.z=-side*.2;
  round(head,p.white,side*.267,.15,.19,.052,.065,.042);
  round(head,p.patch,side*.283,.15,.21,.034,.044,.028);
  round(head,p.white,side*.291,.171,.229,.01,.013,.009);
  round(head,p.patch,side*.15,-.09,.5,.036,.024,.018);
 }
 for(const x of [-.055,0,.055])round(head,p.cream,x,.347,.03,.047,.036,.065);
 round(udder,p.pink,0,.64,-.2,.2,.12,.24);
 for(const x of [-.08,.08])for(const z of [-.1,-.27])mesh(udder,cylinder,p.pink,x,.48,z,.025,.08,.025);

 for(const x of [-.32,.32])for(const z of [-.4,.4]){
  const upper=new Group(),knee=new Group();upper.position.set(x,0,z);knee.position.y=-.28;upper.add(knee);root.add(upper);
  mesh(upper,cylinder,p.coat,0,-.14,0,.085,.28,.085);round(upper,p.coat,0,-.28,0,.078,.08,.08);
  mesh(knee,cylinder,p.coat,0,-.135,0,.06,.27,.06);round(knee,p.hoof,0,-.3,.025,.105,.07,.12);
  mesh(knee,cylinder,p.hoof,0,-.355,.025,.1,.03,.11);
  legs.push({upper,knee,x,z});
 }
 tail.position.set(0,1.14,-.77);
 const tailBone=mesh(tail,cylinder,p.cream,0,-.26,-.035,.026,.53,.026);tailBone.rotation.x=.12;
 round(tail,p.patch,0,-.57,-.07,.065,.095,.055);

 let disposed=false;
 function pose(action,frame){
  if(disposed)throw Error('Disposed cow rig');
  if(!['idle','walk','feed','drink','rest','milk'].includes(action)||!Number.isInteger(frame)||frame<0||frame>3)throw RangeError('Known action and four-frame index required');
  const phase=frame/4*Math.PI*2,rest=action==='rest',walk=action==='walk',feed=action==='feed',drink=action==='drink';
  body.position.y=rest?-.53:walk?.01*(1-Math.cos(phase*2)):Math.sin(phase)*.006;
  head.position.y=feed?.96:drink?.9:1.18;head.rotation.x=feed?.68+Math.sin(phase)*.035:drink?.82+Math.sin(phase)*.025:rest?-.08:0;
  muzzle.position.y=-.1+((feed||action==='idle')?Math.sin(phase)*.01:0);udder.visible=!rest;
  tail.rotation.set(rest?1.05:0,0,Math.sin(phase)*(action==='milk'?.24:.08));
  for(const [index,leg]of legs.entries()){
   const wave=Math.sin(phase+(index===0||index===3?0:Math.PI)),front=leg.z>0?1:-1;
   leg.upper.rotation.set(rest?front*1.05:walk?wave*.24:0,0,rest?-Math.sign(leg.x)*.12:0);
   leg.knee.rotation.x=rest?-front*1.55:walk?Math.max(0,wave)*.14:0;
   leg.upper.position.set(leg.x,0,leg.z);
   root.updateMatrixWorld(true);bounds.setFromObject(leg.upper);
   leg.upper.position.y=-bounds.min.y+(walk?Math.max(0,wave)*.075:0);
  }
  root.updateMatrixWorld(true);
 }
 pose('idle',0);
 return {root,pose,dispose(){if(disposed)return;disposed=true;for(const g of geometries)g.dispose();for(const m of materials.values())m.dispose();for(const texture of textures)texture.dispose();root.clear();}};
}
