export default class Logger {
  readonly debug: (...args: unknown[]) => void
  readonly log: (...args: unknown[]) => void
  readonly error: (...args: unknown[]) => void
  readonly info: (...args: unknown[]) => void
  readonly warn: (...args: unknown[]) => void

  // oxlint-disable-next-line max-statements
  constructor(input?: Logger) {
    if (input) {
      this.debug = (...args: unknown[]) => input.debug(...args)
      this.log = (...args: unknown[]) => input.log(...args)
      this.error = (...args: unknown[]) => input.error(...args)
      this.info = (...args: unknown[]) => input.info(...args)
      this.warn = (...args: unknown[]) => input.warn(...args)
    } else {
      this.debug = (...args: unknown[]) => console.debug(...args)
      this.log = (...args: unknown[]) => console.log(...args)
      this.error = (...args: unknown[]) => console.error(...args)
      this.info = (...args: unknown[]) => console.info(...args)
      this.warn = (...args: unknown[]) => console.warn(...args)
    }
  }
}
