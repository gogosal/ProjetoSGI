const FOOTER_PARTIAL_PATH = "./partials/footer.html";

async function injectSharedFooter() {
    const footerRoot = document.querySelector("[data-footer-root]");
    if (!footerRoot) return;

    try {
        const response = await fetch(FOOTER_PARTIAL_PATH);
        if (!response.ok) {
            throw new Error(`Footer fetch failed: ${response.status}`);
        }

        const footerMarkup = await response.text();
        footerRoot.innerHTML = footerMarkup;

        const currentYear = new Date().getFullYear();
        footerRoot.querySelectorAll("[data-footer-year]").forEach((el) => {
            el.textContent = currentYear;
        });
    } catch (error) {
        console.error("Não foi possível carregar o footer partilhado.", error);
        footerRoot.innerHTML = `
            <footer class="border-t bg-white">
                <div class="mx-auto max-w-6xl px-4 py-6 text-sm text-slate-600">
                    <p class="text-center">© ${new Date().getFullYear()} La Redoute. Footer não disponível.</p>
                </div>
            </footer>
        `;
    }
}

document.addEventListener("DOMContentLoaded", injectSharedFooter);
