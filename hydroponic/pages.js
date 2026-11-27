import {articles} from './articles.js';
import {aquaponic, aquaponicPlan, filterDetails} from './aquaponic-design.js';
import {aquaponicPipeBill} from './aquaponic-bom.js';
import {engineering, fields, pumps} from './engine.js';
import {assemblyNotes, billTable, dimensions, escapeHtml as html, flowDiagram, metres, number, planSvg, sideSvg} from './drawings.js';

const root = '/hydroponic/';
const domain = 'https://myfarmtwin.com';
const planner = `${root}planner/`;
export const designUrl = id => `${root}desain/${id}/`;
export const articleUrl = id => `${root}artikel/${id}/`;
export const posterUrl = d => `${root}assets/${d.id}-r${d.revision}.svg`;

function brand(url = '/id/') {
  return `<a class="brand" href="${url}"><span class="brand-mark" aria-hidden="true">✦</span>MyFarmTwin</a>`;
}

function page({title, description, path, body, image, model, editor = false, publishedId, script, bodyClass, sharing = false, assetVersion}) {
  const canonical = `${domain}${path}`;
  const entry = script ?? (editor ? 'planner' : 'analytics');
  const version = assetVersion ? `?v=${encodeURIComponent(assetVersion)}` : '';
  const mark = publishedId ? ` data-hydro-design="${html(publishedId)}"` : '';
  const pageClass = editor ? 'planner-page' : bodyClass;
  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${html(title)} | MyFarmTwin</title>
  <meta name="description" content="${html(description)}">
  <link rel="canonical" href="${canonical}">
  ${editor ? '<meta name="robots" content="noindex,follow">' : ''}
  <meta property="og:title" content="${html(title)} | MyFarmTwin">
  <meta property="og:description" content="${html(description)}">
  <meta property="og:type" content="${path.includes('/artikel/') ? 'article' : 'website'}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${domain}${image ?? posterUrl(model.design)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${root}style.css${version}">
${sharing ? `  <link rel="stylesheet" href="${root}share.css">\n  <script type="module" src="${root}share.js"></script>\n` : ''}  <script type="module" src="${root}${entry}.js${version}"></script>
</head>
<body${mark}${pageClass ? ` class="${pageClass}"` : ''}>
  <div id="site-app"><a class="skip" href="#main">Lewati ke isi</a>
  <header class="bar shell">${brand()}<nav aria-label="Navigasi"><a href="${root}">Hidroponik</a><a href="${root}#panduan">Panduan</a><a href="/play/">Play Farm</a></nav></header>
  ${body}
  <footer class="footer shell"><nav aria-label="Tautan MyFarmTwin"><a href="/id/">Beranda</a><a href="${root}#contoh">Contoh desain</a><a href="${root}#panduan">Artikel</a><a href="/play/">Play Farm</a></nav></footer></div>
  ${editor ? '<article id="print-sheet" class="print-sheet" tabindex="-1" aria-label="Pratinjau lembar cetak A4"></article>' : ''}
</body>
</html>
`;
}

function capacity(model, english = false) {
  const {siteWidth, siteDepth} = model.design;
  const size = english ? `${siteWidth / 1000} m × ${siteDepth / 1000} m` : `${metres(siteWidth)} × ${metres(siteDepth)}`;
  const label = model.kind === 'aquaponic' ? (english ? 'pots + tilapia pond' : 'pot + kolam nila') : (english ? 'planting sites' : 'lubang tanam');
  return `${model.holeCount} ${label} · ${size}`;
}

function designAction(d, label, source = 'design_page') {
  return `<a class="button primary" href="${planner}?contoh=${d.id}" data-hydro-event="hydro_design_customize" data-hydro-id="${d.id}" data-hydro-source="${source}">${label}</a>`;
}

function designTitle(d, english = false) {
  if (!english) return d.title;
  return d.titleEn ?? (d.id === 'nft-30-lubang' ? '30-Site NFT Hydroponic Rack' : d.title);
}

function shareButton(d, english = false) {
  const label = english ? 'Share' : 'Bagikan';
  const title = html(designTitle(d, english));
  return `<button type="button" class="design-share" aria-haspopup="dialog" aria-label="${label} ${title}" data-share-path="${designUrl(d.id)}" data-share-title="${title}">${label}</button>`;
}

function tile(model) {
  const d = model.design;
  const alt = model.kind === 'aquaponic' ? 'Tampak isometrik kolam nila dan rak sayuran' : 'Tampak isometrik rak dan tandon';
  return `<li class="tile"><a class="tile-main" href="${designUrl(d.id)}"><img src="${posterUrl(d)}" alt="${alt}" loading="lazy" decoding="async"><div class="tile-info"><h3>${html(d.title)}</h3><p class="small">${capacity(model)}</p></div></a>${shareButton(d)}</li>`;
}

export function galleryPage(models) {
  const first = models[0];
  const d = first.design;
  return page({title: 'Hydroponic Planner dan Contoh Desain', description: 'Lihat rancangan NFT 30 lubang dan akuaponik nila dengan ukuran nyata. Simulasikan aliran air dalam 3D dan cetak denah.', path: root, model: first, sharing: true,
    body: `<main id="main" class="shell">
    <section class="hero">
      <div class="hero-copy"><p class="eyebrow">Produksi pangan mandiri</p><h1>Hydroponic Planner</h1><p class="lead">Sesuaikan rak dengan ruang yang kamu punya, lihat sirkulasi larutan, lalu cetak denah dan daftar komponen.</p><div class="actions">${designAction(d, 'Buka contoh 30 lubang', 'gallery')}<a class="button" href="${planner}?baru=1">Buat desain baru</a></div></div>
      <figure class="hero-art"><img src="${posterUrl(d)}" alt="Rancangan rak lima kanal dengan tandon di samping" fetchpriority="high"></figure>
    </section>
    <section class="section" id="contoh" aria-labelledby="contoh-title"><div class="section-heading"><h2 id="contoh-title">Contoh hidroponik dan akuaponik</h2></div><ul class="tile-list">${models.map(tile).join('')}</ul></section>
    <section class="section" id="panduan" aria-labelledby="panduan-title"><div class="section-heading"><h2 id="panduan-title">Panduan produksi pangan mandiri</h2></div><div class="articles">${articles.map(item => `<a class="article-link" href="${articleUrl(item.id)}"><h3>${html(item.title)}</h3><p>${html(item.description)}</p></a>`).join('')}</div></section>
  </main>`});
}

export function aquaponicPage(assetVersion) {
  const {design: d, pond, beds, holeCount, litres, sources} = aquaponic;
  const area = `${metres(d.siteWidth)} × ${metres(d.siteDepth)}`;
  const capacity = `${number(Math.round(litres / 10) * 10)} L`;
  const picture = `<img src="${posterUrl(d)}" alt="Denah perspektif kolam nila, dua filter, dan rak dua talang" fetchpriority="high" width="877" height="446">`;
  return page({title: `${d.title} · Simulasi Sirkulasi 3D`, description: `Contoh rancangan akuaponik ${area} dengan kolam nila dan ${holeCount} pot sayuran. Lihat ikan berenang dan ikuti aliran air dalam simulasi 3D.`, path: designUrl(d.id), model: aquaponic, publishedId: d.id, bodyClass: 'aquaponic-page', script: 'aquaponic', sharing: true, assetVersion,
    body: `<main id="main" class="shell">
      <header class="aq-heading"><a href="${root}#contoh">Semua contoh</a><h1>${html(d.title)}</h1><p class="lead">Air dari kolam nila lewat filter padatan dan biofilter menuju pot. Dari talang, air turun kembali ke kolam oleh gravitasi.</p></header>
      <div class="aq-workspace">
        <section class="panel aq-visual" aria-labelledby="simulasi"><div class="visual-top"><h2 id="simulasi">Simulasi 3D</h2><div class="actions"><button id="aqua-start" class="button primary" type="button">Buka simulasi 3D</button><button id="aqua-print" class="button" type="button">Cetak denah</button>${shareButton(d)}</div></div>
          <div id="aqua-toolbar" class="aq-toolbar" hidden><div class="view-actions" aria-label="Isi instalasi"><button id="aqua-empty" class="segment" type="button" aria-pressed="false">Kosong</button><button id="aqua-filled" class="segment" type="button" aria-pressed="true">Terisi</button></div><div class="view-actions"><button id="aqua-flow" class="button primary" type="button" aria-pressed="true">Jeda aliran</button><button id="aqua-focus-pond" class="button" type="button">Fokus kolam</button><button id="aqua-focus-filter" class="button" type="button" aria-expanded="false" aria-controls="aqua-filter-tabs">Fokus filter</button><button id="aqua-fit" class="button" type="button">Pas ke layar</button><button id="aqua-quality" class="button" type="button">Detail tinggi</button></div></div>
          <div id="aqua-filter-tabs" class="filter-view-options" hidden><div class="view-actions" aria-label="Pilih drum untuk melihat potongan"><button type="button" class="segment" data-filter-focus="solids" aria-pressed="false">Drum 1 · Padatan</button><button type="button" class="segment" data-filter-focus="bio" aria-pressed="false">Drum 2 · Biofilter</button><a href="#detail-filter">Lihat elevasi pipa</a><a href="#daftar-bahan-filter">Daftar bahan</a></div><p class="small" id="aqua-filter-note" role="status"></p></div>
          <div id="aqua-stage" style="position:relative;overflow:hidden;height:320px;height:clamp(280px,44vw,490px)"><div id="aqua-cover">${picture}</div><div id="aqua-canvas" style="position:absolute;inset:0;overflow:hidden" hidden></div><p id="aqua-loading" class="model-status" role="status" hidden>Memuat detail tinggi…</p></div>
          <div class="aq-status"><p id="aqua-status" role="status">Pratinjau rancangan</p><p class="small">Seret atau gunakan tombol panah untuk memutar kamera.</p></div>
          <p id="aqua-renderer-note" class="small" role="status"></p>
          <p id="aqua-error" class="notice warning" role="alert" hidden>Perangkat belum bisa membuka kanvas interaktif. Denah dan diagram tetap tersedia di bawah.</p>
          <noscript><p class="notice">Aktifkan JavaScript untuk memutar model dan menjalankan simulasi.</p></noscript>
        </section>
        <aside class="panel aq-facts" aria-labelledby="aq-route-title"><h2 id="aq-route-title">Jalur sirkulasi</h2><ol class="aq-route"><li><strong>Kolam nila</strong><span>Pompa menaikkan air dari kolam.</span></li><li><strong>Filter padatan</strong><span>Menahan kotoran dan sisa pakan.</span></li><li><strong>Biofilter</strong><span>Media menjadi tempat bakteri pengolah limbah terlarut.</span></li><li><strong>${holeCount} pot sayuran</strong><span>Dua talang menyuplai larutan ke akar melalui pot jaring dan media inert.</span></li><li><strong>Kembali ke kolam</strong><span>Air mengalir turun melalui pipa balik.</span></li></ol><div class="legend"><span><i></i>Suplai</span><span><i class="back-key"></i>Aliran balik</span></div></aside>
      </div>
      <div class="public-data aqua-details">
        <section class="panel"><h2>Denah dari atas</h2>${aquaponicPlan()}</section>
        <section class="panel"><h2>Ukuran rancangan</h2><dl class="dimensions aq-dimensions"><div><dt>Area contoh</dt><dd>${area}</dd></div><div><dt>Diameter kolam</dt><dd>${number(pond.r * 2)} m</dd></div><div><dt>Muka air rancangan</dt><dd>${number(pond.water * 100)} cm</dd></div><div><dt>Volume air geometris</dt><dd>≈ ${capacity}</dd></div><div><dt>Ukuran setiap talang</dt><dd>${number(beds[0].width)} × ${number(beds[0].depth)} m</dd></div><div><dt>Pot per talang</dt><dd>${beds[0].pots.length}</dd></div></dl>
          <p class="small">Volume dihitung dari diameter dalam dan tinggi air pada kolam silinder. Ikan di simulasi adalah ilustrasi. Kapasitas tebar, ukuran biofilter, dan debit pompa perlu ditentukan dari beban pakan, tinggi angkat, dan pengujian air.</p></section>
        ${filterDetails()}
        ${aquaponicPipeBill()}
        <section class="panel wide"><h2>Komponen dan pemeriksaan awal</h2><ul class="notes-list"><li>Kolam berbentuk bulat, pompa dengan saringan masuk, pengendap radial dengan kuras pusat, dan biofilter media bergerak dengan penyaring outlet.</li><li>Dua talang dan 12 pot jaring, jalur suplai, serta pipa balik gravitasi. Sisakan ruang untuk membersihkan filter dan mengangkat tanaman.</li><li>Sediakan aerator kolam tersendiri. Sebelum memasukkan ikan, uji air bersih untuk memastikan talang mengalir dan kolam menampung air yang turun ketika pompa berhenti. Pastikan biofilter matang dan kualitas air sesuai untuk nila.</li></ul><p class="small">Rancangan konseptual untuk produksi pangan mandiri. <a href="${sources.radial}">Studi pengendap radial USDA ARS</a> · <a href="${sources.biofilter}">Panduan biofilter SRAC</a> · <a href="${sources.rutgers}">Panduan akuaponik Rutgers</a> · <a href="${sources.arizona}">Dasar akuaponik University of Arizona</a></p></section>
      </div>
    </main>`});
}

export function designPage(model) {
  const d = model.design;
  return page({title: `${d.title} · Denah dan BOM`, description: `${d.title}, ${d.channelCount} kanal dan area ${metres(d.siteWidth)} × ${metres(d.siteDepth)}. Lihat denah ukuran nyata, rincian pompa, dan BOM, lalu sesuaikan untuk dicetak.`, path: designUrl(d.id), model, publishedId: d.id, sharing: true,
    body: `<main id="main" class="shell">
    <section class="hero"><div class="hero-copy"><p class="eyebrow">${capacity(model)}</p><h1>${html(d.title)}</h1><p class="lead">${d.channelCount} kanal paralel dengan ${d.holesPerChannel} lubang per kanal, satu rak horizontal dan satu tandon. Buka salinannya untuk menyesuaikan letak komponen dan mencetak rancangan.</p><div class="actions">${designAction(d, 'Sesuaikan Desain')}<a class="button" href="#material">Lihat komponen</a>${shareButton(d)}</div><p class="small">Revisi ${d.revision} · Berdasarkan perhitungan</p></div><figure class="hero-art"><img src="${posterUrl(d)}" alt="Tampak isometrik instalasi ${model.holeCount} lubang, model dari ukuran rancangan" fetchpriority="high"></figure></section>
    <div class="public-data">
      <section class="panel"><h2>Denah berdimensi</h2>${planSvg(model)}${dimensions(model)}</section>
      <section class="panel"><h2>Tampak samping dan aliran</h2>${sideSvg(model)}${flowDiagram(model)}<p>Target model ${number(model.targetLpm)} L/menit total. Isi tandon saat pompa menyala ${d.workingLitres} L dan estimasi setelah pompa mati ${number(model.stoppedLitres)} L.</p><p class="small">Estimasi listrik pompa ${number(model.energyKwh30d)} kWh selama 30 hari pada 24 jam operasi per hari. Uji debit per kanal dan kapasitas tandon dengan air bersih sebelum menanam.</p></section>
      <section class="panel wide" id="material"><h2>Daftar komponen</h2><div class="table-wrap">${billTable(model)}</div></section>
      <section class="panel wide"><h2>Perakitan dan perawatan</h2>${assemblyNotes()}<p><a href="${articleUrl('ukur-area')}">Cara mengukur area</a> · <a href="${articleUrl('pilih-pompa')}">Cara membaca kurva pompa</a> · <a href="${engineering.nftSource}">Acuan NFT</a></p></section>
    </div>
  </main>`});
}

export function articlePage(article, first) {
  return page({title: article.title, description: article.description, path: articleUrl(article.id), model: first,
    body: `<main id="main" class="article-body"><p class="eyebrow">Panduan hidroponik</p><h1>${html(article.title)}</h1><p class="lead">${html(article.description)}</p>${article.content}
    <section><h2>Terapkan di contoh 30 lubang</h2><p><a href="${designUrl(first.design.id)}">Lihat denah dan BOM hidroponik NFT 30 lubang</a>, lalu sesuaikan di Planner.</p>${article.sources.map(([label, url]) => `<p class="small"><a href="${url}">${html(label)}</a></p>`).join('')}</section></main>`});
}

function input(key) {
  const field = fields[key];
  return `<label>${html(field.label)}${field.unit ? ` (${field.unit})` : ''}<input type="number" name="${key}" min="${field.min}" max="${field.max}" step="1" inputmode="numeric" required></label>`;
}

function select(key, label, values, wide = false) {
  return `<label${wide ? ' class="wide"' : ''}>${label}<select name="${key}">${values.map(([value, caption]) => `<option value="${value}">${html(caption)}</option>`).join('')}</select></label>`;
}

function rotation(key, label) {
  return select(key, label, [0, 90, 180, 270].map(value => [value, `${value}°`]));
}

export function plannerPage(models) {
  const first = models[0];
  const presets = JSON.stringify(Object.fromEntries(models.map(model => [model.design.id, model.design]))).replaceAll('<', '\\u003c');
  return page({title: 'Editor Hydroponic Planner', description: 'Atur instalasi NFT dengan ukuran nyata, lihat denah dan model 3D, jalankan simulasi aliran, dan cetak desain A4.', path: planner, model: first, editor: true,
    body: `<main id="main" class="shell">
      <div class="workspace-head"><div><a href="${root}#contoh">Semua contoh</a><h1 id="design-title">Hydroponic Planner</h1><p id="summary" aria-live="polite"></p></div><div class="actions"><a class="button" href="${planner}?baru=1">Desain baru</a><button class="button" id="preview-action" type="button" aria-pressed="false" aria-controls="print-sheet" disabled>Lihat lembar A4</button><button class="button primary" id="print-action" type="button" disabled>Cetak Desain</button></div></div>
      <noscript><p class="notice">Aktifkan JavaScript untuk menyesuaikan dan mencetak desain. <a href="${designUrl(first.design.id)}">Lihat denah contoh 30 lubang.</a></p></noscript>
      <div class="workspace">
        <section class="work-visual panel" aria-label="Pratinjau desain">
          <div class="visual-top"><div class="view-actions" aria-label="Mode tampilan"><button class="segment" type="button" id="view-2d" aria-pressed="true" aria-controls="plan">Denah 2D</button><button class="segment" type="button" id="view-3d" aria-pressed="false" aria-controls="model-view">Model 3D</button></div><div class="move-actions"><button class="button" type="button" data-move="rack" aria-pressed="false">Geser rak</button><button class="button" type="button" data-move="tank" aria-pressed="false">Geser tandon</button></div></div>
          <p id="placement-hint" class="notice" hidden></p><p id="stale-preview" class="notice warning" hidden>Denah menampilkan input terakhir yang lengkap.</p>
          <div class="visual-stage"><div id="plan"></div><div id="model-view" hidden><button class="button" type="button" id="fit-model">Pas ke layar</button><div id="model-canvas"></div><p class="model-status" id="view-loading" role="status" hidden>Memuat model 3D…</p><p class="model-status" id="view-error" hidden>Model 3D belum tersedia. Denah dan cetak tetap bisa dibuka. <button class="button" type="button" id="retry-3d">Coba lagi</button></p></div></div>
          <div class="legend" aria-label="Legenda"><span><i></i>Suplai</span><span><i class="back-key"></i>Aliran balik</span><span><i class="space-key"></i>Ruang servis</span><span><i class="hole-key"></i>Lubang tanam</span></div>
          <div class="status-row"><dl aria-live="polite"><dt id="pump-state">Pompa mati</dt><dd id="live-flow">0 L/menit</dd></dl><button class="button primary" type="button" id="pump-toggle" aria-pressed="false">Nyalakan pompa</button></div>
        </section>
        <section class="editor panel" aria-labelledby="params"><h2 id="params">Ukuran dan komponen</h2>
          <form id="design-form">
            <details open><summary>Area dan posisi</summary><div class="field-grid">${['siteWidth', 'siteDepth', 'rackX', 'rackZ', 'tankX', 'tankZ'].map(input).join('')}${rotation('rackRotation', 'Putar rak')}${rotation('tankRotation', 'Putar tandon')}</div></details>
            <details open><summary>Kanal dan pompa</summary><div class="field-grid">${['channelCount', 'holesPerChannel', 'channelLength', 'holeSpacing', 'rowSpacing', 'inletHeight', 'slope', 'workingLitres'].map(input).join('')}${select('pump', 'Model pompa', Object.entries(pumps).map(([id, pump]) => [id, `${pump.label} · ${pump.watts} W`]), true)}</div></details>
          </form><p class="notice" id="design-status" role="status"></p><ul class="notice warning" id="design-issues" aria-live="polite" hidden></ul><div><button class="button" type="button" id="reset-design">Kembalikan ukuran awal</button></div>
        </section>
      </div>
      <div class="detail-panels"><section class="panel"><h2>Perhitungan aliran</h2><dl id="hydro-metrics" class="metrics"></dl><p class="small">Model memakai kurva pompa, beda tinggi, dan estimasi rugi aliran. Setel katup tiap kanal dan bypass di instalasi nyata, lalu ukur debit yang keluar. <a href="${articleUrl('pilih-pompa')}">Cara membaca kurva pompa</a></p></section>
      <section class="panel"><h2>Dimensi rancangan</h2><div id="layout-dimensions"></div></section><section class="panel"><h2>Daftar komponen</h2><div class="table-wrap" id="materials"></div></section></div>
      <script type="application/json" id="design-presets">${presets}</script>
    </main>`});
}

export function homepageFragment(models, english) {
  const d = models[0].design;
  const t = english ? {
    label: 'Home food production', body: 'Plan a real-size hydroponic rack, simulate water flow, and print the design and materials list.', art: 'Model of a hydroponic rack and reservoir', cta: 'Explore Hydroponics', examples: 'Design examples', all: 'All designs', guides: 'Growing guides', measure: 'Measuring your space (ID)', pump: 'Choosing a pump (ID)'
  } : {
    label: 'Produksi pangan mandiri', body: 'Atur rak hidroponik dalam ukuran nyata, simulasikan aliran air, lalu cetak desain dan daftar komponennya.', art: 'Model rak hidroponik dengan tandon di samping', cta: 'Buka Hidroponik', examples: 'Contoh desain', all: 'Semua desain', guides: 'Panduan hidroponik', measure: 'Mengukur area tanam', pump: 'Memilih pompa'
  };
  return `    <section class="home-food" aria-labelledby="home-food-title">
      <div class="home-food-feature"><div class="home-food-copy"><p class="home-food-eyebrow">${t.label}</p><h2 id="home-food-title">Hydroponic Planner</h2><p>${t.body}</p><a class="home-food-cta" href="${root}"${english ? ' hreflang="id"' : ''}>${t.cta}</a></div><div class="home-food-art"><img src="${posterUrl(d)}" width="620" height="410" alt="${t.art}" decoding="async"></div></div>
      <div><div class="home-food-heading"><h3>${t.examples}</h3><a href="${root}#contoh">${t.all}</a></div><ul class="home-food-rail" aria-label="${t.examples}">${models.map(model => `<li><a class="home-food-tile" href="${designUrl(model.design.id)}?from=home"${english ? ' hreflang="id"' : ''}><img src="${posterUrl(model.design)}" width="104" height="82" alt="" loading="lazy"><span><b>${html(designTitle(model.design, english))}</b><small>${capacity(model, english)}</small></span></a>${shareButton(model.design, english)}</li>`).join('')}</ul></div>
      <p class="home-food-guide"><strong>${t.guides}</strong><a href="${articleUrl('ukur-area')}"${english ? ' hreflang="id"' : ''}>${t.measure}</a><a href="${articleUrl('pilih-pompa')}"${english ? ' hreflang="id"' : ''}>${t.pump}</a></p>
    </section>`;
}
