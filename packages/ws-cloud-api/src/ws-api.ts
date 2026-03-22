import type { Result } from 'neverthrow'

import { type } from 'arktype'
import { err, ok } from 'neverthrow'

import type { ErrorBuilder } from '@/core/error-handler'
import type {
  Request,
  Contact,
  InteractiveMessageRequest,
  TemplateBody,
  TemplateFlowButton,
  TemplateAuthButton,
  TemplateMediaHeader
} from '@/types/request'
import type { MediaResponse, MessageResponse } from '@/types/response'

import { errorHandlerResult } from '@/core/error-handler'

import type { ResolvedConfig } from './core/config'
import type { HttpResponse, RequestMethod } from './core/http'
import type { WsConfig } from './types/config'
import type { MessageStatus } from './types/enums'
import type { Button } from './types/messages'
import type {
  CreateTemplate,
  CreateTemplateResponse,
  Templates,
  templateFields
} from './types/templates'
import type { WebhookSubscribeQuery, WsRequest } from './types/webhook'
import type { Message } from './types/webhook/messages'

import { resolveConfig } from './core/config'
import { createHttpClient } from './core/http'
import Logger from './core/logger'
import { mediaTypeSchema, mimeTypeSchema } from './types/media'

const baseMessageRequest = { messaging_product: 'whatsapp', recipient_type: 'individual' } as const
const baseIterativeMessageRequest = { ...baseMessageRequest, type: 'interactive' } as const

type Source = 'user' | 'button' | 'list' | 'flow'

class WsApi {
  private readonly config: ResolvedConfig
  private readonly logger: Logger
  private readonly http: ReturnType<typeof createHttpClient>

  constructor(config?: WsConfig) {
    this.config = resolveConfig(config)
    this.logger = new Logger(config?.logger)
    this.http = createHttpClient(this.config, this.logger)
  }

  async sendRequest<T = unknown>({
    id,
    body,
    path,
    query,
    method,
    headers
  }: {
    id: 'phoneNumberId' | 'businessId' | (string & NonNullable<unknown>)
    body?: Request
    path?: 'messages' | 'message_templates' | (string & NonNullable<unknown>)
    query?: string
    method: RequestMethod | (string & NonNullable<unknown>)
    headers?: Record<string, string>
  }): Promise<Result<HttpResponse<T>, ErrorBuilder<{ code: 'HTTP_REQUEST_ERROR' }>>> {
    let preparedBody = undefined
    if (body !== undefined) {
      preparedBody =
        body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body)
    }

    const result = await this.http.request<T>({
      body: preparedBody,
      headers,
      id,
      method,
      path,
      query
    })

    if (result.isErr()) {
      return errorHandlerResult(result.error, this.logger, {
        HTTP_REQUEST_ERROR: {
          code: 'HTTP_REQUEST_ERROR',
          extraParams: { body, error: result.error }
        }
      })
    }

