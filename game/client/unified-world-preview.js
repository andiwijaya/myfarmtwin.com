import {Scene,Color,OrthographicCamera,HemisphereLight,DirectionalLight,Mesh,BoxGeometry,MeshLambertMaterial,Group,Raycaster,Vector2} from 'three';
import {readWorldSnapshot,resolveWorldSelection,TWO_ZONE_BOUNDS} from './unified-world-model.js';
import {createWorldCamera} from './unified-world-camera.js';
import {createCanvasWorldRenderer} from './unified-world-canvas.js';

/** Snapshot scene with input callbacks. No economy reducer or simulation clock is owned here.
 * Cosmetic breathing uses one visual RAF, separate from the existing game clock.
 * @param {HTMLElement} host @param {import('./engine.js').State} state @param {string} locale
 * @param {{onSelect?:(target:Readonly<import('./unified-world-model.js').WorldSelection>)=>void,onStartChicken?:()=>void|Promise<void>,lowGraphics?:boolean}} [options]
 */
export function mountUnifiedPreview(host,state,locale,options={}){
 const control=createWorldCamera(),scene=new Scene(),camera=new OrthographicCamera(),abort=new AbortController();
 scene.background=new Color('#e5eddc');scene.add(new HemisphereLight('#fff5de','#68835d',2.6));const sun=new DirectionalLight('#fff4dc',2);sun.position.set(-8,18,10);scene.add(sun);
 const geometry=new BoxGeometry(1,1,1),materials=new Map(),objects=new Map();
 /** @type {import('three').WebGLRenderer|null} */let renderer=null;
 /** @type {WebGL2RenderingContext|null} */let pendingContext=null;
 let rendererEpoch=0,loading=false,ready=Promise.resolve(),renderSubmissions=0,lastAnimated=0,renderWidth=0,renderHeight=0,visualGeneration=0,visualRunning=false;
 /** @type {number|null} */let visualFrame=null;
 /** @type {number|null} */let startupTimer=null;
 /** @type {(()=>void)|null} */let startupResolve=null;
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 /** @type {ReturnType<typeof createCanvasWorldRenderer>|null} */let canvasRenderer=null;
 let disposed=false,sourceState=state,snapshot=readWorldSnapshot(state),language=locale,listKey='',preferLow=!!options.lowGraphics,modeReason='low';
 /** @type {string|null} */let selectedEntity=null;
 host.className='unified-preview';host.dataset.unifiedPreview='true';host.setAttribute('aria-label','Unified world preview');
 const heading=document.createElement('h2'),note=document.createElement('p'),status=document.createElement('p'),stage=document.createElement('div'),toolbar=document.createElement('div'),instructions=document.createElement('p'),list=document.createElement('ul'),startChicken=document.createElement('button'),retry=document.createElement('button');let canvas=document.createElement('canvas');
 stage.className='unified-preview-stage';toolbar.className='unified-preview-controls';toolbar.setAttribute('role','group');status.setAttribute('role','status');stage.append(canvas);startChicken.type='button';startChicken.className='action-button';startChicken.dataset.previewStartChicken='true';startChicken.hidden=true;retry.type='button';retry.className='action-button';retry.dataset.previewRetry='true';retry.hidden=true;host.append(heading,note,status,stage,retry,toolbar,instructions,list,startChicken);
 /** @param {string} color */
 function material(color){let m=materials.get(color);if(!m){m=new MeshLambertMaterial({color});materials.set(color,m);}return m;}
 /** @param {Group|Scene} parent @param {number} x @param {number} y @param {number} z @param {number} w @param {number} h @param {number} d @param {string} color */
 function box(parent,x,y,z,w,h,d,color){const mesh=new Mesh(geometry,material(color));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;}
 const bounds=TWO_ZONE_BOUNDS;
 box(scene,0,-.3,-.5,bounds.maxX-bounds.minX,.6,bounds.maxZ-bounds.minZ,'#91b76c').userData.canvasLayer=0;
 box(scene,0,.01,0,12,.025,1.1,'#dac493').userData.canvasLayer=1;box(scene,-4,.02,-2,1.1,.025,12,'#dac493').userData.canvasLayer=1;
 for(const [x,z]of [[-9,-9],[8,-7],[9,7],[-9,8]]){box(scene,x,.7,z,.25,1.4,.25,'#876247');box(scene,x,1.8,z,1.4,1.8,1.4,'#5d8c55');}
 const marker=box(scene,0,.07,0,1,.02,1,'#f3ce68');marker.visible=false;marker.userData.canvasLayer=2;
 const raycaster=new Raycaster();
 function selectionView(){const entity=snapshot.entities.find(e=>e.id===selectedEntity);if(!entity)selectedEntity=null;marker.visible=!!entity;if(entity){marker.position.set(entity.x,.07,entity.z);marker.scale.set(entity.width+.16,.02,entity.depth+.16);}host.dataset.selectedEntity=selectedEntity||'';for(const button of list.querySelectorAll('button'))button.setAttribute('aria-pressed',String(button.dataset.previewSelect===selectedEntity));startChicken.hidden=entity?.kind!=='available'||snapshot.chickenStarted||!options.onStartChicken;}
 /** @param {string} id */
 function select(id){if(disposed)return;const target=resolveWorldSelection(snapshot,id);if(!target)return;selectedEntity=id;selectionView();draw();options.onSelect?.(target);}
 /** Actual nearest visible geometry owns the hit, including nonselectable occluders. @param {number} x @param {number} y */
 function pick(x,y){if(disposed)return;draw();const rect=canvas.getBoundingClientRect();if(rect.width<=0||rect.height<=0||x<rect.left||x>rect.right||y<rect.top||y>rect.bottom)return;if(canvasRenderer){const id=canvasRenderer.pick(x-rect.left,y-rect.top);if(id)select(id);return;}if(!renderer)return;camera.updateMatrixWorld(true);scene.updateMatrixWorld(true);raycaster.setFromCamera(new Vector2((x-rect.left)/rect.width*2-1,1-(y-rect.top)/rect.height*2),camera);const visible=/** @type {Mesh[]} */([]);scene.traverseVisible(object=>{if(object instanceof Mesh)visible.push(object);});const first=raycaster.intersectObjects(visible,false)[0];if(!first)return;let hit=first.object;while(hit.parent&&!hit.userData.entityId)hit=hit.parent;const id=hit.userData.entityId;if(typeof id==='string')select(id);}
 /** @param {import('./unified-world-model.js').WorldEntity} entity */
 function entityGroup(entity){
  const group=new Group();group.position.set(entity.x,0,entity.z);group.userData.entityId=entity.id;group.userData.kind=entity.kind;group.userData.phase=[...entity.id].reduce((n,c)=>n+c.charCodeAt(0),0)%97;
  const {width:w,depth:d,height:h,kind}=entity;
  if(kind==='plot'){
   box(group,0,.06,0,w,.12,d,entity.value>.4?'#644b36':'#9a744f');
   if(entity.crop){const size=.18+entity.crop.stage*.09;for(const x of [-.24,.24])for(const z of [-.22,.22]){box(group,x,size/2+.12,z,size,size,size,'#71a74b');if(entity.crop.type==='tomato'&&entity.crop.stage===3)box(group,x-.06,size+.1,z,.12,.12,.12,'#c96642');}}
  }else if(kind==='coop'||kind==='market'){
   box(group,0,h/2,0,w,h,d,kind==='coop'?'#c49b69':'#e4c994');
   const roof=box(group,0,h+.15,0,w+.35,.28,d+.35,'#a46243');roof.rotation.z=.08;
   box(group,0,.5,d/2+.025,.6,1,.08,'#5f5941');
  }else if(kind==='hen'){
   box(group,-.1,.06,0,.035,.12,.035,'#b78744');box(group,.1,.06,0,.035,.12,.035,'#b78744');
   box(group,0,.27,0,.36,.35,.45,'#fff1cd');box(group,.04,.52,.12,.2,.22,.22,'#fff1cd');box(group,.04,.67,.12,.08,.1,.14,'#b35e43');box(group,.04,.5,.27,.1,.07,.12,'#d9a649');
  }else if(kind==='available'){
   box(group,0,.03,0,w,.06,d,'#b8c68b');box(group,0,.65,0,.1,1.3,.1,'#94724d');box(group,0,1.2,0,1.3,.45,.12,'#e6d3a0');
  }else box(group,0,h/2,0,w,h,d,entity.domainId==='drinker'?'#78aeb4':kind==='pump'?'#7a9b95':'#ba975a');
  return group;
 }
 function sync(){
  const ids=new Set(snapshot.entities.map(e=>e.id));for(const [id,entry]of objects)if(!ids.has(id)){scene.remove(entry.group);objects.delete(id);}
  for(const e of snapshot.entities){const key=JSON.stringify(e),entry=objects.get(e.id);if(entry?.key===key)continue;if(entry)scene.remove(entry.group);const group=entityGroup(e);objects.set(e.id,{key,group});scene.add(group);}
  const id=language==='id',labels=/** @type {Record<string,string>} */({coop:id?'Kandang ayam':'Chicken coop',nest:id?'Sarang':'Nest',feeder:id?'Pakan':'Feeder',drinker:id?'Air minum':'Drinker',clean:id?'Kebersihan':'Cleaning',pump:id?'Pompa':'Pump',market:id?'Pasar':'Market'});
  const nextListKey=language+'|'+snapshot.entities.map(e=>e.id).join('|');if(nextListKey!==listKey){const focused=/** @type {HTMLElement|null} */(list.contains(document.activeElement)?document.activeElement:null)?.dataset.previewSelect;let hen=0;list.replaceChildren();for(const entity of snapshot.entities){const item=document.createElement('li'),button=document.createElement('button');button.type='button';button.textContent=entity.kind==='plot'?(id?'Petak ':'Plot ')+(Number(entity.domainId)+1):entity.kind==='hen'?(id?'Ayam ':'Hen ')+(++hen):entity.kind==='available'?(id?'Halaman Ayam — belum dimulai':'Chicken yard — not started'):labels[String(entity.domainId)]||'';item.dataset.previewEntity=entity.id;button.dataset.previewSelect=entity.id;item.append(button);list.append(item);}listKey=nextListKey;if(focused)for(const button of list.querySelectorAll('button'))if(button.dataset.previewSelect===focused)button.focus({preventScroll:true});}
  heading.textContent=language==='id'?'Pratinjau dunia terpadu':'Unified world preview';
  note.textContent=language==='id'?'Eksperimen dunia awal: pilih objek di lahan atau daftar untuk memakai aksi permainan yang tersedia di bawah.':'Early world experiment: select an object on the terrain or list to use the existing gameplay actions below.';
  toolbar.setAttribute('aria-label',id?'Kontrol kamera dunia':'World camera controls');canvas.setAttribute('aria-label',id?'Peta dunia. Tombol panah untuk geser, tambah atau kurang untuk zoom, kurung siku untuk putar, Home untuk atur ulang.':'World map. Arrow keys to pan, plus or minus to zoom, brackets to rotate, Home to reset.');
  instructions.textContent=id?'Seret peta untuk geser. Fokus peta lalu gunakan panah/WASD, +/−, [ / ] atau Home. Ctrl + roda mouse untuk zoom; tombol kamera juga tersedia.':'Drag the map to pan. Focus the map for arrows/WASD, +/−, [ / ] or Home. Ctrl + mouse wheel zooms; camera buttons are also available.';
  if(host.dataset.renderer==='three')status.textContent=id?'Pratinjau 3D aktif':'3D preview active';
  else if(host.dataset.renderer==='canvas')status.textContent=loading?(id?'Peta siap digunakan. Sedang memuat grafis 3D.':'The map is ready to use. Loading 3D graphics.'):modeReason==='context-lost'?(id?'Konteks 3D terputus. Peta grafis ringan tetap aktif.':'3D context lost. The low-graphics map remains active.'):modeReason==='unavailable'?(id?'WebGL tidak tersedia. Peta grafis ringan aktif.':'WebGL unavailable. Low-graphics map active.'):(id?'Peta grafis ringan aktif':'Low-graphics map active');
  else status.textContent=id?'Grafis peta tidak tersedia. Pilih objek melalui daftar.':'Map graphics unavailable. Select objects through the list.';
  retry.textContent=id?'Coba 3D lagi':'Retry 3D';retry.hidden=preferLow||host.dataset.renderer==='three';retry.disabled=loading;host.dataset.loading3d=String(loading);
  host.dataset.entities=String(snapshot.entities.length);host.dataset.chickenStarted=String(snapshot.chickenStarted);
  startChicken.textContent=id?'Mulai Halaman Ayam':'Start Chicken Yard';selectionView();updateVisual();
 }
 function draw(){
  if(disposed)return;const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight),f=control.frame(width/height);
  camera.left=-f.halfWidth;camera.right=f.halfWidth;camera.top=f.halfHeight;camera.bottom=-f.halfHeight;camera.near=.1;camera.far=200;camera.position.set(f.x+32*f.dx,32,f.z+32*f.dz);camera.lookAt(f.x,0,f.z);camera.updateProjectionMatrix();
  if(renderer&&!renderer.getContext().isContextLost()){if(renderWidth!==width||renderHeight!==height)renderer.setSize(width,height,false);renderer.render(scene,camera);renderSubmissions++;}else if(canvasRenderer){canvasRenderer.render(width,height);renderSubmissions++;}renderWidth=width;renderHeight=height;
  host.dataset.heading=String(f.heading);host.dataset.zoom=String(f.zoom);host.dataset.panX=String(f.x);host.dataset.panZ=String(f.z);host.dataset.renderSubmissions=String(renderSubmissions);host.dataset.animatedEntities=String(lastAnimated);
 }
 function shouldAnimate(){return !disposed&&!preferLow&&!motion.matches&&!document.hidden&&!!(renderer||canvasRenderer)&&snapshot.entities.some(e=>e.kind==='hen');}
 function stopVisual(){visualGeneration++;visualRunning=false;if(visualFrame!==null)cancelAnimationFrame(visualFrame);visualFrame=null;lastAnimated=0;for(const entry of objects.values())if(entry.group.userData.kind==='hen')entry.group.scale.y=1;}
 function updateVisual(){if(!shouldAnimate()){stopVisual();return;}if(visualRunning)return;visualRunning=true;const generation=++visualGeneration;
  const frame=(/** @type {number} */time)=>{if(generation!==visualGeneration||!visualRunning)return;visualFrame=null;if(!shouldAnimate()){stopVisual();return;}lastAnimated=0;for(const entry of objects.values())if(entry.group.userData.kind==='hen'){entry.group.scale.y=1+.015*Math.sin(time/600+entry.group.userData.phase);lastAnimated++;}draw();if(generation===visualGeneration&&shouldAnimate())visualFrame=requestAnimationFrame(frame);else stopVisual();};visualFrame=requestAnimationFrame(frame);
 }
 document.addEventListener('visibilitychange',()=>{updateVisual();draw();},{signal:abort.signal});motion.addEventListener('change',()=>{updateVisual();draw();},{signal:abort.signal});
 /** @param {number} dx @param {number} dy */
 function panMap(dx,dy){control.panPixels(dx,dy,Math.max(1,stage.clientWidth),Math.max(1,stage.clientHeight));draw();}
 /** @param {string} action */
 function change(action){const moves=/** @type {Record<string,number[]>} */({'pan-left':[48,0],'pan-right':[-48,0],'pan-up':[0,48],'pan-down':[0,-48]});if(moves[action]){panMap(moves[action][0],moves[action][1]);return;}if(action==='left')control.rotate(-1);else if(action==='right')control.rotate(1);else if(action==='in')control.zoomBy(1.2);else if(action==='out')control.zoomBy(1/1.2);else if(action==='fit')control.fit();else if(action==='reset')control.reset();else control.focus(action);draw();}
 for(const [action,en,id]of [['left','Rotate left','Putar kiri'],['right','Rotate right','Putar kanan'],['in','Zoom in','Perbesar'],['out','Zoom out','Perkecil'],['fit','Fit farm','Seluruh lahan'],['reset','Reset view','Atur ulang'],['field','Focus crops','Fokus kebun'],['chicken','Focus chicken','Fokus ayam'],['pan-left','Pan left','Geser kiri'],['pan-right','Pan right','Geser kanan'],['pan-up','Pan up','Geser atas'],['pan-down','Pan down','Geser bawah']]){const button=document.createElement('button');button.type='button';button.dataset.previewCamera=action;button.dataset.en=en;button.dataset.id=id;button.textContent=language==='id'?id:en;button.addEventListener('click',()=>change(action),{signal:abort.signal});toolbar.append(button);}
 stage.addEventListener('keydown',event=>{if(event.target!==canvas||event.ctrlKey||event.metaKey||event.altKey)return;if(event.key==='Enter'||event.key===' '){event.preventDefault();const rect=canvas.getBoundingClientRect();pick(rect.left+rect.width/2,rect.top+rect.height/2);return;}const actions=/** @type {Record<string,string>} */({ArrowLeft:'pan-left',a:'pan-left',ArrowRight:'pan-right',d:'pan-right',ArrowUp:'pan-up',w:'pan-up',ArrowDown:'pan-down',s:'pan-down','+':'in','=':'in','-':'out','[':'left',']':'right',Home:'reset','0':'reset'});const action=actions[event.key]||actions[event.key.toLowerCase()];if(action){event.preventDefault();change(action);}},{signal:abort.signal});
 stage.addEventListener('wheel',event=>{if(event.target!==canvas||(!event.ctrlKey&&!event.metaKey))return;event.preventDefault();control.zoomBy(event.deltaY<0?1.12:1/1.12);draw();},{passive:false,signal:abort.signal});
 /** @type {{id:number,x:number,y:number,moved:boolean}|null} */let drag=null;
 stage.addEventListener('pointerdown',event=>{if(event.target!==canvas||event.button!==0||!event.isPrimary)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);},{signal:abort.signal});
 stage.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(drag.moved||Math.hypot(dx,dy)>7){drag.moved=true;panMap(dx,dy);drag.x=event.clientX;drag.y=event.clientY;}},{signal:abort.signal});
 stage.addEventListener('pointerup',event=>{if(!drag||drag.id!==event.pointerId)return;const moved=drag.moved;drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(!moved)pick(event.clientX,event.clientY);},{signal:abort.signal});
 stage.addEventListener('pointercancel',()=>{drag=null;},{signal:abort.signal});
 stage.addEventListener('lostpointercapture',()=>{drag=null;},{signal:abort.signal});
 list.addEventListener('click',event=>{const button=/** @type {HTMLElement} */(event.target).closest('[data-preview-select]'),id=button?.getAttribute('data-preview-select');if(id)select(id);},{signal:abort.signal});
 startChicken.addEventListener('click',()=>{if(snapshot.chickenStarted||startChicken.disabled||!options.onStartChicken)return;startChicken.disabled=true;const finish=()=>{if(!disposed)startChicken.disabled=false;};Promise.resolve(options.onStartChicken()).then(finish,finish);},{signal:abort.signal});
 /** @param {HTMLCanvasElement} next */
 function useCanvas(next){const focused=document.activeElement===canvas;drag=null;renderWidth=0;renderHeight=0;canvas.removeEventListener('webglcontextlost',onContextLost);canvasRenderer?.dispose();canvasRenderer=null;canvas.replaceWith(next);canvas=next;canvas.setAttribute('role','group');canvas.tabIndex=0;canvas.style.touchAction='none';canvas.addEventListener('webglcontextlost',onContextLost);if(focused)canvas.focus({preventScroll:true});}
 /** @param {WebGLRenderingContext|WebGL2RenderingContext} context */
 function releaseContext(context){if(!context.isContextLost())context.getExtension('WEBGL_lose_context')?.loseContext();}
 function releaseRenderer(){canvas.removeEventListener('webglcontextlost',onContextLost);if(renderer){const context=renderer.getContext();renderer.dispose();releaseContext(context);renderer=null;}}
 function cancelStartup(){if(startupTimer!==null)window.clearTimeout(startupTimer);startupTimer=null;const finish=startupResolve;startupResolve=null;finish?.();}
 /** Let the usable Canvas map and its controls settle before costly WebGL context creation. @returns {Promise<void>} */
 function deferDriver(){return new Promise(resolve=>{startupResolve=resolve;startupTimer=window.setTimeout(cancelStartup,750);});}
 /** @param {string} reason */
 function useFallback(reason){cancelStartup();rendererEpoch++;loading=false;if(pendingContext){releaseContext(pendingContext);pendingContext=null;}releaseRenderer();modeReason=reason;const next=document.createElement('canvas');useCanvas(next);try{canvasRenderer=createCanvasWorldRenderer(canvas,scene,camera,preferLow?1:devicePixelRatio||1);host.dataset.renderer='canvas';}catch{host.dataset.renderer='unavailable';}sync();draw();}
 async function tryThree(){if(disposed||preferLow)return;useFallback('loading');const epoch=rendererEpoch;loading=true;sync();await deferDriver();if(disposed||preferLow||epoch!==rendererEpoch)return;const next=document.createElement('canvas'),context=next.getContext('webgl2',{antialias:true,powerPreference:'low-power'});if(!context){loading=false;modeReason='unavailable';sync();return;}pendingContext=context;try{const {WebGLRenderer}=await import('./unified-world-webgl.js');if(disposed||preferLow||epoch!==rendererEpoch){releaseContext(context);return;}if(context.isContextLost()){useFallback('context-lost');return;}const created=new WebGLRenderer({canvas:next,context,antialias:true,powerPreference:'low-power'});created.setPixelRatio(Math.min(devicePixelRatio||1,1.5));pendingContext=null;useCanvas(next);renderer=created;loading=false;host.dataset.renderer='three';sync();draw();}catch{releaseContext(context);if(!disposed&&epoch===rendererEpoch)useFallback('unavailable');}}
 function requestThree(){ready=tryThree();return ready;}
 /** @param {Event} event */
 function onContextLost(event){if(disposed||event.target!==canvas)return;event.preventDefault();useFallback('context-lost');}
 retry.addEventListener('click',requestThree,{signal:abort.signal});
 host.dataset.inputReady='true';
 if(preferLow)useFallback('low');else requestThree();
 const observer=new ResizeObserver(()=>{if(stage.clientWidth!==renderWidth||stage.clientHeight!==renderHeight)draw();});observer.observe(stage);
 return {
  /** @param {import('./engine.js').State} next @param {string} nextLocale */
  update(next,nextLocale){if(disposed||(next===sourceState&&nextLocale===language))return;sourceState=next;snapshot=readWorldSnapshot(next);language=nextLocale;sync();for(const button of toolbar.querySelectorAll('button'))button.textContent=(language==='id'?button.dataset.id:button.dataset.en)||'';draw();},
  /** @param {boolean} low */
  setLowGraphics(low){if(disposed||preferLow===low)return;preferLow=low;if(low){useFallback('low');ready=Promise.resolve();}else requestThree();},
  ready:()=>ready,
  /** Return focus only for the panel actually opened by this world selection. @param {string} kind @param {string|number} domainId */
  releaseSelection(kind,domainId){const target=selectedEntity?resolveWorldSelection(snapshot,selectedEntity):null;if(disposed||!target||target.kind!==kind||target.domainId!==domainId)return false;for(const button of list.querySelectorAll('button'))if(button.dataset.previewSelect===selectedEntity)button.focus({preventScroll:true});selectedEntity=null;selectionView();draw();return true;},
  dispose(){if(disposed)return;disposed=true;cancelStartup();stopVisual();rendererEpoch++;if(pendingContext){releaseContext(pendingContext);pendingContext=null;}abort.abort();observer.disconnect();releaseRenderer();canvasRenderer?.dispose();canvasRenderer=null;scene.clear();objects.clear();geometry.dispose();for(const m of materials.values())m.dispose();materials.clear();host.replaceChildren();host.dataset.renderer='disposed';},
  inspect:()=>({disposed,entities:objects.size,renderer:host.dataset.renderer,camera:control.view(),visualPending:visualFrame===null?0:1,startupPending:startupTimer===null?0:1,renderSubmissions,animatedEntities:lastAnimated})
 };
}
