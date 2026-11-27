// Aquaponics geometry uses metres. The gallery's shared site dimensions use millimetres.
const point = (x, y, z) => ({x, y, z});
const pond = {x: 0.91, z: 1.55, r: 0.65, height: 0.65, water: 0.45};
const solidIn = point(1.64, 0.600, 0.49);
const solidOut = point(2.10, 0.865, 0.49);
const bioIn = point(2.40, 0.425, 0.49);
const bioOut = point(2.64, 0.780, 0.73);
const solidDrain = point(1.87, .29, .49);
const bioDrain = point(2.64, .24, .49);
const solidInletPipe = [solidIn,point(1.87,.60,.49),point(1.87,.86,.49)];
const solidOutletPipe = [point(2.071,.865,.49),solidOut];
const bioInletPipe = [bioIn,point(2.61,.425,.49)];
const bioOutletPipe = [point(2.64,.83,.642),point(2.64,.780,.642),bioOut];
const solids = {
  id:'solids', name:'Filter padatan', title:'Drum 1 · Pengendap radial', x:1.87, z:.49, r:.23,
  bottom:.29, height:.71, water:.90, color:'#bb8e55',
  inlet:{at:solidIn,dn:25}, outlet:{at:solidOut,dn:40}, drain:{at:solidDrain,dn:32},
  well:{r:.085, bottom:.56, top:.965, inletTip:.86},
  weir:{r:.185, floor:.84, crest:.90},
  hopper:{r:.214, base:.30, shoulder:.495},
  internalInlet:solidInletPipe,
  internalOutlet:solidOutletPipe,
  waste:[solidDrain,point(1.87,.195,.49),point(1.87,.195,.81)],
  flow:[
    solidInletPipe,
    ...[-1,1].map(side => [point(1.87+side*.045,.853,.49),point(1.87+side*.052,.545,.49),point(1.87+side*.153,.539,.49),point(1.87+side*.169,.89,.49),point(1.87+side*.206,.908,.49),point(1.87+side*.205,.865,.49)]),
    solidOutletPipe
  ]
};
const bio = {
  id:'bio', name:'Biofilter', title:'Drum 2 · Biofilter media bergerak', x:2.64, z:.49, r:.24,
  bottom:.24, height:.71, water:.83, color:'#668c78',
  inlet:{at:bioIn,dn:40}, outlet:{at:bioOut,dn:40}, drain:{at:bioDrain,dn:32},
  screen:{x:2.64,z:.642,r:.063,bottom:.625,top:.88,crest:.83},
  diffuser:{x:2.64,y:.315,z:.49,r:.10},
  internalInlet:bioInletPipe,
  internalOutlet:bioOutletPipe,
  waste:[bioDrain,point(2.64,.145,.49),point(2.64,.145,.81)],
  flow:[
    [...bioInletPipe,point(2.74,.451,.45),point(2.77,.60,.45),point(2.74,.743,.533),point(2.674,.818,.588),...bioOutletPipe],
    [bioInletPipe.at(-1),point(2.54,.49,.54),point(2.54,.658,.525),point(2.56,.771,.576),bioOutletPipe[0]]
  ]
};
const filters = [solids, bio];
const beds = [1.34, 1.93].map((z, i) => ({
  name: `Talang ${i + 1}`, x: 2.64, z, width: 1.56, depth: 0.34, bottom: .64, lip: .80, water: .73,
  pots: Array.from({length: 6}, (_, j) => point(2.64 + (j - 2.5) * 0.245, .80, z))
}));

const supply = [
  [point(.96,.12,1.37),point(.96,1.01,1.37),point(.96,1.04,.49),point(1.52,1.04,.49),point(1.52,.60,.49),solidIn],
  [solidOut,point(2.22,.851,.49),point(2.31,.435,.49),bioIn],
  [bioOut,point(2.64,.773,.81),point(1.78,.753,.81),point(1.78,.744,1.34),point(1.78,.737,1.93)],
  ...beds.map((bed,i) => [point(1.78,i === 0 ? .744 : .737,bed.z),point(1.89,i === 0 ? .741 : .735,bed.z),point(1.99,bed.water,bed.z)])
];
for (const [i, filter] of filters.entries()) {
  const incoming = supply[i].slice(-2);
  const outgoing = supply[i+1].slice(0,2);
  if (filter === bio) {
    // Keep the turn toward the manifold visible in the close-up.
    const [,elbow,next] = supply[i+1];
    const portion = .21;
    outgoing.push(point(elbow.x+(next.x-elbow.x)*portion,elbow.y+(next.y-elbow.y)*portion,elbow.z+(next.z-elbow.z)*portion));
  }
  filter.focusLeads = [incoming,outgoing];
  filter.focusFlow = filter.flow.map((route, j) => [
    ...(j === 0 ? incoming.slice(0,-1) : []),
    ...route,
    ...(route.at(-1) === filter.outlet.at ? outgoing.slice(1) : [])
  ]);
}
const returns = [
  ...beds.map((bed,i) => [point(3.37,.728,bed.z),point(3.48,i === 0 ? .692 : .677,bed.z)]),
  [point(3.48,.692,1.34),point(3.48,.677,1.93),point(3.48,.648,2.18),point(1.42,.58,2.18),point(1.22,.55,1.97)],
  [point(1.22, 0.55, 1.97), point(1.22, pond.water, 1.97)]
];

