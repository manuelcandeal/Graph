# Sistema de Projecció 3D amb Perspectiva

Sistema complet per dibuixar gràfics 3D amb projecció en perspectiva al canvas HTML5, amb suport per a rotació de càmera, control interactiu i configuració flexible.

---

## Instal·lació i Ús Ràpid

### 1. Importar els mòduls

```typescript
import { drawAxes3D, createDefaultProjection } from './graphics/drawAxes3D'
```

### 2. Dibuixar eixos 3D

```typescript
const canvas = document.querySelector('canvas') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!

const projection = createDefaultProjection()
drawAxes3D(canvas, ctx, projection, { length: 150 })
```

Fet! Ara tens els eixos X (vermell), Y (verd) i Z (blau) dibuixats amb perspectiva.

---

## Estructura del Projecte

```
src/
├── graphics/
│   ├── Projection3D.ts       # Classe principal de projecció 3D
│   └── drawAxes3D.ts          # Funcions per dibuixar eixos
├── types/
│   └── graphics.type.ts       # Tipus TypeScript
└── main.ts                    # Exemple d'ús integrat
```

---

## Components Principals

### 1. Projection3D (Classe)

Gestiona la projecció de punts 3D a 2D amb perspectiva configurable.

**Funcionalitats:**
- Rotacions de càmera (pitch, yaw, roll)
- Control de perspectiva (focal length)
- Projeccions múltiples optimitzades

**Ús bàsic:**
```typescript
import { Projection3D } from './graphics/Projection3D'

const projection = new Projection3D({
    rotation: {
        pitch: -0.5,  // Rotació vertical (radiants)
        yaw: 0.6,     // Rotació horitzontal (radiants)
        roll: 0       // Inclinació lateral (radiants)
    },
    focalLength: 400,   // Distància focal (controla perspectiva)
    viewDistance: 500   // Distància de visualització
})

// Projectar un punt 3D
const punt3D = { x: 100, y: 50, z: 30 }
const punt2D = projection.project(punt3D)
console.log(punt2D)  // { x: 67.2, y: 33.6 }
```

### 2. drawAxes3D (Funció)

Dibuixa els eixos de coordenades 3D al canvas.

**Paràmetres:**
- `canvas`: Element canvas
- `ctx`: Context 2D
- `projection`: Instància de Projection3D
- `config`: Configuració opcional (colors, mides, etc.)

**Exemple:**
```typescript
drawAxes3D(canvas, ctx, projection, {
    length: 150,
    arrowSize: 15,
    lineWidth: 2,
    fontSize: 18,
    colors: {
        x: '#ff0000',  // Vermell
        y: '#00ff00',  // Verd
        z: '#0000ff'   // Blau
    }
})
```

---

## Matemàtiques: Explicació Breu

### Pipeline de Transformació

```
Punt 3D → Rotació → Projecció → Coordenades Canvas
(x,y,z) → Càmera  → Perspectiva → (px, py)
```

### 1. Rotació de Càmera

Utilitzem **matrices de rotació Euler** per orientar la càmera:

**Rotació Y (yaw):**
```
[ cos(θ)   0   sin(θ) ]
[   0      1     0    ]
[-sin(θ)   0   cos(θ) ]
```

**Rotació X (pitch):**
```
[ 1     0        0     ]
[ 0   cos(α)  -sin(α)  ]
[ 0   sin(α)   cos(α)  ]
```

**Rotació Z (roll):**
```
[ cos(φ)  -sin(φ)  0 ]
[ sin(φ)   cos(φ)  0 ]
[   0        0     1 ]
```

Les rotacions s'apliquen en l'ordre: **Y → X → Z** per evitar gimbal lock.

### 2. Projecció en Perspectiva

La fórmula clau de la projecció en perspectiva és:

```
x_screen = (f × x) / z
y_screen = (f × y) / z
```

On:
- `f` = focal length (distància focal)
- `x, y, z` = coordenades del punt (després de rotació)
- `z` = profunditat

**Per què funciona?**

Aquesta fórmula simula una càmera pinhole:
- Objectes **llunyans** (z gran) → resultat petit → es veuen petits
- Objectes **propers** (z petit) → resultat gran → es veuen grans

**Similitud de triangles:**
```
       Objecte (x,y,z)
            |
            | z
            |
        Càmera (pla de projecció)
            | f
            |
        Pantalla (x',y')

x' / f = x / z  →  x' = (f × x) / z
```

### 3. Focal Length: Control de Perspectiva

| Valor | Tipus | Efecte |
|-------|-------|--------|
| 200-300 | Gran angular | Molta perspectiva, deformació |
| 400-500 | Normal | Perspectiva natural |
| 600-1000 | Telefoto | Poca perspectiva, aplanat |

**Exemple visual:**
- **f = 200**: Els eixos semblen "sortir" del centre amb angle pronunciat
- **f = 800**: Els eixos semblen gairebé paral·lels (menys profunditat)

---

## Controls Interactius

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

    // Redibuixar
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, { length: 150 })

    lastX = e.clientX
    lastY = e.clientY
})

