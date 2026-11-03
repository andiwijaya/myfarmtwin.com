# MYFARMTWIN.COM — CHICKEN FARM TYCOON
## Master PRD Ekspansi V1.0 | Living Checklist untuk Dot

**Tanggal:** 3 November 2026  
**Status:** READY FOR AUTONOMOUS HANDOFF — Chicken Farm belum diimplementasikan oleh dokumen ini  
**Produk:** MyFarmTwin.com / Play Farm  
**Repository:** `andiwijaya/myfarmtwin.com`, branch `main`  
**Target integrasi:** `https://myfarmtwin.com/play/` — bagian dari game yang sama, **bukan** game terpisah  
**Owner produk:** Product Owner MyFarmTwin  
**Orchestrator engineering:** Dot (mengelola Codex)  
**Dokumen sebelumnya:** `docs/PRD_MYFARMTWIN_MASTER_V1.md`  
**File living checklist baru yang diminta:** `docs/PRD_MYFARMTWIN_CHICKEN_FARM_V1.md`  
**Prinsip produk:** **Engineering is the engine. Gaming is the experience.**

> **INSTRUKSI UTAMA UNTUK DOT — 100% AUTONOMOUS.**
> Jalankan audit, coding, pengujian, debugging, penyelesaian masalah, regression, review UX, build, push, deployment, dan live testing secara mandiri. Tidak perlu meminta persetujuan rutin atau menyuruh Product Owner mengetes sendiri. Hubungi Product Owner **hanya** jika ada blocker sungguhan yang membutuhkan tindakan mereka (credential, 2FA, otorisasi, legal, atau konflik produk yang tidak dapat dipecahkan secara aman).
>
> **FUNCTIONALITY FIRST:** Kerjakan tepat satu micro-feature kecil hingga bekerja *end-to-end*, lulus pengujian terkait, baru pindah ke berikutnya. Update living checklist `[ ]` → `[x]` **setelah** bukti tes tersedia. Setelah tiap fitur, tulis laporan singkat: selesai, bukti tes, isu, berikutnya, dan progres **N/58 (%).** Jangan membuat fitur serentak besar, refactor tak perlu, atau QA artifacts yang membengkakkan repository.
>
> **PROTECT EXISTING:** Jangan mengubah/reset farm milik pemain, mata uang, inventori tanaman, mission, irigasi, riwayat, preferensi bahasa, struktur homepage satu-card, editorial pages, GA4, atau deployment yang sudah berjalan. Chicken Farm adalah **ekspansi additive**. Setiap keputusan yang berisiko menghancurkan save data lama harus dicegah di level kode serta tes.

---

## 0. Temuan baseline terverifikasi — 3 November 2026

Peninjauan repository melalui GitHub connector dilakukan saat menyusun PRD:

- `README.md`: **Play Farm V1 sudah diimplementasikan** dengan dua crop (selada dan tomat), Market, misi, irrigation pump, seeded weather, save/resume, export/import, dan engineering panel.
- `dist/play/index.html` terverifikasi ada. Game memakai engine deterministik dan UI DOM/SVG isometric menurut README; **jangan menyebutnya real-time WebGL/3D yang sudah ada** tanpa audit baru.
- `package.json` memiliki `build`, `test`, `lint`, `typecheck`, `e2e`, `compat`, `balance`, `endurance`, `performance`, `seo`, `security`, `integrity`, `homepage`.
- `docs/SIMULATION.md`: **1 tick = 1 jam game**, `Next Day` memproses 24 tick, waktu pausable, weather seeded, tanpa degradasi offline.
- `docs/SAVE_FORMAT.md`: envelope `format=MyFarmTwin`, `saveVersion=1`, engine state dan ledger tervalidasi; backup, quarantine, import/export, stale-tab protection tersedia.
- `docs/HOMEPAGE_INCREMENT.md`: homepage menampilkan **tepat satu live game card**, telah diklaim diuji/deploy oleh catatan project. Jangan menambah card Chicken Farm baru ke homepage; biarkan masuk melalui game yang sama.
- Tidak ditemukan fitur Chicken Farm lewat pencarian kode GitHub saat peninjauan. Dot tetap wajib mengaudit branch lokal, remote, live, dan kemungkinan pekerjaan baru yang belum dipush sebelum mengedit.

**Penting:** temuan di atas adalah hasil inspeksi **repo/dokumen proyek**, bukan jaminan bahwa deployment tetap identik ketika Dot mulai. Dot wajib mengonfirmasi deployment dan clean working tree.

---

## 1. Visi dan pengalaman pemain

**Chicken Farm Tycoon** adalah ekspansi **satu dunia pertanian hidup**. Pemain punya halaman kebun dan kandang ayam yang terhubung ke satu farm, satu kalender game, satu saldo Coins, satu Market dan satu save.

**Gameplay loop utama:**

**MISSION → BUILD COOP → CARE (FEED/WATER/CLEAN) → EGG PRODUCTION → COLLECT → SELL → EARN → UPGRADE → NEXT MISSION**

- **Play:** tap kandang, lihat ayam berjalan/memakan pakan, siramkan air minum dan kumpulkan telur.
- **Discover:** “Kenapa produksi telur turun?” karena air minum habis, pakan kurang, area kotor, cuaca panas, atau nesting capacity penuh.
- **Learn:** mengerti hubungan kesejahteraan ternak, pakan, air, suhu, kebersihan, kapasitas dan output.
- **Master:** perbaiki efisiensi, bangun kandang lebih baik, upgrade feeder/waterer, penuhi kontrak telur.
- Game harus **menyenangkan tanpa perlu belajar teknik peternakan terlebih dahulu**; Engineering Lab hanya opsional.

### Sasaran dan pembatasan rilis

**Rilis pertama wajib berisi:**
1. Area Chicken Yard yang visual, konsisten dengan farm existing, mudah dipilih di layar sentuh.
2. Satu kandang, dua ayam petelur **sudah dewasa** dan siap produksi.
3. Pakan, air minum, kebersihan, welfare dan produksi telur yang saling memengaruhi secara kausal.
4. Telur terlihat, bisa dikumpulkan ke inventori, lalu dijual lewat **Market existing** dan menambah Coins yang sama.
5. Misi, satu upgrade nyata, save/resume aman, EN/ID, game tetap dapat dimainkan di HP/laptop.
6. **Full tutorial-to-egg-sale-to-upgrade ≤ 3 menit target otomatis** untuk fresh session dengan kontrol `Next Day` yang jelas. Nilai ini adalah **target**, bukan hasil pengujian manusia yang sudah terjadi.
7. **Tanpa hukuman karena absen/offline**; pemain yang kembali lama kemudian melihat progress tersimpan utuh.

