# Exemples d'Ús: Eixos 3D amb Perspectiva

## Exemple Bàsic

```typescript
import { drawAxes3D, createDefaultProjection } from './graphics/drawAxes3D'

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

// Crear projecció amb configuració per defecte
const projection = createDefaultProjection()

// Dibuixar eixos
drawAxes3D(canvas, ctx, projection, {
    length: 150
})
```

---

## Exemple amb Configuració Personalitzada

```typescript
import { Projection3D } from './graphics/Projection3D'
import { drawAxes3D } from './graphics/drawAxes3D'

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

// Crear projecció personalitzada
const projection = new Projection3D({
    rotation: {
        pitch: -0.7,  // Més inclinació cap avall
        yaw: 0.8,     // Més rotació horitzontal
        roll: 0
    },
    focalLength: 500,  // Menys perspectiva (més "telefoto")
    viewDistance: 600
})

// Dibuixar amb colors i mides personalitzades
drawAxes3D(canvas, ctx, projection, {
    length: 200,
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
```

---

## Exemple: Vista des de Dalt (Bird's Eye View)

```typescript
const projection = new Projection3D({
    rotation: {
        pitch: -1.5,  // ~-85.9° (mirant gairebé verticalment cap avall)
        yaw: 0,
        roll: 0
    },
    focalLength: 400,
    viewDistance: 500
})

ctx.clearRect(0, 0, canvas.width, canvas.height)
drawAxes3D(canvas, ctx, projection, { length: 150 })
```

**Resultat visual:** Els eixos X i Z es veuen com línies horitzontals formant un angle de 90°, i l'eix Y es veu de perfil (com un punt o línia molt curta).

---

## Exemple: Vista Lateral

```typescript
const projection = new Projection3D({
    rotation: {
        pitch: 0,
        yaw: Math.PI / 2,  // 90° (vista lateral)
        roll: 0
    },
    focalLength: 400,
    viewDistance: 500
})

ctx.clearRect(0, 0, canvas.width, canvas.height)
drawAxes3D(canvas, ctx, projection, { length: 150 })
```

**Resultat visual:** L'eix X es veu de perfil, els eixos Y i Z són visibles en el pla de la pantalla.

---

## Exemple: Vista Isomètrica Simulada

```typescript
// Angles que simulen una vista isomètrica clàssica
const projection = new Projection3D({
    rotation: {
        pitch: -Math.atan(Math.sin(Math.PI / 4)),  // ~-35.26°
        yaw: Math.PI / 4,  // 45°
        roll: 0
    },
    focalLength: 600,  // Focal llarga per reduir perspectiva
    viewDistance: 800
})

ctx.clearRect(0, 0, canvas.width, canvas.height)
drawAxes3D(canvas, ctx, projection, { length: 150 })
```

**Resultat visual:** Els tres eixos formen angles similars entre si, semblant a una projecció isomètrica.

---

## Exemple: Animació - Rotació Contínua

```typescript
const projection = createDefaultProjection()
let angle = 0

function animate() {
    // Actualitzar angle
    angle += 0.01

    // Actualitzar càmera
    projection.updateCamera({
        rotation: {
            pitch: -0.5,
            yaw: angle,
            roll: 0
        }
    })

    // Redibuixar
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, {
        length: 150,
        lineWidth: 2
    })

    requestAnimationFrame(animate)
}

animate()
```

**Resultat:** Els eixos roten contínuament al voltant de l'eix Y (vertical).

---

## Exemple: Control Interactiu amb Ratolí

```typescript
const projection = createDefaultProjection()
let isDragging = false
let lastX = 0
let lastY = 0

canvas.addEventListener('mousedown', (e) => {
    isDragging = true
    lastX = e.clientX
    lastY = e.clientY
})

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    const deltaX = e.clientX - lastX
    const deltaY = e.clientY - lastY

    const camera = projection.getCamera()
    projection.updateCamera({
        rotation: {
            yaw: camera.rotation.yaw + deltaX * 0.01,
            pitch: camera.rotation.pitch + deltaY * 0.01,
            roll: 0
        }
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, { length: 150 })

    lastX = e.clientX
    lastY = e.clientY
})

canvas.addEventListener('mouseup', () => { isDragging = false })
canvas.addEventListener('mouseleave', () => { isDragging = false })
```

