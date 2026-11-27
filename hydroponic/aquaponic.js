import {aquaponic} from './aquaponic-design.js';
import {track} from './analytics.js';

const get = id => document.getElementById(id);
const start = get('aqua-start');
const stage = get('aqua-stage');
const canvas = get('aqua-canvas');
const cover = get('aqua-cover');
const toolbar = get('aqua-toolbar');
const loading = get('aqua-loading');
const error = get('aqua-error');
const assetHint = get('aqua-asset-hint');
const empty = get('aqua-empty');
const filled = get('aqua-filled');
const flow = get('aqua-flow');
const status = get('aqua-status');

let view;
let busy = false;
let hasContents = true;
let hasFlow = true;

function trackFlow() { track('hydro_simulation_start', aquaponic.design.id, 'aquaponics'); }

function display() {
  view?.setState({hasContents, hasFlow});
  stage.dataset.contents = hasContents ? 'filled' : 'empty';
  stage.dataset.flow = hasFlow ? 'on' : 'off';
  empty.setAttribute('aria-pressed', String(!hasContents));
  filled.setAttribute('aria-pressed', String(hasContents));
  flow.setAttribute('aria-pressed', String(hasFlow));
  flow.disabled = !hasContents;
  flow.textContent = hasFlow ? 'Jeda aliran' : 'Jalankan aliran';
  status.textContent = !hasContents ? 'Instalasi kosong' : hasFlow ? 'Terisi · air bersirkulasi' : 'Terisi · aliran dijeda';
}

function recover() {
  view?.dispose();
  view = null;
  canvas.hidden = true;
  cover.hidden = false;
  toolbar.hidden = true;
  assetHint.hidden = true;
  error.hidden = false;
  start.hidden = false;
  start.textContent = 'Coba muat ulang 3D';
}

start.addEventListener('click', async () => {
  if (busy || view) return;
  busy = true;
  start.disabled = true;
  error.hidden = true;
  loading.hidden = false;
  try {
    const {createAquaponicView} = await import('./aquaponic-view.js');
    canvas.hidden = false;
    cover.hidden = true;
    const current = createAquaponicView(canvas, recover);
    view = current;
    display();
    const assets = await current.ready;
    if (view !== current) return;
    stage.dataset.fish = String(assets.fish);
    stage.dataset.plants = String(assets.plants);
    assetHint.hidden = assets.fish > 0 && assets.plants === aquaponic.holeCount;
    toolbar.hidden = false;
    start.hidden = true;
    trackFlow();
    if (stage.getBoundingClientRect().bottom > window.innerHeight) get('simulasi').scrollIntoView({block:'start'});
    filled.focus({preventScroll: true});
  } catch {
    recover();
  } finally {
    busy = false;
    start.disabled = false;
    loading.hidden = true;
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

get('aqua-fit').addEventListener('click', () => view?.fit());
get('aqua-focus-pond').addEventListener('click', () => view?.focusPond());
get('aqua-print').addEventListener('click', () => {
  track('hydro_print_click', aquaponic.design.id, 'aquaponics');
  window.print();
});
