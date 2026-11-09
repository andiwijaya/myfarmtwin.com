import {readFile,writeFile,mkdir} from 'node:fs/promises';import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';import {Box3,OrthographicCamera,Vector3,Mesh} from 'three';import {WORLD_ART} from '../game/client/unified-world-art.js';

// CPU authoring geometry only. Never renders pixels or accepts visual quality.
const modelPath='tools/art/goat.mjs',source=await readFile(modelPath,'utf8'),moduleSource=source.replace("'./vendor/three.module.js'",JSON.stringify(pathToFileURL(resolve('node_modules/three/build/three.module.js')).href)),{createModel}=await import('data:text/javascript;base64,'+Buffer.from(moduleSource).toString('base64')),rig=createModel(WORLD_ART),spec=WORLD_ART.species.goat,point=new Vector3(),box=new Box3(),rows=[],f=spec.frameWorldUnits,p=spec.pivot,camera=new OrthographicCamera(-f*p[0],f*(1-p[0]),f*p[1],-f*(1-p[1]),.1,100),resources=new Set(),released=new Map();
rig.root.traverse(mesh=>{if(!(mesh instanceof Mesh))return;resources.add(mesh.geometry);resources.add(mesh.material);});for(const resource of resources){released.set(resource,0);resource.addEventListener('dispose',()=>released.set(resource,released.get(resource)+1));}
try{
 assert.doesNotMatch(source,/Math\.random|setInterval|requestAnimationFrame|dispatch\(|localStorage/);
 for(const action of spec.actions)for(let frame=0;frame<4;frame++){
  rig.pose(action,frame);box.makeEmpty();rig.root.traverseVisible(mesh=>{if(!(mesh instanceof Mesh))return;const vertices=mesh.geometry.getAttribute('position');for(let i=0;i<vertices.count;i++)box.expandByPoint(point.fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld));});
  assert.ok(box.min.y>=-.001,`Floor clipping ${action}/${frame}: ${box.min.y}`);assert.ok(box.min.y<.04,`Floating goat ${action}/${frame}: ${box.min.y}`);assert.ok(box.max.y<=spec.height+.01,`Native height exceeded ${action}/${frame}: ${box.max.y}`);
  const key=rig.root.toJSON();rig.pose('rest',0);rig.pose(action,frame);assert.deepEqual(rig.root.toJSON(),key,'Pose depends on previous action');
  const projections=[];
  for(let heading=0;heading<4;heading++){
   const angle=WORLD_ART.projection.azimuthDegrees[heading]*Math.PI/180;camera.position.set(Math.sin(angle)*10,Math.tan(WORLD_ART.projection.elevationDegrees*Math.PI/180)*10,Math.cos(angle)*10);camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
   rig.root.traverseVisible(mesh=>{if(!(mesh instanceof Mesh))return;const vertices=mesh.geometry.getAttribute('position');for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld).project(camera);minX=Math.min(minX,point.x);maxX=Math.max(maxX,point.x);minY=Math.min(minY,point.y);maxY=Math.max(maxY,point.y);}});
   const margin=4/(spec.framePixels*WORLD_ART.lowScale);assert.ok(minX>-1+margin&&maxX<1-margin&&minY>-1+margin&&maxY<1-margin,`Atlas clipping ${action}/${frame}/${heading}`);projections.push({heading,minX,maxX,minY,maxY});
  }
  rows.push({action,frame,floor:box.min.y,height:box.max.y,width:box.max.x-box.min.x,depth:box.max.z-box.min.z,projections});
 }
 assert.throws(()=>rig.pose('invented',0),RangeError);assert.throws(()=>rig.pose('idle',NaN),RangeError);
}finally{rig.dispose();rig.dispose();for(const count of released.values())assert.equal(count,1,'Shared authored resource not released exactly once');}
const qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/cpu-goat';await mkdir(qa,{recursive:true});await writeFile(qa+'/geometry.json',JSON.stringify({modelPath,modelSHA256:createHash('sha256').update(source.replaceAll('\r\n','\n')).digest('hex'),poses:rows.length,headings:4,rows,authoringOnly:true,runtimeAtlasVerification:false,scope:'CPU bounds, deterministic pose and exact-once resource checks only. No GPU/browser, pixel render, benchmark or visual-quality pass.'},null,2));console.log(JSON.stringify({cpuGeometry:'pass',modelPath,poses:rows.length,headings:4,runtimeAtlasVerification:false,visualGate:'not run'}));
