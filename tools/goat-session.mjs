import {createState,dispatch} from '../game/client/engine.js';
import {serialize,deserialize} from '../game/client/save-schema.js';
import {SaveSession} from '../game/client/storage.js';
import {assertInvariants} from '../game/client/invariants.js';
import {GOAT} from '../game/client/goat-config.js';
import {goatQuote,goatContractReason} from '../game/client/goat-market-policy.js';
import {goatCapacities} from '../game/client/goat-state.js';
import {CHICKEN} from '../game/client/chicken-config.js';
import {CROPS} from '../game/client/config.js';
import assert from 'node:assert/strict';import {pathToFileURL} from 'node:url';import {mkdir,writeFile} from 'node:fs/promises';

/** A real paid strategy; no injected resources, clocks or RNG. */
export function runGoatSession({days=35,seed=6321,mode='mixed',care='good',replay=true,broke=false}={}){
 let s=createState(seed),minimumCoins=s.coins,peakSaveBytes=0,replays=0;const trace=[],values=new Map(),db={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)};let session=new SaveSession(db);session.load();session.save(s);
 function act(type,extra={}){const cmd={id:s.revision+1,type,...extra},r=dispatch(s,cmd);assert.ok(r.ok,type+':'+r.error);s=r.state;trace.push(cmd);assertInvariants(s);minimumCoins=Math.min(minimumCoins,s.coins);session.save(s);if(trace.length%11===0){assert.equal(dispatch(s,cmd).error,'staleCommand');replays++;}}
 if(broke)for(let n=0;n<15;n++)act('buySeed',{crop:'lettuce'});if(mode==='mixed')act('enterYard');for(const type of ['enterGoat','feedGoats','waterGoats','cleanGoatShelter'])act(type);act('inspectGoat',{goatId:'goat.starter.adult'});const first=goatQuote(s,'goat.starter.adult');act('sellGoat',{goatId:first.goatId,quotePrice:first.price});act('buyGoat');
 const daily=[];
 for(let day=0;day<days;day++){
  if(mode==='mixed'){
   for(const p of [...s.plots])if(p.crop?.progress===1)act('harvest',{plot:p.id});for(const lot of [...s.inventory])act('sell',{lot:lot.id});
   const c=s.chicken;if(c.coop.feedG<500){if(c.feedStoreG===0&&s.coins>=CHICKEN.feedBagPrice)act('buyFeed');if(s.chicken.feedStoreG>0)act('feedHens');}if(s.water<70&&s.coins>=6)act('refill');if(s.chicken.coop.waterL<1&&s.water>0)act('waterHens');if(s.chicken.coop.cleanliness<90&&s.coins>=1&&s.tick-s.chicken.coop.lastCleanTick>=6)act('cleanCoop');
   for(const p of [...s.plots]){if(!p.crop){if(s.seeds.lettuce===0&&s.coins>=CROPS.lettuce.seedPrice+30)act('buySeed',{crop:'lettuce'});if(s.seeds.lettuce>0)act('plant',{plot:p.id,crop:'lettuce'});}if(s.plots[p.id].crop&&s.plots[p.id].soilWaterMm<22){if(s.water<25&&s.coins>=6)act('refill');if(s.water>=25&&s.coins>=2)act('water',{plot:p.id});}}
  }
  if(care==='good'){
   let g=s.goat;if(g.hayStockG<GOAT.hayBagG&&s.coins>=GOAT.hayBagPrice)act('buyHay');g=s.goat;if(g.hayStockG>0&&g.feederG<goatCapacities(g).feederG-.001)act('feedGoats');if(s.water<20&&s.coins>=6)act('refill');if(s.water>0&&s.goat.troughMl<goatCapacities(s.goat).troughMl-.001)act('waterGoats');if(s.goat.shelter.cleanliness<90&&s.tick-s.goat.shelter.lastCleanTick>=GOAT.cleanInterval)act('cleanGoatShelter');
   for(const goat of [...s.goat.herd])if(!goatContractReason(s,goat.id)){const q=goatQuote(s,goat.id);act('sellGoat',{goatId:goat.id,quotePrice:q.price});}if(s.goat.herd.length<3&&s.coins>=GOAT.weanedPrice+GOAT.hayBagPrice)act('buyGoat');
  }
  act('nextDay');if(mode==='mixed'){if(s.chicken.coop.pending.length)act('collectEggs');for(const lot of [...s.chicken.inventory])act('sellEggs',{eggLot:lot.id});}
  const text=serialize(s);peakSaveBytes=Math.max(peakSaveBytes,Buffer.byteLength(text));assert.deepEqual(deserialize(text),s);session=new SaveSession(db);const loaded=session.load();assert.equal(loaded.status,'saveResumed');assert.deepEqual(loaded.state,s);s=loaded.state;daily.push({day:day+1,coins:s.coins,herd:s.goat.herd.length,goatSales:s.goat.stats.sold,nutrition:s.goat.nutrition,hydration:s.goat.hydration,growth:s.goat.herd.reduce((n,h)=>n+h.growth,0)/s.goat.herd.length});
 }
 if(replay){let again=createState(seed);for(const cmd of trace){const r=dispatch(again,cmd);assert.ok(r.ok,r.error);again=r.state;}assert.deepEqual(again,s,'deterministic mixed-farm replay');}
 return {days,seed,mode,care,broke,commands:trace.length,replays,minimumCoins,peakSaveBytes,coins:s.coins,goatSales:s.goat.stats.sold,goatPurchases:s.goat.stats.bought,cropSold:s.stats.sold,eggsSold:s.chicken.stats.sold,herd:s.goat.herd.length,daily,state:s};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){const {state,...report}=runGoatSession({days:Number(process.argv[2])||35});assert.ok(report.cropSold>0&&report.eggsSold>0&&report.goatSales>1);assert.equal(state.tick,report.days*24);assert.ok(report.peakSaveBytes<500000);console.log(JSON.stringify(report));if(process.env.QA_DIR){await mkdir(process.env.QA_DIR,{recursive:true});await writeFile(process.env.QA_DIR+'/goat-session.json',JSON.stringify(report,null,2));}}
