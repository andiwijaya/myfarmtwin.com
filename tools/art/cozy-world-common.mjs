import {Group,Mesh,MeshStandardMaterial,BoxGeometry,SphereGeometry,CylinderGeometry,BufferGeometry,Float32BufferAttribute,Vector3,Quaternion,CatmullRomCurve3,TubeGeometry,LatheGeometry,Vector2,DoubleSide} from 'three';
import {png} from './glb-prototype-export.mjs';
import {textures as prototypeTextures,materials as prototypeMaterials} from './glb-prototype-models.mjs';

// Original metric authoring utilities. These primitives are baked offline into
// original GLBs; the deployed renderer does not synthesize visible geometry.
export const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
export const clamp=(n,a=0,b=1)=>Math.max(a,Math.min(b,n));
const rgb=hex=>[hex>>16,(hex>>8)&255,hex&255];
export const mix=(a,b,t)=>a.map((n,i)=>n+(b[i]-n)*t);
export function smoothNoise(x,y){const ix=Math.floor(x),iy=Math.floor(y),fx=x-ix,fy=y-iy,sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy);return(noise(ix,iy)*(1-sx)+noise(ix+1,iy)*sx)*(1-sy)+(noise(ix,iy+1)*(1-sx)+noise(ix+1,iy+1)*sx)*sy;}
const color=(a,b,t)=>[...mix(rgb(a),rgb(b),clamp(t)),255];
const featherSample=(u,v,x,y)=>{const row=Math.floor(v*21),xx=u*11+(row%2)*.5,cx=xx-Math.floor(xx)-.5,yy=v*21-row,arc=.32+Math.sqrt(Math.max(0,1-(cx/.53)**2))*.57,edge=Math.exp(-(((yy-arc)/.045)**2)),shaft=Math.exp(-cx*cx*2200)*(1-yy)*.065,barbs=Math.sin((yy+Math.abs(cx)*.9)*135)*.013;return color(0x49352a,0xa57947,.44+(noise(Math.floor(xx),row)-.5)*.075+(smoothNoise(u*9,v*9)-.5)*.12-edge*.07+shaft+barbs+(noise(x,y)-.5)*.045);};
const goatSample=(u,v,x,y)=>{const grain=smoothNoise(u*95,v*14),hair=smoothNoise(u*280+v*7,v*34),patch=smoothNoise(u*9,v*6);return color(0xbeb79d,0xf0e6ce,.6+(grain-.5)*.14+(hair-.5)*.15+(patch-.5)*.11+(noise(x,y)-.5)*.025);};
const fishSample=(u,v,x,y)=>{const row=Math.floor(v*16),cx=((u*28+(row%2)*.5)%1)-.5,cy=(v*16)%1,arc=Math.sqrt(cx*cx+(cy*.62)**2),seam=clamp((arc-.43)*13),luster=Math.exp(-((cx+.14)**2+(cy-.22)**2)*25),bands=.04*Math.cos(u*2*Math.PI*7);return color(0x526c58,0xbfc0a0,.47+smoothNoise(u*12,v*7)*.15-seam*.13+luster*.12+bands+(noise(x,y)-.5)*.035);};
const fieldSample=(u,v,x,y)=>{const large=smoothNoise(u*6,v*6),patch=smoothNoise(u*27,v*27),fine=smoothNoise(u*160,v*160),fiber=Math.sin((u*290+v*60)*Math.PI)*.5+.5;return color(0x4c6741,0x839354,.45+(large-.5)*.3+(patch-.5)*.22+(fine-.5)*.17+fiber*.035+(noise(x,y)-.5)*.05);};
const bambooSample=(u,v,x,y)=>{const grain=smoothNoise(u*41,v*8),joint=Math.exp(-(((v-.52)/.012)**2)),scratch=smoothNoise(u*150,v*7);return color(0x76613d,0xb29e68,.49+(grain-.5)*.27-joint*.2+(scratch-.5)*.13+(noise(x,y)-.5)*.04);};
const plasterSample=(u,v,x,y)=>color(0x999984,0xcec9af,.5+(smoothNoise(u*11,v*11)-.5)*.3+(smoothNoise(u*110,v*110)-.5)*.2+(noise(x,y)-.5)*.07);
const waterSample=(u,v,x,y)=>color(0x477771,0x749786,.45+(smoothNoise(u*15,v*12)-.5)*.14+(Math.sin(u*28+v*13)+Math.sin(u*17-v*32))*.013);
const normalSample=(height,strength=1)=>{const e=1/512;return(u,v)=>{const dx=(height(u+e,v)-height(u-e,v))*strength,dy=(height(u,v+e)-height(u,v-e))*strength,n=new Vector3(-dx,-dy,1).normalize();return[(n.x*.5+.5)*255,(n.y*.5+.5)*255,(n.z*.5+.5)*255,255];};};
export const textureSources=[
 {name:'original-kampung-hen-feathers',width:512,height:512,sample:featherSample},
 {name:'original-ettawa-cream-short-hair',width:512,height:512,sample:goatSample},
 {name:'original-tilapia-scale-overlap',width:512,height:256,sample:fishSample},
 {name:'original-indonesian-mixed-grass-field',width:512,height:512,sample:fieldSample},
 {name:'original-weathered-bamboo',width:512,height:256,sample:bambooSample},
 {name:'original-warm-lime-plaster',width:256,height:256,sample:plasterSample},
 {name:'original-green-pond-water',width:256,height:256,sample:waterSample},
 {name:'original-fine-hair-normal',width:256,height:256,sample:normalSample((u,v)=>smoothNoise(u*145,v*10)*.36+smoothNoise(u*45,v*5)*.15,2.8)},
 {name:'original-zinc-corrugation-normal',width:256,height:256,sample:normalSample((u,v)=>Math.sin(u*Math.PI*32)*.5+smoothNoise(u*65,v*65)*.03,1.2)},
 {name:'original-lime-grain-normal',width:256,height:256,sample:normalSample((u,v)=>smoothNoise(u*80,v*80)*.15,1.5)},
 {name:'original-pond-ripple-normal',width:256,height:256,sample:normalSample((u,v)=>Math.sin(u*35+v*12)*.32+Math.sin(u*14-v*29)*.24+smoothNoise(u*28,v*28)*.12,2.3)},
 {name:'original-feather-overlap-normal',width:256,height:256,sample:normalSample((u,v)=>{const row=Math.floor(v*17),x=((u*12+(row%2)*.5)%1)-.5,y=(v*17)%1;return Math.cos(x*Math.PI)*(.18+.22*y)+Math.sin((y+Math.abs(x)*.9)*115)*.014;},3.5)},
 {name:'original-fish-scales-normal',width:256,height:256,sample:normalSample((u,v)=>{const row=Math.floor(v*16),x=((u*28+(row%2)*.5)%1)-.5,y=(v*16)%1;return Math.max(0,.47-Math.sqrt(x*x+(y*.62)**2))*.5;},3.5)}
];
export const textures=[...prototypeTextures,...textureSources.map(t=>({name:t.name,bytes:png(t.width,t.height,t.sample)}))];
export const material=(name,color,{roughness=.85,metalness=0,texture,normal,normalScale=.4,double=false,opacity=1}={})=>{const m=new MeshStandardMaterial({name,color,roughness,metalness,side:double?DoubleSide:0,transparent:opacity<1,opacity});if(texture!==undefined)m.userData.baseTexture=texture;if(normal!==undefined){m.userData.normalTexture=normal;m.userData.normalScale=normalScale;}return m;};
export const M={...prototypeMaterials,
 feather:material('kampung hen warm brown layered feathers',0xffffff,{texture:6,normal:17,normalScale:.35}),
 hackle:material('golden brown fine neck feathers',0xceb481,{texture:6,normal:17,normalScale:.25}),
 tailFeather:material('charcoal brown satin flight feathers',0x423c30,{texture:6,normal:17,normalScale:.32,roughness:.72}),
 comb:material('natural muted red comb and wattles',0x9d4836,{roughness:.83}),
 beak:material('warm horn beak and claws',0xbda470,{roughness:.7}),
 shank:material('buff yellow scaly poultry legs',0x9e8653,{roughness:.9}),
 goatCoat:material('warm cream ettawa short hair',0xffffff,{texture:7,normal:13,normalScale:.25}),
 goatBrown:material('warm brown ettawa head coat',0x5c4431,{texture:7,normal:13,normalScale:.2}),
 goatMark:material('soft brown goat markings',0x8c7961,{texture:7,normal:13,normalScale:.2}),
 fish:material('olive silver tilapia scales',0xffffff,{texture:8,normal:18,normalScale:.48,roughness:.38,metalness:.1}),
 fishFin:material('fine translucent olive fins',0x667b65,{double:true,roughness:.55,opacity:.9}),
 field:material('Indonesian mixed pasture ground',0xffffff,{texture:9,normal:15,normalScale:.28,roughness:.98}),
 bamboo:material('warm weathered Indonesian bamboo',0xffffff,{texture:10,normal:13,normalScale:.18}),
 plaster:material('hand trowelled lime concrete',0xffffff,{texture:11,normal:15,normalScale:.5,roughness:.95}),
 pondWater:material('clear aerated tropical pond water',0xffffff,{texture:12,normal:16,normalScale:.32,roughness:.13,metalness:.05,opacity:.64,double:true}),
 liner:material('blue green aged pond lining',0x3e6560,{roughness:.87}),
 finRay:material('tilapia fine fin rays',0x81917b,{roughness:.6}),
 terracotta:material('warm fired clay roof tiles',0x996349,{roughness:.9,normal:15,normalScale:.25,double:true}),
 meshWire:material('fine galvanized enclosure wire',0x879084,{roughness:.68,metalness:.55}),
 redEnamel:material('weathered red poultry feeder enamel',0x8d4c37,{roughness:.6,metalness:.12}),
 bubble:material('aerator air bubbles',0xb5d4c4,{roughness:.1,opacity:.34}),
 zincDetailed:material('corrugated aged zinc roof',0xffffff,{texture:4,normal:14,normalScale:.65,roughness:.63,metalness:.45,double:true})
};
const unitBox=new BoxGeometry(1,1,1),spheres=new Map();
export function group(parent,name,position){const g=new Group();g.name=name;if(position)g.position.set(...position);parent?.add(g);return g;}
export function mesh(parent,name,geometry,mat,x=0,y=0,z=0,sx=1,sy=1,sz=1){const o=new Mesh(geometry,mat);o.name=name;o.position.set(x,y,z);o.scale.set(sx,sy,sz);parent.add(o);return o;}
export function box(parent,name,mat,x,y,z,sx,sy,sz){return mesh(parent,name,unitBox,mat,x,y,z,sx,sy,sz);}
export function round(parent,name,mat,x,y,z,sx,sy,sz,detail=20){if(!spheres.has(detail))spheres.set(detail,new SphereGeometry(1,detail,Math.max(6,Math.round(detail*.65))));return mesh(parent,name,spheres.get(detail),mat,x,y,z,sx,sy,sz);}
export function beam(parent,name,mat,from,to,r=.04,sides=10,rEnd=r){const a=new Vector3(...from),b=new Vector3(...to),d=b.clone().sub(a),m=mesh(parent,name,new CylinderGeometry(rEnd,r,d.length(),sides),mat);m.position.copy(a.add(b).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new Vector3(0,1,0),d.normalize());return m;}
export function tube(parent,name,mat,points,r=.02,end=.002,sides=10,segments=points.length*5){const path=new CatmullRomCurve3(points.map(p=>new Vector3(...p))),g=new TubeGeometry(path,Math.max(4,segments),r,sides,false),pos=g.getAttribute('position');for(let i=0;i<pos.count;i++){const t=Math.floor(i/(sides+1))/g.parameters.tubularSegments,c=path.getPointAt(t),v=new Vector3(pos.getX(i),pos.getY(i),pos.getZ(i)).sub(c).multiplyScalar(1-t*(1-end/r)).add(c);pos.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();return mesh(parent,name,g,mat);}
export function surface(parent,name,mat,positions,uv,indices){const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();return mesh(parent,name,g,mat);}
export function loftX(parent,name,mat,sections,radial=32){const p=[],uv=[],idx=[];for(let i=0;i<sections.length;i++){const[x,cy,ry,rz,cz=0]=sections[i];for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2;p.push(x,cy+Math.cos(a)*ry,cz+Math.sin(a)*rz);uv.push(i/(sections.length-1),j/radial);}}for(let i=0;i<sections.length-1;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;idx.push(a,a+1,b,a+1,b+1,b);}return surface(parent,name,mat,p,uv,idx);}
export function loftY(parent,name,mat,sections,radial=24){const p=[],uv=[],idx=[];for(let i=0;i<sections.length;i++){const[y,cx,cz,rx,rz]=sections[i];for(let j=0;j<=radial;j++){const a=j/radial*Math.PI*2;p.push(cx+Math.cos(a)*rx,y,cz+Math.sin(a)*rz);uv.push(j/radial,i/(sections.length-1));}}for(let i=0;i<sections.length-1;i++)for(let j=0;j<radial;j++){const a=i*(radial+1)+j,b=a+radial+1;idx.push(a,b,a+1,a+1,b,b+1);}return surface(parent,name,mat,p,uv,idx);}
// Curved tapered botanical/feather surface, center crease, two authored faces.
export function blade(parent,name,mat,origin,tip,width=.1,curl=.02,segments=10,{taper=.65,fold=.14}={}){const a=new Vector3(...origin),b=new Vector3(...tip),axis=b.clone().sub(a),side=new Vector3(-axis.z,0,axis.x).normalize();if(side.lengthSq()<.1)side.set(0,0,1);const p=[],uv=[],idx=[];for(let i=0;i<=segments;i++){const t=i/segments,c=a.clone().lerp(b,t);c.y+=Math.sin(t*Math.PI)*curl;const w=Math.sin(Math.PI*t)**taper*width;for(const s of [-1,0,1]){const v=c.clone().addScaledVector(side,s*w);v.y-=Math.abs(s)*w*fold;p.push(v.x,v.y,v.z);uv.push((s+1)/2,t);}}for(let i=0;i<segments;i++)for(let j=0;j<2;j++){const k=i*3+j;idx.push(k,k+3,k+1,k+1,k+3,k+4);}return surface(parent,name,mat,p,uv,idx);}
// A closed gently cambered feather with actual edge thickness avoids flat
// card silhouettes at interior camera distances.
export function feather(parent,name,mat,origin,tip,width=.03,segments=10){const a=new Vector3(...origin),b=new Vector3(...tip),axis=b.clone().sub(a),side=new Vector3(-axis.z,.15,axis.x).normalize(),normal=new Vector3().crossVectors(side,axis).normalize(),p=[],uv=[],idx=[];for(let f=0;f<2;f++)for(let i=0;i<=segments;i++){const t=i/segments,c=a.clone().lerp(b,t).addScaledVector(normal,Math.sin(Math.PI*t)*.008),w=Math.sin(Math.PI*t)**.55*width;for(const s of [-1,0,1]){const v=c.clone().addScaledVector(side,s*w).addScaledVector(normal,(f?-.001:.001)+Math.abs(s)*-.002);p.push(v.x,v.y,v.z);uv.push((s+1)/2,t);}}const stride=(segments+1)*3;for(let f=0;f<2;f++)for(let i=0;i<segments;i++)for(let j=0;j<2;j++){const k=f*stride+i*3+j;f?idx.push(k,k+1,k+3,k+1,k+4,k+3):idx.push(k,k+3,k+1,k+1,k+3,k+4);}for(let i=0;i<segments;i++){const a=i*3,b=a+3;idx.push(a,a+stride,b,b,a+stride,b+stride,a+2,b+2,a+stride+2,b+2,b+stride+2,a+stride+2);}return surface(parent,name,mat,p,uv,idx);}
export function lathe(parent,name,mat,points,segments=28){return mesh(parent,name,new LatheGeometry(points.map(p=>new Vector2(...p)),segments),mat);}
export const rotation=(node,axis,angles,times)=>({node,path:'rotation',times,values:angles.flatMap(a=>new Quaternion().setFromAxisAngle(new Vector3(...axis),a).toArray())});
export const translation=(node,positions,times)=>({node,path:'translation',times,values:positions.flat()});

