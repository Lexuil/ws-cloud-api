import type { MediaMessage } from './media'

interface MessageValue {
  contacts: Contact[]
  messages: Message[]
}

interface Contact {
  profile: Profile
  wa_id: string
}

interface Profile {
  name: string
}

type Message = TextMessage | InteractiveMessage | ReactionMessage | MediaMessage | ButtonMessage

interface MessageBase {
  from: string
  id: string
  timestamp: string
  context?: MessageContext
  errors?: Error[]
}

interface MessageContext {
  id: string
  from: string
  forwarded: boolean
  frequently_forwarded: boolean
  referred_product: ReferredProduct
}

interface ReferredProduct {
  catalog_id: string
  product_retailer_id: string
}

// ----------------------
// Text Message
interface TextMessage extends MessageBase {
  type: 'text'
  text: Text
}

interface Text {
  body: string
}

// ----------------------
// Reaction Message
interface ReactionMessage extends MessageBase {
  type: 'reaction'
  reaction: Reaction
}

interface Reaction {
  message_id: string
  emoji: string
}

// ----------------------
// Interactive Message
interface InteractiveMessage extends MessageBase {
  type: 'interactive'
  interactive: InteractiveButton | InteractiveList | InteractiveFlow
}

interface InteractiveButton {
  type: 'button_reply'
  button_reply: ButtonReply
}

interface ButtonReply {
  id: string
  title: string
}

interface InteractiveList {
  type: 'list_reply'
  list_reply: ListRowReply
}

interface ListRowReply {
  id: string
  title: string
  description: string
}

interface InteractiveFlow {
  type: 'nfm_reply'
  nfm_reply: { response_json: string; body: 'Sent'; name: 'flow' }
}

// ----------------------
// Button Message
interface ButtonMessage extends MessageBase {
  type: 'button'
  button: ButtonContent
}

interface ButtonContent {
  payload: string
  text: string
}

export {
  type ButtonContent,
  type ButtonMessage,
  type ButtonReply,
  type InteractiveButton,
  type InteractiveFlow,
  type InteractiveList,
  type InteractiveMessage,
  type ListRowReply,
  type Message,
  type MessageBase,
  type MessageContext,
  type MessageValue,
  type Profile,
  type Reaction,
  type ReactionMessage,
  type ReferredProduct,
  type Text,
  type TextMessage
}
