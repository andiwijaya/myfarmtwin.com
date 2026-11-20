# Katalog aset GLB Cozy World V2

Authoring awal dilakukan pada **15 November 2026**. Sambungan tanah ke panorama diperbarui pada **20 November 2026**. Manifest versi 2 di `game/client/assets/models/world-manifest.json` mencatat **17 aset logis** dan **22 berkas GLB**, termasuk lima varian jarak jauh, dengan total **14.488.860 byte** sebelum kompresi HTTP. Empat belas GLB ada di `world/` dan delapan aset prototipe memakai URL aslinya.

Seluruh geometri yang terlihat disediakan sebagai GLB. Siluet organik, fasilitas interior, permukaan air, tanah, jalan, dan vegetasi dibuat di tahap authoring lalu diekspor. Fungsi geometri pada `tools/art/` berjalan di Node saat pembuatan aset dan bukan pembuat mesh di renderer game.

## Arah visual dan isi

Gaya visual mengikuti keputusan produk: semi-realistis yang hangat, peternakan tropis Indonesia, bahan alami dan bentuk yang mudah dibaca dari kamera farm maupun kamera interior. Model hewan menggunakan profil anatomi yang ditaper, bukan rangkaian kubus. Material mengikuti PBR glTF dengan base color, roughness/metalness, dan normal map asli yang ditanam dalam GLB bila relevan. Frame tangent untuk normal map dibakukan saat ekspor.

| Aset logis | Isi utama | Byte dekat | Segitiga unik |
| --- | --- | ---: | ---: |
| `terrain` | Permukaan rumput 88 × 68 m dengan tepian setinggi tanah yang menyatu ke panorama sawah | 890.748 | 15.712 |
| `coop` | Kandang ayam 9 × 7 m; ventilasi bambu/kawat, pintu terbuka, litter sekam, tiga sarang berisi telur, tenggeran/tangga, hopper pakan, drinker, perkakas | 1.807.756 | 23.992 |
| `chicken` | Ayam kampung betina: torso berbentuk pir, hackle, bulu sayap bertumpuk, ekor kipas, jengger kecil, pial, mata, paruh, kaki bersisik dan empat jari | 871.760 | 21.206 |
| `goatShelter` | Kandang 11 × 9 m; lantai papan bercelah yang ditopang tiang batu, ramp, sekat, trough air/pakan, rak hijauan, alas kering dan alat | 1.647.128 | 11.916 |
| `goat` | Kambing terinspirasi Peranakan Etawa: torso ramping dalam, leher naik, hidung cembung, telinga menggantung, tanduk melengkung, janggut, hock dan kuku belah | 847.232 | 17.544 |
| `goatKid` | Anak kambing dengan kepala relatif lebih besar dan bakal tanduk; tidak sekadar mengecilkan semua proporsi dewasa | 719.844 | 12.744 |
| `pond` | Kolam bundar sudut 12 × 10 m, dinding/lantai, air transparan bermaterial ripple, suplai/drain tersaring, pompa, platform, aerator paddle dan gelembung | 558.036 | 8.420 |
| `fish` | Nila: tubuh pipih lateral, pola sisik, operkulum, mata/lip, sirip punggung berduri, ekor kipas dan sirip dada terartikulasi | 281.164 | 5.668 |
| `market` | Pasar 7 × 6 m dengan gudang: atap tanah liat, dinding plester/bambu, meja hasil panen, peti sayuran, rak stok, karung, timbangan, bel dan perkakas | 2.157.684 | 52.172 |
| `barn` | Kandang sapi prototipe lengkap 10 × 8 m, dipakai ulang tanpa duplikasi berkas | 875.472 | 12.192 |
| `cow` | Sapi perah asli prototipe, dengan tambahan joint leher/lutut/kuku serta pose minum dan istirahat; bentuk berdiri dan jumlah segitiga dipertahankan | 417.292 | 12.766 |
| `bed` | Tanah bed beralur dan bingkai kayu; luas tanam 1,5 × 1,8 m | 238.304 | 1.788 |
| `crops` | Pustaka 13 tahap tanaman selada, tomat dan jagung | 319.836 | 10.888 |
| `props` | Trough, ember susu, peti, karung, pompa dan batu | 450.732 | 2.348 |
| `vegetation` | Pisang, kelapa, rumpun rumput dan semak | 483.124 | 12.962 |
| `path` | Modul jalan tanah padat 2 × 2 m dengan kerikil | 106.940 | 1.212 |
| `fence` | Modul pagar kayu panjang 2 m dengan tutup tiang | 117.212 | 64 |

