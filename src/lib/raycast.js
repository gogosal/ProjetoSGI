import * as THREE from 'three';

export class RaycastManager {
    constructor(canvas, camera, scene) {
        this.canvas = canvas;
        this.camera = camera;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clickableObjects = [];

        // Arrow function para manter o contexto de 'this' correto
        this.onMouseDownBound = (event) => this.onMouseDown(event);
        this.canvas.addEventListener('mousedown', this.onMouseDownBound);
    }

    /**
     * Adiciona objetos que podem ser clicados.
     * Se for um grupo, percorre os filhos automaticamente.
     * @param {THREE.Object3D} object - Objeto 3D ou modelo
     */
    addClickableObject(object) {
        if (object.isMesh) {
            this.clickableObjects.push(object);
        } else {
            object.traverse((child) => {
                if (child.isMesh) this.clickableObjects.push(child);
            });
        }
    }

    /* Handler de mousedown */
    onMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();

        // Calcular posição do mouse normalizada (-1 a +1)
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Atualizar o raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Verificar intersecções
        const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0];
            this.debugObject(clickedObject);
            this.flashEffect(clickedObject.object);
        }
    }

    /* Mostra informações de debug do objeto */
    debugObject(intersection) {
        const obj = intersection.object;
        console.log('🎯 OBJETO CLICADO:', obj.name || 'Sem nome');
    }

    /* Efeito visual de flash no objeto clicado */
    flashEffect(object) {
        const material = object.material;
        if (!material || !material.emissive) return;

        const originalEmissive = material.emissive.clone();
        material.emissive.setRGB(0.5, 0.5, 0.5);

        setTimeout(() => {
            material.emissive.copy(originalEmissive);
        }, 200);
    }

    /* Remove objetos clicáveis */
    clearClickableObjects() {
        this.clickableObjects = [];
    }

    /* Limpa recursos */
    dispose() {
        this.canvas.removeEventListener('mousedown', this.onMouseDownBound);
        this.clearClickableObjects();
    }
}
