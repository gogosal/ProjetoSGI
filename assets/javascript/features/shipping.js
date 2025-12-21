import { SHIPPING_OPTIONS } from "../config/produto.config.js";
import { $ } from "../core/dom.js";

// ============================
// Retorna classes CSS do container de opção de envio
// ============================
function shippingClass(active) {
    return `flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition ${active
        ? "border-[#2b0f84] bg-[#2b0f84]/5"
        : "border-slate-200 hover:border-slate-300"
        }`;
}

// ============================
// Renderiza todas as opções de envio no DOM
// ============================
export function renderShippingOptions() {
    const container = $("shipping-options");
    if (!container) return;

    container.innerHTML = "";

    SHIPPING_OPTIONS.forEach((option, index) => {
        // ============================
        // Cria label principal da opção
        // ============================
        const label = document.createElement("label");
        label.dataset.shippingOption = option.id;
        label.className = shippingClass(index === 0);

        // ============================
        // Cria input tipo radio
        // ============================
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "shipping";
        input.value = option.id;
        if (index === 0) input.checked = true;

        // ============================
        // Cria wrapper para conteúdo da opção
        // ============================
        const wrapper = document.createElement("div");
        wrapper.className = "flex w-full items-start justify-between gap-4";

        // ============================
        // Conteúdo à esquerda (título e prazo)
        // ============================
        const left = document.createElement("div");
        const title = document.createElement("div");
        title.className = "font-medium text-slate-900";
        title.textContent = option.title;

        const timing = document.createElement("div");
        timing.className = "text-slate-600";
        timing.textContent = option.timing;

        left.append(title, timing);

        // ============================
        // Preço à direita
        // ============================
        const price = document.createElement("div");
        price.className = "font-semibold text-slate-900";
        price.textContent = option.price;

        // ============================
        // Monta a estrutura final
        // ============================
        wrapper.append(left, price);
        label.append(input, wrapper);

        // ============================
        // Evento de mudança para atualizar estado ativo
        // ============================
        input.addEventListener("change", () => setActiveShippingOption(option.id));

        container.appendChild(label);
    });
}

// ============================
// Define a opção de envio ativa
// ============================
function setActiveShippingOption(id) {
    document.querySelectorAll("[data-shipping-option]").forEach((label) => {
        const active = label.dataset.shippingOption === id;
        label.className = shippingClass(active);

        const input = label.querySelector("input");
        if (input) input.checked = active;
    });
}
