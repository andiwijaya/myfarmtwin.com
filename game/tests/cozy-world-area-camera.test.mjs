import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,PointLight,Vector3} from 'three';
import {CozyWorld} from '../client/cozy-world.js';
import {CAMERA_PREFERENCE_KEY,cameraViewPreferenceKey,readCameraPreference,writeCameraPreference,readCameraViewPreference,writeCameraViewPreference} from '../client/cozy-camera-preference.js';
import {cameraResetUndoKey,readCameraResetUndo,writeCameraResetUndo,validateCameraResetUndo} from '../client/cozy-camera-reset-undo.js';
import {handleCameraResetShortcut} from '../client/cozy-camera-shortcuts.js';

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
const keyEvent=(key,patch={})=>({key,ctrlKey:true,altKey:false,metaKey:false,shiftKey:false,repeat:false,isComposing:false,defaultPrevented:false,preventCalls:0,preventDefault(){this.preventCalls++;},...patch});
const shortcut=(world,event,blocked=false)=>handleCameraResetShortcut(event,{blocked,available:action=>action==='undo-reset'?world.canUndoCameraReset():world.canRedoCameraReset(),run:action=>!!(action==='undo-reset'?world.undoCameraReset():world.redoCameraReset())});

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

test('reset replaces only the active camera with its initial pose and restores it in a fresh world',()=>{
 const s=storage();let initial;
 withWorld(w=>{
  w.focus('barn');settle(w);w.zoom(.8);settle(w);w.focus('garden');initial=settle(w);w.zoom(.6);w.rotate(.4);w.pan(1,0);settle(w);
  s.setItem('myfarmtwin.ui.toolbar-expanded.v1','expanded');const other=[...s.values].filter(([key])=>![CAMERA_PREFERENCE_KEY,cameraViewPreferenceKey('garden')].includes(key)),historyLength=w.history.length;
  assert.equal(w.resetCamera(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.equal(w.history.length,historyLength);
  assert.deepEqual(geometry(readCameraViewPreference(s,'garden').value),geometry(initial));assert.deepEqual(geometry(readCameraPreference(s).value),geometry(initial));
  for(const [key,bytes]of other)assert.equal(s.getItem(key),bytes,key);assert.equal(w.host.dataset.cameraViewRestored,'reset');
 },s);
 withWorld(w=>{assert.equal(w.restoreCameraPreference(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));},s);
});

test('interior reset preserves its active building and the independent exterior camera',()=>withWorld((w,s)=>{
 w.focus('barn');settle(w);w.zoom(.8);settle(w);const exterior=s.getItem(cameraViewPreferenceKey('barn'));
 w.focus('inside:barn');const initial=settle(w);w.zoom(.8);w.rotate(.3);w.camera.fov=61;w.camera.zoom=1.4;w.beginCameraInteraction();settle(w);
 assert.equal(w.resetCamera(),'inside:barn');assert.equal(w.interiorId,'barn');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.equal(w.camera.fov,54);assert.equal(w.camera.zoom,1);assert.equal(s.getItem(cameraViewPreferenceKey('barn')),exterior);
}));

test('reset cancels a pending transition and drains old inertia before setting the initial pose',()=>withWorld(w=>{
 w.focus('barn');const initial=settle(w);w.zoom(.7);settle(w);w.focus('garden');settle(w);w.focus('barn');assert.ok(w.transition);
 let pending=true;w.controls.update=()=>{if(pending){w.camera.position.add(new Vector3(3,0,1));w.controls.target.add(new Vector3(1,0,0));if(!w.controls.enableDamping)pending=false;}};
 w.resetCamera();assert.equal(pending,false);assert.equal(w.transition,null);assert.equal(w.controls.enableDamping,true);assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));
 w.controls.update();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.deepEqual(geometry(JSON.parse(w.host.dataset.cameraState)),geometry(initial));
}));

