import {Group,InstancedMesh,MathUtils,Mesh,Object3D} from 'three';
import {COZY_MORNING_HOUR} from './cozy-domain.js';
import {COZY_BUILD_CATALOG} from './cozy-placement.js';
import {groundHeight,groundPoint,WorkerRoutes} from './cozy-worker-routes.js';

/** @typedef {import('./cozy-domain.js').Placement} Placement */
/** @typedef {import('./cozy-domain.js').FoodOrder} FoodOrder */
/** @typedef {import('./cozy-worker-routes.js').Point} Point */
/** @typedef {import('./cozy-worker-routes.js').Waypoint} Waypoint */
/** @typedef {{lane:Point[],roadside:boolean}} MarketRoute */
/** @typedef {'waiting'|'arriving'|'loading'|'backing'|'leaving'} TruckPhase */
/** @typedef {'waiting'|'arriving'|'droppingOff'|'turning'|'leaving'} CourierPhase */

const roadZ=35,roadHalfWidth=1.715,east={x:54,z:roadZ},west={x:-54,z:roadZ};
const dayEnds=17;
/** @param {Point} a @param {Point} b */
const distance=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
/** @param {Point} a @param {Point} b @param {number} t */
const between=(a,b,t)=>({x:MathUtils.lerp(a.x,b.x,t),z:MathUtils.lerp(a.z,b.z,t)});

/** @param {Point[]} path @param {WorkerRoutes} routes */
function rounded(path,routes){
 const result=[path[0]];
 for(let i=1;i<path.length-1;i++){
  const a=path[i-1],b=path[i],c=path[i+1];
  const inLength=distance(a,b),outLength=distance(b,c);
  const radius=Math.min(3.1,inLength*.44,outLength*.44);
  if(radius<.24){result.push(b);continue;}
  const start=between(b,a,radius/inLength),finish=between(b,c,radius/outLength);
  const curve=Array.from({length:6},(_,j)=>{
   const t=j/5;
   return between(between(start,b,t),between(b,finish,t),t);
  });
  if(curve.every((point,j)=>routes.clear(j?curve[j-1]:start,point)))result.push(...curve);
  else result.push(b);
 }
 result.push(path[path.length-1]);
 return result;
}

/** @param {Placement[]} items @returns {MarketRoute|null} */
export function marketTruckRoute(items){
 const market=items.find(item=>item.kind==='market');
 if(!market)return null;
 // Cars need more room than pedestrians and use gaps between fences.
 const roads=new WorkerRoutes(items,items.some(item=>item.kind==='house'),{clearance:1.18,fences:true});
 const {width,depth}=COZY_BUILD_CATALOG.market;
 const bays=[[.32,depth/2+3.2],[-1.4,depth/2+3.2],[width/2+3.1,0],[-width/2-3.1,0],[0,-depth/2-3.2]];
 for(const [x,z] of bays){
  const bay=groundPoint(market,x,z);
  if(!roads.clear(bay,bay))continue;
  const center=Math.round(MathUtils.clamp(bay.x,-40,40));
  for(const n of [0,4,-4,9,-9,15,-15,23,-23]){
   const gate={x:MathUtils.clamp(center+n,-41,41),z:roadZ};
   if(distance(gate,bay)<2||!roads.clear(gate,gate))continue;
   const path=roads.route(gate,bay);
   if(!path.length)continue;
   const entry={x:gate.x+4.2,z:roadZ},lane=[entry,gate,...path].filter((point,i,list)=>i===0||distance(list[i-1],point)>.08);
   return {lane:rounded(lane,roads),roadside:false};
  }
 }
 // A narrow or blocked yard can still use a loading point on the village road.
 const stop={x:MathUtils.clamp(market.x,-42,42),z:roadZ};
 return {lane:[stop],roadside:true};
}

/** @param {Point[]} route @param {number} [span] */
function subdivide(route,span=3.25){
 const points=[route[0]];
 for(let i=1;i<route.length;i++){
  const steps=Math.ceil(distance(route[i-1],route[i])/span);
  for(let j=1;j<=steps;j++)points.push(between(route[i-1],route[i],j/steps));
 }
 return points;
}

/** @param {Point} point @param {Point} from @param {Point} to */
function segmentDistance(point,from,to){
 const dx=to.x-from.x,dz=to.z-from.z;
 const t=MathUtils.clamp(((point.x-from.x)*dx+(point.z-from.z)*dz)/(dx*dx+dz*dz),0,1);
 return distance(point,between(from,to,t));
}

