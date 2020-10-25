import React from 'react'
import * as ReactDOM from 'react-dom'
import { Keyboard } from '../renderer/canvas/keyboard'

chrome.runtime.onMessage.addListener((msg, sender, sendResponse): boolean => {
  // If the received message has the expected format...
  if (msg.text === 'report_back') {
    // Call the specified callback, passing
  // the web-page's DOM content as argument
    const videos = document.querySelectorAll('video')
    for (let i = 0; i < videos.length; i += 1) {
      const video = videos[i]
      const node = document.createElement('div')
      node.setAttribute('id', 'app')
      const parent: Node | null = video.parentNode
      if (parent) {
        parent.insertBefore(node, video.nextSibling)
        ReactDOM.render(<Keyboard />, document.getElementById('app'))
      }
    }
    sendResponse(document)
  }
  return true
})
