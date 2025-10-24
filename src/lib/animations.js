import * as THREE from 'three';

export class AnimationManager {
    constructor(model, gltf) {
        this.model = model;
        this.mixer = null;
        this.animations = {};
        this.currentActions = {};
        this.clock = new THREE.Clock();

        if (gltf?.animations?.length) {
            this.mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach(clip => (this.animations[clip.name] = clip));
            console.log('🎬 Animações carregadas:', Object.keys(this.animations));
        }

        // Estado para controlar alternância de animações
        this.objectStates = {};
    }

    playAnimation(name, { loop = false, timeScale = 1, clampWhenFinished = true } = {}) {
        if (!this.mixer) return console.warn('⚠️ Nenhum mixer de animação disponível');
        const clip = this.animations[name];
        if (!clip) {
            console.warn(`⚠️ Animação "${name}" não encontrada.`);
            console.log('Disponíveis:', Object.keys(this.animations));
            return;
        }

        this.currentActions[name]?.stop();

        const action = this.mixer.clipAction(clip);
        Object.assign(action, { timeScale, clampWhenFinished });
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
        action.reset().play();

        this.currentActions[name] = action;
        console.log(`▶️ Reproduzindo animação: ${name}`);
        return action;
    }

    stopAnimation(name) {
        const action = this.currentActions[name];
        if (action) {
            action.stop();
            delete this.currentActions[name];
        }
    }

    stopAllAnimations() {
        Object.keys(this.currentActions).forEach(name => this.stopAnimation(name));
    }

    update() {
        if (this.mixer) this.mixer.update(this.clock.getDelta());
    }

    isPlaying(name) {
        return this.currentActions[name]?.isRunning() ?? false;
    }

    getAvailableAnimations() {
        return Object.keys(this.animations);
    }

    dispose() {
        this.stopAllAnimations();
        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer.uncacheRoot(this.model);
        }
    }
}

/* Mapeamento de objetos e suas animações padrão */
export const animationMappings = {
    DustCover: {
        animations: ['Open', 'Close'], // lista de animações para alternar
        options: { loop: false, timeScale: 1, clampWhenFinished: true }
    },
};

/* Executa animação ou alterna se já estiver aberta */
export function handleObjectClick(object, animationManager) {
    if (!object || !animationManager) return;

    let current = object;
    let mapping = null;

    while (current && !mapping) {
        mapping = animationMappings[current.name];
        current = mapping ? current : current.parent;
    }

    if (mapping) {
        const state = animationManager.objectStates[object.name] || 0;
        const animationName = mapping.animations[state];
        animationManager.playAnimation(animationName, mapping.options);

        // Alterna o estado: 0 → 1, 1 → 0
        animationManager.objectStates[object.name] = (state + 1) % mapping.animations.length;
    }
}
