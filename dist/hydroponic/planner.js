import {calculateDesign, engineering, fields, newDesignFrom, validateInput} from './engine.js';
import {assemblyNotes, billTable, dimensions, escapeHtml, flowDiagram, metres, number, planSvg, sideSvg} from './drawings.js';
import {track} from './analytics.js';

const el = id => document.getElementById(id);
const form = el('design-form');
const source = JSON.parse(el('design-presets').textContent);
const query = new URLSearchParams(location.search);
const starting = Object.hasOwn(source, query.get('contoh')) ? source[query.get('contoh')] : Object.values(source)[0];
const fresh = query.get('baru') === '1' ? newDesignFrom(starting) : starting;
const storageKey = `myfarmtwin.hydroponic.v1.${fresh.id}`;
const editable = [...Object.keys(fields), 'rackRotation', 'tankRotation', 'pump'];
const press = (element, pressed) => element.setAttribute('aria-pressed', String(pressed));
const viewHost = el('model-view');

let design = fresh;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (!validateInput(saved).length && saved.id === fresh.id && saved.revision === fresh.revision) design = {...fresh, ...Object.fromEntries(editable.map(key => [key, saved[key]]))};
} catch { /* The form also works with disabled or malformed local storage. */ }

let model = calculateDesign(design);
let readable = true;
let pumping = false;
let moveTarget = '';
let activeView = '2d';
let renderer;
let loading3d;

function fill(d) {
  for (const key of editable) form.elements.namedItem(key).value = d[key];
}

function currentTitle(current) {
  return current.design.id === 'nft-30-lubang' ? `Hidroponik NFT ${current.holeCount} Lubang` : current.design.title;
}

function printMarkup(current) {
  const d = current.design;
  const customized = editable.some(key => d[key] !== fresh[key]);
  return `<header class="print-header"><p>MyFarmTwin · Produksi pangan mandiri</p><h1>${escapeHtml(currentTitle(current))}</h1><p>Model ${d.schemaVersion} · Template rev. ${d.revision} · ${current.holeCount} lubang · ${customized ? 'Penyesuaian pengguna · ' : ''}Berdasarkan perhitungan</p></header>
    <div class="print-views"><section><h2>Denah instalasi</h2>${planSvg(current)}</section><section><h2>Tampak samping rak</h2>${sideSvg(current)}</section></div>
    ${dimensions(current)}<section><h2>Sirkulasi larutan</h2>${flowDiagram(current)}<p>Target ${number(current.targetLpm)} L/menit total · ${number(engineering.targetChannelLpm)} L/menit per kanal · tinggi angkat pada debit target ≈ ${number(current.targetHeadM)} m. Isi tandon saat berjalan ${d.workingLitres} L, perkiraan setelah pompa mati ${number(current.stoppedLitres)} L.</p></section>
    <section class="print-bill"><h2>Daftar komponen</h2>${billTable(current)}</section>
    <section><h2>Perakitan dan uji awal</h2>${assemblyNotes()}</section><p class="small">myfarmtwin.com/hydroponic/ · Angka pada label adalah ukuran kerja. Ukuran gambar menyesuaikan halaman.</p>`;
}

function pumpStatus() {
  const liveFlow = pumping && readable ? model.flowLpm : 0;
  el('pump-state').textContent = !pumping ? 'Pompa mati' : !readable ? 'Periksa ukuran desain' : liveFlow > 0 ? 'Pompa menyala' : 'Pompa menyala · aliran tidak mencapai kanal';
  el('live-flow').textContent = `${number(liveFlow)} L/menit`;
  el('pump-toggle').textContent = pumping ? 'Matikan pompa' : 'Nyalakan pompa';
  press(el('pump-toggle'), pumping);
  renderer?.setFlow(liveFlow);
}

function showPlan() {
  el('plan').innerHTML = planSvg(model, {showWater: pumping && readable});
}

function render() {
  const d = model.design;
  el('design-title').textContent = currentTitle(model);
  el('summary').textContent = `${model.holeCount} lubang · ${d.channelCount} kanal · area ${metres(d.siteWidth)} × ${metres(d.siteDepth)}`;
  el('hydro-metrics').innerHTML = `<div><dt>Debit target</dt><dd>${number(model.targetLpm)} L/menit</dd></div><div><dt>Per kanal saat berjalan</dt><dd>${number(model.flowLpm / d.channelCount)} L/menit</dd></div><div><dt>Tinggi angkat pada target</dt><dd>≈ ${number(model.targetHeadM)} m</dd></div><div><dt>Debit pompa tanpa setelan</dt><dd>≈ ${number(model.capacityLpm)} L/menit</dd></div><div><dt>Larutan setelah pompa mati</dt><dd>≈ ${number(model.stoppedLitres)} L</dd></div><div><dt>Listrik · 24 jam × 30 hari</dt><dd>≈ ${number(model.energyKwh30d)} kWh</dd></div>`;
  el('materials').innerHTML = billTable(model);
  el('layout-dimensions').innerHTML = dimensions(model);
  el('print-sheet').innerHTML = model.issues.length ? '' : printMarkup(model);
  showMessages(model.issues.map(issue => issue.message));
  showPlan();
  pumpStatus();
  renderer?.setModel(model);
}

