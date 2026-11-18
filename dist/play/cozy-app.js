import {CozySession,COZY_SAVE_KEY} from './cozy-storage.js';
import {COZY_BUILD_CATALOG,COZY_CROPS,COZY_GOODS,COZY_COSTS,COZY_SUPPLIES,COZY_LAND_BOUNDS,buildPrice,quoteLot,quoteAnimal,facilityCapacity} from './cozy-domain.js';
import {browserStorage,SAVE_KEY} from './storage.js';
import {GLB_LAYOUT_KEY} from './glb-prototype-state.js';
import {withSaveLock,writeLockAvailable} from './save-lock.js';
import {CozyWorld} from './cozy-world.js';
import {handleCameraResetShortcut,cameraResetShortcutHints,cameraGestureHint} from './cozy-camera-shortcuts.js';
import {watchCameraGestureInput} from './cozy-camera-gesture-input.js';

/** @param {string} id */
function el(id){const e=document.getElementById(id);if(!e)throw Error('Missing interface '+id);return e;}
/** @param {string} id */const input=id=>/** @type {HTMLInputElement} */(el(id));
/** @param {string} id */const dialog=id=>/** @type {HTMLDialogElement} */(el(id));
/** @type {'id'|'en'} */let language='id';try{language=localStorage.getItem('myfarmtwin.locale')==='en'?'en':'id';}catch{/* Optional preference. */}
// UI preference stays separate from all farm progress and migration keys.
const toolbarPreferenceKey='myfarmtwin.ui.toolbar-expanded.v1';
const toolbar=/** @type {HTMLDetailsElement} */(el('farm-toolbar'));
try{toolbar.open=localStorage.getItem(toolbarPreferenceKey)==='expanded';}catch{/* Optional preference. */}
let lastToolbarOpen=toolbar.open;
toolbar.addEventListener('toggle',()=>{
 const open=toolbar.open;if(open===lastToolbarOpen)return;
 lastToolbarOpen=open;
 try{localStorage.setItem(toolbarPreferenceKey,open?'expanded':'collapsed');}catch{/* Keep native controls usable when preference storage is unavailable. */}
});
/** @param {string} id @param {string} en */const L=(id,en)=>language==='id'?id:en;
/** @param {number} n @param {number} [digits] */const fmt=(n,digits=0)=>Number(n).toLocaleString(language,{maximumFractionDigits:digits});
/** @param {string} tag @param {string} [text] @param {string} [className] */
function node(tag,text='',className=''){const e=document.createElement(tag);e.textContent=text;e.className=className;return e;}
/** @param {string} label @param {()=>unknown} action @param {string} [name] @param {string} [className] */
function button(label,action,name='',className=''){const b=document.createElement('button');b.type='button';b.textContent=label;b.className=className;if(name)b.dataset.action=name;b.addEventListener('click',()=>{void action();});return b;}
/** @param {HTMLElement} host @param {string} label @param {string} value */
function stat(host,label,value){const row=node('div','','stat-row');row.append(node('span',label),node('strong',value));host.append(row);}
/** @param {string} kind */
function name(kind){return /** @type {Record<string,string>} */({bed:L('Bed kebun','Garden bed'),barn:L('Kandang sapi','Cow barn'),coop:L('Kandang ayam','Chicken coop'),goatShelter:L('Kandang kambing','Goat shelter'),pond:L('Kolam ikan','Fish pond'),market:L('Pasar farm','Farm market'),pump:L('Pompa air','Water pump'),tree:L('Pohon kelapa','Palm tree'),banana:L('Pohon pisang','Banana plant'),grass:L('Rumput tropis','Tropical grass'),path:L('Jalan setapak','Footpath'),fence:L('Pagar kayu','Timber fence'),lettuce:L('Selada','Lettuce'),tomato:L('Tomat','Tomato'),corn:L('Jagung','Corn'),egg:L('Telur','Egg'),milk:L('Susu','Milk'),fish:L('Ikan nila','Tilapia'),cow:L('Sapi','Cow'),chicken:L('Ayam','Chicken'),goat:L('Kambing','Goat')})[kind]||kind;}
const session=new CozySession(browserStorage(writeLockAvailable()),{writable:writeLockAvailable()});
/** @type {CozyWorld|null} */let world=null;
let selected='overview',busy=false,clockBusy=false,running=false,disposed=false,toastTimer=0,importConfirmed=false,recoverConfirmed=false;
/** @type {{item:any,mode:'move'|'build'}|null} */let placement=null;
const root=el('care-content');
/** @param {string} message */
function toast(message){el('toast').textContent=message;el('toast').classList.add('visible');window.clearTimeout(toastTimer);toastTimer=window.setTimeout(()=>el('toast').classList.remove('visible'),4200);}
/** @param {string} error */
function explain(error){const pair=/** @type {Record<string,[string,string]>} */({
 quoteExpired:['Harga berubah karena progres farm berubah. Coba lagi untuk harga terbaru.','Farm progress changed. Try again with the current quote.'],spoiledProduce:['Hasil lama ini sudah tidak layak jual. Kamu dapat membuangnya.','This legacy produce cannot be sold. You can discard it.'],upgradeFirst:['Upgrade fasilitas untuk membuka perawatan otomatis.','Upgrade this facility to unlock automatic care.'],noCoins:['Koin belum cukup. Jual hasil atau penuhi pesanan terlebih dahulu.','Not enough coins. Sell produce or complete an order first.'],noSeeds:['Benih habis. Beli benih di panel kebun.','No seeds left. Buy seeds in the garden panel.'],noWater:['Air habis. Isi persediaan air bersama.','No water left. Refill your shared water supply.'],noFeed:['Stok pakan habis. Beli pakan terlebih dahulu.','No feed in storage. Buy a feed package first.'],notReady:['Belum siap dipanen atau dikumpulkan. Rawat kebutuhan dan majukan waktu.','Not ready yet. Meet the needs and advance farm time.'],orderMissing:['Pesanan sudah selesai atau tidak tersedia.','This order is completed or unavailable.'],orderStock:['Hasil untuk pesanan belum lengkap.','You do not have all the produce for this order.'],noOrderStock:['Hasil untuk pesanan belum lengkap.','You do not have all the produce for this order.'],layoutOccupied:['Posisi bertabrakan dengan fasilitas lain.','This position overlaps another facility.'],layoutOutsideFarm:['Posisi di luar lahan milikmu. Perluas lahan atau pilih posisi lain.','Outside your owned land. Expand or choose another position.'],layoutAccess:['Sisakan ruang akses di depan pintu bangunan.','Leave access space in front of the building entrance.'],layoutInvalid:['Posisi atau tata letak tidak valid.','Invalid position or layout.'],farmFull:['Batas fasilitas ini sudah tercapai.','The limit for this facility has been reached.'],animalCapacity:['Kandang sudah penuh. Tingkatkan kapasitas terlebih dahulu.','This facility is full. Upgrade its capacity first.'],capacity:['Kapasitas fasilitas sudah penuh.','This facility is full.'],starterUsed:['Kit awal sudah digunakan. Tambah fasilitas melalui Tata lahan.','The starter kit has been used. Add a facility in Arrange farm.'],feedFull:['Tempat pakan masih penuh.','The feeder is still full.'],waterFull:['Tempat air atau persediaan masih penuh.','The water container or supply is still full.'],alreadyWet:['Tanah masih cukup basah.','The soil is already moist.'],alreadyClean:['Fasilitas sudah bersih.','The facility is already clean.'],noWaterNeeded:['Belum ada tanaman yang membutuhkan air.','No growing crops need watering.'],staleQuote:['Harga berubah karena progres farm berubah. Coba lagi untuk harga terbaru.','Farm progress changed. Try again with the current quote.'],staleCommand:['Farm sudah berubah. Coba tindakan lagi.','Farm progress changed. Try the action again.'],saveConflict:['Farm berubah di tab lain. Muat ulang untuk melanjutkan dengan progres terbaru.','Your farm changed in another tab. Reload to use its latest progress.'],saveUnavailable:['Penyimpanan gagal. Perubahan belum diterapkan; data asli tetap dilindungi.','Storage failed. Changes were not applied; original data remains protected.'],saveCorrupt:['Progres tidak dapat dibaca. Tampilkan cadangan atau pulihkan salinan sebelumnya.','Progress could not be read. Export or recover the previous backup.'],saveNewer:['Progres dibuat oleh versi yang lebih baru. Simpan cadangan dan gunakan versi terbaru.','This save is from a newer version. Keep a backup and use the latest release.'],saveReadOnly:['Browser ini hanya dapat membaca progres. Ekspor cadangan tetap tersedia.','This browser can only read progress. Backup export remains available.'],saveImportInvalid:['Teks cadangan tidak valid. Farm yang ada tidak berubah.','Invalid backup text. Your current farm is unchanged.'],saveTooLarge:['Cadangan melebihi batas ukuran yang aman.','The backup exceeds the supported size.'],savePreserveFirst:['Cadangan asli belum dapat disimpan. Kosongkan ruang penyimpanan lalu coba lagi.','The original archive could not be saved. Free storage space and retry.'],backupMissing:['Belum ada cadangan sebelumnya untuk dipulihkan.','There is no previous backup to recover.'],upgradeMax:['Fasilitas sudah mencapai tingkat tertinggi.','This facility is at its highest level.'],landMax:['Seluruh perluasan lahan sudah dimiliki.','All land expansions are already owned.'],autoLocked:['Tingkatkan fasilitas untuk membuka perawatan otomatis.','Upgrade this facility to unlock automatic care.'],spoiled:['Hasil lama ini sudah tidak layak jual. Kamu dapat membuangnya.','This legacy produce cannot be sold. You can discard it.'],recoveryUnavailable:['Kit pemulihan tersedia saat benih, hasil, dan koin benar-benar habis.','The recovery kit is available when seeds, produce, and coins are exhausted.']})[error];return pair?L(...pair):L('Tindakan belum tersedia. Periksa stok, kebutuhan, dan kapasitas farm.','Action unavailable. Check supplies, needs, and farm capacity.');}
