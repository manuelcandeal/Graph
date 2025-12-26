import type { Point2D, Point3D, CameraConfig } from '../types/graphics.type'

/**
 * Classe per gestionar projeccions 3D amb perspectiva configurable
 *
 * MATEMÀTIQUES DE LA PROJECCIÓ EN PERSPECTIVA:
 *
 * 1. TRANSFORMACIÓ DE COORDENADES (World Space → Camera Space):
 *    - Apliquem rotacions Euler (yaw, pitch, roll) per orientar la càmera
 *    - Matrices de rotació 3x3 per a cada eix:
 *
 *      Rotació Y (yaw):        Rotació X (pitch):       Rotació Z (roll):
 *      [cos(θ)  0  sin(θ)]     [1    0       0    ]     [cos(φ)  -sin(φ)  0]
 *      [0       1  0     ]     [0  cos(α)  -sin(α)]     [sin(φ)   cos(φ)  0]
 *      [-sin(θ) 0  cos(θ)]     [0  sin(α)   cos(α)]     [0        0       1]
 *
 * 2. PROJECCIÓ EN PERSPECTIVA (Camera Space → Screen Space):
 *    - Fórmula clau: x_screen = (f * x) / z
 *                    y_screen = (f * y) / z
 *    On:
 *      f = focalLength (distància focal)
 *      z = profunditat (coordenada Z després de rotació)
 *
 *    La divisió per z crea l'efecte de perspectiva: els objectes llunyans
 *    (z gran) apareixen més petits.
 *
 * 3. SIMILITUD AMB CÀMERES REALS:
 *    - Una focal curta (f petit) → angle ampli → més perspectiva (tipus gran angular)
 *    - Una focal llarga (f gran) → angle estret → menys perspectiva (tipus telefoto)
 */
export class Projection3D {
    private camera: CameraConfig

    constructor(camera?: Partial<CameraConfig>) {
        // Configuració per defecte: càmera lleugerament elevada i rotada
        this.camera = {
            position: camera?.position || { x: 0, y: 0, z: 0 },
            rotation: camera?.rotation || {
                pitch: -0.5,  // ~-28.6° (mira lleugerament cap avall)
                yaw: 0.6,     // ~34.4° (rotada cap a la dreta)
                roll: 0
            },
            focalLength: camera?.focalLength || 400,
            viewDistance: camera?.viewDistance || 500
        }
    }

    /**
     * Actualitza la configuració de la càmera
     */
    updateCamera(camera: Partial<CameraConfig>) {
        this.camera = {
            ...this.camera,
            ...camera,
            rotation: {
                ...this.camera.rotation,
                ...camera.rotation
            },
            position: {
                ...this.camera.position,
                ...camera.position
            }
        }
    }

    /**
     * Obté la configuració actual de la càmera
     */
    getCamera(): CameraConfig {
        return { ...this.camera }
    }

    /**
     * Multiplica un vector 3D per una matriu de rotació 3x3
     */
    private multiplyMatrixVector(v: Point3D, matrix: number[][]): Point3D {
        return {
            x: matrix[0][0] * v.x + matrix[0][1] * v.y + matrix[0][2] * v.z,
            y: matrix[1][0] * v.x + matrix[1][1] * v.y + matrix[1][2] * v.z,
            z: matrix[2][0] * v.x + matrix[2][1] * v.y + matrix[2][2] * v.z
        }
    }

    /**
     * Matriu de rotació al voltant de l'eix X (pitch - amunt/avall)
     */
    private rotationMatrixX(angle: number): number[][] {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return [
            [1, 0, 0],
            [0, c, -s],
            [0, s, c]
        ]
    }

    /**
     * Matriu de rotació al voltant de l'eix Y (yaw - esquerra/dreta)
     */
    private rotationMatrixY(angle: number): number[][] {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return [
            [c, 0, s],
            [0, 1, 0],
            [-s, 0, c]
        ]
    }

    /**
     * Matriu de rotació al voltant de l'eix Z (roll - inclinació)
     */
    private rotationMatrixZ(angle: number): number[][] {
        const c = Math.cos(angle)
        const s = Math.sin(angle)
        return [
            [c, -s, 0],
            [s, c, 0],
            [0, 0, 1]
        ]
    }

    /**
     * Aplica les rotacions de la càmera a un punt 3D
     *
     * ORDRE DE ROTACIONS (important!):
     * 1. Yaw (Y) - rotació horitzontal
     * 2. Pitch (X) - rotació vertical
     * 3. Roll (Z) - inclinació
     *
     * Aquest ordre evita el gimbal lock en la majoria de casos
     */
    private rotatePoint(point: Point3D): Point3D {
        // Trasllada el punt respecte a la posició de la càmera
        let p: Point3D = {
            x: point.x - this.camera.position.x,
            y: point.y - this.camera.position.y,
            z: point.z - this.camera.position.z
        }

        // Aplica rotacions en l'ordre: Y → X → Z
        const matY = this.rotationMatrixY(this.camera.rotation.yaw)
        const matX = this.rotationMatrixX(this.camera.rotation.pitch)
        const matZ = this.rotationMatrixZ(this.camera.rotation.roll)

        p = this.multiplyMatrixVector(p, matY)
        p = this.multiplyMatrixVector(p, matX)
        p = this.multiplyMatrixVector(p, matZ)

        // Ajusta per la distància de visualització
        p.z += this.camera.viewDistance

        return p
    }

    /**
     * Projecta un punt 3D a coordenades 2D amb perspectiva
     *
     * RETORNA:
     *   - Coordenades 2D amb origen al centre (0,0)
     *   - Y positiu cap amunt
     *   - Aquestes coordenades s'han de passar a centratACanvas()
     */
    project(point: Point3D): Point2D {
        // 1. Aplica rotació de càmera
        const rotated = this.rotatePoint(point)

        // 2. Protecció contra divisió per zero o punts darrere la càmera
        // Si el punt està massa a prop o darrere, retorna un punt lluny
        if (rotated.z <= 1) {
            return { x: 0, y: 0 }
        }

        // 3. Aplica projecció en perspectiva
        // Fórmula: x_screen = (f * x) / z
        //          y_screen = (f * y) / z
        const scale = this.camera.focalLength / rotated.z

        return {
            x: rotated.x * scale,
            y: rotated.y * scale
        }
    }

    /**
     * Projecta múltiples punts (optimitzat)
     */
    projectMultiple(points: Point3D[]): Point2D[] {
        return points.map(p => this.project(p))
    }
}
