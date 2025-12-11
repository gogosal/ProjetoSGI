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

/* --------------------------------------
    Definição das texturas e materiais
   --------------------------------------*/

// Texturas para o material de mármore
const marbleBaseColorTexture = loadTexture(
    "materials/Comb1/Marble/Marble012_1K-JPG_Color.jpg",
    { colorSpace: THREE.SRGBColorSpace },
);
const marbleNormalMapTexture = loadTexture("materials/Comb1/Marble/Marble012_1K-JPG_NormalGL.jpg");
const marbleRoughnessMap = loadTexture("materials/Comb1/Marble/Marble012_1K-JPG_Roughness.jpg");

// Texturas para o material de ouro escovado
const goldBaseColorTexture = loadTexture(
    "materials/Comb1/Gold/Metal042A_1K-JPG_Color.jpg",
    { colorSpace: THREE.SRGBColorSpace },
);
const goldNormalMapTexture = loadTexture("materials/Comb1/Gold/Metal042A_1K-JPG_NormalGL.jpg");
const goldRoughnessMap = loadTexture("materials/Comb1/Gold/Metal042A_1K-JPG_Roughness.jpg");
const goldMetalnessMap = loadTexture("materials/Comb1/Gold/Metal042A_1K-JPG_Metalness.jpg");

// Material de Mármore (MeshStandardMaterial suporta mapas de PBR)
const marble = new THREE.MeshStandardMaterial({
    map: marbleBaseColorTexture,     // Textura base (cor)
    normalMap: marbleNormalMapTexture, // Mapa de normais (para relevo)
    roughnessMap: marbleRoughnessMap,  // Mapa de rugosidade
    roughness: 0.5,                  // Rugosidade base
    side: THREE.DoubleSide,          // Visível de ambos os lados
});

// Material de Ouro escovado
const gold = new THREE.MeshStandardMaterial({
    map: goldBaseColorTexture,
    normalMap: goldNormalMapTexture,
    roughnessMap: goldRoughnessMap,
    metalnessMap: goldMetalnessMap,
    roughness: 0.5,
    metalness: 0.7,                  // Alto nível de metalicidade
    side: THREE.DoubleSide,
});

// Materiais adicionais simples (sem texturas)
const chrome = new THREE.MeshStandardMaterial({
    color: 0xcccccc,                 // Cinzento claro
    roughness: 0.1,                  // Pouco rugoso (parece polido)
    metalness: 1.0,                  // Totalmente metálico
    side: THREE.DoubleSide,
});

const copper = new THREE.MeshStandardMaterial({
    color: 0xb87333,                 // Cor de cobre
    roughness: 0.3,
    metalness: 0.9,
    side: THREE.DoubleSide,
});

const wood = new THREE.MeshStandardMaterial({
    color: 0x8b4513,                 // Tom de madeira
    roughness: 0.8,
    metalness: 0.0,
    side: THREE.DoubleSide,
});

const plastic = new THREE.MeshStandardMaterial({
    color: 0x333333,                 // Preto acetinado
    roughness: 0.6,
    metalness: 0.1,
    side: THREE.DoubleSide,
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
    base: makeOptions(["original", "marble", "wood", "plastic"]),
    feet: makeOptions(["original", "gold", "copper", "chrome"]),
    agulha: makeOptions(["original", "gold", "chrome", "copper"]),
    vinylBase: makeOptions(["original", "marble", "wood", "gold", "plastic"]),
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

// Exportação dos materiais e coleções para utilização noutros ficheiros
export { marble, gold, chrome, copper, wood, plastic, materialLibrary, customMaterialOptions };