/** @param {()=>any} operation @param {string} [message] */
async function act(operation,message=L('Perubahan tersimpan.','Changes saved.')){if(busy||clockBusy)return;busy=true;try{const result=await withSaveLock(operation);if(result.ok){render();toast(message);}else toast(explain(result.error));return result;}catch(error){console.error('Farm action failed',error);toast(explain('saveUnavailable'));return undefined;}finally{busy=false;renderSaveStatus();}}
/** @param {string} type @param {any} [args] @param {string} [message] */
async function command(type,args={},message){const result=await act(()=>session.command(type,args),message);if(result?.ok&&args.facility)world?.activity(args.facility,type==='feed'?'eat':type==='waterFacility'?'drink':'idle');return result;}
/** @param {string} kind */const facilityFor=kind=>session.state.facilities.find((/** @type {any} */f)=>f.kind===kind);
/** @param {string} view @param {boolean} [scroll] */
function go(view,scroll=false){if(placement)cancelPlacement();const target=['barn','coop','goatShelter','pond','market'].includes(view)?facilityFor(view)?.id||view:view;selected=target;world?.select(target);world?.focus(target);renderCare(false);root.scrollTop=0;if(scroll&&matchMedia('(max-width:760px)').matches)el('care').scrollIntoView({behavior:'instant',block:'start'});}
/** @param {string} id */function select(id){go(id,true);}
/** Update interface without replacing an already restored camera pose. @param {string} id */
function reflectCameraView(id){selected=id;world?.select(id);renderCare(false);root.scrollTop=0;}
/** @param {HTMLElement} host */
function plotPicker(host){const grid=node('div','','plot-grid');grid.setAttribute('aria-label',L('Pilih bed kebun','Choose a garden bed'));for(const plot of session.state.plots){const b=button(String(plot.id+1),()=>select('bed.'+plot.id),'focus-bed-'+plot.id);b.dataset.plot=String(plot.id);b.setAttribute('aria-label','Bed '+(plot.id+1)+(plot.crop?' · '+name(plot.crop.type):L(' · kosong',' · empty')));b.classList.toggle('current',selected==='bed.'+plot.id);b.classList.toggle('growing',!!plot.crop);b.classList.toggle('harvest-ready',(plot.crop?.progress||0)>=1);grid.append(b);}host.append(grid);}
/** @param {HTMLElement} host @param {string} label @param {number} ratio @param {string} detail */
function need(host,label,ratio,detail){const line=node('div','','need-label');line.append(node('span',label),node('strong',detail));const meter=node('div','','need-meter'+(ratio<.25?' low':'')),fill=node('span');fill.style.width=Math.min(100,Math.max(0,ratio*100))+'%';meter.append(fill);host.append(line,meter);}
/** @param {HTMLElement} host */
function supplies(host){host.append(node('h3',L('PERSEDIAAN BERSAMA','SHARED SUPPLIES')));stat(host,L('Air kebun & ternak','Garden & livestock water'),fmt(session.state.water,1)+' L');const actions=node('div','','actions');actions.append(button(L('Isi 120 L · 6 koin','Refill 120 L · 6 coins'),()=>command('refill'), 'refill'));for(const crop of ['lettuce','tomato','corn']){stat(host,L('Benih ','Seeds · ')+name(crop),fmt(session.state.seeds[crop]));actions.append(button(L('Beli ','Buy ')+name(crop)+' · '+COZY_CROPS[crop].seedPrice,()=>command('buySeed',{crop}),'seed-'+crop));}host.append(actions);}
/** @param {any} lot */
function quantity(lot){const definition=COZY_GOODS[lot.type];return fmt(lot.quantity/definition.scale,definition.scale>1?2:0)+' '+(definition.scale>1?definition.unit:L(lot.type==='egg'?'butir':'buah',lot.type==='egg'?'eggs':'items'));}
/** @param {HTMLElement} host */
function inventory(host){host.append(node('h3',L('HASIL DI GUDANG','PRODUCE IN STORAGE')));if(!session.state.inventory.length)host.append(node('p',L('Panen dan hasil ternak akan muncul di sini.','Harvests and livestock produce will appear here.')));for(const lot of session.state.inventory){const row=node('div','','stock-row'),quote=quoteLot(session.state,lot.id),saleable=lot.value3000>0&&lot.quality>0;row.append(node('span',name(lot.type)+' · '+quantity(lot)+' · '+L('mutu ','quality ')+fmt(lot.quality*100)+'%'),button(saleable?L('Jual · ','Sell · ')+((quote?.price||0)>0?(quote?.price||0):fmt(lot.value3000/3000,3)+L(' kredit',' credit')):L('Buang','Discard'),()=>command(saleable?'sell':'discard',saleable?{lot:lot.id,quote}:{lot:lot.id}),'sell-'+lot.id));host.append(row);}if(session.state.inventory.some((/** @type {any} */l)=>l.value3000>0&&l.quality>0))host.append(button(L('Jual semua hasil layak','Sell all saleable produce'),()=>command('sellAll'), 'sell-all'));}
/** @param {HTMLElement} host */
function business(host){const state=session.state,summary=node('div','','business-summary');for(const [label,value]of [[L('PENDAPATAN','INCOME'),state.stats.income],[L('BIAYA','EXPENSE'),state.stats.expense],[L('SELISIH','NET'),state.stats.income-state.stats.expense]]){const cell=node('div');cell.append(node('span',String(label)),node('strong',fmt(Number(value))));summary.append(cell);}host.append(summary);}
/** @param {HTMLElement} host */
function orders(host){host.append(node('h3',L('PESANAN TETANGGA','NEIGHBORHOOD ORDERS')));const active=session.state.orders.filter((/** @type {any} */o)=>!o.completed);for(const order of active){const card=node('section','','order-card');card.append(node('h4',L('Pesanan ','Order ')+(session.state.orders.indexOf(order)+1)));let enough=true;for(const [kind,needed]of Object.entries(order.needs)){const have=session.state.inventory.filter((/** @type {any} */l)=>l.type===kind&&l.quality>0).reduce((/** @type {number} */n,/** @type {any} */l)=>n+l.quantity,0),def=COZY_GOODS[kind];if(have<Number(needed))enough=false;card.append(node('p',name(kind)+' · '+fmt(have/def.scale,2)+' / '+fmt(Number(needed)/def.scale,2)+(def.scale>1?' '+def.unit:'')));}card.append(node('p',L('Harga hasil + bonus ','Produce value + bonus ')+order.bonus+L(' koin',' coins')));const action=button(L('Kirim pesanan','Deliver order'),()=>command('order',{order:order.id},L('Pesanan terkirim. Bonus diterima.','Order delivered. Bonus received.')),'order-'+order.id,'primary');action.disabled=!enough;card.append(action);host.append(card);}if(!active.length)host.append(button(L('Cari pesanan baru','Find new orders'),()=>command('refreshOrders'),'refresh-orders'));}
function tutorial(){const state=session.state;const box=node('div','','farm-tutorial');let title=L('Awali dengan sesuatu yang tumbuh.','Start with something that grows.'),help=L('Pilih bed, tanam selada, lalu siram. Waktu farm bergerak saat kamu menekan Jalan atau +6 jam.','Choose a bed, plant lettuce, then water it. Farm time moves when you press Play or +6 hours.');if(state.plots.some((/** @type {any} */p)=>p.crop)){title=L('Beri waktu untuk tumbuh.','Give it time to grow.');help=L('Jaga tanah lembap lalu majukan waktu. Selada siap sekitar 18 jam farm dengan air cukup.','Keep the soil moist and advance time. Lettuce takes about 18 farm hours with enough water.');}if(state.plots.some((/** @type {any} */p)=>(p.crop?.progress||0)>=1)){title=L('Panen sudah menunggu.','Your harvest is ready.');help=L('Pilih Kebun lalu Panen yang siap. Simpan hasil untuk pesanan atau jual di market.','Choose Garden, then Harvest ready crops. Keep produce for orders or sell it at the market.');}if(state.inventory.length){title=L('Hasilmu punya tujuan.','Put your produce to work.');help=L('Jual di market atau simpan untuk pesanan dengan bonus. Pendapatan membantu perluasan farm.','Sell at the market or save it for orders with a bonus. Income helps expand your farm.');}if(state.stats.orders>0&&!state.inventory.length&&!state.plots.some((/** @type {any} */p)=>p.crop)){title=L('Saatnya memperluas cerita.','Time to grow your story.');help=L('Tata lahan, tambah fasilitas, dan tingkatkan perawatan otomatis. Kandang pertama tiap jenis mendapat kit awal sekali.','Arrange the land, add facilities, and upgrade automatic care. The first facility of each type gets a starter kit once.');}box.append(node('strong',title),node('p',help));return box;}
/** @param {string} kind */
async function startArea(kind){const result=await command('start',{kind},L('Area dibuka. Kit awal sudah tersedia.','Area opened. Your starter kit is ready.'));if(result?.ok)go(result.id||kind);}
function overview(){root.append(node('h2',L('Farm yang tumbuh bersamamu.','A farm that grows with you.')),tutorial());const ownedBounds=COZY_LAND_BOUNDS[session.state.land.level];stat(root,L('Lahan milikmu','Your land'),(ownedBounds.maxX*2)+' × '+(ownedBounds.maxZ*2)+' m');root.append(node('p',L('Penanda kayu di sudut menunjukkan batas lahan. Buka Tata lahan untuk memperluasnya.','Timber corner markers show your land boundary. Open Arrange to expand it.'),'keyboard-help'));const list=node('div','','area-list');for(const kind of ['garden','coop','goatShelter','barn','pond','market']){const facility=facilityFor(kind),owned=kind==='garden'||!!facility,count=kind==='garden'?session.state.plots.filter((/** @type {any} */p)=>p.crop).length:session.state.facilities.filter((/** @type {any} */f)=>f.kind===kind).flatMap((/** @type {any} */f)=>f.animals).reduce((/** @type {number} */n,/** @type {any} */a)=>n+a.count,0);const card=button('',()=>go(kind),'focus-'+kind,'area-card'),copy=node('div');copy.append(node('strong',kind==='garden'?L('Kebun sayur','Vegetable garden'):name(kind)),node('small',owned?kind==='garden'?count+L(' bed terisi · ',' planted · ')+session.state.plots.length+' bed':kind==='market'?L('Hasil, pesanan, dan catatan usaha','Produce, orders, and your business'):count+L(' hewan · lihat kebutuhan',' animals · see needs'):L('Kit awal tersedia · mulai gratis','Starter kit available · start for free')));card.append(copy,node('span','↗'));list.append(card);}root.append(list);business(root);const actions=node('div','','actions');actions.append(button(L('Tata lahan','Arrange farm'),openBuild,'open-build'),button(L('Pesanan & hasil','Orders & produce'),()=>go('market'),'focus-orders'));root.append(actions);if(session.state.coins<4&&!session.state.inventory.length&&!session.state.plots.some((/** @type {any} */p)=>p.crop))root.append(button(L('Kit pemulihan benih','Seed recovery kit'),()=>command('recovery'),'recovery'));}
/** @param {any} plot */
function bedPanel(plot){root.append(node('h2','Bed '+(plot.id+1)),node('p',plot.crop?name(plot.crop.type)+L(' tumbuh di lahanmu.',' is growing in your garden.'):L('Tanah siap ditanami. Pilih benih dari persediaanmu.','Ready to plant. Choose a seed from your supplies.')));need(root,L('Kelembapan tanah','Soil moisture'),plot.soilWaterMm/50,fmt(plot.soilWaterMm/50*100)+'%');if(plot.crop)need(root,L('Pertumbuhan','Growth'),plot.crop.progress,fmt(plot.crop.progress*100)+'%');const actions=node('div','','actions');if(!plot.crop)for(const crop of ['lettuce','tomato','corn']){const stock=session.state.seeds[crop];actions.append(button(stock?L('Tanam ','Plant ')+name(crop)+' · '+stock:L('Beli benih ','Buy seeds · ')+name(crop)+' · '+COZY_CROPS[crop].seedPrice,()=>command(stock?'plant':'buySeed',stock?{plot:plot.id,crop}:{crop}),stock?'plant-'+crop:'seed-'+crop));}const water=button(L('Siram bed','Water bed'),()=>command('water',{plot:plot.id}),'water');water.disabled=plot.soilWaterMm>=45;actions.append(water);if(plot.crop){const harvest=button(L('Panen','Harvest'),()=>command('harvest',{plot:plot.id},L('Panen masuk gudang.','Harvest added to storage.')),'harvest','primary');harvest.disabled=plot.crop.progress<1;actions.append(harvest);}actions.append(button(L('Pindahkan bed','Move bed'),()=>beginMove('bed.'+plot.id),'move-bed'),button(L('Semua bed','All beds'),()=>go('garden'),'focus-garden'));root.append(actions);plotPicker(root);supplies(root);}
function gardenPanel(){root.append(node('h2',L('Satu benih. Banyak harapan.','One seed. Room to grow.')),node('p',L('Selada 18 jam · tomat 30 jam · jagung 42 jam. Air cukup mempercepat pertumbuhan; lahan kering hanya memperlambatnya.','Lettuce 18h · tomatoes 30h · corn 42h. Enough water keeps growth moving; dry soil slows it down.')));plotPicker(root);const actions=node('div','','actions');actions.append(button(L('Siram yang perlu','Water thirsty crops'),()=>command('waterAll'),'water-all'),button(L('Panen yang siap','Harvest ready crops'),()=>command('harvestAll'),'harvest-all','primary'),button(L('Tambah bed · 18','Add bed · 18'),()=>beginBuild('bed'),'build-bed'),button(L('Bangun pompa · 80','Build pump · 80'),()=>beginBuild('pump'),'build-pump'));root.append(actions);supplies(root);}
/** @param {string} kind */
function unstarted(kind){root.append(node('h2',name(kind)),node('p',L('Buka area ini untuk menerima fasilitas pertama, hewan, dan persediaan awal. Setelah itu kamu bisa menata atau menambah fasilitas sendiri.','Open this area to receive your first facility, animals, and starter supplies. Then arrange it or build more facilities.')),button(L('Mulai gratis','Start for free'),()=>startArea(kind),'start-'+kind,'primary'));}
/** @param {any} f */
function facilityPanel(f){const state=session.state,capacity=facilityCapacity(f),same=state.facilities.filter((/** @type {any} */x)=>x.kind===f.kind);root.append(node('h2',name(f.kind)),node('p',L('Rawat kebutuhan sederhana. Waktu berjalan hanya saat farm aktif; hewan tetap aman ketika kamu pergi.','Care for simple needs. Time moves while your farm is active; your animals stay safe while you are away.')));if(same.length>1){const label=node('label',L('Pilih fasilitas','Choose facility'),'sr'),select=document.createElement('select');select.className='facility-select';select.setAttribute('aria-label',L('Pilih fasilitas','Choose facility'));for(const facility of same){const option=document.createElement('option');option.value=facility.id;option.textContent=name(f.kind)+' · '+facility.id;select.append(option);}select.value=f.id;select.addEventListener('change',()=>go(select.value));root.append(label,select);}
 const count=f.animals.reduce((/** @type {number} */n,/** @type {any} */a)=>n+a.count,0);stat(root,L('Penghuni / kapasitas','Animals / capacity'),count+' / '+capacity.animals);stat(root,L('Tingkat fasilitas','Facility level'),String(f.level+1));need(root,L('Pakan di tempat makan','Feed in feeder'),f.feedG/capacity.feedG,fmt(f.feedG/1000,2)+' kg');if(f.kind!=='pond')need(root,L('Air di tempat minum','Water in drinker'),f.waterMl/capacity.waterMl,fmt(f.waterMl/1000,1)+' L');need(root,L('Kebersihan','Cleanliness'),f.cleanliness/100,fmt(f.cleanliness)+'%');stat(root,L('Stok pakan','Stored feed'),fmt(f.feedStockG/1000,2)+' kg');stat(root,L('Air cadangan fasilitas','Facility water reserve'),fmt(f.waterStockMl/1000,1)+' L');if(f.kind==='goatShelter'&&f.foragePlots>0)stat(root,L('Hijauan paddock','Paddock forage'),fmt(f.forageG/1000,2)+' kg · '+f.foragePlots+L(' petak',' paddocks'));
 const actions=node('div','','actions');actions.append(button(L('Isi pakan','Fill feeder'),()=>command('feed',{facility:f.id}),'feed-'+f.id));actions.append(button(f.kind==='pond'?L('Ganti air 200 L','Exchange 200 L water'):L('Isi air','Fill drinker'),()=>command('waterFacility',{facility:f.id}),'water-'+f.id));actions.append(button(L('Bersihkan gratis','Clean for free'),()=>command('clean',{facility:f.id}),'clean-'+f.id));const packageInfo=COZY_SUPPLIES[f.kind];actions.append(button(L('Beli pakan ','Buy feed ')+fmt(packageInfo.feed/1000,1)+' kg · '+packageInfo.price,()=>command('buyFeed',{facility:f.id}),'buy-feed-'+f.id));if(f.kind==='pond')actions.append(button(f.enabled?L('Matikan aerator','Turn aerator off'):L('Nyalakan aerator','Turn aerator on'),()=>command('toggleAerator',{facility:f.id}),'aerator-'+f.id));
 if(f.kind!=='goatShelter'){const amount=f.kind==='coop'?f.pending:f.kind==='barn'?f.animals.reduce((/** @type {number} */n,/** @type {any} */a)=>n+a.ready,0)/1000:f.animals.filter((/** @type {any} */a)=>a.massG>=500).reduce((/** @type {number} */n,/** @type {any} */a)=>n+a.count*a.massG/1000,0),unit=f.kind==='coop'?L(' butir',' eggs'):f.kind==='barn'?' L':' kg';stat(root,L('Siap dikumpulkan','Ready to collect'),fmt(amount,2)+unit);const collect=button(f.kind==='coop'?L('Ambil telur','Collect eggs'):f.kind==='barn'?L('Perah susu','Milk cows'):L('Panen ikan matang','Harvest mature fish'),()=>command('collect',{facility:f.id}),'collect-'+f.id,'primary');collect.disabled=amount<=0;actions.append(collect);}
 const buy=button(L('Tambah hewan · ','Add animals · ')+COZY_COSTS.animal[/** @type {keyof typeof COZY_COSTS.animal} */(f.kind)],()=>command('buyAnimal',{facility:f.id}),'buy-animal-'+f.id);buy.disabled=count>=capacity.animals;actions.append(buy);root.append(actions);
 const animals=node('div','','herd-list');for(const animal of f.animals){const row=node('div','','animal-row'),info=node('div');info.append(node('span',name(animal.species)+(animal.count>1?' × '+animal.count:'')),node('small',L('Kondisi ','Condition ')+fmt(animal.condition*100)+'%'+(['goat','fish'].includes(animal.species)?L(' · tumbuh ',' · grown ')+fmt(animal.growth*100)+'%':'')));row.append(info,button(L('Lihat','View'),()=>select(animal.id),'focus-'+animal.id));if(animal.species==='goat'){const quote=quoteAnimal(state,f.id,animal.id);row.append(button(L('Jual · ','Sell · ')+(quote?.price||0),()=>command('sellAnimal',{facility:f.id,animal:animal.id,quote}),'sell-animal-'+animal.id));}animals.append(row);}root.append(animals);const extras=node('div','','actions');if(f.kind!=='pond')extras.append(button(L('Lihat interior','View interior'),()=>go('inside:'+f.id),'interior-'+f.id));extras.append(button(L('Pindahkan','Move'),()=>beginMove(f.id),'move-'+f.id),button(L('Upgrade · ','Upgrade · ')+(50*(f.level+1)),()=>command('upgrade',{facility:f.id}),'upgrade-'+f.id));const auto=button(f.auto?L('Otomatis: hidup','Automatic care: on'):L('Otomatis: mati','Automatic care: off'),()=>command('toggleAuto',{facility:f.id}),'auto-'+f.id);auto.disabled=!capacity.autoAvailable;extras.append(auto);root.append(extras);if(!capacity.autoAvailable)root.append(node('p',L('Upgrade membuka isi pakan dan air otomatis dari stok milikmu.','Upgrade unlocks automatic feed and water from your existing supplies.'),'notice'));}
