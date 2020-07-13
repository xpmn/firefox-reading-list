import {getThemedPrefix, getCurrentList, setReadingItemIcon} from './lib.js';

function displayPageActionIcon(tabId, tab) {
  getCurrentList().then((list) => {
    const isIn = !!list.find((savedPage => savedPage.url === tab.url));
    if (tab) {
      setReadingItemIcon(isIn, tabId);
    }
  });
}

function init() {
  // Fix for sync storage limits: moving to local storage
  browser.storage.sync.get('readingList').then(store => {
    if (store.readingList) {
      browser.storage.local.set({ readingList: store.readingList });
    }
    browser.storage.sync.clear();
  });
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

browser.browserAction.onClicked.addListener(() => {
  browser.sidebarAction.toggle();
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
