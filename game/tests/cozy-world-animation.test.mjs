import test from 'node:test';
import assert from 'node:assert/strict';
import {Group,AnimationClip,NumberKeyframeTrack} from 'three';
import {createAnimalAnimation} from '../client/cozy-animation.js';

test('both animal LODs animate and can be harvested or sold repeatedly without Composite cache failures',()=>{
 const clip=new AnimationClip('swim',1,[new NumberKeyframeTrack('tail.rotation[y]',[0,.5,1],[0,.4,0])]);
 for(let cycle=0;cycle<30;cycle++){
  const roots=Array.from({length:2},()=>{const root=new Group(),tail=new Group();tail.name='tail';root.add(tail);return root;});
  const animation=createAnimalAnimation(roots,[clip]);for(const action of animation.actions.get('swim'))action.play();for(const mixer of animation.mixers)mixer.update(.25);
  assert.ok(Math.abs(roots[0].getObjectByName('tail').rotation.y-.2)<1e-6);assert.equal(roots[0].getObjectByName('tail').rotation.y,roots[1].getObjectByName('tail').rotation.y);
  assert.doesNotThrow(()=>animation.dispose());assert.ok(animation.mixers.every(m=>m.stats.actions.total===0&&m.stats.bindings.total===0));
 }
});
