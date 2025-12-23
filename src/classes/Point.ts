import type { Point2D } from "../types/types"

export class Point {
    private _x: number
    private _y: number
    private _z: number
    constructor (x: number, y: number, z: number) {
        this._x = x
        this._y = y
        this._z = z
    }
    get x () {
        return this._x
    }
    get y () {
        return this._y
    }
    get z () {
        return this._z
    }
    set x (x: number) {
        this._x = x
    }
    set y (y: number) {
        this._y = y
    }
    set z (z: number) {
        this._z = z
    }
    orthographic (): Point2D {
        return { x: this._x, y: this._y }
    }
    isometric (): Point2D {
        return { x: (this._x - this._y) * Math.cos(Math.PI / 6), y: (this._x + this._y) * Math.sin(Math.PI / 6) - this._z }
    }
    perspective (distance: number): Point2D {
        const factor = distance / (distance + this._z)
        return { x: this._x * factor, y: this._y * factor }
    }
}