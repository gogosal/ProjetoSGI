import { setCart, cartCount } from "../core/state.js";

// ============================
// Atualiza contador e visual do carrinho
// ============================
export function setCartCount(value) {
    setCart(value);
    const count = cartCount;
    const badge = document.querySelector("[data-nav-count='cart']");
    const navButton = document.querySelector("[data-nav-control='cart']");
    const active = count > 0;

    // ============================
    // Atualiza badge do carrinho
    // ============================
    if (badge) {
        badge.textContent = String(count);
        badge.classList.toggle("bg-[#2b0f84]", active);
        badge.classList.toggle("text-white", active);
        badge.classList.toggle("bg-slate-200", !active);
        badge.classList.toggle("text-slate-600", !active);
    }

    // ============================
    // Atualiza botão do carrinho na navegação
    // ============================
    if (navButton) {
        navButton.style.borderColor = active ? "#2b0f84" : "";
        navButton.style.backgroundColor = active ? "rgba(43,15,132,0.08)" : "";
        navButton.style.color = active ? "#2b0f84" : "";

        const label = count === 1 ? "1 item no carrinho" : `${count} itens no carrinho`;
        navButton.setAttribute("aria-label", label);

        const icon = navButton.querySelector("[data-nav-cart-icon='true']");
        if (icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid", "fa-cart-shopping");
        }
    }
}

// ============================
// Inicializa botão de "Adicionar ao carrinho"
// ============================
export function initAddToCartButton() {
    const button = document.querySelector("[data-action='add-to-cart']");
    if (!button) return;

    button.addEventListener("click", () => {
        setCartCount(cartCount + 1);
    });
}
