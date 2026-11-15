import {Group,Mesh,MeshStandardMaterial,BoxGeometry,SphereGeometry,CylinderGeometry,ConeGeometry,BufferGeometry,Float32BufferAttribute,Vector3,Quaternion,CatmullRomCurve3,TubeGeometry,LatheGeometry,Vector2,DoubleSide} from 'three';
import {png} from './glb-prototype-export.mjs';

// Original authoring source: metric Y-up models, authored independently from
// the old billboard rigs. Reproducible surfaces, anatomy, fixtures and textures.
const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const rgb=hex=>[hex>>16,(hex>>8)&255,hex&255];
const mix=(a,b,t)=>a.map((n,i)=>n+(b[i]-n)*t);
const smoothNoise=(x,y)=>{const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return (noise(ix,iy)*(1-sx)+noise(ix+1,iy)*sx)*(1-sy)+(noise(ix,iy+1)*(1-sx)+noise(ix+1,iy+1)*sx)*sy;};
// Local deterministic segment field produces individual scattered straw/grass
// fibers, instead of extending a periodic sinusoid across every surface.
function fibers(u,v,cells=17){let coverage=0;const x=u*cells,y=v*cells,ix=Math.floor(x),iy=Math.floor(y);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){const a=ix+dx,b=iy+dy,cx=a+noise(a+71,b),cy=b+noise(a,b+37),angle=noise(a+13,b+5)*Math.PI,cs=Math.cos(angle),sn=Math.sin(angle),px=x-cx,py=y-cy,along=px*cs+py*sn,across=-px*sn+py*cs,len=.35+noise(a+41,b)*.7,width=.022+noise(a,b+19)*.025;if(Math.abs(along)<len)coverage=Math.max(coverage,clamp(1-Math.abs(across)/width)*(.45+noise(a+7,b+29)*.55));}return coverage;}
const cream=0xf1e7cf,brown=0x342b25,wood=0x866344;
export const textures=[
 {name:'original-weathered-hardwood',bytes:png(512,256,(u,v,x,y)=>{const slow=smoothNoise(u*6,v*23),grain=smoothNoise(u*13,v*185),knots=Math.exp(-(((u-.37)/.12)**2+((v-.57)/.13)**2)),t=clamp(.48+(slow-.5)*.25+(grain-.5)*.17-knots*.12+(noise(x,y)-.5)*.045);return [...mix(rgb(0x4e3626),rgb(0xa48460),t),255];})},
 {name:'original-tropical-soil',bytes:png(256,256,(u,v,x,y)=>{const soil=smoothNoise(u*8,v*8),gravel=smoothNoise(u*58,v*58),t=clamp(.46+(soil-.5)*.3+(gravel-.5)*.22+(noise(x,y)-.5)*.2);return [...mix(rgb(0x533a2a),rgb(0xa27e59),t),255];})},
 {name:'original-tropical-grass',bytes:png(256,256,(u,v,x,y)=>{const patch=smoothNoise(u*7,v*7),tiny=smoothNoise(u*44,v*44),grass=fibers(u,v,29),t=clamp(.46+(patch-.5)*.4+(tiny-.5)*.15+grass*.14+(noise(x,y)-.5)*.07);return [...mix(rgb(0x596548),rgb(0x99a277),t),255];})},
 {name:'original-dairy-cow-coat',bytes:png(512,256,(u,v,x,y)=>{let dist=10;for(const [a,b,rx,ry]of [[.2,.22,.14,.16],[.25,.68,.2,.18],[.59,.3,.16,.22],[.82,.65,.15,.21],[.93,.2,.13,.2]]){const dx=(u-a)/rx,dy=(v-b)/ry;dist=Math.min(dist,dx*dx+dy*dy+Math.sin(u*43+v*31)*.13+Math.sin(u*81-v*19)*.06);}const t=clamp((dist-.96)/.09),hair=(noise(x,y)-.5)*7;return [...mix(rgb(brown),rgb(cream),t).map(c=>c+hair),255];})},
 {name:'original-zinc-roof',bytes:png(256,256,(u,v,x,y)=>{const n=noise(x,y),s=.45+.15*Math.sin(u*55)+.12*n;return [...mix(rgb(0x4d6262),rgb(0x94a5a0),s),255];})},
 {name:'original-straw',bytes:png(512,512,(u,v,x,y)=>{const layer=fibers(u,v,31),short=fibers(u+.017,v+.031,47),base=smoothNoise(u*18,v*18),t=clamp(.39+(base-.5)*.2+layer*.33+short*.18+(noise(x,y)-.5)*.07);return [...mix(rgb(0x7d6848),rgb(0xc4b18a),t),255];})}
];
const mat=(name,color,{roughness=.8,metalness=0,texture,double=false}={})=>{const m=new MeshStandardMaterial({name,color,roughness,metalness,side:double?DoubleSide:0});if(texture!==undefined)m.userData.baseTexture=texture;return m;};
export const materials={timber:mat('warm weathered hardwood',0xffffff,{texture:0}),soil:mat('moist tropical loam',0xffffff,{texture:1,roughness:.96}),grass:mat('tropical grass ground',0xffffff,{texture:2,roughness:1}),coat:mat('cream and charcoal dairy coat',0xffffff,{texture:3,roughness:.92}),cream:mat('warm ivory short coat',cream,{roughness:.92}),dark:mat('dark brown short coat',brown,{roughness:.94}),muzzle:mat('warm charcoal muzzle',0x4c443c,{roughness:.73}),pink:mat('soft warm inner skin',0xbc8a79,{roughness:.9}),hoof:mat('cloven horn',0x3a332b,{roughness:.7}),horn:mat('ivory horn',0xb4a487),eye:mat('dark brown wet eye',0x111510,{roughness:.13}),glint:mat('eye catchlight',0xf5f1d5,{roughness:.15}),zinc:mat('aged galvanized roof',0xffffff,{texture:4,roughness:.63,metalness:.45}),steel:mat('brushed galvanized steel',0x8d9993,{metalness:.72,roughness:.36}),water:mat('clean trough water',0x6f9b94,{roughness:.18,metalness:.12}),concrete:mat('warm lime concrete',0xa89f88,{roughness:.97}),brick:mat('local terracotta brick',0x976248,{roughness:.96}),straw:mat('dry rice straw bedding',0xffffff,{texture:5,roughness:1}),leaf:mat('tropical leaf upper',0x537242,{roughness:.86,double:true}),leafLight:mat('young tropical leaf',0x80934b,{roughness:.88,double:true}),stem:mat('green fibrous stem',0x6c8245,{roughness:.92}),red:mat('ripe tomato',0xc65c38,{roughness:.45}),green:mat('green tomato',0x8b9950,{roughness:.65}),yellow:mat('corn grain',0xd3ad52,{roughness:.8}),cloth:mat('woven feed sack',0xa79268,{roughness:1}),teal:mat('farm green enamel',0x466d65,{roughness:.5,metalness:.15})};
const sphere=new SphereGeometry(1,24,16),sphereMedium=new SphereGeometry(1,16,10),sphereSmall=new SphereGeometry(1,10,6),boxGeometry=new BoxGeometry(1,1,1);
function mesh(parent,name,geometry,material,x=0,y=0,z=0,sx=1,sy=1,sz=1){const o=new Mesh(geometry,material);o.name=name;o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
function box(parent,name,material,x,y,z,sx,sy,sz){return mesh(parent,name,boxGeometry,material,x,y,z,sx,sy,sz);}
function round(parent,name,material,x,y,z,sx,sy,sz){const maximum=Math.max(sx,sy,sz),minimum=Math.min(sx,sy,sz),geometry=maximum<.075?sphereSmall:maximum<.3||minimum/maximum<.12?sphereMedium:sphere;return mesh(parent,name,geometry,material,x,y,z,sx,sy,sz);}
function beam(parent,name,material,from,to,r=.05,sides=10){const a=new Vector3(...from),b=new Vector3(...to),d=b.clone().sub(a),m=mesh(parent,name,new CylinderGeometry(r,r,d.length(),sides),material);m.position.copy(a.add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new Vector3(0,1,0),d.normalize());return m;}
function tube(parent,name,material,points,r=.04,end=.01,sides=10){const path=new CatmullRomCurve3(points.map(p=>new Vector3(...p))),g=new TubeGeometry(path,Math.max(8,points.length*5),r,sides,false);const pos=g.getAttribute('position');for(let i=0;i<pos.count;i++){const t=Math.floor(i/(sides+1))/(g.parameters.tubularSegments),center=path.getPointAt(t),v=new Vector3(pos.getX(i),pos.getY(i),pos.getZ(i)).sub(center).multiplyScalar(1-t*(1-end/r)).add(center);pos.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();return mesh(parent,name,g,material);}
function leaf(parent,name,material,origin,tip,width=.12,curl=.06,segments=10){const a=new Vector3(...origin),b=new Vector3(...tip),axis=b.clone().sub(a),side=new Vector3(-axis.z,0,axis.x).normalize();if(side.lengthSq()<.1)side.set(1,0,0);const positions=[],uv=[],indices=[];for(let i=0;i<=segments;i++){const t=i/segments,center=a.clone().lerp(b,t);center.y+=Math.sin(t*Math.PI)*curl;const w=Math.sin(Math.PI*t)**.8*width;for(const s of [-1,0,1]){const v=center.clone().addScaledVector(side,s*w);v.y-=Math.abs(s)*w*.18;positions.push(v.x,v.y,v.z);uv.push((s+1)/2,t);}}for(let i=0;i<segments;i++)for(let j=0;j<2;j++){const k=i*3+j;indices.push(k,k+3,k+1,k+1,k+3,k+4);}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(parent,name,g,material);}
function loftX(parent,name,material,sections,radial=36,{anatomy=false}={}){const positions=[],uv=[],indices=[];for(let i=0;i<sections.length;i++){const [x,cy,ry,rz]=sections[i];for(let j=0;j<=radial;j++){const angle=j/radial*Math.PI*2,c=Math.cos(angle),s=Math.sin(angle),dorsal=anatomy?.026*Math.exp(-(((x-.62)/.17)**2))*Math.max(0,c)**6:0,side=anatomy?(1-.12*Math.max(0,c))*(1+.035*Math.sin(x*7)*Math.abs(s)):1;positions.push(x,cy+c*ry+dorsal,s*rz*side);uv.push(i/(sections.length-1),j/radial);}}for(let i=0;i<sections.length-1;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;indices.push(a,a+1,b,a+1,b+1,b);}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(parent,name,g,material);}
function loftY(parent,name,material,sections,radial=18){const positions=[],uv=[],indices=[];for(let i=0;i<sections.length;i++){const [y,cx,cz,rx,rz]=sections[i];for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2;positions.push(cx+Math.cos(a)*rx,y,cz+Math.sin(a)*rz);uv.push(j/radial,i/(sections.length-1));}}for(let i=0;i<sections.length-1;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;indices.push(a,b,a+1,a+1,b,b+1);}const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(parent,name,g,material);}
function hoofHalf(parent,name,side){
 const positions=[],uv=[],indices=[],radial=20,levels=[[-.83,.036,.103,.034],[-.818,.036,.108,.036],[-.756,.025,.09,.032],[-.728,.015,.065,.027]];
 for(let i=0;i<levels.length;i++){const [y,cx,rx,rz]=levels[i];for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2,c=Math.cos(a),s=Math.sin(a),x=cx+c*rx*(c<0?.78:1),z=side*.044+s*rz;positions.push(x,y,z);uv.push(j/radial,i/(levels.length-1));}}
 for(let i=0;i<levels.length-1;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;indices.push(a,b,a+1,a+1,b,b+1);}
 for(let j=1;j<radial-1;j++){indices.push(0,j+1,j);const top=(levels.length-1)*(radial+1);indices.push(top,top+j,top+j+1);}
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(parent,name,g,materials.hoof);
}

