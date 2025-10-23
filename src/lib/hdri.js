import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import * as THREE from 'three';

/**
 * Carrega um arquivo HDR e retorna uma Promise
 * @param {string} path - Caminho para o arquivo HDR
 * @returns {Promise<THREE.Texture>}
 */
export function loadHDRI(path) {
    return new Promise((resolve, reject) => {
        const rgbeLoader = new RGBELoader();
        rgbeLoader.load(
            path,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                resolve(texture);
            },
            undefined,
            (error) => {
                reject(error);
            }
        );
    });
}

// Opção: carregar um HDRI padrão
export async function loadDefaultHDRI() {
    return loadHDRI('/textures/hdr/studio_small_09_4k.hdr');
}
