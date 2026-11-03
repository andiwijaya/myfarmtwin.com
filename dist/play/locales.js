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
Object.assign(messages.en,{lowGraphics:'Low graphics',mapHint:'Tap a bed, or use the plot buttons. Drag to explore.'});Object.assign(messages.id,{lowGraphics:'Grafis ringan',mapHint:'Ketuk petak atau gunakan tombol petak. Geser untuk menjelajah.'});
Object.assign(messages.en,{playClock:'Play clock',paused:'Clock is paused.',staleCommand:'That action was already handled.',unknownCommand:'That action is not available.'});Object.assign(messages.id,{playClock:'Jalankan waktu',paused:'Waktu sedang dijeda.',staleCommand:'Aksi itu sudah diproses.',unknownCommand:'Aksi itu belum tersedia.'});
Object.assign(messages.en,{lettuce:'Lettuce',tomato:'Tomato',chooseCrop:'Choose a crop',gameDays:'game days',seed:'seed'});Object.assign(messages.id,{lettuce:'Selada',tomato:'Tomat',chooseCrop:'Pilih tanaman',gameDays:'hari game',seed:'benih'});
Object.assign(messages.en,{plant:'Plant',seeds:'seeds',seedling:'Seedling',planted:'A little seed, a fresh start!',invalidPlot:'Choose a valid bed.',occupied:'This bed already has a crop.',invalidCrop:'Choose lettuce or tomato.',noSeeds:'No seeds for this crop. Choose a crop with seeds in your inventory.'});
Object.assign(messages.id,{plant:'Tanam',seeds:'benih',seedling:'Bibit',planted:'Benih kecil, awal yang baru!',invalidPlot:'Pilih petak yang valid.',occupied:'Petak ini sudah ditanami.',invalidCrop:'Pilih selada atau tomat.',noSeeds:'Benih tanaman ini habis. Pilih tanaman yang benihnya tersedia.'});
Object.assign(messages.en,{sprout:'Sprout',growing:'Growing',readyHarvest:'Ready to harvest',timeAdvanced:'A new day on your farm.'});Object.assign(messages.id,{sprout:'Tunas',growing:'Tumbuh',readyHarvest:'Siap dipanen',timeAdvanced:'Hari baru di kebunmu.'});
Object.assign(messages.en,{moisture:'soil moisture'});Object.assign(messages.id,{moisture:'kelembapan tanah'});
try{locale=localStorage.getItem('myfarmtwin.locale')||(navigator.language.startsWith('id')?'id':'en');}catch{locale=navigator.language.startsWith('id')?'id':'en';}
if(!messages[locale])locale='en';
/** @param {string} key */
export const t=key=>messages[locale][key]||messages.en[key]||key;
export const getLocale=()=>locale;
/** @param {string} next */
export function setLocale(next){locale=messages[next]?next:'en';try{localStorage.setItem('myfarmtwin.locale',locale);}catch{/* Optional preference storage unavailable. */}document.documentElement.lang=locale;}
export function translate(){document.documentElement.lang=locale;document.querySelectorAll('[data-i18n]').forEach(el=>{el.textContent=t(el.getAttribute('data-i18n')||'');});}
