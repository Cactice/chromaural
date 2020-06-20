import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Device } from 'node-hid';
import style from "./style.styl"

const userAgent = navigator.userAgent.toLowerCase();
const isElectron = userAgent.indexOf(' electron/') > -1;

// import React, { useState } from 'react';

// Import the styles here to process them with webpack

const Row = (device: Device) =>
  Object.values(device).map((val: string, index: number) => (
    <>
      {(() => {
        // eslint-disable-next-line no-nested-ternary
        if (index === 2) {
          return (
            <td>
              {val.split('/').map((substring) => (
                <span className="device-table__span">
                  {substring}
                </span>
              ))}
            </td>
          );
        }
        if (index === 5) {
          return (
            <td>
              {val.split('/').map((substring) => {
                if (substring === '') {
                  return (
                    <>
                      <span className="is-warning is-light">
                        Unknown device
                      </span>
                    </>
                  );
                }
                return (
                  <span className="is-info is-light">{substring}</span>
                );
              })}
            </td>
          );
        }
        return <td>{val}</td>;
      })()}

    </>
  ));

function DeviceTable(devices: Device[]) {
  return (
    <div className="app">
      <table className="device-table">
        <thead>
          <tr>
            {Object.keys(devices[0]).map((key) => (
              <th>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {devices.map((device) => (
            <tr>{Row(device)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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
