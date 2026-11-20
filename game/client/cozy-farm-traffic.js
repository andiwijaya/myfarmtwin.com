import {Group,InstancedMesh,MathUtils,Mesh,Object3D} from 'three';
import {COZY_MORNING_HOUR} from './cozy-domain.js';
import {COZY_BUILD_CATALOG} from './cozy-placement.js';
import {groundHeight,groundPoint,WorkerRoutes} from './cozy-worker-routes.js';

/** @typedef {import('./cozy-domain.js').Placement} Placement */
/** @typedef {import('./cozy-worker-routes.js').Point} Point */
/** @typedef {import('./cozy-worker-routes.js').Waypoint} Waypoint */
/** @typedef {{lane:Point[],roadside:boolean}} MarketRoute */
/** @typedef {'waiting'|'arriving'|'loading'|'backing'|'leaving'} TruckPhase */

const roadZ=35, east={x:54,z:roadZ},west={x:-54,z:roadZ};
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
  this.group.add(this.truck);
  world.scene.add(this.group);
  /** @type {MarketRoute|null} */this.route=null;
  /** @type {TruckPhase} */this.phase='waiting';
  /** @type {Point[]} */this.path=[];
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

 /** @param {Point} point */
 onRoad(point){
  if(point.x>=west.x&&point.x<=east.x&&Math.abs(point.z-roadZ)<2.15)return true;
  const lane=this.route?.lane??[];
  return lane.some((to,i)=>i>0&&segmentDistance(point,lane[i-1],to)<2.15);
 }

 /** @param {number} tick @param {Placement[]} items */
 sync(tick,items){
  const hour=tick%24;
  this.open=hour>=COZY_MORNING_HOUR&&hour<dayEnds;
  const key=JSON.stringify(items);
  if(key===this.layoutKey)return;
  this.layoutKey=key;
  for(const mesh of this.branchMeshes){mesh.removeFromParent();mesh.dispose();}
  this.route=marketTruckRoute(items);
  this.branchMeshes=this.route?this.addRoad(this.route.lane,true):[];
  this.phase='waiting';
  this.wait=3.4;
  this.truck.visible=false;
  this.loaded=false;
  this.audit();
 }

 /** @param {Point} point */
 moveTo(point){this.truck.position.set(point.x,groundHeight(point.x,point.z)+.051,point.z);}

 /** @param {TruckPhase} phase @param {Point[]} path */
 drive(phase,path){this.phase=phase;this.path=path;}

 /** @param {number} delta @param {boolean} reduced */
 update(delta,reduced){
  const route=this.route;
  if(!route)return;
  if(this.phase==='waiting'){
   if(this.open&&(this.wait-=delta)<=0){
    this.moveTo(east);
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
   this.travel(delta,reduced);
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

 /** @param {number} delta @param {boolean} reduced */
 travel(delta,reduced){
  const node=this.truck,backing=this.phase==='backing';
  const lane=Math.abs(node.position.z-roadZ)<1.1;
  let budget=reduced?Infinity:delta*(backing?2.45:lane?6.3:3.8);
  while(this.path.length&&budget>0){
   const target=this.path[0],length=distance(node.position,target);
   if(length>.001){
    const sign=backing?-1:1;
    const heading=Math.atan2((target.x-node.position.x)*sign,(target.z-node.position.z)*sign);
    const turn=Math.atan2(Math.sin(heading-node.rotation.y),Math.cos(heading-node.rotation.y));
    node.rotation.y+=reduced?turn:MathUtils.clamp(turn,-delta*3.2,delta*3.2);
    const step=Math.min(length,budget);
    for(const wheel of this.wheels)if(!reduced)wheel.rotation.x+=sign*step/.37;
    this.moveTo(between(node.position,target,step/length));
   }
   if(length>budget)break;
   budget-=length;
   this.path.shift();
  }
 }

 audit(){
  const state=this.phase+'|'+this.loaded+'|'+this.pickups;
  if(state===this.report)return;
  this.report=state;
  this.world.host.dataset.truckPhase=this.phase;
  this.world.host.dataset.truckLoaded=String(this.loaded);
  this.world.host.dataset.truckPickups=String(this.pickups);
 }

 dispose(){
  for(const mesh of [...this.trunkMeshes,...this.branchMeshes])mesh.dispose();
  this.group.removeFromParent();
 }
}