test('an older same-area save cannot overwrite the reset camera',()=>withWorld((w,s)=>{
 w.focus('garden');const initial=settle(w);w.zoom(.7);const old=settle(w),oldRaw=s.getItem(CAMERA_PREFERENCE_KEY);
 w.resetCamera();assert.ok(readCameraPreference(s).value.changedAt>old.changedAt);
 assert.equal(writeCameraViewPreference(s,old),false);assert.equal(writeCameraPreference(s,old,oldRaw),false);assert.equal(writeCameraPreference(s,old,s.getItem(CAMERA_PREFERENCE_KEY)),false);
 assert.deepEqual(geometry(readCameraPreference(s).value),geometry(initial));assert.deepEqual(geometry(readCameraViewPreference(s,'garden').value),geometry(initial));
}));

test('reset is guarded before readiness and remains usable with unavailable preference storage',()=>withWorld((w,s)=>{
 w.focus('garden');const initial=settle(w);w.zoom(.7);settle(w);w.focus('barn');settle(w);w.focus('garden');settle(w);
 const current=geometry(w.cameraSnapshot()),bytes=[...s.values];w.cameraPreferenceReady=false;w.resetCamera();assert.deepEqual(geometry(w.cameraSnapshot()),current);assert.deepEqual([...s.values],bytes);w.cameraPreferenceReady=true;
 const otherHistory=w.history.filter(h=>h.id!=='garden').map(h=>JSON.stringify(h));s.getItem=()=>{throw Error('unavailable');};s.setItem=()=>{throw Error('quota');};
 assert.equal(w.resetCamera(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.deepEqual(w.history.filter(h=>h.id!=='garden').map(h=>JSON.stringify(h)),otherHistory);
 for(const entry of w.history.filter(h=>h.id==='garden'))assert.deepEqual(geometry(entry.preference),geometry(initial));
 w.focus('barn');settle(w);assert.equal(w.back(),'garden');assert.deepEqual(geometry(settle(w)),geometry(initial));
}));

test('undo restores the exact active pre-reset pose once without changing any other camera or farm key',()=>withWorld((w,s)=>{
 w.focus('barn');settle(w);w.zoom(.8);settle(w);w.focus('garden');settle(w);w.zoom(.7);w.rotate(.4);w.pan(1,0);w.camera.fov=58;w.camera.zoom=1.2;w.beginCameraInteraction();const before=settle(w);
 assert.equal(w.canUndoCameraReset(),false);assert.equal(w.undoCameraReset(),null);
 const other=[...s.values].filter(([key])=>![CAMERA_PREFERENCE_KEY,cameraViewPreferenceKey('garden'),cameraResetUndoKey('garden')].includes(key));w.resetCamera();assert.equal(w.canUndoCameraReset(),true);assert.equal(w.host.dataset.cameraUndoAvailable,'true');
 assert.equal(w.undoCameraReset(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));assert.equal(w.canUndoCameraReset(),false);assert.equal(w.undoCameraReset(),null);assert.equal(readCameraResetUndo(s,'garden').value.state,'undone');
 for(const [key,bytes]of other)assert.equal(s.getItem(key),bytes,key);assert.deepEqual(geometry(readCameraPreference(s).value),geometry(before));
}));

test('undo records belong to their areas and can be consumed independently',()=>withWorld(w=>{
 w.focus('garden');settle(w);w.zoom(.7);const garden=settle(w);w.resetCamera();w.focus('barn');settle(w);w.rotate(.4);const barn=settle(w);w.resetCamera();
 w.focus('garden');settle(w);assert.equal(w.canUndoCameraReset(),true);w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(garden));
 w.focus('barn');settle(w);assert.equal(w.canUndoCameraReset(),true);w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(barn));w.focus('garden');settle(w);assert.equal(w.canUndoCameraReset(),false);
}));

test('a repeated default reset preserves useful undo through a fresh world, then consumption persists',()=>{
 const s=storage();let before;
 withWorld(w=>{w.focus('garden');settle(w);w.zoom(.7);before=settle(w);w.resetCamera();const raw=s.getItem(cameraResetUndoKey('garden'));w.resetCamera();assert.equal(s.getItem(cameraResetUndoKey('garden')),raw);},s);
 withWorld(w=>{w.restoreCameraPreference();assert.equal(w.canUndoCameraReset(),true);assert.equal(w.undoCameraReset(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));},s);
 withWorld(w=>{w.restoreCameraPreference();assert.equal(w.canUndoCameraReset(),false);assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));},s);
});

