import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { materialPresets } from "../lib/textures.js";
import { loadDefaultHDRI } from "../lib/hdri.js";
import { loadRecordPlayerModel, getRecordPlayerParts } from "../lib/models.js";
import { RaycastManager } from "../lib/raycast.js";
import { AnimationManager, handleObjectClick } from "../lib/animations.js";

export class RecordPlayerViewer {
    constructor({ canvas, container, initialPreset = "default" } = {}) {
        if (!canvas) {
            throw new Error("RecordPlayerViewer requires a canvas element");
        }

        this.canvas = canvas;
        this.container = container || canvas.parentElement;
        this.currentPreset = initialPreset;
        this.modelParts = {};
        this.originalMaterials = {};
        this.animationManager = null;
        this.raycastManager = null;
        this.isDisposed = false;

        this.setupRenderer();
        this.setupScene();
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener("resize", this.handleResize);
        this.handleResize();

        this.loadAssets();
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.6;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        this.camera.position.set(12, 8, 0);
        this.camera.lookAt(0, 0, 0);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.08;
        this.controls.target.set(0, 0, 0);
    }

    setupScene() {
        this.scene = new THREE.Scene();
        const pointLight = new THREE.PointLight(0xffffff, 3);
        pointLight.position.set(4, 4, 4);
        this.scene.add(pointLight);
    }

    handleResize() {
        if (!this.container || !this.renderer || !this.camera) return;
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || width;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    loadAssets() {
        Promise.all([
            loadDefaultHDRI().catch((error) => {
                console.warn("HDRI load failed", error);
                return null;
            }),
            loadRecordPlayerModel(true).catch((error) => {
                console.warn("Model load failed", error);
                return null;
            }),
        ]).then(([hdr, gltf]) => {
            if (this.isDisposed) return;

            if (hdr) {
                this.scene.environment = hdr;
                this.scene.background = hdr;
            }

            if (gltf) {
                const model = gltf.scene;
                this.scene.add(model);
                this.animationManager = new AnimationManager(model, gltf);

                const parts = getRecordPlayerParts(model);
                this.modelParts = parts;

                if (parts.base) this.originalMaterials.base = parts.base.material.clone();
                if (parts.feet) this.originalMaterials.feet = parts.feet.material.clone();
                if (parts.agulha) this.originalMaterials.agulha = parts.agulha.material.clone();
                if (parts.vinylBase) this.originalMaterials.vinylBase = parts.vinylBase.material.clone();

                this.raycastManager = new RaycastManager(this.canvas, this.camera, this.scene);
                this.raycastManager.addClickableObject(model);
                this.raycastManager.onClick = (object) => {
                    if (this.animationManager) {
                        handleObjectClick(object, this.animationManager);
                    }
                };

                this.applyMaterialPreset(this.currentPreset);
            }

            this.startRenderLoop();
        });
    }

    startRenderLoop() {
        const render = () => {
            if (this.isDisposed) return;
            requestAnimationFrame(render);
            this.controls.update();
            this.animationManager?.update();
            this.renderer.render(this.scene, this.camera);
        };

        render();
    }

    setPreset(presetName) {
        this.currentPreset = presetName;
        this.applyMaterialPreset(presetName);
    }

    applyMaterialPreset(presetName) {
        const preset = materialPresets[presetName];
        const { base, feet, agulha, vinylBase } = this.modelParts;
        if (!preset || !base) return;

        const sourceMaterials =
            presetName === "default" || !preset.materials
                ? this.originalMaterials
                : preset.materials;

        this.applyMaterials({ base, feet, agulha, vinylBase }, sourceMaterials);
    }

    applyMaterials(parts, materials) {
        if (!parts || !materials) return;
        Object.keys(parts).forEach((key) => {
            if (parts[key] && materials[key]) {
                parts[key].material = materials[key];
            }
        });
    }

    dispose() {
        this.isDisposed = true;
        window.removeEventListener("resize", this.handleResize);
        this.raycastManager?.dispose?.();
        this.animationManager?.dispose?.();
        this.controls?.dispose?.();
        this.renderer?.dispose?.();
    }
}
