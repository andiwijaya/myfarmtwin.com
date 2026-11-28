export const plotPath = '/tanam-di-tanah/desain/singkong/';
export const guidePath = '/tanam-di-tanah/artikel/panen-singkong-harian/';
export const coverPath = '/tanam-di-tanah/assets/kebun-singkong-r1.jpg';
export const lane = .6;
export const scenario = Object.freeze({
  width:35, depth:32.4, target:2, unit:'tanaman', kg:1.5, spacing:1,
  months:10, loss:20, start:'2027-01', season:4095
});
export const limits = {
  width:[2,120,.1], depth:[2,120,.1], target:[.1,30,.1], kg:[.1,10,.1],
  spacing:[.8,1.5,.1], months:[6,18,1], loss:[0,50,1]
};
export const endOfDemo = 42;

export function planInputs(input) {
  const result = {...scenario};
  for (const [key,[min,max,step]] of Object.entries(limits)) {
    if (input[key] === undefined || String(input[key]).trim() === '') continue;
    const value = Number(input[key]);
    if (Number.isFinite(value)) result[key] = Number((Math.round(Math.min(max,Math.max(min,value))/step)*step).toFixed(1));
  }
  result.unit = input.unit === 'kg' ? 'kg' : scenario.unit;
  if (result.unit === 'tanaman') result.target = Math.max(1,Math.round(result.target));
  if (/^20\d{2}-(0[1-9]|1[0-2])$/.test(input.start)) result.start = input.start;
  if (/^\d{1,4}$/.test(input.season) && Number(input.season)<=4095) result.season = Number(input.season);
  return result;
}

function layout(input, count) {
  const {width,depth,spacing} = input;
  const options = [];
  for (let cols=1; cols<=count; cols++) {
    const rows = Math.ceil(count/cols);
    const w = (width-(cols+1)*lane)/cols;
    const d = (depth-(rows+1)*lane)/rows;
    if (w <= 0 || d <= 0) continue;
    const across = Math.floor((w+1e-8)/spacing);
    const down = Math.floor((d+1e-8)/spacing);
    options.push({cols,rows,w,d,across,down,capacity:across*down});
  }
  options.sort((a,b) => b.capacity-a.capacity || a.cols*a.rows-b.cols*b.rows ||
    Math.abs(a.w-a.d)-Math.abs(b.w-b.d));
  const best = options[0];
  if (!best) return {plots:[],capacity:0};
  const {cols,w,d} = best;
  return {...best,plots:Array.from({length:count},(_,id)=>({
    id, x:lane+(id%cols)*(w+lane), z:lane+Math.floor(id/cols)*(d+lane), w,d,
    reserve:id===count-1
  }))};
}

export function monthDate(start, month, day = 1) {
  const [year,first] = start.split('-').map(Number);
  return new Date(Date.UTC(year,first-1+month,day));
}

export const monthDays = (start, month) => monthDate(start,month+1,0).getUTCDate();
export const countFormat = new Intl.NumberFormat('id-ID',{maximumFractionDigits:1});
export const monthFormat = new Intl.DateTimeFormat('id-ID',{month:'long',year:'numeric',timeZone:'UTC'});
export const dayFormat = new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
export const shortMonth = new Intl.DateTimeFormat('id-ID',{month:'short',timeZone:'UTC'});
export const canSow = (input,month) => Boolean(input.season & 1<<monthDate(input.start,month).getUTCMonth());

