import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Device } from 'node-hid';
import style from '../style.styl';

type keyOfDevice = keyof Device;
const desiredKeys: keyOfDevice[] = [
  'vendorId',
  'productId',
  'manufacturer',
  'product',
  'interface',
  'path',
];
const displayDesiredKeys = desiredKeys.slice(2)

const filterAndSortDeviceKeys = (device: Device) => {
  const filtered = Object.assign(
    {},
    ...desiredKeys.map((key: keyOfDevice) => ({ [key]: device[key] }))
  );
  return filtered;
};

const Row = (device: Device) =>
  Object.values(filterAndSortDeviceKeys(device)).map(
    (val: string, index: number) => (
      <>
        {(() => {
          const keyList = Object.keys(device);
          switch (desiredKeys[index]) {
            case 'vendorId':
            case 'productId':
              return <></>
            case 'interface':
              return (
                <td>
                  <button type="button" className="button is-success">Try</button>
                </td>
)
            case 'path':
              return (
                <td>
                  {val.split('/').map((substring) => (
                    <span className="device-table__span">{substring}</span>
                  ))}
                </td>
              );
            case 'product':
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
            default:
              return <td>{val}</td>;
          }
        })()}
      </>
    )
  );

export const DeviceTable = (devices: Device[]) => {
  return (
    <div className="app">
      <table className="device-table">
        <thead>
          <tr>
            {displayDesiredKeys.map((key) => (
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
};
