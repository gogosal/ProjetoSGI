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
        setupViewerHelpPanel();
        setupViewerLightingSlider(viewer);
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

// ============================
// Configura o painel de ajuda do viewer
// ============================
function setupViewerHelpPanel() {
    const toggle = $("viewer-help-toggle");
    const panel = $("viewer-help-panel");
    const closeButton = $("viewer-help-close");

    if (!toggle || !panel) return;

    const isPanelOpen = () => !panel.classList.contains("hidden");

    function openPanel() {
        if (isPanelOpen()) return;

        panel.classList.remove("hidden");
        panel.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true");

        if (typeof panel.focus === "function") {
            panel.focus({ preventScroll: true });
        }

        document.addEventListener("pointerdown", handleOutsidePointerDown);
        document.addEventListener("keydown", handleKeydown);
    }

    function closePanel({ focusToggle = false } = {}) {
        if (!isPanelOpen()) return;

        panel.classList.add("hidden");
        panel.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-expanded", "false");

        document.removeEventListener("pointerdown", handleOutsidePointerDown);
        document.removeEventListener("keydown", handleKeydown);

        if (focusToggle) {
            toggle.focus();
        }
    }

    function togglePanel() {
        if (isPanelOpen()) {
            closePanel();
        } else {
            openPanel();
        }
    }

    function handleOutsidePointerDown(event) {
        if (panel.contains(event.target) || toggle.contains(event.target)) return;
        closePanel();
    }

    function handleKeydown(event) {
        if (event.key === "Escape") {
            closePanel({ focusToggle: true });
        }
    }

    toggle.addEventListener("click", (event) => {
        event.preventDefault();
        togglePanel();
    });

    closeButton?.addEventListener("click", (event) => {
        event.preventDefault();
        closePanel({ focusToggle: true });
    });
}

// ============================
// Configura o controlo de iluminação
// ============================
function setupViewerLightingSlider(viewer) {
    const slider = $("viewer-light-slider");
    if (!slider || !viewer) return;

    const valueDisplay = document.querySelector("[data-lighting-value]");

    const updateUI = (value) => {
        if (valueDisplay) {
            valueDisplay.textContent = `${Math.round(value)}%`;
        }
    };

    const applyLighting = (value) => {
        const numericValue = Number(value);
        if (Number.isNaN(numericValue)) return;

        const normalized = Math.min(Math.max(numericValue / 100, 0), 2);
        viewer.setLightingIntensity(normalized);
        updateUI(numericValue);
    };

    slider.addEventListener("input", (event) => {
        applyLighting(event.target.value);
    });

    slider.addEventListener("change", (event) => {
        applyLighting(event.target.value);
    });

    const initialValue = Number(slider.value || slider.getAttribute("value") || 100);
    applyLighting(initialValue);
}
