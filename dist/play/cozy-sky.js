import {Color,MathUtils,Mesh,PlaneGeometry,ShaderMaterial} from 'three';

const daylight={haze:new Color('#bbd1db'),zenith:new Color('#5b9cc6'),cloud:new Color('#f2f5f3')};
const twilight={haze:new Color('#d0bca4'),zenith:new Color('#6482aa'),cloud:new Color('#e3c4b3')};
const night={haze:new Color('#36494f'),zenith:new Color('#152337'),cloud:new Color('#8198a7')};

const vertexShader=`
 uniform mat4 inverseProjection;
 uniform mat4 cameraToWorld;
 varying vec3 viewDirection;

 void main() {
  // Unproject a far-plane point and transform only its direction.
  vec4 clip = vec4(position.xy, 1.0, 1.0);
  viewDirection = mat3(cameraToWorld) * (inverseProjection * clip).xyz;
  gl_Position = clip;
 }
`;

const fragmentShader=`
 uniform vec3 haze;
 uniform vec3 zenith;
 uniform vec3 cloudLight;
 uniform float sunlight;
 varying vec3 viewDirection;

 float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
 }

 float cloudNoise(vec2 p) {
  vec2 cell = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(cell), hash(cell + vec2(1.0, 0.0)), f.x),
             mix(hash(cell + vec2(0.0, 1.0)), hash(cell + vec2(1.0)), f.x), f.y);
 }

 void main() {
  vec3 ray = normalize(viewDirection);
  float altitude = max(0.0, ray.y);
  vec3 atmosphere = mix(haze, zenith, 1.0 - exp(-4.0 * altitude));
  vec2 clouds = ray.xz * 1.65 / (altitude + 0.15);
  float cover = 0.58 * cloudNoise(clouds)
              + 0.27 * cloudNoise(clouds * 2.07 + 9.5)
              + 0.15 * cloudNoise(clouds * 4.11 - 17.0);
  float opacity = smoothstep(0.44, 0.76, cover) * smoothstep(0.012, 0.17, altitude);
  vec3 cloudColor = mix(haze, cloudLight, smoothstep(0.41, 0.7, cover));
  gl_FragColor = vec4(mix(atmosphere, cloudColor, opacity * sunlight), 1.0);
  #include <colorspace_fragment>
 }
`;

/** Draw the sky at the far plane using the farm camera's direction. */
export class FarmSky{
 /** @param {import('three').PerspectiveCamera} camera */
 constructor(camera){
  this.haze=daylight.haze.clone();
  this.uniforms={
   inverseProjection:{value:camera.projectionMatrixInverse},
   cameraToWorld:{value:camera.matrixWorld},
   haze:{value:this.haze},
   zenith:{value:daylight.zenith.clone()},
   cloudLight:{value:daylight.cloud.clone()},
   sunlight:{value:1},
  };
  const material=new ShaderMaterial({
   uniforms:this.uniforms,vertexShader,fragmentShader,
   depthWrite:false,depthTest:true,toneMapped:false,
  });
  this.mesh=new Mesh(new PlaneGeometry(2,2),material);
  this.mesh.name='farm_atmosphere';
  this.mesh.frustumCulled=false;
  this.mesh.renderOrder=100;
 }

 /** @param {number} hour */
 setHour(hour){
  const sun=MathUtils.smoothstep(hour,4,8)*(1-MathUtils.smoothstep(hour,17,21));
  const dusk=Math.max(0,1-Math.min(Math.abs(hour-6),Math.abs(hour-18))/3)*.83;
  this.haze.copy(night.haze).lerp(daylight.haze,sun).lerp(twilight.haze,dusk);
  this.uniforms.zenith.value.copy(night.zenith).lerp(daylight.zenith,sun).lerp(twilight.zenith,dusk);
  this.uniforms.cloudLight.value.copy(night.cloud).lerp(daylight.cloud,sun).lerp(twilight.cloud,dusk);
  this.uniforms.sunlight.value=.30+sun*.70;
 }

 dispose(){
  this.mesh.removeFromParent();
  this.mesh.geometry.dispose();
  this.mesh.material.dispose();
 }
}
