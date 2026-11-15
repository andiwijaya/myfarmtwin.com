import {M,group,box,round,beam,tube,loftX,loftY,feather,surface,rotation,translation} from './cozy-world-common.mjs';

import {groundRest} from './cozy-world-pose-tools.mjs';

// Indonesian kampung hen: pear-shaped breast, compact back, sloping hackle,
// overlapping primaries, fan tail, scaly shanks and four individually authored
// toes. Animation targets are retained through static-material mesh packing.
export function createChicken({far=false}={}){
 const root=group(null,'chicken');root.userData={forward:'+X',floorPivot:true,species:'Gallus gallus domesticus, kampung hen artistic interpretation',lod:far?'far':'close'};
 const radial=far?16:36,body=group(root,'body');
 loftX(body,'pear_shaped_feathered_torso',M.feather,[[-.3,.37,.008,.008],[-.255,.365,.105,.09],[-.18,.37,.16,.14],[-.07,.365,.185,.175],[.06,.35,.18,.17],[.165,.345,.15,.14],[.23,.365,.105,.105],[.255,.385,.018,.025]],radial);
 const neck=group(root,'neck',[.12,.43,0]);
 loftX(neck,'tapered_rising_hackle',M.hackle,[[.07,.415,.06,.07],[.15,.46,.095,.09],[.215,.52,.08,.065],[.25,.59,.065,.053],[.27,.635,.046,.041]].map(([x,y,...r])=>[x-.12,y-.43,...r]),radial);
 // Individual feathers follow the neck and wing contours rather than forming
 // disconnected spherical parts. Dark primaries remain legible in silhouette.
 for(const side of [-1,1]){
  const wing=group(body,side<0?'wing_left':'wing_right',[.035,.42,side*.135]);
  const count=far?5:10;
  for(let i=0;i<count;i++){const t=i/(count-1);feather(wing,'overlapping_primary_'+i,t>.35?M.tailFeather:M.feather,[.055-t*.07,.018+t*.018,side*.008],[-.26-t*.025,-.08+t*.07,side*(.025+t*.006)],.034,far?5:12);}
  for(let row=0;row<(far?1:3);row++)for(let i=0;i<(far?3:7);i++)feather(wing,'scapular_covert_'+row+'_'+i,M.feather,[.10-i*.028,.045-row*.029,side*.008],[-.035-i*.024,.025-row*.034,side*(.02+row*.007)],.028,far?4:8);
  if(!far)for(let i=0;i<12;i++){const y=.43+(i%4)*.038,x=.11+Math.floor(i/4)*.04;feather(body,'neck_hackle_'+side+'_'+i,M.hackle,[x,y+.04,side*(.062-(i%4)*.007)],[x-.072,y-.035,side*(.092-(i%4)*.01)],.015,7);}
 }
 const tail=group(root,'tail',[-.24,.43,0]);for(let i=0;i<(far?5:9);i++){const t=i/((far?5:9)-1)-.5;feather(tail,'upright_tail_primary_'+i,M.tailFeather,[0,0,t*.045],[-.19-Math.abs(t)*.035,.19-Math.abs(t)*.085,t*.19],.036,far?6:14);}
 const head=group(neck,'head',[.13,.19,0]);
 loftX(head,'tapered_hen_skull',M.hackle,[[-.052,0,.01,.01],[-.025,.02,.06,.047],[.035,.015,.066,.047],[.078,-.006,.045,.035],[.09,-.02,.016,.018]],radial);
 loftX(head,'horn_upper_beak',M.beak,[[.07,-.011,.022,.025],[.095,-.017,.017,.022],[.138,-.026,.003,.003]],far?10:20);
 loftX(head,'horn_lower_beak',M.beak,[[.075,-.035,.01,.02],[.103,-.035,.008,.016],[.13,-.031,.002,.002]],far?10:18);
 // An original low, five-lobed hen comb, kept subdued in relation to the head.
 const cp=[],cu=[],ci=[],profile=[[-.027,.055],[-.022,.078],[-.012,.092],[-.001,.08],[.011,.105],[.023,.081],[.038,.097],[.05,.072],[.062,.078],[.072,.048]];
 for(const z of [-.007,.007])for(let i=0;i<profile.length;i++){cp.push(profile[i][0],profile[i][1],z);cu.push(i/(profile.length-1),(z+.007)/.014);}for(let i=0;i<profile.length-1;i++){ci.push(i,i+profile.length,i+1,i+1,i+profile.length,i+profile.length+1);}for(const side of [-1,1])for(let i=1;i<profile.length-1;i++){const k=side<0?0:profile.length;side<0?ci.push(k,k+i+1,k+i):ci.push(k,k+i,k+i+1);}surface(head,'small_sculpted_hen_comb',M.comb,cp,cu,ci);
 for(const side of [-1,1]){
  round(head,'hen_eye_'+side,M.eye,.042,.021,side*.044,.012,.011,.005,far?10:20);
  round(head,'eye_iris_'+side,M.horn,.043,.022,side*.047,.0065,.0065,.0028,far?8:14);
  round(head,'eye_pupil_'+side,M.eye,.045,.022,side*.049,.0034,.0043,.002,far?8:14);
  if(!far){round(head,'tiny_eye_catchlight_'+side,M.glint,.0465,.025,side*.0505,.0012,.0014,.001,10);tube(head,'upper_eye_lid_'+side,M.comb,[[.029,.025,side*.045],[.039,.034,side*.049],[.054,.027,side*.045]],.0028,.002,6);}
  round(head,'small_wattle_'+side,M.comb,.077,-.05,side*.014,.018,.032,.009,far?12:24);
  round(head,'pale_ear_patch_'+side,M.horn,-.007,-.012,side*.043,.012,.018,.003,far?8:16);
  const leg=group(root,side<0?'leg_left':'leg_right',[.015,.25,side*.084]);
  loftY(leg,'feathered_thigh',M.feather,[[-.11,.02,0,.025,.023],[-.02,-.014,0,.044,.043],[.07,-.025,0,.058,.052],[.11,-.025,0,.03,.03]],far?10:24);
  const shank=group(leg,side<0?'shank_left':'shank_right',[.018,-.08,0]);
  loftY(shank,'tapered_shank',M.shank,[[-.217,.043,0,.014,.013],[-.19,.036,0,.012,.011],[-.12,.024,0,.013,.012],[-.08,.018,0,.018,.017]].map(([y,x,z,rx,rz])=>[y+.08,x-.018,z,rx,rz]),far?8:20);
  const shankPoint=([x,y,z])=>[x-.018,y+.08,z],footPoint=([x,y,z])=>[x-.043,y+.214,z];
  if(!far)for(let i=0;i<9;i++)tube(shank,'scaly_leg_plate_'+i,M.beak,[[.034,-.207+i*.012,-.01],[.049,-.207+i*.012,0],[.034,-.207+i*.012,.01]].map(shankPoint),.0018,.0013,5,4);
  const foot=group(shank,side<0?'foot_left':'foot_right',[.025,-.134,0]);
  for(const [j,dz]of [[0,-.039],[1,0],[2,.039]]){const len=j===1?.108:.083;tube(foot,'forward_toe_'+j,M.shank,[[.043,-.214,0],[.07,-.231,dz*.5],[.043+len,-.239,dz]].map(footPoint),.009,.003,far?5:9);tube(foot,'front_claw_'+j,M.beak,[[.035+len,-.237,dz],[.055+len,-.246,dz],[.062+len,-.248,dz]].map(footPoint),.004,.0007,far?4:7);}
  tube(foot,'rear_toe',M.shank,[[.041,-.215,0],[-.005,-.235,-side*.008],[-.025,-.241,-side*.014]].map(footPoint),.007,.003,far?5:8);
  tube(foot,'rear_claw',M.beak,[[-.018,-.238,-side*.014],[-.035,-.247,-side*.015],[-.038,-.248,-side*.015]].map(footPoint),.0035,.0006,far?4:7);
 }
 const times=[0,.35,.7],animations=[
  {name:'idle',tracks:[rotation('head',[0,1,0],[0,.13,-.09,0],[0,1,2.4,4]),rotation('tail',[1,0,0],[0,.04,-.04,0],[0,1.3,2.8,4]),rotation('wing_left',[1,0,0],[0,-.025,0],[0,2,4])]},
  {name:'walk',tracks:[rotation('leg_left',[0,0,1],[-.32,.32,-.32],times),rotation('leg_right',[0,0,1],[.32,-.32,.32],times),translation('head',[[.13,.19,0],[.155,.177,0],[.13,.19,0]],times)]},
  {name:'eat',tracks:[rotation('neck',[0,0,1],[0,-1.80,-1.68,-1.8,0],[0,.45,.6,.8,1.5]),rotation('head',[0,0,1],[0,.18,.26,.18,0],[0,.45,.6,.8,1.5])]},
  {name:'drink',tracks:[rotation('neck',[0,0,1],[0,-1.85,-1.77,-1.85,-1.66,0],[0,.8,1.2,1.6,2.2,3]),rotation('head',[0,0,1],[0,.25,.17,.25,.16,0],[0,.8,1.2,1.6,2.2,3])]},
  {name:'rest',tracks:[translation('chicken',[[0,0,0],[0,-.123,0],[0,-.123,0],[0,0,0]],[0,1,5,6]),...['left','right'].flatMap(side=>[rotation('leg_'+side,[0,0,1],[0,-1.1,-1.1,0],[0,1,5,6]),rotation('shank_'+side,[0,0,1],[0,2.2,2.2,0],[0,1,5,6]),rotation('foot_'+side,[0,0,1],[0,-1.1,-1.1,0],[0,1,5,6])]),rotation('head',[0,1,0],[0,-.25,-.22,0],[0,1,5,6])]}
 ];groundRest(root,animations);return{root,animations};
}

