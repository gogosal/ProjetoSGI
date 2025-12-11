import { RecordPlayerViewer } from "./components/RecordPlayerViewer.js";
import { materialPresets, materialLibrary, customMaterialOptions } from "./lib/textures.js";
import { ratingDistribution, reviews, highlights, badges, suggestedProducts } from "./lib/data.js";
import { createIcon } from "./lib/icons.js";

/* -------------------------
   Configuração
   ------------------------- */
const PRESET_ORDER = ["default", "luxo", "moderno", "vintage"];
const PRICE = { current: "349,00 €", previous: "399,00 €", discount: "-13%" };
const SHIPPING_OPTIONS = [
    { id: "home", title: "Entrega e calibração ao domicílio", timing: "Agende entre 16 e 21 de Novembro", price: "19,90 €" },
    { id: "store", title: "Levantamento em loja com sessão demo", timing: "Pronto em 1 a 2 dias úteis", price: "Grátis" }
];
const CUSTOM_PART_LABELS = { base: "Base principal", feet: "Pes", agulha: "Agulha", vinylBase: "Base do vinil" };
const customMaterialState = Object.fromEntries(Object.keys(CUSTOM_PART_LABELS).map(k => [k, "preset"]));
const customMaterialButtons = {};

let viewerInstance = null;
let sliderInterval = null;
let slidesPerView = 1;
let currentSlide = 0;
let wishlistActive = false;
let cartCount = 0;

/* -------------------------
   Helpers
   ------------------------- */
const $ = id => document.getElementById(id);
const THUMB_FALLBACK = new URL("../images/Wood.png", import.meta.url).href;

function presetClass(active) {
    return `group relative flex h-16 w-16 items-center justify-center rounded-full border transition sm:h-20 sm:w-20 ${active
        ? "border-[#2b0f84] bg-[#2b0f84]/10 shadow-sm"
        : "border-slate-200 bg-white hover:border-[#2b0f84]/60 hover:bg-[#2b0f84]/5"
        }`;
}

function shippingClass(active) {
    return `flex cursor-pointer items-start gap-3 rounded-2xl border p-4 text-sm transition ${active
        ? "border-[#2b0f84] bg-[#2b0f84]/5"
        : "border-slate-200 hover:border-slate-300"
        }`;
}

function makeStars(rating = 0, max = 5) {
    const f = document.createDocumentFragment();
    for (let i = 1; i <= max; i++) {
        const filled = i <= Math.round(rating);
        const iconName = filled ? "star" : "star-outline";
        f.appendChild(createIcon(iconName, {
            className: "text-[1rem]"
        }));
    }
    return f;
}

/* -------------------------
   Viewer 3D
   ------------------------- */
function initViewer() {
    const canvas = $("record-player-canvas");
    const container = $("viewer-container");
    if (canvas && container)
        viewerInstance = new RecordPlayerViewer({ canvas, container, initialPreset: "default" });
}

/* -------------------------
   Presets
   ------------------------- */
function renderPresetButtons() {
    const grid = $("preset-grid");
    grid.innerHTML = "";

    PRESET_ORDER.forEach((key, i) => {
        const preset = materialPresets[key];
        if (!preset) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.dataset.preset = key;
        btn.className = presetClass(i === 0);

        const img = document.createElement("img");
        img.src = preset.thumbnail || THUMB_FALLBACK;
        img.alt = preset.name || key;
        img.className = "h-12 w-12 rounded-full object-cover shadow-sm sm:h-16 sm:w-16";
        img.loading = "lazy";

        btn.append(img);
        btn.addEventListener("click", () => setActivePreset(key));
        grid.appendChild(btn);
    });

    if (PRESET_ORDER.length) setActivePreset(PRESET_ORDER[0]);
}

function setActivePreset(key) {
    document.querySelectorAll("[data-preset]").forEach(btn => {
        btn.className = presetClass(btn.dataset.preset === key);
    });
    resetCustomMaterialSelections();
    viewerInstance?.setPreset(key);
}

/* -------------------------
   Highlights & Badges
   ------------------------- */
