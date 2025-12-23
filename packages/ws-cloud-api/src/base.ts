import type { WsConfig } from './types/config'
import type { RequestMethod } from './core/http'
import { WsApi } from './ws-api'

export async function sendRequest(params: {
  id: 'phoneNumberId' | 'businessId'
  body?: string
  path: 'messages' | 'message_templates' | string & NonNullable<unknown>
  query?: string
  method: RequestMethod | (string & NonNullable<unknown>)
  config?: WsConfig
}): Promise<
  | { success: true, response: unknown } |
  { success: false, error: unknown }
> {
  const client = new WsApi(params.config)
  const { config: _ignored, ...rest } = params
  return await client.sendRequest(rest)
}