function marketPanel(){root.append(node('h2',L('Dari farm, untuk tetangga.','From your farm to the neighborhood.')),node('p',L('Jual hasil saat kamu mau, atau simpan untuk pesanan. Bonus diterima setelah seluruh kebutuhan pesanan tersedia.','Sell produce when you choose, or keep it for orders. Bonuses arrive when the complete order is available.')));business(root);if(session.state.progression.credit3000>0)stat(root,L('Kredit tersimpan','Stored credit'),fmt(session.state.progression.credit3000/3000,3)+L(' koin',' coins'));if(session.state.progression.debtCoins>0){stat(root,L('Sisa uang muka lama','Legacy advance balance'),fmt(session.state.progression.debtCoins));root.append(button(L('Bayar uang muka · maks. ','Repay advance · up to ')+fmt(Math.min(session.state.coins,session.state.progression.debtCoins)),()=>command('repayDebt'),'repay-debt'));}orders(root);inventory(root);root.append(node('h3',L('CATATAN TRANSAKSI','TRANSACTION HISTORY')));const ledger=node('ul','','ledger');for(const entry of session.state.ledger.slice(-12).reverse()){const row=node('li');row.append(node('span',ledgerName(entry.type)),node('strong',(entry.amount>0?'+':'')+fmt(entry.amount),entry.amount<0?'expense':'income'));ledger.append(row);}if(!ledger.children.length)root.append(node('p',L('Transaksi pertamamu akan tercatat di sini.','Your first transaction will appear here.')));root.append(ledger);const f=facilityFor('market');if(f){const actions=node('div','','actions');actions.append(button(L('Lihat dalam market','View market interior'),()=>go('inside:'+f.id),'interior-market'),button(L('Pindahkan market','Move market'),()=>beginMove(f.id),'move-market'));root.append(actions);}}
/** @param {string} type */
function ledgerName(type){if(type.startsWith('build_'))return L('Bangun ','Build ')+name(type.slice(6));return /** @type {Record<string,string>} */({seed_purchase:L('Beli benih','Seeds'),water_purchase:L('Isi air','Water refill'),feed_purchase:L('Beli pakan','Feed'),animal_purchase:L('Beli hewan','Animals'),animal_sale:L('Jual ternak','Animal sale'),produce_sale:L('Penjualan hasil','Produce sale'),sale_revenue:L('Penjualan hasil','Produce sale'),order_revenue:L('Hasil pesanan','Order produce'),order_bonus:L('Bonus pesanan','Order bonus'),facility_upgrade:L('Upgrade fasilitas','Facility upgrade'),land_expansion:L('Perluasan lahan','Land expansion')})[type]||L('Transaksi farm','Farm transaction');}
function renderCare(restoreFocus=true){const focus=restoreFocus&&document.activeElement instanceof HTMLElement?document.activeElement.dataset.action:'';root.replaceChildren();const state=session.state,view=selected,entityId=view.startsWith('inside:')?view.slice(7):view;let facility=state.facilities.find((/** @type {any} */f)=>f.id===entityId);if(!facility)facility=state.facilities.find((/** @type {any} */f)=>f.animals.some((/** @type {any} */a)=>a.id===entityId));const item=state.layout.items.find((/** @type {any} */p)=>p.id===entityId),plot=view.startsWith('bed.')?state.plots.find((/** @type {any} */p)=>'bed.'+p.id===view):null;
 document.querySelector('.world-heading')?.classList.toggle('compact',view!=='overview');let title=plot?'Bed '+(plot.id+1):facility?name(facility.kind):view==='garden'?L('Kebun sayur.','Vegetable garden.'):view==='overview'?'':name(view);el('panel-eyebrow').textContent=view==='market'||facility?.kind==='market'?L('USAHA & HASIL FARM','FARM BUSINESS & PRODUCE'):L('CATATAN FARM','FARM NOTES');if(view==='overview')el('view-title').replaceChildren(document.createTextNode(L('Sedikit lahan.','A little land.')),document.createElement('br'),document.createTextNode(L('Banyak kehidupan.','A lot of life.')));else el('view-title').textContent=(view.startsWith('inside:')?L('Di dalam · ','Inside · '):'')+title;
 if(plot)bedPanel(plot);else if(view==='garden')gardenPanel();else if(facility?.kind==='market'||view==='market')marketPanel();else if(facility?.kind==='pump'){root.append(node('h2',name('pump')),node('p',L('Pompa menyiram bed yang mulai kering menggunakan air bersama.','The pump waters drying beds from your shared water supply.')));const actions=node('div','','actions');actions.append(button(facility.enabled?L('Matikan pompa','Turn pump off'):L('Nyalakan pompa','Turn pump on'),()=>command('togglePump',{facility:facility.id}),'toggle-pump'),button(L('Pindahkan','Move'),()=>beginMove(facility.id),'move-pump'));root.append(actions);supplies(root);}else if(facility)facilityPanel(facility);else if(['barn','coop','goatShelter','pond'].includes(view))unstarted(view);else if(item){root.append(node('h2',name(item.kind)),node('p',L('Bagian dari farm milikmu. Pindahkan dan putar untuk membuat tata letak baru.','Part of your farm. Move and rotate it to create a new arrangement.')),button(L('Pindahkan','Move'),()=>beginMove(item.id),'move-decoration'));}else overview();
 const bounds=COZY_LAND_BOUNDS[state.land.level];el('location-label').textContent=view==='overview'?L('SELURUH FARM','WHOLE FARM'):title.toUpperCase();el('world').dataset.selected=view;el('world').dataset.land=JSON.stringify(bounds);for(const nav of document.querySelectorAll('.destinations [data-view]'))nav.classList.toggle('active',nav.getAttribute('data-view')===(plot?'garden':facility?.kind||view));if(session.readOnly){const warning=node('p',explain(session.status),'read-only');root.prepend(warning);for(const b of root.querySelectorAll('button'))if(!b.dataset.action?.startsWith('focus')&&!b.dataset.action?.startsWith('interior'))b.disabled=true;}if(focus)root.querySelector('[data-action="'+CSS.escape(focus)+'"]')?.scrollIntoView({block:'nearest'});}
