import { initViewer } from "./core/viewer.js";
import { renderPresetButtons } from "./features/presets.js";
import { renderCustomMaterialControls } from "./features/customMaterials.js";
import { renderHighlights } from "./ui/highlights.js";
import { renderBadges } from "./ui/badges.js";
import { renderPriceInfo } from "./ui/price.js";
import { renderRatingSummary, renderRatingBreakdown } from "./features/rating.js";
import { renderShippingOptions } from "./features/shipping.js";
import { renderReviews } from "./features/reviews.js";
import { setupSlider } from "./features/slider.js";
import { initShareButtons } from "./features/share.js";
import { initWishlistButtons } from "./features/wishlist.js";
import { initAddToCartButton, setCartCount } from "./features/cart.js";
import { renderSuggestedProducts } from "./ui/suggestedProducts.js";

function initApp() {
    initViewer();
    renderCustomMaterialControls();
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
    setCartCount(0);
    initAddToCartButton();
}

document.addEventListener("DOMContentLoaded", initApp);
