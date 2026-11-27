import {aquaponic} from './aquaponic-design.js?v=880326e55dc2';
import {createCompatibleView} from './aquaponic-compatible.js?v=880326e55dc2';
import {track} from './analytics.js';

const get = id => document.getElementById(id);
const start = get('aqua-start');
const stage = get('aqua-stage');
const canvas = get('aqua-canvas');
const cover = get('aqua-cover');
const toolbar = get('aqua-toolbar');
const loading = get('aqua-loading');
const error = get('aqua-error');
const quality = get('aqua-quality');
const rendererNote = get('aqua-renderer-note');
const empty = get('aqua-empty');
const filled = get('aqua-filled');
const flow = get('aqua-flow');
const status = get('aqua-status');
const filterButton = get('aqua-focus-filter');
const filterTabs = get('aqua-filter-tabs');
const filterNote = get('aqua-filter-note');
const filterOptions = [...filterTabs.querySelectorAll('[data-filter-focus]')];

let active;
let pending;
let hasContents = true;
let hasFlow = true;
let focus = 'all';
let lastFilter = 'solids';

function trackFlow() { track('hydro_simulation_start', aquaponic.design.id, 'aquaponics'); }

function display() {
  active?.view.setState({hasContents, hasFlow});
  stage.dataset.contents = hasContents ? 'filled' : 'empty';
  stage.dataset.flow = hasFlow ? 'on' : 'off';
  empty.setAttribute('aria-pressed', String(!hasContents));
  filled.setAttribute('aria-pressed', String(hasContents));
  flow.setAttribute('aria-pressed', String(hasFlow));
  flow.disabled = !hasContents;
  flow.textContent = hasFlow ? 'Jeda aliran' : 'Jalankan aliran';
  status.textContent = !hasContents ? 'Instalasi kosong' : hasFlow ? 'Terisi · air bersirkulasi' : 'Terisi · aliran dijeda';
}

function focusView(next) {
  focus = next;
  const isFilter = next === 'solids' || next === 'bio';
  stage.dataset.focus = next;
  filterTabs.hidden = !isFilter;
  filterButton.setAttribute('aria-expanded', String(isFilter));
  for (const option of filterOptions) option.setAttribute('aria-pressed', String(option.dataset.filterFocus === next));
  if (isFilter) {
    lastFilter = next;
    filterNote.textContent = next === 'solids'
      ? 'Ikuti titik putih dari inlet ke tabung tengah, turun ke bawah tabung, lalu naik ke talang limpah dan keluar ke Drum 2. Pipa cokelat adalah kuras tertutup.'
      : 'Ikuti titik putih dari inlet bawah, naik lewat media ke saringan, lalu turun ke pipa outlet menuju talang tanam. Gelembung menunjukkan aerasi dari dasar.';
    active?.view.focusFilter(next);
  } else if (next === 'pond') {
    active?.view.focusPond();
  } else {
    active?.view.fit();
  }
}

function selectDrum(id) {
  focusView(id);
  if (stage.getBoundingClientRect().bottom > window.innerHeight) filterTabs.scrollIntoView({block:'start'});
}

function makeLayer() {
  const layer = document.createElement('div');
  // Keep the backing surface bounded even if a browser has older presentation CSS.
  layer.style.cssText = 'position:absolute;inset:0;overflow:hidden;visibility:hidden';
  layer.setAttribute('aria-hidden', 'true');
  canvas.append(layer);
  return layer;
}

function discard(scene) {
  scene?.view?.dispose();
  scene?.layer?.remove();
}

function show(scene, fish, plants) {
  const previous = active;
  active = scene;
  scene.layer.style.visibility = 'visible';
  scene.layer.removeAttribute('aria-hidden');
  discard(previous);
  stage.dataset.renderer = scene.mode;
  stage.dataset.fish = String(fish);
  stage.dataset.plants = String(plants);
  quality.textContent = scene.mode === 'webgl' ? 'Mode ringan' : 'Detail tinggi';
  error.hidden = true;
  cover.hidden = true;
  toolbar.hidden = false;
  start.hidden = true;
  focusView(focus);
  display();
}

function lightView(note) {
  const layer = makeLayer();
  canvas.hidden = false;
  try {
    const view = createCompatibleView(layer);
    show({layer, view, mode:'compatible'}, view.fish, view.plants);
    rendererNote.textContent = note;
    return true;
  } catch {
    layer.remove();
    if (!active?.view) canvas.hidden = true;
    error.hidden = false;
    return false;
  }
}

function clearPending(scene) {
  if (pending !== scene) return false;
  clearTimeout(scene.timer);
  pending = null;
  quality.disabled = false;
  loading.hidden = true;
  return true;
}

function loseDetail(scene) {
  if (clearPending(scene)) {
    discard(scene);
    rendererNote.textContent = 'Detail tinggi belum bisa dimuat. Mode ringan tetap aktif.';
  } else if (active === scene && !lightView('Tampilan beralih ke mode ringan setelah WebGL terputus.')) {
    discard(active);
    active = null;
    canvas.hidden = true;
    cover.hidden = false;
    toolbar.hidden = true;
    start.hidden = false;
  }
}

start.addEventListener('click', () => {
  if (active || !lightView('Mode ringan aktif.')) return;
  trackFlow();
  if (stage.getBoundingClientRect().bottom > window.innerHeight) get('simulasi').scrollIntoView({block:'start'});
  filled.focus({preventScroll: true});
});

quality.addEventListener('click', async () => {
  if (pending || !active) return;
  if (active.mode === 'webgl') {
    lightView('Mode ringan aktif.');
    return;
  }
  const scene = {mode:'webgl'};
  pending = scene;
  quality.disabled = true;
  loading.hidden = false;
  rendererNote.textContent = '';
  scene.timer = setTimeout(() => loseDetail(scene), 8500);
  try {
    const detail = new URL('./aquaponic-view.js', import.meta.url);
    detail.search = new URL(import.meta.url).search;
    const {createAquaponicView} = await import(detail.href);
    if (pending !== scene) return;
    scene.layer = makeLayer();
    scene.view = createAquaponicView(scene.layer, () => loseDetail(scene));
    scene.view.setState({hasContents:false,hasFlow:false});
    const assets = await scene.view.ready;
    if (pending !== scene) return;
    if (!assets.fish || assets.plants !== aquaponic.holeCount) return loseDetail(scene);
    clearPending(scene);
    show(scene, assets.fish, assets.plants);
    rendererNote.textContent = 'Detail tinggi aktif.';
    quality.focus({preventScroll:true});
  } catch {
    loseDetail(scene);
  }
});

empty.addEventListener('click', () => {
  hasContents = false;
  hasFlow = false;
  display();
});

filled.addEventListener('click', () => {
  if (!hasContents) {
    hasContents = true;
    hasFlow = true;
    trackFlow();
    display();
  }
});

flow.addEventListener('click', () => {
  hasFlow = !hasFlow;
  if (hasFlow) trackFlow();
  display();
});

get('aqua-fit').addEventListener('click', () => focusView('all'));
get('aqua-focus-pond').addEventListener('click', () => focusView('pond'));
filterButton.addEventListener('click', () => filterTabs.hidden ? selectDrum(lastFilter) : focusView('all'));
for (const option of filterOptions) option.addEventListener('click', () => selectDrum(option.dataset.filterFocus));
get('aqua-print').addEventListener('click', () => {
  track('hydro_print_click', aquaponic.design.id, 'aquaponics');
  window.print();
});
