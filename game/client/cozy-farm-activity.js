import {AnimationMixer,Group,LoopOnce,LoopRepeat,MathUtils} from 'three';
import {HOUSE_LEVELS,HOUSE_PLOT} from './cozy-houses.js';
import {COZY_MORNING_HOUR,sameFoodOrder} from './cozy-domain.js';
import {WorkerJobs,workerSites} from './cozy-worker-jobs.js';
import {WorkerRoutes,WIND_PUMP_SITE,WORKER_LODGE_SITE,groundPoint,marketMealStation,worldPoint} from './cozy-worker-routes.js';

/** @typedef {import('three').Object3D} Object3D */
/** @typedef {import('three').AnimationAction} Action */
/** @typedef {import('./cozy-worker-routes.js').Point} Point */
/** @typedef {import('./cozy-worker-routes.js').Waypoint} Waypoint */
/** @typedef {import('./cozy-domain.js').Placement} Placement */
/** @typedef {import('./cozy-domain.js').FoodOrder} FoodOrder */
/** @typedef {import('./cozy-worker-jobs.js').WorkSite} WorkSite */
/** @typedef {import('./cozy-worker-jobs.js').WorkerJob} WorkerJob */
/** @typedef {'wake'|'choose'|'pump_approach'|'fill'|'carry_out'|'carry_to_site'|'deliver'|'tend_site'|'market_stop'|'home_path'|'enter_home'|'sleep'|'meal_grasp'|'meal_lift'|'meal_enter'|'meal_finish'} Step */
/** @typedef {{node:Group,mixer:AnimationMixer,actions:Map<string,Action>,active:string,bucket:Object3D,water:Object3D,pour:Object3D,basket:Object3D,parcel:Object3D,index:number,next:Step,wait:number,path:Waypoint[],speed:number,headingHome:boolean,atDoor:boolean,job:WorkerJob|null}} Worker */
/** @typedef {{worker:Worker,station:ReturnType<typeof marketMealStation>}} MealRun */

const pumpApproach=groundPoint(WIND_PUMP_SITE,1.1,2.65);
const pumpWork=groundPoint(WIND_PUMP_SITE,.78,1.22);
const pumpFacing=worldPoint(WIND_PUMP_SITE,.69,.62);
const HOME_END_HOUR=17;

/** @param {Object3D} root @param {string} name */
function part(root,name){
 const object=root.getObjectByName(name);
 if(!object)throw Error('Missing farm activity part: '+name);
 return object;
}

/** @param {Object3D} node @param {Waypoint} point */
function put(node,point){node.position.set(point.x,point.y,point.z);}

/** @param {Object3D} node @param {Point} point */
function face(node,point){
 const x=point.x-node.position.x,z=point.z-node.position.z;
 if(Math.hypot(x,z)>.02)node.rotation.y=Math.atan2(x,z);
}

/** @param {Worker} worker @param {'none'|'empty'|'water'|'produce'|'meal'} props */
function equip(worker,props){
 worker.bucket.visible=props==='empty'||props==='water';
 worker.water.visible=props==='water';
 worker.basket.visible=props==='produce';
 worker.parcel.visible=props==='meal';
 worker.pour.visible=false;
}

/** @param {Worker} worker @param {string} name */
function play(worker,name){
 if(worker.active===name)return;
 const prior=worker.actions.get(worker.active),action=worker.actions.get(name);
 if(!action)return;
 worker.active=name;
 action.reset().setEffectiveWeight(1).play();
 if(prior)action.crossFadeFrom(prior,.14,false);
}

