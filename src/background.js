function getThemedPrefix() {
  return browser.storage.local.get('settings').then((store) => {
    if (store.settings && store.settings.theme && store.settings.theme === 'dark') {
      return 'light';
    }
    return 'dark';
  });
}

function isSupportedProtocol(urlString) {
  const supportedProtocols = ['https:', 'http:', 'ftp:', 'file:'];
  const url = document.createElement('a');
  url.href = urlString;
  return supportedProtocols.indexOf(url.protocol) != -1;
}

function getCurrentList() {
  return browser.storage.local.get('readingList').then(store => ((store.readingList && store.readingList.length) ? store.readingList : []));
}

function toggleAddPageToList(tabs) {
  if (tabs[0]) {
    getCurrentList().then((list) => {
      if (isSupportedProtocol(tabs[0].url)) {
        if (list.find((savedPage => savedPage.url === tabs[0].url))) {
          list = list.filter(savedPage => savedPage.url !== tabs[0].url);
          setReadingItemIcon(false, tabs[0].id);
        } else {
          list.push({ url: tabs[0].url, faviconUrl: tabs[0].favIconUrl, title: tabs[0].title });
          setReadingItemIcon(true, tabs[0].id);
        }
        browser.storage.local.set({ readingList: list });
      } else {
        console.log(`Extension does not support the '${tabs[0].url}' URL.`);
      }
    });
  }
}

function setReadingItemIcon(isIn, tabId) {
  getThemedPrefix().then((prefix) => {
    browser.pageAction.setIcon({
      tabId,
      path: isIn ? `/icons/icon-${prefix}-action-in.svg` : `/icons/icon-${prefix}-action.svg`
    });
  });
}

function displayPageActionIcon(tabId, tab) {
  getCurrentList().then((list) => {
    const isIn = !!list.find((savedPage => savedPage.url === tab.url));
    if (tab) {
      setReadingItemIcon(isIn, tabId);
    }
  });
}

function init() {
  getThemedPrefix().then((prefix) => {
    browser.browserAction.setIcon({
      path: `/icons/icon-${prefix}.svg`
    });
    browser.sidebarAction.setIcon({
      path: `/icons/icon-${prefix}.svg`
    });
  });
}

// installation or updating the extension
browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install' || details.reason === 'update') {
    browser.storage.local.get('settings').then((store) => {
      if (store.settings === undefined) {
        browser.storage.local.set({
          settings: {
            theme: 'light'
          }
        });
      }
    });
  }
});

browser.pageAction.onClicked.addListener(() => {
  browser.tabs.query({ currentWindow: true, active: true }, toggleAddPageToList);
});

browser.browserAction.onClicked.addListener((e) => {
  browser.sidebarAction.open();
});

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  setReadingItemIcon(false, tabId);
  displayPageActionIcon(tabId, tab);
  browser.pageAction.show(tabId);
});

browser.tabs.onActivated.addListener((activeInfo) => {
  setReadingItemIcon(false, activeInfo.tabId);
  browser.pageAction.show(activeInfo.tabId);
});

init();
