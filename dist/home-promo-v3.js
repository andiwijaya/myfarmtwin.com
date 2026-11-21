/* Homepage language preference only. Game saves are never read or changed here. */
(() => {
  'use strict';
  const messages={
    en:{
      capture:'Actual gameplay · Developed farm',skip:'Skip to game',language:'Language',guide:'Play guide (ID)',play:'Build your tropical farm',
      description:'Grow vegetables and care for animals in a 3D farm surrounded by rice fields. Sell your produce at the market to build and upgrade your Indonesian farmhouse.',
      houseTitle:'10 farmhouse models',houseCopy:'Upgrade from a timber cottage to a tropical estate. Each house comes with a satellite dish.',
      marketTitle:'Meal delivery to the market',marketCopy:'Order a meal from home. Watch the scooter courier take turns with the produce truck on the village road.',
      dailyTitle:'A farm that changes with the time',dailyCopy:'Workers tend the fields, barns, and fish pond by day. Street lamps come on at night.',
      future:'English and Indonesian · Requires WebGL 2',note:'Free · No account',enter:'Play in 3D',
      previewAlt:'A developed MyFarmTwin farm with a farmhouse, livestock, a fish pond and a produce truck amid tropical rice fields.',
      metaTitle:'MyFarmTwin — Play Your 3D Farm',
      metaDescription:'Build your own 3D tropical farm. Grow crops, care for animals, upgrade your Indonesian farmhouse, and order meals delivered by scooter. Play free in your browser.',
      ogDescription:'Grow crops, raise animals, and build an Indonesian farmhouse in MyFarmTwin. Play free in your browser.'
    },
    id:{
      capture:'Tangkapan layar dari game · Contoh farm berkembang',skip:'Langsung ke game',language:'Bahasa',guide:'Panduan',play:'Bangun farm tropismu',
      description:'Tanam sayur dan rawat ternak di farm 3D yang dikelilingi sawah. Jual hasilnya di market untuk membangun dan meng-upgrade rumah bergaya Indonesia.',
      houseTitle:'10 model rumah',houseCopy:'Mulai dari rumah papan hingga rumah besar tropis. Setiap rumah punya antena satelit.',
      marketTitle:'Pesan makanan dari rumah',marketCopy:'Kurir motor mengantar makanan ke market dan bergantian lewat dengan truk hasil panen.',
      dailyTitle:'Farm hidup siang dan malam',dailyCopy:'Pekerja merawat kebun, kandang, dan kolam pada siang hari. Lampu jalan menyala saat malam.',
      future:'Bahasa Indonesia dan Inggris · Memerlukan WebGL 2',note:'Gratis · Tanpa akun',enter:'Main farm 3D',
      previewAlt:'Farm MyFarmTwin dengan rumah bergaya Indonesia, kandang, kolam ikan, dan truk hasil panen di tengah persawahan tropis.',
      metaTitle:'MyFarmTwin — Mainkan Farm 3D',
      metaDescription:'Bangun farm tropis 3D. Tanam sayur, rawat ternak, upgrade rumah bergaya Indonesia, dan pesan makanan lewat kurir motor. Main gratis di browser.',
      ogDescription:'Tanam sayur, rawat ternak, dan bangun rumah bergaya Indonesia di MyFarmTwin. Main gratis di browser.'
    }
  };
  const select=document.querySelector('#home-language');
  let locale=navigator.language.toLowerCase().startsWith('id')?'id':'en';
  try{const saved=localStorage.getItem('myfarmtwin.locale');if(saved==='en'||saved==='id')locale=saved;}catch{/* Preference storage is optional. */}
  function translate(){const m=messages[locale];document.documentElement.lang=locale;select.value=locale;document.querySelectorAll('[data-home]').forEach(el=>{el.textContent=m[el.getAttribute('data-home')];});document.querySelectorAll('[data-home-alt]').forEach(el=>el.setAttribute('alt',m[el.getAttribute('data-home-alt')]));document.title=m.metaTitle;document.querySelector('meta[name="description"]').setAttribute('content',m.metaDescription);document.querySelector('meta[property="og:title"]').setAttribute('content',m.metaTitle);document.querySelector('meta[property="og:description"]').setAttribute('content',m.ogDescription);}
  select.addEventListener('change',()=>{locale=select.value==='id'?'id':'en';try{localStorage.setItem('myfarmtwin.locale',locale);}catch{/* Browsing works without storage. */}translate();});
  translate();
})();
