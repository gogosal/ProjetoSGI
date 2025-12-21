import { PRESET_ORDER } from "../config/produto.config.js";
import { materialPresets } from "../lib/textures.js";
import { $, THUMB_FALLBACK } from "../core/dom.js";
import { viewerInstance } from "../core/state.js";
import { resetCustomMaterialSelections } from "./customMaterials.js";

// ============================
// Retorna classes CSS para o botão do preset
// ============================
function presetClass(active) {
    return `group relative flex h-16 w-16 items-center justify-center rounded-full border transition sm:h-20 sm:w-20 ${active
            ? "border-[#2b0f84] bg-[#2b0f84]/10 shadow-sm"
            : "border-slate-200 bg-white hover:border-[#2b0f84]/60 hover:bg-[#2b0f84]/5"
        }`;
}

// ============================
// Renderiza todos os botões de preset
// ============================
export function renderPresetButtons() {
    const grid = $("preset-grid");
    if (!grid) return;

    grid.innerHTML = "";

    PRESET_ORDER.forEach((key, index) => {
        const preset = materialPresets[key];
        if (!preset) return;

        // ============================
        // Cria botão do preset
        // ============================
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.preset = key;
        button.className = presetClass(index === 0);

        // ============================
        // Cria thumbnail do preset
        // ============================
        const thumb = document.createElement("img");
        thumb.src = preset.thumbnail || THUMB_FALLBACK;
        thumb.alt = preset.name || key;
        thumb.className = "h-12 w-12 rounded-full object-cover shadow-sm sm:h-16 sm:w-16";
        thumb.loading = "lazy";

        button.appendChild(thumb);

        // ============================
        // Adiciona evento de clique
        // ============================
        button.addEventListener("click", () => setActivePreset(key));
        grid.appendChild(button);
    });

    // ============================
    // Define primeiro preset como ativo por padrão
    // ============================
    if (PRESET_ORDER.length) {
        setActivePreset(PRESET_ORDER[0]);
    }
}

// ============================
// Define preset ativo
// ============================
function setActivePreset(key) {
    // ============================
    // Atualiza classes de todos os botões
    // ============================
    document.querySelectorAll("[data-preset]").forEach((button) => {
        button.className = presetClass(button.dataset.preset === key);
    });

    // ============================
    // Reseta seleções customizadas e aplica preset no viewer
    // ============================
    resetCustomMaterialSelections();
    viewerInstance?.setPreset(key);
}
