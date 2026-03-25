import { type } from 'arktype'

const idOrLinkSchema = type({ id: 'string > 0' }).or(type({ link: 'string.url' }))

const templateParameterTypeSchema = type('"text" | "currency" | "date_time"')

type TemplateParameterType = typeof templateParameterTypeSchema.infer

const templateNamedParameterSchema = type({
  parameter_name: 'string > 0',
  text: `string > 0`,
  type: templateParameterTypeSchema
})

type TemplateNamedParameter = typeof templateNamedParameterSchema.infer

const templatePositionalParameterSchema = type({
  text: 'string > 0',
  type: templateParameterTypeSchema
})

type TemplatePositionalParameter = typeof templatePositionalParameterSchema.infer

const templateParameterSchema = templateNamedParameterSchema
  .array()
  .or(templatePositionalParameterSchema.array())

type TemplateParameter = typeof templateParameterSchema.infer

const templateTextHeaderSchema = type({ parameters: templateParameterSchema, type: '"text"' })

type TemplateTextHeader = typeof templateTextHeaderSchema.infer

const templateMediaHeaderSchema = type({ type: '"video"', video: idOrLinkSchema })
  .or(type({ document: idOrLinkSchema.and(type({ 'filename?': 'string' })), type: '"document"' }))
  .or(type({ image: idOrLinkSchema, type: '"image"' }))

type TemplateMediaHeader = typeof templateMediaHeaderSchema.infer

const templateLocationHeaderSchema = type({
  location: type({
    address: 'string > 0',
    latitude: 'number | string.numeric',
    longitude: 'number | string.numeric',
    name: 'string > 0'
  }),
  type: '"location"'
})

type TemplateLocationHeader = typeof templateLocationHeaderSchema.infer

const templateBodySchema = type({
  'example?': type({ body_text: 'string[]' }),
  'parameters?': templateParameterSchema,
  text: 'string > 0',
  type: '"body"'
})

type TemplateBody = typeof templateBodySchema.infer

const templateHeaderSchema = templateTextHeaderSchema
  .or(templateMediaHeaderSchema)
  .or(templateLocationHeaderSchema)

type TemplateHeader = typeof templateHeaderSchema.infer

const templateFlowButtonSchema = type({
  parameters: type([type({ action: type('"flow"'), type: type('"action"') })]),
  sub_type: type('"flow"'),
  type: type('"button"')
})

type TemplateFlowButton = typeof templateFlowButtonSchema.infer

const templateCodeButtonSchema = type({ example: '0 < string <= 15', type: type('"copy_code"') })

type TemplateCodeButton = typeof templateCodeButtonSchema.infer

const templateOtpButtonSchema = type({
  otp_type: type('"COPY_CODE" | "ONE_TAP"'),
  type: type('"otp"')
})

type TemplateOtpButton = typeof templateOtpButtonSchema.infer

const templateUrlButtonSchema = type({
  'example?': 'string[]',
  text: 'string > 0',
  type: type('"url"'),
  url: 'string.url < 2000'
})

type TemplateUrlButton = typeof templateUrlButtonSchema.infer

const templateQuickReplyButtonSchema = type({ text: 'string > 0', type: type('"quick_reply"') })

type TemplateQuickReplyButton = typeof templateQuickReplyButtonSchema.infer

const templateVoiceCallButtonSchema = type({ text: 'string > 0', type: type('"voice_call"') })

type TemplateVoiceCallButton = typeof templateVoiceCallButtonSchema.infer

const templatePhoneNumberButtonSchema = type({
  phone_number: 'string > 0',
  text: '0 < string <= 25',
  type: type('"PHONE_NUMBER"')
})

type TemplatePhoneNumberButton = typeof templatePhoneNumberButtonSchema.infer

const templateButtonsSchema = type({
  buttons: templateUrlButtonSchema
    .or(templateQuickReplyButtonSchema)
    .or(templateVoiceCallButtonSchema)
    .or(templateOtpButtonSchema)
    .or(templatePhoneNumberButtonSchema)
    .or(templateFlowButtonSchema)
    .or(templateCodeButtonSchema)
    .array()
    .atLeastLength(1)
    .atMostLength(10),
  type: type('"buttons"')
})

type TemplateButtons = typeof templateButtonsSchema.infer

const templateComponentSchema = templateHeaderSchema
  .or(templateBodySchema)
  .or(templateButtonsSchema)

type TemplateComponent = typeof templateComponentSchema.infer

