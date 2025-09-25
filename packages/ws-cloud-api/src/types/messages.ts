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

export type HeaderDocumentMedia =
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

export type HeaderImageMedia = MetaImageMedia | HostedImageMedia

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

export type HeaderVideoMedia =
  | MetaHostedVideoMedia
  | SelfHostedVideoMedia

interface Header {
  type: 'document' | 'image' | 'text' | 'video'
  document?: HeaderDocumentMedia
  image?: HeaderImageMedia
  text?: string
  video?: HeaderVideoMedia
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

export interface Action {
  button: string
  buttons: ReplyButton[]
  sections: Section[]
}

export interface FlowAction {
  name: 'flow'
  parameters: FlowActionsParameters
}

export interface FlowActionsParameters {
  mode?: 'draft' | 'published'
  flow_message_version: '3'
  flow_action?: 'navigate' | 'data_exchange'
  flow_token: string
  flow_id: string
  flow_cta: string
  flow_action_payload?: FlowActionPayload
}

export interface FlowActionPayload {
  screen: string
  data?: Record<string, string>
}

export type Interactive =
  ButtonInteractive |
  ListInteractive |
  CTAButtonInteractive |
  FlowInteractive

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

export interface FlowInteractive {
  type: InteractiveTypes.Flow
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: FlowAction
}

export interface TemplateLanguage {
  code: string
  policy: 'deterministic'
}

export type TemplateComponent = TemplateComponentBase | TemplateComponentButton

export interface TemplateComponentBase {
  type: 'body' | 'header' | 'button'
  parameters?: TemplateParameter[]
}

export interface TemplateComponentButton extends TemplateComponentBase {
  type: 'button'
  sub_type: 'quick_reply' | 'url' | 'catalog' | 'flow'
  parameters: TemplateParameter[]
  index: `${number}`
}

export interface TemplateFlowParameter {
  type: 'action'
  action: {
    flow_token?: string
    flow_action_data?: object
  }
}

export type TemplateHeaderParameter = TemplateParameterImage |
  TemplateParameterDocument |
  TemplateParameterVideo

export type TemplateBodyParameter = TemplateParameterText |
  TemplateParameterCurrency |
  TemplateParameterDateTime |
  TemplateNamedParameter

export type TemplateParameter = TemplateBodyParameter |
  TemplateHeaderParameter |
  TemplateFlowParameter

export interface TemplateNamedParameter {
  type: 'text'
  parameter_name: string
  text: string
}

export interface TemplateParameterText {
  type: 'text'
  text: string
}

export interface TemplateParameterCurrency {
  type: 'currency'
  currency: {
    code: string
    amount_1000: number
    fallback_value: string
  }
}

export interface TemplateParameterDateTime {
  type: 'date_time'
  date_time: {
    fallback_value: string
  }
}

export interface TemplateParameterImage {
  type: 'image'
  image: HeaderImageMedia
}

export interface TemplateParameterDocument {
  type: 'document'
  document: HeaderDocumentMedia
}

export interface TemplateParameterVideo {
  type: 'video'
  video: HeaderVideoMedia
}

export interface TemplateBody {
  type: MessageTypes.Template
  [MessageTypes.Template]: {
    name: string
    language: TemplateLanguage
    components?: TemplateComponent[]
  }
}

export interface TextBody {
  type: MessageTypes.Text
  [MessageTypes.Text]: {
    body: string
    preview_url?: boolean | undefined
  }
}

export interface ContactAddress {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  country_code?: string
  type?: string
}

export interface ContactEmail {
  email: string
  type?: string
}

export interface ContactName {
  formatted_name: string
  first_name: string
  last_name: string
  middle_name?: string
  suffix?: string
  prefix?: string
}

export interface ContactOrg {
  company?: string
  department?: string
  title?: string
}

export interface ContactPhone {
  phone?: `+${string}`
  type?: string
  wa_id?: string
}

export interface ContactUrl {
  url: string
  type?: string
}

export interface Contact {
  addresses?: ContactAddress[]
  birthday?: string
  emails?: ContactEmail[]
  name: ContactName
  org?: ContactOrg
  phones?: ContactPhone[]
  urls?: ContactUrl[]
}

export interface ContactsBody {
  type: MessageTypes.Contacts
  [MessageTypes.Contacts]: Contact[]
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

export type WSBody = InteractiveBody | TextBody | MediaBody | TemplateBody | ContactsBody

export interface MessageResponse {
  messaging_product: 'whatsapp'
  contacts: MessageContact[]
  messages: MessageInfo[]
}

export interface MessageContact {
  input: string
  wa_id: string
}

export interface MessageInfo {
  id: string
}
