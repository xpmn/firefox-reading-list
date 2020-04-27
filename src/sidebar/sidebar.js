import {getThemedPrefix, getCurrentList} from '../lib.js';

function createNewItemElement(item) {
  const elWrapper = document.createElement('div');
  elWrapper.className = 'sidebar-item';

  const link = document.createElement('a');
  link.href = item.url;
  link.className = 'item-link';
  link.title = item.title;

  const favicon = document.createElement('img');
  if (item.faviconUrl) {
    favicon.src = item.faviconUrl;
  }
  favicon.className = 'item-icon';
  link.appendChild(favicon);
  const innerTitle = document.createElement('span');
  innerTitle.appendChild(document.createTextNode(item.title));
  link.appendChild(innerTitle);

  const removeIcon = document.createElement('img');
  removeIcon.src = '/icons/close.svg';
  const removeItem = document.createElement('a');
  removeItem.className = 'item-remover';
  removeItem.appendChild(removeIcon);

  removeItem.addEventListener('click', () => {
    getCurrentList().then((list) => {
      list = list.filter(savedPage => savedPage.url !== item.url);
      browser.storage.local.set({ readingList: list });
      renderList();
    });
  });

  elWrapper.appendChild(link);
  elWrapper.appendChild(removeItem);
  return elWrapper;
}

function updateStyles() {
  getThemedPrefix().then(prefix => {
    document.body.className = prefix === 'light' ? 'dark' : 'light';
  });
  return browser.theme.getCurrent().then((themeInfo) => {
    if (themeInfo.colors) {
      if (themeInfo.colors.sidebar) {
        document.querySelector('body').style = `background: ${themeInfo.colors.sidebar}`;
      }
      if (themeInfo.colors.sidebar_text) {
        document.querySelectorAll('.item-link').forEach(element => element.style = `color: ${themeInfo.colors.sidebar_text}`);
      }
    }
  });
}

function renderList() {
  document.querySelector('#sidebar-content').innerHTML = '';
  getCurrentList().then((list) => {
    list.forEach((element) => {
      document.querySelector('#sidebar-content').appendChild(createNewItemElement(element));
    });
    updateStyles();
  });
}
browser.storage.onChanged.addListener(renderList);
// initial render:
renderList();