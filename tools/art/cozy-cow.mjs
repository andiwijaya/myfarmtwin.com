import {Group,Mesh,SphereGeometry,CylinderGeometry,ConeGeometry,MeshLambertMaterial,Float32BufferAttribute,Color,Box3} from './vendor/three.module.js';

// Original, uninstalled cow-slice authoring prototype. No engine, RNG or clock.
// The eventual atlas must pass four-view pixel/contact gates before promotion.
export function createModel(){
 const root=new Group(),body=new Group(),head=new Group(),udder=new Group(),tail=new Group(),legs=[],materials=new Map(),geometries=new Set();
 const p={coat:'#f5efe0',patch:'#303b38',cream:'#e4d6ba',pink:'#d89c93',inner:'#e9b7a7',hoof:'#41433a',white:'#fffaf0'};
 const sphere=new SphereGeometry(1,20,12),cylinder=new CylinderGeometry(.8,1,1,10),cone=new ConeGeometry(1,1,10),bounds=new Box3();
 for(const g of [sphere,cylinder,cone])geometries.add(g);
 const material=(color,vertex=false)=>{const key=color+'|'+vertex;if(!materials.has(key))materials.set(key,new MeshLambertMaterial({color,vertexColors:vertex,flatShading:false}));return materials.get(key);};
 const mesh=(parent,geometry,color,x,y,z,sx,sy,sz,vertex=false)=>{const m=new Mesh(geometry,material(color,vertex));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
 const round=(parent,color,x,y,z,sx,sy,sz)=>mesh(parent,sphere,color,x,y,z,sx,sy,sz);
 root.add(body);body.add(head,udder,tail);

 // Painted coat follows the body surface: no detached dark "spot" volumes.
 const coat=new SphereGeometry(1,24,16),colors=[],position=coat.getAttribute('position');geometries.add(coat);
 const white=new Color(p.coat),dark=new Color(p.patch),belly=new Color(p.cream);
 for(let i=0;i<position.count;i++){
  const x=position.getX(i),y=position.getY(i),z=position.getZ(i),left=((x+.78)/.65)**2+((y-.14)/.63)**2+((z+.24)/.55)**2,right=((x-.8)/.68)**2+((y-.05)/.58)**2+((z-.28)/.53)**2;
  const c=left<1||right<1||z<-.74&&y>-.15&&x>.05?dark:y<-.58?belly:white;colors.push(c.r,c.g,c.b);
 }
 coat.setAttribute('color',new Float32BufferAttribute(colors,3));mesh(body,coat,'#ffffff',0,1.02,-.04,.52,.45,.7,true);
 round(body,p.coat,0,1.16,.48,.28,.31,.32);
 head.position.set(0,1.18,.67);
 round(head,p.coat,0,.1,.01,.27,.27,.27);
 const muzzle=round(head,p.pink,0,-.1,.28,.29,.16,.2);
 round(head,p.cream,0,-.18,.26,.27,.055,.16);
 for(const side of [-1,1]){
  const ear=round(head,p.coat,side*.33,.27,0,.19,.065,.1);ear.rotation.z=side*.14;
  const inner=round(head,p.inner,side*.35,.292,.035,.13,.028,.065);inner.rotation.z=side*.14;
  const horn=mesh(head,cone,p.cream,side*.17,.45,-.035,.045,.18,.045);horn.rotation.z=-side*.2;
  round(head,p.patch,side*.237,.15,.18,.025,.037,.026);
  round(head,p.white,side*.244,.164,.2,.009,.011,.008);
  round(head,p.patch,side*.14,-.09,.455,.026,.019,.014);
 }
 for(const x of [-.055,0,.055])round(head,p.cream,x,.347,.03,.047,.036,.065);
 round(udder,p.pink,0,.64,-.2,.2,.12,.24);
 for(const x of [-.08,.08])for(const z of [-.1,-.27])mesh(udder,cylinder,p.pink,x,.48,z,.025,.08,.025);

 for(const x of [-.29,.29])for(const z of [-.38,.38]){
  const upper=new Group(),knee=new Group();upper.position.set(x,0,z);knee.position.y=-.28;upper.add(knee);root.add(upper);
  mesh(upper,cylinder,p.coat,0,-.14,0,.085,.28,.085);round(upper,p.coat,0,-.28,0,.078,.08,.08);
  mesh(knee,cylinder,p.coat,0,-.135,0,.06,.27,.06);round(knee,p.hoof,0,-.3,.025,.105,.07,.12);
  mesh(knee,cylinder,p.hoof,0,-.355,.025,.1,.03,.11);
  legs.push({upper,knee,x,z});
 }
 tail.position.set(0,1.14,-.7);
 const tailBone=mesh(tail,cylinder,p.cream,0,-.26,-.035,.026,.53,.026);tailBone.rotation.x=.12;
 round(tail,p.patch,0,-.57,-.07,.065,.095,.055);

 let disposed=false;
 function pose(action,frame){
  if(disposed)throw Error('Disposed cow rig');
  if(!['idle','walk','feed','drink','rest','milk'].includes(action)||!Number.isInteger(frame)||frame<0||frame>3)throw RangeError('Known action and four-frame index required');
  const phase=frame/4*Math.PI*2,rest=action==='rest',walk=action==='walk',feed=action==='feed',drink=action==='drink';
  body.position.y=rest?-.56:walk?.01*(1-Math.cos(phase*2)):Math.sin(phase)*.006;
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
 return {root,pose,dispose(){if(disposed)return;disposed=true;for(const g of geometries)g.dispose();for(const m of materials.values())m.dispose();root.clear();}};
}
