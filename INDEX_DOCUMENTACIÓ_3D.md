# Índex de Documentació: Sistema de Projecció 3D

Guia completa de tots els recursos disponibles per al sistema de gràfics 3D.

---

## Començar Ràpidament

### 1. Primer Pas: Lectura Bàsica
Llegeix aquests fitxers en aquest ordre per començar:

1. **`README_PROJECCIÓ_3D.md`** (5-10 min)
   - Què és el sistema i com funciona
   - Instal·lació i ús bàsic
   - Primers passos

2. **`CHEAT_SHEET_3D.md`** (3 min)
   - Referència ràpida de fórmules
   - Conversions comunes
   - Codi de copiar/enganxar

3. **`EXEMPLES_EIXOS_3D.md`** (10 min)
   - 10+ exemples pràctics
   - Configuracions predefinides
   - Controls interactius

### 2. Segon Pas: Implementació
Revisa el codi font:

1. **`src/graphics/drawAxes3D.ts`**
   - Funció principal per dibuixar eixos
   - Fàcil d'entendre i modificar

2. **`src/main.ts`**
   - Exemple d'integració
   - Controls interactius implementats

3. **`src/demos/demo3DAxes.ts`**
   - 10 demos diferents
   - Experimenta amb diferents vistes

### 3. Tercer Pas: Matemàtiques (Opcional)
Si vols entendre la teoria:

1. **`MATEMATIQUES_PROJECCIÓ_3D.md`** (30 min)
   - Explicació matemàtica completa
   - Matrices de rotació
   - Projecció en perspectiva detallada

---

## Documentació per Nivell

### Nivell Principiant

**Objectiu:** Usar el sistema sense entendre les matemàtiques

1. `README_PROJECCIÓ_3D.md` - Secció "Instal·lació i Ús Ràpid"
2. `EXEMPLES_EIXOS_3D.md` - Exemple Bàsic
3. `CHEAT_SHEET_3D.md` - Configuracions Típiques

**Temps:** 15-20 minuts

### Nivell Intermedi

**Objectiu:** Personalitzar i adaptar el sistema

1. `README_PROJECCIÓ_3D.md` - Complet
2. `EXEMPLES_EIXOS_3D.md` - Tots els exemples
3. `src/graphics/drawAxes3D.ts` - Codi font
4. `CHEAT_SHEET_3D.md` - Complet

**Temps:** 45-60 minuts

### Nivell Avançat

**Objectiu:** Entendre i modificar les matemàtiques

1. `MATEMATIQUES_PROJECCIÓ_3D.md` - Complet
2. `src/graphics/Projection3D.ts` - Codi font
3. Llibres recomanats a la documentació

**Temps:** 2-3 hores

---

## Documentació per Objectiu

### Vull Dibuixar Eixos 3D
→ `README_PROJECCIÓ_3D.md` (Secció "Instal·lació i Ús Ràpid")
→ `src/main.ts` (Línia 116-131)

### Vull Canviar la Perspectiva
→ `EXEMPLES_EIXOS_3D.md` (Secció "Configuracions Típiques")
→ `CHEAT_SHEET_3D.md` (Secció "Configuracions Típiques")

### Vull Afegir Controls Interactius
→ `EXEMPLES_EIXOS_3D.md` (Secció "Control Interactiu amb Ratolí")
→ `src/main.ts` (Línia 141-183)

### Vull Crear Animacions
→ `EXEMPLES_EIXOS_3D.md` (Secció "Animació - Rotació Contínua")
→ `src/demos/demo3DAxes.ts` (Funció `demoRotatingAnimation`)

### Vull Entendre les Matemàtiques
→ `MATEMATIQUES_PROJECCIÓ_3D.md` (Tot)
→ `CHEAT_SHEET_3D.md` (Secció "Fórmules Essencials")

### Vull Personalitzar Colors i Estils
→ `README_PROJECCIÓ_3D.md` (Secció "API Reference")
→ `EXEMPLES_EIXOS_3D.md` (Exemple "Colors Personalitzats")

---

## Estructura de Fitxers

### Documentació (Markdown)

