import * as THREE from 'three';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

export function loadHDRI(path) {
    return new Promise((resolve, reject) => {
        new HDRLoader()
            .load(
                path,
                (texture) => {
                    texture.mapping = THREE.EquirectangularReflectionMapping;
                    resolve(texture);
                },
                undefined,
                reject
            );
    });
}

export async function loadDefaultHDRI() {
    return loadHDRI('/textures/hdr/studio_small_09_4k.hdr');
}
