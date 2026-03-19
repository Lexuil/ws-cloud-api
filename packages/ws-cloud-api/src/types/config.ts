import { type } from 'arktype'

import Logger from '@/core/logger'

const wsConfigSchema = type({
  'apiVersion?': type('/^v\\d+\\.\\d+$/'),
  'businessId?': 'string',
  'logger?': type.instanceOf(Logger),
  'phoneNumberId?': 'string',
  'token?': 'string'
})

type WsConfig = typeof wsConfigSchema.infer

export { type WsConfig, wsConfigSchema }
