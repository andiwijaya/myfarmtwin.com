// Start optional graphics alongside the game entry, only for the explicit preview.
// Importing the module owns no DOM, farm state, simulation timer or WebGL context.
if(new URLSearchParams(location.search).get('world')==='unified-preview'){
 document.documentElement.classList.add('unified-preview-requested');
 import('./unified-world-preview.js').catch(()=>{document.documentElement.classList.remove('unified-preview-requested');});
}
