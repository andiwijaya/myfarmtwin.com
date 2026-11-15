import {Float32BufferAttribute,Vector3} from 'three';
import {M,noise,smoothNoise,group,mesh,box,round,beam,tube,loftY,blade,surface,lathe,crate,sack,trough,gableRoof,timberFrame} from './cozy-world-common.mjs';

export function createWorldTerrain(){
 const root=group(null,'terrain');root.userData={footprint:[88,68],floorPivot:true,buildableSurfaceY:0};
 const p=[],uv=[],idx=[],colors=[],nx=88,nz=68;
 for(let i=0;i<=nx;i++)for(let j=0;j<=nz;j++){const x=i-44,z=j-34,t=.94+(smoothNoise(x*.08+12,z*.08+8)-.5)*.13;p.push(x,0,z);uv.push(x/7,z/7);colors.push(t,t*.998,t*.975);}
 for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const a=i*(nz+1)+j,b=a+nz+1;idx.push(a,a+1,b,b,a+1,b+1);}
 const field=surface(root,'continuous_flat_tropical_pasture',M.field,p,uv,idx);field.geometry.setAttribute('color',new Float32BufferAttribute(colors,3));
 box(root,'exposed_original_tropical_subsoil',M.soil,0,-.46,0,88,.88,68);
 return root;
}

function wirePanel(parent,x,y,z,width,height,{side=false}={}){
 const spacing=.18;for(let u=-width/2;u<=width/2+.001;u+=spacing){const a=side?[x,y-height/2,z+u]:[x+u,y-height/2,z],b=side?[x,y+height/2,z+u]:[x+u,y+height/2,z];beam(parent,'fine_vertical_enclosure_wire',M.meshWire,a,b,.003,5);}
 for(let v=-height/2;v<=height/2+.001;v+=spacing){const a=side?[x,y+v,z-width/2]:[x-width/2,y+v,z],b=side?[x,y+v,z+width/2]:[x+width/2,y+v,z];beam(parent,'fine_horizontal_enclosure_wire',M.meshWire,a,b,.003,5);}
}
function bambooWall(parent,x,z,length,{side=false,base=.35,top=1.6,spacing=.25}={}){
 for(let t=-length/2+.13;t<length/2;t+=spacing){const xx=side?x:x+t,zz=side?z+t:z;beam(parent,'split_bamboo_ventilation_slat',M.bamboo,[xx,base,zz],[xx,top,zz],.032,8);}
 for(const y of [base,top]){const a=side?[x,y,z-length/2]:[x-length/2,y,z],b=side?[x,y,z+length/2]:[x+length/2,y,z];beam(parent,'bamboo_wall_horizontal_binding',M.bamboo,a,b,.045,8);}
}
function toolRack(parent,x,y,z){
 const root=group(parent,'tool_rack',[x,y,z]);box(root,'tool_hanging_rail',M.timber,0,.95,0,1.55,.12,.12);
 for(let i=0;i<3;i++){
  const xx=(i-1)*.5;beam(root,'hardwood_tool_handle',M.timber,[xx,.07,.02],[xx+.045,1.35,.02],.025,10);
  if(i===0){const p=[xx-.15,.05,.0,xx+.15,.05,.0,xx+.11,.35,.01,xx-.11,.35,.01],uv=[0,0,1,0,1,1,0,1];surface(root,'wide_hoe_blade',M.steel,p,uv,[0,1,2,0,2,3,0,2,1,0,3,2]);}
  if(i===1){box(root,'rake_head',M.steel,xx,.12,0,.36,.045,.04);for(let k=0;k<7;k++)beam(root,'rake_tine',M.steel,[xx-.15+k*.05,.12,0],[xx-.15+k*.05,.02,.07],.008,6);}
  if(i===2){loftY(root,'curved_shovel_spade',M.steel,[[.03,xx,0,.02,.01],[.08,xx,0,.12,.02],[.26,xx,.02,.15,.015],[.35,xx,.03,.09,.012]],18);}
 }
 return root;
}
function poultryFeeder(parent,x,z){
 const g=group(parent,'poultry_feeder',[x,0,z]);
 lathe(g,'red_enamel_feed_hopper',M.redEnamel,[[.11,.1],[.12,.12],[.12,.55],[.06,.7],[0,.71]],32);
 lathe(g,'circular_feed_tray',M.redEnamel,[[0,.07],[.29,.07],[.3,.11],[.29,.13],[.25,.13],[.25,.095],[.12,.095]],36);
 const contents=group(g,'feed_contents');lathe(contents,'visible_grain_ring',M.straw,[[.13,.1],[.24,.1],[.24,.105],[.13,.105]],32);
 for(let i=0;i<18;i++){const a=i*Math.PI*2/18;round(contents,'individual_grain',M.yellow,Math.cos(a)*.19,.11,Math.sin(a)*.19,.008,.006,.013,8);}
 tube(g,'feeder_wire_handle',M.steel,[[-.07,.62,0],[-.07,.79,0],[.07,.79,0],[.07,.62,0]],.008,.008,8);
 return g;
}
function poultryDrinker(parent,x,z){
 const g=group(parent,'poultry_drinker',[x,0,z]);
 lathe(g,'white_bell_reservoir',M.plaster,[[0,.1],[.16,.1],[.18,.16],[.17,.51],[.12,.61],[0,.64]],32);
 lathe(g,'green_drinking_pan',M.teal,[[0,.065],[.3,.065],[.3,.12],[.275,.13],[.25,.095],[.15,.095]],36);
 const water=group(g,'water_contents');lathe(water,'visible_drinker_water',M.water,[[.17,.102],[.27,.102],[.27,.108],[.17,.108]],36);
 return g;
}

