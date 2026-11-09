import {readFile,writeFile,mkdir} from 'node:fs/promises';import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';import assert from 'node:assert/strict';import {Box3,OrthographicCamera,Vector3,Mesh} from 'three';
import {WORLD_ART} from '../game/client/unified-world-art.js';

// CPU geometry checks only. This neither renders pixels nor accepts art quality.
const source=await readFile('tools/art/cow.mjs','utf8'),moduleSource=source.replace("'./vendor/three.module.js'",JSON.stringify(pathToFileURL(resolve('node_modules/three/build/three.module.js')).href)),{createModel}=await import('data:text/javascript;base64,'+Buffer.from(moduleSource).toString('base64')),rig=createModel(),spec=WORLD_ART.species.cow,box=new Box3(),rows=[],point=new Vector3(),f=spec.frameWorldUnits,p=spec.pivot,camera=new OrthographicCamera(-f*p[0],f*(1-p[0]),f*p[1],-f*(1-p[1]),.1,100);
// Box3.setFromObject includes invisible anatomy. Only rendered vertices belong
// to floor/frame acceptance; a folded cow intentionally hides the udder group.
const visibleBounds=()=>{box.makeEmpty();rig.root.traverseVisible(mesh=>{if(!(mesh instanceof Mesh))return;const v=mesh.geometry.getAttribute('position');for(let i=0;i<v.count;i++)box.expandByPoint(point.fromBufferAttribute(v,i).applyMatrix4(mesh.matrixWorld));});};
try{
 assert.doesNotMatch(source,/Math\.random|setInterval|requestAnimationFrame|dispatch\(|localStorage/);
 for(const action of spec.actions)for(let frame=0;frame<4;frame++){
  rig.pose(action,frame);visibleBounds();assert.ok(box.min.y>=-.001,`Floor clipping: ${action}/${frame} ${box.min.y}`);assert.ok(box.min.y<.1,`Floating rig: ${action}/${frame} ${box.min.y}`);
  const key=rig.root.toJSON();rig.pose('rest',0);rig.pose(action,frame);assert.deepEqual(rig.root.toJSON(),key,'Pose depends on prior action');
  const projections=[];
  for(let heading=0;heading<4;heading++){
   const angle=WORLD_ART.projection.azimuthDegrees[heading]*Math.PI/180;camera.position.set(Math.sin(angle)*10,Math.tan(WORLD_ART.projection.elevationDegrees*Math.PI/180)*10,Math.cos(angle)*10);camera.lookAt(0,0,0);camera.updateProjectionMatrix();camera.updateMatrixWorld(true);let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
   rig.root.traverseVisible(mesh=>{if(!(mesh instanceof Mesh))return;const vertices=mesh.geometry.getAttribute('position');for(let i=0;i<vertices.count;i++){point.fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld).project(camera);minX=Math.min(minX,point.x);maxX=Math.max(maxX,point.x);minY=Math.min(minY,point.y);maxY=Math.max(maxY,point.y);}});
   const margin=4/(spec.framePixels*WORLD_ART.lowScale);assert.ok(minX>-1+margin&&maxX<1-margin&&minY>-1+margin&&maxY<1-margin,`Atlas geometry clipping ${action}/${frame}/${heading}: ${JSON.stringify({minX,maxX,minY,maxY})}`);projections.push({heading,minX,maxX,minY,maxY});
  }
  rows.push({action,frame,floor:box.min.y,height:box.max.y,projections});
 }
 assert.throws(()=>rig.pose('invented',0),RangeError);assert.throws(()=>rig.pose('idle',NaN),RangeError);
}finally{rig.dispose();rig.dispose();}
const qa=process.env.QA_DIR||'qa-artifacts/cozy-world-v1/cpu-rig';await mkdir(qa,{recursive:true});await writeFile(qa+'/geometry.json',JSON.stringify({authoringOnly:true,runtimeAtlasVerification:false,actions:spec.actions.length,poses:rows.length,headings:4,rows,scope:'CPU bounds and deterministic authoring poses only. No rendered pixels, GPU/browser run, benchmark or visual-quality pass.'},null,2));console.log(JSON.stringify({cpuGeometry:'pass',poses:rows.length,headings:4,runtimeAtlasVerification:false,visualGate:'not run'}));
