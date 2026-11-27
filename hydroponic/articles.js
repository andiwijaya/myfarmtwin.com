export const articles = [
  {
    id: 'ukur-area',
    title: 'Cara mengukur teras untuk rak hidroponik',
    description: 'Ukur area, ruang buka tandon, dan akses servis sebelum menyesuaikan rancangan hidroponik NFT 30 lubang.',
    content: `<section><h2>Ukur area yang benar-benar bebas</h2><p>Ukur sisi panjang dan lebar pada lantai. Sisihkan ruang yang terpotong pintu, kolom, saluran air, atau jalur orang lewat. Jika bentuk teras tidak beraturan, mulai dari persegi panjang bebas terbesar yang bisa kamu gunakan. Masukkan panjang dan lebar itu ke Planner dalam milimeter.</p></section>
    <section><h2>Periksa rak dan tandon secara terpisah</h2><p>Contoh 30 lubang memakai rak satu tingkat dan tandon di samping. Ukuran area rancangan mencakup tempat berdiri, ruang melepas tutup, dan jalur untuk membawa tandon saat dibersihkan. Lihat zona akses pada denah, putar rak bila perlu, lalu coba jalur membawa bahan dengan ukuran yang akan dibeli.</p></section>
    <section><h2>Cek cahaya dan posisi pompa</h2><p>Amati bagian teras yang mendapat cahaya sepanjang hari dan bagaimana bayangan berubah. Periksa tempat tandon yang mudah ditutup, dibersihkan, dan dijangkau tanpa menarik kabel pompa atau menempatkan sambungan listrik di area basah.</p></section>
    <section><h2>Cocokkan ukuran sebelum mengebor</h2><p>Cetak denah dengan angka dimensi. Ukur komponen yang benar-benar tersedia, termasuk net pot dan profil kanal, sebelum memotong. Angka pada cetakan adalah acuan ukuran kerja. Skala fisik gambar menyesuaikan kertas.</p></section>`,
    sources: [['University of Minnesota Extension · Hidroponik skala kecil', 'https://extension.umn.edu/garden-and-home/yard-and-garden/gardening-in-minnesota/small-scale-hydroponics']]
  },
  {
    id: 'pilih-pompa',
    title: 'Cara membaca kurva pompa hidroponik NFT',
    description: 'Pahami beda debit maksimum, tinggi angkat, dan debit kerja saat memilih serta menguji pompa untuk kanal NFT.',
    content: `<section><h2>Mulai dari debit yang dibutuhkan kanal</h2><p>Rancangan lima kanal memakai target awal 0,25 L/menit per kanal, atau 1,25 L/menit total. Angka ini adalah asumsi desain dalam rentang acuan Virginia Tech. Ukur hasilnya di setiap outlet setelah perakitan karena katup, fitting, dan panjang jalur dapat membuat pembagian debit berbeda.</p></section>
    <section><h2>Baca debit pada tinggi angkat kerja</h2><p>Kurva pompa menunjukkan debit yang tersedia pada berbagai tinggi angkat. Ukur beda tinggi dari permukaan larutan di tandon ke suplai tertinggi. Tambahkan taksiran hambatan pipa dan fitting. Cari debit pada tinggi angkat tersebut di kurva pabrikan. Angka maksimum debit dan maksimum tinggi pada kotak pompa menggambarkan dua keadaan yang berbeda.</p></section>
    <section><h2>Atur tiap kanal dan uji jalur balik</h2><p>Gunakan katup cabang untuk menyetel aliran. Pada rancangan contoh, bypass mengarahkan kelebihan aliran kembali ke tandon. Uji dengan air bersih dan bandingkan volume yang terkumpul selama waktu yang sama pada tiap outlet. Matikan pompa untuk memastikan tandon masih menampung larutan yang turun dari sistem.</p></section>
    <section><h2>Hitung listrik dari daya dan lama operasi</h2><p>Perkiraan konsumsi dalam kWh adalah daya dalam watt dikalikan jam operasi lalu dibagi 1.000. Pada 8 W dan 24 jam sehari, perkiraannya 5,76 kWh selama 30 hari. Untuk biaya, kalikan kWh dengan tarif meter yang berlaku di tempatmu.</p></section>`,
    sources: [
      ['Virginia Tech Extension · Debit dan komponen NFT', 'https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-463/spes-463.html'],
      ['Sicce · Kurva teknis pompa Syncra Silent', 'https://us.sicce.com/media/wysiwyg/UTSD207-A_EN-DE_catalogo2018_ISSUU.pdf']
    ]
  }
];
