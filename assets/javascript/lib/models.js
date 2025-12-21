import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ============================
// Função para normalizar transparência dos materiais
// ============================
function normalizeMaterialTransparency(obj) {
    if (!obj || !obj.material) return;

    // ============================
    // Atualiza propriedades do material
    // ============================
    const updateMaterial = (material) => {
        if (!material) return;
        if (material.opacity < 1 || material.alphaMode === "BLEND" || material.transmission > 0) {
            material.transparent = true;
            material.depthWrite = false;
        }
        material.needsUpdate = true;
    };

    // ============================
    // Aplica atualização para todos os materiais
    // ============================
    if (Array.isArray(obj.material)) {
        obj.material.forEach(updateMaterial);
    } else {
        updateMaterial(obj.material);
    }
}

// ============================
// Função para carregar modelos GLTF/GLB
// ============================
export function loadModel(path, options = {}) {
    const { scale = 1, position = [0, 0, 0], returnGltf = false } = options;

    return new Promise((resolve, reject) => {
        // ============================
        // Inicializa o loader GLTF
        // ============================
        const loader = new GLTFLoader();

        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;

                // ============================
                // Aplica escala e posição
                // ============================
                model.scale.set(scale, scale, scale);
                model.position.set(...position);

                // ============================
                // Normaliza transparência de todos os meshes
                // ============================
                model.traverse((child) => {
                    if (child.isMesh) {
                        normalizeMaterialTransparency(child);
                    }
                });

                // ============================
                // Retorna GLTF completo ou apenas o modelo
                // ============================
                if (returnGltf) {
                    resolve(gltf);
                } else {
                    resolve(model);
                }
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
}

// ============================
// Caminho do modelo de toca-discos
// ============================
const modelUrl = new URL("../../models/Final.glb", import.meta.url).href;

// ============================
// Função para carregar o modelo de toca-discos
// ============================
export async function loadRecordPlayerModel(withAnimations = false) {
    return loadModel(modelUrl, {
        scale: 12,
        position: [0, 0, 0],
        returnGltf: withAnimations
    });
}

// ============================
// Função para acessar partes específicas do modelo
// ============================
export function getRecordPlayerParts(model) {
    return {
        base: model.getObjectByName('Base'),
        feet: model.getObjectByName('Feet'),
        agulha: model.getObjectByName('Cylinder004'),
        vinylBase: model.getObjectByName('VinylBase')
    };
}
