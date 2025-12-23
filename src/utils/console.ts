export type Something = number | string | boolean | object | null | undefined
import { config } from '../config/app.config.js'

export class Console {
  static log(...args: Something[]) {
    if (!config.app.log) return
    const format = args
      .map((arg) => (typeof arg === 'object' ? '%o' : '%s'))
      .join(' ')
    console.log(
      `%c ℹ️ ${format}`,
      'color: #4CAF50; font-weight: bold;',
      ...args
    )
  }
  static write(...args: Something[]) {
    const format = args
      .map((arg) => (typeof arg === 'object' ? '%o' : '%s'))
      .join(' ')
    console.log(`%c ${format}`, 'color: #3e45d4ff; font-weight: bold;', ...args)
  }
  static error(...args: Something[]) {
    const format = args
      .map((arg) => (typeof arg === 'object' ? '%o' : '%s'))
      .join(' ')
    console.log(
      `%c ❌ ${format}`,
      'color: #F44336; font-weight: bold;',
      ...args
    )
  }
  static warn(...args: Something[]) {
    const format = args
      .map((arg) => (typeof arg === 'object' ? '%o' : '%s'))
      .join(' ')
    console.log(
      `%c ⚠️ ${format}`,
      'color: #FF9800; font-weight: bold;',
      ...args
    )
  }
}
