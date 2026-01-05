// ============================
// Imports e dependências
// ============================
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { materialPresets } from "../lib/textures.js";
import { loadDefaultHDRI } from "../lib/hdri.js";
import { loadRecordPlayerModel, getRecordPlayerParts } from "../lib/models.js";
import { RaycastManager } from "../lib/raycast.js";
import { AnimationManager, handleObjectClick, startAutoplayAnimations } from "../lib/animations.js";

// ============================
// Classe principal do Viewer
// ============================
export class RecordPlayerViewer {
    constructor({ canvas, container, initialPreset = "default" } = {}) {

        // Validação e estados iniciais
        if (!canvas) throw new Error("RecordPlayerViewer requires a canvas element");

        this.canvas = canvas;
        this.container = container || canvas.parentElement;
        this.currentPreset = initialPreset;

        this.modelParts = {};
        this.originalMaterials = {};
        this.customOverrides = {};

        this.animationManager = null;
        this.raycastManager = null;

        this.isDisposed = false;
        this.audioMuted = false;
        this.audioStateHandler = null;

        this.mainLight = null;
        this.baseLightIntensity = 3;
        this.lightingIntensity = 1;
        this.baseExposure = 1.6;
        this.environmentTexture = null;
        this.baseEnvironmentIntensity = 1;
        this.backgroundDarkColor = new THREE.Color(0x050505);
        this.backgroundLightColor = new THREE.Color(0xffffff);

        // Setup inicial
        this.setupRenderer();
        this.setupScene();

        // Resize responsivo
        this.handleResize = this.handleResize.bind(this);
        window.addEventListener("resize", this.handleResize);
        this.handleResize();

        // Carregamento de assets
        this.loadAssets();
    }

