import { PRICE } from "../config/produto.config.js";
import { $ } from "../core/dom.js";

export function renderPriceInfo() {
    $("price-current").textContent = PRICE.current;
    $("price-previous").textContent = PRICE.previous;
    $("price-discount").textContent = PRICE.discount;
}