export function createCoop(){
 const root=group(null,'coop');root.userData={footprint:[9,7],front:'+Z',floorPivot:true,interiorFloorY:0,interiorTarget:[0,.8,-.3]};
 const floor=group(root,'floor');box(floor,'lime_concrete_foundation',M.plaster,0,-.09,0,9,.18,7);
 box(floor,'dry_rice_husk_bedding',M.straw,0,.017,-.4,8.45,.034,5.7);for(const s of [-1,1])box(floor,'drain_gutter',M.dark,s*4.18,.005,0,.09,.014,6.55);
 timberFrame(root,8.65,6.65,{eave:2.45,rise:1.12});gableRoof(root,'roof',9.8,7.8,2.49,1.16);
 const walls=group(root,'walls');
 for(const s of [-1,1]){box(walls,'low_lime_sidewall',M.plaster,s*4.35,.22,0,.14,.44,6.8);bambooWall(walls,s*4.35,0,6.75,{side:true,base:.45,top:1.4,spacing:.3});wirePanel(walls,s*4.35,1.91,0,6.7,.85,{side:true});}
 box(walls,'low_back_masonry',M.brick,0,.22,-3.35,8.8,.44,.14);bambooWall(walls,0,-3.35,8.6,{base:.45,top:1.5,spacing:.3});wirePanel(walls,0,1.94,-3.35,8.6,.75);
 for(const s of [-1,1]){box(walls,'front_lowwall',M.plaster,s*2.7,.22,3.35,3.2,.44,.14);wirePanel(walls,s*2.7,1.35,3.35,3.2,1.75);}
 const gate=group(walls,'entry_gate',[1,0,3.36]);gate.rotation.y=.72;
 for(const x of [0,-1.9])box(gate,'gate_upright',M.timber,x,1.1,0,.075,2.2,.075);for(const y of [.05,1.05,2.15])box(gate,'gate_crossbar',M.timber,-.95,y,0,1.9,.075,.075);wirePanel(gate,-.95,1.1,0,1.8,2.0);
 const fittings=group(root,'equipment');poultryFeeder(fittings,-1.45,.55);poultryDrinker(fittings,1.45,.55);
 const nests=group(root,'nests');const eggs=group(root,'nest_eggs');
 for(const x of [-2.55,0,2.55]){
  const n=crate(nests,'raised_nesting_box',x,.27,-2.65,1.35,.55,1.0);box(n,'nest_raised_front_lip',M.timber,0,.13,.51,1.4,.22,.07);round(n,'cupped_rice_straw_nest',M.straw,0,.12,0,.54,.12,.38,24);
  for(const s of [-1,1])box(n,'nest_support_leg',M.timber,s*.48,-.13,-.3,.1,.3,.1);
  box(n,'nest_privacy_roof',M.timber,0,.62,0,1.48,.07,1.12);
  for(let i=0;i<4;i++){const a=i*2.4;round(eggs,'collectible_nest_egg',M.cream,x+Math.cos(a)*.13,.50+(i%2)*.008,-2.65+Math.sin(a)*.12,.036,.049,.036,24).rotation.z=.16*Math.cos(a);}
 }
 const roost=group(root,'roosts');
 for(const s of [-1,1]){beam(roost,'roost_cross_perch',M.bamboo,[s*3.65,.94,-1.8],[s*3.65,.94,1.7],.055,12);for(const z of [-1.5,1.4]){beam(roost,'splayed_roost_leg',M.timber,[s*3.2,.02,z],[s*3.65,.94,z],.045,8);beam(roost,'splayed_roost_leg',M.timber,[s*4,.02,z],[s*3.65,.94,z],.045,8);}for(let i=0;i<6;i++)box(roost,'small_roost_ladder_tread',M.timber,s*(2.5+i*.16),.11+i*.14,1.55,.52,.04,.12);}
 toolRack(fittings,-3.2,0,-2.9);sack(fittings,'dry_feed_sack',3.6,0,2.45,.9);
 return root;
}

