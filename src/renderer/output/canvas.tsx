import React, { useEffect, useRef, useState } from 'react'
import { handleKeyDown, handleKeyUp } from './audio'

import { initCanvas } from './initCanvas'

let keyboardList: number[] = []
let timestamp: number = 0
let gl: WebGLRenderingContext
let glLocations: {
  keyboardListLoc: WebGLUniformLocation
  timeLoc: WebGLUniformLocation
}
export function Canvas() {
  // Declare a new state variable, which we'll call "count"
  const canvas = useRef(null)
  useEffect(() => {
    const currentCanvas = canvas.current
    if (!currentCanvas) {
      return
    }
    const updateTimestamp = (newTimestamp: number) => {
      timestamp = newTimestamp / 1000.0
      return {timestamp, keyboardList}
    }
    initCanvas(currentCanvas, updateTimestamp)
    const body = document.getElementsByTagName('body')[0]
    body.onkeydown = (event) => {
      keyboardList = [
        ...handleKeyDown(event), // [x, y, pitch(hz)]
        timestamp,
        ...keyboardList,
      ].splice(0, 160)
      console.log(keyboardList.slice(0, 3))
    }
    body.onkeyup = (event) => handleKeyUp(event)
  }, [])

  return (
    <>
      <canvas ref={canvas} width="640" height="640" />
    </>
  )
}
