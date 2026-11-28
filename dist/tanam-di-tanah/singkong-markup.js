import {countFormat, monthFormat} from './singkong-model.js?v=1d343723a12b';

const fmt = value => countFormat.format(value);
export const phaseLabel = {kosong:'Kosong',stek:'Baru ditanam',tumbuh:'Tumbuh',panen:'Siap panen',cadangan:'Cadangan'};
export const plotName = id => `Petak ${id+1}`;

export function metrics(plan) {
  const {input,perDay,mature,covered,days,area} = plan;
  const items = [
    ['Luas lahan',`${fmt(area)} m²`,`${fmt(input.width)} × ${fmt(input.depth)} m`],
    ['Stek per bulan',`${plan.perPlot} stek`,`${mature} diperkirakan siap panen`],
    ['Target harian',`${perDay} tanaman`,`≈ ${fmt(perDay*input.kg)} kg umbi segar`],
    ['Hari target tercapai',`${covered} / ${days}`,'12 bulan sejak panen pertama']
  ];
  return items.map(([label,value,detail])=>`<div><dt>${label}</dt><dd><strong>${value}</strong><small>${detail}</small></dd></div>`).join('');
}

export function capacityNote(plan) {
  const {input,perPlot,suggested,covered,days,reference} = plan;
  const example = `Contoh lahan untuk ${suggested} stek per kelompok adalah ${fmt(reference.width)} × ${fmt(reference.depth)} m (≈ ${fmt(reference.width*reference.depth)} m²), termasuk lorong dan petak cadangan.`;
  if (!perPlot) return 'Ukuran ini belum memuat posisi tanam dengan jarak dan lorong yang dipilih. '+example;
  if (!input.season) return 'Belum ada bulan tanam yang dipilih. Aktifkan bulan dengan ketersediaan air yang cukup.';
  if (covered < days) {
    const shortage = `Target kurang terpenuhi ${days-covered} hari dalam 12 bulan sejak awal panen.`;
    const season = ' Kalender memasukkan jeda pasokan dari bulan tanam yang tidak dipilih.';
    return shortage+(perPlot<suggested ? ' '+example : '')+(input.season!==4095 ? season : '');
  }
  return `Target harian terpenuhi pada asumsi model. Petak ${plan.ring+1} disediakan sebagai cadangan, di luar jadwal tanam rutin.`;
}

export function calendarRows(plan) {
  return plan.calendar.map(({index,date,harvest,sow,need,covered,days}) => {
    const canPlant = Boolean(plan.perPlot);
    const sowCell = sow !== null && canPlant ? `${plotName(sow)} · ${plan.perPlot} stek` : '—';
    const harvestCell = harvest !== null && canPlant ? `${plotName(harvest)} · target ${need}` : '—';
    const coverage = index < plan.firstHarvest && plan.input.season ? 'Masa tunggu' : `${covered} / ${days} hari`;
    return `<tr><th scope="row">${monthFormat.format(date)} <small>Bulan ${index+1}</small></th><td>${sowCell}</td><td>${harvestCell}</td><td>${coverage}</td></tr>`;
  }).join('');
}

export function planGrid(plan, plots, selected, interactive = true) {
  const {cols,rows,w,d} = plan.beds;
  if (!cols) return '<p>Perbesar ukuran lahan agar petak dan lorong bisa digambar.</p>';
  const tag = interactive ? 'button' : 'div';
  const content = plots.map(plot => {
    const {id,phase,count} = plot;
    const state = interactive ? ` type="button" data-cassava-plot="${id}" aria-pressed="${selected===id}"` : '';
    const title = plot.reserve ? 'Cadangan' : plotName(id);
    return `<${tag} class="cassava-plot" data-phase="${phase}"${state}><b>${title}</b><small>${interactive ? `${phaseLabel[phase]}${count ? ` · ${count}` : ''}` : `${fmt(w)} × ${fmt(d)} m`}</small></${tag}>`;
  }).join('');
  return `<div class="cassava-map" style="--cassava-cols:${cols};--cassava-rows:${rows}">${content}</div>`;
}