export function createGoatShelter(){
 const root=group(null,'goat_shelter');root.userData={footprint:[11,9],front:'+Z',floorPivot:true,interiorFloorY:.34,interiorTarget:[0,1.1,-.3]};
 const floor=group(root,'floor');
 for(const x of [-5,-2.5,0,2.5,5])for(const z of [-4,0,4])box(floor,'dry_stone_pier',M.plaster,x,.13,z,.38,.26,.38);
 for(const z of [-4.15,-2.05,0,2.05,4.15])box(floor,'raised_floor_bearer',M.timber,0,.22,z,10.85,.16,.12);
 // Real gaps in the slatted timber floor, supported by actual bearers.
 for(let x=-5.2;x<=5.2;x+=.19)box(floor,'ventilated_floor_slat',M.timber,x,.30,0,.162,.08,8.5);
 const ramp=group(floor,'entry_ramp',[0,0,3.78]);box(ramp,'sloping_entry_board',M.timber,0,.15,.73,1.9,.06,1.65).rotation.x=.205;
 for(let i=0;i<8;i++)box(ramp,'anti_slip_ramp_rung',M.timber,0,.31-i*.036,i*.2,1.88,.035,.05);
 timberFrame(root,10.5,8.5,{eave:2.8,rise:1.42,post:.18});gableRoof(root,'roof',11.8,9.8,2.84,1.43);
 const walls=group(root,'walls');
 for(const s of [-1,1]){bambooWall(walls,s*5.25,0,8.5,{side:true,base:.38,top:1.85,spacing:.18});box(walls,'sidewall_top_rail',M.timber,s*5.25,1.95,0,.12,.12,8.6);}
 bambooWall(walls,0,-4.24,10.5,{base:.38,top:1.9,spacing:.2});
 const stalls=group(root,'stalls');
 for(const x of [-1.18,1.18]){
  for(const z of [-3.8,-1.3,1.2,3.75])box(stalls,'pen_partition_post',M.timber,x,1.04,z,.1,1.4,.1);
  for(const y of [.64,1.02,1.4])box(stalls,'longitudinal_pen_rail',M.timber,x,y,-.05,.08,.09,7.8);
 }
 for(const s of [-1,1])for(const z of [-1.15,1.35]){for(const y of [.67,1.14,1.57])box(stalls,'pen_cross_rail',M.timber,s*3.23,y,z,3.9,.09,.08);for(const x of [s*1.3,s*5.1])box(stalls,'cross_partition_post',M.timber,x,.99,z,.1,1.3,.1);}
 const equipment=group(root,'equipment');
 for(const s of [-1,1]){trough(equipment,'green_fodder_trough_'+s,s*1.7,.34,-2.65,{length:2.4});trough(equipment,'clean_water_trough_'+s,s*4.55,.34,2.8,{water:true,length:1.05});}
 // Bamboo hay racks, each with a separate state-driven feed_contents node.
 for(const side of [-1,1]){
  const rack=group(equipment,'wall_hay_rack_'+side,[side*4.95,.34,-2.7]);
  for(const yy of [.55,1.1])box(rack,'hay_rack_wall_rail',M.timber,0,yy,0,.08,.07,1.45);
  for(let i=0;i<9;i++)beam(rack,'sloping_bamboo_hay_bar',M.bamboo,[0,1.1,-.68+i*.17],[-side*.48,.45,-.68+i*.17],.022,8);
  const contents=group(rack,'feed_contents');for(let i=0;i<26;i++){const z=-.61+(i%13)*.1;blade(contents,'fresh_cut_forage',i%3?M.leaf:M.leafLight,[-side*.08,.55,z],[-side*(.26+(i%3)*.06),1.03+(i%4)*.07,z+.07],.045,.06,7);}
 }
 const bedding=group(root,'bedding');for(const s of [-1,1])box(bedding,'kid_dry_straw_mat',M.straw,s*3.1,.36,.1,2.4,.035,1.8);
 toolRack(equipment,-3.8,.34,-3.98);sack(equipment,'goat_feed_sack',3.9,.34,-3.5,1.1);
 return root;
}

