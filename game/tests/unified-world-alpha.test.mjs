import test from 'node:test';
import assert from 'node:assert/strict';
import {Sprite,SpriteMaterial} from 'three';
import {compactAlpha} from '../client/unified-world-alpha.js';
import {spriteOpaque} from '../client/unified-world-sprites.js';
import {nearbySpritePoints} from '../client/unified-world-contact.js';

test('compact mask owns exactly one alpha byte per texel, including subarray offsets, without retaining or changing RGBA',()=>{
 const backing=new Uint8ClampedArray(4*257+16);for(let i=0;i<backing.length;i++)backing[i]=(i*73+19)%256;
 const rgba=backing.subarray(8,8+4*257),before=backing.slice(),alpha=compactAlpha(rgba);
 assert.equal(alpha.length,257);assert.equal(alpha.byteLength,rgba.byteLength/4);assert.equal(alpha.buffer.byteLength,alpha.byteLength);assert.notEqual(alpha.buffer,rgba.buffer);
 for(let i=0;i<alpha.length;i++)assert.equal(alpha[i],rgba[i*4+3]);assert.deepEqual(backing,before);
 const first=alpha[0];rgba[3]=first===255?0:255;assert.equal(alpha[0],first);alpha[1]=0;assert.equal(rgba[7],before[15]);
 assert.equal(compactAlpha(new Uint8Array([1,2,3,254]))[0],254);assert.equal(compactAlpha(new Uint8ClampedArray()).byteLength,0);
 for(const bad of [[],new Uint16Array(4),new Uint8ClampedArray(3)])assert.throws(()=>compactAlpha(bad),/Invalid RGBA/);
});

test('frame-local bilinear alpha and the existing 8% threshold retain transparent pass-through and never bleed neighbouring frames',()=>{
 const sprite=new Sprite(new SpriteMaterial()),rgba=new Uint8ClampedArray(6*3*4);for(let i=3;i<rgba.length;i+=4)rgba[i]=255;
 // Actual selected 2x2 frame is a checkerboard, surrounded by opaque neighbours.
 for(const [x,y,a]of [[3,1,0],[4,1,255],[3,2,255],[4,2,0]])rgba[(y*6+x)*4+3]=a;
 sprite.userData.atlas={asset:{meta:{width:6,height:3},alpha:compactAlpha(rgba)},pose:{x:3,y:1,width:2,height:2}};
 for(const [u,v,expected]of [[.25,.75,false],[.75,.75,true],[.25,.25,true],[.75,.25,false],[.5,.5,true],[0,1,false],[1,0,false],[-.1,1.1,false],[.5,1,true]])assert.equal(spriteOpaque(sprite,{x:u,y:v}),expected);
 for(const a of [0,1,20,21,127,128,254,255]){sprite.userData.atlas={asset:{meta:{width:1,height:1},alpha:compactAlpha(new Uint8ClampedArray([255,99,42,a]))},pose:{x:0,y:0,width:1,height:1}};assert.equal(spriteOpaque(sprite,{x:.5,y:.5}),a>=21);}
 sprite.material.dispose();
});

test('crossfade opacity still uses both native frame alphas with the unchanged mix/threshold',()=>{
 const sprite=new Sprite(new SpriteMaterial()),rgba=new Uint8ClampedArray([200,10,20,0,30,40,250,255]);
 sprite.userData.atlas={asset:{meta:{width:2,height:1},alpha:compactAlpha(rgba)},pose:{x:1,y:0,width:1,height:1},from:{x:0,y:0,width:1,height:1},mix:0};
 for(const [mix,expected]of [[0,false],[.079,false],[.08,true],[.081,true],[.5,true],[1,true]]){sprite.userData.atlas.mix=mix;assert.equal(spriteOpaque(sprite,{x:.5,y:.5}),expected);}
 sprite.userData.atlas.pose.x=0;sprite.userData.atlas.from.x=1;for(const [mix,expected]of [[0,true],[.5,true],[.91,true],[.93,false],[1,false]]){sprite.userData.atlas.mix=mix;assert.equal(spriteOpaque(sprite,{x:.5,y:.5}),expected);}
 assert.equal(spriteOpaque(sprite,undefined),true);delete sprite.userData.atlas;assert.equal(spriteOpaque(sprite,{x:.5,y:.5}),true);sprite.material.dispose();
});

test('touch candidates retain the same mixed-alpha cutoff and exact 22px reach',()=>{
 const sprite=new Sprite(new SpriteMaterial()),rgba=new Uint8ClampedArray(8*4*4);rgba[(1*8+1)*4+3]=255;
 sprite.userData.atlas={asset:{meta:{width:8,height:4},alpha:compactAlpha(rgba)},pose:{x:4,y:0,width:4,height:4},from:{x:0,y:0,width:4,height:4},mix:.5};
 const face={owner:'native.saved.id',sprite,rect:{x:0,y:0,width:8,height:8}};
 assert.deepEqual(nearbySpritePoints([face],25,3),[{x:3,y:3,owner:'native.saved.id',distance:484}]);assert.deepEqual(nearbySpritePoints([face],25.01,3),[]);
 sprite.userData.atlas.mix=1;assert.deepEqual(nearbySpritePoints([face],3,3),[]);
 sprite.userData.atlas.mix=.93;assert.deepEqual(nearbySpritePoints([face],3,3),[]);sprite.userData.atlas.mix=.91;assert.equal(nearbySpritePoints([face],3,3).length,1);sprite.material.dispose();
});

test('compact picking matches an independent four-tap RGBA reference across frame borders and blend grids',()=>{
 const width=32,height=16,rgba=new Uint8ClampedArray(width*height*4),sprite=new Sprite(new SpriteMaterial());
 for(let p=0;p<width*height;p++){rgba[p*4]=(p*23+7)%256;rgba[p*4+1]=(p*41+193)%256;rgba[p*4+2]=(p*79+3)%256;rgba[p*4+3]=(p*137+11)%256;}
 const alpha=compactAlpha(rgba),frames=[{x:0,y:0,width:8,height:8},{x:8,y:8,width:8,height:8},{x:24,y:0,width:8,height:8},{x:16,y:8,width:8,height:8}];
 // Sample the original RGBA bytes independently, not the compact array or picker.
 const reference=(frame,u,v)=>{const x=frame.x+u*frame.width-.5,y=frame.y+(1-v)*frame.height-.5,left=Math.floor(x),top=Math.floor(y);let total=0;for(let dy=0;dy<2;dy++)for(let dx=0;dx<2;dx++){const px=Math.max(frame.x,Math.min(frame.x+frame.width-1,left+dx)),py=Math.max(frame.y,Math.min(frame.y+frame.height-1,top+dy)),weight=(dx?x-left:1-x+left)*(dy?y-top:1-y+top);total+=rgba[(py*width+px)*4+3]*weight;}return total;};
 for(let f=0;f<frames.length;f++)for(const mix of [0,1/64,1/16,1/8,1/2,7/8,63/64,1]){
  const pose=frames[f],from=frames[(f+1)%frames.length];sprite.userData.atlas={asset:{meta:{width,height},alpha},pose,from,mix};
  // Binary-fraction grids make both interpolation orders exact, including UVs
  // outside a cell; comparison never relies on a tolerance around alphaTest.
  for(let y=-1;y<=17;y++)for(let x=-1;x<=17;x++){const u=x/16,v=y/16,expected=(reference(from,u,v)*(1-mix)+reference(pose,u,v)*mix)>=255*.08;assert.equal(spriteOpaque(sprite,{x:u,y:v}),expected);}
 }
 sprite.material.dispose();
});