    return ok(result.value)
  }

  // Messaging ----------------------------------------------------------------
  async sendMessageRequest({
    body
  }: {
    body: Request
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_REQUEST_ERROR' }>>> {
    const requestResponse = await this.sendRequest<MessageResponse>({
      body: body,
      id: 'phoneNumberId',
      method: 'POST',
      path: 'messages'
    })

    if (requestResponse.isErr()) {
      return errorHandlerResult(requestResponse.error, this.logger, {
        HTTP_REQUEST_ERROR: {
          code: 'SEND_REQUEST_ERROR',
          extraParams: { body, error: requestResponse.error }
        }
      })
    }

    return ok(requestResponse.value.response)
  }

  async sendText({
    to,
    message,
    previewUrl
  }: {
    to: string
    message: string
    previewUrl?: boolean
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_TEXT_MESSAGE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: {
        ...baseMessageRequest,
        text: { body: message, preview_url: previewUrl },
        to,
        type: 'text'
      }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_TEXT_MESSAGE_ERROR',
          extraParams: { body: { message, previewUrl } }
        }
      })
    }
    return ok(response.value)
  }

  async sendContact({
    to,
    contacts
  }: {
    to: string
    contacts: Contact[]
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_CONTACT_MESSAGE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: { ...baseMessageRequest, contacts, to, type: 'contacts' }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_CONTACT_MESSAGE_ERROR',
          extraParams: { body: { contacts }, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendImage({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'image' }>['image']
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_IMAGE_MESSAGE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: { ...baseMessageRequest, image: data, to, type: 'image' }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_IMAGE_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendVideo({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'video' }>['video']
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_VIDEO_MESSAGE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: { ...baseMessageRequest, to, type: 'video', video: data }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_VIDEO_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendDocument({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'document' }>['document']
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_DOCUMENT_MESSAGE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: { ...baseMessageRequest, document: data, to, type: 'document' }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_DOCUMENT_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendAudio({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'audio' }>['audio']
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_AUDIO_MESSAGE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: { ...baseMessageRequest, audio: data, to, type: 'audio' }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_AUDIO_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  // oxlint-disable-next-line max-statements
  async sendFile({
    to,
    data
  }: {
    to: string
    data: { file: Blob; caption?: string; filename?: string }
  }): Promise<
    Result<
      MessageResponse,
      ErrorBuilder<{
        code:
          | 'UNSUPPORTED_MEDIA_TYPE'
          | 'UPLOAD_MEDIA_ERROR'
          | 'SEND_FILE_MESSAGE_ERROR'
          | 'SEND_IMAGE_MESSAGE_ERROR'
          | 'SEND_VIDEO_MESSAGE_ERROR'
          | 'SEND_AUDIO_MESSAGE_ERROR'
          | 'SEND_DOCUMENT_MESSAGE_ERROR'
      }>
    >
  > {
    try {
      const mediaId = await this.uploadMedia({ media: data.file })

      if (mediaId.isErr()) {
        return errorHandlerResult(mediaId.error, this.logger, {
          UNSUPPORTED_MEDIA_TYPE: { code: 'UNSUPPORTED_MEDIA_TYPE', extraParams: { data } },
          UPLOAD_MEDIA_ERROR: {
            code: 'UPLOAD_MEDIA_ERROR',
            extraParams: { data: { error: mediaId.error } }
          }
        })
      }

      const [mimeType] = data.file.type.split('/')
      const mediaType = mediaTypeSchema(
        mimeType === 'text' || mimeType === 'application' ? 'document' : mimeType
      )

      if (mediaType instanceof type.errors) {
        throw new Error('Unsupported media type')
      }

      switch (mediaType) {
        case 'image': {
          return await this.sendImage({
            data: { caption: data.caption, id: mediaId.value.mediaId },
            to
          })
        }
        case 'video': {
          return await this.sendVideo({
            data: { caption: data.caption, id: mediaId.value.mediaId },
            to
          })
        }
        case 'audio': {
          return await this.sendAudio({ data: { id: mediaId.value.mediaId }, to })
        }
        case 'document': {
          return await this.sendDocument({
            data: { filename: data.filename, id: mediaId.value.mediaId },
            to
          })
        }
        default: {
          return err({ code: 'UNEXPECTED_ERROR', data })
        }
      }
    } catch (error) {
      return err({ code: 'UNEXPECTED_ERROR', data: { error, ...data } })
    }
  }

  async sendButtonMessage({
    to,
    data
  }: {
    to: string
    data:
      | Extract<InteractiveMessageRequest['interactive'], { type: 'button' }>
      | { text: string; buttons: Button[]; footer?: string }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_BUTTON_MESSAGE_ERROR' }>>> {
    let body: Extract<Request, { type: 'interactive' }> | undefined = undefined
    body =
      'text' in data
        ? {
            ...baseIterativeMessageRequest,
            interactive: {
              action: { buttons: data.buttons.map((button) => ({ reply: button, type: 'reply' })) },
              body: { text: data.text },
              footer: data.footer ? { text: data.footer } : undefined,
              type: 'button'
            },
            to
          }
        : { ...baseIterativeMessageRequest, interactive: data, to }

    const response = await this.sendMessageRequest({ body })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_BUTTON_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendCTAButtonMessage({
    to,
    data
  }: {
    to: string
    data:
      | Extract<InteractiveMessageRequest['interactive'], { type: 'cta_url' }>
      | { text: string; buttonText: string; url: string; footer?: string }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_BUTTON_MESSAGE_ERROR' }>>> {
    let body: Extract<Request, { type: 'interactive' }> | undefined = undefined
    body =
      'text' in data
        ? {
            ...baseIterativeMessageRequest,
            interactive: {
              action: {
                name: 'cta_url',
                parameters: { display_text: data.buttonText, url: data.url }
              },
              body: { text: data.text },
              footer: data.footer ? { text: data.footer } : undefined,
              type: 'cta_url'
            },
            to
          }
        : { ...baseIterativeMessageRequest, interactive: data, to }

    const response = await this.sendMessageRequest({ body })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_BUTTON_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendInteractiveListMessage({
    to,
    data
  }: {
    to: string
    data:
      | Extract<InteractiveMessageRequest['interactive'], { type: 'list' }>
      | {
          text: string
          buttonText: string
          list: { sectionTitle: string; listItems: { title: string; description: string }[] }[]
        }
  }): Promise<
    Result<MessageResponse, ErrorBuilder<{ code: 'SEND_INTERACTIVE_LIST_MESSAGE_ERROR' }>>
  > {
    let body: Extract<Request, { type: 'interactive' }> | undefined = undefined
    body =
      'text' in data
        ? {
            ...baseIterativeMessageRequest,
            interactive: {
              action: {
                button: data.buttonText,
                sections: data.list.map((section) => ({
                  rows: section.listItems.map((item) => ({ id: item.title, ...item })),
                  title: section.sectionTitle
                }))
              },
              body: { text: data.text },
              type: 'list'
            },
            to
          }
        : { ...baseIterativeMessageRequest, interactive: data, to }

    const response = await this.sendMessageRequest({ body })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_INTERACTIVE_LIST_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendFlowMessage({
    to,
    data
  }: {
    to: string
    data: {
      text: string
      parameters: Extract<
        InteractiveMessageRequest['interactive'],
        { type: 'flow_message' }
      >['action']['parameters']
    }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_FLOW_MESSAGE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: {
        ...baseIterativeMessageRequest,
        body: { text: data.text },
        interactive: {
          action: { name: 'flow', parameters: data.parameters },
          type: 'flow_message'
        },
        to
      }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_FLOW_MESSAGE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendTypingIndicator({
    data
  }: {
    data: { messageId: string }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_TYPING_INDICATOR_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: {
        ...baseMessageRequest,
        message_id: data.messageId,
        status: 'read',
        typing_indicator: { type: 'text' }
      }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_TYPING_INDICATOR_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  // Media --------------------------------------------------------------------
  async mediaRequest(
    body: BodyInit
  ): Promise<Result<MediaResponse, ErrorBuilder<{ code: 'MEDIA_REQUEST_ERROR' }>>> {
    const response = await this.http.request<MediaResponse>({
      body,
      id: 'phoneNumberId',
      method: 'POST',
      path: 'media'
    })

    if (response.isErr()) {
      return err({ code: 'MEDIA_REQUEST_ERROR', extraParams: { error: response.error } })
    }

    return ok(response.value.response)
  }

  // oxlint-disable-next-line max-statements
  async uploadMedia({
    media
  }: {
    media: Blob
  }): Promise<
    Result<
      { mediaId: string },
      ErrorBuilder<{ code: 'UNSUPPORTED_MEDIA_TYPE' | 'UPLOAD_MEDIA_ERROR' }>
    >
  > {
    const mimeType = mimeTypeSchema(media.type)

    if (mimeType instanceof type.errors) {
      return err({ code: 'UNSUPPORTED_MEDIA_TYPE', data: { mimeType } })
    }

    const formData = new FormData()
    formData.append('file', media)
    formData.append('type', mimeType)
    formData.append('messaging_product', 'whatsapp')

    const mediaRequestResponse = await this.mediaRequest(formData)

    if (mediaRequestResponse.isErr()) {
      return errorHandlerResult(mediaRequestResponse.error, this.logger, {
        MEDIA_REQUEST_ERROR: {
          code: 'UPLOAD_MEDIA_ERROR',
          extraParams: { error: mediaRequestResponse.error }
        }
      })
    }

    return ok({ mediaId: mediaRequestResponse.value.id })
  }

  async getMediaUrl({
    mediaId
  }: {
    mediaId: string
  }): Promise<Result<{ mediaUrl: string }, ErrorBuilder<{ code: 'GET_MEDIA_URL_ERROR' }>>> {
    const response = await this.sendRequest<{ id: string; url: string }>({
      id: mediaId,
      method: 'GET'
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        HTTP_REQUEST_ERROR: { code: 'GET_MEDIA_URL_ERROR', extraParams: { error: response.error } }
      })
    }

    return ok({ mediaUrl: response.value.response.url })
  }

  async getMedia({
    mediaUrl
  }: {
    mediaUrl: string
  }): Promise<Result<Blob, ErrorBuilder<{ code: 'GET_MEDIA_ERROR' }>>> {
    try {
      const response = await this.http.fetch(mediaUrl, {
        headers: { Authorization: `Bearer ${this.config.token}` },
        responseType: 'blob'
      })
      return ok(response)
    } catch (error) {
      return err({ code: 'GET_MEDIA_ERROR', extraParams: { error } })
    }
  }

  // Templates ----------------------------------------------------------------
  async sendTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template']
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_TEMPLATE_ERROR' }>>> {
    const response = await this.sendMessageRequest({
      body: { ...baseMessageRequest, template: data, to, type: 'template' }
    })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_REQUEST_ERROR: {
          code: 'SEND_TEMPLATE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendTextTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & { components: [TemplateBody] }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_TEXT_TEMPLATE_ERROR' }>>> {
    const response = await this.sendTemplate({ data, to })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_TEMPLATE_ERROR: {
          code: 'SEND_TEXT_TEMPLATE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendMediaTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & {
      components: [TemplateMediaHeader, TemplateBody]
    }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_MEDIA_TEMPLATE_ERROR' }>>> {
    const response = await this.sendTemplate({ data, to })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_TEMPLATE_ERROR: {
          code: 'SEND_MEDIA_TEMPLATE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendFlowTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & {
      components: [TemplateBody, TemplateFlowButton]
    }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_FLOW_TEMPLATE_ERROR' }>>> {
    const response = await this.sendTemplate({ data, to })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_TEMPLATE_ERROR: {
          code: 'SEND_FLOW_TEMPLATE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendAuthTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & {
      components: [TemplateBody, TemplateAuthButton]
    }
  }): Promise<Result<MessageResponse, ErrorBuilder<{ code: 'SEND_AUTH_TEMPLATE_ERROR' }>>> {
    const response = await this.sendTemplate({ data, to })

    if (response.isErr()) {
      return errorHandlerResult(response.error, this.logger, {
        SEND_TEMPLATE_ERROR: {
          code: 'SEND_AUTH_TEMPLATE_ERROR',
          extraParams: { data, error: response.error }
        }
      })
    }

    return ok(response.value)
  }

  async sendTemplateRequest<T>({
    query,
    body,
    method = 'GET'
  }: {
    query?: string
    body?: string
    method?: RequestMethod
  }): Promise<{ success: true; data: T } | { success: false; error: unknown }> {
    const requestResponse = await this.sendRequest<T>({
      body,
      id: 'businessId',
      method,
      path: 'message_templates',
      query
    })

    if (requestResponse.isErr()) {
      this.logger.error('Failed to handle template request', requestResponse.error)
      return { error: requestResponse.error, success: false }
    }

    return { data: requestResponse.value.response, success: true }
  }

  async getTemplates({
    fields,
    limit,
    after,
    before
  }: { fields?: templateFields[]; limit?: number; after?: string; before?: string } = {}): Promise<
    { success: true; data: Templates } | { success: false; error: unknown }
  > {
    const queryParams: { fields?: string; limit?: string; after?: string; before?: string } = {}
    if (fields !== undefined) {
      queryParams.fields = fields.join(',')
    }
    if (limit !== undefined) {
      queryParams.limit = limit.toString()
    }
    if (after !== undefined) {
      queryParams.after = after
    }
    if (before !== undefined) {
      queryParams.before = before
    }

    return await this.sendTemplateRequest<Templates>({
      query: new URLSearchParams(queryParams).toString()
    })
  }

  async createTemplate({
    template
  }: {
    template: CreateTemplate
  }): Promise<
    { success: true; data: CreateTemplateResponse } | { success: false; error: unknown }
  > {
    return await this.sendTemplateRequest<CreateTemplateResponse>({
      body: JSON.stringify(template),
      method: 'POST'
    })
  }

  // Webhook ------------------------------------------------------------------
  verifyWebhook(input: WebhookSubscribeQuery): { statusCode: 200 | 401; body?: string } {
    if (
      input['hub.mode'] !== 'subscribe' ||
      input['hub.verify_token'] !== process.env.WS_VERIFY_TOKEN
    ) {
      return { statusCode: 401 }
    }

    return { body: input['hub.challenge'], statusCode: 200 }
  }

  // oxlint-disable-next-line max-statements
  async handleWebhook(
    input: WsRequest
  ): Promise<
    | {
        type: 'statusUpdate'
        messageId: string
        userId: string
        status:
          | MessageStatus.Read
          | MessageStatus.Delivered
          | MessageStatus.Sent
          | MessageStatus.Failed
      }
    | { type: 'message'; from: string; id: string; message: string; source: Source }
    | {
        type: 'media'
        from: string
        id: string
        blob: Blob
        mimeType: string
        message: string
        source: Source
      }
    | { type: 'flowReply'; from: string; id: string; data: Record<string, unknown> }
    | { type: 'reaction'; from: string; id: string; emoji: string }
    | undefined
  > {
    if (
      input.object === undefined ||
      input.entry[0].changes[0].value.metadata.phone_number_id !== this.config.phoneNumberId
    ) {
      return undefined
    }

    const webhookValue = input.entry[0].changes[0].value

    if ('statuses' in webhookValue) {
      return {
        messageId: webhookValue.statuses[0].id,
        status: webhookValue.statuses[0].status,
        type: 'statusUpdate',
        userId: webhookValue.statuses[0].recipient_id
      }
    }

    const [messageObject] = webhookValue.messages

    if (messageObject.type === 'reaction') {
      return {
        emoji: messageObject.reaction.emoji,
        from: messageObject.from,
        id: messageObject.reaction.message_id,
        type: 'reaction'
      }
    }

    if (messageObject.type === 'interactive' && messageObject.interactive.type === 'nfm_reply') {
      return {
        data: JSON.parse(messageObject.interactive.nfm_reply.response_json) as Record<
          string,
          unknown
        >,
        from: messageObject.from,
        id: messageObject.id,
        type: 'flowReply'
      }
    }

    if (['image', 'video', 'document', 'sticker', 'audio'].includes(messageObject.type)) {
      const media = { caption: '', id: '', mimeType: '' }
      switch (messageObject.type) {
        case 'image': {
          media.id = messageObject.image.id
          media.caption = messageObject.image.caption
          media.mimeType = messageObject.image.mime_type
          break
        }
        case 'video': {
          media.id = messageObject.video.id
          media.caption = messageObject.video.caption
          media.mimeType = messageObject.video.mime_type
          break
        }
        case 'document': {
          media.id = messageObject.document.id
          media.caption = messageObject.document.caption
          media.mimeType = messageObject.document.mime_type
          break
        }
        case 'sticker': {
          media.id = messageObject.sticker.id
          media.mimeType = messageObject.sticker.mime_type
          break
        }
        case 'audio': {
          media.id = messageObject.audio.id
          media.mimeType = messageObject.audio.mime_type
          break
        }
      }

      const mediaUrl = await this.getMediaUrl({ mediaId: media.id })

      if (mediaUrl.isErr()) {
        this.logger.error('Failed to get media URL for incoming media message', mediaUrl.error)
        return err({ error: mediaUrl.error })
      }

      const mediaBlob = await this.getMedia({ mediaUrl: mediaUrl.value.mediaUrl })

      if (mediaBlob.isErr()) {
        this.logger.error('Failed to get media blob for incoming media message', mediaBlob.error)
        return err({ error: mediaBlob.error })
      }

      return {
        blob: mediaBlob.value,
        from: messageObject.from,
        id: messageObject.id,
        message: media.caption,
        mimeType: media.mimeType,
        source: 'user',
        type: 'media'
      }
    }

    return { from: messageObject.from, type: 'message', ...this.getMessageText(messageObject) }
  }

  private getMessageText(message: Message): { id: string; message: string; source: Source } {
    const { id } = message
    switch (message.type) {
      case 'text': {
        return { id, message: message.text.body, source: 'user' }
      }
      case 'interactive': {
        if (message.interactive.type === 'nfm_reply') {
          return { id, message: 'Flow message', source: 'flow' }
        }
        if (message.interactive.type === 'list_reply') {
          return { id, message: message.interactive.list_reply.id, source: 'list' }
        }
        return { id, message: message.interactive.button_reply.id, source: 'button' }
      }
      case 'button': {
        return { id, message: message.button.payload, source: 'button' }
      }
      default: {
        return { id, message: 'Unsupported message type', source: 'user' }
      }
    }
  }
}

const defaultWsApi = new WsApi()

export { defaultWsApi, WsApi }
