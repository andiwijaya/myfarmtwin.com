import {HOUSE_LEVELS} from '../../game/client/cozy-houses.js';
import {M,beam,blade,box,clamp,group,lathe,material,noise,surface,textures,tube} from './cozy-world-common.mjs';
import {png} from './glb-prototype-export.mjs';

const pantiles=textures.push({
 name:'original-indonesian-clay-pantiles',
 bytes:png(192,192,(u,v,x,y)=>{
  const course=v*8,row=Math.floor(course),joint=u*8+(row%2)*.5;
  const tileU=joint-Math.floor(joint),tileV=course-row;
  const lip=Math.exp(-((tileV/.09)**2));
  const groove=Math.exp(-((Math.min(tileU,1-tileU)/.12)**2));
  const round=.10*Math.sin(Math.PI*tileU);
  const weather=(noise(Math.floor(joint)%8,row)-.5)*.16+(noise(x,y)-.5)*.05;
  const value=255*clamp(.83+round-lip*.24-groove*.24+weather);
  return [value,value,value,255];
 }),
})-1;

const clay=(name,color)=>material(name,color,{texture:pantiles,roughness:.86,double:true});
const walls=(name,color)=>material(name,color,{texture:11,normal:15,normalScale:.24,roughness:.93});
const A={
 red:clay('Fired orange terracotta tiles',0xae694e),
 rust:clay('Weathered reddish clay tiles',0x99593f),
 dark:clay('Soot-brown Javanese clay tiles',0x806552),
 stone:clay('Charcoal gray glazed tiles',0x777d79),
 ivory:walls('Cream sand plaster',0xeee4ca),
 sage:walls('Faded green limewash',0xc0caab),
 linen:walls('Warm off-white stucco',0xe6d8b4),
 white:walls('Ivory exterior render',0xf1eee1),
 ochre:walls('Buff village masonry',0xd6b886),
 brick:walls('Reddish exposed masonry',0xaf6c52),
 slate:walls('Dark andesite base course',0x696b64),
 tiles:walls('Satin cement terrazzo paving',0xc4b9a1),
 boards:material('Oiled meranti wall boards',0xa9835c,{texture:10,roughness:.94}),
 teak:material('Warm teak joinery',0x69482f,{texture:10,roughness:.78}),
 paint:material('Dark green painted trim',0x445f52,{roughness:.84}),
 sash:material('Graphite window frames',0x4c4842,{roughness:.52}),
 glass:material('Blue gray window reflections',0x41565f,{roughness:.2,metalness:.04}),
 reveal:material('Shadow in joinery and vents',0x302b24,{roughness:1}),
 light:material('Milk glass porch lamp',0xe4cf9d,{roughness:.4}),
 dish:material('Ivory satellite reflector',0xdddccf,{roughness:.48,metalness:.24,double:true}),
 bracket:material('Galvanized satellite wall bracket',0x727b79,{roughness:.59,metalness:.43}),
};

// UV units follow the tile courses and the sloping distance across each roof face.
function roofPanel(parent,points,mat){
 const [a,b,c,d]=points,ac=Math.hypot(c[0]-b[0],c[1]-b[1],c[2]-b[2]);
 const span=Math.hypot(b[0]-a[0],b[2]-a[2]),rim=Math.hypot(c[0]-d[0],c[2]-d[2]);
 const inset=(span-rim)/2;
 surface(parent,'roof_tile_courses',mat,points.flat(),[0,0,span/2,0,(span-inset)/2,ac/2.35,inset/2,ac/2.35],[0,1,2,0,2,3]);
}

