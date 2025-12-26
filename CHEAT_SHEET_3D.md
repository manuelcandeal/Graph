# Cheat Sheet: Projecció 3D i Gràfics

Referència ràpida de fórmules, conceptes i codi per a gràfics 3D.

---

## Fórmules Essencials

### Projecció en Perspectiva
```
x_screen = (focalLength × x) / z
y_screen = (focalLength × y) / z
```

### Matrices de Rotació

**Rotació Y (Yaw - Horitzontal):**
```
[ cos(θ)   0   sin(θ) ]   [ x ]
[   0      1     0    ] × [ y ]
[-sin(θ)   0   cos(θ) ]   [ z ]
```

**Rotació X (Pitch - Vertical):**
```
[ 1     0        0     ]   [ x ]
[ 0   cos(α)  -sin(α)  ] × [ y ]
[ 0   sin(α)   cos(α)  ]   [ z ]
```

**Rotació Z (Roll - Inclinació):**
```
[ cos(φ)  -sin(φ)  0 ]   [ x ]
[ sin(φ)   cos(φ)  0 ] × [ y ]
[   0        0     1 ]   [ z ]
```

---

## Conversions Ràpides

### Graus ↔ Radiants
```typescript
rad = deg × (π / 180)
deg = rad × (180 / π)
```

### Angles Comuns
```
30°  = 0.524 rad = π/6
45°  = 0.785 rad = π/4
60°  = 1.047 rad = π/3
90°  = 1.571 rad = π/2
180° = 3.142 rad = π
360° = 6.283 rad = 2π
```

---

## Configuracions Típiques

### Vista Perspectiva Natural
```typescript
{
    rotation: { pitch: -0.5, yaw: 0.6, roll: 0 },
    focalLength: 400,
    viewDistance: 500
}
```

### Vista Isomètrica
```typescript
{
    rotation: {
        pitch: -Math.atan(Math.sin(Math.PI/4)),  // ~-0.615 rad
        yaw: Math.PI / 4,                        // 45°
        roll: 0
    },
    focalLength: 600,
    viewDistance: 800
}
```

### Vista de Dalt (Bird's Eye)
```typescript
{
    rotation: { pitch: -1.5, yaw: 0.3, roll: 0 },
    focalLength: 400,
    viewDistance: 500
}
```

### Vista Frontal
```typescript
{
    rotation: { pitch: 0, yaw: 0, roll: 0 },
    focalLength: 400,
    viewDistance: 500
}
```

### Vista Lateral
```typescript
{
    rotation: { pitch: 0, yaw: Math.PI/2, roll: 0 },
    focalLength: 400,
    viewDistance: 500
}
```

---

## Codi de Referència

### Setup Bàsic
```typescript
import { drawAxes3D, createDefaultProjection } from './graphics/drawAxes3D'

const canvas = document.querySelector('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
const projection = createDefaultProjection()

drawAxes3D(canvas, ctx, projection, { length: 150 })
```

### Canviar Vista
```typescript
projection.updateCamera({
    rotation: { pitch: -0.7, yaw: 0.8, roll: 0 }
})

ctx.clearRect(0, 0, canvas.width, canvas.height)
drawAxes3D(canvas, ctx, projection, { length: 150 })
```

### Projectar Punt
```typescript
const punt3D = { x: 100, y: 50, z: 30 }
const punt2D = projection.project(punt3D)

// Convertir a píxels canvas
const widthCSS = parseFloat(canvas.style.width)
const heightCSS = parseFloat(canvas.style.height)
const px = punt2D.x + widthCSS / 2
const py = heightCSS / 2 - punt2D.y
```

### Rotació amb Ratolí
```typescript
let isDragging = false
let lastX = 0, lastY = 0

canvas.addEventListener('mousedown', (e) => {
    isDragging = true
    lastX = e.clientX
    lastY = e.clientY
})

canvas.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    const camera = projection.getCamera()
    projection.updateCamera({
        rotation: {
            yaw: camera.rotation.yaw + (e.clientX - lastX) * 0.01,
            pitch: camera.rotation.pitch + (e.clientY - lastY) * 0.01,
            roll: 0
        }
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, { length: 150 })

    lastX = e.clientX
    lastY = e.clientY
})

canvas.addEventListener('mouseup', () => { isDragging = false })
```

### Animació
```typescript
let angle = 0

function animate() {
    projection.updateCamera({
        rotation: { pitch: -0.5, yaw: angle, roll: 0 }
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, { length: 150 })

    angle += 0.01
    requestAnimationFrame(animate)
}

animate()
```

---

## Paràmetres i Efectes

### Focal Length
| Valor | Tipus | Efecte Visual |
|-------|-------|---------------|
| 200-300 | Gran angular | Molta perspectiva, deformació lateral |
| 400-500 | Normal | Perspectiva natural, equilibrat |
| 600-1000 | Telefoto | Poca perspectiva, objectes aplanats |

