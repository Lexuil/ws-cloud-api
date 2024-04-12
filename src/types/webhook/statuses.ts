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

export type ConversationCategory = 'authentication' |
'marketing' |
'utility' |
'service' |
'referral_conversion'

export interface ConversationOrigin {
  type: ConversationCategory
}

export interface Pricing {
  pricing_model: 'CBP'
  category: ConversationCategory
}
