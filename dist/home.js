/* Homepage language preference only. Game saves are never read or changed here. */
(() => {
  'use strict';
  const messages={
    en:{skip:'Skip to game',language:'Language',play:'A little farm.\nA lot to grow.',live:'Live now · Crops & chickens',description:'Grow vegetables, care for chickens, and make this little farm your own.',future:'A glimpse of our future farm. Goats, cows and fish ponds are not playable yet.',note:'Free · No account',enter:'Play now',previewAlt:'A cartoon future farm with vegetables, chickens, goats, a cow and a fish pond.',metaTitle:'MyFarmTwin — Play Farm',metaDescription:'Play MyFarmTwin in your browser. Grow crops and raise chickens in one farm. Free, no account needed. Available in English and Indonesian.',ogDescription:'Grow crops and raise chickens in one farm, right in your browser.'},
    id:{skip:'Langsung ke game',language:'Bahasa',play:'Farm kecil.\nHarapan besar.',live:'Sudah live · Sayur & ayam',description:'Tanam sayur, rawat ayam, dan bangun farm yang terasa milikmu sendiri.',future:'Gambaran visi farm kami. Kambing, sapi, dan kolam ikan belum bisa dimainkan.',note:'Gratis · Tanpa akun',enter:'Main sekarang',previewAlt:'Ilustrasi kartun visi farm dengan kebun sayur, ayam, kambing, sapi, dan kolam ikan.',metaTitle:'MyFarmTwin — Mainkan Farm',metaDescription:'Mainkan MyFarmTwin di browsermu. Tanam sayur dan pelihara ayam di farm yang sama. Gratis, tanpa akun. Tersedia dalam bahasa Indonesia dan Inggris.',ogDescription:'Tanam sayur dan pelihara ayam di farm yang sama, langsung di browser.'}
  };
  const select=document.querySelector('#home-language');
  let locale=navigator.language.toLowerCase().startsWith('id')?'id':'en';
  try{const saved=localStorage.getItem('myfarmtwin.locale');if(saved==='en'||saved==='id')locale=saved;}catch{/* Preference storage is optional. */}
  function translate(){const m=messages[locale];document.documentElement.lang=locale;select.value=locale;document.querySelectorAll('[data-home]').forEach(el=>{el.textContent=m[el.getAttribute('data-home')];});document.querySelectorAll('[data-home-alt]').forEach(el=>el.setAttribute('alt',m[el.getAttribute('data-home-alt')]));document.title=m.metaTitle;document.querySelector('meta[name="description"]').setAttribute('content',m.metaDescription);document.querySelector('meta[property="og:title"]').setAttribute('content',m.metaTitle);document.querySelector('meta[property="og:description"]').setAttribute('content',m.ogDescription);}
  select.addEventListener('change',()=>{locale=select.value==='id'?'id':'en';try{localStorage.setItem('myfarmtwin.locale',locale);}catch{/* Browsing works without storage. */}translate();});
  translate();
})();
