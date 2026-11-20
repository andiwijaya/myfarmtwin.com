import {M,beam,box,blade,group,lathe,loftY,material,rotation,round,surface,translation,tube} from './cozy-world-common.mjs';

const skin=[material('Sun-browned complexion',0x9f6d4c),material('Warm brown complexion',0xb37d5d)];
const shirts=[
 material('Faded indigo work cotton',0x4b6471,{texture:11,roughness:.94}),
 material('Terracotta-red work cotton',0x97574d,{texture:11,roughness:.95}),
];
const trousers=[
 material('Olive cotton work trousers',0x67674d,{roughness:.97}),
 material('Charcoal canvas trousers',0x515957,{roughness:.97}),
];
const scarf=material('Dusty cream field headscarf',0xc1aa87,{roughness:.98});
const hair=material('Dark brown hair',0x332823,{roughness:.9});
const boot=material('Weathered black rubber boots',0x484943,{roughness:.8});
const brim=material('Warm plaited bamboo caping',0xccac6a,{texture:5,roughness:.93,double:true});
const metal=material('Weathered zinc water bucket',0x8b9993,{roughness:.57,metalness:.32,double:true});

function makeBucket(parent){
 const bucket=group(parent,'water_bucket',[0,-.095,.015]);
 lathe(bucket,'galvanized_pail',metal,[[0,-.195],[.081,-.195],[.102,-.18],[.135,-.01],[.141,0],[.127,0],[.119,-.019],[.087,-.163],[0,-.164]],18);
 const handle=[];
 for(let i=0;i<=10;i++){
  const a=i*Math.PI/10;
  handle.push([Math.cos(a)*.126,Math.sin(a)*.115-.012,0]);
 }
 tube(bucket,'curved_bail_handle',M.steel,handle,.008,.008,5,14);
 const water=group(bucket,'bucket_water');
 lathe(water,'water_surface',M.water,[[0,-.053],[.117,-.053],[.117,-.057],[0,-.057]],18);
 const pouring=group(bucket,'bucket_pour');
 tube(pouring,'pouring_water',M.water,[[0,-.015,.128],[0,-.115,.175],[0,-.36,.21]],.028,.015,7,12);
 return bucket;
}

function makeBasket(parent){
 const basket=group(parent,'market_basket',[0,-.12,.02]);
 lathe(basket,'woven_produce_basket',M.bamboo,[[0,-.14],[.114,-.14],[.163,-.108],[.197,.014],[.18,.018],[.17,-.01],[.12,-.11],[0,-.11]],18);
 tube(basket,'woven_carry_handle',M.timber,[[-.176,0,0],[-.115,.115,0],[0,.147,0],[.115,.115,0],[.176,0,0]],.017,.017,6,14);
 for(let i=0;i<5;i++)round(basket,'market_tomato',i===0?M.green:M.red,(i%3-1)*.083,-.025,Math.floor(i/3)*.115-.06,.052,.045,.052,10);
 return basket;
}

function makeHead(parent,isWoman,mat){
 const head=group(parent,'worker_head',[0,.575,0]);
 if(isWoman){
  round(head,'wrapped_headscarf',scarf,0,.072,-.021,.109,.135,.098,16);
  round(head,'headscarf_collar',scarf,0,-.029,-.009,.116,.072,.104,14);
 }else round(head,'cropped_hair',hair,0,.105,-.025,.098,.115,.083,16);
 round(head,'oval_face',mat,0,.067,.021,.083,.112,.077,17);
 round(head,'nose',mat,0,.066,.094,.020,.029,.023,10);
 box(head,'closed_lips',hair,0,.032,.088,.037,.006,.008);
 for(const side of [-1,1]){
  if(!isWoman)round(head,'ear',mat,side*.084,.071,-.002,.015,.028,.019,9);
  round(head,'eye',M.eye,side*.033,.087,.084,.010,.006,.007,8);
  box(head,'brow',hair,side*.033,.101,.083,.026,.005,.009);
 }
 const cap=group(head,'woven_farm_hat',[0,.161,-.01]);
 cap.rotation.x=isWoman?.10:-.04;
 loftY(cap,'conical_bamboo_caping',brim,[[0,0,0,.19,.181],[.017,0,0,.183,.178],[.055,0,0,.125,.124],[.115,0,0,.047,.049],[.145,0,0,.013,.015]],26);
 const rim=[];
 for(let i=0;i<=24;i++){
  const a=i*Math.PI/12;rim.push([Math.cos(a)*.188,.009,Math.sin(a)*.18]);
 }
 tube(cap,'bound_hat_brim',M.timber,rim,.006,.006,5,28);
 return head;
}

