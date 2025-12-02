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

    playAnimation(
        name,
        {
            loop = false,
            timeScale = 1,
            clampWhenFinished = true,
            startAtEnd = false,
            onComplete = null,
        } = {}
    ) {
        if (!this.mixer) return console.warn('⚠️ Nenhum mixer de animação disponível');
        const clip = this.animations[name];
        if (!clip) {
            console.warn(`⚠️ Animação "${name}" não encontrada.`);
            console.log('Disponíveis:', Object.keys(this.animations));
            return;
        }

        this.currentActions[name]?.stop();

        const action = this.mixer.clipAction(clip);
        action.clampWhenFinished = clampWhenFinished;
        action.setLoop(loop ? THREE.LoopRepeat : THREE.LoopOnce);
        action.reset();

        const shouldStartAtEnd = startAtEnd && clip.duration;
        if (shouldStartAtEnd) {
            const epsilon = 1e-4;
            action.time = Math.max(clip.duration - epsilon, 0);
        }

        action.timeScale = timeScale;
        action.play();

        if (typeof onComplete === 'function') {
            const handleFinished = event => {
                if (event.action === action) {
                    this.mixer.removeEventListener('finished', handleFinished);
                    onComplete(event);
                }
            };
            this.mixer.addEventListener('finished', handleFinished);
        }

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

    pauseAnimation(name) {
        const action = this.currentActions[name];
        if (action) {
            action.paused = true;
        }
        return action;
    }

    resumeAnimation(name, { timeScale } = {}) {
        const action = this.currentActions[name];
        if (action) {
            if (typeof timeScale === 'number') {
                action.timeScale = timeScale;
            }
            action.paused = false;
            action.play();
        }
        return action;
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
        animations: ['Open.001'],
        options: { loop: false, timeScale: 1, clampWhenFinished: true },
        toggleReversed: true
    },
    Gaveta: {
        animations: ['Open'],
        options: { loop: false, timeScale: 1, clampWhenFinished: true },
        toggleReversed: true
    },
    Pickup: {
        animations: ['Play'],
        options: { loop: false, timeScale: 1, clampWhenFinished: true },
        toggleReversed: true,
        chainOnComplete: {
            animationName: 'PlayMusic',
            options: { loop: true, timeScale: 1, clampWhenFinished: true },
            pauseWhenReversed: true
        }
    },
};

function triggerChainedAnimation(animationManager, chainConfig) {
    if (!chainConfig?.animationName) return;
    const resumeOptions = chainConfig.options || {};
    const wasResumed = animationManager.resumeAnimation(chainConfig.animationName, resumeOptions);
    if (wasResumed) {
        return;
    }

    const chainedOptions = {
        loop: false,
        clampWhenFinished: true,
        ...resumeOptions
    };
    animationManager.playAnimation(chainConfig.animationName, chainedOptions);
}

/* Executa animação ou alterna se já estiver aberta */
export function handleObjectClick(object, animationManager) {
    if (!object || !animationManager) return;

    let current = object;
    let mapping = null;
    let stateKey = object.name;

    while (current) {
        const candidate = animationMappings[current.name];
        if (candidate) {
            mapping = candidate;
            stateKey = current.name;
            break;
        }
        current = current.parent;
    }

    if (mapping) {
        const animationNames = Array.isArray(mapping.animations)
            ? mapping.animations
            : mapping.animation
                ? [mapping.animation]
                : [];

        if (!animationNames.length) {
            console.warn(`⚠️ Nenhuma animação configurada para "${stateKey}".`);
            return;
        }

        const rawState = animationManager.objectStates[stateKey];
        const state = typeof rawState === 'number'
            ? { index: rawState, reversed: false }
            : {
                index: rawState?.index ?? 0,
                reversed: rawState?.reversed ?? false
            };

        const animationName = animationNames[state.index] ?? animationNames[0];
        const baseOptions = mapping.options || {};
        const baseTimeScale = baseOptions.timeScale ?? 1;
        const isReversed = mapping.toggleReversed ? state.reversed : false;

        const playOptions = {
            ...baseOptions,
            timeScale: isReversed
                ? -Math.abs(baseTimeScale || 1)
                : Math.abs(baseTimeScale || 1),
            startAtEnd: isReversed
        };

        const chainConfig = mapping.chainOnComplete;
        const shouldChainForward = chainConfig && !isReversed;
        const shouldPauseOnReverse = chainConfig?.pauseWhenReversed && isReversed;

        if (shouldChainForward) {
            playOptions.onComplete = () =>
                triggerChainedAnimation(animationManager, chainConfig);
        } else if (shouldPauseOnReverse) {
            playOptions.onComplete = () =>
                animationManager.pauseAnimation(chainConfig.animationName);
        }

        // Executa com direção baseada no estado atual
        animationManager.playAnimation(animationName, playOptions);

        const nextState = {
            index: animationNames.length > 1 ? (state.index + 1) % animationNames.length : 0,
            reversed: mapping.toggleReversed ? !isReversed : false
        };

        animationManager.objectStates[stateKey] = nextState;
    }
}
