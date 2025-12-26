# Documentació: Projecció 3D amb Perspectiva

## Introducció

Aquest document explica les matemàtiques darrere del sistema de projecció 3D implementat al projecte, incloent-hi la teoria geomètrica i les fórmules utilitzades.

---

## 1. PIPELINE DE TRANSFORMACIÓ 3D → 2D

El procés de convertir un punt 3D a coordenades 2D de pantalla segueix aquest pipeline:

```
World Space → Camera Space → Projection Space → Screen Space
   (x,y,z)   →  (rotació)  →   (perspectiva)  →  (píxels)
```

### Pas 1: World Space → Camera Space

**Objectiu:** Transformar les coordenades del món per veure-les des de la posició i orientació de la càmera.

**Transformacions aplicades:**
1. **Translació:** Moure el punt respecte a la posició de la càmera
2. **Rotació:** Aplicar les rotacions Euler (yaw, pitch, roll)

#### Matrices de Rotació

##### Rotació al voltant de l'eix Y (Yaw - rotació horitzontal)
```
R_y(θ) = [ cos(θ)   0   sin(θ) ]
         [   0      1     0    ]
         [-sin(θ)   0   cos(θ) ]
```

##### Rotació al voltant de l'eix X (Pitch - rotació vertical)
```
R_x(α) = [ 1     0        0     ]
         [ 0   cos(α)  -sin(α)  ]
         [ 0   sin(α)   cos(α)  ]
```

##### Rotació al voltant de l'eix Z (Roll - inclinació)
```
R_z(φ) = [ cos(φ)  -sin(φ)  0 ]
         [ sin(φ)   cos(φ)  0 ]
         [   0        0     1 ]
```

#### Ordre de les Rotacions

**IMPORTANT:** L'ordre de multiplicació de les rotacions és crucial. Utilitzem l'ordre **YXZ** (Yaw → Pitch → Roll):

```
P_rotated = R_z(roll) × R_x(pitch) × R_y(yaw) × P_translated
```

Aquest ordre evita el **gimbal lock** en la majoria de situacions pràctiques.

**Gimbal Lock:** Problema que ocorre quan dues rotacions s'alineen i es perd un grau de llibertat. Per exemple, amb rotacions XYZ, si pitch = 90°, yaw i roll esdevenen equivalents.

---

### Pas 2: Camera Space → Projection Space

**Objectiu:** Aplicar la projecció en perspectiva per simular com els objectes llunyans es veuen més petits.

#### Fórmula de Projecció en Perspectiva

La projecció en perspectiva utilitza una **divisió perspectiva**:

```
x_screen = (f × x) / z
y_screen = (f × y) / z
```

