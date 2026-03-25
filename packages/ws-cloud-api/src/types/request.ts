import { type } from 'arktype'

import {
  templateCategorySchema,
  templateComponentSchema,
  templateLanguageCodeSchema,
  templateParameterSchema
} from './entities/template'

const MIN_ITEMS_ONE = 1
const MIN_ITEMS_TWO = 2
const MIN_STRING_EXCLUSIVE = 0
const COUNTRY_CODE_LENGTH = 2
const MIN_CARD_INDEX = 0

const MAX_CONTACTS = 257
const MAX_TEXT_BODY_LENGTH = 4096
const MAX_MEDIA_CAPTION_LENGTH = 1024

const MAX_INTERACTIVE_LIST_ROWS = 10
const MAX_INTERACTIVE_LIST_SECTIONS = 10
const MAX_INTERACTIVE_REPLY_BUTTONS = 3
const MAX_INTERACTIVE_CAROUSEL_CARD_BUTTONS = 3
const MAX_INTERACTIVE_CAROUSEL_CARDS = 10

const MAX_INTERACTIVE_BODY_LENGTH = 1024
const MAX_INTERACTIVE_LIST_BODY_LENGTH = 4096
const MAX_INTERACTIVE_FOOTER_LENGTH = 60
const MAX_INTERACTIVE_HEADER_LENGTH = 60
const MAX_INTERACTIVE_BUTTON_LABEL_LENGTH = 20
const MAX_INTERACTIVE_ROW_DESCRIPTION_LENGTH = 72
const MAX_INTERACTIVE_ROW_ID_LENGTH = 200
const MAX_INTERACTIVE_ROW_TITLE_LENGTH = 24
const MAX_INTERACTIVE_SECTION_TITLE_LENGTH = 24
const MAX_INTERACTIVE_REPLY_BUTTON_ID_LENGTH = 256
const MAX_INTERACTIVE_CAROUSEL_CARD_BODY_LENGTH = 160

const baseRequestSchema = type({
  'context?': type({ message_id: 'string > 0' }),
  messaging_product: '"whatsapp"',
  recipient_type: '"individual"',
  to: 'string > 0',
  type: 'string'
})

type BaseRequest = typeof baseRequestSchema.infer

const mediaByIdSchema = type({ id: 'string > 0' })

const mediaByLinkSchema = type({ link: 'string.url' })

const mediaByIdOrLinkSchema = mediaByIdSchema.or(mediaByLinkSchema)

const nonEmptyStringSchema = `string > ${MIN_STRING_EXCLUSIVE}`
const textBodySchema = `${MIN_STRING_EXCLUSIVE} < string <= ${MAX_TEXT_BODY_LENGTH}`
const mediaCaptionSchema = `string <= ${MAX_MEDIA_CAPTION_LENGTH}`
const interactiveBodyTextSchema = `0 < string <= ${MAX_INTERACTIVE_BODY_LENGTH}`
const interactiveListBodyTextSchema = `0 < string <= ${MAX_INTERACTIVE_LIST_BODY_LENGTH}`
const interactiveFooterTextSchema = `0 < string <= ${MAX_INTERACTIVE_FOOTER_LENGTH}`
const interactiveHeaderTextSchema = `0 < string <= ${MAX_INTERACTIVE_HEADER_LENGTH}`
const interactiveButtonLabelTextSchema = `0 < string <= ${MAX_INTERACTIVE_BUTTON_LABEL_LENGTH}`
const interactiveRowDescriptionSchema = `string <= ${MAX_INTERACTIVE_ROW_DESCRIPTION_LENGTH}`
const interactiveRowIdSchema = `0 < string <= ${MAX_INTERACTIVE_ROW_ID_LENGTH}`
const interactiveRowTitleSchema = `0 < string <= ${MAX_INTERACTIVE_ROW_TITLE_LENGTH}`
const interactiveSectionTitleSchema = `0 < string <= ${MAX_INTERACTIVE_SECTION_TITLE_LENGTH}`
const interactiveReplyButtonIdSchema = `0 < string <= ${MAX_INTERACTIVE_REPLY_BUTTON_ID_LENGTH}`
const interactiveCarouselCardBodyTextSchema = `string <= ${MAX_INTERACTIVE_CAROUSEL_CARD_BODY_LENGTH}`

