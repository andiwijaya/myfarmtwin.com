import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {aquaponic as design} from './aquaponic-design.js';

const vec = (x, y, z) => new THREE.Vector3(x, y, z);
const fromPoint = p => vec(p.x, p.y, p.z);
const normal = vec(0, 1, 0);
const mat = (color, detail = {}) => new THREE.MeshStandardMaterial({color, roughness: .78, ...detail});

export function createAquaponicView(host, onContextLoss) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e9f1e9');
  const camera = new THREE.PerspectiveCamera(40, 1, .03, 45);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
  renderer.domElement.setAttribute('role', 'img');
  renderer.domElement.setAttribute('aria-label', 'Simulasi 3D kolam nila dan dua talang akuaponik');
  host.append(renderer.domElement);
  const orbit = new OrbitControls(camera, renderer.domElement);
  renderer.domElement.tabIndex = 0;
  orbit.minDistance = .7;
  orbit.maxDistance = 14;
  orbit.maxPolarAngle = Math.PI * .48;
  scene.add(new THREE.HemisphereLight('#fffbee', '#78968b', 2.3));
  const light = new THREE.DirectionalLight('#fff4dd', 2.0);
  light.position.set(-2, 6, 3);
  scene.add(light);

  const materials = {
    floor: mat('#bdcfc2'), rim: mat('#2b6f62'), bottom: mat('#b4d5c9'), rail: mat('#506e60'), trough: mat('#d7dcc9'),
    cup: mat('#42584e'), media: mat('#725b3d'), feed: mat('#24857c', {transparent: true, opacity: .83}),
    back: mat('#5280aa', {transparent: true, opacity: .83}), pump: mat('#253c39'),
    shell: mat('#4e9686', {transparent: true, opacity: .16, side: THREE.DoubleSide, depthWrite: false}),
    water: mat('#83d1c7', {transparent: true, opacity: .30, side: THREE.DoubleSide, depthWrite: false, roughness: .24}),
    drop: new THREE.MeshBasicMaterial({color: '#d2fff2'}), blueDrop: new THREE.MeshBasicMaterial({color: '#b7e4ff'}),
    splash: new THREE.MeshBasicMaterial({color: '#c5fff3', transparent: true, opacity: .60, depthWrite: false}),
    waste: mat('#a67742'), air: mat('#668ca6'), internals: mat('#55796e'),
    cutaway: mat('#9bc7b8',{transparent:true,opacity:.19,side:THREE.DoubleSide,depthWrite:false})
  };
  const fittings = new THREE.Group();
  const filled = new THREE.Group();
  const flowing = new THREE.Group();
  const bedHardware = new THREE.Group();
  const bedContents = new THREE.Group();
  const bedCircuits = new THREE.Group();
  const bedFlow = new THREE.Group();
  scene.add(fittings, filled, flowing);
  fittings.add(bedHardware,bedCircuits);
  filled.add(bedContents);
  flowing.add(bedFlow);

  function mesh(group, geometry, material, position) {
    const value = new THREE.Mesh(geometry, material);
    value.position.copy(position);
    group.add(value);
    return value;
  }

  function box(group, width, height, depth, material, x, y, z) {
    return mesh(group, new THREE.BoxGeometry(width, height, depth), material, vec(x, y, z));
  }

  function cylinder(group, radius, height, material, x, y, z, wall = false) {
    return mesh(group, new THREE.CylinderGeometry(radius, radius, height, 54, 1, wall), material, vec(x, y, z));
  }

  function ring(group, radius, thickness, material, position) {
    const value = mesh(group, new THREE.TorusGeometry(radius, thickness, 8, 56), material, position);
    value.rotation.x = -Math.PI / 2;
    return value;
  }

  function circle(group, radius, material, position) {
    const value = mesh(group, new THREE.CircleGeometry(radius, 70), material, position);
    value.rotation.x = -Math.PI / 2;
    return value;
  }

  const {pond, beds, filters, pump, supply, returns, returnPoint} = design;
  const width = design.design.siteWidth / 1000;
  const depth = design.design.siteDepth / 1000;
  box(fittings, width, .045, depth, materials.floor, width / 2, -.024, depth / 2);
  cylinder(fittings, pond.r, .045, materials.bottom, pond.x, .023, pond.z);
  const wall = cylinder(fittings, pond.r, pond.height - .02, materials.shell, pond.x, pond.height / 2, pond.z, true);
  wall.renderOrder = 4;
  ring(fittings, pond.r + .006, .021, materials.rim, vec(pond.x, pond.height, pond.z));
  ring(fittings, pond.r + .005, .012, materials.rim, vec(pond.x, .06, pond.z));
  const pool = circle(filled, pond.r - .016, materials.water, vec(pond.x, pond.water, pond.z));
  pool.renderOrder = 3;
  box(fittings, .14, .105, .12, materials.pump, pump.x, pump.y, pump.z);

  const drumViews = filters.map(filter => {
    const {x,z,r,bottom,height} = filter;
    for (const dx of [-.14,.14]) for (const dz of [-.13,.13]) box(fittings,.036,bottom,.036,materials.rail,x+dx,bottom/2,z+dz);
    const opaque = mat(filter.color);
    const body = cylinder(fittings,r,height,opaque,x,bottom+height/2,z,true);
    body.renderOrder = 4;
    cylinder(fittings,r,.02,materials.rail,x,bottom,z);
    const cap = cylinder(fittings,r+.012,.032,materials.trough,x,bottom+height,z);
    const parts = new THREE.Group(), wet = new THREE.Group(), motion = new THREE.Group();
    scene.add(parts,wet,motion);
    const surface = circle(wet,r-.013,materials.water,vec(x,filter.water,z));
    surface.renderOrder = 3;
    return {filter,opaque,body,cap,parts,wet,motion};
  });

  for (const bed of beds) {
    for (const x of [bed.x - bed.width / 2 + .10, bed.x + bed.width / 2 - .10]) {
      for (const z of [bed.z - bed.depth / 2 + .025, bed.z + bed.depth / 2 - .025]) box(bedHardware, .045, bed.bottom, .045, materials.rail, x, bed.bottom / 2, z);
      box(bedHardware, .042, .05, bed.depth, materials.rail, x, bed.bottom - .035, bed.z);
    }
    box(bedHardware, bed.width, .028, bed.depth, materials.trough, bed.x, bed.bottom, bed.z);
    const sideHeight = bed.lip - bed.bottom;
    const sideY = (bed.lip + bed.bottom) / 2;
    for (const z of [bed.z - bed.depth / 2, bed.z + bed.depth / 2]) box(bedHardware, bed.width, sideHeight, .026, materials.trough, bed.x, sideY, z);
    for (const x of [bed.x - bed.width / 2, bed.x + bed.width / 2]) box(bedHardware, .026, sideHeight, bed.depth, materials.trough, x, sideY, bed.z);
    const channelWater = box(bedContents, bed.width - .04, .005, bed.depth - .04, materials.water, bed.x, bed.water, bed.z);
    channelWater.renderOrder = 3;
    for (const at of bed.pots) {
      for (const sign of [-1, 1]) box(bedHardware, .045, .032, .092, materials.rail, at.x, bed.lip, at.z + sign * .124);
      mesh(bedHardware, new THREE.CylinderGeometry(.085, .061, .130, 16), materials.cup, vec(at.x, bed.lip - .015, at.z));
      mesh(bedContents, new THREE.CylinderGeometry(.076, .076, .013, 16), materials.media, vec(at.x, bed.lip + .040, at.z));
    }
  }

  const beads = [];
  const beadGeometry = new THREE.SphereGeometry(.022, 10, 7);
  const detailBead = new THREE.SphereGeometry(.010,8,6);
  function tube(path, group, radius, material) {
    const vertices = path.map(fromPoint);
    for (let i = 1; i < vertices.length; i++) {
      const a = vertices[i - 1], b = vertices[i];
      const axis = b.clone().sub(a);
      const segment = mesh(group, new THREE.CylinderGeometry(radius, radius, axis.length() + .006, 10), material, a.clone().lerp(b, .5));
      segment.quaternion.setFromUnitVectors(normal, axis.normalize());
    }
  }

  function animatePath(path, group, count, material, geometry = beadGeometry) {
    const line = new THREE.CurvePath();
    const vertices = path.map(fromPoint);
    for (let i = 1; i < vertices.length; i++) line.add(new THREE.LineCurve3(vertices[i-1], vertices[i]));
    const length = line.getLength();
    for (let i = 0; i < count; i++) beads.push({body:mesh(group, geometry, material, vertices[0]), line, length, offset:(i + .40) / count});
  }

  function pipe(path, forward, count, {wet = false, bedCircuit = false} = {}) {
    const flowGroup = bedCircuit ? bedFlow : flowing;
    const pipeGroup = wet ? flowGroup : bedCircuit ? bedCircuits : fittings;
    tube(path,pipeGroup,wet ? .012 : forward ? .019 : .024,wet ? materials.water : forward ? materials.feed : materials.back);
    animatePath(path,flowGroup,count,forward ? materials.drop : materials.blueDrop);
  }

  for (const [i,route] of supply.entries()) pipe(route,true,i === 0 ? 7 : route.length > 3 ? 4 : 2,{bedCircuit:i>2});
  for (const route of returns.slice(0,-1)) pipe(route,false,route.length > 3 ? 8 : 2,{bedCircuit:true});
  pipe(returns.at(-1),false,2,{wet:true,bedCircuit:true});
  for (const bed of beds) {
    // Highlight the direction through the open top of each tray.
    pipe([{x:bed.x - .64,y:bed.water+.03,z:bed.z-.107}, {x:bed.x+.65,y:bed.water+.03,z:bed.z-.107}],true,5,{wet:true,bedCircuit:true});
  }

  const mediaBits = [];
  for (const {filter:f,parts,wet,motion} of drumViews) {
    tube(f.internalInlet,parts,f.id === 'solids' ? .016 : .022,materials.internals);
    tube(f.internalOutlet,parts,.021,materials.internals);
    tube(f.waste,fittings,.018,materials.waste);
    const valve = f.waste[1];
    box(fittings,.072,.020,.035,materials.waste,valve.x,valve.y,valve.z+.034);
    for (const route of f.flow) animatePath(route,motion,route.length > 3 ? 9 : 4,materials.drop,detailBead);
    if (f.well) {
      const {well,hopper,weir} = f;
      const shell = cylinder(parts,well.r,well.top-well.bottom,materials.cutaway,f.x,(well.bottom+well.top)/2,f.z,true);
      shell.renderOrder = 2;
      for (const level of [well.top,well.bottom]) ring(parts,well.r,.007,materials.internals,vec(f.x,level,f.z));
      mesh(parts,new THREE.CylinderGeometry(hopper.r,.022,hopper.shoulder-hopper.base,48,1,true),mat('#b79265',{side:THREE.DoubleSide}),vec(f.x,(hopper.base+hopper.shoulder)/2,f.z));
      const gutter = mesh(parts,new THREE.RingGeometry(weir.r,f.r-.007,48,1),materials.internals,vec(f.x,weir.floor,f.z));
      gutter.rotation.x = -Math.PI/2;
      cylinder(parts,weir.r,weir.crest-weir.floor,materials.internals,f.x,(weir.crest+weir.floor)/2,f.z,true);
      ring(parts,weir.r,.008,materials.internals,vec(f.x,weir.crest,f.z));
    } else {
      const {screen,diffuser} = f;
      const screenMaterial = mat('#50796e',{wireframe:true,transparent:true,opacity:.5});
      cylinder(parts,screen.r,screen.top-screen.bottom,screenMaterial,screen.x,(screen.top+screen.bottom)/2,screen.z,true);
      for (const level of [screen.bottom,screen.top]) ring(parts,screen.r,.006,materials.internals,vec(screen.x,level,screen.z));
      cylinder(parts,screen.r,.01,screenMaterial,screen.x,screen.bottom,screen.z);
      ring(parts,.025,.004,materials.internals,vec(screen.x,screen.crest,screen.z));
      ring(parts,diffuser.r,.011,materials.air,vec(diffuser.x,diffuser.y,diffuser.z));
      const bubbleMaterial = new THREE.MeshBasicMaterial({color:'#e3f5ff',transparent:true,opacity:.76,depthWrite:false});
      const carrierGeometry = new THREE.TorusGeometry(.012,.004,6,11);
      for (let i=0;i<14;i++) {
        const bubble = i<9;
        const body = mesh(wet,bubble ? detailBead : carrierGeometry,bubble ? bubbleMaterial : materials.internals,vec(f.x,f.bottom+.12,f.z));
        mediaBits.push({body,f,bubble,index:i});
      }
    }
  }
  const ripples = [0, 1, 2].map((_, i) => ({
    ring: ring(bedFlow, .09, .0041, materials.splash.clone(), vec(returnPoint.x, returnPoint.y + .008 + i * .001, returnPoint.z)),
    phase: i / 3
  }));

  const animals = [];
  const plants = [];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let stocked = true;
  let running = true;
  let onScreen = true;
  let disposed = false;
  let frame = 0;
  let clock = 0;
  let last = 0;
  let focused = '';

  function setDrumVisibility() {
    bedHardware.visible = !focused;
    bedContents.visible = !focused;
    bedCircuits.visible = !focused;
    bedFlow.visible = !focused;
    for (const {filter,opaque,body,cap,parts,wet,motion} of drumViews) {
      const visible = focused === filter.id;
      body.material = visible ? materials.cutaway : opaque;
      cap.visible = !visible;
      parts.visible = visible;
      wet.visible = visible && stocked;
      motion.visible = visible && running;
    }
  }

  function draw() { if (!disposed) renderer.render(scene, camera); }

  function fit() {
    focused = '';
    setDrumVisibility();
    const narrow = Math.min(1, camera.aspect / 1.40);
    orbit.target.set(width * .5, .47, depth * .49);
    camera.position.copy(orbit.target).addScaledVector(vec(-.77, 1.02, 1.18).normalize(), 4.65 / Math.max(.59, narrow));
    orbit.update();
    draw();
  }

  function focusPond() {
    focused = '';
    setDrumVisibility();
    orbit.target.set(pond.x, .31, pond.z);
    const distance = 2.0 / Math.min(1, Math.max(.68, camera.aspect));
    camera.position.copy(orbit.target).addScaledVector(vec(-.60, 1.18, .92).normalize(), distance);
    orbit.update();
    draw();
  }

  function focusFilter(id) {
    const filter = filters.find(f => f.id === id);
    if (!filter) return;
    focused = id;
    setDrumVisibility();
    orbit.target.set(filter.x,filter.bottom+filter.height*.43,filter.z);
    const distance = 1.56 / Math.min(1,Math.max(.62,camera.aspect));
    camera.position.copy(orbit.target).addScaledVector(vec(.33,.51,-1).normalize(),distance);
    orbit.update();
    draw();
  }

  function orbitByKey(event) {
    const offset = {ArrowLeft:[-.13,0], ArrowRight:[.13,0], ArrowUp:[0,-.11], ArrowDown:[0,.11]}[event.key];
    if (!offset) return;
    event.preventDefault();
    const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(orbit.target));
    spherical.theta += offset[0];
    spherical.phi = Math.max(.12, Math.min(orbit.maxPolarAngle, spherical.phi + offset[1]));
    camera.position.copy(orbit.target).add(vec(0,0,0).setFromSpherical(spherical));
    orbit.update();
    draw();
  }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    const pixelBudget = Math.sqrt(1200000 / (width * height));
    renderer.setPixelRatio(Math.min(1.65, devicePixelRatio || 1, pixelBudget, 2048 / width, 2048 / height));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    draw();
  }

  function update(delta) {
    for (const [i, fish] of animals.entries()) {
      const phase = clock * (.64 + i * .053) + i * 1.28;
      const r = .23 + (i % 3) * .071;
      const dx = -Math.sin(phase) * r;
      const dz = Math.cos(phase) * r * .77;
      fish.body.position.set(pond.x + Math.cos(phase) * r, .155 + Math.sin(phase * .66 + i) * .04, pond.z + Math.sin(phase) * r * .77);
      fish.body.rotation.y = Math.atan2(-dz, dx);
      fish.mixer.update(delta);
    }
    for (const {body, line, length, offset} of beads) body.position.copy(line.getPointAt((clock * .43 / length + offset) % 1));
    for (const {body,f,bubble,index} of mediaBits) {
      const phase = clock*1.6+index*2.43;
      const y = bubble ? f.diffuser.y+((clock*.51+index*.137)%1)*(f.water-f.diffuser.y-.031) : f.bottom+.33+Math.sin(phase)*.104;
      const radius = bubble ? .089+index%3*.018 : .115;
      body.position.set(f.x+Math.cos(phase)*radius,y,f.z+Math.sin(phase)*radius);
      if (!bubble) body.rotation.set(phase,phase*.7,phase*.3);
    }
    for (const {ring: wave, phase} of ripples) {
      const progress = (clock * 1.08 + phase) % 1;
      wave.scale.setScalar(.36 + progress * 1.07);
      wave.material.opacity = (1 - progress) * .65;
    }
  }

  function schedule() {
    if (frame || disposed || !onScreen || !stocked || reduce.matches || (!running && animals.length === 0)) return;
    frame = requestAnimationFrame(tick);
  }

  function tick(now) {
    frame = 0;
    const delta = last ? Math.min(.04, (now - last) / 1000) : 0;
    last = now;
    clock += delta;
    update(delta);
    draw();
    schedule();
  }

  function setState({hasContents, hasFlow}) {
    stocked = hasContents;
    running = hasFlow && stocked;
    filled.visible = stocked;
    flowing.visible = running;
    setDrumVisibility();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    update(0);
    draw();
    schedule();
  }

  function refresh() { setState({hasContents: stocked, hasFlow: running}); }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const intersection = new IntersectionObserver(entries => {
    onScreen = entries[0].isIntersecting;
    refresh();
  });
  intersection.observe(host);
  reduce.addEventListener('change', refresh);
  orbit.addEventListener('change', draw);
  const contextLost = event => { event.preventDefault(); onContextLoss(); };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  renderer.domElement.addEventListener('keydown', orbitByKey);
  resize();
  fit();
  refresh();

  // Game assets carry the original plant geometry and the animated tilapia fins.
  const loader = new GLTFLoader();
  let assetRoots = [];
  const ready = Promise.allSettled([
    loader.loadAsync('/play/assets/models/world/fish.glb'),
    loader.loadAsync('/play/assets/models/prototype/crops.glb')
  ]).then(results => {
    const [fish, greens] = results.map(result => result.status === 'fulfilled' ? result.value : null);
    if (disposed) {
      if (fish) releaseObjects(fish.scene);
      if (greens) releaseObjects(greens.scene);
      return {fish:0, plants:0};
    }
    const swim = fish?.animations.find(clip => clip.name === 'swim');
    if (fish && swim) {
      for (let i = 0; i < 5; i++) {
        const body = fish.scene.clone(true);
        body.scale.setScalar(.64 + (i % 3) * .05);
        const mixer = new THREE.AnimationMixer(body);
        mixer.clipAction(swim).play();
        filled.add(body);
        animals.push({body, mixer});
      }
    }
    const lettuce = greens?.scene.getObjectByName('lettuce_3');
    if (lettuce) {
      const prototype = lettuce.clone(true);
      const bounds = new THREE.Box3().setFromObject(prototype);
      const centre = bounds.getCenter(vec(0, 0, 0));
      const longest = Math.max(...bounds.getSize(vec(0, 0, 0)).toArray());
      for (const bed of beds) for (const at of bed.pots) {
        const plant = prototype.clone(true);
        plant.position.sub(vec(centre.x, bounds.min.y, centre.z));
        const carrier = new THREE.Group();
        carrier.position.set(at.x, at.y + .047, at.z);
        carrier.scale.setScalar(.24 / longest);
        carrier.rotation.y = (plants.length % 5) * 1.17;
        carrier.add(plant);
        bedContents.add(carrier);
        plants.push(carrier);
      }
    }
    // Unused crop stages are outside the scene, so release them on disposal as well.
    assetRoots = [fish?.scene, greens?.scene].filter(Boolean);
    refresh();
    return {fish:animals.length, plants:plants.length};
  });
  return {ready, fit, focusPond, focusFilter, setState, dispose() {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    for (const {mixer} of animals) mixer.stopAllAction();
    resizeObserver.disconnect();
    intersection.disconnect();
    reduce.removeEventListener('change', refresh);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    renderer.domElement.removeEventListener('keydown', orbitByKey);
    orbit.dispose();
    for (const {body,opaque} of drumViews) body.material = opaque;
    releaseObjects(scene, ...assetRoots);
    renderer.dispose();
    renderer.domElement.remove();
  }};
}

function releaseObjects(...roots) {
  const geometries = new Set(), materials = new Set(), textures = new Set();
  for (const root of roots) root.traverse(obj => {
    if (obj.geometry) geometries.add(obj.geometry);
    if (obj.material) for (const material of [obj.material].flat()) materials.add(material);
  });
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) {
    for (const value of Object.values(material)) if (value?.isTexture) textures.add(value);
    material.dispose();
  }
  for (const texture of textures) texture.dispose();
}
