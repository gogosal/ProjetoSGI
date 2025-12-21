import { badges } from "../lib/data.js";
import { $ } from "../core/dom.js";

const ICON_CLASSES = {
    "shield-check": "fa-solid fa-shield",
    truck: "fa-solid fa-truck-arrow-right",
    "rotate-ccw": "fa-solid fa-rotate-left",
};

function makeIcon(name) {
    const icon = document.createElement("i");
    icon.className = `${ICON_CLASSES[name] || ""} text-[1rem] text-[#2b0f84]`.trim();
    icon.setAttribute("aria-hidden", "true");
    return icon;
}

export function renderBadges() {
    const container = $("badges-list");
    if (!container) return;

    container.innerHTML = "";
    const fragment = document.createDocumentFragment();

    badges.forEach(({ icon, label }) => {
        const badge = document.createElement("span");
        badge.className = "flex items-center gap-2";
        badge.append(makeIcon(icon), label);
        fragment.appendChild(badge);
    });

    container.appendChild(fragment);
}
