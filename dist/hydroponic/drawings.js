import {engineering} from './engine.js';

const round = number => Math.round(number * 10) / 10;
const units = new Intl.NumberFormat('id-ID', {maximumFractionDigits: 2});
export const number = value => units.format(value);
export const metres = value => `${number(value / 1000)} m`;
const points = path => path.map(p => `${round(p.x)},${round(p.z)}`).join(' ');
const polygon = (path, kind) => `<polygon points="${points(path)}" class="${kind}"/>`;
const line = (path, kind) => `<polyline points="${points(path)}" class="${kind}" vector-effect="non-scaling-stroke"/>`;

export function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

export function planSvg(model, {showWater = false} = {}) {
  const d = model.design;
  const font = Math.min(108, Math.max(40, Math.max(d.siteWidth, d.siteDepth) * 0.021));
  const padding = font * 3;
  const centre = shape => ({x: (shape[0].x + shape[2].x) / 2, z: (shape[0].z + shape[2].z) / 2});
  const tank = centre(model.tank);
  const circle = hole => `<circle data-hole="${hole.id}" cx="${round(hole.x)}" cy="${round(hole.z)}" r="${engineering.holeDiameter / 2}" class="plant-hole"><title>Lubang ${hole.id}, ${number(hole.fromInlet)} mm dari ujung masuk</title></circle>`;
  const channels = model.channels.map(channel => `${polygon(channel.corners, 'plan-channel')}${channel.holes.map(circle).join('')}`).join('');
  const label = (x, z, text) => `<text x="${x}" y="${z}" text-anchor="middle" dominant-baseline="middle">${text}</text>`;
  const flowPaths = [...[model.routeFeed, model.feedHeader, ...model.channels.map(ch => [ch.feedTap, ch.inlet])].map(path => line(path, 'pipe pipe-feed')),
    ...[model.returnHeader, model.routeReturn, ...model.channels.map(ch => [ch.outlet, ch.returnTap])].map(path => line(path, 'pipe pipe-return'))].join('');
  const flowArrows = showWater && model.flowLpm > 0 ? [...model.channels.map(ch => line([ch.inlet, ch.outlet], 'moving-flow')), line(model.routeFeed.slice(1), 'moving-flow'), line(model.routeReturn, 'moving-flow')].join('') : '';
  return `<svg class="drawing plan-drawing" xmlns="http://www.w3.org/2000/svg" viewBox="${-padding} ${-padding} ${d.siteWidth + padding * 2} ${d.siteDepth + padding * 2}" role="img" aria-label="Denah berdimensi dengan ${model.holeCount} lubang tanam" style="font-size:${font}px">
    <rect class="site-outline" width="${d.siteWidth}" height="${d.siteDepth}"/>
    ${polygon(model.rackService, 'service-zone')}${polygon(model.tankService, 'service-zone')}${polygon(model.rack, 'rack-outline')}
    ${channels}${polygon(model.tank, 'plan-tank')}${flowPaths}${flowArrows}
    <circle cx="${model.pumpPoint.x}" cy="${model.pumpPoint.z}" r="${font * 0.32}" class="plan-pump"/>
    ${label(tank.x, tank.z, 'Tandon')}
    ${line([{x: 0, z: -padding * 0.45}, {x: d.siteWidth, z: -padding * 0.45}], 'dimension-line')}
    ${line([{x: -padding * 0.45, z: 0}, {x: -padding * 0.45, z: d.siteDepth}], 'dimension-line')}
    ${label(d.siteWidth / 2, -padding * 0.68, `${number(d.siteWidth)} mm`)}
    <text x="${-padding * 0.68}" y="${d.siteDepth / 2}" transform="rotate(-90 ${-padding * 0.68} ${d.siteDepth / 2})" text-anchor="middle">${number(d.siteDepth)} mm</text>
    <text x="0" y="${d.siteDepth + padding * 0.48}">0,0 · acuan koordinat di kiri atas</text>
  </svg>`;
}