/** @param {import('./cozy-world.js').CozyWorld} world @param {number} index @returns {Worker} */
function makeWorker(world,index){
 const asset=index%2?'workerWoman':'workerMan',node=world.clone(asset);
 const mixer=new AnimationMixer(node),actions=new Map();
 for(const clip of world.models.get(asset).animations){
  const action=mixer.clipAction(clip),once=['fill','pour','tend','pickup'].includes(clip.name);
  action.setLoop(once?LoopOnce:LoopRepeat,once?1:Infinity);
  action.clampWhenFinished=once;
  actions.set(clip.name,action);
 }
 const parcel=world.template('infrastructure',['market_food_parcel']);
 parcel.position.set(0,-.39,.02);
 parcel.rotation.x=.43;
 part(node,'worker_hand_1').add(parcel);
 const worker={
  node,mixer,actions,active:'',index,next:/** @type {Step} */('choose'),wait:0,path:[],speed:2.15,
  headingHome:false,atDoor:false,job:null,
  bucket:part(node,'water_bucket'),water:part(node,'bucket_water'),pour:part(node,'bucket_pour'),basket:part(node,'market_basket'),parcel,
 };
 node.name='farm_worker_'+(index+1);
 node.visible=false;
 equip(worker,'none');
 return worker;
}

/** @param {import('./cozy-worker-routes.js').Site} site @param {number} level @param {boolean} owned */
function entrance(site,level,owned){
 const model=HOUSE_LEVELS[level-1], [x,y,z]=model.entrance;
 const depth=owned?HOUSE_PLOT.depth:model.dimensions[1];
 return {
  door:groundPoint(site,x,z,y),
  steps:groundPoint(site,x,model.dimensions[1]/2+.18),
  approach:groundPoint(site,x,depth/2+1.05),
 };
}

/** Renderer-only farm work. Layout and farm time come from the saved game. */
export class FarmActivity{
 /** @param {import('./cozy-world.js').CozyWorld} world @param {()=>number} [random] */
 constructor(world,random=Math.random){
  this.world=world;
  this.group=new Group();
  this.group.name='farm_daily_activity';
  this.workers=Array.from({length:4},(_,i)=>makeWorker(world,i));
  this.group.add(...this.workers.map(worker=>worker.node));
  this.windmill=world.clone('windPump');
  put(this.windmill,groundPoint(WIND_PUMP_SITE,0,0));
  this.windmill.rotation.y=WIND_PUMP_SITE.rotation;
  this.rotor=part(this.windmill,'windmill_rotor');
  this.rod=part(this.windmill,'windmill_pump_rod');
  this.stream=part(this.windmill,'windmill_water_stream');
  this.stream.visible=false;
  this.lodge=world.template('house',[HOUSE_LEVELS[0].model]);
  put(this.lodge,groundPoint(WORKER_LODGE_SITE,0,0));
  this.lodge.rotation.y=WORKER_LODGE_SITE.rotation;
  this.group.add(this.windmill,this.lodge);
  world.scene.add(this.group);
  this.home=entrance(WORKER_LODGE_SITE,1,false);
  /** @type {Object3D|null} */this.doors=null;
  this.routes=new WorkerRoutes([],false);
  this.jobs=new WorkerJobs(random);
  this.layoutKey='';
  this.homeKey='';
  /** @type {boolean|null} */this.daylight=null;
  this.report='';
  /** @type {Record<string,number>} */this.completed={};
  /** @type {Record<string,number>} */this.completedSites={};
  this.waterTrips=0;
  /** @type {FoodOrder|null} */this.mealOrder=null;
  /** @type {Placement|undefined} */this.mealMarket=undefined;
  /** @type {MealRun|null} */this.mealRun=null;
  this.mealRetry=0;
 }

