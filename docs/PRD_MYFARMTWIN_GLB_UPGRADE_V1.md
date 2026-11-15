# MyFarmTwin: upgrade GLB, farm tropis Indonesia, dan gameplay baru

Tanggal: 15 November 2026 (WIB).
Status: implementasi P0-P2 berjalan setelah otorisasi pemilik pada 15 November 2026. Progres dan bukti terbaru: [GLB_PROTOTYPE_PROGRESS.md](GLB_PROTOTYPE_PROGRESS.md).
Baseline yang diperiksa: checkout `cozy-world-v1`, commit `dbccee9`.
Dokumen ini menetapkan arah upgrade berikutnya; checklist rilis lama tetap menjadi catatan historis.

## 1. Tujuan produk

Membangun game farm tropis Indonesia dengan visual semi-realistis yang hangat, seluruh model dunia 3D berasal dari GLB, kamera dekat dan interior yang nyaman, serta pengelolaan farm yang bebas tetapi mudah dimainkan.

Pemain mengembangkan farm melalui siklus: tanam atau pelihara, rawat, panen atau kumpulkan hasil, jual atau penuhi pesanan, kemudian gunakan pendapatan untuk membangun dan menata farm. Unsur bisnis memberi tujuan perkembangan; kebutuhan sederhana, hasil relatif cepat, dan konsekuensi ringan menjaga pengalaman cozy.

Kualitas dinilai pada tampilan overview, jarak menengah, dan close-up di game. Format GLB menjadi kontrak pengiriman model; kualitas bentuk, material, rig, animasi, pencahayaan, dan komposisi tetap harus dibuktikan terpisah.

## 2. Keputusan hasil interview

| Aspek | Keputusan pemilik |
| --- | --- |
| Gaya visual | Semi-realistis: bentuk, tekstur, dan pencahayaan lebih alami, tetap hangat. |
| Identitas tempat | Farm tropis Indonesia, termasuk vegetasi, tanah, material, dan karakter kandang lokal. |
| Format aset | Semua objek 3D memakai GLB, termasuk tanah dan lingkungan. |
| Sumber model | Utamakan model khusus buatan sendiri; waktu pembuatan lebih panjang dapat diterima. |
| Prioritas perangkat | Kualitas visual setinggi mungkin; perangkat lama boleh tidak didukung. |
| Navigasi area | Klik area untuk kamera mendekat otomatis, kemudian putar dan zoom manual. |
| Interior | Bagian dalam kandang dapat dilihat dan dieksplorasi dengan kamera lebih bebas. |
| Kontrol interior | Orbit 360 derajat, zoom, dan geser; mode berjalan orang pertama tidak dipilih. |
| Cakupan perubahan | Visual, kamera, interior, gameplay, dan tata kelola farm dirombak. |
| Identitas gameplay | Gabungan cozy dan bisnis: biaya, produksi, dan target perkembangan. |
| Tata lahan | Bebas membangun, memindah, dan memperluas kebun, kandang, jalan, dan fasilitas di lahan farm. |
| Kedalaman simulasi | Sederhana, mudah dibaca, konsekuensi ringan, hasil produksi lebih cepat. |
| Progres lama | Migrasikan progres; pertahankan aset, ternak, uang, dan 24 bed yang sudah aktif. |
| Akun dan online | Single-player tanpa login, save lokal, ekspor/impor aman. |
| Prototipe pertama | Kebun kecil dan kandang sapi lengkap, termasuk tanah, tanaman, sapi, interior, kamera, bangun/pindah. |

Keputusan ini memberi dasar implementasi. Pemilik kemudian mengotorisasi pengerjaan otonom dari P0 sampai prototipe kebun kecil dan kandang sapi, pembaruan checklist, deploy setelah selesai, dan pengujian publik. Pengujian yang meminta approval pemilik dilewati. Tahap P3-P7 untuk upgrade seluruh farm tetap dilacak terpisah dari penyelesaian prototipe P2.

## 3. Kondisi proyek yang benar-benar diperiksa

