import {AnimationMixer,Group,LoopOnce,LoopRepeat,MathUtils} from 'three';
import {HOUSE_LEVELS,HOUSE_PLOT} from './cozy-houses.js';
import {COZY_BUILD_CATALOG} from './cozy-placement.js';
import {WorkerRoutes,WIND_PUMP_SITE,WORKER_LODGE_SITE,groundPoint,worldPoint} from './cozy-worker-routes.js';

/** @typedef {import('three').Object3D} Object3D */
/** @typedef {import('three').AnimationAction} Action */
/** @typedef {import('./cozy-worker-routes.js').Point} Point */
/** @typedef {import('./cozy-worker-routes.js').Waypoint} Waypoint */
/** @typedef {import('./cozy-domain.js').Placement} Placement */
/** @typedef {'field'|'livestock'|'pond'|'market'} WorkerRole */
/** @typedef {'wake'|'choose'|'pump_queue'|'pump_slot'|'fill'|'carry_out'|'deliver'|'market_stop'|'home_path'|'enter_home'|'sleep'} Step */
/** @typedef {{kind:string,approach:Waypoint,facing:Point}} Destination */
/** @typedef {{node:Group,mixer:AnimationMixer,actions:Map<string,Action>,active:string,bucket:Object3D,water:Object3D,pour:Object3D,basket:Object3D,role:WorkerRole,index:number,workCount:number,next:Step,wait:number,path:Waypoint[],speed:number,headingHome:boolean,atDoor:boolean,destination:Destination|null}} Worker */

const pumpWork=groundPoint(WIND_PUMP_SITE,.78,1.22);
const pumpFacing=worldPoint(WIND_PUMP_SITE,.69,.62);
const HOME_START_HOUR=6,HOME_END_HOUR=17;

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