export function createCow(){
 const root=new Group();root.name='cow';root.userData={forward:'+X',floorPivot:true,authorship:'MyFarmTwin original authored dairy anatomy'};
 loftX(root,'organic_torso',materials.coat,[[-1.13,1.09,.02,.025],[-1.075,1.12,.25,.24],[-.96,1.12,.37,.32],[-.82,1.1,.43,.35],[-.65,1.06,.43,.37],[-.43,1.04,.43,.39],[-.18,1.04,.43,.4],[.06,1.06,.42,.38],[.28,1.09,.41,.34],[.46,1.12,.4,.29],[.62,1.16,.4,.27],[.76,1.14,.35,.245],[.88,1.13,.28,.19],[.96,1.16,.12,.12],[1.0,1.18,.02,.02]],48,{anatomy:true});
 loftX(root,'rising_neck',materials.coat,[[.52,1.12,.16,.18],[.66,1.16,.26,.22],[.8,1.23,.255,.205],[.94,1.34,.22,.18],[1.06,1.43,.17,.15],[1.13,1.46,.08,.08],[1.16,1.46,.02,.02]],40);
 // Thin dewlap follows the underside of the rising neck rather than a
 // separate shoulder ball. The withers/hip contours live in the torso mesh.
 loftX(root,'throat_dewlap',materials.cream,[[.54,.96,.015,.015],[.69,.98,.12,.12],[.87,1.08,.13,.10],[1.0,1.25,.1,.09],[1.1,1.34,.015,.015]],24);
 const head=new Group();head.name='head';head.position.set(1.03,1.47,0);root.add(head);
 loftX(head,'tapered_skull',materials.coat,[[-.13,.055,.025,.025],[-.055,.06,.18,.145],[.065,.04,.19,.14],[.18,-.025,.17,.12],[.29,-.11,.135,.102],[.39,-.185,.095,.10],[.44,-.215,.07,.095]],40);
 loftX(head,'sculpted_muzzle',materials.muzzle,[[.365,-.205,.05,.075],[.42,-.23,.085,.12],[.49,-.235,.086,.128],[.545,-.24,.072,.112],[.568,-.245,.045,.075],[.58,-.245,.006,.01]],32);
 tube(head,'lower_lip_crease',materials.dark,[[.47,-.298,-.099],[.55,-.302,-.06],[.568,-.301,0],[.55,-.302,.06],[.47,-.298,.099]],.006,.006,7);
 for(const side of [-1,1]){
  const nostril=round(head,'nostril_'+side,materials.dark,.546,-.226,side*.079,.021,.014,.021);nostril.rotation.y=-side*.4;
  const eye=round(head,'eye_'+side,materials.eye,.075,.052,side*.139,.032,.025,.015);eye.rotation.y=side*.16;
  tube(head,'upper_eyelid_'+side,materials.dark,[[.04,.063,side*.144],[.07,.078,side*.148],[.097,.067,side*.144]],.006,.004,6);
  round(head,'brow_'+side,materials.coat,.07,.089,side*.129,.051,.014,.022);
  round(head,'eye_glint_'+side,materials.glint,.086,.06,side*.154,.004,.005,.003);
  const ear=new Group();ear.name=side<0?'ear_left':'ear_right';ear.position.set(-.035,.14,side*.135);ear.rotation.x=side*.15;head.add(ear);
  leaf(ear,'ear_shell',materials.cream,[0,0,0],[-.075,.01,side*.265],.09,.035,14);
  leaf(ear,'ear_inner',materials.pink,[.005,.006,side*.02],[-.065,.017,side*.225],.057,.029,14);
  tube(head,'short_horn_bud_'+side,materials.horn,[[-.055,.18,side*.09],[-.08,.22,side*.11],[-.095,.235,side*.125]],.027,.003,12);
 }
 // Four articulated anatomical limbs: upper muscle, narrow cannon bone,
 // palpable knee/hock and two distinct hoof toes with a visible cloven seam.
 for(const [x,z,label]of [[.62,-.25,'front_left'],[.62,.25,'front_right'],[-.79,-.28,'rear_left'],[-.79,.28,'rear_right']]){
  const rear=x<0,leg=new Group();leg.name='leg_'+label;leg.position.set(x,.83,z);root.add(leg);
  const sections=rear?[[-.728,.018,0,.05,.053],[-.65,-.014,0,.039,.045],[-.51,-.065,0,.035,.039],[-.37,-.112,0,.048,.052],[-.29,-.12,0,.06,.061],[-.18,-.055,0,.062,.075],[-.045,.06,0,.095,.11],[.13,.035,0,.14,.15],[.32,-.03,0,.16,.16],[.43,-.045,0,.13,.145]]:[[-.728,.022,0,.05,.053],[-.65,.012,0,.04,.044],[-.53,-.01,0,.035,.041],[-.4,-.02,0,.038,.043],[-.29,0,0,.062,.057],[-.2,.008,0,.055,.062],[-.05,-.02,0,.085,.085],[.13,-.04,0,.11,.12],[.34,-.1,0,.14,.145]];
  loftY(leg,'sculpted_limb_'+label,materials.cream,sections,28);
  for(const s of [-1,1])hoofHalf(leg,'cloven_hoof_'+label+'_'+s,s);
  for(const s of [-1,1])round(leg,'dewclaw_'+label+'_'+s,materials.hoof,-.055,-.635,s*.034,.019,.026,.014);
 }
 round(root,'udder',materials.pink,-.62,.66,0,.24,.145,.2);
 for(const x of [-.72,-.48])for(const z of [-.105,.105]){const teat=mesh(root,'teat',new CylinderGeometry(.019,.014,.083,10),materials.pink,x,.527,z);teat.rotation.z=x<-.6?.1:-.1;}
 const tail=new Group();tail.name='tail';tail.position.set(-1.045,1.32,0);root.add(tail);
 tube(tail,'tail_curve',materials.cream,[[0,0,0],[-.1,-.15,.01],[-.15,-.4,.035],[-.2,-.66,.06],[-.15,-.88,.09]],.032,.012,12);
 for(let i=0;i<16;i++){const a=i*2.39996,r=.012+(i%4)*.006;tube(tail,'tail_hair_'+i,materials.dark,[[-.15+Math.cos(a)*r,-.78,.09+Math.sin(a)*r],[-.15+Math.cos(a)*r*1.8,-.9,.09+Math.sin(a)*r*1.8],[-.18+Math.cos(a)*r,-1.035+(i%3)*.015,.105+Math.sin(a)*r]],.006,.001,5);}
 // Collar, buckle and tag are actual geometry, small enough to preserve anatomy.
 const collar=mesh(root,'woven_collar',new CylinderGeometry(.187,.198,.032,36,1,true),materials.teal,.94,1.35,0);collar.rotation.z=Math.PI/2;
 box(root,'collar_buckle',materials.steel,.965,1.25,.19,.037,.05,.009);
 box(root,'ear_tag',materials.yellow,.955,1.54,.34,.044,.066,.006);
 const rotation=(node,axis,angles,times)=>({node,path:'rotation',times,values:angles.flatMap(a=>new Quaternion().setFromAxisAngle(new Vector3(...axis),a).toArray())});
 const animations=[{name:'idle',tracks:[rotation('head',[0,0,1],[0,.018,-.01,0],[0,1.5,3,5]),rotation('tail',[1,0,0],[0,.16,-.12,0],[0,1.8,3.5,5]),rotation('ear_left',[1,0,0],[-.15,-.3,-.15],[0,2,5])]},
 {name:'walk',tracks:['front_left','front_right','rear_left','rear_right'].map((name,i)=>rotation('leg_'+name,[0,0,1],[i===0||i===3?-.25:.25,i===0||i===3?.25:-.25,i===0||i===3?-.25:.25],[0,.6,1.2]))},
 {name:'eat',tracks:[rotation('head',[0,0,1],[0,-.38,-.42,-.38,0],[0,1,2,3,4]),rotation('tail',[1,0,0],[0,.1,0],[0,2,4])]}];
 return{root,animations};
}

