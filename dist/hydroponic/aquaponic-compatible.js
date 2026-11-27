import {aquaponic as design} from './aquaponic-design.js?v=880326e55dc2';

const {pond, beds, filters, pump, supply, returns, returnPoint, flowSpeed} = design;
const widthM = design.design.siteWidth / 1000;
const depthM = design.design.siteDepth / 1000;
const point = (x, y, z) => ({x, y, z});
const floorCorners = [point(0,0,0), point(widthM,0,0), point(widthM,0,depthM), point(0,0,depthM)];
const nFish = 5;
const between = (a, b, t) => point(a.x+(b.x-a.x)*t, a.y+(b.y-a.y)*t, a.z+(b.z-a.z)*t);
const segmentsFor = (paths, color, marker) => paths.flatMap(path => path.slice(1).map((end, i) => {
  const start = path[i];
  return {start, end, color, marker, length: Math.hypot(end.x-start.x, end.y-start.y, end.z-start.z)};
}));
const pipes = [...segmentsFor(supply,'#237f72','#cefff1'), ...segmentsFor(returns.slice(0,-1),'#4c79a4','#c6e8ff')];
const streams = [returns[returns.length-1], ...beds.map(bed => [point(bed.x-.67,bed.water+.013,bed.z+.10),point(bed.x+.67,bed.water+.013,bed.z+.10)])];
const wetPipes = segmentsFor(streams,'#6bc7bd','#dbfff5');
const filterPaths = Object.fromEntries(filters.map(f => [f.id,{
  internal:segmentsFor([f.internalInlet,f.internalOutlet],'#6c8e83','#cefff1'),
  flow:f.focusFlow.map(route => {
    const segments = segmentsFor([route],'#4b9d90','#effff8');
    return {segments, length:segments.reduce((total, segment) => total+segment.length,0)};
  }),
  waste:segmentsFor([f.waste],'#a67947','#fff'),
  leads:segmentsFor(f.focusLeads,'#237f72','#cefff1')
}]));

