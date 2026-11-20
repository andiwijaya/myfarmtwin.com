import {Group,Mesh,MeshStandardMaterial,PointLight} from 'three';
import {COZY_MORNING_HOUR} from './cozy-domain.js';
import {HOUSE_LEVELS} from './cozy-houses.js';
import {COZY_BUILD_CATALOG} from './cozy-placement.js';
import {groundHeight,groundPoint,WORKER_LODGE_SITE,WorkerRoutes} from './cozy-worker-routes.js';

/** @typedef {import('./cozy-domain.js').Placement} Placement */
/** @typedef {import('./cozy-worker-routes.js').Waypoint} Waypoint */
/** @typedef {{point:Waypoint,heading:number}} LampSite */
/** @typedef {{model:Group,glow:import('three').Object3D|null,site:LampSite}} Lamp */

const station={x:33.1,z:-36.5,rotation:0};
const enclosures=new Set(['barn','coop','goatShelter']);
const lightsOnHour=18;

/** @param {Placement[]} items @param {number} houseLevel @param {(point:Waypoint)=>boolean} [overRoad] */
export function farmLampSites(items,houseLevel,overRoad=()=>false){
 const house=items.find(item=>item.kind==='house');
 const houseSite=house??WORKER_LODGE_SITE;
 const size=HOUSE_LEVELS[Math.max(0,houseLevel-1)].dimensions;
 const routes=new WorkerRoutes(items.filter(item=>item!==house),Boolean(house));
 if(house)routes.block(house,size[0],size[1]);
 /** @type {LampSite[]} */const sites=[];
 /** @param {import('./cozy-worker-routes.js').Site} item @param {number[][]} choices */
 const add=(item,choices)=>{
  for(const [x,z]of choices){
   const point=groundPoint(item,x,z);
   if(!routes.clear(point,point)||overRoad(point)||sites.some(site=>Math.hypot(site.point.x-point.x,site.point.z-point.z)<2.9))continue;
   sites.push({point,heading:Math.atan2(item.x-point.x,item.z-point.z)});
   return true;
  }
  return false;
 };
 /** @param {number} width @param {number} depth */
 const corners=(width,depth)=>{
  const x=width/2+.95,z=depth/2+.98;
  return [[x,z],[-x,z],[x,-z],[-x,-z],[x,0],[-x,0]];
 };
 add(houseSite,corners(size[0],size[1]));
 for(const item of items){
  if(!enclosures.has(item.kind))continue;
  const {width,depth}=COZY_BUILD_CATALOG[item.kind];
  add(item,corners(width,depth));
 }
 const beds=items.filter(item=>item.kind==='bed');
 if(beds.length){
  const left=beds.slice().sort((a,b)=>a.x-b.x||a.z-b.z);
  const right=beds.slice().sort((a,b)=>b.x-a.x||b.z-a.z);
  for(const side of [left,right])side.some(bed=>add(bed,[[-2.16,-.65],[2.16,.65],[0,-2.13],[0,2.13]]));
 }
 return sites;
}

export class FarmPower{
 /** @param {import('./cozy-world.js').CozyWorld} world */
 constructor(world){
  this.world=world;
  this.group=new Group();
  this.station=world.template('infrastructure',['wind_solar_station']);
  this.station.position.set(station.x,groundHeight(station.x,station.z),station.z);
  this.rotor=this.station.getObjectByName('energy_turbine_rotor');
  this.group.add(this.station);
  this.lights=Array.from({length:4},()=>{
   const light=new PointLight('#ffd091',39,11,2);
   light.visible=false;
   this.group.add(light);
   return light;
  });
  world.scene.add(this.group);
  /** @type {Lamp[]} */this.lamps=[];
  /** @type {MeshStandardMaterial|null} */this.bulb=null;
  this.layoutKey='';
  this.night=false;
  this.lightUpdate=0;
 }

 /** @param {number} tick @param {Placement[]} items @param {number} houseLevel @param {(point:Waypoint)=>boolean} [overRoad] */
 sync(tick,items,houseLevel,overRoad){
  const hour=tick%24,night=hour>=lightsOnHour||hour<COZY_MORNING_HOUR;
  const key=JSON.stringify([items,houseLevel]),changed=key!==this.layoutKey;
  if(changed){
   this.layoutKey=key;
   for(const lamp of this.lamps)lamp.model.removeFromParent();
   this.lamps=farmLampSites(items,houseLevel,overRoad).map(site=>this.addLamp(site));
  }
  if(changed||night!==this.night){
   this.night=night;
   if(this.bulb)this.bulb.emissiveIntensity=night?2.35:0;
   for(const lamp of this.lamps)if(lamp.glow)lamp.glow.visible=night;
   this.refreshLights();
   this.world.host.dataset.farmLamps=String(this.lamps.length);
   this.world.host.dataset.farmLampsLit=String(night?this.lamps.length:0);
  }
 }

 /** @param {LampSite} site @returns {Lamp} */
 addLamp(site){
  const model=this.world.template('infrastructure',['farm_street_lamp']);
  const {x,y,z}=site.point;
  model.position.set(x,y,z);
  model.rotation.y=site.heading;
  model.getObjectByName('lamp_bulb')?.traverse(node=>{
   if(!(node instanceof Mesh)||!(node.material instanceof MeshStandardMaterial))return;
   if(!this.bulb){
    this.bulb=node.material.clone();
    this.bulb.emissive.set('#ffb048');
   }
   node.material=this.bulb;
  });
  const glow=model.getObjectByName('lamp_ground_glow')??null;
  glow?.traverse(node=>{
   if(node instanceof Mesh&&!Array.isArray(node.material)){node.material.depthWrite=false;node.castShadow=false;node.receiveShadow=false;}
  });
  this.group.add(model);
  return {model,glow,site};
 }

 refreshLights(){
  const camera=this.world.camera.position;
  const nearest=this.night?this.lamps.map(({site})=>site).sort((a,b)=>Math.hypot(a.point.x-camera.x,a.point.z-camera.z)-Math.hypot(b.point.x-camera.x,b.point.z-camera.z)):[];
  for(const [i,light]of this.lights.entries()){
   const site=nearest[i];
   light.visible=Boolean(site);
   if(site){
    const {x,y,z}=site.point;
    light.position.set(x+Math.sin(site.heading)*.70,y+3.53,z+Math.cos(site.heading)*.70);
   }
  }
 }

 /** @param {number} delta @param {boolean} reduced */
 update(delta,reduced){
  if(this.rotor&&!reduced)this.rotor.rotation.z=(this.rotor.rotation.z+delta*1.12)%(Math.PI*2);
  if(this.night&&(this.lightUpdate-=delta)<=0){
   this.lightUpdate=.45;
   this.refreshLights();
  }
 }

 dispose(){
  this.bulb?.dispose();
  this.group.removeFromParent();
 }
}
