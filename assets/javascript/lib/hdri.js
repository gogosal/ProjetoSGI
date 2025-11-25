import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

export function loadHDRI(path) {
    return new Promise((resolve, reject) => {
        new RGBELoader()
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

const assetUrl = (relativePath) =>
    new URL(`../../textures/${relativePath}`, import.meta.url).href;

export async function loadDefaultHDRI() {
    return loadHDRI(assetUrl('hdr/studio_small_09_2k.hdr'));
}
