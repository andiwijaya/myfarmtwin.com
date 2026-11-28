import {track} from '../hydroponic/analytics.js';
import {advance, canSow, dayFormat, describePlots, endOfDemo, harvestDay, makePlan, makeRun, monthDate, monthDays,
  planQuery, plantBatch, plotPath, readyCount, scenario, countFormat, shortMonth} from './singkong-model.js';
import {calendarRows, capacityNote, metrics, phaseLabel, planGrid, plotName} from './singkong-markup.js';

const get = id => document.getElementById(`cassava-${id}`);
const form = get('form');
const stage = get('stage');
const map = get('map');
const share = document.querySelector('[data-food-share="design"]');
const inputs = new URLSearchParams(location.search);
const source = ['home','article'].includes(inputs.get('from')) ? inputs.get('from') : 'design_page';
const analytics = (event, action = source) => track(event,'singkong',action);
const fmt = value => countFormat.format(value);
let plan = makePlan(Object.fromEntries(inputs));
let run = makeRun(plan,true);
let readyMode = true;
let selected = (run.month-plan.input.months)%plan.ring;
let plots = [];
let view;
let loading = false;

analytics('food_design_view');

function syncForm() {
  for (const [key,value] of Object.entries(plan.input)) {
    if (key!=='season') form.elements.namedItem(key).value = value;
  }
  for (const checkbox of form.querySelectorAll('input[name="plantingMonth"]')) {
    checkbox.checked = Boolean(plan.input.season & 1<<Number(checkbox.value));
  }
  syncTargetStep();
}

function syncTargetStep() {
  const kilograms = form.elements.unit.value === 'kg';
  const target = form.elements.target;
  target.min = kilograms ? '.1' : '1';
  target.step = kilograms ? '.1' : '1';
  if (!kilograms && target.value) target.value = Math.max(1,Math.round(Number(target.value)));
}

function renderPlotSummary() {
  const plot = plots[selected];
  get('plot-summary').textContent = !plot ? 'Belum ada petak.'
    : `${plot.reserve ? 'Petak cadangan' : plotName(plot.id)} · ${fmt(plot.w)} × ${fmt(plot.d)} m · ${phaseLabel[plot.phase]}${plot.count ? ` · ${plot.count} tanaman` : ''}`;
}

function renderRun() {
  plots = describePlots(plan,run);
  map.innerHTML = planGrid(plan,plots,selected);
  renderPlotSummary();
  const canPlay = run.month<endOfDemo && plan.perPlot>0;
  const ripe = readyCount(plan,run);
  get('from-empty').setAttribute('aria-pressed',String(!readyMode));
  get('from-ready').setAttribute('aria-pressed',String(readyMode));
  const inSeason = canSow(plan.input,run.month);
  get('plant').disabled = !canPlay || !inSeason || run.planted.has(run.month);
  get('pull').disabled = !canPlay || !ripe || run.today>=plan.perDay;
  const remainder = Math.min(ripe,plan.perDay-run.today);
  get('pull').textContent = `Cabut ${remainder || plan.perDay} tanaman`;
  get('day').disabled = !canPlay;
  get('month').disabled = !canPlay;
  const date = dayFormat.format(monthDate(plan.input.start,run.month,run.day));
  const harvested = `${run.today}/${plan.perDay} tanaman dipanen hari ini · ${fmt(run.today*plan.input.kg)} kg segar`;
  const available = run.month<plan.firstHarvest && plan.input.season ? `Panen pertama pada bulan ke-${plan.firstHarvest+1}` : `${ripe} siap dicabut di kelompok bulan ini`;
  get('run-status').textContent = run.month>=endOfDemo ? 'Simulasi selesai. Pilih skenario awal untuk mengulang.'
    : `${date} · ${harvested} · ${available}${inSeason ? '' : ' · di luar jadwal tanam'}${run.missed ? ` · ${run.missed} hari lewat di bawah target` : ''}`;
  view?.update(plan,plots,selected);
}

