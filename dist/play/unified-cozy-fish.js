import {COZY_ART} from './unified-cozy-art.js';
import {waterStyle} from './unified-world-water.js';
/** @typedef {import('./unified-world-environment.js').EnvironmentPart} Part */
/** Crafted, opaque basin parts only. The existing independently sorted water
 * film, fish pivot, native clarity mapping and ripple controller stay separate.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e @returns {Part[]} */
export function fishPondParts(e){
 if(e.kind!=='fishPond')return[];
 const w=e.width,d=e.depth,parts=/** @type {Part[]} */([]);
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'box',fixed:true,startupOptional:false,...extra});
 add(0,.012,0,w,.024,d,'#9eaa7f','basin-foundation');
 add(0,.03,0,w-.4,.02,d-.4,waterStyle(e.clarity).water,'native-water-bed');
 for(const side of [-1,1]){
  add(side*(w/2-.1),.13,0,.2,.26,d,'#b4b394','bank',{shape:'bevel'});
  add(0,.13,side*(d/2-.1),w-.4,.26,.2,'#b4b394','bank',{shape:'bevel'});
  add(side*(w/2-.12),.30,0,.24,.1,d,'#ded0aa','bank-cap',{shape:'bevel'});
  add(0,.30,side*(d/2-.12),w-.48,.1,.24,'#d4c9a6','bank-cap',{shape:'bevel'});
  add(side*(w/2-.215),.18,0,.025,.15,d-.48,'#738d7f','damp-bank');
  add(0,.18,side*(d/2-.215),w-.48,.15,.025,'#738d7f','damp-bank');
  for(const z of [-d*.27,0,d*.27])add(side*(w/2-.12),.3502,z,.22,.0004,.018,'#aa9f7d','stone-joint',{fine:true,startupOptional:true});
  for(const x of [-w*.24,w*.24])add(x,.3502,side*(d/2-.12),.018,.0004,.22,'#aa9f7d','stone-joint',{fine:true,startupOptional:true});
 }
 return parts;
}

/** Tools have no invented supplies. Native boolean/paid-energy cues are kept
 * distinct from inventory quantities and never imply a running motor/filter.
 * These parts exist only for entities supplied by the native ownership view.
 * @param {Readonly<import('./unified-world-model.js').WorldEntity>} e @returns {Part[]} */
export function fishCareParts(e){
 if(e.kind!=='fishEquipment'&&e.kind!=='fishStation')return[];
 const p=COZY_ART.palette,parts=/** @type {Part[]} */([]),w=e.width,d=e.depth;
 /** @param {number} x @param {number} y @param {number} z @param {number} width @param {number} height @param {number} depth @param {string} color @param {string} feature @param {Partial<Part>} [extra] */
 const add=(x,y,z,width,height,depth,color,feature,extra={})=>parts.push({x,y,z,width,height,depth,color,feature,shape:'box',fixed:true,startupOptional:false,...extra});
 add(0,.025,0,w*.92,.05,d*.92,p.woodDark,'tool-foot');
 if(e.kind==='fishEquipment'&&e.domainId==='aerator'){
  add(0,.22,0,.46,.32,.44,p.metal,'air-pump',{shape:'bevel'});
  add(0,.405,0,.43,.05,.42,p.roof,'motor-cover',{shape:'bevel'});
  add(.15,.15,-.235,.07,.07,.18,p.metal,'air-outlet');
  add(-.235,.29,.04,.025,.08,.09,e.active?'#8bbca6':'#a79c83',e.active?'native-air-active':'native-air-idle');
  for(const y of [.20,.27])add(0,y,.225,.22,.02,.012,p.shade,'motor-vent',{fine:true,startupOptional:true});
  if(e.automatic)add(0,.46,0,.16,.06,.15,p.straw,'native-efficient-air',{shape:'bevel'});
 }else if(e.equipment==='filter'){
  add(0,.29,0,.42,.46,.42,p.metal,'biofilter-drum',{shape:'cylinder'});
  add(0,.55,0,.47,.06,.47,p.roof,'filter-lid',{shape:'cylinder'});
  for(const x of [-.12,.12])add(x,.615,0,.07,.07,.07,p.metal,'filter-port');
  for(const y of [.15,.44])add(0,y,0,.435,.02,.435,p.woodDark,'drum-band',{shape:'cylinder',fine:true,startupOptional:true});
  if(e.value>0)add(0,.59,.12,.1,.035,.1,p.straw,'native-filter-credit');
 }else if(e.equipment==='feeder'){
  for(const x of [-.19,.19])add(x,.14,0,.07,.28,.07,p.woodDark,'feeder-leg');
  add(0,.43,0,.46,.33,.35,p.wood,'feeder-hopper',{shape:'bevel'});
  add(0,.6225,0,.54,.055,.43,p.roof,'feeder-lid',{shape:'bevel'});
  add(0,.205,0,.13,.19,.13,p.metal,'ration-outlet',{shape:'cylinder'});
  if(e.value>0)add(0,.455,.181,.12,.035,.015,p.straw,'native-feeder-enabled');
  add(0,.52,.183,.08,.06,.015,e.active?'#8bbca6':p.metal,e.active?'native-feed-active':'native-feed-idle');
 }else if(e.domainId==='feed'){
  add(0,.24,0,.55,.34,.45,p.wood,'feed-toolbox',{shape:'bevel'});
  add(0,.43,0,.60,.04,.49,p.roof,'closed-toolbox-lid');
  add(.12,.4675,.02,.23,.035,.07,p.woodDark,'scoop-handle');
  add(-.045,.475,.02,.12,.05,.12,p.metal,'scoop',{shape:'bevel'});
  if(e.active)add(0,.455,-.1,.09,.015,.06,p.straw,'native-feed-pending');
 }else if(e.domainId==='water'){
  add(0,.095,0,.34,.09,.34,p.metal,'pump-base',{shape:'cylinder'});
  add(0,.315,0,.13,.35,.13,p.roof,'exchange-pump',{shape:'cylinder'});
  add(.10,.42,0,.27,.06,.07,p.metal,'pump-spout');
  add(.20,.39,0,.055,.10,.07,p.metal,'spout-lip');
  add(0,.50,0,.42,.045,.06,p.woodDark,'pump-handle',{tilt:.12});
 }else if(e.domainId==='harvest'){
  for(const side of [-1,1]){
   add(side*.29,.12,0,.05,.14,.52,p.wood,'empty-net-rack');
   add(0,.12,side*.235,.55,.14,.05,p.wood,'empty-net-rack');
   add(side*.26,.2025,-.08,.025,.025,.42,p.metal,'net-rim');
   add(0,.2025,-.08+side*.2,.54,.025,.025,p.metal,'net-rim');
   add(side*.09,.1995,-.08,.008,.008,.39,p.metal,'net-mesh',{fine:true,startupOptional:true});
   add(0,.1995,-.08+side*.07,.5,.008,.008,p.metal,'net-mesh',{fine:true,startupOptional:true});
  }
  add(0,.22,.24,.045,.035,.28,p.woodDark,'net-handle');
 }else if(e.domainId==='market'){
  for(const x of [-.24,0,.24])add(x,.075,0,.22,.05,.68,p.wood,'dispatch-plank');
  add(-.22,.30,0,.06,.44,.06,p.woodDark,'dispatch-post');
  add(-.12,.47,0,.4,.16,.04,p.trim,'dispatch-sign',{shape:'bevel'});
  add(-.06,.47,.026,.20,.025,.012,p.roof,'dispatch-mark');
 }
 return parts;
}
