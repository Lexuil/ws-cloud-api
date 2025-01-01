import type { WsConfig } from './types/config'

export async function sendRequest({
  id,
  body,
  path,
  query,
  method,
  config
}: {
  id: 'phoneNumberId' | 'businessId'
  body?: string
  path: 'messages' | 'message_templates' | string & NonNullable<unknown>
  query?: string
  method: 'POST' | 'GET' | 'DELETE' | 'PUT' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'CONNECT' | 'TRACE' | string & NonNullable<unknown>
  config?: WsConfig
}): Promise<
  | { success: true, response: unknown }
  | { success: false, error: unknown }
  > {
  // Config
  const apiVersion = typeof process !== 'undefined'
    ? process.env.WS_CA_VERSION ?? config?.apiVersion ?? '20.0'
    : config?.apiVersion ?? '20.0'
  const phoneNumberId = typeof process !== 'undefined'
    ? process.env.WS_PHONE_NUMBER_ID ?? config?.phoneNumberId
    : config?.phoneNumberId
  const businessId = typeof process !== 'undefined'
    ? process.env.WS_BUSINESS_ID ?? config?.businessId
    : config?.businessId
  const token = typeof process !== 'undefined'
    ? process.env.WS_TOKEN ?? config?.token
    : config?.token

  const requestId = id === 'phoneNumberId' ? phoneNumberId : businessId

  // Check config
  if (requestId === undefined) {
    return {
      success: false,
      error: 'Missing request ID'
    }
  }

  if (token === undefined) {
    return {
      success: false,
      error: 'Missing token'
    }
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v${apiVersion}/${requestId}/${path}${query !== undefined ? `?${query}` : ''}`,
      {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body
      }
    )

    if (!response.ok) {
      return {
        success: false,
        error: response
      }
    }

    return {
      success: true,
      response: await response.json()
    }
  }
  catch (error) {
    console.error('Fetch failed:', error)
    return {
      success: false,
      error
    }
  }
}
