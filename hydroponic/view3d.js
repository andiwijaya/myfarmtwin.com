import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {engineering as e} from './engine.js';

const scaled = p => new THREE.Vector3(p.x / 1000, p.y / 1000, p.z / 1000);
const point = (x, y, z) => new THREE.Vector3(x, y, z);
const xAxis = point(1, 0, 0);
const yAxis = point(0, 1, 0);
const solid = (color, roughness = .7) => new THREE.MeshStandardMaterial({color, roughness});

export function createView(host, initial, onContextLoss) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#e7efe5');
  const camera = new THREE.PerspectiveCamera(39, 1, .03, 100);
  const renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(Math.min(1.75, devicePixelRatio || 1));
  renderer.domElement.setAttribute('aria-label', 'Model tiga dimensi rak hidroponik');
  renderer.domElement.setAttribute('role', 'img');
  host.append(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * .48;
  controls.minDistance = .45;
  controls.maxDistance = 22;
  scene.add(new THREE.HemisphereLight('#fff9e9', '#849d91', 2.15));
  const sunlight = new THREE.DirectionalLight('#fffaf0', 2.15);
  sunlight.position.set(-2, 5, 3);
  scene.add(sunlight);

  const mats = {floor: solid('#c6d8cb'), rail: solid('#41645a', .49), tray: solid('#f0f1df'), cup: solid('#24423a'), rim: solid('#5c8872'), tank: solid('#276e60'), lid: solid('#357c6d'), pump: solid('#273944'), feed: solid('#158f87'), back: solid('#547eac'), water: new THREE.MeshBasicMaterial({color: '#a7ffd9'})};
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let model = initial;
  let body;
  let drops = [];
  let frame = 0;
  let flow = 0;
  let showing = false;
  let disposed = false;

  function draw() {
    if (showing && !disposed) renderer.render(scene, camera);
  }

  function resize() {
    if (!host.clientWidth || !host.clientHeight) return;
    renderer.setSize(host.clientWidth, host.clientHeight, false);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
    draw();
  }

  function fit() {
    const {siteWidth, siteDepth, inletHeight} = model.design;
    const framePoints = [...model.rack, ...model.tank, ...model.routeFeed, {x:0, y:0, z:0}, {x:siteWidth, y:0, z:siteDepth}];
    const minimumX = Math.min(...framePoints.map(p => p.x)) / 1000;
    const maximumX = Math.max(...framePoints.map(p => p.x)) / 1000;
    const minimumZ = Math.min(...framePoints.map(p => p.z)) / 1000;
    const maximumZ = Math.max(...framePoints.map(p => p.z)) / 1000;
    const top = (inletHeight + e.channelHeight + 26) / 1000;
    controls.target.set((minimumX + maximumX) / 2, top / 2, (minimumZ + maximumZ) / 2);
    const back = point(.75, .85, 1).normalize();
    const right = yAxis.clone().cross(back).normalize();
    const up = back.clone().cross(right).normalize();
    const vertical = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * .9;
    const horizontal = vertical * camera.aspect;
    let distance = 1.45;
    for (const x of [minimumX, maximumX]) for (const y of [0, top]) for (const z of [minimumZ, maximumZ]) {
      const corner = point(x, y, z).sub(controls.target);
      const depth = corner.dot(back);
      distance = Math.max(distance, depth + Math.abs(corner.dot(right)) / horizontal, depth + Math.abs(corner.dot(up)) / vertical);
    }
    controls.maxDistance = Math.max(22, distance * 1.6);
    camera.position.copy(controls.target).addScaledVector(back, distance);
    controls.update();
    draw();
  }

  function mesh(geometry, material, centre) {
    const item = new THREE.Mesh(geometry, material);
    if (centre) item.position.copy(centre);
    body.add(item);
    return item;
  }

  function box(width, height, depth, material, centre, rotation = 0) {
    const item = mesh(new THREE.BoxGeometry(width, height, depth), material, centre);
    item.rotation.y = rotation;
    return item;
  }

  function beam(start, end, height, depth, material) {
    const a = scaled(start);
    const b = scaled(end);
    const direction = b.clone().sub(a);
    const item = box(direction.length(), height, depth, material, a.add(b).multiplyScalar(.5));
    item.quaternion.setFromUnitVectors(xAxis, direction.normalize());
  }

  function pipe(raw, diameter, material) {
    const vertices = raw.map(scaled);
    for (let i = 1; i < vertices.length; i++) {
      const from = vertices[i - 1];
      const to = vertices[i];
      const axis = to.clone().sub(from);
      if (axis.lengthSq() < .0000001) continue;
      const piece = mesh(new THREE.CylinderGeometry(diameter / 2, diameter / 2, axis.length() + .006, 10), material, from.clone().lerp(to, .5));
      piece.quaternion.setFromUnitVectors(yAxis, axis.normalize());
      if (i < vertices.length - 1) mesh(new THREE.SphereGeometry(diameter / 2, 8, 6), material, to);
    }
    return vertices;
  }

  function addDrops(vertices, count, phase = 0) {
    const path = new THREE.CurvePath();
    for (let i = 1; i < vertices.length; i++) {
      if (!vertices[i - 1].equals(vertices[i])) path.add(new THREE.LineCurve3(vertices[i - 1], vertices[i]));
    }
    if (path.getLength() === 0) return;
    const geometry = new THREE.SphereGeometry(.017, 8, 6);
    for (let i = 0; i < count; i++) {
      const bead = mesh(geometry, mats.water);
      bead.visible = false;
      drops.push({bead, path, offset: (i / count + phase) % 1});
    }
  }

  function clear() {
    if (!body) return;
    const geometry = new Set();
    body.traverse(object => { if (object.geometry) geometry.add(object.geometry); });
    for (const resource of geometry) resource.dispose();
    scene.remove(body);
  }

  function setModel(next) {
    const changedArea = model.design.siteWidth !== next.design.siteWidth || model.design.siteDepth !== next.design.siteDepth;
    model = next;
    clear();
    body = new THREE.Group();
    drops = [];
    scene.add(body);
    const d = model.design;
    const rotation = -THREE.MathUtils.degToRad(d.tankRotation);
    box(d.siteWidth / 1000, .028, d.siteDepth / 1000, mats.floor, point(d.siteWidth / 2000, -.02, d.siteDepth / 2000));
    box(e.tankWidth / 1000, e.tankHeight / 1000, e.tankDepth / 1000, mats.tank, point(d.tankX / 1000, e.tankHeight / 2000, d.tankZ / 1000), rotation);
    box((e.tankWidth + 14) / 1000, .023, (e.tankDepth + 14) / 1000, mats.lid, point(d.tankX / 1000, .318, d.tankZ / 1000), rotation);
    const outsidePump = scaled({...model.pumpPoint, y: e.tankHeight + 20});
    box(.055, .04, .047, mats.pump, outsidePump, rotation);

    const uprights = model.rack.map((base, index) => {
      const y = (index === 0 || index === 3 ? d.inletHeight : model.outletHeight) - 18;
      box(.035, y / 1000, .035, mats.rail, scaled({...base, y: y / 2}));
      return {...base, y};
    });
    for (const [from, to] of [[0, 3], [1, 2], [0, 1], [2, 3]]) {
      beam(uprights[from], uprights[to], .035, .035, mats.rail);
      beam({...uprights[from], y: 290}, {...uprights[to], y: 290}, .025, .025, mats.rail);
    }
    for (const t of [.08, .92]) {
      const cross = (a, b) => ({x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y), z: a.z + t * (b.z - a.z)});
      beam(cross(uprights[0], uprights[1]), cross(uprights[3], uprights[2]), .035, .035, mats.rail);
    }

    for (const ch of model.channels) {
      beam({...ch.inlet, y: ch.inlet.y + e.channelHeight / 2}, {...ch.outlet, y: ch.outlet.y + e.channelHeight / 2}, e.channelHeight / 1000, e.channelWidth / 1000, mats.tray);
      for (const hole of ch.holes) {
        const position = scaled(hole).add(point(0, .004, 0));
        mesh(new THREE.CylinderGeometry(.027, .027, .008, 16), mats.rim, position);
        mesh(new THREE.CylinderGeometry(.022, .022, .003, 16), mats.cup, position.clone().add(point(0, .005, 0)));
      }
      pipe([ch.feedTap, {...ch.inlet, y: ch.inlet.y + 15}], .009, mats.feed);
      pipe([ch.outlet, ch.returnTap], .023, mats.back);
      addDrops([ch.inlet, ch.outlet].map(p => scaled({...p, y: p.y + e.channelHeight + 23})), 3);
    }
    addDrops(pipe(model.routeFeed, .017, mats.feed), 5);
    addDrops(pipe(model.routeReturn, .031, mats.back), 3);
    pipe(model.feedHeader, .017, mats.feed);
    pipe(model.returnHeader, .031, mats.back);
    setFlow(flow);
    if (changedArea) fit();
    draw();
  }

  function tick(time) {
    frame = 0;
    if (!showing || !flow || disposed) return;
    for (const {bead, path, offset} of drops) {
      bead.visible = true;
      bead.position.copy(path.getPointAt((offset + (reduceMotion.matches ? 0 : time * .00020)) % 1));
    }
    draw();
    if (!reduceMotion.matches) frame = requestAnimationFrame(tick);
  }

  function setFlow(value) {
    flow = value;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    if (flow && showing) tick(performance.now());
    else {
      for (const {bead} of drops) bead.visible = false;
      draw();
    }
  }

  function show(value) {
    showing = value;
    if (value) resize();
    setFlow(flow);
  }

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  const contextLost = event => { event.preventDefault(); onContextLoss(); };
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  controls.addEventListener('change', draw);
  reduceMotion.addEventListener('change', motionChanged);
  function motionChanged() { setFlow(flow); }
  setModel(initial);
  resize();
  fit();

  return {setModel, setFlow, fit, show, dispose() {
    disposed = true;
    if (frame) cancelAnimationFrame(frame);
    observer.disconnect();
    reduceMotion.removeEventListener('change', motionChanged);
    renderer.domElement.removeEventListener('webglcontextlost', contextLost);
    controls.dispose();
    clear();
    for (const material of Object.values(mats)) material.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }};
}
