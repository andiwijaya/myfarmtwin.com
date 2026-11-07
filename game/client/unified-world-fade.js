/** A single billboard blends two atlas poses in premultiplied color, retaining one actor/hit target.
 * @param {import('three').Sprite} sprite */
export function configureAtlasFade(sprite){const uniforms={atlasCurrent:{value:[0,0,1,1]},atlasPrevious:{value:[0,0,1,1]},atlasMix:{value:1}};sprite.userData.fadeUniforms=uniforms;sprite.material.customProgramCacheKey=()=>'myfarmtwin-atlas-fade-v1';sprite.material.onBeforeCompile=shader=>{Object.assign(shader.uniforms,uniforms);shader.fragmentShader='uniform vec4 atlasCurrent;\nuniform vec4 atlasPrevious;\nuniform float atlasMix;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#ifdef USE_MAP
 vec2 localAtlasUv=(vMapUv-atlasCurrent.xy)/atlasCurrent.zw;
 vec4 fresh=texture2D(map,vMapUv);
 vec4 prior=texture2D(map,atlasPrevious.xy+localAtlasUv*atlasPrevious.zw);
 float combinedAlpha=mix(prior.a,fresh.a,atlasMix);
 vec3 combinedColor=mix(prior.rgb*prior.a,fresh.rgb*fresh.a,atlasMix)/max(combinedAlpha,0.00001);
 diffuseColor*=vec4(combinedColor,combinedAlpha);
 #endif`);};}
/** @param {import('three').Sprite} sprite @param {{pose:{x:number,y:number,width:number,height:number},from:{x:number,y:number,width:number,height:number}|null,mix:number}} sample @param {{width:number,height:number}} metadata */
export function updateAtlasFade(sprite,sample,metadata){const u=sprite.userData.fadeUniforms;if(!u)return;const rect=(/** @type {{x:number,y:number,width:number,height:number}} */p)=>[p.x/metadata.width,1-(p.y+p.height)/metadata.height,p.width/metadata.width,p.height/metadata.height];u.atlasCurrent.value=rect(sample.pose);u.atlasPrevious.value=rect(sample.from||sample.pose);u.atlasMix.value=sample.from?sample.mix:1;}