export const aquaponic = {
  kind: 'aquaponic',
  design: {id: 'akuaponik-nila', title: 'Akuaponik Nila dan Sayuran', titleEn: 'Tilapia & Greens Aquaponics', revision: 2, siteWidth: 3600, siteDepth: 2600},
  holeCount: beds.reduce((count, bed) => count + bed.pots.length, 0),
  pond, beds, filters, supply, returns,
  flowSpeed: {overview: .43, filter: .11},
  pump: supply[0][0],
  returnPoint: returns[returns.length - 1][1],
  litres: Math.PI * pond.r ** 2 * pond.water * 1000,
  sources: {
    rutgers: 'https://extension.rutgers.edu/fs1351',
    arizona: 'https://extension.arizona.edu/publication/aquaponics-basics-how-fish-plants-and-microbes-work-together',
    radial: 'https://www.ars.usda.gov/research/publications/publication/?seqNo115=243934',
    biofilter: 'https://srac.tamu.edu/fact-sheets/serve/241'
  }
};

export function validateFilterGeometry() {
  const falling = route => route.every((p, i) => !i || p.y <= route[i-1].y);
  const [lift, betweenDrums, toBeds] = supply;
  if (lift[lift.length-1] !== solids.inlet.at || betweenDrums[0] !== solids.outlet.at || betweenDrums[betweenDrums.length-1] !== bio.inlet.at || toBeds[0] !== bio.outlet.at) {
    throw new Error('External piping must meet every drum bulkhead.');
  }
  if (filters.some(f => f.internalInlet[0] !== f.inlet.at || f.internalOutlet.at(-1) !== f.outlet.at || f.waste[0] !== f.drain.at || f.drain.at.y !== f.bottom)) {
    throw new Error('Internal pipes and drains must connect to their annotated ports.');
  }
  if (![...supply.slice(1), ...returns].every(falling) || !(solids.water > bio.water && beds.every(bed => bio.water > bed.water && bed.water > pond.water))) {
    throw new Error('Gravity leg must descend between consecutive water surfaces.');
  }
  if (!(solids.hopper.shoulder < solids.well.bottom && solids.well.bottom < solids.well.inletTip && solids.well.inletTip < solids.weir.crest && solids.weir.floor < solids.outlet.at.y && solids.outlet.at.y < solids.weir.crest && solids.well.top > solids.weir.crest)) {
    throw new Error('Radial settling collar and overflow gutter are inconsistent.');
  }
  if (!(bio.diffuser.y < bio.inlet.at.y && bio.inlet.at.y < bio.outlet.at.y && bio.outlet.at.y < bio.screen.crest && bio.screen.crest < bio.screen.top)) {
    throw new Error('Moving-bed inlet, diffuser and screened overflow are inconsistent.');
  }
}

const mm = value => Math.round(value * 1000);