On:
- `f` = **focal length** (distància focal)
- `x, y, z` = coordenades del punt en camera space
- `z` = profunditat (distància al llarg de l'eix de visió)

#### Per què funciona?

Aquesta fórmula simula una **càmera pinhole** (càmera forat d'agulla):

```
       Objecte real
            |
            | z (profunditat)
            |
            ▼
    ┌───────●───────┐
    │       │       │
    │   x   │       │ ← Pla de l'objecte
    │       │       │
    └───────┴───────┘
            │
            │ f (distància focal)
            │
            ▼
        ┌───┴───┐
        │       │ ← Pla de projecció (pantalla)
        │   x'  │
        └───────┘
```

Per similitud de triangles:
```
x' / f = x / z
x' = (f × x) / z
```

**Efecte visual:**
- Si `z` és gran (lluny) → `x_screen` i `y_screen` són petits → objecte petit
- Si `z` és petit (a prop) → `x_screen` i `y_screen` són grans → objecte gran

#### Focal Length: Control de la Perspectiva

El paràmetre `f` (focal length) controla la intensitat de la perspectiva:

| Focal Length | Tipus de lent | Efecte |
|--------------|---------------|--------|
| 200-300px | Gran angular | Molta perspectiva, deformació als laterals |
| 400-500px | Normal | Perspectiva natural, similar a l'ull humà |
| 600-1000px | Telefoto | Poca perspectiva, objectes "aplanats" |

---

### Pas 3: Projection Space → Screen Space

**Objectiu:** Convertir coordenades centrades (0,0) al centre del canvas a coordenades de píxels.

#### Transformació
```typescript
toScreen(x: number, y: number): Point2D {
    return {
        x: canvas.width/2 + x,
        y: canvas.height/2 - y  // Nota: -y perquè el canvas té Y cap avall
    }
}
```

**Sistema de coordenades:**
- **Abans de toScreen():** (0,0) al centre, X+ dreta, Y+ amunt
- **Després de toScreen():** (0,0) cantonada superior esquerra (estàndard HTML Canvas)

---

## 2. EXPLICACIÓ GEOMÈTRICA DE LA PROJECCIÓ

### Concepte de Perspectiva

La perspectiva és una tècnica per representar objectes 3D en un pla 2D de manera que semblin realistes.

**Principis clau:**
1. **Línies paral·leles convergeixen** en un punt de fuga
2. **Objectes llunyans es veuen més petits**
3. **La deformació augmenta amb la distància**

### Vista de la Càmera

La càmera està definida per:

1. **Posició** (position): On està la càmera al món
2. **Orientació** (rotation): Cap a on mira
3. **Focal Length**: "Zoom" de la càmera
4. **View Distance**: Distància de visualització

#### Sistema de Coordenades de la Càmera

```
        Y (amunt)
        |
        |
        |
        └─────── X (dreta)
       /
      /
     Z (endintre de la pantalla, cap a tu)
```

---

## 3. CÀLCULS PRÀCTICS

### Exemple Numèric

**Donat:**
- Punt 3D: P = (100, 50, 200)
- Focal length: f = 400
- Rotació: yaw = 30°, pitch = -20°, roll = 0°

**Pas 1: Rotació**

Convertir angles a radiants:
```
yaw = 30° × (π/180) = 0.524 rad
pitch = -20° × (π/180) = -0.349 rad
```

Aplicar matriu de rotació (simplificat):
```
P_rotated ≈ (86, 15, 215)
```

**Pas 2: Projecció**
```
x_screen = (400 × 86) / 215 = 160
y_screen = (400 × 15) / 215 = 28
```

**Pas 3: A pantalla** (assumint canvas 800×600)
```
x_pixel = 800/2 + 160 = 560
y_pixel = 600/2 - 28 = 272
```

---

## 4. CONSIDERACIONS PRÀCTIQUES

### Protecció contra Errors

#### 1. Divisió per Zero
```typescript
if (z <= 1) {
    return { x: 0, y: 0 }  // Punt massa a prop o darrere
}
```

#### 2. Punts Darrere de la Càmera

Els punts amb `z < 0` estan **darrere** de la càmera i no s'haurien de dibuixar. La nostra implementació ajusta `z` afegint `viewDistance` per evitar valors negatius.

### Optimitzacions

#### Projectar Múltiples Punts
```typescript
const punts3D = [p1, p2, p3, /* ... */]
const punts2D = projection3D.projectMultiple(punts3D)
```

Més eficient que cridar `project()` individualment per cada punt quan es treballa amb molts punts.

---

## 5. COMPARACIÓ DE PERSPECTIVES

### Orthographic (Ortogràfica)
```
x_screen = x
y_screen = y
```
- **No hi ha perspectiva**
- Objectes llunyans i propers tenen la mateixa mida
- Útil per plànols tècnics i arquitectura

### Isometric (Isomètrica)
```
x_screen = (x - y) × cos(30°)
y_screen = (x + y) × sin(30°) - z
```
- **Perspectiva axonomètrica**
- Preserva proporcions
- Utilitzat en jocs estratègia i videojocs retro

### Perspective (Perspectiva)
```
x_screen = (f × x) / z
y_screen = (f × y) / z
```
- **Perspectiva realista**
- Simula visió humana
- Utilitzat en gràfics 3D moderns

---

## 6. ANGLES EULER I GIMBAL LOCK

### Angles Euler

Els **angles Euler** són tres rotacions al voltant dels eixos X, Y, Z que defineixen una orientació 3D.

**Avantatges:**
- Intuïtius (pitch, yaw, roll)
- Fàcils d'entendre i editar

**Desavantatges:**
- Ordre de rotació importa
- Gimbal lock

### Gimbal Lock

**Definició:** Pèrdua d'un grau de llibertat quan dues rotacions s'alineen.

**Exemple:**
Si pitch = 90° (mirant directament amunt o avall), les rotacions yaw i roll esdevenen equivalents.

**Solució:** Utilitzar **quaternions** per a rotacions complexes (no implementat en aquest projecte bàsic).

---

## 7. EXTENSIONS POSSIBLES

### Matriu de Projecció Completa

Per a un sistema més avançat, es pot utilitzar una matriu 4×4:

```
[ f/aspect   0      0           0     ]
[    0       f      0           0     ]
[    0       0   -(far+near)  -2fn    ]
[               /(far-near)  /(far-near)]
[    0       0     -1          0     ]
```

On:
- `aspect` = amplada / alçada del canvas
- `near` = pla de tall proper
- `far` = pla de tall llunyà

### Culling i Clipping

Per a millor rendiment:
1. **Frustum culling:** No dibuixar objectes fora del camp de visió
2. **Backface culling:** No dibuixar cares posteriors
3. **Z-clipping:** Retallar geometria que travessa plans de tall

---

## 8. REFERÈNCIES I RECURSOS

### Llibres Recomanats
- "Mathematics for 3D Game Programming and Computer Graphics" - Eric Lengyel
- "Real-Time Rendering" - Tomas Akenine-Möller

### Conceptes Relacionats
- Transformacions homogènies (4D)
- Quaternions per rotacions
- Matrius de vista i projecció (OpenGL/WebGL)
- Pipeline gràfic modern (vertex shader, fragment shader)

---

## 9. GLOSSARI

| Terme | Definició |
|-------|-----------|
| **Focal Length** | Distància focal que controla la intensitat de la perspectiva |
| **Pitch** | Rotació al voltant de l'eix X (amunt/avall) |
| **Yaw** | Rotació al voltant de l'eix Y (esquerra/dreta) |
| **Roll** | Rotació al voltant de l'eix Z (inclinació lateral) |
| **Gimbal Lock** | Pèrdua de grau de llibertat en rotacions Euler |
| **Perspective Division** | Divisió per Z per crear efecte de perspectiva |
| **View Distance** | Distància de la càmera a l'origen del món |
| **Camera Space** | Sistema de coordenades relatiu a la càmera |
| **World Space** | Sistema de coordenades absolut del món |

---

**Autor:** Sistema de Projecció 3D
**Data:** Desembre 2025
**Versió:** 1.0