export function createWorker(isWoman){
 const index=Number(isWoman),mat=skin[index],shirt=shirts[index],pants=trousers[index];
 const root=group(null,isWoman?'farm_worker_woman':'farm_worker_man');
 const hips=group(root,'worker_hips',[0,.91,0]);
 const spine=group(hips,'worker_spine');
 const width=isWoman?.173:.194;
 loftY(spine,'cotton_work_shirt',shirt,[[0,0,0,width*.91,.11],[.12,0,0,width*.78,.099],[.27,0,0,width*.9,.11],[.43,0,0,width,.106],[.51,0,0,.094,.086]],18);
 round(spine,'neck',mat,0,.538,0,.055,.074,.059,13);
 box(spine,'shirt_placket',shirt,0,.245,.116,.022,.42,.021);
 for(let i=0;i<4;i++)round(spine,'shirt_button',M.plaster,0,.106+i*.09,.128,.009,.009,.005,7);
 box(spine,'workwear_chest_pocket',shirt,-.091,.33,.111,.083,.083,.015);
 box(spine,'pocket_flap',shirt,-.091,.372,.122,.09,.021,.022);
 const head=makeHead(spine,isWoman,mat);
 const legs=[],knees=[],arms=[],elbows=[];
 let bucket;
 for(const side of [-1,1]){
  const leg=group(hips,'worker_leg_'+side,[side*.091,-.056,0]);
  const knee=group(leg,'worker_knee_'+side,[0,-.405,0]);
  loftY(leg,'upper_trouser_leg',pants,[[-.417,0,0,.056,.056],[-.26,0,0,.068,.072],[-.1,0,0,.085,.082],[0,0,0,.086,.084]],14);
  loftY(knee,'lower_trouser_leg',pants,[[-.29,0,0,.05,.053],[-.21,0,0,.054,.057],[-.1,0,0,.062,.065],[0,0,0,.06,.06]],13);
  loftY(knee,'rubber_boot_shaft',boot,[[-.399,0,0,.051,.063],[-.255,0,0,.060,.061]],13);
  round(knee,'rubber_boot_vamp',boot,0,-.382,.043,.063,.059,.115,12);
  box(knee,'rubber_boot_tread',boot,0,-.437,.045,.117,.023,.201);
  legs.push(leg);knees.push(knee);

  const arm=group(spine,'worker_arm_'+side,[width*.94*side,.414,0]);
  const elbow=group(arm,'worker_elbow_'+side,[side*.024,-.245,0]);
  loftY(arm,'upper_work_sleeve',shirt,[[-.256,side*.021,0,.047,.05],[-.13,side*.017,0,.056,.055],[0,0,0,.068,.061],[.07,0,0,.044,.039]],14);
  loftY(elbow,'sleeve_and_cuff',shirt,[[-.212,0,0,.034,.036],[-.069,0,0,.043,.045],[0,0,0,.05,.049]],13);
  const hand=group(elbow,'worker_hand_'+side,[0,-.23,0]);
  round(hand,'closed_hand',mat,0,-.037,.005,.034,.052,.027,11);
  round(hand,'thumb',mat,-side*.026,-.018,.018,.015,.027,.016,9);
  if(side===1){bucket=makeBucket(hand);makeBasket(hand);}
  arms.push(arm);elbows.push(elbow);
 }
 const axis=[1,0,0],gait=[0,.25,.5,.75,1],work=[0,.32,.78,1.28,1.72];
 const swing=(node,angles,times=gait)=>rotation(node.name,axis,angles,times);
 const upright=[0,0,0,0,0];
 function gaitTracks(carry){
  return [
   swing(legs[0],[-.38,0,.38,0,-.38]),swing(legs[1],[.38,0,-.38,0,.38]),
   swing(knees[0],[.13,.07,.24,.57,.13]),swing(knees[1],[.24,.57,.13,.07,.24]),
   swing(arms[0],[.31,.05,-.32,-.05,.31]),swing(arms[1],carry?[-.21,-.19,-.23,-.2,-.21]:[-.32,-.05,.31,.05,-.32]),
   swing(elbows[0],[-.1,-.16,-.2,-.14,-.1]),swing(elbows[1],carry?[-.26,-.27,-.31,-.28,-.26]:[-.21,-.13,-.08,-.14,-.21]),
   swing(spine,[.025,.05,.025,.05,.025]),swing(head,upright),
   translation(hips.name,[.91,.936,.91,.936,.91].map(y=>[0,y,0]),gait),
   swing(bucket,carry?[.45,.45,.48,.47,.45]:upright),
  ];
 }
 const task=(name,body,arm,forearm,pail)=>({name,tracks:[
  swing(spine,body,work),swing(arms[1],arm,work),swing(elbows[1],forearm,work),swing(bucket,pail,work),
  swing(legs[0],upright,work),swing(legs[1],upright,work),swing(knees[0],upright,work),swing(knees[1],upright,work),
  swing(arms[0],[0,.10,.07,.05,0],work),swing(elbows[0],upright,work),
  translation(hips.name,[.91,.89,.875,.89,.91].map(y=>[0,y,0]),work),
 ]});
 const animations=[
  {name:'walk',tracks:gaitTracks(false)},
  {name:'carry',tracks:gaitTracks(true)},
  {name:'idle',tracks:[swing(spine,[.01,.027,.01],[0,1.25,2.5]),swing(head,[0,-.025,0],[0,1.25,2.5])]},
  task('fill',[.02,.30,.43,.29,.02],[-.21,-.5,-.72,-.50,-.21],[-.22,-.49,-.52,-.37,-.25],[.43,.32,.55,.40,.44]),
  task('pour',[.02,.18,.28,.16,.02],[-.21,-.62,-1.03,-.68,-.21],[-.25,-.38,-.42,-.34,-.25],[.43,-.12,-1.21,-.74,.43]),
  task('tend',[.02,.19,.31,.20,.02],[-.09,-.47,-.34,-.48,-.09],[-.10,-.37,-.29,-.40,-.10],upright),
 ];
 return {root,animations};
}

