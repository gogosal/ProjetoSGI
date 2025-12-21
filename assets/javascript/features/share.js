export function initShareButtons() {
    document.querySelectorAll("[data-action='share']").forEach((btn) => {
        btn.addEventListener("click", async () => {
            if (navigator.share) {
                try {
                    await navigator.share({ title: document.title, url: location.href });
                } catch {
                    // Ignorar cancelamentos do utilizador
                }
                return;
            }

            try {
                await navigator.clipboard?.writeText(location.href);
                btn.dataset.state = "copied";
                setTimeout(() => btn.removeAttribute("data-state"), 1500);
            } catch {
                // Sem clipboard, não há feedback adicional
            }
        });
    });
}
