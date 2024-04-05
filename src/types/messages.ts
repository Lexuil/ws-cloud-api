import type { MessageTypes, InteractiveTypes } from './enums'

interface SimpleText {
  text: string
}

interface MetaDocumentMedia {
  id: string
  link?: never
  caption?: string
  filename?: string
}

interface HostedDocumentMedia {
  id?: never
  link: string
  caption?: string
  filename?: string
}

export type DocumentMedia =
| MetaDocumentMedia
| HostedDocumentMedia

interface MetaImageMedia {
  id: string
  link?: never
  caption?: string
}

interface HostedImageMedia {
  id?: never
  link: string
  caption?: string
}

export type ImageMedia = MetaImageMedia | HostedImageMedia

interface MetaHostedVideoMedia {
  id: string
  link?: never
  caption?: string
}

interface SelfHostedVideoMedia {
  id?: never
  link: string
  caption?: string
}

export type VideoMedia =
| MetaHostedVideoMedia
| SelfHostedVideoMedia

interface Header {
  type: 'document' | 'image' | 'text' | 'video'
  document?: DocumentMedia
  image?: ImageMedia
  text?: string
  video?: VideoMedia
}

interface Row {
  id: string
  title: string
  description?: string
}

interface ListSection {
  product_items?: never
  rows: Row[]
  title?: string
}

type Section = ListSection

export interface Button {
  title: string
  id: string
}

export interface ReplyButton {
  type: 'reply'
  reply: Button
}

interface Action {
  button: string
  buttons: ReplyButton[]
  sections: Section[]
}

export type Interactive =
ButtonInteractive |
ListInteractive |
CTAButtonInteractive

export interface ButtonInteractive {
  type: InteractiveTypes.Button
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: Pick<Action, 'buttons'>
}

export interface CTAButtonInteractive {
  type: InteractiveTypes.CTAButton
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: {
    name: InteractiveTypes.CTAButton
    parameters: {
      display_text: string
      url: string
    }
  }
}

export interface ListInteractive {
  type: InteractiveTypes.List
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: Pick<Action, 'button' | 'sections'>
}

export interface TextBody {
  type: MessageTypes.Text
  [MessageTypes.Text]: {
    body: string
  }
}

export interface ImageBody {
  type: MessageTypes.Image
  [MessageTypes.Image]: {
    link: string
  }
}

export interface VideoBody {
  type: MessageTypes.Video
  [MessageTypes.Video]: {
    link: string
  }
}

export interface AudioBody {
  type: MessageTypes.Audio
  [MessageTypes.Audio]: {
    link: string
  }
}

export interface DocumentBody {
  type: MessageTypes.Document
  [MessageTypes.Document]: {
    link: string
  }
}

export type MediaBody = ImageBody | VideoBody | AudioBody | DocumentBody

export interface InteractiveBody {
  type: MessageTypes.Interactive
  [MessageTypes.Interactive]: Interactive
}

export type WSBody = InteractiveBody | TextBody | MediaBody
