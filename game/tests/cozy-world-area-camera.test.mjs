import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,PointLight,Vector3} from 'three';
import {CozyWorld} from '../client/cozy-world.js';
import {CAMERA_PREFERENCE_KEY,cameraViewPreferenceKey,readCameraPreference,writeCameraPreference,readCameraViewPreference,writeCameraViewPreference} from '../client/cozy-camera-preference.js';

const pose=(view='garden',changedAt=1)=>({version:1,view,position:[10,13,16],target:[0,.5,0],fov:43,zoom:1,anchor:null,changedAt});
const storage=()=>{const values=new Map([['myfarmtwin.cozy.save.v2','untouched farm'],['myfarmtwin.save.v1','untouched legacy']]);return{values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};
const geometry=saved=>({view:saved.view,position:saved.position,target:saved.target,fov:saved.fov,zoom:saved.zoom,anchor:saved.anchor});
function withWorld(run,store=storage()){
 const names=['window','localStorage','matchMedia'],before=names.map(name=>Object.getOwnPropertyDescriptor(globalThis,name));
 Object.assign(globalThis,{window:{setTimeout:()=>1,clearTimeout:()=>{}},localStorage:store,matchMedia:()=>({matches:false})});
 const world=Object.assign(Object.create(CozyWorld.prototype),{host:{dataset:{}},disposed:false,cameraPreferenceReady:true,cameraInteraction:false,cameraPreferenceDirty:false,cameraPreferenceSaving:false,cameraSaveTimer:0,cameraInteractionAt:0,cameraPreferenceSignature:'',cameraPreferenceRaw:null,currentView:'overview',interiorId:'',transition:null,history:[],items:new Map([['barn',{id:'barn',kind:'barn',x:7,z:-4,rotation:0}],['market',{id:'market',kind:'market',x:-4,z:14,rotation:0}]]),animals:new Map(),entities:new Map(),fill:new PointLight(),manifest:{assets:{barn:{interiorFloorY:0},market:{interiorFloorY:0}}},camera:new PerspectiveCamera(43,1,.08,240),controls:{target:new Vector3(0,.7,0),enableDamping:true,minDistance:2,maxDistance:170,update(){}}});
 world.camera.position.set(42,36,46);
 try{return run(world,store);}finally{names.forEach((name,i)=>before[i]?Object.defineProperty(globalThis,name,before[i]):delete globalThis[name]);}
}
const settle=world=>{world.finishCameraTransition();world.flushCameraPreference();return world.cameraSnapshot();};

test('each area and interior has an independent projection without changing farm keys',()=>{
 const s=storage(),garden=pose(),barn={...pose('barn',2),position:[22,16,28],fov:50,zoom:1.2},inside={...pose('inside:market',3),position:[-4,2,16],target:[-4,1,14],fov:54,anchor:{id:'market',x:-4,z:14,rotation:0}};
 for(const p of [garden,barn,inside])assert.equal(writeCameraViewPreference(s,p),true);
 for(const p of [garden,barn,inside])assert.deepEqual(readCameraViewPreference(s,p.view).value,p);
 assert.equal(s.values.size,5);assert.equal(s.getItem('myfarmtwin.cozy.save.v2'),'untouched farm');assert.equal(s.getItem('myfarmtwin.save.v1'),'untouched legacy');
});

test('an older delayed area write cannot replace a newer pose, while other areas remain independent',()=>{
 const s=storage();writeCameraViewPreference(s,pose('garden',4));writeCameraViewPreference(s,pose('barn',6));
 assert.equal(writeCameraViewPreference(s,{...pose('garden',3),zoom:1.5}),false);
 assert.equal(writeCameraViewPreference(s,{...pose('garden',5),zoom:1.3}),true);
 assert.equal(readCameraViewPreference(s,'garden').value.zoom,1.3);assert.equal(readCameraViewPreference(s,'barn').value.changedAt,6);
 const latest=pose('barn',6);writeCameraPreference(s,latest,null);
 assert.equal(writeCameraPreference(s,pose('garden',5),s.getItem(CAMERA_PREFERENCE_KEY)),false);assert.deepEqual(readCameraPreference(s).value,latest);
});

test('invalid, mismatched and unavailable per-area storage safely falls back',()=>{
 const s=storage(),key=cameraViewPreferenceKey('garden');
 for(const raw of ['bad',JSON.stringify({...pose(),version:2}),JSON.stringify(pose('barn')),'x'.repeat(4097)]){s.setItem(key,raw);assert.equal(readCameraViewPreference(s,'garden').value,null);}
 assert.equal(cameraViewPreferenceKey('../farm'),null);assert.deepEqual(readCameraViewPreference(s,'../farm'),{raw:null,value:null});
 const denied={getItem(){throw Error('blocked');},setItem(){throw Error('quota');}};
 assert.equal(readCameraViewPreference(denied,'garden').value,null);assert.equal(writeCameraViewPreference(denied,pose()),false);assert.equal(writeCameraViewPreference(s,{...pose(),zoom:Infinity}),false);
});

test('actual world navigation retains garden, barn exterior and interior cameras separately',()=>withWorld((w)=>{
 w.focus('garden');settle(w);w.zoom(.8);w.rotate(.3);w.pan(1,0);const garden=settle(w);
 w.focus('barn');settle(w);w.zoom(.8);w.rotate(-.2);const barn=settle(w);
 w.focus('inside:barn');settle(w);w.rotate(.2);w.zoom(.8);const interior=settle(w);
 w.focus('garden');assert.deepEqual(geometry(settle(w)),geometry(garden));assert.equal(w.host.dataset.cameraViewRestored,'exact');
 w.focus('barn');assert.deepEqual(geometry(settle(w)),geometry(barn));
 w.focus('inside:barn');assert.deepEqual(geometry(settle(w)),geometry(interior));
 assert.equal(w.back(),'barn');assert.deepEqual(geometry(settle(w)),geometry(barn));
}));

test('legacy last-view cameras are retained on first departure and survive a fresh world',()=>{
 const s=storage(),legacy={...pose(),position:[8,10,14],zoom:1.1};writeCameraPreference(s,legacy,null);
 withWorld(w=>{assert.equal(w.restoreCameraPreference(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(legacy));w.focus('barn');settle(w);assert.deepEqual(geometry(readCameraViewPreference(s,'garden').value),geometry(legacy));},s);
 withWorld(w=>{assert.equal(w.restoreCameraPreference(),'barn');w.focus('garden');assert.deepEqual(geometry(settle(w)),geometry(legacy));},s);
});

test('rapid navigation stores the outgoing destination rather than a mid-transition pose',()=>withWorld(w=>{
 w.focus('garden');const garden=settle(w);w.focus('barn');const expected=w.transition.position.clone();
 w.camera.position.lerpVectors(w.transition.fromPosition,expected,.2);w.focus('market');
 const barn=readCameraViewPreference(localStorage,'barn').value;assert.deepEqual(barn.position,expected.toArray().map(n=>Math.round(n*1e6)/1e6));
 w.focus('garden');assert.deepEqual(geometry(settle(w)),geometry(garden));
}));

test('another tab changing a different area does not discard a pending local area camera',()=>withWorld((w,s)=>{
 w.focus('garden');settle(w);w.beginCameraInteraction();w.camera.position.set(8,11,14);const pendingAt=w.cameraInteractionAt;
 const incoming=pose('barn',pendingAt+1),oldValue=s.getItem(CAMERA_PREFERENCE_KEY);s.setItem(CAMERA_PREFERENCE_KEY,JSON.stringify(incoming));
 w.cameraPreferenceChanged({key:CAMERA_PREFERENCE_KEY,oldValue,newValue:JSON.stringify(incoming)});assert.equal(w.cameraPreferenceDirty,true);
 w.flushCameraPreference();assert.deepEqual(readCameraViewPreference(s,'garden').value.position,[8,11,14]);assert.equal(readCameraPreference(s).value.view,'barn');
}));

test('a newer same-area choice cancels an old pending camera without stale departure writes',()=>withWorld((w,s)=>{
 w.focus('garden');settle(w);w.beginCameraInteraction();w.camera.position.set(8,11,14);
 const incoming={...pose('garden',w.cameraInteractionAt+1),position:[7,12,15]};writeCameraViewPreference(s,incoming);
 w.cameraPreferenceChanged({key:cameraViewPreferenceKey('garden'),oldValue:null,newValue:JSON.stringify(incoming)});assert.equal(w.cameraPreferenceDirty,false);
 w.focus('barn');settle(w);w.focus('garden');assert.deepEqual(geometry(settle(w)),geometry(incoming));
}));

test('moved buildings refocus from their current layout and removed targets do not revive through Back',()=>withWorld(w=>{
 w.items.set('barn.1',{id:'barn.1',kind:'barn',x:7,z:-4,rotation:0});w.focus('barn.1');const original=settle(w);w.zoom(.8);settle(w);w.focus('garden');settle(w);
 w.items.get('barn.1').x=14;w.focus('barn.1');const moved=settle(w);assert.notDeepEqual(moved.position,original.position);assert.equal(moved.target[0],14);assert.equal(w.host.dataset.cameraViewRestored,'default');
 w.focus('garden');settle(w);w.items.delete('barn.1');assert.equal(w.back(),'overview');assert.equal(settle(w).view,'overview');
}));
