const ICON_CLASSNAMES = {
    heart: "fa-regular fa-heart",
    "heart-filled": "fa-solid fa-heart",
    "message-circle": "fa-solid fa-circle-info",
    share: "fa-solid fa-share",
    "shopping-cart": "fa-solid fa-cart-shopping",
    "shopping-cart-filled": "fa-solid fa-cart-shopping",
    star: "fa-solid fa-star",
    "star-outline": "fa-regular fa-star",
    "shield-check": "fa-solid fa-shield",
    truck: "fa-solid fa-truck-arrow-right",
    "rotate-ccw": "fa-solid fa-rotate-left",
};

export function createIcon(name, { className = "", size } = {}) {
    const baseClasses = ICON_CLASSNAMES[name];
    const element = document.createElement("i");
    if (!baseClasses) return element;

    const classes = `${baseClasses}${className ? ` ${className}` : ""}`;
    element.setAttribute("class", classes);
    element.setAttribute("aria-hidden", "true");
    if (size) {
        element.style.fontSize = typeof size === "number" ? `${size}px` : size;
    }

    return element;
}
