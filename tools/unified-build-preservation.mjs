import assert from 'node:assert/strict';
/** Preserve every frozen original; permit only separately hash-audited original atlas additions. */
export function assertPreservedMedia(files,before,atlasAssets=[]){
 const old=new Set(before.map(f=>f.name)),allowed=new Map();for(const asset of atlasAssets){const name=asset.path.replace(/^game\/client\//,'play/');assert.match(name,/^play\/assets\/world\/(chicken|goat|cow|fish)\.(high|low)\.png$/);assert.match(asset.sha256,/^[a-f0-9]{64}$/);assert.ok(!old.has(name),'Original media cannot be reclassified as a new atlas');assert.ok(!allowed.has(name),'Duplicate atlas declaration');allowed.set(name,asset);}
 const generated=[],preserved=[];for(const file of files){const asset=allowed.get(file.name);if(!asset){preserved.push(file);continue;}assert.equal(file.sha256,asset.sha256,'Atlas output hash differs');assert.equal(file.bytes,asset.bytes,'Atlas output byte length differs');generated.push(file);}
 assert.deepEqual(preserved,before,'Editorial or original media changed');assert.equal(generated.length,allowed.size,'A declared atlas is missing');return{original:preserved.length,generated:generated.length};
}