test('interior undo restores projection and interior context while preserving the exterior',()=>withWorld((w,s)=>{
 w.focus('barn');settle(w);w.zoom(.8);settle(w);const exterior=s.getItem(cameraViewPreferenceKey('barn'));w.focus('inside:barn');settle(w);w.zoom(.8);w.rotate(.2);w.camera.fov=61;w.camera.zoom=1.3;w.beginCameraInteraction();const before=settle(w);
 w.resetCamera();assert.equal(w.undoCameraReset(),'inside:barn');assert.equal(w.interiorId,'barn');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));assert.equal(s.getItem(cameraViewPreferenceKey('barn')),exterior);
}));

test('moved or deleted building anchors disable undo without changing the camera',()=>withWorld(w=>{
 w.items.set('barn.1',{id:'barn.1',kind:'barn',x:7,z:-4,rotation:0});w.focus('barn.1');settle(w);w.zoom(.7);settle(w);w.resetCamera();assert.equal(w.canUndoCameraReset(),true);
 w.items.get('barn.1').x=14;const moved=geometry(w.cameraSnapshot());assert.equal(w.canUndoCameraReset(),false);assert.equal(w.undoCameraReset(),null);assert.deepEqual(geometry(w.cameraSnapshot()),moved);
 w.items.delete('barn.1');assert.equal(w.canUndoCameraReset(),false);assert.equal(w.undoCameraReset(),null);
}));

test('undo remains usable in this session when preference reads or writes are unavailable',()=>{
 for(const blockedRead of [false,true])withWorld((w,s)=>{w.focus('garden');settle(w);w.zoom(.7);const before=settle(w);s.setItem=()=>{throw Error('quota');};if(blockedRead)s.getItem=()=>{throw Error('unavailable');};w.resetCamera();assert.equal(w.canUndoCameraReset(),true);w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));assert.equal(w.canUndoCameraReset(),false);});
});

test('a newer reset in another tab supersedes old local undo and invalidates stale consumption',()=>withWorld((a,s)=>{
 a.focus('garden');settle(a);a.zoom(.7);settle(a);a.resetCamera();const staleRaw=s.getItem(cameraResetUndoKey('garden'));let latestBefore;
 withWorld(b=>{b.restoreCameraPreference();b.rotate(-.3);latestBefore=settle(b);b.resetCamera();},s);
 const newer=readCameraResetUndo(s,'garden').value;assert.equal(writeCameraResetUndo(s,{version:1,view:'garden',before:null,changedAt:newer.changedAt+1},staleRaw,true),'conflict');
 a.cameraPreferenceChanged({key:cameraResetUndoKey('garden'),oldValue:staleRaw,newValue:s.getItem(cameraResetUndoKey('garden'))});assert.equal(a.canUndoCameraReset(),true);a.undoCameraReset();assert.deepEqual(geometry(a.cameraSnapshot()),geometry(latestBefore));assert.equal(readCameraResetUndo(s,'garden').value.state,'undone');
}));

test('undo validation rejects corrupt, mismatched, future and oversized records',()=>{
 const s=storage(),before=pose(),valid={version:1,view:'garden',before,changedAt:2};assert.deepEqual(validateCameraResetUndo(valid),valid);
 for(const value of [null,{}, {...valid,version:2},{...valid,view:'../../save'},{...valid,before:pose('barn')},{...valid,changedAt:NaN},{...valid,changedAt:0},{...valid,extra:true},{...valid,before:{...before,zoom:Infinity}}])assert.equal(validateCameraResetUndo(value),null);
 for(const raw of ['bad','x'.repeat(8193),JSON.stringify({...valid,view:'barn',before:pose('barn')})]){s.setItem(cameraResetUndoKey('garden'),raw);assert.equal(readCameraResetUndo(s,'garden').value,null);}
 const record=readCameraResetUndo(s,'garden');assert.equal(writeCameraResetUndo(s,valid,record.raw),'stored');assert.equal(s.getItem('myfarmtwin.cozy.save.v2'),'untouched farm');assert.equal(cameraResetUndoKey('../farm'),null);
});

