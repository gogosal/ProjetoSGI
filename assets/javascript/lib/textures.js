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

const materialLibrary = {
    marble: {
        id: "marble",
        label: "Marmore Carrara",
        shortLabel: "Marmore",
        material: marble,
        preview: { type: "image", src: marblePresetThumbnail },
    },
    gold: {
        id: "gold",
        label: "Ouro escovado",
        shortLabel: "Ouro",
        material: gold,
        preview: { type: "color", value: "#d4b47a" },
    },
    chrome: {
        id: "chrome",
        label: "Cromado",
        shortLabel: "Chrome",
        material: chrome,
        preview: { type: "color", value: "#dfe4ed" },
    },
    copper: {
        id: "copper",
        label: "Cobre vintage",
        shortLabel: "Cobre",
        material: copper,
        preview: { type: "color", value: "#b56a39" },
    },
    wood: {
        id: "wood",
        label: "Madeira natural",
        shortLabel: "Madeira",
        material: wood,
        preview: { type: "image", src: defaultPresetThumbnail },
    },
    plastic: {
        id: "plastic",
        label: "Preto acetinado",
        shortLabel: "Preto",
        material: plastic,
        preview: { type: "color", value: "#2f2f2f" },
    },
};

const customMaterialOptions = {
    base: [
        { id: "original", label: "Original do modelo", shortLabel: "Original", kind: "original" },
        { id: "marble", label: materialLibrary.marble.label, shortLabel: materialLibrary.marble.shortLabel, kind: "material" },
        { id: "wood", label: materialLibrary.wood.label, shortLabel: materialLibrary.wood.shortLabel, kind: "material" },
        { id: "plastic", label: materialLibrary.plastic.label, shortLabel: materialLibrary.plastic.shortLabel, kind: "material" },
    ],
    feet: [
        { id: "original", label: "Original do modelo", shortLabel: "Original", kind: "original" },
        { id: "gold", label: materialLibrary.gold.label, shortLabel: materialLibrary.gold.shortLabel, kind: "material" },
        { id: "copper", label: materialLibrary.copper.label, shortLabel: materialLibrary.copper.shortLabel, kind: "material" },
        { id: "chrome", label: materialLibrary.chrome.label, shortLabel: materialLibrary.chrome.shortLabel, kind: "material" },
    ],
    agulha: [
        { id: "original", label: "Original do modelo", shortLabel: "Original", kind: "original" },
        { id: "gold", label: materialLibrary.gold.label, shortLabel: materialLibrary.gold.shortLabel, kind: "material" },
        { id: "chrome", label: materialLibrary.chrome.label, shortLabel: materialLibrary.chrome.shortLabel, kind: "material" },
        { id: "copper", label: materialLibrary.copper.label, shortLabel: materialLibrary.copper.shortLabel, kind: "material" },
    ],
    vinylBase: [
        { id: "original", label: "Original do modelo", shortLabel: "Original", kind: "original" },
        { id: "marble", label: materialLibrary.marble.label, shortLabel: materialLibrary.marble.shortLabel, kind: "material" },
        { id: "wood", label: materialLibrary.wood.label, shortLabel: materialLibrary.wood.shortLabel, kind: "material" },
        { id: "gold", label: materialLibrary.gold.label, shortLabel: materialLibrary.gold.shortLabel, kind: "material" },
        { id: "plastic", label: materialLibrary.plastic.label, shortLabel: materialLibrary.plastic.shortLabel, kind: "material" },
    ],
};

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

export { marble, gold, chrome, copper, wood, plastic, materialLibrary, customMaterialOptions };
