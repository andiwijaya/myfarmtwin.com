# Checklist implementasi Hydroponic Planner V1

**Status** — Siap dijalankan setelah pekerjaan implementasi dimulai. Target rilisnya adalah pengunjung MyFarmTwin bisa membuka contoh hidroponik dari beranda, menyesuaikannya dengan ukuran ruang, menjalankan simulasi aliran, lalu mencetak desain versi mereka.

**Scope V1** — Hidroponik menjadi twin pertama untuk produksi pangan mandiri skala rumah tangga. Produk pertamanya adalah **setup hidroponik 30 lubang tanam**. Beranda menampilkan akses ke Planner, deretan contoh desain buatan Codex yang bisa digeser horizontal, artikel, dan card Play Farm. Aksi akhir pengguna adalah **Cetak Desain**.

**Default yang bisa disesuaikan saat eksekusi** — Gunakan NFT horizontal satu tingkat, kanal paralel, satu tandon, dan satu profil tanaman daun sebagai titik awal. Mulai dengan desain unggulan 30 lubang dan dua artikel praktis. Gunakan bahasa Indonesia untuk artikel awal dan tampilkan tautan serta label yang sesuai di kedua versi beranda. Gunakan A4 untuk cetak melalui browser. Tetapkan ukuran dan rentang parameter setelah katalog komponen serta perhitungannya siap.

## 1. Baseline dan ruang lingkup rilis

- [ ] Baca aturan repo dan catat worktree, remote, `HEAD`, referensi produksi, hasil pemeriksaan awal, dan jalur rollback. Identifikasi konfigurasi Cloudflare Pages yang aktif sebelum merilis. [Struktur dan hosting repo](../README.md)
- [ ] Bandingkan `codex/seo-indexing` dengan `main` terkini. Saat checklist disusun, referensi Git lokal menunjukkan perubahan SEO dan beranda masih berada di cabang terpisah. Gunakan basis rilis yang sesuai dengan status merge aktual dan tinjau seluruh diff kandidat terhadap produksi.
- [ ] Tentukan batas template, input editor, komponen yang dapat dipindah atau diputar, dan data yang harus tersedia untuk simulasi. Catat setiap perubahan dari default beserta alasannya supaya keputusan rutin bisa diambil selama eksekusi.
- [ ] Buat entry dan build Planner terpisah dengan output terbatas ke `dist/hydroponic/`. Integrasikan tautan, kartu, artikel, dan sitemap melalui bagian situs yang relevan. Bekukan baseline runtime, aset rilis, dan kontrak save `/play/` untuk uji regresi. [Pola isolasi build](BUILD_SAFETY.md)

## 2. Model desain dan perhitungan

- [ ] Definisikan dokumen desain berversi dengan ukuran ruang, posisi dan orientasi, tipe dan ukuran komponen, jalur sambungan, profil tanaman, serta asumsi yang dipakai. Simpan panjang dalam satu satuan internal dan beri label satuan pada semua input dan output.
- [ ] Buat engine deterministik yang dapat dipanggil editor web dan CLI Codex. Dari input yang sama, hasilkan ukuran rak dan kanal, posisi lubang, daftar potong, jalur pipa, dan BOM dengan ID komponen yang konsisten.
- [ ] Rancang contoh unggulan dengan tepat 30 lubang tanam yang bisa digunakan. Bandingkan pembagian lubang per kanal berdasarkan jarak tanam, ruang servis, komponen yang tersedia, dan pemeriksaan aliran. Rekam alasan pemilihan konfigurasi dan jadikan hasilnya fixture uji utama.
- [ ] Hitung geometri dan validasi ukuran minimum, batas ruang, benturan, akses servis, kompatibilitas sambungan, serta jalur balik. Jika rak atau tandon dipindah, perbarui sambungan yang masih valid dan tampilkan bagian yang perlu dibetulkan.
- [ ] Buat katalog komponen berversi dengan dimensi dan sumber. Untuk NFT, simpan asumsi debit per kanal, beda tinggi, rugi aliran, kemiringan kanal, dan kapasitas tandon saat sistem berjalan dan saat larutan kembali setelah pompa mati. Dukung pemilihan pompa berdasarkan kurva atau data kerja yang tersedia. Tampilkan hasil sebagai estimasi dan tandai bagian yang belum bisa dihitung jika input belum cukup. [Panduan NFT Virginia Tech](https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-463/spes-463.html)
- [ ] Catat sumber, versi model, dan status bukti setiap contoh publik. Beri status **berdasarkan perhitungan** atau **diuji fisik** sesuai bukti yang ada. Untuk biaya atau hasil panen yang ditampilkan, sertakan periode, satuan, dan asumsi atau data pengamatan yang mendasarinya.

