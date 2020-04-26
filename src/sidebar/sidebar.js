function getCurrentList () {
  return browser.storage.local.get('readingList').then(store => {
    return (store.readingList && store.readingList.length) ? store.readingList : [];
  });
}

function createNewItemElement (item) {
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
  
  const removeItem = document.createElement('img');
  removeItem.className = 'item-remover';
  removeItem.src = '/icons/close.svg';

  removeItem.addEventListener('click', () => {
    getCurrentList().then(list=> {
      list = list.filter(savedPage => savedPage.url !== item.url);
      browser.storage.local.set({readingList: list});
      renderList();
    })
  })

  elWrapper.appendChild(link);
  elWrapper.appendChild(removeItem);

  return elWrapper;
}

function renderList(){
  document.querySelector("#sidebar-content").innerHTML = '';
	getCurrentList().then(list=> {
    list.forEach(element => {
      document.querySelector("#sidebar-content").appendChild(createNewItemElement(element));
    })
  });
}

browser.storage.onChanged.addListener(renderList);
// initial render:
renderList();