function renderPlan() {
  const summary = metrics(plan);
  const schedule = calendarRows(plan);
  const note = capacityNote(plan);
  const {spacing,months,loss,kg,season} = plan.input;
  get('metrics').innerHTML = summary;
  get('print-metrics').innerHTML = summary;
  get('calendar').innerHTML = schedule;
  get('print-calendar').innerHTML = schedule;
  get('capacity').textContent = note;
  get('print-capacity').textContent = note;
  get('print-map').innerHTML = planGrid(plan,describePlots(plan,makeRun(plan,true)),0,false);
  const sowMonths = Array.from({length:12},(_,i)=>i).filter(i=>season & 1<<i).map(i=>shortMonth.format(monthDate('2027-01',i))).join(', ');
  get('print-inputs').textContent = `Jarak tanam ${fmt(spacing)} m · lorong 60 cm · umur panen ${months} bulan · estimasi kehilangan ${loss}% · asumsi ${fmt(kg)} kg umbi segar per tanaman. Bulan tanam ${season===4095 ? 'sepanjang tahun' : sowMonths || 'belum dipilih'}.`;
  share.dataset.sharePath = plotPath+planQuery(plan.input);
  renderRun();
}

function restart(ready) {
  readyMode = ready;
  run = makeRun(plan,ready);
  selected = ready ? (run.month-plan.input.months)%plan.ring : 0;
  renderRun();
  view?.focusPlot();
}

function updatePlan(values) {
  plan = makePlan(values);
  run = makeRun(plan,readyMode);
  selected = readyMode ? (run.month-plan.input.months)%plan.ring : 0;
  syncForm();
  renderPlan();
  view?.focusPlot();
}

function setView(threeD) {
  get('view-map').setAttribute('aria-pressed',String(!threeD));
  get('view-3d').setAttribute('aria-pressed',String(threeD));
  get('map-wrap').hidden = threeD;
  stage.hidden = !threeD;
  if (threeD) view?.resize();
}

function status3d(text) {
  const status = get('3d-status');
  status.textContent = text;
  status.hidden = !text;
}

function discardView() {
  view?.dispose();
  view = undefined;
  status3d('Simulasi 3D belum bisa dimuat. Denah 2D tetap dapat digunakan.');
}

async function open3d() {
  setView(true);
  if (view || loading) return;
  loading = true;
  status3d('Memuat simulasi 3D…');
  try {
    const moduleUrl = new URL('./singkong-view.js',import.meta.url);
    moduleUrl.search = new URL(import.meta.url).search;
    const {createCassavaView} = await import(moduleUrl.href);
    view = createCassavaView(get('canvas'),discardView);
    view.update(plan,plots,selected);
    view.focusPlot();
    status3d('');
    analytics('food_simulation_start','3d');
  } catch {
    discardView();
  } finally {
    loading = false;
  }
}

map.addEventListener('click',event=>{
  const item = event.target.closest('[data-cassava-plot]');
  if (!item) return;
  selected = Number(item.dataset.cassavaPlot);
  for (const plot of map.querySelectorAll('[data-cassava-plot]')) plot.setAttribute('aria-pressed',String(plot===item));
  renderPlotSummary();
  view?.update(plan,plots,selected);
  view?.focusPlot();
});

form.elements.unit.addEventListener('change',syncTargetStep);
form.addEventListener('submit',event=>{
  event.preventDefault();
  const values = new FormData(form);
  const season = values.getAll('plantingMonth').reduce((mask,value)=>mask | 1<<Number(value),0);
  updatePlan({...Object.fromEntries(values),season});
  analytics('food_design_customize');
});
get('default').addEventListener('click',()=>updatePlan(scenario));
get('from-empty').addEventListener('click',()=>restart(false));
get('from-ready').addEventListener('click',()=>restart(true));
get('view-map').addEventListener('click',()=>setView(false));
get('view-3d').addEventListener('click',open3d);
get('fit').addEventListener('click',()=>view?.fit());
get('focus-plot').addEventListener('click',()=>view?.focusPlot());
get('plant').addEventListener('click',()=>{
  if (!plantBatch(plan,run)) return;
  selected = run.month%plan.ring;
  renderRun();
  view?.focusPlot();
  analytics('food_cassava_plant');
});
get('pull').addEventListener('click',()=>{
  const picked = harvestDay(plan,run);
  if (!picked) return;
  const ripePlot = (run.month-plan.input.months)%plan.ring;
  const moveCamera = selected!==ripePlot;
  selected = ripePlot;
  renderRun();
  if (moveCamera) view?.focusPlot();
  if (!stage.hidden) view?.pull(plots[ripePlot],picked);
  analytics('food_cassava_harvest');
});
get('day').addEventListener('click',()=>{advance(plan,run,1);renderRun();});
get('month').addEventListener('click',()=>{
  advance(plan,run,monthDays(plan.input.start,run.month)-run.day+1);
  renderRun();
});
get('print').addEventListener('click',()=>{analytics('food_print_click');window.print();});

syncForm();
renderPlan();
