
// A function to use as callback
function callback(domContent) {
  // nothing
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, callback);
});