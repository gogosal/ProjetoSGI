import { setWishlistState, wishlistActive } from "../core/state.js";

// ============================
// Aplica visuais do estado da wishlist
// ============================
function applyWishlistVisuals(active) {
    // ============================
    // Atualiza botões de wishlist
    // ============================
    document.querySelectorAll("[data-action='wishlist']").forEach((btn) => {
        btn.setAttribute("aria-pressed", String(active));
        btn.setAttribute(
            "aria-label",
            active ? "Remover dos favoritos" : "Adicionar aos favoritos"
        );
        btn.classList.toggle("text-[#ef3f6b]", active);

        const icon = btn.querySelector("i");
        if (icon) {
            icon.classList.remove("fa-solid", "fa-regular");
            icon.classList.add(active ? "fa-solid" : "fa-regular", "fa-heart");
        }
    });

    // ============================
    // Atualiza badge de favoritos na navegação
    // ============================
    const favoritesBadge = document.querySelector("[data-nav-count='favorites']");
    if (favoritesBadge) {
        favoritesBadge.textContent = active ? "1" : "0";
        favoritesBadge.classList.toggle("bg-[#ef3f6b]", active);
        favoritesBadge.classList.toggle("text-white", active);
        favoritesBadge.classList.toggle("bg-slate-200", !active);
        favoritesBadge.classList.toggle("text-slate-600", !active);
    }

    // ============================
    // Atualiza ícone de coração no menu de navegação
    // ============================
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
            navIcon.classList.add(active ? "fa-solid" : "fa-regular", "fa-heart");
        }
    }
}

// ============================
// Define estado da wishlist e atualiza visuais
// ============================
function setWishlistActive(active) {
    setWishlistState(active);
    applyWishlistVisuals(active);
}

// ============================
// Inicializa os botões de wishlist
// ============================
export function initWishlistButtons() {
    const buttons = document.querySelectorAll("[data-action='wishlist']");
    if (!buttons.length) {
        setWishlistState(false);
        return;
    }

    // ============================
    // Adiciona listener de clique a cada botão
    // ============================
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const next = !wishlistActive;
            setWishlistActive(next);
        });
    });

    // ============================
    // Inicializa estado da wishlist como desativado
    // ============================
    setWishlistActive(false);
}
