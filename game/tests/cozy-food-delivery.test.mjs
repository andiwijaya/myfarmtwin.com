import test from 'node:test';
import assert from 'node:assert/strict';
import {COZY_FOOD_MENU,createCozyState,dispatchCozy,validateCozyState} from '../client/cozy-domain.js';
import {openCozyCommonEngine} from '../client/cozy-common-engine.js';
import {HOUSE_SITE} from '../client/cozy-houses.js';
import {COZY_SAVE_KEY,CozySession} from '../client/cozy-storage.js';

function apply(state,type,args={}){
 const result=dispatchCozy(state,{type,...args,revision:state.revision});
 assert.ok(result.ok,result.error);
 return result.state;
}

function reject(state,type,args,reason){
 const result=dispatchCozy(state,{type,...args,revision:state.revision});
 assert.equal(result.error,reason);
 assert.equal(result.state,state);
}

function farmWithHome(){
 const state=createCozyState();
 state.inventory.push({id:'corn',type:'corn',quantity:7,quality:1,sourceId:'bed.0',value3000:7*14*3000});
 return apply(apply(state,'sellAll'),'build',{kind:'house',transform:HOUSE_SITE});
}

test('food orders charge the listed price once and wait for delivery before market pickup',()=>{
 reject(createCozyState(),'orderFood',{meal:'friedRice'},'houseNotBuilt');
 const before=farmWithHome();
 reject(before,'orderFood',{meal:'__proto__'},'invalidMeal');
 reject(before,'orderFood',{meal:'friedRice',price:1},'invalidCommand');
 const poor={...before,coins:5,ledger:[],house:{...before.house,salesCoins:0}};
 reject(validateCozyState(poor),'orderFood',{meal:'noodles'},'noCoins');

 const ordered=apply(before,'orderFood',{meal:'friedRice'});
 const order=ordered.foodOrder;
 assert.deepEqual(order,{id:ordered.revision,meal:'friedRice',marketId:'market',orderedTick:before.tick,deliveredTick:null});
 assert.equal(ordered.coins,before.coins-COZY_FOOD_MENU.friedRice.price);
 assert.equal(ordered.ledger.at(-1).type,'meal_purchase');
 reject(ordered,'orderFood',{meal:'chickenRice'},'foodOrderActive');
 reject(ordered,'collectFood',{order:order.id,market:'market'},'foodOrderUnavailable');
 reject(ordered,'arriveFood',{order:order.id+1},'foodOrderUnavailable');

 const waited=apply(ordered,'advance',{hours:6});
 const arrived=apply(waited,'arriveFood',{order:order.id});
 assert.equal(arrived.foodOrder.deliveredTick,waited.tick);
 assert.equal(arrived.coins,ordered.coins);
 assert.deepEqual(arrived.ledger,ordered.ledger);
 reject(arrived,'arriveFood',{order:order.id},'foodOrderUnavailable');
 reject(arrived,'collectFood',{order:order.id,market:'elsewhere'},'foodOrderUnavailable');
 reject(arrived,'carryFood',{order:order.id},'foodOrderUnavailable');
 const requested=apply(arrived,'collectFood',{order:order.id,market:'market'});
 assert.equal(requested.foodOrder.pickup,'requested');
 reject(requested,'collectFood',{order:order.id,market:'market'},'foodOrderUnavailable');
 reject(requested,'finishFood',{order:order.id},'foodOrderUnavailable');
 reject(requested,'orderFood',{meal:'noodles'},'foodOrderActive');
 const carrying=apply(requested,'carryFood',{order:order.id});
 assert.equal(carrying.foodOrder.pickup,'carrying');
 reject(carrying,'carryFood',{order:order.id},'foodOrderUnavailable');
 reject(carrying,'finishFood',{order:order.id+1},'foodOrderUnavailable');
 const home=apply(carrying,'finishFood',{order:order.id});
 assert.equal(home.foodOrder,undefined);
 assert.equal(home.coins,ordered.coins);
 assert.deepEqual(home.ledger,ordered.ledger);
 assert.ok(apply(home,'orderFood',{meal:'noodles'}).foodOrder.id>order.id);
});

test('food orders persist at every delivery stage across Common Engine, native and saved backups',async()=>{
 const old=farmWithHome();
 assert.equal(validateCozyState(old),old);
 const saved=new Map([[COZY_SAVE_KEY,JSON.stringify(old)]]);
 const storage={getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)};
 const native=new CozySession(storage);
 const runtime=await openCozyCommonEngine(null,{native});
 try{
  assert.equal((await runtime.command('orderFood',{meal:'chickenRice'})).ok,true);
  const order=runtime.state.foodOrder;
  assert.deepEqual(new CozySession(storage).state.foodOrder,order);
  for(const invalid of [{id:order.id+1},{meal:'unlisted'},{marketId:'pond'},{deliveredTick:old.tick-1},{pickup:'requested'},{extra:true}]){
   const state={...runtime.state,foodOrder:{...order,...invalid}};
   assert.throws(()=>validateCozyState(state),/saveImportInvalid/);
  }
  assert.equal((await runtime.command('arriveFood',{order:order.id})).ok,true);
  const reopened=new CozySession(storage);
  assert.equal(reopened.state.foodOrder.deliveredTick,old.tick);
  assert.equal(reopened.state.coins,old.coins-COZY_FOOD_MENU.chickenRice.price);
  assert.equal(JSON.parse(reopened.exportBundle()).state.foodOrder.id,order.id);
  assert.equal(reopened.command('collectFood',{order:order.id,market:'market'}).ok,true);
  const pickupRuntime=await openCozyCommonEngine(null,{native:new CozySession(storage)});
  try{
   assert.equal(pickupRuntime.state.foodOrder.pickup,'requested');
   assert.throws(()=>validateCozyState({...pickupRuntime.state,foodOrder:{...pickupRuntime.state.foodOrder,pickup:'walking'}}),/saveImportInvalid/);
   assert.equal((await pickupRuntime.command('carryFood',{order:order.id})).ok,true);
   const resumed=new CozySession(storage);
   assert.equal(JSON.parse(resumed.exportBundle()).state.foodOrder.pickup,'carrying');
   assert.equal(resumed.command('finishFood',{order:order.id}).ok,true);
  }finally{pickupRuntime.dispose();}
  assert.equal(Object.hasOwn(new CozySession(storage).state,'foodOrder'),false);
 }finally{runtime.dispose();}
});
