import { ratingDistribution, reviews } from "../lib/data.js";
import { $ } from "../core/dom.js";

// ============================
// Classes dos ícones de estrela
// ============================
const STAR_ICON_CLASSES = {
    star: "fa-solid fa-star",
    "star-outline": "fa-regular fa-star",
};

// ============================
// Cria um ícone de estrela
// ============================
function makeIcon(name, extraClass = "") {
    const icon = document.createElement("i");
    icon.className = `${STAR_ICON_CLASSES[name] || ""}${extraClass ? ` ${extraClass}` : ""}`.trim();
    icon.setAttribute("aria-hidden", "true");
    return icon;
}

// ============================
// Gera fragmento com estrelas preenchidas ou vazias
// ============================
function makeStars(rating = 0, max = 5) {
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= max; i++) {
        const filled = i <= Math.round(rating);
        fragment.appendChild(makeIcon(filled ? "star" : "star-outline", "text-[1rem]"));
    }
    return fragment;
}

// ============================
// Renderiza resumo de avaliações (média, total e recomendação)
// ============================
export function renderRatingSummary() {
    const count = reviews.length;
    const average = count ? reviews.reduce((sum, review) => sum + review.rating, 0) / count : 0;
    const recommendation = ratingDistribution
        .filter((entry) => entry.stars >= 4)
        .reduce((sum, entry) => sum + entry.percentage, 0);

    // ============================
    // Atualiza textos do resumo
    // ============================
    $("rating-text1").textContent = `${average.toFixed(1)} ·`;
    $("rating-text2").textContent = `${count} avaliações`;
    $("average-rating-large").textContent = average.toFixed(1);
    $("rating-count-secondary").textContent = `${count} avaliações totais`;
    $("rating-recommendation").textContent = `${recommendation}% recomendam este artigo`;

    // ============================
    // Renderiza estrelas do resumo
    // ============================
    [$("rating-stars"), $("rating-stars-secondary")].forEach((target) => {
        if (!target) return;
        target.innerHTML = "";
        target.appendChild(makeStars(average));
    });
}

// ============================
// Renderiza a distribuição detalhada das avaliações (barra de % por estrelas)
// ============================
export function renderRatingBreakdown() {
    const container = $("rating-breakdown");
    if (!container) return;

    container.innerHTML = "";

    ratingDistribution.forEach(({ stars, percentage }) => {
        // ============================
        // Linha da estrela + barra
        // ============================
        const row = document.createElement("div");
        row.className = "flex items-center gap-3";

        // ============================
        // Label da estrela (ex: 5★)
        // ============================
        const label = document.createElement("span");
        label.className = "w-10";
        label.textContent = `${stars}★`;

        // ============================
        // Barra de fundo
        // ============================
        const barWrap = document.createElement("div");
        barWrap.className = "h-2 flex-1 rounded-full bg-slate-100";

        // ============================
        // Barra preenchida proporcional à % de avaliações
        // ============================
        const bar = document.createElement("div");
        bar.className = "h-full rounded-full bg-[#2b0f84]";
        bar.style.width = `${percentage}%`;
        barWrap.appendChild(bar);

        // ============================
        // Texto percentual
        // ============================
        const perc = document.createElement("span");
        perc.className = "w-12 text-right";
        perc.textContent = `${percentage}%`;

        // ============================
        // Monta linha completa e adiciona ao container
        // ============================
        row.append(label, barWrap, perc);
        container.appendChild(row);
    });
}