function filterSection(f) {
  const y = height => Math.round(310 - height * 278);
  const x = offset => Math.round(184 + offset / f.r * 83);
  const left = x(-f.r), right = x(f.r), top = y(f.bottom+f.height), base = y(f.bottom), level = y(f.water);
  const badge = (cx,cy,value) => `<circle cx="${cx}" cy="${cy}" r="11" fill="#275b50"/><text x="${cx}" y="${cy+4}" text-anchor="middle" fill="white" class="filter-badge">${value}</text>`;
  const traced = pts => `<polyline points="${pts.map(([u,v])=>`${x(u)},${y(v)}`).join(' ')}" class="filter-flow" marker-end="url(#${f.id}-arrow)"/>`;
  const supplyPipe = pts => `<polyline points="${pts.map(([u,v])=>`${x(u)},${y(v)}`).join(' ')}" class="filter-pipe"/>`;
  const inY=f.inlet.at.y, outY=f.outlet.at.y;
  const inside = f.id === 'solids' ? `
    <path d="M${x(-f.hopper.r)} ${y(f.hopper.shoulder)} L${x(0)} ${y(f.hopper.base)} L${x(f.hopper.r)} ${y(f.hopper.shoulder)}" class="filter-hopper"/>
    <path d="M${x(-f.well.r)} ${y(f.well.top)} V${y(f.well.bottom)} M${x(f.well.r)} ${y(f.well.top)} V${y(f.well.bottom)}" class="filter-internal"/>
    <path d="M${left} ${y(f.weir.floor)} H${x(-f.weir.r)} V${y(f.weir.crest)} M${right} ${y(f.weir.floor)} H${x(f.weir.r)} V${y(f.weir.crest)}" class="filter-internal"/>
    ${supplyPipe([[-f.r-.11,inY],[0,inY],[0,f.well.inletTip]])}${supplyPipe([[f.weir.r+.013,outY],[f.r+.12,outY]])}
    ${traced([[-f.r-.080,inY],[0,inY],[0,f.well.inletTip-.025]])}
    ${[-1,1].map(side=>traced([[side*.043,.83],[side*.054,.542],[side*.151,.543],[side*.169,.87],[side*.206,.903]])).join('')}
    ${traced([[f.weir.r+.017,outY],[f.r+.105,outY]])}
    <text x="184" y="${y(f.well.top)-9}" text-anchor="middle" class="filter-label">Tabung penenang</text>
    <text x="${right+12}" y="${level-13}" class="filter-label">Bibir limpah</text>` : `
    <path d="M${x(.114)} ${y(f.screen.top)} V${y(f.screen.bottom)} H${x(.224)} V${y(f.screen.top)} Z" fill="url(#${f.id}-screen)" class="filter-internal"/>
    ${supplyPipe([[-f.r-.12,inY],[f.internalInlet.at(-1).x-f.x,inY]])}${supplyPipe([[.168,f.screen.crest],[.168,outY],[f.r+.12,outY]])}
    ${traced([[-f.r-.093,inY],[f.internalInlet.at(-1).x-f.x,inY],[.066,.461],[.068,.625],[.104,.760],[.165,f.screen.crest]])}
    ${traced([[.168,f.screen.crest],[.168,outY],[f.r+.101,outY]])}
    <path d="M${x(-.13)} ${y(f.diffuser.y)} H${x(.10)} M${x(-.10)} ${y(f.diffuser.y)} V${y(.73)} M${x(.04)} ${y(f.diffuser.y)} V${y(.70)}" class="filter-air"/>
    <text x="184" y="${y(f.diffuser.y)+20}" text-anchor="middle" class="filter-label">Difuser udara</text>
    <text x="${right+10}" y="${y(f.screen.top)-8}" class="filter-label">Saringan media</text>`;
  return `<svg class="filter-section-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 10 408 300" role="img" aria-label="${f.title}, potongan pipa, jalur air, dan kuras terpisah">
    <defs><marker id="${f.id}-arrow" markerWidth="7" markerHeight="6" refX="5" refY="3" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0 L7 3 L0 6z" fill="#138475"/></marker><pattern id="${f.id}-screen" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 7L7 0" stroke="#69847a" stroke-width="1"/></pattern></defs>
    <rect x="${left}" y="${level}" width="${right-left}" height="${base-level}" fill="#d9ebe6"/>
    <path d="M${left} ${top}V${base}H${right}V${top}" class="filter-shell"/>
    <path d="M${left} ${level}H${right}" class="filter-level"/>
    ${inside}<path d="M184 ${y(f.drain.at.y)}V${y(f.drain.at.y)+25}h43" class="filter-waste"/>
    <path d="M178 ${base+14}l12 9m-12 0 12-9" class="filter-valve"/>
    ${badge(43,y(inY),'1')}${badge(343,y(outY),'2')}${badge(249,base+25,'3')}
    <text x="17" y="${level-12}" class="filter-label">+${mm(f.water)} mm</text>
  </svg>`;
}

