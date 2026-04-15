const favoriteKey = "tangshan-fishing-guide:favorites";
let deferredInstallPrompt = null;

function readFavorites() {
  try {
    return new Set(JSON.parse(localStorage.getItem(favoriteKey) || "[]"));
  } catch {
    return new Set();
  }
}

function writeFavorites(favorites) {
  localStorage.setItem(favoriteKey, JSON.stringify([...favorites]));
}

function syncFavoriteButtons() {
  const favorites = readFavorites();

  document.querySelectorAll("[data-favorite-id]").forEach((button) => {
    const id = button.getAttribute("data-favorite-id");
    const active = favorites.has(id);
    button.setAttribute("data-active", active ? "true" : "false");
    button.setAttribute("aria-pressed", active ? "true" : "false");
    const label = active ? "已收藏" : "收藏";
    button.querySelector("[data-favorite-label]")?.replaceChildren(label);
  });
}

function bindFavoriteButtons() {
  document.querySelectorAll("[data-favorite-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const favorites = readFavorites();
      const id = button.getAttribute("data-favorite-id");

      if (!id) {
        return;
      }

      if (favorites.has(id)) {
        favorites.delete(id);
      } else {
        favorites.add(id);
      }

      writeFavorites(favorites);
      syncFavoriteButtons();
    });
  });
}

function bindShareButtons() {
  document.querySelectorAll("[data-share-url]").forEach((button) => {
    button.addEventListener("click", async () => {
      const shareUrl = button.getAttribute("data-share-url");
      const shareTitle = button.getAttribute("data-share-title") || document.title;
      const fullUrl = new URL(shareUrl || window.location.href, window.location.href).href;

      if (navigator.share) {
        try {
          await navigator.share({
            title: shareTitle,
            url: fullUrl
          });
          return;
        } catch {
          // Fall through to clipboard.
        }
      }

      try {
        await navigator.clipboard.writeText(fullUrl);
        button.querySelector("[data-share-label]")?.replaceChildren("链接已复制");
        window.setTimeout(() => {
          button.querySelector("[data-share-label]")?.replaceChildren("分享");
        }, 1600);
      } catch {
        window.open(fullUrl, "_blank", "noopener");
      }
    });
  });
}

function bindBackToTop() {
  const button = document.querySelector("[data-back-top]");

  if (!button) {
    return;
  }

  const toggleVisibility = () => {
    button.hidden = window.scrollY < 640;
  };

  toggleVisibility();
  window.addEventListener("scroll", toggleVisibility, { passive: true });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function bindInstallButtons() {
  const triggers = document.querySelectorAll("[data-install-trigger]");

  if (!triggers.length) {
    return;
  }

  const setReadyState = (ready) => {
    triggers.forEach((button) => {
      button.hidden = !ready;
    });
  };

  setReadyState(false);

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    setReadyState(true);
  });

  triggers.forEach((button) => {
    button.addEventListener("click", async () => {
      if (!deferredInstallPrompt) {
        return;
      }

      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      setReadyState(false);
    });
  });
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator) || window.location.protocol === "file:") {
    return;
  }

  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register(new URL("../sw.js", import.meta.url));
    } catch {
      // Ignore registration failures in local development.
    }
  });
}

function updateTimestamp() {
  const nodes = document.querySelectorAll("[data-generated-at]");
  const generatedAt = document.body.getAttribute("data-generated-at");

  if (!generatedAt || !nodes.length) {
    return;
  }

  const formatted = generatedAt.replace(/-/g, ".");
  nodes.forEach((node) => {
    node.textContent = formatted;
  });
}

syncFavoriteButtons();
bindFavoriteButtons();
bindShareButtons();
bindBackToTop();
bindInstallButtons();
registerServiceWorker();
updateTimestamp();