const textMessageRequestSchema = baseRequestSchema.and(
  type({ text: type({ body: textBodySchema, 'preview_url?': 'boolean' }), type: '"text"' })
)

type TextMessageRequest = typeof textMessageRequestSchema.infer

const imageMessageRequestSchema = baseRequestSchema.and(
  type({
    image: mediaByIdOrLinkSchema.and(type({ 'caption?': mediaCaptionSchema })),
    type: '"image"'
  })
)

type ImageMessageRequest = typeof imageMessageRequestSchema.infer

const audioMessageRequestSchema = baseRequestSchema.and(
  type({ audio: mediaByIdOrLinkSchema.and(type({ 'voice?': 'boolean' })), type: '"audio"' })
)

type AudioMessageRequest = typeof audioMessageRequestSchema.infer

const documentMessageRequestSchema = baseRequestSchema.and(
  type({
    document: mediaByIdOrLinkSchema.and(
      type({ 'caption?': mediaCaptionSchema, 'filename?': nonEmptyStringSchema })
    ),
    type: '"document"'
  })
)

type DocumentMessageRequest = typeof documentMessageRequestSchema.infer

const videoMessageRequestSchema = baseRequestSchema.and(
  type({
    type: '"video"',
    video: mediaByIdOrLinkSchema.and(type({ 'caption?': mediaCaptionSchema }))
  })
)

type VideoMessageRequest = typeof videoMessageRequestSchema.infer

const mediaMessageRequestSchema = imageMessageRequestSchema
  .or(videoMessageRequestSchema)
  .or(audioMessageRequestSchema)
  .or(documentMessageRequestSchema)

type MediaMessageRequest = typeof mediaMessageRequestSchema.infer

const stickerMessageRequestSchema = baseRequestSchema.and(
  type({
    sticker: mediaByIdSchema.or(type({ link: 'string.url & /\\.webp(\\?.*)?$/' })),
    type: '"sticker"'
  })
)

type StickerMessageRequest = typeof stickerMessageRequestSchema.infer

const locationMessageRequestSchema = baseRequestSchema.and(
  type({
    location: type({
      'address?': 'string > 0',
      latitude: 'number | string.numeric',
      longitude: 'number | string.numeric',
      'name?': nonEmptyStringSchema
    }),
    type: '"location"'
  })
)

type LocationMessageRequest = typeof locationMessageRequestSchema.infer

const locationRequestMessageRequestSchema = baseRequestSchema.and(
  type({
    interactive: type({
      action: type({ name: '"send_location"' }),
      body: type({ text: interactiveBodyTextSchema }),
      type: '"location_request_message"'
    }),
    type: '"interactive"'
  })
)

type LocationRequestMessageRequest = typeof locationRequestMessageRequestSchema.infer

const addressMessageRequestSchema = baseRequestSchema.and(
  type({
    interactive: type({
      action: type({
        name: '"address_message"',
        parameters: type({
          country: `${COUNTRY_CODE_LENGTH} <= string.upper.preformatted <= ${COUNTRY_CODE_LENGTH}`,
          'saved_addresses?': 'object[]',
          'validation_errors?': 'object',
          'values?': 'object'
        })
      }),
      body: type({ text: interactiveBodyTextSchema }),
      type: '"address_message"'
    }),
    type: '"interactive"'
  })
)

type AddressMessageRequest = typeof addressMessageRequestSchema.infer

const reactionMessageRequestSchema = baseRequestSchema.and(
  type({ reaction: type({ emoji: 'string > 0', message_id: 'string > 0' }), type: '"reaction"' })
)