function mainRoof(parent,width,depth,eave,rise,{mat=A.red,hip=.42,upper=false}={}){
 const x=width/2,z=depth/2;
 const edges=[[-x,eave,z],[x,eave,z],[x,eave,-z],[-x,eave,-z]];
 if(upper){
  const shoulder=edges.map(([px,py,pz])=>[px*.59,py+rise*.38,pz*.44]);
  for(let i=0;i<4;i++)roofPanel(parent,[edges[i],edges[(i+1)%4],shoulder[(i+1)%4],shoulder[i]],mat);
  mainRoof(parent,width*.59,depth*.44,eave+rise*.38,rise*.62,{mat,hip});
 }else{
  const west=[-x*hip,eave+rise,0],east=[x*hip,eave+rise,0];
  roofPanel(parent,[edges[0],edges[1],east,west],mat);
  roofPanel(parent,[edges[2],edges[3],west,east],mat);
  if(hip<.99){
   surface(parent,'hip_tiles_east',mat,[...edges[1],...edges[2],...east],[0,0,depth/2,0,depth/4,rise], [0,1,2]);
   surface(parent,'hip_tiles_west',mat,[...edges[3],...edges[0],...west],[0,0,depth/2,0,depth/4,rise], [0,1,2]);
  }
  box(parent,'roof_ridge_cap',mat,0,eave+rise+.015,0,width*hip+.06,.085,.13);
 }
 for(let i=0;i<4;i++)beam(parent,'eave_fascia',A.teak,edges[i],edges[(i+1)%4],.043,5);
}

function glazing(parent,x,y,z,{width=1.05,height=1.04,angle=0,shutters=false,paneCount=2}={}){
 const frame=group(parent,'casement_window',[x,y,z]);
 frame.rotation.y=angle;
 const rail=.054;
 box(frame,'dark_window_reveal',A.reveal,0,0,.005,width+.13,height+.12,.027);
 box(frame,'opaque_glazing',A.glass,0,0,.029,width,height,.028);
 for(const side of [-1,1]){
  box(frame,'side_jamb',A.sash,side*width/2,0,.062,rail,height+rail,.058);
  box(frame,'window_rail',A.sash,0,side*height/2,.062,width,rail,.058);
  if(shutters){
   const leaf=box(frame,'teak_louver_shutter',A.teak,side*(width/2+.13),0,.053,.25,height,.056);
   leaf.rotation.y=side*.32;
   for(let step=-4;step<=4;step++)box(frame,'shutter_slats',A.boards,side*(width/2+.13),step*height/10,.084,.19,.029,.022);
  }
 }
 box(frame,'sill',A.slate,0,-height/2-.048,.071,width+.16,.065,.17);
 box(frame,'transom_rail',A.sash,0,height*.14,.064,width,rail,.05);
 for(let i=1;i<paneCount;i++)box(frame,'vertical_mullion',A.sash,width*(i/paneCount-.5),0,.061,rail,height,.055);
}

function vent(parent,x,y,z,width=.55){
 box(parent,'vent_recess',A.reveal,x,y,z,width,.148,.042);
 for(let i=0;i<5;i++){
  const slat=box(parent,'breeze_block_fin',A.teak,x+(i-2)*width*.18,y,z+.033,.039,.17,.035);
  slat.rotation.z=.28;
 }
}

function entry(parent,x,base,z,{double=false,wood=A.teak}={}){
 const width=double?1.62:.9,height=2.07;
 box(parent,'recessed_doorway',A.reveal,x,base+height/2,z-.132,width+.16,height+.07,.046);
 for(const side of [-1,1]){
  box(parent,'door_jamb',A.teak,x+side*(width/2+.04),base+height/2,z+.07,.084,height+.098,.11);
 }
 box(parent,'door_lintel',A.teak,x,base+height+.02,z+.073,width+.18,.085,.11);
 const doors=group(parent,base<1?'house_entry_doors':'house_upper_doors',[x,base,z+.029]);
 for(const side of double?[-1,1]:[-1]){
  const leafWidth=double?width/2:width,center=-side*leafWidth/2;
  const hinged=group(doors,'hinged_door_leaf',[side*width/2,0,0]);
  hinged.userData.openDirection=-side;
  box(hinged,'panelled_door',wood,center,height/2,0,leafWidth-.009,height,.056);
  box(hinged,'door_glazed_inset',A.glass,center,1.48,.037,.54,.69,.025);
  for(let j=0;j<3;j++)box(hinged,'door_lower_rail',A.boards,center,.45+j*.21,.043,.52,.05,.016);
  box(hinged,'handle',M.steel,center-side*.29,.97,.075,.058,.041,.061);
 }
 vent(parent,x,base+height+.15,z+.04,width*.7);
}

