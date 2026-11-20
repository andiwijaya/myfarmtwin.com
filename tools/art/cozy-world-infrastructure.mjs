import {M,beam,box,crate,group,lathe,material,noise,round,sack,smoothNoise,surface,textures,tube} from './cozy-world-common.mjs';
import {png} from './glb-prototype-export.mjs';

const paint=material('Weathered blue-green truck paint',0x4c8586,{roughness:.52,metalness:.24});
const trim=material('Gray vehicle bumpers and chassis',0x454b4c,{roughness:.66,metalness:.3});
const rubber=material('Road tire rubber',0x292a29,{roughness:.93});
const windowGlass=material('Dark tinted vehicle glazing',0x41606b,{roughness:.18,metalness:.17});
const signal=material('Amber indicator glass',0xe19941,{roughness:.3});
const tailLight=material('Red tail light glass',0xab372c,{roughness:.3});
const lens=material('Headlight lenses',0xe7e1c5,{roughness:.31});
const plate=material('Black license plate blank',0x32312b,{roughness:.8});
const powerSteel=material('Off-white galvanized turbine steel',0xe2e4dc,{roughness:.7,metalness:.21,double:true});
const poleSteel=material('Gray-green street pole steel',0x777f75,{roughness:.73,metalness:.24});
const boxSteel=material('Weathered sage transformer housing',0x778b72,{roughness:.8,metalness:.15});
const solarGlass=material('Blue photovoltaic modules',0x203c57,{roughness:.32,metalness:.25});
const solarCell=material('Blue-black photovoltaic cells',0x273f57,{roughness:.35,metalness:.19});
const bulb=material('Frosted amber street lamp lens',0xffe2ac,{roughness:.4});
const tomatoes=material('Ripe tomatoes for market',0xb9482c,{roughness:.57});
const scooterPaint=material('Muted green scooter enamel',0x4c6855,{roughness:.48,metalness:.18});
const courierJacket=material('Green courier canvas jacket',0x587c50,{roughness:.95});
const courierJeans=material('Dark indigo courier denim',0x34434c,{roughness:.96});
const courierSkin=material('Warm brown rider complexion',0xa66d50,{roughness:.87});
const helmetShell=material('Cream scooter helmet',0xe3e0c9,{roughness:.4,metalness:.08});
const deliveryBag=material('Ochre insulated delivery bag',0xb87237,{roughness:.91});
const kraft=material('Kraft takeaway packaging',0xc09861,{roughness:.9});
const courierLens=material('Scooter headlight glass',0xece0b7,{roughness:.38});
courierLens.emissive.set(0x9f6c36);

const roadMap=textures.push({
 name:'original-packed-lane-gravel',
 bytes:png(128,128,(u,v,x,y)=>{
  const patch=(smoothNoise(u*10,v*10)-.5)*13,grit=(noise(x,y)-.5)*21;
  const value=158+patch+grit;
  return [value,value*.95,value*.84,255];
 }),
})-1;
const road=material('Packed gravel village lane',0xd7cfb5,{roughness:.98,texture:roadMap});

const glowMap=textures.push({
 name:'original-soft-lamp-pool',
 bytes:png(64,64,(u,v)=>{
  const radius=Math.hypot(u-.5,v-.5)*2;
  const fade=Math.max(0,1-radius)**2;
  return [255,191,92,67*fade];
 }),
})-1;
const glow=material('Soft amber ground light',0xffffff,{texture:glowMap,opacity:.98,roughness:1,double:true});
glow.emissive.set(0xffb75c);

function wheel(parent,x,z){
 const root=group(parent,'truck_wheel',[x,.37,z]);
 root.userData.truckWheel=true;
 const tire=lathe(root,'radial_tire',rubber,[[.21,-.128],[.319,-.132],[.366,-.091],[.372,.075],[.333,.129],[.218,.130]],22);
 tire.rotation.z=Math.PI/2;
 const rim=lathe(root,'pressed_steel_wheel',M.steel,[[.05,-.139],[.213,-.137],[.213,-.125],[.15,-.107],[.11,.105],[.212,.12],[.213,.138],[.04,.139]],20);
 rim.rotation.z=Math.PI/2;
 for(let i=0;i<5;i++){
  const angle=i*Math.PI*2/5;
  box(root,'wheel_nut',trim,Math.sign(x)*.143,Math.cos(angle)*.087,Math.sin(angle)*.087,.025,.023,.023);
 }
}

