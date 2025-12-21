import { highlights } from "../lib/data.js";
import { $ } from "../core/dom.js";

export function renderHighlights() {
    const list = $("highlights-list");
    if (!list) return;

    list.innerHTML = "";

    const fragment = document.createDocumentFragment();
    highlights.forEach((text) => {
        const item = document.createElement("li");
        item.className = "flex items-start gap-2";

        const dot = document.createElement("span");
        dot.className = "mt-1 size-1.5 rounded-full bg-[#2b0f84]";

        const content = document.createElement("span");
        content.textContent = text;

        item.append(dot, content);
        fragment.appendChild(item);
    });

    list.appendChild(fragment);
}
