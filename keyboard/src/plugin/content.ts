chrome.runtime.onMessage.addListener((msg, sender, sendResponse): boolean => {
  // If the received message has the expected format...
  if (msg.text === 'report_back') {
    // Call the specified callback, passing
    // the web-page's DOM content as argument
    const videos = document.querySelectorAll('video')
    alert(JSON.stringify(videos))
    for (let i = 0; i < videos.length; i += 1) {
      const video = videos[i]
      const node = document.createTextNode('This is a new paragraph.')
      const parent: Node | null = video.parentNode
      if (parent) {
        parent.insertBefore(node, video.nextSibling)
      }
    }
    sendResponse(document)
  }
  return true
})
