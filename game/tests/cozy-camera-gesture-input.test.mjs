import test from 'node:test';
import assert from 'node:assert/strict';
import {watchCameraGestureInput} from '../client/cozy-camera-gesture-input.js';
import {cameraGestureHint} from '../client/cozy-camera-shortcuts.js';

class Media extends EventTarget{constructor(matches=false){super();this.matches=matches;}set(matches){this.matches=matches;this.dispatchEvent(new Event('change'));}}
const emit=(target,type,properties={})=>{const event=Object.assign(new Event(type,{cancelable:true}),properties);target.dispatchEvent(event);assert.equal(event.defaultPrevented,false);return event;};
const setup=(coarse=false,storage=null)=>{const target=new EventTarget(),media=new Media(coarse),changes=[];const input=watchCameraGestureInput(target,media,value=>changes.push(value),storage);return{target,media,changes,input};};

test('primary input is a fallback until the last explicit interaction wins, including a same-mode first event',()=>{
 const {target,media,changes,input}=setup();assert.equal(input.getInput(),'pointer');assert.equal(input.hasInput(),false);
 media.set(true);assert.equal(input.getInput(),'touch');assert.equal(input.hasInput(),false);
 emit(target,'pointerdown',{pointerType:'touch',pointerId:1});assert.equal(input.hasInput(),true);assert.deepEqual(changes,['touch','touch']);
 media.set(false);emit(target,'keydown',{key:'z'});emit(target,'resize');assert.equal(input.getInput(),'touch');
 emit(target,'pointerdown',{pointerType:'mouse'});assert.equal(input.getInput(),'pointer');media.set(true);assert.equal(input.getInput(),'pointer');input.dispose();
});

test('touch, physical mouse movement and touch movement can alternate without idle or compatibility bounce',()=>{
 const {target,changes,input}=setup();emit(target,'pointerdown',{pointerType:'touch',pointerId:7,clientX:10,clientY:20});
 emit(target,'mousedown');emit(target,'mousemove',{movementX:4});emit(target,'pointermove',{pointerType:'mouse',movementX:4,sourceCapabilities:{firesTouchEvents:true}});assert.equal(input.getInput(),'touch');
 emit(target,'pointermove',{pointerType:'mouse',pointerId:1,clientX:30,clientY:40,movementX:0,movementY:0});assert.equal(input.getInput(),'touch');
 emit(target,'pointermove',{pointerType:'mouse',pointerId:1,clientX:30,clientY:40,movementX:0,movementY:0});assert.equal(input.getInput(),'touch');
 emit(target,'pointermove',{pointerType:'mouse',pointerId:1,clientX:31,clientY:40,movementX:0,movementY:0});assert.equal(input.getInput(),'pointer');
 emit(target,'pointermove',{pointerType:'touch',pointerId:7,clientX:12,clientY:20,movementX:0,movementY:0});assert.equal(input.getInput(),'touch');assert.deepEqual(changes,['touch','pointer','touch']);input.dispose();
});

test('real wheel and trackpad deltas select pointer mode without consuming scrolling',()=>{
 const {target,changes,input}=setup(true);emit(target,'pointerdown',{pointerType:'touch'});
 emit(target,'wheel',{deltaY:0});emit(target,'wheel',{deltaY:8,sourceCapabilities:{firesTouchEvents:true}});assert.equal(input.getInput(),'touch');
 emit(target,'wheel',{deltaY:8,ctrlKey:true});assert.equal(input.getInput(),'pointer');
 for(let i=0;i<50;i++)emit(target,'wheel',{deltaY:4});assert.deepEqual(changes,['touch','pointer']);input.dispose();
});

test('language rendering, unsupported pointers and nonmoving events retain the last input',()=>{
 const {target,media,input}=setup();emit(target,'pointerdown',{pointerType:'touch'});
 for(const properties of [{pointerType:''},{pointerType:'pen'},{pointerType:'unknown'},{pointerType:'mouse',sourceCapabilities:{firesTouchEvents:true}}])emit(target,'pointerdown',properties);
 emit(target,'pointermove',{pointerType:'mouse',movementX:NaN,movementY:Infinity});emit(target,'wheel',{deltaX:NaN,deltaY:Infinity});media.set(false);
 assert.equal(input.getInput(),'touch');assert.equal(cameraGestureHint(input.getInput()==='touch','id'),'Seret: putar · Cubit: zoom · Ketuk objek');assert.equal(cameraGestureHint(input.getInput()==='touch','en'),'Drag: orbit · Pinch: zoom · Tap objects');assert.equal(input.getInput(),'touch');input.dispose();
});