function showMessages(issues) {
  const messages = el('design-issues');
  messages.hidden = issues.length === 0;
  messages.replaceChildren(...issues.map(message => {
    const row = document.createElement('li');
    row.textContent = message;
    return row;
  }));
  const showPrint = issues.length === 0;
  el('print-action').disabled = !showPrint;
  el('preview-action').disabled = !showPrint;
  el('design-status').textContent = showPrint ? 'Lolos pemeriksaan model' : 'Perlu penyesuaian sebelum dicetak';
  if (!showPrint) closePrintPreview();
}

function applyForm() {
  const next = {...design};
  for (const key of editable) {
    const field = form.elements.namedItem(key);
    next[key] = key === 'pump' ? field.value : field.value === '' ? NaN : Number(field.value);
  }
  const errors = validateInput(next);
  readable = !errors.length;
  el('stale-preview').hidden = readable;
  if (!readable) {
    showMessages(errors);
    showPlan();
    pumpStatus();
    return;
  }
  design = next;
  model = calculateDesign(design);
  try { localStorage.setItem(storageKey, JSON.stringify(design)); } catch { /* Keep editing without persistence. */ }
  render();
}

function stopMoving() {
  moveTarget = '';
  el('plan').classList.remove('placing');
  el('placement-hint').hidden = true;
  for (const button of document.querySelectorAll('[data-move]')) press(button, false);
}

function startMoving(target) {
  setView('2d');
  stopMoving();
  moveTarget = target;
  el('plan').classList.add('placing');
  el('placement-hint').hidden = false;
  el('placement-hint').textContent = `Klik atau ketuk denah untuk menentukan pusat ${target === 'rack' ? 'rak' : 'tandon'}.`;
  const button = document.querySelector(`[data-move="${target}"]`);
  press(button, true);
}

el('plan').addEventListener('click', event => {
  if (!moveTarget) return;
  const svg = el('plan').querySelector('svg');
  const matrix = svg.getScreenCTM();
  if (!matrix) return;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  const snap = (value, max) => Math.max(0, Math.min(max, Math.round(value / 10) * 10));
  form.elements.namedItem(`${moveTarget}X`).value = snap(point.x, design.siteWidth);
  form.elements.namedItem(`${moveTarget}Z`).value = snap(point.y, design.siteDepth);
  stopMoving();
  applyForm();
});

async function setView(view) {
  activeView = view;
  press(el('view-2d'), view === '2d');
  press(el('view-3d'), view === '3d');
  el('plan').hidden = view !== '2d';
  viewHost.hidden = view !== '3d';
  renderer?.show(view === '3d');
  if (view === '2d') return;
  stopMoving();
  if (!renderer && !loading3d) {
    el('view-loading').hidden = false;
    el('view-error').hidden = true;
    loading3d = import('./view3d.js').then(({createView}) => {
      renderer = createView(el('model-canvas'), model, () => {
        renderer?.dispose();
        renderer = null;
        el('view-error').hidden = false;
      });
      renderer.show(activeView === '3d');
      pumpStatus();
    }).catch(() => { el('view-error').hidden = false; }).finally(() => {
      loading3d = null;
      el('view-loading').hidden = true;
    });
  }
}

function select2d() {
  setView('2d');
}

function closePrintPreview() {
  delete document.body.dataset.printPreview;
  press(el('preview-action'), false);
}

form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('input', applyForm);
el('reset-design').addEventListener('click', () => {
  closePrintPreview();
  stopMoving();
  pumping = false;
  fill(fresh);
  applyForm();
});
for (const button of document.querySelectorAll('[data-move]')) button.addEventListener('click', () => moveTarget === button.dataset.move ? stopMoving() : startMoving(button.dataset.move));
document.addEventListener('keydown', event => { if (event.key === 'Escape') stopMoving(); });
el('view-2d').addEventListener('click', select2d);
el('view-3d').addEventListener('click', () => setView('3d'));
el('retry-3d').addEventListener('click', () => setView('3d'));
el('fit-model').addEventListener('click', () => renderer?.fit());
el('pump-toggle').addEventListener('click', () => {
  pumping = !pumping;
  if (pumping) track('hydro_simulation_start', fresh.id, 'planner');
  pumpStatus();
  showPlan();
});
el('preview-action').addEventListener('click', () => {
  if (document.body.dataset.printPreview) return closePrintPreview();
  document.body.dataset.printPreview = 'true';
  press(el('preview-action'), true);
  el('print-sheet').scrollIntoView({block: 'start'});
  el('print-sheet').focus({preventScroll: true});
});
el('print-action').addEventListener('click', () => {
  if (!readable || model.issues.length) return;
  track('hydro_print_click', fresh.id, 'planner');
  window.print();
});

fill(design);
render();