Jumlah segitiga di atas menghitung geometri unik yang diekspor. Jumlah instance dalam farm, tingkat LOD aktif, bayangan, DPR dan posisi kamera menentukan biaya render sesungguhnya. Angka ini bukan pengukuran FPS pada perangkat fisik.

## Sistem koordinat dan batas penempatan

Semua aset memakai meter dan sumbu atas `+Y`. Hewan menghadap `+X`; bagian depan bangunan menghadap `+Z`. Titik asal model berada pada bidang referensi lantai. Tanah buildable rata pada `Y = 0`, dengan batas `X = -44…44` dan `Z = -34…34`. Penampang tanah berada di bawah bidang tersebut.

`footprint` menyatakan luas lantai atau modul, sedangkan `bounds.min/max` menghitung seluruh mesh termasuk teritisan, pintu terbuka, ramp dan pipa. Gunakan bounds bila pemeriksaan membutuhkan ruang fisik lengkap. Contohnya, pintu coop yang terbuka melewati sisi depan lantai; ramp goat shelter melewati tepi depan nominal; pipa drain pond melewati sisi kanannya sekitar 8 cm.

| Area | `interiorFloorY` | Nilai tambahan |
| --- | ---: | --- |
| Barn | 0 | Target interior `[0, 1.3, 0]` |
| Coop | 0 | Target interior `[0, 0.8, -0.3]` |
| Goat shelter | 0,34 | Target interior `[0, 1.1, -0.3]`; kaki hewan ditaruh di atas lantai ini |
| Pond | 0,12 | `waterSurfaceY = 0.52`, `fishRootY = 0.17`; wilayah ikan `[[-4.6, 0.14, -3.6], [4.6, 0.25, 3.6]]` |
| Market | 0 | Target interior `[0, 1, 0]` |

Tinggi hewan berdiri di model dekat: ayam sekitar 0,725 m, kambing dewasa termasuk tanduk 1,429 m, anak kambing 0,772 m, sapi 1,71 m. Panjang nila sekitar 0,438 m dan batas vertikalnya sekitar 0,010–0,238 m. Posisi ikan harus mempertimbangkan tinggi model agar tetap di bawah permukaan air.

## Kontrak manifest dan node

URL di manifest bersifat absolut terhadap aplikasi, misalnya `/play/assets/models/world/coop.glb` atau `/play/assets/models/prototype/cow.glb`. Setiap record memuat `id`, `url`, `sha256`, `bytes`, `uniqueTriangles`, `meshes`, `nodes`, `textures`, `animations`, `bounds`, `templates`, `roles`, dan metadata penempatan yang relevan. `externalResources` bernilai `false`. Record LOD berada di `asset.lod.far` dan menyertakan URL/hash/ukuran/bounds tersendiri.

Bangunan baru memiliki node `roof`, `floor`, `frame`, `walls`, dan `equipment`. Root importer dapat menyembunyikan `roof` untuk cutaway interior. `feed_contents` dan `water_contents` merupakan node agregat yang mengontrol seluruh isi trough, drinker atau rak di dalam bangunan tersebut. Transform komponen dipertahankan ketika diagregasi. Mengubah visibility node isi tidak menghilangkan wadah/fasilitasnya.

| Area | Node semantik tambahan |
| --- | --- |
| Coop | `nests`, `nest_eggs`, `roosts`, `entry_gate` |
| Goat shelter | `stalls`, `bedding`, `entry_ramp` |
| Pond | `water_contents`, `water_surface`, `rim`, `pond_lined_floor`, `aerator`, `aerator_rotor`, `aerator_bubbles` |
| Market | `stock_contents`, `warehouse_shelves`, `order_crate` |
| Ayam | `body`, `neck`, `head`, `tail`, `wing_left/right`, `leg_left/right`, `shank_left/right`, `foot_left/right` |
| Kambing/sapi | `neck`, `head`, `tail`, `leg_front_left/right`, `leg_rear_left/right`, serta `lower_*` dan `foot_*` untuk tiap kaki |
| Ikan | `tail`, `fin_left`, `fin_right` |

