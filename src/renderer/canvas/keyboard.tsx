import React, { RefObject, useEffect, useRef, useState } from 'react'
import MidiPlayer from 'midi-player-js'
import {
  HandleKeyDown,
  HandleKeyUp,
  HandleMidiDown,
  HandleMidiUp,
} from './audio'
// import { layout } from './keyboardLayout'
import fragStr from './shader.frag'

let isonfocus = true
let id:number = 0
window.onblur = () => {
  window.cancelAnimationFrame(id)
  isonfocus = false
}
let keyboardListLoc: WebGLUniformLocation
let keyboardList: number[] = []
let timeLoc: WebGLUniformLocation
let timeStamp: number
const arr = new Float32Array([
  -1.0,
  1.0,
  0.0,
  -1.0,
  -1.0,
  0.0,
  1.0,
  -1.0,
  0.0,
  -1.0,
  1.0,
  0.0,
  1.0,
  1.0,
  0.0,
  1.0,
  -1.0,
  0.0,
])

const initCanvas = (canvas: HTMLCanvasElement) => {
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return
  }
  gl.viewport(0, 0, canvas.width, canvas.height)

  const vertShader = gl.createShader(gl.VERTEX_SHADER)
  if (!vertShader) {
    return
  }
  gl.shaderSource(
    vertShader,
    'attribute vec3 c;void main(void){gl_Position=vec4(c, 1.0);}'
  )
  gl.compileShader(vertShader)
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
  if (!fragShader) {
    return
  }
  gl.shaderSource(fragShader, fragStr)
  gl.compileShader(fragShader)
  const prog = gl.createProgram()
  if (!prog) {
    return
  }
  gl.attachShader(prog, vertShader)
  gl.attachShader(prog, fragShader)
  gl.linkProgram(prog)
  gl.useProgram(prog)
  timeLoc = gl.getUniformLocation(prog, 'u_time')!
  keyboardListLoc = gl.getUniformLocation(prog, 'u_keyboardList')!
  console.log(gl.getShaderInfoLog(fragShader))
  console.log(gl.getProgramInfoLog(prog))

  gl.clearColor(1, 0, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const vertexBuf = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuf)
  gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW)

  const coord = gl.getAttribLocation(prog, 'c')
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(coord)

  const renderLoop = (newTimeStamp: number) => {
    // set time uniform

    timeStamp = newTimeStamp / 1000.0
    gl.uniform1f(timeLoc, timeStamp)
    gl.uniform4fv(keyboardListLoc, keyboardList)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6)

    // recursive invocation
    if (isonfocus) {
      window.requestAnimationFrame(renderLoop)
    }
  }

  // start the loop
  id = window.requestAnimationFrame(renderLoop)
  window.onfocus = () => {
    isonfocus = true
    window.requestAnimationFrame(renderLoop)
  }
}

const midiLoader = () => {
  // Initialize player and register even handler
  const Player = new MidiPlayer.Player((event: MidiPlayer.Event) => {
    console.log(event)
  })

  // Load a MIDI file
  Player.loadDataUri(zelda)
  Player.on('midiEvent', (event: MidiPlayer.Event) => {
    const { noteNumber, name, track } = event
    console.log(noteNumber, track, name)
    if (typeof noteNumber !== 'undefined' && typeof track !== 'undefined') {
      if (name === 'Note on') {
        keyboardList = [
          ...HandleMidiDown(noteNumber, track), // [x, y, pitch(hz)]
          timeStamp,
          ...keyboardList,
        ].splice(0, 160)
      } else if (name === 'Note off') {
        HandleMidiUp(noteNumber, track)
      }
    }
  })

  Player.play()
}

export function Keyboard() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0)
  const canvas = useRef(null)
  useEffect(() => {
    const currentCanvas = canvas.current
    if (!currentCanvas) {
      return
    }
    initCanvas(currentCanvas)
    const body = document.getElementsByTagName('body')[0]
    body.onkeydown = (event) => {
      keyboardList = [
        ...HandleKeyDown(event), // [x, y, pitch(hz)]
        timeStamp,
        ...keyboardList,
      ].splice(0, 160)
      console.log(keyboardList.slice(0, 3))
    }
    body.onkeyup = (event) => HandleKeyUp(event)
  }, [])

  return (
    <>
      <canvas ref={canvas} width="640" height="640" />
    </>
  )
}
