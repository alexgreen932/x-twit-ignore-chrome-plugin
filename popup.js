const input = document.getElementById('new-key');
const list = document.getElementById('key-list');
const addBtn = document.getElementById('add-key');

const renderList = (keys) => {
  list.innerHTML = '';
  keys.forEach((key, index) => {
    const li = document.createElement('li');
    li.textContent = key;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✖';
    removeBtn.onclick = () => {
      keys.splice(index, 1);
      chrome.storage.local.set({ twitterKeys: keys }, render);
    };

    li.appendChild(removeBtn);
    list.appendChild(li);
  });
};

const render = () => {
  chrome.storage.local.get(['twitterKeys'], (result) => {
    const keys = result.twitterKeys || [];
    renderList(keys);
  });
};

addBtn.addEventListener('click', () => {
  const newKey = input.value.trim();
  if (!newKey) return;

  chrome.storage.local.get(['twitterKeys'], (result) => {
    const keys = result.twitterKeys || [];
    if (!keys.includes(newKey)) {
      keys.push(newKey);
      chrome.storage.local.set({ twitterKeys: keys }, () => {
        input.value = '';
        render();
      });
    }
  });
});

render();

