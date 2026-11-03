/** @type {Record<string,Record<string,string>>} */
export const messages={
 en:{edition:'THE LITTLE FARM',journal:'Back to journal',eyebrow:'GROW SOMETHING GOOD',title:'A little land. A lot to grow.',intro:'Your own small corner of the world. Start with a seed.',ready:'Welcome to your little farm.',local:'No account. Just you, a little land, and a fresh start.'},
 id:{edition:'KEBUN KECIL KITA',journal:'Kembali ke jurnal',eyebrow:'TUMBUHKAN HAL BAIK',title:'Lahan kecil. Harapan besar.',intro:'Sudut kecil dunia milikmu. Mulai dari sebutir benih.',ready:'Selamat datang di kebun kecilmu.',local:'Tanpa akun. Hanya kamu, sebidang tanah, dan awal yang baru.'}
};
let locale='en';
Object.assign(messages.en,{farmMap:'Your little farm · 8 × 8',market:'MARKET'});
Object.assign(messages.id,{farmMap:'Kebun kecilmu · 8 × 8',market:'PASAR'});
Object.assign(messages.en,{plot:'Plot',choosePlot:'Choose a plot',zoomOut:'Zoom out',zoomIn:'Zoom in',resetView:'Reset view'});
Object.assign(messages.id,{plot:'Petak',choosePlot:'Pilih petak',zoomOut:'Perkecil',zoomIn:'Perbesar',resetView:'Atur ulang tampilan'});
Object.assign(messages.en,{selectedBed:'YOUR GROWING SPACE',emptyBed:'Empty bed · Ready for your first seed.',close:'Close'});
Object.assign(messages.id,{selectedBed:'TEMPAT TUMBUHMU',emptyBed:'Petak kosong · Siap untuk benih pertamamu.',close:'Tutup'});
Object.assign(messages.en,{day:'Day',coins:'Coins',waterStock:'Water',inventory:'Inventory',starterSeeds:'Starter seeds',noHarvest:'No harvest yet.',pause:'Pause',nextDay:'Next day →',firstHarvest:'FIRST HARVEST',selectMission:'Choose a plot to begin.',selectTip:'Three empty beds. One fresh start. Tap a plot below.'});
Object.assign(messages.id,{day:'Hari',coins:'Koin',waterStock:'Air',inventory:'Inventori',starterSeeds:'Benih awal',noHarvest:'Belum ada panen.',pause:'Jeda',nextDay:'Hari berikutnya →',firstHarvest:'PANEN PERTAMA',selectMission:'Pilih petak untuk memulai.',selectTip:'Tiga petak kosong. Satu awal baru. Ketuk petak di bawah.'});
Object.assign(messages.en,{hideGuide:'Hide guide',showGuide:'Show guide'});Object.assign(messages.id,{hideGuide:'Tutup tips',showGuide:'Buka tips'});
try{locale=localStorage.getItem('myfarmtwin.locale')||(navigator.language.startsWith('id')?'id':'en');}catch{locale=navigator.language.startsWith('id')?'id':'en';}
if(!messages[locale])locale='en';
/** @param {string} key */
export const t=key=>messages[locale][key]||messages.en[key]||key;
export const getLocale=()=>locale;
/** @param {string} next */
export function setLocale(next){locale=messages[next]?next:'en';try{localStorage.setItem('myfarmtwin.locale',locale);}catch{/* Optional preference storage unavailable. */}document.documentElement.lang=locale;}
export function translate(){document.documentElement.lang=locale;document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.getAttribute('data-i18n')||'');});}
