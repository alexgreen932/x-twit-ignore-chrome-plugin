let keys = [];

// Track number of removed articles per day
const trackRemoval = (keyword) => {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const statKey = `twitterFilterStats_${today}`;

  chrome.storage.local.get([statKey], (result) => {
    const count = result[statKey] || 0;
    chrome.storage.local.set({ [statKey]: count + 1 });
  });

  console.log(`article removed as keyword ("${keyword}") was found`);
};

const filterTweets = () => {
  document.querySelectorAll('article').forEach((article) => {
    const text = article.innerText.toLowerCase();
    const match = keys.find((key) => text.includes(key.toLowerCase()));
    if (match) {
      article.remove();
      trackRemoval(match);
    }
  });
};

const observeAndFilter = () => {
  const observer = new MutationObserver(filterTweets);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  filterTweets(); // Initial run
};

chrome.storage.local.get(['twitterKeys'], (result) => {
  keys = result.twitterKeys || [];
  observeAndFilter();
});