test('completed and cancelled pointers do not create a false movement on reuse',()=>{
 const {target,input}=setup();emit(target,'pointerdown',{pointerType:'mouse',pointerId:2,clientX:10,clientY:10});emit(target,'pointerup',{pointerType:'mouse',pointerId:2});emit(target,'pointerdown',{pointerType:'touch',pointerId:3});
 emit(target,'pointermove',{pointerType:'mouse',pointerId:2,clientX:80,clientY:80,movementX:0,movementY:0});assert.equal(input.getInput(),'touch');emit(target,'pointercancel',{pointerType:'mouse',pointerId:2});
 emit(target,'pointermove',{pointerType:'mouse',pointerId:2,clientX:90,clientY:90,movementX:0,movementY:0});assert.equal(input.getInput(),'touch');emit(target,'pointermove',{pointerType:'mouse',pointerId:2,movementX:2});assert.equal(input.getInput(),'pointer');input.dispose();
});

test('disposing input observation detaches listeners and freezes the last mode',()=>{
 class TrackedTarget extends EventTarget{listeners=new Set();addEventListener(type,callback,options){super.addEventListener(type,callback,options);this.listeners.add(type);}removeEventListener(type,callback,options){super.removeEventListener(type,callback,options);this.listeners.delete(type);}}
 const target=new TrackedTarget(),media=new TrackedTarget(),changes=[];media.matches=false;const input=watchCameraGestureInput(target,media,value=>changes.push(value));assert.equal(target.listeners.size,5);assert.equal(media.listeners.size,1);
 emit(target,'pointerdown',{pointerType:'touch'});input.dispose();input.dispose();assert.equal(target.listeners.size,0);assert.equal(media.listeners.size,0);
 emit(target,'pointerdown',{pointerType:'mouse'});media.matches=true;media.dispatchEvent(new Event('change'));assert.equal(input.getInput(),'touch');assert.deepEqual(changes,['touch']);
});

const preferenceKey = 'myfarmtwin.ui.camera-gesture-input.v1';
function memoryStorage(initial = {}) {
 const values = new Map(Object.entries(initial));
 const writes = [];
 const removals = [];
 return {
  values, writes, removals,
  getItem: key => values.get(key) ?? null,
  setItem(key, value) { values.set(key, value); writes.push([key, value]); },
  removeItem(key) { values.delete(key); removals.push(key); },
 };
}

test('restores touch and pointer in fresh observers without writing on startup or fallback changes', () => {
 const storage = memoryStorage({'myfarmtwin.cozy.save.v2':'original farm'});
 const original = setup(false, storage);
 original.media.set(true);
 assert.deepEqual(storage.writes, []);
 emit(original.target, 'pointerdown', {pointerType:'touch'});
 original.input.dispose();
 const reloaded = setup(false, storage);
 assert.equal(reloaded.input.getInput(), 'touch');
 assert.equal(reloaded.input.hasInput(), true);
 reloaded.media.set(true);
 reloaded.media.set(false);
 assert.equal(reloaded.input.getInput(), 'touch');
 emit(reloaded.target, 'wheel', {deltaY:8});
 emit(reloaded.target, 'pointermove', {pointerType:'mouse', movementX:2});
 reloaded.input.dispose();
 const reopened = setup(true, storage);
 assert.equal(reopened.input.getInput(), 'pointer');
 assert.deepEqual(storage.writes, [[preferenceKey,'touch'], [preferenceKey,'pointer']]);
 assert.equal(storage.getItem('myfarmtwin.cozy.save.v2'), 'original farm');
 reopened.input.dispose();
});

test('ignores invalid preferences and does not save compatibility or idle events', () => {
 const storage = memoryStorage({[preferenceKey]:'unknown'});
 const browser = setup(true, storage);
 assert.equal(browser.input.getInput(), 'touch');
 assert.equal(browser.input.hasInput(), false);
 emit(browser.target, 'pointermove', {pointerType:'mouse', movementX:0});
 emit(browser.target, 'pointerdown', {pointerType:'mouse', sourceCapabilities:{firesTouchEvents:true}});
 assert.deepEqual(storage.writes, []);
 emit(browser.target, 'pointerdown', {pointerType:'touch'});
 assert.deepEqual(storage.writes, [[preferenceKey,'touch']]);
 browser.input.dispose();
});

