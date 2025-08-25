export type templateFields = 'id' |
  'category' |
  'components' |
  'correct_category' |
  'cta_url_link_tracking_opted_out' |
  'language' |
  'library_template_name' |
  'message_send_ttl_seconds' |
  'name' |
  'previous_category' |
  'quality_score' |
  'rejected_reason' |
  'status' |
  'sub_category'

export interface Templates {
  data: Template[]
  paging: Paging
}

export interface Template {
  id: string
  name: string
  status: TemplateStatus
  category: Category
  language: string
  message_send_ttl_seconds: string
  components: Component[]
  sub_category?: string
  previous_category?: PreviousCategory
  allow_category_change?: boolean //
  // TODO: Add library templates types
}

export type CreateTemplate = Omit<
  Template,
  'id' | 'status' | 'sub_category' | 'previous_category' | 'allow_category_change'
>

export type CreateTemplateResponse = Pick<Template, 'id' | 'status' | 'category'>

export type Category = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'

export type PreviousCategory = 'ISSUE_RESOLUTION' | 'APPOINTMENT_UPDATE' | 'MARKETING'

export type TemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED'

export interface Paging {
  cursors: Cursors
  next: string
}

export interface Cursors {
  before: string
  after: string
}

// -----------------------------------------------------------------------------
// Components

export type Component =
  TextHeader |
  MediaHeader |
  LocationHeader |
  Body |
  Footer |
  Buttons

export type ExamplePositionalParams = string[]

export type ExampleNamedParams = Array<{
  param_name: string
  example: string
}>

// -----------------------------------------------------------------------------
// TextHeader

export interface TextHeader {
  type: 'HEADER'
  format: 'TEXT'
  text: string
  example?: {
    header_text: ExamplePositionalParams
  } | {
    header_text_named_params: ExampleNamedParams
  }
}

// -----------------------------------------------------------------------------
// MediaHeader

export interface MediaHeader {
  type: 'HEADER'
  format: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  example: {
    header_handle: string
  }
}

// -----------------------------------------------------------------------------
// Location Header

export interface LocationHeader {
  type: 'HEADER'
  format: 'LOCATION'
}

// -----------------------------------------------------------------------------
// Body

export interface Body {
  type: 'BODY'
  text: string
  example?: {
    body_text: ExamplePositionalParams | ExampleNamedParams
  }
}

// -----------------------------------------------------------------------------
// Footer

export interface Footer {
  type: 'FOOTER'
  text: string
}

// -----------------------------------------------------------------------------
// Buttons

export interface CopyCodeButton {
  type: 'COPY_CODE'
  example: string
}

export interface FlowButton {
  type: 'FLOW'
  text: string
  flow_id: string
  flow_name: string
  flow_json: Record<string, unknown> // TODO: Define the flow json
  flow_action?: 'navigate' | 'data_exchange'
  navigate_screen?: string
}

export interface PhoneNumberButton {
  type: 'PHONE_NUMBER'
  text: string
  phone_number: string
}

export interface QuickReplyButton {
  type: 'QUICK_REPLY'
  text: string
}

export interface UrlButton {
  type: 'URL'
  text: string
  url: string
  example?: string[]
}

export type TemplateButton =
  CopyCodeButton |
  FlowButton |
  PhoneNumberButton |
  QuickReplyButton |
  UrlButton

export interface Buttons {
  type: 'BUTTONS'
  buttons: TemplateButton[]
}