## 3. Editor, simulasi, dan cetak

- [ ] Buat alur **pilih contoh atau buat desain → masukkan ukuran ruang → sesuaikan → jalankan simulasi → cetak**. Sediakan denah 2D berdimensi, kontrol pindah dan putar komponen yang didukung, serta orbit dan zoom kamera 3D.
- [ ] Render rak, kanal, lubang, tandon, dan sambungan dari geometri hasil engine. Muat Three.js ketika diperlukan. Pastikan denah, formulir, BOM, dan cetak masih bisa digunakan bila 3D gagal dimuat.
- [ ] Tambahkan kontrol pompa hidup dan mati, tampilkan arah aliran ke tiap kanal dan kembali ke tandon, dan tampilkan perubahan estimasi debit ketika kapasitas pompa, jalur pipa, atau tinggi rak berubah. Tunjukkan komponen yang menyebabkan peringatan atau kegagalan validasi.
- [ ] Buat tampilan **Cetak Desain** dari versi yang sedang dibuka di editor. Lembar A4 berisi judul dan revisi, denah dan tampak samping berdimensi, posisi lubang, diagram aliran, serta BOM dengan jumlah, ukuran, dan spesifikasi sambungan. Cantumkan peringatan yang masih relevan. Ukuran komponen tetap terbaca dari label meski diagram diperkecil agar muat di A4.
- [ ] Buka dialog cetak browser agar pengguna bisa mencetak atau menyimpan sebagai PDF. Periksa page break, tabel panjang, keterbacaan hitam putih, dan kesamaan ukuran serta BOM dengan desain sebelum cetak. [Panduan CSS cetak MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Printing)

## 4. Contoh dari Codex, Gallery, dan artikel

- [ ] Sediakan CLI terdokumentasi yang bisa membuat serta memvalidasi contoh dari parameter, mengembalikan kesalahan yang bisa diperbaiki, dan menghasilkan materi halaman publik dari revisi desain yang sudah lolos validasi. Simpan sumber desain dan katalog bersama versi artefak yang diterbitkan.
- [ ] Terbitkan setup 30 lubang sebagai contoh pertama dan tampilkan di urutan pertama. Uji alurnya dari halaman publik hingga hasil cetak setelah dikustomisasi. Ringkasan dimensi, kapasitas, serta gambar harus cocok dengan revisi publiknya. Tambahkan contoh berikutnya saat masing-masing siap.
- [ ] Tambahkan deretan contoh geser horizontal di beranda EN dan ID dengan dukungan sentuh, keyboard, dan tautan **Lihat semua desain**. Pastikan satu card tampil wajar saat peluncuran dan uji pergeseran dengan beberapa contoh pada QA. Card memakai gambar pratinjau ringan dan membuka halaman desain dengan tautan biasa. Pada halaman desain, **Sesuaikan Desain** membuka salinan yang bisa diedit.
- [ ] Terbitkan artikel berdasarkan kebutuhan pengguna, misalnya mengukur ruang dan membaca spesifikasi pompa. Tautkan artikel ke desain terkait dan halaman desain ke artikel yang menjelaskan keputusan perakitannya.

## 5. SEO dan Google Analytics