function roundedOutline(w,d,r,segments=12){const out=[];for(const [cx,cz,start]of [[w/2-r,d/2-r,0],[-w/2+r,d/2-r,Math.PI/2],[-w/2+r,-d/2+r,Math.PI],[w/2-r,-d/2+r,Math.PI*1.5]])for(let j=0;j<=segments;j++){const a=start+j/segments*Math.PI/2;out.push([cx+Math.cos(a)*r,cz+Math.sin(a)*r]);}return out;}
function roundedSheet(parent,name,mat,w,d,r,y,{ripple=false}={}){const outline=roundedOutline(w,d,r),p=[0,y,0],uv=[.5,.5],idx=[];for(const[x,z]of outline){p.push(x,y+(ripple?Math.sin(x*3+z)*Math.cos(z*2-x)*.004:0),z);uv.push(x/2,z/2);}for(let i=0;i<outline.length;i++)idx.push(0,(i+1)%outline.length+1,i+1);return surface(parent,name,mat,p,uv,idx);}
export function createPond(){
 const root=group(null,'pond');root.userData={footprint:[12,10],floorPivot:true,interiorFloorY:.12,waterSurfaceY:.52,fishRegion:[[-4.6,.14,-3.6],[4.6,.25,3.6]],front:'+Z'};
 const rim=group(root,'rim'),profiles=[[12,10,1.05,.015],[11.94,9.94,1.02,.48],[11.6,9.6,.95,.72],[10.95,8.95,.8,.72],[10.55,8.55,.65,.12]],p=[],uv=[],idx=[];
 let stride;
 for(let k=0;k<profiles.length;k++){const[w,d,r,y]=profiles[k],ring=roundedOutline(w,d,r);stride=ring.length;for(let i=0;i<ring.length;i++){p.push(ring[i][0],y,ring[i][1]);uv.push(i/ring.length*15,k*.4);}}
 for(let k=0;k<profiles.length-1;k++)for(let i=0;i<stride;i++){const a=k*stride+i,b=a+stride,n=k*stride+(i+1)%stride;idx.push(a,b,n,n,b,n+stride);}
 surface(rim,'rounded_hand_trowelled_pond_wall',M.plaster,p,uv,idx);
 roundedSheet(root,'pond_lined_floor',M.liner,10.57,8.57,.65,.119);
 const water=group(root,'water_contents');roundedSheet(water,'water_surface',M.pondWater,10.75,8.75,.76,.52,{ripple:true});
 const equipment=group(root,'equipment');
 // Visible supply, screened filter, drain and access platform connect gameplay
 // to actual facilities instead of floating decorative icons.
 tube(equipment,'water_supply_pipe',M.teal,[[-5.7,.1,-2.3],[-5.7,.95,-2.3],[-4.75,.95,-2.3],[-4.75,.67,-2.3]],.065,.065,12);
 tube(equipment,'screened_drain_pipe',M.steel,[[4.8,.22,-3],[5.55,.22,-3],[5.85,.45,-3],[6.08,.45,-3]],.075,.075,12);
 for(let i=0;i<6;i++)box(equipment,'drain_intake_screen',M.steel,4.73,.17+i*.027,-3,.02,.009,.18);
 box(equipment,'service_motor_plinth',M.plaster,-5.3,.8,-2.6,.9,.22,.8);round(equipment,'green_pump_motor',M.teal,-5.3,1.02,-2.6,.29,.18,.21,28);
 const platform=group(equipment,'service_platform',[0,.73,4.13]);for(let x=-1.1;x<=1.1;x+=.21)box(platform,'inspection_platform_board',M.timber,x,0,0,.18,.08,1.08);
 const aerator=group(root,'aerator',[2.7,0,1.75]);
 for(const side of [-1,1]){round(aerator,'green_aerator_float',M.teal,side*.48,.52,0,.19,.12,.67,24);box(aerator,'float_mount_rail',M.steel,side*.48,.69,0,.07,.07,1.05);}
 beam(aerator,'rotor_axle',M.steel,[-.64,.85,0],[.64,.85,0],.033,14);
 round(aerator,'aerator_motor',M.teal,0,.87,.45,.19,.16,.2,24);tube(aerator,'protected_motor_cable',M.dark,[[0,.86,.6],[.6,.64,.8],[1.7,.7,1.4],[2.95,.74,1.7]],.014,.014,8);
 const rotor=group(aerator,'aerator_rotor',[0,.85,0]);
 for(const xx of [-.32,.32])for(let i=0;i<8;i++){const a=i*Math.PI/4;beam(rotor,'paddle_radial_spoke',M.steel,[xx,0,0],[xx,Math.sin(a)*.31,Math.cos(a)*.31],.012,8);box(rotor,'splash_paddle',M.teal,xx,Math.sin(a)*.34,Math.cos(a)*.34,.28,.105,.045).rotation.x=-a;}
 const bubbles=group(aerator,'aerator_bubbles');for(let i=0;i<12;i++){const a=i*2.4;round(bubbles,'fine_surface_aeration_bubble',M.bubble,Math.cos(a)*.52,.55+(i%4)*.025,Math.sin(a)*.38,.016+(i%3)*.009,.018+(i%3)*.007,.017+(i%3)*.008,12);}
 sack(equipment,'fish_feed_sack',-4.8,.74,3.1,.85);
 return root;
}

