import { createHttpClient, type HttpResponse, type RequestMethod } from './core/http'
import { resolveConfig, type ResolvedConfig } from './core/config'
import { createLogger } from './core/logger'
import { InteractiveTypes, MessageTypes } from './types/enums'
import type { WsConfig } from './types/config'
import type { Logger } from './types/logger'
import type {
  Button,
  ButtonInteractive,
  CTAButtonInteractive,
  Contact,
  FlowInteractive,
  Interactive,
  InteractiveBody,
  ListInteractive,
  MediaBody,
  MessageResponse,
  WSBody
} from './types/messages'
import type {
  CreateTemplate,
  CreateTemplateResponse,
  Templates,
  templateFields
} from './types/templates'
import type {
  TemplateBodyParameter,
  TemplateFlowParameter,
  TemplateHeaderParameter
} from './types/messages'
import type { MessageStatus } from './types/enums'
import type { WsRequest, WebhookSubscribeQuery } from './types/webhook'
import type { Message } from './types/webhook/messages'

type SendMessageResponse =
  | { success: false, error: unknown } |
  { success: true, response: MessageResponse }

type Source = 'user' | 'button' | 'list' | 'flow'

const supportedFiles = {
  image: ['image/jpeg', 'image/png'],
  document: [
    'text/plain',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/msword',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ],
  audio: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg', 'audio/opus'],
  video: ['video/mp4', 'video/3gp']
}

export class WsApi {
  private readonly config: ResolvedConfig
  private readonly logger: Logger
  private readonly http: ReturnType<typeof createHttpClient>

  constructor(config?: WsConfig) {
    this.config = resolveConfig(config)
    this.logger = createLogger(config?.logger)
    this.http = createHttpClient(this.config, this.logger)
  }

  async sendRequest({
    id,
    body,
    path,
    query,
    method,
    headers
  }: {
    id: 'phoneNumberId' | 'businessId'
    body?: unknown
    path: 'messages' | 'message_templates' | (string & NonNullable<unknown>)
    query?: string
    method: RequestMethod | (string & NonNullable<unknown>)
    headers?: Record<string, string>
  }): Promise<HttpResponse> {
    const preparedBody = body === undefined
      ? undefined
      : body instanceof FormData || typeof body === 'string'
        ? body
        : JSON.stringify(body)

    return await this.http.request({
      id,
      body: preparedBody ?? null,
      path,
      query,
      method,
      headers
    })
  }

  // Messaging ----------------------------------------------------------------
  async sendMessageRequest({
    to,
    body
  }: {
    to: string
    body: WSBody
  }): Promise<SendMessageResponse> {
    const postBody = {
      messaging_product: 'whatsapp',
      to,
      ...body
    }

    const requestResponse = await this.sendRequest({
      id: 'phoneNumberId',
      body: postBody,
      path: 'messages',
      method: 'POST'
    })

    if (!requestResponse.success) {
      const msgType = typeof body.type === 'string' ? body.type : 'unknown'
      this.logger.error?.(`Failed to send ${msgType} message`, requestResponse.error)
    }

    return requestResponse as SendMessageResponse
  }

  async sendText({ to, message, previewUrl }: { to: string, message: string, previewUrl?: boolean }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      to,
      body: {
        type: MessageTypes.Text,
        [MessageTypes.Text]: {
          preview_url: previewUrl,
          body: message
        }
      }
    })
  }

  async sendContact({ to, contacts }: { to: string, contacts: Contact[] }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      to,
      body: {
        type: MessageTypes.Contacts,
        [MessageTypes.Contacts]: contacts
      }
    })
  }

  private async sendSimpleMedia({
    to,
    type,
    link,
    filename,
    caption
  }: {
    to: string
    type: MediaBody['type']
    link: string
    filename?: string
    caption?: string
  }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      to,
      body: {
        type,
        [type]: {
          link,
          filename,
          caption
        }
      } as unknown as MediaBody
    })
  }

  async sendImage({ to, link }: { to: string, link: string }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ to, type: MessageTypes.Image, link })
  }

  async sendVideo({ to, link }: { to: string, link: string }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ to, type: MessageTypes.Video, link })
  }

  async sendDocument({ to, link, filename, caption }: { to: string, link: string, filename: string, caption?: string }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ to, type: MessageTypes.Document, link, filename, caption })
  }

  async sendAudio({ to, link }: { to: string, link: string }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ to, type: MessageTypes.Audio, link })
  }

  async sendFile({ to, file }: { to: string, file: Blob }): Promise<SendMessageResponse> {
    try {
      const mediaId = await this.uploadMedia({ media: file })
      const mimeType = file.type.split('/')[0]
      const type = (mimeType === 'text' || mimeType === 'application')
        ? MessageTypes.Document
        : mimeType as MediaBody['type']

      return await this.sendMessageRequest({
        to,
        body: {
          type,
          [type]: {
            id: mediaId
          }
        } as unknown as MediaBody
      })
    }
    catch (error) {
      this.logger.error?.('Failed to send file', error)
      return { success: false, error }
    }
  }

  private generateInteractiveBody(input: Interactive): InteractiveBody {
    return {
      type: MessageTypes.Interactive,
      interactive: input
    }
  }

  async sendButtonMessage({
    to,
    message
  }: {
    to: string
    message: { text: string, buttons: Button[] }
  }): Promise<SendMessageResponse> {
    const body: ButtonInteractive = {
      type: InteractiveTypes.Button,
      body: { text: message.text },
      action: { buttons: [] }
    }

    for (let i = 0; i < message.buttons.length; i++) {
      body.action.buttons.push({ type: 'reply', reply: message.buttons[i] })
    }

    return await this.sendMessageRequest({
      to,
      body: this.generateInteractiveBody(body)
    })
  }

  async sendCTAButtonMessage({
    to,
    message
  }: {
    to: string
    message: { text: string, buttonText: string, url: string }
  }): Promise<SendMessageResponse> {
    const body: CTAButtonInteractive = {
      type: InteractiveTypes.CTAButton,
      body: { text: message.text },
      action: {
        name: InteractiveTypes.CTAButton,
        parameters: {
          display_text: message.buttonText,
          url: message.url
        }
      }
    }
    return await this.sendMessageRequest({
      to,
      body: this.generateInteractiveBody(body)
    })
  }

  async sendInteractiveListMessage({
    to,
    list
  }: {
    to: string
    list: { text: string, buttonText: string, list: Array<{ title: string, description: string }> }
  }): Promise<SendMessageResponse> {
    const body: ListInteractive = {
      type: InteractiveTypes.List,
      body: { text: list.text },
      action: {
        button: list.buttonText,
        sections: [{ title: list.buttonText, rows: [] }]
      }
    }

    for (let i = 0; i < list.list.length; i++) {
      body.action.sections[0].rows.push({
        id: list.list[i].description,
        ...list.list[i]
      })
    }

    return await this.sendMessageRequest({
      to,
      body: this.generateInteractiveBody(body)
    })
  }

  async sendInteractiveSectionListMessage({
    to,
    list
  }: {
    to: string
    list: {
      text: string
      buttonText: string
      sections: Array<{ sectionTitle: string, list: Array<{ title: string, description: string }> }>
    }
  }): Promise<SendMessageResponse> {
    const body: ListInteractive = {
      type: InteractiveTypes.List,
      body: { text: list.text },
      action: { button: list.buttonText, sections: [] }
    }

    for (let i = 0; i < list.sections.length; i++) {
      body.action.sections.push({ title: list.sections[i].sectionTitle, rows: [] })

      for (let j = 0; j < list.sections[i].list.length; j++) {
        body.action.sections[i].rows.push({
          id: list.sections[i].list[j].description,
          ...list.sections[i].list[j]
        })
      }
    }

    return await this.sendMessageRequest({
      to,
      body: this.generateInteractiveBody(body)
    })
  }

  async sendFlowMessage({
    to,
    flow,
    draft
  }: {
    to: string
    flow: {
      id: string
      text: string
      token: string
      ctaText: string
      defaultScreen: string
      initDataExchange?: boolean
    }
    draft?: boolean
  }): Promise<SendMessageResponse> {
    const body: FlowInteractive = {
      type: InteractiveTypes.Flow,
      body: { text: flow.text },
      action: {
        name: 'flow',
        parameters: {
          mode: draft === true ? 'draft' : 'published',
          flow_message_version: '3',
          flow_action: flow.initDataExchange === true ? 'data_exchange' : 'navigate',
          flow_token: flow.token,
          flow_id: flow.id,
          flow_cta: flow.ctaText,
          flow_action_payload: flow.initDataExchange === true
            ? undefined
            : { screen: flow.defaultScreen }
        }
      }
    }

    return await this.sendMessageRequest({
      to,
      body: this.generateInteractiveBody(body)
    })
  }

  async sendTypingIndicator({ input }: { input: { messageId: string } }): Promise<SendMessageResponse> {
    const postBody = {
      messaging_product: 'whatsapp',
      status: 'read',
      message_id: input.messageId,
      typing_indicator: { type: 'text' }
    }

    const requestResponse = await this.sendRequest({
      id: 'phoneNumberId',
      body: postBody,
      path: 'messages',
      method: 'POST'
    })

    if (!requestResponse.success) {
      this.logger.error?.('Failed to send typing indicator', requestResponse.error)
    }

    return requestResponse as SendMessageResponse
  }

  // Media --------------------------------------------------------------------
  async mediaRequest(body: BodyInit): Promise<unknown> {
    const response = await this.http.request({
      id: 'phoneNumberId',
      path: 'media',
      method: 'POST',
      body
    })

    if (!response.success) {
      this.logger.error?.('Failed to make media request', response.error)
      return false
    }

    return response.response
  }

  async uploadMedia({ media }: { media: Blob }): Promise<string> {
    if (!supportedFiles.image.includes(media.type) &&
      !supportedFiles.document.includes(media.type) &&
      !supportedFiles.audio.includes(media.type) &&
      !supportedFiles.video.includes(media.type)) {
      throw new Error('Unsupported media type')
    }

    const formData = new FormData()
    formData.append('file', media)
    formData.append('type', media.type)
    formData.append('messaging_product', 'whatsapp')

    const mediaRequestResponse = await this.mediaRequest(formData) as { id: string }
    return mediaRequestResponse.id
  }

  async getMediaUrl({ mediaId }: { mediaId: string }): Promise<string> {
    if (typeof this.config.token !== 'string') {
      this.logger.error?.('Missing token for media request')
      return ''
    }

    const apiVersion = this.config.apiVersion
    const token = this.config.token

    const response = await this.http.fetchImpl(
      `https://graph.facebook.com/v${apiVersion}/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      this.logger.error?.('Failed to get media url', { status: response.status })
      return ''
    }

    const parsed = await response.json() as { id: string, url: string }
    return parsed.url
  }

  async getMedia({ mediaUrl }: { mediaUrl: string }): Promise<Blob> {
    if (typeof this.config.token !== 'string') {
      throw new Error('Missing token for media download')
    }

    const token = this.config.token

    const response = await this.http.fetchImpl(mediaUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return await response.blob()
  }

  // Templates ----------------------------------------------------------------
  async sendTextTemplate({
    to,
    templateName,
    language,
    parameters
  }: {
    to: string
    templateName: string
    language: string
    parameters?: TemplateBodyParameter[]
  }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      to,
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          name: templateName,
          language: { code: language, policy: 'deterministic' },
          components: [{ type: 'body', parameters }]
        }
      }
    })
  }

  async sendMediaTemplate({
    to,
    templateName,
    language,
    headerParameters,
    bodyParameters
  }: {
    to: string
    templateName: string
    language: string
    headerParameters: TemplateHeaderParameter
    bodyParameters?: TemplateBodyParameter[]
  }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      to,
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          name: templateName,
          language: { code: language, policy: 'deterministic' },
          components: [
            { type: 'header', parameters: [headerParameters] },
            { type: 'body', parameters: bodyParameters }
          ]
        }
      }
    })
  }

  async sendFlowTemplate({
    to,
    templateName,
    language,
    flow,
    bodyParameters
  }: {
    to: string
    templateName: string
    language: string
    flow: TemplateFlowParameter['action']
    bodyParameters?: TemplateBodyParameter[]
  }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      to,
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          name: templateName,
          language: { code: language, policy: 'deterministic' },
          components: [
            { type: 'body', parameters: bodyParameters },
            {
              type: 'button',
              sub_type: 'flow',
              index: '0',
              parameters: [{ type: 'action', action: flow }]
            }
          ]
        }
      }
    })
  }

  async sendAuthTemplate({
    to,
    templateName,
    language,
    code
  }: {
    to: string
    templateName: string
    language: string
    code: string
  }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      to,
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          name: templateName,
          language: { code: language, policy: 'deterministic' },
          components: [
            { type: 'body', parameters: [{ type: 'text', text: code }] },
            {
              type: 'button',
              sub_type: 'url',
              index: '0',
              parameters: [{ type: 'text', text: code }]
            }
          ]
        }
      }
    })
  }

  async sendTemplateRequest<T>({
    query,
    body,
    method = 'GET'
  }: {
    query?: string
    body?: string
    method?: string
  }): Promise<{ success: true, data: T } | { success: false, error: unknown }> {
    const requestResponse = await this.sendRequest({
      id: 'businessId',
      path: 'message_templates',
      method: method as RequestMethod,
      body,
      query
    })

    if (!requestResponse.success) {
      this.logger.error?.('Failed to handle template request', requestResponse.error)
      return requestResponse
    }

    return { success: true, data: requestResponse.response as T }
  }

  async getTemplates({
    fields,
    limit,
    after,
    before
  }: {
    fields?: templateFields[]
    limit?: number
    after?: string
    before?: string
  } = {}): Promise<{ success: true, data: Templates } | { success: false, error: unknown }> {
    const queryParams: { fields?: string, limit?: string, after?: string, before?: string } = {}
    if (fields !== undefined) queryParams.fields = fields.join(',')
    if (limit !== undefined) queryParams.limit = limit.toString()
    if (after !== undefined) queryParams.after = after
    if (before !== undefined) queryParams.before = before

    return await this.sendTemplateRequest<Templates>({
      query: new URLSearchParams(queryParams).toString()
    })
  }

  async createTemplate({ template }: { template: CreateTemplate }): Promise<{ success: true, data: CreateTemplateResponse } | { success: false, error: unknown }> {
    return await this.sendTemplateRequest<CreateTemplateResponse>({
      method: 'POST',
      body: JSON.stringify(template)
    })
  }

  // Webhook ------------------------------------------------------------------
  verifyWebhook(input: WebhookSubscribeQuery): { statusCode: 200 | 401, body?: string } {
    if (input['hub.mode'] !== 'subscribe' || input['hub.verify_token'] !== process.env.WS_VERIFY_TOKEN) {
      return { statusCode: 401 }
    }

    return {
      statusCode: 200,
      body: input['hub.challenge']
    }
  }

  async handleWebhook(input: WsRequest): Promise<
    | { type: 'statusUpdate', messageId: string, userId: string, status: MessageStatus.Read | MessageStatus.Delivered | MessageStatus.Sent | MessageStatus.Failed } |
    { type: 'message', from: string, id: string, message: string, source: Source } |
    { type: 'media', from: string, id: string, blob: Blob, mimeType: string, message: string, source: Source } |
    { type: 'flowReply', from: string, id: string, data: Record<string, unknown> } |
    { type: 'reaction', from: string, id: string, emoji: string } |
    undefined
  > {
    if (input.object === undefined) return undefined

    if (input.entry[0].changes[0].value.metadata.phone_number_id !== this.config.phoneNumberId) {
      return undefined
    }

    const webhookValue = input.entry[0].changes[0].value

    if ('statuses' in webhookValue) {
      return {
        type: 'statusUpdate',
        messageId: webhookValue.statuses[0].id,
        userId: webhookValue.statuses[0].recipient_id,
        status: webhookValue.statuses[0].status
      }
    }

    const messageObject = webhookValue.messages[0]

    if (messageObject.type === 'reaction') {
      return {
        type: 'reaction',
        from: messageObject.from,
        id: messageObject.reaction.message_id,
        emoji: messageObject.reaction.emoji
      }
    }

    if (messageObject.type === 'interactive' && messageObject.interactive.type === 'nfm_reply') {
      return {
        type: 'flowReply',
        from: messageObject.from,
        id: messageObject.id,
        data: JSON.parse(messageObject.interactive.nfm_reply.response_json) as { [key: string]: unknown }
      }
    }

    if (['image', 'video', 'document', 'sticker', 'audio'].includes(messageObject.type)) {
      const media = { id: '', caption: '', mimeType: '' }
      switch (messageObject.type) {
        case 'image':
          media.id = messageObject.image.id
          media.caption = messageObject.image.caption
          media.mimeType = messageObject.image.mime_type
          break
        case 'video':
          media.id = messageObject.video.id
          media.caption = messageObject.video.caption
          media.mimeType = messageObject.video.mime_type
          break
        case 'document':
          media.id = messageObject.document.id
          media.caption = messageObject.document.caption
          media.mimeType = messageObject.document.mime_type
          break
        case 'sticker':
          media.id = messageObject.sticker.id
          media.mimeType = messageObject.sticker.mime_type
          break
        case 'audio':
          media.id = messageObject.audio.id
          media.mimeType = messageObject.audio.mime_type
          break
      }

      const mediaUrl = await this.getMediaUrl({ mediaId: media.id })
      const mediaBlob = await this.getMedia({ mediaUrl })

      return {
        type: 'media',
        from: messageObject.from,
        id: messageObject.id,
        blob: mediaBlob,
        mimeType: media.mimeType,
        message: media.caption,
        source: 'user'
      }
    }

    return {
      type: 'message',
      from: messageObject.from,
      ...this.getMessageText(messageObject)
    }
  }

  private getMessageText(message: Message): { id: string, message: string, source: Source } {
    const id = message.id
    switch (message.type) {
      case 'text':
        return { id, message: message.text.body, source: 'user' }
      case 'interactive':
        if (message.interactive.type === 'nfm_reply') {
          return { id, message: 'Flow message', source: 'flow' }
        }
        if (message.interactive.type === 'list_reply') {
          return { id, message: message.interactive.list_reply.id, source: 'list' }
        }
        return { id, message: message.interactive.button_reply.id, source: 'button' }
      case 'button':
        return { id, message: message.button.payload, source: 'button' }
      default:
        return { id, message: 'Unsupported message type', source: 'user' }
    }
  }
}

export const defaultWsApi = new WsApi()
