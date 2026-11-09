import {COZY_ART} from './unified-cozy-art.js';
import {nativeFill} from './unified-world-cues.js';

/** @typedef {import('./unified-world-environment.js').EnvironmentPart} Part */
/** Native care equipment, with stock volumes kept separate from authored shells.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e
 * @returns {{shell:Part[],fills:{part:Part,ratio:number}[]}} */
export function cowCareParts(e){
 const shell=/** @type {Part[]} */([]),fills=/** @type {{part:Part,ratio:number}[]} */([]);if(e.kind!=='cowStation')return{shell,fills};
 const p=COZY_ART.palette,w=e.width,d=e.depth,h=e.height;
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>shell.push({x,y,z,width,height,depth,color,feature,shape:'bevel',...extra});
 /** @param {Part} part */
 const fill=part=>{const ratio=nativeFill(e.value,e.capacity);if(ratio>0)fills.push({part,ratio});};
 const ratio=nativeFill(e.value,e.capacity);
 if(e.equipment==='cooler'){
  add(0,h/2,0,w*.92,h,d*.92,p.metal,'body');
  add(0,h+.035,0,w,.07,d,p.trim,'cooler-lid');
  add(0,h*.72,d*.47,w*.75,.09,.05,p.roofDark,'cooler-handle');
  add(0,h*.33,d*.475,w*.68,.39,.025,p.roofDark,'cooler-panel');
  const color=e.status==='cooling'?'#83b986':e.status==='paused_no_funds'?'#d69b64':'#bdc5b7';
  add(w*.25,h*.7,d*.49,.1,.1,.035,color,'native-cooler-status',{shape:'cylinder',tilt:Math.PI/2});
  for(let i=0;i<3;i++)add(-w*.22+i*w*.22,h*.33,d*.492,.045,.22,.025,p.metal,'cooler-vent',{fine:true});
  fill({x:w*.466,y:.16+h*.6*ratio/2,z:0,width:.025,height:h*.6*ratio,depth:.14,color:p.trim,feature:'native-stock-gauge'});
 }else if(e.domainId==='feed'||e.domainId==='water'){
  const water=e.domainId==='water',size=water&&!e.careUpgrade?.8:1,ww=w*size,dd=d*size,base=.2,rim=.3;
  add(0,base/2+.06,0,ww,base,dd,water?p.metal:p.woodDark,'body');
  for(const side of [-1,1]){
   add(side*(ww-.09)/2,base+.06+rim/2,0,.09,rim,dd,water?p.metal:p.wood,'trough-rim');
   add(0,base+.06+rim/2,side*(dd-.09)/2,ww-.14,rim,.09,water?p.metal:p.wood,'trough-rim');
   add(side*ww*.32,.055,0,.12,.11,dd*.65,p.woodDark,'trough-foot');
  }
  // Empty troughs have no water/hay surface, including invalid capacity data.
  fill({x:0,y:base+.06+.2*ratio/2,z:0,width:ww-.2,height:.2*ratio,depth:dd-.2,color:water?'#76b9bf':p.straw,shape:'bevel',feature:'native-stock'});
  if(!water&&ratio>0)for(let i=0;i<3;i++)add((i-1)*ww*.18,base+.065+.2*ratio,0,.035,.012,dd*.5,p.wood,'native-feed-strand',{fine:true,rotation:(i-1)*.28});
  if(water&&e.careUpgrade){add(ww*.32,.64,-dd*.35,.07,.28,.07,p.roofDark,'upgraded-trough');add(ww*.23,.78,-dd*.35,.22,.07,.07,p.roofDark,'upgraded-trough');}
 }else if(e.domainId==='can'){
  add(0,.39,0,.66,.78,.66,p.metal,'body',{shape:'cylinder'});
  add(0,.84,0,.46,.14,.46,p.metal,'can-neck',{shape:'cylinder'});
  add(0,.94,0,.55,.07,.55,p.trim,'can-lid',{shape:'cylinder'});
  for(const side of [-1,1]){add(side*.36,.61,0,.055,.25,.06,p.roofDark,'can-handle');add(side*.32,.735,0,.14,.055,.06,p.roofDark,'can-handle');}
  add(0,.0275,0,.7,.055,.7,p.roofDark,'can-base',{shape:'cylinder'});
  add(.341,.46,0,.025,.55,.16,p.roofDark,'can-gauge');fill({x:.358,y:.185+.55*ratio/2,z:0,width:.02,height:.55*ratio,depth:.1,color:p.trim,feature:'native-stock-gauge'});
 }else if(e.domainId==='stand'){
  add(0,.08,0,w,.16,d,p.woodDark,'body');
  for(let i=0;i<5;i++)add(0,.16015,-d/2+(i+.5)*d/5,w-.12,.0003,d/5-.035,p.wood,'stand-plank',{fine:true});
  for(const side of [-1,1]){add(side*(w/2-.08),.65,0,.14,1.12,d*.55,p.wood,'stand-rail');add(side*(w/2-.08),1.17,0,.17,.1,d*.7,p.trim,'stand-top');}
  if(e.value<40)add(0,.161,0,w*.4,.001,d*.4,p.soil,'native-stand-dirt');
 }else if(e.domainId==='clean'){
  add(0,.06,0,w,.12,d,p.woodDark,'body');add(-.25,.48,0,.055,.85,.055,p.wood,'cleaning-brush',{tilt:-.15});add(-.3,.17,0,.32,.13,.18,p.straw,'cleaning-brush');
  add(.22,.335,.12,.4,.43,.4,p.metal,'cleaning-pail',{shape:'cylinder'});add(.22,.55,.12,.43,.05,.43,p.roofDark,'cleaning-pail',{shape:'cylinder'});
  if(e.value<40)add(0,.125,-.24,.45,.02,.28,p.soil,'native-barn-dirt');
 }else if(e.domainId==='coop'){
  // Existing co-op action station, not a new shop/building or inventory crate.
  add(0,.08,0,w,.16,d,p.woodDark,'body');for(const x of [-.32,.32])add(x,.65,0,.08,1.1,.08,p.wood,'coop-sign');add(0,.95,0,.86,.58,.12,p.roof,'coop-sign');add(0,.95,.07,.62,.34,.025,p.trim,'coop-sign');add(0,.94,.094,.15,.24,.025,p.metal,'coop-mark');
 }
 return{shell,fills};
}
