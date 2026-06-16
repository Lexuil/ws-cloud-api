import type { Err } from 'neverthrow'

// oxlint-disable max-statements
// oxlint-disable typescript/no-unsafe-type-assertion
import { err } from 'neverthrow'

import type Logger from './logger'

// Error structure =====================================================================================================
// Handled errors structure
interface GenericHandledError {
  code: string
  data?: Record<string, unknown>
}
// Unhandled error
const unhandledErrorCode = 'UNEXPECTED_ERROR' as const
type UnhandledErrorCode = typeof unhandledErrorCode
interface BaseError {
  code: typeof unhandledErrorCode
  data: GenericHandledError['data']
}

// Error builders ======================================================================================================

/**
 * Helper to build an error object type for a specific function or method that can fail.
 */
interface ErrorBuilder<T extends GenericHandledError> {
  code: T['code'] | BaseError['code']
  data?: BaseError['data']
}

/**
 * Normalize any thrown value into a plain object suitable for `extraParams`.
 * Lets callers log `{ error: toErrorInfo(e) }` without TypeScript complaining.
 */
function toErrorInfo(error: unknown): { message: string; name?: string; stack?: string } {
  if (error instanceof Error) {
    return { message: error.message, name: error.name, stack: error.stack }
  }
  if (typeof error === 'string') {
    return { message: error }
  }
  return { message: String(error) }
}

/**
 * Trigger a process termination with a custom error message so the system can be automatically redeployed.
 */
function panic(message: string, data?: Record<string, unknown>, logger?: Logger): never {
  const error = new Error(message)
  const customError = { data, message: `PANIC!: ${message}`, trace: error.stack }
  if (logger) {
    logger.error(customError)
  } else {
    console.log(JSON.stringify({ ...customError, level: 60 }))
  }
  process.exit()
}

// Error handler =======================================================================================================
const reservedErrorCodes = [
  'UNHANDLED_ERROR',
  'UNEXPECTED_ERROR',
  'CORRUPTED_DATA',
  'DATABASE_ERROR',
  'CONNECTION_ERROR'
] as const
type ReservedErrorCodes = (typeof reservedErrorCodes)[number]
type PanicErrorCode = 'PANIC'

type Handler<ICode extends string, OCode extends string> = Record<
  ICode,
  {
    code: OCode
    data?: Record<string, unknown>
    message?: string
    extraParams?: Record<string, unknown>
  }
>
//Extra codes that are allowed to be translated to, but don't necessarily met the output type
type AllowedOCodes = PanicErrorCode | UnhandledErrorCode

/**
 * Translate an error into another according to the provided handlers
 * @param error The original error
 * @param logger The instance of the logger to use
 * @param handlers And object that map each error code to a new error code
 * @param handlers.code The new error code
 * @param handlers.data The data to add to the new error
 * @param handlers.message The message to print at logging
 * @param handlers.extraParams The extra parameters to include at logging
 * @returns The new error object
 *
 * Logging Rules:
 * - All the reserved error codes such as UNEXPECTED_ERROR, UNHANDLED_ERROR and DATABASE_ERROR are automatically
 * translated to UNEXPECTED_ERROR avoiding logging.
 * - If an error is translated to UNEXPECTED_ERROR, the error is logged as and error including all the parameters,
 * so it is recommended to include all the details in this case.
 * - If an expected error us translated to another expected error, the error is logged as a log level message.
 */
function errorHandler<
  IError extends ErrorBuilder<GenericHandledError>,
  ICode extends IError['code'],
  HCode extends Exclude<ICode, ReservedErrorCodes>,
  OCode extends string,
  H extends Handler<HCode, OCode | AllowedOCodes> = Handler<HCode, OCode | AllowedOCodes>
>(
  error: IError,
  logger: Logger,
  // Intersect with never for the codes that should not be included in the handler
  handlers: H & Record<Exclude<keyof H, HCode>, never>
): ErrorBuilder<{ code: OCode }> {
  //Logger.error(error)

  // If the error is a reserved error code, return UNHANDLED_ERROR
  if (error.code in reservedErrorCodes) {
    const handlerEntry = (
      handlers as Record<
        string,
        { code?: string; extraParams?: Record<string, unknown> } | undefined
      >
    )[error.code]
    const customError = {
      code: unhandledErrorCode,
      data: { ...error.data, ...handlerEntry?.extraParams, originalCode: error.code }
    }
    logger.error(customError)
    return customError
  }
  const handler = handlers[error.code as HCode] as H[HCode]

  // If the error is Panic, execute the panic helper
  if (error.code === 'PANIC') {
    return panic(
      handler.message ?? 'Panic!',
      { data: handler.data, params: handler.extraParams },
      logger
    )
  }

  // If the output code is UNHANDLED_ERROR, log as error
  if (error.code === unhandledErrorCode) {
    const customError = { code: unhandledErrorCode, data: error.data }
    logger.error({ ...customError, message: handler.message, ...handler.extraParams })
    return customError
  }

  // Otherwise log it as log level
  const customError = { code: handler.code as OCode, data: error.data }
  logger.log({ ...customError, message: handler.message, ...handler.extraParams })
  return customError
}

/**
 * Translate an error into another according to the provided handlers
 * @param error The original error
 * @param logger The instance of the logger to use
 * @param handlers And object that map each error code to a new error code
 * @param handlers.code The new error code
 * @param handlers.data The data to add to the new error
 * @param handlers.message The message to print at logging
 * @param handlers.extraParams The extra parameters to include at logging
 * @returns The new error object wrapped in a Result to directly return
 *
 * Logging Rules:
 * - All the reserved error codes such as UNEXPECTED_ERROR, UNHANDLED_ERROR and DATABASE_ERROR are automatically
 * translated ot UNEXPECTED_ERROR avoiding logging.
 * - If an error is translated to UNEXPECTED_ERROR, the error is logged as and error including all the parameters,
 * so it is recommended to include all the details in this case.
 * - If an expected error us translated to another expected error, the error is logged as a log level message.
 */
function errorHandlerResult<
  IError extends ErrorBuilder<GenericHandledError>,
  ICode extends IError['code'],
  HCode extends Exclude<ICode, ReservedErrorCodes>,
  OCode extends string,
  H extends Handler<HCode, OCode | AllowedOCodes> = Handler<HCode, OCode | AllowedOCodes>
>(
  error: IError,
  logger: Logger,
  // Intersect with never for the codes that should not be included in the handler
  handlers: H & Record<Exclude<keyof H, HCode>, never>
): Err<never, ErrorBuilder<{ code: OCode }>> {
  return err(errorHandler(error, logger, handlers as never)) as Err<
    never,
    ErrorBuilder<{ code: OCode }>
  >
}

export {
  type BaseError,
  type ErrorBuilder,
  errorHandler,
  errorHandlerResult,
  type GenericHandledError,
  panic,
  toErrorInfo,
  type UnhandledErrorCode,
  unhandledErrorCode
}
