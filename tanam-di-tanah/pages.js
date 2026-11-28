import {page} from '../hydroponic/pages.js';
import {escapeHtml as html} from '../hydroponic/drawings.js';
import {scenario, limits, makePlan, makeRun, describePlots, coverPath, plotPath, guidePath, monthDate, shortMonth} from './singkong-model.js';
import {calendarRows, capacityNote, metrics, planGrid} from './singkong-markup.js';

const domain = 'https://myfarmtwin.com';
const header = `<a href="${plotPath}">Denah singkong</a><a href="${guidePath}">Panduan</a><a href="/play/">Play Farm</a>`;
const footer = `<a href="${plotPath}">Denah singkong</a><a href="${guidePath}">Artikel singkong</a><a href="/hydroponic/">Hidroponik</a>`;
const common = {image:coverPath,cssPath:'/tanam-di-tanah/singkong.css',sharing:true,navigation:header,footerNavigation:footer};
const cover = `<img src="${coverPath}" width="1200" height="800" alt="Ilustrasi umbi singkong yang baru dipanen di kebun" decoding="async">`;
const title = 'Denah Singkong · Panen 2 Batang per Hari';
const guideTitle = 'Berapa Luas Tanah untuk Panen 2 Batang Singkong per Hari?';
const description = 'Hitung kebutuhan lahan, setek, dan kalender panen singkong untuk konsumsi harian. Coba menanam dan mencabut singkong dalam simulasi 3D, lalu bagikan atau cetak denah.';
const guideDescription = 'Hitung luas lahan untuk mencabut dua tanaman singkong per hari. Bandingkan skenario 70 dan 80 stek per bulan serta pelajari contoh jadwal tanam bergilir.';
const sources = {
  grow:'https://www.fao.org/4/i3278e/i3278e.pdf',
  local:'https://repository.pertanian.go.id/items/f5f406fa-1f96-4310-be66-36e971b8a5b1',
  food:'https://pmpupo.pom.go.id/assets/perpustakaan_online/dokumen/ebook_101_T_29-11-2021_546.pdf'
};

export function cassavaShare(path, name, label, english = false) {
  return `<button class="design-share" type="button" aria-haspopup="dialog" aria-label="${html(label)}" data-share-path="${path}" data-share-title="${html(name)}" data-food-share="${path === guidePath ? 'article' : 'design'}"${english ? ' lang="en"' : ''}>${html(label)}</button>`;
}

export function cassavaHome(english) {
  const name = english ? 'Cassava · Harvest 2 Plants a Day' : 'Singkong · Panen 2 Batang per Hari';
  const label = english ? 'Grown in soil · Plot size and harvest calendar' : 'Tanam di Tanah · Luas lahan dan jadwal panen';
  const article = english ? 'Cassava harvest guide (ID)' : 'Panduan panen singkong';
  return {
    tile:`<li><a class="home-food-tile" href="${plotPath}?from=home" hreflang="id"><img src="${coverPath}" width="104" height="82" alt="" loading="lazy" decoding="async"><span><b>${name}</b><small>${label}</small></span></a>${cassavaShare(plotPath,name,english ? 'Share cassava design' : 'Bagikan denah singkong',english)}</li>`,
    guide:`<a href="${guidePath}?from=home" hreflang="id">${article}</a>`
  };
}

function input(name,label) {
  const [min,max,step] = limits[name];
  return `<label>${label}<input name="${name}" type="number" required min="${min}" max="${max}" step="${step}" value="${scenario[name]}" inputmode="${step === 1 ? 'numeric':'decimal'}"></label>`;
}

function calendar(plan, id) {
  return `<div class="table-wrap"><table class="bill-table cassava-table"><thead><tr><th scope="col">Bulan</th><th scope="col">Tanam</th><th scope="col">Panen</th><th scope="col">Hari terpenuhi</th></tr></thead><tbody id="${id}">${calendarRows(plan)}</tbody></table></div>`;
}

