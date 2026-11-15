import {Box3,Quaternion,Vector3} from 'three';

/** Bake root motion from actual transformed mesh vertices, keeping all visible
 * parts above the original floor throughout rest and walking transitions.
 * Resulting samples are standard glTF channels, never runtime geometry or IK. */
export function groundRest(root,animations){
 const clips=animations.filter(a=>a.name==='rest'||a.name==='walk');if(!clips.length)return;const snapshots=[],nodes=new Map();root.traverse(o=>{snapshots.push([o,o.position.clone(),o.quaternion.clone()]);nodes.set(o.name,o);});
 const reset=()=>{for(const[o,p,q]of snapshots){o.position.copy(p);o.quaternion.copy(q);}},baseline=new Box3().setFromObject(root,true).min.y;
 for(const rest of clips){const duration=Math.max(...rest.tracks.flatMap(t=>t.times)),steps=Math.ceil(duration*48),times=rest.name==='rest'?Array.from({length:25},(_,i)=>i/24).concat([5],Array.from({length:24},(_,i)=>5+(i+1)/24)):Array.from({length:steps+1},(_,i)=>i/steps*duration),positions=[];
 for(const time of times){reset();for(const track of rest.tracks){if(track.node===root.name&&track.path==='translation')continue;const node=nodes.get(track.node);let i=0;while(i<track.times.length-2&&time>track.times[i+1])i++;const alpha=Math.max(0,Math.min(1,(time-track.times[i])/(track.times[i+1]-track.times[i]))),size=track.path==='rotation'?4:3,a=track.values.slice(i*size,(i+1)*size),b=track.values.slice((i+1)*size,(i+2)*size);if(track.path==='rotation')node.quaternion.copy(new Quaternion(...a)).slerp(new Quaternion(...b),alpha);else node.position.copy(new Vector3(...a)).lerp(new Vector3(...b),alpha);}
  root.updateMatrixWorld(true);positions.push([0,baseline-new Box3().setFromObject(root,true).min.y,0]);
 }
 reset();root.updateMatrixWorld(true);rest.tracks=rest.tracks.filter(t=>t.node!==root.name||t.path!=='translation');rest.tracks.unshift({node:root.name,path:'translation',times,values:positions.flat()});
 }
}