function renderSaveStatus(){el('save-status').textContent=session.readOnly?explain(session.status):session.status==='saveReady'?L('Tanpa akun · progres tersimpan setelah tindakan pertama.','No account · progress saves after your first action.'):session.status==='saveMigrationPreview'?L('Progres lama terbaca. Arsip dibuat sebelum perubahan pertama.','Legacy progress loaded. An archive is saved before your first change.'):L('Progres tersimpan di perangkat ini · tanpa akun','Progress saved on this device · no account');}
function render(){const s=session.state;el('coin-value').textContent=fmt(s.coins);el('level-value').textContent=String(s.progression.level);el('beds-value').textContent=String(s.plots.length);const time=String(s.tick%24).padStart(2,'0')+':00';el('day-value').textContent=fmt(Math.floor(s.tick/24)+1)+' · '+time;el('toolbar-day-value').textContent=el('day-value').textContent;el('toolbar-coins-value').textContent=fmt(s.coins);el('clock-time').textContent=L('Hari ','Day ')+(Math.floor(s.tick/24)+1)+' · '+time;el('pause').textContent=running?L('Ⅱ Jeda','Ⅱ Pause'):L('▶ Jalan','▶ Play');el('world').dataset.revision=String(s.revision);el('world').dataset.inventory=String(s.inventory.length);el('world').dataset.saveStatus=session.status;try{world?.sync(s);}catch(error){el('world').dataset.runtimeError='true';console.error('Farm graphics update failed; progress remains saved',error);}renderCare();renderSaveStatus();}
function openBuild(){const catalog=el('build-catalog');catalog.replaceChildren();const state=session.state;for(const [kind,def]of Object.entries(COZY_BUILD_CATALOG)){const count=state.layout.items.filter((/** @type {any} */p)=>p.kind===kind).length,price=buildPrice(state,kind),card=button('',()=>{dialog('build-dialog').close();beginBuild(kind);},'catalog-'+kind,'catalog-card');card.append(node('strong',name(kind)),node('small',(price?fmt(price)+L(' koin',' coins'):L('Kit awal gratis','Free starter kit'))+' · '+count+'/'+def.limit));card.disabled=session.readOnly||count>=def.limit;catalog.append(card);}const expand=button(L('Perluas lahan · ','Expand land · ')+(180*(state.land.level+1)),()=>{void command('expand').then(result=>{if(result?.ok){dialog('build-dialog').close();go('overview');}});},'expand-land','catalog-card');expand.append(node('small',L('Lahan saat ini: ','Owned land: ')+(COZY_LAND_BOUNDS[state.land.level].maxX*2)+' × '+(COZY_LAND_BOUNDS[state.land.level].maxZ*2)+' m'));expand.disabled=session.readOnly||state.land.level>=2;catalog.append(expand);dialog('build-dialog').showModal();}
/** @param {string} id */function beginMove(id){const p=session.layout.items.find((/** @type {any} */p)=>p.id===id);if(!p)return;placement={item:{...p},mode:'move'};showPlacement();}
/** @param {string} kind */function beginBuild(kind){const state=session.state,id=kind==='bed'?'bed.'+state.plots.length:!state.layout.items.some((/** @type {any} */p)=>p.id===kind)?kind:kind+'.'+state.layout.nextId;placement={item:{id,kind,x:0,z:6,rotation:0},mode:'build'};showPlacement();}
function showPlacement(){if(!placement)return;el('placement').hidden=false;el('placement-title').textContent=(placement.mode==='move'?L('Pindahkan ','Move '):L('Bangun ','Build '))+name(placement.item.kind);input('place-x').value=String(placement.item.x);input('place-z').value=String(placement.item.z);/** @type {HTMLSelectElement} */(el('place-rotation')).value=String(placement.item.rotation);updatePlacement();el('placement').scrollIntoView({behavior:'instant',block:'nearest'});}
function updatePlacement(){if(!placement)return;placement.item={...placement.item,x:Number(input('place-x').value),z:Number(input('place-z').value),rotation:Number(/** @type {HTMLSelectElement} */(el('place-rotation')).value)};const issue=session.previewPlacement(placement.item);el('placement-valid').textContent=issue?explain(issue):L('Posisi tersedia. Biaya: ','Position available. Cost: ')+(placement.mode==='move'?0:buildPrice(session.state,placement.item.kind))+L(' koin.',' coins.');el('placement-valid').classList.toggle('danger',!!issue);/** @type {HTMLButtonElement} */(el('placement-confirm')).disabled=!!issue||session.readOnly;world?.preview(placement.item);world?.previewValid(!issue);}
function cancelPlacement(){placement=null;el('placement').hidden=true;world?.preview(null);}
function updateCameraShortcutHints(){
 const hints=cameraResetShortcutHints(navigator,language);
 for(const [id,hint]of Object.entries({'camera-undo':hints.undo,'camera-redo':hints.redo})){
  const button=el(id);button.title=hint.title;button.setAttribute('aria-keyshortcuts',hint.shortcuts);
 }
}
const cameraTouchInput=matchMedia('(pointer: coarse)');
const gestureModeKey = 'myfarmtwin.ui.camera-gesture-mode.v1';
const gestureStorage = browserStorage();
const gestureModeSelect = /** @type {HTMLSelectElement} */(el('gesture-hint-mode'));
const gestureResetButton = /** @type {HTMLButtonElement} */(el('gesture-input-reset'));
const gestureResetFeedback = el('gesture-reset-feedback');
const gestureResetHelp = el('gesture-reset-help');
const gestureResetHelpSpace = el('gesture-reset-help-space');
const gestureResetConfirmationSpace = el('gesture-reset-confirmation-space');
const gestureResetProgress = el('gesture-reset-confirmation-progress');
const gestureResetSeconds = el('gesture-reset-confirmation-seconds');
const gestureResetConfirmationDuration = 3000;
const gestureInputNotice = el('gesture-input-notice');
const activeGestureStatus = el('gesture-active-input');
const activeGestureType = el('gesture-active-type');
const activeGestureSource = el('gesture-active-source');
/** @param {unknown} value @returns {'auto'|'touch'|'mouse'} */
function parseGestureMode(value) {
 return value === 'touch' || value === 'mouse' ? value : 'auto';
}
/** @returns {'auto'|'touch'|'mouse'} */
function readGestureMode() {
 try { return parseGestureMode(gestureStorage?.getItem(gestureModeKey)); }
 catch { return 'auto'; }
}
let gestureMode = readGestureMode();
let gestureModeSaved = true;
/** @type {'status'|'outgoing'|'confirmation'} */let gestureResetHelpPhase = 'status';
/** @type {Animation|null} */let gestureResetAnimation = null;
/** @type {number|null} */let gestureResetSecondsFrame = null;
let gestureResetHovered = false;

