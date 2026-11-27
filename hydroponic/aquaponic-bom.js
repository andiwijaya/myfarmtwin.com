import {aquaponic} from './aquaponic-design.js';

const [drum1, drum2] = aquaponic.filters;
const [lift, betweenDrums, toBeds] = aquaponic.supply;
const rigid = [
  {label:'Inlet dalam Drum 1', dn:drum1.inlet.dn, path:drum1.internalInlet},
  {label:'Kuras Drum 1', dn:drum1.drain.dn, path:drum1.waste},
  {label:'Inlet dalam Drum 2', dn:drum2.inlet.dn, path:drum2.internalInlet},
  {label:'Standpipe dan outlet dalam Drum 2', dn:drum2.outlet.dn, path:drum2.internalOutlet},
  {label:'Kuras Drum 2', dn:drum2.drain.dn, path:drum2.waste}
];
const hose = [
  {label:'Pompa → inlet Drum 1', id:25, path:lift},
  {label:'Outlet Drum 1 → inlet Drum 2', id:38, path:betweenDrums},
  {label:'Outlet Drum 2 → inlet manifold talang', id:38, path:toBeds.slice(0,3)}
];
const ports = [
  {label:'Inlet Drum 1', dn:drum1.inlet.dn},
  {label:'Outlet Drum 1', dn:drum1.outlet.dn},
  {label:'Kuras Drum 1', dn:drum1.drain.dn},
  {label:'Inlet Drum 2', dn:drum2.inlet.dn},
  {label:'Outlet Drum 2', dn:drum2.outlet.dn},
  {label:'Kuras Drum 2', dn:drum2.drain.dn}
];

const vector = (from, to) => [to.x-from.x,to.y-from.y,to.z-from.z];
const spans = path => path.slice(1).map((to,i) => vector(path[i],to));
const length = path => spans(path).reduce((total, span) => total+Math.hypot(...span),0);
const metres = new Intl.NumberFormat('id-ID',{minimumFractionDigits:2,maximumFractionDigits:2});
const tenths = new Intl.NumberFormat('id-ID',{minimumFractionDigits:1,maximumFractionDigits:1});
const nominal = dn => `DN${dn}`;
const inside = id => `ID ${id} mm`;
const names = items => items.map(item => item.label).join(', ');
const totalLength = items => items.reduce((total,item) => total+length(item.path),0);
const purchaseLength = items => `≥ ${tenths.format(Math.ceil(totalLength(items)*11)/10)} m`;

function elbowCount(path) {
  const pieces = spans(path);
  for (const [i, after] of pieces.slice(1).entries()) {
    const before = pieces[i];
    if (Math.abs(before.reduce((dot,axis,j) => dot+axis*after[j],0)) > 1e-8) {
      throw new Error('A rigid filter route needs a fitting other than a 90-degree elbow.');
    }
  }
  return pieces.length-1;
}

function table(title, headers, rows) {
  return `<div class="table-wrap"><table class="bill-table"><caption>${title}</caption>
    <thead><tr>${headers.map(header => `<th scope="col">${header}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(([name,...cells]) => `<tr><th scope="row">${name}</th>${cells.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table></div>`;
}

export function aquaponicPipeBill() {
  const sizes = [...new Set(ports.map(port => port.dn))].sort((a,b) => a-b);
  const shopping = [
    ...sizes.map(dn => {
      const items = rigid.filter(item => item.dn === dn);
      const pieces = items.reduce((total,item) => total+item.path.length-1,0);
      return ['Pipa uPVC',nominal(dn),purchaseLength(items),`${pieces} ruas lurus. ${names(items)}.`];
    }),
    ...[25,38].map(id => {
      const items = hose.filter(item => item.id === id);
      return ['Selang diperkuat, sisi dalam halus',inside(id),purchaseLength(items),`${items.length} jalur. ${names(items)}.`];
    }),
    ...sizes.map(dn => {
      const items = ports.filter(port => port.dn === dn);
      return ['Sambungan tembus drum (bulkhead) + gasket',nominal(dn),`${items.length} set`,names(items)];
    }),
    ...sizes.map(dn => {
      const items = rigid.filter(item => item.dn === dn && item.path.length>2);
      const count = items.reduce((total,item) => total+elbowCount(item.path),0);
      return ['Siku 90° uPVC',nominal(dn),`${count} buah`,names(items)];
    }),
    ['Katup bola union',nominal(drum1.drain.dn),'2 buah','Satu di ruas horizontal setiap jalur kuras.'],
    ['Adaptor ekor selang sisi pompa',`Outlet pompa → ${inside(hose[0].id)}`,'1 set','Ambil sisi ulir atau soket sesuai outlet pompa.'],
    ['Adaptor ekor selang sisi inlet',`${nominal(drum1.inlet.dn)} → ${inside(hose[0].id)}`,'1 set','Di bulkhead inlet Drum 1.'],
    ['Adaptor ekor selang jalur gravitasi',`${nominal(drum1.outlet.dn)} → ${inside(hose[1].id)}`,'4 set','Outlet Drum 1, inlet dan outlet Drum 2, serta inlet manifold.'],
    ['Klem selang tahan korosi',`Untuk selang ${inside(hose[0].id)}`,'2 buah','Satu di setiap ujung selang pompa. Pilih rentang klem dari diameter luar selang.'],
    ['Klem selang tahan korosi',`Untuk selang ${inside(hose[1].id)}`,'4 buah','Satu di setiap ujung kedua selang gravitasi. Pilih rentang klem dari diameter luar selang.']
  ];
  const runs = [
    ...rigid.map(({label,dn,path}) => [label,nominal(dn),`${metres.format(length(path))} m`,
      spans(path).map(span => `${Math.round(Math.hypot(...span)*1000)} mm`).join(' + ')]),
    ['Outlet dalam Drum 1',nominal(drum1.outlet.dn),'—','Mulut bulkhead langsung di talang limpah.'],
    ...hose.map(({label,id,path}) => [label,inside(id),`${metres.format(length(path))} m`,'Selang satu jalur utuh.'])
  ];
  return `<section class="panel wide filter-bom" aria-labelledby="daftar-bahan-filter">
    <h2 id="daftar-bahan-filter">Daftar bahan pipa dan fitting kedua drum</h2>
    <p>Mencakup jalur dari pompa ke kedua drum sampai inlet manifold talang, bagian dalam drum, dan kuras. DN adalah ukuran nominal pipa dan fitting. ID adalah diameter dalam selang.</p>
    ${table('Daftar belanja',['Bahan','Ukuran','Jumlah','Lokasi'],shopping)}
    ${table('Panjang jalur pada denah',['Jalur','Ukuran','Panjang','Ruas pada denah'],runs)}
    <p class="small">Jumlah beli pipa dan selang sudah termasuk cadangan 10% dan dibulatkan ke atas ke 0,1 m. Panjang tiap ruas diukur dari sumbu jalur. Ukur ulang potongan setelah menentukan kedalaman soket dan panjang badan fitting serta katup. Pilih satu seri uPVC untuk air bersih yang kompatibel, cocokkan ulir adaptor dengan bulkhead, dan beri tikungan selang yang landai. Pertahankan jalur gravitasi terus menurun.</p>
  </section>`;
}
