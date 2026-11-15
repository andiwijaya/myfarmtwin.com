import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createState,dispatch} from '../client/engine.js';
import {serialize,deserialize} from '../client/save-schema.js';
import {activateGarden} from '../client/active-garden.js';
import {cowSaleQuote} from '../client/cow-sales.js';
import {SAVE_KEY,BACKUP_KEY} from '../client/storage.js';
import {PrototypeSession,createPrototypeLayout,validatePrototypeLayout,placementIssue,placementsOverlap,GLB_LAYOUT_KEY,GLB_LAYOUT_BACKUP_KEY,GLB_NATIVE_ARCHIVE_KEY,GLB_LAYOUT_ARCHIVE_KEY,GLB_TRANSACTION_KEY} from '../client/glb-prototype-state.js';

function database(entries=[]){
 const db=new Map(entries),writes=[];
 const storage={getItem:k=>db.get(k)??null,setItem:(k,v)=>{writes.push(['set',k,v]);db.set(k,v);},removeItem:k=>{writes.push(['remove',k]);db.delete(k);}};
 return {db,writes,storage,session:new PrototypeSession(storage)};
}
function accepted(result){assert.equal(result.ok,true,result.error);return result;}
const fixture=name=>readFileSync(new URL('./fixtures/unified-world/'+name,import.meta.url),'utf8');

test('fresh preview and camera/placement validation write nothing and expose 24 owned beds without granting cows',()=>{
 const {db,writes,session:s}=database();assert.equal(s.state.plots.length,24);assert.equal(s.state.cow.visited,false);assert.equal(s.layout.items.filter(p=>p.kind==='bed').length,24);
 assert.equal(s.previewPlacement({...s.layout.items[0]}),'');assert.equal(s.previewPlacement({...s.layout.items[0],x:99}),'layoutOutsideFarm');
 assert.equal(writes.length,0);assert.equal(db.size,0);assert.equal(s.state.cow.cows.length,0);assert.deepEqual(deserialize(s.exportNative()),createState());
});

test('all frozen legacy saves open without writes; first real action archives source bytes and preserves the whole native oracle',()=>{
 for(const name of ['v0-fresh.json','v1-mixed.json','v2-mixed.json','v3-mixed.json','v4-mixed.json','v5-mixed.json']){
  const raw=fixture(name),{db,writes,session:s}=database([[SAVE_KEY,raw]]),baseline=activateGarden(deserialize(raw));
  assert.deepEqual(s.state,baseline,name);assert.equal(writes.length,0,name);assert.equal(s.readOnly,false,name);
  const expected=dispatch(baseline,{id:baseline.revision+1,type:'pause'});assert.equal(expected.ok,true);
  accepted(s.command('pause'));assert.deepEqual(s.state,expected.state,name);assert.deepEqual(deserialize(db.get(SAVE_KEY)),expected.state,name);
  assert.equal(db.get(GLB_NATIVE_ARCHIVE_KEY),raw,name);assert.equal(db.get(BACKUP_KEY),raw,name);assert.equal(s.state.plots.length,24,name);
 }
});

test('moving a native bed changes presentation only; native coordinates, livestock, funds and progression stay exact',()=>{
 const state=activateGarden(deserialize(fixture('v5-mixed.json'))),raw=serialize(state),{db,session:s}=database([[SAVE_KEY,raw]]);
 accepted(s.move('bed.23',{x:-16,z:8,rotation:Math.PI/3}));assert.equal(db.get(SAVE_KEY),raw);assert.equal(serialize(s.state),raw);
 assert.equal(s.layout.items.find(p=>p.id==='bed.23').x,-16);const reopened=new PrototypeSession(s.storage);assert.deepEqual(reopened.layout,s.layout);assert.equal(serialize(reopened.state),raw);
});