**Tidak masuk rilis pertama (non-goal):**
- Pembiakan, ayam jantan, penetasan, anak ayam sampai dewasa; ada roadmap V1.1 sesudah core loop stabil.
- Broiler/meat processing, penyembelihan, pertempuran hewan, penyakit fatal, ataupun kematian akibat tidak login.
- Farming MMO, akun/cloud save, multiplayer, NFT, real-money trading, subscription, pay-to-win.
- Kompleksitas agronomi profesional, 3D character rigging berat, rewrite engine menjadi Three.js/Rust/WASM tanpa justifikasi kinerja.
- Alur pesanan makanan yang membutuhkan halaman Kitchen; telur cukup menjadi produk Market terlebih dahulu.
- Penambahan card kedua di homepage; branding FarmGirl lama tetap tidak dikembalikan ke homepage.

### Hal yang harus dirasakan pengguna pada 3 menit pertama Chicken Farm

| Waktu target | Aksi pemain | Bukti visual/sistem |
|---|---|---|
| 0–30 detik | Pilih area **Chicken Yard** di game yang sama | Kandang, dua ayam, misi singkat dan indikator siap |
| 30–75 detik | Isi tempat pakan dan minum, lihat ayam beraktivitas | Animasi peck/drink; stok berubah dari state engine |
| 75–130 detik | Tekan **Next Day**, lihat telur muncul | RNG seeded dan syarat produksi diuji, maksimal 1 telur per ayam per game day |
| 130–170 detik | Tap sarang **Collect Eggs**, lalu **Sell at Market** | Telur pindah ke inventori; Coins/ledger bertambah tepat sekali |
| 170–180 detik | Lihat pilihan **Upgrade Coop/Feeder** | Upgrade dapat dipahami dan punya dampak nyata; tutorial tidak softlock |

**Pilihan desain onboarding:** `Chicken Yard` tersedia dari awal sebagai area **opsional**, bukan menggantikan tutorial crop. Saat pertama dibuka, pemain menerima **Starter Chicken Kit satu kali** (coop kecil + 2 layer hens + stok pakan di gudang) dengan reward namespace khusus, tanpa menyentuh modal crop awal. **Feeder dan drinker dibuat kosong agar dua tindakan tutorial bisa dilakukan; minum diisi lewat transfer dari farm tank existing**, bukan hadiah air tak terbatas. Jika tank existing kosong, recovery water existing harus dapat dipakai lebih dahulu tanpa softlock. Jaga agar misi crop dan chicken **tidak tampil bertabrakan**. Pengguna yang sudah punya save crop bisa masuk Chicken Yard tanpa reset.

---

## 2. UX/UI dan visual game

### 2.1 Komposisi dunia

- Tambah **Chicken Yard** sebagai bagian dari dunia farm, terpisah secara visual tetapi memakai **engine dan save yang sama**.
- Jika world existing sulit diperbesar tanpa mengganggu interaksi crop, gunakan **dua area/view** (`Field` dan `Chicken Yard`) dalam `/play/`, bukan dua permainan independen. Kamera/fokus boleh berpindah tanpa mengubah state.
- Rancang footprint awal: kandang kecil dengan pintu/ramp, halaman rumput berpagar, dua ayam petelur, feeder, drinker, nesting area. Fasilitas harus terlihat di view, tidak sekadar tombol UI.
- Gunakan gaya **stylized isometric/low-poly visual impression** yang serasi dengan renderer existing. Reuse pipeline DOM/SVG yang berjalan; WebGL hanya bila dibuktikan aman oleh benchmark dan tidak mengubah scope.
- Ayam punya perilaku ringan: idle, berjalan 2–4 titik sederhana, mematuk, minum, masuk/keluar kandang, animasi kecil ketika telur siap. Boleh sprite/shape/SVG asset buatan sendiri, tidak perlu skeleton/rigging mahal.
- Perilaku visual **turunan dari state**, bukan state produksi dihitung oleh animasi. Animasi nonaktif/reduced-motion tidak mengubah hasil simulasi.
- Pagar/ramp dan object footprint mengikuti grid, tidak menimpa 8 bed existing, tidak memunculkan collision/overlap yang menghalangi klik.
- Kontrol `Field / Chicken Yard` mudah dijangkau pada HP; area aksi punya target sentuh minimal 44×44 CSS px, `Reset View`, keyboard/focus support, accessible labels, no hover-only action.
- Jika performance turun, sediakan low-graphics fallback yang tetap memperlihatkan jenis aktivitas dan telur.

### 2.2 Kontrol kamera / view

- Jadikan pengalaman kontrol view seperti inspirasi dari MyZooTwin: pemain dapat **memutar (rotate), memperbesar/memperkecil (zoom), dan Reset View** untuk melihat dunia farm dan Chicken Yard. Ini adalah referensi pengalaman kontrol, bukan izin menyalin aset atau implementasi situs lain. Gunakan pendekatan yang sesuai renderer existing; jangan mensyaratkan rewrite 3D.
- Desktop: sediakan kontrol rotate kiri/kanan, zoom in/out, dan reset yang terlihat, berlabel dan bisa difokuskan dengan keyboard. Mouse wheel boleh membantu zoom saat pointer berada di area game tanpa menjebak scroll halaman; drag untuk rotate boleh sebagai shortcut yang jelas dan tidak menghalangi pemilihan objek.
- Mobile/touch: tombol rotate, zoom dan reset tetap tersedia dengan target minimal 44×44 CSS px; pinch-to-zoom dan drag boleh menjadi shortcut tambahan. Aksi tidak boleh bergantung pada gesture multipoint, hover, atau ketepatan gerakan; kontrol harus tetap terjangkau di portrait dan landscape.
- Tetapkan sudut default dan batas zoom minimum/maksimum agar farm tidak hilang dari view; Reset View mengembalikan orientasi, zoom dan posisi/fokus default area aktif. Hormati reduced motion dan hindari gerakan kamera berlebihan.
- Bedakan tap/klik pemilihan dari drag kamera dengan ambang gerakan yang wajar. Setelah rotate/zoom/reset, picking/hit testing harus selaras dengan posisi visual objek: crop beds, coop, feeder, drinker dan objek build tetap dapat dipilih/ditempatkan secara tepat; aksi build, pan serta interaksi existing tidak boleh tertimpa gesture kamera.
- Kamera adalah state presentasi, bukan aksi simulasi: perubahan view tidak memajukan clock atau mengubah crop, chicken, inventori, Coins, mission, RNG atau ledger. Pertahankan perilaku autosave, resume, import/export dan migrasi existing; preferensi view boleh disimpan secara aman hanya jika kompatibel, dan save lama tanpa preferensi memakai default. Reset View tidak pernah reset farm.

