import React, { useEffect, useState } from 'react'
import { Device } from 'node-hid'
import { Navbar } from './navbar'
import style from '../style.scss'

type keyOfDevice = keyof Device
const desiredKeys: keyOfDevice[] = [
  'vendorId',
  'productId',
  'manufacturer',
  'product',
  'path',
  'interface',
]
const displayDesiredKeys = desiredKeys.slice(2)

const filterAndSortDeviceKeys = (device: Device) => {
  const filtered = Object.assign(
    {},
    ...desiredKeys.map((key: keyOfDevice) => ({ [key]: device[key] }))
  )
  return filtered
}

type props = { device: Device }

const Row = (props: props) => {

  const {device} = props
  return Object.values(filterAndSortDeviceKeys(device)).map(
    (val: string, index: number) => (
      <>
        {(() => {
          const keyList = Object.keys(device)
          switch (desiredKeys[index]) {
            case 'vendorId':
            case 'productId':
              return <></>
            case 'interface':
              return (
                <td>
                  <button type="button">
                    Try
                    {(() => {
                      if (!val) {
                        return '👍'
                      }
                      if (Number(val) > 0) {
                        return '💁'
                      }
                      return '😷'
                    })()}
                  </button>
                </td>
              )
            case 'path':
              return (
                <td className="height-definition">
                  {val.split('/').map((substring) => (
                    <span className="device-table__span">{substring}</span>
                  ))}
                </td>
              )
            case 'product':
              return (
                <td>
                  {val.split('/').map((substring) => {
                    if (substring === '') {
                      return (
                        <span className="is-warning is-light is-medium">
                          Unknown device
                        </span>
                      )
                    }
                    return (
                      <span className="is-info is-light is-medium">
                        {substring}
                      </span>
                    )
                  })}
                </td>
              )
            default:
              return <td>{val}</td>
          }
        })()}
      </>
    )
  )
}

export const DeviceTable = () => {
  const [devices, setDevices] = useState<Device[]>()

  useEffect(() => {
    (async () => {
      const HID = await import('node-hid')
      setDevices(HID.devices())
    })()
  }, [])
  return (
    <table className="device-table">
      <thead>
        <tr>
          {displayDesiredKeys.map((key) => (
            <th>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {typeof devices !== 'undefined'
          ? devices.map((device) => <tr>{Row({ device })}</tr>)
          : null}
      </tbody>
    </table>
  )
}

// eslint-disable-next-line import/no-default-export
export default DeviceTable
