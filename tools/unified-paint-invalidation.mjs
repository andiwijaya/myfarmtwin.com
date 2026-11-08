/** Adversarial presentation-only fixtures; no simulated engine commands/clock. */
export async function verifyCanvasPaintInvalidation(page){return page.evaluate(async()=>{
 const {createCanvasWorldRenderer}=await import('/play/unified-world-canvas.js');
 const scene=window.__qaScene,camera=window.__qaCamera,stage=document.querySelector('.unified-preview-stage');
 let sprite;scene.traverse(o=>{if(o.isSprite&&o.userData.atlas&&(!sprite||o.userData.kind==='fishSchoolSprite'))sprite=o;});
 const ground=scene.children.find(o=>o.userData.worldGround);if(!sprite||!ground)throw Error('Owned scene sprite/ground missing');
 const atlas=sprite.userData.atlas,color=sprite.material.color.clone(),groundColor=ground.material.color.clone(),groundPosition=ground.position.clone(),cameraPosition=camera.position.clone(),background=scene.background.clone(),groundVisible=ground.visible;
 const pose=atlas.pose,imageWidth=atlas.asset.image.naturalWidth||atlas.asset.image.width,next={...pose,x:(pose.x+pose.width)%imageWidth};
 const surface=()=>{const node=document.createElement('canvas');node.getContext('2d',{willReadFrequently:true});return node;};const a=surface(),b=surface(),cached=createCanvasWorldRenderer(a,scene,camera,1.25,true),reference=createCanvasWorldRenderer(b,scene,camera,1.25,false,false,true),cases=[];
 let prior=null,differentFixtures=0;
 function compare(name){
  for(let n=0;n<3;n++)cached.render(stage.clientWidth,stage.clientHeight);
  reference.render(stage.clientWidth,stage.clientHeight);
  const x=a.getContext('2d').getImageData(0,0,a.width,a.height).data,y=b.getContext('2d').getImageData(0,0,b.width,b.height).data;
  let changed=0,changedFromPrior=0,minX=a.width,minY=a.height,maxX=0,maxY=0,maxDelta=0;for(let i=0;i<x.length;i++){if(x[i]!==y[i]){changed++;const p=i>>2,px=p%a.width,py=Math.floor(p/a.width);minX=Math.min(minX,px);minY=Math.min(minY,py);maxX=Math.max(maxX,px);maxY=Math.max(maxY,py);maxDelta=Math.max(maxDelta,Math.abs(x[i]-y[i]));}if(prior&&y[i]!==prior[i])changedFromPrior++;}
  if(changed){window.__qaPaintFailure={name,changed,bounds:{minX,minY,maxX,maxY,maxDelta},cachedPNG:a.toDataURL(),referencePNG:b.toDataURL(),inspection:cached.inspect(),cases,pose:{...sprite.userData.atlas.pose},color:sprite.material.color.toArray()};throw Error('Canvas cache invalidation '+name+': '+changed+' channel bytes');}
  if(changedFromPrior)differentFixtures++;prior=y;const inspection=cached.inspect();

  if(inspection.spriteReuses<1)throw Error('Sprite cache never reused');cases.push({name,pixels:a.width*a.height,changedChannelBytes:changed,spriteReuses:inspection.spriteReuses,prefix:inspection.prefix,changedFromPrior});
 }
 const fixtures=[{name:'original',pose},{name:'repeat',pose},{name:'next-pose',pose:next},{name:'blend-zero',pose:next,from:pose,mix:0},{name:'blend-four-tenths',pose:next,from:pose,mix:.4},{name:'blend-seven-tenths',pose:next,from:pose,mix:.7},{name:'blend-finished',pose:next,from:pose,mix:1},{name:'tint',pose:next,tint:[.3,.5,.8]},{name:'white',pose,tint:[1,1,1]},{name:'tinted-blend',pose:next,from:pose,mix:.25,tint:[.7,.4,.2]}];
 try{
  for(const f of fixtures){sprite.userData.atlas={...atlas,pose:f.pose,from:f.from||null,mix:f.mix??1};if(f.tint)sprite.material.color.setRGB(...f.tint);else sprite.material.color.copy(color);compare(f.name);}
  if(!differentFixtures)throw Error('Adversarial sprite was not visibly painted');
  ground.material.color.setRGB(.3,.45,.25);compare('ground-color');ground.material.color.copy(groundColor);compare('ground-color-restored');
  ground.position.x+=.15;compare('ground-position');ground.position.copy(groundPosition);compare('ground-position-restored');
  scene.background.setRGB(.2,.3,.4);compare('background');scene.background.copy(background);compare('background-restored');
  camera.position.x+=1;compare('camera-position');camera.position.copy(cameraPosition);compare('camera-position-restored');
  ground.visible=false;compare('ground-hidden');ground.visible=groundVisible;compare('ground-visible');
  return{entityId:sprite.userData.entityId,differentFixtures,cases,scope:'Synthetic pose/UV, blend/color, ground transform/visibility, camera and background invalidations in the actual scene. Cached painting equals the uncached reference; not a gameplay or physical-device fixture.'};
 }finally{
  sprite.userData.atlas=atlas;sprite.material.color.copy(color);delete sprite.userData.canvasPaint;ground.material.color.copy(groundColor);ground.position.copy(groundPosition);ground.visible=groundVisible;scene.background.copy(background);camera.position.copy(cameraPosition);cached.dispose();reference.dispose();
  const inspection=cached.inspect();if(inspection.prefix.backingBytes!==0||inspection.paths.enabled)throw Error('Owned Canvas buffers survived disposal');
 }
 });}
