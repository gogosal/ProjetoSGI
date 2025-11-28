// ficheiro optimizado.js
// Versão otimizada do teu script original, com comentários em Português (PT-PT).

import { RecordPlayerViewer } from "./components/RecordPlayerViewer.js";
import { materialPresets } from "./lib/textures.js";
import { ratingDistribution, reviews, highlights, badges, suggestedProducts } from "./lib/data.js";
import { createIcon } from "./lib/icons.js";

/* -------------------------
   Constantes e configuração
   ------------------------- */
const PRESET_ORDER = ["default", "luxo", "moderno", "vintage"];

const PRICE = {
    current: "349,00 €",
    previous: "399,00 €",
    discount: "-13%",
};

const SHIPPING_OPTIONS = [
    {
        id: "home",
        title: "Entrega e calibração ao domicílio",
        timing: "Agende entre 16 e 21 de Novembro",
        price: "19,90 €",
    },
    {
        id: "store",
        title: "Levantamento em loja com sessão demo",
        timing: "Pronto em 1 a 2 dias úteis",
        price: "Grátis",
    },
];

// fallback para thumbs
const THUMBNAIL_FALLBACK = new URL("../images/Wood.png", import.meta.url).href;

/* -------------------------
   Estado interno
   ------------------------- */
let viewerInstance = null;
let sliderInterval = null;
let slidesPerView = 1;
let currentSlide = 0;

/* -------------------------
   UTILITÁRIOS DOM / UI
   ------------------------- */

// atalho seguro para obter elemento (retorna null se não existir)
function $id(id) {
    return document.getElementById(id);
}

// define texto de forma segura (ignora se o elemento for null)
function setTextSafe(el, text) {
    if (el) el.textContent = text;
}

// cria uma classe de botão de preset, evita repetição de strings Tailwind
function presetClass(isActive = false) {
    const base = "group relative flex h-16 w-16 items-center justify-center rounded-full border transition sm:h-20 sm:w-20";
    const active = "border-[#2b0f84] bg-[#2b0f84]/10 shadow-sm";
    const inactive = "border-slate-200 bg-white hover:border-[#2b0f84]/60 hover:bg-[#2b0f84]/5";
    return `${base} ${isActive ? active : inactive}`;
}

// limpa e insere HTML com segurança (substitui innerHTML)
function clearAndAppend(parent, children = []) {
    if (!parent) return;
    parent.innerHTML = "";
    children.forEach((c) => parent.appendChild(c));
}

// cria um fragmento com N estrelas (útil para vários locais)
function makeStarsFragment(rating = 0, max = 5) {
    const frag = document.createDocumentFragment();
    for (let i = 1; i <= max; i += 1) {
        const filled = i <= Math.round(rating);
        const star = createIcon("star", {
            className: "size-4",
            fill: filled ? "currentColor" : "none",
            stroke: "currentColor",
        });
        frag.appendChild(star);
    }
    return frag;
}

/* -------------------------
   Inicialização do viewer 3D
   ------------------------- */
function initViewer() {
    const canvas = $id("record-player-canvas");
    const container = $id("viewer-container");
    if (!canvas || !container) return;
    viewerInstance = new RecordPlayerViewer({ canvas, container, initialPreset: "default" });
}

/* -------------------------
   PRESETS (botões)
   ------------------------- */

function renderPresetButtons() {
    const grid = $id("preset-grid");
    if (!grid) return;

    // limpar
    grid.innerHTML = "";

    PRESET_ORDER.forEach((key, index) => {
        const preset = materialPresets[key];
        if (!preset) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.preset = key;
        btn.className = presetClass(index === 0);

        const thumbnail = preset.thumbnail || THUMBNAIL_FALLBACK;
        const img = document.createElement("img");
        img.src = thumbnail;
        img.alt = preset.name || key;
        img.className = "h-12 w-12 rounded-full object-cover shadow-sm sm:h-16 sm:w-16";
        img.loading = "lazy";

        const sr = document.createElement("span");
        sr.className = "sr-only";
        sr.textContent = preset.name || key;

        btn.append(img, sr);
        btn.addEventListener("click", () => setActivePreset(key));
        grid.appendChild(btn);
    });

    // garante que o primeiro preset (se existir) fica activo
    if (PRESET_ORDER.length) setActivePreset(PRESET_ORDER[0]);
}

