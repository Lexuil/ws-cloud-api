import type { Logger } from '../types/logger'

const noop = (): void => {}

function normalizeLogger(input?: Logger): Logger {
  if (!input) {
    return {
      debug: noop,
      info: (...args: unknown[]) => console.info(...args),
      warn: (...args: unknown[]) => console.warn(...args),
      error: (...args: unknown[]) => console.error(...args)
    }
  }

  return {
    debug: input.debug ?? noop,
    info: input.info ?? noop,
    warn: input.warn ?? noop,
    error: input.error ?? noop
  }
}

export function createLogger(logger?: Logger): Logger {
  return normalizeLogger(logger)
}