- Game memakai Three.js `0.187.0` yang dibundel lokal, satu dunia WebGL, dan state simulasi yang terpisah dari presentasi.
- `unified-world-preview.js` masih membangun objek melalui geometri kode dan material Lambert; `unified-world-sprites.js` memakai atlas gambar untuk hewan. Belum ditemukan model GLB/glTF atau pipeline `GLTFLoader` pada sumber game yang diperiksa.
- Tanah pada `unified-cozy-landscape.js` dibuat dari `BoxGeometry`. Tanaman juga mempunyai jalur geometri buatan kode.
- `unified-world-camera.js` mempunyai fokus area, pan, fit/reset, zoom 1-8x, dan empat heading. Kamera scene masih orthographic; orbit kontinu dan tampilan interior memerlukan perubahan pada proyeksi, input, picking, dan aturan penghalang.
- `unified-world-registry.js` memakai batas dan anchor zona tetap. Sistem bangun bebas memerlukan identitas bangunan dan koordinat penempatan yang dinamis.
- `tools/build.mjs` menyalin ekstensi HTML/CSS/JS/SVG/JSON/WebP/PNG, belum GLB atau decoder WASM. MIME preview juga belum mencantumkan GLB. Perubahan pipeline pengiriman menjadi bagian wajib upgrade.
- Source dan dokumentasi garden saat ini menetapkan 24 bed aktif serta save V6. Implementasi baru harus mempunyai migrasi yang eksplisit dan teruji.
- Situs editorial dan game `/play/` berbagi `dist`; builder sengaja membatasi penulisan ke `dist/play`.
- Blender belum terdeteksi pada PATH dan lokasi instalasi umum yang diperiksa. Ketersediaan alat authoring masih perlu dipastikan sebelum produksi model.

Audit ini berdasarkan checkout lokal. Akses baca publik melalui alat web ke homepage dan `/play/` gagal pada sesi perencanaan; kesamaan checkout dengan deployment publik belum diverifikasi ulang. Angka performa dan hasil tes rilis lama tidak menjadi bukti kesiapan upgrade ini.

## 4. Kontrak semua model GLB

### Cakupan model yang wajib GLB

1. Terrain utama, petak tanah, tepi lahan, permukaan kebun, serta variasi tanah yang terlihat.
2. Bed, tanaman setiap tahap tumbuh, buah atau hasil yang terlihat di dunia, pompa, dan irigasi.
3. Sapi, kambing, ayam, dan ikan, termasuk variasi yang benar-benar dibutuhkan oleh gameplay.
4. Kandang, atap, dinding, pintu, lantai, sekat, dan fasilitas interior.
5. Tempat pakan/minum, sarang, alat pemerahan, tangki, wadah hasil, dan fasilitas perawatan.
6. Kolam, tepi kolam, mesh air, pipa, aerator, dan peralatan ikan.
7. Market, gudang yang masuk katalog gameplay, jalan, pagar, gerbang, papan, dan dekorasi.
8. Pohon, semak, rumput, batu, bentang lingkungan, dan model langit bila memakai sky dome.
9. Model kosmetik 3D tambahan yang kemudian dimasukkan ke scene.

### Aturan teknis yang diusulkan

- Gunakan GLB glTF 2.0 sebagai aset runtime. File kerja authoring seperti `.blend` disimpan terpisah dari output yang dikirim ke game.
- Geometry yang terlihat berasal dari GLB. Kode memuat, menempatkan, menggandakan, menggerakkan, dan merender model tersebut.
- Animasi tulang/morph, perubahan material tanah basah, shader air pada mesh GLB, serta deformasi angin boleh dikendalikan saat runtime. Sumber mesh tetap GLB.
- Kamera, lampu, bayangan hasil renderer, background warna, kontrol HTML, dan perhitungan collision bukan model objek. Collider/debug/helper yang tidak terlihat boleh didefinisikan melalui data atau kode.
- Tekstur pendukung model dikemas di dalam GLB secara default. Audio dan gambar UI mempunyai formatnya sendiri; tampilan FarmGirl 2D yang sudah ada tidak otomatis masuk pekerjaan karakter 3D.
- Satu file tidak diwajibkan untuk seluruh farm. Pecah model menurut penggunaan dan kebutuhan pemuatan: terrain modular, kit bangunan, keluarga tanaman, dan hewan beranimasi.
- Instancing dan clone memakai model GLB bersama; pagar, jalan, rumput, dan tanaman tidak perlu diunduh per objek.
- Setiap aset mempunyai ID stabil, versi, sumber authoring, pembuat, hak penggunaan, checksum, byte size, bounds, pivot, skala, footprint, material, animasi, dan level detail.
- Model GLB diperiksa struktur dan resource-nya dengan validator, lalu diperiksa lagi dalam renderer game. Validasi format tidak menggantikan review visual.
- Semua model dan decoder dihosting bersama aplikasi. Verifikasi lisensi tekstur pendukung juga diperlukan ketika modelnya dibuat sendiri.

