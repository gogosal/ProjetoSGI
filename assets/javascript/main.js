import { RecordPlayerViewer } from "./components/RecordPlayerViewer.js";
import { materialPresets } from "./lib/textures.js";
import { ratingDistribution, reviews, highlights, badges, suggestedProducts } from "./lib/data.js";
import { createIcon } from "./lib/icons.js";

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

const THUMBNAIL_FALLBACK = new URL("../images/Wood.png", import.meta.url).href;

let viewerInstance;
let sliderInterval;
let slidesPerView = 1;
let currentSlide = 0;

function initViewer() {
    const canvas = document.getElementById("record-player-canvas");
    const container = document.getElementById("viewer-container");
    if (!canvas || !container) return;
    viewerInstance = new RecordPlayerViewer({ canvas, container, initialPreset: "default" });
}

function renderPresetButtons() {
    const grid = document.getElementById("preset-grid");
    if (!grid) return;
    grid.innerHTML = "";

    PRESET_ORDER.forEach((key, index) => {
        const preset = materialPresets[key];
        if (!preset) return;
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.preset = key;
        button.className = `group relative flex h-16 w-16 items-center justify-center rounded-full border transition sm:h-20 sm:w-20 ${index === 0
            ? "border-[#2b0f84] bg-[#2b0f84]/10 shadow-sm"
            : "border-slate-200 bg-white hover:border-[#2b0f84]/60 hover:bg-[#2b0f84]/5"
            }`;

        const thumbnail = preset.thumbnail || THUMBNAIL_FALLBACK;
        const img = document.createElement("img");
        img.src = thumbnail;
        img.alt = preset.name;
        img.className = "h-12 w-12 rounded-full object-cover shadow-sm sm:h-16 sm:w-16";

        const srOnly = document.createElement("span");
        srOnly.className = "sr-only";
        srOnly.textContent = preset.name;

        button.appendChild(img);
        button.appendChild(srOnly);
        button.addEventListener("click", () => setActivePreset(key));
        grid.appendChild(button);
    });

    // Ensure first preset is active by default
    if (PRESET_ORDER.length) {
        setActivePreset(PRESET_ORDER[0]);
    }
}

function setActivePreset(key) {
    const buttons = document.querySelectorAll("[data-preset]");
    buttons.forEach((btn) => {
        const isActive = btn.dataset.preset === key;
        btn.className = `group relative flex h-16 w-16 items-center justify-center rounded-full border transition sm:h-20 sm:w-20 ${isActive
            ? "border-[#2b0f84] bg-[#2b0f84]/10 shadow-sm"
            : "border-slate-200 bg-white hover:border-[#2b0f84]/60 hover:bg-[#2b0f84]/5"
            }`;
    });
    viewerInstance?.setPreset(key);
}

function renderHighlights() {
    const list = document.getElementById("highlights-list");
    if (!list) return;
    list.innerHTML = "";
    highlights.forEach((item) => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-2";
        li.innerHTML = `<span class="mt-1 size-1.5 rounded-full bg-[#2b0f84]"></span><span>${item}</span>`;
        list.appendChild(li);
    });
}

function renderBadges() {
    const container = document.getElementById("badges-list");
    if (!container) return;
    container.innerHTML = "";
    badges.forEach(({ icon, label }) => {
        const badge = document.createElement("span");
        badge.className = "flex items-center gap-2";
        const svg = createIcon(icon, { className: "size-4 text-[#2b0f84]" });
        badge.appendChild(svg);
        badge.appendChild(document.createTextNode(label));
        container.appendChild(badge);
    });
}

function renderPriceInfo() {
    const current = document.getElementById("price-current");
    const previous = document.getElementById("price-previous");
    const discount = document.getElementById("price-discount");
    if (!current || !previous || !discount) return;
    current.textContent = PRICE.current;
    previous.textContent = PRICE.previous;
    discount.textContent = PRICE.discount;
}

function renderRatingSummary() {
    const reviewCount = reviews.length;
    const average = reviewCount === 0 ? 0 : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

    const recommendationPercent = ratingDistribution
        .filter(({ stars }) => stars >= 4)
        .reduce((total, { percentage }) => total + percentage, 0);

    const ratingText = document.getElementById("rating-text");
    const averageLarge = document.getElementById("average-rating-large");
    const countSecondary = document.getElementById("rating-count-secondary");
    const recommendation = document.getElementById("rating-recommendation");
    if (ratingText) ratingText.textContent = `${average.toFixed(1)} · ${reviewCount} avaliações`;
    if (averageLarge) averageLarge.textContent = average.toFixed(1);
    if (countSecondary) countSecondary.textContent = `${reviewCount} avaliações totais`;
    if (recommendation) recommendation.textContent = `${recommendationPercent}% recomendam este artigo`;

    const containers = [
        document.getElementById("rating-stars"),
        document.getElementById("rating-stars-secondary"),
    ];
    containers.forEach((container) => {
        if (!container) return;
        container.innerHTML = "";
        for (let i = 1; i <= 5; i += 1) {
            const filled = i <= Math.round(average);
            const star = createIcon("star", {
                className: "size-4",
                fill: filled ? "currentColor" : "none",
                stroke: "currentColor",
            });
            container.appendChild(star);
        }
    });
}