function trough(parent,name,x=0,z=0,water=false){const g=new Group();g.name=name;g.position.set(x,0,z);parent.add(g);box(g,'trough_base',materials.concrete,0,.17,0,2.1,.23,.7);for(const s of [-1,1]){box(g,'trough_side',materials.concrete,0,.38,s*.34,2.2,.27,.09);box(g,'trough_end',materials.concrete,s*1.055,.38,0,.09,.27,.7);}box(g,water?'water_surface':'feed_surface',water?materials.water:materials.straw,0,.32,0,2,.025,.6);return g;}
function pail(parent,name,x=0,z=0){const g=new Group();g.name=name;g.position.set(x,0,z);parent.add(g);const points=[new Vector2(.19,0),new Vector2(.22,.02),new Vector2(.25,.46),new Vector2(.245,.49),new Vector2(.23,.49),new Vector2(.205,.04),new Vector2(.19,.04)];mesh(g,'milk_bucket_shell',new LatheGeometry(points,32),materials.steel);tube(g,'bucket_handle',materials.steel,[[-.23,.38,0],[-.24,.67,0],[0,.77,0],[.24,.67,0],[.23,.38,0]],.012,.012,8);return g;}

export function createBarn(){
 const root=new Group();root.name='barn';root.userData={footprint:[10,8],front:'+Z',interiorTarget:[0,1.3,0]};
 const floor=new Group();floor.name='floor';root.add(floor);box(floor,'foundation_slab',materials.concrete,0,-.09,0,10.5,.18,8.5);
 for(const x of [-3.1,3.1])box(floor,'bedding_mat',materials.straw,x,.018,-.7,3.1,.035,5.4);
 // Center gutter gives an actual readable aisle and material hierarchy.
 for(const s of [-1,1])box(floor,'drain_channel',materials.dark,s*1.08,.002,0,.09,.012,7.8);
 const frame=new Group();frame.name='frame';root.add(frame);
 for(const x of [-4.8,0,4.8])for(const z of [-3.8,0,3.8]){
  box(frame,'stone_post_shoe',materials.concrete,x,.12,z,.36,.24,.36);box(frame,'hardwood_post',materials.timber,x,1.57,z,.19,3.05,.19);
  if(x!==0)beam(frame,'corner_brace',materials.timber,[x,2.1,z],[x-Math.sign(x)*.85,3,z],.065,8);
 }
 for(const z of [-3.8,0,3.8]){
  box(frame,'tie_beam',materials.timber,0,3.04,z,10,.18,.18);
  beam(frame,'rafter_left',materials.timber,[-5.05,3.05,z],[0,4.6,z],.095,8);
  beam(frame,'rafter_right',materials.timber,[0,4.6,z],[5.05,3.05,z],.095,8);
  beam(frame,'king_post',materials.timber,[0,3.05,z],[0,4.55,z],.065,8);
  for(const side of [-1,1])beam(frame,'roof_web',materials.timber,[side*3.3,3.05,z],[0,4.55,z],.055,8);
 }
 for(const x of [-4.9,-3,-1.5,0,1.5,3,4.9]){const y=4.6-Math.abs(x)*.31;box(frame,'roof_purlin',materials.timber,x,y-.05,0,.12,.12,8.7);}
 const walls=new Group();walls.name='walls';root.add(walls);
 for(const side of [-1,1]){
  box(walls,'low_masonry_side',materials.brick,side*4.92,.38,0,.16,.76,8);
  for(let z=-3.6;z<=3.61;z+=.3)box(walls,'ventilated_wall_slat',materials.timber,side*4.92,1.36,z,.09,.9,.14);
  box(walls,'side_rail',materials.timber,side*4.9,1.9,0,.1,.12,8);
 }
 box(walls,'low_masonry_back',materials.brick,0,.38,-3.95,10,.76,.16);
 for(let x=-4.6;x<=4.61;x+=.3)box(walls,'back_wall_slat',materials.timber,x,1.36,-3.94,.14,.9,.09);
 box(walls,'back_top_rail',materials.timber,0,1.9,-3.92,10,.12,.1);
 const stalls=new Group();stalls.name='stalls';root.add(stalls);
 for(const x of [-4.1,-2.3,2.3,4.1])for(const z of [-2.65,.3]){
  beam(stalls,'stall_upright',materials.steel,[x,.07,z],[x,1.15,z],.037,10);
  beam(stalls,'stall_divider',materials.steel,[x,1.1,z],[x,1.1,z+1.7],.033,10);
 }
 for(const side of [-1,1]){beam(stalls,'stall_neck_rail',materials.steel,[side*1.55,.95,-3.3],[side*1.55,.95,2.4],.036,10);}
 const equipment=new Group();equipment.name='equipment';root.add(equipment);trough(equipment,'feed_trough',-3,2.8,false);trough(equipment,'water_trough',3,2.8,true);pail(equipment,'milk_pail',-.4,2.6);
 for(const x of [-.45,.45])box(equipment,'wash_station_leg',materials.timber,x,.45,-3.05,.08,.9,.08);box(equipment,'wash_station_top',materials.timber,0,.92,-3.05,1.25,.1,.65);
 mesh(equipment,'milking_can',new CylinderGeometry(.24,.28,.7,24),materials.steel,.1,.35,-3.05);mesh(equipment,'can_lid',new CylinderGeometry(.2,.25,.06,24),materials.steel,.1,.73,-3.05);
 const roof=new Group();roof.name='roof';roof.userData={cameraCutaway:true};root.add(roof);
 for(const side of [-1,1]){
  const pos=[],uv=[],idx=[],nx=92,nz=8;
  for(let i=0;i<=nx;i++)for(let j=0;j<=nz;j++){const x=i/nx*5.4,z=(j/nz-.5)*9.1,y=4.67-x*.31+Math.sin(i/nx*Math.PI*48)*.025;pos.push(x*side,y,z);uv.push(i/nx*3,j/nz*3);}
  for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const a=i*(nz+1)+j,b=a+nz+1;if(side>0)idx.push(a,a+1,b,b,a+1,b+1);else idx.push(a,b,a+1,b,b+1,a+1);}
  const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();mesh(roof,'corrugated_roof_'+side,g,materials.zinc);
  for(const z of [-4.4,-.02,4.4])for(let x=.35;x<5.3;x+=.65){round(roof,'roof_fastener',materials.steel,x*side,4.71-x*.31,z,.019,.012,.019);}
 }
 box(roof,'roof_ridge_cap',materials.zinc,0,4.72,0,.24,.07,9.2);
 for(const z of [-4.5,4.5]){beam(roof,'roof_fascia_left',materials.timber,[-5.45,2.99,z],[0,4.7,z],.065,8);beam(roof,'roof_fascia_right',materials.timber,[0,4.7,z],[5.45,2.99,z],.065,8);}
 return root;
}