GLB dapat membawa geometry, material, skin, animasi, dan gambar dalam satu container, tetapi spesifikasinya juga mengizinkan referensi eksternal. Karena itu larangan dependensi model yang tersembunyi harus diperiksa, bukan disimpulkan hanya dari ekstensi file. [Spesifikasi Khronos](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html)

## 5. Standar visual dan produksi model khusus

### Art direction

- Suasana tropis Indonesia yang hangat: tanah cokelat, rumput dan vegetasi tropis, kayu/bambu atau material lokal yang masuk akal, atap dan ventilasi kandang yang konsisten.
- Tentukan satu bahasa bentuk dan material dari studi konsep; semua spesies, tanaman, bangunan, dan lingkungan mengikuti standar itu.
- Bangunan mempunyai ketebalan material, sambungan, bukaan, lantai, struktur atap, dan fasilitas yang terbaca saat dilihat dekat.
- Hewan mempunyai proporsi spesies yang meyakinkan, wajah dan kaki yang jelas, permukaan tubuh yang rapi, serta kontak kaki dengan lantai.
- Material tanah, kayu, logam, daun, bulu/permukaan hewan, dan air dibedakan melalui warna, roughness, normal, serta respons cahaya yang tepat. Hindari permukaan tampak plastik secara tidak sengaja.
- Cahaya pagi/siang/sore/malam mengikuti satu waktu game. Interior tetap terbaca, dengan kontak tanah, bayangan, dan exposure yang konsisten.

### Jalur authoring

Brief dan referensi -> model -> UV -> material/tekstur -> rig/animasi bila perlu -> export GLB -> validasi -> integrasi game -> review close-up -> optimasi -> pemeriksaan ulang.

Model khusus membutuhkan pekerjaan bentuk, material, dan animasi yang terukur. Jika hasil dari alat atau authoring awal belum memenuhi standar, aset tetap berstatus draft. Kualitas tinggi belum boleh diklaim dari keberadaan file atau keberhasilan export.

### Bukti kualitas per kelompok aset

- Tampilan 360 derajat dan screenshot overview, jarak menengah, serta jarak terdekat yang didukung.
- Detail hewan pada wajah, tubuh, kaki, dan peralihan animasi; tidak menembus lantai/fasilitas.
- Idle, jalan, makan, minum, dan istirahat sesuai kebutuhan spesies; ikan memakai berenang. Aksi produksi tambahan ditentukan melalui gameplay.
- Tanaman menunjukkan tahap tumbuh yang jelas; model sesuai spesies dan dapat dibaca di antara 24 bed.
- Interior terlihat lengkap dari sudut yang diizinkan; tidak ada sisi kosong, normals terbalik, atau bagian bangunan yang hilang tanpa aturan kamera yang jelas.
- Tidak ada tekstur hilang, kedipan permukaan, transparansi rusak, bayangan menggantung, atau perubahan detail mencolok saat kamera bergerak.
- Semua kualitas tetap diperiksa dalam game dengan cahaya dan kamera produksi.

## 6. Kamera overview, fokus area, dan interior

### Perjalanan pemain

1. Masuk game dan lihat farm yang mudah dibaca.
2. Klik area, bangunan, atau pilih dari daftar area; kamera bergerak halus ke target yang sesuai.
3. Putar 360 derajat, zoom, dan geser secara manual; panel aksi tetap menjaga objek penting terlihat.
4. Pilih masuk/lihat interior kandang. Kamera bertransisi ke target dalam bangunan, memakai batas khusus interior.
5. Gunakan tombol kembali untuk mengembalikan framing sebelumnya; tombol Seluruh Farm menampilkan batas lahan, dan Reset memulihkan framing awal.

