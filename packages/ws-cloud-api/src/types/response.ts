import { type } from 'arktype'

import { templateSchema } from './entities/template'

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

const messageResponseSchema = sendMessageResponseSchema.or(markMessageAsReadResponseSchema)

type MessageResponse = typeof messageResponseSchema.infer

const getTemplatesSchema = type({
  data: templateSchema.array(),
  paging: type({ cursors: type({ after: 'string > 0', before: 'string > 0' }), next: 'string.url' })
})

type GetTemplatesResponse = typeof getTemplatesSchema.infer

const createTemplateResponseSchema = type({
  category: templateSchema.get('category'),
  id: templateSchema.get('id'),
  status: templateSchema.get('status')
})

type CreateTemplateResponse = typeof createTemplateResponseSchema.infer

export {
  type SendMessageResponse,
  sendMessageResponseSchema,
  type MarkMessageAsReadResponse,
  markMessageAsReadResponseSchema,
  type MediaResponse,
  mediaResponseSchema,
  type MessageResponse,
  messageResponseSchema,
  type GetTemplatesResponse,
  getTemplatesSchema,
  type CreateTemplateResponse,
  createTemplateResponseSchema
}
