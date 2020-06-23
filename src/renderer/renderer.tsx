import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import { DeviceTable } from './multipleDevices/components/deviceTable';
import style from './style.scss';
import { MultipleDevices } from './multipleDevices/deviceTablePage';

const userAgent = navigator.userAgent.toLowerCase();
const isElectron = userAgent.indexOf(' electron/') > -1;

// import React, { useState } from 'react';

// Import the styles here to process them with webpack

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

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
    console.log(style);
    ReactDOM.render(<MultipleDevices />, document.getElementById('app'));
  } else {
    ReactDOM.render(<Example />, document.getElementById('app'));
  }
})();