function produceCrate(parent,name,x,y,z,kind){const c=crate(parent,name,x,y,z,.72,.36,.58),produce=group(c,'produce');for(let i=0;i<12;i++){const xx=-.23+(i%4)*.15,zz=-.17+Math.floor(i/4)*.16;if(kind==='tomato'){round(produce,'ripe_harvested_tomato',M.red,xx,.3,zz,.073,.065,.073,18);for(let k=0;k<4;k++)blade(produce,'small_tomato_calyx',M.stem,[xx,.366,zz],[xx+Math.cos(k*1.57)*.045,.36,zz+Math.sin(k*1.57)*.045],.01,.004,4);}else if(kind==='corn'){const ear=round(produce,'golden_corn_cob',M.yellow,xx,.3,zz,.036,.04,.16,18);ear.rotation.y=.15*(i%3);if(i%3===0)blade(produce,'peeled_green_corn_husk',M.leafLight,[xx,.27,zz-.13],[xx+.08,.32,zz+.1],.03,.06,7);}else{for(let k=0;k<6;k++)blade(produce,'harvested_green_leaf',k%3?M.leafLight:M.leaf,[xx,.22,zz],[xx+Math.cos(k*2.4)*.10,.27+(k%3)*.025,zz+Math.sin(k*2.4)*.1],.04,.035,7);}}return c;}
export function createMarket(){
 const root=group(null,'market');root.userData={footprint:[7,6],floorPivot:true,front:'+Z',interiorFloorY:0,interiorTarget:[0,1,0]};
 const floor=group(root,'floor');box(floor,'warm_concrete_market_slab',M.plaster,0,-.08,0,7,.16,6);for(let i=0;i<10;i++)box(floor,'entry_terracotta_paver',M.brick,-3.15+i*.7,.012,2.65,.64,.024,.49);
 timberFrame(root,6.65,5.65,{eave:2.7,rise:1.15});gableRoof(root,'roof',7.8,6.9,2.76,1.17,{clay:true});
 const walls=group(root,'walls');
 box(walls,'warehouse_back_plasterwall',M.plaster,0,1.19,-2.84,6.7,2.38,.16);
 for(const s of [-1,1]){box(walls,'lower_market_side_plasterwall',M.plaster,s*3.32,.52,0,.14,1.04,5.65);bambooWall(walls,s*3.31,-.1,5.4,{side:true,base:1.11,top:2.12,spacing:.2});}
 const equipment=group(root,'equipment');
 // Front sales counter leaves a walkable center aisle into warehouse shelves.
 for(const s of [-1,1]){box(equipment,'timber_produce_counter_top',M.timber,s*1.85,.86,1.55,2.65,.09,.95);for(const x of [s*.76,s*2.94])for(const z of [1.23,1.88])box(equipment,'counter_leg',M.timber,x,.42,z,.11,.84,.11);for(let i=0;i<12;i++)box(equipment,'counter_front_bamboo_panel',M.bamboo,s*1.85-1.18+i*.215,.41,2.0,.18,.71,.045);}
 const stock=group(root,'stock_contents');
 for(const [x,kind]of [[-2.65,'lettuce'],[-1.75,'tomato'],[1.15,'corn'],[2.15,'tomato']])produceCrate(stock,'fresh_'+kind+'_display',x,.91,1.55,kind);
 const shelves=group(root,'warehouse_shelves');for(const x of [-2.3,2.3]){
  for(const xx of [x-.77,x+.77])for(const zz of [-2.6,-1.95])box(shelves,'warehouse_shelf_upright',M.timber,xx,1.05,zz,.095,2.1,.095);
  for(const y of [.12,.87,1.62])box(shelves,'warehouse_storage_shelf',M.timber,x,y,-2.28,1.7,.075,.82);
  sack(stock,'stored_dry_crop_sack',x-.35,.16,-2.23,.9);crate(stock,'empty_delivery_crate',x+.33,.16,-2.23,.65,.44,.59);
  produceCrate(stock,'warehouse_stored_produce',x,.92,-2.27,x<0?'corn':'lettuce');
 }
 const scale=group(equipment,'produce_weighing_scale',[-.55,.91,1.53]);box(scale,'green_scale_base',M.teal,0,.1,0,.35,.18,.3);round(scale,'round_scale_dial',M.cream,0,.22,.145,.115,.115,.018,28);tube(scale,'scale_needle',M.dark,[[0,.22,.166],[.065,.275,.166]],.004,.002,5);lathe(scale,'metal_weighing_pan',M.steel,[[0,.25],[.19,.25],[.23,.29],[.22,.30],[.17,.27],[0,.27]],32);
 // Warehouse fixtures make the new tools/facility system visible on site.
 toolRack(equipment,0,0,-2.63);crate(equipment,'order_crate',.25,0,.15,.95,.6,.75);sack(equipment,'order_feed_sack',.28,.05,.12,.8);
 const bell=group(equipment,'service_bell',[.6,.96,1.54]);lathe(bell,'brass_service_bell',M.horn,[[0,0],[.1,0],[.095,.05],[.045,.13],[0,.145]],28);beam(bell,'bell_button',M.steel,[0,.14,0],[0,.18,0],.015,10);
 box(equipment,'market_hanging_sign_blank',M.timber,0,2.35,2.89,1.7,.48,.055);for(const s of [-1,1])beam(equipment,'hanging_sign_rope',M.cloth,[s*.65,2.55,2.89],[s*.65,2.9,2.89],.012,8);
 return root;
}

