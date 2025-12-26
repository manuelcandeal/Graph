import './style.css'
import { Console } from './utils/console'
import { config } from './config/appConfig'
import { $ } from './utils/utils'
import { PageError } from './types/errors.type'
import { drawAxes3D, createDefaultProjection } from './graphics/drawAxes3D'

/**
 * Configura un canvas per treballar amb devicePixelRatio
 * @param canvas - Element canvas a configurar
 * @returns Context 2D escalat correctament
 */
function configurarCanvasAmbDPR(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const dpr = window.devicePixelRatio || 1

    // Obtenir les dimensions CSS reals del canvas (després del layout)
    const rect = canvas.getBoundingClientRect()
    const widthCSS = rect.width
    const heightCSS = rect.height

    // Establir la mida CSS explícitament
    canvas.style.width = widthCSS + 'px'
    canvas.style.height = heightCSS + 'px'

    // Establir la mida del buffer intern segons el DPR
    canvas.width = widthCSS * dpr
    canvas.height = heightCSS * dpr

    // Obtenir el context i escalar-lo
    const ctx = canvas.getContext('2d')
    if (!ctx) {
        throw new PageError('Failed to get 2D context from canvas!')
    }
    ctx.scale(dpr, dpr)

    Console.log(`Canvas configurat: DPR=${dpr}, CSS=${widthCSS}×${heightCSS}, Buffer=${canvas.width}×${canvas.height}`)

    return ctx
}

/**
 * Converteix coordenades centrades (0,0 al centre) a coordenades canvas
 * @param canvas - Element canvas
 * @param x - Coordenada X centrada
 * @param y - Coordenada Y centrada (positiu cap amunt)
 * @returns Coordenades canvas
 */
function centratACanvas(canvas: HTMLCanvasElement, x: number, y: number): { x: number; y: number } {
    // Obtenir dimensions CSS del canvas
    const widthCSS = parseFloat(canvas.style.width) || canvas.width
    const heightCSS = parseFloat(canvas.style.height) || canvas.height

    // Calcular el centre
    const centreX = widthCSS / 2
    const centreY = heightCSS / 2

    // Transformar: translació + inversió de Y
    return {
        x: x + centreX,
        y: centreY - y  // Invertim Y perquè sigui matemàtic (positiu cap amunt)
    }
}

/**
 * Converteix coordenades canvas a coordenades centrades (0,0 al centre)
 * @param canvas - Element canvas
 * @param x - Coordenada X canvas
 * @param y - Coordenada Y canvas
 * @returns Coordenades centrades
 */
export function canvasACentrat(canvas: HTMLCanvasElement, x: number, y: number): { x: number; y: number } {
    // Obtenir dimensions CSS del canvas
    const widthCSS = parseFloat(canvas.style.width) || canvas.width
    const heightCSS = parseFloat(canvas.style.height) || canvas.height

    // Calcular el centre
    const centreX = widthCSS / 2
    const centreY = heightCSS / 2

    // Transformar: translació + inversió de Y
    return {
        x: x - centreX,
        y: centreY - y  // Invertim Y perquè sigui matemàtic (positiu cap amunt)
    }
}

Console.write(`${config.app.name} v${config.app.version} initialized.`)
const canvasElement = $('canvas') as HTMLCanvasElement
if (!canvasElement) {
    throw new PageError('Canvas element not found!')
}

// Configurar canvas amb devicePixelRatio
const context = configurarCanvasAmbDPR(canvasElement)
Console.log('Canvas context prepared:', context)

// Exemple d'ús de coordenades centrades
// Dibuixar un cercle al centre (0,0)
const centre = centratACanvas(canvasElement, 0, 0)
context.fillStyle = '#4CAF50'
context.beginPath()
context.arc(centre.x, centre.y, 10, 0, Math.PI * 2)
context.fill()

// Dibuixar un rectangle a la dreta i amunt del centre
const puntDreta = centratACanvas(canvasElement, 100, 50)
context.fillStyle = '#2196F3'
context.fillRect(puntDreta.x - 25, puntDreta.y - 25, 50, 50)

// Dibuixar un rectangle a l'esquerra i avall del centre
const puntEsquerra = centratACanvas(canvasElement, -100, -50)
context.fillStyle = '#FF5722'
context.fillRect(puntEsquerra.x - 25, puntEsquerra.y - 25, 50, 50)

Console.log('Drew shapes using centered coordinates (0,0 at center).')

// DIBUIXAR EIXOS 3D AMB PERSPECTIVA
// Crear sistema de projecció 3D
const projection3D = createDefaultProjection()

// Esborrar canvas per dibuixar els eixos
context.clearRect(0, 0, canvasElement.width, canvasElement.height)

// Dibuixar eixos 3D
drawAxes3D(canvasElement, context, projection3D, {
    length: 150,
    arrowSize: 15,
    lineWidth: 2,
    fontSize: 18
})

Console.log('Drew 3D axes with perspective projection.')

// Opcional: Afegir controls interactius
// Exemple: rotar la càmera amb el ratolí
let isDragging = false
let lastMouseX = 0
let lastMouseY = 0

canvasElement.addEventListener('mousedown', (e) => {
    isDragging = true
    lastMouseX = e.clientX
    lastMouseY = e.clientY
})

canvasElement.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastMouseX
    const deltaY = e.clientY - lastMouseY

    // Actualitzar rotació de la càmera
    const currentCamera = projection3D.getCamera()
    projection3D.updateCamera({
        rotation: {
            yaw: currentCamera.rotation.yaw + deltaX * 0.01,
            pitch: currentCamera.rotation.pitch + deltaY * 0.01,
            roll: 0
        }
    })

    // Redibuixar
    context.clearRect(0, 0, canvasElement.width, canvasElement.height)
    drawAxes3D(canvasElement, context, projection3D, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    lastMouseX = e.clientX
    lastMouseY = e.clientY
})

canvasElement.addEventListener('mouseup', () => {
    isDragging = false
})

canvasElement.addEventListener('mouseleave', () => {
    isDragging = false
})

Console.log('Added interactive camera controls (drag to rotate).')
