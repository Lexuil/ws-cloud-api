import type { Result } from 'neverthrow'

import { err, ok } from 'neverthrow'
// oxlint-disable max-statements
import { ofetch } from 'ofetch'

import type { Logger } from '../types/logger'
import type { ResolvedConfig } from './config'

import { API_ENDPOINT } from './config'

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
  body?: BodyInit
  headers?: Record<string, string>
}

type HttpResponse<T = unknown> = Result<{ response: T }, { error: unknown }>

interface HttpClient {
  request: <T = unknown>(options: HttpRequestOptions) => Promise<HttpResponse<T>>
  fetch: typeof ofetch
}

function createHttpClient(config: ResolvedConfig, logger: Logger): HttpClient {
  async function request<T = unknown>({
    id,
    path,
    query,
    method,
    body,
    headers
  }: HttpRequestOptions): Promise<HttpResponse<T>> {
    const requestId = id === 'phoneNumberId' ? config.phoneNumberId : config.businessId

    if (typeof requestId !== 'string') {
      return err({ error: 'Missing request ID' })
    }

    if (typeof config.token !== 'string') {
      return err({ error: 'Missing token' })
    }

    try {
      const mergedHeaders: Record<string, string> = { Authorization: `Bearer ${config.token}` }

      if (!(body instanceof FormData)) {
        mergedHeaders['Content-Type'] = 'application/json'
      }

      Object.assign(mergedHeaders, headers)

      const queryStr = typeof query === 'string' ? `?${query}` : ''
      const fetchUrl = `${API_ENDPOINT}/${config.apiVersion}/${requestId}/${path}${queryStr}`

      try {
        const response = await ofetch(fetchUrl, {
          body: body ?? undefined,
          headers: mergedHeaders,
          method
        })

        return ok({ response })
      } catch (error) {
        logger.error?.('HTTP request threw', error)
        return err({ error })
      }
    } catch (error) {
      logger.error?.('HTTP request threw', error)
      return err({ error })
    }
  }

  return { fetch: ofetch, request }
}

export {
  type RequestMethod,
  type HttpRequestOptions,
  type HttpResponse,
  type HttpClient,
  createHttpClient
}