 /** @param {number} tick @param {Placement[]} items @param {number} houseLevel @param {FoodOrder|null} [order] */
 sync(tick,items,houseLevel,order=null){
  const house=items.find(item=>item.kind==='house');
  const nextLayout=JSON.stringify(items),nextHome=JSON.stringify([house,houseLevel]);
  const layoutChanged=this.layoutKey!==nextLayout,homeChanged=this.homeKey!==nextHome;
  if(layoutChanged){
   this.layoutKey=nextLayout;
   this.routes=new WorkerRoutes(items,Boolean(house));
   this.jobs.sites=workerSites(items,this.routes);
  }
  if(homeChanged){
   this.homeKey=nextHome;
   this.lodge.visible=!house;
   this.home=house?entrance(house,houseLevel,true):entrance(WORKER_LODGE_SITE,1,false);
   const model=house?this.world.entities.get(house.id):this.lodge;
   this.doors=model?.getObjectByName('house_entry_doors')??null;
  }
  const hour=tick%24,day=hour>=COZY_MORNING_HOUR&&hour<HOME_END_HOUR;
  const first=this.daylight===null,changed=this.daylight!==day;
  this.daylight=day;
  const meal=order?.pickup?order:null;
  const sameMeal=sameFoodOrder(this.mealOrder,meal);
  const restartMeal=layoutChanged||homeChanged||this.mealOrder?.pickup==='carrying'&&meal?.pickup==='requested';
  if(!sameMeal){this.releaseMeal();this.mealRetry=0;}
  this.mealOrder=meal;
  this.mealMarket=meal?items.find(item=>item.id===meal.marketId&&item.kind==='market'):undefined;
  if(first||changed||layoutChanged||homeChanged){
   for(const worker of this.workers)if(worker!==this.mealRun?.worker)worker.job=null;
   const offset=first&&day?Math.floor(this.jobs.random()*this.workers.length):0;
   const roster=[...this.workers.slice(offset),...this.workers.slice(0,offset)];
   for(const worker of roster){
    if(worker===this.mealRun?.worker)continue;
    if(first&&day){
     worker.node.visible=true;
     this.choose(worker,true);
    }
    else if(day&&(changed||!worker.node.visible)){
     worker.node.visible=false;
     this.hold(worker,worker.index*.86,'wake','idle');
    }
    else if(day)this.choose(worker);
    else if(first||!worker.node.visible)this.sleep(worker);
    else this.headHome(worker);
   }
  }
  if(this.mealRun){
   if(restartMeal)this.startMeal(this.mealRun.worker);
   else if(meal?.pickup==='carrying'&&this.mealRun.worker.next==='meal_lift')this.carryMeal(this.mealRun);
  }
  this.audit();
 }

 /** @param {Worker} [current] */
 startMeal(current){
  if(!this.mealOrder||!this.mealMarket)return;
  const station=marketMealStation(this.mealMarket);
  if(this.mealOrder.pickup==='carrying'){
   const worker=current??this.workers.find(entry=>entry.job?.mode!=='water')??this.workers[0];
   worker.node.visible=true;
   worker.job=null;
   worker.headingHome=false;
   worker.atDoor=false;
   put(worker.node,station.counter);
   face(worker.node,station.facing);
   this.mealRun={worker,station};
   this.carryMeal(this.mealRun);
   return;
  }
  const candidates=current?[current]:this.workers;
  const paths=candidates.flatMap(worker=>{
   const inside=!!current||!worker.node.visible||worker.atDoor;
   const start=inside?this.home.approach:worker.node.position;
   const route=this.routes.route(start,station.entry);
   const last=route.at(-1);
   if(!last||Math.hypot(last.x-station.entry.x,last.z-station.entry.z)>.08)return [];
   const length=route.reduce((total,point,i)=>{
    const previous=route[i-1]??start;
    return total+Math.hypot(point.x-previous.x,point.z-previous.z);
   },inside?4:0);
   return [{worker,inside,route,cost:length+(worker.job?.mode==='water'?100:0)}];
  }).sort((a,b)=>a.cost-b.cost);
  const best=paths[0];
  if(!best){this.releaseMeal();return;}
  const {worker,inside,route}=best;
  this.mealRun={worker,station};
  worker.node.visible=true;
  worker.job=null;
  worker.headingHome=false;
  worker.atDoor=inside;
  equip(worker,'none');
  const exit=inside?[this.home.steps,this.home.approach]:[];
  if(inside){put(worker.node,this.home.door);face(worker.node,this.home.approach);}
  this.follow(worker,[...exit,...route,station.porch,station.counter],'meal_grasp','walk',2.7);
 }

 /** @param {MealRun} run */
 carryMeal({worker,station}){
  equip(worker,'meal');
  worker.atDoor=false;
  const route=this.routes.route(station.entry,this.home.approach);
  if(!route.length){this.hold(worker,.8,'meal_lift','idle');return;}
  this.follow(worker,[station.porch,station.entry,...route],'meal_enter','carry',2.65);
 }