### 2.3 Homepage: satu card, promosi terintegrasi

- Pertahankan tepat **satu card game existing** yang menuju `/play/`. Saat Chicken Farm tersedia bagi pemain, perbarui keterangan/promotional copy pada card yang sama agar menyebut pengalaman crop dan Chicken Farm sebagai bagian satu farm/game. Jangan membuat card kedua atau menyiratkan Chicken Farm tersedia sebelum benar-benar dirilis.
- Tambahkan ilustrasi **cartoon** di beranda pada card game existing: kebun sayur, ayam, kambing, sapi, dan kolam ikan dalam satu komposisi farm yang ramah sebagai gambaran visi versi akhir. Gunakan karya orisinal atau aset berlisensi jelas, ringan dan responsif, dengan teks alternatif EN/ID yang bermakna. Kambing, sapi, dan kolam ikan adalah ilustrasi visi masa depan, bukan fitur yang sudah dapat dimainkan; beri penjelasan singkat yang jelas dalam EN/ID agar tidak menyesatkan. Jangan menambah mekanik kambing, sapi, atau ikan ke scope V1; implementasi tetap bertahap dengan Chicken Farm terlebih dahulu.
- Copy EN/ID mengikuti mekanisme lokalisasi existing; jaga link, editorial pages, GA4 dan fungsi card. Contoh arah copy (bukan klaim sebelum tersedia): “Grow crops and raise chickens in your farm” / “Tanam tanaman dan pelihara ayam di farm yang sama.”

### 2.4 UI ringkas, bukan spreadsheet

- Header/HUD existing tetap menampilkan `Day`, `Coins`, `Water`, `Inventory`, `Mission`, dan tombol waktu.
- Panel Chicken Yard ringkas: `Hens`, `Feed`, `Drink Water`, `Coop Cleanliness`, `Eggs Ready`, `Comfort` dan `Current Mission`. Gunakan label bahasa sehari-hari dan indikator mudah dipahami.
- Maksimal 2 langkah dari tap objek ke tindakan: `Tap coop → Feed / Refill Water / Clean / Collect`.
- **Why?/Kenapa?** memberikan penjelasan berbasis data: “Telur berkurang karena tempat minum kosong” atau “Kandang terlalu padat”.
- Engineering Lab opsional: feed consumed, water consumed, per-hen laying probability, welfare factors, nest utilization, egg quality, expense/revenue, dan history — semuanya berasal dari engine yang sama.
- Bilingual **Bahasa Indonesia / English**, preferensi mengikuti situs existing. Jangan menambah string hardcoded satu bahasa di logika, tooltip, empty state, error, atau konfirmasi.
- Audio belum wajib: jika nanti ditambahkan, mulai mute secara default, controls jelas, hindari autoplay.

---

## 3. Domain model & engineering: simulasi peternakan yang logis

Model harus **game-accurate secara kausal**, bukan memprediksi hasil peternakan nyata. Parameter pertumbuhan/produksi dan harga adalah **game balance**, ditandai jelas.

### 3.1 Resource dan entitas

**Reuse tanpa menggandakan:**
- `Coins` / ledger existing, `Day` / `logicalHour`, seed weather, `Inventory`, `Market`, `Mission`, `Pause/Speed/Next Day`, local save.

**Entitas baru yang diusulkan (nama pasti disesuaikan dengan codebase setelah audit):**
- `ChickenYardState`: `unlocked/visited`, list `coops`, `hens`, chicken inventory lots, chicken mission progress, grant IDs, event/history.
- `Coop`: stable unique ID, footprint, capacity, nest slots, feed stock (gram), drinker water (liter), cleanliness [0–100], upgrades, pending eggs, maintenance timestamps **jam game**.
- `Hen`: stable ID, display name optionally auto-generated, `adultLayer=true`, `layEventDay`, wellbeing state. Untuk V1 semua ayam awal **dewasa**.
- `EggLot`: stable ID, quantity integer, grade/quality, collection game day, source coop, idempotency ID.
- `ChickenAction`: `enter_yard`, `refill_feed`, `refill_water`, `clean_coop`, `collect_eggs`, `sell_eggs`, `buy_feed`, `upgrade_coop`, `buy_hen`, `upgrade_feeder`.

**Satu sumber kebenaran:** update state melalui command/tick headless existing → snapshot → renderer. Jangan mengubah saldo/stock langsung dari DOM. Gunakan config untuk harga, kapasitas, konsumsi dan thresholds. Semua perintah tervalidasi, deterministic dan idempotent terhadap replay.

### 3.2 Pakan, air dan higienitas

Gunakan fixed game ticks sama dengan crop (saat ini 1 tick ≈ 1 jam game) dan **tidak** membuat clock kedua:

- `feedConsumedG = activeHens × feedRateGPerHenPerDay × hourFraction × modifiers`
- `drinkerWaterConsumedL = activeHens × waterRateLPerHenPerDay × hourFraction × hotWeatherModifier`
- `feedStockNext = clamp(feedStock - feedConsumed, 0, feedCapacity)`
- `drinkerWaterNext = clamp(drinkerWater - drinkerWaterConsumed, 0, drinkerCapacity)`
- `cleanlinessNext = clamp(cleanliness - soilingRate × occupancy × hourFraction + cleaningEffect, 0,100)`
- Angka awal untuk **balancing**, bukan pedoman peternakan: feed rate **110 g/hen/game-day**, water rate **0,3 L/hen/game-day** (cuaca panas lebih besar). Satuan UI casual boleh persentase/bar, Engineering Lab wajib menyebut gram/liter per game day.
- **Tempat minum menggunakan air dari tandon utama crop melalui aksi refill**, bukan mencetak air gratis. Refill memindahkan volume `tank → drinker` dan menjaga conservation; tidak boleh ada saldo air negatif, biaya/reward ganda, atau overflow.
- Pakan dibeli dengan Coins melalui Market existing dan disimpan sebagai inventori supply atau stok gudang terdefinisi. Pengisian feeder hanya memindahkan stok, bukan menciptakan pakan.
- Cleaning action mengurangi `dirty`/menambah cleanliness dan bila ada biaya harus tercatat. Tidak bisa di-spam untuk mencetak reward/bonus.
- Coop capacity/nesting capacity dan ventilasi/naungan memperbaiki kenyamanan secara nyata. Overcrowding diblokir saat buy/upgrade, tidak diselesaikan dengan memelihara ayam melebihi kapasitas.

### 3.3 Welfare/comfort sebagai mesin sebab-akibat

`comfortScore`/`welfareScore` harus **derived**, bukan angka acak dekoratif:

`welfare = boundedWeighted(feedAdequacy, waterAdequacy, hygiene, spaceAdequacy, weatherShelter)`

