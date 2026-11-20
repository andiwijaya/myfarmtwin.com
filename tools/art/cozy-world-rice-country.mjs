import {Float32BufferAttribute,MathUtils} from 'three';
import {M,beam,clamp,group,material,mix,noise,round,smoothNoise,surface,textures} from './cozy-world-common.mjs';
import {png} from './glb-prototype-export.mjs';

export const COUNTRY_EDGE={x:55,z:44,y:-.38};

export function pastureTint(x,z){
 const t=Math.min(1,.94+(smoothNoise(x*.08+12,z*.08+8)-.5)*.13);
 return [t,t*.998,t*.975];
}

const xLines=[-258,-234,-211,-186,-164,-143,-120,-97,-77,-55,-38,-23,-10,0,11,24,39,55,76,96,120,144,166,188,210,234,258];
const zLines=[-258,-234,-211,-188,-163,-144,-122,-102,-82,-64,-44,-30,-16,0,16,31,44,65,83,103,123,144,164,187,211,234,258];
const centerFade=(x,z)=>MathUtils.smoothstep(Math.max(Math.abs(x)-COUNTRY_EDGE.x,Math.abs(z)-COUNTRY_EDGE.z),0,74);

function groundPoint(x,z){
 const fade=centerFade(x,z);
 const xo=x+fade*(6*Math.sin(z*.035+.2)+2*Math.sin((x+z)*.071));
 const zo=z+fade*(6*Math.sin(x*.031+1.5)+2*Math.sin((x-z)*.064));
 const roll=(smoothNoise(x*.014+7,z*.014-3)-.38)*6+Math.sin((x+z)*.037)*.75;
 return [xo,COUNTRY_EDGE.y+fade*roll,zo];
}

function grassTint(x,_y,z){
 const variation=smoothNoise(x*.018-7,z*.018+5);
 return mix(pastureTint(x,z),mix([.79,.88,.72],[.88,.96,.83],variation),centerFade(x,z));
}

function addRiceTexture(wet){
 const name=wet?'original-flooded-rice-seedling-rows':'original-green-rice-rows';
 const bytes=png(128,128,(u,v,x,y)=>{
  const row=Math.floor(v*8);
  const column=u*8+(row%2)*.5;
  const dx=column-Math.floor(column)-.5,dy=v*8-row-.5;
  const blade=Math.exp(-((dx+dy*.48)**2*105+(dy+.04)**2*18));
  const blade2=Math.exp(-((dx-dy*.65-.08)**2*120+(dy-.06)**2*24));
  const shadow=Math.exp(-((dx-.13)**2*23+(dy+.10)**2*15));
  const glint=Math.sin((v*10+u*2)*Math.PI*2)*.025;
  const grain=(noise(x+3,y+11)-.5)*.055;
  const base=wet?mix([103,137,126],[154,181,169],.47+glint*4):mix([89,112,44],[140,161,65],.38+glint);
  const leaf=wet?[66,108,56]:[78,116,48];
  const rgb=mix(base,leaf,clamp((wet?.8:.94)*Math.max(blade,blade2)+shadow*.17));
  return [...rgb.map(channel=>channel*(1+grain)),255];
 });
 return textures.push({name,bytes})-1;
}

const riceTextures={flooded:addRiceTexture(true),planted:addRiceTexture(false)};

class TerrainSurface{
 positions=[];
 uvs=[];
 colors=[];
 indices=[];

 vertex(point,color,uv){
  const index=this.positions.length/3;
  this.positions.push(...point);
  this.colors.push(...color);
  this.uvs.push(...uv);
  return index;
 }

 ring(points,tint,textureScale){
  return points.map(point=>this.vertex(point,tint(...point),[point[0]/textureScale,point[2]/textureScale]));
 }

 join(inner,outer){
  for(let i=0;i<inner.length;i++){
   const j=(i+1)%inner.length;
   this.indices.push(inner[i],inner[j],outer[i],inner[j],outer[j],outer[i]);
  }
 }

