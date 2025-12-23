import type { WsConfig } from '../types/config'

export interface ResolvedConfig {
  apiVersion: string
  phoneNumberId?: string
  businessId?: string
  token?: string
  fetch?: typeof fetch
}

const defaultApiVersion = '24.0'

export function resolveConfig(config?: WsConfig): ResolvedConfig {
  const apiVersion = config?.apiVersion ?? process.env.WS_CA_VERSION ?? defaultApiVersion
  const phoneNumberId = config?.phoneNumberId ?? process.env.WS_PHONE_NUMBER_ID
  const businessId = config?.businessId ?? process.env.WS_BUSINESS_ID
  const token = config?.token ?? process.env.WS_TOKEN

  return {
    apiVersion,
    phoneNumberId,
    businessId,
    token,
    fetch: config?.fetch
  }
}