function renderHighlights() {
    const list = $("highlights-list");
    list.innerHTML = "";

    const frag = document.createDocumentFragment();
    highlights.forEach(t => {
        const li = document.createElement("li");
        li.className = "flex items-start gap-2";

        const dot = document.createElement("span");
        dot.className = "mt-1 size-1.5 rounded-full bg-[#2b0f84]";

        const txt = document.createElement("span");
        txt.textContent = t;
        li.append(dot, txt);
        frag.appendChild(li);
    });

    list.appendChild(frag);
}

function renderBadges() {
    const c = $("badges-list");
    c.innerHTML = "";
    const frag = document.createDocumentFragment();

    badges.forEach(({ icon, label }) => {
        const badge = document.createElement("span");
        badge.className = "flex items-center gap-2";
        badge.append(createIcon(icon, { className: "text-[1rem] text-[#2b0f84]" }), label);
        frag.appendChild(badge);
    });

    c.appendChild(frag);
}

/* -------------------------
   Preço
   ------------------------- */
function renderPriceInfo() {
    $("price-current").textContent = PRICE.current;
    $("price-previous").textContent = PRICE.previous;
    $("price-discount").textContent = PRICE.discount;
}

/* -------------------------
   Rating
   ------------------------- */
function renderRatingSummary() {
    const count = reviews.length;
    const avg = count ? reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
    const recommendation = ratingDistribution.filter(r => r.stars >= 4).reduce((a, b) => a + b.percentage, 0);

    $("rating-text1").textContent = `${avg.toFixed(1)} ·`;
    $("rating-text2").textContent = `${count} avaliações`;
    $("average-rating-large").textContent = avg.toFixed(1);
    $("rating-count-secondary").textContent = `${count} avaliações totais`;
    $("rating-recommendation").textContent = `${recommendation}% recomendam este artigo`;

    [$("rating-stars"), $("rating-stars-secondary")].forEach(c => {
        if (c) {
            c.innerHTML = "";
            c.appendChild(makeStars(avg));
        }
    });
}

function renderRatingBreakdown() {
    const container = $("rating-breakdown");
    container.innerHTML = "";

    ratingDistribution.forEach(({ stars, percentage }) => {
        const row = document.createElement("div");
        row.className = "flex items-center gap-3";

        const label = document.createElement("span");
        label.className = "w-10";
        label.textContent = `${stars}★`;

        const barWrap = document.createElement("div");
        barWrap.className = "h-2 flex-1 rounded-full bg-slate-100";
        const bar = document.createElement("div");
        bar.className = "h-full rounded-full bg-[#2b0f84]";
        bar.style.width = `${percentage}%`;
        barWrap.appendChild(bar);

        const perc = document.createElement("span");
        perc.className = "w-12 text-right";
        perc.textContent = `${percentage}%`;

        row.append(label, barWrap, perc);
        container.appendChild(row);
    });
}

/* -------------------------
   Envio
   ------------------------- */
function renderShippingOptions() {
    const c = $("shipping-options");
    c.innerHTML = "";

    SHIPPING_OPTIONS.forEach((opt, i) => {
        const label = document.createElement("label");
        label.dataset.shippingOption = opt.id;
        label.className = shippingClass(i === 0);

        const input = document.createElement("input");
        input.type = "radio";
        input.name = "shipping";
        input.value = opt.id;
        if (i === 0) input.checked = true;

        const t = document.createElement("div");
        t.className = "flex w-full items-start justify-between gap-4";

        const left = document.createElement("div");
        const title = document.createElement("div");
        title.className = "font-medium text-slate-900";
        title.textContent = opt.title;
        const timing = document.createElement("div");
        timing.className = "text-slate-600";
        timing.textContent = opt.timing;
        left.append(title, timing);

        const price = document.createElement("div");
        price.className = "font-semibold text-slate-900";
        price.textContent = opt.price;

        t.append(left, price);
        label.append(input, t);
        input.addEventListener("change", () => setActiveShippingOption(opt.id));

        c.appendChild(label);
    });
}

