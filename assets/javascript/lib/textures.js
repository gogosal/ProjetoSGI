import * as THREE from "three";

// Carregador de texturas da biblioteca Three.js
const textureLoader = new THREE.TextureLoader();

// Função utilitária para obter o URL completo de uma textura
const assetUrl = (relativePath) =>
    new URL(`../../textures/${relativePath}`, import.meta.url).href;

// Função utilitária para obter o URL completo de uma imagem
const imageUrl = (relativePath) =>
    new URL(`../../images/${relativePath}`, import.meta.url).href;

// Função que carrega uma textura, já configurada com o colorSpace correto
const loadTexture = (relativePath, { colorSpace = THREE.LinearSRGBColorSpace } = {}) => {
    const texture = textureLoader.load(assetUrl(relativePath));
    texture.flipY = false; // Impede que a textura fique invertida verticalmente
    texture.colorSpace = colorSpace; // Define o espaço de cor da textura
    return texture;
};

/* --------------------------------------
    Imagens de miniaturas dos presets
   --------------------------------------*/
const defaultPresetThumbnail = imageUrl("Wood.png");     // Miniatura padrão (madeira)
const marblePresetThumbnail = imageUrl("Marble.png");    // Miniatura para mármore
const leatherPresetThumbnail = imageUrl("Leather.png");    // Miniatura para couro
const tilesPresetThumbnail = imageUrl("Tiles.png");    // Miniatura para azulejos

/* --------------------------------------
    Definição das texturas e materiais
   --------------------------------------*/

/* --------------------------------------
                Marble
   --------------------------------------*/
const marbleBaseColorTexture = loadTexture(
    "materials/Marble/Marble012_1K-JPG_Color.jpg",
    { colorSpace: THREE.SRGBColorSpace },
);
const marbleNormalMapTexture = loadTexture("materials/Marble/Marble012_1K-JPG_NormalGL.jpg");
const marbleRoughnessMap = loadTexture("materials/Marble/Marble012_1K-JPG_Roughness.jpg");

const marble = new THREE.MeshStandardMaterial({
    map: marbleBaseColorTexture,
    normalMap: marbleNormalMapTexture,
    roughnessMap: marbleRoughnessMap,
    roughness: 0.5,
    side: THREE.DoubleSide,
});

/* --------------------------------------
                Gold
   --------------------------------------*/
const goldBaseColorTexture = loadTexture(
    "materials/Gold/Metal042A_1K-JPG_Color.jpg",
    { colorSpace: THREE.SRGBColorSpace },
);
const goldNormalMapTexture = loadTexture("materials/Gold/Metal042A_1K-JPG_NormalGL.jpg");
const goldRoughnessMap = loadTexture("materials/Gold/Metal042A_1K-JPG_Roughness.jpg");
const goldMetalnessMap = loadTexture("materials/Gold/Metal042A_1K-JPG_Metalness.jpg");

const gold = new THREE.MeshStandardMaterial({
    map: goldBaseColorTexture,
    normalMap: goldNormalMapTexture,
    roughnessMap: goldRoughnessMap,
    metalnessMap: goldMetalnessMap,
    roughness: 0.5,
    metalness: 0.7,
    side: THREE.DoubleSide,
});

/* --------------------------------------
                Tiles
   --------------------------------------*/
const tilesBaseColorTexture = loadTexture(
    "materials/Tiles/Tiles005_1K-JPG_Color.jpg",
    { colorSpace: THREE.SRGBColorSpace },
);
const tilesNormalMapTexture = loadTexture("materials/Tiles/Tiles005_1K-JPG_NormalGL.jpg");
const tilesRoughnessMap = loadTexture("materials/Tiles/Tiles005_1K-JPG_Roughness.jpg");
const tiles = new THREE.MeshStandardMaterial({
    map: tilesBaseColorTexture,
    normalMap: tilesNormalMapTexture,
    roughnessMap: tilesRoughnessMap,
    roughness: 0.7,
    side: THREE.DoubleSide,
});


/* --------------------------------------
                Red
   --------------------------------------*/
const red = new THREE.MeshStandardMaterial({
    color: "rgba(255, 38, 0, 1)",
    roughness: 0.6,
    metalness: 0.4,
    side: THREE.DoubleSide,
});

/* --------------------------------------
                Grey
   --------------------------------------*/
const grey = new THREE.MeshStandardMaterial({
    color: "rgba(41, 41, 41, 1)",
    side: THREE.DoubleSide,
});

/* --------------------------------------
                Glass
   --------------------------------------*/
const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transmission: 1,
    opacity: 1,
    transparent: true,
    roughness: 0,
    metalness: 0,
    ior: 1.5,
    thickness: 0.01,
    envMapIntensity: 3.5
});

/* --------------------------------------------------
    Biblioteca de materiais reutilizável no sistema
   --------------------------------------------------*/
const materialLibrary = {
    marble: {
        id: "marble",
        label: "Mármore Carrara",
        shortLabel: "Mármore",
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
    red: {
        id: "red",
        label: "Vermelho",
        shortLabel: "Vermelho",
        material: red,
        preview: { type: "image", src: leatherPresetThumbnail },
    },
    tiles: {
        id: "tiles",
        label: "Pastel",
        shortLabel: "Pastel",
        material: tiles,
        preview: { type: "image", src: tilesPresetThumbnail },
    },
    glass: {
        id: "glass",
        label: "Vidro",
        shortLabel: "Vidro",
        material: glass,
        preview: { type: "color", value: "#e0f1ff" },
    },
};

/* --------------------------------------------------
    Opções de materiais por categoria do modelo 3D
   --------------------------------------------------*/
// Função utilitária que recebe uma lista de IDs e devolve os objetos completos
const makeOptions = (ids) =>
    ids.map((id) => {
        if (id === "original") {
            return {
                id: "original",
                kind: "original",
                label: "Original do modelo",
                shortLabel: "Original",
            };
        }

        // Materiais existentes na biblioteca
        const mat = materialLibrary[id];

        return {
            id,
            kind: "material",
            label: mat.label,
            shortLabel: mat.shortLabel,
        };
    });

// Definição limpa das opções
const customMaterialOptions = {
    base: makeOptions(["original", "marble", "red", "gold", "glass", "tiles"]),
    feet: makeOptions(["original", "marble", "red", "gold", "glass", "tiles"]),
    agulha: makeOptions(["original", "marble", "red", "gold", "glass", "tiles"]),
    vinylBase: makeOptions(["original", "marble", "red", "gold", "glass", "tiles"]),
};

/* --------------------------------------------------
    Sistema de presets (conjuntos pré-definidos de materiais)
   --------------------------------------------------*/
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
            base: grey,
            feet: grey,
            agulha: grey,
            vinylBase: red
        },
        thumbnail: leatherPresetThumbnail
    },
    vintage: {
        name: 'Vintage',
        description: 'Madeira e Cobre',
        materials: {
            base: tiles,
            feet: grey,
            agulha: tiles,
            vinylBase: grey
        },
        thumbnail: tilesPresetThumbnail
    }
};

// Exportação dos materiais e coleções para utilização noutros ficheiros
export { marble, gold, red, grey, tiles, glass, materialLibrary, customMaterialOptions };