const towerSteel=material('Weathered galvanized wind pump steel',0x94a09a,{roughness:.71,metalness:.27,double:true});
const sail=material('Pale galvanized windmill sails',0xc3c7b8,{roughness:.63,metalness:.32,double:true});
const painted=material('Dark green cast iron water pump',0x4d6861,{roughness:.7,metalness:.24});

export function createWindPump(){
 const root=group(null,'farm_wind_pump');
 box(root,'concrete_windmill_footing',M.plaster,0,.08,0,2.05,.16,1.85);
 for(const x of [-1,1])for(const z of [-1,1]){
  beam(root,'windmill_tapered_angle_leg',towerSteel,[x*.76,.12,z*.65],[x*.19,4.64,z*.17],.041,6);
  box(root,'anchored_steel_shoe',painted,x*.76,.17,z*.65,.20,.13,.19);
 }
 for(let stage=0;stage<4;stage++){
  const y=.41+stage*1.04,top=y+.99,w=.73-stage*.135,d=.64-stage*.122,small=w-.118,shallow=d-.105;
  for(const side of [-1,1]){
   beam(root,'wind_tower_crossbrace',towerSteel,[-w,y,side*d],[small,top,side*shallow],.024,5);
   beam(root,'wind_tower_crossbrace',towerSteel,[w,y,side*d],[-small,top,side*shallow],.024,5);
   beam(root,'wind_tower_crossbrace',towerSteel,[side*w,y,-d],[side*small,top,shallow],.024,5);
   beam(root,'wind_tower_landing_rail',towerSteel,[-w,y,side*d],[w,y,side*d],.028,6);
  }
 }
 box(root,'gearbox',painted,0,4.71,0,.41,.37,.43);
 const rotor=group(root,'windmill_rotor',[0,4.76,.29]);
 round(rotor,'wheel_hub',painted,0,0,.039,.165,.165,.092,15);
 for(let i=0;i<14;i++){
  const blade=group(rotor,'curved_wind_sail');
  blade.rotation.z=i*Math.PI/7;
  beam(blade,'radial_wheel_spoke',towerSteel,[0,.09,0],[0,1.29,0],.019,5);
  surface(blade,'sheet_metal_sail',sail,[-.071,.54,.012,.104,.58,.083,.195,1.29,.025,-.132,1.31,-.09],[0,0,1,0,1,1,0,1],[0,1,2,0,2,3]);
  beam(blade,'reinforced_sail_outer_edge',sail,[-.132,1.31,-.085],[.195,1.29,.028],.013,5);
  for(const piece of [...blade.children])rotor.attach(piece);
  blade.removeFromParent();
 }
 const tail=group(root,'wind_vane_tail',[0,4.76,-.24]);
 beam(tail,'tail_boom',towerSteel,[0,0,0],[0,.02,-1.59],.035,6);
 surface(tail,'wind_vane',sail,[0,-.12,-.87,0,-.24,-1.81,0,.52,-1.77,0,.26,-.99],[0,0,1,0,1,1,0,1],[0,1,2,0,2,3]);
 const rod=group(root,'windmill_pump_rod');
 beam(rod,'vertical_sucker_rod',M.steel,[0,.81,0],[0,4.59,.015],.025,6);
 lathe(root,'cast_iron_pump_cylinder',painted,[[.22,.16],[.23,.25],[.17,.32],[.13,.83],[.19,.89],[.12,.96]],16);
 tube(root,'draw_off_pipe',painted,[[0,.72,.03],[.25,.73,.13],[.54,.79,.46],[.69,.77,.62],[.71,.65,.64]],.056,.045,8,14);
 const stream=group(root,'windmill_water_stream');
 beam(stream,'draw_off_water',M.water,[.71,.652,.64],[.72,.428,.66],.022,7,.017);
 box(root,'water_collection_basin',M.plaster,.88,.21,.60,.69,.42,.63);
 box(root,'water_in_stone_basin',M.water,.88,.424,.60,.55,.012,.48);
 for(let i=0;i<3;i++)blade(root,'grass_at_windmill_footing',M.leaf,[.86,.01,-.78],[.91+i*.13,.17+i*.04,-.88],.021,.04,5);
 return root;
}