function truck(root){
 const body=group(root,'market_truck');
 box(body,'steel_ladder_frame',trim,0,.59,-.08,1.42,.20,4.18);
 for(const x of [-.80,.80])for(const z of [-1.29,1.21])wheel(body,x,z);
 box(body,'cab_lower_shell',paint,0,.97,1.19,1.74,.73,1.35);
 box(body,'cab_rear_bulkhead',paint,0,1.52,.61,1.69,1.02,.12);
 const roof=box(body,'cab_roof',paint,0,1.99,1.15,1.73,.13,1.21);
 roof.rotation.x=-.035;
 const windshield=box(body,'windshield',windowGlass,0,1.65,1.735,1.50,.52,.055);
 windshield.rotation.x=-.24;
 beam(body,'windshield_center_trim',trim,[0,1.37,1.81],[0,1.91,1.68],.018,6);
 for(const x of [-1,1]){
  box(body,'cab_side_window',windowGlass,x*.846,1.65,1.19,.045,.57,.95);
  for(const z of [.66,1.64])box(body,'window_pillar',paint,x*.856,1.65,z,.067,.69,.093);
  box(body,'cab_door_handle',trim,x*.885,1.19,1.13,.032,.042,.134);
  beam(body,'mirror_support',trim,[x*.85,1.57,1.63],[x*1.03,1.65,1.70],.021,6);
  box(body,'side_mirror',trim,x*1.04,1.69,1.71,.088,.188,.093);
  box(body,'side_mirror_glass',windowGlass,x*1.04,1.69,1.659,.071,.146,.018);
  box(body,'headlamp',lens,x*.606,.927,1.89,.269,.19,.067);
  box(body,'front_indicator',signal,x*.783,.925,1.889,.081,.158,.053);
  box(body,'rear_lamp',tailLight,x*.76,.708,-2.178,.152,.120,.035);
 }
 box(body,'radiator_intake',trim,0,1.05,1.888,.911,.218,.055);
 for(let i=0;i<4;i++)box(body,'radiator_horizontal_bar',M.steel,0,.980+i*.049,1.926,.845,.018,.026);
 box(body,'front_bumper',trim,0,.67,1.93,1.78,.16,.27);
 box(body,'front_registration_plate',plate,0,.69,2.075,.31,.108,.020);
 box(body,'rubber_cargo_bed',trim,0,.819,-.81,1.67,.117,2.62);
 for(const x of [-.84,.84])box(body,'drop_side_cargo_panels',paint,x,1.047,-.823,.087,.401,2.62);
 for(const z of [.459,-2.153])box(body,'cargo_bulkhead_and_tailgate',paint,0,1.045,z,1.74,.401,.086);
 box(body,'rear_bumper',trim,0,.61,-2.16,1.62,.127,.21);
 for(let n=0;n<5;n++)box(body,'cargo_bed_wood_slats',M.timber,-.57+n*.285,.884,-.81,.224,.026,2.39);
 const load=group(body,'truck_load');
 const greens=crate(load,'leafy_produce_crate',-.41,.896,-1.512,.64,.56,.47);
 crate(load,'lower_produce_crate',.35,.896,-1.50,.59,.58,.51);
 const fruit=crate(load,'tomato_crate',.35,1.47,-1.50,.54,.48,.44);
 for(const x of [-.16,0,.16])for(const z of [-.095,.09]){
  round(fruit,'ripe_tomato',tomatoes,x,.432,z,.082,.070,.084,10);
  round(greens,'leaf_lettuce',M.leaf,x,.5,z,.12,.11,.10,10);
  round(greens,'lettuce_heart',M.leafLight,x+.017,.564,z-.013,.069,.07,.066,10);
 }
 for(const x of [-.48,.04])sack(load,'secured_rice_sack',x,.90,-.52,1.13);
}

function foodParcel(parent,name,position){
 const parcel=group(parent,name,position);
 box(parcel,'kraft_takeaway_bag',kraft,0,.139,0,.34,.278,.25);
 box(parcel,'bag_folded_top',kraft,0,.284,0,.316,.035,.163);
 box(parcel,'paper_seal',M.cream,0,.241,.128,.082,.09,.013);
 for(const z of [-.035,.035])tube(parcel,'twisted_paper_handle',M.timber,[[-.076,.281,z],[-.065,.358,z],[0,.374,z],[.065,.358,z],[.076,.281,z]],.007,.007,5,11);
 return parcel;
}