/** @param {Group} vehicle @param {Point} point */
function moveVehicle(vehicle,point){vehicle.position.set(point.x,groundHeight(point.x,point.z)+.051,point.z);}

/** @param {Group} vehicle @param {number} heading @param {number} limit */
function turnVehicle(vehicle,heading,limit){
 const turn=Math.atan2(Math.sin(heading-vehicle.rotation.y),Math.cos(heading-vehicle.rotation.y));
 vehicle.rotation.y+=MathUtils.clamp(turn,-limit,limit);
 return Math.abs(turn)<=limit;
}

/** @param {Group} vehicle @param {Point[]} path @param {Object3D[]} wheels @param {number} wheelRadius
 * @param {number} delta @param {boolean} reduced @param {number} speed @param {boolean} [reverse] */
function travelRoad(vehicle,path,wheels,wheelRadius,delta,reduced,speed,reverse=false){
 let budget=reduced?Infinity:delta*speed;
 const direction=reverse?-1:1;
 while(path.length&&budget>0){
  const target=path[0],length=distance(vehicle.position,target);
  if(length>.001){
   const heading=Math.atan2((target.x-vehicle.position.x)*direction,(target.z-vehicle.position.z)*direction);
   turnVehicle(vehicle,heading,reduced?Infinity:delta*3.2);
   const step=Math.min(length,budget);
   for(const wheel of wheels)if(!reduced)wheel.rotation.x+=direction*step/wheelRadius;
   moveVehicle(vehicle,between(vehicle.position,target,step/length));
  }
  if(length>budget)break;
  budget-=length;
  path.shift();
 }
}

/** @param {FoodOrder|null} a @param {FoodOrder|null} b */
function sameOrder(a,b){return !!a&&!!b&&a.id===b.id&&a.meal===b.meal&&a.orderedTick===b.orderedTick&&a.marketId===b.marketId;}

export class FarmTraffic{
 /** @param {import('./cozy-world.js').CozyWorld} world */
 constructor(world){
  this.world=world;
  this.group=new Group();
  /** @type {InstancedMesh[]} */this.branchMeshes=[];
  this.trunkMeshes=this.addRoad([east,west],false);
  this.truck=world.template('infrastructure',['market_truck']);
  this.cargo=this.truck.getObjectByName('truck_load');
  /** @type {Object3D[]} */this.wheels=[];
  this.truck.traverse(node=>{if(node.userData.truckWheel)this.wheels.push(node);});
  this.truck.visible=false;
  this.scooter=world.template('infrastructure',['delivery_scooter']);
  this.payload=this.scooter.getObjectByName('courier_payload');
  /** @type {Object3D[]} */this.scooterWheels=[];
  this.scooter.traverse(node=>{if(node.userData.courierWheel)this.scooterWheels.push(node);});
  this.parcel=world.template('infrastructure',['market_food_parcel']);
  this.scooter.visible=false;
  this.parcel.visible=false;
  this.group.add(this.truck,this.scooter,this.parcel);
  world.scene.add(this.group);
  /** @type {MarketRoute|null} */this.route=null;
  /** @type {TruckPhase} */this.phase='waiting';
  /** @type {Point[]} */this.path=[];
  /** @type {CourierPhase} */this.courierPhase='waiting';
  /** @type {Point[]} */this.courierPath=[];
  /** @type {FoodOrder|null} */this.foodOrder=null;
  /** @type {FoodOrder|null} */this.courierOrder=null;
  /** @type {Placement|undefined} */this.market=undefined;
  this.courierWait=0;
  this.courierRetry=0;
  this.handoffStarted=false;
  this.lastVehicle='truck';
  this.layoutKey='';
  this.open=false;
  this.wait=3.4;
  this.loaded=false;
  this.pickups=0;
  this.report='';
 }

 /** @param {string} template @param {number} count */
 tiles(template,count){
  const model=this.world.models.get('infrastructure').scene.getObjectByName(template);
  if(!(model instanceof Mesh))throw Error('Missing road template '+template);
  const instance=new InstancedMesh(model.geometry,model.material,count);
  instance.userData.glbAsset=this.world.manifest.assets.infrastructure.url;
  instance.receiveShadow=true;
  instance.castShadow=false;
  this.group.add(instance);
  return instance;
 }

