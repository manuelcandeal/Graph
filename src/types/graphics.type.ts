/**
 * Tipus relacionats amb gràfics 3D i projeccions
 */

export type Point2D = {
    x: number
    y: number
}

export type Point3D = {
    x: number
    y: number
    z: number
}

export type CameraConfig = {
    position: Point3D
    rotation: {
        pitch: number  // Rotació al voltant de l'eix X (amunt/avall)
        yaw: number    // Rotació al voltant de l'eix Y (esquerra/dreta)
        roll: number   // Rotació al voltant de l'eix Z (inclinació)
    }
    focalLength: number  // Distància focal (controla la intensitat de la perspectiva)
    viewDistance: number // Distància de la càmera a l'origen
}
