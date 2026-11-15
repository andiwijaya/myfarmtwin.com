import {resolve,join} from 'node:path';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {writeGLB,packStaticMeshes} from './glb-prototype-export.mjs';
import {textures,createCow,createBarn,createTerrain,createBed,createCrops,createVegetation,createFence,createPath,createProps} from './glb-prototype-models.mjs';
import {extendCowPoses} from './cozy-world-cow-poses.mjs';

export async function buildPrototypeAssets(root=resolve(fileURLToPath(new URL('../../',import.meta.url)))){
 const directory=join(root,'game/client/assets/models/prototype');await mkdir(directory,{recursive:true});
 const cow=extendCowPoses(createCow()),models=[['terrain',createTerrain()],['barn',createBarn()],['cow',cow.root,cow.animations],['bed',createBed()],['crops',createCrops()],['vegetation',createVegetation()],['fence',createFence()],['path',createPath()],['props',createProps()]];
 const assets={};
 for(const [id,model,animations]of models){packStaticMeshes(model);const path=join(directory,id+'.glb'),record=await writeGLB(path,model,{textures,animations});const bytes=await readFile(path);assets[id]={id,url:'./prototype/'+id+'.glb',sha256:createHash('sha256').update(bytes).digest('hex'),...record};}
 const manifest={version:1,format:'glTF 2.0 GLB',authoringDate:'2026-11-15',author:'MyFarmTwin original repository authoring',license:'Original project assets; procedural texture and geometry source included in tools/art/glb-prototype-*.mjs',externalResources:false,units:'meters',up:'+Y',cowForward:'+X',dimensions:{terrain:[48,40],barn:[10,8],bed:[1.5,1.8],fenceLength:2,path:[2,2]},roles:{barn:{roof:'roof',walls:'walls',frame:'frame',floor:'floor',stalls:'stalls',equipment:'equipment'},cow:{head:'head',tail:'tail',legs:['leg_front_left','leg_front_right','leg_rear_left','leg_rear_right']},crops:{lettuce:['lettuce_0','lettuce_1','lettuce_2','lettuce_3'],tomato:['tomato_0','tomato_1','tomato_2','tomato_3'],corn:['corn_0','corn_1','corn_2','corn_3','corn_4']},vegetation:['banana','palm','grass','shrub'],props:['feed_trough','water_trough','milk_pail','crate','feed_bag','pump','rock']},assets};
 await writeFile(join(root,'game/client/assets/models/prototype-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 console.log(JSON.stringify({kind:'prototype-glb-assets',totalBytes:Object.values(assets).reduce((n,a)=>n+a.bytes,0),assets:Object.values(assets).map(a=>({id:a.id,bytes:a.bytes,uniqueTriangles:a.uniqueTriangles,nodes:a.nodes,animations:a.animations}))},null,2));return manifest;
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))await buildPrototypeAssets();