function stairs(parent,x,z,base,width){
 const count=Math.ceil(base/.18),tread=.235;
 for(let i=0;i<count;i++){
  const height=base*(count-i)/count;
  box(parent,'porch_step',A.tiles,x,height/2,z+(i+.5)*tread,width,height,tread+.003);
 }
}

function satelliteDish(room,x,y,z){
 const mount=group(room,'home_satellite_dish',[x,y,z]);
 mount.userData.homeSatellite=true;
 box(mount,'satellite_wall_plate',A.bracket,0,0,-.024,.16,.23,.056);
 for(const h of [-.072,.072])box(mount,'wall_anchor_bolt',M.steel,0,h,-.056,.041,.039,.022);
 tube(mount,'dish_bracket_arm',A.bracket,[[0,-.063,-.048],[0,-.077,-.132],[0,.021,-.193]],.028,.025,9,12);
 tube(mount,'dish_coaxial_cable',A.sash,[[.065,.02,-.034],[.111,-.14,-.053],[.11,-.27,-.028],[.106,-.58,-.022]],.009,.007,6,14);
 const reflector=group(mount,'satellite_reflector',[0,.021,-.189]);
 reflector.rotation.x=-Math.PI*.415;
 lathe(reflector,'curved_satellite_reflector',A.dish,[[0,0],[.1,.007],[.22,.032],[.34,.077],[.422,.118],[.43,.122],[.427,.108],[.34,.067],[.22,.022],[.10,-.003],[0,-.006]],36);
 beam(reflector,'feed_arm',A.bracket,[0,.114,.378],[0,.223,.014],.016,8);
 beam(reflector,'feed_receiver',A.bracket,[0,.193,.015],[0,.25,.015],.045,12);
}