function cancelGestureResetAnimation() {
 if (gestureResetSecondsFrame !== null) window.cancelAnimationFrame(gestureResetSecondsFrame);
 gestureResetSecondsFrame = null;
 gestureResetAnimation?.cancel();
 gestureResetAnimation = null;
}

function hideGestureResetCountdown() {
 gestureResetFeedback.removeAttribute('data-confirmation');
 gestureResetProgress.style.removeProperty('transform');
}

function clearGestureResetConfirmation() {
 cancelGestureResetAnimation();
 hideGestureResetCountdown();
 gestureResetHovered = false;
 gestureResetHelpPhase = 'status';
}

/**
 * @param {HTMLElement} element
 * @param {Keyframe[]} keyframes
 * @param {KeyframeAnimationOptions} options
 * @param {() => void} [onFinish]
 */
function animateGestureReset(element, keyframes, options, onFinish) {
 const animation = element.animate(keyframes, {...options,fill:'both'});
 gestureResetAnimation = animation;
 animation.onfinish = () => {
  if (gestureResetAnimation !== animation) return;
  cancelGestureResetAnimation();
  onFinish?.();
 };
 return animation;
}

/** @param {number} fromOpacity @param {number} toOpacity @param {() => void} [onFinish] */
function fadeGestureResetHelp(fromOpacity, toOpacity, onFinish) {
 if (fromOpacity === toOpacity || matchMedia('(prefers-reduced-motion: reduce)').matches) {
  onFinish?.();
  return;
 }
 animateGestureReset(
  gestureResetFeedback,
  [{opacity:fromOpacity},{opacity:toOpacity}],
  {duration:200,easing:'ease-out'},
  onFinish,
 );
}

