import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const soil = {kosong:'#967957',cadangan:'#a58d71',stek:'#a27951',tumbuh:'#87623e',panen:'#775936'};

function cassavaLeaf() {
  const leaf = new THREE.Shape();
  for (let i=0;i<28;i++) {
    const angle = i*Math.PI/14;
    const radius = i%4===0 ? 1 : i%2===0 ? .29 : .50;
    const x = Math.cos(angle)*radius, y = Math.sin(angle)*radius;
    if (i===0) leaf.moveTo(x,y); else leaf.lineTo(x,y);
  }
  leaf.closePath();
  return new THREE.ShapeGeometry(leaf).rotateX(-Math.PI/2);
}

export function createCassavaView(host,onLoss) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e8eee0');
  const camera = new THREE.PerspectiveCamera(40,1,.06,600);
  const renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.domElement.setAttribute('role','img');
  renderer.domElement.setAttribute('aria-label','Model 3D petak singkong dan tanaman');
  host.append(renderer.domElement);

  scene.add(new THREE.HemisphereLight('#f6f8e5','#9c866d',2.2));
  const sun = new THREE.DirectionalLight('#fff1cc',1.7);
  sun.position.set(9,18,11);
  scene.add(sun);
  const controls = new OrbitControls(camera,renderer.domElement);
  controls.maxPolarAngle = Math.PI*.46;
  controls.minDistance = 1.4;
  const groundMat = new THREE.MeshStandardMaterial({color:'#c3cbb0'});
  const soilMaterials = Object.fromEntries(Object.entries(soil).map(([phase,color])=>
    [phase,new THREE.MeshStandardMaterial({color,roughness:.96})]));
  const stalkMat = new THREE.MeshStandardMaterial({color:'#82694c'});
  const leafMat = new THREE.MeshStandardMaterial({color:'#41734a',side:THREE.DoubleSide,roughness:.82});
  const rootMat = new THREE.MeshStandardMaterial({color:'#9e693c',roughness:.88});
  const emphasis = new THREE.LineBasicMaterial({color:'#f0bd62'});
  const box = new THREE.BoxGeometry(1,1,1);
  const rim = new THREE.EdgesGeometry(box);
  const stalk = new THREE.CylinderGeometry(.62,1,1,6);
  const leaf = cassavaLeaf();
  const root = new THREE.SphereGeometry(1,9,7);
  const land = new THREE.Mesh(box,groundMat);
  const border = new THREE.LineSegments(rim,emphasis);
  const field = new THREE.Group();
  const canopy = new THREE.Group();
  scene.add(land,field,canopy,border);
  const dummy = new THREE.Object3D();
  const tint = new THREE.Color();
  let plan, plots, selected;
  let crop, sprigs;
  let pulling;
  let frame = 0;

  function draw() { renderer.render(scene,camera); }

  function resize() {
    if (!host.clientWidth || !host.clientHeight) return;
    renderer.setSize(host.clientWidth,host.clientHeight,false);
    camera.aspect = host.clientWidth/host.clientHeight;
    camera.updateProjectionMatrix();
    draw();
  }

  function position(plot,index) {
    const step = plan.input.spacing;
    const {across,down} = plan.beds;
    return [
      plot.x+(plot.w-(across-1)*step)/2+(index%across)*step,
      plot.z+(plot.d-(down-1)*step)/2+Math.floor(index/across)*step
    ];
  }

  function setMatrix(mesh,index,x,y,z,sx,sy,sz,turn=0) {
    dummy.position.set(x,y,z);
    dummy.rotation.set(0,turn,0);
    dummy.scale.set(sx,sy,sz);
    dummy.updateMatrix();
    mesh.setMatrixAt(index,dummy.matrix);
  }

  function rebuildCrops() {
    if (crop) {
      canopy.remove(crop,sprigs);
      crop.dispose();
      sprigs.dispose();
    }
    const visibleCount = plots.reduce((total,plot)=>total+Math.min(120,plot.count),0);
    crop = new THREE.InstancedMesh(stalk,stalkMat,visibleCount);
    sprigs = new THREE.InstancedMesh(leaf,leafMat,3*visibleCount);
    canopy.add(crop,sprigs);
    let stem = 0, leaves = 0;
    for (const plot of plots) {
      const sample = Math.min(120,plot.count);
      const height = plot.age===0 ? .22 : Math.min(1.65,.40+plot.age*.14);
      for (let i=0;i<sample;i++) {
        const index = Math.floor(i*plot.count/sample);
        const [x,z] = position(plot,index);
        setMatrix(crop,stem++,x,.04+height/2,z,.038,height,.038);
        if (plot.age===0) continue;
        for (let j=0;j<3;j++) {
          const angle = index*1.6+j*2.15;
          const r = Math.min(.42,height*.28);
          setMatrix(sprigs,leaves,x+Math.cos(angle)*r*.68,.04+height-j*.15,z+Math.sin(angle)*r*.68,r,1,r,angle);
          sprigs.setColorAt(leaves++,tint.set(j===2 ? '#9bc26f' : '#b7d89a'));
        }
      }
    }
    sprigs.count = leaves;
    crop.instanceMatrix.needsUpdate = true;
    sprigs.instanceMatrix.needsUpdate = true;
    if (sprigs.instanceColor) sprigs.instanceColor.needsUpdate = true;
  }

  function update(next,nextPlots,id) {
    const planChanged = plan!==next;
    const plotsChanged = plots!==nextPlots;
    plan = next;
    plots = nextPlots;
    selected = plots[id];
    if (planChanged) {
      field.clear();
      land.scale.set(plan.input.width,.12,plan.input.depth);
      land.position.set(plan.input.width/2,-.08,plan.input.depth/2);
      for (const plot of plots) {
        const bed = new THREE.Mesh(box,soilMaterials[plot.phase]);
        bed.position.set(plot.x+plot.w/2,-.02,plot.z+plot.d/2);
        bed.scale.set(plot.w,.13,plot.d);
        field.add(bed);
      }
    }
    if (plotsChanged) {
      for (const [id,bed] of field.children.entries()) bed.material = soilMaterials[plots[id].phase];
      rebuildCrops();
    }
    border.visible = Boolean(selected);
    if (selected) {
      border.position.set(selected.x+selected.w/2,.04,selected.z+selected.d/2);
      border.scale.set(selected.w,.024,selected.d);
    }
    draw();
  }

  function look(x,z,radius) {
    controls.target.set(x,.2,z);
    camera.position.set(x+radius*.70,radius*.94,z+radius*.82);
    controls.maxDistance = Math.max(24,Math.hypot(plan.input.width,plan.input.depth)*2.5);
    controls.update();
    draw();
  }

  function fit() {
    const {width,depth} = plan.input;
    look(width/2,depth/2,Math.max(width,depth)*1.08/Math.min(1,camera.aspect));
  }

  function focusPlot() {
    if (!selected) return fit();
    const {x,z,w,d} = selected;
    look(x+w/2,z+d/2,Math.max(2.8,w,d)*.92/Math.min(1,camera.aspect));
  }

  function finishPull() {
    cancelAnimationFrame(frame);
    if (pulling) scene.remove(pulling);
    pulling = undefined;
    frame = 0;
  }

  function pull(plot,count) {
    finishPull();
    if (!plot) return;
    pulling = new THREE.Group();
    scene.add(pulling);
    for (let i=0;i<Math.min(5,count);i++) {
      const [x,z] = position(plot,plot.count+i);
      const plant = new THREE.Group();
      plant.position.set(x,0,z);
      const branch = new THREE.Mesh(stalk,stalkMat);
      branch.position.y = .60;
      branch.scale.set(.045,1.25,.045);
      plant.add(branch);
      const crown = new THREE.Mesh(leaf,leafMat);
      crown.position.y = 1.2;
      crown.scale.set(.47,1,.47);
      plant.add(crown);
      for (let j=0;j<4;j++) {
        const angle = j*Math.PI/2+.35;
        const tuber = new THREE.Mesh(root,rootMat);
        tuber.position.set(Math.cos(angle)*.16,-.29,Math.sin(angle)*.16);
        tuber.scale.set(.095,.27,.09);
        tuber.rotation.set(Math.sin(angle)*.62,0,-Math.cos(angle)*.62);
        plant.add(tuber);
      }
      pulling.add(plant);
    }
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const started = performance.now();
    function animate(now) {
      const elapsed = now-started;
      const lift = reduced ? 1 : Math.min(1,elapsed/660);
      pulling.position.y = 1.3*(1-(1-lift)**3);
      if (elapsed>=2300) finishPull(); else frame = requestAnimationFrame(animate);
      draw();
    }
    frame = requestAnimationFrame(animate);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  controls.addEventListener('change',draw);
  const lost = event => {event.preventDefault();onLoss();};
  renderer.domElement.addEventListener('webglcontextlost',lost);
  resize();
  return {update,resize,fit,focusPlot,pull,dispose() {
    finishPull();
    observer.disconnect();
    controls.dispose();
    renderer.domElement.removeEventListener('webglcontextlost',lost);
    crop?.dispose();
    sprigs?.dispose();
    for (const item of [box,rim,stalk,leaf,root,groundMat,...Object.values(soilMaterials),stalkMat,leafMat,rootMat,emphasis]) item.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }};
}
