import { type } from 'arktype'

import type { WsConfig } from '@/types/config'

import { wsConfigSchema } from '@/types/config'

const API_ENDPOINT = 'https://graph.facebook.com'
const DEFAULT_API_VERSION = 'v24.0'

const resolvedConfigSchema = type({
  apiVersion: wsConfigSchema.get('apiVersion'),
  businessId: wsConfigSchema.get('businessId'),
  phoneNumberId: wsConfigSchema.get('phoneNumberId'),
  token: wsConfigSchema.get('token')
})

type ResolvedConfig = typeof resolvedConfigSchema.infer

function resolveConfig(config?: WsConfig): ResolvedConfig {
  const validationResult = resolvedConfigSchema({
    apiVersion: config?.apiVersion ?? process.env.WS_CA_VERSION ?? DEFAULT_API_VERSION,
    businessId: config?.businessId ?? process.env.WS_BUSINESS_ID,
    phoneNumberId: config?.phoneNumberId ?? process.env.WS_PHONE_NUMBER_ID,
    token: config?.token ?? process.env.WS_TOKEN
  })

  if (validationResult instanceof type.errors) {
    throw new Error(`Invalid or missing configuration: ${validationResult.summary}`)
  } else {
    return validationResult
  }
}

export { type ResolvedConfig, resolveConfig, API_ENDPOINT }