function restoreGestureResetStatus() {
 hideGestureResetCountdown();
 gestureResetHelpPhase = 'status';
 fadeGestureResetHelp(0, 1);
 updateCameraGestureHint();
}

function finishGestureResetConfirmation() {
 gestureResetProgress.style.transform = 'scaleX(0)';
 fadeGestureResetHelp(1, 0, restoreGestureResetStatus);
}

/** @param {Animation} countdown */
function updateGestureResetSeconds(countdown) {
 if (gestureResetAnimation !== countdown) return;
 if (gestureResetSecondsFrame !== null) window.cancelAnimationFrame(gestureResetSecondsFrame);
 gestureResetSecondsFrame = null;
 const elapsed = Number(countdown.currentTime ?? 0);
 const remaining = Math.max(1, Math.ceil((gestureResetConfirmationDuration - elapsed) / 1000));
 const label = String(remaining);
 if (gestureResetSeconds.textContent !== label) gestureResetSeconds.textContent = label;
 if (remaining > 1 && (countdown.playState === 'running' || countdown.pending)) {
  gestureResetSecondsFrame = window.requestAnimationFrame(() => {
   gestureResetSecondsFrame = null;
   updateGestureResetSeconds(countdown);
  });
 }
}

/** @param {PointerEvent & {sourceCapabilities?: {firesTouchEvents?: boolean}|null}} event */
function updateGestureResetHover(event) {
 if (event.pointerType !== 'mouse' || event.sourceCapabilities?.firesTouchEvents) return;
 gestureResetHovered = event.type === 'pointerenter';
 const countdown = gestureResetAnimation;
 if (!countdown || !(countdown.effect instanceof KeyframeEffect) || countdown.effect.target !== gestureResetProgress) return;
 if (gestureResetHovered && countdown.playState === 'running') countdown.pause();
 if (!gestureResetHovered && countdown.playState === 'paused') countdown.play();
 updateGestureResetSeconds(countdown);
}

function holdGestureResetConfirmation() {
 gestureResetFeedback.dataset.confirmation = 'visible';
 const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
 const countdown = animateGestureReset(
  gestureResetProgress,
  [{transform:'scaleX(1)'},{transform:reduceMotion ? 'scaleX(1)' : 'scaleX(0)'}],
  {duration:gestureResetConfirmationDuration,easing:'linear'},
  finishGestureResetConfirmation,
 );
 if (gestureResetHovered) countdown.pause();
 updateGestureResetSeconds(countdown);
}

function showGestureResetConfirmation() {
 gestureResetHelpPhase = 'confirmation';
 gestureResetFeedback.dataset.confirmation = 'entering';
 gestureResetProgress.style.removeProperty('transform');
 gestureResetSeconds.textContent = String(gestureResetConfirmationDuration / 1000);
 updateCameraGestureHint();
 fadeGestureResetHelp(0, 1, holdGestureResetConfirmation);
}

gestureResetFeedback.addEventListener('pointerenter', updateGestureResetHover);
gestureResetFeedback.addEventListener('pointerleave', updateGestureResetHover);
gestureResetFeedback.addEventListener('pointercancel', updateGestureResetHover);

