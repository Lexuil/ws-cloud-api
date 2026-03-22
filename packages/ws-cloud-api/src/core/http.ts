// oxlint-disable max-statements
import type { Result } from 'neverthrow'

import { err, ok } from 'neverthrow'
import { ofetch } from 'ofetch'

import type { Logger } from '@/types/logger'

import type { ResolvedConfig } from './config'
import type { ErrorBuilder } from './error-handler'

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
  id: 'phoneNumberId' | 'businessId' | (string & NonNullable<unknown>)
  path?: string
  query?: string
  method: RequestMethod | (string & NonNullable<unknown>)
  body?: BodyInit
  headers?: Record<string, string>
}

interface HttpResponse<T = unknown> {
  response: T
}

interface HttpClient {
  request: <T = unknown>(
    options: HttpRequestOptions
  ) => Promise<
    Result<
      HttpResponse<T>,
      ErrorBuilder<{ code: 'HTTP_REQUEST_ERROR' } | { code: 'UNEXPECTED_ERROR' }>
    >
  >
  fetch: typeof ofetch
}

function createHttpClient(config: ResolvedConfig, _logger: Logger): HttpClient {
  async function request<T = unknown>({
    id,
    path,
    query,
    method,
    body,
    headers
  }: HttpRequestOptions): Promise<
    Result<HttpResponse<T>, ErrorBuilder<{ code: 'HTTP_REQUEST_ERROR' }>>
  > {
    const requestId = id === 'phoneNumberId' ? config.phoneNumberId : (config.businessId ?? id)

    try {
      const mergedHeaders: Record<string, string> = { Authorization: `Bearer ${config.token}` }

      if (!(body instanceof FormData)) {
        mergedHeaders['Content-Type'] = 'application/json'
      }

      Object.assign(mergedHeaders, headers)

      const queryStr = typeof query === 'string' ? `?${query}` : ''
      const fetchUrl = `${API_ENDPOINT}/${config.apiVersion}/${requestId}${path ? `/${path}` : ''}${queryStr}`

      try {
        const response = await ofetch<T>(fetchUrl, {
          body: body ?? undefined,
          headers: mergedHeaders,
          method
        })

        return ok({ response })
      } catch (error) {
        return err({ code: 'HTTP_REQUEST_ERROR', extraParams: { error } })
      }
    } catch (error) {
      return err({ code: 'UNEXPECTED_ERROR', extraParams: { error } })
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