Sapi/barn/properti/tanaman/vegetasi memakai node asli prototipe; record `roles` menjelaskan node yang merupakan kontrak utama. Sebagian material atau geometri dapat dipakai bersama antar-clone. Bila ingin mengubah properti material hanya pada satu instance, clone material instance tersebut terlebih dahulu.

Field `templates` dari exporter mencantumkan anak langsung root sebagai diagnostik. Tiga aset berikut memang pustaka template; ambil satu node yang dimaksud, bukan menampilkan seluruh pustaka pada koordinat yang sama:

- `crops`: `lettuce_0` sampai `lettuce_3`, `tomato_0` sampai `tomato_3`, dan `corn_0` sampai `corn_4`.
- `vegetation`: `banana`, `palm`, `grass`, `shrub`.
- `props`: `feed_trough`, `water_trough`, `milk_pail`, `crate`, `feed_bag`, `pump`, `rock`.

## Animasi dan LOD

Ayam, kambing dewasa, anak kambing dan sapi memiliki clip glTF bernama `idle`, `walk`, `eat`, `drink`, dan `rest`. Nila memiliki `idle` dan `swim`. Clip menggunakan transform kelompok yang benar-benar terartikulasi; tidak berupa penggantian gambar atau sekadar rotasi seluruh hewan.

Pose makan/minum membengkokkan node leher bersama kepala. Pose istirahat memiliki joint kaki bawah dan kaki/kuku yang menjaga orientasi tumpuan. Gerak root untuk transisi istirahat dibakukan dari batas vertex aktual pada 24 sampel per detik; gerak root jalan dibakukan pada minimal 48 sampel per detik. Hasilnya ditulis sebagai track glTF agar kaki tidak turun menembus lantai pada ayunan langkah. Clip `rest` berdurasi 6 detik: turun, bertahan, dan berdiri kembali. Tidak ada skin deformable, IK, simulasi sendi fisik, atau klaim motion capture.

| Varian jauh | Byte | Segitiga unik | Ambang awal, meter |
| --- | ---: | ---: | ---: |
| Chicken far | 420.140 | 5.274 | 24 |
| Goat far | 476.384 | 4.062 | 28 |
| Goat kid far | 460.836 | 3.606 | 24 |
| Fish far | 171.520 | 1.000 | 18 |
| Vegetation far | 169.716 | 1.640 | 27 |

LOD dibuat khusus dengan radial/feather/frond/leaflet lebih sedikit dan mempertahankan bentuk, nama template, serta nama node animasi. Aset dekat dan jauh mempunyai root internal yang sama (`chicken`, `goat`, `goat_kid`, `fish`). Bila keduanya berada di dalam satu `THREE.LOD`, bind animasi pada masing-masing root melalui `AnimationObjectGroup` atau mixer per root. Satu mixer dengan pencarian nama biasa dapat hanya menemukan root dekat pertama.

## Penataan interior setelah pemeriksaan browser internal

Pemeriksaan awal interior kambing memperlihatkan penempatan hewan yang melintasi sekat. Trough pakan belakang juga semula melintasi rail memanjang. Geometri kemudian diperbaiki: dua trough tersebut berputar 90° sehingga panjangnya mengikuti sumbu Z, tetap pada `X = ±1.7`, `Z = -2.65`.

Barn sekarang menyediakan enam stall yang menghadap lorong tengah. Divider mengikuti X dari `|X| = 1.55` sampai `4.7`, pada `Z = -3.35, -1.1, 1.1, 3.35`. Neck rail berada pada `X = ±1.50` agar tidak bersinggungan dengan envelope moncong saat animasi. Dua trough lorong berada pada `X = ±1.05`, `Z = 0`, rotasi Y 90°, dan panjang lokal X dikalikan 2,6. Lebar lorong bebas di antara trough sekitar 1,33 m. Footprint barn tetap 10 × 8 m dan pivot tidak berubah.

Koordinat berikut berada dalam ruang lokal bangunan. Tambahkan rotasi bangunan ke heading hewan, lalu rotasikan posisi X/Z dengan rotasi Y bangunan. Heading `0` menghadap `+X`, heading `π` menghadap `-X`.