// define preset activo: atualiza classes dos botões e informa o viewer 3D
function setActivePreset(key) {
    document.querySelectorAll("[data-preset]").forEach((btn) => {
        const isActive = btn.dataset.preset === key;
        btn.className = presetClass(isActive);
    });
    viewerInstance?.setPreset(key);
}

/* -------------------------
   HIGHLIGHTS e BADGES
   ------------------------- */

function renderHighlights() {
    const list = $id("highlights-list");
    if (!list) return;

    const frag = document.createDocumentFragment();
    highlights.forEach((item) => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-2";
        // separar elementos em vez de innerHTML para maior segurança
        const dot = document.createElement("span");
        dot.className = "mt-1 size-1.5 rounded-full bg-[#2b0f84]";
        const txt = document.createElement("span");
        txt.textContent = item;
        li.append(dot, txt);
        frag.appendChild(li);
    });
    clearAndAppend(list, [frag]); // se list aceitar fragmento, append funciona
}

function renderBadges() {
    const container = $id("badges-list");
    if (!container) return;

    const frag = document.createDocumentFragment();
    badges.forEach(({ icon, label }) => {
        const badge = document.createElement("span");
        badge.className = "flex items-center gap-2";
        const svg = createIcon(icon, { className: "size-4 text-[#2b0f84]" });
        badge.append(svg, document.createTextNode(label));
        frag.appendChild(badge);
    });
    container.innerHTML = "";
    container.appendChild(frag);
}

/* -------------------------
   PREÇO
   ------------------------- */

function renderPriceInfo() {
    setTextSafe($id("price-current"), PRICE.current);
    setTextSafe($id("price-previous"), PRICE.previous);
    setTextSafe($id("price-discount"), PRICE.discount);
}

/* -------------------------
   RATING (resumo e breakdown)
   ------------------------- */

// renderiza o resumo das avaliações (média, contagem, percentagem recomendação, estrelas grandes)
function renderRatingSummary() {
    const reviewCount = reviews.length;
    const average = reviewCount === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / reviewCount;

    const recommendationPercent = ratingDistribution
        .filter(({ stars }) => stars >= 4)
        .reduce((total, { percentage }) => total + percentage, 0);

    setTextSafe($id("rating-text1"), `${average.toFixed(1)} ·`);
    setTextSafe($id("rating-text2"), ` ${reviewCount} avaliações`);
    setTextSafe($id("average-rating-large"), average.toFixed(1));
    setTextSafe($id("rating-count-secondary"), `${reviewCount} avaliações totais`);
    setTextSafe($id("rating-recommendation"), `${recommendationPercent}% recomendam este artigo`);

    // preenche os contêineres de estrelas (se existirem)
    [$id("rating-stars"), $id("rating-stars-secondary")].forEach((container) => {
        if (!container) return;
        container.innerHTML = "";
        container.appendChild(makeStarsFragment(average));
    });
}

// renderiza o breakdown (barras por cada nível de estrelas)
function renderRatingBreakdown() {
    const container = $id("rating-breakdown");
    if (!container) return;
    container.innerHTML = "";

    ratingDistribution.forEach(({ stars, percentage }) => {
        const row = document.createElement("div");
        row.className = "flex items-center gap-3";

        const starsLabel = document.createElement("span");
        starsLabel.className = "w-10";
        starsLabel.textContent = `${stars}★`;

        const barWrapper = document.createElement("div");
        barWrapper.className = "h-2 flex-1 rounded-full bg-slate-100";
        const bar = document.createElement("div");
        bar.className = "h-full rounded-full bg-[#2b0f84]";
        bar.style.width = `${percentage}%`;
        barWrapper.appendChild(bar);

        const percentText = document.createElement("span");
        percentText.className = "w-12 text-right";
        percentText.textContent = `${percentage}%`;

        row.append(starsLabel, barWrapper, percentText);
        container.appendChild(row);
    });
}

