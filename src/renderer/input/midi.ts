import MidiPlayer from 'midi-player-js'
import zelda from './midi/pixel.mid'

// const midiLoader = () => {
//   // Initialize player and register even handler
//   const Player = new MidiPlayer.Player((event: MidiPlayer.Event) => {
//     console.log(event)
//   })

//   // Load a MIDI file
//   Player.loadDataUri(zelda)
//   Player.on('midiEvent', (event: MidiPlayer.Event) => {
//     const { noteNumber, name, track } = event
//     console.log(noteNumber, track, name)
//     if (typeof noteNumber !== 'undefined' && typeof track !== 'undefined') {
//       if (name === 'Note on') {
//         keyboardList = [
//           ...HandleMidiDown(noteNumber, track), // [x, y, pitch(hz)]
//           timeStamp,
//           ...keyboardList,
//         ].splice(0, 160)
//       } else if (name === 'Note off') {
//         HandleMidiUp(noteNumber, track)
//       }
//     }
//   })

//   Player.play()
// }