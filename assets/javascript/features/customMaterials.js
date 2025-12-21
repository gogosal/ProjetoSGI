import { materialLibrary, customMaterialOptions } from "../lib/textures.js";
import { CUSTOM_PART_LABELS } from "../config/produto.config.js";
import { $ } from "../core/dom.js";
import {
    viewerInstance,
    customMaterialState,
    customMaterialButtons,
    customMaterialCombobox,
} from "../core/state.js";

// ============================
// Inicializa estado dos materiais customizados como "preset"
// ============================
Object.keys(CUSTOM_PART_LABELS).forEach((key) => {
    customMaterialState[key] = "preset";
});

let comboboxHandlersBound = false;

// ============================
// Renderiza os controles de materiais customizados
// ============================
export function renderCustomMaterialControls() {
    const container = $("custom-material-controls");
    if (!container) return;

    container.innerHTML = "";

    Object.entries(CUSTOM_PART_LABELS).forEach(([part, label]) => {
        const options = customMaterialOptions[part] || [];
        if (!options.length) return;

        // ============================
        // Bloco do controle
        // ============================
        const block = document.createElement("div");
        block.className = "space-y-3 rounded-2xl border border-slate-100 bg-white/60 p-3";

        // ============================
        // Cabeçalho do bloco
        // ============================
        const header = document.createElement("div");
        header.className = "flex items-center justify-between";
        header.innerHTML = `<p class='text-sm font-semibold text-slate-900'>${label}</p><span class='text-xs text-slate-500'>Escolha o acabamento</span>`;

        // ============================
        // Combobox wrapper
        // ============================
        const comboboxWrapper = document.createElement("div");
        comboboxWrapper.className = "relative";

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.dataset.part = part;
        trigger.className = "flex w-full items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-left shadow-sm transition hover:border-[#2b0f84]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2b0f84]";
        trigger.setAttribute("aria-haspopup", "listbox");
        trigger.setAttribute("aria-expanded", "false");

        // ============================
        // Conteúdo interno do trigger
        // ============================
        const triggerLeading = document.createElement("div");
        triggerLeading.className = "flex flex-1 items-center gap-3";

        const triggerPreview = document.createElement("span");
        triggerPreview.className = "flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-[10px] font-semibold uppercase tracking-wide text-slate-600";

        const triggerText = document.createElement("div");
        triggerText.className = "flex flex-col text-left leading-tight";

        const triggerMeta = document.createElement("span");
        triggerMeta.className = "text-[10px] font-semibold uppercase tracking-wide text-slate-400";
        triggerMeta.textContent = label;

        const triggerLabel = document.createElement("span");
        triggerLabel.className = "text-sm font-semibold text-slate-700";
        triggerLabel.textContent = getCurrentSelectionLabel(part);

        triggerText.append(triggerMeta, triggerLabel);
        triggerLeading.append(triggerPreview, triggerText);

        const triggerChevron = document.createElement("span");
        triggerChevron.className = "ml-auto text-base text-slate-400 transition";
        triggerChevron.textContent = "›";
        triggerChevron.setAttribute("aria-hidden", "true");

        trigger.append(triggerLeading, triggerChevron);

        // ============================
        // Painel de opções do combobox
        // ============================
        const panel = document.createElement("div");
        panel.dataset.part = part;
        panel.className = "absolute left-full top-0 z-30 ml-3 hidden rounded-full border border-slate-200 bg-white/95 px-3 py-2 shadow-2xl";
        panel.setAttribute("role", "listbox");

        const list = document.createElement("div");
        list.className = "flex items-center gap-2";
        customMaterialButtons[part] = [];

        // ============================
        // Botões de cada opção
        // ============================
        options.forEach((opt) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.dataset.part = part;
            btn.dataset.value = opt.id;
            btn.className = customOptionClass(part, opt.id);
            applyMaterialPreview(btn, opt);

            btn.addEventListener("click", () => {
                if (customMaterialState[part] === opt.id) {
                    toggleCombobox(part, false);
                    return;
                }
                customMaterialState[part] = opt.id;
                applyMaterialSelection(part, opt.id);
                updateMaterialButtons(part);
                toggleCombobox(part, false);
            });

            customMaterialButtons[part].push(btn);
            list.appendChild(btn);
        });

        panel.appendChild(list);
        comboboxWrapper.append(trigger, panel);
        block.append(header, comboboxWrapper);
        container.appendChild(block);

        customMaterialCombobox[part] = {
            trigger,
            panel,
            label: triggerLabel,
            chevron: triggerChevron,
            preview: triggerPreview,
        };

        // ============================
        // Toggle do combobox ao clicar
        // ============================
        trigger.addEventListener("click", (event) => {
            event.preventDefault();
            const isOpen = trigger.getAttribute("aria-expanded") === "true";
            toggleCombobox(part, !isOpen);
        });

        updateMaterialButtons(part);
    });

    ensureComboboxHandlers();

    // ============================
    // Botão de reset de materiais
    // ============================
    const reset = $("custom-material-reset");
    if (reset && !reset.dataset.bound) {
        reset.dataset.bound = "true";
        reset.addEventListener("click", resetMaterials);
    }
}

