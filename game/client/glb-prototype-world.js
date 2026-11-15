import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';

/** @typedef {{id:string,kind:string,x:number,z:number,rotation:number}} PlacedItem */
/** @typedef {{revision:number,items:PlacedItem[]}} Layout */
const MODEL_BASE=new URL('../assets/models/prototype/',document.baseURI);
const v=(/** @type {number} */x,/** @type {number} */y,/** @type {number} */z)=>new THREE.Vector3(x,y,z);
const clamp=THREE.MathUtils.clamp;

/** One GLB-only scene. Presentation never writes a farm resource or save. */
export class GLBFarmWorld{
 /** @param {HTMLElement} host @param {{onSelect:(id:string)=>void,onPlacement:(point:{x:number,z:number})=>void,onProgress:(ready:number,total:number)=>void,onError:(message:string)=>void}} options */
 constructor(host,options){
  this.host=host;this.options=options;this.disposed=false;this.frame=0;this.lastTime=0;this.interior=false;this.selected='';this.placing=false;this.stateKey='';this.layoutKey='';this.quality='high';this.currentView='overview';
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#d7dfc9');this.scene.fog=new THREE.Fog('#d7dfc9',48,100);
  this.camera=new THREE.PerspectiveCamera(43,1,.08,150);this.camera.position.set(28,25,31);
  this.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:'high-performance'});
  this.renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.65));this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.05;
  this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.renderer.domElement.setAttribute('aria-label','Farm tropis tiga dimensi / Three-dimensional tropical farm');this.renderer.domElement.tabIndex=0;host.append(this.renderer.domElement);
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(-1,0,0);this.controls.enableDamping=true;this.controls.dampingFactor=.085;this.controls.minDistance=3;this.controls.maxDistance=64;this.controls.minPolarAngle=.12;this.controls.maxPolarAngle=Math.PI*.48;this.controls.screenSpacePanning=false;this.controls.zoomSpeed=.8;this.controls.rotateSpeed=.65;
  this.controls.addEventListener('start',()=>{this.transition=null;});
  this.scene.add(new THREE.HemisphereLight('#e5eeff','#aaa18a',1.55));this.sun=new THREE.DirectionalLight('#fff0d9',3.2);this.sun.position.set(-16,27,12);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-30,right:30,top:26,bottom:-26,near:1,far:80});this.sun.shadow.normalBias=.035;this.sun.shadow.bias=-.00012;this.scene.add(this.sun);
  this.barnFill=new THREE.PointLight('#ffcf90',12,14,2);this.barnFill.position.set(7,2,-4);this.scene.add(this.barnFill);
  /** @type {Map<string,import('three/addons/loaders/GLTFLoader.js').GLTF>} */this.models=new Map();
  /** @type {Map<string,THREE.Group>} */this.entities=new Map();
  /** @type {Map<string,THREE.AnimationMixer>} */this.mixers=new Map();this.landscape=new THREE.Group();this.scene.add(this.landscape);
  /** @type {Set<THREE.Material>} */this.ownedMaterials=new Set();
  /** @type {THREE.Group|null} */this.ghost=null;
  /** @type {{target:THREE.Vector3,position:THREE.Vector3,fromTarget:THREE.Vector3,fromPosition:THREE.Vector3,start:number}|null} */this.transition=null;
  /** @type {{target:THREE.Vector3,position:THREE.Vector3,id:string}|null} */this.previousView=null;
  /** @type {PlacedItem|null} */this.barnItem=null;
  this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.groundPlane=new THREE.Plane(v(0,1,0),0);this.abort=new AbortController();
  this.down={x:0,y:0};const canvas=this.renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{this.down={x:e.clientX,y:e.clientY};},{signal:this.abort.signal});
  // Select on the completed click, after touch compatibility events settle.
  // Scrolling the care panel from pointerup could retarget a later synthetic
  // click onto an action button on a phone.
  canvas.addEventListener('click',e=>{if(e.button!==0||Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)>7)return;this.pick(e.clientX,e.clientY);},{signal:this.abort.signal});
  canvas.addEventListener('pointercancel',()=>{this.down={x:Infinity,y:Infinity};},{signal:this.abort.signal});
  canvas.addEventListener('keydown',e=>{if(e.key==='Home'){e.preventDefault();this.focus('overview');}else if(e.key==='+'||e.key==='='){e.preventDefault();this.zoom(.82);}else if(e.key==='-'){e.preventDefault();this.zoom(1.22);}else if(e.key==='Escape'){this.back();}},{signal:this.abort.signal});
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
 }
 async load(){
  const names=['terrain','barn','cow','bed','props','vegetation','crops','path','fence'],loader=new GLTFLoader();let ready=0;
  await Promise.all(names.map(async name=>{const model=await loader.loadAsync(new URL(name+'.glb',MODEL_BASE).href);if(this.disposed)return;this.models.set(name,model);this.options.onProgress(++ready,names.length);}));
  if(this.disposed)return;this.createLandscape();this.host.dataset.modelsReady='true';this.frame=requestAnimationFrame(t=>this.animate(t));
 }
 resize(){const rect=this.host.getBoundingClientRect();if(rect.width<1||rect.height<1)return;this.camera.aspect=rect.width/rect.height;this.camera.updateProjectionMatrix();this.renderer.setSize(rect.width,rect.height,false);}
 /** @param {string} modelName @param {string} [node] */
 clone(modelName,node){const asset=this.models.get(modelName);if(!asset)throw Error('Model unavailable: '+modelName);const source=node?asset.scene.getObjectByName(node):asset.scene;if(!source)throw Error('Model node unavailable: '+modelName+'/'+node);const object=cloneSkeleton(source),group=new THREE.Group();group.add(object);group.userData.glbAsset=modelName+'.glb';group.traverse(child=>{child.userData.glbAsset=modelName+'.glb';if(child instanceof THREE.Mesh){child.castShadow=true;child.receiveShadow=true;}});return group;}
 /** @param {string} model @param {string[]} names */
 template(model,names){const asset=this.models.get(model);const found=names.find(name=>asset?.scene.getObjectByName(name));return this.clone(model,found);}
 createLandscape(){
  const terrain=this.clone('terrain');this.landscape.add(terrain);
  const random=(/** @type {number} */i)=>(Math.sin(i*127.1+311.7)*43758.5453)%1;
  for(let i=0;i<26;i++){const angle=i/26*Math.PI*2,radius=18+Math.abs(random(i))*.9;const tree=this.template('vegetation',i%3===0?['banana','banana_tree']:['palm','palm_tree','tree']);tree.position.set(Math.cos(angle)*radius*1.14,0,Math.sin(angle)*radius*.93);tree.rotation.y=i*2.31;tree.scale.setScalar(.75+Math.abs(random(i+32))*.4);tree.userData.environment=true;this.landscape.add(tree);}
  for(let i=0;i<42;i++){const clump=this.template('vegetation',['grass','grass_clump']);clump.position.set(-21+Math.abs(random(i+7))*42,.01,-17+Math.abs(random(i+81))*34);if(clump.position.x>-17&&clump.position.x<14&&clump.position.z>-10&&clump.position.z<7)continue;clump.rotation.y=i;clump.scale.setScalar(.6+Math.abs(random(i+57))*.7);this.landscape.add(clump);}
 }
 /** @param {THREE.Group} group @param {string} id */
 bind(group,id){group.userData.entityId=id;group.traverse(child=>{child.userData.entityId=id;});this.entities.set(id,group);this.scene.add(group);}
 /** @param {import('./engine.js').State} state @param {Layout} layout */
 sync(state,layout){
  if(!this.models.size||this.models.size<9)return;
  const key=state.revision+':'+layout.revision;if(key===this.stateKey)return;this.stateKey=key;
  const owned=new Set(layout.items.map(item=>item.id));for(const [id,group]of this.entities){if(!owned.has(id)&&!id.startsWith('cow.')){this.discard(group);this.entities.delete(id);}}
  for(const item of layout.items){let group=this.entities.get(item.id);if(!group){group=this.itemModel(item);this.bind(group,item.id);}group.position.set(item.x,0,item.z);group.rotation.y=item.rotation;
   if(item.kind==='bed'){const plot=state.plots.find(p=>p.id===Number(item.id.split('.')[1]));const cropKey=plot?.crop?plot.crop.type+'_'+plot.crop.stage:'';if(group.userData.cropKey!==cropKey){const old=group.getObjectByName('crop_instance');if(old)this.discard(old);if(cropKey){const crops=new THREE.Group();crops.name='crop_instance';const count=plot?.crop?.type==='corn'?4:6;for(let n=0;n<count;n++){const plant=this.clone('crops',cropKey);plant.position.set((n%2-.5)*.57,.12,(Math.floor(n/2)-(Math.ceil(count/2)-1)/2)*.48);plant.rotation.y=n*2.2;crops.add(plant);}group.add(crops);}group.userData.cropKey=cropKey;}}
   if(item.kind==='pump')group.visible=state.pump.built;
   if(item.kind==='barn'){this.barnItem=item;this.barnFill.position.set(item.x,2,item.z);group.userData.started=!!state.cow?.visited;}
  }
  const cows=state.cow?.visited?state.cow.cows:[],cowIds=new Set(cows.map(c=>c.id));for(const [id,group]of this.entities){if(id.startsWith('cow.')&&!cowIds.has(id)){const mixer=this.mixers.get(id);mixer?.stopAllAction();mixer?.uncacheRoot(group);this.discard(group);this.entities.delete(id);this.mixers.delete(id);}}
  if(this.barnItem){const barn=this.barnItem;for(let i=0;i<cows.length;i++){const cow=cows[i];let group=this.entities.get(cow.id);if(!group){group=this.clone('cow');this.bind(group,cow.id);const clips=this.models.get('cow')?.animations||[];if(clips.length){const mixer=new THREE.AnimationMixer(group),clip=clips.find(c=>c.name==='idle')||clips[0];mixer.clipAction(clip).play();mixer.setTime(i*.72);this.mixers.set(cow.id,mixer);}}const offset=v(i===1?3.1:-3.1,0,i===2?1.7:-1.1).applyAxisAngle(v(0,1,0),barn.rotation);group.position.set(barn.x+offset.x,.07,barn.z+offset.z);group.rotation.y=barn.rotation-Math.PI/2;}}
  const day=state.tick%24;this.sun.intensity=day<5||day>19?1.1:3.2;this.renderer.toneMappingExposure=day<5||day>19?.83:1.05;this.setInterior(this.interior);this.markSelection();
 }
 /** @param {PlacedItem} item */
 itemModel(item){if(item.kind==='bed')return this.clone('bed');if(item.kind==='barn')return this.clone('barn');if(item.kind==='path')return this.clone('path');if(item.kind==='fence')return this.clone('fence');if(item.kind==='tree')return this.template('vegetation',['palm','palm_tree','tree']);if(item.kind==='banana')return this.template('vegetation',['banana','banana_tree']);if(item.kind==='grass')return this.template('vegetation',['grass','grass_clump']);if(item.kind==='pump')return this.template('props',['pump','water_pump']);return this.template('props',[item.kind,'pail','milk_pail']);}
 /** @param {boolean} value */
 setInterior(value){this.interior=value;const barn=this.entities.get('barn');if(barn){barn.traverse(node=>{if(node.name==='roof'||node.name.startsWith('roof_'))node.visible=!value;});}this.controls.minDistance=value?1.3:3;this.controls.maxDistance=value?11:64;this.controls.maxPolarAngle=Math.PI*(value?.495:.48);this.camera.fov=value?54:43;this.camera.updateProjectionMatrix();}
 /** @param {string} id */
 select(id){this.selected=id;this.markSelection();}
 markSelection(){for(const [id,group]of this.entities){group.traverse(node=>{if(!(node instanceof THREE.Mesh))return;const materials=Array.isArray(node.material)?node.material:[node.material];for(let i=0;i<materials.length;i++){let material=materials[i];if(!(material instanceof THREE.MeshStandardMaterial))continue;if(!node.userData.selectionMaterial){const clones=materials.map(m=>{const copy=m.clone();this.ownedMaterials.add(copy);return copy;});node.material=Array.isArray(node.material)?clones:clones[0];node.userData.selectionMaterial=true;node.userData.ownedMaterials=true;material=clones[i];}if(material instanceof THREE.MeshStandardMaterial){material.emissive.set(id===this.selected?'#a6b851':'#000000');material.emissiveIntensity=id===this.selected?.14:0;}}});}}
 /** Release instance-owned materials; source geometry/textures remain shared. @param {THREE.Object3D} object */
 discard(object){object.removeFromParent();object.traverse(node=>{if(node instanceof THREE.Mesh&&node.userData.ownedMaterials){for(const material of Array.isArray(node.material)?node.material:[node.material]){material.dispose();this.ownedMaterials.delete(material);}node.userData.ownedMaterials=false;}});}
 /** @param {string} target */
 focus(target){
  if(!this.previousView)this.previousView={target:this.controls.target.clone(),position:this.camera.position.clone(),id:this.currentView};this.currentView=target;
  this.setInterior(target==='interior'||target.startsWith('cow.'));let point=v(-1,.5,0),offset=v(28,25,31);
  if(target==='garden'){point=v(-10,.5,-3);offset=v(9,12,14);}
  else if(target==='barn'||target==='interior'){const item=this.barnItem||{x:7,z:-4,rotation:0};point=v(item.x,target==='interior'?1.15:1,item.z).add(v(0,0,target==='interior'?-1.7:0).applyAxisAngle(v(0,1,0),item.rotation));offset=(target==='interior'?v(.3,1.45,5):v(12,9,14)).applyAxisAngle(v(0,1,0),item.rotation);}
  else if(this.entities.has(target)){const group=/** @type {THREE.Group} */(this.entities.get(target));point=group.position.clone().add(v(0,.6,0));offset=target.startsWith('cow.')?v(3,2.2,3):v(4,5,6);}
  this.moveCamera(point,point.clone().add(offset));
 }
 /** @param {THREE.Vector3} target @param {THREE.Vector3} position */
 moveCamera(target,position){if(matchMedia('(prefers-reduced-motion: reduce)').matches){this.controls.target.copy(target);this.camera.position.copy(position);this.controls.update();this.transition=null;return;}this.transition={target,position,fromTarget:this.controls.target.clone(),fromPosition:this.camera.position.clone(),start:performance.now()};}
 back(){if(this.previousView){const view=this.previousView;this.setInterior(view.id==='interior'||view.id.startsWith('cow.'));this.moveCamera(view.target,view.position);this.previousView=null;this.currentView=view.id;return view.id;}this.focus('overview');return 'overview';}
 /** @param {number} factor */
 zoom(factor){const offset=this.camera.position.clone().sub(this.controls.target);offset.setLength(clamp(offset.length()*factor,this.controls.minDistance,this.controls.maxDistance));this.camera.position.copy(this.controls.target).add(offset);this.controls.update();}
 /** @param {number} angle */
 rotate(angle){const offset=this.camera.position.clone().sub(this.controls.target).applyAxisAngle(v(0,1,0),angle);this.camera.position.copy(this.controls.target).add(offset);this.controls.update();}
 /** @param {PlacedItem|null} item */
 preview(item){if(this.ghost){this.discard(this.ghost);this.ghost=null;}this.placing=!!item;if(!item)return;const ghost=this.itemModel(item);ghost.position.set(item.x,.04,item.z);ghost.rotation.y=item.rotation;ghost.traverse(node=>{if(node instanceof THREE.Mesh){const materials=(Array.isArray(node.material)?node.material:[node.material]).map(material=>{const copy=material.clone();copy.transparent=true;copy.opacity=.48;copy.depthWrite=false;this.ownedMaterials.add(copy);return copy;});node.material=Array.isArray(node.material)?materials:materials[0];node.userData.ownedMaterials=true;node.castShadow=false;}});this.ghost=ghost;this.scene.add(ghost);}
 /** @param {boolean} valid */
 previewValid(valid){this.ghost?.traverse(node=>{if(node instanceof THREE.Mesh){for(const material of Array.isArray(node.material)?node.material:[node.material])if(material instanceof THREE.MeshStandardMaterial){material.emissive.set(valid?'#55a269':'#c34732');material.emissiveIntensity=.4;}}});}
 /** @param {number} clientX @param {number} clientY */
 pick(clientX,clientY){const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((clientX-rect.left)/rect.width*2-1,-(clientY-rect.top)/rect.height*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);if(this.placing){const point=new THREE.Vector3();if(this.raycaster.ray.intersectPlane(this.groundPlane,point))this.options.onPlacement({x:Math.round(point.x*2)/2,z:Math.round(point.z*2)/2});return;}for(const hit of this.raycaster.intersectObjects([...this.entities.values()],true)){if(!hit.object.visible)continue;let parent=hit.object,visible=true;while(parent.parent){if(!parent.visible)visible=false;parent=parent.parent;}if(!visible)continue;const id=hit.object.userData.entityId;if(id){this.options.onSelect(id);return;}}}
 constrainCamera(){this.controls.target.x=clamp(this.controls.target.x,-22,22);this.controls.target.z=clamp(this.controls.target.z,-18,18);this.controls.target.y=clamp(this.controls.target.y,.05,3);this.camera.position.y=Math.max(.3,this.camera.position.y);if(this.barnItem){const item=this.barnItem,origin=v(item.x,0,item.z),local=this.camera.position.clone().sub(origin).applyAxisAngle(v(0,1,0),-item.rotation);if(this.interior){local.x=clamp(local.x,-4.45,4.45);local.z=clamp(local.z,-3.4,3.4);local.y=clamp(local.y,.35,3.25);const target=this.controls.target.clone().sub(origin).applyAxisAngle(v(0,1,0),-item.rotation);target.x=clamp(target.x,-4.3,4.3);target.z=clamp(target.z,-3.2,3.2);this.controls.target.copy(target.applyAxisAngle(v(0,1,0),item.rotation).add(origin));}else if(Math.abs(local.x)<5.25&&Math.abs(local.z)<4.25&&local.y<3.8){if(5.25-Math.abs(local.x)<4.25-Math.abs(local.z))local.x=(Math.sign(local.x)||1)*5.3;else local.z=(Math.sign(local.z)||1)*4.3;}this.camera.position.copy(local.applyAxisAngle(v(0,1,0),item.rotation).add(origin));}}
 /** @param {number} now */
 animate(now){if(this.disposed)return;const delta=Math.min((now-(this.lastTime||now))/1000,.05);this.lastTime=now;if(this.transition){const t=clamp((now-this.transition.start)/650,0,1),ease=1-(1-t)**3;this.camera.position.lerpVectors(this.transition.fromPosition,this.transition.position,ease);this.controls.target.lerpVectors(this.transition.fromTarget,this.transition.target,ease);if(t===1)this.transition=null;}this.controls.update();this.constrainCamera();const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;for(const mixer of this.mixers.values())if(!reduce)mixer.update(delta);if(!document.hidden)this.renderer.render(this.scene,this.camera);this.host.dataset.triangles=String(this.renderer.info.render.triangles);this.host.dataset.drawCalls=String(this.renderer.info.render.calls);this.frame=requestAnimationFrame(t=>this.animate(t));}
 dispose(){if(this.disposed)return;this.disposed=true;cancelAnimationFrame(this.frame);this.abort.abort();this.resizeObserver.disconnect();this.controls.dispose();for(const mixer of this.mixers.values()){mixer.stopAllAction();mixer.uncacheRoot(mixer.getRoot());}const geometries=new Set(),materials=new Set(this.ownedMaterials),textures=new Set(),bitmaps=new Set();const collect=(/** @type {THREE.Object3D} */node)=>{if(node instanceof THREE.Mesh){geometries.add(node.geometry);for(const material of Array.isArray(node.material)?node.material:[node.material]){materials.add(material);for(const value of Object.values(material))if(value instanceof THREE.Texture)textures.add(value);}}};this.scene.traverse(collect);for(const asset of this.models.values())asset.scene.traverse(collect);for(const geometry of geometries)geometry.dispose();for(const material of materials)material.dispose();for(const texture of textures){const source=texture.source?.data;if(typeof source?.close==='function')bitmaps.add(source);texture.dispose();}for(const bitmap of bitmaps)bitmap.close();this.ownedMaterials.clear();this.models.clear();this.mixers.clear();this.renderer.dispose();this.renderer.domElement.remove();}
}
