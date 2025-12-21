import * as THREE from 'three';

// ============================
// URL do áudio principal
// ============================
const PLAY_MUSIC_AUDIO_URL = new URL('../../sounds/music.ogg', import.meta.url).href;

// ============================
// Classe AnimationManager
// ============================
export class AnimationManager {
    // ============================
    // Construtor
    // ============================
    constructor(model, gltf) {
        this.model = model;
        this.mixer = null;
        this.animations = {};
        this.currentActions = {};
        this.clock = new THREE.Clock();
        this.animationAudio = {};
        this.audioMuted = false;

        // ============================
        // Configuração do mixer e carregamento de animações
        // ============================
        if (gltf?.animations?.length) {
            this.mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach(clip => (this.animations[clip.name] = clip));
            console.log('🎬 Animações carregadas:', Object.keys(this.animations));
        }

        // Estado para alternância de animações
        this.objectStates = {};

        // Inicializa áudios das animações
        this.setupAnimationAudio();
    }

    // ============================
    // Configuração do áudio das animações
    // ============================
    setupAnimationAudio() {
        if (typeof Audio === 'undefined') return;
        const track = new Audio(PLAY_MUSIC_AUDIO_URL);
        track.loop = true;
        track.preload = 'auto';
        track.muted = this.audioMuted;
        this.animationAudio.PlayMusic = track;
    }

    // ============================
    // Reproduz animação
    // ============================
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

        if (startAtEnd && clip.duration) {
            const epsilon = 1e-4;
            action.time = Math.max(clip.duration - epsilon, 0);
        }

        action.timeScale = timeScale;
        action.play();
        this.startAudioForAnimation(name);

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

    // ============================
    // Para animação
    // ============================
    stopAnimation(name) {
        const action = this.currentActions[name];
        if (action) {
            action.stop();
            delete this.currentActions[name];
            this.pauseAudioForAnimation(name, { reset: true });
        }
    }

    // ============================
    // Pausa animação
    // ============================
    pauseAnimation(name) {
        const action = this.currentActions[name];
        if (action) {
            action.paused = true;
            this.pauseAudioForAnimation(name);
        }
        return action;
    }

    // ============================
    // Retoma animação
    // ============================
    resumeAnimation(name, { timeScale } = {}) {
        const action = this.currentActions[name];
        if (action) {
            if (typeof timeScale === 'number') {
                action.timeScale = timeScale;
            }
            action.paused = false;
            action.play();
            this.startAudioForAnimation(name);
        }
        return action;
    }

    // ============================
    // Para todas as animações
    // ============================
    stopAllAnimations() {
        Object.keys(this.currentActions).forEach(name => this.stopAnimation(name));
        Object.keys(this.animationAudio).forEach(name =>
            this.pauseAudioForAnimation(name, { reset: true })
        );
    }

    // ============================
    // Atualiza mixer (chamado em loop)
    // ============================
    update() {
        if (this.mixer) this.mixer.update(this.clock.getDelta());
    }

    // ============================
    // Verifica se animação está rodando
    // ============================
    isPlaying(name) {
        return this.currentActions[name]?.isRunning() ?? false;
    }

    // ============================
    // Lista animações disponíveis
    // ============================
    getAvailableAnimations() {
        return Object.keys(this.animations);
    }

    // ============================
    // Limpa animações e áudios
    // ============================
    dispose() {
        this.stopAllAnimations();
        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer.uncacheRoot(this.model);
        }
        Object.values(this.animationAudio).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
    }

    // ============================
    // Inicia áudio de uma animação
    // ============================
    startAudioForAnimation(name) {
        const audio = this.animationAudio?.[name];
        if (!audio || !audio.paused) return;
        audio.muted = this.audioMuted;
        const playPromise = audio.play();
        playPromise?.catch(error =>
            console.warn(`⚠️ Não foi possível reproduzir áudio para ${name}`, error)
        );
    }

    // ============================
    // Pausa áudio de uma animação
    // ============================
    pauseAudioForAnimation(name, { reset = false } = {}) {
        const audio = this.animationAudio?.[name];
        if (!audio) return;
        audio.pause();
        if (reset) audio.currentTime = 0;
    }

    // ============================
    // Ativa/desativa mute
    // ============================
    setAudioMuted(muted) {
        this.audioMuted = Boolean(muted);
        Object.values(this.animationAudio).forEach(audio => {
            if (!audio) return;
            audio.muted = this.audioMuted;
        });
        return this.audioMuted;
    }

    toggleAudioMuted() {
        return this.setAudioMuted(!this.audioMuted);
    }

    isAudioMuted() {
        return this.audioMuted;
    }
}

// ============================
// Mapeamento de animações por objeto
// ============================
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

// ============================
// Dispara animação encadeada
// ============================
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

// ============================
// Manipula clique em objeto
// ============================
export function handleObjectClick(object, animationManager) {
    if (!object || !animationManager) return;

    let current = object;
    let mapping = null;
    let stateKey = object.name;

    // ============================
    // Procura configuração de animação nos ancestrais
    // ============================
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

        // ============================
        // Executa animação e atualiza estado
        // ============================
        animationManager.playAnimation(animationName, playOptions);

        const nextState = {
            index: animationNames.length > 1 ? (state.index + 1) % animationNames.length : 0,
            reversed: mapping.toggleReversed ? !isReversed : false
        };

        animationManager.objectStates[stateKey] = nextState;
    }
}