export function filterDetails() {
  const labels = [
    ['Dari pompa kolam, masuk dari sisi drum. Belokan di tengah mengarahkan air ke atas di dalam tabung penenang.', 'Air turun melewati bawah tabung, bergerak ke tepi, lalu melimpah ke talang cincin. Outlet dari talang menuju inlet rendah Drum 2.', 'Dasar miring mengumpulkan endapan ke kuras pusat. Katup kuras tertutup saat sirkulasi.'],
    ['Dari Drum 1, masuk di sisi bawah. Air bergerak naik melewati media biofilter yang digerakkan oleh udara dari difuser bawah.', 'Saringan menahan media sebelum air masuk ke standpipe pelimpah, lalu keluar menuju talang tanam. Saringan harus tetap dapat diangkat dan dibersihkan.', 'Kuras dasar untuk servis. Katup tertutup saat sirkulasi.']
  ];
  const elevations = filters.map((f,i) => `<article class="filter-card"><h3>${f.title}</h3>${filterSection(f)}<dl class="filter-ports">${['inlet','outlet','drain'].map((key,j)=>`<div><dt>${j+1}. ${['Inlet','Outlet','Kuras'][j]} · DN${f[key].dn} · +${mm(f[key].at.y)} mm</dt><dd>${labels[i][j]}</dd></div>`).join('')}</dl>
    <p class="small">${i===0 ? `Tabung penenang Ø${mm(f.well.r*2)} mm, tepi bawah +${mm(f.well.bottom)} mm. Ujung pipa tengah +${mm(f.well.inletTip)} mm. Bibir limpah +${mm(f.weir.crest)} mm.` : `Bibir standpipe +${mm(f.screen.crest)} mm. Saringan mengelilingi mulut standpipe dan bukaan lebih kecil dari media. Pusat difuser udara +${mm(f.diffuser.y)} mm.`}</p></article>`).join('');
  const dropToBio=mm(solids.water-bio.water), dropToBed=mm(bio.water-beds[0].water);
  return `<section class="panel wide filter-details" id="detail-filter"><h2>Potongan pipa kedua drum</h2><p>Elevasi dari lantai bersama ke sumbu sambungan. Elevasi kuras adalah dasar drum, dan elevasi limpah diukur ke bibir pelimpah. DN menunjukkan ukuran nominal rancangan.</p><div class="filter-grid">${elevations}</div><p class="notice">Selisih muka air rancangan ${dropToBio} mm dari Drum 1 ke Drum 2 dan ${dropToBed} mm dari Drum 2 ke talang. Untuk menghitung debit antardrum, gunakan muka air aktual di talang cincin dan perhitungkan rugi pipa.</p><p class="small">Uji debit kerja dan limpasan saat stop maupun saat outlet mulai kotor. Periksa proteksi sifon, ventilasi, volume media berdasarkan pakan, dan aerasi sebelum menebar ikan. Diagram memakai aliran konseptual.</p></section>`;
}

const twoDimensional = p => `${p.x},${p.z}`;
const pipe = (points, kind) => `<polyline points="${points.map(twoDimensional).join(' ')}" class="pipe pipe-${kind}" vector-effect="non-scaling-stroke"/>`;

export function aquaponicPlan() {
  const {design, pond, filters, beds, supply, returns} = aquaponic;
  const width = design.siteWidth / 1000;
  const depth = design.siteDepth / 1000;
  return `<svg class="drawing aquaponic-plan" xmlns="http://www.w3.org/2000/svg" viewBox="-.25 -.32 ${width+.46} ${depth+.51}" role="img" aria-label="Denah akuaponik dari atas, area 3,6 × 2,6 m, kolam bulat, dua filter, dan 12 pot" style="font-size:.115px">
  <rect width="${width}" height="${depth}" rx=".04" fill="#f4f7f0" stroke="#8ca699" stroke-width=".013"/>
  <path d="M0 -.12h${width}M-.12 0v${depth}" fill="none" stroke="#576d64" stroke-width=".009"/>
  <text x="${width/2}" y="-.18" text-anchor="middle">3.600 mm</text><text x="-.18" y="${depth/2}" transform="rotate(-90 -.18 ${depth/2})" text-anchor="middle">2.600 mm</text>
  <circle cx="${pond.x}" cy="${pond.z}" r="${pond.r}" fill="#c4ded8" stroke="#416e64" stroke-width=".025"/>
  ${filters.map(filter => `<circle cx="${filter.x}" cy="${filter.z}" r="${filter.r}" fill="${filter.color}" opacity=".68"/>`).join('')}
  ${beds.map(bed => `<rect x="${bed.x - bed.width/2}" y="${bed.z - bed.depth/2}" width="${bed.width}" height="${bed.depth}" rx=".03" fill="#e1eadb" stroke="#648675" stroke-width=".014"/>${bed.pots.map(p => `<circle cx="${p.x}" cy="${p.z}" r=".081" fill="#4b7d58" stroke="#fff" stroke-width=".011" data-aqua-pot="true"/>`).join('')}`).join('')}
  ${supply.map(route => pipe(route, 'feed')).join('')}${returns.map(route => pipe(route, 'return')).join('')}
  <circle cx="${aquaponic.pump.x}" cy="${aquaponic.pump.z}" r=".044" fill="#174b3f"/>
  <text x="${pond.x}" y="${pond.z+.06}" text-anchor="middle">Kolam nila</text>
  ${filters.map(filter => `<text x="${filter.x}" y=".16" text-anchor="middle">${filter.name}</text>`).join('')}
  <text x="2.64" y="2.47" text-anchor="middle">Dua talang, enam pot per talang</text>
  </svg>`;
}

