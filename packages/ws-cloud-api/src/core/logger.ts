import type { Logger } from '../types/logger'

function noop(): void {}

function normalizeLogger(input?: Logger): Logger {
  if (!input) {
    return {
      debug: noop,
      error: (...args: unknown[]) => console.error(...args),
      info: (...args: unknown[]) => console.info(...args),
      warn: (...args: unknown[]) => console.warn(...args)
    }
  }

  return {
    debug: input.debug ?? noop,
    error: input.error ?? noop,
    info: input.info ?? noop,
    warn: input.warn ?? noop
  }
}

export default function createLogger(logger?: Logger): Logger {
  return normalizeLogger(logger)
}