- [ ] Beri setiap contoh dan artikel publik URL stabil, judul dan deskripsi spesifik, canonical, isi utama di HTML, dan tautan internal. Tambahkan URL publik ke sitemap. Cek respons HTTP, robots, paket bahasa beranda, dan akses ke halaman publik tanpa membuka editor. [Panduan tautan Google Search](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [ ] Gunakan konfigurasi Google tag situs yang berlaku saat eksekusi. Pasang event untuk buka desain, sesuaikan desain, jalankan simulasi, dan klik cetak. Event klik cetak mengukur interaksi dengan tombol. Batasi parameter ke data umum seperti ID contoh dan sumber navigasi.
- [ ] Uji event demo muncul sekali per tindakan dan periksa permintaan Analytics dari browser. Jika akses DebugView tersedia, verifikasi penerimaan event dan catat hasilnya. Periksa cakupan tag serta header pada rute baru bersama baseline keamanan `/play/`. [Panduan event GA4](https://developers.google.com/analytics/devguides/collection/ga4/events)

## 6. QA dan syarat lulus pratinjau

- [ ] Uji engine dengan contoh normal, ukuran batas, benturan, sambungan tidak cocok, pompa tanpa data, dan input tidak valid. Bandingkan hasil dengan hitungan referensi serta verifikasi hasil editor, CLI, halaman desain, dan lembar cetak untuk dokumen yang sama.
- [ ] Verifikasi contoh awal menampilkan tepat 30 lubang di kartu, halaman desain, denah 2D, model 3D, dan lembar cetak. Periksa secara terpisah bahwa hasil cetak mengikuti revisi pengguna setelah penyesuaian.
- [ ] Jalankan `npm run lint`, `npm run typecheck`, `npm test`, dan build di lingkungan terisolasi. Jalankan pemeriksaan Planner, beranda, SEO, dan keamanan yang relevan. Ulangi build kandidat untuk memastikan hasilnya bisa direproduksi dan verifikasi diff output.
- [ ] Lewat browser internal Codex, uji desktop dan viewport ponsel dari beranda sampai cetak. Periksa geser Gallery, navigasi keyboard, orbit dan putar komponen, perubahan aliran saat pompa dinyalakan atau dimatikan, dan tampilan saat WebGL tidak tersedia. Inspeksi halaman cetak A4 pada desain pendek dan desain dengan BOM panjang. Catat metode pemeriksaan dan cakupannya.
- [ ] Regresi `/play/` pada sesi QA terisolasi dengan save sintetis. Buka game lewat card beranda, lanjutkan, muat ulang, dan periksa pemulihan sesuai kontrak. Bandingkan save sintetis sebelum dan sesudah alur Planner. Catat bukti build dan browser untuk kandidat yang sama. [Matriks penerimaan game](COZY_WORLD_ACCEPTANCE_MATRIX.md)

## 7. Deploy, verifikasi produksi, dan pemulihan

- [ ] Ikuti aturan branch dan PR yang berlaku. Simpan artefak `dist` yang akan dideploy sesuai pola hosting repo. Kirim kandidat melalui integrasi Git yang sudah dipakai, tunggu pratinjau Cloudflare bila tersedia, lalu uji tautan publik, header, dan alur inti di pratinjau.
- [ ] Tepat sebelum merge, periksa ulang baseline produksi, perubahan `main`, hasil check, dan target rollback yang masih tersedia. Jika basis rilis berubah, cocokkan ulang diff dan jalankan pemeriksaan yang terdampak. Setelah lolos, promosikan lewat jalur `main` ke proyek Cloudflare Pages `myfarmtwin-com` dengan output `dist`, sesuai konfigurasi yang terverifikasi saat eksekusi. [Integrasi Git Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [ ] Tunggu status deploy terminal sukses dan cocokkan SHA sumber, artefak, serta ID deployment. Buka domain produksi dan URL deployment untuk memeriksa beranda EN/ID, contoh yang tampil, minimal satu alur edit → simulasi → cetak, artikel, sitemap, event yang bisa diamati, dan entry `/play/`.
- [ ] Jika produk inti atau game gagal setelah deploy, pulihkan dengan rilis perbaikan atau rollback ke deployment produksi kompatibel yang telah dicatat, sesuai dampak dan jalur yang tersedia. Verifikasi kembali domain produksi, game, dan status save setelah pemulihan. [Rollback Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/rollbacks/)
- [ ] Tutup pekerjaan dengan URL produksi, SHA dan ID deployment, daftar fitur yang diverifikasi, bukti QA, serta batas verifikasi seperti status indeks Google, penerimaan GA4, atau validasi fisik. Tandai rilis selesai setelah versi yang tepat berfungsi di domain publik.

Saat eksekusi dimulai, Codex mengerjakan tahap implementasi, QA, deploy, dan pemantauan dalam satu alur. Jika ada kegagalan teknis, diagnosis, perbaiki, dan ulangi pemeriksaan yang terdampak. Jika suatu tindakan membutuhkan akses atau persetujuan yang memang belum tersedia, lanjutkan pekerjaan lain yang bisa dilakukan dan sampaikan tindakan spesifik yang masih tertahan.
