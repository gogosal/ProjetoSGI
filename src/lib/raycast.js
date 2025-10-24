import * as THREE from 'three';

export class RaycastManager {
    constructor(canvas, camera, scene) {
        this.canvas = canvas;
        this.camera = camera;
        this.scene = scene;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.clickableObjects = [];
        this.onClick = null;

        this.onMouseDownBound = this.onMouseDown.bind(this);
        this.canvas.addEventListener('mousedown', this.onMouseDownBound);
    }

    addClickableObject(object) {
        if (!object) return;
        if (object.isMesh) this.clickableObjects.push(object);
        else object.traverse(child => child.isMesh && this.clickableObjects.push(child));
    }

    onMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);

        if (!intersects.length) return;

        const clickedObject = intersects[0].object;

        this.debugObject(clickedObject);

        if (typeof this.onClick === 'function') {
            this.onClick(clickedObject);
        }
    }

    debugObject(object) {
        console.log('🎯 Objeto clicado:', object.name || '(sem nome)');
    }

    clearClickableObjects() {
        this.clickableObjects = [];
    }

    dispose() {
        this.canvas.removeEventListener('mousedown', this.onMouseDownBound);
        this.clearClickableObjects();
    }
}
