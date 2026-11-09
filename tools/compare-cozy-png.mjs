import {PNG} from '../node_modules/playwright-core/lib/utilsBundle.js';
import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
// QA-only decoder already bundled with pinned Playwright1.64.1. No new
// production dependency, generated screenshot, lossy tolerance or image editing.
export function compareCozyPng(reference,candidate){
 const a=PNG.sync.read(reference),b=PNG.sync.read(candidate);assert.equal(b.width,a.width,'PNG width differs');assert.equal(b.height,a.height,'PNG height differs');assert.equal(b.data.length,a.data.length);let changedPixels=0,maxChannelDelta=0;
 for(let i=0;i<a.data.length;i+=4){let changed=false;for(let c=0;c<4;c++){const delta=Math.abs(a.data[i+c]-b.data[i+c]);maxChannelDelta=Math.max(maxChannelDelta,delta);if(delta)changed=true;}if(changed)changedPixels++;}
 const hash=bytes=>createHash('sha256').update(bytes).digest('hex');return{width:a.width,height:a.height,changedPixels,maxChannelDelta,referenceRGBA:hash(a.data),candidateRGBA:hash(b.data),exact:changedPixels===0};
}
