import { type MessageStatus } from '../enums'

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
  status: MessageStatus.Sent
  conversation: Conversation
  pricing: Pricing
}

export interface DeliveredStatus extends StatusBase {
  status: MessageStatus.Delivered
  conversation: Conversation
  pricing: Pricing
}

export interface ReadStatus extends StatusBase {
  status: MessageStatus.Read
}

export interface FailedStatus extends StatusBase {
  status: MessageStatus.Failed
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