Persentase factor/weight dikonfigurasi dan diuji dalam controlled scenarios:

- Pakan/air kurang → welfare turun bertahap → peluang bertelur dan kualitas telur menurun. Refill memulihkan setelah beberapa tick, bukan instan menghasilkan 100 telur.
- Kandang kotor → kualitas telur & welfare turun, tetapi ada recovery tanpa kehilangan ayam.
- Kandang sempit → pembelian ayam baru **ditolak** dengan alasan jelas; upgrade dahulu.
- Cuaca panas → kebutuhan air bertambah; shade/ventilation memberi manfaat.
- **Tidak ada ayam mati atau hilang karena idle/offline**; tidak menghukum pemain akibat libur atau tab tertutup. Welfare hanya disimulasikan saat game clock memang maju.
- Hindari denda, dramatization penyakit fatal, dan perilaku animal cruelty. Pemain diarahkan meningkatkan kesejahteraan ternak.

### 3.4 Produksi telur dan sarang

- Ayam **betina dewasa** dapat menghasilkan telur **tanpa ayam jantan**. **Rooster tidak perlu** dalam V1.
- Untuk setiap hen eligible, maksimum **1 telur per hen per in-game day**, dalam state machine yang dipicu tepat sekali di waktu game yang konsisten (misal pagi setiap day boundary); peluang ditentukan oleh umur/status adult, welfare, feed/water, nesting availability, seeded RNG, dan konfigurasi.
- Dua layer hens awal pada kondisi ideal menghasilkan telur cukup cepat agar tutorial bisa selesai dalam 1–2 game days (gunakan seed/skenario deterministik; **jangan** menjamin 2 telur setiap hari secara universal).
- Jangan gunakan telur pecahan/floating. Tidak ada random telur yang muncul ketika view dibuka, refresh, tab duplikat atau time advancement diulang.
- Nests punya kapasitas nyata. Bila egg storage penuh, produksi baru dibatasi/dijelaskan; telur tidak bertambah tanpa batas.
- `Collect` memindahkan eggs atomik dari nest → inventory lots. Double-click, race, reload atau replay tidak dapat menggandakan telur.
- `Egg grade` ditentukan kesejahteraan dan kebersihan saat produksi, bukan harga random tanpa hubungan sebab.
- Tier awal: **grade A/B/C** cukup; tidak ada kualitas biologis ekstrem atau kalkulasi penyakit.
- Animasi telur baru tampil jika `pendingEggs > 0`; collection selalu merefleksikan state engine.

### 3.5 Ekonomi terintegrasi

**Satu Market + satu saldo + satu ledger:** inventori crop dan egg harus berdampingan tanpa mengubah transaksi tanaman existing.

- `revenue = Σ soldEggCountByGrade × gradePrice` (integer Coins, tanpa float drift).
- Biaya pakan, ayam, upgrade dan servicing tercatat dengan transaction type baru (`feed_purchase`, `egg_sale`, `hen_purchase`, `coop_upgrade`, `care_cost`, dll.).
- Harga hanyalah angka **fictional game Coins**, bukan harga telur sebenarnya.
- Kualitas lebih baik bernilai lebih tinggi, tetapi jangan membuat supply basic menghasilkan kerugian permanen.
- Feed tidak boleh dibeli kalau Coins kurang, telur tidak boleh dijual dua kali, dan pembelian ayam tidak boleh melewati kapasitas.
- Initial grant kit harus **exactly once**, namespace `chicken.*`; tidak mengubah crop mission grants/ledger yang sudah ada.
- Balance: chicken menjadi cabang penghasilan baru yang menarik, bukan exploit tak terbatas yang menghancurkan ekonomi tanaman. Setiap sumber Coins memiliki biaya/pembatas produktif.

**Contoh konfigurasi awal untuk di-*tune* oleh Dot (NOT final):**

| Item | Nilai awal (game) | Catatan |
|---|---:|---|
| Starter coop | 1, capacity 4 hens | Diberikan 1 kali bersama 2 mature layer hens |
| Feeder kapasitas | 2.000 g | Kosong saat tutorial; Starter Kit memberi 2.000 g stok gudang |
| Waterer kapasitas | 6 L | Kosong saat tutorial; isi dari farm tank, tidak mencetak air |
| Nest capacity | 4 pending eggs | Configurable |
| Feed | ~110 g/hen/day | Game-scaled approx |
| Drink water | ~0,3 L/hen/day | Bertambah pada hot days |
| Normal laying probability | ~0,7–0,85 / adult hen/day | RNG seeded, ≤1 egg/hen/day |
| Egg grades price | A 6, B 4, C 3 Coins | Harga jual placeholder |
| Feed bag | 2.000 g / 24 Coins | Placeholder |
| Extra adult hen | 45 Coins | Harus ada capacity |
| Coop upgrade | 90 Coins | Harus tampak & mengubah kapasitas |
| Auto-feeder | 140 Coins | Baru setelah vertical slice stabil |

Dot **wajib** mengecek balance terhadap harga crop existing, pendapatan per 7/30/60 game days, pemakaian air gabungan, dan mencegah mission softlock. Jika berubah, tulis alasan dan test evidence.

### 3.6 Shared weather, water, time dan state

- **Weather tidak boleh memiliki dua RNG/forecast paralel**. Chicken welfare dan feed/water modifier menggunakan daily weather snapshot existing.
- **Next Day** memproses semua event secara berurutan untuk tanaman dan ayam, serta konsisten dengan clock yang berjalan biasa. No teleport production tanpa biaya care.
- **Pause** menghentikan kedua sistem, dan hidden tab tidak menyebabkan penyusutan stok/reward.
- **Save & reload** mengembalikan state persis, tanpa memproduksi telur ekstra pada deserialisasi.
- **Cross-area navigation** tidak mempercepat clock, tidak menghasilkan daily gift, dan tidak mengulang egg laying.

---

## 4. Misi / progression / return loop

### 4.1 Chapter 1 — My First Eggs (V1 critical path)

| Step | Objective | Tanda selesai | Reward |
|---|---|---|---|
| 1 | Open Chicken Yard | Area ter-render, coop/2 hens tampil | One-time starter kit (coop + hens + initial supplies) |
| 2 | Feed the hens | Feed stock tersedia, hens tampak makan | Mission progress, no repeatable Coins |
| 3 | Give fresh water | Water pindah dari shared tank → drinker | Mission progress |
| 4 | Care for coop | Cleaning/shelter state berfungsi | Mission progress |
| 5 | Get the first egg | Simulasi 1–2 game days ideal menghasilkan ≥1 egg | Egg-ready notification |
| 6 | Collect eggs | Nest berkurang, inventory bertambah | Unlock Market hint |
| 7 | Sell eggs | Inventory & ledger konsisten, Coins bertambah | Chapter completion reward once |
| 8 | Upgrade farm | Pemain membeli upgrade coop/feeder nyata | Next chicken chapter opens |