| Penghuni | Koordinat root lokal | Heading |
| --- | --- | --- |
| Tiga sapi kiri | `X = -3.2`, `Y = 0.038`, `Z = -2.2, 0, 2.2` | `0` |
| Tiga sapi kanan | `X = 3.2`, `Y = 0.038`, `Z = -2.2, 0, 2.2` | `π` |
| Dua kambing belakang kiri | `X = -3.15`, `Y = 0.342`, `Z = -3.58, -1.65` | `π` |
| Dua kambing belakang kanan | `X = 3.15`, `Y = 0.342`, `Z = -3.58, -1.65` | `0` |
| Dua kambing tengah kiri | `X = -3.15`, `Y = 0.379`, `Z = -0.55, 0.65` | `π` |
| Dua kambing tengah kanan | `X = 3.15`, `Y = 0.379`, `Z = -0.55, 0.65` | `0` |
| Dua kambing depan kiri | `X = -3.0`, `Y = 0.342`, `Z = 2.0, 3.6` | `0` |
| Satu kambing depan kanan | `X = 3.0`, `Y = 0.342`, `Z = 2.0` | `π` |
| Dua belas ayam | Kombinasi `X = -2.35, 0, 2.35` dan `Z = -1.5, -0.4, 0.95, 2.15`, `Y = 0.035` | Kiri `0`, kanan `π`, kolom tengah bergantian `±π/2` |

Y kambing tengah mengikuti bagian atas alas jerami `0.3775`; kambing lainnya mengikuti papan lantai `0.34`. Y sapi mengikuti alas dengan permukaan `0.0355`, sedangkan ayam mengikuti litter dengan permukaan `0.034`. Anak kambing dapat memakai anchor dewasa yang sama.

Envelope X/Z dari seluruh clip yang disampel: sapi sekitar `X = -1.262…1.618`, `Z = ±0.44`; kambing sekitar `X = -0.705…0.963`, `Z = ±0.24`; ayam sekitar `X = -0.449…0.451`, `Z = -0.185…0.189`. Susunan enam sapi memberikan jarak terhadap divider Z sekitar 0,62 m atau lebih, dan jarak minimum terhadap neck rail sekitar 0,046 m sebelum pergeseran kosmetik. Batasi pergeseran horizontal hewan sekitar 0,03 m di anchor agar tidak menghabiskan clearance bagian belakang kandang dan rail barn. Jangkauan moncong ke isi trough belum merupakan simulasi kontak fisik atau navigasi mencari makan.

### Koreksi permukaan slab dari closeup browser

Closeup interior sapi memperlihatkan rumput bergaris pada lorong akibat permukaan slab yang coplanar dengan terrain `Y = 0`. Perbaikannya hanya menaikkan slab barn/coop dari center `-0.09` ke `-0.084` dengan tinggi tetap `0.18`, dan slab market dari center `-0.08` ke `-0.074` dengan tinggi tetap `0.16`. Permukaan beton kini `Y = 0.006`. Pivot, `interiorFloorY` sebagai referensi penempatan, bedding, drain dan seluruh anchor hewan dipertahankan. Bagian atas drain `0.008` tetap di atas beton. Tidak ada bangunan atau seluruh kelompok lantai yang digeser.

SHA-256 setelah koreksi slab:

| GLB | SHA-256 | Byte |
| --- | --- | ---: |
| `prototype/barn.glb` | `25a177e03f24debe3581990244132950d1a240b94ec9bf727b0e5353f05780c2` | 875.472 |
| `world/coop.glb` | `16151052d2bce3ca5535b72353c9d0c054609165331c7a1c394ef19a37789158` | 1.807.756 |
| `world/market.glb` | `c40be41e85f6068867108efd6daf09e12726b833efb0225fb001a13fe734a807` | 2.157.684 |

Prototype dan world manifest sudah diregenerasi; resource/determinisme 22/22 lolos dan Khronos kembali menghasilkan 0 error, 0 warning, 0 info pada seluruh 22 GLB. Perubahan byte hanya pada tiga GLB di tabel tersebut.

## Reproduksi dan bukti validasi

Perintah dari root repositori:

```powershell
node tools/art/glb-prototype-build.mjs
node tools/art/cozy-world-build.mjs
node tools/art/cozy-world-validate.mjs --deterministic
node tools/art/cozy-world-khronos-validate.mjs
node tools/art/cozy-world-pose-validate.mjs
```

