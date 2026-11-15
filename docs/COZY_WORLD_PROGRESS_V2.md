# MyFarmTwin â€” pelaksanaan P3â€“P7

Tanggal mulai: 15 November 2026 (WIB). Baseline produksi: `0f9dcb65fe39a82b5c88f87f1faa34bf668b4287`; checkout awal bukti P2: `a6db19eadcf91230699fcb97c977c5ddf3297124`.

Pemilik mengotorisasi penyelesaian otonom seluruh tahap, publikasi source/model pada repository publik yang sama, deploy, dan tes. Semua pengujian browser menggunakan browser internal Codex, tanpa mengambil alih komputer. Tidak ada pengujian unggah, unduh, atau clipboard yang meminta izin pemilik. Plugin fal ditolak pemilik; aset asli dibuat melalui sumber authoring lokal.

## Checklist pelaksanaan

- [x] P0â€“P2: prototipe kebun dan kandang sapi dirilis; bukti terpisah di `GLB_PROTOTYPE_PROGRESS.md`.
- [x] P3: satu domain cozy/bisnis untuk lima area, stok, transaksi, pesanan, perkembangan, serta bangun/pindah/putar/perluasan. Siklus dan transaksi lintas area diverifikasi di browser internal.
- [x] P4: terrain besar, ayam/coop, kambing/shelter, kolam/ikan, market, interior, dan sumber GLB seluruh model. 22 file runtime, termasuk lima LOD jauh; seluruh model scene yang diperiksa mempunyai sumber GLB.
- [x] P5: cahaya waktu farm, air/angin, animasi, kamera per bangunan, loading, profil kualitas, serta pengelolaan resource.
- [x] P6: migrasi V0â€“V6/P2, arsip asli, impor/ekspor/pemulihan, konflik multi-tab, QA gameplay dan responsive di browser internal. Detail sumber, batas dan hasil: `COZY_WORLD_RELEASE_V2.md`.
- [x] P7: artifact/checksum, preview teruji, deploy produksi, kesamaan artifact publik, tes produksi, serta laporan akhir.

## Keputusan implementasi

Game penuh menjadi entri `/play/`; `/play/glb/` mengarah ke game dan penyimpanan yang sama. Satu jam simulasi dan satu ekonomi menjadi sumber seluruh area. Model buatan sendiri dikirim GLB dengan manifest/checksum. Lampu, kamera, collider tak terlihat, efek material dan UI bukan model tambahan.

Penyimpanan baru menggabungkan state dan penempatan pada satu record atomik. Save asli tetap diarsipkan persis sebelum penulisan pertama; detail mekanik lama yang diganti ikut dalam provenance cadangan. Migrasi tidak memberi uang atau hewan hanya karena halaman dibuka. Pemetaan setiap subsistem serta perilaku pemulihan wajib dibuktikan sebelum rilis.

## Bukti dan batas verifikasi

Belum ada klaim P3â€“P7 selesai atau live. Hasil unit, validasi model, preview, migrasi, dan produksi dicatat sesudah dilakukan pada artifact sebenarnya. Resolusi browser kecil adalah pemeriksaan tata letak desktop pada viewport tersebut, bukan tes perangkat fisik, FPS GPU ponsel, suhu, baterai, atau Safari.

### Checkpoint implementasi sebelum browser

- Domain cozy lima area, market/pesanan, transaksi, tata lahan dan penyimpanan V2 sudah diimplementasikan. 23 tes domain dan 13 tes storage baru lolos. Regresi sebelumnya: 576 tes lolos; satu suite cache HTTP dipisahkan karena lingkungan jaringan. Hitungan ini merupakan kelompok terpisah.
- Fixture lama V0â€“V6 dan P2 diuji dengan sumber sintetis. Fixture kaya dibuat melalui 217 dispatch sah; uang, ID ternak, dua kolam, stok pecahan, kualitas/nilai hasil lama, pesanan aktif, kredit layanan dan uang muka dipertahankan dengan padanan eksplisit.
- Seluruh 22 GLB manifest termasuk lima varian detail jauh telah lolos validator Khronos tanpa error, warning atau info sebelum penyempurnaan pose terakhir. Validasi diulang pada bytes akhir sebelum publikasi.
- `cozy-world.js` mengelola satu scene GLB, animasi dekat/jauh, instancing lingkungan, kamera interior mengikuti transform, dan audit provenance mesh. Grafik tidak menulis state farm.
- Pemulihan tanpa WebGL dan artifact rollback yang mempertahankan pembaca V2 disiapkan. Pengembalian kode V6 saja tidak dianggap rollback kompatibel.
- Pengujian interaksi, kualitas visual, responsive dan produksi masih menunggu build preview stabil. P3â€“P7 belum ditandai selesai.

### Checkpoint browser internal â€” sumber `c64ab60`

Preview `https://b7449934.myfarmtwin-com.pages.dev/play/` memuat seluruh 22 GLB. Tiga tanaman selesai ditanam, disiram, dipanen, dan dipakai dalam tiga pesanan lintas area. Ayam, sapi, kambing, dan ikan melalui produksi/penjualan/pembelian yang sah. Perawatan yang kurang memperlambat ikan; setelah dibersihkan dan diganti air, ikan kembali tumbuh dan dipanen tanpa kehilangan ternak.