// Ettawa-inspired dairy goat with a narrow deep torso, distinct hocks/cannon
// bones, sloping pasterns, cloven hooves, roman nose, swept horns and pendulous
// ears. Kid proportions are authored separately from adult scale alone.
export function createGoat({kid=false,far=false}={}){
 const root=group(null,kid?'goat_kid':'goat');root.userData={forward:'+X',floorPivot:true,species:'Capra hircus, Peranakan Etawa inspired artistic interpretation',lifeStage:kid?'kid':'adult',lod:far?'far':'close'};
 const radial=far?16:36,s=kid?.59:1;root.scale.setScalar(s);
 loftX(root,'slender_deep_goat_torso',M.goatCoat,[[-.58,.72,.01,.01],[-.535,.73,.17,.12],[-.44,.71,.255,.19],[-.3,.67,.295,.225],[-.08,.65,.3,.23],[.13,.67,.29,.215],[.3,.72,.26,.18],[.4,.77,.2,.145],[.46,.8,.09,.09]],radial);
 const neck=group(root,'neck',[.32,.78,0]);
 loftX(neck,'rising_goat_neck',M.goatBrown,[[.28,.75,.095,.11],[.38,.82,.18,.135],[.46,.9,.17,.12],[.54,1.0,.15,.105],[.62,1.09,.11,.085],[.65,1.12,.025,.025]].map(([x,y,...r])=>[x-.32,y-.78,...r]),radial);
 // Slight, irregular shoulder marking follows the surface instead of a
 // separate hard-edged sphere; the main coat remains warm cream.
 if(!far)for(let i=0;i<18;i++){const a=i*2.39996,y=.77+Math.cos(a)*.16,z=Math.sin(a)*.15;feather(root,'soft_shoulder_hair_'+i,M.goatMark,[.30,y+.035,z],[.17,y-.04,z*1.12],.018,6);}
 const hp=[.27,.325,0],head=group(neck,'head',hp);if(kid)head.scale.setScalar(1.13);
 loftX(head,'roman_nosed_goat_skull',M.goatBrown,[[-.09,.04,.01,.01],[-.05,.06,.12,.084],[.035,.028,.137,.089],[.12,-.05,.124,.072],[.21,-.14,.095,.055],[.29,-.2,.064,.061],[.33,-.211,.026,.035]],radial);
 loftX(head,'goat_muzzle',M.muzzle,[[.255,-.192,.035,.048],[.292,-.215,.043,.062],[.338,-.22,.033,.054],[.354,-.221,.008,.02]],far?12:24);
 tube(head,'muzzle_lip',M.dark,[[.303,-.248,-.04],[.34,-.25,0],[.303,-.248,.04]],.0035,.0025,far?5:8);
 for(const side of [-1,1]){
  round(head,'nostril_'+side,M.dark,.327,-.205,side*.043,.014,.009,.008,far?8:16);
  round(head,'goat_eye_'+side,M.eye,.036,.032,side*.088,.025,.018,.009,far?10:22);
  round(head,'amber_iris_'+side,M.horn,.042,.032,side*.094,.012,.010,.003,far?8:18);
  box(head,'horizontal_goat_pupil_'+side,M.eye,.044,.032,side*.097,.013,.004,.002);
  if(!far){round(head,'eye_catchlight_'+side,M.glint,.049,.036,side*.099,.0025,.0026,.001,10);tube(head,'goat_upper_lid_'+side,M.goatBrown,[[.009,.044,side*.088],[.036,.056,side*.092],[.063,.044,side*.086]],.005,.003,8);}
  const ear=group(head,side<0?'ear_left':'ear_right',[-.025,.075,side*.07]);
  // The ear is a rounded 3D loft, tapered and bent down, rather than a card.
  const earSections=[[-.005,0,0,.012,.012],[-.045,-.017,side*.065,.043,.022],[-.115,-.005,side*.11,.047,.027],[-.2,.015,side*.125,.038,.02],[-.25,.033,side*.127,.015,.012],[-.26,.04,side*.123,.002,.002]];
  loftY(ear,'pendulous_ear_shell',M.goatBrown,[...earSections].reverse(),far?10:26);
  loftY(ear,'warm_ear_inner',M.pink,earSections.slice(1,-1).reverse().map(([y,x,z,rx,rz])=>[y,x+.012,z,rx*.58,rz*.86]),far?8:18);
  const hornLength=kid?.16:1;
  tube(head,'swept_back_horn_'+side,M.horn,[[-.035,.145,side*.055],[-.1,.145+.11*hornLength,side*.075],[-.21,.145+.17*hornLength,side*.09],[-.28,.145+.14*hornLength,side*.115]],kid?.018:.031,.0025,far?7:14);
  if(!far&&!kid)for(let i=0;i<7;i++){const t=i/8;round(head,'horn_growth_ridge_'+side+'_'+i,M.horn,-.045-t*.22,.157+Math.sin(t*Math.PI)*.13,side*(.057+t*.045),.026*(1-t*.7),.008,.025*(1-t*.7),12);}
 }
 if(!kid)for(let i=0;i<(far?5:17);i++){const a=i*2.4;feather(head,'goatee_fiber_'+i,M.goatBrown,[.14+Math.cos(a)*.028,-.15,Math.sin(a)*.03],[.14+Math.cos(a)*.032,-.30-(i%4)*.012,Math.sin(a)*.035],.009,far?4:8);}
 for(const [x,z,label]of [[.32,-.135,'front_left'],[.32,.135,'front_right'],[-.43,-.15,'rear_left'],[-.43,.15,'rear_right']]){
  const rear=x<0,leg=group(root,'leg_'+label,[x,.57,z]),legMat=rear?M.goatCoat:M.goatBrown;
  const sections=rear?[[-.49,.025,0,.027,.029],[-.42,.01,0,.023,.026],[-.32,-.042,0,.023,.026],[-.21,-.075,0,.035,.033],[-.14,-.075,0,.043,.045],[-.035,-.006,0,.06,.069],[.095,.036,0,.082,.085],[.21,.012,0,.09,.09],[.27,-.01,0,.055,.065]]:[[-.49,.022,0,.027,.029],[-.43,.006,0,.022,.025],[-.31,-.012,0,.021,.024],[-.21,-.011,0,.029,.028],[-.16,.002,0,.039,.035],[-.05,-.01,0,.044,.046],[.08,-.03,0,.065,.061],[.22,-.05,0,.083,.07],[.28,-.06,0,.05,.055]];
  const kneeX=rear?-.075:-.011,lower=group(leg,'lower_'+label,[kneeX,-.2,0]);
  loftY(leg,'anatomical_upper_goat_limb',legMat,sections.filter(section=>section[0]>=-.21),far?10:24);
  loftY(lower,'anatomical_lower_goat_limb',legMat,sections.filter(section=>section[0]<=-.16).map(([y,x,z,rx,rz])=>[y+.2,x-kneeX,z,rx,rz]),far?10:24);
  const foot=group(lower,'foot_'+label,[(rear?.025:.022)-kneeX,-.29,0]);
  for(const side of [-1,1]){
   // Beveled, split horn toe, narrow at the pastern and broad on the ground.
   loftY(foot,'cloven_hoof_'+side,M.hoof,[[-.569,.038,side*.021,.045,.017],[-.56,.041,side*.021,.049,.019],[-.516,.023,side*.019,.039,.018],[-.49,.015,side*.017,.024,.014]].map(([y,x,z,rx,rz])=>[y+.49,x-(rear?.025:.022),z,rx,rz]),far?8:20);
   if(!far)round(lower,'small_dewclaw_'+side,M.hoof,-.025-kneeX,-.255,side*.022,.01,.016,.01,10);
  }
 }
 const tail=group(root,'tail',[-.52,.86,0]);loftX(tail,'short_upright_goat_tail',M.goatCoat,[[-.135,.216,.002,.002],[-.12,.2,.012,.012],[-.11,.15,.031,.027],[-.06,.065,.041,.035],[0,0,.038,.037]],far?10:24);
 for(let i=0;i<(far?4:10);i++)feather(tail,'tail_hair_'+i,M.goatBrown,[-.1,.14,(i-4)*.004],[-.16+(i%3)*.008,.21+(i%4)*.009,(i-4)*.007],.008,far?4:7);
 if(!kid){round(root,'small_dairy_udder',M.pink,-.32,.43,0,.09,.075,.085,far?12:24);for(const side of [-1,1])beam(root,'teat_'+side,M.pink,[-.32,.40,side*.046],[-.32,.345,side*.05],.014,far?6:12,.008);}
 const t=[0,.45,.9],animations=[
  {name:'idle',tracks:[rotation('head',[0,0,1],[0,.018,-.016,0],[0,1.6,3.3,5]),rotation('tail',[1,0,0],[0,.2,-.15,0],[0,1.7,3.7,5]),rotation('ear_left',[0,0,1],[0,.08,0],[0,2.4,5])]},
  {name:'walk',tracks:['front_left','front_right','rear_left','rear_right'].map((name,i)=>rotation('leg_'+name,[0,0,1],[i===0||i===3?-.25:.25,i===0||i===3?.25:-.25,i===0||i===3?-.25:.25],t))},
  {name:'eat',tracks:[rotation('neck',[0,0,1],[0,-1.05,-1.0,-1.05,0],[0,.8,1.5,2.2,3]),rotation('head',[0,0,1],[0,-.12,-.16,-.12,0],[0,.8,1.5,2.2,3]),rotation('tail',[1,0,0],[0,.12,0],[0,1.5,3])]},
  {name:'drink',tracks:[rotation('neck',[0,0,1],[0,-1.15,-1.10,-1.15,-1.1,0],[0,.8,1.2,1.6,2.2,3]),rotation('head',[0,0,1],[0,-.05,-.08,-.05,-.03,0],[0,.8,1.2,1.6,2.2,3])]},
  {name:'rest',tracks:[translation(root.name,[[0,0,0],[0,-.315*s,0],[0,-.315*s,0],[0,0,0]],[0,1,5,6]),...['front_left','front_right','rear_left','rear_right'].flatMap(label=>{const rear=label.startsWith('rear'),upper=rear?1.2:-1.3,lower=rear?-3:2.3,foot=-(upper+lower);return[rotation('leg_'+label,[0,0,1],[0,upper,upper,0],[0,1,5,6]),rotation('lower_'+label,[0,0,1],[0,lower,lower,0],[0,1,5,6]),rotation('foot_'+label,[0,0,1],[0,foot,foot,0],[0,1,5,6])];}),rotation('neck',[0,0,1],[0,-.15,-.15,0],[0,1,5,6])]}
 ];groundRest(root,animations);return{root,animations};
}

