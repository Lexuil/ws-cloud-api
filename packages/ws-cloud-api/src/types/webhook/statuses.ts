import type { MessageStatus } from '../enums'

interface StatusValue {
  statuses: Status[]
}

type Status = SentStatus | DeliveredStatus | ReadStatus | FailedStatus

interface StatusBase {
  id: string
  timestamp: string
  recipient_id: string
}

interface SentStatus extends StatusBase {
  status: MessageStatus.Sent
  conversation: Conversation
  pricing: Pricing
}

interface DeliveredStatus extends StatusBase {
  status: MessageStatus.Delivered
  conversation: Conversation
  pricing: Pricing
}

interface ReadStatus extends StatusBase {
  status: MessageStatus.Read
}

interface FailedStatus extends StatusBase {
  status: MessageStatus.Failed
  errors: Error[]
}

interface Conversation {
  id: string
  expiration_timestamp: string
  origin: ConversationOrigin
}

type ConversationCategory =
  | 'authentication'
  | 'marketing'
  | 'utility'
  | 'service'
  | 'referral_conversion'

interface ConversationOrigin {
  type: ConversationCategory
}

interface Pricing {
  pricing_model: 'CBP'
  category: ConversationCategory
}

export {
  type Conversation,
  type ConversationCategory,
  type ConversationOrigin,
  type DeliveredStatus,
  type FailedStatus,
  type Pricing,
  type ReadStatus,
  type SentStatus,
  type Status,
  type StatusBase,
  type StatusValue
}
