/** Original repository-authored art contract. No simulation or game RNG here.
 * Atlas artists/generators and both renderers share these units and conventions.
 */
/** @template T @param {T} value @returns {Readonly<T>} */
const freeze=value=>{if(value&&typeof value==='object'){for(const v of Object.values(value))freeze(v);Object.freeze(value);}return value;};
export const WORLD_ART=freeze({
 version:1,style:'warm low-poly farm, readable silhouettes, restrained detail',
 origin:'Original work for MyFarmTwin; no MyZooTwin art or source copied',
 projection:{elevationDegrees:Math.atan(1/Math.sqrt(2))*180/Math.PI,azimuthDegrees:[45,135,225,315],animalForward:'+z',pivot:'ground contact at x/z origin',directions:4},
 light:{sky:'#fff5de',ground:'#68835d',hemisphere:2.6,key:'#fff4dc',keyIntensity:2,keyPosition:[-8,18,10],background:'#e5eddc'},
 palette:{soil:'#9a744f',wood:'#c49b69',roof:'#a46243',leaf:'#71a74b',water:'#7caeb1',cream:'#e6dfc6',warmWhite:'#fff3d5',brown:'#9a744f',charcoal:'#4d5044',slate:'#899d8d',beak:'#d6a44b',comb:'#b85c45'},
 atlas:{format:'image/png',alpha:'straight RGBA',transparent:true,paddingPixels:2,columns:16,framesPerAction:4,framesPerSecond:6,maxResidentRgbaBytes:64*1024*1024,minHardwareTexture:2048,highHardwareTexture:4096,filter:'linear',mipmaps:false,shadow:{separate:true,opacity:.18,maxOpacity:.24,color:'#344b38'}},
 species:{
  chicken:{height:.73,framePixels:128,frameWorldUnits:1.6,pivot:[.5,.82],contactRadius:.28,actions:['idle','walk','eat','drink','nest','rest']},
  goat:{height:1.3,framePixels:192,frameWorldUnits:2.6,pivot:[.5,.82],contactRadius:.45,actions:['idle','walk','browse','drink','rest','climb','chew'],stageScale:{weaned:.62,growing:.82,marketReady:1}},
  cow:{height:1.8,framePixels:256,frameWorldUnits:3.8,pivot:[.5,.82],contactRadius:.65,actions:['idle','walk','feed','drink','rest','milk'],stageScale:{adult:1}},
  fish:{height:.12,framePixels:96,frameWorldUnits:1.25,pivot:[.5,.5],contactRadius:0,actions:['swim','feed','surface','rest'],waterPlane:.27}
 },
 lowScale:.5,reducedMotion:'one static native-state pose; no locomotion or cosmetic clock',
 safety:'Native IDs/count/stage/activity only; cosmetic variants must use stable-ID hashes, never the simulation RNG'
});
/** Exact uncompressed allocation, including empty final cells; no claimed hardware measurement.
 * @param {'high'|'low'} lod */
export function atlasBudget(lod){if(lod!=='high'&&lod!=='low')throw new RangeError('Known atlas LOD required');const a=WORLD_ART.atlas,scale=lod==='low'?WORLD_ART.lowScale:1;return Object.values(WORLD_ART.species).reduce((bytes,species)=>{const cell=species.framePixels*scale,rows=Math.ceil(species.actions.length*WORLD_ART.projection.directions*a.framesPerAction/a.columns);return bytes+cell*a.columns*cell*rows*4;},0);}
/** Four camera azimuths relative to an actor's cosmetic quarter-turn heading.
 * @param {number} cameraHeading @param {number} actorHeading */
export function atlasDirection(cameraHeading,actorHeading=0){if(!Number.isSafeInteger(cameraHeading)||!Number.isSafeInteger(actorHeading))throw new RangeError('Quarter-turn headings required');return((cameraHeading-actorHeading)%4+4)%4;}
