/**
 * Created by Capricorncd.
 * https://github.com/capricorncd
 * Date: 2020-10-04 13:01
 */
import React, { useEffect } from 'react'
import { drawLine, drawTangram } from './draw-line'
import { drawArc } from './draw-arc'
import { drawDigit } from './draw-digit'
function App() {
  let el, canvas, context, width, height

  function handleResize() {
    width = el.offsetWidth
    height = el.offsetHeight
    canvas.width = width
    canvas.height = height
    drawLine(context, width, height)
    drawTangram(context, width, height)
  }

  useEffect(() => {
    if (!el) {
      el = document.querySelector('.canvas-hook')
      width = el.offsetWidth
      height = el.offsetHeight
      canvas = el.querySelector('canvas')
      canvas.width = width
      canvas.height = height
      context = canvas.getContext('2d')
      window.addEventListener('resize', handleResize)

      drawLine(context, width, height)
      drawTangram(context, width, height)
      drawArc(context)
      drawDigit(context)
    }
    return () => {
      console.log('destroy')
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return <main className="canvas-hook font-size-zero">
    <canvas>
      Canvas is not supported by current browser
    </canvas>
  </main>
}

export default App
