//#region Imports
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { marble, gold } from './textures.js';
//#endregion

// #region Configuração Base da Cena
const canvas = document.querySelector('canvas');
const WIDTH = 1600;
const HEIGHT = 1200;

const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(WIDTH, HEIGHT);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.8; // controla o brilho geral

const camera = new THREE.PerspectiveCamera(60, WIDTH / HEIGHT, 0.1, 1000);
camera.position.set(6, 4, 7);
camera.lookAt(0, 0, 0);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

// Luz extra para complementar o HDR
const pointLight = new THREE.PointLight(0xffffff, 5);
pointLight.position.set(5, 3, 5);
scene.add(pointLight);
// #endregion

// #region HDR Environment
const rgbeLoader = new RGBELoader();
rgbeLoader.load('textures/hdr/studio_small_09_1k.hdr', (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;
    scene.background = hdr; // remove esta linha se quiser fundo preto
});
// #endregion

// #region Carregamento do modelo GLTF
const loader = new GLTFLoader();
loader.load(
    '../models/RecordPlayer.glb',
    (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.scale.set(12, 12, 12);

        const base = model.getObjectByName('Base');
        const feet = model.getObjectByName('Feet');
        const agulha = model.getObjectByName('Cylinder004');
        const vinylBase = model.getObjectByName('VinylBase');

        base ? (base.material = marble, console.log('Base → Marble')) : console.warn('Objeto "Base" não encontrado.');
        feet ? (feet.material = gold, console.log('Feet → Gold')) : console.warn('Objeto "Feet" não encontrado.');
        agulha ? (agulha.material = gold, console.log('Agulha → Gold')) : console.warn('Objeto "Agulha" não encontrado.');
        vinylBase ? (vinylBase.material = gold, console.log('VinylBase → Gold')) : console.warn('Objeto "VinylBase" não encontrado.');
    },
    undefined,
    (error) => {
        console.error('Erro ao carregar glB:', error);
    }
);
// #endregion

function render() {
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}

render();
