import type { InteractiveTypes, MessageTypes } from './enums'

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

type HeaderDocumentMedia = MetaDocumentMedia | HostedDocumentMedia

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

type HeaderImageMedia = MetaImageMedia | HostedImageMedia

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

type HeaderVideoMedia = MetaHostedVideoMedia | SelfHostedVideoMedia

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

interface Button {
  title: string
  id: string
}

interface ReplyButton {
  type: 'reply'
  reply: Button
}

interface Action {
  button: string
  buttons: ReplyButton[]
  sections: Section[]
}

interface FlowAction {
  name: 'flow'
  parameters: FlowActionsParameters
}

interface FlowActionsParameters {
  mode?: 'draft' | 'published'
  flow_message_version: '3'
  flow_action?: 'navigate' | 'data_exchange'
  flow_token: string
  flow_id: string
  flow_cta: string
  flow_action_payload?: FlowActionPayload
}

interface FlowActionPayload {
  screen: string
  data?: Record<string, string>
}

type Interactive = ButtonInteractive | ListInteractive | CTAButtonInteractive | FlowInteractive

interface ButtonInteractive {
  type: InteractiveTypes.Button
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: Pick<Action, 'buttons'>
}

interface CTAButtonInteractive {
  type: InteractiveTypes.CTAButton
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: { name: InteractiveTypes.CTAButton; parameters: { display_text: string; url: string } }
}

interface ListInteractive {
  type: InteractiveTypes.List
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: Pick<Action, 'button' | 'sections'>
}

interface FlowInteractive {
  type: InteractiveTypes.Flow
  body: SimpleText
  footer?: SimpleText
  header?: Header
  action: FlowAction
}

interface TemplateLanguage {
  code: string
  policy: 'deterministic'
}

type TemplateComponent = TemplateComponentBase | TemplateComponentButton

interface TemplateComponentBase {
  type: 'body' | 'header' | 'button'
  parameters?: TemplateParameter[]
}

interface TemplateComponentButton extends TemplateComponentBase {
  type: 'button'
  sub_type: 'quick_reply' | 'url' | 'catalog' | 'flow'
  parameters: TemplateParameter[]
  index: `${number}`
}

interface TemplateFlowParameter {
  type: 'action'
  action: { flow_token?: string; flow_action_data?: object }
}

type TemplateHeaderParameter =
  | TemplateParameterImage
  | TemplateParameterDocument
  | TemplateParameterVideo

type TemplateBodyParameter =
  | TemplateParameterText
  | TemplateParameterCurrency
  | TemplateParameterDateTime
  | TemplateNamedParameter

type TemplateParameter = TemplateBodyParameter | TemplateHeaderParameter | TemplateFlowParameter

interface TemplateNamedParameter {
  type: 'text'
  parameter_name: string
  text: string
}

interface TemplateParameterText {
  type: 'text'
  text: string
}

interface TemplateParameterCurrency {
  type: 'currency'
  currency: { code: string; amount_1000: number; fallback_value: string }
}

interface TemplateParameterDateTime {
  type: 'date_time'
  date_time: { fallback_value: string }
}

interface TemplateParameterImage {
  type: 'image'
  image: HeaderImageMedia
}

interface TemplateParameterDocument {
  type: 'document'
  document: HeaderDocumentMedia
}

interface TemplateParameterVideo {
  type: 'video'
  video: HeaderVideoMedia
}

interface TemplateBody {
  type: MessageTypes.Template
  [MessageTypes.Template]: {
    name: string
    language: TemplateLanguage
    components?: TemplateComponent[]
  }
}

interface TextBody {
  type: MessageTypes.Text
  [MessageTypes.Text]: { body: string; preview_url?: boolean | undefined }
}

interface ContactAddress {
  street?: string
  city?: string
  state?: string
  zip?: string
  country?: string
  country_code?: string
  type?: string
}

interface ContactEmail {
  email: string
  type?: string
}

interface ContactName {
  formatted_name: string
  first_name: string
  last_name: string
  middle_name?: string
  suffix?: string
  prefix?: string
}

interface ContactOrg {
  company?: string
  department?: string
  title?: string
}

interface ContactPhone {
  phone?: `+${string}`
  type?: string
  wa_id?: string
}

interface ContactUrl {
  url: string
  type?: string
}

interface Contact {
  addresses?: ContactAddress[]
  birthday?: string
  emails?: ContactEmail[]
  name: ContactName
  org?: ContactOrg
  phones?: ContactPhone[]
  urls?: ContactUrl[]
}

interface ContactsBody {
  type: MessageTypes.Contacts
  [MessageTypes.Contacts]: Contact[]
}

interface ImageBody {
  type: MessageTypes.Image
  [MessageTypes.Image]: { link: string }
}

interface VideoBody {
  type: MessageTypes.Video
  [MessageTypes.Video]: { link: string }
}

interface AudioBody {
  type: MessageTypes.Audio
  [MessageTypes.Audio]: { link: string }
}

interface DocumentBody {
  type: MessageTypes.Document
  [MessageTypes.Document]: { link: string }
}

type MediaBody = ImageBody | VideoBody | AudioBody | DocumentBody

interface InteractiveBody {
  type: MessageTypes.Interactive
  [MessageTypes.Interactive]: Interactive
}

type WSBody = InteractiveBody | TextBody | MediaBody | TemplateBody | ContactsBody

interface MessageResponse {
  messaging_product: 'whatsapp'
  contacts: MessageContact[]
  messages: MessageInfo[]
}

interface MessageContact {
  input: string
  wa_id: string
}

interface MessageInfo {
  id: string
}

export {
  type Action,
  type AudioBody,
  type Button,
  type ButtonInteractive,
  type Contact,
  type ContactAddress,
  type ContactEmail,
  type ContactName,
  type ContactOrg,
  type ContactPhone,
  type ContactsBody,
  type ContactUrl,
  type CTAButtonInteractive,
  type DocumentBody,
  type FlowAction,
  type FlowActionPayload,
  type FlowActionsParameters,
  type FlowInteractive,
  type Header,
  type HeaderDocumentMedia,
  type HeaderImageMedia,
  type HeaderVideoMedia,
  type HostedDocumentMedia,
  type HostedImageMedia,
  type ImageBody,
  type Interactive,
  type InteractiveBody,
  type ListInteractive,
  type ListSection,
  type MediaBody,
  type MessageContact,
  type MessageInfo,
  type MessageResponse,
  type MetaDocumentMedia,
  type MetaHostedVideoMedia,
  type MetaImageMedia,
  type ReplyButton,
  type Row,
  type Section,
  type SelfHostedVideoMedia,
  type TemplateBody,
  type TemplateComponent,
  type TemplateComponentBase,
  type TemplateComponentButton,
  type TemplateFlowParameter,
  type TemplateHeaderParameter,
  type TemplateBodyParameter,
  type TemplateLanguage,
  type TemplateNamedParameter,
  type TemplateParameter,
  type TemplateParameterCurrency,
  type TemplateParameterDateTime,
  type TemplateParameterDocument,
  type TemplateParameterImage,
  type TemplateParameterText,
  type TemplateParameterVideo,
  type TextBody,
  type VideoBody,
  type WSBody
}
