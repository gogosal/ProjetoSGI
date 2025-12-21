import { $ } from "../core/dom.js";
import { reviews } from "../lib/data.js";

// ============================
// Variáveis de controle do slider
// ============================
let sliderInterval = null;
let slidesPerView = 1;
let currentSlide = 0;

// ============================
// Inicializa o slider de reviews
// ============================
export function setupSlider() {
    const track = $("reviews-slider-track");
    if (!track) return;

    // ============================
    // Define transição suave
    // ============================
    track.style.transition = "transform 0.8s ease";

    // ============================
    // Função de resize para ajustar slides por view
    // ============================
    const handleResize = () => {
        slidesPerView = window.innerWidth >= 1024 ? 2 : 1; // 2 slides em telas grandes, 1 em pequenas
        currentSlide = 0;
        updateSlider();
        startAutoPlay();
    };

    // ============================
    // Adiciona listener de resize e executa imediatamente
    // ============================
    window.addEventListener("resize", handleResize);
    handleResize();
}

// ============================
// Atualiza a posição do slider
// ============================
function updateSlider() {
    const wrapper = $("reviews-slider-wrapper");
    const track = $("reviews-slider-track");
    if (!wrapper || !track) return;

    // ============================
    // Calcula deslocamento e aplica transform
    // ============================
    const firstSlide = track.querySelector(".review-slide");
    const step = firstSlide ? firstSlide.offsetWidth : wrapper.clientWidth / slidesPerView;
    track.style.transform = `translateX(-${currentSlide * step}px)`;
}

// ============================
// Inicia autoplay do slider
// ============================
function startAutoPlay() {
    clearInterval(sliderInterval);

    sliderInterval = setInterval(() => {
        const maxIndex = Math.max(0, reviews.length - slidesPerView);

        // ============================
        // Avança slide ou reinicia
        // ============================
        currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
        updateSlider();
    }, 4500); // muda a cada 4.5s
}
