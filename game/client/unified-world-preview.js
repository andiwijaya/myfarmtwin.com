import {Scene,Color,OrthographicCamera,WebGLRenderer,HemisphereLight,DirectionalLight,Mesh,BoxGeometry,MeshLambertMaterial,Group} from 'three';
import {readWorldSnapshot,TWO_ZONE_BOUNDS} from './unified-world-model.js';
import {createWorldCamera} from './unified-world-camera.js';

/** Isolated, read-only feasibility preview. No gameplay command or timer is owned here.
 * Static frames are submitted only for a snapshot, resize or camera input.
 * @param {HTMLElement} host @param {import('./engine.js').State} state @param {string} locale
 */
export function mountUnifiedPreview(host,state,locale){
 const control=createWorldCamera(),scene=new Scene(),camera=new OrthographicCamera(),abort=new AbortController();
 scene.background=new Color('#e5eddc');scene.add(new HemisphereLight('#fff5de','#68835d',2.6));const sun=new DirectionalLight('#fff4dc',2);sun.position.set(-8,18,10);scene.add(sun);
 const geometry=new BoxGeometry(1,1,1),materials=new Map(),objects=new Map();
 /** @type {WebGLRenderer|null} */let renderer=null;
 let disposed=false,snapshot=readWorldSnapshot(state),language=locale;
 host.className='unified-preview';host.dataset.unifiedPreview='true';host.setAttribute('aria-label','Unified world preview');
 const heading=document.createElement('h2'),note=document.createElement('p'),status=document.createElement('p'),stage=document.createElement('div'),canvas=document.createElement('canvas'),toolbar=document.createElement('div'),instructions=document.createElement('p'),list=document.createElement('ul');
 stage.className='unified-preview-stage';toolbar.className='unified-preview-controls';toolbar.setAttribute('role','group');status.setAttribute('role','status');canvas.setAttribute('role','group');canvas.tabIndex=0;canvas.style.touchAction='none';stage.append(canvas);host.append(heading,note,status,stage,toolbar,instructions,list);
 /** @param {string} color */
 function material(color){let m=materials.get(color);if(!m){m=new MeshLambertMaterial({color});materials.set(color,m);}return m;}
 /** @param {Group|Scene} parent @param {number} x @param {number} y @param {number} z @param {number} w @param {number} h @param {number} d @param {string} color */
 function box(parent,x,y,z,w,h,d,color){const mesh=new Mesh(geometry,material(color));mesh.position.set(x,y,z);mesh.scale.set(w,h,d);parent.add(mesh);return mesh;}
 const bounds=TWO_ZONE_BOUNDS;
 box(scene,0,-.3,-.5,bounds.maxX-bounds.minX,.6,bounds.maxZ-bounds.minZ,'#91b76c');
 box(scene,0,.01,0,12,.025,1.1,'#dac493');box(scene,-4,.02,-2,1.1,.025,12,'#dac493');
 for(const [x,z]of [[-9,-9],[8,-7],[9,7],[-9,8]]){box(scene,x,.7,z,.25,1.4,.25,'#876247');box(scene,x,1.8,z,1.4,1.8,1.4,'#5d8c55');}
 /** @param {import('./unified-world-model.js').WorldEntity} entity */
 function entityGroup(entity){
  const group=new Group();group.position.set(entity.x,0,entity.z);group.userData.entityId=entity.id;
  const {width:w,depth:d,height:h,kind}=entity;
  if(kind==='plot'){
   box(group,0,.06,0,w,.12,d,entity.value>.4?'#644b36':'#9a744f');
   if(entity.crop){const size=.18+entity.crop.stage*.09;for(const x of [-.24,.24])for(const z of [-.22,.22]){box(group,x,size/2+.12,z,size,size,size,'#71a74b');if(entity.crop.type==='tomato'&&entity.crop.stage===3)box(group,x-.06,size+.1,z,.12,.12,.12,'#c96642');}}
  }else if(kind==='coop'||kind==='market'){
   box(group,0,h/2,0,w,h,d,kind==='coop'?'#c49b69':'#e4c994');
   const roof=box(group,0,h+.15,0,w+.35,.28,d+.35,'#a46243');roof.rotation.z=.08;
   box(group,0,.5,d/2+.025,.6,1,.08,'#5f5941');
  }else if(kind==='hen'){
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
  let hen=0;list.replaceChildren();for(const entity of snapshot.entities){const item=document.createElement('li');item.textContent=entity.kind==='plot'?(id?'Petak ':'Plot ')+(Number(entity.domainId)+1):entity.kind==='hen'?(id?'Ayam ':'Hen ')+(++hen):entity.kind==='available'?(id?'Halaman Ayam — belum dimulai':'Chicken yard — not started'):labels[String(entity.domainId)]||'';item.dataset.previewEntity=entity.id;list.append(item);}
  heading.textContent=language==='id'?'Pratinjau dunia terpadu':'Unified world preview';
  note.textContent=language==='id'?'Eksperimen baca-saja: kebun dan ayam pada satu lahan. Aksi permainan tetap tersedia di bawah.':'Read-only experiment: crops and chickens on one terrain. Gameplay actions remain available below.';
  toolbar.setAttribute('aria-label',id?'Kontrol kamera dunia':'World camera controls');canvas.setAttribute('aria-label',id?'Peta dunia. Tombol panah untuk geser, tambah atau kurang untuk zoom, kurung siku untuk putar, Home untuk atur ulang.':'World map. Arrow keys to pan, plus or minus to zoom, brackets to rotate, Home to reset.');
  instructions.textContent=id?'Seret peta untuk geser. Fokus peta lalu gunakan panah/WASD, +/−, [ / ] atau Home. Ctrl + roda mouse untuk zoom; tombol kamera juga tersedia.':'Drag the map to pan. Focus the map for arrows/WASD, +/−, [ / ] or Home. Ctrl + mouse wheel zooms; camera buttons are also available.';
  if(host.dataset.renderer==='three')status.textContent=id?'Pratinjau 3D aktif':'3D preview active';
  else if(host.dataset.renderer==='unavailable')status.textContent=id?'WebGL tidak tersedia. Daftar objek tetap dapat dibaca; gunakan permainan di bawah.':'WebGL unavailable. Object list remains readable; use the game below.';
  else if(host.dataset.renderer==='context-lost')status.textContent=id?'Konteks 3D terputus. Progres tetap aman; gunakan permainan di bawah.':'3D context lost. Progress remains safe; use the game below.';
  host.dataset.entities=String(snapshot.entities.length);host.dataset.chickenStarted=String(snapshot.chickenStarted);
 }
 function draw(){
  if(disposed)return;const width=Math.max(1,stage.clientWidth),height=Math.max(1,stage.clientHeight),f=control.frame(width/height);
  camera.left=-f.halfWidth;camera.right=f.halfWidth;camera.top=f.halfHeight;camera.bottom=-f.halfHeight;camera.near=.1;camera.far=200;camera.position.set(f.x+32*f.dx,32,f.z+32*f.dz);camera.lookAt(f.x,0,f.z);camera.updateProjectionMatrix();
  if(renderer){renderer.setSize(width,height,false);renderer.render(scene,camera);}
  host.dataset.heading=String(f.heading);host.dataset.zoom=String(f.zoom);host.dataset.panX=String(f.x);host.dataset.panZ=String(f.z);
 }
 /** @param {number} dx @param {number} dy */
 function panMap(dx,dy){control.panPixels(dx,dy,Math.max(1,stage.clientWidth),Math.max(1,stage.clientHeight));draw();}
 /** @param {string} action */
 function change(action){const moves=/** @type {Record<string,number[]>} */({'pan-left':[48,0],'pan-right':[-48,0],'pan-up':[0,48],'pan-down':[0,-48]});if(moves[action]){panMap(moves[action][0],moves[action][1]);return;}if(action==='left')control.rotate(-1);else if(action==='right')control.rotate(1);else if(action==='in')control.zoomBy(1.2);else if(action==='out')control.zoomBy(1/1.2);else if(action==='fit')control.fit();else if(action==='reset')control.reset();else control.focus(action);draw();}
 for(const [action,en,id]of [['left','Rotate left','Putar kiri'],['right','Rotate right','Putar kanan'],['in','Zoom in','Perbesar'],['out','Zoom out','Perkecil'],['fit','Fit farm','Seluruh lahan'],['reset','Reset view','Atur ulang'],['field','Focus crops','Fokus kebun'],['chicken','Focus chicken','Fokus ayam'],['pan-left','Pan left','Geser kiri'],['pan-right','Pan right','Geser kanan'],['pan-up','Pan up','Geser atas'],['pan-down','Pan down','Geser bawah']]){const button=document.createElement('button');button.type='button';button.dataset.previewCamera=action;button.dataset.en=en;button.dataset.id=id;button.textContent=language==='id'?id:en;button.addEventListener('click',()=>change(action),{signal:abort.signal});toolbar.append(button);}
 canvas.addEventListener('keydown',event=>{if(event.target!==canvas||event.ctrlKey||event.metaKey||event.altKey)return;const actions=/** @type {Record<string,string>} */({ArrowLeft:'pan-left',a:'pan-left',ArrowRight:'pan-right',d:'pan-right',ArrowUp:'pan-up',w:'pan-up',ArrowDown:'pan-down',s:'pan-down','+':'in','=':'in','-':'out','[':'left',']':'right',Home:'reset','0':'reset'});if(actions[event.key]){event.preventDefault();change(actions[event.key]);}},{signal:abort.signal});
 canvas.addEventListener('wheel',event=>{if(!event.ctrlKey&&!event.metaKey)return;event.preventDefault();control.zoomBy(event.deltaY<0?1.12:1/1.12);draw();},{passive:false,signal:abort.signal});
 /** @type {{id:number,x:number,y:number,moved:boolean}|null} */let drag=null;
 canvas.addEventListener('pointerdown',event=>{if(event.button!==0||!event.isPrimary)return;drag={id:event.pointerId,x:event.clientX,y:event.clientY,moved:false};canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);},{signal:abort.signal});
 canvas.addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(drag.moved||Math.hypot(dx,dy)>7){drag.moved=true;panMap(dx,dy);drag.x=event.clientX;drag.y=event.clientY;}},{signal:abort.signal});
 canvas.addEventListener('pointerup',event=>{if(!drag||drag.id!==event.pointerId)return;drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);},{signal:abort.signal});
 canvas.addEventListener('pointercancel',()=>{drag=null;},{signal:abort.signal});
 try{renderer=new WebGLRenderer({canvas,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));host.dataset.renderer='three';status.textContent=language==='id'?'Pratinjau 3D aktif':'3D preview active';}
 catch{host.dataset.renderer='unavailable';status.textContent=language==='id'?'WebGL tidak tersedia. Daftar objek tetap dapat dibaca; gunakan permainan di bawah.':'WebGL unavailable. Object list remains readable; use the game below.';}
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();host.dataset.renderer='context-lost';status.textContent=language==='id'?'Konteks 3D terputus. Progres tetap aman; gunakan permainan di bawah.':'3D context lost. Progress remains safe; use the game below.';renderer?.dispose();renderer=null;},{signal:abort.signal});
 const observer=new ResizeObserver(draw);observer.observe(stage);sync();draw();
 return {
  /** @param {import('./engine.js').State} next @param {string} nextLocale */
  update(next,nextLocale){if(disposed)return;snapshot=readWorldSnapshot(next);language=nextLocale;sync();for(const button of toolbar.querySelectorAll('button'))button.textContent=(language==='id'?button.dataset.id:button.dataset.en)||'';draw();},
  dispose(){if(disposed)return;disposed=true;abort.abort();observer.disconnect();scene.clear();objects.clear();geometry.dispose();for(const m of materials.values())m.dispose();materials.clear();renderer?.dispose();renderer=null;host.replaceChildren();host.dataset.renderer='disposed';},
  inspect:()=>({disposed,entities:objects.size,renderer:host.dataset.renderer,camera:control.view()})
 };
}