function deliveryScooter(root){
 const bike=group(root,'delivery_scooter');
 for(const [side,z] of [['front',.66],['rear',-.65]]){
  const wheel=group(bike,'courier_wheel_'+side,[0,.28,z]);
  wheel.userData.courierWheel=true;
  lathe(wheel,'scooter_rubber_tire',rubber,[[.162,-.062],[.239,-.069],[.274,-.044],[.28,.026],[.264,.054],[.222,.066],[.16,.059]],24).rotation.z=Math.PI/2;
  lathe(wheel,'cast_alloy_scooter_rim',M.steel,[[.038,-.052],[.183,-.05],[.209,-.035],[.205,.038],[.183,.048],[.036,.051]],20).rotation.z=Math.PI/2;
 }
 box(bike,'low_step_through_floor',trim,0,.372,.06,.34,.113,.56);
 round(bike,'rear_enamel_side_shell',scooterPaint,0,.62,-.45,.245,.191,.54,18);
 round(bike,'front_fairing',scooterPaint,0,.69,.466,.218,.297,.198,18);
 round(bike,'front_wheel_fender',scooterPaint,0,.492,.68,.103,.091,.235,14);
 round(bike,'stitched_scooter_saddle',rubber,0,.831,-.337,.216,.067,.361,16);
 box(bike,'tail_lamp',tailLight,0,.663,-.962,.244,.104,.05);
 round(bike,'projector_headlight',courierLens,0,.865,.647,.136,.079,.048,16);
 for(const x of [-.122,.122])beam(bike,'front_fork',M.steel,[x,.276,.657],[x,.844,.486],.032,9);
 beam(bike,'scooter_handlebar',trim,[-.318,.969,.555],[.318,.969,.555],.032,10);
 for(const s of [-1,1]){
  beam(bike,'scooter_mirror_stalk',M.steel,[s*.239,.972,.55],[s*.323,1.142,.613],.013,6);
  round(bike,'scooter_mirror_shell',trim,s*.335,1.156,.614,.081,.052,.028,12);
  round(bike,'scooter_mirror_glass',windowGlass,s*.335,1.156,.591,.068,.043,.012,12);
 }
 beam(bike,'exhaust_muffler',trim,[.205,.266,-.458],[.205,.344,-.899],.053,11);
 box(bike,'delivery_rack',M.steel,0,.901,-.754,.48,.05,.46);
 box(bike,'insulated_rear_case',deliveryBag,0,1.056,-.767,.48,.308,.446);
 box(bike,'case_zip_trim',trim,0,1.19,-.767,.493,.044,.457);
 box(bike,'case_reflective_tape',M.cream,0,1.079,-.997,.405,.038,.018);
 foodParcel(bike,'courier_payload',[0,1.21,-.766]).scale.setScalar(.74);

 const rider=group(bike,'courier_rider');
 round(rider,'seated_hips',courierJeans,0,.899,-.252,.207,.118,.207,16);
 round(rider,'jacket_body',courierJacket,0,1.156,-.165,.227,.259,.154,18).rotation.x=-.25;
 round(rider,'courier_neck',courierSkin,0,1.39,-.069,.069,.088,.072,14);
 round(rider,'helmet_shell',helmetShell,0,1.55,-.047,.142,.142,.158,20);
 round(rider,'smoked_helmet_visor',windowGlass,0,1.538,.067,.124,.066,.068,18);
 for(const s of [-1,1]){
  const knee=[s*.186,.654,.222],ankle=[s*.14,.405,.103];
  beam(rider,'courier_thigh',courierJeans,[s*.134,.884,-.196],knee,.088,10,.070);
  beam(rider,'courier_shin',courierJeans,knee,ankle,.066,10,.048);
  round(rider,'courier_boot',rubber,s*.14,.398,.179,.063,.051,.122,14);
  const elbow=[s*.288,1.07,.136],grip=[s*.282,.974,.542];
  beam(rider,'courier_upper_sleeve',courierJacket,[s*.208,1.277,-.101],elbow,.075,10,.06);
  beam(rider,'courier_forearm_sleeve',courierJacket,elbow,grip,.057,10,.038);
  round(rider,'hand_on_grip',courierSkin,...grip,.049,.043,.051,12);
 }
}

function roads(root){
 surface(root,'road_strip',road,[-1.715,0,.5,1.715,0,.5,1.715,0,-.5,-1.715,0,-.5],[0,0,1,0,1,1,0,1],[0,1,2,0,2,3]);
 const positions=[0,0,0],uv=[.5,.5],indices=[];
 for(let i=0;i<18;i++){
  const angle=i*Math.PI/9,x=Math.cos(angle),z=-Math.sin(angle);
  positions.push(x*1.715,0,z*1.715);
  uv.push(.5+x*.5,.5+z*.5);
  indices.push(0,i+1,(i+1)%18+1);
 }
 const joint=road.clone();
 joint.name='Packed gravel turn pocket';
 surface(root,'road_joint',joint,positions,uv,indices);
}