 /** @param {Point[]} lane @param {boolean} branch */
 addRoad(lane,branch){
  if(lane.length<2)return [];
  const marks=subdivide(lane),strips=this.tiles('road_strip',marks.length-1);
  const pose=new Object3D(),level=branch?.047:.032;
  pose.rotation.order='YXZ';
  for(let i=1;i<marks.length;i++){
   const a=marks[i-1],b=marks[i],middle=between(a,b,.5);
   pose.position.set(middle.x,groundHeight(middle.x,middle.z)+level,middle.z);
   pose.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);
   pose.rotation.x=-Math.atan2(groundHeight(b.x,b.z)-groundHeight(a.x,a.z),distance(a,b));
   pose.scale.set(1,1,distance(a,b)+.054);
   pose.updateMatrix();
   strips.setMatrixAt(i-1,pose.matrix);
  }
  strips.computeBoundingSphere();
  if(!branch)return [strips];
  const corners=this.tiles('road_joint',marks.length);
  for(const [i,point]of marks.entries()){
   pose.position.set(point.x,groundHeight(point.x,point.z)+level+.004+i*.00004,point.z);
   pose.rotation.set(0,0,0);
   pose.scale.set(1,1,1);
   pose.updateMatrix();
   corners.setMatrixAt(i,pose.matrix);
  }
  corners.computeBoundingSphere();
  return [strips,corners];
 }

 /** @param {Point} point @param {number} [margin] */
 onRoad(point,margin=.435){
  const clearance=roadHalfWidth+margin;
  if(segmentDistance(point,west,east)<clearance)return true;
  const lane=this.route?.lane??[];
  return lane.some((to,i)=>i>0&&segmentDistance(point,lane[i-1],to)<clearance);
 }

 /** @param {number} tick @param {Placement[]} items @param {FoodOrder|null} [order] */
 sync(tick,items,order=null){
  const hour=tick%24;
  this.open=hour>=COZY_MORNING_HOUR&&hour<dayEnds;
  const key=JSON.stringify(items),changed=key!==this.layoutKey;
  if(changed){
   this.layoutKey=key;
   this.market=items.find(item=>item.kind==='market');
   const route=marketTruckRoute(items);
   if(JSON.stringify(route)!==JSON.stringify(this.route)){
    for(const mesh of this.branchMeshes){mesh.removeFromParent();mesh.dispose();}
    this.route=route;
    this.branchMeshes=route?this.addRoad(route.lane,true):[];
    this.phase='waiting';
    this.wait=3.4;
    this.truck.visible=false;
    this.loaded=false;
    this.stopCourier();
   }
  }
  if(this.courierOrder&&!sameOrder(this.courierOrder,order)&&['arriving','droppingOff'].includes(this.courierPhase)&&!this.handoffStarted)this.stopCourier();
  if(!sameOrder(this.foodOrder,order))this.courierRetry=0;
  this.foodOrder=order;
  this.parcel.visible=!!order&&order.deliveredTick!==null&&order.marketId===this.market?.id;
  if(this.parcel.visible&&this.market){
   const {x,y,z}=groundPoint(this.market,2.86,1.71,.906);
   this.parcel.position.set(x,y,z);
   this.parcel.rotation.y=this.market.rotation;
  }
  this.audit();
  return changed;
 }

 /** @param {TruckPhase} phase @param {Point[]} path */
 drive(phase,path){this.phase=phase;this.path=path;}

 /** @param {number} delta @param {boolean} reduced */
 update(delta,reduced){
  const route=this.route;
  if(!route)return;
  this.courierRetry=Math.max(0,this.courierRetry-delta);
  if(this.phase==='waiting'&&this.open)this.wait=Math.max(0,this.wait-delta);
  // Both directions and the market bay share one road reservation. A vehicle
  // releases it only once it has left the lane, including after unloading.
  if(this.scooter.visible){
   this.updateCourier(route,delta,reduced);
   this.audit();
   return;
  }
  if(this.phase==='waiting'){
   const order=this.foodOrder;
   const truckReady=this.open&&this.wait<=0;
   if((!truckReady||this.lastVehicle==='truck')&&order&&order.deliveredTick===null&&order.marketId===this.market?.id&&!this.courierRetry&&this.world.options?.canDeliverFood?.()!==false){
    this.startCourier(route,order);
    this.audit();
    return;
   }
   if(truckReady){
    this.lastVehicle='truck';
    moveVehicle(this.truck,east);
    this.truck.rotation.y=-Math.PI/2;
    this.truck.visible=true;
    this.loaded=false;
    this.drive('arriving',route.lane.slice());
   }
  }else if(this.phase==='loading'){
   this.wait-=delta;
   if(this.wait<2.05)this.loaded=true;
   if(this.wait<=0){
    this.pickups++;
    if(route.roadside)this.drive('leaving',[west]);
    else this.drive('backing',route.lane.slice(0,-1).reverse());
   }
  }else{
   const backing=this.phase==='backing',mainRoad=Math.abs(this.truck.position.z-roadZ)<1.1;
   travelRoad(this.truck,this.path,this.wheels,.37,delta,reduced,backing?2.45:mainRoad?6.3:3.8,backing);
   if(this.path.length)return;
   if(this.phase==='arriving'){
    this.phase='loading';
    this.wait=4.1;
   }else if(this.phase==='backing'){
    this.drive('leaving',[west]);
   }else{
    this.truck.visible=false;
    this.phase='waiting';
    this.loaded=false;
    this.wait=13;
   }
  }
  if(this.cargo)this.cargo.visible=this.loaded;
  this.audit();
 }

 /** @param {MarketRoute} route @param {FoodOrder} order */
 startCourier(route,order){
  this.lastVehicle='courier';
  this.courierOrder=order;
  this.courierPath=route.lane.slice();
  this.courierPhase='arriving';
  moveVehicle(this.scooter,east);
  this.scooter.rotation.y=-Math.PI/2;
  this.scooter.visible=true;
  if(this.payload)this.payload.visible=true;
 }

 stopCourier(){
  this.scooter.visible=false;
  this.courierPhase='waiting';
  this.courierOrder=null;
  this.handoffStarted=false;
 }

 /** @param {MarketRoute} route @param {number} delta @param {boolean} reduced */
 updateCourier(route,delta,reduced){
  if(this.courierPhase==='droppingOff'){
   this.courierWait-=delta;
   const order=this.foodOrder;
   if(!this.handoffStarted&&this.courierWait<=1.8&&order&&order.deliveredTick===null&&sameOrder(this.courierOrder,order)){
    this.handoffStarted=this.world.options?.onFoodArrival?.(order)===true;
    if(this.handoffStarted&&this.payload)this.payload.visible=false;
   }
   if(this.courierWait<=0){
    this.courierPath=route.roadside?[west]:[...route.lane.slice(0,-1).reverse(),east];
    this.courierPhase=route.roadside?'leaving':'turning';
   }
   return;
  }
  if(this.courierPhase==='turning'){
   const target=this.courierPath[0],point=this.scooter.position;
   const heading=Math.atan2(target.x-point.x,target.z-point.z);
   if(turnVehicle(this.scooter,heading,reduced?Infinity:delta*2.3))this.courierPhase='leaving';
   return;
  }
  const mainRoad=Math.abs(this.scooter.position.z-roadZ)<1.1;
  travelRoad(this.scooter,this.courierPath,this.scooterWheels,.28,delta,reduced,mainRoad?8.1:4.8);
  if(this.courierPath.length)return;
  if(this.courierPhase==='arriving'){
   this.courierPhase='droppingOff';
   this.courierWait=3.8;
  }else{
   if(sameOrder(this.courierOrder,this.foodOrder)&&this.foodOrder?.deliveredTick===null)this.courierRetry=7;
   this.stopCourier();
  }
 }

 audit(){
  const courier=this.courierPhase==='waiting'&&this.foodOrder?.deliveredTick===null?'queued':this.courierPhase;
  let occupant=this.truck.visible?'truck':'';
  if(this.scooter.visible)occupant=occupant?occupant+',courier':'courier';
  const state=`${this.phase}|${this.loaded}|${this.pickups}|${courier}|${occupant}|${this.parcel.visible}`;
  if(state===this.report)return;
  this.report=state;
  this.world.host.dataset.truckPhase=this.phase;
  this.world.host.dataset.truckLoaded=String(this.loaded);
  this.world.host.dataset.truckPickups=String(this.pickups);
  this.world.host.dataset.courierPhase=courier;
  this.world.host.dataset.roadVehicle=occupant||'clear';
  this.world.host.dataset.foodParcel=String(this.parcel.visible);
 }

 dispose(){
  for(const mesh of [...this.trunkMeshes,...this.branchMeshes])mesh.dispose();
  this.group.removeFromParent();
 }
}
