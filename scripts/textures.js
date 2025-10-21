import * as THREE from 'three';

// Cria o loader
const textureLoader = new THREE.TextureLoader();

// Marble
const marbleBaseColorTexture = textureLoader.load('materials/Comb1/Marble/Marble012_1K-JPG_Color.jpg');
const marbleNormalMapTexture = textureLoader.load('materials/Comb1/Marble/Marble012_1K-JPG_NormalGL.jpg');
const marbleRoughnessMap = textureLoader.load('materials/Comb1/Marble/Marble012_1K-JPG_Roughness.jpg');

// Gold
const goldBaseColorTexture = textureLoader.load('materials/Comb1/Gold/Metal042A_1K-JPG_Color.jpg');
const goldNormalMapTexture = textureLoader.load('materials/Comb1/Gold/Metal042A_1K-JPG_NormalGL.jpg');
const goldRoughnessMap = textureLoader.load('materials/Comb1/Gold/Metal042A_1K-JPG_Roughness.jpg');
const goldMetalnessMap = textureLoader.load('materials/Comb1/Gold/Metal042A_1K-JPG_Metalness.jpg');

// Marble material
const marble = new THREE.MeshStandardMaterial({
    map: marbleBaseColorTexture,
    normalMap: marbleNormalMapTexture,
    roughnessMap: marbleRoughnessMap,
    roughness: 0.5,
    side: THREE.DoubleSide,
});

// Gold material
const gold = new THREE.MeshStandardMaterial({
    map: goldBaseColorTexture,
    normalMap: goldNormalMapTexture,
    roughnessMap: goldRoughnessMap,
    metalnessMap: goldMetalnessMap,
    roughness: 0.5,
    metalness: 0.7,
});

export { marble, gold };