    // ============================
    // Renderer, câmera e controles
    // ============================
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });

        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.6;
        this.baseExposure = this.renderer.toneMappingExposure;
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        this.camera.position.set(12, 8, 0);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.target.set(0, 0, 0);
    }

    // ============================
    // Cena e iluminação básica
    // ============================
    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = this.backgroundLightColor.clone();
        this.scene.environmentIntensity = 1;
        this.baseEnvironmentIntensity = this.scene.environmentIntensity;

        const pointLight = new THREE.PointLight(0xffffff, 3);
        pointLight.position.set(4, 4, 4);
        this.scene.add(pointLight);

        this.mainLight = pointLight;
        this.baseLightIntensity = pointLight.intensity;
        this.setLightingIntensity(this.lightingIntensity);
    }

    // ============================
    // Resize automático
    // ============================
    handleResize() {
        if (!this.container) return;

        const width = this.container.clientWidth;
        const height = this.container.clientHeight || width;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    // ============================
    // Carregamento de assets (HDRI + modelo)
    // ============================
    loadAssets() {
        Promise.all([
            loadDefaultHDRI().catch(() => null),
            loadRecordPlayerModel(true).catch(() => null),
        ]).then(([hdr, gltf]) => {
            if (this.isDisposed) return;

            if (hdr) {
                this.environmentTexture = hdr;
                this.scene.environment = hdr;
                if (typeof this.scene.environmentIntensity !== "number") {
                    this.scene.environmentIntensity = 1;
                }
                this.baseEnvironmentIntensity = this.scene.environmentIntensity;
                this.scene.background = this.backgroundLightColor.clone();
            }

            if (gltf) {
                const model = gltf.scene;
                this.scene.add(model);

                this.animationManager = new AnimationManager(model, gltf);
                this.animationManager?.setAudioMuted?.(this.audioMuted);

                // Autoplay (loop) de animações que devem iniciar logo
                startAutoplayAnimations(this.animationManager, model);

                this.modelParts = getRecordPlayerParts(model);

                // Guarda materiais originais
                Object.keys(this.modelParts).forEach((key) => {
                    this.originalMaterials[key] = this.modelParts[key].material.clone();
                });

                // Raycast e interações
                this.raycastManager = new RaycastManager(this.canvas, this.camera, this.scene);
                this.raycastManager.addClickableObject(model);
                this.raycastManager.onClick = (obj) =>
                    handleObjectClick(obj, this.animationManager);

                this.applyMaterialPreset(this.currentPreset);
            }

            this.startRenderLoop();
            this.setLightingIntensity(this.lightingIntensity);
        });
    }

    // ============================
    // Loop de renderização
    // ============================
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

    // ============================
    // Presets e materiais
    // ============================
    setPreset(presetName) {
        this.currentPreset = presetName;
        this.customOverrides = {};
        this.applyMaterialPreset(presetName);
    }

    applyMaterialPreset(presetName) {
        const preset = materialPresets[presetName];
        if (!preset) return;

        const source =
            presetName === "default" ? this.originalMaterials : preset.materials;

        this.applyMaterials(this.modelParts, source);
        this.applyCustomOverrides();
    }

    applyMaterials(parts, materials) {
        Object.keys(parts).forEach((key) => {
            if (materials[key]) parts[key].material = materials[key];
        });
    }

    // ============================
    // Overrides personalizados
    // ============================
    setCustomMaterial(partKey, override) {
        this.customOverrides[partKey] = override;
        this.applyCustomOverride(partKey);
    }

    clearCustomMaterial(partKey) {
        delete this.customOverrides[partKey];
        this.applyMaterialPreset(this.currentPreset);
    }

    clearAllCustomMaterials() {
        this.customOverrides = {};
        this.applyMaterialPreset(this.currentPreset);
    }

    applyCustomOverrides() {
        Object.keys(this.customOverrides).forEach((key) =>
            this.applyCustomOverride(key)
        );
    }

    applyCustomOverride(partKey) {
        const override = this.customOverrides[partKey];
        const part = this.modelParts[partKey];
        if (!override || !part) return;

        if (override.mode === "original") {
            part.material = this.originalMaterials[partKey];
        }

        if (override.mode === "material") {
            part.material = override.material;
        }
    }

    // ============================
    // Lifecycle / limpeza
    // ============================
    dispose() {
        this.isDisposed = true;
        window.removeEventListener("resize", this.handleResize);
        this.raycastManager?.dispose?.();
        this.animationManager?.dispose?.();
        this.controls?.dispose?.();
        this.renderer?.dispose?.();
    }

    // ============================
    // Controlo de áudio
    // ============================
    setAudioMuted(muted) {
        this.audioMuted = Boolean(muted);
        this.animationManager?.setAudioMuted?.(this.audioMuted);
        this.notifyAudioStateChange();
        return this.audioMuted;
    }

    toggleAudioMuted() {
        return this.setAudioMuted(!this.audioMuted);
    }

    isAudioMuted() {
        return this.audioMuted;
    }

    setAudioStateHandler(handler) {
        this.audioStateHandler = handler;
        this.notifyAudioStateChange();
    }

    notifyAudioStateChange() {
        this.audioStateHandler?.(this.audioMuted);
    }

    // ============================
    // Controlo de iluminação
    // ============================
    setLightingIntensity(multiplier = 1) {
        if (typeof multiplier !== "number" || Number.isNaN(multiplier)) {
            return this.lightingIntensity;
        }

        const clamped = Math.min(Math.max(multiplier, 0), 2);
        this.lightingIntensity = clamped;

        if (this.mainLight) {
            this.mainLight.intensity = this.baseLightIntensity * clamped;
            this.mainLight.visible = clamped > 0.001;
        }

        if (this.scene) {
            if (clamped <= 0.001 && this.environmentTexture) {
                this.scene.environment = null;
            } else if (this.environmentTexture) {
                this.scene.environment = this.environmentTexture;
            }

            if (typeof this.scene.environmentIntensity === "number") {
                this.scene.environmentIntensity = this.baseEnvironmentIntensity * clamped;
            }

            const clampedBgMix = Math.min(clamped, 1);
            const backgroundColor = this.backgroundDarkColor.clone().lerp(this.backgroundLightColor, clampedBgMix);
            this.scene.background = backgroundColor;
        }

        if (this.renderer) {
            const exposureBoost = 0.05 + clamped * 0.95;
            this.renderer.toneMappingExposure = Math.max(this.baseExposure * exposureBoost, 0.02);
        }

        return this.lightingIntensity;
    }

    getLightingIntensity() {
        return this.lightingIntensity;
    }
}
