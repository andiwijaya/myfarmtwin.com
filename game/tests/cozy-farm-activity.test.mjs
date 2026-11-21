import test from 'node:test';
import assert from 'node:assert/strict';
import {AnimationClip,Group} from 'three';
import {FarmActivity} from '../client/cozy-farm-activity.js';
import {marketMealStation,WorkerRoutes} from '../client/cozy-worker-routes.js';
import {createCozyState,dispatchCozy} from '../client/cozy-domain.js';
import {HOUSE_SITE} from '../client/cozy-houses.js';

function named(parent,name){
 const node=new Group();
 node.name=name;
 parent.add(node);
 return node;
}

function mockHouse(){
 const root=new Group(),doors=named(root,'house_entry_doors');
 named(doors,'hinge').userData.openDirection=1;
 return root;
}

function testWorld(){
 const moves=['walk','carry','idle','fill','pour','tend','pickup'].map(name=>new AnimationClip(name,1.72,[]));
 return {
  scene:new Group(),
  host:{dataset:{}},
  entities:new Map([['house',mockHouse()]]),
  options:{},
  models:new Map([['workerMan',{animations:moves}],['workerWoman',{animations:moves}]]),
  clone(kind){
   const root=new Group();
   if(kind==='windPump')for(const part of ['windmill_rotor','windmill_pump_rod','windmill_water_stream'])named(root,part);
   else for(const part of ['water_bucket','bucket_water','bucket_pour','market_basket','worker_hand_1'])named(root,part);
   return root;
  },
  template(){return mockHouse();},
 };
}

function stockedFarm(){
 let state=createCozyState();
 for(const kind of ['coop','goatShelter','barn','pond']){
  const result=dispatchCozy(state,{type:'start',kind});
  assert.ok(result.ok,result.error);
  state=result.state;
 }
 return [...state.layout.items,{id:'house',kind:'house',...HOUSE_SITE}];
}

function simulate(activity,seconds,reduced=false){
 for(let t=0;t<seconds;t+=.2)activity.update(.2,reduced);
}

function randomFrom(seed){
 return ()=>{
  seed=(Math.imul(seed,1664525)+1013904223)>>>0;
  return seed/2**32;
 };
}

test('workers route around a rotated building and reach the clear approach',()=>{
 const barn={id:'barn',kind:'barn',x:0,z:0,rotation:Math.PI/4};
 const routes=new WorkerRoutes([barn],false);
 const from={x:-13,z:0},to={x:13,z:0},path=routes.route(from,to);
 assert.ok(path.length>1);
 let previous=from;
 for(const point of path){
  assert.equal(routes.clear(previous,point),true);
  assert.ok(Number.isFinite(point.y));
  previous=point;
 }
 assert.deepEqual({x:previous.x,z:previous.z},to);
});

test('workers take different direct routes and cover individual pens with one pump assignment at a time',()=>{
 const world=testWorld(),activity=new FarmActivity(world,randomFrom(1978));
 const items=[...stockedFarm(),{id:'coop.2',kind:'coop',x:21,z:-7.5,rotation:0}];
 try{
  activity.sync(12,items,10);
  const initial=JSON.parse(world.host.dataset.workerJobs);
  assert.equal(initial.filter(job=>job.mode==='water').length,1);
  assert.ok(initial.some(job=>job.mode==='tend'&&job.destination==='field'));
  assert.ok(initial.some(job=>job.mode==='tend'&&['coop','goatShelter','barn'].includes(job.destination)));
  assert.equal(new Set(initial.map(job=>job.site)).size,4);
  const directVisits=new Set(),waterWorkers=new Set();
  for(let i=0;i<900;i++){
   activity.update(.2,false);
   const carrying=activity.workers.filter(worker=>worker.job?.mode==='water');
   assert.ok(carrying.length<=1);
   carrying.forEach(worker=>waterWorkers.add(worker.index));
   for(const worker of activity.workers)if(worker.active==='tend'&&worker.job?.mode==='tend')directVisits.add(worker.job.site.id);
  }
  for(const id of ['coop','coop.2','goatShelter','barn','pond'])assert.ok(directVisits.has(id),id+' received direct work');
  assert.ok(activity.completed.field>0&&activity.completed.market>0);
  assert.ok(activity.waterTrips>0);
  assert.ok(waterWorkers.size>1);
 }finally{activity.dispose();}
});