type ReactionMessageRequest = typeof reactionMessageRequestSchema.infer

const contactAddressSchema = type({
  'city?': 'string',
  'country?': 'string',
  'country_code?': 'string',
  'state?': 'string',
  'street?': 'string',
  'type?': 'string',
  'zip?': 'string'
})

const contactEmailSchema = type({ email: 'string.email', 'type?': 'string' })

const contactNameSchema = type({
  'first_name?': 'string',
  formatted_name: 'string > 0',
  'last_name?': 'string',
  'middle_name?': 'string',
  'prefix?': 'string',
  'suffix?': 'string'
})

const contactOrgSchema = type({ 'company?': 'string', 'department?': 'string', 'title?': 'string' })

const contactPhoneSchema = type({ 'phone?': 'string', 'type?': 'string', 'wa_id?': 'string' })

const contactUrlSchema = type({ 'type?': 'string', url: 'string' })

const contactSchema = type({
  'addresses?': contactAddressSchema.array(),
  'birthday?': '/^\\d{4}-\\d{2}-\\d{2}$/',
  'emails?': contactEmailSchema.array(),
  name: contactNameSchema,
  'org?': contactOrgSchema,
  'phones?': contactPhoneSchema.array(),
  'urls?': contactUrlSchema.array()
})

type Contact = typeof contactSchema.infer

const contactsMessageRequestSchema = baseRequestSchema.and(
  type({
    contacts: contactSchema.array().atLeastLength(MIN_ITEMS_ONE).atMostLength(MAX_CONTACTS),
    type: '"contacts"'
  })
)

type ContactsMessageRequest = typeof contactsMessageRequestSchema.infer

const interactiveBodyTextObjectSchema = type({ text: interactiveBodyTextSchema })

const interactiveListBodyTextObjectSchema = type({ text: interactiveListBodyTextSchema })

const interactiveFooterTextObjectSchema = type({ text: interactiveFooterTextSchema })

const interactiveHeaderTextObjectSchema = type({
  text: interactiveHeaderTextSchema,
  type: '"text"'
})

const interactiveHeaderImageSchema = type({ image: mediaByIdOrLinkSchema, type: '"image"' })

const interactiveHeaderVideoSchema = type({ type: '"video"', video: mediaByIdOrLinkSchema })

const interactiveHeaderDocumentSchema = type({
  document: mediaByIdOrLinkSchema.and(type({ 'filename?': 'string' })),
  type: '"document"'
})

const interactiveHeaderSchema = interactiveHeaderTextObjectSchema
  .or(interactiveHeaderImageSchema)
  .or(interactiveHeaderVideoSchema)
  .or(interactiveHeaderDocumentSchema)

const interactiveCTAUrlMessageRequestSchema = baseRequestSchema.and(
  type({
    interactive: type({
      action: type({
        name: '"cta_url"',
        parameters: type({ display_text: interactiveButtonLabelTextSchema, url: 'string.url' })
      }),
      body: interactiveBodyTextObjectSchema,
      'footer?': interactiveFooterTextObjectSchema,
      'header?': interactiveHeaderSchema,
      type: '"cta_url"'
    }),
    type: '"interactive"'
  })
)

type InteractiveCTAUrlMessageRequest = typeof interactiveCTAUrlMessageRequestSchema.infer

const interactiveListRowSchema = type({
  'description?': interactiveRowDescriptionSchema,
  id: interactiveRowIdSchema,
  title: interactiveRowTitleSchema
})

const interactiveListSectionSchema = type({
  rows: interactiveListRowSchema
    .array()
    .atLeastLength(MIN_ITEMS_ONE)
    .atMostLength(MAX_INTERACTIVE_LIST_ROWS),
  title: interactiveSectionTitleSchema
})

