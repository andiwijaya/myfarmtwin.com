// Geometry uses integer millimetres, with X/Z measured from the upper-left corner of the plan.
export const engineering = Object.freeze({
  channelWidth: 100, channelHeight: 50, holeDiameter: 50, minEndGap: 75,
  tankWidth: 560, tankDepth: 400, tankHeight: 320, tankBaseM2: 0.52 * 0.36,
  tankCapacityL: 50, tankLidPortY: 310, serviceDepth: 300,
  feedId: 16, branchId: 8, returnId: 32, targetChannelLpm: 0.25, minimumChannelLpm: 0.19,
  returnSlope: 0.02, runningFilmMm: 5,
  curveSource: 'https://us.sicce.com/media/wysiwyg/UTSD207-A_EN-DE_catalogo2018_ISSUU.pdf',
  specSource: 'https://www.sicce.com/en/products/multifunction-pumps/syncra-silent.html',
  nftSource: 'https://www.pubs.ext.vt.edu/content/pubs_ext_vt_edu/en/SPES/spes-463/spes-463.html'
});

// Published 230 V / 50 Hz curves. Each point is [head in metres, litres per hour].
export const pumps = Object.freeze({
  'syncra-05': {label: 'Sicce Syncra Silent 0.5', watts: 8, connector: 'G ½ · adaptor ke selang ID 16 mm', curve: [[0, 700], [0.5, 500], [1, 150], [1.2, 0]]},
  'syncra-10': {label: 'Sicce Syncra Silent 1.0', watts: 16, connector: 'G ½ · adaptor ke selang ID 16 mm', curve: [[0, 950], [0.5, 750], [1, 450], [1.5, 0]]}
});

export const fields = Object.freeze({
  siteWidth: {label: 'Panjang area', min: 900, max: 8000, unit: 'mm'},
  siteDepth: {label: 'Lebar area', min: 900, max: 8000, unit: 'mm'},
  rackX: {label: 'Rak · X', min: 0, max: 8000, unit: 'mm'},
  rackZ: {label: 'Rak · Y', min: 0, max: 8000, unit: 'mm'},
  tankX: {label: 'Tandon · X', min: 0, max: 8000, unit: 'mm'},
  tankZ: {label: 'Tandon · Y', min: 0, max: 8000, unit: 'mm'},
  channelCount: {label: 'Jumlah kanal', min: 2, max: 8},
  holesPerChannel: {label: 'Lubang per kanal', min: 2, max: 12},
  channelLength: {label: 'Panjang kanal', min: 600, max: 3000, unit: 'mm'},
  holeSpacing: {label: 'Jarak lubang', min: 150, max: 350, unit: 'mm'},
  rowSpacing: {label: 'Jarak antarkanal', min: 130, max: 350, unit: 'mm'},
  inletHeight: {label: 'Tinggi dasar masuk', min: 550, max: 1550, unit: 'mm'},
  slope: {label: 'Kemiringan kanal', min: 1, max: 4, unit: '%'},
  workingLitres: {label: 'Larutan saat pompa menyala', min: 20, max: 48, unit: 'L'}
});

const rotations = [0, 90, 180, 270];
const designKeys = new Set(['schemaVersion', 'id', 'revision', 'title', 'rackRotation', 'tankRotation', 'pump', ...Object.keys(fields)]);

export function validateInput(design) {
  if (!design || typeof design !== 'object' || Array.isArray(design)) return ['Dokumen desain harus berupa objek.'];
  const errors = [];
  if (design.schemaVersion !== 1 || Object.keys(design).some(key => !designKeys.has(key))) errors.push('Format atau versi dokumen desain tidak didukung.');
  if (typeof design.id !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(design.id) || design.id.length > 64) errors.push('ID desain harus berupa slug hingga 64 karakter.');
  if (typeof design.title !== 'string' || !design.title.trim() || design.title.length > 90) errors.push('Judul desain harus berisi 1–90 karakter.');
  if (!Number.isSafeInteger(design.revision) || design.revision < 1) errors.push('Revisi desain harus berupa bilangan bulat positif.');
  for (const [key, rule] of Object.entries(fields)) {
    if (!Number.isInteger(design[key]) || design[key] < rule.min || design[key] > rule.max) errors.push(`${rule.label}: masukkan bilangan bulat ${rule.min}–${rule.max}${rule.unit ? ` ${rule.unit}` : ''}.`);
  }
  if (!rotations.includes(design.rackRotation) || !rotations.includes(design.tankRotation)) errors.push('Sudut rak dan tandon harus 0°, 90°, 180°, atau 270°.');
  if (typeof design.pump !== 'string' || !Object.hasOwn(pumps, design.pump)) errors.push('Pompa tidak memiliki data kurva dalam katalog V1.');
  return errors;
}

