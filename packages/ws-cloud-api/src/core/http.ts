import fetchFallback from 'cross-fetch'

import type { Logger } from '../types/logger'
import type { ResolvedConfig } from './config'

type RequestMethod =
  | 'POST'
  | 'GET'
  | 'DELETE'
  | 'PUT'
  | 'PATCH'
  | 'OPTIONS'
  | 'HEAD'
  | 'CONNECT'
  | 'TRACE'

interface HttpRequestOptions {
  id: 'phoneNumberId' | 'businessId'
  path: string
  query?: string
  method: RequestMethod | (string & NonNullable<unknown>)
  body?: BodyInit | null
  headers?: Record<string, string>
}

type HttpResponse = { success: true; response: unknown } | { success: false; error: unknown }

interface HttpClient {
  request: (options: HttpRequestOptions) => Promise<HttpResponse>
  fetchImpl: typeof fetch
}

function createHttpClient(config: ResolvedConfig, logger: Logger): HttpClient {
  const fetchImpl = config.fetch ?? (typeof fetch !== 'undefined' ? fetch : fetchFallback)

  const request: HttpClient['request'] = async ({ id, path, query, method, body, headers }) => {
    const requestId = id === 'phoneNumberId' ? config.phoneNumberId : config.businessId

    if (typeof requestId !== 'string') {
      return { error: 'Missing request ID', success: false }
    }

    if (typeof config.token !== 'string') {
      return { error: 'Missing token', success: false }
    }

    try {
      const mergedHeaders: Record<string, string> = { Authorization: `Bearer ${config.token}` }

      if (!(body instanceof FormData)) {
        mergedHeaders['Content-Type'] = 'application/json'
      }

      Object.assign(mergedHeaders, headers)

      const queryStr = typeof query === 'string' ? `?${query}` : ''
      const fetchUrl = `https://graph.facebook.com/v${config.apiVersion}/${requestId}/${path}${queryStr}`
      const response = await fetchImpl(fetchUrl, {
        body: body ?? undefined,
        headers: mergedHeaders,
        method
      })

      if (!response.ok) {
        logger.error?.('HTTP request failed', {
          status: response.status,
          statusText: response.statusText
        })
        return { error: response, success: false }
      }

      try {
        const json = (await response.json()) as unknown
        return { response: json, success: true }
      } catch {
        return { response, success: true }
      }
    } catch (error) {
      logger.error?.('HTTP request threw', error)
      return { error, success: false }
    }
  }

  return { fetchImpl, request }
}

export {
  type RequestMethod,
  type HttpRequestOptions,
  type HttpResponse,
  type HttpClient,
  createHttpClient
}
