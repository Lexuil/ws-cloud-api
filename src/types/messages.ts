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

export type Interactive = ButtonInteractive | ListInteractive

export interface ButtonInteractive {
  type: InteractiveTypes.Button
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: Pick<Action, 'buttons'>
}

export interface ListInteractive {
  type: InteractiveTypes.List
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: Pick<Action, 'button' | 'sections'>
}

export interface InteractiveBody {
  type: MessageTypes.Interactive
  interactive: Interactive
}
