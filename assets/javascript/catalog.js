const catalogProducts = [
    {
        id: "turntable",
        image: "./assets/images/GiraDiscos.png",
        imageAlt: "Pré-visualização estilizada de um gira-discos premium",
        tagText: "Disponível",
        tagClass: "text-[#0fa5b8]",
        title: "Gira-discos Vinil",
        description:
            " Prato em alumínio fundido com amortecimento anti-ressonância, Braço em carbono com contrapeso e anti-skating ajustáveis, Pré-amplificador phono integrado com saídas RCA e Bluetooth 5.3 ...",
        price: "349,00€",
        priceOld: "399,00€",
        statusText: null,
        statusClass: "",
        active: true,
        ctaLabel: "Aceder ao produto",
        ctaHref: "produto.html",
    },
    {
        id: "speaker",
        image: "./assets/images/Mesa1.jpg",
        imageAlt: "Mesa de cabeceira, Volga",
        tagText: "Concept store",
        tagClass: "text-slate-400",
        title: "Mesa de cabeceira, Volga",
        description: "A mesa de cabeceira Volga carateriza-se pelas linhas direitas e elegantes. Adoramos a combinação das matérias, madeira e aço. Vai encontrar facilmente o seu lugar num quarto.",
        price: "90,55€",
        priceOld: null,
        statusText: "Em validação",
        statusClass: "text-sm text-emerald-500",
        active: false,
        ctaLabel: "Em breve",
    },
    {
        id: "amplifier",
        image: "./assets/images/Mesa2.jpg",
        imageAlt: "Mesa de cabeceira para pendurar, 1 gaveta, em carvalho maciço, Paul",
        tagText: "Concept store",
        tagClass: "text-slate-400",
        title: "Mesa de cabeceira para pendurar, 1 gaveta, em carvalho maciço, Paul",
        description: "A mesinha de cabeceira Paul. Para usar só ou em sobreposição, esta mesa de cabeceira-gaveta fixa-se na parede com toda a discrição.",
        price: "89,38€",
        priceOld: null,
        statusText: "Em validação",
        statusClass: "text-sm text-emerald-500",
        active: false,
        ctaLabel: "Em breve",
    },
    {
        id: "stand",
        image: "./assets/images/Mesa3.jpg",
        imageAlt: "Mesa de cabeceira vintage, tampo duplo, Quilda",
        tagText: "Concept store",
        tagClass: "text-slate-400",
        title: "Mesa de cabeceira vintage, tampo duplo, Quilda",
        description: "Mesa de cabeceira vintage, tampo duplo Quilda. Modelo vintage e carvalho, eis uma combinação de todos os fãs de design. Tampo duplo: mesa de cabeceira ou mesa de apoio.",
        price: "71,27€",
        priceOld: null,
        statusText: "Em validação",
        statusClass: "text-sm text-emerald-500",
        active: false,
        ctaLabel: "Em breve",
    },
    {
        id: "cables",
        image: "./assets/images/Mesa4.jpg",
        imageAlt: "Mesa de cabeceira em metal aço, Alessio",
        tagText: "Concept store",
        tagClass: "text-slate-400",
        title: "Mesa de cabeceira em metal aço, Alessio",
        description: "Estilo industrial e design contemporâneo. A Alessio tem um tampo duplo em semicírculo e pode ser usada dos dois lados. Um mobiliário funcional e criativo.",
        price: "95,20€",
        priceOld: null,
        statusText: "Em validação",
        statusClass: "text-sm text-emerald-500",
        active: false,
        ctaLabel: "Em breve",
    },
    {
        id: "cleaner",
        image: "./assets/images/Mesa5.jpg",
        imageAlt: "Mesa de cabeceira de parede, TRIGALA",
        tagText: "Concept store",
        tagClass: "text-slate-400",
        title: "Mesa de cabeceira de parede, TRIGALA",
        description: "A mesa de cabeceira de parede, Trigala. A aliança da madeira e do metal para esta mesa de cabeceira com um design simples.",
        price: "73,57€",
        priceOld: null,
        statusText: "Em validação",
        statusClass: "text-sm text-emerald-500",
        active: false,
        ctaLabel: "Em breve",
    },
];

function createProductCard(product) {
    const article = document.createElement("article");
    const toneClass = product.active ? "bg-white" : "bg-white/90";
    article.className =
        `group flex flex-col overflow-hidden rounded-[24px] border border-slate-200 ${toneClass} ` +
        "shadow-[0_25px_60px_-45px_rgba(15,23,42,0.7)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_35px_70px_-40px_rgba(15,23,42,0.6)]";

    if (product.image) {
        article.appendChild(createProductPreview(product));
    }

    const body = document.createElement("div");
    body.className = "flex flex-1 flex-col gap-3 px-5 pb-5 pt-4";

    const tag = document.createElement("p");
    tag.className = `text-[11px] font-semibold uppercase tracking-[0.35em] ${product.tagClass}`;
    tag.textContent = product.tagText;

    const title = document.createElement("h3");
    title.className = "text-xl font-semibold text-slate-900";
    title.textContent = product.title;

    const description = document.createElement("p");
    description.className = "text-sm leading-relaxed text-slate-600";
    description.textContent = product.description;

    const priceRow = document.createElement("div");
    priceRow.className = "mt-1 flex items-baseline gap-2 text-slate-900";

    const currentPrice = document.createElement("span");
    currentPrice.className = "text-2xl font-semibold";
    currentPrice.textContent = product.price;
    priceRow.appendChild(currentPrice);

    if (product.priceOld) {
        const previousPrice = document.createElement("span");
        previousPrice.className = "text-xs text-slate-400 line-through";
        previousPrice.textContent = product.priceOld;
        priceRow.appendChild(previousPrice);
    }

    if (product.statusText) {
        const status = document.createElement("span");
        status.className = product.statusClass;
        status.textContent = product.statusText;
        priceRow.appendChild(status);
    }

    const actions = document.createElement("div");
    actions.className = "mt-4 flex flex-col gap-2";

    if (product.active) {
        const link = document.createElement("a");
        link.href = product.ctaHref;
        link.className =
            "inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#2b0f84] px-5 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-[#3a1cb0]";
        link.textContent = product.ctaLabel;
        link.appendChild(createArrowIcon());
        actions.appendChild(link);
    } else {
        const button = document.createElement("button");
        button.type = "button";
        button.disabled = true;
        button.className =
            "inline-flex h-11 items-center justify-center rounded-2xl border border-dashed border-slate-300 px-5 text-sm font-semibold uppercase tracking-wide text-slate-400";
        button.textContent = product.ctaLabel;
        actions.appendChild(button);
    }

    body.append(tag, title, description, priceRow, actions);
    article.appendChild(body);
    return article;
}

function createProductPreview(product) {
    const figure = document.createElement("figure");
    figure.className = "relative aspect-[5/3] w-full overflow-hidden bg-slate-100";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.imageAlt || product.title;
    img.className = "h-full w-full object-cover transition duration-300 group-hover:scale-[1.05]";
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100";

    figure.append(img, overlay);
    return figure;
}

function createArrowIcon() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.5");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.classList.add("size-4");

    const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path1.setAttribute("d", "M5 12h14");
    const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path2.setAttribute("d", "M12 5l7 7-7 7");

    svg.append(path1, path2);
    return svg;
}

(function renderCatalog() {
    const catalogGrid = document.getElementById("catalog-grid");
    if (!catalogGrid) return;

    catalogProducts.forEach((product) => {
        const card = createProductCard(product);
        catalogGrid.appendChild(card);
    });
})();
