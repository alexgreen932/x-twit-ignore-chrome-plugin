// UI tab logic
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Storage helpers
const get = (key, cb) => chrome.storage.local.get([key], res => cb(res[key] || []));
const set = (key, val) => chrome.storage.local.set({ [key]: val });

// Add/remove keyword
function setupList(type) {
  const input = document.getElementById(`${type}-input`);
  const button = document.getElementById(`add-${type}`);
  const list = document.getElementById(`${type}-list`);

  const render = () => {
    get(`${type}Words`, words => {
      list.innerHTML = "";
      words.forEach((word, i) => {
        const li = document.createElement("li");
        li.textContent = word;
        const del = document.createElement("button");
        del.textContent = "✖";
        del.onclick = () => {
          words.splice(i, 1);
          set(`${type}Words`, words);
          render();
        };
        li.appendChild(del);
        list.appendChild(li);
      });
    });
  };

  button.onclick = () => {
    const word = input.value.trim();
    if (word) {
      get(`${type}Words`, words => {
        if (!words.includes(word)) {
          words.push(word);
          set(`${type}Words`, words);
          input.value = "";
          render();
        }
      });
    }
  };

  render();
}
setupList("ignore");
setupList("highlight");

// Settings
document.getElementById("remove-sidebar").addEventListener("change", e => {
  set("removeSidebar", e.target.checked);
});
document.getElementById("bg-color").addEventListener("input", e => {
  set("highlightBg", e.target.value);
});
document.getElementById("font-color").addEventListener("input", e => {
  set("highlightColor", e.target.value);
});

// Load saved settings
chrome.storage.local.get(["removeSidebar", "highlightBg", "highlightColor"], res => {
  document.getElementById("remove-sidebar").checked = res.removeSidebar || false;
  document.getElementById("bg-color").value = res.highlightBg || "#e3f2fd";
  document.getElementById("font-color").value = res.highlightColor || "";
});