function renderRatingBreakdown() {
    const container = document.getElementById("rating-breakdown");
    if (!container) return;
    container.innerHTML = "";
    ratingDistribution.forEach(({ stars, percentage }) => {
        const row = document.createElement("div");
        row.className = "flex items-center gap-3";
        row.innerHTML = `
            <span class="w-10">${stars}★</span>
            <div class="h-2 flex-1 rounded-full bg-slate-100">
                <div class="h-full rounded-full bg-[#2b0f84]" style="width:${percentage}%"></div>
            </div>
            <span class="w-12 text-right">${percentage}%</span>
        `;
        container.appendChild(row);
    });
}

function renderShippingOptions() {
    const container = document.getElementById("shipping-options");
    if (!container) return;
    container.innerHTML = "";
    SHIPPING_OPTIONS.forEach(({ id, title, timing, price }, index) => {
        const label = document.createElement("label");
        label.className = `flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition ${index === 0
            ? "border-[#2b0f84] bg-[#2b0f84]/5"
            : "border-slate-200 hover:border-slate-300"
            }`;
        label.innerHTML = `
            <input type="radio" name="shipping" class="mt-1.5 size-5 accent-[#2b0f84]" ${index === 0 ? "checked" : ""} />
            <div class="flex w-full items-start justify-between gap-4">
                <div>
                    <div class="font-medium text-slate-900">${title}</div>
                    <div class="text-slate-600">${timing}</div>
                </div>
                <div class="font-semibold text-slate-900">${price}</div>
            </div>
        `;
        container.appendChild(label);
    });
}

function createReviewCard(review) {
    const slide = document.createElement("div");
    slide.className = "review-slide w-full shrink-0 px-2 lg:w-1/2";
    const card = document.createElement("article");
    card.className = "flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

    const header = document.createElement("div");
    header.className = "flex flex-wrap items-center justify-between gap-3 text-sm";

    const authorBlock = document.createElement("div");
    const authorName = document.createElement("div");
    authorName.className = "font-semibold text-slate-900";
    authorName.textContent = review.author;
    const verified = document.createElement("div");
    verified.className = "text-xs uppercase tracking-[0.2em] text-slate-400";
    verified.textContent = "Compra verificada";
    authorBlock.append(authorName, verified);

    const dateEl = document.createElement("div");
    dateEl.className = "text-xs text-slate-500";
    dateEl.textContent = review.date;

    header.append(authorBlock, dateEl);

    const ratingRow = document.createElement("div");
    ratingRow.className = "mt-3 flex items-center gap-2";
    for (let i = 1; i <= 5; i += 1) {
        const filled = i <= review.rating;
        const star = createIcon("star", {
            className: "size-4",
            fill: filled ? "currentColor" : "none",
            stroke: "currentColor",
        });
        ratingRow.appendChild(star);
    }
    const title = document.createElement("h3");
    title.className = "font-medium text-slate-900";
    title.textContent = review.title;
    ratingRow.appendChild(title);

    const content = document.createElement("p");
    content.className = "mt-3 text-sm text-slate-600";
    content.textContent = review.content;

    card.append(header, ratingRow, content);
    slide.appendChild(card);
    return slide;
}

function renderReviews() {
    const track = document.getElementById("reviews-slider-track");
    if (!track) return;
    track.innerHTML = "";
    reviews.forEach((review) => {
        track.appendChild(createReviewCard(review));
    });
}

function renderSuggestedProducts() {
    const container = document.getElementById("suggested-products");
    if (!container) return;
    container.innerHTML = "";

    suggestedProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md";

        const figure = document.createElement("div");
        figure.className = "overflow-hidden rounded-xl bg-slate-100";
        figure.innerHTML = `<img src="${product.image}" alt="${product.title}" class="h-24 w-24 object-cover" loading="lazy" />`;

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
        footer.innerHTML = `
            <span class="text-lg font-semibold text-slate-900">${product.price}</span>
            <button class="text-sm font-semibold text-[#2b0f84] hover:underline">Ver detalhes</button>
        `;

        content.append(badge, title, description, footer);
        card.append(figure, content);
        container.appendChild(card);
    });
}

function handleResize() {
    slidesPerView = window.matchMedia("(min-width: 1024px)").matches ? 2 : 1;
    currentSlide = 0;
    updateSliderPosition();
}

function updateSliderPosition() {
    const wrapper = document.getElementById("reviews-slider-wrapper");
    const track = document.getElementById("reviews-slider-track");
    if (!wrapper || !track) return;
    const step = wrapper.clientWidth / slidesPerView;
    track.style.transform = `translateX(-${currentSlide * step}px)`;
}

function startSliderAutoPlay() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        const totalSlides = reviews.length;
        const maxIndex = Math.max(0, totalSlides - slidesPerView);
        currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
        updateSliderPosition();
    }, 4500);
}

function setupSlider() {
    const track = document.getElementById("reviews-slider-track");
    if (!track) return;
    track.style.transition = "transform 0.8s ease";
    window.addEventListener("resize", () => {
        handleResize();
        startSliderAutoPlay();
    });
    handleResize();
    startSliderAutoPlay();
}

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
                navigator.clipboard?.writeText(window.location.href);
                button.dataset.state = "copied";
                setTimeout(() => button.removeAttribute("data-state"), 1500);
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

function initApp() {
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
    setupSlider();
    initShareButtons();
    initWishlistButtons();
}

document.addEventListener("DOMContentLoaded", initApp);
