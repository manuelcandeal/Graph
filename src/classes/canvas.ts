import type { PerspectiveView } from '../types/types'
import { Console } from '../utils/console'
import { Point } from './Point'
import { type Point2D } from '../types/types'

export class Canvas {
  private canvas: HTMLCanvasElement
  private context: CanvasRenderingContext2D
  private _perspective: PerspectiveView
  private pointWidth: number

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    perspective?: PerspectiveView
  ) {
    this.canvas = canvas
    this.context = context
    this._perspective = perspective ? perspective : 'isometric'
    this.pointWidth = 1
    this.context.fillStyle = this.lineColor
    this.context.strokeStyle = this.lineColor
  }
  get lineColor() {
    return '#fff'
  }
  get perspective() {
    return this._perspective
  }
  set perspective(perspective: PerspectiveView) {
    this._perspective = perspective
  }
  log() {
    Console.log('Canvas:', this.canvas, this.context)
  }
  clear () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
  point(p: Point) {
    let point2D: Point2D
    switch (this.perspective) {
      case 'isometric':
        point2D = p.isometric()
        break
      case 'orthographic':
        point2D = p.orthographic()
        break
      case 'perspective':
        point2D = p.perspective(300)
        break
      default:
        point2D = p.isometric()
        break
    }
    this.context.beginPath()
    this.context.arc(point2D.x, point2D.y, this.pointWidth / 2, 0, 2 * Math.PI)
    this.context.fill()
  }
  line (p1: Point, p2: Point) {
    let point2D_1: Point2D
    let point2D_2: Point2D
    switch (this.perspective) {
        case 'isometric':
            point2D_1 = p1.isometric()
            point2D_2 = p2.isometric()
            break
        case 'orthographic':
            point2D_1 = p1.orthographic()
            point2D_2 = p2.orthographic()
        break
        case 'perspective':
            point2D_1 = p1.perspective(100)
            point2D_2 = p2.perspective(100)
            break
      default:
            point2D_1 = p1.isometric()
            point2D_2 = p2.isometric()
            break
    } 
    const toScr1 = this.toScreen(point2D_1.x, point2D_1.y)
    const toScr2 = this.toScreen(point2D_2.x, point2D_2.y)
    this.context.beginPath()
    this.context.moveTo(toScr1.x, toScr1.y)
    this.context.lineTo(toScr2.x, toScr2.y)
    this.context.stroke()
  }

  toScreen (x: number, y: number): Point2D {
    return {
            x: this.canvas.width/2 + x,
            y: this.canvas.height/2 - y
        }
    }

  drawAxes(length: number = 100) {
    const origin = new Point(0, 0, 0)
    const xEnd = new Point(length, 0, 0)
    const yEnd = new Point(0, length, 0)
    const zEnd = new Point(0, 0, length)

    // Guardar el color original
    const originalColor = this.context.strokeStyle

    // Eix X (vermell)
    this.context.strokeStyle = '#ff0000'
    this.line(origin, xEnd)

    // Eix Y (verd)
    this.context.strokeStyle = '#00ff00'
    this.line(origin, yEnd)

    // Eix Z (blau)
    this.context.strokeStyle = '#0000ff'
    this.line(origin, zEnd)

    // Restaurar el color original
    this.context.strokeStyle = originalColor
  }
}