test('oriented footprints reject overlap and bounds while allowing legal rotated placements',()=>{
 const layout=createPrototypeLayout(),bed=layout.items[0];assert.equal(placementIssue(layout,{...bed,x:7,z:-4}),'layoutOccupied');assert.equal(placementIssue(layout,{...bed,x:-22,z:0}),'layoutOutsideFarm');
 assert.equal(placementsOverlap({id:'a',kind:'fence',x:0,z:0,rotation:Math.PI/4},{id:'b',kind:'fence',x:0,z:1,rotation:Math.PI/4}),false);
 assert.equal(placementsOverlap({id:'a',kind:'bed',x:0,z:0,rotation:0},{id:'b',kind:'bed',x:1,z:0,rotation:Math.PI/2}),true);
 assert.equal(placementIssue(layout,{id:'tree.1',kind:'tree',x:15,z:12,rotation:Math.PI/3}),'');
});

test('path placement uses the authored two-metre footprint including its edges',()=>{
 const {session:s}=database();assert.equal(s.previewPlacement({id:'path.1',kind:'path',x:-3.3,z:-7.5,rotation:0}),'layoutOccupied');
 assert.equal(s.previewPlacement({id:'path.1',kind:'path',x:21.1,z:12,rotation:0}),'layoutOutsideFarm');
 accepted(s.build('path',{x:0,z:12,rotation:0}));accepted(s.build('path',{x:2,z:12,rotation:0}));assert.equal(s.layout.items.filter(p=>p.kind==='path').length,2);
});

test('layout validation rejects missing beds, duplicate/foreign IDs, unsupported versions, extra fields and hidden accessor arrays',()=>{
 for(const mutate of [l=>l.items.pop(),l=>l.items.push({...l.items[0]}),l=>l.items[0].id='bed.99',l=>l.version=2,l=>l.extra=true,l=>l.items[0].x=NaN,l=>l.items[0].rotation=-1,l=>l.items[0].x=7,l=>l.nextId=0]){
  const layout=createPrototypeLayout();mutate(layout);assert.throws(()=>validatePrototypeLayout(layout));
 }
 const layout=createPrototypeLayout();Object.defineProperty(layout.items,'0',{get(){throw Error('getter executed');}});assert.throws(()=>validatePrototypeLayout(layout),/layoutInvalid/);
 assert.equal(validatePrototypeLayout(createPrototypeLayout()).items.length,26);
});

test('corrupt/future primary or corrupt/future sidecar blocks edits without overwriting protected bytes',()=>{
 const native=serialize(createState());
 for(const [primary,sidecar]of [['{bad',null],[JSON.stringify({format:'MyFarmTwin',saveVersion:99,state:{}}),null],[native,'{bad'],[native,JSON.stringify({...createPrototypeLayout(),version:2})]]){
  const entries=[[SAVE_KEY,primary],...(sidecar===null?[]:[[GLB_LAYOUT_KEY,sidecar]])],{db,writes,session:s}=database(entries),before=new Map(db);
  assert.equal(s.readOnly,true);assert.equal(s.command('pause').ok,false);assert.equal(s.move('bed.0',{x:-15,z:10,rotation:0}).ok,false);assert.deepEqual(db,before);assert.equal(writes.length,0);
 }
});

test('opening distinguishes sidecar corruption, unavailable storage and malformed journals while retaining valid native progress',()=>{
 let earned=createState();earned=dispatch(earned,{id:earned.revision+1,type:'plant',plot:4,crop:'lettuce'}).state;const native=serialize(earned);
 const badLayout=database([[SAVE_KEY,native],[GLB_LAYOUT_KEY,'{broken']]);assert.equal(badLayout.session.status,'saveResumed');assert.equal(badLayout.session.layoutStatus,'layoutInvalid');assert.equal(badLayout.session.readOnly,true);assert.deepEqual(badLayout.session.state,earned);assert.equal(badLayout.writes.length,0);
 const futureLayout=database([[SAVE_KEY,native],[GLB_LAYOUT_KEY,JSON.stringify({...createPrototypeLayout(),version:2})]]);assert.equal(futureLayout.session.status,'saveResumed');assert.equal(futureLayout.session.layoutStatus,'layoutNewer');assert.deepEqual(futureLayout.session.state,earned);
 const journal=database([[SAVE_KEY,native],[GLB_TRANSACTION_KEY,'{broken']]);assert.equal(journal.session.status,'saveImportPending');assert.equal(journal.session.readOnly,true);assert.deepEqual(journal.session.state,earned);assert.equal(journal.session.recoverPending().ok,false);assert.equal(journal.writes.length,0);assert.equal(journal.db.get(GLB_TRANSACTION_KEY),'{broken');
 const unavailable=new PrototypeSession({getItem(){throw Error('SecurityError');},setItem(){throw Error('must not write');},removeItem(){throw Error('must not remove');}});assert.equal(unavailable.status,'saveUnavailable');assert.equal(unavailable.readOnly,true);
});