function energy(root){
 const site=group(root,'wind_solar_station');
 box(site,'power_station_foundation',M.plaster,.15,.095,0,7.23,.19,3.78);
 const tower=group(site,'energy_turbine',[-2.17,0,-.48]);
 lathe(tower,'tapered_turbine_mast',powerSteel,[[.462,.15],[.359,.34],[.28,2.6],[.217,4.23],[.174,6.37]],18);
 box(tower,'turbine_access_panel',poleSteel,0,.87,.337,.309,.96,.056);
 box(tower,'turbine_nacelle',powerSteel,0,6.31,.055,.46,.43,1.03);
 const rotor=group(tower,'energy_turbine_rotor',[0,6.30,.645]);
 lathe(rotor,'three_blade_hub',powerSteel,[[.21,0],[.18,.16],[.06,.24]],14).rotation.x=Math.PI/2;
 for(let i=0;i<3;i++){
  const blade=group(rotor,'turbine_sail');
  blade.rotation.z=i*Math.PI*2/3;
  surface(blade,'aerodynamic_blade',powerSteel,[-.109,.07,0,.104,.09,.06,.202,.81,.078,.047,2.17,.09,-.014,2.25,.036,-.158,.61,-.055],[.2,0,.8,0,1,.36,.65,.95,.5,1,0,.28],[0,1,2,0,2,5,5,2,3,5,3,4]);
 }
 for(const x of [-.19,1.684]){
  const panel=group(site,'solar_panel_array',[x,.96,-.356]);
  panel.rotation.x=-.28;
  box(panel,'aluminum_panel_frame',M.steel,0,0,0,1.64,.071,1.56);
  box(panel,'photovoltaic_glazing',solarGlass,0,.042,0,1.56,.019,1.48);
  for(let i=0;i<6;i++)for(let j=0;j<5;j++)box(panel,'solar_cell',solarCell,-.641+i*.256,.054,-.58+j*.288,.244,.009,.269);
  for(const xx of [-.55,.55])beam(site,'solar_rack_leg',poleSteel,[x+xx,.18,-.93],[x+xx,1.073,-.93],.038,6);
 }
 const transform=group(site,'distribution_transformer',[2.66,0,.989]);
 box(transform,'transformer_plinth',M.plaster,0,.21,0,1.4,.42,.98);
 box(transform,'transformer_tank',boxSteel,0,.76,0,1.21,.80,.78);
 box(transform,'transformer_top_plate',boxSteel,0,1.18,0,1.29,.091,.88);
 for(let i=0;i<7;i++)box(transform,'cooling_fins',boxSteel,(i-3)*.168,.78,.42,.052,.61,.184);
 for(const x of [-.34,0,.34])lathe(transform,'porcelain_bushing',M.plaster,[[.083,0],[.082,.049],[.052,.079],[.059,.126],[.035,.195],[.037,.225]],10).position.set(x,1.22,0);
 tube(site,'protected_surface_conduit',trim,[[-2.17,.22,-.12],[-1.38,.22,.74],[.78,.22,1.18],[2.65,.22,1.18]],.034,.034,6,18);
}

function lamp(root){
 const post=group(root,'farm_street_lamp');
 box(post,'lamppost_socket',M.plaster,0,.09,0,.42,.18,.42);
 lathe(post,'tapered_lamp_pole',poleSteel,[[.133,.16],[.092,.44],[.058,2.69],[.051,3.56]],13);
 tube(post,'curved_lamp_arm',poleSteel,[[0,3.49,0],[0,3.76,.13],[0,3.81,.53],[0,3.76,.69]],.042,.04,8,15);
 box(post,'lamp_head_cowl',poleSteel,0,3.71,.70,.34,.12,.47);
 const glass=group(post,'lamp_bulb');
 box(glass,'downward_light_lens',bulb,0,3.635,.70,.285,.042,.382);
 const ground=group(post,'lamp_ground_glow');
 surface(ground,'warm_light_pool',glow,[-3.1,.016,3.8,3.1,.016,3.8,3.1,.016,-2.4,-3.1,.016,-2.4],[0,0,1,0,1,1,0,1],[0,1,2,0,2,3]);
}

export function createInfrastructure(){
 const root=group(null,'farm_transport_and_power');
 truck(root);
 deliveryScooter(root);
 foodParcel(root,'market_food_parcel');
 roads(root);
 energy(root);
 lamp(root);
 return root;
}
