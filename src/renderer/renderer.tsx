import React, { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { DeviceTable } from './multipleDevices/components/deviceTable'
import style from './style.scss'
import { MultipleDevices } from './multipleDevices/deviceTablePage'
import {Canvas} from './output/canvas'

const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(' electron/') > -1

// Import the styles here to process them with webpack

function Example() {
  return (
    <div className="app">
      <Canvas />
    </div>
  )
}

(async () => {
  if (isElectron) {
    ReactDOM.render(<Example />, document.getElementById('app'))
  } else {
    ReactDOM.render(<Example />, document.getElementById('app'))
  }
})()