const languageCodes = [
  'af',
  'sq',
  'ar',
  'az',
  'bn',
  'bg',
  'ca',
  'zh_CN',
  'zh_HK',
  'zh_TW',
  'hr',
  'cs',
  'da',
  'nl',
  'en',
  'en_GB',
  'en_US',
  'et',
  'fil',
  'fi',
  'fr',
  'ka',
  'de',
  'el',
  'gu',
  'ha',
  'he',
  'hi',
  'hu',
  'id',
  'ga',
  'it',
  'ja',
  'kn',
  'kk',
  'rw_RW',
  'ko',
  'ky_KG',
  'lo',
  'lv',
  'lt',
  'mk',
  'ms',
  'ml',
  'mr',
  'nb',
  'fa',
  'pl',
  'pt_BR',
  'pt_PT',
  'pa',
  'ro',
  'ru',
  'sr',
  'sk',
  'sl',
  'es',
  'es_AR',
  'es_ES',
  'es_MX',
  'sw',
  'sv',
  'ta',
  'te',
  'th',
  'tr',
  'uk',
  'ur',
  'uz',
  'vi',
  'zu'
] as const

const templateLanguageCodeSchema = type.enumerated(...languageCodes)

type TemplateLanguageCode = typeof templateLanguageCodeSchema.infer

const templateCategorySchema = type('"utility" | "marketing" | "authentication"')

type TemplateCategory = typeof templateCategorySchema.infer

const templateParameterFormatSchema = type('"NAMED" | "POSITIONAL"')

type TemplateParameterFormat = typeof templateParameterFormatSchema.infer

const templateFieldsSchema = type(
  '"id" | "category" | "components" | "correct_category" | "cta_url_link_tracking_opted_out" | "language" | "library_template_name" | "message_send_ttl_seconds" | "name" | "previous_category" | "quality_score" | "rejected_reason" | "status" | "sub_category"'
)

type TemplateFields = typeof templateFieldsSchema.infer

const templatePreviousCategorySchema = type(
  '"ISSUE_RESOLUTION" | "APPOINTMENT_UPDATE" | "MARKETING"'
)

type TemplatePreviousCategory = typeof templatePreviousCategorySchema.infer

const templateStatusSchema = type('"APPROVED" | "PENDING" | "REJECTED"')

type TemplateStatus = typeof templateStatusSchema.infer

const templateSchema = type({
  'allow_category_change?': 'boolean',
  category: templateCategorySchema,
  components: templateComponentSchema.array(),
  id: 'string',
  language: 'string',
  'message_send_ttl_seconds?': 'string',
  name: 'string',
  status: templateStatusSchema,
  'sub_category?': 'string' //
  // TODO: Add library templates types
})

type Template = typeof templateSchema.infer

export {
  type TemplateParameterType,
  templateParameterTypeSchema,
  type TemplateNamedParameter,
  templateNamedParameterSchema,
  type TemplatePositionalParameter,
  templatePositionalParameterSchema,
  type TemplateParameter,
  templateParameterSchema,
  type TemplateTextHeader,
  templateTextHeaderSchema,
  type TemplateMediaHeader,
  templateMediaHeaderSchema,
  type TemplateLocationHeader,
  templateLocationHeaderSchema,
  type TemplateHeader,
  templateHeaderSchema,
  type TemplateOtpButton,
  templateOtpButtonSchema,
  type TemplateFlowButton,
  templateFlowButtonSchema,
  type TemplateCodeButton,
  templateCodeButtonSchema,
  type TemplatePhoneNumberButton,
  templatePhoneNumberButtonSchema,
  type TemplateUrlButton,
  templateUrlButtonSchema,
  type TemplateQuickReplyButton,
  templateQuickReplyButtonSchema,
  type TemplateVoiceCallButton,
  templateVoiceCallButtonSchema,
  type TemplateButtons,
  templateButtonsSchema,
  type TemplateComponent,
  templateComponentSchema,
  type TemplateBody,
  templateBodySchema,
  type TemplateLanguageCode,
  templateLanguageCodeSchema,
  type TemplateCategory,
  templateCategorySchema,
  type TemplateParameterFormat,
  templateParameterFormatSchema,
  type TemplateFields,
  templateFieldsSchema,
  type TemplatePreviousCategory,
  templatePreviousCategorySchema,
  type TemplateStatus,
  templateStatusSchema,
  type Template,
  templateSchema
}
