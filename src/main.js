import * as THREE from 'three';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Renderer
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Geometry + ShaderMaterial
const geometry = new THREE.PlaneGeometry(2, 2.5, 100, 100);
const texture = new THREE.TextureLoader().load('./img2.jpg');
const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },
    uTexture: { value: texture },
    uWaveSpeed: { value: 0.1 },
    uNoiseStrength: { value: 0.2 },
    uWaveHeight: { value: 1.0 },
  },
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

// Initial Camera Position
camera.position.z = 5;

// Resize + Mobile Adapt
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}
window.addEventListener('resize', () => {
  resize();
  adjustCamera();
});
resize();

function adjustCamera() {
  const isMobile = window.innerWidth < 768;
  camera.fov = isMobile ? 60 : 50;
  camera.position.z = isMobile ? 6 : 5;
  camera.updateProjectionMatrix();
}
adjustCamera();

// GUI Controls
const gui = new GUI();
if (window.innerWidth < 768) gui.close();

const shaderParams = {
  waveSpeed: 0.1,
  noiseStrength: 0.2,
  waveHeight: 1.0,
};

gui.add(shaderParams, 'waveSpeed', 0.01, 1.0, 0.01).onChange(val => {
  material.uniforms.uWaveSpeed.value = val;
});
gui.add(shaderParams, 'noiseStrength', 0.0, 1.0, 0.01).onChange(val => {
  material.uniforms.uNoiseStrength.value = val;
});
gui.add(shaderParams, 'waveHeight', 0.0, 5.0, 0.1).onChange(val => {
  material.uniforms.uWaveHeight.value = val;
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  material.uniforms.uTime.value += 0.1;
  controls.update();
  renderer.render(scene, camera);
}
animate();