function at(x, y, z) { return {x, y, z}; }

function transform(x, z, angle) {
  switch (angle) {
    case 90: return [-z, x];
    case 180: return [-x, -z];
    case 270: return [z, -x];
    default: return [x, z];
  }
}

function placement(x, z, rotation) {
  return (localX, localY, localZ) => {
    const [offsetX, offsetZ] = transform(localX, localZ, rotation);
    return at(x + offsetX, localY, z + offsetZ);
  };
}

function rectangle(toWorld, width, depth, zOffset = 0) {
  return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([x, z]) => toWorld(x * width / 2, 0, z * depth / 2 + zOffset));
}

function bounds(points) {
  return {minX: Math.min(...points.map(p => p.x)), maxX: Math.max(...points.map(p => p.x)), minZ: Math.min(...points.map(p => p.z)), maxZ: Math.max(...points.map(p => p.z))};
}

function overlap(a, b) {
  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ;
}

function pathLength(points) {
  return points.slice(1).reduce((length, p, i) => length + Math.hypot(p.x - points[i].x, p.y - points[i].y, p.z - points[i].z), 0);
}

function diameterArea(diameterMm) { return Math.PI * (diameterMm / 2000) ** 2; }

function headLoss(lph, runMm, diameterMm, fittings) {
  const velocity = lph / 3_600_000 / diameterArea(diameterMm);
  // Fixed Darcy factor for the V1 estimate. Fitting coefficients are budgeted per path.
  return (0.035 * runMm / diameterMm + fittings) * velocity ** 2 / (2 * 9.81);
}

export function flowAtHead(pump, head) {
  const points = pump.curve;
  if (head <= points[0][0]) return points[0][1];
  for (let i = 1; i < points.length; i++) {
    const [upperHead, upperFlow] = points[i];
    if (head > upperHead) continue;
    const [lowerHead, lowerFlow] = points[i - 1];
    return lowerFlow + (upperFlow - lowerFlow) * (head - lowerHead) / (upperHead - lowerHead);
  }
  return 0;
}

function pumpDuty(pump, staticHead, mainMm, branchMm, channels) {
  const loss = lph => headLoss(lph, mainMm, engineering.feedId, 5) + headLoss(lph / channels, branchMm, engineering.branchId, 5);
  let from = 0;
  let to = flowAtHead(pump, staticHead);
  for (let i = 0; i < 32; i++) {
    const mid = (from + to) / 2;
    if (flowAtHead(pump, staticHead + loss(mid)) >= mid) from = mid;
    else to = mid;
  }
  return {capacityLpm: from / 60, lossAtTarget: loss(channels * engineering.targetChannelLpm * 60)};
}

function halfFullReturnLpm(diameter, slope) {
  if (slope <= 0) return 0;
  const area = diameterArea(diameter) / 2;
  // Manning estimate for a smooth circular drain. Hydraulic radius at half fill is D/4.
  return (1 / 0.012) * area * (diameter / 4000) ** (2 / 3) * Math.sqrt(slope) * 60_000;
}

