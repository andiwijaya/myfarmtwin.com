/* Homepage language preference only. Game saves are never read or changed here. */
(() => {
  'use strict';
  const messages={
    en:{skip:'Skip to game',language:'Language',play:'Play Farm',live:'Live',description:'Plant, water, harvest. Grow your own little farm.',note:'Free · No account',enter:'Play now',previewAlt:'A little isometric farm with planted beds, trees, a well and an irrigation pump.',metaTitle:'MyFarmTwin — Play Farm',metaDescription:'Play MyFarmTwin in your browser. Plant, water, harvest and grow your little farm. Free, no account needed. Available in English and Indonesian.',ogDescription:'Plant, water, harvest. Grow your own little farm in your browser.'},
    id:{skip:'Langsung ke game',language:'Bahasa',play:'Mainkan Farm',live:'Sudah live',description:'Tanam, siram, panen. Kembangkan kebun kecilmu.',note:'Gratis · Tanpa akun',enter:'Main sekarang',previewAlt:'Kebun isometrik kecil dengan petak tanaman, pepohonan, sumur, dan pompa irigasi.',metaTitle:'MyFarmTwin — Mainkan Farm',metaDescription:'Mainkan MyFarmTwin di browsermu. Tanam, siram, panen, dan kembangkan kebun kecilmu. Gratis, tanpa akun. Tersedia dalam bahasa Indonesia dan Inggris.',ogDescription:'Tanam, siram, panen. Kembangkan kebun kecilmu langsung di browser.'}
  };
  const select=document.querySelector('#home-language');
  let locale=navigator.language.toLowerCase().startsWith('id')?'id':'en';
  try{const saved=localStorage.getItem('myfarmtwin.locale');if(saved==='en'||saved==='id')locale=saved;}catch{/* Preference storage is optional. */}
  function translate(){const m=messages[locale];document.documentElement.lang=locale;select.value=locale;document.querySelectorAll('[data-home]').forEach(el=>{el.textContent=m[el.getAttribute('data-home')];});document.querySelectorAll('[data-home-alt]').forEach(el=>el.setAttribute('alt',m[el.getAttribute('data-home-alt')]));document.title=m.metaTitle;document.querySelector('meta[name="description"]').setAttribute('content',m.metaDescription);document.querySelector('meta[property="og:title"]').setAttribute('content',m.metaTitle);document.querySelector('meta[property="og:description"]').setAttribute('content',m.ogDescription);}
  select.addEventListener('change',()=>{locale=select.value==='id'?'id':'en';try{localStorage.setItem('myfarmtwin.locale',locale);}catch{/* Browsing works without storage. */}translate();});
  translate();
})();