export function cassavaDesignPage(assetVersion) {
  const plan = makePlan();
  const plots = describePlots(plan,makeRun(plan,true));
  const map = planGrid(plan,plots,0);
  return page({...common,assetVersion,entryPath:'/tanam-di-tanah/singkong.js',bodyClass:'cassava-page',
    title,description,path:plotPath,body:`
    <main id="main" class="shell cassava-main">
      <header class="cassava-hero">
        <div><a class="small" href="/id/#home-food-title">Produksi pangan mandiri</a>
          <p class="eyebrow">Tanam di tanah</p><h1>Singkong · Panen 2 Batang per Hari</h1>
          <p class="lead">Hitung ukuran kebun dan jadwal tanam bergilir untuk memasok umbi singkong setiap hari.</p>
          <div class="actions cassava-actions"><a class="button primary" href="#ukuran-lahan">Sesuaikan lahan</a><button class="button" id="cassava-print" type="button">Cetak denah</button>${cassavaShare(plotPath,title,'Bagikan denah')}</div>
        </div><figure>${cover}<figcaption>Ilustrasi panen singkong</figcaption></figure>
      </header>
      <dl class="cassava-metrics" id="cassava-metrics">${metrics(plan)}</dl>
      <div class="cassava-workspace">
        <section class="panel cassava-simulation" aria-labelledby="simulasi">
          <div class="visual-top"><h2 id="simulasi">Denah dan simulasi</h2><div class="view-actions"><button class="segment" id="cassava-view-map" type="button" aria-pressed="true" aria-controls="cassava-map-wrap">Denah 2D</button><button class="segment" id="cassava-view-3d" type="button" aria-pressed="false" aria-controls="cassava-stage">Simulasi 3D</button></div></div>
          <div class="view-actions" aria-label="Skenario awal"><button class="button" id="cassava-from-empty" type="button" aria-pressed="false">Mulai dari tanah kosong</button><button class="button" id="cassava-from-ready" type="button" aria-pressed="true">Lihat kebun siap panen</button></div>
          <div id="cassava-map-wrap"><div id="cassava-map">${map}</div><p class="small">Lorong 60 cm. Pilih petak untuk melihat status dan jumlah tanamannya.</p></div>
          <div id="cassava-stage" hidden><div id="cassava-canvas"></div><p id="cassava-3d-status" class="model-status" role="status" hidden></p><div class="view-actions"><button class="button" type="button" id="cassava-fit">Lihat seluruh lahan</button><button class="button" type="button" id="cassava-focus-plot">Fokus petak</button></div><p class="small">Seret untuk memutar kamera. Pilih petak di denah untuk fokus, lalu gunakan tombol Cabut saat siap panen.</p></div>
          <p id="cassava-plot-summary" class="small">Petak 1 siap panen.</p>
          <div class="cassava-run-status" id="cassava-run-status" role="status"></div>
          <div class="view-actions"><button class="button" id="cassava-plant" type="button">Tanam stek</button><button class="button primary" id="cassava-pull" type="button">Cabut 2 tanaman</button><button class="button" id="cassava-day" type="button">Jalankan 1 hari</button><button class="button" id="cassava-month" type="button">Jalankan 1 bulan</button></div>
          <p class="small">Mode cepat mengikuti jadwal tanam dan panen otomatis. Tombol cabut memanen jatah hari ini.</p>
        </section>
        <section class="panel cassava-settings" aria-labelledby="ukuran-lahan">
          <h2 id="ukuran-lahan">Ukuran lahan dan target</h2>
          <form id="cassava-form">
            <div class="field-grid">
              ${input('width','Sisi lahan (m)')}${input('depth','Sisi lainnya (m)')}
              <label>Satuan target<select name="unit"><option value="tanaman">Tanaman per hari</option><option value="kg">Kg umbi segar per hari</option></select></label>
              ${input('target','Target per hari')}${input('kg','Umbi segar per tanaman (kg)')}${input('spacing','Jarak tanam (m)')}
              ${input('months','Umur panen (bulan)')}${input('loss','Perkiraan kehilangan (%)')}
              <label>Bulan mulai<input type="month" name="start" min="2000-01" max="2099-12" required value="${scenario.start}"></label>
            </div>
            <details><summary>Bulan yang bisa ditanami</summary><p class="small">Pilih bulan dengan air yang cukup untuk menanam.</p>
              <div class="cassava-month-options">${Array.from({length:12},(_,i)=>`<label><input type="checkbox" name="plantingMonth" value="${i}" checked> ${shortMonth.format(monthDate('2027-01',i))}</label>`).join('')}</div></details>
            <div class="actions"><button class="button primary" type="submit">Terapkan ukuran</button><button class="button" id="cassava-default" type="button">Contoh awal</button></div>
          </form>
          <p class="notice" id="cassava-capacity" role="status">${capacityNote(plan)}</p>
        </section>
      </div>
      <section class="panel cassava-schedule" aria-labelledby="kalender">
        <div class="visual-top"><h2 id="kalender">Kalender tanam dan panen</h2><a href="${guidePath}?from=design">Baca cara menghitung</a></div>
        <p>Jadwal mencakup masa tunggu dan 12 bulan sejak awal panen. Model mengasumsikan tanam bulanan, ketersediaan air yang cukup, dan jendela panen sekitar satu bulan per kelompok. Hasil dalam kg adalah umbi segar sebelum dikupas.</p>
        ${calendar(plan,'cassava-calendar')}
      </section>
      <article class="cassava-print" aria-label="Denah singkong untuk dicetak">
        <h1>Denah kebun singkong</h1><p>MyFarmTwin · Produksi pangan mandiri</p>
        <dl id="cassava-print-metrics" class="cassava-metrics">${metrics(plan)}</dl>
        <p id="cassava-print-capacity">${capacityNote(plan)}</p>
        <div id="cassava-print-map">${planGrid(plan,plots,0,false)}</div>
        <p id="cassava-print-inputs"></p>
        <h2>Kalender tanam dan panen</h2>${calendar(plan,'cassava-print-calendar')}
      </article>
    </main>`});
}