### Perilaku wajib

- Usulan proyeksi: kamera perspective dengan orbit terbatas agar kedalaman interior dan close-up terasa alami. Sudut, jarak, dan FOV diputuskan dari prototipe.
- Orbit mengizinkan yaw kontinu; pitch dan jarak dibatasi agar kamera tidak masuk tanah atau terbalik.
- Setiap bangunan mempunyai target exterior/interior dan bounds lokal dari data aset. Target mengikuti bangunan setelah dipindah atau diputar.
- Kedatangan kamera memperhitungkan ukuran model dan ruang yang tertutup panel, bukan satu angka zoom untuk semua kandang.
- Kamera menghindari dinding, atap, dan objek besar. Atap/dinding tertentu dapat memudar atau memakai cutaway saat diperlukan, dengan aturan yang konsisten.
- Input kamera dibedakan dari klik hewan/aksi dan drag penempatan bangunan; bergerak dengan kamera tidak membeli, memulai, atau mengubah farm.
- Mouse, keyboard, tombol alternatif, dan gesture sentuh diperiksa pada perangkat yang akan didukung. Mode reduced motion memperpendek atau meniadakan perpindahan kamera kosmetik.
- Satu scene aktif dan satu simulasi otoritatif dipertahankan. Interior tidak membuat duplikat hewan atau jam produksi kedua.
- Daftar objek dan aksi berbasis HTML tetap tersedia, termasuk saat model suatu area belum selesai dimuat.

Tidak ada kebutuhan mode berjalan orang pertama, avatar pemain, atau kontrol WASD orang pertama pada hasil interview ini.

## 7. Gameplay cozy dan bisnis

### Siklus inti yang diusulkan

| Sistem | Perilaku yang dituju |
| --- | --- |
| Kebun | Pilih tanaman, tanam, siram/rawat dengan informasi singkat, lihat pertumbuhan, panen, kemudian jual atau simpan. |
| Ternak | Sediakan pakan/air, jaga kebersihan dan kenyamanan, kumpulkan hasil, tingkatkan kapasitas/fasilitas. |
| Bisnis | Tampilkan biaya, pendapatan, stok, dan keuntungan sederhana; pesanan memberi tujuan yang mudah dipahami. |
| Perkembangan | Pendapatan membuka kapasitas, otomatisasi ringan, pilihan dekorasi, dan perluasan lahan. |
| Panduan | Tutorial pendek per langkah dan peringatan yang menjelaskan tindakan berikutnya. |

### Aturan desain

- Gunakan kebutuhan yang ringkas dan mudah dilihat. Model ilmiah terperinci tidak menjadi syarat bermain.
- Tetapkan waktu produksi yang lebih cepat melalui tabel balance; simulasikan beberapa sesi untuk menghindari terlalu banyak menunggu atau uang berlimpah tanpa tujuan.
- Usulan konsekuensi: kekurangan perawatan menunda produksi atau mengurangi kualitas; pemulihan mudah dipahami. Kematian ternak permanen dan hukuman berat tidak masuk rancangan awal.
- Beri tindakan kontekstual pada objek 3D dan padanan HTML. Ringkasan stok dan biaya harus jelas sebelum tindakan berbayar.
- Pertahankan konten dasar kebun, ayam, kambing, sapi, ikan, dan market. Spesies baru, breeding, pekerja, mesin berat, serta rantai pengolahan kompleks bukan tambahan otomatis.
- Mekanisme yang diubah membutuhkan daftar perilaku lama -> perilaku baru -> pemetaan save -> tes yang relevan. Hindari mengubah semua subsistem dalam satu langkah tanpa jalur pembuktian.
- Kebijakan offline yang diusulkan: simpan timestamp bila dibutuhkan, batasi hasil offline, dan lindungi dari lonjakan jam perangkat. Durasi dan batasnya diputuskan dari balance; tidak ada hukuman offline baru secara diam-diam.

### Membangun dan menata farm

