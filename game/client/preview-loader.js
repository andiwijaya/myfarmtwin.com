// Start optional graphics alongside the game entry, only for the explicit preview.
// Importing the module owns no DOM, farm state, simulation timer or WebGL context.
if(new URLSearchParams(location.search).get('world')==='unified-preview'){
 import('./unified-world-preview.js').catch(()=>{/* Main entry retains the legacy fallback. */});
}
