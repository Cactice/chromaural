import { keyLayout } from './keyboardLayout'

export const KeyCodeToKeyPosition = (keyCode: number): number[] => {
  const keyPositions = keyLayout[keyCode]
  const keyPosition = [...keyPositions[0]]
  return keyPosition
}
export const KeyPositionToNote = (keyPosition: number[]) => {
  const keyPositionCopy = keyPosition
  keyPositionCopy[0] = Math.floor(keyPosition[0])
  keyPositionCopy[0] = keyPosition[1] <= 2 ? keyPosition[0] : keyPosition[0] - 1
  keyPositionCopy[1] = 4 - keyPosition[1]
  const noteNumber = 61 + keyPosition[0] * 3 + keyPosition[1] // z is C4
  return noteNumber
}
