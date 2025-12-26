import type { Point2D, Point3D } from '../types/graphics.type'
import { Projection3D } from './Projection3D'

/**
 * Configuració per dibuixar eixos 3D
 */
export interface AxesConfig {
    length?: number           // Longitud dels eixos (per defecte: 100)
    arrowSize?: number       // Mida de les puntes de fletxa (per defecte: 15)
    lineWidth?: number       // Gruix de les línies (per defecte: 2)
    fontSize?: number        // Mida de les etiquetes (per defecte: 16)
    labelOffset?: number     // Separació de les etiquetes (per defecte: 15)
    colors?: {              // Colors dels eixos
        x?: string          // Color eix X (per defecte: #ff0000)
        y?: string          // Color eix Y (per defecte: #00ff00)
        z?: string          // Color eix Z (per defecte: #0000ff)
    }
}

/**
 * Dibuixa una fletxa en 2D (coordenades ja en píxels de canvas)
 */
function drawArrow2D(
    ctx: CanvasRenderingContext2D,
    from: Point2D,
    to: Point2D,
    color: string,
    arrowSize: number = 15,
    lineWidth: number = 2
) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x)

    // Dibuixa la línia
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = lineWidth
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()

    // Dibuixa la punta de la fletxa
    ctx.beginPath()
    ctx.moveTo(to.x, to.y)
    ctx.lineTo(
        to.x - arrowSize * Math.cos(angle - Math.PI / 6),
        to.y - arrowSize * Math.sin(angle - Math.PI / 6)
    )
    ctx.lineTo(
        to.x - arrowSize * Math.cos(angle + Math.PI / 6),
        to.y - arrowSize * Math.sin(angle + Math.PI / 6)
    )
    ctx.closePath()
    ctx.fill()

    ctx.lineWidth = 1
}

/**
 * Dibuixa una etiqueta de text
 */
function drawLabel2D(
    ctx: CanvasRenderingContext2D,
    position: Point2D,
    text: string,
    color: string,
    fontSize: number = 16,
    offset: { x: number; y: number } = { x: 15, y: 0 }
) {
    ctx.fillStyle = color
    ctx.font = `bold ${fontSize}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, position.x + offset.x, position.y + offset.y)
}

/**
 * Converteix coordenades centrades (0,0 al centre, Y+ amunt) a canvas
 */
function centratACanvas(canvas: HTMLCanvasElement, x: number, y: number): Point2D {
    const widthCSS = parseFloat(canvas.style.width) || canvas.width
    const heightCSS = parseFloat(canvas.style.height) || canvas.height

    const centreX = widthCSS / 2
    const centreY = heightCSS / 2

    return {
        x: x + centreX,
        y: centreY - y
    }
}

/**
 * Dibuixa els eixos 3D (X, Y, Z) amb perspectiva al canvas
 *
 * FUNCIONAMENT:
 * 1. Crea punts 3D per a l'origen i els finals de cada eix
 * 2. Projecta els punts 3D a 2D utilitzant Projection3D
 * 3. Converteix a coordenades de canvas
 * 4. Dibuixa fletxes i etiquetes
 *
 * COLORS PER DEFECTE:
 * - Eix X: Vermell (#ff0000)
 * - Eix Y: Verd (#00ff00)
 * - Eix Z: Blau (#0000ff)
 *
 * @param canvas - Element canvas on dibuixar
 * @param ctx - Context 2D del canvas
 * @param projection - Instància de Projection3D per fer la projecció
 * @param config - Configuració opcional dels eixos
 *
 * @example
 * ```typescript
 * const projection = new Projection3D()
 * drawAxes3D(canvas, ctx, projection, { length: 150 })
 * ```
 */
export function drawAxes3D(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    projection: Projection3D,
    config: AxesConfig = {}
) {
    // Configuració per defecte
    const length = config.length ?? 100
    const arrowSize = config.arrowSize ?? 15
    const lineWidth = config.lineWidth ?? 2
    const fontSize = config.fontSize ?? 16
    const labelOffset = config.labelOffset ?? 15
    const colors = {
        x: config.colors?.x ?? '#ff0000',
        y: config.colors?.y ?? '#00ff00',
        z: config.colors?.z ?? '#0000ff'
    }

    // Definir punts 3D
    const origin: Point3D = { x: 0, y: 0, z: 0 }
    const xEnd: Point3D = { x: length, y: 0, z: 0 }
    const yEnd: Point3D = { x: 0, y: length, z: 0 }
    const zEnd: Point3D = { x: 0, y: 0, z: length }

    // Projectar punts 3D a 2D (coordenades centrades)
    const origin2D = projection.project(origin)
    const xEnd2D = projection.project(xEnd)
    const yEnd2D = projection.project(yEnd)
    const zEnd2D = projection.project(zEnd)

    // Convertir a coordenades de canvas
    const originCanvas = centratACanvas(canvas, origin2D.x, origin2D.y)
    const xEndCanvas = centratACanvas(canvas, xEnd2D.x, xEnd2D.y)
    const yEndCanvas = centratACanvas(canvas, yEnd2D.x, yEnd2D.y)
    const zEndCanvas = centratACanvas(canvas, zEnd2D.x, zEnd2D.y)

    // Dibuixar eix X (vermell)
    drawArrow2D(ctx, originCanvas, xEndCanvas, colors.x, arrowSize, lineWidth)
    drawLabel2D(ctx, xEndCanvas, 'X', colors.x, fontSize, { x: labelOffset, y: 0 })

    // Dibuixar eix Y (verd)
    drawArrow2D(ctx, originCanvas, yEndCanvas, colors.y, arrowSize, lineWidth)
    drawLabel2D(ctx, yEndCanvas, 'Y', colors.y, fontSize, { x: 0, y: -labelOffset })

    // Dibuixar eix Z (blau)
    drawArrow2D(ctx, originCanvas, zEndCanvas, colors.z, arrowSize, lineWidth)
    drawLabel2D(ctx, zEndCanvas, 'Z', colors.z, fontSize, { x: labelOffset, y: 0 })
}

/**
 * Crea una instància de Projection3D amb configuració per defecte adequada
 * per visualitzar eixos 3D
 */
export function createDefaultProjection(): Projection3D {
    return new Projection3D({
        rotation: {
            pitch: -0.5,  // ~-28.6° (mira lleugerament cap avall)
            yaw: 0.6,     // ~34.4° (rotada cap a la dreta)
            roll: 0
        },
        focalLength: 400,
        viewDistance: 500
    })
}