/* -------------------------
   SHIPPING OPTIONS
   ------------------------- */

function renderShippingOptions() {
    const container = $id("shipping-options");
    if (!container) return;
    container.innerHTML = "";

    SHIPPING_OPTIONS.forEach(({ id, title, timing, price }, index) => {
        const label = document.createElement("label");
        label.className = `flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition ${index === 0
            ? "border-[#2b0f84] bg-[#2b0f84]/5"
            : "border-slate-200 hover:border-slate-300"
            }`;

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "shipping";
        input.className = "mt-1.5 size-5 accent-[#2b0f84]";
        if (index === 0) input.checked = true;

        const inner = document.createElement("div");
        inner.className = "flex w-full items-start justify-between gap-4";

        const left = document.createElement("div");
        const titleEl = document.createElement("div");
        titleEl.className = "font-medium text-slate-900";
        titleEl.textContent = title;
        const timingEl = document.createElement("div");
        timingEl.className = "text-slate-600";
        timingEl.textContent = timing;
        left.append(titleEl, timingEl);

        const priceEl = document.createElement("div");
        priceEl.className = "font-semibold text-slate-900";
        priceEl.textContent = price;

        inner.append(left, priceEl);
        label.append(input, inner);
        container.appendChild(label);
    });
}

/* -------------------------
   REVIEWS (slider)
   ------------------------- */

// cria um cartão de review (HTML) e retorna um elemento slide
function createReviewCard(review) {
    const slide = document.createElement("div");
    slide.className = "review-slide w-full shrink-0 px-2 lg:w-1/2";

    const card = document.createElement("article");
    card.className = "flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.6)]";

    // header
    const header = document.createElement("div");
    header.className = "flex flex-wrap items-center justify-between gap-3";

    const authorBlock = document.createElement("div");
    authorBlock.className = "space-y-1";
    const authorName = document.createElement("p");
    authorName.className = "text-base font-semibold text-slate-900";
    authorName.textContent = review.author || "Anónimo";
    const verified = document.createElement("p");
    verified.className = "text-xs font-semibold tracking-[0.3em] text-slate-400";
    verified.textContent = "COMPRA VERIFICADA";
    authorBlock.append(authorName, verified);

    const dateEl = document.createElement("p");
    dateEl.className = "text-sm text-slate-500";
    dateEl.textContent = review.date || "";

    header.append(authorBlock, dateEl);

    // rating row (estrelas + badge)
    const ratingRow = document.createElement("div");
    ratingRow.className = "flex items-center gap-2 text-amber-500";
    ratingRow.appendChild(makeStarsFragment(review.rating));
    const ratingBadge = document.createElement("span");
    ratingBadge.className = "ml-auto rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800";
    ratingBadge.textContent = `${review.rating}.0`;
    ratingRow.appendChild(ratingBadge);

    // título e conteúdo
    const title = document.createElement("h3");
    title.className = "text-xl font-semibold text-slate-900";
    title.textContent = review.title;

    const content = document.createElement("p");
    content.className = "text-sm leading-relaxed text-slate-600";
    content.textContent = review.content;

    card.append(header, ratingRow, title, content);
    slide.appendChild(card);
    return slide;
}

// renderiza todos os reviews no track do slider
function renderReviews() {
    const track = $id("reviews-slider-track");
    if (!track) return;
    track.innerHTML = "";
    const frag = document.createDocumentFragment();
    reviews.forEach((r) => frag.appendChild(createReviewCard(r)));
    track.appendChild(frag);
}

/* -------------------------
   SUGGESTED PRODUCTS
   ------------------------- */

