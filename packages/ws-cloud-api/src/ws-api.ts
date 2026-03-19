import type { Result } from 'neverthrow'

import { type } from 'arktype'
import { err, ok } from 'neverthrow'

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
  }): Promise<HttpResponse<T>> {
    let preparedBody = undefined
    if (body !== undefined) {
      preparedBody =
        body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body)
    }

    return await this.http.request({ body: preparedBody, headers, id, method, path, query })
  }

  // Messaging ----------------------------------------------------------------
  async sendMessageRequest({
    body
  }: {
    body: Request
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    const requestResponse = await this.sendRequest<MessageResponse>({
      body: body,
      id: 'phoneNumberId',
      method: 'POST',
      path: 'messages'
    })

    if (requestResponse.isErr()) {
      const msgType = typeof body.type === 'string' ? body.type : 'unknown'
      this.logger.error(`Failed to send ${msgType} message`, requestResponse.error)
    }

    return requestResponse.isOk()
      ? ok(requestResponse.value.response)
      : err({ error: requestResponse.error })
  }

  async sendText({
    to,
    message,
    previewUrl
  }: {
    to: string
    message: string
    previewUrl?: boolean
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: {
        ...baseMessageRequest,
        text: { body: message, preview_url: previewUrl },
        to,
        type: 'text'
      }
    })
  }

  async sendContact({
    to,
    contacts
  }: {
    to: string
    contacts: Contact[]
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: { ...baseMessageRequest, contacts, to, type: 'contacts' }
    })
  }

  async sendImage({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'image' }>['image']
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: { ...baseMessageRequest, image: data, to, type: 'image' }
    })
  }

  async sendVideo({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'video' }>['video']
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: { ...baseMessageRequest, to, type: 'video', video: data }
    })
  }

  async sendDocument({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'document' }>['document']
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: { ...baseMessageRequest, document: data, to, type: 'document' }
    })
  }

  async sendAudio({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'audio' }>['audio']
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: { ...baseMessageRequest, audio: data, to, type: 'audio' }
    })
  }

  // oxlint-disable-next-line max-statements
  async sendFile({
    to,
    data
  }: {
    to: string
    data: { file: Blob; caption?: string; filename?: string }
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    try {
      const mediaId = await this.uploadMedia({ media: data.file })

      if (mediaId.isErr()) {
        this.logger.error('Failed to upload media for file message', mediaId.error)
        return err({ error: mediaId.error })
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
          throw new Error('Unsupported media type')
        }
      }
    } catch (error) {
      this.logger.error('Failed to send file', error)
      return err({ error })
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
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return 'text' in data
      ? await this.sendMessageRequest({
          body: {
            ...baseIterativeMessageRequest,
            interactive: {
              action: { buttons: data.buttons.map((button) => ({ reply: button, type: 'reply' })) },
              body: { text: data.text },
              footer: data.footer ? { text: data.footer } : undefined,
              type: 'button'
            },
            to
          }
        })
      : await this.sendMessageRequest({
          body: { ...baseIterativeMessageRequest, interactive: data, to }
        })
  }

  async sendCTAButtonMessage({
    to,
    data
  }: {
    to: string
    data:
      | Extract<InteractiveMessageRequest['interactive'], { type: 'cta_url' }>
      | { text: string; buttonText: string; url: string; footer?: string }
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return 'text' in data
      ? await this.sendMessageRequest({
          body: {
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
        })
      : await this.sendMessageRequest({
          body: { ...baseIterativeMessageRequest, interactive: data, to }
        })
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
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return 'text' in data
      ? await this.sendMessageRequest({
          body: {
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
        })
      : await this.sendMessageRequest({
          body: { ...baseIterativeMessageRequest, interactive: data, to }
        })
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
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
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
  }

  async sendTypingIndicator({
    data
  }: {
    data: { messageId: string }
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: {
        ...baseMessageRequest,
        message_id: data.messageId,
        status: 'read',
        typing_indicator: { type: 'text' }
      }
    })
  }

  // Media --------------------------------------------------------------------
  async mediaRequest(body: BodyInit): Promise<Result<MediaResponse, { error: unknown }>> {
    const response = await this.http.request<MediaResponse>({
      body,
      id: 'phoneNumberId',
      method: 'POST',
      path: 'media'
    })

    if (response.isErr()) {
      this.logger.error('Failed to make media request', response.error)
      return err({ error: response.error })
    }

    return ok(response.value.response)
  }

  async uploadMedia({
    media
  }: {
    media: Blob
  }): Promise<Result<{ mediaId: string }, { error: unknown }>> {
    const mimeType = mimeTypeSchema(media.type)

    if (mimeType instanceof type.errors) {
      throw new Error('Unsupported media type')
    }

    const formData = new FormData()
    formData.append('file', media)
    formData.append('type', mimeType)
    formData.append('messaging_product', 'whatsapp')

    const mediaRequestResponse = await this.mediaRequest(formData)

    return mediaRequestResponse.match(
      (value) => ok({ mediaId: value.id }),
      ({ error }) => {
        this.logger.error('Failed to upload media', error)
        return err({ error: error })
      }
    )
  }

  async getMediaUrl({
    mediaId
  }: {
    mediaId: string
  }): Promise<Result<{ mediaUrl: string }, { error: unknown }>> {
    const response = await this.sendRequest<{ id: string; url: string }>({
      id: mediaId,
      method: 'GET'
    })

    return response.match(
      (value) => ok({ mediaUrl: value.response.url }),
      ({ error }) => {
        this.logger.error('Failed to get media URL', error)
        return err({ error })
      }
    )
  }

  async getMedia({ mediaUrl }: { mediaUrl: string }): Promise<Result<Blob, { error: unknown }>> {
    try {
      const response = await this.http.fetch(mediaUrl, {
        headers: { Authorization: `Bearer ${this.config.token}` },
        responseType: 'blob'
      })
      return ok(response)
    } catch (error) {
      this.logger.error('Failed to get media', error)
      return err({ error })
    }
  }

  // Templates ----------------------------------------------------------------
  async sendTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template']
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendMessageRequest({
      body: { ...baseMessageRequest, template: data, to, type: 'template' }
    })
  }

  async sendTextTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & { components: [TemplateBody] }
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendTemplate({ data, to })
  }

  async sendMediaTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & {
      components: [TemplateMediaHeader, TemplateBody]
    }
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendTemplate({ data, to })
  }

  async sendFlowTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & {
      components: [TemplateBody, TemplateFlowButton]
    }
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendTemplate({ data, to })
  }

  async sendAuthTemplate({
    to,
    data
  }: {
    to: string
    data: Extract<Request, { type: 'template' }>['template'] & {
      components: [TemplateBody, TemplateAuthButton]
    }
  }): Promise<Result<MessageResponse, { error: unknown }>> {
    return await this.sendTemplate({ data, to })
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
      const mediaBlob = await this.getMedia({ mediaUrl })

      return {
        blob: mediaBlob,
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