test('a consumed tombstone prevents an older reset from resurrecting its undo record',()=>{
 const s=storage(),first={version:1,view:'garden',before:pose(),changedAt:2};assert.equal(writeCameraResetUndo(s,first,null),'stored');const oldRaw=s.getItem(cameraResetUndoKey('garden'));
 assert.equal(writeCameraResetUndo(s,{...first,before:null,changedAt:3},oldRaw,true),'stored');assert.equal(writeCameraResetUndo(s,first,oldRaw),'conflict');assert.equal(readCameraResetUndo(s,'garden').value.before,null);
});

test('failed undo consumption leaves no pending write that could replace a newer camera',()=>withWorld((w,s)=>{
 w.focus('garden');settle(w);w.zoom(.7);settle(w);w.resetCamera();const before=[...s.values],camera=geometry(w.cameraSnapshot());w.saveCameraUndo=()=>false;
 assert.equal(w.undoCameraReset(),null);assert.equal(w.cameraPreferenceDirty,false);assert.equal(w.cameraInteraction,false);assert.equal(w.cameraSaveTimer,0);w.flushCameraPreference();assert.deepEqual([...s.values],before);assert.deepEqual(geometry(w.cameraSnapshot()),camera);
}));

test('redo restores the exact reset pose and supports repeated undo/redo without changing other keys',()=>withWorld((w,s)=>{
 w.focus('barn');settle(w);w.zoom(.8);settle(w);w.focus('garden');const initial=settle(w);w.zoom(.7);w.rotate(.4);w.pan(1,0);w.camera.fov=58;w.camera.zoom=1.2;w.beginCameraInteraction();const before=settle(w);
 const other=[...s.values].filter(([key])=>![CAMERA_PREFERENCE_KEY,cameraViewPreferenceKey('garden'),cameraResetUndoKey('garden')].includes(key));
 assert.equal(w.canRedoCameraReset(),false);assert.equal(w.redoCameraReset(),null);w.resetCamera();assert.equal(w.canRedoCameraReset(),false);
 for(let i=0;i<3;i++){
  assert.equal(w.undoCameraReset(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));assert.equal(w.canRedoCameraReset(),true);assert.equal(w.host.dataset.cameraRedoAvailable,'true');
  assert.equal(w.redoCameraReset(),'garden');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.equal(w.canUndoCameraReset(),true);assert.equal(w.canRedoCameraReset(),false);assert.equal(w.redoCameraReset(),null);assert.equal(w.host.dataset.cameraViewRestored,'redo-reset');
 }
 for(const [key,bytes]of other)assert.equal(s.getItem(key),bytes,key);assert.deepEqual(geometry(readCameraPreference(s).value),geometry(initial));
}));

test('pending redo is independent per area and does not appear in an unrelated area',()=>withWorld((w,s)=>{
 w.focus('garden');const garden=settle(w);w.zoom(.7);settle(w);w.resetCamera();w.undoCameraReset();
 w.focus('barn');const barn=settle(w);w.rotate(.4);settle(w);w.resetCamera();w.undoCameraReset();const barnRaw=s.getItem(cameraResetUndoKey('barn')),barnCamera=s.getItem(cameraViewPreferenceKey('barn'));
 w.focus('market');settle(w);assert.equal(w.canRedoCameraReset(),false);assert.equal(w.redoCameraReset(),null);
 w.focus('garden');settle(w);w.redoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(garden));assert.equal(s.getItem(cameraResetUndoKey('barn')),barnRaw);assert.equal(s.getItem(cameraViewPreferenceKey('barn')),barnCamera);
 w.focus('barn');settle(w);assert.equal(w.canRedoCameraReset(),true);w.redoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(barn));
}));

