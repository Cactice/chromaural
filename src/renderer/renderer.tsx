import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {DeviceTable} from "./multipleDevices/deviceTable.tsx"
import style from "./style.scss"

const userAgent = navigator.userAgent.toLowerCase();
const isElectron = userAgent.indexOf(' electron/') > -1;

// import React, { useState } from 'react';

// Import the styles here to process them with webpack


function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = React.useState(0);

  return (
    <div className="app">
      <p>
        You clicked
        {count}
        times
      </p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

(async () => {
  if (isElectron) {
    console.log(style)
    const HID = await import('node-hid');
    const devices = HID.devices();
    ReactDOM.render(DeviceTable(devices), document.getElementById('app'));
  } else {
    ReactDOM.render(<Example />, document.getElementById('app'));
  }
})();
