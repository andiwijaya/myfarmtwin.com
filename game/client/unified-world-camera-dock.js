import {FARM_INITIAL_ZOOM} from './unified-world-camera.js';
/** Move the real camera buttons into an always-visible dock. No extra camera,
 * input callbacks, simulation state or preference writes are created here.
 * @param {{host:HTMLElement,stage:HTMLElement,toolbar:HTMLElement,cameraBody:HTMLElement,signal:AbortSignal}} options */
export function createCameraDock({host,stage,toolbar,cameraBody,signal}){
 const originals=[...toolbar.children],parent=stage.parentNode,next=stage.nextSibling,row=document.createElement('div'),dock=document.createElement('aside'),hint=document.createElement('p'),groups=new Map(),labels=new Map(),outputs=new Map();
 const desktop=matchMedia('(min-width:1024px) and (hover:hover) and (pointer:fine)');
 row.className='world-viewport';dock.className='world-camera-dock';dock.id='world-camera-dock';hint.className='world-touch-hint';hint.id='world-touch-hint';stage.replaceWith(row);row.append(stage,dock);row.after(hint);
 const definitions=/** @type {[string,string[],string,string][]} */([['zoom',['out','in'],'Zoom','Zoom'],['angle',['left','right'],'Angle','Sudut'],['pan',['pan-up','pan-left','pan-down','pan-right'],'Pan','Geser'],['view',['fit','reset'],'View','Tampilan']]);
 /** @type {Map<string,{button:HTMLButtonElement,icon:HTMLSpanElement,copy:HTMLSpanElement,text:string,aria:string|null,title:string|null}>} */
 const controls=new Map();
 const symbols=/** @type {Record<string,string>} */({out:'−',in:'+',left:'↶',right:'↷','pan-up':'↑','pan-left':'←','pan-down':'↓','pan-right':'→',fit:'▣',reset:'↺'}),copies=/** @type {Record<string,readonly [string,string]>} */({out:['Zoom out','Perkecil'],in:['Zoom in','Perbesar'],left:['Left','Kiri'],right:['Right','Kanan'],fit:['Fit farm','Seluruh'],reset:['Reset','Reset']});
 for(const [key,actions]of definitions){const group=document.createElement('fieldset'),legend=document.createElement('legend'),label=document.createElement('span'),body=document.createElement('div');group.className='world-camera-group world-camera-'+key;body.className='world-camera-buttons';legend.append(label);group.append(legend,body);groups.set(key,group);labels.set(key,label);if(key==='zoom'||key==='angle'){const value=document.createElement('output');value.dataset.worldCameraReadout=key;legend.append(value);outputs.set(key,value);}for(const action of actions){const button=/** @type {HTMLButtonElement|null} */(toolbar.querySelector('[data-preview-camera="'+action+'"]'));if(!button)throw Error('Missing native camera control '+action);const icon=document.createElement('span'),copy=document.createElement('span');icon.className='world-camera-icon';icon.setAttribute('aria-hidden','true');copy.className='world-camera-copy';controls.set(action,{button,icon,copy,text:button.textContent||'',aria:button.getAttribute('aria-label'),title:button.getAttribute('title')});button.dataset.worldCameraDirect='true';icon.textContent=symbols[action];button.replaceChildren(icon,copy);body.append(button);}dock.append(group);}
 let language='';
 /** @param {number} heading @param {number} zoom */
 function values(heading,zoom){const z=Math.round(zoom*100)+'%',h=(heading+1)+'/4',zoomOutput=outputs.get('zoom'),angleOutput=outputs.get('angle'),out=controls.get('out'),inside=controls.get('in');if(zoomOutput&&zoomOutput.textContent!==z)zoomOutput.textContent=z;if(angleOutput&&angleOutput.textContent!==h)angleOutput.textContent=h;if(out)out.button.disabled=zoom<=1;if(inside)inside.button.disabled=zoom>=8;}
 host.addEventListener('worldviewchange',event=>{const view=/** @type {CustomEvent<{heading:number,zoom:number}>} */(event).detail;values(view.heading,view.zoom);},{signal});
 function layout(){dock.dataset.layout=desktop.matches?'desktop':'touch';if(desktop.matches)dock.insertBefore(groups.get('pan'),groups.get('view'));else cameraBody.append(groups.get('pan'));host.dispatchEvent(new Event('worldtoolslayout'));}
 desktop.addEventListener('change',layout,{signal});layout();values(Number(host.dataset.heading)||0,Number(host.dataset.zoom)||FARM_INITIAL_ZOOM);
 return{
  dock,hint,desktop,
  /** @param {string} locale */
  update(locale){if(language===locale)return;language=locale;const id=locale==='id';dock.setAttribute('aria-label',id?'Kontrol kamera langsung':'Direct camera controls');for(const [key,,en,local]of definitions)labels.get(key).textContent=id?local:en;for(const [action,control]of controls){const label=(id?control.button.dataset.id:control.button.dataset.en)||action;control.button.setAttribute('aria-label',label);control.button.title=label;control.copy.textContent=copies[action]?.[id?1:0]||'';}hint.textContent=id?'Seret untuk geser · Cubit untuk zoom · Ketuk objek':'Drag to pan · Pinch to zoom · Tap an object';},
  dispose(){for(const {button,text,aria,title}of controls.values()){button.textContent=text;delete button.dataset.worldCameraDirect;for(const name of ['aria-label','title']){const value=name==='aria-label'?aria:title;if(value===null)button.removeAttribute(name);else button.setAttribute(name,value);}button.disabled=false;}toolbar.replaceChildren(...originals);if(parent)parent.insertBefore(stage,next?.parentNode===parent?next:null);row.remove();hint.remove();}
 };
}
