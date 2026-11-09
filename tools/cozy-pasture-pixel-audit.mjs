import {readFile,writeFile,mkdir} from 'node:fs/promises';import assert from 'node:assert/strict';import {PNG} from '../node_modules/playwright-core/lib/utilsBundle.js';import {createFarmCamera} from '../game/client/unified-world-camera.js';import {deserialize} from '../game/client/save-schema.js';import {readWorldSnapshot} from '../game/client/unified-world-model.js';
// Read retained original PNG bytes only. No browser, rendering, image editing,
// pose/state changes or claimed hardware/depth measurement belongs here.
const root='qa-artifacts/cozy-world-v1',baseline=JSON.parse(await readFile(root+'/environment-baseline/baseline.json','utf8')),raw=await readFile('game/tests/fixtures/unified-world/v5-mixed.json','utf8'),paddocks=readWorldSnapshot(deserialize(raw)).entities.filter(e=>e.kind==='paddock'),rows=[];
for(const candidate of ['environment-candidate','environment-depth-check']){
 const report=JSON.parse(await readFile(root+'/'+candidate+'/baseline.json','utf8'));assert.equal(report.fixtureSHA256,baseline.fixtureSHA256);
 for(const profile of report.profiles)for(const frame of profile.captures){
  const before=baseline.profiles.find(p=>p.name===profile.name).captures.find(r=>r.path.split('/').at(-1)===frame.path.split('/').at(-1));assert.deepEqual(before.camera,frame.camera);assert.deepEqual(before.stage,frame.stage);
  const a=PNG.sync.read(await readFile(before.path)),b=PNG.sync.read(await readFile(frame.path));assert.equal(a.width,b.width);assert.equal(a.height,b.height);const stage=frame.stage,camera=createFarmCamera();camera.pan(frame.camera.x-camera.view().x,frame.camera.z-camera.view().z);camera.rotate(frame.camera.heading);camera.zoomBy(frame.camera.zoom/camera.view().zoom);const f=camera.frame(stage.width/stage.height);
  for(const paddock of paddocks){
   const corners=[[-1,-1],[-1,1],[1,-1],[1,1]].map(([x,z])=>camera.project({x:paddock.x+x*paddock.width/2,z:paddock.z+z*paddock.depth/2,y:.0003},stage.width/stage.height)),px=corners.map(p=>stage.x+(p.x+1)*stage.width/2),py=corners.map(p=>stage.y+(p.y+1)*stage.height/2);let sampled=0,changed=0;const examples=[];
   for(let y=Math.max(Math.ceil(stage.y),Math.floor(Math.min(...py)));y<Math.min(stage.bottom,b.height,Math.ceil(Math.max(...py)));y++)for(let x=Math.max(Math.ceil(stage.x),Math.floor(Math.min(...px)));x<Math.min(stage.right,b.width,Math.ceil(Math.max(...px)));x++){
    const u=(2*(x+.5-stage.x)/stage.width-1)*f.halfWidth,v=(2*(y+.5-stage.y)/stage.height-1)*f.halfHeight+.0003*Math.sqrt(2/3),wx=f.x+(Math.sqrt(2)*u*f.dz+Math.sqrt(6)*v*f.dx)/2,wz=f.z+(-Math.sqrt(2)*u*f.dx+Math.sqrt(6)*v*f.dz)/2;
    // A0.12 world-unit inset excludes native silhouette raster/MSAA boundaries.
    if(Math.abs(wx-paddock.x)>=paddock.width/2-.12||Math.abs(wz-paddock.z)>=paddock.depth/2-.12)continue;sampled++;const i=(y*b.width+x)*4;if(!a.data.subarray(i,i+4).equals(b.data.subarray(i,i+4))){changed++;if(examples.length<6)examples.push({x,y,world:[wx,wz],before:[...a.data.subarray(i,i+4)],after:[...b.data.subarray(i,i+4)]});}
   }
   rows.push({candidate,profile:profile.name,path:frame.path,baseline:before.path,receiptSHA256:report.receiptSHA256,paddock:paddock.id,camera:frame.camera,sampled,changed,examples});
  }
 }
}
const result={baselineReceiptSHA256:baseline.receiptSHA256,paddocks:paddocks.map(e=>({id:e.id,x:e.x,z:e.z,width:e.width,depth:e.depth})),rows,sampled:rows.reduce((n,r)=>n+r.sampled,0),changed:rows.reduce((n,r)=>n+r.changed,0),scope:'CPU read-only exact RGBA comparison inside the projected canonical native pasture,0.12 world-unit inset, from retained original identical-camera PNGs. Occluded pixels are included; changed rows require inspection. This does not sample exterior district ground, prove GPU draw/depth behaviour, validate unbuilt corrections or close a visual gate.'};const qa=process.env.QA_DIR||root+'/environment-pasture-pixel-audit';await mkdir(qa,{recursive:true});await writeFile(qa+'/pixels.json',JSON.stringify(result,null,2));console.log(JSON.stringify({rows:rows.length,sampled:result.sampled,changed:result.changed,changedRows:rows.filter(r=>r.changed).map(({candidate,profile,path,sampled,changed})=>({candidate,profile,path,sampled,changed}))}));
