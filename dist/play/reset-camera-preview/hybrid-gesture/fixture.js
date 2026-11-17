import {cameraGestureHint} from './cozy-camera-shortcuts.js';
import {watchCameraGestureInput} from './cozy-camera-gesture-input.js';
// A separate EventTarget makes the simulated device stream independent of the
// mouse used to operate this fixture. No game/session/world code is imported.
for(const button of document.querySelectorAll('button'))button.disabled=true;
const root=document.getElementById('care-content');
root.innerHTML='<h2>Hybrid input preview</h2><p>Production input observer, hint formatter, toolbar markup and CSS. Explicit device events; no farm storage.</p><p><label><input id="fixture-coarse" type="checkbox"> Primary pointer is coarse</label></p><div class="actions"><button id="fixture-touch">Touch</button><button id="fixture-mouse">Mouse click</button><button id="fixture-move">Mouse move</button><button id="fixture-wheel">Wheel</button><button id="fixture-compat">Compatibility mouse</button><button id="fixture-idle">Idle mouse move</button><button id="fixture-reset">Reset input</button><button id="fixture-dispose">Dispose observer</button></div><p id="fixture-status" role="status"></p><p id="fixture-report"></p>';
const coarse=document.getElementById('fixture-coarse'),language=document.getElementById('language'),hint=document.getElementById('gesture-hint');
let stream,media,observer,changes=[],steps=[],disposed=false,mousePoint={x:5,y:5};
function render(){
 const input=observer.getInput(),source=observer.hasInput()?'last':'primary',lang=language.value==='en'?'en':'id';
 document.documentElement.lang=lang;hint.textContent=cameraGestureHint(input==='touch',lang);hint.dataset.gestureInput=input;hint.dataset.gestureSource=source;
 document.getElementById('farm-toolbar').open=true;
 document.getElementById('fixture-status').textContent=input+' · '+source+' · '+lang.toUpperCase();
 document.getElementById('fixture-report').textContent=JSON.stringify({input,source,language:lang,coarse:media.matches,disposed,changes,steps},null,2);
 document.body.dataset.fixtureReady='true';
}
function reset(){
 observer?.dispose();stream=new EventTarget();media=Object.assign(new EventTarget(),{matches:coarse.checked});changes=[];steps=[];disposed=false;mousePoint={x:5,y:5};
 observer=watchCameraGestureInput(stream,media,input=>{changes.push(input);render();});render();
}
function emit(type,properties={}){
 const event=Object.assign(new Event(type,{cancelable:true}),properties);stream.dispatchEvent(event);
 steps.push({type,pointerType:properties.pointerType||null,input:observer.getInput(),source:observer.hasInput()?'last':'primary',prevented:event.defaultPrevented});render();
}
document.getElementById('loading').hidden=true;
document.getElementById('save-status').textContent='Fixture only · no farm storage';
document.getElementById('view-title').textContent='Hybrid input preview';
document.getElementById('view-subtitle').textContent='Production observer, no farm loaded';
document.getElementById('fixture-touch').addEventListener('click',()=>emit('pointerdown',{pointerType:'touch',pointerId:2,clientX:1,clientY:1}));
document.getElementById('fixture-mouse').addEventListener('click',()=>emit('pointerdown',{pointerType:'mouse',pointerId:1,clientX:mousePoint.x,clientY:mousePoint.y}));
document.getElementById('fixture-move').addEventListener('click',()=>{mousePoint.x++;emit('pointermove',{pointerType:'mouse',pointerId:1,clientX:mousePoint.x,clientY:mousePoint.y,movementX:1,movementY:0});});
document.getElementById('fixture-idle').addEventListener('click',()=>emit('pointermove',{pointerType:'mouse',pointerId:1,clientX:mousePoint.x,clientY:mousePoint.y,movementX:0,movementY:0}));
document.getElementById('fixture-wheel').addEventListener('click',()=>emit('wheel',{deltaY:8}));
document.getElementById('fixture-compat').addEventListener('click',()=>{emit('mousedown');emit('mousemove',{movementX:4});emit('pointermove',{pointerType:'mouse',pointerId:1,movementX:9,sourceCapabilities:{firesTouchEvents:true}});emit('wheel',{deltaY:8,sourceCapabilities:{firesTouchEvents:true}});});
document.getElementById('fixture-reset').addEventListener('click',reset);
document.getElementById('fixture-dispose').addEventListener('click',()=>{observer.dispose();disposed=true;render();});
coarse.addEventListener('change',()=>{media.matches=coarse.checked;media.dispatchEvent(new Event('change'));render();});
language.addEventListener('change',render);
window.addEventListener('pagehide',()=>observer.dispose(),{once:true});reset();