Pindah/putar kandang mempertahankan seluruh isi dan tidak memotong uang; preview collision/luar lahan/batal tidak mengubah save. Kandang tambahan berbayar tidak mengulang starter kit. Bed ke-25 dan perluasan lahan berhasil dibeli. Reload, impor rusak, dua pemulihan snapshot, backup sebelumnya, alias `/play/glb/`, konflik dua tab, dan pembaca pemulihan V2 diverifikasi lewat UI.

Fixture V0â€“V5 serta V6/P2 kaya berhasil diimpor dengan uang dan byte sumber asli tetap sama. Fixture P2 mempertahankan barn `x=9,z=8,rotation=Ï€/2` dan seluruh 24 bed. Cadangan besar dibaca per potongan textarea untuk menghindari batas keluaran alat; ini bukan pemotongan data aplikasi.

Pengukuran viewport aktual (bukan hanya permintaan override) berhasil pada 320Ã—740, 390Ã—844, 768Ã—1024, 844Ã—390, dan 1440Ã—900 tanpa overflow horizontal. Klik model pada viewport 390Ã—844 tidak melakukan aksi farm. Navigasi otomatis ke panel ponsel disederhanakan menjadi perpindahan langsung setelah ditemukan pergeseran halaman saat kontrol dipilih cepat.

Preview awal `f1300c2` menemukan error `AnimationObjectGroup.uncacheRoot` setelah panen. Implementasi kini memakai mixer terpisah per root dekat/jauh; tes regresi lifecycle dan pengulangan panen/jual/impor di browser berikutnya lolos tanpa error. Posisi hewan dan sekat/trough kandang diselaraskan dengan kapasitas model.

45 tes domain/storage terakhir lolos. Kelompok foundation terbaru 50 tes juga lolos, terdiri dari 45 domain/storage, dua delivery, satu lifecycle animasi, dan dua header (header tumpang tindih dengan regresi 576). Semua angka kelompok tidak dijumlah ulang sebagai tes unik.

Farm padat untuk QA berasal dari 100 command sah dan memuat 24 tanaman. Screenshot serta observasi frame/resource dicatat di `qa-artifacts/cozy-world/internal-browser/`. Angka RAF browser internal bukan FPS perangkat fisik. P5/P6 masih menunggu pemeriksaan ulang build terakhir; P7 belum dipromosikan ke produksi.

### Penyempurnaan kandidat akhir

Profil padat memperlihatkan sekitar 1.800 draw call ketika setiap tanaman digandakan sebagai mesh tersendiri. Tanaman sekarang dibatch melalui instancing dari geometry GLB yang sama; picking instance tetap mengarah ke ID bed, animasi angin memakai transform instance, dan tahap tumbuh serta pindah/panen membangun ulang batch secara terukur. Ini mempertahankan geometri dekat sambil mengurangi overhead pengiriman gambar. Perbandingan aktual dicatat setelah kandidat baru dimuat di browser.

URL model diberi versi dari checksum manifest agar browser pemain yang pernah membuka P2 tidak menggunakan barn/sapi lama yang masih tercache. Manifest direvalidasi. Source geometry tetap sama dan resource publik diuji menggunakan hash bytes yang dihitung langsung dalam halaman browser internal `/play/integrity/`.

Pemulihan tanpa 3D juga menyediakan penyelesaian jurnal P2 yang valid di bawah Web Lock, dengan ekspor cabang P2 dan primary V2 tetap terpisah. Dua tes tambahan membuktikan primary V2 tidak berubah, jurnal tidak mengulang command, dan konflik/read-only tidak menulis. Data corrupt atau versi lebih baru tetap dilindungi.

### Penutupan P5–P7 — produksi final

- [x] Koreksi slab barn/coop/market 6 mm sudah divalidasi pada GLB final; tampilan dekat barn/market ditinjau langsung, tanpa flicker lantai yang ditemukan sebelumnya.
- [x] Preview final `f0b6fa9` dan produksi memakai entry yang sama `app-QXJW6TRQ.js` dan manifest `c593ace2574bc5b617c74469de6925ddc20d6bfa6be15121d96294c35e5b682b`.
- [x] Kedua origin produksi lolos 30/30 checksum aktual browser, termasuk 22/22 GLB. Audit scene produksi: nol mesh tanpa sumber GLB.
- [x] Sebelas kelompok smoke produksi lolos: panen/jual, susu, kamera interior, placement/batal, pindah kandang berisi, reload, bahasa, impor cadangan, reader pemulihan, homepage, dan resource scene. Data sintetis hanya di origin immutable yang sebelumnya belum digunakan.
- [x] Save pemain di domain utama dibaca tanpa aksi gameplay; ekspor sebelum/sesudah kamera serta kembali dari homepage identik. Tidak ada cadangan pemain yang disimpan sebagai fixture atau dipublikasikan.
- [x] Artifact 18,383,315 byte diverifikasi; 301 game files byte-identik, ditambah satu metadata hosting normalisasi resmi. Reader rollback final disiapkan tanpa menghapus key progres.
- [x] 52/52 foundation, 576 regresi non-network, typecheck, build, dan validator resmi 22/22 GLB lolos. Kelompok tes yang tumpang tindih tidak dijumlah sebagai tes unik.

Cakupan yang tidak tersedia tetap dicatat: perangkat fisik, Safari, touch/pinch native, GPU VRAM/FPS perangkat, panas/baterai dan pembacaan screen reader. Pengujian upload/download/clipboard tidak dijalankan. Fitur opsional partial harvest ikan dan remove/refund bangunan bukan bagian UI rilis ini.
