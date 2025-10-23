"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { materialPresets } from '@/lib/textures';
import { loadDefaultHDRI } from '@/lib/hdri';
import { loadRecordPlayerModel, getRecordPlayerParts } from '@/lib/models';
import { RaycastManager } from '@/lib/raycast';

export default function RecordPlayerViewer() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const modelPartsRef = useRef({});
    const originalMaterialsRef = useRef({}); // Guardar materiais originais
    const raycastManagerRef = useRef(null);
    const [currentPreset, setCurrentPreset] = useState('default');
    const [showPresetMenu, setShowPresetMenu] = useState(false);

    // Função para aplicar preset de material - usando useCallback para evitar re-renders
    const applyMaterialPreset = useCallback((presetName) => {
        const preset = materialPresets[presetName];
        if (!preset) return;

        const { base, feet, agulha, vinylBase } = modelPartsRef.current;

        // Se for 'default', usar os materiais originais salvos
        if (presetName === 'default') {
            const originalMaterials = originalMaterialsRef.current;
            if (base && originalMaterials.base) base.material = originalMaterials.base;
            if (feet && originalMaterials.feet) feet.material = originalMaterials.feet;
            if (agulha && originalMaterials.agulha) agulha.material = originalMaterials.agulha;
            if (vinylBase && originalMaterials.vinylBase) vinylBase.material = originalMaterials.vinylBase;
        } else {
            // Caso contrário, usar os materiais do preset
            const materials = preset.materials;
            if (!materials) return;

            if (base && materials.base) base.material = materials.base;
            if (feet && materials.feet) feet.material = materials.feet;
            if (agulha && materials.agulha) agulha.material = materials.agulha;
            if (vinylBase && materials.vinylBase) vinylBase.material = materials.vinylBase;
        }

        setCurrentPreset(presetName);
        setShowPresetMenu(false);
    }, []);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;

        // Configuração da cena
        const scene = new THREE.Scene();
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

        const updateSize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        };

        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.8;

        camera.position.set(6, 4, 7);
        camera.lookAt(0, 0, 0);

        updateSize();

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        // Grid helper
        const grid = new THREE.GridHelper(10, 10);
        scene.add(grid);

        // Luz
        const pointLight = new THREE.PointLight(0xffffff, 5);
        pointLight.position.set(5, 3, 5);
        scene.add(pointLight);

        // Inicializar Raycast Manager
        const raycastManager = new RaycastManager(canvas, camera, scene);
        raycastManagerRef.current = raycastManager;

        // Carregamento HDRI
        loadDefaultHDRI().then((hdr) => {
            scene.environment = hdr;
            scene.background = hdr;
        }).catch((error) => {
            console.error('Erro ao carregar HDRI:', error);
        });

        // Carregamento do modelo
        loadRecordPlayerModel().then((model) => {
            scene.add(model);

            const { base, feet, agulha, vinylBase } = getRecordPlayerParts(model);

            // Guardar materiais originais do modelo
            if (base) originalMaterialsRef.current.base = base.material.clone();
            if (feet) originalMaterialsRef.current.feet = feet.material.clone();
            if (agulha) originalMaterialsRef.current.agulha = agulha.material.clone();
            if (vinylBase) originalMaterialsRef.current.vinylBase = vinylBase.material.clone();

            // Guardar referências das partes do modelo
            modelPartsRef.current = { base, feet, agulha, vinylBase };

            // Adicionar modelo ao raycast manager
            raycastManager.addClickableObject(model);
        }).catch((error) => {
            console.error('Erro ao carregar modelo:', error);
        });

        // Animação
        function render() {
            requestAnimationFrame(render);
            controls.update();
            renderer.render(scene, camera);
        }
        render();

        // Resize handler
        const handleResize = () => {
            updateSize();
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (raycastManagerRef.current) {
                raycastManagerRef.current.dispose();
            }
            renderer.dispose();
            controls.dispose();
        };
    }, []); // Removida a dependência - só executa uma vez

    return (
        <div ref={containerRef} className="w-full h-full">
            <canvas ref={canvasRef} />

            {/* Botão para abrir menu de materiais */}
            <button
                onClick={() => setShowPresetMenu(!showPresetMenu)}
                className="fixed top-20 left-5 z-10 bg-black/80 backdrop-blur-sm border border-white/30 text-white text-sm rounded-lg px-4 py-2 hover:bg-black/60 transition-all duration-300 flex items-center gap-2"
            >
                <span className="text-xl">{materialPresets[currentPreset]?.icon}</span>
                <span>{materialPresets[currentPreset]?.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 01-1.06 0l-7.5-7.5a.75.75 0 011.06-1.06L12 14.69l6.97-6.97a.75.75 0 111.06 1.06l-7.5 7.5z" clipRule="evenodd" />
                </svg>
            </button>

            {/* Menu dropdown de presets */}
            {showPresetMenu && (
                <div className="fixed top-32 left-5 z-20 bg-black/90 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden shadow-xl min-w-[240px]">
                    {Object.entries(materialPresets).map(([key, preset]) => (
                        <button
                            key={key}
                            onClick={() => applyMaterialPreset(key)}
                            className={`w-full text-left px-4 py-3 text-white hover:bg-white/10 transition-colors flex items-center gap-3 border-b border-white/10 last:border-b-0 ${currentPreset === key ? 'bg-white/20' : ''
                                }`}
                        >
                            <span className="text-2xl">{preset.icon}</span>
                            <div className="flex-1">
                                <div className="font-medium">{preset.name}</div>
                                <div className="text-xs text-gray-400">{preset.description}</div>
                            </div>
                            {currentPreset === key && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-green-400">
                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay para fechar menu ao clicar fora */}
            {showPresetMenu && (
                <div
                    className="fixed inset-0 z-[15]"
                    onClick={() => setShowPresetMenu(false)}
                />
            )}
        </div>
    );
}
