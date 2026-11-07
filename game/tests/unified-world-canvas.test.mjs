import test from 'node:test';import assert from 'node:assert/strict';
import {Scene,Group,Mesh,BoxGeometry,MeshLambertMaterial,OrthographicCamera,Vector3,Vector2,Raycaster,Color,HemisphereLight,DirectionalLight,BufferGeometry,Float32BufferAttribute} from 'three';
import {projectSceneFaces,pickCanvasFace,containsPoint,createCanvasLighting} from '../client/unified-world-canvas.js';

test('fallback follows linear Lambert irradiance and the actual scene light directions',()=>{
 const scene=new Scene(),hemi=new HemisphereLight('#ffffff','#000000',Math.PI),white=new Color('#ffffff');scene.add(hemi);scene.updateMatrixWorld(true);let shade=createCanvasLighting(scene);
 assert.equal(shade(white,new Vector3(0,1,0)),'rgb(255,255,255)');assert.equal(shade(white,new Vector3(0,-1,0)),'rgb(0,0,0)');assert.equal(shade(white,new Vector3(1,0,0)),'rgb(188,188,188)');
 scene.remove(hemi);const sun=new DirectionalLight('#ffffff',Math.PI);sun.position.set(0,0,10);scene.add(sun);scene.updateMatrixWorld(true);shade=createCanvasLighting(scene);assert.equal(shade(white,new Vector3(0,0,1)),'rgb(255,255,255)');assert.equal(shade(white,new Vector3(0,0,-1)),'rgb(0,0,0)');
});
test('polygon picking includes the boundary and respects actual concave gaps',()=>{
 const polygon=[{x:0,y:0},{x:4,y:0},{x:4,y:1},{x:1,y:1},{x:1,y:4},{x:0,y:4}];
 assert.equal(containsPoint(polygon,.5,3),true);assert.equal(containsPoint(polygon,0,2),true);assert.equal(containsPoint(polygon,3,3),false);assert.equal(containsPoint(polygon,5,1),false);
});
test('roof-covered wall tops are culled and real gable triangles retain correct projection ownership',()=>{const scene=new Scene(),camera=new OrthographicCamera(-3,3,3,-3,.1,100),geometry=new BoxGeometry(),material=new MeshLambertMaterial(),body=new Mesh(geometry,material),gableGeometry=new BufferGeometry().setAttribute('position',new Float32BufferAttribute([-.5,0,0,.5,0,0,0,1,0],3)).setAttribute('normal',new Float32BufferAttribute([0,0,1,0,0,1,0,0,1],3)),gable=new Mesh(gableGeometry,material);try{camera.position.set(5,5,5);camera.lookAt(0,0,0);scene.add(body);const before=projectSceneFaces(scene,camera,600,600);body.userData.coveredTop=true;assert.equal(projectSceneFaces(scene,camera,600,600).length,before.length-1);scene.remove(body);gable.userData.worldGable=true;gable.userData.entityId='cow.barn';scene.add(gable);const faces=projectSceneFaces(scene,camera,600,600),p=new Vector3(0,.3,0).project(camera);assert.equal(faces.length,1);assert.equal(faces[0].points.length,3);assert.equal(pickCanvasFace(faces,(p.x+1)*300,(1-p.y)*300),'cow.barn');}finally{geometry.dispose();gableGeometry.dispose();material.dispose();}});
test('shared-scene Canvas face ownership agrees with real raycasts including occluders at four headings',()=>{
 const geometry=new BoxGeometry(1,1,1),material=new MeshLambertMaterial({color:'#91b76c'});
 try{for(let heading=0;heading<4;heading++){
  const angle=heading*Math.PI/2,dx=Math.round(Math.cos(angle)+Math.sin(angle)),dz=Math.round(Math.cos(angle)-Math.sin(angle)),scene=new Scene(),camera=new OrthographicCamera(-6,6,6,-6,.1,100),group=new Group(),box=new Mesh(geometry,material),occluder=new Mesh(geometry,material);
  camera.position.set(10*dx,10,10*dz);camera.lookAt(0,0,0);camera.updateMatrixWorld();group.userData.entityId='field.plot.0';box.position.y=.5;group.add(box);scene.add(group);const p=new Vector3(0,.5,0).project(camera),x=(p.x+1)*300,y=(1-p.y)*300;
  const ray=new Raycaster();ray.setFromCamera(new Vector2(p.x,p.y),camera);scene.updateMatrixWorld(true);assert.equal(ray.intersectObjects(scene.children,true)[0].object,box);assert.equal(pickCanvasFace(projectSceneFaces(scene,camera,600,600),x,y),'field.plot.0');
  occluder.position.set(2*dx,2.5,2*dz);scene.add(occluder);scene.updateMatrixWorld(true);assert.equal(ray.intersectObjects(scene.children,true)[0].object,occluder);assert.equal(pickCanvasFace(projectSceneFaces(scene,camera,600,600),x,y),null);
 }}finally{geometry.dispose();material.dispose();}
});
