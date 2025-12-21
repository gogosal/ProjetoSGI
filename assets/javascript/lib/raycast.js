import * as THREE from 'three';

export class RaycastManager {
    // ============================
    // Construtor
    // ============================
    constructor(canvas, camera, scene) {
        this.canvas = canvas;
        this.camera = camera;
        this.scene = scene;

        // Raycaster para detectar objetos 3D
        this.raycaster = new THREE.Raycaster();
        // Vetor do mouse normalizado (-1 a 1)
        this.mouse = new THREE.Vector2();
        // Lista de objetos clicáveis
        this.clickableObjects = [];
        // Callback para clique
        this.onClick = null;

        // Bind do evento de clique do mouse
        this.onMouseDownBound = this.onMouseDown.bind(this);
        this.canvas.addEventListener('mousedown', this.onMouseDownBound);
    }

    // ============================
    // Adicionar objeto clicável
    // ============================
    addClickableObject(object) {
        if (!object) return;
        // Se for mesh, adiciona direto
        if (object.isMesh) this.clickableObjects.push(object);
        // Se for grupo, adiciona todas as meshes filhos
        else object.traverse(child => child.isMesh && this.clickableObjects.push(child));
    }

    // ============================
    // Evento de clique do mouse
    // ============================
    onMouseDown(event) {
        if (event.button !== 0) return; // Apenas botão esquerdo

        // Posição do mouse normalizada
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Atualiza raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.clickableObjects, true);

        if (!intersects.length) return;

        const clickedObject = intersects[0].object;

        // Debug do objeto clicado
        this.debugObject(clickedObject);

        // Chama callback se definido
        if (typeof this.onClick === 'function') {
            this.onClick(clickedObject);
        }
    }

    // ============================
    // Debug do objeto clicado
    // ============================
    debugObject(object) {
        console.log('🎯 Objeto clicado:', object.name || '(sem nome)');
    }

    // ============================
    // Limpar objetos clicáveis
    // ============================
    clearClickableObjects() {
        this.clickableObjects = [];
    }

    // ============================
    // Limpar eventos e objetos
    // ============================
    dispose() {
        this.canvas.removeEventListener('mousedown', this.onMouseDownBound);
        this.clearClickableObjects();
    }
}