function updateCameraGestureHint() {
 const hint = el('gesture-hint');
 const automatic = gestureMode === 'auto';
 const hasLastInput = cameraGestureInput.hasInput();
 const touch = automatic ? cameraGestureInput.getInput() === 'touch' : gestureMode === 'touch';
 hint.textContent = cameraGestureHint(touch, language);
 hint.dataset.gestureInput = touch ? 'touch' : 'pointer';
 hint.dataset.gestureSource = automatic ? (hasLastInput ? 'last' : 'primary') : 'manual';
 hint.dataset.gestureMode = gestureMode;

 gestureResetButton.disabled = !automatic || !hasLastInput;
 activeGestureStatus.hidden = !automatic;
 let resetHelp = L('Mode manual. Pilih Otomatis untuk mereset.', 'Manual mode. Choose Automatic to reset.');
 if (automatic) {
  const inputName = touch ? L('Sentuh', 'Touch') : 'Mouse';
  const status = L('Input aktif · ', 'Active input · ') + inputName;
  const source = hasLastInput ? L('Input terakhir', 'Last input') : L('Input utama perangkat', 'Primary device input');
  if (activeGestureType.textContent !== status) activeGestureType.textContent = status;
  if (activeGestureSource.textContent !== source) activeGestureSource.textContent = source;
  resetHelp = hasLastInput
   ? L('Ikuti input terakhir atau input utama perangkat.', 'Follow the last input or the device’s primary input.')
   : L('Belum ada riwayat input.', 'No input history yet.');
 }
 const confirmation = L('Petunjuk kembali mengikuti input utama perangkat.', 'Camera hints now follow the device’s primary input.');
 if (gestureResetHelpSpace.textContent !== resetHelp) gestureResetHelpSpace.textContent = resetHelp;
 if (gestureResetConfirmationSpace.textContent !== confirmation) gestureResetConfirmationSpace.textContent = confirmation;
 // Keep the displayed text in place until its fade-out finishes.
 if (gestureResetHelpPhase === 'outgoing') return;
 const shownHelp = gestureResetHelpPhase === 'confirmation' ? confirmation : resetHelp;
 if (gestureResetHelp.textContent !== shownHelp) gestureResetHelp.textContent = shownHelp;
}
const cameraGestureInput = watchCameraGestureInput(window, cameraTouchInput, updateCameraGestureHint, gestureStorage);

