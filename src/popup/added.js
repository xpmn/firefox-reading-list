function isSupportedProtocol(urlString) {
  const supportedProtocols = ["https:", "http:", "ftp:", "file:"];
  const url = document.createElement('a');
  url.href = urlString;
  return supportedProtocols.indexOf(url.protocol) != -1;
}

function getCurrentList () {
  return browser.storage.local.get('readingList').then(store => {
    return (store.readingList && store.readingList.length) ? store.readingList : [];
  });
}

function toggleAddPageToList(tabs) {
  if (tabs[0]) {
    getCurrentList().then(list => {
      if (isSupportedProtocol(tabs[0].url)) {
        if (list.find((savedPage => savedPage.url === tabs[0].url))) {
          list = list.filter(savedPage => savedPage.url !== tabs[0].url);
          document.querySelector("#popup-content").textContent = 'Page is removed from reading list!';
        } else {
          list.push({url: tabs[0].url, favIconUrl: tabs[0].favIconUrl, title: tabs[0].title});
          document.querySelector("#popup-content").textContent ='Page is added to reading list!';
        }
        browser.storage.local.set({readingList: list});
      } else {
        document.querySelector("#popup-content").textContent = `This type of pages isn't supported`;
        console.log(`Extension does not support the '${tabs[0].url}' URL.`);
      }
    })
  }
}

browser.tabs.query({active: true}).then(toggleAddPageToList)