export function createTerrain(){
 const root=new Group();root.name='terrain';const w=48,d=40,nx=48,nz=40,pos=[],uv=[],idx=[];
 for(let i=0;i<=nx;i++)for(let j=0;j<=nz;j++){const x=(i/nx-.5)*w,z=(j/nz-.5)*d,edge=Math.max(Math.abs(x)/24,Math.abs(z)/20),y=edge<.8?0:Math.sin(x*.8)*Math.cos(z*.6)*.045*(edge-.8)*5;pos.push(x,y,z);uv.push(i/nx*24,j/nz*20);}
 for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const a=i*(nz+1)+j,b=a+nz+1;idx.push(a,a+1,b,b,a+1,b+1);}
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(pos,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();mesh(root,'continuous_grass_ground',g,materials.grass);
 box(root,'earth_cross_section',materials.soil,0,-.5,0,48,.99,40);return root;
}
export function createBed(){const root=new Group();root.name='bed';root.userData={footprint:[1.5,1.8]};box(root,'cultivated_soil',materials.soil,0,.035,0,1.5,.07,1.8);for(const s of [-1,1]){box(root,'bed_long_timber',materials.timber,s*.77,.065,0,.07,.13,1.95);box(root,'bed_short_timber',materials.timber,0,.065,s*.94,1.6,.13,.07);}for(let z=-.65;z<=.65;z+=.26){const ridge=round(root,'soil_furrow',materials.soil,0,.068,z,.67,.035,.06);ridge.userData.decorative=true;}return root;}