function fin(parent,name,mat,outline,{rays=10,far=false}={}){
 const p=[],uv=[],idx=[];for(let i=0;i<outline.length;i++){p.push(...outline[i]);uv.push(i/(outline.length-1),i%2);}for(let i=1;i<outline.length-1;i++)idx.push(0,i,i+1,0,i+1,i);surface(parent,name,mat,p,uv,idx);
 if(!far){const start=outline[0],end=outline.at(-1);for(let i=1;i<Math.min(rays,outline.length-1);i++)tube(parent,name+'_ray_'+i,M.finRay,[start,outline[i]],.0015,.0007,5,3);}
}
export function createFish({far=false}={}){
 const root=group(null,'fish');root.userData={forward:'+X',floorPivot:true,species:'Oreochromis niloticus, Nile tilapia artistic interpretation',lod:far?'far':'close'};
 loftX(root,'laterally_compressed_tilapia_body',M.fish,[[-.165,.105,.009,.009],[-.135,.107,.035,.024],[-.085,.11,.069,.038],[-.025,.112,.082,.045],[.035,.109,.079,.047],[.09,.108,.065,.043],[.135,.108,.05,.035],[.167,.106,.026,.025],[.18,.106,.008,.012]],far?16:40);
 const tail=group(root,'tail',[-.15,.107,0]);
 fin(tail,'rounded_fan_caudal_fin',M.fishFin,[[0,0,0],[-.043,.056,0],[-.086,.068,0],[-.096,.05,0],[-.105,.022,0],[-.105,0,0],[-.1,-.027,0],[-.092,-.05,0],[-.078,-.061,0],[-.04,-.047,0]],{far,rays:10});
 // Low anterior spines and a higher rounded soft dorsal are species cues.
 const dorsal=[[-.10,.158,0],[-.11,.194,0],[-.094,.186,0],[-.078,.213,0],[-.06,.20,0],[-.042,.226,0],[-.024,.211,0],[-.005,.237,0],[.018,.223,0],[.047,.225,0],[.075,.20,0],[.095,.162,0],[.025,.179,0]];
 fin(root,'spiny_dorsal_fin',M.fishFin,dorsal,{far,rays:13});
 fin(root,'anal_fin',M.fishFin,[[-.09,.067,0],[-.104,.025,0],[-.07,.015,0],[-.035,.01,0],[0,.02,0],[.026,.035,0],[.047,.048,0]],{far,rays:7});
 for(const side of [-1,1]){
  round(root,'tilapia_eye_'+side,M.eye,.132,.126,side*.033,.013,.013,.005,far?10:24);
  round(root,'gold_iris_'+side,M.horn,.135,.127,side*.037,.008,.008,.002,far?8:16);
  round(root,'dark_pupil_'+side,M.eye,.136,.127,side*.039,.0045,.005,.001,far?8:14);
  if(!far){round(root,'fish_eye_glint_'+side,M.glint,.139,.131,side*.04,.0018,.0018,.001,8);tube(root,'gill_operculum_edge_'+side,M.finRay,[[.092,.159,side*.025],[.067,.139,side*.041],[.065,.101,side*.048],[.082,.07,side*.031]],.0025,.0014,6);tube(root,'lateral_line_'+side,M.finRay,[[-.12,.117,side*.026],[-.04,.122,side*.045],[.035,.12,side*.048],[.079,.126,side*.04]],.0009,.0005,5);}
  const pectoral=group(root,side<0?'fin_left':'fin_right',[.063,.095,side*.04]);
  fin(pectoral,'rounded_pectoral_fin',M.fishFin,[[0,0,0],[-.016,-.02,side*.025],[-.04,-.025,side*.045],[-.062,-.009,side*.045],[-.05,.007,side*.034],[-.025,.012,side*.015]],{far,rays:6});
 }
 tube(root,'small_tilapia_mouth',M.muzzle,[[.175,.102,-.014],[.182,.1,0],[.175,.102,.014]],.0018,.0012,far?4:6);
 const animations=[{name:'idle',tracks:[rotation('tail',[0,1,0],[0,.12,-.12,0],[0,.65,1.3,2]),rotation('fin_left',[1,0,0],[0,.2,0],[0,1,2]),rotation('fin_right',[1,0,0],[0,-.2,0],[0,1,2])]},
  {name:'swim',tracks:[rotation('tail',[0,1,0],[-.3,.3,-.3],[0,.32,.64]),rotation('fin_left',[1,0,0],[-.1,.25,-.1],[0,.32,.64]),rotation('fin_right',[1,0,0],[.1,-.25,.1],[0,.32,.64])]}];
 return{root,animations};
}
