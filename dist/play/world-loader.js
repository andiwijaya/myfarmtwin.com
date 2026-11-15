// Normal and bookmarked play routes share one 3D entry and one game session.
async function start(){
 let boot;
 document.documentElement.classList.add('unified-preview-requested');
 try{
  const renderer=import('./unified-world-preview.js');renderer.catch(()=>{});
  const api=await import('./unified-world-bootstrap.js');
  boot=await api.prepareUnifiedWorld(renderer);
  // Give the actual WebGL world (or its explicit error) startup priority.
  await boot.preview.ready();await boot.firstPaint;
  await import('./main.js');
 }catch(error){
  if(boot)boot.fail();else{
   const farm=document.querySelector('#farm'),notice=document.createElement('p');
   if(farm instanceof HTMLElement)farm.inert=true;
   notice.className='world-startup';notice.setAttribute('role','alert');
   notice.textContent='The 3D farm could not load. Farm 3D gagal dimuat. ';
   const retry=document.createElement('a');retry.href=location.href;retry.textContent='Reload / Muat ulang';notice.append(retry);farm?.before(notice);
  }
  console.error('3D farm unavailable',error);
 }
}
start();
