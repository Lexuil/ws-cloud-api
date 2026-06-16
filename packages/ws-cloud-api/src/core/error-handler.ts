// oxlint-disable promise/prefer-await-to-then
// oxlint-disable typescript/no-unsafe-type-assertion
// oxlint-disable max-statements
// oxlint-disable import/group-exports
// oxlint-disable import/exports-last
import { err, Err } from 'neverthrow'

import type Logger from './logger'

// Error structure =====================================================================================================
// Handled errors structure
export interface GenericHandledError {
  code: string
  data?: Record<string, unknown>
}
// Unhandled error
export const unhandledErrorCode = 'UNEXPECTED_ERROR' as const
export type UnhandledErrorCode = typeof unhandledErrorCode
export interface BaseError {
  code: typeof unhandledErrorCode
  data: GenericHandledError['data']
}

// Error builders ======================================================================================================

/**
 * Helper to build an error object type for a specific function or method that can fail.
 */
export interface ErrorBuilder<T extends GenericHandledError> {
  code: T['code'] | BaseError['code']
  data?: BaseError['data']
}

/**
 * Trigger a process termination with a custom error message so the system can be automatically redeployed.
 */
export function panic(message: string, data?: Record<string, unknown>, logger?: Logger): never {
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
export function errorHandler<
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
    return { code: unhandledErrorCode, data: error.data }
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

export function errorHandlerResult<
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return err(errorHandler(error, logger, handlers as any)) as Err<
    never,
    ErrorBuilder<{ code: OCode }>
  >
}

// Decorators ==========================================================================================================

export class ErrorExceptionError<
  T extends GenericHandledError = GenericHandledError
> extends Error {
  private readonly error: T

  constructor(error: T) {
    super(error.code)
    this.name = 'ErrorExceptionError'
    this.error = error
  }
  getError(): T {
    return this.error
  }
}

/**
 * Generates an exception if the result is a result error
 */
export function ThrowIfError(): MethodDecorator {
  return (_target: unknown, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as unknown

    if (typeof originalMethod !== 'function') {
      throw new Error(`@ThrowIfError can only be applied to methods`)
    }

    function parseResult(...args: unknown[]): unknown {
      const [res] = args
      if (res instanceof Err && res.isErr()) {
        const error = res.error as GenericHandledError
        throw new ErrorExceptionError(error)
      }
      return args
    }

    // oxlint-disable-next-line func-style
    const wrappedMethod = function wrappedMethod(this: unknown, ...args: unknown[]): unknown {
      const result = originalMethod.apply(this, args) as unknown
      return result instanceof Promise ? result.then(parseResult) : parseResult(result)
    }

    descriptor.value = wrappedMethod
    return descriptor
  }
}

export function ExceptionToError(): MethodDecorator {
  return (_target: unknown, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value as unknown

    if (typeof originalMethod !== 'function') {
      throw new Error(`@ExceptionToError can only be applied to methods`)
    }

    function handleError(error: unknown): unknown {
      if (error instanceof ErrorExceptionError) {
        return err(error.getError())
      }
      return err({ code: 'UNEXPECTED_ERROR', data: { error } })
    }

    // oxlint-disable-next-line func-style
    const wrappedMethod = function wrappedMethod(this: unknown, ...args: unknown[]): unknown {
      const execute = (): unknown => {
        try {
          return originalMethod.apply(this, args)
        } catch (error: unknown) {
          return handleError(error)
        }
      }
      const result = execute()

      return result instanceof Promise ? result.catch(handleError) : result
    }
    descriptor.value = wrappedMethod
    return descriptor
  }
}