- Pemain bisa membangun, memindah, memutar, dan memperluas fasilitas di seluruh lahan yang dimiliki; zona lama menjadi panduan awal dan pintasan kamera.
- Terrain membedakan lahan dimiliki, bisa dibuka, serta area terlarang seperti batas luar atau kolam. Kebebasan penempatan tetap mengikuti footprint dan akses yang masuk akal.
- Mode bangun menyediakan katalog, biaya, preview GLB, indikator valid/tidak valid, snap yang membantu, putar, konfirmasi, dan batal.
- Preview tidak memotong uang. Konfirmasi memeriksa collision, kepemilikan, biaya, dan akses, lalu melakukan transaksi atomik.
- Pindah bangunan mempertahankan ID, hewan, stok, upgrade, dan progres produksi. Mengubah posisi bukan pembelian hewan baru.
- Jalan dan pagar memakai segmen GLB modular, dengan aturan sambungan; akses pintu bangunan harus tetap terbuka.
- Perluasan lahan berbeda dari 24 bed awal. Bed yang sudah dimiliki tetap aktif saat pindah ke versi baru.
- Usulan awal: memindahkan fasilitas tidak berbiaya agar eksplorasi tata letak terasa nyaman. Harga pembangunan/perluasan dan aturan menjual fasilitas ditetapkan setelah prototipe ekonomi.

## 8. Katalog aset yang perlu dirinci

| Kelompok | Isi minimum | Kebutuhan khusus |
| --- | --- | --- |
| Terrain dan lingkungan | Tanah, bed, tepi lahan, jalan, rumput, pohon/semak tropis, batu, pagar/gerbang | Modul tersambung, variasi material, skala konsisten, level detail. |
| Tanaman | Selada, tomat, jagung, tahap pertumbuhan dan hasil yang dibutuhkan | Tahap jelas, model ringan untuk pengulangan, animasi angin. |
| Sapi | Model/variasi yang diperlukan, rig, animasi, barn dan interior, fasilitas | Detail close-up, posisi kaki, ruang orbit, akses ke alat produksi. |
| Ayam | Ayam, coop dan interior, sarang, feeder/drinker, pagar | Ukuran hewan tetap terbaca, akses atap/interior. |
| Kambing | Kambing, shelter dan interior, fasilitas, paddock | Proporsi khas, aktivitas sesuai spesies, ruang gerak. |
| Ikan | Ikan, kolam, air, pipa, aerator dan fasilitas | Material air/ikan tetap terbaca, animasi berenang dan batas kolam. |
| Market dan fasilitas bersama | Market, wadah stok, papan, alat, dekorasi relevan | Katalog hanya berisi fasilitas yang didukung gameplay. |

Jumlah model, variasi, animasi, dan kebutuhan tekstur dihitung setelah daftar kondisi gameplay disusun. Jumlah bed atau hewan di save tidak sama dengan jumlah file model unik.

## 9. Arsitektur dan pipeline yang diusulkan

