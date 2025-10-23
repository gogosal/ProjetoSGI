import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Carrega um modelo GLTF/GLB e retorna uma Promise
 * @param {string} path - Caminho para o arquivo .glb ou .gltf
 * @param {Object} options - Opções de carregamento
 * @param {number} options.scale - Escala do modelo (padrão: 1)
 * @param {Array} options.position - Posição [x, y, z] (padrão: [0, 0, 0])
 * @returns {Promise<THREE.Group>}
 */
export function loadModel(path, options = {}) {
    const { scale = 1, position = [0, 0, 0] } = options;

    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            path,
            (gltf) => {
                const model = gltf.scene;
                model.scale.set(scale, scale, scale);
                model.position.set(...position);
                resolve(model);
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
}

/**
 * Carrega o modelo do gira-discos
 * @returns {Promise<THREE.Group>}
 */
export async function loadRecordPlayerModel() {
    return loadModel('/models/RecordPlayer.glb', {
        scale: 12,
        position: [0, 0, 0]
    });
}

/**
 * Obtém partes específicas do modelo do gira-discos
 * @param {THREE.Group} model - O modelo carregado
 * @returns {Object} Objeto com as partes do modelo
 */
export function getRecordPlayerParts(model) {
    return {
        base: model.getObjectByName('Base'),
        feet: model.getObjectByName('Feet'),
        agulha: model.getObjectByName('Cylinder004'),
        vinylBase: model.getObjectByName('VinylBase')
    };
}