test('a full native garden cycle plants/waters/grows/harvests/sells through engine commands and persists exact state',()=>{
 const {db,session:s}=database();accepted(s.command('plant',{plot:0,crop:'lettuce'}));accepted(s.command('water',{plot:0}));const plantedTick=s.state.tick;
 for(let i=0;i<40&&s.state.plots[0].crop.progress<1;i++){accepted(s.advance(6));if(s.state.plots[0].soilWaterMm<25)accepted(s.command('water',{plot:0}));}
 assert.equal(s.state.plots[0].crop.progress,1);assert.ok(s.state.tick>=plantedTick+48);assert.equal(s.state.paused,true);
 accepted(s.command('harvest',{plot:0}));const lot=s.state.inventory[0],before=s.state.coins;accepted(s.command('sell',{lot:lot.id}));assert.ok(s.state.coins>before);assert.equal(s.state.inventory.length,0);
 const pumpOracle=dispatch(s.state,{id:s.state.revision+1,type:'buyPump'});assert.equal(pumpOracle.ok,true);accepted(s.build('pump',{x:16,z:12,rotation:.5}));assert.deepEqual(s.state,pumpOracle.state);assert.equal(s.state.ledger.filter(l=>l.type==='facility_purchase').at(-1).amount,-60);assert.equal(s.layout.items.find(p=>p.id==='pump').x,16);
 assert.deepEqual(deserialize(db.get(SAVE_KEY)),s.state);assert.equal(s.state.stats.harvested,s.state.stats.sold);
});

test('advance uses exactly native tick transitions, preserving original pause state and rejecting invalid hours',()=>{
 for(const paused of [true,false]){
  const state=createState();state.paused=paused;const {session:s}=database([[SAVE_KEY,serialize(state)]]);let expected=state;
  const steps=[...(paused?['pause']:[]),...Array(7).fill('tick'),...(paused?['pause']:[])];for(const type of steps)expected=dispatch(expected,{id:expected.revision+1,type}).state;
  accepted(s.advance(7));assert.deepEqual(s.state,expected);assert.equal(s.state.paused,paused);
  const before=s.exportNative();for(const n of [0,-1,25,NaN,1.5,Infinity])assert.equal(s.advance(n).ok,false);assert.equal(s.exportNative(),before);
 }
});

test('cow ownership needs explicit build, then actual care, milking and exact quoted sale work with no duplicate starter',()=>{
 const {db,session:s}=database();assert.equal(s.state.cow.visited,false);accepted(s.build('barn',{x:7,z:-4,rotation:0}));assert.equal(s.state.cow.cows.length,2);assert.equal(db.has(GLB_TRANSACTION_KEY),false);
 const before=s.exportNative();assert.equal(s.build('barn',{x:7,z:-4,rotation:0}).ok,false);assert.equal(s.exportNative(),before);
 for(const type of ['feedCows','waterCows','cleanCowBarn','cleanCowStand','cleanCowCan'])accepted(s.command(type));accepted(s.command('milkCow',{cowId:'cow.starter.a',cowStorage:'can'}));
 assert.equal(s.state.cow.lots[0].remainingVolumeMl,4000);const ids=s.state.cow.lots.map(l=>l.id),quote=cowSaleQuote(s.state,ids),money=s.state.coins;accepted(s.command('sellCowMilk',{cowLots:ids,cowOrder:'',cowQuote:quote}));
 assert.ok(s.state.coins>money);assert.equal(s.state.cow.soldMilkMl,4000);assert.equal(s.state.cow.lots.length,0);assert.equal(s.state.ledger.filter(l=>l.id==='cow.starter.v1').length,1);assert.deepEqual(deserialize(db.get(SAVE_KEY)),s.state);
});