// Authored far vegetation: fewer fronds/leaflets and low-sided stems, with
// matching template names, dimensions and floor pivots. No live simplification.
export function createFarVegetation(){
 const root=group(null,'vegetation_templates_far');root.userData={lod:'far',authoredReduction:true};
 const banana=group(root,'banana');loftY(banana,'far_banana_stem',M.stem,[[0,0,0,.19,.18],[1.3,.03,0,.14,.14],[2.3,.08,0,.08,.08]],8);
 for(let i=0;i<6;i++){const a=i*2.4,len=1.6+(i%3)*.28;blade(banana,'far_banana_blade',i%2?M.leaf:M.leafLight,[.08,2.15+(i%3)*.13,0],[Math.cos(a)*len,2.05+(i%4)*.18,Math.sin(a)*len],.3,.5,5);}
 const palm=group(root,'palm');loftY(palm,'far_curved_palm_trunk',M.timber,[[0,0,0,.2,.2],[2,.16,.03,.15,.15],[4,.38,.03,.1,.1]],8);
 for(let i=0;i<7;i++){const a=i*Math.PI*2/7,start=[.38,4,.03],end=[.38+Math.cos(a)*2.1,3.8,Math.sin(a)*2.1];tube(palm,'far_palm_frond_spine',M.stem,[start,[.38+Math.cos(a),4.5,Math.sin(a)],end],.025,.004,5,6);for(let j=1;j<=4;j++){const t=j/5,cx=.38+Math.cos(a)*2.1*t,cz=Math.sin(a)*2.1*t,cy=4+Math.sin(t*Math.PI)*.5-.2*t;for(const s of [-1,1])blade(palm,'far_palm_leaflet',M.leaf,[cx,cy,cz],[cx+Math.cos(a+s*1.1)*.6*(1-t*.6),cy-.2,cz+Math.sin(a+s*1.1)*.6*(1-t*.6)],.05,.05,3);}}
 const grass=group(root,'grass');for(let i=0;i<7;i++){const a=i*2.4,r=(i%5)*.02;blade(grass,'far_grass_blade',M.leaf,[Math.cos(a)*r,0,Math.sin(a)*r],[Math.cos(a)*(.13+r),.16+(i%4)*.06,Math.sin(a)*(.13+r)],.02,.035,3);}
 const shrub=group(root,'shrub');for(let i=0;i<5;i++){const a=i*2.4;beam(shrub,'far_shrub_branch',M.timber,[0,0,0],[Math.cos(a)*.35,.5+(i%3)*.13,Math.sin(a)*.35],.015,5);for(let j=0;j<3;j++)blade(shrub,'far_shrub_leaf',M.leaf,[Math.cos(a)*.2,.3+j*.1,Math.sin(a)*.2],[Math.cos(a+j)*.6,.4+j*.1,Math.sin(a+j)*.6],.11,.06,3);}
 return root;
}
