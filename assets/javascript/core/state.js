// ============================
// Estado global do viewer
// ============================
export let viewerInstance = null;

// ============================
// Estado global da wishlist
// ============================
export let wishlistActive = false;

// ============================
// Estado global do carrinho
// ============================
export let cartCount = 0;

// ============================
// Estado e controles de materiais customizados
// ============================
export const customMaterialState = {};
export const customMaterialButtons = {};
export const customMaterialCombobox = {};

// ============================
// Funções para atualizar estados globais
// ============================
export function setViewer(instance) {
    viewerInstance = instance;
}

export function setWishlistState(value) {
    wishlistActive = value;
}

export function setCart(value) {
    cartCount = Math.max(0, value);
}
