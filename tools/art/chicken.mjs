import {Group,Mesh,SphereGeometry,ConeGeometry,BoxGeometry,MeshLambertMaterial} from './vendor/three.module.js';
/** Original low-poly authoring rig. Offline only: no game state/clock/RNG. */
export function createModel(art){
 const root=new Group(),body=new Group(),neck=new Group(),legs=[],wings=[],materials=new Map(),geometries=[];root.add(body);body.add(neck);neck.position.set(0,.43,.1);
 const material=color=>{if(!materials.has(color))materials.set(color,new MeshLambertMaterial({color,flatShading:true}));return materials.get(color);};
 const add=(parent,geometry,color,x,y,z,sx=1,sy=1,sz=1)=>{geometries.push(geometry);const mesh=new Mesh(geometry,material(color));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);parent.add(mesh);return mesh;};
 const sphere=(parent,color,x,y,z,sx,sy,sz)=>add(parent,new SphereGeometry(1,12,8),color,x,y,z,sx,sy,sz),p=art.palette;
 sphere(body,p.warmWhite,0,.31,0,.17,.2,.23);sphere(neck,p.warmWhite,0,.11,.06,.11,.13,.11);sphere(neck,p.comb,0,.26,.04,.035,.03,.075);
 const beak=add(neck,new ConeGeometry(.045,.11,4),p.beak,0,.09,.205);beak.rotation.x=Math.PI/2;
 for(const x of [-1,1]){sphere(neck,p.charcoal,x*.101,.13,.09,.014,.019,.018);sphere(neck,p.warmWhite,x*.11,.136,.099,.005,.006,.007);wings.push(sphere(body,p.cream,x*.16,.31,-.01,.045,.12,.16));const leg=new Group();leg.position.set(x*.065,.16,0);root.add(leg);add(leg,new BoxGeometry(.026,.15,.025),p.beak,0,-.065,0);add(leg,new BoxGeometry(.085,.025,.1),p.beak,0,-.14,.025);legs.push(leg);}
 const tail=sphere(body,p.cream,0,.41,-.23,.09,.14,.07);tail.rotation.x=-.5;
 return{root,pose(action,frame){const phase=frame/4*Math.PI*2,walk=action==='walk',eat=action==='eat'||action==='drink',rest=action==='rest'||action==='nest';body.position.y=rest?-.1:Math.sin(phase)*.008;body.rotation.x=0;neck.rotation.x=eat?.85+Math.sin(phase)*.18:Math.sin(phase)*.025;neck.position.z=.1+(eat?.04:0);neck.position.y=.43-(eat?.05:0);for(const[i,leg]of legs.entries()){leg.rotation.x=walk?Math.sin(phase+i*Math.PI)*.55:0;leg.visible=!rest;}for(const[i,wing]of wings.entries())wing.rotation.z=(i?1:-1)*(walk?.12+Math.abs(Math.sin(phase))*.12:.05);tail.rotation.x=-.5+(walk?Math.sin(phase)*.1:0);},dispose(){for(const geometry of geometries)geometry.dispose();for(const m of materials.values())m.dispose();root.clear();}};
}
