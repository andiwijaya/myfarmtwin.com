import {test} from 'node:test';import assert from 'node:assert/strict';
import {Scene,Group,Mesh,BoxGeometry,MeshLambertMaterial,HemisphereLight,OrthographicCamera} from 'three';
import {projectSceneFaces,createCanvasProjectionCache} from '../client/unified-world-canvas.js';

test('composed projection agrees with original per-vertex projection across headings, zoom and nonuniform transforms',()=>{
 const scene=new Scene(),camera=new OrthographicCamera(-24,24,18,-18,.1,200),geometry=new BoxGeometry(),material=new MeshLambertMaterial({color:'#73945b'}),groups=[],cache=createCanvasProjectionCache();
 scene.add(new HemisphereLight('#fff','#49653a',2));for(let n=0;n<4;n++){const group=new Group(),mesh=new Mesh(geometry,material);group.userData.entityId='shape.'+n;group.position.set(n*3-5,n*.3,n*2-3);mesh.scale.set(1.2,.8,.6);group.add(mesh);groups.push(group);scene.add(group);}let points=0;
 const center=face=>({x:face.points.reduce((n,p)=>n+p.x,0)/face.points.length,y:face.points.reduce((n,p)=>n+p.y,0)/face.points.length});
 try{for(const offset of [0,17.25,22.7])for(let heading=0;heading<4;heading++)for(const zoom of [1,2,4])for(const angle of [0,.3,1.1]){
  const a=heading*Math.PI/2;camera.position.set(offset+32*(Math.cos(a)+Math.sin(a)),32,-offset+32*(Math.cos(a)-Math.sin(a)));camera.lookAt(offset,0,-offset);camera.zoom=zoom;camera.updateProjectionMatrix();for(const [n,g]of groups.entries()){g.rotation.set(angle/3,angle,angle/2);g.position.set(offset+n*3-5,n*.3,-offset+n*2-3);}
  const reference=projectSceneFaces(scene,camera,1200,900,undefined,false,false),actual=projectSceneFaces(scene,camera,1200,900,cache,false,true);assert.equal(actual.length,reference.length);
  for(const face of reference){const c=center(face),matches=actual.filter(f=>f.owner===face.owner&&f.points.length===face.points.length&&Math.hypot(center(f).x-c.x,center(f).y-c.y)<1e-8);assert.equal(matches.length,1);const found=matches[0];assert.equal(found.color,face.color);assert.equal(found.depth,face.depth);const used=new Set();for(const p of face.points){const index=found.points.findIndex((q,i)=>!used.has(i)&&Math.hypot(q.x-p.x,q.y-p.y)<1e-8);assert.ok(index>=0);used.add(index);points++;}}
 }assert.ok(points>500);}finally{geometry.dispose();material.dispose();}
});
