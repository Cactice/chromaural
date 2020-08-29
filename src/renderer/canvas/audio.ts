import { keyLayout } from './keyboardLayout'
import { noteToFreq } from './noteToFreq'

const oscillatorArr = Array(200)
const audioCtx = new (window.AudioContext ||
  ((window as any).webkitAudioContext as AudioContext))()
const volume = audioCtx.createGain()
volume.connect(audioCtx.destination)
volume.gain.value = 0.3

// Create a compressor node
const compressor = audioCtx.createDynamicsCompressor()
compressor.threshold.setValueAtTime(-50, audioCtx.currentTime)
compressor.knee.setValueAtTime(40, audioCtx.currentTime)
compressor.ratio.setValueAtTime(12, audioCtx.currentTime)
compressor.attack.setValueAtTime(0, audioCtx.currentTime)
compressor.release.setValueAtTime(0.25, audioCtx.currentTime)
// connect the AudioBufferSourceNode to the destination
compressor.connect(volume)


function playFreq(frequency: number) {
  // create Oscillator node

  const oscillator = audioCtx.createOscillator()

  oscillator.type = 'sine'
  if (Number.isFinite(frequency)) {
    oscillator.frequency.value = frequency // value in hertz
  }
  oscillator.connect(compressor)
  oscillator.start()

  return () => {
    oscillator.stop()
    // delete oscillator
    // delete volume
  }
}

function playNote(note: number) {
  const frequency = noteToFreq[note - 24]
  return playFreq(frequency)
}
function KeyCodeToNote(keyCode: number) {
  const keyPositions = keyLayout[keyCode]
  const keyPosition = [...keyPositions[0]]
  keyPosition[0] = Math.floor(keyPosition[0])
  keyPosition[0] = keyPosition[1] <= 2 ? keyPosition[0] : keyPosition[0] - 1
  keyPosition[1] = 4 - keyPosition[1]
  const noteNumber = 61 + keyPosition[0] * 3 + keyPosition[1] // z is C4
  return noteNumber
}
export function HandleKeyDown(event: KeyboardEvent) {
  const key = KeyCodeToNote(event.keyCode)
  if (oscillatorArr[event.keyCode] == null) {
    oscillatorArr[event.keyCode] = playNote(key)
  }
}

export function HandleKeyUp(event: KeyboardEvent) {
  oscillatorArr[event.keyCode]()
  oscillatorArr[event.keyCode] = null
}
