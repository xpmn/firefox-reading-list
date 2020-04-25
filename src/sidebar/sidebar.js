function getCurrentList () {
  return browser.storage.local.get('readingList').then(store => {
    return (store.readingList && store.readingList.length) ? store.readingList : [];
  });
}

(function rendreList(){
	getCurrentList().then(list=> {
    list.forEach(element => {
      let newEl = document.createElement('a');
      newEl.href = element.url;
      newEl.className = 'sidebar-item';
      newEl.appendChild(document.createTextNode(element.title));
      document.querySelector("#sidebar-content").appendChild(newEl);
    })
  });
})();