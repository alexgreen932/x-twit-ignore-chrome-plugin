// Load all settings and keyword lists
chrome.storage.local.get(["ignoreWords", "highlightWords", "removeSidebar", "highlightBg", "highlightColor"], (res) => {
  const ignoreWords = res.ignoreWords || [];
  const highlightWords = res.highlightWords || [];
  const bgColor = res.highlightBg || "#e3f2fd";
  const fontColor = res.highlightColor || "";
  const removeSidebar = res.removeSidebar;

  // Remove sidebar if enabled
  if (removeSidebar) {
    const primary = document.querySelector('[data-testid="primaryColumn"]');
    if (primary) primary.style.minWidth = "auto";
    const sidebar = document.querySelector('[data-testid="sidebarColumn"]');
    if (sidebar) sidebar.remove();
  }

  const styleElement = document.createElement("style");
  styleElement.textContent = `
    .tweet-highlight {
      background: ${bgColor} !important;
      ${fontColor ? "color: " + fontColor + " !important;" : ""}
    }
  `;
  document.head.appendChild(styleElement);

  const filterTweets = () => {
    document.querySelectorAll("article").forEach((article) => {
      const text = article.innerText.toLowerCase();

      if (ignoreWords.find(w => text.includes(w.toLowerCase()))) {
        article.remove();
        return;
      }

      if (highlightWords.find(w => text.includes(w.toLowerCase()))) {
        article.classList.add("tweet-highlight");
      }
    });
  };

  const observer = new MutationObserver(filterTweets);
  observer.observe(document.body, { childList: true, subtree: true });

  filterTweets(); // Initial run
});