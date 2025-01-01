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
  name: string
  components: Component[]
  language: string
  status: Status
  category: Category
  sub_category?: string
  id: string
  previous_category?: PreviousCategory
}

export type Category = 'MARKETING' | 'UTILITY'

export interface Component {
  type: ComponentType
  text?: string
  example?: Example
  buttons?: Button[]
  format?: Format
}

export interface Button {
  type: ButtonType
  text: string
  url?: string
}

export type ButtonType = 'QUICK_REPLY' | 'URL'

export interface Example {
  body_text?: string[][]
  header_handle?: string[]
}

export type Format = 'IMAGE' | 'TEXT' | 'VIDEO'

export type ComponentType = 'BODY' | 'BUTTONS' | 'HEADER' | 'FOOTER'

export type PreviousCategory = 'ISSUE_RESOLUTION' | 'APPOINTMENT_UPDATE' | 'MARKETING'

export type Status = 'APPROVED'

export interface Paging {
  cursors: Cursors
  next: string
}

export interface Cursors {
  before: string
  after: string
}
