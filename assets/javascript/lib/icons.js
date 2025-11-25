const ICON_PATHS = {
    "arrow-right": [
        { tag: "line", attrs: { x1: "5", y1: "12", x2: "19", y2: "12" } },
        { tag: "polyline", attrs: { points: "12 5 19 12 12 19" } },
    ],
    heart: [
        {
            tag: "path",
            attrs: {
                d: "M19 14c0 5-7 9-7 9s-7-4-7-9a4 4 0 0 1 7-3 4 4 0 0 1 7 3z",
            },
        },
    ],
    "message-circle": [
        {
            tag: "path",
            attrs: {
                d: "M21 11.5a8.38 8.38 0 0 1-9 8.44A8.5 8.5 0 0 1 3 11.5 8.38 8.38 0 0 1 12 3a8.38 8.38 0 0 1 9 8.5Z",
            },
        },
        { tag: "polyline", attrs: { points: "8 11 12 11 12 15" } },
    ],
    share2: [
        { tag: "circle", attrs: { cx: "18", cy: "5", r: "3" } },
        { tag: "circle", attrs: { cx: "6", cy: "12", r: "3" } },
        { tag: "circle", attrs: { cx: "18", cy: "19", r: "3" } },
        { tag: "line", attrs: { x1: "8.59", y1: "13.51", x2: "15.42", y2: "17.49" } },
        { tag: "line", attrs: { x1: "15.41", y1: "6.51", x2: "8.59", y2: "10.49" } },
    ],
    "shopping-cart": [
        { tag: "circle", attrs: { cx: "9", cy: "21", r: "1" } },
        { tag: "circle", attrs: { cx: "20", cy: "21", r: "1" } },
        { tag: "path", attrs: { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" } },
    ],
    star: [
        {
            tag: "polygon",
            attrs: {
                points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21 12 17.77 5.82 21 7 14.14 2 9.27 8.91 8.26 12 2",
            },
        },
    ],
    "shield-check": [
        {
            tag: "path",
            attrs: {
                d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
            },
        },
        { tag: "path", attrs: { d: "m9 12 2 2 4-4" } },
    ],
    truck: [
        { tag: "path", attrs: { d: "M3 4h13v13H3z" } },
        { tag: "path", attrs: { d: "M16 8h5l1 4v5h-6" } },
        { tag: "circle", attrs: { cx: "7.5", cy: "17.5", r: "1.5" } },
        { tag: "circle", attrs: { cx: "17.5", cy: "17.5", r: "1.5" } },
    ],
    "rotate-ccw": [
        { tag: "polyline", attrs: { points: "1 4 1 10 7 10" } },
        { tag: "path", attrs: { d: "M3.51 15a9 9 0 1 0 .49-9.5L1 10" } },
    ],
};

export function createIcon(name, { className = "", size = 20, stroke = "currentColor", fill = "none" } = {}) {
    const paths = ICON_PATHS[name];
    if (!paths) return document.createElement("span");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", fill);
    svg.setAttribute("stroke", stroke);
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    if (className) svg.setAttribute("class", className);

    paths.forEach(({ tag, attrs }) => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
        svg.appendChild(el);
    });

    return svg;
}
