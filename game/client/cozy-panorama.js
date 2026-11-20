import * as THREE from 'three';

const panoramaUrl = /** @type {{MYFARMTWIN_PANORAMA_URL?: string}} */ (globalThis).MYFARMTWIN_PANORAMA_URL
  ?? '/play/assets/tropical-panorama.webp';

/** @param {number} height @param {number} visibility */
export function splitFarmViewport(height, visibility) {
  const panoramaHeight = Math.floor(Math.min(144, height * 0.26) * visibility);
  const gap = panoramaHeight ? Math.max(1, Math.round(Math.min(18, height * 0.038) * visibility)) : 0;
  return {panoramaHeight, gap, mapHeight: height - panoramaHeight - gap};
}

const vertexShader = /* glsl */ `
  varying vec2 panelUV;

  void main() {
    panelUV = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D panoramaMap;
  uniform vec3 backdropColor;
  uniform float heading;
  uniform float span;
  uniform float night;
  uniform float visibility;
  varying vec2 panelUV;

  void main() {
    const float overlap = 0.065;
    float longitude = fract(heading + (panelUV.x - 0.5) * span);
    float scan = longitude * (1.0 - overlap);
    float imageY = mix(0.32, 0.70, panelUV.y);
    vec3 landscape = texture2D(panoramaMap, vec2(scan + overlap, imageY)).rgb;

    // Overlap the two paddy edges so the sampled color and its motion wrap.
    float seam = scan - (1.0 - 2.0 * overlap);
    if (seam > 0.0) {
      vec3 start = texture2D(panoramaMap, vec2(seam, imageY)).rgb;
      landscape = mix(landscape, start, smoothstep(0.0, overlap, seam));
    }

    landscape *= mix(vec3(1.0), vec3(0.44, 0.56, 0.75), night);
    float lowerFade = smoothstep(0.0, 0.26, panelUV.y);
    gl_FragColor = vec4(mix(backdropColor, landscape, visibility * lowerFade), 1.0);
    #include <colorspace_fragment>
  }
`;

/** A decorative upper viewport driven only by the farm camera's heading. */
export class FarmPanorama {
  /** @param {THREE.Color} backdropColor @param {HTMLElement} host */
  constructor(backdropColor, host) {
    this.host = host;
    this.started = false;
    this.disposed = false;
    this.lastFrame = 0;
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.direction = new THREE.Vector3();
    this.uniforms = {
      panoramaMap: {value: /** @type {THREE.Texture | null} */ (null)},
      backdropColor: {value: backdropColor},
      heading: {value: 0},
      span: {value: 0},
      night: {value: 0},
      visibility: {value: 0},
    };
    const material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
      depthTest: false,
      depthWrite: false,
      toneMapped: false,
    });
    this.surface = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    this.surface.frustumCulled = false;
    this.scene.add(this.surface);
  }

  get visibility() {
    return this.uniforms.visibility.value;
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
    const status = interior && opacity === 0 ? 'interior' : opacity === 1 ? 'ready' : 'transition';
    if (this.host.dataset.panorama !== status) this.host.dataset.panorama = status;
  }

  /** @param {THREE.WebGLRenderer} renderer @param {THREE.Camera} farmCamera @param {number} width @param {number} y @param {number} height */
  draw(renderer, farmCamera, width, y, height) {
    if (!height) return;
    farmCamera.getWorldDirection(this.direction);
    this.uniforms.heading.value = Math.atan2(this.direction.x, this.direction.z) / (2 * Math.PI) + 0.72;
    this.uniforms.span.value = THREE.MathUtils.clamp(width / 2700, 0.17, 0.58);
    renderer.setViewport(0, y, width, height);
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    try {
      renderer.render(this.scene, this.camera);
    } finally {
      renderer.autoClear = autoClear;
    }
  }

  dispose() {
    this.disposed = true;
    this.surface.removeFromParent();
    this.surface.geometry.dispose();
    this.surface.material.dispose();
    this.uniforms.panoramaMap.value?.dispose();
  }
}