test('redo survives a fresh world and its new undo/redo state persists after use',()=>{
 const s=storage();let initial,before;
 withWorld(w=>{w.focus('garden');initial=settle(w);w.zoom(.7);before=settle(w);w.resetCamera();w.undoCameraReset();},s);
 withWorld(w=>{w.restoreCameraPreference();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));assert.equal(w.canRedoCameraReset(),true);w.redoCameraReset();},s);
 withWorld(w=>{w.restoreCameraPreference();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.equal(w.canRedoCameraReset(),false);assert.equal(w.canUndoCameraReset(),true);w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));},s);
});

test('interior redo restores its reset projection and history without changing the exterior',()=>withWorld((w,s)=>{
 w.focus('barn');settle(w);w.zoom(.8);settle(w);const exterior=s.getItem(cameraViewPreferenceKey('barn'));
 w.focus('inside:barn');const initial=settle(w);w.zoom(.8);w.rotate(.2);w.camera.fov=61;w.camera.zoom=1.3;w.beginCameraInteraction();const before=settle(w);w.resetCamera();w.undoCameraReset();
 w.focus('garden');settle(w);w.focus('inside:barn');settle(w);const otherHistory=w.history.filter(h=>h.id!=='inside:barn').map(h=>JSON.stringify(h));
 w.redoCameraReset();assert.equal(w.interiorId,'barn');assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.equal(s.getItem(cameraViewPreferenceKey('barn')),exterior);assert.deepEqual(w.history.filter(h=>h.id!=='inside:barn').map(h=>JSON.stringify(h)),otherHistory);
 for(const entry of w.history.filter(h=>h.id==='inside:barn'))assert.deepEqual(geometry(entry.preference),geometry(initial));w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));
}));

test('an explicit new reset replaces only this redo pair, including reset at an already default pose',()=>withWorld(w=>{
 w.focus('garden');const initial=settle(w);w.zoom(.7);const original=settle(w);w.resetCamera();w.undoCameraReset();w.rotate(.3);const latest=settle(w);w.resetCamera();assert.equal(w.canRedoCameraReset(),false);w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(latest));
 w.applyImmediateCamera('garden',initial);w.resetCamera();assert.equal(w.canRedoCameraReset(),false);assert.equal(w.canUndoCameraReset(),true);w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(latest));assert.notDeepEqual(geometry(latest),geometry(original));
}));

test('legacy pending undo becomes a redo pair while a legacy consumed tombstone stays consumed',()=>{
 const s=storage();let initial,before;
 withWorld(w=>{w.focus('garden');initial=settle(w);w.zoom(.7);before=settle(w);w.applyImmediateCamera('garden',initial);w.beginCameraInteraction();settle(w);},s);
 const old={version:1,view:'garden',before,changedAt:before.changedAt+1},raw=JSON.stringify(old);s.setItem(cameraResetUndoKey('garden'),raw);
 withWorld(w=>{w.restoreCameraPreference();assert.equal(s.getItem(cameraResetUndoKey('garden')),raw);assert.equal(w.canRedoCameraReset(),false);w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));assert.equal(w.canRedoCameraReset(),true);w.redoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));},s);
 s.setItem(cameraResetUndoKey('garden'),JSON.stringify({...old,before:null}));withWorld(w=>{w.restoreCameraPreference();assert.equal(w.canRedoCameraReset(),false);assert.equal(w.canUndoCameraReset(),false);},s);
});

test('moved and deleted building anchors disable redo without changing this or another camera',()=>withWorld((w,s)=>{
 w.items.set('barn.1',{id:'barn.1',kind:'barn',x:7,z:-4,rotation:0});w.focus('inside:barn.1');settle(w);w.zoom(.7);settle(w);w.resetCamera();w.undoCameraReset();assert.equal(w.canRedoCameraReset(),true);
 const bytes=[...s.values],current=geometry(w.cameraSnapshot());w.items.get('barn.1').x=14;assert.equal(w.canRedoCameraReset(),false);assert.equal(w.redoCameraReset(),null);assert.deepEqual(geometry(w.cameraSnapshot()),{...current,anchor:{...current.anchor,x:14}});w.items.delete('barn.1');assert.equal(w.redoCameraReset(),null);assert.deepEqual(geometry(w.cameraSnapshot()),{...current,anchor:null});assert.deepEqual([...s.values],bytes);
}));

