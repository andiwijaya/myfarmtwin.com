import {AnimationMixer} from 'three';

/** Both GLB LOD roots receive the same clips, with independent binding caches.
 * Composite AnimationObjectGroup bindings cannot safely be uncached by this
 * Three.js version when a harvested/sold animal is removed.
 * @param {import('three').Object3D[]} roots @param {import('three').AnimationClip[]} clips */
export function createAnimalAnimation(roots,clips){
 const mixers=roots.map(root=>new AnimationMixer(root));
 const actions=new Map(clips.map(clip=>[clip.name,mixers.map(mixer=>mixer.clipAction(clip))]));
 return {mixers,actions,dispose(){for(const mixer of mixers){mixer.stopAllAction();mixer.uncacheRoot(mixer.getRoot());}}};
}
