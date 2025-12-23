import type { Logger } from './logger'

export interface WsConfig {
  apiVersion?: string
  phoneNumberId?: string
  businessId?: string
  token?: string
  logger?: Logger
  fetch?: typeof fetch
}
