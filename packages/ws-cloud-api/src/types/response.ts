import { type } from 'arktype'

const MIN_ITEMS_ONE = 1

const messageContactSchema = type({ input: 'string > 0', wa_id: 'string > 0' })

const messageInfoSchema = type({
  'group_id?': 'string > 0',
  id: 'string > 0',
  'message_status?': 'string > 0'
})

const sendMessageResponseSchema = type({
  contacts: messageContactSchema.array().atLeastLength(MIN_ITEMS_ONE),
  messages: messageInfoSchema.array().atLeastLength(MIN_ITEMS_ONE),
  messaging_product: '"whatsapp"'
})

type SendMessageResponse = typeof sendMessageResponseSchema.infer

const markMessageAsReadResponseSchema = type({ success: 'true' })

type MarkMessageAsReadResponse = typeof markMessageAsReadResponseSchema.infer

const mediaResponseSchema = type({ id: 'string > 0' })

type MediaResponse = typeof mediaResponseSchema.infer

const responseSchema = sendMessageResponseSchema.or(markMessageAsReadResponseSchema)

type MessageResponse = typeof responseSchema.infer

export {
  type SendMessageResponse,
  sendMessageResponseSchema,
  type MarkMessageAsReadResponse,
  markMessageAsReadResponseSchema,
  type MediaResponse,
  mediaResponseSchema,
  type MessageResponse,
  responseSchema
}