// ============================
// Classes CSS dos botões de opção
// ============================
function customOptionClass(part, id) {
    const active = customMaterialState[part] === id;
    return `group relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-[10px] font-semibold uppercase transition ${active ? "border-[#2b0f84] ring-4 ring-[#2b0f84]/15" : "border-slate-200 text-slate-600 hover:border-[#2b0f84]/60"
        }`;
}

// ============================
// Aplica preview de material no botão
// ============================
function applyMaterialPreview(btn, opt) {
    Object.assign(btn.style, {
        backgroundImage: "",
        backgroundSize: "",
        backgroundPosition: "",
        backgroundColor: ""
    });
    btn.textContent = "";

    if (opt.kind === "material") {
        const entry = materialLibrary[opt.id];
        if (entry?.preview?.type === "image") {
            btn.style.backgroundImage = `url(${entry.preview.src})`;
            btn.style.backgroundSize = "cover";
            btn.style.backgroundPosition = "center";
        } else if (entry?.preview?.value) {
            btn.style.backgroundColor = entry.preview.value;
        }
    } else {
        btn.style.backgroundColor = "#f5f7fb";
        const label = document.createElement("span");
        label.textContent = opt.shortLabel?.slice(0, 3).toUpperCase() || "ORG";
        label.className = "pointer-events-none text-[10px] font-semibold tracking-wide text-slate-600";
        btn.appendChild(label);
    }
}

// ============================
// Atualiza os estados dos botões
// ============================
function updateMaterialButtons(part) {
    (customMaterialButtons[part] || []).forEach((btn) => {
        btn.className = customOptionClass(part, btn.dataset.value);
        btn.setAttribute("aria-pressed", customMaterialState[part] === btn.dataset.value);
    });
    updateComboboxLabel(part);
}

// ============================
// Reseta todos os materiais customizados
// ============================
export function resetCustomMaterialSelections() {
    Object.keys(customMaterialState).forEach((part) => {
        customMaterialState[part] = "preset";
        updateMaterialButtons(part);
    });
    closeAllComboboxes();
}

// ============================
// Aplica a seleção de material no viewer
// ============================
function applyMaterialSelection(part, id) {
    const opt = (customMaterialOptions[part] || []).find((o) => o.id === id);
    if (!opt || !viewerInstance) return;

    if (opt.kind === "original") {
        viewerInstance.setCustomMaterial(part, { mode: "original" });
        return;
    }

    if (opt.kind === "material") {
        const entry = materialLibrary[id];
        if (entry?.material) {
            viewerInstance.setCustomMaterial(part, {
                mode: "material",
                material: entry.material
            });
        }
    }
}

// ============================
// Reset geral dos materiais
// ============================
export function resetMaterials() {
    resetCustomMaterialSelections();
    viewerInstance?.clearAllCustomMaterials?.();
}