**Tidak boleh memerlukan real-day wait.** Jika first egg memerlukan 2 hari game, tutorial menyediakan `Next Day` existing dan menjelaskan konsekuensinya. Jika uang untuk upgrade belum cukup, pemain dapat melanjutkan jual telur/crops atau mendapatkan **non-exploitable** one-time mission grant yang di-balance.

### 4.2 Chapter lanjutan

- **Healthy Hens:** pertahankan welfare selama N game days dengan tindakan sesuai kebutuhan.
- **Egg Order:** penuhi pesanan telur pertama dengan jumlah/grade yang mungkin diproduksi.
- **Bigger Coop:** tambah kapasitas dan membeli hen ketiga (hanya jika mampu merawat).
- **Smart Chicken Farm:** pasang auto-feeder/waterer atau shade/ventilation dan buktikan penurunan pekerjaan/perbaikan output.
- **Farm Business:** gabungkan pendapatan tanaman dan telur untuk satu target farm-level; opsional setelah core stabil.

**Return without manipulation:** rangkuman comeback, misi terbuka, visual ayam hidup, milestone baru; tidak ada forced login streak, penalty offline, pengurangan welfare karena ditinggal, atau notifikasi menakut-nakuti.

---

## 5. Integrasi aman dengan proyek existing

### 5.1 Save format dan migrasi

- `saveVersion=1` existing harus bisa dibaca; **buat schema V2** setelah memastikan format/resolver aktual. Migrasi **v1 → v2** menambahkan chicken state default **tanpa mengubah nilai crop**. Dukungan pre-release v0 yang pernah ada harus lewat migration chain valid, bila masih relevan.
- Preserve secara exact: Coins, Day, seed/weather RNG, crop plots/quality/history, existing water, pump, crop orders, grants/rewards, ledger, inventory, expanded plots, localized preference dan revision semantics.
- Chicken starter grant terjadi **saat first entry**, bukan saat migration, sehingga tidak ada duplikasi ketika save diimpor atau game dibuka pada dua tab.
- Import/export, autosave, rolling backup, quarantine corrupt saves, stale-tab conflict, confirmed reset harus mencakup chicken state dan **tidak menghapus farm lama**.
- `future-saveVersion` ditolak dengan pesan jelas dan storage original diamankan. Setelah Chicken V2 dirilis, rollback code V1 tidak dapat membaca V2; rencanakan rollback tanpa overwriting user V2 saves, dokumentasikan recovery/redeploy path.
- Max save payload, unique ids, finite numbers, stock bounds, format validations dan prototype-pollution rejection harus diperbarui.
- Boleh migrasi hanya setelah otomatis memverifikasi contoh save V1 existing dan fitur crop replay menunjukkan hasil identik. **Never reset as migration shortcut.**

### 5.2 Architecture contracts

- Gunakan code style, deterministic command/revision semantics, browser storage, test harness dan local tools existing.
- No new backend, database, login, cloud sync, LLM/API call runtime. Prefer reusable game modules instead of a second engine.
- Jangan menambah dependency besar, *unless* benchmark dan kebutuhan fungsional membuktikan manfaatnya.
- Keep deploy output confined to `dist/play/` + perubahan kecil yang perlu, tanpa wipe `dist/`, tanpa menimpa existing editorial pages.
- Homepage tetap **tepat satu live game card** → `/play/`. Saat Chicken Farm tersedia, perbarui copy promosi card tersebut untuk menyebut crop dan Chicken Farm; jangan tambah card terpisah.
- Semua media buatan sendiri atau berlisensi jelas; **jangan menyalin gambar referensi/asset komersial tanpa hak**.
- Jangan menyentuh Cloudflare/DNS/GitHub Actions/hosting security settings tanpa kebutuhan terverifikasi; gunakan local test/build, lalu push/deploy dengan pipeline existing.

---

## 6. Master Micro-feature Checklist — 58 item

**Status awal: 0/58 (0%).** Dot harus audit actual source dan tidak otomatis menganggap satu item selesai hanya karena ada sebagian fitur serupa. Satu kotak `[x]` harus berarti kode + tes + bukti verifikasi.

### M0 — Audit, branch safety dan acceptance baseline (6)

- [x] **M0-F01** — Audit live/remote/local branch; catat commit, perubahan uncommitted, deployment, baseline save dan cara rollback. Jangan menimpa pekerjaan lain.
- [x] **M0-F02** — Petakan engine tick/commands, renderer world, Market, Inventory, ledger, missions dan save validator agar Chicken memakai core yang sama.
- [x] **M0-F03** — Jalankan semua baseline checks existing (`lint`, `typecheck`, `test`, `build`, `e2e`, dll. yang tersedia); dokumentasikan failures existing vs regresi.
- [x] **M0-F04** — Buat checkpoint/working branch aman dan fixtures sanitasi `saveVersion=1`; catat hash/config terkait data pengguna tanpa menyalin data asli pribadi.
- [x] **M0-F05** — Putuskan layout area Chicken Yard dan visual low-cost yang konsisten; siapkan asset inventory/licensing dan uji dukungan mobile.
- [x] **M0-F06** — Tambahkan dokumen PRD ini ke `docs/`, kontrak state/API awal, test IDs, feature flag internal dan cara mematikan fitur tanpa menghapus save.

**M0 gate:** branch aman, baseline jelas, tidak ada perubahan produksi, migrasi/rollback dipetakan.

### M1 — Chicken Yard dan interaksi visual (8)

- [x] **M1-F01** — Tambahkan entry `Chicken Yard` pada Play Farm, tanpa mengganggu crop mission/tutorial; accessible touch/keyboard.
- [x] **M1-F02** — Render satu area halaman kandang/fence/ramp tanpa overlap grid crop; world navigation/focus terkontrol.
- [x] **M1-F03** — Tambahkan visual kandang dengan status pintu dan sarang (empty/egg-ready), mengikuti state.
- [x] **M1-F04** — Render dua ayam dewasa dengan idle/walk/peck animasi ringan; reduced-motion fallback yang setara secara fungsional.
- [x] **M1-F05** — Tambahkan feeder, drinker, dan titik cleanup yang bisa dipilih; fokus/label konsisten.
- [x] **M1-F06** — Bangun panel tindakan kontekstual `Feed`, `Water`, `Clean`, `Collect Eggs` dengan state disabled + alasan yang benar.
- [x] **M1-F07** — Implement dan uji view Chicken ↔ Field, rotate, zoom, pan dan Reset View sesuai §2.2 pada desktop, keyboard dan touch mobile <=390px/landscape; picking dan build crop/Chicken tetap akurat, save aman.
- [x] **M1-F08** — Localize seluruh alur Chicken (EN/ID), fallback bahasa, screen reader labels, helpful empty states.

