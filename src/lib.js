export function getThemedPrefix() {
  return browser.storage.local.get('settings').then((store) => {
    if (store.settings && store.settings.theme && store.settings.theme === 'dark') {
      return 'light';
    }
    return 'dark';
  });
}

export function setReadingItemIcon(isIn, tabId) {
  getThemedPrefix().then((prefix) => {
    browser.pageAction.setIcon({
      tabId,
      path: isIn ? `/icons/icon-${prefix}-action-in.svg` : `/icons/icon-${prefix}-action.svg`
    });
  });
}

export function isSupportedProtocol(urlString) {
  const supportedProtocols = ['https:', 'http:', 'ftp:', 'file:'];
  const url = getUrlElement(urlString);
  return supportedProtocols.indexOf(url.protocol) != -1;
}

export function getUrlElement(urlString) {
  const url = document.createElement('a');
  url.href = urlString;
  return url;
}

export function getCurrentList() {
  return browser.storage.local.get('readingList').then(store => ((store.readingList && store.readingList.length) ? store.readingList : []));
}