import { Console } from "../utils/console"

export class PageError extends Error {
    constructor (message: string) {
        super(message)
        this.name = 'PageError'
        Console.error(`[PageError]: ${message}`)
    }
}