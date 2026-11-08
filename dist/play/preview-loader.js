// One entry loader: classic players never fetch optional world graphics.
async function start(){
 let boot;
 const preview=new URLSearchParams(location.search).get('world')==='unified-preview',farm=document.querySelector('#farm'),language=document.querySelector('#language');
 const classicFarm=!preview&&farm instanceof HTMLElement?farm:null,classicLanguage=!preview&&language instanceof HTMLSelectElement?language:null,wasInert=classicFarm?.inert||false,wasDisabled=classicLanguage?.disabled||false;
 let classicStatus;
 if(classicFarm){classicFarm.inert=true;classicStatus=document.createElement('p');classicStatus.setAttribute('role','status');classicStatus.className='classic-startup-status';classicStatus.textContent=classicLanguage?.value==='id'?'Sedang memuat kontrol farm…':'Loading farm controls…';classicFarm.before(classicStatus);}
 if(classicLanguage)classicLanguage.disabled=true;
 if(preview){
  document.documentElement.classList.add('unified-preview-requested');
  const renderer=import('./unified-world-preview.js');renderer.catch(()=>{});
  try{const api=await import('./unified-world-bootstrap.js');boot=await api.prepareUnifiedWorld(renderer);}catch{document.documentElement.classList.remove('unified-preview-requested');}
 }
 try{await import('./main.js');if(classicFarm)classicFarm.inert=wasInert;if(classicLanguage)classicLanguage.disabled=wasDisabled;classicStatus?.remove();}catch(error){boot?.fail();if(classicStatus){classicStatus.setAttribute('role','alert');classicStatus.textContent='Farm controls could not load. Kontrol farm gagal dimuat. ';const reload=document.createElement('a');reload.href=location.href;reload.textContent='Reload / Muat ulang';classicStatus.append(reload);}throw error;}
}
start().catch(error=>console.error('Game controls unavailable',error));
