import React, { RefObject, useEffect, useRef, useState } from 'react'
import { HandleKeyDown, HandleKeyUp } from './audio'
// import { layout } from './keyboardLayout'
import fragStr from './shader.frag'

let keyboardListLoc: WebGLUniformLocation
let keyboardList: number[] = []
let timeLoc: WebGLUniformLocation
let timeStamp: number
const arr=    new Float32Array([
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
  gl.bufferData(
    gl.ARRAY_BUFFER,
    arr,
    gl.STATIC_DRAW
  )

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
    body.onkeydown = (event) => {
      keyboardList = [
        ...HandleKeyDown(event), // [x, y , pitch(hz)]
        timeStamp,
        ...keyboardList,
      ].splice(0, 40)
    }
    body.onkeyup = (event) => HandleKeyUp(event)
  }, [])

  return (
    <>
      <canvas ref={canvas} width="1280" height="480" />
    </>
  )
}