export function cassavaGuidePage(assetVersion) {
  return page({...common,assetVersion,entryPath:'/tanam-di-tanah/singkong-article.js',bodyClass:'cassava-guide',
    title:guideTitle,description:guideDescription,path:guidePath,
    structuredData:{'@context':'https://schema.org','@type':'Article',headline:guideTitle,
      description:guideDescription,mainEntityOfPage:domain+guidePath,image:[domain+coverPath],
      author:{'@type':'Organization',name:'MyFarmTwin',url:domain},inLanguage:'id'},
    body:`<article id="main" class="article-body cassava-article">
      <header><a href="/id/#home-food-title">Produksi pangan mandiri</a>
        <h1>${guideTitle}</h1>
        <p class="lead">Siapkan sekitar 1.004 m² untuk pola 70 stek per bulan, atau 1.134 m² untuk 80 stek per bulan dengan cadangan lebih besar. Kedua contoh memakai jarak tanam 1 × 1 m dan jadwal panen bergilir.</p>
        <div class="actions"><a class="button primary" href="${plotPath}?from=article">Buka denah singkong</a>${cassavaShare(guidePath,guideTitle,'Bagikan artikel')}</div>
      </header>
      <figure>${cover}<figcaption>Ilustrasi umbi yang baru dicabut.</figcaption></figure>
      <section><h2>Dua tanaman per hari berarti 730 tanaman per tahun</h2>
        <p>Satu batang berarti satu tanaman utuh yang dicabut. Dalam satu bulan dengan 31 hari, kebun perlu memasok 62 tanaman. Bila satu petak berisi 70 stek dan tujuh gagal, tersisa 63 tanaman. Dengan 80 stek dan 16 gagal, tersisa 64.</p>
        <p>Kalau kebutuhan keluarga dicatat dalam kilogram, timbang beberapa panen dan bagi bobot segar dengan jumlah tanaman yang dicabut. Contoh setelan 1,5 kg per tanaman memberi sekitar 3 kg umbi segar dari dua tanaman. Hasil aktual dipengaruhi varietas, umur, air, dan lahan.</p>
      </section>
      <section><h2>Dari jumlah stek ke luas lahan</h2>
        <p>Dengan jarak 1 × 1 m, petak 7 × 10 m memuat 70 posisi. Petak 8 × 10 m memuat 80 posisi. Pada contoh umur panen 10 bulan, 11 petak masuk giliran. Petak tambahan memungkinkan satu kelompok ditanam saat kelompok pertama dipanen. Sisakan satu petak cadangan.</p>
        <p>Susunan 4 × 3 petak dengan lorong 60 cm memberi ukuran 31 × 32,4 m untuk pola 70 stek, atau 35 × 32,4 m untuk pola 80 stek.</p>
      </section>
      <section><h2>Tanam satu petak setiap bulan</h2>
        <ol class="notes-list"><li>Bulan 1–10, tanam satu petak baru setiap bulan.</li><li>Bulan 11, mulai panen harian dari Petak 1 dan tanam Petak 11.</li><li>Bulan 12, panen Petak 2 dan tanami kembali Petak 1 setelah petak itu dikosongkan.</li></ol>
        <p>Sesuaikan bulan mulai dan jendela panen dengan varietas dan ketersediaan air. Jika lahan mengandalkan hujan, jadwal tanam sebenarnya mengikuti musim. Untuk konsumsi, pilih varietas singkong pangan dan ikuti cara pengolahan yang dianjurkan BPOM.</p>
        <p class="small"><a href="${sources.local}">Pedoman budi daya Kementan</a> · <a href="${sources.grow}">Panduan singkong FAO</a> · <a href="${sources.food}">Panduan keamanan pangan BPOM</a></p>
      </section>
      <div class="actions"><a class="button primary" href="${plotPath}?from=article#ukuran-lahan">Hitung untuk lahanmu</a></div>
    </article>`});
}