test('native purchase rejection or invalid position never charges funds or creates ownership',()=>{
 const {db,writes,session:s}=database(),original=s.exportNative();assert.equal(s.build('pump',{x:-3,z:3.5,rotation:0}).error,'sellFirst');assert.equal(s.build('barn',{x:-15,z:-7.5,rotation:0}).error,'layoutOccupied');assert.equal(s.state.pump.built,false);assert.equal(s.state.cow.visited,false);assert.equal(s.exportNative(),original);assert.equal(db.size,0);assert.equal(writes.length,0);
});

test('decorative kit build/remove is bounded, persistent and never mutates the native wallet',()=>{
 const {session:s,db}=database(),native=s.exportNative();
 for(let i=0;i<40;i++)accepted(s.build('fence',{x:-20+(i%20)*2.1,z:14+Math.floor(i/20)*.5,rotation:0}));
 assert.equal(s.build('fence',{x:10,z:10,rotation:0}).error,'layoutKitExhausted');assert.equal(s.exportNative(),native);assert.equal(db.has(SAVE_KEY),false);
 accepted(s.remove('fence.1'));accepted(s.build('fence',{x:-20,z:14,rotation:0}));assert.equal(s.layout.items.filter(p=>p.kind==='fence').length,40);assert.equal(s.remove('bed.0').error,'layoutOwnedFacility');assert.equal(s.remove('barn').error,'layoutOwnedFacility');assert.equal(s.exportNative(),native);
});

test('native and sidecar cross-tab changes preflight every mutation and retain other tab bytes',()=>{
 for(const mutate of ['native','layout']){
  const {db,storage,session:a}=database(),b=new PrototypeSession(storage);if(mutate==='native')accepted(b.command('plant',{plot:0,crop:'lettuce'}));else accepted(b.move('bed.0',{x:-15,z:10,rotation:0}));
  const before=new Map(db);assert.equal(a.command('pause').error,'saveConflict');assert.equal(a.move('bed.1',{x:-13,z:10,rotation:0}).ok,false);assert.deepEqual(db,before);
 }
});

test('quota failure before native write preserves both prior native bytes and in-memory economy',()=>{
 const initial=serialize(createState()),{db,storage}=database([[SAVE_KEY,initial]]),s=new PrototypeSession({...storage,setItem:(key,value)=>{if(key===SAVE_KEY)throw Error('quota');storage.setItem(key,value);}}),before=s.exportNative();
 assert.equal(s.command('plant',{plot:0,crop:'lettuce'}).error,'saveUnavailable');assert.equal(db.get(SAVE_KEY),initial);assert.equal(s.exportNative(),before);assert.equal(db.get(GLB_NATIVE_ARCHIVE_KEY),initial);
});

test('sidecar quota failure preserves previous layout and canonical save exactly',()=>{
 const layout=JSON.stringify(createPrototypeLayout()),native=serialize(createState()),{db,storage}=database([[SAVE_KEY,native],[GLB_LAYOUT_KEY,layout]]),s=new PrototypeSession({...storage,setItem:(key,value)=>{if(key===GLB_LAYOUT_KEY)throw Error('quota');storage.setItem(key,value);}}),before=structuredClone(s.layout);
 assert.equal(s.move('bed.0',{x:-15,z:10,rotation:0}).error,'layoutSaveUnavailable');assert.deepEqual(s.layout,before);assert.equal(db.get(GLB_LAYOUT_KEY),layout);assert.equal(db.get(GLB_LAYOUT_BACKUP_KEY),layout);assert.equal(db.get(SAVE_KEY),native);
});

test('bundle roundtrip preserves native farm and full layout; replacement archives both original preimages',()=>{
 const source=database();accepted(source.session.command('plant',{plot:2,crop:'lettuce'}));accepted(source.session.move('bed.2',{x:-11,z:10,rotation:.3}));accepted(source.session.build('banana',{x:18,z:12,rotation:1}));
 const oldNative=serialize(createState()),oldLayout=JSON.stringify(createPrototypeLayout()),target=database([[SAVE_KEY,oldNative],[GLB_LAYOUT_KEY,oldLayout]]);accepted(target.session.importBundle(source.session.exportBundle()));
 assert.deepEqual(target.session.state,source.session.state);assert.deepEqual(target.session.layout,source.session.layout);assert.equal(target.db.get(GLB_NATIVE_ARCHIVE_KEY),oldNative);assert.equal(target.db.get(GLB_LAYOUT_ARCHIVE_KEY),oldLayout);assert.equal(target.db.has(GLB_TRANSACTION_KEY),false);
 const reopened=new PrototypeSession(target.storage);assert.deepEqual(reopened.state,source.session.state);assert.deepEqual(reopened.layout,source.session.layout);
});

