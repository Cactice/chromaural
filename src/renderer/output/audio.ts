import { KeyCodeToKeyPosition, KeyPositionToNote } from "../input/keydown"
import { noteToFreq } from "../input/noteToFreq"

const midiOscillatorArr = [
  Array(300),
  Array(300),
  Array(300),
  Array(300),
  Array(300),
]

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
  }
}
export function handleKeyDown(event: KeyboardEvent): number[] {
  const keyPosition = KeyCodeToKeyPosition(event.keyCode)
  const note = KeyPositionToNote(keyPosition)
  const frequency = noteToFreq[note - 24]
  if (oscillatorArr[event.keyCode] == null) {
    oscillatorArr[event.keyCode] = playFreq(frequency)
  }
  return [
    keyPosition[0] / 5.5 - 1,
    keyPosition[1] / 1.5 - 1,
    Math.log2(frequency / 110),
  ]
}

export function handleKeyUp(event: KeyboardEvent) {
  oscillatorArr[event.keyCode]()
  oscillatorArr[event.keyCode] = null
}