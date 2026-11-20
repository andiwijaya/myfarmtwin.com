import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Group} from 'three';
import {png,packStaticMeshes} from './glb-prototype-export.mjs';
import {writeWorldGLB} from './cozy-world-export.mjs';
import {textures,textureSources} from './cozy-world-common.mjs';
import {createChicken,createGoat,createFish} from './cozy-world-animals.mjs';
import {createWorldTerrain,createCoop,createGoatShelter,createPond,createMarket,createFarVegetation} from './cozy-world-environment.mjs';
import {createHouses} from './cozy-world-houses.mjs';
import {createWorker,createWindPump} from './cozy-world-farm-activity.mjs';
import {createInfrastructure} from './cozy-world-infrastructure.mjs';
import {HOUSE_LEVELS,HOUSE_PLOT} from '../../game/client/cozy-houses.js';

const authoringRoot=resolve(fileURLToPath(new URL('../../',import.meta.url)));
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
// One aggregate node per state-driven role. Child transforms remain metric,
// while hiding/filling a single role controls every trough/rack consistently.
function aggregateRole(root,name){const nodes=[];root.traverse(o=>{if(o.name===name)nodes.push(o);});if(nodes.length<2)return;root.updateMatrixWorld(true);const parent=new Group();parent.name=name;root.add(parent);nodes.forEach((o,i)=>{parent.attach(o);o.name=name+'_component_'+i;});}
const roles={
 terrain:{ground:'continuous_flat_tropical_pasture',surround:'pasture_surround',lowlands:'rice_country_ground',floodedPaddies:'flooded_rice_plots',plantedPaddies:'planted_rice_plots',woods:'wooded_verges',mountains:'distant_mountains'},
 house:{levels:HOUSE_LEVELS.map(level=>level.model),satellite:'home_satellite_dish'},
 windPump:{rotor:'windmill_rotor',shaft:'windmill_pump_rod',water:'windmill_water_stream'},
 workerMan:{head:'worker_head',bucket:'water_bucket',contents:'bucket_water',stream:'bucket_pour',basket:'market_basket'},
 workerWoman:{head:'worker_head',bucket:'water_bucket',contents:'bucket_water',stream:'bucket_pour',basket:'market_basket'},
 infrastructure:{truck:'market_truck',cargo:'truck_load',courier:'delivery_scooter',payload:'courier_payload',parcel:'market_food_parcel',road:'road_strip',corner:'road_joint',power:'wind_solar_station',rotor:'energy_turbine_rotor',transformer:'distribution_transformer',solar:'solar_panel_array',lamp:'farm_street_lamp',bulb:'lamp_bulb',glow:'lamp_ground_glow'},
 coop:{roof:'roof',floor:'floor',frame:'frame',walls:'walls',equipment:'equipment',nests:'nests',eggs:'nest_eggs',feed:'feed_contents',water:'water_contents',roosts:'roosts',gate:'entry_gate'},
 goatShelter:{roof:'roof',floor:'floor',frame:'frame',walls:'walls',stalls:'stalls',equipment:'equipment',feed:'feed_contents',water:'water_contents',bedding:'bedding',ramp:'entry_ramp'},
 market:{roof:'roof',floor:'floor',frame:'frame',walls:'walls',equipment:'equipment',stock:'stock_contents',shelves:'warehouse_shelves',orderCrate:'order_crate'},
 pond:{water:'water_contents',waterSurface:'water_surface',floor:'pond_lined_floor',rim:'rim',equipment:'equipment',aerator:'aerator',rotor:'aerator_rotor',bubbles:'aerator_bubbles'},
 chicken:{head:'head',tail:'tail',body:'body',legs:['leg_left','leg_right'],wings:['wing_left','wing_right']},
 goat:{head:'head',tail:'tail',ears:['ear_left','ear_right'],legs:['leg_front_left','leg_front_right','leg_rear_left','leg_rear_right']},
 goatKid:{head:'head',tail:'tail',ears:['ear_left','ear_right'],legs:['leg_front_left','leg_front_right','leg_rear_left','leg_rear_right']},
 fish:{tail:'tail',fins:['fin_left','fin_right']}
};
const definitions=[
 ['terrain','terrain',()=>({root:createWorldTerrain()}),{footprint:[88,68],buildableSurfaceY:0,semanticRole:'continuous environment terrain'}],
 ['house','houses',()=>({root:createHouses()}),{footprint:[HOUSE_PLOT.width,HOUSE_PLOT.depth],front:'+Z',semanticRole:'ten Indonesian farmhouse upgrade models with rear satellite dishes'}],
 ['windPump','wind-pump',()=>({root:createWindPump()}),{front:'+Z',semanticRole:'working windmill and bucket-filling point'}],
 ['workerMan','worker-man',()=>createWorker(false),{front:'+Z',semanticRole:'articulated male farm worker in Indonesian field wear'}],
 ['workerWoman','worker-woman',()=>createWorker(true),{front:'+Z',semanticRole:'articulated female farm worker in Indonesian field wear'}],
 ['infrastructure','infrastructure',()=>({root:createInfrastructure()}),{semanticRole:'village truck, delivery scooter, takeaway parcel, service road and power library'}],
 ['coop','coop',()=>({root:createCoop()}),{footprint:[9,7],interiorFloorY:0,interiorTarget:[0,.8,-.3],front:'+Z',semanticRole:'chicken building with complete interior'}],
 ['chicken','chicken',createChicken,{forward:'+X',semanticRole:'kampung hen',maxCloseInstancesSuggested:12}],
 ['goatShelter','goat-shelter',()=>({root:createGoatShelter()}),{footprint:[11,9],interiorFloorY:.34,interiorTarget:[0,1.1,-.3],front:'+Z',semanticRole:'raised ventilated goat shelter with complete interior'}],
 ['goat','goat',createGoat,{forward:'+X',semanticRole:'adult Peranakan Etawa inspired goat',maxCloseInstancesSuggested:8}],
 ['goatKid','goat-kid',()=>createGoat({kid:true}),{forward:'+X',semanticRole:'goat kid with independently enlarged head and horn buds',maxCloseInstancesSuggested:8}],
 ['pond','pond',()=>({root:createPond()}),{footprint:[12,10],interiorFloorY:.12,waterSurfaceY:.52,fishRootY:.17,fishRegion:[[-4.6,.14,-3.6],[4.6,.25,3.6]],front:'+Z',semanticRole:'raised rounded tilapia pond with aerator and service equipment'}],
 ['fish','fish',createFish,{forward:'+X',semanticRole:'Nile tilapia',maxCloseInstancesSuggested:24}],
 ['market','market',()=>({root:createMarket()}),{footprint:[7,6],interiorFloorY:0,interiorTarget:[0,1,0],front:'+Z',semanticRole:'local produce market and stock warehouse'}]
];
export async function buildCozyWorldAssets(root=authoringRoot){
 const directory=join(root,'game/client/assets/models/world');await mkdir(directory,{recursive:true});const prototype=JSON.parse(await readFile(join(root,'game/client/assets/models/prototype-manifest.json'),'utf8')),assets={};
 const writeAsset=async(id,filename,created,metadata={})=>{const {root:model,animations=[]}=created;for(const role of ['feed_contents','water_contents'])aggregateRole(model,role);packStaticMeshes(model);const path=join(directory,filename+'.glb'),record=await writeWorldGLB(path,model,{textures,animations}),bytes=await readFile(path);return{id,url:'/play/assets/models/world/'+filename+'.glb',sha256:hash(bytes),...record,...metadata,roles:metadata.roles??roles[id]??{},floorPivot:true,authoredBy:'MyFarmTwin original repository authoring',externalResources:false};};
 for(const[id,filename,create,metadata]of definitions)assets[id]=await writeAsset(id,filename,create(),metadata);
 for(const id of ['barn','cow','bed','crops','props','vegetation','path','fence']){const a=prototype.assets[id];assets[id]={...a,url:'/play/assets/models/prototype/'+id+'.glb',roles:prototype.roles[id]??{},floorPivot:true,reusedOriginalPrototype:true,externalResources:false,...(id==='barn'?{footprint:[10,8],interiorFloorY:0,interiorTarget:[0,1.3,0],front:'+Z'}:{}),...(id==='cow'?{forward:'+X'}:{}),...(id==='bed'?{footprint:[1.5,1.8]}:{}),...(id==='path'?{footprint:[2,2]}:{}),...(id==='fence'?{length:2}:{})};}
 const far=[['chicken',()=>createChicken({far:true}),24],['goat',()=>createGoat({far:true}),28],['goatKid',()=>createGoat({far:true,kid:true}),24],['fish',()=>createFish({far:true}),18],['vegetation',()=>({root:createFarVegetation()}),27]];
 for(const[id,create,distance]of far){const filename=(id==='goatKid'?'goat-kid':id)+'-far',a=await writeAsset(id+'Far',filename,create(),{roles:assets[id].roles});assets[id].lod={strategy:'authored far GLB with matching template and articulation names',distance,far:{...a,distance},near:{url:assets[id].url,distance:0}};}
 const totalBytes=Object.values(assets).reduce((sum,a)=>sum+a.bytes+(a.lod?.far?.bytes??0),0);
 const manifest={version:2,format:'glTF 2.0 GLB',authoringDate:'2026-11-15',author:'MyFarmTwin original repository authoring',license:'Original project assets; reproducible geometry and embedded texture source in tools/art/cozy-world-*.mjs and tools/art/glb-prototype-*.mjs',externalResources:false,units:'meters',up:'+Y',animalForward:'+X',groundSurfaceY:0,dimensions:{terrain:[88,68],barn:[10,8],coop:[9,7],goatShelter:[11,9],pond:[12,10],market:[7,6],bed:[1.5,1.8],path:[2,2],fenceLength:2},roles:{...prototype.roles,...roles},assetQuality:{style:'warm semi-realistic Indonesian tropical',source:'original geometry, PBR materials, embedded original base-color and tangent-space normal textures',animation:'glTF transform animation on named articulated groups; no runtime procedural mesh replacement',lod:'explicit original far assets; no device performance claim',totalBytesIncludingFarLODs:totalBytes},assets};
 await writeFile(join(root,'game/client/assets/models/world-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 // Direct authoring previews are useful for reviewing material pattern scale.
 const preview=textureSources.filter(t=>!t.name.includes('normal')),w=1536,h=1024;
 await writeFile(join(directory,'original-texture-contact-sheet.png'),png(w,h,(u,v,x,y)=>{const col=Math.floor(x/512),row=Math.floor(y/512),t=preview[row*3+col];if(!t)return[235,231,215,255];return t.sample((x%512)/512,(y%512)/512,x%512,y%512);}));
 const report={kind:'cozy-world-original-glb-build-v2',totalBytes,logicalAssets:Object.keys(assets).length,newFiles:definitions.length+far.length,assets:Object.values(assets).map(a=>({id:a.id,bytes:a.bytes,uniqueTriangles:a.uniqueTriangles,nodes:a.nodes,animations:a.animations,normalMaps:a.normalMaps??0,lod:a.lod?{bytes:a.lod.far.bytes,uniqueTriangles:a.lod.far.uniqueTriangles}:null}))};
 console.log(JSON.stringify(report,null,2));return manifest;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildCozyWorldAssets();
