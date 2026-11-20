import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {clone as cloneSkeleton} from 'three/addons/utils/SkeletonUtils.js';
import {createAnimalAnimation} from './cozy-animation.js';
import {FarmPanorama} from './cozy-panorama.js';
import {CAMERA_PREFERENCE_KEY,cameraViewPreferenceKey,validateCameraPreference,readCameraPreference,writeCameraPreference,readCameraViewPreference,writeCameraViewPreference,resolveCameraPreference} from './cozy-camera-preference.js';
import {CAMERA_RESET_UNDO_PREFIX,readCameraResetUndo,writeCameraResetUndo,sameCameraPose} from './cozy-camera-reset-undo.js';

const v=(/** @type {number} */x,/** @type {number} */y,/** @type {number} */z)=>new THREE.Vector3(x,y,z);
const clamp=THREE.MathUtils.clamp,UP=v(0,1,0);
const BUILDING_SIZES={barn:[10,8,3.5],coop:[9,7,3.2],goatShelter:[11,9,3.8],pond:[12,10,1],market:[7,6,3.6]};
/** @typedef {{target:THREE.Vector3,position:THREE.Vector3,fromTarget:THREE.Vector3,fromPosition:THREE.Vector3,start:number,orbit?:{offset:THREE.Vector3,angle:number,applied:number}}} CameraTransition */
/** A single presentation scene. Every 3D farm mesh comes from a manifest GLB. */
export class CozyWorld{
 /** @param {HTMLElement} host @param {any} options */
 constructor(host,options){
  this.host=host;this.options=options;this.disposed=false;this.cameraPreferenceReady=false;this.cameraInteraction=false;this.cameraPreferenceDirty=false;this.cameraPreferenceSaving=false;this.cameraSaveTimer=0;this.cameraInteractionAt=0;this.cameraPreferenceSignature='';/** @type {string|null} */this.cameraPreferenceRaw=null;this.frame=0;this.lastTime=0;this.selected='';this.currentView='overview';this.interiorId='';this.placing=false;this.key='';this.landLevel=-1;/** @type {THREE.Group|null} */this.landMarkers=null;this.quality='auto';this.modelCount=0;this.loadStarted=performance.now();
  /** @type {Map<string,any>} */this.models=new Map();
  /** @type {Map<string,THREE.Group>} */this.entities=new Map();
  /** @type {Map<string,any>} */this.animals=new Map();
  /** @type {Map<string,any>} */this.items=new Map();this.cropBatches=/** @type {THREE.InstancedMesh[]} */([]);this.cropKey='';this.windMatrix=new THREE.Matrix4();this.windRotation=new THREE.Matrix4();
  /** @type {Set<THREE.Material>} */this.ownedMaterials=new Set();
  /** @type {any[]} */this.history=[];
  /** @type {Map<string,import('./cozy-camera-reset-undo.js').CameraResetUndo>} */this.cameraResetUndos=new Map();
  /** @type {THREE.Group|null} */this.ghost=null;
  /** @type {CameraTransition|null} */this.transition=null;
  /** @type {any} */this.manifest=null;
  /** @type {number[]} */this.frameSamples=[];
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color('#cfdcce');this.scene.fog=new THREE.Fog('#b2bda1',145,360);
  this.camera=new THREE.PerspectiveCamera(43,1,.08,340);this.camera.position.set(42,36,46);
  this.panorama=new FarmPanorama(this.scene,this.camera,this.scene.background,host);
  this.renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});this.renderer.outputColorSpace=THREE.SRGBColorSpace;this.renderer.toneMapping=THREE.ACESFilmicToneMapping;this.renderer.toneMappingExposure=1.06;this.renderer.shadowMap.enabled=true;this.renderer.shadowMap.type=THREE.PCFShadowMap;
  this.renderer.domElement.setAttribute('aria-label','Farm tropis 3D / Three-dimensional tropical farm');this.renderer.domElement.tabIndex=0;host.append(this.renderer.domElement);this.setQuality('auto');
  this.controls=new OrbitControls(this.camera,this.renderer.domElement);this.controls.target.set(0,.7,0);this.controls.enableDamping=true;this.controls.dampingFactor=.085;this.controls.minDistance=2;this.controls.maxDistance=170;this.controls.minPolarAngle=.12;this.controls.maxPolarAngle=Math.PI*.475;this.controls.screenSpacePanning=false;this.controls.zoomSpeed=.8;this.controls.rotateSpeed=.65;this.controls.addEventListener('start',()=>{this.transition=null;this.beginCameraInteraction();});this.controls.addEventListener('change',()=>this.queueCameraPreference());this.controls.addEventListener('end',()=>this.flushCameraPreference(true));
  this.hemi=new THREE.HemisphereLight('#e8f1ff','#aaa082',1.6);this.scene.add(this.hemi);this.sun=new THREE.DirectionalLight('#fff1d8',3.1);this.sun.position.set(-24,38,20);this.sun.castShadow=true;this.sun.shadow.mapSize.set(2048,2048);Object.assign(this.sun.shadow.camera,{left:-44,right:44,top:35,bottom:-35,near:1,far:130});this.sun.shadow.normalBias=.045;this.sun.shadow.bias=-.00012;this.scene.add(this.sun);
  this.fill=new THREE.PointLight('#ffe6b7',12,15,2);this.scene.add(this.fill);this.landscape=new THREE.Group();this.scene.add(this.landscape);
  this.raycaster=new THREE.Raycaster();this.pointer=new THREE.Vector2();this.groundPlane=new THREE.Plane(UP,0);this.abort=new AbortController();this.down={x:Infinity,y:Infinity};const canvas=this.renderer.domElement;
  canvas.addEventListener('pointerdown',e=>{this.down={x:e.clientX,y:e.clientY};},{signal:this.abort.signal});
  // Picking on final click prevents a touch compatibility click landing on a
  // newly scrolled HTML action. Camera drags never dispatch farm commands.
  canvas.addEventListener('click',e=>{if(e.button===0&&Math.hypot(e.clientX-this.down.x,e.clientY-this.down.y)<7)this.pick(e.clientX,e.clientY);},{signal:this.abort.signal});
  canvas.addEventListener('pointercancel',()=>{this.down={x:Infinity,y:Infinity};},{signal:this.abort.signal});
  canvas.addEventListener('keydown',e=>{if(e.key==='Home'){e.preventDefault();this.focus('overview');this.options.onCameraView?.('overview');}else if(e.key==='+'||e.key==='='){e.preventDefault();this.zoom(.82);}else if(e.key==='-'){e.preventDefault();this.zoom(1.22);}else if(e.key==='ArrowLeft'){e.preventDefault();this.rotate(-Math.PI/8);}else if(e.key==='ArrowRight'){e.preventDefault();this.rotate(Math.PI/8);}else if(e.key==='Escape')this.options.onCameraView?.(this.back());},{signal:this.abort.signal});
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(host);this.resize();
  document.addEventListener('visibilitychange',()=>{if(document.hidden)this.flushCameraPreference();},{signal:this.abort.signal});
  window.addEventListener('storage',event=>this.cameraPreferenceChanged(event),{signal:this.abort.signal});
  // Expanding below-scene controls changes the host size, not the chosen view.
  let windowWidth=window.innerWidth;window.addEventListener('resize',()=>{this.resize();const widthChanged=window.innerWidth!==windowWidth;windowWidth=window.innerWidth;if(widthChanged&&this.currentView==='overview'&&this.items.size)this.focus('overview',false);},{signal:this.abort.signal});
 }
 async load(){
  const response=await fetch('/play/assets/models/world-manifest.json',{cache:'no-cache'});if(!response.ok)throw Error('Manifest unavailable');this.manifest=await response.json();const assets=this.manifest.assets,loader=new GLTFLoader(),names=Object.keys(assets);this.modelCount=names.length+names.filter(n=>assets[n].lod?.far).length;let ready=0;
  // The terrain and core garden are decoded first; the same cache owns all
  // models. Bounded workers avoid simultaneous texture decode spikes.
  const ordered=['terrain','bed','crops','barn','cow',...names.filter(n=>!['terrain','bed','crops','barn','cow'].includes(n)),...names.filter(n=>assets[n].lod?.far).map(n=>n+':far')];let index=0;
  await Promise.all(Array.from({length:3},async()=>{while(index<ordered.length){const name=ordered[index++],entry=name.endsWith(':far')?assets[name.slice(0,-4)].lod.far:assets[name];if(!entry)continue;const model=await loader.loadAsync(entry.url+'?v='+entry.sha256.slice(0,16));if(this.disposed){this.releaseModel(model);continue;}this.models.set(name,model);this.options.onProgress(++ready,this.modelCount);}}));
  if(this.disposed)return;this.createLandscape();this.host.dataset.modelsReady='true';this.host.dataset.models=String(this.models.size);this.host.dataset.glbOnly='true';this.host.dataset.loadMs=String(Math.round(performance.now()-this.loadStarted));this.frame=requestAnimationFrame(t=>this.animate(t));
 }
 /** @param {string} view */
 cameraItem(view){const id=view.startsWith('inside:')?view.slice(7):view;return this.items.get(id)||this.animals.get(id)?.item;}
 cameraSnapshot(){
  const round=(/** @type {number} */n)=>Math.round(n*1e6)/1e6,item=this.cameraItem(this.currentView);
  return validateCameraPreference({version:1,view:this.currentView,position:this.camera.position.toArray().map(round),target:this.controls.target.toArray().map(round),fov:round(this.camera.fov),zoom:round(this.camera.zoom),anchor:item?{id:item.id,x:round(item.x),z:round(item.z),rotation:round(item.rotation)}:null,changedAt:this.cameraInteractionAt});
 }
 finishCameraTransition(){if(this.transition){this.camera.position.copy(this.transition.position);this.controls.target.copy(this.transition.target);this.transition=null;}}
 /** @param {string} view */
 savedCameraView(view){
  try{const area=readCameraViewPreference(localStorage,view).value,last=readCameraPreference(localStorage).value;
   return last?.view===view&&(!area||last.changedAt>area.changedAt)?last:area;
  }catch{return null;}
 }
 /** @param {string} view @param {import('./cozy-camera-preference.js').CameraPreference|null} [saved] */
 restoreCameraView(view,saved=this.savedCameraView(view)){
  if(!saved||saved.view!==view||!resolveCameraPreference(saved,id=>this.cameraItem(id)).applyPose)return false;
  this.camera.fov=saved.fov;this.camera.zoom=saved.zoom;this.camera.updateProjectionMatrix();
  this.moveCamera(v(.../** @type {[number,number,number]} */(saved.target)),v(.../** @type {[number,number,number]} */(saved.position)));
  this.host.dataset.cameraViewRestored='exact';return true;
 }
 /** Preserve the outgoing destination before changing its context, including a legacy-only pose. */
 rememberCameraView(){
  if(!this.cameraPreferenceReady)return;this.flushCameraPreference();this.finishCameraTransition();
  try{if(!readCameraViewPreference(localStorage,this.currentView).value)writeCameraViewPreference(localStorage,this.savedCameraView(this.currentView)||this.cameraSnapshot());}catch{/* Optional UI storage. */}
 }
 /** @param {StorageEvent} event */
 cameraPreferenceChanged(event){
  if(event.key===null||event.key.startsWith(CAMERA_RESET_UNDO_PREFIX)){if(event.newValue===null){if(event.key===null)this.cameraResetUndos?.clear();else this.cameraResetUndos?.delete(event.key.slice(CAMERA_RESET_UNDO_PREFIX.length));}this.updateCameraUndoState();return;}
  if(event.newValue===event.oldValue)return;
  if(event.key===CAMERA_PREFERENCE_KEY)this.cameraPreferenceRaw=event.newValue;
  else if(event.key!==cameraViewPreferenceKey(this.currentView))return;
  let incoming=null;try{incoming=validateCameraPreference(JSON.parse(event.newValue||'null'));}catch{/* Invalid optional preference. */}
  // Another area must not cancel a pending save for this area's camera.
  if(!incoming||incoming.view!==this.currentView)return;
  if(this.cameraPreferenceDirty&&this.cameraInteractionAt>incoming.changedAt)return;
  window.clearTimeout(this.cameraSaveTimer);this.cameraPreferenceDirty=false;this.cameraInteraction=false;this.cameraInteractionAt=Math.max(this.cameraInteractionAt,incoming.changedAt);this.cameraPreferenceSignature='';
 }
 restoreCameraPreference(){
  if(this.disposed)return null;
  const hadInput=this.cameraInteraction;let saved=null;try{const record=readCameraPreference(localStorage);saved=record.value;if(saved)saved=this.savedCameraView(saved.view)||saved;if(!hadInput){this.cameraPreferenceRaw=record.raw;this.cameraInteractionAt=saved?.changedAt||0;}}catch{/* Optional UI storage. */}
  let restored=null;
  if(saved&&!hadInput){
   const resolution=resolveCameraPreference(saved,id=>this.cameraItem(id));this.focus(resolution.view,false);this.finishCameraTransition();
   if(resolution.applyPose){this.camera.position.fromArray(saved.position);this.controls.target.fromArray(saved.target);this.camera.fov=saved.fov;this.camera.zoom=saved.zoom;}
   const damping=this.controls.enableDamping;this.controls.enableDamping=false;this.controls.update();this.controls.enableDamping=damping;this.constrainCamera();this.camera.lookAt(this.controls.target);this.camera.updateProjectionMatrix();
   restored=resolution.view;this.host.dataset.cameraRestored=resolution.applyPose?'exact':'refocused';
  }else this.host.dataset.cameraRestored=hadInput?'new-input':'none';
  this.cameraPreferenceReady=true;this.cameraPreferenceSignature=JSON.stringify(this.cameraSnapshot());this.host.dataset.cameraState=this.cameraPreferenceSignature;
  if(hadInput){this.cameraPreferenceDirty=true;this.queueCameraPreference();}
  this.updateCameraUndoState();return restored;
 }
 beginCameraInteraction(){
  this.cameraInteraction=true;let observedAt=0;try{const record=readCameraPreference(localStorage);this.cameraPreferenceRaw=record.raw;observedAt=record.value?.changedAt||0;}catch{/* Optional UI storage. */}this.cameraInteractionAt=Math.max(Date.now(),performance.timeOrigin+performance.now(),this.cameraInteractionAt+.001,observedAt+.001);
  if(this.cameraPreferenceReady){this.cameraPreferenceDirty=true;this.queueCameraPreference();}
 }
 queueCameraPreference(){
  if(!this.cameraPreferenceReady||!this.cameraInteraction||this.cameraPreferenceSaving||this.disposed)return;
  this.cameraPreferenceDirty=true;window.clearTimeout(this.cameraSaveTimer);this.cameraSaveTimer=window.setTimeout(()=>this.flushCameraPreference(),250);
 }
 /** @param {string} view */
 cameraUndoRecord(view){
  this.cameraResetUndos??=new Map();let stored={raw:/** @type {string|null} */(null),value:/** @type {import('./cozy-camera-reset-undo.js').CameraResetUndo|null} */(null),available:false};
  try{stored=readCameraResetUndo(localStorage,view);}catch{/* Optional UI storage. */}
  const memory=this.cameraResetUndos.get(view);return{...stored,value:memory&&(!stored.value||memory.changedAt>stored.value.changedAt)?memory:stored.value};
 }
 canUndoCameraReset(){if(this.disposed||!this.cameraPreferenceReady)return false;const record=this.cameraUndoRecord(this.currentView).value;if(!record?.before||record.version===2&&record.state!=='reset')return false;const resolution=resolveCameraPreference(record.before,id=>this.cameraItem(id));return resolution.view===this.currentView&&resolution.applyPose;}
 canRedoCameraReset(){if(this.disposed||!this.cameraPreferenceReady)return false;const record=this.cameraUndoRecord(this.currentView).value;if(record?.version!==2||record.state!=='undone')return false;return[record.before,record.reset].every(saved=>{if(!saved)return true;const resolution=resolveCameraPreference(saved,id=>this.cameraItem(id));return resolution.view===this.currentView&&resolution.applyPose;});}
 updateCameraUndoState(){const available=this.canUndoCameraReset(),redo=this.canRedoCameraReset();this.host.dataset.cameraUndoAvailable=String(available);this.host.dataset.cameraRedoAvailable=String(redo);this.options?.onCameraUndoChange?.(available);this.options?.onCameraRedoChange?.(redo);return available;}
 /** @param {import('./cozy-camera-reset-undo.js').CameraResetUndo} record @param {string|null} expectedRaw @param {boolean} [consume] */
 saveCameraUndo(record,expectedRaw,consume=false){
  let result=/** @type {ReturnType<typeof writeCameraResetUndo>} */('unavailable');try{result=writeCameraResetUndo(localStorage,record,expectedRaw,consume);}catch{/* Keep undo usable in this session when storage is unavailable. */}
  if(result==='stored'||result==='unavailable'){this.cameraResetUndos??=new Map();this.cameraResetUndos.set(record.view,record);return true;}return false;
 }
 /** @param {string} view @param {import('./cozy-camera-preference.js').CameraPreference|null} [saved] */
 applyImmediateCamera(view,saved=null){
  window.clearTimeout(this.cameraSaveTimer);this.cameraSaveTimer=0;const damping=this.controls.enableDamping;this.cameraPreferenceSaving=true;
  try{this.transition=null;this.controls.enableDamping=false;this.controls.update();this.focus(view,false);this.finishCameraTransition();if(saved){this.camera.position.fromArray(saved.position);this.controls.target.fromArray(saved.target);this.camera.fov=saved.fov;this.camera.zoom=saved.zoom;}this.controls.update();this.constrainCamera();this.camera.lookAt(this.controls.target);this.camera.updateProjectionMatrix();}finally{this.controls.enableDamping=damping;this.cameraPreferenceSaving=false;}
 }
 /** @param {string} view @param {import('./cozy-camera-preference.js').CameraPreference|null} snapshot */
 updateCameraHistory(view,snapshot){for(const previous of this.history)if(previous.id===view){previous.preference=snapshot;previous.target=this.controls.target.clone();previous.position=this.camera.position.clone();previous.interior=this.interiorId;previous.fov=this.camera.fov;previous.zoom=this.camera.zoom;}}
 /** Reset only the active view, retaining one useful pre-reset pose for this area. */
 resetCamera(){
  if(this.disposed||!this.cameraPreferenceReady)return this.currentView;
  this.finishCameraTransition();this.constrainCamera();
  const current=this.cameraSnapshot(),view=current?resolveCameraPreference(current,id=>this.cameraItem(id)).view:this.currentView;
  const previous=this.cameraUndoRecord(view);this.beginCameraInteraction();this.cameraInteractionAt=Math.max(this.cameraInteractionAt,(previous.value?.changedAt||0)+.001);this.applyImmediateCamera(view);
  const reset=this.cameraSnapshot();
  if(current&&current.view===view){const changed=!sameCameraPose(current,reset),record=previous.value,before=changed?current:record?.version===2&&record.state==='undone'&&this.canRedoCameraReset()?record.before:null;if(before)this.saveCameraUndo({version:2,view,before,reset,state:'reset',changedAt:this.cameraInteractionAt},previous.raw);}
  this.updateCameraHistory(view,reset);
  this.cameraPreferenceDirty=true;this.flushCameraPreference();this.host.dataset.cameraViewRestored='reset';this.host.dataset.cameraState=JSON.stringify(this.cameraSnapshot());
  this.updateCameraUndoState();return view;
 }
 /** Restore only the active area's pre-reset pose; retain its reset as redo. */
 undoCameraReset(){
  if(!this.canUndoCameraReset()){this.updateCameraUndoState();return null;}
  const view=this.currentView,record=this.cameraUndoRecord(view);if(!record.value?.before)return null;
  const before=record.value.before;this.beginCameraInteraction();this.cameraInteractionAt=Math.max(this.cameraInteractionAt,record.value.changedAt+.001);
  if(!this.saveCameraUndo({version:2,view,before,reset:record.value.version===2?record.value.reset:null,state:'undone',changedAt:this.cameraInteractionAt},record.raw,true)){window.clearTimeout(this.cameraSaveTimer);this.cameraSaveTimer=0;this.cameraPreferenceDirty=false;this.cameraInteraction=false;this.updateCameraUndoState();return null;}
  this.applyImmediateCamera(view,before);this.updateCameraHistory(view,this.cameraSnapshot());this.cameraPreferenceDirty=true;this.flushCameraPreference();this.host.dataset.cameraViewRestored='undo-reset';this.host.dataset.cameraState=JSON.stringify(this.cameraSnapshot());this.updateCameraUndoState();return view;
 }
 /** Reapply only the active area's undone reset, keeping Undo available again. */
 redoCameraReset(){
  if(!this.canRedoCameraReset()){this.updateCameraUndoState();return null;}
  const view=this.currentView,record=this.cameraUndoRecord(view);if(record.value?.version!==2||record.value.state!=='undone')return null;
  this.beginCameraInteraction();this.cameraInteractionAt=Math.max(this.cameraInteractionAt,record.value.changedAt+.001);
  if(!this.saveCameraUndo({...record.value,state:'reset',changedAt:this.cameraInteractionAt},record.raw,true)){window.clearTimeout(this.cameraSaveTimer);this.cameraSaveTimer=0;this.cameraPreferenceDirty=false;this.cameraInteraction=false;this.updateCameraUndoState();return null;}
  this.applyImmediateCamera(view,record.value.reset);this.updateCameraHistory(view,this.cameraSnapshot());this.cameraPreferenceDirty=true;this.flushCameraPreference();this.host.dataset.cameraViewRestored='redo-reset';this.host.dataset.cameraState=JSON.stringify(this.cameraSnapshot());this.updateCameraUndoState();return view;
 }
 /** @param {boolean} [keepTracking] */
 flushCameraPreference(keepTracking=false){
  window.clearTimeout(this.cameraSaveTimer);this.cameraSaveTimer=0;
  if(!this.cameraPreferenceReady||!this.cameraPreferenceDirty||this.cameraPreferenceSaving)return;
  this.cameraPreferenceSaving=true;
  try{
   this.finishCameraTransition();this.controls.update();this.constrainCamera();this.camera.lookAt(this.controls.target);this.camera.updateProjectionMatrix();
   const snapshot=this.cameraSnapshot(),raw=JSON.stringify(snapshot);this.cameraPreferenceDirty=false;this.cameraInteraction=false;
   if(snapshot&&raw!==this.cameraPreferenceSignature){let stored=false,areaStored=false;try{areaStored=writeCameraViewPreference(localStorage,snapshot);stored=writeCameraPreference(localStorage,snapshot,this.cameraPreferenceRaw);}catch{/* Optional UI storage. */}
    this.cameraPreferenceSignature=areaStored?raw:'';if(stored)this.cameraPreferenceRaw=raw;if(areaStored)this.host.dataset.cameraSaved='true';
   }
  }finally{this.cameraPreferenceSaving=false;if(keepTracking&&this.cameraPreferenceReady&&!this.disposed){this.cameraInteraction=true;this.cameraPreferenceDirty=true;this.queueCameraPreference();}}
 }
 resize(){const rect=this.host.getBoundingClientRect();if(rect.width<1||rect.height<1)return;this.camera.aspect=rect.width/rect.height;this.camera.updateProjectionMatrix();this.renderer.setSize(rect.width,rect.height,false);}
 /** @param {string} quality */
 setQuality(quality){this.quality=quality;const ratio=quality==='high'?2:quality==='balanced'?1:Math.min(window.devicePixelRatio||1,1.5);this.renderer.setPixelRatio(ratio);this.host.dataset.quality=quality;if(this.controls)this.resize();}
 /** @param {string} name @param {string} [node] */
 clone(name,node){const asset=this.models.get(name);if(!asset)throw Error('Missing GLB: '+name);const source=node?asset.scene.getObjectByName(node):asset.scene;if(!source)throw Error('Missing GLB template: '+name+'/'+node);const roots=/** @type {THREE.Object3D[]} */([]),group=new THREE.Group(),far=this.models.get(name+':far'),farSource=node?far?.scene.getObjectByName(node):far?.scene;const make=(/** @type {THREE.Object3D} */root,/** @type {string} */url)=>{const object=cloneSkeleton(root);roots.push(object);object.traverse(child=>{child.userData.glbAsset=url;if(child instanceof THREE.Mesh){child.castShadow=true;child.receiveShadow=true;}});return object;};if(farSource){const lod=new THREE.LOD();lod.addLevel(make(source,this.manifest.assets[name].url),0);lod.addLevel(make(farSource,this.manifest.assets[name].lod.far.url),this.manifest.assets[name].lod.far.distance||28);group.add(lod);}else group.add(make(source,this.manifest.assets[name].url));group.userData.glbAsset=this.manifest.assets[name].url;group.userData.animationRoots=roots;return group;}
 /** @param {string} name @param {string[]} nodes */
 template(name,nodes){const source=this.models.get(name)?.scene;const node=nodes.find(n=>source?.getObjectByName(n));if(!node)throw Error('Missing template '+name+'/'+nodes.join(','));return this.clone(name,node);}
 /** Instance repeated scenery directly from loaded GLB meshes. @param {string} model @param {string} node @param {THREE.Matrix4[]} transforms */
 instanceScenery(model,node,transforms){const root=(this.models.get(model+':far')||this.models.get(model))?.scene.getObjectByName(node);if(!root||!transforms.length)return;root.updateWorldMatrix(true,true);const baseInv=root.matrixWorld.clone().invert();root.traverse((/** @type {THREE.Object3D} */child)=>{if(!(child instanceof THREE.Mesh))return;const inst=new THREE.InstancedMesh(child.geometry,child.material,transforms.length);inst.userData.glbAsset=this.models.has(model+':far')?this.manifest.assets[model].lod.far.url:this.manifest.assets[model].url;inst.castShadow=true;inst.receiveShadow=true;const local=baseInv.clone().multiply(child.matrixWorld);for(let i=0;i<transforms.length;i++)inst.setMatrixAt(i,transforms[i].clone().multiply(local));inst.computeBoundingSphere();this.landscape.add(inst);});}
 createLandscape(){
  const terrain=this.clone('terrain'),surroundName=this.manifest.assets.terrain.roles?.surround;
  const surround=surroundName?terrain.getObjectByName(surroundName):null;
  if(surround instanceof THREE.Mesh){
   surround.castShadow=false;
   // Blend with the panorama before transparent details on the farm.
   surround.renderOrder=-1;
  }
  this.landscape.add(terrain);
  const matrix=(/** @type {number} */x,/** @type {number} */z,/** @type {number} */r,/** @type {number} */s)=>new THREE.Matrix4().compose(v(x,0,z),new THREE.Quaternion().setFromAxisAngle(UP,r),v(s,s,s));const palm=/** @type {THREE.Matrix4[]} */([]),banana=/** @type {THREE.Matrix4[]} */([]),grass=/** @type {THREE.Matrix4[]} */([]);
  for(let i=0;i<38;i++){const angle=i/38*Math.PI*2,x=Math.cos(angle)*(39.5+(i%3)*.6),z=Math.sin(angle)*(29+(i%4)*.5);(i%3? palm:banana).push(matrix(x,z,i*2.37,.8+(i%5)*.07));}
  for(let i=0;i<100;i++){const x=-42+((i*37.51)%84),z=-32+((i*29.71)%64);if(Math.abs(x)<30&&Math.abs(z)<25)continue;grass.push(matrix(x,z,i*.73,.6+(i%7)*.08));}
  this.instanceScenery('vegetation','palm',palm);this.instanceScenery('vegetation','banana',banana);this.instanceScenery('vegetation','grass',grass);
 }
 /** @param {number} level */
 syncLand(level){if(this.landLevel===level)return;this.landLevel=level;if(this.landMarkers)this.discard(this.landMarkers);this.landMarkers=new THREE.Group();const bounds=[{x:28,z:24},{x:35,z:28},{x:42,z:32}][level];for(const sx of [-1,1])for(const sz of [-1,1]){const horizontal=this.clone('fence');horizontal.position.set(sx*(bounds.x-1),0,sz*bounds.z);this.landMarkers.add(horizontal);const vertical=this.clone('fence');vertical.position.set(sx*bounds.x,0,sz*(bounds.z-1));vertical.rotation.y=Math.PI/2;this.landMarkers.add(vertical);}this.scene.add(this.landMarkers);}
 /** @param {THREE.Group} group @param {string} id @param {string} [selectId] */
 bind(group,id,selectId=id){group.traverse(child=>{child.userData.entityId=selectId;});group.userData.entityId=selectId;this.entities.set(id,group);this.scene.add(group);}
 /** @param {any} state @param {any} [layout] */
 sync(state,layout=state.layout){if(this.models.size!==this.modelCount||!this.modelCount)return;const key=state.revision+':'+JSON.stringify(layout);if(key===this.key)return;const initial=!this.key;this.key=key;this.syncLand(state.land.level);this.items=new Map(layout.items.map((/** @type {any} */p)=>[p.id,p]));
  const alive=new Set(layout.items.map((/** @type {any} */p)=>p.id));for(const facility of state.facilities)for(const animal of facility.animals)for(let n=0;n<animal.count;n++)alive.add(n===0?animal.id:animal.id+'.member.'+n);
  for(const [id,group]of this.entities)if(!alive.has(id)){this.removeAnimal(id);this.discard(group);this.entities.delete(id);}
  for(const item of layout.items){let group=this.entities.get(item.id);if(!group){group=this.itemModel(item);this.bind(group,item.id);}group.position.set(item.x,0,item.z);group.rotation.y=item.rotation;group.userData.kind=item.kind;
   
   const facility=state.facilities.find((/** @type {any} */f)=>f.id===item.id);if(facility)this.syncFacility(group,facility,item);
  }
  this.syncCrops(state,layout);const hour=state.tick%24,night=hour<5||hour>=20;this.sun.intensity=night?.7:hour<8||hour>=17?2.2:3.15;this.hemi.intensity=night?1.1:1.65;this.sun.color.set(hour<8||hour>=17?'#ffdfad':'#fff2da');this.renderer.toneMappingExposure=night?.85:1.06;const background=/** @type {THREE.Color} */(this.scene.background);background.set(night?'#879baa':'#d6e1ce');/** @type {THREE.Fog} */(this.scene.fog).color.set(night?'#556a67':'#b2bda1');this.panorama.setNight(night);this.setInterior(this.interiorId);this.markSelection();this.audit();this.updateCameraUndoState();if(initial&&!this.cameraInteraction)this.focus('overview',false);
 }
 /** Instance every crop from its GLB template; instance picking keeps bed IDs.
  * @param {any} state @param {any} layout */
 syncCrops(state,layout){const key=JSON.stringify(layout.items.filter((/** @type {any} */p)=>p.kind==='bed'))+state.plots.map((/** @type {any} */p)=>p.id+':'+(p.crop?p.crop.type+'_'+p.crop.stage:'')).join('|');if(key===this.cropKey)return;this.cropKey=key;for(const batch of this.cropBatches){batch.removeFromParent();batch.dispose();}this.cropBatches=[];const families=new Map();let plantCount=0;
  for(const plot of state.plots){if(!plot.crop)continue;const item=layout.items.find((/** @type {any} */p)=>p.id==='bed.'+plot.id);if(!item)continue;const variant=plot.crop.type+'_'+plot.crop.stage,transforms=families.get(variant)||[];const count=plot.crop.type==='corn'?4:6;for(let i=0;i<count;i++){const offset=v((i%2-.5)*.57,.12,(Math.floor(i/2)-(Math.ceil(count/2)-1)/2)*.48).applyAxisAngle(UP,item.rotation).add(v(item.x,0,item.z)),matrix=new THREE.Matrix4().compose(offset,new THREE.Quaternion().setFromAxisAngle(UP,item.rotation+i*2.2),v(1,1,1));transforms.push({matrix,id:item.id,phase:item.x+i*.9});plantCount++;}families.set(variant,transforms);}
  for(const [variant,transforms]of families){const root=this.models.get('crops').scene.getObjectByName(variant);if(!root)throw Error('Missing crop GLB '+variant);root.updateWorldMatrix(true,true);const inverse=root.matrixWorld.clone().invert();root.traverse((/** @type {THREE.Object3D} */child)=>{if(!(child instanceof THREE.Mesh))return;const local=inverse.clone().multiply(child.matrixWorld),batch=new THREE.InstancedMesh(child.geometry,child.material,transforms.length);batch.userData.glbAsset=this.manifest.assets.crops.url;batch.userData.instanceEntities=transforms.map((/** @type {any} */p)=>p.id);batch.userData.transforms=transforms;batch.userData.local=local;batch.castShadow=true;batch.receiveShadow=true;for(let i=0;i<transforms.length;i++)batch.setMatrixAt(i,transforms[i].matrix.clone().multiply(local));batch.computeBoundingBox();batch.computeBoundingSphere();if(batch.boundingSphere)batch.boundingSphere.radius+=.1;this.cropBatches.push(batch);this.scene.add(batch);});}this.host.dataset.cropPlants=String(plantCount);this.host.dataset.cropBatches=String(this.cropBatches.length);
 }
 /** @param {THREE.Group} group @param {any} facility @param {any} item */
 syncFacility(group,facility,item){group.userData.aeratorOn=!!facility.enabled;const bubbles=group.getObjectByName('aerator_bubbles');if(bubbles)bubbles.visible=!!facility.enabled;for(const name of ['feed_contents','feed_surface','water_contents','water_surface','nest_eggs'])group.traverse(child=>{if(child.name===name)child.visible=name==='feed_contents'||name==='feed_surface'?facility.feedG>0:name==='water_contents'||name==='water_surface'?facility.waterMl>0:facility.pending>0;});
  const water=group.getObjectByName('water_surface');if(water)water.traverse(child=>{if(child instanceof THREE.Mesh){const mats=Array.isArray(child.material)?child.material:[child.material];for(const material of mats){if(material instanceof THREE.MeshStandardMaterial){material.transparent=true;material.opacity=.55;material.roughness=.18;material.depthWrite=false;}}}});
  const shown=facility.animals.flatMap((/** @type {any} */animal)=>Array.from({length:animal.count},(_,member)=>({animal,member})));for(let i=0;i<shown.length;i++){const {animal,member}=shown[i],renderId=member===0?animal.id:animal.id+'.member.'+member;const model=animal.species==='chicken'?'chicken':animal.species==='goat'?(animal.growth<.45?'goatKid':'goat'):animal.species==='fish'?'fish':'cow';let entry=this.animals.get(renderId);if(entry&&entry.model!==model){this.removeAnimal(renderId);this.discard(entry.group);this.entities.delete(renderId);entry=null;}
   if(!entry){const clone=this.clone(model);this.bind(clone,renderId,animal.id);const animation=createAnimalAnimation(clone.userData.animationRoots,this.models.get(model).animations),{mixers,actions}=animation;entry={group:clone,animation,mixers,actions,active:'',baseActivity:'idle',model,facilityId:facility.id,index:i,item,override:null};this.animals.set(renderId,entry);for(const mixer of mixers)mixer.setTime(i*.67);}
   entry.item=item;entry.index=i;entry.facilityId=facility.id;entry.group.scale.setScalar(animal.species==='fish'?clamp(Math.cbrt(animal.massG/500),.25,1.4):1);const activity=animal.species==='fish'?'swim':facility.feedG>0&&i%3===0?'eat':'idle';entry.baseActivity=activity;this.setAnimalAction(entry,activity);
   this.placeAnimal(entry,0);
  }
 }
 /** @param {any} entry @param {string} activity */
 setAnimalAction(entry,activity){if(entry.active===activity)return;const next=entry.actions.get(activity)||entry.actions.get('idle');if(!next)return;for(const action of entry.actions.get(entry.active)||[])action.fadeOut(.4);for(const action of next)action.reset().fadeIn(.4).play();entry.active=activity;}
 /** @param {string} facility @param {string} clip */
 activity(facility,clip){for(const entry of this.animals.values())if(entry.facilityId===facility){entry.override={clip,until:performance.now()+6500};this.setAnimalAction(entry,clip);}}
 /** @param {any} entry @param {number} time */
 placeAnimal(entry,time){const {item,index:i,model,group}=entry;let x=0,z=0,y=(this.manifest.assets[item.kind]?.interiorFloorY||0)+.04,heading=0;if(model==='cow'){x=i%2?3.2:-3.2;z=[-2.2,0,2.2][Math.floor(i/2)];y=.038;heading=i%2?Math.PI:0;}else if(model==='chicken'){x=[-2.35,0,2.35][i%3];z=[-1.5,-.4,.95,2.15][Math.floor(i/3)];y=.035;heading=i%3===0?0:i%3===2?Math.PI:i%2?Math.PI/2:-Math.PI/2;}else if(model==='goat'||model==='goatKid'){const anchors=[[-3.15,-3.58,Math.PI],[3.15,-3.58,0],[-3.15,-1.65,Math.PI],[3.15,-1.65,0],[-3.15,-.55,Math.PI],[3.15,-.55,0],[-3.15,.65,Math.PI],[3.15,.65,0],[-3,2,0],[3,2,Math.PI],[-3,3.6,0]];[x,z,heading]=anchors[i]||anchors[0];y=z> -1&&z<1?.379:.342;}else{const angle=time*(.12+(i%5)*.015)+i*2.399;x=Math.cos(angle)*(1.4+(i%7)*.45);z=Math.sin(angle)*(1.1+(i%6)*.38);y=(this.manifest.assets.pond?.fishRootY||.17)+Math.sin(time*.7+i)*.035;heading=-Math.atan2(Math.cos(angle),-Math.sin(angle));}
  if(entry.active==='walk'&&model!=='fish'){x+=Math.sin(time*.7+i)*.025;z+=Math.cos(time*.7+i)*.025;}const offset=v(x,y,z).applyAxisAngle(UP,item.rotation);group.position.set(item.x+offset.x,offset.y,item.z+offset.z);group.rotation.y=item.rotation+heading;
 }
 /** @param {any} item */
 itemModel(item){const kind=item.kind;if(['bed','barn','coop','goatShelter','pond','market','path','fence'].includes(kind))return this.clone(kind);if(kind==='tree')return this.template('vegetation',['palm','palm_tree']);if(kind==='banana')return this.template('vegetation',['banana','banana_tree']);if(kind==='grass')return this.template('vegetation',['grass','grass_clump']);return this.template('props',[kind,kind==='pump'?'water_pump':'crate']);}
 /** @param {string} id @param {boolean} [resetFov] */
 setInterior(id,resetFov=false){const changed=id!==this.interiorId;this.interiorId=id;for(const [key,item]of this.items){if(!['barn','coop','goatShelter','market'].includes(item.kind))continue;this.entities.get(key)?.traverse(node=>{if(node.name==='roof'||node.name.startsWith('roof_'))node.visible=key!==id;});}const item=this.items.get(id);this.fill.visible=!!item;if(item)this.fill.position.set(item.x,2,item.z);this.controls.minDistance=id?1.1:2;this.controls.maxDistance=id?14:170;this.controls.maxPolarAngle=Math.PI*(id?.49:.475);if(changed||resetFov)this.camera.fov=id?54:43;this.camera.updateProjectionMatrix();}
 /** @param {string} id */
 select(id){this.selected=id;this.markSelection();}
 markSelection(){for(const [id,group]of this.entities){const selected=id===this.selected||group.userData.entityId===this.selected;group.traverse(node=>{if(!(node instanceof THREE.Mesh))return;if(selected&&!node.userData.ownedMaterials){const materials=(Array.isArray(node.material)?node.material:[node.material]).map(mat=>{const clone=mat.clone();this.ownedMaterials.add(clone);return clone;});node.material=Array.isArray(node.material)?materials:materials[0];node.userData.ownedMaterials=true;}if(node.userData.ownedMaterials)for(const mat of Array.isArray(node.material)?node.material:[node.material])if(mat instanceof THREE.MeshStandardMaterial){mat.emissive.set(selected?'#a2b761':'#000000');mat.emissiveIntensity=selected?.13:0;}});}}
 /** @param {THREE.Object3D} group */
 discard(group){group.removeFromParent();group.traverse(node=>{if(node instanceof THREE.Mesh&&node.userData.ownedMaterials){for(const mat of Array.isArray(node.material)?node.material:[node.material]){this.ownedMaterials.delete(mat);mat.dispose();}node.userData.ownedMaterials=false;}});}
 /** @param {string} id */
 removeAnimal(id){const entry=this.animals.get(id);if(entry){entry.animation.dispose();this.animals.delete(id);}}
 /** @param {string} target @param {boolean} [remember] */
 focus(target,remember=true){if(remember){this.rememberCameraView();this.beginCameraInteraction();}if(remember&&target!==this.currentView){this.history.push({id:this.currentView,preference:this.cameraSnapshot(),target:this.controls.target.clone(),position:this.camera.position.clone(),interior:this.interiorId,fov:this.camera.fov,zoom:this.camera.zoom});if(this.history.length>15)this.history.shift();}this.currentView=target;this.camera.zoom=1;this.host.dataset.cameraViewRestored='default';const inside=target.startsWith('inside:'),entityId=inside?target.slice(7):target;let item=this.items.get(entityId),point=v(0,.7,0),offset=v(42,36,46);if(this.animals.has(entityId)){const animal=this.animals.get(entityId);item=animal.item;this.setInterior(item.id,true);point=animal.group.position.clone().add(v(0,.6,0));offset=v(2.8,1.7,3.3).applyAxisAngle(UP,item.rotation);}else{this.setInterior(inside?entityId:'',true);if(target==='overview'&&this.items.size){const list=[...this.items.values()].filter(p=>!['tree','banana','grass','fence','path'].includes(p.kind)),xs=list.map(p=>p.x),zs=list.map(p=>p.z),span=Math.max(Math.max(...xs)-Math.min(...xs)+16,Math.max(...zs)-Math.min(...zs)+14);point=v((Math.max(...xs)+Math.min(...xs))/2,.7,(Math.max(...zs)+Math.min(...zs))/2);offset=v(span*.7,span*.62,span*.8).multiplyScalar(Math.max(1.2,1.1/this.camera.aspect));if(this.camera.aspect<.95){this.camera.fov=50;this.camera.updateProjectionMatrix();}}else if(target==='garden'){const beds=[...this.items.values()].filter(p=>p.kind==='bed');if(beds.length)point=beds.reduce((sum,p)=>sum.add(v(p.x,.5,p.z)),v(0,0,0)).multiplyScalar(1/beds.length);offset=v(10,13,16);}else if(item){point=v(item.x,inside?1:0.7,item.z);if(inside)offset=v(.1,1.3,2.8).applyAxisAngle(UP,item.rotation);else{const size=BUILDING_SIZES[/** @type {keyof typeof BUILDING_SIZES} */(item.kind)];offset=(size?v(size[0]*.95,size[0]*.75,size[1]*1.4):v(4,5,6)).applyAxisAngle(UP,item.rotation);}}}this.moveCamera(point,point.clone().add(offset));if(remember&&this.cameraPreferenceReady)this.restoreCameraView(target);this.host.dataset.view=target;this.updateCameraUndoState();}
 /** @param {THREE.Vector3} target @param {THREE.Vector3} position @param {number} [turn] */
 moveCamera(target,position,turn){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){
   this.controls.target.copy(target);this.camera.position.copy(position);this.controls.update();this.transition=null;
   return;
  }
  const fromTarget=this.controls.target.clone(),fromPosition=this.camera.position.clone();
  const orbit=turn===undefined?undefined:{angle:turn,offset:fromPosition.clone().sub(fromTarget),applied:0};
  this.transition={target,position,fromTarget,fromPosition,start:performance.now(),orbit};
 }
 /** @param {number} now */
 advanceCameraTransition(now){
  const transition=this.transition;
  if(!transition)return;
  const orbit=transition.orbit;
  const progress=clamp((now-transition.start)/(orbit?190:650),0,1);
  if(progress===1){this.finishCameraTransition();return;}
  const ease=1-(1-progress)**3;
  if(orbit){
   orbit.applied=orbit.angle*ease;
   this.camera.position.copy(orbit.offset).applyAxisAngle(UP,orbit.applied).add(transition.target);
  }else{
   this.camera.position.lerpVectors(transition.fromPosition,transition.position,ease);
   this.controls.target.lerpVectors(transition.fromTarget,transition.target,ease);
  }
 }
 back(){this.rememberCameraView();this.beginCameraInteraction();const previous=this.history.pop(),id=previous?.id||'overview',saved=this.savedCameraView(id)||previous?.preference||null,view=saved?resolveCameraPreference(saved,itemId=>this.cameraItem(itemId)).view:id;this.focus(view,false);this.restoreCameraView(view,saved);return view;}
 /** @param {number} factor */
 zoom(factor){this.beginCameraInteraction();if(this.transition?.orbit)this.finishCameraTransition();this.transition=null;const offset=this.camera.position.clone().sub(this.controls.target);offset.setLength(clamp(offset.length()*factor,this.controls.minDistance,this.controls.maxDistance));this.camera.position.copy(this.controls.target).add(offset);this.controls.update();this.flushCameraPreference(true);}
 /** @param {number} angle */
 rotate(angle){
  this.beginCameraInteraction();
  // Apply repeated button presses from the visible angle and carry the unfinished turn forward.
  const pending=this.transition?.orbit;
  const turn=angle+(pending?pending.angle-pending.applied:0);
  const target=this.controls.target.clone();
  const position=this.camera.position.clone().sub(target).applyAxisAngle(UP,turn).add(target);
  this.moveCamera(target,position,turn);
  if(!this.transition)this.flushCameraPreference(true);
 }
 /** @param {number} right @param {number} forward */
 pan(right,forward){this.beginCameraInteraction();if(this.transition?.orbit){this.finishCameraTransition();this.camera.lookAt(this.controls.target);}this.transition=null;const amount=Math.max(.15,this.camera.position.distanceTo(this.controls.target)*.055),side=v(1,0,0).applyQuaternion(this.camera.quaternion);side.y=0;side.normalize();const ahead=new THREE.Vector3().crossVectors(UP,side).normalize();const offset=side.multiplyScalar(right*amount).add(ahead.multiplyScalar(forward*amount));this.controls.target.add(offset);this.camera.position.add(offset);this.controls.update();this.constrainCamera();this.flushCameraPreference(true);}
 /** @param {any} item */
 preview(item){if(this.ghost){this.discard(this.ghost);this.ghost=null;}this.placing=!!item;if(!item)return;const ghost=this.itemModel(item);ghost.position.set(item.x,.04,item.z);ghost.rotation.y=item.rotation;ghost.traverse(node=>{if(node instanceof THREE.Mesh){const mats=(Array.isArray(node.material)?node.material:[node.material]).map(mat=>{const clone=mat.clone();clone.transparent=true;clone.opacity=.48;clone.depthWrite=false;this.ownedMaterials.add(clone);return clone;});node.material=Array.isArray(node.material)?mats:mats[0];node.userData.ownedMaterials=true;node.castShadow=false;}});this.ghost=ghost;this.scene.add(ghost);}
 /** @param {boolean} valid */
 previewValid(valid){this.ghost?.traverse(node=>{if(node instanceof THREE.Mesh)for(const mat of Array.isArray(node.material)?node.material:[node.material])if(mat instanceof THREE.MeshStandardMaterial){mat.emissive.set(valid?'#55a269':'#c34732');mat.emissiveIntensity=.4;}});}
 /** @param {number} x @param {number} y */
 pick(x,y){const rect=this.renderer.domElement.getBoundingClientRect();this.pointer.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);this.raycaster.setFromCamera(this.pointer,this.camera);if(this.placing){const point=new THREE.Vector3();if(this.raycaster.ray.intersectPlane(this.groundPlane,point))this.options.onPlacement({x:Math.round(point.x*2)/2,z:Math.round(point.z*2)/2});return;}for(const hit of this.raycaster.intersectObjects([...this.entities.values(),...this.cropBatches],true)){let node=hit.object,visible=true;while(node.parent){if(!node.visible)visible=false;node=node.parent;}const entity=hit.instanceId===undefined?hit.object.userData.entityId:hit.object.userData.instanceEntities?.[hit.instanceId]||hit.object.userData.entityId;if(visible&&entity){this.options.onSelect(entity);return;}}}
 constrainCamera(){this.controls.target.x=clamp(this.controls.target.x,-42,42);this.controls.target.z=clamp(this.controls.target.z,-32,32);this.controls.target.y=clamp(this.controls.target.y,.08,4);this.camera.position.y=Math.max(.32,this.camera.position.y);
  for(const [id,item]of this.items){const size=BUILDING_SIZES[/** @type {keyof typeof BUILDING_SIZES} */(item.kind)];if(!size||item.kind==='pond')continue;const origin=v(item.x,0,item.z),local=this.camera.position.clone().sub(origin).applyAxisAngle(UP,-item.rotation),w=size[0]/2,d=size[1]/2;if(this.interiorId===id){local.x=clamp(local.x,-w+.6,w-.6);local.z=clamp(local.z,-d+.6,d-.6);local.y=clamp(local.y,(this.manifest.assets[item.kind]?.interiorFloorY||0)+.4,size[2]-.35);const target=this.controls.target.clone().sub(origin).applyAxisAngle(UP,-item.rotation);target.x=clamp(target.x,-w+.7,w-.7);target.z=clamp(target.z,-d+.7,d-.7);this.controls.target.copy(target.applyAxisAngle(UP,item.rotation).add(origin));}else if(Math.abs(local.x)<w+.35&&Math.abs(local.z)<d+.35&&local.y<size[2]+.4){if(w-Math.abs(local.x)<d-Math.abs(local.z))local.x=(Math.sign(local.x)||1)*(w+.4);else local.z=(Math.sign(local.z)||1)*(d+.4);}this.camera.position.copy(local.applyAxisAngle(UP,item.rotation).add(origin));}
 }
 audit(){let meshes=0,invalid=0;this.scene.traverse(node=>{if(node instanceof THREE.Mesh&&node!==this.panorama.surface){meshes++;if(!node.userData.glbAsset)invalid++;}});this.host.dataset.meshes=String(meshes);this.host.dataset.nonGlbMeshes=String(invalid);this.host.dataset.materialClones=String(this.ownedMaterials.size);}
 /** @param {number} now */
 animate(now){if(this.disposed)return;const elapsed=now-(this.lastTime||now),delta=Math.min(elapsed/1000,.05);this.lastTime=now;if(!document.hidden&&elapsed>0&&elapsed<1000){this.frameSamples.push(elapsed);if(this.frameSamples.length>180)this.frameSamples.shift();}this.advanceCameraTransition(now);this.controls.update();this.constrainCamera();const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;for(const entry of this.animals.values()){if(!reduce)for(const mixer of entry.mixers)mixer.update(delta);if(!reduce){const phase=(now/1000+entry.index*7)%45,override=entry.override&&now<entry.override.until?entry.override.clip:null,activity=override||(entry.model==='fish'?'swim':phase>34&&entry.actions.has('rest')?'rest':phase>22&&phase<28?'walk':entry.baseActivity);this.setAnimalAction(entry,activity);this.placeAnimal(entry,now/1000);}}if(!reduce){const time=now/1000;for(const batch of this.cropBatches){const transforms=batch.userData.transforms;for(let i=0;i<transforms.length;i++){this.windRotation.makeRotationZ(Math.sin(time*1.1+transforms[i].phase)*.012);this.windMatrix.copy(transforms[i].matrix).multiply(this.windRotation).multiply(batch.userData.local);batch.setMatrixAt(i,this.windMatrix);}batch.instanceMatrix.needsUpdate=true;}for(const group of this.entities.values()){const plants=group.getObjectByName('crop_instance');if(plants)plants.rotation.z=Math.sin(time*1.1+group.position.x)*.012;const aerator=group.getObjectByName('aerator_rotor');if(aerator&&group.userData.aeratorOn)aerator.rotation.x=time*2.2;const water=group.getObjectByName('water_surface');water?.traverse(node=>{if(node instanceof THREE.Mesh){for(const mat of Array.isArray(node.material)?node.material:[node.material])if(mat instanceof THREE.MeshStandardMaterial&&mat.normalMap)mat.normalMap.offset.set(Math.sin(time*.12)*.035,time*.006%1);}});}}
  if(!document.hidden){
   this.panorama.update(now,Boolean(this.interiorId),reduce);
   this.renderer.render(this.scene,this.camera);
   this.panorama.load();
  }
  if(Math.floor(now/1000)!==Math.floor((now-elapsed)/1000)){this.host.dataset.triangles=String(this.renderer.info.render.triangles);this.host.dataset.drawCalls=String(this.renderer.info.render.calls);this.host.dataset.geometries=String(this.renderer.info.memory.geometries);this.host.dataset.textures=String(this.renderer.info.memory.textures);const sorted=[...this.frameSamples].sort((a,b)=>a-b);this.host.dataset.frameMedianMs=sorted.length?sorted[Math.floor(sorted.length/2)].toFixed(2):'0';this.host.dataset.frameP95Ms=sorted.length?sorted[Math.floor(sorted.length*.95)].toFixed(2):'0';this.host.dataset.animationStates=JSON.stringify([...this.animals.values()].reduce((counts,entry)=>{counts[entry.active]=(counts[entry.active]||0)+1;return counts;},/** @type {Record<string,number>} */({})));this.host.dataset.animalModels=String(this.animals.size);let lodNear=0,lodFar=0;this.scene.traverse(node=>{if(node instanceof THREE.LOD){if(node.getCurrentLevel()===0)lodNear++;else lodFar++;}});this.host.dataset.lodNear=String(lodNear);this.host.dataset.lodFar=String(lodFar);this.host.dataset.camera=JSON.stringify({x:+this.camera.position.x.toFixed(2),y:+this.camera.position.y.toFixed(2),z:+this.camera.position.z.toFixed(2)});this.host.dataset.cameraState=JSON.stringify(this.cameraSnapshot());}
  this.frame=requestAnimationFrame(t=>this.animate(t));
 }
 /** @param {any} model */
 releaseModel(model){const geometries=new Set(),materials=new Set(),textures=new Set();model.scene.traverse((/** @type {any} */node)=>{if(node.isMesh){geometries.add(node.geometry);for(const mat of Array.isArray(node.material)?node.material:[node.material]){materials.add(mat);for(const value of Object.values(mat))if(value instanceof THREE.Texture)textures.add(value);}}});for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures){t.source?.data?.close?.();t.dispose();}}
 dispose(){if(this.disposed)return;this.flushCameraPreference();this.cameraPreferenceReady=false;window.clearTimeout(this.cameraSaveTimer);this.disposed=true;cancelAnimationFrame(this.frame);this.abort.abort();this.resizeObserver.disconnect();this.controls.dispose();this.panorama.dispose();for(const id of this.animals.keys())this.removeAnimal(id);for(const mat of this.ownedMaterials)mat.dispose();this.ownedMaterials.clear();for(const model of this.models.values())this.releaseModel(model);this.models.clear();this.entities.clear();this.items.clear();this.history=[];this.scene.traverse(node=>{if(node instanceof THREE.InstancedMesh)node.dispose();});this.cropBatches=[];this.landscape.clear();this.landMarkers?.clear();this.ghost=null;this.scene.clear();this.renderer.dispose();this.renderer.domElement.remove();}
}
