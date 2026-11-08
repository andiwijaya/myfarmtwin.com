// One entry loader: classic players never fetch optional world graphics.
async function start(){
 let boot;
 if(new URLSearchParams(location.search).get('world')==='unified-preview'){
  document.documentElement.classList.add('unified-preview-requested');
  const renderer=import('./unified-world-preview.js');renderer.catch(()=>{});
  try{const api=await import('./unified-world-bootstrap.js');boot=await api.prepareUnifiedWorld(renderer);}catch{document.documentElement.classList.remove('unified-preview-requested');}
 }
 try{await import('./main.js');}catch(error){boot?.fail();throw error;}
}
start().catch(error=>console.error('Game controls unavailable',error));