function plant(kind,stage){
 const root=new Group();root.name=kind+'_'+stage;const t=kind==='corn'?stage/4:stage/3;
 if(kind==='lettuce'){
  const count=5+stage*4,r=.055+t*.24;
  for(let i=0;i<count;i++){const a=i*2.39996,w=.035+t*.065,reach=r*(.4+(i%4)/5),h=.045+t*.16;leaf(root,'cupped_lettuce_leaf',i%3?materials.leafLight:materials.leaf,[0,.02,0],[Math.cos(a)*reach,h*(1-(i/count)*.7),Math.sin(a)*reach],w,.03+t*.08,10);}
 }else if(kind==='tomato'){
  const h=.09+t*1.35;beam(root,'tomato_main_stem',materials.stem,[0,0,0],[.02,h,0],.011+t*.009,10);
  for(let i=0;i<3+stage*3;i++){const a=i*2.4,y=.06+(i/(3+stage*3))*h*.85,reach=.06+t*.29,end=[Math.cos(a)*reach,y+.04,Math.sin(a)*reach];beam(root,'tomato_branch',materials.stem,[0,y,0],end,.006,6);for(const side of [-1,1])leaf(root,'serrated_tomato_foliage',materials.leaf,end,[end[0]+Math.cos(a+side*.8)*(.09+t*.09),end[1]+.025,end[2]+Math.sin(a+side*.8)*(.09+t*.09)],.025+t*.04,.015,8);}
  if(stage>=2)for(let i=0;i<3+stage;i++){const a=i*2.2,y=.3+(i%3)*.23;round(root,'tomato_fruit',stage===3?materials.red:materials.green,Math.cos(a)*.17,y,Math.sin(a)*.17,.065,.059,.065);for(let k=0;k<5;k++)leaf(root,'tomato_calyx',materials.stem,[Math.cos(a)*.17,y+.06,Math.sin(a)*.17],[Math.cos(a)*.17+Math.cos(k*1.257)*.035,y+.055,Math.sin(a)*.17+Math.sin(k*1.257)*.035],.008,.005,3);}
 }else{
  const h=[.04,.19,.8,1.65,2.05][stage];beam(root,'corn_stalk',materials.stem,[0,0,0],[0,h,0],.009+t*.018,10);
  for(let i=0;i<2+stage*2;i++){const a=i*2.72,y=h*(.13+i/(3+stage*2)*.7),reach=.04+t*.48;leaf(root,'arching_corn_leaf',materials.leafLight,[0,y,0],[Math.cos(a)*reach,y+.03+t*.11,Math.sin(a)*reach],.012+t*.06,.015+t*.13,12);}
  if(stage>=3){for(const side of [-1,1]){const ear=round(root,'corn_ear_husk',materials.leafLight,side*.085,h*.55,0,.065,.21,.065);ear.rotation.z=-side*.3;if(stage===4){const grain=round(root,'visible_golden_corn',materials.yellow,side*.103,h*.58,.038,.037,.14,.03);grain.rotation.z=-side*.3;}}for(const a of [0,1.4,2.8,4.2])tube(root,'corn_tassel',materials.yellow,[[0,h-.08,0],[Math.cos(a)*.09,h+.12,Math.sin(a)*.09],[Math.cos(a)*.16,h+.19,Math.sin(a)*.16]],.008,.003,5);}
 }
 return root;
}
export function createCrops(){const root=new Group();root.name='crop_templates';for(const kind of ['lettuce','tomato','corn'])for(let stage=0;stage<=(kind==='corn'?4:3);stage++)root.add(plant(kind,stage));return root;}

