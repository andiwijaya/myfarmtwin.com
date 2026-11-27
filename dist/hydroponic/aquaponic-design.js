// Aquaponics geometry uses metres. The gallery's shared site dimensions use millimetres.
const point = (x, y, z) => ({x, y, z});
const pond = {x: 0.91, z: 1.55, r: 0.65, height: 0.65, water: 0.45};
const filters = [
  {name: 'Filter padatan', x: 1.87, z: 0.49, r: 0.23, bottom: 0.29, height: 0.71, color: '#bb8e55'},
  {name: 'Biofilter', x: 2.64, z: 0.49, r: 0.24, bottom: 0.24, height: 0.71, color: '#668c78'}
];
const beds = [1.34, 1.93].map((z, i) => ({
  name: `Talang ${i + 1}`, x: 2.64, z, width: 1.56, depth: 0.34, bottom: 0.7, lip: 0.86, water: 0.79,
  pots: Array.from({length: 6}, (_, j) => point(2.64 + (j - 2.5) * 0.245, 0.86, z))
}));

const supply = [
  [point(0.96, 0.12, 1.37), point(0.96, 0.99, 1.37), point(0.96, 1.025, 0.49), point(1.87, 1.025, 0.49), point(1.87, 0.94, 0.49)],
  [point(2.07, 0.925, 0.49), point(2.40, 0.895, 0.49)],
  [point(2.64, 0.86, 0.72), point(1.78, 0.84, 0.72), point(1.78, 0.827, 1.34), point(1.78, 0.815, 1.93)],
  ...beds.map(bed => [point(1.78, bed.z <= 1.34 ? 0.827 : 0.815, bed.z), point(1.89, 0.806, bed.z), point(1.99, bed.water, bed.z)])
];
const returns = [
  ...beds.map(bed => [point(3.37, 0.785, bed.z), point(3.48, 0.725, bed.z)]),
  [point(3.48, 0.725, 1.34), point(3.48, 0.697, 1.93), point(3.48, 0.68, 2.18), point(1.42, 0.58, 2.18), point(1.22, 0.55, 1.97)],
  [point(1.22, 0.55, 1.97), point(1.22, pond.water, 1.97)]
];

export const aquaponic = {
  kind: 'aquaponic',
  design: {id: 'akuaponik-nila', title: 'Akuaponik Nila dan Sayuran', titleEn: 'Tilapia & Greens Aquaponics', revision: 1, siteWidth: 3600, siteDepth: 2600},
  holeCount: beds.reduce((count, bed) => count + bed.pots.length, 0),
  pond, beds, filters, supply, returns,
  pump: supply[0][0],
  returnPoint: returns.at(-1).at(-1),
  litres: Math.PI * pond.r ** 2 * pond.water * 1000,
  sources: {
    rutgers: 'https://extension.rutgers.edu/fs1351',
    arizona: 'https://extension.arizona.edu/publication/aquaponics-basics-how-fish-plants-and-microbes-work-together'
  }
};

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