const interactiveListMessageRequestSchema = baseRequestSchema.and(
  type({
    interactive: type({
      action: type({
        button: interactiveButtonLabelTextSchema,
        sections: interactiveListSectionSchema
          .array()
          .atLeastLength(MIN_ITEMS_ONE)
          .atMostLength(MAX_INTERACTIVE_LIST_SECTIONS)
      }),
      body: interactiveListBodyTextObjectSchema,
      'footer?': interactiveFooterTextObjectSchema,
      'header?': interactiveHeaderTextObjectSchema,
      type: '"list"'
    }),
    type: '"interactive"'
  })
)

type InteractiveListMessageRequest = typeof interactiveListMessageRequestSchema.infer

const interactiveReplyButtonSchema = type({
  reply: type({ id: interactiveReplyButtonIdSchema, title: interactiveButtonLabelTextSchema }),
  type: '"reply"'
})

const interactiveReplyButtonsMessageRequestSchema = baseRequestSchema.and(
  type({
    interactive: type({
      action: type({
        buttons: interactiveReplyButtonSchema
          .array()
          .atLeastLength(MIN_ITEMS_ONE)
          .atMostLength(MAX_INTERACTIVE_REPLY_BUTTONS)
      }),
      body: interactiveBodyTextObjectSchema,
      'footer?': interactiveFooterTextObjectSchema,
      'header?': interactiveHeaderSchema,
      type: '"button"'
    }),
    type: '"interactive"'
  })
)

type InteractiveReplyButtonsMessageRequest =
  typeof interactiveReplyButtonsMessageRequestSchema.infer

const interactiveCarouselCardHeaderSchema = type({
  image: type({ link: 'string.url' }),
  type: '"image"'
}).or(type({ type: '"video"', video: type({ link: 'string.url' }) }))

const interactiveCarouselCardUrlButtonSchema = type({
  parameters: type({ display_text: interactiveButtonLabelTextSchema, url: 'string.url' }),
  type: '"cta_url"'
})

const interactiveCarouselCardQuickReplyButtonSchema = type({
  quick_reply: type({
    id: interactiveButtonLabelTextSchema,
    title: interactiveButtonLabelTextSchema
  }),
  type: '"quick_reply"'
})

const interactiveCarouselCardButtonSchema = interactiveCarouselCardUrlButtonSchema.or(
  interactiveCarouselCardQuickReplyButtonSchema
)

const interactiveCarouselCardSchema = type({
  'body?': type({ text: interactiveCarouselCardBodyTextSchema }),
  buttons: interactiveCarouselCardButtonSchema
    .array()
    .atLeastLength(MIN_ITEMS_ONE)
    .atMostLength(MAX_INTERACTIVE_CAROUSEL_CARD_BUTTONS),
  card_index: `number.integer >= ${MIN_CARD_INDEX}`,
  header: interactiveCarouselCardHeaderSchema,
  type: '"cta_url"'
})

const interactiveCarouselMessageRequestSchema = baseRequestSchema.and(
  type({
    interactive: type({
      action: type({
        cards: interactiveCarouselCardSchema
          .array()
          .atLeastLength(MIN_ITEMS_TWO)
          .atMostLength(MAX_INTERACTIVE_CAROUSEL_CARDS)
      }),
      body: interactiveBodyTextObjectSchema,
      type: '"carousel"'
    }),
    type: '"interactive"'
  })
)

type InteractiveCarouselMessageRequest = typeof interactiveCarouselMessageRequestSchema.infer

const interactiveFlowMessageRequest = baseRequestSchema.and(
  type({
    body: interactiveBodyTextObjectSchema,
    'footer?': interactiveFooterTextObjectSchema,
    'header?': interactiveCarouselCardHeaderSchema,
    interactive: type({
      action: type({
        name: '"flow"',
        parameters: type({ flow_id: 'string > 0' })
          .or(type({ flow_name: 'string > 0' }))
          .and(
            type({
              'flow_action?': '"navigate" | "data_exchange"',
              'flow_action_payload?': type({ 'data?': 'object', 'screen?': 'string' }),
              flow_cta: interactiveButtonLabelTextSchema,
              flow_message_version: type('3'),
              'flow_token?': 'string > 0',
              'mode?': '"draft" | "published"'
            })
          )
      }),
      type: '"flow_message"'
    }),
    type: '"interactive"'
  })
)