function masonryBlock(parent,{width,depth,x=0,z=0,base=.28,height=2.53,wall=A.ivory,roof=A.red,rise=1.15,hip=.42,upper=false,shutters=false,frontDoor=0,doubleDoor=false,sideWindows=1,frontWindows,steps=true,satellite=false}){
 const room=group(parent,'habitable_volume',[x,0,z]);
 const eave=base+height;
 if(base<1)box(room,'stone_foundation',wall===A.boards?A.slate:A.brick,0,base/2,0,width+.12,base,depth+.12);
 const facade=.19;
 const opening=doubleDoor?1.70:.98;
 if(frontDoor===null)box(room,'weathered_exterior_walls',wall,0,base+height/2,0,width,height,depth);
 else{
  const left=frontDoor-opening/2,right=frontDoor+opening/2;
  box(room,'weathered_exterior_walls',wall,0,base+height/2,-facade/2,width,height,depth-facade);
  box(room,'left_door_wall',wall,(-width/2+left)/2,base+height/2,depth/2-facade/2,left+width/2,height,facade);
  box(room,'right_door_wall',wall,(right+width/2)/2,base+height/2,depth/2-facade/2,width/2-right,height,facade);
  box(room,'doorway_header',wall,frontDoor,base+2.10+(height-2.10)/2,depth/2-facade/2,opening,height-2.10,facade);
 }
 if(wall===A.boards){
  for(let y=base+.12;y<eave-.03;y+=.19){
   if(frontDoor!==null&&y<base+2.10){
    const left=frontDoor-opening/2,right=frontDoor+opening/2;
    box(room,'horizontal_board_lap',A.boards,(-width/2+left)/2,y,depth/2+.019,left+width/2,.032,.039);
    box(room,'horizontal_board_lap',A.boards,(right+width/2)/2,y,depth/2+.019,width/2-right,.032,.039);
   }else box(room,'horizontal_board_lap',A.boards,0,y,depth/2+.019,width+.08,.032,.039);
   box(room,'rear_board_lap',A.boards,0,y,-depth/2-.019,width+.08,.032,.039);
  }
 }
 if(roof){
  mainRoof(room,width+.78,depth+.78,eave,rise,{mat:roof,hip,upper});
  if(hip===1){
   for(const side of [-1,1]){
    const axis=side*(width/2-.018);
    surface(room,'gable_end_wall',wall,[axis,eave,-depth/2,axis,eave,depth/2,axis,eave+rise,0],[0,0,1,0,.5,1],side<0?[0,1,2]:[0,2,1]);
   }
  }
 }else box(room,'floor_slab_cap',A.tiles,0,eave,0,width+.16,.126,depth+.15);
 if(frontDoor!==null){
  entry(room,frontDoor,base,depth/2+.018,{double:doubleDoor});
  if(steps&&base<1)stairs(room,frontDoor,depth/2+.055,base,doubleDoor?1.9:1.18);
 }
 const frontPositions=frontWindows??(width<4.2?[-width*.29]:[-width*.29,width*.29]);
 for(const px of frontPositions)glazing(room,px,base+1.47,depth/2+.025,{width:width<5?.78:1.13,shutters});
 for(const side of [-1,1]){
  const angle=side*Math.PI/2;
  for(let i=0;i<sideWindows;i++)glazing(room,side*(width/2+.028),base+1.46,depth*((i+1)/(sideWindows+1)-.5),{angle,shutters});
 }
 for(const side of [-1,1])glazing(room,width*.26*side,base+1.47,-depth/2-.021,{angle:Math.PI,width:.91});
 if(satellite)satelliteDish(room,-width*.36,eave-.49,-depth/2);
 return room;
}

function post(parent,x,z,floor,top,{masonry=false}={}){
 const width=masonry?.22:.138;
 box(parent,'porch_column_plinth',A.slate,x,floor+.19,z,width+.14,.38,width+.14);
 box(parent,'porch_column',masonry?A.ivory:A.teak,x,(top+floor)/2,z,width,top-floor,width);
 box(parent,'porch_column_capital',masonry?A.linen:A.teak,x,top-.063,z,width+.09,.101,width+.09);
}

function rail(parent,left,right,y,z){
 box(parent,'teak_balustrade_rail',A.teak,(left+right)/2,y+.76,z,right-left,.075,.125);
 box(parent,'teak_balustrade_base',A.teak,(left+right)/2,y+.18,z,right-left,.064,.09);
 for(let x=left+.12;x<right-.065;x+=.19)box(parent,'baluster',A.teak,x,y+.46,z,.044,.55,.052);
}

function veranda(parent,{width,start,depth,x=0,base=.32,high=2.94,mat=A.rust,masonry=false,railing=false,steps=true}){
 const end=start+depth;
 box(parent,'veranda_terrace',A.tiles,x,base/2,(start+end)/2,width,base,depth);
 const top=high-.40,l=x-width/2,r=x+width/2;
 roofPanel(parent,[[l-.19,top,end+.19],[r+.19,top,end+.19],[r+.19,high,start-.14],[l-.19,high,start-.14]],mat);
 beam(parent,'veranda_fascia',A.teak,[l-.19,top,end+.19],[r+.19,top,end+.19],.048,6);
 for(const px of width>6?[l+.2,x-width*.23,x+width*.23,r-.2]:[l+.2,r-.2])post(parent,px,end-.16,base,top,{masonry});
 if(steps)stairs(parent,x,end,base,Math.min(2.7,width*.54));
 if(railing){
  rail(parent,l+.2,x-width*.25,base,end-.14);
  rail(parent,x+width*.25,r-.2,base,end-.14);
 }
}