```
E:\Desenvolupament\Graph\
├── README_PROJECCIÓ_3D.md          (~400 línies)
│   └── Guia completa d'ús del sistema
│
├── MATEMATIQUES_PROJECCIÓ_3D.md    (~500 línies)
│   └── Explicació matemàtica detallada
│
├── EXEMPLES_EIXOS_3D.md            (~350 línies)
│   └── 10+ exemples pràctics
│
├── CHEAT_SHEET_3D.md               (~300 línies)
│   └── Referència ràpida
│
├── RESUM_IMPLEMENTACIÓ.md          (~350 línies)
│   └── Resum tècnic de la implementació
│
└── INDEX_DOCUMENTACIÓ_3D.md        (aquest fitxer)
    └── Índex de tots els recursos
```

### Codi Font (TypeScript)

```
E:\Desenvolupament\Graph\src\
├── types\
│   └── graphics.type.ts            (~25 línies)
│       └── Tipus: Point2D, Point3D, CameraConfig
│
├── graphics\
│   ├── Projection3D.ts             (~200 línies)
│   │   └── Classe principal de projecció 3D
│   │
│   └── drawAxes3D.ts               (~200 línies)
│       └── Funcions per dibuixar eixos
│
├── demos\
│   └── demo3DAxes.ts               (~350 línies)
│       └── 10 demos predefinides
│
└── main.ts                         (~185 línies)
    └── Exemple d'integració
```

---

## Mapa de Conceptes

### Conceptes Bàsics
- **Punt 3D**: Coordenades (x, y, z) a l'espai
- **Punt 2D**: Coordenades (x, y) a la pantalla
- **Projecció**: Conversió de 3D a 2D
- **Perspectiva**: Objectes llunyans es veuen petits

📖 **On aprendre:**
- `README_PROJECCIÓ_3D.md` - Secció "Components Principals"
- `CHEAT_SHEET_3D.md` - Secció "Sistemes de Coordenades"

### Rotacions
- **Pitch**: Amunt/avall (rotació X)
- **Yaw**: Esquerra/dreta (rotació Y)
- **Roll**: Inclinació (rotació Z)
- **Euler Angles**: Representació amb 3 angles
- **Gimbal Lock**: Problema amb angles extrems

📖 **On aprendre:**
- `MATEMATIQUES_PROJECCIÓ_3D.md` - Secció "Angles Euler i Gimbal Lock"
- `CHEAT_SHEET_3D.md` - Secció "Matrices de Rotació"

### Càmera
- **Position**: On està la càmera
- **Rotation**: Cap a on mira (pitch, yaw, roll)
- **Focal Length**: "Zoom" o intensitat de perspectiva
- **View Distance**: Distància de visualització

📖 **On aprendre:**
- `README_PROJECCIÓ_3D.md` - Secció "Configuració Avançada"
- `CHEAT_SHEET_3D.md` - Secció "Paràmetres i Efectes"

### Matemàtiques
- **Matriu de Rotació**: Transforma coordenades
- **Similitud de Triangles**: Base de la projecció
- **Pipeline de Transformació**: 3D → Rotació → Projecció → 2D

📖 **On aprendre:**
- `MATEMATIQUES_PROJECCIÓ_3D.md` - Seccions 1-3
- `CHEAT_SHEET_3D.md` - Secció "Fórmules Essencials"

---

## Casos d'Ús Comuns

### Cas 1: Visualitzador Simple
**Necessites:** Dibuixar eixos amb perspectiva

**Fitxers:**
1. `README_PROJECCIÓ_3D.md` (Secció "Instal·lació")
2. `CHEAT_SHEET_3D.md` (Setup Bàsic)

**Codi:**
```typescript
import { drawAxes3D, createDefaultProjection } from './graphics/drawAxes3D'
const projection = createDefaultProjection()
drawAxes3D(canvas, ctx, projection, { length: 150 })
```

**Temps:** 5 minuts

---

### Cas 2: Visor Interactiu
**Necessites:** Controls de ratolí per rotar

**Fitxers:**
1. `EXEMPLES_EIXOS_3D.md` (Exemple "Control Interactiu")
2. `src/main.ts` (Línia 141-183)

**Codi:**
Copiar el codi de `main.ts` directament

**Temps:** 10 minuts

---

### Cas 3: Aplicació amb Múltiples Vistes
**Necessites:** Mostrar diferents perspectives

**Fitxers:**
1. `EXEMPLES_EIXOS_3D.md` (Tots els exemples de vistes)
2. `src/demos/demo3DAxes.ts` (Demos 1-7)

**Codi:**
```typescript
import { demoShowcase } from './demos/demo3DAxes'
const stop = demoShowcase(canvas, ctx)
```

**Temps:** 20 minuts

---

