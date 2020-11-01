import fragStr from './shader.frag'

let isonfocus = true
let id: number = 0
window.onblur = () => {
  window.cancelAnimationFrame(id)
  isonfocus = false
}
let keyboardListLoc: WebGLUniformLocation
let timeLoc: WebGLUniformLocation
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

export const initCanvas = (
  canvas: HTMLCanvasElement,
  updateTimestamp: (
    newTimeStamp: number
  ) => { timestamp: number; keyboardList: number[] }
):
  | {
      gl: WebGLRenderingContext
      glLocations: {
        keyboardListLoc: WebGLUniformLocation
        timeLoc: WebGLUniformLocation
      }
    }
  | false => {
  const gl = canvas.getContext('webgl')
  if (!gl) {
    return false
  }
  gl.viewport(0, 0, canvas.width, canvas.height)

  const vertShader = gl.createShader(gl.VERTEX_SHADER)
  if (!vertShader) {
    return false
  }
  gl.shaderSource(
    vertShader,
    'attribute vec3 c;void main(void){gl_Position=vec4(c, 1.0);}'
  )
  gl.compileShader(vertShader)
  const fragShader = gl.createShader(gl.FRAGMENT_SHADER)
  if (!fragShader) {
    return false
  }
  gl.shaderSource(fragShader, fragStr)
  gl.compileShader(fragShader)
  const prog = gl.createProgram()
  if (!prog) {
    return false
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

  const renderLoop = (newTimestamp: number) => {
    // set time uniform

    const { timestamp, keyboardList } = updateTimestamp(newTimestamp)
    gl.uniform1f(timeLoc, timestamp)
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
  const glLocations = { keyboardListLoc, timeLoc }
  return { gl, glLocations }
}