function renderSuggestedProducts() {
    const container = $id("suggested-products");
    if (!container) return;
    container.innerHTML = "";

    const frag = document.createDocumentFragment();
    suggestedProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md";

        const figure = document.createElement("div");
        figure.className = "overflow-hidden rounded-xl bg-slate-100";
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;
        img.className = "h-24 w-24 object-cover";
        img.loading = "lazy";
        figure.appendChild(img);

        const content = document.createElement("div");
        content.className = "flex-1 space-y-2";

        const badge = document.createElement("span");
        badge.className = "inline-flex items-center gap-1 rounded-full bg-[#0fa5b8]/10 px-3 py-1 text-xs font-semibold text-[#0f5a7a]";
        badge.textContent = product.badge;

        const title = document.createElement("h3");
        title.className = "text-base font-semibold text-slate-900";
        title.textContent = product.title;

        const description = document.createElement("p");
        description.className = "text-sm text-slate-600";
        description.textContent = product.description;

        const footer = document.createElement("div");
        footer.className = "flex items-center justify-between text-sm";
        const priceEl = document.createElement("span");
        priceEl.className = "text-lg font-semibold text-slate-900";
        priceEl.textContent = product.price;
        const btn = document.createElement("button");
        btn.className = "text-sm font-semibold text-[#2b0f84] hover:underline";
        btn.textContent = "Ver detalhes";
        footer.append(priceEl, btn);

        content.append(badge, title, description, footer);
        card.append(figure, content);
        frag.appendChild(card);
    });
    container.appendChild(frag);
}

/* -------------------------
   SLIDER: lógica simples e responsiva
   ------------------------- */

// actualiza slidesPerView com base no viewport e reposiciona o slider
function calculateSlidesPerView() {
    slidesPerView = window.matchMedia("(min-width: 1024px)").matches ? 2 : 1;
}

// actualiza a posição do slider com cálculo baseado na largura do wrapper
function updateSliderPosition() {
    const wrapper = $id("reviews-slider-wrapper");
    const track = $id("reviews-slider-track");
    if (!wrapper || !track) return;
    const step = wrapper.clientWidth / slidesPerView;
    track.style.transform = `translateX(-${currentSlide * step}px)`;
}

// inicia autoplay do slider (limpa intervalo anterior)
function startSliderAutoPlay() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        const totalSlides = reviews.length;
        const maxIndex = Math.max(0, totalSlides - slidesPerView);
        currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
        updateSliderPosition();
    }, 4500);
}

// configura evento resize e inicia o slider
function setupSlider() {
    const track = $id("reviews-slider-track");
    if (!track) return;
    track.style.transition = "transform 0.8s ease";
    const onResize = () => {
        calculateSlidesPerView();
        currentSlide = 0; // reset quando muda o tamanho
        updateSliderPosition();
        startSliderAutoPlay();
    };
    window.addEventListener("resize", onResize);
    // chamada inicial
    onResize();
}

/* -------------------------
   SHARE e WISHLIST
   ------------------------- */

function initShareButtons() {
    document.querySelectorAll("[data-action='share']").forEach((button) => {
        button.addEventListener("click", async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: "Gira-discos Vinil", url: window.location.href });
                } catch (error) {
                    console.warn("Partilha cancelada", error);
                }
            } else {
                // fallback: copia para clipboard e indica estado
                try {
                    await navigator.clipboard?.writeText(window.location.href);
                    button.dataset.state = "copied";
                    setTimeout(() => button.removeAttribute("data-state"), 1500);
                } catch (err) {
                    console.warn("Não foi possível copiar o URL", err);
                }
            }
        });
    });
}

function initWishlistButtons() {
    document.querySelectorAll("[data-action='wishlist']").forEach((button) => {
        button.addEventListener("click", () => {
            button.classList.toggle("text-[#2b0f84]");
            button.classList.toggle("fill-[#2b0f84]/10");
        });
    });
}

/* -------------------------
   Inicialização global
   ------------------------- */

function initApp() {
    // componentes visuais / dados
    initViewer();
    renderPresetButtons();
    renderHighlights();
    renderBadges();
    renderPriceInfo();
    renderRatingSummary();
    renderRatingBreakdown();
    renderShippingOptions();
    renderReviews();
    renderSuggestedProducts();

    // widgets interactivos
    setupSlider();
    initShareButtons();
    initWishlistButtons();
}

// inicia quando DOM estiver carregado
document.addEventListener("DOMContentLoaded", initApp);