 releaseMeal(){
  if(!this.mealRun)return;
  const {worker}=this.mealRun;
  this.mealRun=null;
  this.sleep(worker);
  if(this.daylight)this.hold(worker,.65,'wake','idle');
 }

 /** @param {Worker} worker */
 doorBusy(worker){
  return this.workers.some(other=>other!==worker&&other.node.visible&&other.atDoor&&Math.hypot(other.node.position.x-this.home.door.x,other.node.position.z-this.home.door.z)<1.45);
 }

 /** @param {Worker} worker @param {WorkSite} site */
 placeNearWork(worker,site){
  const {approach,facing}=site;
  const rotation=Math.atan2(approach.x-facing.x,approach.z-facing.z);
  const side=this.jobs.random()<.5?-1:1;
  const origin={...approach,rotation};
  const start=[groundPoint(origin,side*2,4+this.jobs.random()*2),groundPoint(origin,-side*2,3),approach]
   .find(point=>this.routes.clear(point,approach))??approach;
  put(worker.node,start);
  face(worker.node,approach);
 }

 /** @param {Worker} worker @param {boolean} [starting] */
 choose(worker,starting=false){
  worker.headingHome=false;
  worker.atDoor=false;
  const occupied=this.workers.flatMap(other=>other!==worker&&other.node.visible&&other.job?[other.job]:[]);
  const job=this.jobs.assign(occupied,worker.index,worker.job?.site.id);
  worker.job=job;
  if(!job){
   if(starting)put(worker.node,this.home.approach);
   equip(worker,'none');
   this.hold(worker,.8+this.jobs.random()*.75,'choose','idle');
   return;
  }
  if(job.mode==='water'){
   if(starting){
    put(worker.node,pumpWork);
    this.step(worker,'fill');
   }else{
    equip(worker,'empty');
    this.travel(worker,pumpApproach,'pump_approach','carry');
   }
   return;
  }
  if(starting)this.placeNearWork(worker,job.site);
  const market=job.mode==='market';
  equip(worker,market?'produce':'none');
  this.travel(worker,job.site.approach,market?'market_stop':'tend_site',market?'carry':'walk',1.7+this.jobs.random()*.55);
 }

 /** @param {Worker} worker */
 wake(worker){
  worker.node.visible=true;
  put(worker.node,this.home.door);
  face(worker.node,this.home.approach);
  worker.headingHome=false;
  worker.atDoor=true;
  equip(worker,'none');
  this.follow(worker,[this.home.steps,this.home.approach],'choose','walk');
 }

 /** @param {Worker} worker */
 headHome(worker){
  const doorBusy=worker.atDoor;
  worker.headingHome=true;
  worker.atDoor=doorBusy;
  worker.job=null;
  equip(worker,'none');
  if(doorBusy)this.follow(worker,[this.home.door],'sleep','walk',2.3);
  else this.travel(worker,this.home.approach,'enter_home','walk',3.1);
 }

 /** @param {Worker} worker */
 sleep(worker){
  worker.node.visible=false;
  worker.path=[];
  worker.wait=0;
  worker.atDoor=false;
  worker.headingHome=true;
  worker.next='sleep';
  worker.job=null;
  equip(worker,'none');
  put(worker.node,this.home.door);
 }

 /** @param {Worker} worker @param {Point} point @param {Step} next @param {string} clip @param {number} [speed] */
 travel(worker,point,next,clip,speed){
  const waypoints=this.routes.route(worker.node.position,point);
  if(!waypoints.length){
   worker.job=null;
   this.hold(worker,.8,worker.headingHome?'home_path':'choose','idle');
   return;
  }
  if(worker.headingHome){
   let length=0;
   /** @type {Point} */let position=worker.node.position;
   for(const nextPoint of waypoints){
    length+=Math.hypot(nextPoint.x-position.x,nextPoint.z-position.z);
    position=nextPoint;
   }
   speed=Math.max(speed??3.1,length/16);
  }
  this.follow(worker,waypoints,next,clip,speed);
 }