test('undo and redo still alternate in-session when optional preference reads or writes fail',()=>{
 for(const blockedRead of [false,true])withWorld((w,s)=>{w.focus('garden');const initial=settle(w);w.zoom(.7);const before=settle(w);s.setItem=()=>{throw Error('quota');};if(blockedRead)s.getItem=()=>{throw Error('blocked');};w.resetCamera();w.undoCameraReset();assert.equal(w.canRedoCameraReset(),true);w.redoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));w.undoCameraReset();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));});
});

test('newer remote resets disable stale redo and stale transitions cannot replace them',()=>withWorld((a,s)=>{
 a.focus('garden');settle(a);a.zoom(.7);settle(a);a.resetCamera();a.undoCameraReset();const staleRaw=s.getItem(cameraResetUndoKey('garden')),stale=readCameraResetUndo(s,'garden').value;
 withWorld(b=>{b.restoreCameraPreference();b.rotate(.3);settle(b);b.resetCamera();},s);const latest=readCameraResetUndo(s,'garden').value,bytes=[...s.values];
 assert.equal(writeCameraResetUndo(s,{...stale,state:'reset',changedAt:latest.changedAt+1},staleRaw,true),'conflict');a.cameraPreferenceChanged({key:cameraResetUndoKey('garden'),oldValue:staleRaw,newValue:s.getItem(cameraResetUndoKey('garden'))});assert.equal(a.canRedoCameraReset(),false);assert.equal(a.redoCameraReset(),null);assert.deepEqual([...s.values],bytes);
}));

test('redo pair validation rejects invalid states, poses, anchors and future schemas',()=>{
 const before=pose(),reset={...pose(),changedAt:2},valid={version:2,view:'garden',before,reset,state:'undone',changedAt:3};assert.deepEqual(validateCameraResetUndo(valid),valid);
 for(const value of [{...valid,version:3},{...valid,state:'redo'},{...valid,before:null},{...valid,reset:undefined},{...valid,extra:true},{...valid,reset:{...reset,view:'barn'}},{...valid,reset:{...reset,changedAt:4}},{...valid,reset:{...reset,zoom:Infinity}},{...valid,reset:{...reset,anchor:{id:'garden',x:1,z:2,rotation:0}}}])assert.equal(validateCameraResetUndo(value),null);
 const missing={...valid};delete missing.state;assert.equal(validateCameraResetUndo(missing),null);assert.equal(writeCameraResetUndo(storage(),{...valid,state:'bad'},null),'invalid');
});

test('failed redo consumption and readiness guards leave no dirty write or changed camera',()=>withWorld((w,s)=>{
 w.focus('garden');settle(w);w.zoom(.7);settle(w);w.resetCamera();w.undoCameraReset();const bytes=[...s.values],camera=geometry(w.cameraSnapshot());
 w.cameraPreferenceReady=false;assert.equal(w.redoCameraReset(),null);w.cameraPreferenceReady=true;w.disposed=true;assert.equal(w.redoCameraReset(),null);w.disposed=false;w.saveCameraUndo=()=>false;assert.equal(w.redoCameraReset(),null);assert.equal(w.cameraPreferenceDirty,false);assert.equal(w.cameraInteraction,false);assert.equal(w.cameraSaveTimer,0);w.flushCameraPreference();assert.deepEqual([...s.values],bytes);assert.deepEqual(geometry(w.cameraSnapshot()),camera);
}));

test('redo drains old inertia and an unfinished navigation before applying the stored reset',()=>withWorld(w=>{
 w.focus('garden');const initial=settle(w);w.zoom(.7);settle(w);w.resetCamera();w.undoCameraReset();w.focus('barn');settle(w);w.focus('garden');assert.ok(w.transition);
 let pending=true;w.controls.update=()=>{if(pending){w.camera.position.add(new Vector3(3,0,1));w.controls.target.add(new Vector3(1,0,0));if(!w.controls.enableDamping)pending=false;}};
 w.redoCameraReset();assert.equal(pending,false);assert.equal(w.transition,null);assert.equal(w.controls.enableDamping,true);assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));w.controls.update();assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));
}));