export function createCompatibleView(host) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', {alpha:false});
  if (!ctx) throw new Error('Canvas 2D unavailable');
  canvas.setAttribute('role','img');
  canvas.setAttribute('aria-label','Simulasi 3D kolam nila dan dua talang akuaponik');
  canvas.style.cssText='display:block;width:100%;height:100%;touch-action:none';
  canvas.tabIndex = 0;
  host.append(canvas);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  let width = 0, height = 0, scale = 1, ratio = 1;
  let yaw = -.63, pitch = .59, zoom = 1, closeUp = false;
  let focusedFilter = null;
  let target = point(widthM/2,.37,depthM/2);
  let stocked = true, flowing = true, visible = true, disposed = false, frame = 0;
  let time = 0, lastTime = 0, drag = null;
  let waterTravel = 0;

  function axes(p) {
    const x = p.x-target.x, y = p.y-target.y, z = p.z-target.z;
    const forward = x*Math.sin(yaw)+z*Math.cos(yaw);
    return {x:x*Math.cos(yaw)-z*Math.sin(yaw), y:forward*Math.sin(pitch)-y*Math.cos(pitch), depth:forward*Math.cos(pitch)+y*Math.sin(pitch)};
  }

  function project(p) {
    const q = axes(p);
    return {x:width/2+q.x*scale, y:height*.52+q.y*scale, depth:q.depth};
  }

  function path(points, fill, stroke, lineWidth = 1, closed = Boolean(fill)) {
    ctx.beginPath();
    for (const [i, position] of points.entries()) {
      const p = project(position);
      if (i) ctx.lineTo(p.x,p.y); else ctx.moveTo(p.x,p.y);
    }
    if (closed) ctx.closePath();
    if (fill) {ctx.fillStyle=fill;ctx.fill();}
    if (stroke) {ctx.strokeStyle=stroke;ctx.lineWidth=lineWidth;ctx.stroke();}
  }

  function circle(x,y,z,r,from=0,angle=2*Math.PI) {
    const count = 28;
    return Array.from({length:count+1},(_,i)=>{
      const theta=from+i/count*angle;
      return point(x+Math.cos(theta)*r,y,z+Math.sin(theta)*r);
    });
  }

  function container(x,z,r,bottom,top,wall,base,cap) {
    const front = Math.PI/2-yaw-Math.PI/2;
    const floor = circle(x,bottom,z,r);
    const frontLow = circle(x,bottom,z,r,front,Math.PI);
    const frontHigh = circle(x,top,z,r,front,Math.PI);
    path(floor,base,'#507269',1.2);
    path([...frontHigh,...frontLow.reverse()],wall);
    path(circle(x,top,z,r),cap,'#49766b',Math.max(1.4,scale*.013));
  }

  function box(x,z,w,d,bottom,top,color,shade1,shade2) {
    const at = y => [point(x-w/2,y,z-d/2),point(x+w/2,y,z-d/2),point(x+w/2,y,z+d/2),point(x-w/2,y,z+d/2)];
    const low=at(bottom), high=at(top);
    const faces = high.map((v,i) => {
      const j=(i+1)%4;
      return {depth:axes(between(v,high[j],.5)).depth, points:[v,high[j],low[j],low[i]], color:i%2?shade1:shade2};
    });
    for (const face of faces.sort((a,b)=>a.depth-b.depth).slice(2)) path(face.points,face.color,'#657c70',.45);
    path(high,color,'#657c70',.65);
  }

  function dot(p, radius, color) {
    const q=project(p);
    ctx.beginPath();ctx.arc(q.x,q.y,radius,0,2*Math.PI);ctx.fillStyle=color;ctx.fill();
  }

  function fish(index) {
    const phase=time*(.66+index*.058)+index*1.27;
    const r=.22+index%3*.071;
    const p=point(pond.x+Math.cos(phase)*r,.20+Math.sin(phase*.74+index)*.04,pond.z+Math.sin(phase)*r*.76);
    const q=project(p), face=project(point(p.x-Math.sin(phase)*.09,p.y,p.z+Math.cos(phase)*.07));
    const size=Math.max(3.4,scale*(.068+index%3*.009));
    ctx.save();ctx.translate(q.x,q.y);ctx.rotate(Math.atan2(face.y-q.y,face.x-q.x));ctx.scale(size,size);
    const tail=Math.sin(time*9+index*1.7)*.28;
    ctx.beginPath();ctx.moveTo(-.69,0);ctx.lineTo(-1.43,-.50+tail);ctx.quadraticCurveTo(-1.24,0+tail,-1.42,.48+tail);ctx.closePath();ctx.fillStyle='#416d62';ctx.fill();
    ctx.beginPath();ctx.moveTo(-.94,0);ctx.bezierCurveTo(-.67,-.56,.31,-.68,.94,-.16);ctx.quadraticCurveTo(1.13,-.01,.93,.17);ctx.bezierCurveTo(.31,.57,-.59,.48,-.94,0);ctx.fillStyle='#4e786a';ctx.fill();
    ctx.beginPath();ctx.moveTo(-.39,.05);ctx.quadraticCurveTo(-.17,.50,.32,.58);ctx.lineTo(.17,.12);ctx.fillStyle='#90a997';ctx.fill();
    ctx.beginPath();ctx.arc(.66,-.094,.10,0,2*Math.PI);ctx.fillStyle='#f4eac2';ctx.fill();
    ctx.beginPath();ctx.arc(.68,-.097,.052,0,2*Math.PI);ctx.fillStyle='#233f35';ctx.fill();ctx.restore();
  }

  function leaves(at,index) {
    const p=project(point(at.x,at.y+.10,at.z));
    const size=Math.max(2.3,scale*.046);
    ctx.save();ctx.translate(p.x,p.y);ctx.scale(size,size);
    for (let leaf=0;leaf<6;leaf++) {
      const angle=leaf*Math.PI/3+index*.9;
      ctx.save();ctx.rotate(angle);
      ctx.beginPath();ctx.moveTo(0,0);ctx.quadraticCurveTo(-.72,-.47,-.42,-1.16);ctx.quadraticCurveTo(.58,-1.43,.46,-.31);ctx.closePath();
      ctx.fillStyle=['#52934d','#70a85a','#387b49'][leaf%3];ctx.fill();ctx.restore();
    }
    ctx.restore();
  }

  function tank() {
    const {x,z,r,height:top,water} = pond;
    const angle = -yaw;
    const rim = circle(x,top,z,r);
    path(circle(x,.026,z,r), '#add3c5','#557d70',1.2);
    path(circle(x,.033,z,r*.93),'#c3ded0');
    if (stocked) {
      path(circle(x,water,z,r*.96),'rgba(105,191,183,.40)','#60a398',1.15);
      for (let i=0;i<nFish;i++) fish(i);
    }
    box(pump.x,pump.z,.135,.108,pump.y-.052,pump.y+.052,'#385b51','#243f37','#496f65');
    const topFront=circle(x,top,z,r,angle,Math.PI), bottomFront=circle(x,.024,z,r,angle,Math.PI);
    path([...topFront,...bottomFront.reverse()],'rgba(108,166,147,.20)');
    path(rim,null,'#316e60',Math.max(2,scale*.026),true);
    if (flowing) {
      for (let i=0;i<3;i++) {
        const age=(time*.85+i/3)%1, radius=.035+age*.12;
        path(circle(returnPoint.x,returnPoint.y+.003,returnPoint.z,radius),null,`rgba(234,255,248,${.75*(1-age)})`,1.4,true);
      }
    }
  }

  function tray(bed) {
    for (const x of [bed.x-bed.width*.39,bed.x+bed.width*.39]) for (const z of [bed.z-bed.depth*.40,bed.z+bed.depth*.40]) box(x,z,.048,.048,0,bed.bottom,'#647d70','#485f53','#5b7769');
    box(bed.x,bed.z,bed.width,bed.depth,bed.bottom,bed.lip,'#dde8d9','#9eb1a1','#b6c8b8');
    box(bed.x,bed.z,bed.width-.05,bed.depth-.045,bed.lip-.005,bed.lip+.002,stocked?'#7cbbb0':'#b2c3b4','#b2c3b4','#b2c3b4');
    for (const [i,at] of bed.pots.entries()) {
      container(at.x,at.z,.077,bed.lip-.013,bed.lip+.034,'#466457','#506a5e',stocked?'#646452':'#425b53');
      if (stocked) leaves(at,i);
    }
  }

  function drum(f, cutaway = false) {
    const top = f.bottom+f.height;
    for (const dx of [-.14,.14]) for (const dz of [-.13,.13]) box(f.x+dx,f.z+dz,.034,.035,0,f.bottom,'#687f73','#536b60','#659080');
    for (const segment of filterPaths[f.id].waste) tube(segment,false,false);
    const valve = f.waste[1];
    box(valve.x,valve.z+.039,.064,.033,valve.y-.016,valve.y+.018,'#bb8d55','#986b3f','#986b3f');
    if (!cutaway) {
      container(f.x,f.z,f.r,f.bottom,top,f.color,f.color,'#e3e9d6');
      return;
    }

    path(circle(f.x,f.bottom,f.z,f.r),'#bfd4c8','#527d6f',1.2);
    if (stocked) path(circle(f.x,f.water,f.z,f.r-.009),'rgba(143,204,193,.36)','#82aaa2',1.2);
    if (f.well) {
      const {well,weir,hopper} = f;
      const upper = circle(f.x,hopper.shoulder,f.z,hopper.r,-yaw,Math.PI);
      const lower = circle(f.x,hopper.base,f.z,.025,-yaw,Math.PI);
      path([...upper,...lower.reverse()],'rgba(163,118,66,.49)','#9b7e54',1);
      container(f.x,f.z,well.r,well.bottom,well.top,'rgba(184,211,200,.30)','rgba(184,211,200,.1)',null);
      path(circle(f.x,weir.floor,f.z,f.r-.008),null,'#73938a',2.8,true);
      path(circle(f.x,weir.crest,f.z,weir.r),null,'#517b70',2.6,true);
    } else {
      const {screen,diffuser} = f;
      container(screen.x,screen.z,screen.r,screen.bottom,screen.top,'rgba(182,205,190,.38)','rgba(180,206,193,.30)',null);
      for (let i=0;i<12;i++) {
        const angle = i/12*2*Math.PI;
        const x = screen.x+Math.cos(angle)*screen.r, z = screen.z+Math.sin(angle)*screen.r;
        path([point(x,screen.top,z),point(x,screen.bottom,z)],null,'#7b9c90',.7,false);
      }
      path(circle(diffuser.x,diffuser.y,diffuser.z,diffuser.r),null,'#668ca6',2.5,true);
      if (stocked) for (let i=0;i<17;i++) {
        const angle = time*1.44+i*2.41;
        const bubble = i<11;
        const y = bubble ? diffuser.y+((time*.54+i*.087)%1)*(f.water-diffuser.y-.02) : f.bottom+.33+Math.sin(angle)*.102;
        const radius = bubble ? .079+i%3*.015 : .121;
        const bead = point(f.x+Math.cos(angle)*radius,y,f.z+Math.sin(angle)*radius);
        dot(bead,Math.max(1.2,scale*(bubble ? .009 : .012)),bubble ? 'rgba(231,249,255,.93)' : '#7e9f73');
      }
    }
    for (const segment of filterPaths[f.id].internal) tube(segment,false,false);
    const upper = circle(f.x,top,f.z,f.r,-yaw,Math.PI);
    const lower = circle(f.x,f.bottom,f.z,f.r,-yaw,Math.PI);
    path([...upper,...lower.reverse()],'rgba(143,193,175,.16)');
    path(circle(f.x,top,f.z,f.r),null,'#557a6f',Math.max(1.4,scale*.011),true);
  }

  function traceWater({segments, length}) {
    for (const segment of segments) tube(segment,true,false);
    const count = Math.max(1,Math.ceil(length/.25));
    for (let i=0;i<count;i++) {
      let distance = (waterTravel+(i+.4)*length/count)%length;
      for (const segment of segments) {
        if (distance <= segment.length) {
          dot(between(segment.start,segment.end,distance/segment.length),Math.max(2,scale*.021),segment.marker);
          break;
        }
        distance -= segment.length;
      }
    }
  }

  function tube(segment, water = false, animate = flowing) {
    const {start,end,color,marker,length}=segment;
    path([start,end],null,color,Math.max(1.8,scale*(water ? .02 : .035)),false);
    if (!animate || !length) return;
    const spacing=.20, count=Math.max(1,Math.ceil(length/spacing));
    for (let i=0;i<count;i++) {
      const distance=(waterTravel+i*spacing+.045)%length;
      dot(between(start,end,distance/length),Math.max(1.6,scale*.017),marker);
    }
  }

  function draw() {
    if (!width || !height || disposed) return;
    ctx.setTransform(ratio,0,0,ratio,0,0);
    ctx.fillStyle='#e9f1e9';ctx.fillRect(0,0,width,height);
    ctx.lineJoin='round';ctx.lineCap='round';
    path(floorCorners,'#d2e2d4','#9ab3a4',1.4);
    if (focusedFilter) {
      const paths = filterPaths[focusedFilter.id];
      drum(focusedFilter,true);
      for (const segment of paths.leads) tube(segment,false,false);
      if (flowing) for (const route of paths.flow) traceWater(route);
      return;
    }
    const objects=[
      {p:point(pond.x,.27,pond.z),paint:tank},
      ...beds.map(bed=>({p:point(bed.x,.45,bed.z),paint:()=>tray(bed)})),
      ...filters.map(f=>({p:point(f.x,.35,f.z),paint:()=>drum(f)})),
      ...pipes.map(segment=>({p:between(segment.start,segment.end,.5),paint:()=>tube(segment)}))
    ];
    for (const {paint} of objects.sort((a,b)=>axes(a.p).depth-axes(b.p).depth)) paint();
    if (flowing) for (const segment of wetPipes) tube(segment,true);
  }

  function fitScale() {
    let fitCorners = closeUp ? circle(pond.x,.33,pond.z,pond.r+.13) : [...floorCorners,...floorCorners.map(p=>point(p.x,1.09,p.z))];
    if (focusedFilter) {
      const f = focusedFilter;
      fitCorners = [...circle(f.x,f.bottom-.155,f.z,f.r+.12),...circle(f.x,f.bottom+f.height+.025,f.z,f.r+.12)];
    }
    const corners=fitCorners.map(axes);
    const maxX=Math.max(...corners.map(p=>Math.abs(p.x)));
    const maxY=Math.max(...corners.map(p=>Math.abs(p.y)));
    scale=Math.min(width*.46/(maxX+.04),height*.43/(maxY+.06))*zoom;
    draw();
  }

  function resize() {
    width=host.clientWidth;height=host.clientHeight;
    if (!width || !height) return;
    ratio=Math.min(1.6,window.devicePixelRatio||1,Math.sqrt(800000/(width*height)));
    canvas.width=Math.max(1,Math.round(width*ratio));canvas.height=Math.max(1,Math.round(height*ratio));
    fitScale();
  }

  function fit() {
    focusedFilter=null;
    target=point(widthM/2,.43,depthM/2);closeUp=false;
    yaw=-.59;pitch=.60;zoom=1;
    fitScale();
  }

  function focusPond() {
    focusedFilter=null;
    target=point(pond.x,.39,pond.z);closeUp=true;
    yaw=-.55;pitch=.69;zoom=.94;
    fitScale();
  }

  function focusFilter(id) {
    const filter = filters.find(f=>f.id===id);
    if (!filter) return;
    focusedFilter=filter;
    closeUp=true;
    target=point(filter.x,filter.bottom+filter.height*.40,filter.z);
    yaw=filter.id === 'bio' ? -.72 : -.34;
    pitch=.36;
    zoom=1.03;
    fitScale();
  }

  function rotate(dx,dy) {
    yaw+=dx*.009;
    pitch=Math.max(.30,Math.min(1.35,pitch+dy*.007));
    fitScale();
  }

  const listeners = new AbortController();
  const listen = {signal:listeners.signal};
  canvas.addEventListener('pointerdown',event=>{
    if (!event.isPrimary || event.button !== 0) return;
    drag={id:event.pointerId,x:event.clientX,y:event.clientY};
    canvas.setPointerCapture(event.pointerId);
  },listen);
  canvas.addEventListener('pointermove',event=>{
    if (!drag || drag.id!==event.pointerId) return;
    rotate(event.clientX-drag.x,event.clientY-drag.y);
    drag.x=event.clientX;drag.y=event.clientY;
  },listen);
  for (const name of ['pointerup','pointercancel','lostpointercapture']) canvas.addEventListener(name,()=>{drag=null;},listen);
  canvas.addEventListener('keydown',event=>{
    const motion={ArrowLeft:[-16,0],ArrowRight:[16,0],ArrowUp:[0,-16],ArrowDown:[0,16]}[event.key];
    if (!motion && !['+','-','='].includes(event.key)) return;
    event.preventDefault();
    if (motion) rotate(...motion);
    else {zoom=Math.max(.65,Math.min(2.8,zoom*(event.key==='-'?.88:1.13)));fitScale();}
  },listen);

  function schedule() {
    if (!frame && !disposed && visible && stocked && !reduce.matches) frame=requestAnimationFrame(animate);
  }

  function animate(now) {
    frame=0;
    const seconds=lastTime ? (now-lastTime)/1000 : 0;
    if (seconds>=1/30) {
      const delta = Math.min(.12,seconds);
      time += delta;
      if (flowing) waterTravel += delta*(focusedFilter ? flowSpeed.filter : flowSpeed.overview);
      lastTime=now;
      draw();
    }
    if (!lastTime) lastTime=now;
    schedule();
  }

  function refresh() {
    if (frame) cancelAnimationFrame(frame);
    frame=0;lastTime=0;
    draw();schedule();
  }

  const observer=typeof ResizeObserver==='function' ? new ResizeObserver(resize) : null;
  if (observer) observer.observe(host);
  else window.addEventListener('resize',resize,listen);
  const intersection=typeof IntersectionObserver==='function' ? new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;refresh();}) : null;
  intersection?.observe(host);
  reduce.addEventListener?.('change',refresh);
  resize();fit();refresh();

  return {fit,focusPond,focusFilter,fish:nFish,plants:design.holeCount,setState({hasContents,hasFlow}) {
    stocked=hasContents;flowing=hasFlow&&stocked;refresh();
  },dispose() {
    disposed=true;
    if (frame) cancelAnimationFrame(frame);
    listeners.abort();observer?.disconnect();intersection?.disconnect();reduce.removeEventListener?.('change',refresh);
    canvas.remove();
  }};
}
