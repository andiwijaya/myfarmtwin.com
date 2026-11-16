import test from 'node:test';
import assert from 'node:assert/strict';
import {PerspectiveCamera,PointLight} from 'three';
import {CAMERA_PREFERENCE_KEY,validateCameraPreference,readCameraPreference,writeCameraPreference,resolveCameraPreference} from '../client/cozy-camera-preference.js';
import {CozyWorld} from '../client/cozy-world.js';

const snapshot=()=>({version:1,view:'overview',position:[42,36,46],target:[0,.7,0],fov:50,zoom:1,anchor:null});
const store=()=>{const values=new Map([['myfarmtwin.cozy.save.v2','original farm bytes'],['myfarmtwin.save.v1','original native bytes']]);return{values,getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};};

test('camera position, target and projection roundtrip only through the separate UI key',()=>{
 const storage=store(),saved=snapshot();assert.deepEqual(readCameraPreference(storage),{raw:null,value:null});
 assert.equal(writeCameraPreference(storage,saved,null),true);assert.deepEqual(readCameraPreference(storage).value,saved);
 assert.deepEqual([...storage.values.keys()].sort(),[CAMERA_PREFERENCE_KEY,'myfarmtwin.cozy.save.v2','myfarmtwin.save.v1'].sort());assert.equal(storage.getItem('myfarmtwin.cozy.save.v2'),'original farm bytes');assert.equal(storage.getItem('myfarmtwin.save.v1'),'original native bytes');
});
test('malformed, future, nonfinite, degenerate and out-of-world poses safely fall back',()=>{
 const invalid=[null,{}, {...snapshot(),version:2},{...snapshot(),extra:true},{...snapshot(),position:[NaN,36,46]},{...snapshot(),position:[0,.7,0]},{...snapshot(),target:[90,.7,0]},{...snapshot(),position:[42,-1,46]},{...snapshot(),fov:0},{...snapshot(),zoom:100},{...snapshot(),view:'../../other'},{...snapshot(),anchor:{id:'barn',x:Infinity,z:0,rotation:0}}];
 for(const value of invalid)assert.equal(validateCameraPreference(value),null);
 const storage=store();for(const raw of ['broken','null','x'.repeat(4097)]){storage.setItem(CAMERA_PREFERENCE_KEY,raw);assert.equal(readCameraPreference(storage).value,null);assert.equal(readCameraPreference(storage).raw,raw);}
});
test('a valid saved interior keeps its pose only while its building anchor still matches',()=>{
 const barn={id:'barn',kind:'barn',x:7,z:-4,rotation:Math.PI/2};const saved={...snapshot(),view:'inside:barn',anchor:{id:barn.id,x:barn.x,z:barn.z,rotation:barn.rotation}};
 assert.deepEqual(resolveCameraPreference(saved,id=>id==='barn'?barn:undefined),{view:'inside:barn',applyPose:true});
 for(const changed of [{...barn,x:8},{...barn,rotation:Math.PI}])assert.deepEqual(resolveCameraPreference(saved,()=>changed),{view:'inside:barn',applyPose:false});
 assert.deepEqual(resolveCameraPreference(saved,()=>undefined),{view:'overview',applyPose:false});
});
test('invalid interiors and deleted animal targets cannot restore an incoherent scene',()=>{
 assert.deepEqual(resolveCameraPreference({...snapshot(),view:'inside:bed.0'},()=>({id:'bed.0',kind:'bed',x:0,z:0,rotation:0})),{view:'overview',applyPose:false});
 assert.deepEqual(resolveCameraPreference({...snapshot(),view:'cow.removed'},()=>undefined),{view:'overview',applyPose:false});
 assert.deepEqual(resolveCameraPreference({...snapshot(),view:'barn'},()=>undefined),{view:'barn',applyPose:true});
});
test('an older pending tab cannot overwrite a newer camera preference',()=>{
 const storage=store(),first=snapshot();assert.equal(writeCameraPreference(storage,first,null),true);const original=storage.getItem(CAMERA_PREFERENCE_KEY),newer={...first,position:[30,22,36]};assert.equal(writeCameraPreference(storage,newer,original),true);
 assert.equal(writeCameraPreference(storage,{...first,position:[20,18,24]},original),false);assert.deepEqual(readCameraPreference(storage).value,newer);
});
test('optional camera storage failure never escapes or touches farm data',()=>{
 const unavailable={getItem(){throw Error('unavailable');},setItem(){throw Error('quota');}};
 assert.deepEqual(readCameraPreference(unavailable),{raw:null,value:null});assert.equal(writeCameraPreference(unavailable,snapshot(),null),false);
 const storage=store();assert.equal(writeCameraPreference(storage,{...snapshot(),zoom:Infinity},null),false);assert.equal(storage.getItem(CAMERA_PREFERENCE_KEY),null);
});
test('reapplying the same interior during farm sync preserves restored FOV and zoom',()=>{
 const fixture={interiorId:'',items:new Map(),entities:new Map(),fill:new PointLight(),controls:{},camera:new PerspectiveCamera(50,1,.08,240)};
 fixture.camera.zoom=1.25;CozyWorld.prototype.setInterior.call(fixture,'');assert.equal(fixture.camera.fov,50);assert.equal(fixture.camera.zoom,1.25);
 CozyWorld.prototype.setInterior.call(fixture,'market');assert.equal(fixture.camera.fov,54);fixture.camera.fov=57;CozyWorld.prototype.setInterior.call(fixture,'market');assert.equal(fixture.camera.fov,57);
 CozyWorld.prototype.setInterior.call(fixture,'',true);assert.equal(fixture.camera.fov,43);
});
