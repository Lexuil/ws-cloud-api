export interface StatusValue {
  statuses: Status[]
}

export type Status = SentStatus | DeliveredStatus | ReadStatus | FailedStatus

export interface StatusBase {
  id: string
  timestamp: string
  recipient_id: string
}

export interface SentStatus extends StatusBase {
  status: 'sent'
  conversation: Conversation
  pricing: Pricing
}

export interface DeliveredStatus extends StatusBase {
  status: 'delivered'
  conversation: Conversation
  pricing: Pricing
}

export interface ReadStatus extends StatusBase {
  status: 'read'
}

export interface FailedStatus extends StatusBase {
  status: 'failed'
  errors: Error[]
}

export interface Conversation {
  id: string
  expiration_timestamp: string
  origin: ConversationOrigin
}

export interface ConversationOrigin {
  type: string
}

export interface Pricing {
  billable: boolean
  pricing_model: string
  category: string
}

export interface Error {
  code: number
  title: string
  message: string
  error_data: ErrorData
  href: string
}

export interface ErrorData {
  details: string
}