**M1 gate:** area dapat dibuka & ditutup, ayam/objek terlihat, tombol bisa dipilih; belum boleh mengklaim produksi telur berjalan.

### M2 — Headless care & deterministic egg simulation (10)

- [x] **M2-F01** — Definisikan `ChickenYard/Coop/Hen/EggLot` config dan types/invariants; stable IDs tanpa bentrok dengan crop.
- [x] **M2-F02** — Implement command factory/validator Chicken memakai revision + idempotency engine existing, tidak mutate DOM sebagai source.
- [x] **M2-F03** — Implement kapasitas & stok pakan (g), purchase-to-store dan transfer-to-feeder; tidak boleh feed negatif/duplikasi.
- [ ] **M2-F04** — Implement drinker (L) dan refill yang mengurangi farm tank dalam jumlah sama; water conservation.
- [ ] **M2-F05** — Implement tick consumption pakan/air per hen, dengan weather multiplier dari weather existing, seeded test.
- [ ] **M2-F06** — Implement `cleanliness`, aksi cleaning, biaya/aturan interval yang teruji; tidak ada reward-farming lewat spam.
- [ ] **M2-F07** — Implement comfort/welfare derived score berbasis faktor real dan recovery bertahap; no offline depletion/death.
- [ ] **M2-F08** — Implement per-hen per-day egg laying (seeded deterministic, max satu telur per adult hen/day) dan grade berdasarkan state; no rooster required.
- [ ] **M2-F09** — Implement nest capacity, pending eggs, atomic collection ke inventory, visual egg-ready; double tap/reload aman.
- [ ] **M2-F10** — Headless controlled comparisons: ideal vs thirsty vs underfed vs dirty vs overcrowded/hot weather; assert causal ordering dan semua bounds.

**M2 gate:** care mengubah output, eggs muncul karena tick/conditions, stok dan hasil tidak bisa dimanipulasi lewat render/reload.

### M3 — Full gameplay vertical slice, mission & economy (9)

- [ ] **M3-F01** — One-time starter kit (coop + 2 mature hens + supplies) saat first entry yang idempotent; preserves existing Coins/crop state.
- [ ] **M3-F02** — Misi Chapter 1 bersama FarmGirl, satu objective aktif, progress terhubung state/actions, tidak mengganggu crop guide.
- [ ] **M3-F03** — Integrasikan pembelian feed bag ke Market existing; saldo Coins/ledger dan inventory supply atomik.
- [ ] **M3-F04** — Integrasikan telur grades A/B/C ke inventory/Market, harga config dan transaksi `egg_sale` tepat satu kali.
- [ ] **M3-F05** — Implement tutorial `Feed → Water → Care → Next Day → Collect → Sell` dengan feedback singkat dan tidak softlock.
- [ ] **M3-F06** — Chapter 1 completion reward exactly-once; mission IDs namespace Chicken, tidak memicu reward crop berulang.
- [ ] **M3-F07** — Tambahkan satu **coop upgrade nyata** (capacity atau efisiensi) dengan perubahan world + engine dan harga wajar.
- [ ] **M3-F08** — Emergency/recovery route jika pemain kehabisan Coins/feed/water; tidak mencetak keuntungan gratis berulang.
- [ ] **M3-F09** — **VERTICAL-SLICE GATE:** browser desktop dan touch mobile menyelesaikan first entry → feed → water → egg → collect → sell → upgrade dalam target automation 180 detik; saldo/inventory exact; crop loop baseline tetap lulus.

**M3 gate:** game Chicken sudah playable end-to-end dalam satu sesi. **JANGAN** lanjut penambahan fitur kalau M3-F09 gagal. Namun **BELUM** boleh rilis sebelum persistence M4.

### M4 — Save V2, migration & recovery (7)

- [ ] **M4-F01** — Tambahkan schema V2 dengan Chicken state lengkap, history/events/mission/grants, invariant validasi dan batas size.
- [ ] **M4-F02** — Migrasi fixture V1→V2 tanpa mengubah crop state/ledger/Coins/RNG secara semantik; exact crop replay comparison.
- [ ] **M4-F03** — Pastikan legacy migration chain yang didukung tidak rusak; explicit future-version rejection dan rollback data policy.
- [ ] **M4-F04** — Autosave/reload/resume: egg day boundary tidak menghasilkan extra eggs, grants tidak berulang, UI world cocok snapshot.
- [ ] **M4-F05** — Export/import save, cancel/invalid import, confirmed reset, backup & corrupt quarantine mencakup Chicken state.
- [ ] **M4-F06** — Two-tabs/stale revisions, paused/hidden tab, `Next Day` vs regular ticks, system clock changes, storage blocked/quota errors: fail safely.
- [ ] **M4-F07** — Endurance 30+ game days mixed farm: crop+chicken+shared water+economy, save roundtrips each day, zero negative/duplicate.

**M4 release-critical gate:** aman bagi pemain yang sudah punya farm; exact resume, import/export, backup and concurrency valid. **M0–M4 = MVP release gate.**

### M5 — Progression, automation, economy balance & Engineering Lab (8)

- [ ] **M5-F01** — Unlock upgrade kandang kapasitas dari config, terlihat di world, buy atomic, tidak boleh melebihi grid/capacity.
- [ ] **M5-F02** — Pembelian ayam petelur ketiga (adult hen) dengan capacity/Coins checks dan unique IDs; no cloning dupe.
- [ ] **M5-F03** — Auto-feeder upgrade opsional dengan refill dari stok yang sudah dibeli, bukan pakan gratis; ada on/off dan biaya relevan.
- [ ] **M5-F04** — Waterer upgrade atau shade/ventilation yang memberi trade-off nyata pada kebutuhan air/welfare (pilih satu lebih dahulu sesuai minimal diff).
- [ ] **M5-F05** — Market egg order pertama dengan target yang achievable, expiry non-punitive, reward exactly once.
- [ ] **M5-F06** — Missions Healthy Hens dan Bigger Coop; progress memberi tujuan tanpa forced daily login.
- [ ] **M5-F07** — Engineering Lab Chicken `Why?` menampilkan faktor dan angka nyata (feed/water, comfort, grade, egg rate history, biaya vs revenue).
- [ ] **M5-F08** — Simulation balance 7/30/60/90 game days; bandingkan crop-only/chicken-only/mixed-farm, ideal/neglected/hot; cek tidak ada exploit dan target growth reasonable.

