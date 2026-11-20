import test from 'node:test';
import assert from 'node:assert/strict';
import {Group,PerspectiveCamera,Vector3} from 'three';
import {createInfrastructure} from '../../tools/art/cozy-world-infrastructure.mjs';
import {createCozyState,dispatchCozy} from '../client/cozy-domain.js';
import {FarmPower,farmLampSites} from '../client/cozy-farm-power.js';
import {FarmTraffic,marketTruckRoute} from '../client/cozy-farm-traffic.js';
import {HOUSE_SITE} from '../client/cozy-houses.js';
import {COZY_BUILD_CATALOG} from '../client/cozy-placement.js';
import {worldPoint,WorkerRoutes} from '../client/cozy-worker-routes.js';
import {CozyWorld} from '../client/cozy-world.js';

function worldFixture(){
 const models=createInfrastructure();
 return {
  scene:new Group(),
  camera:new PerspectiveCamera(),
  host:{dataset:{}},
  models:new Map([['infrastructure',{scene:models}]]),
  manifest:{assets:{infrastructure:{url:'infrastructure.glb'}}},
  template(_,[name]){return models.getObjectByName(name).clone(true);},
 };
}

function builtFarm(){
 let state=createCozyState();
 for(const kind of ['coop','goatShelter','barn','pond']){
  const result=dispatchCozy(state,{type:'start',kind});
  assert.ok(result.ok,result.error);
  state=result.state;
 }
 return [...state.layout.items,{id:'house',kind:'house',...HOUSE_SITE}];
}

test('truck lane reconnects to the market when moved and uses a roadside stop if bays are blocked',()=>{
 const items=builtFarm(),market=items.find(item=>item.kind==='market');
 for(const layout of [items,items.map(item=>item===market?{...item,x:-15,z:24,rotation:Math.PI/2}:item)]){
  const market=layout.find(item=>item.kind==='market');
  const {lane,roadside}=marketTruckRoute(layout);
  assert.equal(roadside,false);
  assert.equal(lane[0].z,35);
  const {x,z}=lane.at(-1);
  assert.deepEqual({x,z},worldPoint(market,.32,6.2));
  const routes=new WorkerRoutes(layout,true,{clearance:1.18,fences:true});
  assert.ok(lane.every((point,i)=>i===0||routes.clear(lane[i-1],point)));
 }
 const blockedBays=[[.32,6.2],[-1.4,6.2],[6.6,0],[-6.6,0],[0,-6.2]].map(([x,z],index)=>({
  id:'fence.'+index,kind:'fence',x:market.x+x,z:market.z+z,rotation:0,
 }));
 assert.deepEqual(marketTruckRoute([...items,...blockedBays]),{lane:[{x:market.x,z:35}],roadside:true});
 assert.equal(marketTruckRoute([]),null);
});

test('truck follows the gravel road, loads at the market and completes its last trip after closing',()=>{
 const world=worldFixture(),traffic=new FarmTraffic(world),items=builtFarm();
 try{
  traffic.sync(0,items);
  for(let i=0;i<200;i++)traffic.update(.2,false);
  assert.equal(traffic.truck.visible,false);
  assert.equal(traffic.pickups,0);

  traffic.sync(16,items);
  const seen=new Set();
  for(let i=0;i<550;i++){
   traffic.update(.2,false);
   const {truckPhase,truckLoaded}=world.host.dataset;
   seen.add(`${truckPhase} ${truckLoaded}`);
   if(traffic.truck.visible)assert.ok(traffic.onRoad(traffic.truck.position),`truck on road during ${truckPhase}`);
   if(truckPhase==='loading')assert.equal(traffic.cargo.visible,truckLoaded==='true');
   if(truckPhase==='leaving')traffic.sync(17,items);
  }
  for(const stage of ['arriving false','loading false','loading true','backing true','leaving true','waiting false'])assert.ok(seen.has(stage),stage);
  assert.equal(world.host.dataset.truckPickups,'1');
  assert.equal(traffic.truck.visible,false);
  assert.ok(traffic.wheels.every(wheel=>wheel.rotation.x!==0));
 }finally{traffic.dispose();}
 assert.equal(world.scene.children.length,0);
});

