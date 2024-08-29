import { type MediaMessage } from './media'

export interface MessageValue {
  contacts: Contact[]
  messages: Message[]
}

export interface Contact {
  profile: Profile
  wa_id: string
}

export interface Profile {
  name: string
}

export type Message = TextMessage | InteractiveMessage | ReactionMessage | MediaMessage | ButtonMessage

export interface MessageBase {
  from: string
  id: string
  timestamp: string
  context?: MessageContext
  errors?: Error[]
}

export interface MessageContext {
  id: string
  from: string
  forwarded: boolean
  frequently_forwarded: boolean
  referred_product: ReferredProduct
}

export interface ReferredProduct {
  catalog_id: string
  product_retailer_id: string
}

// ----------------------
// Text Message
export interface TextMessage extends MessageBase {
  type: 'text'
  text: Text
}

export interface Text {
  body: string
}

// ----------------------
// Reaction Message
export interface ReactionMessage extends MessageBase {
  type: 'reaction'
  reaction: Reaction
}

export interface Reaction {
  message_id: string
  emoji: string
}

// ----------------------
// Interactive Message
export interface InteractiveMessage extends MessageBase {
  type: 'interactive'
  interactive: InteractiveButton | InteractiveList | InteractiveFlow
}

export interface InteractiveButton {
  type: 'button_reply'
  button_reply: ButtonReply
}

export interface ButtonReply {
  id: string
  title: string
}

export interface InteractiveList {
  type: 'list_reply'
  list_reply: ListRowReply
}

export interface ListRowReply {
  id: string
  title: string
  description: string
}

export interface InteractiveFlow {
  type: 'nfm_reply'
  nfm_reply: {
    response_json: string
    body: 'Sent'
    name: 'flow'
  }
}

// ----------------------
// Button Message
export interface ButtonMessage extends MessageBase {
  type: 'button'
  button: ButtonContent
}

export interface ButtonContent {
  payload: string
  text: string
}
