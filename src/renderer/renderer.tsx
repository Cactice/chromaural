import React, { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom'
import { DeviceTable } from './multipleDevices/components/deviceTable'
import style from './style.scss'
import { MultipleDevices } from './multipleDevices/deviceTablePage'
import {Keyboard} from './canvas/keyboard'

const userAgent = navigator.userAgent.toLowerCase()
const isElectron = userAgent.indexOf(' electron/') > -1

// Import the styles here to process them with webpack

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <Keyboard />
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
