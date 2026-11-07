/** Presentation-only layout. Reparent original live controls instead of cloning
 * resource totals, native action buttons or their event handlers. */
export function createWorldShell(){
 const root=document.querySelector('#farm'),world=document.querySelector('#world'),hud=document.querySelector('.hud'),weather=document.querySelector('.weather-strip'),preview=document.querySelector('#unified-preview');
 if(!(root instanceof HTMLElement)||!(world instanceof HTMLElement)||!(hud instanceof HTMLElement)||!(preview instanceof HTMLElement))throw Error('World HUD requires the existing farm elements');
 document.body.classList.add('unified-shell');root.dataset.worldLayout='true';root.prepend(hud);hud.after(world);if(weather)hud.after(weather);
 const bar=document.createElement('div');bar.className='world-map-bar';const stage=preview.querySelector('.unified-preview-stage'),exit=preview.querySelector('.unified-preview-exit'),quality=preview.querySelector('select[data-world-quality]')?.parentElement;if(exit)bar.append(exit);if(quality)bar.append(quality);if(stage)preview.insertBefore(bar,stage);
 const title=document.createElement('span');title.className='world-map-title';bar.prepend(title);
 return {
  /** @param {string} locale */
  update(locale){title.textContent=locale==='id'?'Satu lahan, farm milikmu':'One place, your farm';},
  inspect:()=>({originalHud:hud===document.querySelector('.hud'),worldFirst:!!(hud.compareDocumentPosition(world)&Node.DOCUMENT_POSITION_FOLLOWING)})
 };
}
