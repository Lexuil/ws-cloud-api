import fetchFallback from 'cross-fetch'
import type { ResolvedConfig } from './config'
import type { Logger } from '../types/logger'

export type RequestMethod = 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE'

export interface HttpRequestOptions {
  id: 'phoneNumberId' | 'businessId'
  path: string
  query?: string
  method: RequestMethod | (string & NonNullable<unknown>)
  body?: BodyInit | null
  headers?: Record<string, string>
}

export type HttpResponse =
  | { success: true, response: unknown } |
  { success: false, error: unknown }

export interface HttpClient {
  request: (options: HttpRequestOptions) => Promise<HttpResponse>
  fetchImpl: typeof fetch
}

export function createHttpClient(config: ResolvedConfig, logger: Logger): HttpClient {
  const fetchImpl = config.fetch ?? (typeof fetch !== 'undefined' ? fetch : fetchFallback)

  const request: HttpClient['request'] = async ({ id, path, query, method, body, headers }) => {
    const requestId = id === 'phoneNumberId' ? config.phoneNumberId : config.businessId

    if (typeof requestId !== 'string') {
      return { success: false, error: 'Missing request ID' }
    }

    if (typeof config.token !== 'string') {
      return { success: false, error: 'Missing token' }
    }

    try {
      const mergedHeaders: Record<string, string> = {
        Authorization: `Bearer ${config.token}`
      }

      if (!(body instanceof FormData)) {
        mergedHeaders['Content-Type'] = 'application/json'
      }

      Object.assign(mergedHeaders, headers)

      const queryStr = typeof query === 'string' ? `?${query}` : ''
      const fetchUrl = `https://graph.facebook.com/v${config.apiVersion}/${requestId}/${path}${queryStr}`
      const response = await fetchImpl(
        fetchUrl,
        {
          method,
          headers: mergedHeaders,
          body: body ?? undefined
        }
      )

      if (!response.ok) {
        logger.error?.('HTTP request failed', { status: response.status, statusText: response.statusText })
        return { success: false, error: response }
      }

      try {
        const json = await response.json() as unknown
        return { success: true, response: json }
      }
      catch {
        return { success: true, response }
      }
    }
    catch (error) {
      logger.error?.('HTTP request threw', error)
      return { success: false, error }
    }
  }

  return {
    request,
    fetchImpl
  }
}