function setActiveShippingOption(id) {
    document.querySelectorAll("[data-shipping-option]").forEach(l => {
        const active = l.dataset.shippingOption === id;
        l.className = shippingClass(active);
        const input = l.querySelector("input");
        if (input) input.checked = active;
    });
}

/* -------------------------
   Custom Materials
   ------------------------- */
function renderCustomMaterialControls() {
    const c = $("custom-material-controls");
    c.innerHTML = "";

    Object.entries(CUSTOM_PART_LABELS).forEach(([part, label]) => {
        const options = customMaterialOptions[part] || [];
        if (!options.length) return;

        const block = document.createElement("div");
        block.className = "space-y-3 rounded-2xl border border-slate-100 bg-white/60 p-3";

        const header = document.createElement("div");
        header.className = "flex items-center justify-between";
        header.innerHTML = `<p class='text-sm font-semibold text-slate-900'>${label}</p><span class='text-xs text-slate-500'>Escolha o acabamento</span>`;

        const list = document.createElement("div");
        list.className = "flex flex-wrap gap-2";
        customMaterialButtons[part] = [];

        options.forEach(opt => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.dataset.part = part;
            btn.dataset.value = opt.id;
            btn.className = customOptionClass(part, opt.id);
            applyMaterialPreview(btn, opt);

            btn.addEventListener("click", () => {
                if (customMaterialState[part] !== opt.id) {
                    customMaterialState[part] = opt.id;
                    applyMaterialSelection(part, opt.id);
                    updateMaterialButtons(part);
                }
            });

            customMaterialButtons[part].push(btn);
            list.appendChild(btn);
        });

        block.append(header, list);
        c.appendChild(block);

        updateMaterialButtons(part);
    });

    const reset = $("custom-material-reset");
    if (reset && !reset.dataset.bound) {
        reset.dataset.bound = "true";
        reset.addEventListener("click", resetMaterials);
    }
}

function customOptionClass(part, id) {
    const active = customMaterialState[part] === id;
    return `group relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-[10px] font-semibold uppercase transition ${active ? "border-[#2b0f84] ring-4 ring-[#2b0f84]/15" : "border-slate-200 text-slate-600 hover:border-[#2b0f84]/60"
        }`;
}

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
        const l = document.createElement("span");
        l.textContent = opt.shortLabel?.slice(0, 3).toUpperCase() || "ORG";
        l.className = "pointer-events-none text-[10px] font-semibold tracking-wide text-slate-600";
        btn.appendChild(l);
    }
}

function updateMaterialButtons(part) {
    (customMaterialButtons[part] || []).forEach(btn => {
        btn.className = customOptionClass(part, btn.dataset.value);
        btn.setAttribute("aria-pressed", customMaterialState[part] === btn.dataset.value);
    });
}

function resetCustomMaterialSelections() {
    Object.keys(customMaterialState).forEach(part => {
        customMaterialState[part] = "preset";
        updateMaterialButtons(part);
    });
}

function applyMaterialSelection(part, id) {
    const opt = (customMaterialOptions[part] || []).find(o => o.id === id);
    if (!opt || !viewerInstance) return;

    if (opt.kind === "original") return viewerInstance.setCustomMaterial(part, { mode: "original" });

    if (opt.kind === "material") {
        const entry = materialLibrary[id];
        if (entry?.material) viewerInstance.setCustomMaterial(part, { mode: "material", material: entry.material });
    }
}

function resetMaterials() {
    Object.keys(customMaterialState).forEach(part => {
        customMaterialState[part] = "preset";
        updateMaterialButtons(part);
    });
    viewerInstance?.clearAllCustomMaterials?.();
}

/* -------------------------
   Reviews
   ------------------------- */