 fill([a,b,c,d]){
  this.indices.push(a,c,b,a,d,c);
 }

 bake(root,name,material){
  const mesh=surface(root,name,material,this.positions,this.uvs,this.indices);
  mesh.geometry.setAttribute('color',new Float32BufferAttribute(this.colors,3));
 }
}

function inset(points,center,amount,seed,level){
 return points.map(([x,y,z],i)=>{
  const t=amount+Math.sin(seed*6.28+i*1.7)*.028;
  return [MathUtils.lerp(x,center[0],t),level(y),MathUtils.lerp(z,center[2],t)];
 });
}

function scatterTrees(palms,woods,points,sample){
 // A barycentric sample keeps the roots on the unplanted cell's two triangles.
 for(let i=0;i<2;i++){
  const a=points[0],b=points[2],c=points[i===0?1:3];
  const u=.19+noise(sample*19,i)*.34,v=.15+noise(i,sample*23)*.28;
  const point=a.map((value,axis)=>value+(b[axis]-value)*u+(c[axis]-value)*v);
  if(sample>.91){
   const [x,y,z]=point,h=3.5+noise(x,z)*2.8;
   beam(woods,'broadleaf_trunk',M.timber,point,[x+.22,y+h*.77,z],h*.05,6);
   for(let j=0;j<4;j++){
    const angle=j*2.4+sample*8,size=(.31+noise(j,x)*.14)*h;
    const radius=j===0?0:size*.78;
    const canopy=round(woods,'broadleaf_canopy',j%3?M.leaf:M.leafLight,
     x+Math.cos(angle)*radius,y+h*(j===0?.86:.66),z+Math.sin(angle)*radius,
     size,size*(.56+noise(j,z)*.22),size*1.1,9);
    canopy.rotation.y=angle;
   }
  }else{
   palms.push([...point,sample*40+i*2.37,.94+noise(i,sample*5)*.65]);
  }
 }
}

function buildLowlands(root,grid){
 const ground=new TerrainSurface(),wet=new TerrainSurface(),planted=new TerrainSurface();
 const palms=[],woods=group(root,'wooded_verges');
 for(let i=0;i<xLines.length-1;i++)for(let j=0;j<zLines.length-1;j++){
  const inside=Math.abs((xLines[i]+xLines[i+1])/2)<COUNTRY_EDGE.x&&Math.abs((zLines[j]+zLines[j+1])/2)<COUNTRY_EDGE.z;
  if(inside)continue;

  const corners=[grid[i][j],grid[i+1][j],grid[i+1][j+1],grid[i][j+1]];
  const center=corners[0].map((_,axis)=>corners.reduce((sum,p)=>sum+p[axis],0)/4);
  const [x,y,z]=center;
  const crop=smoothNoise(i*.53+2.3,j*.55-8);
  const sample=noise(i+18,j-6);
  const verge=1-MathUtils.smoothstep(Math.max(Math.abs(x)/256,Math.abs(z)/256),.92,.995);
  const boundary=1-MathUtils.smoothstep(Math.max(Math.abs(x)-COUNTRY_EDGE.x,Math.abs(z)-COUNTRY_EDGE.z),4,50);
  const outer=ground.ring(corners,grassTint,7);
  if(crop*verge<.37+boundary*.10){
   ground.fill(outer);
   if(verge>.95&&sample>.78)scatterTrees(palms,woods,corners,sample);
   continue;
  }

  // Each plot has a grassy raised bank and a level field set into the slope.
  const bank=inset(corners,center,.09+sample*.075,sample,h=>h+.24);
  const rice=inset(corners,center,.20+sample*.07,sample,()=>y-.12);
  const crest=ground.ring(bank,(gx,gy,gz)=>grassTint(gx,gy,gz).map(c=>c*.9),7);
  const inner=ground.ring(rice,grassTint,7);
  ground.join(crest,outer);
  ground.join(inner,crest);
  const water=smoothNoise(i*.83-8,j*.72+9)<.48;
  const plotTint=mix(water?[.79,.83,.76]:[.73,.79,.58],[.97,.98,.88],sample);
  const plot=water?wet:planted;
  plot.fill(plot.ring(rice,()=>plotTint,water?4.4:5.1));
 }
 const lowlandGrass=M.field.clone();
 lowlandGrass.name='Pasture, grassy paddy banks and verges';
 ground.bake(root,'rice_country_ground',lowlandGrass);
 wet.bake(root,'flooded_rice_plots',material('Flooded rice seedlings',0xffffff,{texture:riceTextures.flooded,roughness:.24,metalness:.06}));
 planted.bake(root,'planted_rice_plots',material('Growing rice',0xffffff,{texture:riceTextures.planted,roughness:.92}));
 root.userData.countryPalms=palms;
}

