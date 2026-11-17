import {cameraResetShortcutHints} from './cozy-camera-shortcuts.js';
const cases=[
 {id:'mac-modern',label:'Mac · platform API',platform:{userAgentData:{platform:'macOS'},platform:'Win32'}},
 {id:'windows',label:'Windows · platform API',platform:{userAgentData:{platform:'Windows'},platform:'MacIntel'}},
 {id:'linux',label:'Linux · legacy platform',platform:{platform:'Linux x86_64'}},
 {id:'mac-safari',label:'Mac · Safari platform fallback',platform:{platform:'MacIntel'}},
 {id:'mac-ua',label:'Mac · desktop user-agent fallback',platform:{userAgent:'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}},
 {id:'unknown',label:'Unknown · Ctrl fallback',platform:{}}
];
const host=document.getElementById('fixture-cases'),language=document.getElementById('hint-language');
function render(){
 host.replaceChildren();
 for(const item of cases){
  const row=document.createElement('section');row.id='case-'+item.id;const heading=document.createElement('h2');heading.textContent=item.label;row.append(heading);
  const hints=cameraResetShortcutHints(item.platform,language.value),controls=document.createElement('div');controls.className='fixture-controls';
  for(const action of ['undo','redo']){
   const hint=hints[action],button=document.createElement('button');button.id=item.id+'-'+action;button.textContent=action==='undo'?'Undo reset':'Redo reset';button.title=hint.title;button.setAttribute('aria-keyshortcuts',hint.shortcuts);controls.append(button);
  }
  row.append(controls);
  for(const action of ['undo','redo']){const output=document.createElement('p');output.id=item.id+'-'+action+'-hint';output.textContent=hints[action].title;row.append(output);}
  host.append(row);
 }
 document.getElementById('fixture-status').textContent='Ready · '+language.value.toUpperCase()+' · '+cases.length+' platform cases';document.body.dataset.hintsReady='true';
}
language.addEventListener('change',render);render();