- Pisahkan state simulasi, penempatan dunia, pemetaan entity -> aset, controller kamera, asset manager, dan renderer.
- Entity memakai ID domain yang stabil. Transform lokasi/rotasi, footprint, target kamera, dan pilihan variasi model tidak bergantung pada urutan objek scene.
- Buat manifest aset versi baru yang merekam model, level detail, bounds, collider, animasi, sumber, ukuran, dan hash.
- Gunakan `GLTFLoader`; pasang decoder yang benar-benar diperlukan oleh profil export. Bandingkan mesh compression dan KTX2 pada prototipe sebelum menetapkan paket final. Three.js mendokumentasikan dukungan Draco, KTX2, dan Meshopt melalui konfigurasi loader. [Dokumentasi resmi Three.js](https://threejs.org/docs/pages/GLTFLoader.html)
- Bundel decoder lokal, tambahkan GLB/decoder/format pendukung yang dipilih ke copy/build, MIME, CSP yang diperlukan, cache, checksum, serta audit rilis. Jangan memperlebar kebijakan keamanan tanpa kebutuhan konkret.
- Beri prioritas terrain dan aset area awal, kemudian area fokus, lalu area lain. Prefetch dari niat navigasi; tampilkan progres, kegagalan, dan Retry dengan jelas.
- Mode progresif memakai level detail GLB yang sah. Ketika model belum tersedia, gunakan status HTML yang jujur; tidak ada objek palsu yang mengubah isi farm.
- Gunakan instancing untuk objek berulang dan clone rig yang aman untuk hewan. Kelola animasi sesuai jarak dan visibilitas tanpa mengubah produksi otoritatif.
- Dispose geometri, material, tekstur, bitmap, animasi, worker/decoder, dan cache sesuai kepemilikan resource. Uji pergantian area berulang.
- Pertahankan pemisahan game dari halaman editorial. Perubahan screenshot/promo homepage dilakukan setelah visual baru benar-benar siap dan dapat diambil dari game.

Struktur folder usulan, belum dibuat:

```text
art-source/                       sumber authoring dan resep export
game/client/assets/models/        GLB runtime, dikelompokkan menurut pemakaian
game/client/assets/model-manifest.json
tools/art/                        validasi, export, optimasi, dan receipt
qa-artifacts/glb-upgrade/          bukti QA; bukan aset game
```

## 10. Progres lama dan save

- Pertahankan uang, 24 bed aktif, tanaman, ternak, fasilitas, upgrade, inventori, pesanan, dan progres yang mempunyai padanan pada sistem baru.
- Buat tabel migrasi setiap field sebelum mengubah model domain. Bila suatu mekanik dihapus, tetapkan kompensasi/padanan yang eksplisit dan mudah dijelaskan.
- Arsipkan byte save asli sebelum penulisan migrasi. Migrasi idempotent; membuka ulang game tidak menggandakan uang, hewan, atau bangunan.
- Mapping layout lama menghasilkan posisi awal yang valid untuk kebun dan fasilitas, dengan identitas lama tetap terhubung ke objek 3D baru.
- Rilis migrasi hanya setelah mapping seluruh field selesai; field tanpa padanan atau kompensasi yang jelas menjadi penghalang rilis, bukan dibuang.
- Save tetap lokal, tanpa akun. Pisahkan preferensi grafis/kamera dari progres ekonomi bila memungkinkan.
- Ekspor/impor memakai versi yang dikenali, validasi data, pesan error jelas, dan proteksi terhadap konflik multi-tab serta storage penuh.
- Rollback harus dapat membaca save yang sudah ditulis versi baru atau memakai pemulihan arsip yang terbukti aman. Mengembalikan kode lama saja tidak cukup.
- Pengujian memakai save sintetis dalam profil terisolasi. Save pribadi pemain tidak dipakai sebagai fixture yang bisa dimutasi.

## 11. Performa dan batas dukungan

Kualitas visual menjadi prioritas. Dukungan perangkat lama boleh dihentikan secara eksplisit, tetapi ketidakstabilan dan pemuatan yang tidak terkendali bukan konsekuensi yang diterima secara otomatis.

- Usulan awal: desktop/laptop modern menjadi profil visual utama; dukungan HP modern ditetapkan dari prototipe nyata. Daftar GPU/RAM/browser minimum belum dapat diklaim sebelum pengukuran.
- Kandidat sasaran, belum hasil tes: 60 FPS pada profil desktop rujukan; 30 FPS pada HP modern bila dimasukkan ke dukungan rilis.
- Pilih perangkat, resolusi, DPR, kualitas, jumlah hewan/bangunan, dan scene padat yang menjadi dasar target sebelum menjalankan benchmark.
- Ukur cold/warm loading, waktu map/aksi/model siap, bytes transfer, waktu decode, frame time, draw calls, triangles, memori, serta pergantian area dan interior berulang.
- Tetapkan anggaran texture resolution, ukuran GLB, resource resident, dan kualitas bayangan setelah satu area lengkap tersedia. Batas paket lama yang dibuat untuk atlas tidak otomatis cocok untuk model baru.
- Sediakan Auto/High dan profil lebih ringan bila masih sesuai batas dukungan; semua profil tetap memakai GLB dan mempertahankan tampilan spesies/bangunan yang benar.
- Uji perangkat fisik yang benar-benar tersedia. Hasil emulasi browser dilaporkan terpisah dari FPS layar, GPU HP, panas, dan baterai.
- Perangkat di luar dukungan mendapatkan pesan yang jelas dan akses pemulihan data; kegagalan grafis tidak mereset farm.

## 12. Tahapan pengerjaan dan keluaran

| Tahap | Pekerjaan | Hasil yang harus dapat diperiksa |
| --- | --- | --- |
| P0 - Fondasi | Rekonsiliasi source/live, audit save, definisi loop baru, katalog kondisi aset, art direction tropis, kesiapan alat, desain migrasi | Spesifikasi, manifest draft, mapping data, brief model, dan profil pengukuran. |
| P1 - Pipeline dan acuan visual | Authoring contoh berkualitas, GLB loader, bundling/decoder, material/cahaya dasar, validasi dan cache | Model khusus dapat dimuat dan dilihat dekat dalam renderer sebenarnya. |
| P2 - Prototipe kebun + sapi | Terrain, tanaman, sapi beranimasi, barn/interior, orbit 360, fokus area, bangun/pindah, satu loop produksi dan penjualan | Potongan game kecil yang dimainkan dari aksi awal hingga memperoleh hasil, menyimpan, dan membuka ulang. |
| P3 - Gameplay dan tata lahan | Perluas bangun bebas, inventori/biaya/pendapatan, pesanan/perkembangan, UX kebutuhan sederhana, balance dan data penempatan | Siklus cozy/bisnis dan editor farm berfungsi lintas fasilitas dengan transaksi konsisten. |
| P4 - Seluruh farm GLB | Selesaikan ayam, kambing, ikan, market, seluruh tanaman, lingkungan, semua interior kandang, level detail dan variasi | Inventaris scene menghubungkan semua model terlihat ke aset GLB tervalidasi. |
| P5 - Polish dan optimasi | Peralihan animasi, pencahayaan, air/angin, panel, collision kamera, loading progresif, cache/resource budget | Kualitas overview dan close-up konsisten; profil perangkat terukur. |
| P6 - Migrasi dan QA terpadu | Migrasi seluruh versi save yang didukung, ekspor/impor, multi-tab, semua gameplay, bangun/pindah, kamera, responsive, resource integrity | Kandidat rilis dengan checklist, bukti yang sesuai build, serta rollback kompatibel. |
| P7 - Rilis | Siapkan artifact teruji, publikasi melalui pipeline yang berlaku ketika implementasi sudah diotorisasi, verifikasi publik dan dokumentasi | Deployment dan resource publik cocok dengan artifact, save tetap aman, laporan batas pengujian jelas. |

P2 menjadi acuan kualitas sebelum produksi aset seluruh farm diperbanyak. Desain migrasi dimulai P0, diuji dengan fixture selama pengerjaan, dan diselesaikan P6; tidak ditunda sampai seluruh gameplay selesai.

Estimasi kalender dan biaya dibuat setelah P0/P2 memberi jumlah model, kebutuhan rig/animasi, throughput authoring, dan biaya render yang nyata. Belum ada deadline, anggaran belanja, atau kapasitas produksi artist yang ditetapkan dalam interview. Kebutuhan alat/tenaga tambahan harus dijelaskan berdasarkan hasil prototipe, bukan diasumsikan tersedia.

## 13. Kriteria selesai prototipe P2

- [ ] Satu lingkungan tropis kecil seluruh modelnya berasal dari GLB, termasuk terrain, kebun, bangunan, dan sapi.
- [ ] Tanaman dapat ditanam, dirawat, bertumbuh, dipanen, dan hasilnya dijual melalui sistem gameplay yang nyata.
- [ ] Sapi mempunyai bentuk/detail yang layak close-up, rig/animasi yang rapi, dan satu loop perawatan -> produksi -> pengumpulan hasil.
- [ ] Barn lengkap luar/dalam; fasilitas dapat dilihat dengan orbit 360, zoom, dan geser tanpa tembus tanah atau tersangkut panel.
- [ ] Klik area menggerakkan kamera ke framing yang tepat; kembali dan seluruh farm bekerja.
- [ ] Bangun/pindah/putar dapat dikonfirmasi atau dibatalkan; collision dan uang benar, isi fasilitas tetap melekat.
- [ ] Save/reload mempertahankan state dan penempatan; fixture progres lama dapat dipetakan tanpa kehilangan kepemilikan.
- [ ] Review tampilan overview/menengah/dekat dilakukan pada renderer dan build yang sama.
- [ ] Bytes, decode, frame time, memori, serta keterbatasan perangkat dicatat; masalah kualitas draft tetap terbuka sampai diperbaiki.

## 14. Kriteria selesai seluruh upgrade

- [ ] Setiap model scene produksi mempunyai sumber GLB dan tercantum di manifest; inspeksi runtime tidak menemukan jalur model visible lama yang tertinggal.
- [ ] Semua aset lolos pemeriksaan format dan resource. [Khronos glTF Validator](https://github.com/KhronosGroup/glTF-Validator) menjadi salah satu alat validasi, dengan cakupan extension yang diperiksa dicatat.
- [ ] Art direction tropis, proporsi, material, detail, skala, serta animasi konsisten pada semua area.
- [ ] Overview, fokus kebun/kandang, orbit kontinu, interior, kontrol alternatif, dan pemilihan objek bekerja pada seluruh tata letak yang valid.
- [ ] Bebas bangun/pindah/perluas tidak merusak akses, isi fasilitas, transaksi, atau produksi; batal tidak mengubah ekonomi.
- [ ] Seluruh loop tanaman, ayam, kambing, sapi, ikan, market, inventori, dan perkembangan dapat dimainkan dengan kebutuhan sederhana.
- [ ] 24 bed aktif, uang, ternak, tanaman, aset, dan progres lama dipertahankan melalui mapping yang teruji; arsip, impor/ekspor, konflik multi-tab, serta rollback aman.
- [ ] Profil perangkat, hasil pengukuran, loading/retry, context loss, kebocoran resource, dan keterbatasan tes didokumentasikan.
- [ ] UI EN/ID, desktop/touch/keyboard yang didukung, panel interior dan bangun, serta reduced motion tetap dapat digunakan.
- [ ] Halaman editorial, aset yang dipertahankan, keamanan, header/cache, dan integritas resource publik diperiksa.
- [ ] Screenshot promosi berasal dari build final yang benar; tidak memakai visual konsep sebagai bukti hasil game.

Checklist ini adalah kriteria upgrade seluruh farm. Status implementasi prototipe P0-P2 dan bukti aktual dicatat di GLB_PROTOTYPE_PROGRESS.md; kelulusan prototipe tidak otomatis menyelesaikan P3-P7 atau seluruh item di atas.

## 15. Risiko dan keputusan lanjutan yang mempunyai tahap penyelesaian

| Risiko/parameter | Penanganan dalam plan |
| --- | --- |
| Model khusus belum memenuhi mutu close-up | P1/P2 membuktikan satu area; revisi bentuk, material, rig, dan animasi sebelum memperbanyak produksi. |
| Alat atau kemampuan authoring belum tersedia | P0 memastikan toolchain dan throughput; kebutuhan tambahan dilaporkan secara konkret. |
| Kamera kontinu merusak picking/cutaway lama | P2 memakai bounds model, ray picking, collision dan pengujian interior dari berbagai sudut. |
| Bangun bebas memutus asumsi zona tetap | P0/P3 memisahkan ID domain dari transform dan menjadikan target kamera relatif terhadap objek. |
| Gameplay baru menghilangkan nilai progres lama | Mapping P0, fixture sepanjang pengerjaan, arsip asli dan penghalang rilis bila ada data belum terpetakan. |
| Visual bagus tetapi terlalu berat | P2 menentukan budget per profil, disusul instancing, level detail, texture compression, serta loading sesuai kebutuhan. |
| Cakupan membesar tanpa batas | Fokus pada lima area yang sudah ada, market, dan konstruksi; fitur tambahan membutuhkan prioritas produk tersendiri. |
| Durasi dan biaya belum pasti | Estimasikan setelah inventaris dan hasil prototipe; jangan menyamakan keberhasilan export dengan selesainya produksi aset. |

P0 menyelesaikan angka balance, daftar aset/animasi, definisi interaksi, desain migrasi, dan kesiapan alat. P2 menyelesaikan framing kamera, nilai kualitas yang dapat dibuktikan, budget resource, serta rekomendasi perangkat minimum. Parameter ini merupakan pekerjaan desain dan pengukuran dalam rencana, bukan pertanyaan yang harus dijawab pemilik sebelum plan dapat dipakai.