**Resultat:** Pots arrossegar el ratolí per rotar la vista dels eixos 3D.

---

## Exemple: Zoom amb Roda del Ratolí

```typescript
const projection = createDefaultProjection()

canvas.addEventListener('wheel', (e) => {
    e.preventDefault()

    const camera = projection.getCamera()
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9

    projection.updateCamera({
        viewDistance: camera.viewDistance * zoomFactor
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, { length: 150 })
})
```

**Resultat:** Fer scroll amunt/avall fa zoom in/out.

---

## Exemple: Múltiples Vistes Simultànies

```typescript
// Dividir canvas en 4 quadrants amb vistes diferents

const projections = [
    // Vista perspectiva (superior esquerra)
    new Projection3D({
        rotation: { pitch: -0.5, yaw: 0.6, roll: 0 },
        focalLength: 400,
        viewDistance: 500
    }),
    // Vista superior (superior dreta)
    new Projection3D({
        rotation: { pitch: -1.5, yaw: 0, roll: 0 },
        focalLength: 400,
        viewDistance: 500
    }),
    // Vista frontal (inferior esquerra)
    new Projection3D({
        rotation: { pitch: 0, yaw: 0, roll: 0 },
        focalLength: 400,
        viewDistance: 500
    }),
    // Vista lateral (inferior dreta)
    new Projection3D({
        rotation: { pitch: 0, yaw: Math.PI / 2, roll: 0 },
        focalLength: 400,
        viewDistance: 500
    })
]

const w = canvas.width / 2
const h = canvas.height / 2

// Dibuixar cada vista en el seu quadrant
// Nota: això requereix modificar drawAxes3D per treballar amb regions del canvas
// o crear múltiples canvas separats
```

---

## Valors d'Angle Comuns

| Graus | Radiants | Ús comú |
|-------|----------|---------|
| 0° | 0 | Frontal |
| 30° | 0.524 | Inclinació lleugera |
| 45° | 0.785 | Isomètric |
| 90° | 1.571 (π/2) | Perpendicular |
| 180° | 3.142 (π) | Girat completament |

**Conversió:**
```typescript
const radiants = graus * (Math.PI / 180)
const graus = radiants * (180 / Math.PI)
```

---

## Configuració de Focal Length Recomanada

| Focal Length | Efecte | Ús recomanat |
|--------------|--------|--------------|
| 200-300 | Gran angular, molta perspectiva | Escenes grans, vistes panoràmiques |
| 400-500 | Normal, perspectiva natural | Visualització general, per defecte |
| 600-1000 | Telefoto, poca perspectiva | Diagrames tècnics, vistes ortogràfiques |

---

## Consells de Rendiment

1. **Dibuixar només quan calgui:** No redibuixar en cada frame si no hi ha canvis
2. **Usar requestAnimationFrame:** Per a animacions suaus
3. **Limitar listeners:** Evitar massa listeners d'esdeveniments
4. **Canvas offscreen:** Per a escenes complexes, dibuixar en canvas invisible i copiar

```typescript
// Exemple: Dibuixar només quan hi ha canvis
let needsRedraw = true

function render() {
    if (needsRedraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawAxes3D(canvas, ctx, projection, { length: 150 })
        needsRedraw = false
    }
    requestAnimationFrame(render)
}

// Marcar per redibuixar quan hi ha canvis
canvas.addEventListener('mousemove', () => {
    needsRedraw = true
})
```

---

## Depuració

```typescript
// Mostrar informació de la càmera
const camera = projection.getCamera()
console.log('Camera info:', {
    pitch: `${(camera.rotation.pitch * 180 / Math.PI).toFixed(1)}°`,
    yaw: `${(camera.rotation.yaw * 180 / Math.PI).toFixed(1)}°`,
    roll: `${(camera.rotation.roll * 180 / Math.PI).toFixed(1)}°`,
    focalLength: camera.focalLength,
    viewDistance: camera.viewDistance
})

// Dibuixar informació al canvas
ctx.fillStyle = '#fff'
ctx.font = '12px monospace'
ctx.fillText(`Pitch: ${(camera.rotation.pitch * 180 / Math.PI).toFixed(1)}°`, 10, 20)
ctx.fillText(`Yaw: ${(camera.rotation.yaw * 180 / Math.PI).toFixed(1)}°`, 10, 35)
```

---

**Data:** Desembre 2025
**Versió:** 1.0
