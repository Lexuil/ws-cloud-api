type templateFields =
  | 'id'
  | 'category'
  | 'components'
  | 'correct_category'
  | 'cta_url_link_tracking_opted_out'
  | 'language'
  | 'library_template_name'
  | 'message_send_ttl_seconds'
  | 'name'
  | 'previous_category'
  | 'quality_score'
  | 'rejected_reason'
  | 'status'
  | 'sub_category'

interface Templates {
  data: Template[]
  paging: Paging
}

interface Template {
  id: string
  name: string
  status: TemplateStatus
  category: Category
  language: string
  message_send_ttl_seconds?: string
  components: Component[]
  sub_category?: string
  previous_category?: PreviousCategory
  allow_category_change?: boolean //
  // TODO: Add library templates types
}

type CreateTemplate = Omit<
  Template,
  'id' | 'status' | 'sub_category' | 'previous_category' | 'allow_category_change'
>

type CreateTemplateResponse = Pick<Template, 'id' | 'status' | 'category'>

type Category = 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'

type PreviousCategory = 'ISSUE_RESOLUTION' | 'APPOINTMENT_UPDATE' | 'MARKETING'

type TemplateStatus = 'APPROVED' | 'PENDING' | 'REJECTED'

interface Paging {
  cursors: Cursors
  next: string
}

interface Cursors {
  before: string
  after: string
}

// -----------------------------------------------------------------------------
// Components

type Component = TextHeader | MediaHeader | LocationHeader | Body | Footer | Buttons

type ExamplePositionalParams = string[]

type ExampleNamedParams = { param_name: string; example: string }[]

// -----------------------------------------------------------------------------
// TextHeader

interface TextHeader {
  type: 'HEADER'
  format: 'TEXT'
  text: string
  example?:
    | { header_text: ExamplePositionalParams }
    | { header_text_named_params: ExampleNamedParams }
}

// -----------------------------------------------------------------------------
// MediaHeader

interface MediaHeader {
  type: 'HEADER'
  format: 'IMAGE' | 'VIDEO' | 'DOCUMENT'
  example: { header_handle: string }
}

// -----------------------------------------------------------------------------
// Location Header

interface LocationHeader {
  type: 'HEADER'
  format: 'LOCATION'
}

// -----------------------------------------------------------------------------
// Body

interface Body {
  type: 'BODY'
  text: string
  example?: { body_text: ExamplePositionalParams | ExampleNamedParams }
}

// -----------------------------------------------------------------------------
// Footer

interface Footer {
  type: 'FOOTER'
  text: string
}

// -----------------------------------------------------------------------------
// Buttons

interface CopyCodeButton {
  type: 'COPY_CODE'
  example: string
}

interface FlowButton {
  type: 'FLOW'
  text: string
  flow_id: string
  flow_name: string
  flow_json: Record<string, unknown> // TODO: Define the flow json
  flow_action?: 'navigate' | 'data_exchange'
  navigate_screen?: string
}

interface PhoneNumberButton {
  type: 'PHONE_NUMBER'
  text: string
  phone_number: string
}

interface QuickReplyButton {
  type: 'QUICK_REPLY'
  text: string
}

interface UrlButton {
  type: 'URL'
  text: string
  url: string
  example?: string[]
}

type TemplateButton = CopyCodeButton | FlowButton | PhoneNumberButton | QuickReplyButton | UrlButton

interface Buttons {
  type: 'BUTTONS'
  buttons: TemplateButton[]
}

export {
  type Body,
  type Buttons,
  type Category,
  type Component,
  type CopyCodeButton,
  type CreateTemplate,
  type CreateTemplateResponse,
  type Cursors,
  type ExampleNamedParams,
  type ExamplePositionalParams,
  type FlowButton,
  type Footer,
  type LocationHeader,
  type MediaHeader,
  type Paging,
  type PhoneNumberButton,
  type PreviousCategory,
  type QuickReplyButton,
  type templateFields,
  type Template,
  type TemplateButton,
  type Templates,
  type TemplateStatus,
  type TextHeader,
  type UrlButton
}
