import test from 'node:test';import assert from 'node:assert/strict';
import {Scene,Group,Mesh,BoxGeometry,MeshLambertMaterial,OrthographicCamera,Vector3,Vector2,Raycaster} from 'three';
import {projectSceneFaces,pickCanvasFace,containsPoint} from '../client/unified-world-canvas.js';
test('polygon picking includes the boundary and respects actual concave gaps',()=>{
 const polygon=[{x:0,y:0},{x:4,y:0},{x:4,y:1},{x:1,y:1},{x:1,y:4},{x:0,y:4}];
 assert.equal(containsPoint(polygon,.5,3),true);assert.equal(containsPoint(polygon,0,2),true);assert.equal(containsPoint(polygon,3,3),false);assert.equal(containsPoint(polygon,5,1),false);
});
test('shared-scene Canvas face ownership agrees with real raycasts including occluders at four headings',()=>{
 const geometry=new BoxGeometry(1,1,1),material=new MeshLambertMaterial({color:'#91b76c'});
 try{for(let heading=0;heading<4;heading++){
  const angle=heading*Math.PI/2,dx=Math.round(Math.cos(angle)+Math.sin(angle)),dz=Math.round(Math.cos(angle)-Math.sin(angle)),scene=new Scene(),camera=new OrthographicCamera(-6,6,6,-6,.1,100),group=new Group(),box=new Mesh(geometry,material),occluder=new Mesh(geometry,material);
  camera.position.set(10*dx,10,10*dz);camera.lookAt(0,0,0);camera.updateMatrixWorld();group.userData.entityId='field.plot.0';box.position.y=.5;group.add(box);scene.add(group);const p=new Vector3(0,.5,0).project(camera),x=(p.x+1)*300,y=(1-p.y)*300;
  const ray=new Raycaster();ray.setFromCamera(new Vector2(p.x,p.y),camera);scene.updateMatrixWorld(true);assert.equal(ray.intersectObjects(scene.children,true)[0].object,box);assert.equal(pickCanvasFace(projectSceneFaces(scene,camera,600,600),x,y),'field.plot.0');
  occluder.position.set(2*dx,2.5,2*dz);scene.add(occluder);scene.updateMatrixWorld(true);assert.equal(ray.intersectObjects(scene.children,true)[0].object,occluder);assert.equal(pickCanvasFace(projectSceneFaces(scene,camera,600,600),x,y),null);
 }}finally{geometry.dispose();material.dispose();}
});
