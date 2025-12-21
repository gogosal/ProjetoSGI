import { suggestedProducts } from "../lib/data.js";
import { $ } from "../core/dom.js";

export function renderSuggestedProducts() {
    const container = $("suggested-products");
    if (!container) return;

    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    suggestedProducts.forEach((product) => {
        const card = document.createElement("article");
        card.className = "flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md";

        const imageWrapper = document.createElement("div");
        imageWrapper.className = "overflow-hidden rounded-xl bg-slate-100";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;
        image.className = "h-24 w-24 object-cover";
        image.loading = "lazy";
        imageWrapper.appendChild(image);

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

        const price = document.createElement("span");
        price.className = "text-lg font-semibold text-slate-900";
        price.textContent = product.price;

        const button = document.createElement("button");
        button.className = "text-sm font-semibold text-[#2b0f84] hover:underline";
        button.textContent = "Ver detalhes";

        footer.append(price, button);
        content.append(badge, title, description, footer);
        card.append(imageWrapper, content);
        fragment.appendChild(card);
    });

    container.appendChild(fragment);
}