test('invalid/future/extra-field imports change nothing, including archives and backups',()=>{
 const {db,writes,session:s}=database([[SAVE_KEY,serialize(createState())]]),valid=JSON.parse(s.exportBundle());
 for(const bad of ['{',JSON.stringify({...valid,version:2}),JSON.stringify({...valid,extra:1}),JSON.stringify({...valid,native:JSON.stringify({format:'MyFarmTwin',saveVersion:99,state:{}})}),JSON.stringify({...valid,layout:{...valid.layout,items:[]}}),'x'.repeat(2_200_000)]){
  const before=new Map(db),count=writes.length;assert.equal(s.importBundle(bad).ok,false);assert.deepEqual(db,before);assert.equal(writes.length,count);
 }
});

test('interrupted native+layout commit recovers once after reload without replaying the cow grant',()=>{
 const {db,storage}=database();let failLayout=true;const fragile={...storage,setItem:(key,value)=>{if(key===GLB_LAYOUT_KEY&&failLayout)throw Error('quota');storage.setItem(key,value);}},s=new PrototypeSession(fragile);
 assert.equal(s.build('barn',{x:10,z:8,rotation:0}).error,'saveImportPending');assert.ok(db.has(GLB_TRANSACTION_KEY));assert.equal(deserialize(db.get(SAVE_KEY)).cow.cows.length,2);const storedNative=db.get(SAVE_KEY),writes=[];
 failLayout=false;const recovered=new PrototypeSession({...storage,setItem:(k,v)=>{writes.push(k);storage.setItem(k,v);}});assert.equal(writes.length,0);assert.equal(recovered.status,'saveImportPending');assert.equal(recovered.layout.items.find(p=>p.id==='barn').x,10);
 accepted(recovered.recoverPending());assert.equal(recovered.state.cow.cows.length,2);assert.equal(db.get(SAVE_KEY),storedNative);assert.equal(recovered.state.ledger.filter(l=>l.id==='cow.starter.v1').length,1);assert.equal(db.has(GLB_TRANSACTION_KEY),false);assert.equal(recovered.layout.items.find(p=>p.id==='barn').z,8);
});

test('crash recovery refuses to overwrite unrelated later native or layout changes',()=>{
 const {db,storage}=database();const fragile={...storage,setItem:(k,v)=>{if(k===GLB_LAYOUT_KEY)throw Error('quota');storage.setItem(k,v);}},s=new PrototypeSession(fragile);assert.equal(s.build('barn',{x:10,z:8,rotation:0}).ok,false);
 const other=dispatch(deserialize(db.get(SAVE_KEY)),{id:deserialize(db.get(SAVE_KEY)).revision+1,type:'pause'}).state;db.set(SAVE_KEY,serialize(other));const before=new Map(db),reopened=new PrototypeSession(storage);assert.equal(reopened.readOnly,true);assert.equal(reopened.status,'saveConflict');assert.deepEqual(reopened.state,other);assert.equal(reopened.recoverPending().ok,false);assert.deepEqual(db,before);
});

test('unsupported write-lock capability and unavailable storage never accept an edit',()=>{
 const {db,storage}=database([[SAVE_KEY,serialize(createState())]]),before=new Map(db),s=new PrototypeSession(storage,{writable:false});assert.equal(s.command('pause').ok,false);assert.equal(s.build('tree',{x:18,z:12,rotation:0}).ok,false);assert.deepEqual(db,before);
 const unavailable=new PrototypeSession(null);assert.equal(unavailable.readOnly,true);assert.equal(unavailable.status,'saveUnavailable');assert.equal(unavailable.advance(1).ok,false);
});