export function calculateDesign(design) {
  const errors = validateInput(design);
  if (errors.length) throw new RangeError(errors.join('\n'));
  const e = engineering;
  const rackAt = placement(design.rackX, design.rackZ, design.rackRotation);
  const tankAt = placement(design.tankX, design.tankZ, design.tankRotation);
  const half = design.channelLength / 2;
  const span = (design.channelCount - 1) * design.rowSpacing;
  const rackWidth = design.channelLength + 160;
  const rackDepth = span + e.channelWidth + 40;
  const drop = design.channelLength * design.slope / 100;
  const outletHeight = design.inletHeight - drop;
  const tankWaterY = design.workingLitres / e.tankBaseM2;
  const filterY = design.inletHeight + 25;
  const headerHigh = outletHeight - 55;
  const headerLow = headerHigh - span * e.returnSlope;
  const frontReturn = rackAt(half + 65, headerLow, span / 2);
  const returnPort = tankAt(-e.tankWidth / 2 + 80, e.tankLidPortY, -e.tankDepth / 2 + 60);
  const feedPort = tankAt(e.tankWidth / 2 - 80, e.tankLidPortY, -e.tankDepth / 2 + 60);
  const pumpPoint = at(feedPort.x, 50, feedPort.z);
  const frontInlet = rackAt(-half - 65, filterY, span / 2);
  const routeFeed = [pumpPoint, feedPort, at(feedPort.x, filterY, feedPort.z), at(frontInlet.x, filterY, feedPort.z), frontInlet];
  const returnFlat = Math.hypot(returnPort.x - frontReturn.x, returnPort.z - frontReturn.z);
  const routeReturn = [frontReturn, returnPort];
  const feedHeader = [frontInlet, rackAt(-half - 65, filterY, -span / 2)];
  const returnHeader = [rackAt(half + 65, headerHigh, -span / 2), frontReturn];
  const feedRun = pathLength(routeFeed) + span;
  const returnRun = pathLength(routeReturn) + pathLength(returnHeader);

  const endGap = (design.channelLength - (design.holesPerChannel - 1) * design.holeSpacing) / 2;
  const channels = Array.from({length: design.channelCount}, (_, i) => {
    const localZ = i * design.rowSpacing - span / 2;
    const inlet = rackAt(-half, design.inletHeight, localZ);
    const outlet = rackAt(half, outletHeight, localZ);
    const feedTap = rackAt(-half - 65, filterY, localZ);
    const returnTap = rackAt(half + 65, headerHigh - i * design.rowSpacing * e.returnSlope, localZ);
    const holes = Array.from({length: design.holesPerChannel}, (_, j) => {
      const fromInlet = endGap + j * design.holeSpacing;
      return {id: `${i + 1}.${j + 1}`, fromInlet, ...rackAt(fromInlet - half, design.inletHeight + e.channelHeight - fromInlet * design.slope / 100, localZ)};
    });
    return {id: `K${i + 1}`, inlet, outlet, feedTap, returnTap, holes, corners: rectangle((x, y, z) => rackAt(x, y, z + localZ), design.channelLength, e.channelWidth)};
  });

  const rack = rectangle(rackAt, rackWidth, rackDepth);
  const tank = rectangle(tankAt, e.tankWidth, e.tankDepth);
  const rackService = rectangle(rackAt, rackWidth, e.serviceDepth, -(rackDepth + e.serviceDepth) / 2);
  const tankService = rectangle(tankAt, e.tankWidth, e.serviceDepth, (e.tankDepth + e.serviceDepth) / 2);
  const rackBounds = bounds(rack);
  const tankBounds = bounds(tank);
  const inSite = area => area.minX >= 0 && area.minZ >= 0 && area.maxX <= design.siteWidth && area.maxZ <= design.siteDepth;
  const pump = pumps[design.pump];
  const staticHeadM = Math.max(0, filterY - tankWaterY) / 1000;
  const longestBranch = Math.max(...channels.map(ch => pathLength([ch.feedTap, ch.inlet])));
  const duty = pumpDuty(pump, staticHeadM, feedRun, longestBranch, design.channelCount);
  const targetLpm = design.channelCount * e.targetChannelLpm;
  const flowLpm = Math.min(targetLpm, duty.capacityLpm);
  const returnGradient = Math.min(e.returnSlope, (frontReturn.y - returnPort.y) / Math.max(1, returnFlat));
  const returnCapacityLpm = halfFullReturnLpm(e.returnId, returnGradient);
  const channelWaterL = design.channelLength * e.channelWidth * e.runningFilmMm * design.channelCount / 1e6;
  const drainBackL = channelWaterL + diameterArea(e.feedId) * feedRun + diameterArea(e.returnId) * returnRun + diameterArea(e.branchId) * longestBranch * channels.length;
  const stoppedLitres = design.workingLitres + drainBackL;
  const issues = [];
  const fail = (code, message) => issues.push({code, message});
  if (endGap < e.minEndGap) fail('hole-clearance', `Jarak lubang ke ujung kanal tinggal ${Math.round(endGap)} mm. Sisakan minimal ${e.minEndGap} mm atau tambah panjang kanal.`);
  if (!inSite(rackBounds)) fail('rack-outside', 'Rak atau manifold melewati batas area. Geser atau putar rak, atau perbesar area.');
  if (!inSite(tankBounds)) fail('tank-outside', 'Tandon melewati batas area. Geser atau putar tandon.');
  if (overlap(rackBounds, tankBounds)) fail('overlap', 'Rak dan tandon bertabrakan. Pisahkan posisinya.');
  if (!inSite(bounds(rackService)) || overlap(bounds(rackService), tankBounds)) fail('rack-access', `Sediakan ruang akses ${e.serviceDepth} mm di sisi servis rak.`);
  if (!inSite(bounds(tankService)) || overlap(bounds(tankService), rackBounds)) fail('tank-access', `Sediakan ruang akses ${e.serviceDepth} mm di depan tandon.`);
  if (returnGradient < e.returnSlope - 1e-9) fail('return-slope', 'Jalur balik terlalu landai untuk batas desain 2%. Dekatkan tandon atau naikkan rak.');
  if (duty.capacityLpm < targetLpm) fail('pump-duty', 'Pompa belum mencapai debit target pada tinggi angkat ini. Pilih pompa lain atau turunkan rak.');
  if (flowLpm / design.channelCount < e.minimumChannelLpm) fail('channel-flow', 'Estimasi debit per kanal di bawah rentang acuan.');
  if (returnCapacityLpm < duty.capacityLpm) fail('return-capacity', 'Kapasitas teoritis jalur balik di bawah estimasi debit pompa tanpa pengaturan.');
  if (stoppedLitres > e.tankCapacityL - 2) fail('tank-freeboard', 'Tandon tidak punya cadangan 2 L setelah pompa mati. Kurangi isi tandon atau volume instalasi.');

  const supplyTotal = pathLength(routeFeed);
  const bill = [
    {name: 'Kanal NFT buram', qty: design.channelCount, unit: 'batang', spec: `100 × 50 × ${design.channelLength} mm, ${design.holesPerChannel} lubang Ø50 mm per kanal`},
    {name: 'Tutup ujung kanal', qty: design.channelCount * 2, unit: 'buah', spec: 'Kompatibel dengan profil 100 × 50 mm. Pasang port masuk dan keluar sesuai talang.'},
    {name: 'Net pot', qty: design.channelCount * design.holesPerChannel, unit: 'buah', spec: 'Cocok dengan lubang Ø50 mm. Uji satu lubang pada potongan sisa.'},
    {name: 'Rak satu tingkat', qty: 1, unit: 'set', spec: `Selubung ${rackWidth} × ${rackDepth} mm. Gunakan penopang melintang di bawah kanal. Setel dasar sisi masuk ${design.inletHeight} mm dan sisi keluar ${Math.round(outletHeight)} mm.`},
    {name: 'Tandon buram bertutup', qty: 1, unit: 'buah', spec: `Kapasitas kerja nominal ${e.tankCapacityL} L. Selubung maks. 560 × 400 × 320 mm. Isi saat berjalan ${design.workingLitres} L.`},
    {name: 'Pompa celup + adaptor', qty: 1, unit: 'set', spec: `${pump.label}, 230 V / 50 Hz · ${pump.watts} W · ${pump.connector}.`},
    {name: 'Selang suplai dan header', qty: 1, unit: 'set', spec: `ID 16 mm. Jalur ${Math.ceil(supplyTotal)} mm + header ${span} mm + potongan bypass sesuai posisi fitting.`},
    {name: 'Cabang dan katup pengatur', qty: design.channelCount, unit: 'set', spec: `Selang ID 8 mm, panjang model tiap cabang ${Math.ceil(longestBranch)} mm, dengan tee, katup, dan pengikat.`},
    {name: 'Jalur balik dan header berventilasi', qty: 1, unit: 'set', spec: `ID minimal 32 mm. Jalur ${Math.ceil(pathLength(routeReturn))} mm + header ${Math.ceil(pathLength(returnHeader))} mm, dengan fitting masuk tiap kanal.`},
    {name: 'Bypass ke tandon + penyangga', qty: 1, unit: 'set', spec: 'Tee, katup bypass, saringan pompa, dan klem sesuai selang. Arahkan ke dalam tandon.'}
  ];

  return {
    design, rack, tank, rackWidth, rackDepth, rackService, tankService, channels, routeFeed, routeReturn, feedHeader, returnHeader, pumpPoint,
    holeCount: channels.length * design.holesPerChannel, endGap, drop, outletHeight, tankWaterY,
    issues, bill, staticHeadM, targetHeadM: staticHeadM + duty.lossAtTarget, targetLpm, flowLpm,
    capacityLpm: duty.capacityLpm, returnCapacityLpm, returnGradient, drainBackL, stoppedLitres,
    energyKwh30d: pump.watts * 24 * 30 / 1000
  };
}

export function newDesignFrom(preset) {
  return {...preset, id: 'desain-baru', title: 'Desain hidroponik saya', channelCount: 3, holesPerChannel: 4, channelLength: 1050};
}
