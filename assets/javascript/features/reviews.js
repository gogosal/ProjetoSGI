import { reviews } from "../lib/data.js";
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
// Gera as 5 estrelas de avaliação
// ============================
function makeStars(rating) {
    const fragment = document.createDocumentFragment();
    for (let i = 1; i <= 5; i++) {
        fragment.appendChild(
            makeIcon(i <= Math.round(rating) ? "star" : "star-outline", "text-[1rem]")
        );
    }
    return fragment;
}

// ============================
// Cria o card de review individual
// ============================
function createReviewCard(review) {
    // ============================
    // Container do slide
    // ============================
    const slide = document.createElement("div");
    slide.className = "review-slide w-full shrink-0 px-2 lg:w-1/2";

    // ============================
    // Card principal
    // ============================
    const card = document.createElement("article");
    card.className =
        "flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.6)]";

    // ============================
    // Cabeçalho com autor e data
    // ============================
    const header = document.createElement("div");
    header.className = "flex flex-wrap items-center justify-between gap-3";

    const author = document.createElement("div");
    author.className = "space-y-1";
    author.innerHTML = `<p class='text-base font-semibold text-slate-900'>${review.author || "Anónimo"}</p><p class='text-xs font-semibold tracking-[0.3em] text-slate-400'>COMPRA VERIFICADA</p>`;

    const date = document.createElement("p");
    date.className = "text-sm text-slate-500";
    date.textContent = review.date;

    header.append(author, date);

    // ============================
    // Avaliação com estrelas e badge
    // ============================
    const rating = document.createElement("div");
    rating.className = "flex flex-wrap items-center gap-2 text-amber-500";
    rating.append(makeStars(review.rating));

    const badge = document.createElement("span");
    badge.className = "ml-auto rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800";
    badge.textContent = `${review.rating}.0`;
    rating.appendChild(badge);

    // ============================
    // Título e conteúdo do review
    // ============================
    const title = document.createElement("h3");
    title.className = "text-xl font-semibold text-slate-900";
    title.textContent = review.title;

    const content = document.createElement("p");
    content.className = "text-sm leading-relaxed text-slate-600";
    content.textContent = review.content;

    // ============================
    // Monta o card completo
    // ============================
    card.append(header, rating, title, content);
    slide.appendChild(card);
    return slide;
}

// ============================
// Renderiza todos os reviews no slider
// ============================
export function renderReviews() {
    const track = $("reviews-slider-track");
    if (!track) return;

    track.innerHTML = "";
    const fragment = document.createDocumentFragment();
    reviews.forEach((review) => fragment.appendChild(createReviewCard(review)));
    track.appendChild(fragment);
}
