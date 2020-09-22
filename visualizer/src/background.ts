
// A function to use as callback
function callback() {
  // nothing
}

chrome.browserAction.onClicked.addListener(function (tab:any) {
  chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, callback);
});