test('Ctrl+Z and Ctrl+Y use the real active-area commands and preserve other camera and farm bytes',()=>withWorld((w,s)=>{
 w.focus('barn');settle(w);w.zoom(.8);settle(w);w.focus('garden');const initial=settle(w);w.zoom(.7);w.rotate(.3);const before=settle(w);w.resetCamera();
 const other=[...s.values].filter(([key])=>![CAMERA_PREFERENCE_KEY,cameraViewPreferenceKey('garden'),cameraResetUndoKey('garden')].includes(key));
 const undo=keyEvent('z');assert.equal(shortcut(w,undo),true);assert.equal(undo.preventCalls,1);assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));
 const redo=keyEvent('y');assert.equal(shortcut(w,redo),true);assert.equal(redo.preventCalls,1);assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.equal(w.canUndoCameraReset(),true);
 for(const [key,bytes]of other)assert.equal(s.getItem(key),bytes,key);
}));

test('keyboard shortcuts retain an active interior and support Caps Lock without changing its exterior',()=>withWorld((w,s)=>{
 w.focus('barn');settle(w);w.zoom(.8);settle(w);const exterior=s.getItem(cameraViewPreferenceKey('barn'));w.focus('inside:barn');const initial=settle(w);w.zoom(.7);w.camera.fov=61;w.camera.zoom=1.3;w.beginCameraInteraction();const before=settle(w);w.resetCamera();
 assert.equal(shortcut(w,keyEvent('Z')),true);assert.deepEqual(geometry(w.cameraSnapshot()),geometry(before));assert.equal(w.interiorId,'barn');
 assert.equal(shortcut(w,keyEvent('Y')),true);assert.deepEqual(geometry(w.cameraSnapshot()),geometry(initial));assert.equal(w.interiorId,'barn');assert.equal(s.getItem(cameraViewPreferenceKey('barn')),exterior);
}));

test('editing contexts, other modifiers, consumed events, composition and held keys never trigger camera shortcuts',()=>withWorld((w,s)=>{
 w.focus('garden');settle(w);w.zoom(.7);settle(w);w.resetCamera();
 for(const key of ['z','y']){
  if(key==='y')w.undoCameraReset();
  const bytes=[...s.values],camera=geometry(w.cameraSnapshot());
  for(const patch of [{ctrlKey:false},{altKey:true},{metaKey:true},{shiftKey:true},{repeat:true},{isComposing:true},{defaultPrevented:true},{key:'c'},{key:'Escape'}]){const e=keyEvent(key,patch);assert.equal(shortcut(w,e),false,JSON.stringify(patch));assert.equal(e.preventCalls,0);assert.deepEqual([...s.values],bytes);assert.deepEqual(geometry(w.cameraSnapshot()),camera);}
  const e=keyEvent(key);assert.equal(shortcut(w,e,true),false);assert.equal(e.preventCalls,0);assert.deepEqual([...s.values],bytes);assert.deepEqual(geometry(w.cameraSnapshot()),camera);
 }
}));

test('unavailable or failed camera shortcuts preserve native keyboard behavior and readiness guards',()=>withWorld((w,s)=>{
 w.focus('garden');settle(w);const bytes=[...s.values];for(const key of ['z','y']){const e=keyEvent(key);assert.equal(shortcut(w,e),false);assert.equal(e.preventCalls,0);}assert.deepEqual([...s.values],bytes);
 w.zoom(.7);settle(w);w.resetCamera();w.cameraPreferenceReady=false;const e=keyEvent('z');assert.equal(shortcut(w,e),false);assert.equal(e.preventCalls,0);w.cameraPreferenceReady=true;
 const failed=keyEvent('z');assert.equal(handleCameraResetShortcut(failed,{blocked:false,available:()=>true,run:()=>false}),false);assert.equal(failed.preventCalls,0);assert.equal(w.canUndoCameraReset(),true);
}));