/** @param {Worker} worker @param {'none'|'empty'|'water'|'produce'} props */
function equip(worker,props){
 worker.bucket.visible=props==='empty'||props==='water';
 worker.water.visible=props==='water';
 worker.basket.visible=props==='produce';
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

/** @param {import('./cozy-world.js').CozyWorld} world @param {WorkerRole} role @param {number} index @returns {Worker} */
function makeWorker(world,role,index){
 const asset=index%2?'workerWoman':'workerMan',node=world.clone(asset);
 const mixer=new AnimationMixer(node),actions=new Map();
 for(const clip of world.models.get(asset).animations){
  const action=mixer.clipAction(clip),once=clip.name==='fill'||clip.name==='pour';
  action.setLoop(once?LoopOnce:LoopRepeat,once?1:Infinity);
  action.clampWhenFinished=once;
  actions.set(clip.name,action);
 }
 const worker={
  node,mixer,actions,active:'',role,index,workCount:0,next:/** @type {Step} */('choose'),wait:0,path:[],speed:2.15,
  headingHome:false,atDoor:false,destination:null,
  bucket:part(node,'water_bucket'),water:part(node,'bucket_water'),pour:part(node,'bucket_pour'),basket:part(node,'market_basket'),
 };
 node.name='farm_worker_'+(index+1);
 node.visible=false;
 equip(worker,'none');
 return worker;
}

/** @param {Placement} item @param {number} [x] @param {number} [extra] @returns {Destination} */
function destination(item,x=0,extra=1.35){
 const depth=COZY_BUILD_CATALOG[item.kind].depth/2;
 return {kind:item.kind==='bed'?'field':item.kind,approach:groundPoint(item,x,depth+extra),facing:worldPoint(item,x,depth*.7)};
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
 /** @param {import('./cozy-world.js').CozyWorld} world */
 constructor(world){
  this.world=world;
  this.group=new Group();
  this.group.name='farm_daily_activity';
  /** @type {WorkerRole[]} */
  const roles=['field','livestock','pond','market'];
  this.workers=roles.map((role,i)=>makeWorker(world,role,i));
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
  /** @type {Placement[]} */this.items=[];
  this.routes=new WorkerRoutes([],false);
  this.layoutKey='';
  this.homeKey='';
  /** @type {boolean|null} */this.daylight=null;
  /** @type {Worker|null} */this.pumpWorker=null;
  this.report='';
  /** @type {Record<string,number>} */this.completed={};
 }

 /** @param {number} tick @param {Placement[]} items @param {number} houseLevel */
 sync(tick,items,houseLevel){
  const house=items.find(item=>item.kind==='house');
  const nextLayout=JSON.stringify(items),nextHome=JSON.stringify([house,houseLevel]);
  const layoutChanged=this.layoutKey!==nextLayout,homeChanged=this.homeKey!==nextHome;
  if(layoutChanged){
   this.layoutKey=nextLayout;
   this.items=items;
   this.routes=new WorkerRoutes(items,Boolean(house));
  }
  if(homeChanged){
   this.homeKey=nextHome;
   this.lodge.visible=!house;
   this.home=house?entrance(house,houseLevel,true):entrance(WORKER_LODGE_SITE,1,false);
   const model=house?this.world.entities.get(house.id):this.lodge;
   this.doors=model?.getObjectByName('house_entry_doors')??null;
  }
  const hour=tick%24,day=hour>=HOME_START_HOUR&&hour<HOME_END_HOUR;
  const first=this.daylight===null,changed=this.daylight!==day;
  this.daylight=day;
  if(first||changed||layoutChanged||homeChanged){
   this.pumpWorker=null;
   for(const worker of this.workers){
    if(first&&day)this.startDayAtWork(worker);
    else if(day&&(changed||!worker.node.visible)){
     worker.node.visible=false;
     this.hold(worker,worker.index*.86,'wake','idle');
    }
    else if(day)this.choose(worker);
    else if(first||!worker.node.visible)this.sleep(worker);
    else this.headHome(worker);
   }
  }
  this.audit();
 }

 /** @param {Worker} worker */
 chooseTarget(worker){
  const bedSites=this.items.filter(item=>item.kind==='bed').sort((a,b)=>a.z-b.z||a.x-b.x);
  const beds=bedSites.slice(0,6);
  const field=destination(beds[(worker.workCount+worker.index)%beds.length]);
  if(worker.role==='market'&&worker.workCount%2===0){
   const market=this.items.find(item=>item.kind==='market');
   return market?destination(market,.19):field;
  }
  if(worker.role==='pond'){
   const fish=this.items.find(item=>item.kind==='pond');
   return fish?destination(fish,2.35):field;
  }
  if(worker.role==='livestock'){
   const enclosures=this.items.filter(item=>['coop','goatShelter','barn'].includes(item.kind));
   if(enclosures.length)return destination(enclosures[worker.workCount%enclosures.length],1.58);
  }
  // The row next to the north path leaves room for the worker to stand beside a bed.
  const edge=beds[(worker.workCount+worker.index)%beds.length];
  return {kind:'field',approach:groundPoint(edge,0,-2.25),facing:worldPoint(edge,0,0)};
 }

 /** @param {Worker} worker */
 startDayAtWork(worker){
  worker.node.visible=true;
  worker.headingHome=false;
  worker.atDoor=false;
  worker.destination=this.chooseTarget(worker);
  if(worker.index===0){
   put(worker.node,pumpWork);
   this.pumpWorker=worker;
   this.step(worker,'fill');
  }else if(worker.role==='market'){
   const market=worker.destination.approach;
   put(worker.node,{...market,z:market.z+4});
   this.choose(worker);
  }else{
   const from=groundPoint(WIND_PUMP_SITE,.9+worker.index*1.35,3.4);
   put(worker.node,worker.index===2?from:worker.destination.approach);
   if(worker.index===2){
    equip(worker,'water');
    this.travel(worker,worker.destination.approach,'deliver','carry');
   }else this.choose(worker);
  }
 }

 /** @param {Worker} worker */
 choose(worker){
  worker.headingHome=false;
  worker.atDoor=false;
  worker.destination=this.chooseTarget(worker);
  if(worker.destination.kind==='market'){
   equip(worker,'produce');
   this.travel(worker,worker.destination.approach,'market_stop','carry');
  }else{
   equip(worker,'empty');
   const queue=groundPoint(WIND_PUMP_SITE,.49+worker.index*.81,2.46);
   this.travel(worker,queue,'pump_queue','carry');
  }
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
  worker.destination=null;
  equip(worker,'none');
  put(worker.node,this.home.door);
 }

 /** @param {Worker} worker @param {Point} point @param {Step} next @param {string} clip @param {number} [speed] */
 travel(worker,point,next,clip,speed){
  const waypoints=this.routes.route(worker.node.position,point);
  if(!waypoints.length){
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
   case 'pump_queue':
    if(this.pumpWorker&&this.pumpWorker!==worker){
     this.hold(worker,.65,'pump_queue','idle');
    }else{
     this.pumpWorker=worker;
     this.follow(worker,[pumpWork],'fill','carry',1.35);
    }
    break;
   case 'fill':
    equip(worker,'empty');
    face(worker.node,pumpFacing);
    this.hold(worker,1.76,'carry_out','fill');
    break;
   case 'carry_out':
    equip(worker,'water');
    this.follow(worker,[groundPoint(WIND_PUMP_SITE,1.10,2.65)],'pump_slot','carry',1.60);
    break;
   case 'pump_slot':
    this.pumpWorker=null;
    if(worker.destination)this.travel(worker,worker.destination.approach,'deliver','carry');
    break;
   case 'deliver':
    if(worker.destination)face(worker.node,worker.destination.facing);
    worker.workCount++;
    this.hold(worker,1.75,'choose','pour');
    if(worker.destination)this.record(worker.destination.kind);
    break;
   case 'market_stop':
    if(worker.destination)face(worker.node,worker.destination.facing);
    equip(worker,'none');
    worker.workCount++;
    this.hold(worker,2.8,'choose','idle');
    this.record('market');
    break;
   case 'home_path':
    this.headHome(worker);
    break;
   case 'enter_home':
    if(this.workers.some(other=>other!==worker&&other.node.visible&&other.atDoor&&Math.hypot(other.node.position.x-this.home.door.x,other.node.position.z-this.home.door.z)<1.45))this.hold(worker,.45,'enter_home','idle');
    else{
     worker.atDoor=true;
     this.follow(worker,[this.home.steps,this.home.door],'sleep','walk',2.45);
    }
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

 /** @param {string} destination */
 record(destination){
  this.completed[destination]=(this.completed[destination]??0)+1;
  this.world.host.dataset.workerTrips=JSON.stringify(this.completed);
 }

 audit(){
  const summary=this.workers.map(worker=>worker.node.visible?{action:worker.active,destination:worker.headingHome?'house':worker.destination?.kind??'field'}:{action:'indoors',destination:'house'});
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