test('roadside trees are filtered against the current truck route and return when it moves away',()=>{
 const world=worldFixture(),traffic=new FarmTraffic(world),items=builtFarm();
 const trees=new Map();
 const scenery={
  host:world.host,vergeScenery:new Group(),
  instanceScenery(_,kind,transforms){trees.set(kind,transforms.map(matrix=>new Vector3().setFromMatrixPosition(matrix)));},
 };
 const trunk=()=>[...trees.get('palm'),...trees.get('banana')];
 try{
  assert.equal(traffic.sync(6,items),true);
  CozyWorld.prototype.syncVergeScenery.call(scenery,traffic);
  const first=trunk();
  assert.ok(first.length>0&&first.length<38);
  assert.ok(first.every(point=>!traffic.onRoad(point,.8)));
  assert.ok(trees.get('grass').every(point=>!traffic.onRoad(point)));
  assert.equal(traffic.sync(7,items),false);

  const moved=items.map(item=>item.kind==='market'?{...item,x:-15,z:18,rotation:Math.PI/2}:item);
  assert.equal(traffic.sync(7,moved),true);
  CozyWorld.prototype.syncVergeScenery.call(scenery,traffic);
  const next=trunk();
  assert.ok(next.every(point=>!traffic.onRoad(point,.8)));
  assert.ok(next.some(point=>first.every(previous=>!point.equals(previous))),'a tree reappears off the moved route');
 }finally{traffic.dispose();}
});

test('lamps cover the house, livestock, market, pond and field and stay outside the road',()=>{
 const world=worldFixture(),traffic=new FarmTraffic(world),power=new FarmPower(world),items=builtFarm();
 try{
  traffic.sync(6,items);
  const onRoad=point=>traffic.onRoad(point);
  const sites=farmLampSites(items,10,onRoad);
  assert.equal(sites.length,8);
  assert.ok(sites.every(({point})=>!onRoad(point)));
  for(const kind of ['house','coop','barn','goatShelter','bed']){
   const buildings=items.filter(item=>item.kind===kind);
   assert.ok(sites.some(({point})=>buildings.some(item=>Math.hypot(point.x-item.x,point.z-item.z)<12)),kind);
  }
  for(const kind of ['market','pond']){
   const building=items.find(item=>item.kind===kind),{width,depth}=COZY_BUILD_CATALOG[kind];
   const expected=worldPoint(building,width/2+.95,depth/2+.98);
   assert.ok(sites.some(({point})=>point.x===expected.x&&point.z===expected.z),kind+' has a lamp at its entrance side');
  }
  assert.ok(power.station.getObjectByName('solar_panel_array'));
  assert.ok(power.station.getObjectByName('distribution_transformer'));
  power.sync(17,items,10,onRoad);
  assert.equal(world.host.dataset.farmLampsLit,'0');
  assert.ok(power.lamps.every(lamp=>!lamp.glow.visible));
  power.update(.2,false);
  assert.notEqual(power.rotor.rotation.z,0);

  power.sync(18,items,10,onRoad);
  assert.equal(world.host.dataset.farmLampsLit,'8');
  assert.ok(power.lamps.every(lamp=>lamp.glow.visible));
  assert.ok(power.lights.every(light=>light.visible));
  assert.ok(power.bulb.emissiveIntensity>0);
  power.sync(29,items,10,onRoad);
  assert.equal(world.host.dataset.farmLampsLit,'8');
  power.sync(30,items,10,onRoad);
  assert.equal(world.host.dataset.farmLampsLit,'0');
  assert.ok(power.lamps.every(lamp=>!lamp.glow.visible));
  assert.ok(power.lights.every(light=>!light.visible));
 }finally{power.dispose();traffic.dispose();}
 assert.equal(world.scene.children.length,0);
});