function planter(parent,x,z,s=.75){
 const pot=group(parent,'terracotta_planter',[x,0,z]);
 pot.scale.setScalar(s);
 lathe(pot,'earthenware_pot',M.terracotta,[[.23,0],[.25,.052],[.33,.37],[.35,.4],[.35,.45],[.3,.46]],14);
 box(pot,'soil',M.soil,0,.397,0,.40,.024,.40);
 for(let i=0;i<7;i++){
  const angle=i*2.4;
  blade(pot,'garden_plant',i%2?M.leaf:M.leafLight,[0,.41,0],[Math.cos(angle)*.44,.67+(i%4)*.13,Math.sin(angle)*.44],.085,.1,5);
 }
}

function porchLamp(root,x,y,z){
 box(root,'lamp_mount',A.sash,x,y,z,.19,.24,.15);
 box(root,'shaded_porch_lamp',A.light,x,y-.076,z+.086,.13,.15,.105);
 box(root,'lamp_cap',A.sash,x,y+.013,z+.086,.17,.027,.14);
}

const designs=[
 root=>{
  masonryBlock(root,{width:3.76,depth:3.02,z:-.27,base:.22,height:2.44,rise:.87,hip:1,roof:M.zincDetailed,wall:A.boards,frontDoor:.71,shutters:true,satellite:true});
  planter(root,-1.52,1.62,.61);
 },
 root=>{
  masonryBlock(root,{width:4.68,depth:3.56,z:-.26,base:.28,height:2.55,rise:1.06,hip:1,wall:A.ochre,frontDoor:-1.04,frontWindows:[.83,1.76],satellite:true});
  porchLamp(root,-.4,1.83,1.56);
 },
 root=>{
  masonryBlock(root,{width:5.63,depth:4,z:-.35,base:.28,height:2.57,rise:1.25,hip:1,roof:A.rust,frontDoor:0,steps:false,shutters:true,satellite:true});
  veranda(root,{width:4.8,start:1.65,depth:.70,base:.28,high:2.75,mat:M.zincDetailed});
  planter(root,-1.7,2.16,.68);
 },
 root=>{
  masonryBlock(root,{width:6.5,depth:4.08,z:-.48,base:.31,height:2.65,rise:1.47,wall:A.sage,frontDoor:0,steps:false,satellite:true});
  veranda(root,{width:6.4,start:1.56,depth:1.03,base:.31,high:2.87,masonry:true,railing:true});
  porchLamp(root,-.71,2.13,1.6);
 },
 root=>{
  masonryBlock(root,{width:7.75,depth:4.76,z:-.45,base:.34,height:2.65,rise:1.43,roof:A.rust,wall:A.linen,frontDoor:-.56,steps:false,sideWindows:2,satellite:true});
  veranda(root,{width:4.6,x:-.56,start:1.93,depth:.94,base:.34,high:3.02,masonry:true,railing:true});
  const cross=group(root,'entry_cross_gable',[-.56,0,1.9]);
  cross.rotation.y=Math.PI/2;
  mainRoof(cross,2.48,3.15,2.77,1.21,{mat:A.red,hip:1});
  porchLamp(root,.14,2.2,1.99);
  planter(root,2.32,2.21);
 },
 root=>{
  masonryBlock(root,{width:9.18,depth:4.8,z:-1.13,base:.32,height:2.65,rise:1.57,roof:A.dark,wall:A.white,frontDoor:-1.9,frontWindows:[-3.7,.18],sideWindows:2,steps:false,satellite:true});
  masonryBlock(root,{x:2.57,z:2.38,width:3.62,depth:2.31,base:.32,height:2.53,rise:1.34,hip:1,wall:A.sage,roof:A.rust,frontDoor:null,frontWindows:[0]});
  veranda(root,{width:5.16,x:-1.37,start:1.27,depth:1.77,base:.32,high:2.91,mat:A.dark,masonry:true});
  planter(root,-2.99,2.74,.90);
 },
 root=>{
  masonryBlock(root,{width:10.54,depth:5.9,z:-.59,base:.4,height:2.73,rise:2.13,hip:.49,upper:true,roof:A.rust,wall:A.linen,frontDoor:0,doubleDoor:true,steps:false,sideWindows:2,shutters:true,satellite:true});
  veranda(root,{width:9.6,start:2.36,depth:1.19,base:.4,high:3.07,mat:A.rust,railing:true});
  for(const x of [-3.68,3.68])planter(root,x,3.09);
 },
 root=>{
  masonryBlock(root,{width:10.8,depth:6.77,z:-.58,base:.35,height:2.92,roof:null,wall:A.white,frontDoor:.86,frontWindows:[-2.4,3.1],doubleDoor:true,steps:false,sideWindows:2});
  masonryBlock(root,{width:7.6,depth:5.10,x:-.63,z:-.83,base:3.31,height:2.62,rise:1.53,hip:.38,roof:A.stone,wall:A.sage,doubleDoor:true,frontWindows:[-2.26,2.26],satellite:true});
  veranda(root,{width:9.1,start:2.805,depth:1.32,base:.35,high:3.14,mat:A.stone,masonry:true,railing:true});
  box(root,'upper_balcony_slab',A.tiles,-.63,3.3,2.20,7.6,.15,1.3);
  rail(root,-4.35,3.08,3.38,2.80);
  porchLamp(root,-.23,2.36,2.83);
 },
 root=>{
  masonryBlock(root,{width:12.35,depth:5.94,z:-2.13,base:.42,height:2.72,rise:1.89,hip:.53,roof:A.dark,wall:A.ochre,frontDoor:0,doubleDoor:true,steps:false,sideWindows:2,shutters:true,satellite:true});
  const pavilion=group(root,'open_pendopo',[0,0,2.69]);
  box(pavilion,'pendopo_raised_floor',A.tiles,0,.21,0,7.38,.42,4.1);
  for(const x of [-3.19,3.19])for(const z of [-1.69,1.69])post(pavilion,x,z,.42,3.41);
  for(const x of [-1.87,1.87])for(const z of [-.92,.92])post(pavilion,x,z,.42,3.58);
  mainRoof(pavilion,8.25,4.79,3.42,3.08,{mat:A.rust,hip:.25,upper:true});
  stairs(pavilion,0,2.05,.42,2.8);
  for(const x of [-2.97,2.97])planter(root,x,4.40,1.1);
 },
 root=>{
  masonryBlock(root,{width:13.46,depth:8.56,z:-.59,base:.47,height:3.18,roof:null,wall:A.white,frontDoor:0,frontWindows:[-4.67,-2.17,2.17,4.67],doubleDoor:true,steps:false,sideWindows:3});
  masonryBlock(root,{width:9.98,depth:6.47,x:.57,z:-.94,base:3.72,height:2.64,rise:2.08,roof:A.stone,hip:.58,wall:A.linen,doubleDoor:true,frontWindows:[-3.1,-1.53,1.58,3.45],sideWindows:2,satellite:true});
  veranda(root,{width:12.8,start:3.69,depth:1.53,base:.47,high:3.62,mat:A.stone,masonry:true,railing:true});
  box(root,'full_width_balcony',A.tiles,.57,3.75,2.93,9.95,.18,1.56);
  rail(root,-4.2,5.37,3.85,3.64);
  for(const px of [-5.14,5.14]){
   porchLamp(root,px,2.49,3.75);
   planter(root,px,4.7,1.12);
  }
 },
];

/** The library shares materials and textures, with one complete GLB template per upgrade. */
export function createHouses(){
 const root=group(null,'indonesian_house_models');
 for(const [index,level] of HOUSE_LEVELS.entries()){
  const house=group(root,level.model);
  house.userData={level:index+1,footprint:level.dimensions.slice(0,2)};
  designs[index](house);
 }
 return root;
}
