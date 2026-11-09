import {Group,Mesh,SphereGeometry,ConeGeometry,CylinderGeometry,MeshLambertMaterial,Box3} from './vendor/three.module.js';
/** Original rounded hen authoring rig. Offline only; the six actions/four
 * headings and ground pivot retain the existing runtime atlas contract. */
export function createModel(){
 const root=new Group(),body=new Group(),neck=new Group(),tail=new Group(),openEyes=new Group(),closedEyes=new Group(),legs=[],wings=[],materials=new Map(),geometries=new Set(),bounds=new Box3();root.add(body);body.add(neck,tail);neck.add(openEyes,closedEyes);
 const sphere=new SphereGeometry(1,16,10),cylinder=new CylinderGeometry(.5,.5,1,10),cone=new ConeGeometry(.5,1,8);for(const g of [sphere,cylinder,cone])geometries.add(g);
 const p={body:'#f5efe0',breast:'#fff0ce',wing:'#d9c59e',feather:'#e5d5b5',ink:'#29352f',comb:'#bd5946',combLight:'#d16d54',beak:'#d6a44b',leg:'#bb873c'};
 const material=color=>{if(!materials.has(color))materials.set(color,new MeshLambertMaterial({color}));return materials.get(color);};
 const add=(parent,geometry,color,x,y,z,sx,sy,sz)=>{const m=new Mesh(geometry,material(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
 const round=(parent,color,x,y,z,sx,sy,sz)=>add(parent,sphere,color,x,y,z,sx,sy,sz);
 round(body,p.body,0,.31,0,.205,.22,.255);round(body,p.breast,0,.36,.13,.17,.18,.16);
 round(neck,p.body,0,.1,.055,.125,.13,.13);
 for(const side of [-1,1]){
  round(neck,p.breast,side*.105,.085,.095,.035,.08,.08);
  round(openEyes,p.ink,side*.122,.137,.105,.018,.027,.027);round(openEyes,'#ffffff',side*.135,.146,.114,.005,.007,.007);
  round(closedEyes,p.ink,side*.124,.13,.11,.017,.006,.028);
  round(neck,p.comb,side*.02,.012,.155,.024,.045,.03);
  const wing=new Group();wing.position.set(side*.18,.31,-.025);body.add(wing);round(wing,p.wing,0,0,0,.052,.125,.17);
  for(let i=0;i<3;i++)round(wing,i%2?p.feather:p.breast,side*.018,-.035+i*.035,-.07+i*.065,.04,.07,.055);wings.push(wing);
  const leg=new Group();root.add(leg);add(leg,cylinder,p.leg,0,-.06,0,.025,.12,.025);round(leg,p.beak,0,-.137,.03,.034,.013,.045);
  for(const x of [-.022,0,.022]){const toe=add(leg,cylinder,p.beak,x,-.143,.07,.012,.075,.012);toe.rotation.x=Math.PI/2;}legs.push(leg);
 }
 for(const [z,y,color]of [[-.015,.239,p.comb],[.04,.255,p.combLight],[.095,.238,p.comb]])round(neck,color,0,y,z,.024,.038,.041);
 const beak=add(neck,cone,p.beak,0,.082,.21,.105,.14,.08);beak.rotation.x=Math.PI/2;
 round(neck,p.ink,0,.061,.214,.039,.007,.039);
 for(const side of [-1,0,1]){const feather=round(tail,side===0?p.breast:p.wing,side*.05,.04,-.055,.046,.145,.065);feather.rotation.z=-side*.3;}
 let disposed=false;
 function pose(action,frame){
  if(disposed)throw Error('Disposed hen rig');if(!['idle','walk','eat','drink','nest','rest'].includes(action)||!Number.isInteger(frame)||frame<0||frame>3)throw RangeError('Known action and four-frame index required');
  const phase=frame/4*Math.PI*2,walk=action==='walk',rest=action==='rest'||action==='nest',eat=action==='eat',drink=action==='drink';
  body.position.y=rest?-.09:walk?.008*(1-Math.cos(phase*2)):Math.sin(phase)*.004;body.rotation.set(0,0,0);
  neck.position.set(0,rest?.38:eat?.39:.43,eat||drink?.16:.12);neck.rotation.set(eat?.87+Math.sin(phase)*.06:drink?.66+Math.sin(phase)*.04:rest?-.09:Math.sin(phase)*.02,0,0);
  openEyes.visible=!rest;closedEyes.visible=rest;tail.position.set(0,.38,-.22);tail.rotation.set(-.45+(walk?Math.sin(phase)*.08:0),0,0);
  for(const[i,wing]of wings.entries())wing.rotation.set(0,0,(i?1:-1)*(walk?.06+Math.abs(Math.sin(phase))*.08:.025));
  for(const[i,leg]of legs.entries()){
   const wave=Math.sin(phase+i*Math.PI);leg.visible=!rest;leg.position.set(i===0?-.07:.07,0,0);leg.rotation.set(walk?wave*.38:0,0,0);root.updateMatrixWorld(true);bounds.setFromObject(leg);leg.position.y=-bounds.min.y+(walk?Math.max(0,wave)*.035:0);
  }
  root.updateMatrixWorld(true);
 }
 pose('idle',0);return{root,pose,dispose(){if(disposed)return;disposed=true;for(const g of geometries)g.dispose();for(const m of materials.values())m.dispose();root.clear();}};
}
