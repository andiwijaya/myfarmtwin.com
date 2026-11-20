import test from 'node:test';
import assert from 'node:assert/strict';
import {createCozyState,dispatchCozy,houseSalesCoins,validateCozyState} from '../client/cozy-domain.js';
import {HOUSE_CLEARANCE,HOUSE_LEVELS,HOUSE_SITE} from '../client/cozy-houses.js';
import {findPlacement,placementIssue,placementsOverlap} from '../client/cozy-placement.js';
import {CozySession,COZY_SAVE_KEY} from '../client/cozy-storage.js';
import {openCozyCommonEngine} from '../client/cozy-common-engine.js';

const run=(state,type,args={})=>{
 const result=dispatchCozy(state,{type,...args,revision:state.revision});
 assert.equal(result.ok,true,result.error);
 return result.state;
};
const reject=(state,type,args,reason)=>{
 const result=dispatchCozy(state,{type,...args,revision:state.revision});
 assert.equal(result.ok,false);
 assert.equal(result.error,reason);
 assert.equal(result.state,state);
};
const buildHouse={kind:'house',transform:HOUSE_SITE};
const newLot=(quantity)=>({id:'test.corn',type:'corn',quantity,quality:1,sourceId:'bed.0',value3000:quantity*14*3000});
function withSale(state,quantity=450){
 state.inventory.push(newLot(quantity));
 return run(state,'sellAll');
}

test('starter coins and legacy service credit cannot pay for a house',()=>{
 const state=createCozyState();
 assert.ok(state.coins>=HOUSE_LEVELS[0].price);
 state.progression.credit3000=300_000;
 reject(state,'build',buildHouse,'houseSalesRequired');
 assert.equal(state.house,undefined);
 assert.equal(state.layout.items.some(p=>p.kind==='house'),false);
 reject(state,'upgradeHouse',{level:0},'houseNotBuilt');
});

test('one plot supports all ten models and every step deducts the advertised price once',()=>{
 let state=createCozyState();
 for(const kind of ['barn','coop','goatShelter','pond'])state=run(state,'start',{kind});
 state=withSale(state);
 state.progression.credit3000=60_000;
 const levels=HOUSE_LEVELS.map(level=>level.model),positions=state.layout.items.length;
 assert.equal(new Set(levels).size,10);
 assert.equal(findPlacement(state,'house','house').x,HOUSE_SITE.x);
 for(const [index,level] of HOUSE_LEVELS.entries()){
  const before=state.coins,sales=houseSalesCoins(state);
  state=index===0?run(state,'build',buildHouse):run(state,'upgradeHouse',{level:index});
  assert.deepEqual(state.house,{level:index+1,salesCoins:sales-level.price});
  assert.equal(state.coins,before-level.price);
  assert.equal(state.progression.credit3000,60_000);
  assert.deepEqual(state.layout.items.find(p=>p.kind==='house'),{id:'house',kind:'house',...HOUSE_SITE});
  assert.equal(state.layout.items.length,positions+1);
  assert.equal(state.ledger.at(-1).type,index===0?'build_house':'house_upgrade');
  if(index>0&&index<HOUSE_LEVELS.length-1)reject(state,'upgradeHouse',{level:index},'houseLevelChanged');
 }
 reject(state,'build',buildHouse,'farmFull');
 reject(state,'upgrade',{facility:'house'},'facilityMissing');
 reject(state,'upgradeHouse',{level:HOUSE_LEVELS.length},'houseMax');
});

test('the clearance applies to both the house and livestock placement for any level',()=>{
 let state=createCozyState();
 for(const kind of ['barn','coop','goatShelter'])state=run(state,'start',{kind});
 state=run(withSale(state),'build',buildHouse);
 const house=state.layout.items.find(p=>p.kind==='house');
 for(const livestock of state.layout.items.filter(p=>['barn','coop','goatShelter'].includes(p.kind))){
  assert.equal(placementsOverlap(house,livestock,HOUSE_CLEARANCE),false);
 }
 const near={x:-7,z:-17,rotation:0};
 assert.equal(placementIssue(state,{...house,...near}),'houseLivestockClearance');
 reject(state,'move',{id:'house',transform:near},'houseLivestockClearance');
 reject(state,'move',{id:'barn',transform:{x:-3,z:-16,rotation:0}},'houseLivestockClearance');
 reject(state,'build',{kind:'coop',transform:{x:-6,z:-16,rotation:0}},'houseLivestockClearance');
});

test('existing ledgers recover only unspent sales and new savings survive the bounded history',()=>{
 const state=createCozyState();
 state.ledger=[
  {id:'old.1',tick:6,type:'produce_sale',amount:100,balance:220},
  {id:'old.2',tick:6,type:'seed_purchase',amount:-144,balance:76},
  {id:'old.3',tick:6,type:'mission_reward',amount:30,balance:106},
 ];
 state.coins=106;
 assert.equal(validateCozyState(state),state);
 assert.equal(houseSalesCoins(state),76);
 const home=run(state,'build',buildHouse);
 assert.deepEqual(home.house,{level:1,salesCoins:26});
 assert.equal(home.coins,56);
 home.ledger=Array.from({length:5000},(_,i)=>({id:'retained.'+i,tick:6,type:'seed_purchase',amount:0,balance:56}));
 const spent=run(home,'buySeed',{crop:'lettuce',quantity:9});
 assert.equal(spent.ledger.length,5000);
 assert.equal(spent.house.salesCoins,20);
 reject(spent,'upgradeHouse',{level:1},'houseSalesRequired');
});

test('the engine and native backup export retain the exact home level and sales balance',async()=>{
 const values=new Map();
 const store={getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
 const state=createCozyState();
 state.inventory.push(newLot(20));
 const raw=JSON.stringify(state);
 store.setItem(COZY_SAVE_KEY,raw);
 const native=new CozySession(store);
 const runtime=await openCozyCommonEngine(null,{native});
 try{
  assert.equal(store.getItem(COZY_SAVE_KEY),raw);
  assert.equal((await runtime.command('sellAll')).ok,true);
  assert.equal((await runtime.build('house',HOUSE_SITE)).ok,true);
  assert.equal((await runtime.command('upgradeHouse',{level:1})).ok,true);
  assert.equal((await runtime.command('upgradeHouse',{level:1})).error,'houseLevelChanged');
  const resumed=new CozySession(store);
  assert.deepEqual(resumed.state.house,{level:2,salesCoins:140});
  const recovery=new CozySession(store,{writable:false});
  assert.deepEqual(recovery.state.house,resumed.state.house);
  const backup=JSON.parse(resumed.exportBundle());
  assert.deepEqual(validateCozyState(backup.state).house,resumed.state.house);
  for(const bad of [{level:0,salesCoins:140},{level:11,salesCoins:140},{level:2,salesCoins:resumed.state.coins+1}]){
   assert.throws(()=>validateCozyState({...resumed.state,house:bad}),/saveImportInvalid/);
  }
 }finally{
  runtime.dispose();
 }
});