test('reset clears only the input preference and lets the next gesture create a new preference', () => {
 const otherPreferences = {
  'myfarmtwin.cozy.save.v2':'original farm',
  'myfarmtwin.ui.camera.v1':'camera',
  'myfarmtwin.ui.toolbar-expanded.v1':'expanded',
  'myfarmtwin.locale':'en',
 };
 const storage = memoryStorage({...otherPreferences,[preferenceKey]:'pointer'});
 const browser = setup(true,storage);
 assert.equal(browser.input.getInput(),'pointer');
 assert.equal(browser.input.reset(),true);
 assert.equal(browser.input.getInput(),'touch');
 assert.equal(browser.input.hasInput(),false);
 assert.deepEqual(browser.changes,['touch']);
 assert.deepEqual(storage.removals,[preferenceKey]);
 assert.deepEqual(Object.fromEntries(storage.values),otherPreferences);
 const fresh = setup(false,storage);
 assert.equal(fresh.input.getInput(),'pointer');
 assert.equal(fresh.input.hasInput(),false);
 assert.deepEqual(storage.writes,[]);
 fresh.input.dispose();

 browser.media.set(false);
 assert.equal(browser.input.getInput(),'pointer');
 assert.equal(browser.input.hasInput(),false);
 emit(browser.target,'pointerdown',{pointerType:'touch'});
 assert.deepEqual(storage.writes,[[preferenceKey,'touch']]);
 browser.input.dispose();
});

test('reset reports a primary-source change even when the hint text stays the same', () => {
 const storage = memoryStorage({[preferenceKey]:'pointer'});
 const browser = setup(false,storage);
 assert.equal(browser.input.reset(),true);
 assert.equal(browser.input.hasInput(),false);
 assert.deepEqual(browser.changes,['pointer']);
 emit(browser.target,'pointerdown',{pointerType:'mouse'});
 assert.equal(browser.input.hasInput(),true);
 assert.equal(storage.getItem(preferenceKey),'pointer');
 browser.input.dispose();
});

test('a reset in another tab clears the local hint without overwriting newer input', () => {
 const storage = memoryStorage({[preferenceKey]:'touch'});
 const browser = setup(false,storage);
 storage.removeItem(preferenceKey);
 emit(browser.target,'storage',{key:preferenceKey,storageArea:storage,newValue:null});
 assert.equal(browser.input.getInput(),'pointer');
 assert.equal(browser.input.hasInput(),false);
 emit(browser.target,'pointerdown',{pointerType:'touch'});
 emit(browser.target,'storage',{key:preferenceKey,storageArea:storage,newValue:null});
 assert.equal(browser.input.getInput(),'touch');
 assert.equal(browser.input.hasInput(),true);
 assert.deepEqual(storage.writes,[[preferenceKey,'touch']]);
 browser.input.dispose();
});

test('blocked storage still allows a session reset and reports that removal failed', () => {
 const storage = memoryStorage({[preferenceKey]:'touch'});
 storage.removeItem = () => { throw new Error('blocked'); };
 const browser = setup(false,storage);
 assert.equal(browser.input.reset(),false);
 assert.equal(browser.input.getInput(),'pointer');
 assert.equal(browser.input.hasInput(),false);
 assert.equal(storage.getItem(preferenceKey),'touch');
 assert.deepEqual(storage.writes,[]);
 browser.input.dispose();
});

test('storage read or write failures leave the in-memory hint usable without repeated writes', () => {
 let attempts = 0;
 const storage = {
  getItem() { throw new Error('blocked'); },
  setItem() { attempts++; throw new Error('quota'); },
 };
 const browser = setup(false, storage);
 emit(browser.target, 'pointerdown', {pointerType:'touch'});
 assert.equal(browser.input.getInput(), 'touch');
 for (let i = 0; i < 10; i++) emit(browser.target, 'wheel', {deltaY:8});
 assert.equal(browser.input.getInput(), 'pointer');
 assert.equal(attempts, 2);
 browser.input.dispose();
});

test('a dormant tab does not replace newer storage until it observes fresh input', () => {
 const storage = memoryStorage({[preferenceKey]:'touch'});
 const browser = setup(false, storage);
 storage.values.set(preferenceKey,'pointer');
 emit(browser.target, 'storage', {key:preferenceKey, storageArea:storage, newValue:'touch'});
 assert.equal(browser.input.getInput(), 'touch');
 assert.deepEqual(storage.writes, []);
 emit(browser.target, 'pointerdown', {pointerType:'touch'});
 assert.deepEqual(storage.writes, [[preferenceKey,'touch']]);
 browser.input.dispose();
});