canvas.addEventListener('mouseup', () => { isDragging = false })
```

### Zoom amb Roda

```typescript
canvas.addEventListener('wheel', (e) => {
    e.preventDefault()

    const camera = projection.getCamera()
    const factor = e.deltaY > 0 ? 1.1 : 0.9

    projection.updateCamera({
        viewDistance: camera.viewDistance * factor
    })

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawAxes3D(canvas, ctx, projection, { length: 150 })
})
```

---

## Configuració Avançada

### Vistes Predefinides

**Vista Isomètrica:**
```typescript
projection.updateCamera({
    rotation: {
        pitch: -Math.atan(Math.sin(Math.PI / 4)),
        yaw: Math.PI / 4,
        roll: 0
    },
    focalLength: 600,
    viewDistance: 800
})
```

**Vista Superior (Bird's Eye):**
```typescript
projection.updateCamera({
    rotation: {
        pitch: -1.5,  // ~85° cap avall
        yaw: 0,
        roll: 0
    }
})
```

**Vista Lateral:**
```typescript
projection.updateCamera({
    rotation: {
        pitch: 0,
        yaw: Math.PI / 2,  // 90°
        roll: 0
    }
})
```

### Animacions

**Rotació Contínua:**
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

## Sistema de Coordenades

### Coordenades 3D (World Space)
```
     Y (amunt)
     |
     |
     |_____ X (dreta)
    /
   /
  Z (cap a tu)
```

### Coordenades 2D (després de projecció)
```
     Y (amunt)
     |
     |
     |_____ X (dreta)

(0,0) al centre del canvas
```

### Coordenades Canvas (píxels)
```
(0,0) _____X (dreta)
     |
     |
     Y (avall)
```

La funció `centratACanvas()` converteix automàticament de coordenades centrades a píxels.

---

## API Reference

### Projection3D

#### Constructor
```typescript
new Projection3D(config?: Partial<CameraConfig>)
```

#### Mètodes
- `project(point: Point3D): Point2D` - Projecta un punt 3D a 2D
- `projectMultiple(points: Point3D[]): Point2D[]` - Projecta múltiples punts
- `updateCamera(config: Partial<CameraConfig>)` - Actualitza configuració
- `getCamera(): CameraConfig` - Obté configuració actual

### drawAxes3D

```typescript
function drawAxes3D(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    projection: Projection3D,
    config?: AxesConfig
): void
```

**AxesConfig:**
```typescript
{
    length?: number          // Longitud dels eixos (defecte: 100)
    arrowSize?: number       // Mida puntes fletxa (defecte: 15)
    lineWidth?: number       // Gruix línies (defecte: 2)
    fontSize?: number        // Mida etiquetes (defecte: 16)
    labelOffset?: number     // Offset etiquetes (defecte: 15)
    colors?: {
        x?: string          // Color eix X (defecte: #ff0000)
        y?: string          // Color eix Y (defecte: #00ff00)
        z?: string          // Color eix Z (defecte: #0000ff)
    }
}
```

---

## Exemples Complets

Consulta aquests fitxers per a més exemples:
- `EXEMPLES_EIXOS_3D.md` - 10+ exemples d'ús diferents
- `MATEMATIQUES_PROJECCIÓ_3D.md` - Explicació matemàtica detallada
- `src/main.ts` - Implementació integrada amb controls interactius

---

## Conversions Útils

### Graus ↔ Radiants
```typescript
const radiants = graus * (Math.PI / 180)
const graus = radiants * (180 / Math.PI)
```

### Angles Comuns
| Graus | Radiants | Constant |
|-------|----------|----------|
| 30° | 0.524 | π/6 |
| 45° | 0.785 | π/4 |
| 60° | 1.047 | π/3 |
| 90° | 1.571 | π/2 |
| 180° | 3.142 | π |
| 360° | 6.283 | 2π |

---

## Depuració

### Mostrar Info de Càmera
```typescript
const camera = projection.getCamera()
console.table({
    'Pitch (°)': (camera.rotation.pitch * 180 / Math.PI).toFixed(1),
    'Yaw (°)': (camera.rotation.yaw * 180 / Math.PI).toFixed(1),
    'Roll (°)': (camera.rotation.roll * 180 / Math.PI).toFixed(1),
    'Focal Length': camera.focalLength,
    'View Distance': camera.viewDistance
})
```

### Dibuixar Info al Canvas
```typescript
ctx.fillStyle = '#fff'
ctx.font = '12px monospace'
ctx.textAlign = 'left'
ctx.fillText(`FPS: ${fps}`, 10, 20)
ctx.fillText(`Yaw: ${yaw.toFixed(1)}°`, 10, 35)
ctx.fillText(`Pitch: ${pitch.toFixed(1)}°`, 10, 50)
```

---

## Limitacions i Consideracions

1. **Gimbal Lock:** Amb angles Euler extrems (pitch = ±90°), pot haver-hi pèrdua de graus de llibertat. Per a aplicacions complexes, considera usar quaternions.

2. **Clipping:** Els punts darrere de la càmera (z < 0) es retornen com (0,0). Per a geometria complexa, implementa clipping adequat.

3. **Ordre de Pintat:** Per a objectes 3D complexos, cal ordenar per profunditat (Z-buffer o painter's algorithm).

4. **Rendiment:** Per a molts objectes, considera usar WebGL en lloc de Canvas 2D.

---

## Llicència

Aquest codi és part del projecte Graph i està disponible per a ús educatiu i comercial.

---

## Autor

Sistema de Projecció 3D
Desembre 2025 - Versió 1.0

---

## Suport i Contribucions

Per a preguntes, millores o bugs, consulta la documentació detallada a:
- `MATEMATIQUES_PROJECCIÓ_3D.md` - Teoria matemàtica completa
- `EXEMPLES_EIXOS_3D.md` - Exemples pràctics variats
