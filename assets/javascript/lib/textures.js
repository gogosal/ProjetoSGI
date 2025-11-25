import * as THREE from "three";

const textureLoader = new THREE.TextureLoader();

const assetUrl = (relativePath) =>
    new URL(`../../textures/${relativePath}`, import.meta.url).href;

const imageUrl = (relativePath) =>
    new URL(`../../images/${relativePath}`, import.meta.url).href;

const loadTexture = (relativePath, { colorSpace = THREE.LinearSRGBColorSpace } = {}) => {
    const texture = textureLoader.load(assetUrl(relativePath));
    texture.flipY = false;
    texture.colorSpace = colorSpace;
    return texture;
};

const defaultPresetThumbnail = imageUrl("Wood.png");
const marblePresetThumbnail = imageUrl("Marble.png");

const marbleBaseColorTexture = loadTexture(
    "materials/Comb1/Marble/Marble012_1K-JPG_Color.jpg",
    { colorSpace: THREE.SRGBColorSpace },
);
const marbleNormalMapTexture = loadTexture("materials/Comb1/Marble/Marble012_1K-JPG_NormalGL.jpg");
const marbleRoughnessMap = loadTexture("materials/Comb1/Marble/Marble012_1K-JPG_Roughness.jpg");

const goldBaseColorTexture = loadTexture(
    "materials/Comb1/Gold/Metal042A_1K-JPG_Color.jpg",
    { colorSpace: THREE.SRGBColorSpace },
);
const goldNormalMapTexture = loadTexture("materials/Comb1/Gold/Metal042A_1K-JPG_NormalGL.jpg");
const goldRoughnessMap = loadTexture("materials/Comb1/Gold/Metal042A_1K-JPG_Roughness.jpg");
const goldMetalnessMap = loadTexture("materials/Comb1/Gold/Metal042A_1K-JPG_Metalness.jpg");

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
    side: THREE.DoubleSide,
});

// Materiais adicionais
const chrome = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    roughness: 0.1,
    metalness: 1.0,
    side: THREE.DoubleSide,
});

const copper = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    roughness: 0.3,
    metalness: 0.9,
    side: THREE.DoubleSide,
});

const wood = new THREE.MeshStandardMaterial({
    color: 0x8b4513,
    roughness: 0.8,
    metalness: 0.0,
    side: THREE.DoubleSide,
});

const plastic = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.6,
    metalness: 0.1,
    side: THREE.DoubleSide,
});

// Sistema de presets de materiais
export const materialPresets = {
    default: {
        name: 'Original',
        description: 'Material original do modelo',
        materials: null,
        thumbnail: defaultPresetThumbnail
    },
    luxo: {
        name: 'Luxo',
        description: 'Mármore e Ouro',
        materials: {
            base: marble,
            feet: gold,
            agulha: gold,
            vinylBase: gold
        },
        thumbnail: marblePresetThumbnail
    },
    moderno: {
        name: 'Moderno',
        description: 'Chrome e Plástico',
        materials: {
            base: plastic,
            feet: chrome,
            agulha: chrome,
            vinylBase: chrome
        },
        thumbnail: defaultPresetThumbnail
    },
    vintage: {
        name: 'Vintage',
        description: 'Madeira e Cobre',
        materials: {
            base: wood,
            feet: copper,
            agulha: copper,
            vinylBase: copper
        },
        thumbnail: defaultPresetThumbnail
    }
};

export { marble, gold, chrome, copper, wood, plastic };
