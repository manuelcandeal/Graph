import './style.css'
import { Console } from './utils/console.ts'
import { config } from './config/app.config.ts'
import { $ } from './utils/utils.ts'
import { Canvas } from './classes/canvas.ts'
import { PageError } from './types/errors.ts'
import { Point } from './classes/Point.ts'
import type { PerspectiveView } from './types/types.ts'

Console.write(`${config.app.name} v${config.app.version} initialized.`)
const canvasElement = $('canvas') as HTMLCanvasElement
if (!canvasElement) {
    throw new PageError('Canvas element not found!')
}
const context = canvasElement.getContext('2d')
if (!context) {
    throw new PageError('Failed to get 2D context from canvas!')
}
const canvas = new Canvas(canvasElement, context)
canvas.log()

const perspectiveSelect = $('.perspective-select') as HTMLSelectElement
perspectiveSelect.addEventListener('change', (event) => {
    const target = event.target as HTMLSelectElement
    canvas.perspective = target.value as PerspectiveView
    canvas.clear()
    canvas.drawAxes(150)
})