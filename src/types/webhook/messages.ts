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

export type Message = TextMessage | InteractiveMessage | ReactionMessage | MediaMessage

export interface MessageBase {
  from: string
  id: string
  timestamp: string
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
  interactive: InteractiveButton | InteractiveList
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
