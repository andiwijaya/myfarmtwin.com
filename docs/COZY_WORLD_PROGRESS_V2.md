# MyFarmTwin — pelaksanaan P3–P7

Tanggal mulai: 15 November 2026 (WIB). Baseline produksi: `0f9dcb65fe39a82b5c88f87f1faa34bf668b4287`; checkout awal bukti P2: `a6db19eadcf91230699fcb97c977c5ddf3297124`.

Pemilik mengotorisasi penyelesaian otonom seluruh tahap, publikasi source/model pada repository publik yang sama, deploy, dan tes. Semua pengujian browser menggunakan browser internal Codex, tanpa mengambil alih komputer. Tidak ada pengujian unggah, unduh, atau clipboard yang meminta izin pemilik. Plugin fal ditolak pemilik; aset asli dibuat melalui sumber authoring lokal.

## Checklist pelaksanaan

- [x] P0–P2: prototipe kebun dan kandang sapi dirilis; bukti terpisah di `GLB_PROTOTYPE_PROGRESS.md`.
- [ ] P3: satu domain cozy/bisnis untuk lima area, stok, transaksi, pesanan, perkembangan, serta bangun/pindah/putar/perluasan.
- [ ] P4: terrain besar, ayam/coop, kambing/shelter, kolam/ikan, market, interior, dan sumber GLB seluruh model.
- [ ] P5: cahaya waktu farm, air/angin, animasi, kamera per bangunan, loading, profil kualitas, serta pengelolaan resource.
- [ ] P6: migrasi V0–V6/P2, arsip asli, impor/ekspor/pemulihan, konflik multi-tab, QA gameplay dan responsive di browser internal.
- [ ] P7: artifact/checksum, preview teruji, deploy produksi, kesamaan artifact publik, tes produksi, serta laporan akhir.

## Keputusan implementasi

Game penuh menjadi entri `/play/`; `/play/glb/` mengarah ke game dan penyimpanan yang sama. Satu jam simulasi dan satu ekonomi menjadi sumber seluruh area. Model buatan sendiri dikirim GLB dengan manifest/checksum. Lampu, kamera, collider tak terlihat, efek material dan UI bukan model tambahan.

Penyimpanan baru menggabungkan state dan penempatan pada satu record atomik. Save asli tetap diarsipkan persis sebelum penulisan pertama; detail mekanik lama yang diganti ikut dalam provenance cadangan. Migrasi tidak memberi uang atau hewan hanya karena halaman dibuka. Pemetaan setiap subsistem serta perilaku pemulihan wajib dibuktikan sebelum rilis.

## Bukti dan batas verifikasi

Belum ada klaim P3–P7 selesai atau live. Hasil unit, validasi model, preview, migrasi, dan produksi dicatat sesudah dilakukan pada artifact sebenarnya. Resolusi browser kecil adalah pemeriksaan tata letak desktop pada viewport tersebut, bukan tes perangkat fisik, FPS GPU ponsel, suhu, baterai, atau Safari.

### Checkpoint implementasi sebelum browser

- Domain cozy lima area, market/pesanan, transaksi, tata lahan dan penyimpanan V2 sudah diimplementasikan. 23 tes domain dan 13 tes storage baru lolos. Regresi sebelumnya: 576 tes lolos; satu suite cache HTTP dipisahkan karena lingkungan jaringan. Hitungan ini merupakan kelompok terpisah.
- Fixture lama V0–V6 dan P2 diuji dengan sumber sintetis. Fixture kaya dibuat melalui 217 dispatch sah; uang, ID ternak, dua kolam, stok pecahan, kualitas/nilai hasil lama, pesanan aktif, kredit layanan dan uang muka dipertahankan dengan padanan eksplisit.
- Seluruh 22 GLB manifest termasuk lima varian detail jauh telah lolos validator Khronos tanpa error, warning atau info sebelum penyempurnaan pose terakhir. Validasi diulang pada bytes akhir sebelum publikasi.
- `cozy-world.js` mengelola satu scene GLB, animasi dekat/jauh, instancing lingkungan, kamera interior mengikuti transform, dan audit provenance mesh. Grafik tidak menulis state farm.
- Pemulihan tanpa WebGL dan artifact rollback yang mempertahankan pembaca V2 disiapkan. Pengembalian kode V6 saja tidak dianggap rollback kompatibel.
- Pengujian interaksi, kualitas visual, responsive dan produksi masih menunggu build preview stabil. P3–P7 belum ditandai selesai.
