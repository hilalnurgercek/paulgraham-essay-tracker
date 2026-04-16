(async () => {
  const FAVORITE_STORAGE_KEY = "favoriteEssayUrls";
  const FAVORITE_HIGHLIGHT_COLOR = "#fff3a0";
  const pageUrl = "https://paulgraham.com/articles.html";

  if (window.location.href !== pageUrl) {
    return;
  }

  const links = Array.from(document.querySelectorAll('a[href]')).filter((link) => {
    const href = link.getAttribute("href");
    if (!href) return false;
    if (href === "index.html" || href === "rss.html") return false;
    if (href.startsWith("#")) return false;
    return (
      href.endsWith(".html") ||
      href.startsWith("http://") ||
      href.startsWith("https://")
    );
  });

  const essayLinks = [];
  const starsByUrl = new Map();
  const linksByUrl = new Map();

  for (const link of links) {
    const absoluteUrl = new URL(link.getAttribute("href"), location.href).href;
    const text = (link.textContent || "").trim();

    if (!text) continue;
    if (absoluteUrl === pageUrl) continue;
    essayLinks.push({ link, absoluteUrl });
  }

  const stored = await chrome.storage.local.get(FAVORITE_STORAGE_KEY);
  const favoriteEssayUrls = stored[FAVORITE_STORAGE_KEY] || {};

  const applyFavoriteStyle = (essayLink, isFavorite) => {
    essayLink.style.backgroundColor = isFavorite ? FAVORITE_HIGHLIGHT_COLOR : "";
    essayLink.style.padding = isFavorite ? "0 2px" : "";
  };

  for (const { link, absoluteUrl } of essayLinks) {
    if (!linksByUrl.has(absoluteUrl)) {
      linksByUrl.set(absoluteUrl, []);
    }
    linksByUrl.get(absoluteUrl).push(link);

    const starButton = document.createElement("button");
    starButton.type = "button";
    starButton.style.marginRight = "8px";
    starButton.style.border = "none";
    starButton.style.background = "transparent";
    starButton.style.padding = "0";
    starButton.style.cursor = "pointer";
    starButton.style.verticalAlign = "middle";
    starButton.title = "Mark essay as extraordinary";

    if (!starsByUrl.has(absoluteUrl)) {
      starsByUrl.set(absoluteUrl, []);
    }
    starsByUrl.get(absoluteUrl).push(starButton);

    const setFavoriteUi = (isFavorite) => {
      for (const relatedStar of starsByUrl.get(absoluteUrl) || []) {
        relatedStar.textContent = isFavorite ? "★" : "☆";
      }
      for (const relatedLink of linksByUrl.get(absoluteUrl) || []) {
        applyFavoriteStyle(relatedLink, isFavorite);
      }
    };

    setFavoriteUi(Boolean(favoriteEssayUrls[absoluteUrl]));

    starButton.addEventListener("click", async () => {
      const nextFavorite = !Boolean(favoriteEssayUrls[absoluteUrl]);
      favoriteEssayUrls[absoluteUrl] = nextFavorite;
      setFavoriteUi(nextFavorite);
      await chrome.storage.local.set({ [FAVORITE_STORAGE_KEY]: favoriteEssayUrls });
    });

    link.parentNode.insertBefore(starButton, link);
  }
})();