export function makePlan(values = scenario) {
  const input = planInputs(values);
  const {width,depth,target,unit,kg,months,loss,spacing,start} = input;
  const perDay = unit === 'kg' ? Math.ceil(target/kg-1e-8) : target;
  const ring = months+1;
  const beds = layout(input,ring+1);
  const suggested = Math.ceil((31*perDay)/(100-loss)*10)*10;
  let referenceAcross = Math.floor(Math.sqrt(suggested));
  while (suggested%referenceAcross) referenceAcross--;
  const referenceCols = Math.ceil(Math.sqrt(ring+1));
  const referenceRows = Math.ceil((ring+1)/referenceCols);
  const reference = {
    width:referenceCols*referenceAcross*spacing+(referenceCols+1)*lane,
    depth:referenceRows*(suggested/referenceAcross)*spacing+(referenceRows+1)*lane
  };
  const perPlot = Math.min(suggested,beds.capacity);
  const mature = Math.floor(perPlot*(100-loss)/100);
  const firstSow = Array.from({length:12},(_,index)=>index).find(index=>canSow(input,index)) ?? 0;
  const firstHarvest = firstSow+months;
  const calendar = Array.from({length:firstHarvest+12},(_,index)=>{
    const days = monthDays(start,index);
    const harvest = index >= months && canSow(input,index-months) ? (index-months)%ring : null;
    const covered = harvest === null ? 0 : Math.min(days,Math.floor(mature/perDay));
    const sow = canSow(input,index) ? index%ring : null;
    return {index,date:monthDate(start,index),days,sow,harvest,covered,need:days*perDay};
  });
  const harvestYear = calendar.slice(firstHarvest);
  return {input,perDay,ring,beds,suggested,perPlot,mature,calendar,firstHarvest,reference,
    area:width*depth,netRequired:ring*suggested*spacing**2,
    covered:harvestYear.reduce((sum,m)=>sum+m.covered,0),
    days:harvestYear.reduce((sum,m)=>sum+m.days,0)};
}

export function makeRun(plan, ready) {
  const month = ready ? plan.firstHarvest : 0;
  const planted = ready && plan.perPlot ? Array.from({length:month+1},(_,i)=>i).filter(i=>canSow(plan.input,i)) : [];
  return {month,day:1,planted:new Set(planted),
    harvested:new Map(),today:0,last:0,missed:0};
}

export function readyCount(plan, run) {
  const source = run.month-plan.input.months;
  if (!run.planted.has(source)) return 0;
  return Math.max(0,plan.mature-(run.harvested.get(source) ?? 0));
}

export function plantBatch(plan, run) {
  if (!plan.perPlot || run.month>=endOfDemo || !canSow(plan.input,run.month) || run.planted.has(run.month)) return false;
  run.planted.add(run.month);
  return true;
}

export function harvestDay(plan, run) {
  if (run.month>=endOfDemo) return 0;
  const picked = Math.min(plan.perDay-run.today,readyCount(plan,run));
  if (!picked) return 0;
  const cohort = run.month-plan.input.months;
  run.harvested.set(cohort,(run.harvested.get(cohort) ?? 0)+picked);
  run.today += picked;
  run.last = picked;
  return picked;
}

export function advance(plan,run,days) {
  while (days-- > 0 && run.month<endOfDemo) {
    plantBatch(plan,run);
    harvestDay(plan,run);
    if (run.today<plan.perDay) run.missed++;
    run.today = 0;
    run.day++;
    if (run.day>monthDays(plan.input.start,run.month)) {
      run.month++;
      run.day = 1;
    }
  }
  plantBatch(plan,run);
}

export function describePlots(plan,run) {
  const {months} = plan.input;
  return plan.beds.plots.map(plot => {
    if (plot.reserve) return {...plot,phase:'cadangan',count:0,age:0};
    const age = (run.month-plot.id+plan.ring)%plan.ring;
    const batch = run.month-age;
    if (!run.planted.has(batch) || run.month>=endOfDemo) return {...plot,phase:'kosong',count:0,age:0};
    if (age===months) {
      const count = readyCount(plan,run);
      return {...plot,phase:count ? 'panen' : 'kosong',count,age};
    }
    return {...plot,phase:age ? 'tumbuh' : 'stek',count:age ? plan.mature : plan.perPlot,age};
  });
}

export function planQuery(input) {
  const changed = Object.entries(input).filter(([key,value])=>value!==scenario[key]);
  return changed.length ? `?${new URLSearchParams(changed)}` : '';
}