### Pitch (Rotació X)
| Valor | Graus | Vista |
|-------|-------|-------|
| -1.5 | -86° | Des de dalt (bird's eye) |
| -0.5 | -29° | Lleugerament des de dalt (per defecte) |
| 0 | 0° | Horitzontal (frontal) |
| 0.5 | 29° | Lleugerament des de baix |

### Yaw (Rotació Y)
| Valor | Graus | Vista |
|-------|-------|-------|
| 0 | 0° | Frontal |
| π/4 | 45° | Diagonal |
| π/2 | 90° | Lateral |
| π | 180° | Posterior |

### View Distance
| Valor | Efecte |
|-------|--------|
| 300-400 | Zoom in (objectes grans) |
| 500-600 | Distància normal |
| 700-1000 | Zoom out (objectes petits) |

---

## Sistemes de Coordenades

### World Space (3D)
```
     Y (amunt)
     |
     |_____ X (dreta)
    /
   Z (cap a tu)

Origen: (0, 0, 0)
```

### Screen Space (2D centrat)
```
     Y (amunt)
     |
     |_____ X (dreta)

Origen: Centre del canvas
```

### Canvas Space (píxels)
```
(0,0) _____ X (dreta)
     |
     |
     Y (avall)

Origen: Cantonada superior esquerra
```

---

## Operacions Comunes

### Normalitzar Vector
```typescript
const length = Math.sqrt(x*x + y*y + z*z)
const normalized = {
    x: x / length,
    y: y / length,
    z: z / length
}
```

### Producte Escalar (Dot Product)
```typescript
const dot = a.x*b.x + a.y*b.y + a.z*b.z
```

### Producte Vectorial (Cross Product)
```typescript
const cross = {
    x: a.y*b.z - a.z*b.y,
    y: a.z*b.x - a.x*b.z,
    z: a.x*b.y - a.y*b.x
}
```

### Distància entre Punts
```typescript
const dx = p2.x - p1.x
const dy = p2.y - p1.y
const dz = p2.z - p1.z
const distance = Math.sqrt(dx*dx + dy*dy + dz*dz)
```

---

## Debugging

### Mostrar Info de Càmera
```typescript
const cam = projection.getCamera()
console.table({
    'Pitch': `${(cam.rotation.pitch * 180/Math.PI).toFixed(1)}°`,
    'Yaw': `${(cam.rotation.yaw * 180/Math.PI).toFixed(1)}°`,
    'Focal': cam.focalLength,
    'Distance': cam.viewDistance
})
```

### Dibuixar Info al Canvas
```typescript
ctx.fillStyle = '#fff'
ctx.font = '12px monospace'
ctx.textAlign = 'left'
ctx.fillText(`Pitch: ${pitch.toFixed(1)}°`, 10, 20)
ctx.fillText(`Yaw: ${yaw.toFixed(1)}°`, 10, 35)
ctx.fillText(`FPS: ${fps}`, 10, 50)
```

### Verificar Projecció
```typescript
const testPoint = { x: 100, y: 0, z: 0 }
const projected = projection.project(testPoint)
console.log('Test point projection:', projected)
// Hauria de donar un punt a la dreta del centre
```

---

## Errors Comuns i Solucions

### Punt no es veu
**Causa:** Punt darrere de la càmera (z < 0 després de rotació)
**Solució:** Ajustar `viewDistance` o posició del punt

### Perspectiva massa extrema
**Causa:** `focalLength` massa petit
**Solució:** Augmentar `focalLength` (provar 600-800)

### Eixos invertits
**Causa:** Sistema de coordenades no coincideix
**Solució:** Verificar conversió amb `centratACanvas()`

### Rotació estranya
**Causa:** Gimbal lock o ordre de rotacions incorrecte
**Solució:** Utilitzar l'ordre YXZ implementat a `Projection3D`

### Objectes parpellegen
**Causa:** Z-fighting o punts amb z ≈ 0
**Solució:** Augmentar `viewDistance` mínim

---

## Optimitzacions

### Projectar Molts Punts
```typescript
// Dolent: Cridar project() en bucle
points.forEach(p => {
    const p2d = projection.project(p)
    // ...
})

// Bo: Usar projectMultiple()
const projected = projection.projectMultiple(points)
```

### Evitar Redibuixar
```typescript
let needsRedraw = true

function render() {
    if (needsRedraw) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        drawAxes3D(canvas, ctx, projection, { length: 150 })
        needsRedraw = false
    }
    requestAnimationFrame(render)
}

// Marcar per redibuixar quan calgui
canvas.addEventListener('mousemove', () => {
    needsRedraw = true
})
```

### Cache de Càlculs
```typescript
// Calcular una vegada
const sinYaw = Math.sin(yaw)
const cosYaw = Math.cos(yaw)

// Usar múltiples vegades
x1 = x * cosYaw + z * sinYaw
x2 = x2 * cosYaw + z2 * sinYaw
```

---

## Recursos Adicionals

### Llibres
- "Mathematics for 3D Game Programming" - Eric Lengyel
- "Real-Time Rendering" - Tomas Akenine-Möller

### Eines
- [Matrix Calculator](https://www.wolframalpha.com)
- [3D Visualizer](https://www.geogebra.org/3d)

### Documentació del Projecte
- `README_PROJECCIÓ_3D.md` - Guia completa
- `MATEMATIQUES_PROJECCIÓ_3D.md` - Teoria detallada
- `EXEMPLES_EIXOS_3D.md` - Exemples pràctics

---

**Versió:** 1.0
**Data:** Desembre 2025