function createReviewCard(r) {
    const slide = document.createElement("div");
    slide.className = "review-slide w-full shrink-0 px-2 lg:w-1/2";

    const card = document.createElement("article");
    card.className = "flex h-full flex-col gap-4 rounded-3xl border border-slate-100 bg-white/90 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.6)]";

    const header = document.createElement("div");
    header.className = "flex flex-wrap items-center justify-between gap-3";

    const author = document.createElement("div");
    author.className = "space-y-1";
    author.innerHTML = `<p class='text-base font-semibold text-slate-900'>${r.author || "Anónimo"}</p><p class='text-xs font-semibold tracking-[0.3em] text-slate-400'>COMPRA VERIFICADA</p>`;

    const date = document.createElement("p");
    date.className = "text-sm text-slate-500";
    date.textContent = r.date;

    header.append(author, date);

    const rating = document.createElement("div");
    rating.className = "flex items-center gap-2 text-amber-500";
    rating.append(makeStars(r.rating));
    const badge = document.createElement("span");
    badge.className = "ml-auto rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800";
    badge.textContent = `${r.rating}.0`;
    rating.appendChild(badge);

    const title = document.createElement("h3");
    title.className = "text-xl font-semibold text-slate-900";
    title.textContent = r.title;

    const content = document.createElement("p");
    content.className = "text-sm leading-relaxed text-slate-600";
    content.textContent = r.content;

    card.append(header, rating, title, content);
    slide.appendChild(card);
    return slide;
}

function renderReviews() {
    const track = $("reviews-slider-track");
    track.innerHTML = "";
    const frag = document.createDocumentFragment();
    reviews.forEach(r => frag.appendChild(createReviewCard(r)));
    track.appendChild(frag);
}

/* -------------------------
   Sugestões
   ------------------------- */
function renderSuggestedProducts() {
    const c = $("suggested-products");
    c.innerHTML = "";

    const frag = document.createDocumentFragment();

    suggestedProducts.forEach(p => {
        const card = document.createElement("article");
        card.className = "flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md";

        const imgWrap = document.createElement("div");
        imgWrap.className = "overflow-hidden rounded-xl bg-slate-100";
        const img = document.createElement("img");
        img.src = p.image;
        img.alt = p.title;
        img.className = "h-24 w-24 object-cover";
        img.loading = "lazy";
        imgWrap.appendChild(img);

        const content = document.createElement("div");
        content.className = "flex-1 space-y-2";

        const badge = document.createElement("span");
        badge.className = "inline-flex items-center gap-1 rounded-full bg-[#0fa5b8]/10 px-3 py-1 text-xs font-semibold text-[#0f5a7a]";
        badge.textContent = p.badge;

        const title = document.createElement("h3");
        title.className = "text-base font-semibold text-slate-900";
        title.textContent = p.title;

        const desc = document.createElement("p");
        desc.className = "text-sm text-slate-600";
        desc.textContent = p.description;

        const footer = document.createElement("div");
        footer.className = "flex items-center justify-between text-sm";
        const price = document.createElement("span");
        price.className = "text-lg font-semibold text-slate-900";
        price.textContent = p.price;
        const btn = document.createElement("button");
        btn.className = "text-sm font-semibold text-[#2b0f84] hover:underline";
        btn.textContent = "Ver detalhes";
        footer.append(price, btn);

        content.append(badge, title, desc, footer);
        card.append(imgWrap, content);
        frag.appendChild(card);
    });

    c.appendChild(frag);
}

/* -------------------------
   Slider
   ------------------------- */
function setupSlider() {
    const track = $("reviews-slider-track");
    if (!track) return;
    track.style.transition = "transform 0.8s ease";

    const resize = () => {
        slidesPerView = window.innerWidth >= 1024 ? 2 : 1;
        currentSlide = 0;
        updateSlider();
        startAutoPlay();
    };

    window.addEventListener("resize", resize);
    resize();
}

function updateSlider() {
    const wrapper = $("reviews-slider-wrapper");
    const track = $("reviews-slider-track");
    const step = wrapper.clientWidth / slidesPerView;
    track.style.transform = `translateX(-${currentSlide * step}px)`;
}

function startAutoPlay() {
    clearInterval(sliderInterval);
    sliderInterval = setInterval(() => {
        const maxIndex = Math.max(0, reviews.length - slidesPerView);
        currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
        updateSlider();
    }, 4500);
}

/* -------------------------
   Share & Wishlist
   ------------------------- */