### Cas 4: Gràfic 3D Personalitzat
**Necessites:** Projectar els teus propis punts 3D

**Fitxers:**
1. `README_PROJECCIÓ_3D.md` (Secció "Projection3D")
2. `src/graphics/Projection3D.ts` (Mètode `project()`)

**Codi:**
```typescript
const projection = new Projection3D()
const myPoint3D = { x: 100, y: 50, z: 30 }
const projected2D = projection.project(myPoint3D)

// Dibuixar el punt
const widthCSS = parseFloat(canvas.style.width)
const heightCSS = parseFloat(canvas.style.height)
const px = projected2D.x + widthCSS / 2
const py = heightCSS / 2 - projected2D.y

ctx.fillStyle = '#fff'
ctx.beginPath()
ctx.arc(px, py, 5, 0, Math.PI * 2)
ctx.fill()
```

**Temps:** 30 minuts

---

## FAQ Ràpid

### Com canvio la perspectiva?
```typescript
projection.updateCamera({
    rotation: { pitch: -0.7, yaw: 0.8, roll: 0 }
})
```
→ `CHEAT_SHEET_3D.md` - Secció "Canviar Vista"

### Com faig zoom?
```typescript
projection.updateCamera({
    viewDistance: 700  // Més gran = més lluny
})
```
→ `CHEAT_SHEET_3D.md` - Secció "Zoom amb Roda"

### Com canvio els colors?
```typescript
drawAxes3D(canvas, ctx, projection, {
    colors: { x: '#ff6b6b', y: '#51cf66', z: '#339af0' }
})
```
→ `README_PROJECCIÓ_3D.md` - Secció "API Reference"

### Com faig una animació?
```typescript
let angle = 0
function animate() {
    projection.updateCamera({
        rotation: { pitch: -0.5, yaw: angle, roll: 0 }
    })
    // Redibuixar...
    angle += 0.01
    requestAnimationFrame(animate)
}
animate()
```
→ `EXEMPLES_EIXOS_3D.md` - Secció "Animació"

---

## Checklist d'Aprenentatge

### Nivell 1: Bàsic
- [ ] He llegit `README_PROJECCIÓ_3D.md` (Secció "Instal·lació")
- [ ] He executat l'exemple bàsic
- [ ] Veig els eixos X, Y, Z al canvas
- [ ] Entenc què fa `drawAxes3D()`

### Nivell 2: Intermedi
- [ ] He provat diferents configuracions de càmera
- [ ] He implementat controls de ratolí
- [ ] Entenc què fan pitch, yaw i roll
- [ ] Puc canviar colors i mides

### Nivell 3: Avançat
- [ ] Entenc les matrices de rotació
- [ ] Entenc la fórmula de projecció en perspectiva
- [ ] He projectat els meus propis punts 3D
- [ ] Puc modificar `Projection3D.ts`

---

## Recursos Externs

### Matemàtiques
- **Khan Academy** - Àlgebra lineal
- **3Blue1Brown** - Essence of Linear Algebra (YouTube)
- **Scratchapixel** - Computer Graphics Tutorials

### WebGL i Canvas
- **MDN Web Docs** - Canvas API
- **WebGL Fundamentals** - webglfundamentals.org

### Llibres
- "Mathematics for 3D Game Programming" - Eric Lengyel
- "Real-Time Rendering" - Tomas Akenine-Möller

---

## Suport i Contribucions

### Tinc un Error
1. Revisa `CHEAT_SHEET_3D.md` - Secció "Errors Comuns"
2. Consulta `README_PROJECCIÓ_3D.md` - Secció "Depuració"
3. Revisa la consola del navegador

### Vull Contribuir
1. Llegeix tot `MATEMATIQUES_PROJECCIÓ_3D.md`
2. Revisa el codi font a `src/graphics/`
3. Proposa millores

---

## Estadístiques del Projecte

**Codi:**
- TypeScript: ~800 línies
- Comentaris: ~300 línies
- Total codi: ~1100 línies

**Documentació:**
- Markdown: ~2000 línies
- Exemples de codi: ~500 línies
- Total documentació: ~2500 línies

**Fitxers:**
- Codi font: 5 fitxers
- Documentació: 6 fitxers
- Total: 11 fitxers

**Temps estimat d'aprenentatge:**
- Bàsic: 30 minuts
- Intermedi: 2 hores
- Avançat: 4-6 hores

---

**Versió:** 1.0
**Data:** Desembre 2025
**Estat:** Complet i llest per usar
