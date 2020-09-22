chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  // If the received message has the expected format...
  if (msg.text === 'report_back') {

      // Call the specified callback, passing
      // the web-page's DOM content as argument
      let videos = document.querySelectorAll('video')
      alert(JSON.stringify(videos))
      for (let i = 0; i < videos.length;i++){
        const video = videos[i]
        let node = document.createTextNode("This is a new paragraph.");
        console.log(video)
        video.parentNode.insertBefore(node, video.nextSibling);
      }
      sendResponse(document);

      return true;
  }
});