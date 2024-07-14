import type { MessageValue } from './messages'
import type { StatusValue } from './statuses'

export interface WebhookSubscribeQuery {
  'hub.mode': 'subscribe'
  'hub.challenge': string
  'hub.verify_token': string
}

export interface WsRequest {
  object: 'whatsapp_business_account'
  entry: Entry[]
}

export interface Entry {
  id: string
  changes: Change[]
}

export interface Change {
  value: Value
  field: 'messages'
}

export type Value = ValueBase & (StatusValue | MessageValue)

export interface ValueBase {
  messaging_product: 'whatsapp'
  metadata: Metadata
}

export interface Metadata {
  display_phone_number: string
  phone_number_id: string
}

export interface Error {
  code: number
  title: string
  message: string
  error_data: ErrorData
}

export interface ErrorData {
  details: string
}