 /** @param {Worker} worker @param {Waypoint[]} points @param {Step} next @param {string} clip @param {number} [speed] */
 follow(worker,points,next,clip,speed=2.15){
  worker.path=points;
  worker.wait=0;
  worker.speed=speed;
  worker.next=next;
  play(worker,clip);
  if(clip==='walk'||clip==='carry')worker.actions.get(clip)?.setEffectiveTimeScale(Math.min(2.25,speed/1.50));
 }

 /** @param {Worker} worker @param {number} seconds @param {Step} next @param {string} clip */
 hold(worker,seconds,next,clip){
  worker.path=[];
  worker.wait=seconds;
  worker.next=next;
  play(worker,clip);
 }

 /** @param {Worker} worker @param {Step} action */
 step(worker,action){
  switch(action){
   case 'wake':
    this.wake(worker);
    break;
   case 'choose':
    this.choose(worker);
    break;
   case 'pump_approach':
    this.follow(worker,[pumpWork],'fill','carry',1.35);
    break;
   case 'fill':
    equip(worker,'empty');
    face(worker.node,pumpFacing);
    this.hold(worker,1.76,'carry_out','fill');
    break;
   case 'carry_out':
    equip(worker,'water');
    this.follow(worker,[pumpApproach],'carry_to_site','carry',1.60);
    break;
   case 'carry_to_site':
    if(worker.job)this.travel(worker,worker.job.site.approach,'deliver','carry');
    break;
   case 'deliver':
    if(worker.job)face(worker.node,worker.job.site.facing);
    this.hold(worker,1.75,'choose','pour');
    this.record(worker.job);
    break;
   case 'tend_site':
    if(worker.job)face(worker.node,worker.job.site.facing);
    this.hold(worker,2.3+this.jobs.random()*2.15,'choose','tend');
    this.record(worker.job);
    break;
   case 'market_stop':
    if(worker.job)face(worker.node,worker.job.site.facing);
    equip(worker,'none');
    this.hold(worker,2.2+this.jobs.random()*1.7,'choose','idle');
    this.record(worker.job);
    break;
   case 'home_path':
    this.headHome(worker);
    break;
   case 'enter_home':
    if(this.doorBusy(worker))this.hold(worker,.45,'enter_home','idle');
    else{
     worker.atDoor=true;
     this.follow(worker,[this.home.steps,this.home.door],'sleep','walk',2.45);
    }
    break;
   case 'meal_grasp':
    worker.atDoor=false;
    if(this.mealRun)face(worker.node,this.mealRun.station.facing);
    this.hold(worker,.82,'meal_lift','pickup');
    break;
   case 'meal_lift':
    if(this.mealOrder?.pickup==='carrying'&&this.mealRun){this.carryMeal(this.mealRun);break;}
    if(this.mealOrder)this.world.options?.onMealProgress?.('carryFood',this.mealOrder);
    if(this.mealOrder?.pickup==='requested')this.hold(worker,.35,'meal_lift','pickup');
    break;
   case 'meal_enter':
    if(this.doorBusy(worker))this.hold(worker,.4,'meal_enter','idle');
    else{
     worker.atDoor=true;
     this.follow(worker,[this.home.steps,this.home.door],'meal_finish','carry',2.1);
    }
    break;
   case 'meal_finish':
    if(this.mealOrder)this.world.options?.onMealProgress?.('finishFood',this.mealOrder);
    if(this.mealRun?.worker===worker)this.hold(worker,.45,'meal_finish','idle');
    break;
   case 'sleep':
    this.sleep(worker);
    break;
  }
 }

 /** @param {Worker} worker @param {number} seconds */
 walk(worker,seconds){
  const position=worker.node.position;
  let remaining=seconds*worker.speed;
  while(worker.path.length&&remaining>0){
   const target=worker.path[0],dx=target.x-position.x,dz=target.z-position.z;
   const length=Math.hypot(dx,target.y-position.y,dz);
   if(length>.02){
    const angle=Math.atan2(dx,dz),current=worker.node.rotation.y;
    const diff=Math.atan2(Math.sin(angle-current),Math.cos(angle-current));
    worker.node.rotation.y+=MathUtils.clamp(diff,-seconds*6.3,seconds*6.3);
   }
   if(length<=remaining){
    remaining-=length;
    put(worker.node,target);
    worker.path.shift();
   }else{
    const ratio=remaining/length;
    position.x+=dx*ratio;
    position.z+=dz*ratio;
    position.y+=(target.y-position.y)*ratio;
    break;
   }
  }
 }

