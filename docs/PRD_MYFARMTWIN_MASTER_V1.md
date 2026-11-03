# MASTER PRD — MyFarmTwin.com: Farm Life Simulation Tycoon

**Versi:** 1.0 — 3 November 2026  
**Status:** READY FOR DOT HANDOFF — belum diimplementasikan  
**Product Owner:** Pemilik MyFarmTwin.com  
**Engineering Orchestrator:** Dot + Codex  
**Repo remote terverifikasi:** [`andiwijaya/myfarmtwin.com`](https://github.com/andiwijaya/myfarmtwin.com), branch `main`  
**Target:** `https://myfarmtwin.com/play/` (rute baru, belum ada dalam pemeriksaan repo)  
**Prinsip:** **Engineering is the engine. Gaming is the experience.**

> **MANDAT DOT — 100% AUTONOMOUS.** Kerjakan seluruh PRD end-to-end secara mandiri: audit, keputusan teknis rutin, implementasi, black-box/white-box/regression/dead-code testing, debugging, verifikasi browser desktop/mobile, release, dan pembaruan checklist. Jangan meminta Product Owner melakukan tes manual, approval per fitur, atau memilih detail teknis biasa. Hubungi hanya untuk blocker nyata yang tidak bisa diselesaikan aman (credential, 2FA, otorisasi, konflik keputusan produk yang benar-benar tidak dapat direkonsiliasi). Jalankan **satu micro-feature selesai dan teruji sebelum berikutnya**.

---

## 1. Ringkasan produk dan visi

MyFarmTwin menjadi **game simulasi pertanian berbasis browser** yang menyenangkan dalam 3 menit pertama, tetapi memiliki mesin simulasi pertanian yang konsisten. Pemain mengelola kebun kecil menjadi farm yang produktif dan modern lewat siklus:

**MISSION → BUILD → PLANT → CARE → HARVEST → SELL → EARN → UPGRADE → NEW MISSION**

Pemain harus *bermain dulu*, menemukan masalah, memahami sebab-akibat, lalu secara opsional mendalami parameter engineering: **Play → Discover → Learn → Master**. Bukan simulator engineering kering dengan skin game, dan bukan game cantik dengan angka acak tanpa model kausal.

**Nilai unik:** keputusan pemain atas air, cuaca, tanaman, waktu, biaya, dan fasilitas mengubah pertumbuhan, hasil panen, kualitas, pendapatan, serta kapasitas ekspansi. Setiap konsekuensi bisa dipahami melalui visual dan penjelasan sederhana.

### Sasaran V1

- Satu dunia farm **stylized low-poly 3D/isometric** yang hidup; kontrol touch dan mouse intuitif.
- Satu **vertical slice utuh**, dari misi pertama sampai jual hasil panen, memperoleh uang, dan melakukan upgrade, lengkap dengan save/resume.
- FarmGirl sebagai **pemandu**, menggunakan aset/identitas brand existing secara aman; animasi karakter 3D kompleks **bukan syarat V1**.
- Simulasi air–tanaman–cuaca sederhana, bisa direproduksi, **menentukan gameplay**, bukan dekorasi.
- Bilingual **Bahasa Indonesia dan English**, dengan mempertahankan pengalaman situs existing yang berbahasa Inggris.
- Tetap ringan, tanpa login, backend, multiplayer, pembayaran, atau LLM inference pada runtime V1.

### Bukan sasaran V1

Open-world besar, multiplayer, server persistence, AI NPC yang menggunakan LLM, real-money economy, NFT, iklan reward paksa, 20+ spesies tanaman, peternakan penuh, pabrik pengolahan, GIS/IoT realtime, simulasi agronomi tingkat profesional, Rust/WASM tanpa bukti kebutuhan performa. Semua ini **dilarang menjadi blocker** untuk vertical slice pertama.

---

## 2. Baseline existing yang harus dipertahankan

**Audit awal berbasis GitHub yang tersedia saat PRD dibuat (bukan klaim hasil verifikasi production):**

- Repo: `andiwijaya/myfarmtwin.com`, branch `main`, berupa **static website** tanpa framework/build dependency dalam README yang diperiksa.
- Fondasi homepage: `dist/index.html`; stylesheet `dist/styles.css`; identitas dan hero FarmGirl `dist/assets/myfarmtwin-farmgirl.png`.
- Navigasi existing: `/learn/`, `/grow/`, `/farm/`, `/kitchen/`, `/projects/`, `/gear/`, `/about/`; ada sitemap, robots, Open Graph, dan Google Analytics.
- `/play/index.html` **belum ditemukan** pada repo saat pengecekan.
- Beberapa halaman kategori yang diperiksa memakai placeholder/generic content. Jangan menghapus konten, tautan, atau struktur SEO yang sudah ada. Catat anomali canonical/placeholder dan perbaiki secara kecil/terpisah bila teruji aman.

**Strategi integrasi:** game berada di route `/play/` dan menjadi CTA baru `Play Farm / Mainkan Farm` di homepage serta navigasi. **Jangan mengganti website konten menjadi single-page game.** Situs editorial tetap dapat diakses dan diindeks. Optimalkan setiap rute yang terdampak tanpa merusak canonical, sitemap, robots, GA4, atau mobile navigation.

**Aturan repo/hosting:** Dot wajib mengaudit konfigurasi Cloudflare Pages yang sebenarnya; jangan berasumsi `dist` pasti target build/deploy meski README menunjukkan struktur static. Bila memakai Vite + TypeScript + Three.js sebagai sub-app, output build **harus hanya memperbarui `/play/`** dan tidak pernah mengosongkan seluruh `dist` atau menimpa halaman existing. Pertahankan ukuran repository dan artifacts kecil; no generated QA junk/cache di Git.

---

## 3. Target pemain dan UX

1. **Casual/mobile:** ingin langsung menanam, melihat kebun berubah, dan mendapatkan uang/game progress tanpa belajar istilah teknis.
2. **Pelajar/pendidik:** belajar air–tanah–pertumbuhan melalui eksperimen dan konsekuensi.
3. **Hobi pertanian/smart farming:** bisa membuka penjelasan engineering, sensor kelembapan, pompa, dan irigasi otomatis.

### First-3-minute experience (skenario wajib diuji)

| Waktu target | Apa yang dirasakan pemain | Bukti dalam game |
|---|---|---|
| 0–20 detik | Masuk farm, lihat FarmGirl, tahu tujuan pertama | CTA Play, loading ringan, misi jelas |
| 20–60 detik | Menanam tanaman pertama | Pilih petak, tap Plant, tunas langsung terlihat |
| 60–120 detik | Menyiram, melihat pertumbuhan | Animasi air, indikator moisture, tanaman bertumbuh dengan waktu simulasi dipercepat |
| 120–180 detik | Panen, jual, terima uang, lihat upgrade berikutnya | Hasil panen masuk inventory → Market → saldo bertambah; misi dan reward selesai |

Gunakan **waktu game yang dipercepat untuk tutorial** (misalnya tombol *Hari Berikutnya*); jangan membuat pengguna menunggu berjam-jam dunia nyata. Sesudah tutorial, tetap sediakan kontrol waktu yang jelas, terbatas, dan konsekuensi simulasinya dihitung konsisten.

### Prinsip interaksi

- Tap/click pada petak → menu kontekstual singkat; maksimal 1–2 langkah untuk plant/water/harvest.
- Kamera isometric dengan pan/zoom terbatas, **Reset View**, dan fallback low-graphics; avatar bebas bergerak **tidak wajib**.
- HUD ringkas: Coins, Day, Water, Mission, Inventory, Pause/Speed. Panel engineering tersembunyi di `Inspect/Why?`.
- Tombol touch minimal 44×44 CSS px, tidak mengandalkan hover, visual icon + label, warna bukan satu-satunya pemberi informasi.
- Tidak ada pop-up tutorial panjang, splash tak bisa dilewati, daily-login punishment, stamina paywall, atau kehilangan farm karena tidak aktif.

---

## 4. Design gameplay V1

### 4.1 Dunia awal

- Satu **small farm** dengan grid logis **8×8** (ukuran visual/disposisi boleh disesuaikan setelah profiling). Area awal: 3 petak tanam aktif, 1 sumur/tandon, 1 papan Market, ruang untuk upgrade.
- Background: tanah, rumput, jalan pendek, beberapa pohon/dekorasi ringan, langit/lighting sederhana; tidak perlu aset berat.
- Dua tanaman awal: **selada** (panen cepat/tutor) dan **tomat** (lebih lambat, reward lebih tinggi). Label dan konten dua bahasa.
- Fasilitas: bed/petak, manual watering, market; berikutnya **small irrigation pump/sprinkler** sebagai upgrade pertama yang terlihat berfungsi.
- FarmGirl muncul sebagai pendamping misi dengan dialog singkat, indikator tujuan, dan tips; reuse aset existing, tidak memaksakan rigging 3D.

### 4.2 Misi pertama — *First Harvest*

| Urutan | Objective | Efek visual & sistem | Hadiah |
|---|---|---|---|
| 1 | Kenali farm dan pilih petak | Highlight petak valid, satu tips dari FarmGirl | Starter seed |
| 2 | Tanam selada | Bibit berubah menjadi tunas | Progress + EXP/Coins kecil |
| 3 | Siram petak yang kering | Tanah lebih gelap + moisture meningkat | Lanjut waktu game |
| 4 | Majukan hari dan lihat pertumbuhan | Tanaman berubah tahap; risiko cuaca dijelaskan | Tutorial selesai |
| 5 | Panen | Item masuk inventory; kapasitas terjaga | Unlock Market |
| 6 | Jual hasil panen | Inventory berkurang, ledger revenue naik | Coins untuk ekspansi |
| 7 | Bangun/upgrade irigasi | Objek ada di dunia dan punya efek pada moisture | Misi berikutnya terbuka |

**Do not softlock:** starter cash/seeds dan reward cukup untuk menyelesaikan rantai misi, termasuk jika pemain membuat satu kesalahan; sediakan recovery seed/misi bantuan deterministik tanpa eksploit ekonomi. Tidak boleh muncul order yang mustahil dipenuhi dengan unlock saat ini.

### 4.3 Misi lanjutan dan retention sehat

- **Short mission** (2–5 menit): tanam, rawat, jual, perbaiki kondisi, tambah satu petak.
- **Medium objective**: penuhi pesanan pasar, kelola dua tanaman, jaga efisiensi air, upgrade irigasi.
- **Long goal**: memperluas lahan, meningkatkan kualitas panen, meningkatkan profit.
- **Events ringan**: hujan/sunny/hot day, promo Market atau permintaan khusus. Efek masuk akal, tidak random punishment.
- **Resume summary**: ringkasan apa yang sudah dicapai dan misi berikutnya, **bukan** penalti absen.
- Tidak memakai streak wajib, countdown yang menciptakan tekanan, ataupun mekanik manipulatif. Pemain kembali karena progres, eksperimen, serta kepemilikan farm.

### 4.4 Ekonomi dan keseimbangan

- Mata uang hanya **game Coins** (bukan uang nyata). Semua transaksi dicatat sebagai ledger: `seed_purchase`, `water_cost`, `facility_purchase`, `sale_revenue`, `mission_reward`.
- Perekonomian dasar: pendapatan panen berdasarkan `quantity × market_price × quality_multiplier`; biaya meliputi bibit, air/pompa, dan fasilitas.
- Harga dan durasi adalah **game balance**, bukan klaim harga pertanian real. Tabel konfigurasi (data-driven) memisahkan nilai gameplay dari kode engine.
- Contoh nilai **placeholder untuk balancing**, bukan aturan final: modal 120 Coins; 3 bibit awal; selada 2–3 hari-game; tomat 4–6 hari-game; pompa kecil ~60 Coins. Dot harus menjalankan balance simulation agar tutorial, recovery, dan progres berulang tidak macet atau inflasi ekstrem.
- Tidak boleh ada saldo/inventory negatif karena double-click, race condition, reload, atau event mission yang diproses dua kali.

---

## 5. Engineering simulation yang sungguh memengaruhi game

### 5.1 Model air dan tanaman — sumber kebenaran tunggal

Gunakan **fixed logical tick** (misalnya 1 tick = 1 in-game hour; jumlah dan tick rate dipilih setelah profiling). Renderer membaca snapshot dari engine, **tidak menghitung state ekonomi/agronomi sendiri**. Alur harus deterministik untuk seed cuaca, state, dan aksi yang sama.

Untuk tiap petak, simpan `soilWaterMm`, `soilCapacityMm`, `cropType`, `cropStage`, `growthProgress`, `health/quality`, serta aksi terakhir. Persamaan diskret sederhana:

`soilWater_next_mm = clamp(soilWater_mm + effectiveRain_mm + irrigation_mm - cropET_mm - drainage_mm, 0, soilCapacity_mm)`

`soilMoisturePercent = 100 × soilWater_mm / soilCapacity_mm`

- **Konsistensi unit wajib**: semua komponen neraca air dalam mm setara pada luas petak yang sama; jangan menjumlah mm dan persentase secara langsung.
- `growthIncrement = baseGrowth × waterFactor × weatherFactor × cropStageFactor` dengan faktor terikat dalam rentang aman dan terdokumentasi.
- Air kurang → pertumbuhan melambat/kualitas menurun; curah hujan bisa membantu; genangan berlebih juga kurang baik. Tanaman **tidak langsung mati** karena satu aksi terlewat; ada ruang recovery.
- Cuaca awal cukup `sunny`, `cloudy`, `rainy`, `hot`; generator seeded dan dapat diprediksi/diputar ulang untuk testing.
- Sensor/indicator bar menunjukkan **data dari model aktual**, bukan angka kosmetik. Player boleh melihat penjelasan “Mengapa tanaman lambat?” tanpa membuka spreadsheet.
- Model V1 adalah *educational approximation*, **bukan prediksi agronomi untuk keputusan pertanian nyata**. Tuliskan batasannya di Engineering Lab.

### 5.2 Irigasi: manual → semi-otomatis

- Manual watering menambah air sesuai besaran tervalidasi dan mengurangi sumber daya game.
- Pump/sprinkler upgrade bekerja pada petak jangkauan tertentu; ada biaya air/energi game dan batas kapasitas.
- Setelah upgrade, pilihan pertama adalah **manual ON/OFF** dengan dampak nyata. Otomasi threshold sensor dapat menjadi kelanjutan V1.1 **hanya setelah** pump manual, moisture, ekonomi, dan save terbukti benar.
- Interlock sederhana: tidak boleh memompa tanpa stok air; bila fasilitas tidak tersedia, UI jelaskan alasan, bukan gagal diam-diam.

### 5.3 Engineering Lab — *progressive disclosure*

Panel opsional `Inspect / Kenapa?` menampilkan kondisi petak: soil moisture, water applied, weather, crop growth/quality, biaya perawatan dan estimasi panen **yang diberi label sebagai perkiraan in-game**. Gunakan angka singkat dan penjelasan bahasa awam. Grafis trend/detail lebih kaya dilakukan setelah core gameplay stabil.

### 5.4 Time and pause

- **Tidak perlu real-time server**. V1 memakai waktu game saat dimainkan, pause saat tab inactive atau player memilih pause; `Next Day` tetap menjalankan tick dan biaya/efek relevan, tidak melakukan teleport state secara curang.
- **Tidak ada degradasi offline yang menghukum.** Jika nanti ditambah offline progression, harus bounded, tidak menyebabkan kerugian farm tak wajar, serta diuji terhadap manipulasi jam perangkat.
- Semua reward, waktu, dan ledger idempotent di event replay/reload.

---

## 6. Arsitektur teknis & integrasi existing

**Keputusan teknologi final oleh Dot setelah audit.** Rekomendasi ringan: **TypeScript + Vite + Three.js** sebagai game sub-app. Pertahankan website editorial statis. Jangan memaksakan React, Rust/WASM, backend, atau layanan berbayar tanpa kebutuhan terbukti.

```text
myfarmtwin.com/
├─ dist/                          # website existing, HARUS aman
│  ├─ index.html
│  ├─ styles.css
│  ├─ assets/myfarmtwin-farmgirl.png
│  └─ play/                       # output game hasil build terisolasi
├─ game/                          # source kode game, bila sesuai audit
│  ├─ core/                       # fixed tick, RNG, state, event bus
│  ├─ farm/                       # plots, crops, growth, irrigation
│  ├─ economy/                    # inventory, market, ledger
│  ├─ missions/                   # idempotent mission states
│  ├─ world/                      # placement, coordinates, weather
│  ├─ renderer/                   # 3D, assets, camera, quality fallback
│  ├─ ui/                         # HUD, tutorial, dialogs, locales
│  ├─ persistence/                # save schema, migration, recovery
│  └─ tests/                      # unit, integration, e2e
└─ docs/PRD_MYFARMTWIN_MASTER_V1.md
```

**Constraint arsitektur:**

1. `gameState` milik engine; scene/render/UI hanya konsumen state dan pengirim command bertipe.
2. Semua perubahan state melalui commands tervalidasi; tidak ada mutasi bebas dari pointer event handler.
3. Core simulation dapat ditest **headless tanpa WebGL**.
4. Config/data tanaman/harga/mission terpisah dari kode; tidak meng-hardcode balance di komponen UI.
5. Seeded random, fixed-tick, invariant checks, transaction IDs, dan schema version pada save.
6. Autosave lokal via browser storage (localStorage/IndexedDB ditentukan setelah audit kapasitas); fungsi ekspor/impor save JSON berguna untuk portabilitas dan QA bila ringan.
7. Tidak ada telemetri data pribadi/sensitif. Bila menggunakan GA4 yang sudah existing, event dianonimkan/diagregasi dan ikuti consent yang berlaku; jangan mencatat save/player ID yang bisa mengidentifikasi.
8. Asset visual berlisensi jelas atau dibuat sendiri; kompres, instancing, dan tidak menyimpan hasil render/QA yang besar di repo.
9. Bilingual: pertahankan **English existing homepage**; di game sediakan `id` + `en`, gunakan preferensi tersimpan, lalu locale browser, fallback EN. Jangan merusak canonical/SEO existing.
10. Offline availability dan PWA **bukan syarat V1**; reload/resume dengan local save adalah syarat.

---

## 7. Master checklist — micro-feature, berurutan

**Konvensi:** `[ ]` belum selesai, `[x]` baru boleh diisi setelah implementasi, test, verifikasi browser, dan bukti dicatat. Dot **wajib** memperbarui file PRD ini setelah **setiap** micro-feature, bukan di akhir milestone saja. Bila satu item ternyata terlalu besar, pecah lagi menjadi child checklist dan lanjutkan tanpa approval rutin.

### M0 — Audit, baseline, dan safety gate

- [x] **M0-F01 — Audit repo local + remote.** Verifikasi path local yang benar, branch, status Git, README, struktur, scripts, dependensi, serta deploy config; catat keputusan di `docs/M0_AUDIT.md`.
- [x] **M0-F02 — Audit production dan rute.** Screenshot homepage desktop+mobile; uji semua navigasi existing; catat canonical/sitemap/robots/GA4/asset dan baseline console errors tanpa mengubahnya.
- [x] **M0-F03 — Safe build/publish plan.** Buktikan build game terisolasi tidak menghapus/mengganti `dist/index.html`, `dist/styles.css`, atau rute konten. Tes dengan snapshot/hashes atau integration test.
- [x] **M0-F04 — Engineering ADR.** Pilih sub-app framework/build dan render fallback yang paling sederhana setelah audit; tulis trade-off, ukuran bundle budget, dan browser target.
- [x] **M0-F05 — Baseline test harness.** Buat scripts local untuk lint/typecheck/build/unit/e2e/smoke (sesuai stack) tanpa membutuhkan GitHub Actions minutes.
- [x] **M0-F06 — Safety checkpoint.** Commit lokal bersih, rollback plan, ignore build/cache/QA garbage, pastikan repo growth terkendali dan file media penting tidak dihapus.

### M1 — Entry point & playable farm world

- [x] **M1-F01 — `/play/` tersedia.** Halaman game dapat dibuka langsung maupun dari homepage, refresh tetap valid; semua rute editorial masih bekerja.
- [x] **M1-F02 — CTA homepage/nav.** Tambah `Play Farm / Mainkan Farm` tanpa menghilangkan brand FarmGirl, struktur navigasi, atau SEO metadata.
- [x] **M1-F03 — Scene farm minimum.** Dunia low-poly/isometric dengan 3 petak aktif, sumur, Market board, dan ruang kosong; render di desktop dan mobile tanpa blank screen.
- [x] **M1-F04 — Kamera & input.** Tap/click pilih petak, pan/zoom aman, Reset View; pointer events tidak memicu dua aksi.
- [x] **M1-F05 — Select/inspect plot.** Tooltip/panel petak valid, status awal jelas; close/back bekerja di HP.
- [x] **M1-F06 — HUD minimum.** Day, Coins, Mission, Inventory dan kontrol waktu terlihat dengan layout mobile legible.
- [x] **M1-F07 — FarmGirl guide.** Pemandu dengan dialog singkat, bisa ditutup; reuse aset approved; tidak memblok input.
- [x] **M1-F08 — Graphics fallback.** Low mode/fallback sederhana; jika WebGL tidak tersedia, tunjukkan pesan dan alternatif interaksi yang tetap berguna, bukan halaman putih.

### M2 — Plant, water, grow, harvest

- [x] **M2-F01 — Game state & tick.** Implement deterministic headless state, commands, seeded weather, fixed logical tick, pause/Next Day; unit test replay identik.
- [x] **M2-F02 — Crop config.** Selada + tomat data-driven: bibit, durasi hari-game, kebutuhan air, stages, yield; lokalisasi ID/EN.
- [x] **M2-F03 — Plant action.** Bibit berkurang tepat satu; plot kosong berubah planted; invalid action menampilkan alasan.
- [x] **M2-F04 — Visible growth stages.** Seed/sprout/growing/mature berbeda terlihat setelah tick; tidak ada progress yang melompat tanpa update engine.
- [x] **M2-F05 — Soil water model.** Neraca air mm/petak, batas kapasitas dan moisture % valid; test dry/wet/boundary.
- [x] **M2-F06 — Manual watering.** Player bisa menyiram sekali per command, efek air dan feedback visual sesuai model; no double cost.
- [x] **M2-F07 — Weather effect.** Cuaca seeded sunny/cloudy/rainy/hot mengubah air/growth; dapat dibuktikan dengan scenario deterministic tests.
- [x] **M2-F08 — Harvest & inventory.** Tanaman matang dipanen, jumlah/quality terhitung, item masuk inventory, petak kembali usable; tidak bisa double harvest.
- [x] **M2-F09 — Crop health & recovery.** Kekeringan/genangan perlahan memengaruhi quality, bisa dipulihkan; care terasa bermakna tanpa game-over tak adil.

### M3 — Misi & ekonomi satu loop lengkap (**vertical-slice gate**)

- [x] **M3-F01 — Guided tutorial missions.** Urutan plant → water → grow → harvest → sell dengan highlight kontekstual; selesai secara normal ≤3 menit pada test scenario.
- [x] **M3-F02 — Idempotent mission engine.** Misi bereaksi pada domain events sekali saja; reload/replay/rapid click tidak menggandakan hadiah.
- [ ] **M3-F03 — Market selling.** Sale inventory valid → Coins bertambah → inventory berkurang → feedback jelas.
- [ ] **M3-F04 — Ledger & balance.** Semua revenue/cost/reward tercatat; sum ledger konsisten dengan saldo; tak ada inventory/Coins negatif.
- [ ] **M3-F05 — First build/upgrade.** Pendapatan pertama dapat dibelanjakan untuk bed tambahan atau irrigation facility yang benar-benar berfungsi; bukan dekorasi terkunci.
- [ ] **M3-F06 — Anti-softlock.** Recovery seed, order feasible, fallback bila kehabisan Coins; test skenario pemain melakukan satu kesalahan.
- [ ] **M3-F07 — Mission complete celebration.** Reward, animasi ringan, next objective yang jelas; tidak perlu modal atau login.
- [ ] **M3-F08 — E2E VERTICAL SLICE.** Browser desktop+HP: open `/play/` → plant → water → next day → harvest → market sale → upgrade. Simulasi, UI, ledger cocok. **STOP & FIX** semua issue sebelum melanjutkan.

### M4 — Farm care yang terasa hidup

- [ ] **M4-F01 — Farm condition feedback.** Warna/tanda tanah, crop health, growth dan water status terlihat; tooltip “Kenapa?” menggunakan model aktual.
- [ ] **M4-F02 — Manual small pump.** Upgrade pompa ON/OFF memengaruhi petak dalam range yang jelas; resource & biaya terdebit.
- [ ] **M4-F03 — Pump interlock.** Pump tidak bisa berjalan tanpa air/fasilitas valid; edge cases tidak crash.
- [ ] **M4-F04 — Second crop balancing.** Perbedaan nyata selada dan tomat (durasi, kebutuhan air, nilai jual); tidak ada strategi dominan yang merusak loop.
- [ ] **M4-F05 — Market orders.** 2–3 order sederhana yang feasible dengan unlock; reward dibayar sekali; refresh deterministik/terkendali.
- [ ] **M4-F06 — Weather mini-events.** Hujan/panas memicu pilihan care dan info, bukan random penalty tak terduga.
- [ ] **M4-F07 — Build/expansion visibility.** Bed/fasilitas baru tampil tepat pada grid dan bertahan setelah load; batas grid/petak valid.

### M5 — Save, return visit, dan progression

- [ ] **M5-F01 — Versioned save schema.** `saveVersion`, world/plots/crops, economy ledger, inventory, missions, weather seed/tick, unlocks tersimpan.
- [ ] **M5-F02 — Autosave + resume.** State kembali identik setelah reload/close/reopen; tidak ada reward, crop atau sale yang terduplikasi.
- [ ] **M5-F03 — Corrupted/old save recovery.** Validasi, migration untuk schema berikutnya, backup aman/default fresh game dengan pesan jelas; no white screen.
- [ ] **M5-F04 — Session progress.** Farm summary dan next mission pada return, tanpa offline damage/punishment.
- [ ] **M5-F05 — Multiple missions.** Sedikitnya 3 mission setelah first harvest: penuhi order, rawat saat panas, upgrade efisiensi.
- [ ] **M5-F06 — Accessible reset/export.** Reset dengan konfirmasi; bila biaya kecil, sediakan export/import JSON agar data tidak mudah hilang dan QA reproducible.
- [ ] **M5-F07 — Long-session balance test.** Simulasi ≥30 in-game days: tanpa softlock, crash, currency exploit, negative values atau farm state tidak masuk akal.

### M6 — Engineering depth tanpa merusak fun

- [ ] **M6-F01 — Inspect overlay.** Klik tanaman/petak melihat moisture %, water mm, weather, growth, health/quality dan alasan kondisi sekarang.
- [ ] **M6-F02 — Explain causality.** UI teks ID/EN sederhana: “tanah kering → tumbuh lambat”, “hujan → hemat air”, “pompa → biaya naik, risiko kering turun”; berdasarkan state aktual.
- [ ] **M6-F03 — Mini trends.** Tampilkan grafik ringkas moisture/growth atau event history untuk beberapa tick terakhir, bukan dashboard engineering yang mendominasi layar.
- [ ] **M6-F04 — Simulation disclosure.** Penjelasan bahwa model adalah educational approximation, definisi satuan dan asumsi, tidak untuk rekomendasi agronomi nyata.
- [ ] **M6-F05 — Headless scenario comparison.** Test farm yang sama dalam skenario dry vs watered; hasil air, pertumbuhan dan biaya berbeda secara rasional.

### M7 — QA, performance, SEO, production release

- [ ] **M7-F01 — Black-box QA.** Jalankan skenario pengguna baru, pemain kembali, invalid input, no funds, double-tap, break/resume di desktop dan Android Chrome atau ekuivalen.
- [ ] **M7-F02 — White-box QA.** Unit/integration tests untuk tick, water balance, growth, transactions, missions, RNG, save migration, boundary conditions; hasil disertakan.
- [ ] **M7-F03 — Dead-code/dependency audit.** Buang unused code, asset tak dipakai, debug logs, QA artifacts, dan dependency berat; jangan menghapus aset media future use milik user.
- [ ] **M7-F04 — Cross-browser & accessibility.** Chrome Android/mobile, Chrome/Edge desktop dan browser kedua yang tersedia; touch targets, readable text, keyboard, contrast, reduced-motion.
- [ ] **M7-F05 — Performance budget.** Target rata-rata ≥30 FPS pada Android menengah yang tersedia dan ≥50 desktop di scene awal; catat hardware, metode dan deviasi. Jika tidak tercapai, optimasi dan low-mode. Verifikasi bundle/asset size realistis dan first-interaction load time.
- [ ] **M7-F06 — SEO/navigation regression.** Homepage, existing routes, canonical, OG, sitemap, robots, GA4 yang sudah ada tetap bekerja; game link no 404 dan link balik home ada.
- [ ] **M7-F07 — Data/privacy/security.** Tidak ada key di frontend, insecure HTML injection, insecure external script, dependency vulnerability kritis, atau data PII dalam telemetry; save parse tervalidasi.
- [ ] **M7-F08 — Deploy & production smoke.** Jalankan local build/test, commit lokal, push/deploy aman setelah release gate. Verifikasi URL live desktop+mobile dan rollback siap. Jangan memakai GitHub Actions berulang (kuota terbatas).
- [ ] **M7-F09 — Release report & handoff.** `docs/RELEASE_REPORT_V1.md`: fitur, test & screenshot evidence, commit, live URL yang benar-benar diverifikasi, known issues, backlog dan prosentase checklist final.

**Urutan wajib:** M0 → M1 → M2 → M3 (vertical-slice gate) → M4 → M5 → M6 → M7. **Jangan menambah dekorasi, artikel, hewan, greenhouse, banyak crops, atau AI sebelum M3-F08 lulus.** Dot dapat memecah subtask lebih kecil, tetapi jangan melewati acceptance gate.

---

## 8. Definition of Done (DoD) per micro-feature

Sebuah fitur baru boleh `[x]` bila:

1. Perilaku sudah bekerja **end-to-end** dari interaksi user sampai gameState/persistence/visual feedback yang relevan.
2. Unit/integration test (untuk logic) dan browser smoke test (untuk UI) lulus; happy + at least one failure path diuji.
3. Tidak merusak misi/fitur lama; build bersih; tidak ada uncaught error pada skenario uji.
4. Mobile dan desktop diperiksa secara otomatis/lokal dengan evidence secukupnya; user **tidak diminta manual testing**.
5. PRD checkbox, prosentase progres, commit lokal, evidence, issue dan next feature diperbarui.

**Template report singkat setiap micro-feature:**

```text
MyFarmTwin | Mx-Fyy — [judul fitur]
Status: PASS / BLOCKED | Checklist: [selesai]/[total] ([persen]%)
Scope selesai: ...
Test evidence: unit ... | browser mobile ... | desktop ... | regression ...
Issue / mitigasi: ...
Next: Mx-Fzz — ...
```

Dot melanjutkan otomatis ke item berikutnya setelah PASS. Bila blocker dapat dipecahkan lewat debug, **debug sendiri**; jangan berhenti hanya karena perlu keputusan kecil tentang UI, library atau balancing.

---

## 9. Uji wajib dan acceptance gate V1

| Test | Minimal acceptance |
|---|---|
| First 3 minutes | Satu jalur first harvest → sell benar-benar selesai ≤180 detik pada test otomatis/manual terinstrumentasi oleh Dot, tanpa login |
| Core loop | Tanam → siram → tumbuh → panen → jual → uang masuk → upgrade bekerja di HP & desktop |
| Agriculture causality | Dalam input sama, irigasi dan cuaca memengaruhi soil moisture/growth secara dapat direproduksi; balance air tidak melanggar bounds |
| Economy | Saldo dan inventory non-negatif; rewards dan sale exactly-once; ledger reconcile |
| Persistence | Reload/resume mempertahankan farm state, mission, weather seed, inventory, dan economy tanpa duplikasi |
| Safety | Tidak bisa softlock hanya karena satu kesalahan atau absen; reset/recovery jelas |
| Performance | Target awal 30 FPS perangkat Android menengah tersedia, 50 desktop; low mode tersedia; evidence dicatat, bukan klaim tanpa tes |
| Compatibility | Chrome Android, Chrome/Edge desktop, dan setidaknya satu browser tambahan bila tersedia; no blocking input bug |
| Existing website | Homepage & semua route lama tetap muncul; navigation, SEO metadata, sitemap dan assets tetap valid |
| Production | `/play/` live dan dicek sesudah deploy, tanpa console fatal errors atau blank scene |

**Gagal satu acceptance = belum selesai; jangan tandai `[x]`.** Jika performa perangkat tertentu tidak bisa diuji karena environment, tulis batasan secara jelas, gunakan fallback test, dan jangan mengaku telah mengujinya.

### Metrics produk untuk fase setelah rilis (bukan angka yang diklaim sudah tercapai)

- Tutorial start → tutorial completion.
- First visit → first successful harvest/sale.
- Missions completed per session; session length yang sehat dan opsional return rate D1/D7 bila ukurannya valid dan consent memadai.
- Pct pengguna membuka Inspect/Engineering Lab.
- Error rate, failed saves, 3D fallback usage, FPS/loading by coarse device class (privacy-respecting).

Target awal adalah **memvalidasi bahwa orang bisa dan ingin bermain**, bukan menaikkan metrik dengan spam reminder/daily streak.

---

## 10. Roadmap sesudah V1 — OUT OF SCOPE, hanya jika V1 terbukti stabil

**V1.1 — Smart Irrigation:** soil-moisture sensor, threshold pump controller, timer mode, perbandingan konsumsi air/biaya, misi optimasi irigasi.  
**V1.2 — Farm Expansion:** beberapa lahan/tanaman, soil types, pupuk terukur, crop rotation sederhana, seasonal orders, more structures.  
**V2 — Livestock & Greenhouse:** ayam/kandang dan kesejahteraan hewan, greenhouse temperature/ventilation, supply chain sederhana, farm-to-market.  
**V3 — Advanced Farm Twin:** automation networks, optional IoT/SMK lab, scenario benchmark, offline-first improvements, optional shared gameplay core antar Twin setelah terbukti reuse menghemat kompleksitas.

**Constraint utama:** jangan mengubah MyFarmTwin menjadi produk enterprise engineering-first. Kedalaman teknik muncul ketika pemain ingin mengeksplorasi lebih jauh; misi, care, build, ekonomi dan progression tetap prioritas.

---

## 11. Instruksi final langsung untuk Dot

1. Buka repo local yang benar dan bandingkan remote `andiwijaya/myfarmtwin.com` branch `main`. Jangan menebak path lokal.
2. Salin file ini ke `docs/PRD_MYFARMTWIN_MASTER_V1.md` di repo dan jadikan **living source of truth**.
3. Kerjakan seluruh checklist mulai **M0-F01**, **satu micro-feature end-to-end setiap kali**. Pilih keputusan teknis kecil sendiri, dengan kualitas sebagai syarat tidak bisa ditawar.
4. Audit dan pertahankan semua fitur/content/media existing; **jangan replace homepage**, jangan hapus aset yang bermanfaat untuk masa depan.
5. Pakai local build, local browser, automated tests, black-box, white-box, dead-code, regression; debugging dan verifikasi adalah tugas Dot, bukan Product Owner.
6. Setelah tiap fitur, update `[ ]`→`[x]`, persentase, evidence, status, dan laporkan singkat sambil terus melanjutkan. Jika user sedang tidak aktif, lanjutkan tanpa menunggu approval rutin.
7. **No blind deployment.** Build & test lokal dulu, checkpoint Git, baru push/deploy aman dan smoke-test produksi; prioritaskan penghematan GitHub Actions minutes dan disk hygiene.
8. Escalate hanya bila blocker nyata membutuhkan user, seperti credentials/2FA/izin legal/keputusan produk yang tak bisa diturunkan dari PRD. Sebut blocker spesifik dan opsi rekomendasi, tidak membuat pertanyaan umum.
9. Selesaikan **satu full playable loop** (M3-F08) sebelum menambah visual atau sistem yang tidak essential. Release V1 hanya ketika seluruh gate relevan M0–M7 lulus.

**North star:** *People come to play, come back to grow their farm, and learn real engineering by experiencing its consequences.*