Build prototipe dilakukan lebih dahulu karena world manifest memakai hash/ukuran aset prototipe terkini. Menjalankan world build kembali menghasilkan manifest dan semua hash GLB yang sama; tidak ada timestamp build acak dalam aset.

- **Validator resmi Khronos**, versi package `2.0.0-dev.3.10`: 22/22 GLB yang dirujuk world manifest, **0 error, 0 warning, 0 info**, tanpa issue yang disembunyikan atau diubah severity. Laporan penuh: `qa-artifacts/cozy-world/gltf-validation/summary.json` dan satu JSON per aset.
- **Validator buffer/resource independen**: 22/22 lolos pemeriksaan header/chunk, resource PNG tertanam, finite/range accessor, indices, material, normal map, target/waktu/quaternion animasi, nama node kontrak, bounds yang dihitung dari GLB, pengurangan LOD, dan hash. Hasil: `game/client/assets/models/world/resource-validation.json`.
- **Reproduksibilitas**: build kedua menghasilkan manifest byte-identik, termasuk hash 22 GLB yang dirujuk. Bukti berada pada field `determinism` di laporan resource.
- **Kontak lantai pose jalan dan istirahat**: 121 waktu per clip pada tujuh model dekat/jauh, total **1.694 sampel walk/rest**, dievaluasi dari GLB hasil ekspor dengan `Three.AnimationMixer` dan bounds vertex presisi. Semua lolos toleransi 2 mm. Nila tidak memakai pose istirahat. Nilai minimum sapi sekitar −0,234 mm pada interpolasi; model baru tetap di atas lantai. Hasil: `game/client/assets/models/world/pose-validation.json`.
- **Pemeriksaan tekstur authoring**: contact sheet ditinjau langsung melalui image viewer. Baris pertama: bulu ayam, rambut kambing, sisik nila; baris kedua: rumput, bambu, plester. Berkas: `game/client/assets/models/world/original-texture-contact-sheet.png`. Seluruh tekstur yang dipakai GLB tetap ditanam dalam masing-masing GLB.

Perbaikan exporter mencakup normal nol pada ujung daun/telinga yang kolaps, menggunakan normal permukaan nyata di vertex berimpit/bersebelahan. Koordinat, silhouette, pivot dan triangle posisi prototipe dipertahankan. UV yang tidak dipakai material solid dihilangkan. Frame tangent normal map dibakukan dan diortogonalkan; seluruhnya lolos validator resmi.

Validasi di atas membuktikan struktur aset, konsistensi kontrak dan batas kontak lantai. Penilaian akhir material di pencahayaan game, kenyamanan orbit/interior, skala adegan, transisi LOD serta kelancaran dilakukan pada browser internal oleh integrasi utama. Katalog ini tidak menyatakan hasil perangkat fisik atau FPS yang belum diukur.

## Berkas sumber

- `tools/art/cozy-world-common.mjs`: tekstur asli, material PBR dan helper bentuk.
- `tools/art/cozy-world-animals.mjs`: anatomi dan clip ayam, kambing/kid, nila.
- `tools/art/cozy-world-environment.mjs`: terrain, kandang/interior, kolam, pasar, vegetasi jauh.
- `tools/art/cozy-world-pose-tools.mjs`: pembakuan root motion kontak lantai.
- `tools/art/cozy-world-cow-poses.mjs`: joint/clip tambahan pada geometri sapi prototipe.
- `tools/art/cozy-world-export.mjs`: normal map tertanam dan penulisan deterministik world GLB.
- `tools/art/cozy-world-build.mjs`: build, manifest, hash dan contact sheet.
- `tools/art/glb-prototype-export.mjs`: penulisan GLB dasar, sanitasi normal/tangent dan packing statis.
- `tools/art/glb-prototype-build.mjs`: rebuild kit prototipe dan pemasangan clip sapi tambahan.
- `tools/art/cozy-world-validate.mjs`, `cozy-world-khronos-validate.mjs`, `cozy-world-pose-validate.mjs`: pemeriksaan yang dapat dijalankan ulang.

Semua model merupakan interpretasi artistik buatan proyek. Katalog ini tidak menyatakan kesetiaan zoologi atau arsitektur terhadap satu peternakan tertentu.
