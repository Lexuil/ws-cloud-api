import type { MessageValue } from './messages'
import type { StatusValue } from './statuses'

interface WebhookSubscribeQuery {
  'hub.mode': 'subscribe'
  'hub.challenge': string
  'hub.verify_token': string
}

interface WsRequest {
  object: 'whatsapp_business_account'
  entry: Entry[]
}

interface Entry {
  id: string
  changes: Change[]
}

interface Change {
  value: Value
  field: 'messages'
}

type Value = ValueBase & (StatusValue | MessageValue)

interface ValueBase {
  messaging_product: 'whatsapp'
  metadata: Metadata
}

interface Metadata {
  display_phone_number: string
  phone_number_id: string
}

interface Error {
  code: number
  title: string
  message: string
  error_data: ErrorData
}

interface ErrorData {
  details: string
}

export {
  type Change,
  type Entry,
  type Error,
  type ErrorData,
  type Metadata,
  type Value,
  type ValueBase,
  type WebhookSubscribeQuery,
  type WsRequest
}