**M5 gate:** ekspansi memberi strategi baru, bukan idle money printer atau pekerjaan klik berulang yang melelahkan.

### M6 — Production quality, security & release (10)

- [ ] **M6-F01** — Full **black-box** regression desktop/touch mobile: whole Chicken loop, cross-area crop loop, stockout, upgrades, mission, commerce.
- [ ] **M6-F02** — Full **white-box** engine tests: invariants, seeded RNG, clock consistency, welfare causes, feed-water conservation, exact ledger, action idempotency.
- [ ] **M6-F03** — **Dead-code / dependency audit:** remove only confirmed unused new code/assets, preserve working legacy and original media; no QA artifacts in Git.
- [ ] **M6-F04** — Save security: malicious import/unknown fields/prototype keys, corrupt/quarantine, stale tab, future schema, no destructive reset.
- [ ] **M6-F05** — Cross-browser/cross-locale regression EN/ID, Chromium + Firefox if runners available, keyboard/ARIA/reduced-motion/accessible touch targets.
- [ ] **M6-F06** — Visual review 320/360/390/768/1024/1440 widths plus landscape; no clipped coop, offscreen buttons, horizontal overflow, tiny tap targets.
- [ ] **M6-F07** — Performance test normal + low-graphics / slow-device emulation: no runaway animation/timers, bounded DOM/SVG updates, memory/save payload acceptable.
- [ ] **M6-F08** — Pre-release preservation check: homepage exactly one game card dengan ilustrasi cartoon kebun sayur, ayam, kambing, sapi, kolam ikan dan penjelasan EN/ID bahwa kambing, sapi, dan kolam ikan adalah visi masa depan, bukan fitur playable saat ini; copy EN/ID crop + Chicken Farm setelah tersedia, editorial routes/metadata, GA4, original assets, crop save/market/test output preserved.
- [ ] **M6-F09** — Local build/test → reviewed git diff → **push/deploy with existing verified pipeline**, then **live production smoke/regression** desktop & mobile; rollback on true regression. Never force-push.
- [ ] **M6-F10** — Publish final evidence report (commit, deployment ID if available, exact URLs, QA matrix, release/rollback, remaining known issues) and mark checklist complete only if proven.

**M6 gate:** release-ready, tested live, not just “build succeeded”.

**Checklist progress formula:** `completed_checked_items / 58 × 100`. Tulis milestone, item ID, test command, result, screenshot/log path (di luar Git), fix, dan next feature setelah setiap micro-feature.

---

## 7. Test scenarios yang WAJIB otomatis

### 7.1 Black-box journey

1. New player membuka `/play/`, memilih Chicken Yard, melihat dua mature hens, tutorial tanpa reset tutorial crop.
2. Feed dan water mengubah stok/animasi, `Next Day` membuat egg secara kausal, `Collect` menghasilkan inventory, sale menambah Coins sekali, upgrade tampil.
3. Pemain lama dengan **V1 crop save** membuka Chicken Yard dan memperoleh kit tepat sekali; tanaman, pump, saldo, mission, ledger lama tetap sama sebelum tindakan pemain.
4. Farm dengan crop & chicken berpindah area berulang, reload, close/reopen, EN↔ID, lalu export/import → hasil identik.
5. Tidak cukup Coins, feed habis, drinker kosong, nest penuh, coop penuh → pesan jelas dan tidak softlock; recovery bisa dilakukan.
6. Double-click Collect/Sell/Purchase/Reward, tab paralel, browser back/forward, retry/replay, lama tidak aktif → tidak ada egg/Coins/hen duplication.
7. Mobile touch 390×844, layar 320 px, reduced motion, low graphics, keyboard navigation, rotate/zoom/reset via tombol dan shortcut yang didukung → semua aksi kritis bisa dilakukan; tap vs drag tidak tertukar dan scroll halaman tetap bisa digunakan.
8. Existing lettuce/tomato farming, irrigation, market orders, crop missions, 8 beds, storage tools dan homepage single card **tetap berfungsi**. Saat Chicken Farm tersedia, card yang sama menyebut crop dan Chicken Farm dalam EN/ID serta tetap menuju /play/. Ilustrasi cartoon menampilkan kebun sayur, ayam, kambing, sapi dan kolam ikan sebagai visi akhir, responsif dan punya alt text; penjelasan EN/ID tidak menyiratkan kambing, sapi, atau kolam ikan sudah playable.
9. Pada orientasi dan zoom berbeda, pilih crop bed dan objek Chicken serta lakukan build/place; hit target sesuai visual. Reset mengembalikan view default area aktif tanpa mengubah farm. Bandingkan state simulasi sebelum/sesudah kontrol kamera, lalu reload dan import save lama untuk memastikan data dan perilaku save tetap aman.

### 7.2 White-box / causal comparisons

| Skenario identik kecuali satu faktor | Ekspektasi |
|---|---|
| Fed+watered vs no feed | Fed punya welfare dan egg output/quality >= unfed pada simulasi multi-day seeded |
| Adequate water vs empty drinker | Adequate lebih baik; chicken water stock dan shared tank conserve |
| Clean vs dirty coop | Clean tidak lebih buruk untuk welfare/egg grade |
| Shelter/shade in hot weather vs no shade | Upgrade mempunyai pengaruh terukur dan repeatable |
| Same seed + same commands | Engine menghasilkan state/ledger/eggs exact sama |
| 24 hourly ticks vs Next Day | State sama pada aksi/seed/weather yang sebanding |
| Reload after laying, Collect double action | Tidak memproduksi/mengumpulkan dua kali |
| Full coop + Buy Hen | Ditolak, Coins tidak berkurang |
| Egg sale + replay | 1 sale & 1 ledger event, no negative inventory |
| Inactive tab/elapsed wall-clock | Tidak ada deplesi pakan, welfare, egg production, atau Coins |

**Tidak cukup** menguji visual saja. Logika harga, unit, stok, telur, serta keputusan welfare harus punya unit/invariant tests dan balance scenario.

### 7.3 Nonfunctional gates

- Zero uncaught JavaScript errors pada core scenarios; no invasive third-party calls from game.
- Tidak ada active timer ketika paused/hidden yang mengubah game world.
- Accessible buttons memakai label dan focus state; target sentuh ≥44 CSS px.
- Tidak menambahkan ads/in-app purchase/paywall; no LLM inference/network runtime.
- Tidak menambahkan file media besar tanpa compression/license check.
- Simpan evidence QA di folder lokal yang **diabaikan Git**. Pertahankan media existing dan source.
- GitHub Actions tidak digunakan untuk routine QA; local test/build dan final push saja.
- Live checks adalah **verification sesudah benar-benar deploy**, bukan klaim hanya berdasarkan localhost.