type InteractiveFlowMessageRequest = typeof interactiveFlowMessageRequest.infer

const interactiveMessageRequestSchema = interactiveCTAUrlMessageRequestSchema
  .or(interactiveListMessageRequestSchema)
  .or(interactiveReplyButtonsMessageRequestSchema)
  .or(interactiveCarouselMessageRequestSchema)
  .or(interactiveFlowMessageRequest)

type InteractiveMessageRequest = typeof interactiveMessageRequestSchema.infer

const templateMessageRequestSchema = baseRequestSchema.and(
  type({
    template: type({
      'components?': templateComponentSchema.array(),
      language: type({ code: templateLanguageCodeSchema, 'policy?': '"deterministic"' }),
      name: 'string > 0'
    }),
    type: '"template"'
  })
)

type TemplateMessageRequest = typeof templateMessageRequestSchema.infer

const messageRequestSchema = textMessageRequestSchema
  .or(mediaMessageRequestSchema)
  .or(stickerMessageRequestSchema)
  .or(locationMessageRequestSchema)
  .or(locationRequestMessageRequestSchema)
  .or(addressMessageRequestSchema)
  .or(reactionMessageRequestSchema)
  .or(contactsMessageRequestSchema)
  .or(interactiveMessageRequestSchema)
  .or(templateMessageRequestSchema)

type MessageRequest = typeof messageRequestSchema.infer

const createTemplateRequestSchema = type({
  category: templateCategorySchema,
  components: templateComponentSchema.array(),
  language: templateLanguageCodeSchema,
  name: 'string > 0'
})

type CreateTemplateRequest = typeof createTemplateRequestSchema.infer

const deleteTemplateSchema = type({ name: 'string > 0' }).or(type({ id: 'string > 0' }))

type DeleteTemplate = typeof deleteTemplateSchema.infer

const sendTemplateHeaderSchema = type({
  parameters: type({ image: mediaByIdOrLinkSchema, type: '"image"' })
    .or(type({ type: '"video"', video: mediaByIdOrLinkSchema }))
    .or(type({ document: mediaByIdOrLinkSchema, type: '"document"' }))
    .or(type({ text: interactiveHeaderTextSchema, type: '"text"' }))
    .array(),
  type: '"header"'
})

type SendTemplateHeader = typeof sendTemplateHeaderSchema.infer

const sendTemplateBodySchema = type({ 'parameters?': templateParameterSchema, type: '"body"' })

type SendTemplateBody = typeof sendTemplateBodySchema.infer

const sendTemplateUrlButtonSchema = type({
  parameters: templateParameterSchema,
  sub_type: '"url"',
  type: '"button"'
})

type SendTemplateUrlButton = typeof sendTemplateUrlButtonSchema.infer

const sendTemplateFlowButtonSchema = type({
  index: 'string',
  parameters: type({
    action: type({ 'flow_action_data?': 'object', 'flow_token?': 'string' }),
    type: '"action"'
  }).array(),
  sub_type: '"flow"',
  type: '"button"'
})

type SendTemplateFlowButton = typeof sendTemplateFlowButtonSchema.infer

const sendTemplateButtonParameterSchema = sendTemplateUrlButtonSchema
  .or(sendTemplateFlowButtonSchema)
  .and(type({ index: 'string' }))

type SendTemplateButtonParameter = typeof sendTemplateButtonParameterSchema.infer

