import {Group,Mesh,SphereGeometry,ConeGeometry,CylinderGeometry,BoxGeometry,MeshLambertMaterial,Box3} from './vendor/three.module.js';
/** Original rounded goat authoring rig. Stage scale stays in the existing
 * native adapter; this module imports no state, RNG, clock or commands. */
export function createModel(){
 const root=new Group(),body=new Group(),neck=new Group(),legs=[],materials=new Map(),bounds=new Box3();root.add(body);body.add(neck);
 const sphere=new SphereGeometry(1,16,10),cylinder=new CylinderGeometry(.5,.5,1,12),cone=new ConeGeometry(.5,1,10),box=new BoxGeometry(1,1,1),geometries=[sphere,cylinder,cone,box],p={body:'#b88c63',dark:'#99724f',cream:'#f0e2c5',ear:'#cda78d',hoof:'#4b4a3b',ink:'#29352f',horn:'#d8c8aa',hornBase:'#9a8265',iris:'#b2914e'};
 const material=color=>{if(!materials.has(color))materials.set(color,new MeshLambertMaterial({color}));return materials.get(color);};
 const add=(parent,g,color,x,y,z,sx,sy,sz)=>{const m=new Mesh(g,material(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;};
 const round=(parent,color,x,y,z,sx,sy,sz)=>add(parent,sphere,color,x,y,z,sx,sy,sz);
 round(body,p.body,0,.71,0,.28,.26,.43);round(body,p.cream,0,.57,.1,.23,.12,.29);round(body,p.dark,0,.89,-.08,.16,.09,.34);round(body,p.body,0,.79,.23,.19,.25,.2);
 round(neck,p.body,0,.18,.1,.165,.17,.19);round(neck,p.cream,0,.11,.28,.15,.1,.12);round(neck,p.ink,0,.13,.39,.083,.044,.033);const jaw=round(neck,p.cream,0,.03,.285,.11,.055,.1);
 round(neck,p.cream,0,.24,.258,.048,.09,.025);
 for(const side of [-1,1]){
  const ear=round(neck,p.body,side*.245,.245,.1,.13,.045,.075);ear.rotation.z=side*.16;const inner=round(neck,p.ear,side*.26,.264,.112,.09,.014,.05);inner.rotation.z=side*.16;
  round(neck,p.iris,side*.154,.245,.205,.024,.029,.032);add(neck,box,p.ink,side*.174,.245,.213,.008,.013,.033);round(neck,'#ffffff',side*.18,.255,.225,.004,.005,.005);
  const base=add(neck,cylinder,p.hornBase,side*.1,.342,.02,.045,.1,.045);base.rotation.x=-.18;
  const tip=add(neck,cone,p.horn,side*.112,.42,-.01,.05,.16,.05);tip.rotation.x=-.32;
  round(neck,p.ink,side*.044,.135,.419,.012,.008,.007);
 }
 const beard=add(neck,cone,p.dark,0,-.03,.27,.095,.17,.085);beard.rotation.z=Math.PI;
 for(const x of [-.18,.18])for(const z of [-.26,.26]){
  const upper=new Group(),knee=new Group();root.add(upper);upper.add(knee);knee.position.set(0,-.29,.005);add(upper,cylinder,p.body,0,-.14,0,.07,.3,.07);round(upper,p.cream,0,-.29,.005,.044,.047,.044);add(knee,cylinder,p.cream,0,-.125,0,.055,.25,.055);
  for(const dx of [-.024,.024])add(knee,box,p.hoof,dx,-.272,.018,.039,.074,.105);legs.push({upper,knee,x,z});
 }
 const tail=round(body,p.cream,0,.87,-.44,.055,.12,.045);
 let disposed=false;
 function pose(action,frame){
  if(disposed)throw Error('Disposed goat rig');if(!['idle','walk','browse','drink','rest','climb','chew'].includes(action)||!Number.isInteger(frame)||frame<0||frame>3)throw RangeError('Known action and four-frame index required');
  const phase=frame/4*Math.PI*2,walk=action==='walk',browse=action==='browse',drink=action==='drink',rest=action==='rest',climb=action==='climb';
  body.position.y=rest?-.45:climb?-.05:walk?.008*(1-Math.cos(phase*2)):Math.sin(phase)*.004;body.rotation.set(climb?-.18:0,0,0);
  neck.position.set(0,rest?.7:browse?.6:drink?.56:.79,.29);neck.rotation.set(browse?.95+Math.sin(phase)*.045:drink?1+Math.sin(phase)*.035:rest?-.06:0,0,0);jaw.position.y=.03+(action==='chew'?Math.sin(phase)*.009:0);tail.rotation.set(-.4+Math.sin(phase)*.06,0,0);
  for(const[i,leg]of legs.entries()){
   const wave=Math.sin(phase+(i===0||i===3?0:Math.PI)),front=leg.z>0;leg.upper.visible=!rest;leg.upper.position.set(leg.x,0,leg.z);leg.upper.rotation.set(climb&&front?-.5:walk?wave*.3:0,0,0);leg.knee.rotation.x=walk?Math.max(0,wave)*.18:climb&&front?.3:0;root.updateMatrixWorld(true);bounds.setFromObject(leg.upper);leg.upper.position.y=-bounds.min.y+(walk?Math.max(0,wave)*.05:climb&&front?.12:0);
  }
  root.updateMatrixWorld(true);
 }
 pose('idle',0);return{root,pose,dispose(){if(disposed)return;disposed=true;for(const g of geometries)g.dispose();for(const m of materials.values())m.dispose();root.clear();}};
}
