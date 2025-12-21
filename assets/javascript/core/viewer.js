import { RecordPlayerViewer } from "../components/RecordPlayerViewer.js";
import { $ } from "./dom.js";
import { setViewer } from "./state.js";

// ============================
// Inicializa o visualizador de toca-discos
// ============================
export function initViewer() {
    const canvas = $("record-player-canvas");
    const container = $("viewer-container");

    if (canvas && container) {
        const viewer = new RecordPlayerViewer({
            canvas,
            container,
            initialPreset: "default"
        });

        setViewer(viewer);
        setupViewerAudioToggle(viewer);
    }
}

// ============================
// Configura botão de alternância de áudio do viewer
// ============================
function setupViewerAudioToggle(viewer) {
    const toggle = $("viewer-audio-toggle");
    if (!toggle || !viewer) return;

    const iconOn = toggle.querySelector('[data-sound-state="on"]');
    const iconOff = toggle.querySelector('[data-sound-state="off"]');
    const label = toggle.querySelector('[data-sound-label]');

    // ============================
    // Atualiza o estado visual do botão
    // ============================
    const updateVisualState = (muted) => {
        const isMuted = Boolean(muted);

        if (iconOn) iconOn.classList.toggle("hidden", isMuted);
        if (iconOff) iconOff.classList.toggle("hidden", !isMuted);

        toggle.setAttribute("aria-pressed", isMuted ? "true" : "false");

        const ariaLabel = isMuted ? "Som desligado (ativar)" : "Som ligado (silenciar)";
        toggle.setAttribute("aria-label", ariaLabel);
        toggle.setAttribute("title", ariaLabel);

        if (label) {
            label.textContent = isMuted ? "Ativar som" : "Silenciar som";
        }
    };

    // ============================
    // Evento de clique para alternar áudio
    // ============================
    toggle.addEventListener("click", (event) => {
        event.preventDefault();
        viewer.toggleAudioMuted();
    });

    // ============================
    // Define função de callback do viewer ou estado inicial
    // ============================
    if (typeof viewer.setAudioStateHandler === "function") {
        viewer.setAudioStateHandler(updateVisualState);
    } else {
        updateVisualState(false);
    }
}
