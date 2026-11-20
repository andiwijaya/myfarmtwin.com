import {COZY_BUILD_CATALOG} from './cozy-placement.js';
import {groundPoint,worldPoint} from './cozy-worker-routes.js';

/** @typedef {import('./cozy-domain.js').Placement} Placement */
/** @typedef {import('./cozy-worker-routes.js').WorkerRoutes} WorkerRoutes */
/** @typedef {import('./cozy-worker-routes.js').Point} Point */
/** @typedef {import('./cozy-worker-routes.js').Waypoint} Waypoint */
/** @typedef {{id:string,kind:string,approach:Waypoint,facing:Point}} WorkSite */
/** @typedef {{mode:'tend'|'market'|'water',site:WorkSite}} WorkerJob */

const enclosures=new Set(['coop','goatShelter','barn']);
const workplaces=new Set(['bed','pond','market',...enclosures]);

/** @param {Placement[]} layout @param {WorkerRoutes} routes @returns {WorkSite[]} */
export function workerSites(layout,routes){
 const sites=[];
 for(const item of layout){
  if(!workplaces.has(item.kind))continue;
  const {width,depth}=COZY_BUILD_CATALOG[item.kind];
  const bed=item.kind==='bed';
  const offsets=bed?
   [[0,-depth/2-.58],[0,depth/2+.58],[width/2+.58,0],[-width/2-.58,0]]:
   [[width*.15,depth/2+1.05],[-width*.19,depth/2+1.05],[width/2+1.2,0],[-width/2-1.2,0],[0,-depth/2-1.2]];
  const slot=offsets.find(([x,z])=>{
   const approach=worldPoint(item,x,z);
   return routes.clear(approach,approach);
  });
  if(!slot)continue;
  const [x,z]=slot;
  sites.push({
   id:item.id,kind:bed?'field':item.kind,
   approach:groundPoint(item,x,z),facing:worldPoint(item,x*.58,z*.58),
  });
 }
 return sites;
}

/** The visual job board assigns open sites fairly while randomizing ties. */
export class WorkerJobs{
 /** @param {()=>number} [random] */
 constructor(random=Math.random){
  this.random=random;
  /** @type {WorkSite[]} */this.sites=[];
  /** @type {Map<string,number>} */this.directByKind=new Map();
  /** @type {Map<string,number>} */this.directBySite=new Map();
  /** @type {Map<string,number>} */this.waterByKind=new Map();
  /** @type {Map<string,number>} */this.waterBySite=new Map();
  this.directSinceWater=0;
  this.waterAfter=2;
  this.lastWaterWorker=-1;
 }

 /** @template T @param {T[]} values @returns {T} */
 sample(values){return values[Math.floor(this.random()*values.length)];}

 /** @param {WorkSite[]} sites @param {Map<string,number>} counts @param {(site:WorkSite)=>string} key */
 leastAssigned(sites,counts,key){
  const min=Math.min(...sites.map(site=>counts.get(key(site))??0));
  return sites.filter(site=>(counts.get(key(site))??0)===min);
 }

 /** @param {WorkSite[]} sites @param {Map<string,number>} byKind @param {Map<string,number>} bySite */
 chooseSite(sites,byKind,bySite){
  const least=this.leastAssigned(sites,byKind,site=>site.kind);
  const kind=this.sample([...new Set(least.map(site=>site.kind))]);
  const site=this.sample(this.leastAssigned(least.filter(site=>site.kind===kind),bySite,s=>s.id));
  byKind.set(kind,(byKind.get(kind)??0)+1);
  bySite.set(site.id,(bySite.get(site.id)??0)+1);
  return site;
 }

 /** @param {WorkerJob[]} active @param {number} worker @param {string} [previousSite] @returns {WorkerJob|null} */
 assign(active,worker,previousSite){
  const busy=new Set(active.map(job=>job.site.id));
  const open=this.sites.filter(site=>!busy.has(site.id));
  if(!open.length)return null;
  const alternatives=open.filter(site=>site.id!==previousSite);
  const choices=alternatives.length?alternatives:open;
  const activeKinds=new Set(active.map(job=>job.site.kind));
  const separate=choices.filter(site=>!activeKinds.has(site.kind));

  if(this.directSinceWater>=this.waterAfter&&worker!==this.lastWaterWorker&&!active.some(job=>job.mode==='water')){
   const water=choices.filter(site=>site.kind!=='market');
   const separateWater=water.filter(site=>!activeKinds.has(site.kind));
   if(water.length){
    const site=this.chooseSite(separateWater.length?separateWater:water,this.waterByKind,this.waterBySite);
    this.lastWaterWorker=worker;
    this.directSinceWater=0;
    this.waterAfter=3+Math.floor(this.random()*3);
    return {mode:'water',site};
   }
  }

  let direct=separate.length?separate:choices;
  if(!this.directByKind.has('field')){
   const fields=direct.filter(site=>site.kind==='field');
   if(fields.length)direct=fields;
  }else if(![...enclosures].some(kind=>this.directByKind.has(kind))){
   const pens=direct.filter(site=>enclosures.has(site.kind));
   if(pens.length)direct=pens;
  }
  const site=this.chooseSite(direct,this.directByKind,this.directBySite);
  this.directSinceWater++;
  return {mode:site.kind==='market'?'market':'tend',site};
 }
}
