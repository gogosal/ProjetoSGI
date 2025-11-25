import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

function normalizeMaterialTransparency(obj) {
    if (!obj || !obj.material) return;

    const updateMaterial = (material) => {
        if (!material) return;
        if (material.opacity < 1 || material.alphaMode === "BLEND" || material.transmission > 0) {
            material.transparent = true;
            material.depthWrite = false;
        }
        material.needsUpdate = true;
    };

    if (Array.isArray(obj.material)) {
        obj.material.forEach(updateMaterial);
    } else {
        updateMaterial(obj.material);
    }
}

export function loadModel(path, options = {}) {
    const { scale = 1, position = [0, 0, 0], returnGltf = false } = options;

    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(scale, scale, scale);
                model.position.set(...position);

                model.traverse((child) => {
                    if (child.isMesh) {
                        normalizeMaterialTransparency(child);
                    }
                });

                // Se returnGltf for true, retorna o objeto completo com animações
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

const modelUrl = new URL("../../models/Final.glb", import.meta.url).href;

export async function loadRecordPlayerModel(withAnimations = false) {
    return loadModel(modelUrl, {
        scale: 12,
        position: [0, 0, 0],
        returnGltf: withAnimations
    });
}

export function getRecordPlayerParts(model) {
    return {
        base: model.getObjectByName('Base'),
        feet: model.getObjectByName('Feet'),
        agulha: model.getObjectByName('Cylinder004'),
        vinylBase: model.getObjectByName('VinylBase')
    };
}
