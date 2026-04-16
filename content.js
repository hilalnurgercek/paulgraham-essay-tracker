(async () => {
  const STORAGE_KEY = "readEssayUrls";
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

  const uniqueLinks = [];
  const seen = new Set();

  for (const link of links) {
    const absoluteUrl = new URL(link.getAttribute("href"), location.href).href;
    const text = (link.textContent || "").trim();

    if (!text) continue;
    if (absoluteUrl === pageUrl) continue;
    if (seen.has(absoluteUrl)) continue;

    seen.add(absoluteUrl);
    uniqueLinks.push({ link, absoluteUrl });
  }

  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const readEssayUrls = stored[STORAGE_KEY] || {};

  for (const { link, absoluteUrl } of uniqueLinks) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = Boolean(readEssayUrls[absoluteUrl]);
    checkbox.style.marginRight = "8px";
    checkbox.style.verticalAlign = "middle";
    checkbox.title = "Mark essay as read";

    checkbox.addEventListener("change", async () => {
      readEssayUrls[absoluteUrl] = checkbox.checked;
      await chrome.storage.local.set({ [STORAGE_KEY]: readEssayUrls });
    });

    link.parentNode.insertBefore(checkbox, link);
  }
})();