test('workers keep the house routine after the daylight schedule',()=>{
 const world=testWorld(),activity=new FarmActivity(world,randomFrom(33)),items=stockedFarm();
 try{
  activity.sync(12,items,10);
  assert.equal(world.host.dataset.workersAtHome,'0');
  assert.equal(activity.lodge.visible,false);
  simulate(activity,30);
  assert.notEqual(activity.rotor.rotation.z,0);

  activity.sync(17,items,10);
  assert.ok(activity.workers.every(worker=>worker.headingHome));
  let opened=false;
  for(let i=0;i<180;i++){
   activity.update(.2,false);
   if(activity.doors.children[0].rotation.y>.4)opened=true;
  }
  assert.equal(opened,true);
  assert.equal(world.host.dataset.workersAtHome,'4');
  assert.ok(activity.workers.every(worker=>worker.node.position.distanceTo({x:activity.home.door.x,y:activity.home.door.y,z:activity.home.door.z})<.001));

  activity.sync(30,items,10);
  activity.update(.2,false);
  assert.equal(world.host.dataset.workersAtHome,'3');
  simulate(activity,4.5);
  assert.equal(world.host.dataset.workersAtHome,'0');
 }finally{activity.dispose();}
 assert.equal(world.scene.children.length,0);
});

test('before building a player house, workers rest at the lodge and respect reduced motion',()=>{
 const world=testWorld(),activity=new FarmActivity(world),items=createCozyState().layout.items;
 try{
  activity.sync(21,items,0);
  assert.equal(activity.lodge.visible,true);
  assert.equal(world.host.dataset.workersAtHome,'4');
  const startAngle=activity.rotor.rotation.z;
  activity.sync(30,items,0);
  simulate(activity,6,true);
  assert.equal(world.host.dataset.workersAtHome,'0');
  assert.equal(activity.rotor.rotation.z,startAngle);
  activity.sync(41,items,0);
  simulate(activity,4,true);
  assert.equal(world.host.dataset.workersAtHome,'4');
 }finally{activity.dispose();}
});

test('one worker collects the meal at the market counter and delivers it through the house door',()=>{
 const world=testWorld(),activity=new FarmActivity(world,randomFrom(19)),items=stockedFarm();
 const market=items.find(item=>item.id==='market'),station=marketMealStation(market);
 const events=[];
 let order={id:11,meal:'friedRice',marketId:market.id,orderedTick:12,deliveredTick:12,pickup:'requested'};
 world.options.onMealProgress=(type,current)=>{
  assert.equal(current.id,order.id);
  const worker=activity.mealRun.worker;
  const target=type==='carryFood'?station.counter:activity.home.door;
  assert.ok(worker.node.position.distanceTo(target)<.001);
  events.push({type,worker:worker.index});
  order=type==='carryFood'?{...order,pickup:'carrying'}:null;
  activity.sync(12,items,10,order);
 };
 try{
  activity.sync(12,items,10,order);
  let carryFrames=0;
  for(let i=0;i<450;i++){
   activity.update(.2,false);
   const workers=JSON.parse(world.host.dataset.workerJobs);
   assert.ok(workers.filter(job=>job.mode==='meal').length<=1);
   if(order?.pickup==='carrying'){
    carryFrames++;
    assert.equal(workers.filter(job=>job.mode==='meal').length,1);
   }
  }
  assert.deepEqual(events.map(event=>event.type),['carryFood','finishFood']);
  assert.equal(events[0].worker,events[1].worker);
  assert.ok(carryFrames>5);
 }finally{activity.dispose();}
});

test('a saved meal already in hand resumes directly for home after dark',()=>{
 const world=testWorld(),activity=new FarmActivity(world,randomFrom(24)),items=stockedFarm();
 let order={id:12,meal:'noodles',marketId:'market',orderedTick:20,deliveredTick:20,pickup:'carrying'};
 const events=[];
 world.options.onMealProgress=type=>{
  events.push(type);
  order=null;
  activity.sync(20,items,10);
 };
 try{
  activity.sync(20,items,10,order);
  activity.update(.2,false);
  assert.equal(world.host.dataset.workersAtHome,'3');
  simulate(activity,80);
  assert.deepEqual(events,['finishFood']);
  assert.equal(world.host.dataset.workersAtHome,'4');
 }finally{activity.dispose();}
});