export function aquaponicPoster() {
  const {pond, filters, beds, supply, returns} = aquaponic;
  const projection = ({x, y, z}) => [x * 154 - z * 107, x * 48 + z * 40 - y * 158];
  const xy = p => projection(p).map(k => Math.round(k * 10) / 10).join(',');
  const polygon = (pts, color, outline = 'none', stroke = 1) => `<polygon points="${pts.map(xy).join(' ')}" fill="${color}" stroke="${outline}" stroke-width="${stroke}"/>`;
  const line = (pts, color, width) => `<polyline points="${pts.map(xy).join(' ')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
  function ring(x, z, y, r) {
    return Array.from({length: 41}, (_, i) => point(x + r * Math.cos(i / 40 * 2 * Math.PI), y, z + r * Math.sin(i / 40 * 2 * Math.PI)));
  }
  function vessel(x, z, base, height, radius, side, top) {
    const lower = ring(x, z, base, radius);
    const upper = ring(x, z, base + height, radius);
    const front = vertices => vertices.slice(16, 37);
    return polygon([...front(upper), ...front(lower).reverse()], side, '#55776a', 1.1) + polygon(upper, top, '#527768', 2);
  }
  const planted = [...beds].reverse().map(bed => {
    const x0 = bed.x - bed.width / 2, x1 = bed.x + bed.width / 2, z0 = bed.z - bed.depth / 2, z1 = bed.z + bed.depth / 2;
    const at = y => [point(x0,y,z0), point(x1,y,z0), point(x1,y,z1), point(x0,y,z1)];
    const top = at(bed.lip), bottom = at(bed.bottom);
    return [top[0],top[1],top[2],top[3]].map(p => line([p, {...p,y:0}], '#556f67', 4)).join('') +
      polygon([top[2],top[3],bottom[3],bottom[2]], '#8da69a', '#53776b') + polygon(top, '#d4e2d4', '#53776b', 2) +
      bed.pots.map(p => {
        const [cx, cy] = projection({...p,y:p.y+.09});
        return `<g transform="translate(${cx} ${cy})"><ellipse rx="13" ry="6.5" fill="#46783e" transform="rotate(-26)"/><ellipse rx="11" ry="5.8" fill="#70a34d" transform="rotate(30)"/><ellipse rx="5" ry="10" fill="#87ae5d" transform="rotate(12)"/></g>`;
      }).join('');
  }).join('');
  const water = polygon(ring(pond.x, pond.z, pond.height, pond.r * .90), '#8fcfc8', '#d3eeea', 2);
  const fish = [[.72,1.42,20],[1.03,1.73,-21],[.93,1.28,55]].map(([x,z,angle]) => {
    const [cx,cy] = projection(point(x, pond.height, z));
    return `<g transform="translate(${cx} ${cy}) rotate(${angle})" fill="#527a70"><ellipse rx="13" ry="4.4"/><path d="m-10 0-8-4v8z"/><circle cx="7" cy="-1" r="1" fill="#dce8d9"/></g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-291 -125 877 446" role="img" aria-label="Rancangan kolam nila dengan filter dan dua talang tanaman">
  <defs><linearGradient id="background" x2="1" y2="1"><stop stop-color="#f1eee0"/><stop offset="1" stop-color="#d5ebe4"/></linearGradient></defs>
  <rect x="-291" y="-125" width="877" height="446" fill="url(#background)"/>
  ${polygon([point(0,0,0),point(3.6,0,0),point(3.6,0,2.6),point(0,0,2.6)], '#dce6d7', '#b0c3b4', 2)}
  ${filters.map(f => vessel(f.x,f.z,f.bottom,f.height,f.r,f.color,'#e5e5cc')).join('')}
  ${planted}${vessel(pond.x,pond.z,0,pond.height,pond.r,'#357367','#579987')}${water}${fish}
  ${supply.map(route => line(route.slice(route === supply[0] ? 1 : 0),'#157c74', 4)).join('')}
  ${returns.map(route => line(route,'#447baa', 4)).join('')}
  </svg>`;
}