function renderGestureMode() {
 gestureModeSelect.value = gestureMode;
 const notice = gestureModeSaved ? '' : L('Pilihan berlaku untuk sesi ini. Browser tidak dapat menyimpannya.', 'The choice applies to this session. The browser could not save it.');
 if (gestureInputNotice.textContent !== notice) gestureInputNotice.textContent = notice;
}
function translateGestureSettings() {
 el('gesture-settings-title').textContent = L('Petunjuk kamera', 'Camera hints');
 el('gesture-mode-label').textContent = L('Mode petunjuk kamera', 'Camera hint mode');
 el('gesture-mode-auto').textContent = L('Otomatis', 'Automatic');
 el('gesture-mode-touch').textContent = L('Sentuh', 'Touch');
 el('gesture-mode-mouse').textContent = L('Mouse', 'Mouse');
 gestureResetButton.textContent = L('Reset input terakhir', 'Reset last input');
 renderGestureMode();
}
gestureModeSelect.addEventListener('change', () => {
 gestureMode = parseGestureMode(gestureModeSelect.value);
 gestureModeSaved = gestureStorage !== null;
 try { gestureStorage?.setItem(gestureModeKey, gestureMode); }
 catch { gestureModeSaved = false; }
 updateCameraGestureHint();
 renderGestureMode();
});
window.addEventListener('storage', event => {
 if (!gestureStorage || event.storageArea !== gestureStorage || (event.key !== gestureModeKey && event.key !== null)) return;
 gestureMode = readGestureMode();
 gestureModeSaved = true;
 updateCameraGestureHint();
 renderGestureMode();
});
gestureResetButton.addEventListener('click', () => {
 if (gestureResetButton.disabled) return;
 const currentOpacity = Number(getComputedStyle(gestureResetFeedback).opacity);
 if (gestureResetFeedback.hasAttribute('data-confirmation')) {
  // Keep the outgoing line at its current width if a new reset interrupts it.
  gestureResetProgress.style.transform = getComputedStyle(gestureResetProgress).transform;
 }
 cancelGestureResetAnimation();
 gestureResetHelpPhase = 'outgoing';
 if (!cameraGestureInput.reset()) {
  clearGestureResetConfirmation();
  updateCameraGestureHint();
  gestureInputNotice.textContent = L('Petunjuk direset untuk sesi ini. Browser tidak dapat menghapus input tersimpan.', 'Hints reset for this session. The browser could not clear the saved input.');
  return;
 }
 renderGestureMode();
 fadeGestureResetHelp(currentOpacity, 0, showGestureResetConfirmation);
});
async function confirmPlacement(){if(!placement)return;const {item,mode}=placement,result=await act(()=>mode==='move'?session.move(item.id,item):session.build(item.kind,item),L('Tata letak farm tersimpan.','Farm layout saved.'));if(result?.ok){cancelPlacement();go(result.id||item.id);}}
function translate(){document.documentElement.lang=language;const strings=/** @type {Record<string,[string,string]>} */({'toolbar-title':['Kontrol','Controls'],'toolbar-day-label':['HARI','DAY'],'toolbar-coins-label':['KOIN','COINS'],'toolbar-expand-label':['Buka','Show'],'toolbar-collapse-label':['Tutup','Hide'],'edition':['FARM TROPIS INDONESIA','AN INDONESIAN TROPICAL FARM'],'view-subtitle':['Tumbuh dengan caramu sendiri.','Grow in your own way.'],'day-label':['HARI','DAY'],'coin-label':['KOIN','COINS'],'level-label':['LEVEL','LEVEL'],'beds-label':['BED AKTIF','ACTIVE BEDS'],'nav-overview':['Farm','Farm'],'nav-garden':['Kebun','Garden'],'nav-coop':['Ayam','Hens'],'nav-goat':['Kambing','Goats'],'nav-cow':['Sapi','Cows'],'nav-fish':['Ikan','Fish'],'nav-market':['Market','Market'],'nav-build':['Tata lahan','Arrange'],'camera-reset-label':['Reset kamera','Reset camera'],'camera-undo-label':['Undo reset','Undo reset'],'camera-redo-label':['Redo reset','Redo reset'],'clock-label':['WAKTU FARM','FARM TIME'],'advance':['+6 jam','+6 hours'],'advance-day':['+24 jam','+24 hours'],'build-title':['Tata farm sesukamu','Make this farm your own'],'build-help':['Pilih bangunan, atur posisi, lalu konfirmasi. Memindahkan fasilitas milikmu gratis.','Choose a building, set its position, then confirm. Moving your existing facilities is free.'],'placement-label':['ATUR POSISI','SET POSITION'],'placement-help':['Ketuk tanah atau ubah koordinat. Belum ada perubahan sampai dikonfirmasi.','Tap the ground or edit coordinates. Changes apply only after confirmation.'],'placement-cancel':['Batal','Cancel'],'placement-confirm':['Simpan posisi','Confirm position'],'data-title':['Progres & data','Progress & data'],'data-help':['Cadangan mencakup farm, tata letak, dan arsip progres lama. Simpan salinan teks di tempat aman.','Your backup includes farm progress, layout, and legacy archives. Keep a copy of the text somewhere safe.'],'save-text-label':['Salinan farm','Farm backup'],'export-data':['Tampilkan cadangan','Show backup'],'import-data':['Impor dari teks','Import from text'],'recover-data':['Pulihkan cadangan sebelumnya','Recover previous backup'],'legacy-data':['Tampilkan arsip farm lama','Show legacy farm archive']});for(const [id,pair]of Object.entries(strings))el(id).textContent=L(...pair);updateCameraShortcutHints();updateCameraGestureHint();translateGestureSettings();render();}
el('language').addEventListener('change',()=>{language=/** @type {HTMLSelectElement} */(el('language')).value==='en'?'en':'id';try{localStorage.setItem('myfarmtwin.locale',language);}catch{/* Optional preference. */}translate();});/** @type {HTMLSelectElement} */(el('language')).value=language;
el('quality').addEventListener('change',()=>world?.setQuality(/** @type {HTMLSelectElement} */(el('quality')).value));
for(const b of document.querySelectorAll('.destinations [data-view]'))b.addEventListener('click',()=>go(b.getAttribute('data-view')||'overview'));
/** @param {import('./cozy-camera-shortcuts.js').CameraHistoryAction} action */
function cameraHistoryAction(action){const redo=action==='redo-reset',view=redo?world?.redoCameraReset():world?.undoCameraReset();if(view){reflectCameraView(view);toast(redo?L('Reset kamera area ini diterapkan lagi.','This area’s camera reset has been reapplied.'):L('Kamera sebelum reset dipulihkan.','The camera before reset has been restored.'));return true;}toast(redo?L('Redo reset belum tersedia untuk area ini.','Redo reset is unavailable for this area.'):L('Undo reset belum tersedia untuk area ini.','Undo reset is unavailable for this area.'));return false;}
for(const b of document.querySelectorAll('[data-camera]'))b.addEventListener('click',()=>{const action=b.getAttribute('data-camera');if(action==='in')world?.zoom(.8);else if(action==='out')world?.zoom(1.25);else if(action==='left')world?.rotate(-Math.PI/8);else if(action==='right')world?.rotate(Math.PI/8);else if(action==='pan'){const pane=el('pan-tools');pane.hidden=!pane.hidden;b.setAttribute('aria-expanded',String(!pane.hidden));}else if(action==='redo-reset'||action==='undo-reset')cameraHistoryAction(action);else if(action==='reset'){if(world){reflectCameraView(world.resetCamera());toast(L('Kamera area ini kembali ke tampilan awal.','This area’s camera is back to its initial view.'));}}else if(action==='back'){reflectCameraView(world?.back()||'overview');}else go('overview');});
for(const b of document.querySelectorAll('[data-pan]'))b.addEventListener('click',()=>{const d=b.getAttribute('data-pan');world?.pan(d==='left'?-1:d==='right'?1:0,d==='up'?1:d==='down'?-1:0);});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&placement){cancelPlacement();return;}if(!e.ctrlKey&&!e.metaKey)return;const editing=e.composedPath().some(target=>target instanceof HTMLElement&&(target.isContentEditable||target.matches('input,textarea,select,[role="textbox"],[role="combobox"],[role="spinbutton"]')));handleCameraResetShortcut(e,{blocked:editing||!!placement||!!document.querySelector('dialog[open]')||document.designMode==='on',available:action=>!!(action==='undo-reset'?world?.canUndoCameraReset():world?.canRedoCameraReset()),run:cameraHistoryAction});});
el('build-open').addEventListener('click',openBuild);el('placement-cancel').addEventListener('click',cancelPlacement);el('placement-confirm').addEventListener('click',()=>{void confirmPlacement();});for(const id of ['place-x','place-z','place-rotation'])el(id).addEventListener('input',updatePlacement);
el('pause').addEventListener('click',()=>{running=!running;render();});el('advance').addEventListener('click',()=>{void act(()=>session.advance(6),L('Waktu maju 6 jam farm.','Advanced 6 farm hours.'));});el('advance-day').addEventListener('click',()=>{void act(()=>session.advance(24),L('Waktu maju 24 jam farm.','Advanced 24 farm hours.'));});
el('data-open').addEventListener('click',()=>{
 running=false;
 render();
 clearGestureResetConfirmation();
 updateCameraGestureHint();
 translateGestureSettings();
 dialog('data-dialog').showModal();
});
dialog('data-dialog').addEventListener('close',clearGestureResetConfirmation);
el('export-data').addEventListener('click',()=>{/** @type {HTMLTextAreaElement} */(el('save-text')).value=session.exportBundle();el('data-status').textContent=L('Cadangan siap. Salin teks secara manual untuk menyimpannya.','Backup ready. Copy this text manually to keep it.');});
el('legacy-data').addEventListener('click',()=>{/** @type {HTMLTextAreaElement} */(el('save-text')).value=session.exportLegacy();el('data-status').textContent=session.state.provenance.native?L('Arsip sebelum migrasi. Perkembangan farm baru tetap ada di cadangan lengkap.','Archive from before migration. New farm progress is in the full backup.'):L('Farm ini dimulai di versi baru; tidak mempunyai arsip lama.','This farm started in the new version and has no legacy archive.');});
el('save-text').addEventListener('input',()=>{importConfirmed=false;el('import-data').textContent=L('Impor dari teks','Import from text');});
el('import-data').addEventListener('click',async()=>{if(!importConfirmed){importConfirmed=true;el('import-data').textContent=L('Konfirmasi ganti farm','Confirm replace farm');el('data-status').textContent=L('Cadangan lama dipertahankan sebelum impor. Klik konfirmasi untuk mengganti farm.','Your previous backup is preserved before import. Confirm to replace this farm.');return;}const result=await act(()=>session.importBundle(/** @type {HTMLTextAreaElement} */(el('save-text')).value));el('data-status').textContent=result?.ok?L('Farm dipulihkan dari cadangan.','Farm restored from backup.'):explain(result?.error||'saveImportInvalid');importConfirmed=false;el('import-data').textContent=L('Impor dari teks','Import from text');if(result?.ok)go('overview');});
el('recover-data').addEventListener('click',async()=>{if(!recoverConfirmed){recoverConfirmed=true;el('recover-data').textContent=L('Konfirmasi pulihkan cadangan','Confirm recover backup');el('data-status').textContent=L('Progres saat ini diarsipkan sebelum pemulihan. Klik sekali lagi untuk melanjutkan.','Current progress is archived before recovery. Click again to continue.');return;}const result=await act(()=>session.recoverBackup());el('data-status').textContent=result?.ok?L('Cadangan sebelumnya dipulihkan.','Previous backup recovered.'):explain(result?.error||'backupMissing');if(result?.ok)go('overview');recoverConfirmed=false;el('recover-data').textContent=L('Pulihkan cadangan sebelumnya','Recover previous backup');});
el('retry').addEventListener('click',()=>location.reload());
window.addEventListener('storage',event=>{if([COZY_SAVE_KEY,SAVE_KEY,GLB_LAYOUT_KEY].includes(event.key||'')&&event.newValue!==event.oldValue){running=false;session.readOnly=true;session.status='saveConflict';toast(explain('saveConflict'));render();}});
const timer=window.setInterval(async()=>{if(disposed||!running||session.readOnly||busy||clockBusy||document.hidden)return;clockBusy=true;try{const result=await withSaveLock(()=>session.advance(1));if(!result.ok){running=false;toast(explain(result.error));}render();}finally{clockBusy=false;}},2000);
window.addEventListener('pagehide',()=>{
 disposed=true;
 cameraGestureInput.dispose();
 clearGestureResetConfirmation();
 window.clearInterval(timer);
 window.clearTimeout(toastTimer);
 world?.dispose();
},{once:true});
translate();
try{world=new CozyWorld(el('world'),{onCameraUndoChange:(/** @type {boolean} */available)=>el('camera-undo').toggleAttribute('disabled',!available),onCameraRedoChange:(/** @type {boolean} */available)=>el('camera-redo').toggleAttribute('disabled',!available),onSelect:(/** @type {string} */id)=>select(id),onCameraView:(/** @type {string} */id)=>reflectCameraView(id),onPlacement:(/** @type {{x:number,z:number}} */point)=>{if(placement){input('place-x').value=String(point.x);input('place-z').value=String(point.z);updatePlacement();}},onProgress:(/** @type {number} */ready,/** @type {number} */total)=>{const p=/** @type {HTMLProgressElement} */(el('load-progress'));p.max=total;p.value=ready;el('loading-detail').textContent=L('Menyiapkan kehidupan farm · ','Preparing farm life · ')+ready+'/'+total;}});world.renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();running=false;el('loading').hidden=false;el('loading-title').textContent=L('Tampilan perlu dimuat ulang','The view needs reloading');el('loading-detail').textContent=L('Progres tersimpan. Kamu tetap bisa menampilkan cadangan.','Your progress is saved. Backup export is still available.');el('retry').hidden=false;});await world.load();world.sync(session.state);if(selected!=='overview'){world.select(selected);world.focus(selected,false);}const restoredView=world.restoreCameraPreference();if(restoredView)reflectCameraView(restoredView);el('loading').hidden=true;el('world').setAttribute('aria-busy','false');document.body.dataset.cozyReady='true';el('camera-reset').removeAttribute('disabled');}
catch(error){el('loading-title').textContent=L('Farm belum bisa ditampilkan','The farm could not be displayed');el('loading-detail').textContent=L('Periksa koneksi dan dukungan WebGL 2, lalu coba lagi. Kontrol dan cadangan tetap tersedia.','Check your connection and WebGL 2 support, then retry. Farm controls and backups remain available.');el('retry').hidden=false;document.body.dataset.cozyReady='error';console.error('Farm view failed',error);}