const sendTemplateRequestSchema = baseRequestSchema.and(
  type({
    template: type({
      'components?': type(
        sendTemplateHeaderSchema.or(sendTemplateBodySchema).or(sendTemplateButtonParameterSchema)
      ).array(),
      language: type({ code: templateLanguageCodeSchema, 'policy?': '"deterministic"' }),
      name: 'string > 0'
    })
  })
)

type SendTemplateRequest = typeof sendTemplateRequestSchema.infer

const templatesRequestSchema = createTemplateRequestSchema
  .or(deleteTemplateSchema)
  .or(sendTemplateRequestSchema)

type TemplatesRequest = typeof templatesRequestSchema.infer

const markMessageAsReadRequestSchema = type({
  message_id: 'string > 0',
  messaging_product: '"whatsapp"',
  status: '"read"',
  type: 'undefined'
})

type MarkMessageAsReadRequest = typeof markMessageAsReadRequestSchema.infer

const typingIndicatorRequestSchema = type({
  message_id: 'string > 0',
  messaging_product: '"whatsapp"',
  status: '"read"',
  typing_indicator: { type: '"text"' }
})

type TypingIndicatorRequest = typeof typingIndicatorRequestSchema.infer

const statusRequestSchema = markMessageAsReadRequestSchema.or(typingIndicatorRequestSchema)

type StatusRequest = typeof statusRequestSchema.infer

const requestSchema = messageRequestSchema.or(templatesRequestSchema).or(statusRequestSchema)

type Request = typeof requestSchema.infer

export {
  type Contact,
  type BaseRequest,
  baseRequestSchema,
  type TextMessageRequest,
  textMessageRequestSchema,
  type ImageMessageRequest,
  imageMessageRequestSchema,
  type AudioMessageRequest,
  audioMessageRequestSchema,
  type DocumentMessageRequest,
  documentMessageRequestSchema,
  type VideoMessageRequest,
  videoMessageRequestSchema,
  type StickerMessageRequest,
  mediaMessageRequestSchema,
  type MediaMessageRequest,
  stickerMessageRequestSchema,
  type LocationMessageRequest,
  locationMessageRequestSchema,
  type LocationRequestMessageRequest,
  locationRequestMessageRequestSchema,
  type AddressMessageRequest,
  addressMessageRequestSchema,
  type ReactionMessageRequest,
  reactionMessageRequestSchema,
  type ContactsMessageRequest,
  contactsMessageRequestSchema,
  type InteractiveCTAUrlMessageRequest,
  interactiveCTAUrlMessageRequestSchema,
  type InteractiveListMessageRequest,
  interactiveListMessageRequestSchema,
  type InteractiveReplyButtonsMessageRequest,
  interactiveReplyButtonsMessageRequestSchema,
  type InteractiveCarouselMessageRequest,
  interactiveCarouselMessageRequestSchema,
  type InteractiveFlowMessageRequest,
  interactiveFlowMessageRequest,
  type InteractiveMessageRequest,
  interactiveMessageRequestSchema,
  type TemplateMessageRequest,
  templateMessageRequestSchema,
  type CreateTemplateRequest,
  createTemplateRequestSchema,
  type DeleteTemplate,
  deleteTemplateSchema,
  type SendTemplateRequest,
  sendTemplateRequestSchema,
  type SendTemplateHeader,
  sendTemplateHeaderSchema,
  type SendTemplateBody,
  sendTemplateBodySchema,
  type SendTemplateUrlButton,
  sendTemplateUrlButtonSchema,
  type SendTemplateFlowButton,
  sendTemplateFlowButtonSchema,
  type SendTemplateButtonParameter,
  sendTemplateButtonParameterSchema,
  type TemplatesRequest,
  templatesRequestSchema,
  type MarkMessageAsReadRequest,
  markMessageAsReadRequestSchema,
  type TypingIndicatorRequest,
  typingIndicatorRequestSchema,
  type MessageRequest,
  messageRequestSchema,
  type StatusRequest,
  statusRequestSchema,
  type Request,
  requestSchema
}
