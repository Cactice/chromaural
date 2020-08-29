import React, { RefObject, useEffect, useRef, useState } from 'react'
import { HandleKeyDown, HandleKeyUp,  } from './audio'
// import { layout } from './keyboardLayout'
import fragStr from './shader.frag'

let keyboardList
let timeLoc: WebGLUniformLocation

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
  keyboardList = gl.getUniformLocation(prog, 'u_keyboardList')
  gl.uniform3fv(keyboardList, [0.4, 0.9, 0.3, 0.8, 0.9, 0.7])

  gl.clearColor(1, 0, 1, 1)
  gl.clear(gl.COLOR_BUFFER_BIT)

  const vertexBuf = gl.createBuffer()

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -0.5,
      0.5,
      0.0,
      -0.5,
      -0.5,
      0.0,
      0.5,
      -0.5,
      0.0,
      -0.5,
      0.5,
      0.0,
      0.5,
      0.5,
      0.0,
      0.5,
      -0.5,
      0.0,
    ]),
    gl.STATIC_DRAW
  )

  const coord = gl.getAttribLocation(prog, 'c')
  gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(coord)

  const renderLoop = (timeStamp: number) => {
    // set time uniform
    gl.uniform1f(timeLoc, timeStamp / 1000.0)

    gl.drawArrays(gl.TRIANGLE_FAN, 0, 6)

    // recursive invocation
    window.requestAnimationFrame(renderLoop)
  }

  // start the loop
  window.requestAnimationFrame(renderLoop)
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
    body.onkeydown = (event) => HandleKeyDown(event)
    body.onkeyup = (event) => HandleKeyUp(event)
  }, [])

  return (
    <>
      <canvas ref={canvas} width="640" height="480" />
    </>
  )
}
