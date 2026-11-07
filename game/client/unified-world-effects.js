/** @typedef {Readonly<import('./unified-world-model.js').WorldSnapshot>} Snapshot */
/** @typedef {{key:string,entityId:string,kind:string,commandId?:number,started:number,until:number}} Signal */
/** Current native stock/eligibility, never a care/production calculation.
 * @param {Snapshot} snapshot @returns {Signal[]} */
export function readySignals(snapshot){return snapshot.entities.flatMap(e=>{const kind=e.kind==='plot'&&e.crop?.progress===1?'ripe':e.zone==='chicken'&&e.domainId==='nest'&&e.value>0?'eggs':e.kind==='cow'&&e.ready?'milk':e.kind==='fishPond'&&e.ready?'fish':'';return kind?[{key:'ready.'+e.id,entityId:e.id,kind,started:0,until:Infinity}]:[];});}
/** Only accepted event+command pairs create a receipt; IDs come from the native
 * command/snapshot. This helper neither dispatches nor reads a wallet/ledger.
 * @param {readonly import('./engine.js').DomainEvent[]} events
 * @param {Readonly<import('./engine.js').Command>} command @param {Snapshot} snapshot */
export function acceptedSignal(events,command,snapshot){let kind='',id='';for(const e of events){if((e.type==='sold'&&command.type==='sell'||e.type==='chickenEggsSold'&&command.type==='sellEggs'||e.type==='goatSold'&&command.type==='sellGoat'||e.type==='cowMilkSold'&&command.type==='sellCowMilk')&&(e.amount||0)>0||e.type==='fishSold'&&command.type==='fish.sell'){kind='sale';id='market.central';break;}if(e.type==='harvested'&&command.type==='harvest'&&(e.amount||0)>0){kind='harvest';id='field.plot.'+e.plot;break;}if(e.type==='fishHarvested'&&command.type==='fish.harvest'){kind='harvest';id='fish.pond.'+command.fishPond;break;}if(e.type==='cowMilked'&&command.type==='milkCow'&&(e.amount||0)>0){kind='milked';id='cow.animal.'+e.cowId;break;}if(e.type==='chickenCollected'&&command.type==='collectEggs'&&(e.amount||0)>0){kind='collect';id='chicken.nest';break;}if(e.type==='watered'&&command.type==='water'&&(e.amount||0)>0){kind='water';id='field.plot.'+e.plot;break;}if(e.type==='fishWaterExchanged'&&command.type==='fish.exchange'){kind='water';id='fish.pond.'+command.fishPond;break;}}return kind&&snapshot.entities.some(e=>e.id===id)?{entityId:id,kind}:null;}
/** Bounded cosmetic state, sampled only by the existing renderer RAF. No timers,
 * simulation clock, historical-ledger replay or authoritative state writes. */
export function createWorldEffects(){let previous=/** @type {Snapshot|null} */(null),receipts=/** @type {Signal[]} */([]);const work=/** @type {Map<string,Signal>} */(new Map());let lastCommand=-1,accepted=0;
 const prune=(/** @type {number} */now)=>{receipts=receipts.filter(r=>r.until>now);for(const[key,value]of work)if(value.until<=now)work.delete(key);};
 return{
  /** @param {Snapshot} next @param {number} now */
  observe(next,now){if(next.paused)work.clear();else if(previous&&next.tick>previous.tick)for(const e of next.entities){const before=previous.entities.find(p=>p.id===e.id),pump=e.kind==='pump'&&e.value===1&&before&&e.workCounter!==undefined&&before.workCounter!==undefined&&e.workCounter>before.workCounter&&next.coveredPlotIds.length>0,air=e.kind==='fishEquipment'&&e.domainId==='aerator'&&e.active&&e.status==='running';if(pump||air)work.set(e.id,{key:'work.'+e.id,entityId:e.id,kind:pump?'pump':'air',started:now,until:now+2600});}for(const[key,value]of work){const e=next.entities.find(e=>e.id===value.entityId);if(!e||value.kind==='pump'&&e.value!==1||value.kind==='air'&&(!e.active||e.status!=='running'))work.delete(key);}previous=next;prune(now);},
  /** @param {readonly import('./engine.js').DomainEvent[]} events @param {Readonly<import('./engine.js').Command>} command @param {Snapshot} snapshot @param {number} now */
  accept(events,command,snapshot,now){if(!Number.isSafeInteger(command.id)||command.id<=lastCommand)return;lastCommand=command.id;const signal=acceptedSignal(events,command,snapshot);if(!signal)return;accepted++;receipts=receipts.filter(r=>r.entityId!==signal.entityId);receipts.push({...signal,key:'receipt.'+command.id,commandId:command.id,started:now,until:now+2400});if(receipts.length>8)receipts.shift();},
  /** @param {number} now @param {boolean} still */
  sample(now,still){prune(now);if(still){receipts=[];work.clear();}return{receipts:receipts.map(r=>({...r})),work:[...work.values()].map(r=>({...r})),accepted};},
  /** @param {number} now */
  active(now){prune(now);return receipts.length+work.size;},
  reset(){previous=null;receipts=[];work.clear();lastCommand=-1;accepted=0;}
 };
}