export function sideSvg(model) {
  const d = model.design;
  const font = Math.max(37, d.channelLength * 0.024);
  const padding = font * 3.2;
  const top = d.inletHeight + engineering.channelHeight;
  const bottom = model.outletHeight;
  const label = (x, y, text, anchor = 'middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}">${text}</text>`;
  return `<svg class="drawing side-drawing" xmlns="http://www.w3.org/2000/svg" viewBox="${-padding} ${-top - padding * 0.8} ${d.channelLength + padding * 2} ${top + padding * 1.5}" role="img" aria-label="Tampak samping rak dan penurunan dasar kanal" style="font-size:${font}px">
    <path d="M0 ${-top} L${d.channelLength} ${-bottom - engineering.channelHeight} L${d.channelLength} ${-bottom} L0 ${-d.inletHeight} Z" class="plan-channel"/>
    <path d="M0 ${-d.inletHeight} V0 M${d.channelLength} ${-bottom} V0 M0 ${-bottom * 0.65} H${d.channelLength}" class="side-frame" vector-effect="non-scaling-stroke"/>
    <path d="M${-padding * .5} 0 H${d.channelLength + padding * .5}" class="dimension-line" vector-effect="non-scaling-stroke"/>
    ${label(d.channelLength / 2, -top - padding * 0.4, `${number(d.channelLength)} mm · turun ${number(model.drop)} mm`)}
    ${label(-font * .35, -d.inletHeight / 2, `${number(d.inletHeight)}`, 'end')}
    ${label(d.channelLength + font * .35, -bottom / 2, `${number(bottom)}`, 'start')}
    ${label(d.channelLength / 2, padding * .42, 'Elevasi dasar kanal dari lantai (mm)')}
  </svg>`;
}

export function posterSvg(model) {
  const d = model.design;
  const p = (x, y, z) => [x * .86 - z * .68, x * .29 + z * .36 - y];
  const xy = point => p(point.x, point.y, point.z).map(round).join(',');
  const poly = (path, fill, stroke = 'none', width = 1) => `<polygon points="${path.map(xy).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
  const path = (line, stroke, width) => `<polyline points="${line.map(xy).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const elevated = (point, y) => ({...point, y});
  const tank = model.tank;
  const lid = tank.map(point => elevated(point, engineering.tankHeight));
  const rack = model.rack;
  const legs = rack.map(point => path([point, elevated(point, d.inletHeight - model.drop / 2)], '#53706b', 28)).join('');
  const channels = [...model.channels].reverse().map(channel => {
    const top = channel.corners.map((point, index) => elevated(point, (index === 0 || index === 3 ? channel.inlet.y : channel.outlet.y) + engineering.channelHeight));
    const side = [top[2], top[3], elevated(top[3], channel.inlet.y), elevated(top[2], channel.outlet.y)];
    const holes = channel.holes.map(hole => {
      const [cx, cy] = p(hole.x, hole.y, hole.z);
      return `<ellipse cx="${round(cx)}" cy="${round(cy)}" rx="${engineering.holeDiameter * .53}" ry="${engineering.holeDiameter * .25}" fill="#376456" stroke="#8cafa2" stroke-width="4"/>`;
    }).join('');
    return poly(side, '#a4c4b5', '#6c9586', 4) + poly(top, '#e5eee1', '#6c9586', 4) + holes;
  }).join('');
  const site = [{x:0, y:0, z:0}, {x:d.siteWidth, y:0, z:0}, {x:d.siteWidth, y:0, z:d.siteDepth}, {x:0, y:0, z:d.siteDepth}];
  const projected = [...site, ...model.channels.flatMap(ch => [elevated(ch.inlet, ch.inlet.y + 100), elevated(ch.outlet, ch.outlet.y + 100)]), ...lid].map(q => p(q.x, q.y, q.z));
  const minX = Math.min(...projected.map(q => q[0]));
  const minY = Math.min(...projected.map(q => q[1]));
  const width = Math.max(...projected.map(q => q[0])) - minX;
  const height = Math.max(...projected.map(q => q[1])) - minY;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${round(minX - 170)} ${round(minY - 200)} ${round(width + 340)} ${round(height + 400)}" role="img" aria-label="Tampak isometrik rancangan hidroponik ${model.holeCount} lubang">
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#e6efe4"/><stop offset="1" stop-color="#d6e9e0"/></linearGradient></defs>
  <rect x="${round(minX - 170)}" y="${round(minY - 200)}" width="${round(width + 340)}" height="${round(height + 400)}" fill="url(#bg)"/>
  ${poly(site, '#dce8d9', '#9fbaae', 9)}${poly(rack, '#b8cec2')}${legs}${path([elevated(rack[1], d.inletHeight * .52), elevated(rack[2], d.inletHeight * .52), elevated(rack[3], d.inletHeight * .52)], '#57796e', 20)}
  ${channels}${path(model.feedHeader, '#168a82', 20)}${path(model.returnHeader, '#517da5', 21)}
  ${path(model.routeReturn, '#517da5', 17)}${path(model.routeFeed.slice(1), '#168a82', 16)}
  ${poly([lid[1], lid[2], tank[2], tank[1]], '#1a5049')}${poly([lid[2], lid[3], tank[3], tank[2]], '#27665c')}${poly(lid, '#3b796c', '#235c53', 7)}
  </svg>`;
}

export function billTable(model) {
  return `<table class="bill-table"><thead><tr><th scope="col">Komponen</th><th scope="col">Jumlah</th><th scope="col">Spesifikasi / ukuran</th></tr></thead><tbody>${model.bill.map(item => `<tr><th scope="row">${escapeHtml(item.name)}</th><td>${item.qty} ${escapeHtml(item.unit)}</td><td>${escapeHtml(item.spec)}</td></tr>`).join('')}</tbody></table>`;
}

export function flowDiagram(model) {
  return `<ol class="flow-diagram" aria-label="Urutan sirkulasi larutan"><li>Tandon</li><li>Pompa + saringan</li><li>Header + katup per kanal</li><li>${model.channels.length} kanal NFT</li><li>Jalur balik gravitasi</li><li>Tandon</li></ol><p class="small">Tee bypass mengembalikan kelebihan debit pompa ke tandon. Aliran balik ditandai garis biru, atau garis putus-putus di cetakan.</p>`;
}

export function assemblyNotes() {
  return `<ol class="notes-list">
    <li>Ratakan lokasi dan rak. Atur tinggi dasar talang di sisi masuk dan keluar sesuai gambar. Sisakan ruang untuk mengangkat tutup tandon dan membersihkan ujung kanal.</li>
    <li>Tandai posisi lubang dari ujung masuk dengan penggaris. Uji kecocokan net pot pada potongan sisa sebelum mengebor seluruh kanal. Rapikan serpihan, bilas, lalu pasang penutup dan fitting yang kompatibel.</li>
    <li>Pasang tandon bertutup, pompa sesuai petunjuk pabrik, suplai, katup tiap kanal dan bypass. Sangga pipa balik agar terus menurun dan beri jalur udara sesuai fittingnya. Pilih komponen kontak air yang dinyatakan sesuai untuk budidaya pangan.</li>
    <li>Uji dengan air bersih. Ukur debit pada tiap outlet dengan wadah ukur dan pengatur waktu, setel katup, periksa kebocoran, lalu matikan pompa untuk mengamati kenaikan muka air di tandon. Uji aliran saat beroperasi sebelum memasukkan bibit.</li>
    <li>Periksa muka air, aliran, saringan, dan kondisi tanaman rutin. Bersihkan tandon dan kanal di antara siklus. Pilih kondisi cahaya, EC, dan pH sesuai tanaman serta petunjuk produk nutrisi.</li>
  </ol>`;
}

export function dimensions(model) {
  const d = model.design;
  const drill = model.channels[0].holes.map(hole => number(hole.fromInlet)).join(' · ');
  return `<dl class="dimensions"><div><dt>Area</dt><dd>${number(d.siteWidth)} × ${number(d.siteDepth)} mm</dd></div><div><dt>Selubung rak</dt><dd>${number(model.rackWidth)} × ${number(model.rackDepth)} mm</dd></div><div><dt>Posisi pusat rak (X, Y)</dt><dd>${number(d.rackX)}, ${number(d.rackZ)} mm · ${d.rackRotation}°</dd></div><div><dt>Posisi pusat tandon (X, Y)</dt><dd>${number(d.tankX)}, ${number(d.tankZ)} mm · ${d.tankRotation}°</dd></div><div><dt>Jarak antarkanal</dt><dd>${number(d.rowSpacing)} mm</dd></div><div><dt>Tinggi masuk → keluar</dt><dd>${number(d.inletHeight)} → ${number(model.outletHeight)} mm</dd></div></dl>
    <p class="drill-line"><strong>Lubang Ø${engineering.holeDiameter} mm.</strong> Ukur pada garis tengah tiap kanal dari ujung masuk (mm) ${drill}.</p>`;
}
