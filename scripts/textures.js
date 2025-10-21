import * as THREE from 'three';

// Marble
const marbleBaseColorTexture = THREE.TextureLoader.load('Comb1\materials\Marble\Marble012_1K-JPG_Color.jpg');
const marbleNormalMapTexture = THREE.TextureLoader.load('');
const marbleroughnessMap = THREE.TextureLoader.load('');
const marblemetalnessMap = THREE.TextureLoader.load('');

// Gold
const goldBaseColorTexture = THREE.TextureLoader.load('');
const goldNormalMapTexture = THREE.TextureLoader.load('');
const goldroughnessMap = THREE.TextureLoader.load('');
const goldmetalnessMap = THREE.TextureLoader.load('');

const marble = new THREE.MeshStandardMaterial({
    map: marbleBaseColorTexture,
    transparent: transparent,
    alphaTest: 0.0,
    normalMap: marbleNormalMapTexture,
    aoMapIntensity: 1,
    roughnessMap: marbleroughnessMap,
    roughness: 1,
    metalnessMap: marblemetalnessMap,
    metalness: 1,
});

const gold = new THREE.MeshStandardMaterial({
    map: goldBaseColorTexture,
    transparent: transparent,
    alphaTest: 0.0,
    normalMap: goldNormalMapTexture,
    aoMapIntensity: 1,
    roughnessMap: goldOrmTexture,
    roughness: 1,
    metalnessMap: goldOrmTexture,
    metalness: 1,
});