export function createVegetation(){
 const root=new Group();root.name='vegetation_templates';
 const banana=new Group();banana.name='banana';root.add(banana);loftY(banana,'banana_pseudostem',materials.stem,[[0,0,0,.19,.18],[.7,.015,0,.16,.15],[1.6,.04,0,.12,.12],[2.3,.08,0,.08,.08]],20);
 for(let i=0;i<10;i++){const a=i*2.4,len=1.6+(i%3)*.28,origin=[.08,2.15+(i%3)*.13,0],tip=[Math.cos(a)*len,2.05+(i%4)*.18,Math.sin(a)*len];leaf(banana,'broad_banana_blade',i%2?materials.leaf:materials.leafLight,origin,tip,.27,.5,20);tube(banana,'banana_midrib',materials.stem,[origin,[Math.cos(a)*len*.45,2.7,Math.sin(a)*len*.45],tip],.016,.005,6);}
 const palm=new Group();palm.name='palm';root.add(palm);loftY(palm,'curved_palm_trunk',materials.timber,[[0,0,0,.2,.2],[1,.06,.02,.18,.18],[2,.16,.03,.15,.15],[3,.28,.04,.12,.12],[4,.38,.03,.1,.1]],24);
 for(let y=.2;y<3.9;y+=.18){const ring=mesh(palm,'palm_trunk_ring',new CylinderGeometry(.16-y*.015,.17-y*.015,.025,20),materials.concrete,y*.095,y,0);ring.scale.z=.98;}
 for(let i=0;i<9;i++){const a=i*Math.PI*2/9;const start=[.38,4,.03],mid=[.38+Math.cos(a)*1,4.5,Math.sin(a)],end=[.38+Math.cos(a)*2.1,3.8,Math.sin(a)*2.1];tube(palm,'palm_frond_spine',materials.stem,[start,mid,end],.025,.005,7);for(let j=1;j<=9;j++){const t=j/10,cx=.38+Math.cos(a)*2.1*t,cz=Math.sin(a)*2.1*t,cy=4+Math.sin(t*Math.PI)*.5-.2*t;for(const s of [-1,1])leaf(palm,'palm_leaflet',materials.leaf,[cx,cy,cz],[cx+Math.cos(a+s*1.1)*.55*(1-t*.6),cy-.2,cz+Math.sin(a+s*1.1)*.55*(1-t*.6)],.035,.05,6);}}
 for(const a of [0,2,4])round(palm,'coconut',materials.timber,.38+Math.cos(a)*.18,3.88,Math.sin(a)*.18,.11,.14,.11);
 const grass=new Group();grass.name='grass';root.add(grass);for(let i=0;i<18;i++){const a=i*2.4,r=(i%5)*.02,h=.16+(i%4)*.06;leaf(grass,'grass_blade',i%3?materials.leaf:materials.leafLight,[Math.cos(a)*r,0,Math.sin(a)*r],[Math.cos(a)*(.13+r),h,Math.sin(a)*(.13+r)],.012,.035,5);}
 const shrub=new Group();shrub.name='shrub';root.add(shrub);for(let i=0;i<9;i++){const a=i*2.4;beam(shrub,'shrub_branch',materials.timber,[0,0,0],[Math.cos(a)*.35,.5+(i%3)*.13,Math.sin(a)*.35],.014,6);for(let j=0;j<4;j++)leaf(shrub,'shrub_leaf',materials.leaf,[Math.cos(a)*.2,.3+j*.1,Math.sin(a)*.2],[Math.cos(a+j)*.6,.4+j*.1,Math.sin(a+j)*.6],.085,.06,8);}
 return root;
}
export function createFence(){const root=new Group();root.name='fence';root.userData={length:2};for(const x of [-1,1]){box(root,'fence_post',materials.timber,x,.55,0,.12,1.1,.12);mesh(root,'post_cap',new ConeGeometry(.09,.09,4),materials.timber,x,1.145,0).rotation.y=Math.PI/4;}for(const y of [.42,.83])box(root,'fence_rail',materials.timber,0,y,0,2,.105,.06);return root;}
export function createPath(){const root=new Group();root.name='path';root.userData={footprint:[2,2]};box(root,'compacted_soil_path',materials.soil,0,.007,0,2,.014,2);for(let i=0;i<12;i++){const a=i*2.4,r=.25+(i%4)*.16;round(root,'small_path_stone',materials.concrete,Math.cos(a)*r,.019,Math.sin(a)*r,.035+(i%3)*.01,.018,.03);}return root;}
export function createProps(){
 const root=new Group();root.name='prop_templates';trough(root,'feed_trough');trough(root,'water_trough',0,0,true);pail(root,'milk_pail');
 const crate=new Group();crate.name='crate';root.add(crate);for(const side of [-1,1])for(let y=.08;y<.5;y+=.13){box(crate,'crate_side',materials.timber,side*.32,y,0,.045,.095,.8);box(crate,'crate_end',materials.timber,0,y,side*.38,.62,.095,.04);}for(let x=-.25;x<.3;x+=.12)box(crate,'crate_floor',materials.timber,x,.025,0,.095,.05,.76);
 const bag=new Group();bag.name='feed_bag';root.add(bag);loftY(bag,'woven_feed_sack',materials.cloth,[[0,0,0,.22,.16],[.05,0,0,.26,.19],[.35,0,0,.24,.18],[.6,0,0,.19,.13],[.67,0,0,.13,.08]],24);box(bag,'sack_green_label',materials.teal,0,.34,.18,.25,.2,.01);
 const pump=new Group();pump.name='pump';root.add(pump);box(pump,'pump_plinth',materials.concrete,0,.08,0,.8,.16,.65);round(pump,'pump_motor',materials.teal,-.1,.32,0,.28,.21,.22);mesh(pump,'pump_housing',new CylinderGeometry(.19,.19,.22,24),materials.steel,.2,.3,0).rotation.z=Math.PI/2;tube(pump,'pump_pipe',materials.steel,[[.3,.3,0],[.5,.3,0],[.5,.1,.3],[.5,.05,.6]],.045,.045,10);
 const stone=new Group();stone.name='rock';root.add(stone);const g=new SphereGeometry(1,12,8),pos=g.getAttribute('position');for(let i=0;i<pos.count;i++){const k=.85+noise(pos.getX(i)*4,pos.getZ(i)*7)*.25;pos.setXYZ(i,pos.getX(i)*k,pos.getY(i)*k,pos.getZ(i)*k);}g.computeVertexNormals();mesh(stone,'weathered_rock',g,materials.concrete,0,.2,0,.65,.4,.5);
 return root;
}

