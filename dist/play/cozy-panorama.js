import * as THREE from 'three';

const panoramaUrl = /** @type {{MYFARMTWIN_PANORAMA_URL?: string}} */ (globalThis).MYFARMTWIN_PANORAMA_URL
  ?? '/play/assets/tropical-panorama.webp';

const vertexShader = /* glsl */ `
  uniform mat4 inverseProjection;
  uniform mat4 cameraWorld;
  varying vec3 worldRay;

  void main() {
    vec4 clip = vec4(position.xy, 1.0, 1.0);
    vec3 viewRay = (inverseProjection * clip).xyz;
    worldRay = (cameraWorld * vec4(viewRay, 0.0)).xyz;
    gl_Position = clip;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D panoramaMap;
  uniform vec3 skyColor;
  uniform vec3 grassColor;
  uniform float night;
  uniform float visibility;
  varying vec3 worldRay;

  void main() {
    const float turn = 6.28318530718;
    const float overlap = 0.065;
    float horizontal = length(worldRay.xz);
    float yaw = atan(worldRay.x, worldRay.z);
    float pitch = atan(worldRay.y, horizontal);
    float longitude = fract(yaw / turn + 0.72);
    // Raise the photographed horizon into the farm's downward overview.
    float band = clamp((0.39 - pitch) / 1.39, 0.0, 1.0);
    float scan = longitude * (1.0 - overlap);
    float imageY = 1.0 - band;
    vec3 landscape = texture2D(panoramaMap, vec2(scan + overlap, imageY)).rgb;

    // Overlap the two paddy edges so the sampled color and its motion wrap.
    float seam = scan - (1.0 - 2.0 * overlap);
    if (seam > 0.0) {
      vec3 start = texture2D(panoramaMap, vec2(seam, imageY)).rgb;
      landscape = mix(landscape, start, smoothstep(0.0, overlap, seam));
    }

    // The lower field merges into grass. Near-vertical rays lose all detail
    // so the panorama remains stable when the camera looks straight down.
    landscape = mix(landscape, grassColor, smoothstep(0.76, 0.98, band));
    landscape *= mix(vec3(1.0), vec3(0.44, 0.56, 0.75), night);
    float skyHaze = 0.35 * (1.0 - smoothstep(0.07, 0.37, band));
    landscape = mix(landscape, skyColor, skyHaze);
    gl_FragColor = vec4(mix(skyColor, landscape, visibility), 1.0);
    #include <colorspace_fragment>
  }
`;

/** One screen-space draw behind the opaque farm and its transparent details. */
export class FarmPanorama {
  /** @param {THREE.Scene} scene @param {THREE.PerspectiveCamera} camera @param {THREE.Color} skyColor @param {HTMLElement} host */
  constructor(scene, camera, skyColor, host) {
    this.host = host;
    this.started = false;
    this.disposed = false;
    this.lastFrame = 0;
    this.uniforms = {
      panoramaMap: {value: /** @type {THREE.Texture | null} */ (null)},
      inverseProjection: {value: camera.projectionMatrixInverse},
      cameraWorld: {value: camera.matrixWorld},
      skyColor: {value: skyColor},
      grassColor: {value: new THREE.Color('#6e793d')},
      night: {value: 0},
      visibility: {value: 0},
    };
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      depthWrite: false,
      toneMapped: false,
    });
    this.surface = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    this.surface.visible = false;
    this.surface.frustumCulled = false;
    this.surface.renderOrder = 100;
    scene.add(this.surface);
  }

  load() {
    if (this.started || this.disposed) return;
    this.started = true;
    this.host.dataset.panorama = 'loading';
    void new THREE.TextureLoader().loadAsync(panoramaUrl).then(texture => {
      if (this.disposed) {
        texture.dispose();
        return;
      }
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      this.uniforms.panoramaMap.value = texture;
    }).catch(() => {
      if (!this.disposed) this.host.dataset.panorama = 'fallback';
    });
  }

  /** @param {boolean} night */
  setNight(night) {
    this.uniforms.night.value = night ? 1 : 0;
  }

  /** @param {number} now @param {boolean} interior @param {boolean} reducedMotion */
  update(now, interior, reducedMotion) {
    const elapsed = Math.min(now - (this.lastFrame || now), 50);
    this.lastFrame = now;
    if (!this.uniforms.panoramaMap.value) return;

    const step = (interior ? -1 : 1) * elapsed / 240;
    const opacity = reducedMotion ? Number(!interior) : THREE.MathUtils.clamp(this.uniforms.visibility.value + step, 0, 1);
    this.uniforms.visibility.value = opacity;
    this.surface.visible = opacity > 0;
    const status = opacity === 0 ? 'interior' : opacity === 1 ? 'ready' : 'transition';
    if (this.host.dataset.panorama !== status) this.host.dataset.panorama = status;
  }

  dispose() {
    this.disposed = true;
    this.surface.removeFromParent();
    this.surface.geometry.dispose();
    this.surface.material.dispose();
    this.uniforms.panoramaMap.value?.dispose();
  }
}