---

## 8. Acceptance criteria / Definition of Done

Chicken Farm V1 hanya boleh dinyatakan selesai jika SEMUA berikut terbukti:

- [ ] Core Chicken mission (feed → water → care → egg → collect → sell → upgrade) berjalan tanpa manual patch di tengah.
- [ ] Ayam memiliki visual yang hidup; hasil egg didorong *sim engine*, bukan timer animasi.
- [ ] Ekonomi telur memakai Coins dan Market yang sama dengan crop tanpa negatif/double revenue.
- [ ] Shared farm water, weather, time, pause & save tetap konsisten lintas crop + chicken.
- [ ] V1 saves termigrasi ke V2 tanpa kehilangan progress; backup/import/export/reload dan stale tabs lolos.
- [ ] Semua risiko softlock awal punya recovery yang tidak bisa di-exploit.
- [ ] Desktop & mobile touch + EN/ID dapat dimainkan; rotate/zoom/reset accessible, picking/build tetap tepat, dan kontrol view tidak mengubah state farm; engineering details optional.
- [ ] Tidak ada kehilangan data/fitur lama, tidak ada penambahan homepage card kedua; saat Chicken Farm tersedia, copy card existing menyebut crop dan Chicken Farm dalam EN/ID.
- [ ] Semua 58 micro-feature checklist `[x]` dengan evidence; live testing produksi lulus.
- [ ] Final report berisi current %, commit, deployment & rollback details, dan known limitations.

**Catatan:** daftar DoD tambahan ini bukan bagian dari pembagi progress 58 micro-feature; DoD adalah **release gate gabungan**.

---

## 9. Roadmap sesudah V1 (bukan bagian checklist, jangan menghalangi deploy)

**V1.1 — Hatch & Raise Chicks (separate PRD):**
- Player baru bisa memelihara anak ayam setelah sistem hens/eggs berfungsi baik.
- Pilih jalur **membeli anak ayam** atau **pembiakan** melalui fitur rooster/fertilized eggs/incubator yang benar secara kausal.
- **Telur konsumsi biasa tidak tiba-tiba menetas**. Hens menghasilkan telur tanpa rooster, tetapi fertilized egg + inkubasi diperlukan untuk breeding.
- Stages `chick → pullet → adult layer`, feed/water/housing requirements berbeda dan waktu game dipercepat dengan label educational approximation; capacity harus cukup.
- Hindari loop breeding tak terbatas dan moral hazard. Fase ini baru ditulis menjadi PRD setelah data performa/QA V1 baik.

**V1.2 — Farm Ecosystem Integration:**
- Kompos kandang membantu tanah/ tanaman via conversion process dan keterbatasan jumlah, bukan magic free fertilizer.
- Pertanian crop menghasilkan sebagian bahan baku pakan lewat proses/cost yang wajar; jangan menyederhanakan semua sayuran menjadi layer feed seimbang.
- Egg packing/quality contracts, storage, worker automation, dan supply chain quests.
- Data-driven AI Apprentice (skills/rules, tanpa training LLM) **hanya jika** benar-benar memberi manfaat produk; bukan dependency MVP.

---

## 10. Riset domain dan ketepatan fakta

Sumber edukasi untuk Dot saat menentukan model gameplay; jangan copy teks/visual berhak cipta ke game:

1. University of Minnesota Extension — `https://extension.umn.edu/agriculture/animals-and-livestock/poultry/raising-chickens-for-eggs`  
   Feed dan clean water, kebutuhan kandang/sarang, produksi telur dan pengaruh cuaca/cahaya.
2. University of Florida IFAS — `https://ask.ifas.ufl.edu/publication/an239`  
   Hens tidak memerlukan rooster untuk menghasilkan **telur konsumsi**; rooster diperlukan untuk fertile eggs yang bisa menghasilkan chicks.
3. UK Government — `https://www.gov.uk/government/publications/poultry-on-farm-welfare/poultry-welfare-recommendations`  
   Kesejahteraan ayam: ventilasi, suhu, kebersihan litter, kualitas air dan interaksi dengan output.

**Disclaimer wajib di Engineering Lab:** angka konsumsi, output harian, peluang telur, harga, dan durasi adalah penyederhanaan untuk game/edukasi, **bukan** rekomendasi operasional atau diagnosis kesehatan ternak sesungguhnya.

---

## 11. Instruksi operasional Dot & format laporan

Dot harus mematuhi prosedur berikut:

1. Verifikasi dahulu state lokal/remote/live yang nyata; jangan mengasumsikan PRD sebelumnya belum dikerjakan. Prioritaskan menjaga perubahan pengguna/pekerjaan lain yang belum selesai.
2. Buat dokumen ini pada path repo baru (tanpa menimpa Master PRD original). Simpan checklist sebagai living document; update setelah setiap micro-feature.
3. Jalankan micro-feature M0-F01 → M6-F10 secara berurutan, dengan test minimal tiap fitur dan regression relevan setelah perubahan; akhir milestone wajib melewati gate.
4. **M3-F09 + M4-F07 adalah dua milestone paling kritis:** gameplay betul-betul selesai dan save migrasi aman. Jika salah satu gagal, perbaiki sebelum fitur ekspansi.
5. Jangan mengganti engine/renderer, merombak homepage, atau memasukkan breeding hanya karena terlihat menarik; semuanya di luar scope rilis pertama.
6. Jalankan lint, typecheck, unit, e2e, balance, endurance, cross-browser, security, performance, SEO, homepage dan integrity sesuai tool yang tersedia setelah perubahan. Test lokal; hanya rilis setelah gates lulus.
7. Deploy setelah release gate, lakukan live testing dengan isolated browser profiles supaya tidak menyentuh user saves. Segera rollback jika produksi rusak, dan catat evidence.
8. Kirim laporan ringkas tiap item, **tanpa menunggu approval**. Eskalasi hanya blocker sebenarnya. Jangan memberikan deadline/ETA yang belum pasti.

**Template status pendek:**

```text
MyFarmTwin Chicken Farm — [M?-F??]
Status: DONE / BLOCKED
Checklist: N/58 = XX%
Scope: [...]
Tests: [command] → PASS/FAIL
Evidence: [local path/report]
Regression: [...]
Issue/fix: [...]
Next: M?-F??
Deployment: not yet / commit + URL + live test result
```

**Final success criterion:** pemain membuka MyFarmTwin, melihat ayamnya bergerak, memberi makan, merawat, mendapatkan telur, menjualnya, dan membesarkan peternakan sambil secara alami memahami *mengapa* tingkat produksi naik atau turun. **Fun first, meaningful engineering underneath, no regressions.**