function applyWishlistVisuals(active) {
    const buttons = document.querySelectorAll("[data-action='wishlist']");
    buttons.forEach(btn => {
        btn.setAttribute("aria-pressed", String(active));
        btn.setAttribute("aria-label", active ? "Remover dos favoritos" : "Adicionar aos favoritos");
        btn.classList.toggle("text-[#ef3f6b]", active);

        const icon = btn.querySelector("i");
        if (icon) {
            icon.classList.remove("fa-solid", "fa-regular");
            icon.classList.add(active ? "fa-solid" : "fa-regular");
            icon.classList.add("fa-heart");
        }
    });

    const badge = document.querySelector("[data-nav-count='favorites']");
    if (badge) {
        badge.textContent = active ? "1" : "0";
        badge.classList.toggle("bg-[#ef3f6b]", active);
        badge.classList.toggle("text-white", active);
        badge.classList.toggle("bg-slate-200", !active);
        badge.classList.toggle("text-slate-600", !active);
    }

    const navHeart = document.querySelector("[data-nav-heart='true']");
    if (navHeart) {
        navHeart.classList.toggle("border-[#ef3f6b]", active);
        navHeart.classList.toggle("text-[#ef3f6b]", active);
        navHeart.classList.toggle("border-slate-200", !active);
        navHeart.classList.toggle("text-slate-400", !active);
        navHeart.style.backgroundColor = active ? "rgba(239,63,107,0.12)" : "";
        navHeart.setAttribute("aria-label", active ? "1 favorito" : "0 favoritos");

        const navIcon = navHeart.querySelector("[data-nav-heart-icon='true']");
        if (navIcon) {
            navIcon.classList.remove("fa-solid", "fa-regular");
            navIcon.classList.add(active ? "fa-solid" : "fa-regular");
            navIcon.classList.add("fa-heart");
        }
    }
}

function setWishlistActive(active) {
    wishlistActive = active;
    applyWishlistVisuals(active);
}

function initShareButtons() {
    document.querySelectorAll("[data-action='share']").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: "Gira-discos Vinil", url: location.href });
                } catch { }
            } else {
                try {
                    await navigator.clipboard?.writeText(location.href);
                    btn.dataset.state = "copied";
                    setTimeout(() => btn.removeAttribute("data-state"), 1500);
                } catch { }
            }
        });
    });
}

function initWishlistButtons() {
    const buttons = document.querySelectorAll("[data-action='wishlist']");
    if (!buttons.length) {
        wishlistActive = false;
        return;
    }

    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            setWishlistActive(!wishlistActive);
        });
    });

    setWishlistActive(false);
}

function setCartCount(count) {
    cartCount = Math.max(0, count);
    const badge = document.querySelector("[data-nav-count='cart']");
    const navBtn = document.querySelector("[data-nav-control='cart']");
    const active = cartCount > 0;

    if (badge) {
        badge.textContent = String(cartCount);
        badge.classList.toggle("bg-[#2b0f84]", active);
        badge.classList.toggle("text-white", active);
        badge.classList.toggle("bg-slate-200", !active);
        badge.classList.toggle("text-slate-600", !active);
    }

    if (navBtn) {
        navBtn.style.borderColor = active ? "#2b0f84" : "";
        navBtn.style.backgroundColor = active ? "rgba(43,15,132,0.08)" : "";
        navBtn.style.color = active ? "#2b0f84" : "";
        const label = cartCount === 1 ? "1 item no carrinho" : `${cartCount} itens no carrinho`;
        navBtn.setAttribute("aria-label", label);

        const navIcon = navBtn.querySelector("[data-nav-cart-icon='true']");
        if (navIcon) {
            navIcon.classList.remove("fa-regular");
            navIcon.classList.add("fa-solid", "fa-cart-shopping");
        }
    }
}

function initAddToCartButton() {
    const btn = document.querySelector("[data-action='add-to-cart']");
    if (!btn) return;

    btn.addEventListener("click", () => {
        setCartCount(cartCount + 1);
    });
}

/* -------------------------
   Init
   ------------------------- */
function initApp() {
    initViewer();
    renderPresetButtons();
    renderCustomMaterialControls();
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
    setCartCount(0);
    initAddToCartButton();
}

document.addEventListener("DOMContentLoaded", initApp);
