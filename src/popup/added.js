async function getCurrentList() {
  const readingList = await browser.storage.local.get('readingList');
  if (readingList.list) {
    return readingList.list;
  }
  return [];
}

function isSupportedProtocol(urlString) {
  const supportedProtocols = ["https:", "http:", "ftp:", "file:"];
  const url = document.createElement('a');
  url.href = urlString;
  return supportedProtocols.indexOf(url.protocol) != -1;
}

function toggleAddPageToList(tabs) {
  if (tabs[0]) {
    browser.storage.local.get().then(store => {
      let list = (store.readingList && store.readingList.length) ? store.readingList : [];
      if (isSupportedProtocol(tabs[0].url)) {
        if (list.find((savedPage => savedPage.url === tabs[0].url))) {
          list = list.filter(savedPage => savedPage.url !== tabs[0].url);
        } else {
          list.push({url: tabs[0].url, favIconUrl: tabs[0].favIconUrl, title: tabs[0].title});
        }
        browser.storage.local.set({readingList: list});
      } else {
        console.log(`Extension does not support the '${tabs[0].url}' URL.`)
      }
    })
  }
}

browser.tabs.query({active: true}).then(toggleAddPageToList)