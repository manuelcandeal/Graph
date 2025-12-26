/**
 * DEMOSTRACIÓ: Eixos 3D amb Múltiples Perspectives
 *
 * Aquest fitxer demostra diferents configuracions de càmera
 * i com afecten la visualització dels eixos 3D.
 *
 * Pots importar i executar qualsevol d'aquestes funcions
 * des de main.ts per veure els diferents efectes.
 */

import { Projection3D } from '../graphics/Projection3D'
import { drawAxes3D } from '../graphics/drawAxes3D'

/**
 * Demo 1: Vista Perspectiva Estàndard
 * Configuració per defecte amb perspectiva natural
 */
export function demoPerspectiveStandard(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const projection = new Projection3D({
        rotation: {
            pitch: -0.5,  // ~-28.6°
            yaw: 0.6,     // ~34.4°
            roll: 0
        },
        focalLength: 400,
        viewDistance: 500
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    console.log('Demo 1: Vista perspectiva estàndard')
}

/**
 * Demo 2: Gran Angular (Wide Angle)
 * Focal length curt = molta perspectiva
 */
export function demoWideAngle(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const projection = new Projection3D({
        rotation: {
            pitch: -0.5,
            yaw: 0.6,
            roll: 0
        },
        focalLength: 250,  // Focal curt = gran angular
        viewDistance: 400
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    console.log('Demo 2: Gran angular - molta perspectiva')
}

/**
 * Demo 3: Telefoto (Telephoto)
 * Focal length llarg = poca perspectiva, efecte aplanat
 */
export function demoTelephoto(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const projection = new Projection3D({
        rotation: {
            pitch: -0.5,
            yaw: 0.6,
            roll: 0
        },
        focalLength: 800,  // Focal llarg = telefoto
        viewDistance: 800
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    console.log('Demo 3: Telefoto - poca perspectiva, aplanat')
}

/**
 * Demo 4: Vista des de Dalt (Top-Down / Bird's Eye)
 */
export function demoTopDown(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const projection = new Projection3D({
        rotation: {
            pitch: -1.5,  // ~-85.9° (gairebé vertical)
            yaw: 0.3,     // Lleu rotació per veure profunditat
            roll: 0
        },
        focalLength: 400,
        viewDistance: 500
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    console.log('Demo 4: Vista des de dalt (bird\'s eye)')
}

/**
 * Demo 5: Vista Frontal
 * Mirant directament de front (pitch = 0, yaw = 0)
 */
export function demoFrontal(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const projection = new Projection3D({
        rotation: {
            pitch: 0,
            yaw: 0,
            roll: 0
        },
        focalLength: 400,
        viewDistance: 500
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    console.log('Demo 5: Vista frontal')
}

/**
 * Demo 6: Vista Lateral (Side View)
 */
export function demoSideView(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const projection = new Projection3D({
        rotation: {
            pitch: 0,
            yaw: Math.PI / 2,  // 90° rotació horitzontal
            roll: 0
        },
        focalLength: 400,
        viewDistance: 500
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    console.log('Demo 6: Vista lateral')
}

/**
 * Demo 7: Vista Isomètrica Simulada
 * Simula una projecció isomètrica clàssica
 */
export function demoIsometric(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    // Angles per simular isomètrica: 45° yaw, ~35.26° pitch
    const projection = new Projection3D({
        rotation: {
            pitch: -Math.atan(Math.sin(Math.PI / 4)),
            yaw: Math.PI / 4,
            roll: 0
        },
        focalLength: 600,  // Focal llarga per reduir perspectiva
        viewDistance: 800
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 15,
        lineWidth: 2,
        fontSize: 18
    })

    console.log('Demo 7: Vista isomètrica simulada')
}

/**
 * Demo 8: Rotació Contínua
 * Animació que rota els eixos contínuament
 */
export function demoRotatingAnimation(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
): () => void {
    const projection = new Projection3D({
        rotation: {
            pitch: -0.5,
            yaw: 0,
            roll: 0
        },
        focalLength: 400,
        viewDistance: 500
    })

    let angle = 0
    let animationId: number

    function animate() {
        angle += 0.01

        projection.updateCamera({
            rotation: {
                pitch: -0.5,
                yaw: angle,
                roll: 0
            }
        })

        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawAxes3D(canvas, ctx, projection, {
            length: 150,
            arrowSize: 15,
            lineWidth: 2,
            fontSize: 18
        })

        animationId = requestAnimationFrame(animate)
    }

    animate()
    console.log('Demo 8: Animació de rotació contínua (usa la funció retornada per aturar-la)')

    // Retorna funció per aturar l'animació
    return () => cancelAnimationFrame(animationId)
}

/**
 * Demo 9: Múltiples Eixos amb Colors Personalitzats
 */
export function demoCustomColors(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const projection = new Projection3D({
        rotation: {
            pitch: -0.5,
            yaw: 0.6,
            roll: 0
        },
        focalLength: 400,
        viewDistance: 500
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Dibuixar amb colors personalitzats
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        arrowSize: 20,
        lineWidth: 3,
        fontSize: 20,
        labelOffset: 20,
        colors: {
            x: '#ff6b6b',  // Vermell clar
            y: '#51cf66',  // Verd clar
            z: '#339af0'   // Blau clar
        }
    })

    console.log('Demo 9: Colors personalitzats')
}

/**
 * Demo 10: Comparació de Perspectives
 * Dibuixa 3 vistes diferents al mateix canvas
 */
export function demoMultipleViews(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Nota: Aquesta demo és més conceptual
    // Per implementar-la completament, caldria modificar drawAxes3D
    // per acceptar un offset o treballar amb múltiples canvas

    console.log('Demo 10: Per a múltiples vistes, crea múltiples canvas o implementa offsets')
    console.log('Consulta EXEMPLES_EIXOS_3D.md per més detalls')

    // Exemple bàsic amb una sola vista
    const projection = new Projection3D()
    drawAxes3D(canvas, ctx, projection, { length: 150 })
}

/**
 * Executa totes les demos en seqüència amb intervals
 */
export function demoShowcase(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
) {
    const demos = [
        { name: 'Perspectiva Estàndard', fn: demoPerspectiveStandard },
        { name: 'Gran Angular', fn: demoWideAngle },
        { name: 'Telefoto', fn: demoTelephoto },
        { name: 'Vista de Dalt', fn: demoTopDown },
        { name: 'Vista Frontal', fn: demoFrontal },
        { name: 'Vista Lateral', fn: demoSideView },
        { name: 'Isomètrica', fn: demoIsometric },
        { name: 'Colors Personalitzats', fn: demoCustomColors }
    ]

    let currentIndex = 0

    function showNext() {
        const demo = demos[currentIndex]
        console.log(`\n--- DEMO ${currentIndex + 1}/${demos.length}: ${demo.name} ---`)
        demo.fn(canvas, ctx)

        currentIndex = (currentIndex + 1) % demos.length
    }

    showNext() // Mostra la primera
    const intervalId = setInterval(showNext, 3000) // Canvia cada 3 segons

    console.log('Showcase iniciat. Les demos canviaran cada 3 segons.')

    // Retorna funció per aturar el showcase
    return () => {
        clearInterval(intervalId)
        console.log('Showcase aturat.')
    }
}

/**
 * Exemple d'ús:
 *
 * import { demoShowcase } from './demos/demo3DAxes'
 *
 * const stopShowcase = demoShowcase(canvas, ctx)
 * // Per aturar: stopShowcase()
 */
