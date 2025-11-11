"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { materialPresets } from '@/lib/textures';
import { loadDefaultHDRI } from '@/lib/hdri';
import { loadRecordPlayerModel, getRecordPlayerParts } from '@/lib/models';
import { RaycastManager } from '@/lib/raycast';
import { AnimationManager, handleObjectClick } from '@/lib/animations';

export default function RecordPlayerViewer({ preset = 'default' }) {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const modelPartsRef = useRef({});
    const originalMaterialsRef = useRef({});
    const raycastManagerRef = useRef(null);
    const animationManagerRef = useRef(null);
    const latestPresetRef = useRef(preset);

    const applyMaterials = (objects, materials) => {
        if (!objects || !materials) return;
        for (const key of Object.keys(objects)) {
            if (objects[key] && materials[key]) {
                objects[key].material = materials[key];
            }
        }
    };

    const applyMaterialPreset = useCallback((presetName) => {
        const preset = materialPresets[presetName];
        if (!preset) return;

        const { base, feet, agulha, vinylBase } = modelPartsRef.current;
        if (presetName === 'default') {
            applyMaterials({ base, feet, agulha, vinylBase }, originalMaterialsRef.current);
        } else {
            applyMaterials({ base, feet, agulha, vinylBase }, preset.materials);
        }
    }, []);

    useEffect(() => {
        latestPresetRef.current = preset;
        applyMaterialPreset(preset);
    }, [preset, applyMaterialPreset]);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;

        // 🔧 Renderer
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.6;
        renderer.setPixelRatio(window.devicePixelRatio);

        // 🎥 Camera
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
        camera.position.set(12, 8, 0);
        camera.lookAt(0, 0, 0);

        // 🎮 Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.target.set(0, 0, 0);

        // 🌌 Scene
        const scene = new THREE.Scene();
        /* const grid = new THREE.GridHelper(10, 10);
        scene.add(grid); */

        const pointLight = new THREE.PointLight(0xffffff, 3);
        pointLight.position.set(4, 4, 4);
        scene.add(pointLight);

        // 🧭 Resize
        const updateSize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', updateSize);
        updateSize();

        // 🧠 Raycast
        const raycastManager = new RaycastManager(canvas, camera, scene);
        raycastManagerRef.current = raycastManager;
        raycastManager.onClick = (object) => {
            if (animationManagerRef.current) {
                handleObjectClick(object, animationManagerRef.current);
            }
        };

        // 🔄 Função de renderização contínua
        const render = () => {
            requestAnimationFrame(render);
            controls.update();
            if (animationManagerRef.current) animationManagerRef.current.update();
            renderer.render(scene, camera);
        };

        // ⚡ Otimizar com Promise.all: carrega HDRI e modelo em paralelo
        Promise.all([
            loadDefaultHDRI().catch((e) => {
                console.warn("HDRI falhou:", e);
                return null;
            }),
            loadRecordPlayerModel(true).catch((e) => {
                console.warn("Modelo falhou:", e);
                return null;
            })
        ]).then(([hdr, gltf]) => {
            if (hdr) {
                scene.environment = hdr;
                scene.background = hdr;
            }

            if (gltf) {
                const model = gltf.scene;
                scene.add(model);

                const { base, feet, agulha, vinylBase } = getRecordPlayerParts(model);
                if (base) originalMaterialsRef.current.base = base.material.clone();
                if (feet) originalMaterialsRef.current.feet = feet.material.clone();
                if (agulha) originalMaterialsRef.current.agulha = agulha.material.clone();
                if (vinylBase) originalMaterialsRef.current.vinylBase = vinylBase.material.clone();
                modelPartsRef.current = { base, feet, agulha, vinylBase };

                const animationManager = new AnimationManager(model, gltf);
                animationManagerRef.current = animationManager;

                raycastManager.addClickableObject(model);

                applyMaterialPreset(latestPresetRef.current);
            }

            render(); // inicia render apenas depois de tudo pronto
        });

        // 🧹 Cleanup
        return () => {
            window.removeEventListener('resize', updateSize);
            raycastManager.dispose?.();
            animationManagerRef.current?.dispose?.();
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="relative h-full w-full">
            <canvas ref={canvasRef} className="size-full" />
        </div>
    );
}