function ridgeHeight(x,z,base){
 const r=Math.hypot(x,z),a=Math.atan2(z,x);
 const peak=(center,width)=>{
  const angle=Math.atan2(Math.sin(a-center),Math.cos(a-center));
  return Math.max(0,1-(angle/width)**2)**1.7;
 };
 const wave=(distance,width)=>Math.exp(-(((r-distance)/width)**2));
 const foothills=(7+9*Math.sin(a*4+.8)**2+13*peak(-2.68,.4)+7*peak(1.2,.7))*wave(442,104);
 const middle=26+12*Math.sin(a*3+2)**2+36*peak(-2.7,.66)+33*peak(.06,.55)+30*peak(2.46,.58);
 const mountains=middle*wave(664-50*Math.sin(a*3),126);
 const skyline=38+12*Math.sin(a*6-1)**2+78*peak(-2.0,.47)+47*peak(-2.95,.44)+57*peak(-.65,.51)+62*peak(1.89,.57);
 const highlands=skyline*wave(985+65*Math.cos(a*4),162);
 const relief=(smoothNoise(x*.026+16,z*.026-8)-.5)*5;
 const shoulder=MathUtils.smoothstep(r,275,420)*(1-MathUtils.smoothstep(r,1275,1590));
 return base*(1-MathUtils.smoothstep(r,340,455))+shoulder*(foothills+mountains+highlands+relief-1.4);
}

function buildMountains(root,grid){
 const last=grid.length-1,end=grid[0].length-1;
 const boundary=[
  ...grid.slice(0,-1).map(column=>column[0]),
  ...grid[last].slice(0,-1),
  ...grid.slice(1).reverse().map(column=>column[end]),
  ...grid[0].slice(1).reverse(),
 ];
 const land=new TerrainSurface();
 const plain=(x,y,z)=>grassTint(x,y,z).map((shade,i)=>shade*[.127,.183,.074][i]);
 let inner=land.ring(boundary,plain,7);
 // The boundary vertices are also the last vertices of the paddy grid.
 // Move outward along the same rays so every heading has continuous ground.
 for(const distance of [24,49,76,106,139,177,224,275,335,396,462,532,608,688,775,870,980,1120,1310,1550,1820]){
  const points=boundary.map(([x,y,z])=>{
   const scale=1+distance/Math.hypot(x,z);
   return [x*scale,ridgeHeight(x*scale,z*scale,y),z*scale];
  });
  const ring=land.ring(points,(x,_y,z)=>{
   const patch=smoothNoise(x*.012-7,z*.012-2);
   const tone=mix([.075,.139,.126],[.119,.169,.161],patch);
   return mix(plain(x,0,z),tone,MathUtils.smoothstep(distance,28,270));
  },7);
  land.join(inner,ring);
  inner=ring;
 }
 const mountains=material('Forested tropical ridges',0xffffff,{roughness:1});
 land.bake(root,'distant_mountains',mountains);
}

export function createRiceCountry(root){
 const grid=xLines.map(x=>zLines.map(z=>groundPoint(x,z)));
 buildLowlands(root,grid);
 buildMountains(root,grid);
}
