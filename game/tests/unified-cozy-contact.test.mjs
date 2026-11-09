import test from 'node:test';import assert from 'node:assert/strict';
import {contactPixels,createCozyContacts} from '../client/unified-cozy-contact.js';
test('contact AO has a transparent border, smooth falloff, shared resources and deterministic disposal',()=>{
 const bytes=contactPixels();assert.deepEqual(contactPixels(),bytes);const alpha=(x,y)=>bytes[(y*32+x)*4+3];assert.ok(alpha(15,15)>250);for(let i=0;i<32;i++){assert.equal(alpha(i,0),0);assert.equal(alpha(i,31),0);assert.equal(alpha(0,i),0);assert.equal(alpha(31,i),0);}for(let i=16;i<31;i++)assert.ok(alpha(i+1,15)<=alpha(i,15));assert.throws(()=>contactPixels(0),RangeError);
 const contacts=createCozyContacts(),a=contacts.mesh(1,.7),b=contacts.mesh(2,1.4);assert.equal(a.geometry,b.geometry);assert.equal(a.material,b.material);assert.equal(a.userData.pickThrough,true);assert.equal(a.material.depthWrite,false);assert.deepEqual(a.geometry.boundingBox,null);assert.equal(a.material.map.image.data.length,4096);
 let geometry=0,material=0,texture=0;a.geometry.addEventListener('dispose',()=>geometry++);a.material.addEventListener('dispose',()=>material++);a.material.map.addEventListener('dispose',()=>texture++);contacts.dispose();contacts.dispose();assert.deepEqual([geometry,material,texture],[1,1,1]);assert.throws(()=>contacts.mesh(1,1),/disposed/);
});