export function crate(parent,name,x,y,z,w=.75,h=.52,d=.6){const g=group(parent,name,[x,y,z]);for(const side of [-1,1])for(let j=0;j<3;j++){const yy=.085+j*(h-.08)/3;box(g,'crate_long_slat',M.timber,0,yy,side*d/2,w,.1,.035);box(g,'crate_end_slat',M.timber,side*w/2,yy,0,.035,.1,d);}for(const xx of [-w/2,w/2])for(const zz of [-d/2,d/2])box(g,'crate_corner',M.timber,xx,h/2,zz,.045,h,.045);for(let xx=-w/2+.05;xx<w/2;xx+=.13)box(g,'crate_bottom',M.timber,xx,.02,0,.11,.04,d);return g;}
export function sack(parent,name,x,y,z,s=1){const g=group(parent,name,[x,y,z]);g.scale.setScalar(s);loftY(g,'woven_sack',M.cloth,[[0,0,0,.2,.15],[.05,0,0,.24,.18],[.32,.01,0,.23,.17],[.58,-.015,0,.18,.12],[.64,-.02,0,.1,.065],[.67,-.02,0,.08,.045]],24);box(g,'green_feed_label',M.teal,0,.32,.169,.23,.18,.012);tube(g,'sack_tie',M.timber,[[-.1,.64,-.01],[0,.65,.05],[.08,.64,0]],.012,.007,8);return g;}
export function trough(parent,name,x,y,z,{water=false,length=2}={}){const g=group(parent,name,[x,y,z]);box(g,'trough_floor',M.plaster,0,.12,0,length,.16,.55);for(const s of [-1,1]){box(g,'trough_side',M.plaster,0,.29,s*.29,length+.1,.28,.08);box(g,'trough_end',M.plaster,s*(length/2+.01),.29,0,.08,.28,.65);}const contents=group(g,water?'water_contents':'feed_contents');box(contents,'contents_surface',water?M.water:M.straw,0,.27,0,length-.1,.025,.47);if(!water)for(let i=0;i<18;i++)blade(contents,'cut_green_fodder',i%3?M.leaf:M.leafLight,[-length*.43+(i%9)*length*.105,.285,-.14+(i%3)*.13],[-length*.43+(i%9)*length*.105+.17,.33,.16-(i%3)*.13],.025,.025,5);return g;}
export function gableRoof(parent,name,width,depth,eaveY,rise,{clay=false}={}){const root=group(parent,name),half=width/2,rows=clay?Math.ceil(depth/.1):1,cols=Math.ceil(half/(clay?.06:.0325)),p=[],uv=[],idx=[];for(const side of [-1,1]){const offset=p.length/3;for(let i=0;i<=cols;i++)for(let j=0;j<=rows;j++){const t=i/cols,x=side*t*half,z=(j/rows-.5)*depth,base=eaveY+rise*(1-t),corrugation=clay?.026*Math.cos(t*half/.245*Math.PI*2)+.009*Math.sin(j/rows*depth/.3*Math.PI*2):.018*Math.cos(t*half*Math.PI/.065);p.push(x,base+corrugation,z);uv.push(t*half/2,j/rows*depth/2);}for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const a=offset+i*(rows+1)+j,b=a+rows+1;side>0?idx.push(a,a+1,b,a+1,b+1,b):idx.push(a,b,a+1,a+1,b,b+1);}}surface(root,'weathered_roof_panels',clay?M.terracotta:M.zincDetailed,p,uv,idx);box(root,'ridge_cap',clay?M.terracotta:M.zincDetailed,0,eaveY+rise+.04,0,.16,.075,depth+.1);for(const side of [-1,1]){box(root,'eave_fascia',M.timber,side*half,eaveY-.04,0,.11,.15,depth);beam(root,'front_bargeboard',M.timber,[0,eaveY+rise,depth/2],[side*half,eaveY,depth/2],.065,8);beam(root,'back_bargeboard',M.timber,[0,eaveY+rise,-depth/2],[side*half,eaveY,-depth/2],.065,8);}return root;}
export function timberFrame(parent,width,depth,{eave=2.55,rise=1.2,post=.16}={}){const g=group(parent,'frame');for(const x of [-width/2,0,width/2])for(const z of [-depth/2,depth/2]){box(g,'stone_post_shoe',M.plaster,x,.1,z,.28,.2,.28);box(g,'hardwood_column',M.timber,x,eave/2,z,post,eave,post);if(x)beam(g,'diagonal_knee_brace',M.timber,[x,eave-.65,z],[x-Math.sign(x)*.65,eave-.07,z],.045,8);}for(const z of [-depth/2,0,depth/2]){box(g,'roof_tie_beam',M.timber,0,eave-.06,z,width+.2,.14,.14);for(const s of [-1,1]){beam(g,'gable_rafter',M.timber,[0,eave+rise-.06,z],[s*width/2,eave-.06,z],.06,8);beam(g,'roof_diagonal_web',M.timber,[0,eave+rise-.1,z],[s*width*.33,eave-.06,z],.04,8);}}for(const s of [-1,1])box(g,'longitudinal_header',M.timber,s*width/2,eave-.05,0,.14,.14,depth);return g;}
