import {cameraGestureHint} from './cozy-camera-shortcuts.js';
// Only the hint formatter is imported. The game session, world and storage are
// never initialized; original toolbar markup and stylesheet remain in use.
const root=document.getElementById('care-content');
root.innerHTML='<h2>Gesture hint preview</h2><p>Read-only input fixtures using production toolbar markup, stylesheet and formatter. No farm is loaded.</p><label for="fixture-input">Input</label><select id="fixture-input"><option value="pointer">Mouse / trackpad</option><option value="touch">Touch / HP</option></select><p><label><input id="fixture-baseline" type="checkbox"> Previous combined hint</label></p><p id="fixture-status" role="status"></p>';
const input=document.getElementById('fixture-input'),language=document.getElementById('language'),baseline=document.getElementById('fixture-baseline');
const old={id:'Seret untuk putar · Gulir/cubit untuk zoom · Ketuk objek',en:'Drag to orbit · Scroll/pinch to zoom · Tap an object'};
document.getElementById('loading').hidden=true;
document.getElementById('save-status').textContent='Fixture only · no farm storage';
document.getElementById('view-title').textContent='Gesture preview';
document.getElementById('view-subtitle').textContent='Production toolbar, no farm loaded';
for(const button of document.querySelectorAll('button'))button.disabled=true;
function render(){
 const touch=input.value==='touch',lang=language.value==='en'?'en':'id',hint=document.getElementById('gesture-hint');
 document.documentElement.lang=lang;
 hint.textContent=baseline.checked?old[lang]:cameraGestureHint(touch,lang);
 hint.dataset.gestureInput=touch?'touch':'pointer';
 document.getElementById('farm-toolbar').open=true;
 document.getElementById('fixture-status').textContent=(touch?'Touch':'Pointer')+' · '+lang.toUpperCase()+' · '+(baseline.checked?'baseline':'candidate');
 document.body.dataset.fixtureReady='true';
}
for(const control of [input,language,baseline])control.addEventListener('change',render);
render();