 /** @param {number} delta @param {boolean} reducedMotion */
 update(delta,reducedMotion){
  if(this.daylight===null)return;
  if(this.mealOrder&&!this.mealRun&&(this.mealRetry-=delta)<=0&&this.world.options?.canDeliverFood?.()!==false){
   this.mealRetry=1;
   this.startMeal();
  }
  if(!reducedMotion)this.rotor.rotation.z=(this.rotor.rotation.z+delta*.86)%(Math.PI*2);
  this.rod.position.y=Math.sin(this.rotor.rotation.z)*.095;
  this.stream.visible=false;
  for(const worker of this.workers){
   if(!worker.node.visible){
    if(worker.next==='wake'&&(worker.wait-=delta)<=0)this.step(worker,'wake');
    continue;
   }
   if(!reducedMotion)worker.mixer.update(delta);
   if(worker.active==='fill'&&worker.wait>0){
    this.stream.visible=worker.wait> .22;
    worker.water.visible=worker.wait<.8;
   }
   if(worker.active==='pour'&&worker.wait>0){
    worker.pour.visible=!reducedMotion&&worker.wait<1.10&&worker.wait>.32;
    worker.water.visible=worker.wait>1.10;
   }
   if(worker.path.length){
    if(reducedMotion){put(worker.node,worker.path[worker.path.length-1]);worker.path=[];}
    else this.walk(worker,delta);
    if(worker.path.length)continue;
   }
   worker.wait-=delta;
   if(worker.wait<=0)this.step(worker,worker.next);
  }
  const open=this.workers.some(worker=>worker.node.visible&&worker.atDoor&&Math.hypot(worker.node.position.x-this.home.door.x,worker.node.position.z-this.home.door.z)<2);
  for(const leaf of this.doors?.children??[]){
   const angle=open?leaf.userData.openDirection*1.17:0;
   leaf.rotation.y=reducedMotion?angle:MathUtils.lerp(leaf.rotation.y,angle,Math.min(1,delta*9));
  }
  this.audit();
 }

 /** @param {WorkerJob|null} job */
 record(job){
  if(!job)return;
  const {kind,id}=job.site;
  this.completed[kind]=(this.completed[kind]??0)+1;
  this.completedSites[id]=(this.completedSites[id]??0)+1;
  if(job.mode==='water')this.waterTrips++;
  this.world.host.dataset.workerTrips=JSON.stringify(this.completed);
  this.world.host.dataset.workerSitesVisited=JSON.stringify(this.completedSites);
  this.world.host.dataset.workerWaterTrips=String(this.waterTrips);
 }

 audit(){
  const summary=this.workers.map(worker=>{
   if(!worker.node.visible)return {action:'indoors',destination:'house',mode:null,site:null};
   if(worker===this.mealRun?.worker)return {action:worker.active,destination:worker.parcel.visible?'house':'market',mode:'meal',site:worker.parcel.visible?'house':this.mealOrder?.marketId};
   return {action:worker.active,destination:worker.job?.site.kind??(worker.headingHome||worker.atDoor?'house':'farm'),mode:worker.job?.mode??null,site:worker.job?.site.id??null};
  });
  this.world.host.dataset.mealPickup=this.mealOrder?.pickup??'idle';
  this.world.host.dataset.mealWorker=this.mealRun?String(this.mealRun.worker.index+1):'';
  const encoded=JSON.stringify(summary);
  if(encoded===this.report)return;
  this.report=encoded;
  this.world.host.dataset.workerJobs=encoded;
  this.world.host.dataset.workersAtHome=String(summary.filter(worker=>worker.action==='indoors').length);
 }

 dispose(){
  for(const worker of this.workers){
   worker.mixer.stopAllAction();
   worker.mixer.uncacheRoot(worker.node);
  }
  this.group.removeFromParent();
 }
}