// ============================
// Abre ou fecha o combobox
// ============================
function toggleCombobox(part, open) {
    const entry = customMaterialCombobox[part];
    if (!entry) return;

    if (open) {
        closeAllComboboxes(part);
        entry.panel.classList.remove("hidden");
        entry.panel.classList.add("block");
        entry.trigger.setAttribute("aria-expanded", "true");
        entry.trigger.classList.add("border-[#2b0f84]", "text-[#2b0f84]");
        entry.chevron?.classList.add("rotate-90");
    } else {
        entry.panel.classList.add("hidden");
        entry.panel.classList.remove("block");
        entry.trigger.setAttribute("aria-expanded", "false");
        entry.trigger.classList.remove("border-[#2b0f84]", "text-[#2b0f84]");
        entry.chevron?.classList.remove("rotate-90");
    }
}

// ============================
// Fecha todos os comboboxes exceto um
// ============================
function closeAllComboboxes(exceptPart) {
    Object.entries(customMaterialCombobox).forEach(([key]) => {
        if (key === exceptPart) return;
        toggleCombobox(key, false);
    });
}

// ============================
// Adiciona handlers globais de combobox
// ============================
function ensureComboboxHandlers() {
    if (comboboxHandlersBound) return;
    comboboxHandlersBound = true;
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("keydown", handleDocumentKeydown);
}

// ============================
// Fecha combobox ao clicar fora
// ============================
function handleDocumentClick(event) {
    const target = event.target;
    Object.entries(customMaterialCombobox).forEach(([part, entry]) => {
        if (!entry?.trigger || !entry?.panel) return;
        const expanded = entry.trigger.getAttribute("aria-expanded") === "true";
        if (!expanded) return;
        if (entry.trigger.contains(target) || entry.panel.contains(target)) return;
        toggleCombobox(part, false);
    });
}

// ============================
// Fecha combobox ao pressionar Escape
// ============================
function handleDocumentKeydown(event) {
    if (event.key !== "Escape") return;
    Object.keys(customMaterialCombobox).forEach((part) => toggleCombobox(part, false));
}

// ============================
// Retorna label atual da seleção
// ============================
function getCurrentSelectionLabel(part) {
    const current = customMaterialState[part];
    if (current === "preset") return "Original";
    const options = customMaterialOptions[part] || [];
    const match = options.find((opt) => opt.id === current);
    return match?.shortLabel || "Selecionar";
}

// ============================
// Atualiza label e preview do combobox
// ============================
function updateComboboxLabel(part) {
    const entry = customMaterialCombobox[part];
    if (!entry?.label) return;
    entry.label.textContent = getCurrentSelectionLabel(part);
    updateComboboxPreview(part);
}

// ============================
// Atualiza preview visual do combobox
// ============================
function updateComboboxPreview(part) {
    const entry = customMaterialCombobox[part];
    if (!entry?.preview) return;

    const preview = entry.preview;
    const current = customMaterialState[part];
    const options = customMaterialOptions[part] || [];
    const opt = options.find((o) => o.id === current);

    Object.assign(preview.style, {
        backgroundImage: "",
        backgroundSize: "",
        backgroundPosition: "",
        backgroundColor: "#f5f7fb",
    });
    preview.textContent = "";

    if (!opt || current === "preset") {
        preview.textContent = "ORG";
        return;
    }

    if (opt.kind === "original") {
        preview.textContent = "ORG";
        return;
    }

    if (opt.kind === "material") {
        const entryMat = materialLibrary[opt.id];
        if (entryMat?.preview?.type === "image") {
            preview.style.backgroundImage = `url(${entryMat.preview.src})`;
            preview.style.backgroundSize = "cover";
            preview.style.backgroundPosition = "center";
            preview.style.backgroundColor = "";
        } else if (entryMat?.preview?.value) {
            preview.style.backgroundColor = entryMat.preview.value;
        }
    }
}
