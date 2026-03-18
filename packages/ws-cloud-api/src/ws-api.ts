import type { ResolvedConfig } from './core/config'
import type { HttpResponse, RequestMethod } from './core/http'
import type { WsConfig } from './types/config'
import type { MessageStatus } from './types/enums'
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
  WSBody,
  TemplateBodyParameter,
  TemplateFlowParameter,
  TemplateHeaderParameter
} from './types/messages'
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
import createLogger from './core/logger'
import { InteractiveTypes, MessageTypes } from './types/enums'

type SendMessageResponse =
  | { success: false; error: unknown }
  | { success: true; response: MessageResponse }

type Source = 'user' | 'button' | 'list' | 'flow'

const supportedFiles = {
  audio: ['audio/aac', 'audio/mp4', 'audio/mpeg', 'audio/amr', 'audio/ogg', 'audio/opus'],
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
  image: ['image/jpeg', 'image/png'],
  video: ['video/mp4', 'video/3gp']
}

class WsApi {
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
    let preparedBody = undefined
    if (body !== undefined) {
      preparedBody =
        body instanceof FormData || typeof body === 'string' ? body : JSON.stringify(body)
    }

    return await this.http.request({ body: preparedBody ?? null, headers, id, method, path, query })
  }

  // Messaging ----------------------------------------------------------------
  async sendMessageRequest({
    to,
    body
  }: {
    to: string
    body: WSBody
  }): Promise<SendMessageResponse> {
    const postBody = { messaging_product: 'whatsapp', to, ...body }

    const requestResponse = await this.sendRequest({
      body: postBody,
      id: 'phoneNumberId',
      method: 'POST',
      path: 'messages'
    })

    if (!requestResponse.success) {
      const msgType = typeof body.type === 'string' ? body.type : 'unknown'
      this.logger.error?.(`Failed to send ${msgType} message`, requestResponse.error)
    }

    return requestResponse as SendMessageResponse
  }

  async sendText({
    to,
    message,
    previewUrl
  }: {
    to: string
    message: string
    previewUrl?: boolean
  }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      body: {
        type: MessageTypes.Text,
        [MessageTypes.Text]: { body: message, preview_url: previewUrl }
      },
      to
    })
  }

  async sendContact({
    to,
    contacts
  }: {
    to: string
    contacts: Contact[]
  }): Promise<SendMessageResponse> {
    return await this.sendMessageRequest({
      body: { type: MessageTypes.Contacts, [MessageTypes.Contacts]: contacts },
      to
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
      body: { type, [type]: { caption, filename, link } } as unknown as MediaBody,
      to
    })
  }

  async sendImage({ to, link }: { to: string; link: string }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ link, to, type: MessageTypes.Image })
  }

  async sendVideo({ to, link }: { to: string; link: string }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ link, to, type: MessageTypes.Video })
  }

  async sendDocument({
    to,
    link,
    filename,
    caption
  }: {
    to: string
    link: string
    filename: string
    caption?: string
  }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ caption, filename, link, to, type: MessageTypes.Document })
  }

  async sendAudio({ to, link }: { to: string; link: string }): Promise<SendMessageResponse> {
    return await this.sendSimpleMedia({ link, to, type: MessageTypes.Audio })
  }

  async sendFile({ to, file }: { to: string; file: Blob }): Promise<SendMessageResponse> {
    try {
      const mediaId = await this.uploadMedia({ media: file })
      const [mimeType] = file.type.split('/')
      const type =
        mimeType === 'text' || mimeType === 'application'
          ? MessageTypes.Document
          : (mimeType as MediaBody['type'])

      return await this.sendMessageRequest({
        body: { type, [type]: { id: mediaId } } as unknown as MediaBody,
        to
      })
    } catch (error) {
      this.logger.error?.('Failed to send file', error)
      return { error, success: false }
    }
  }

  private generateInteractiveBody(input: Interactive): InteractiveBody {
    return { interactive: input, type: MessageTypes.Interactive }
  }

  async sendButtonMessage({
    to,
    message
  }: {
    to: string
    message: { text: string; buttons: Button[] }
  }): Promise<SendMessageResponse> {
    const body: ButtonInteractive = {
      action: { buttons: [] },
      body: { text: message.text },
      type: InteractiveTypes.Button
    }

    for (const button of message.buttons) {
      body.action.buttons.push({ reply: button, type: 'reply' })
    }

    return await this.sendMessageRequest({ body: this.generateInteractiveBody(body), to })
  }

  async sendCTAButtonMessage({
    to,
    message
  }: {
    to: string
    message: { text: string; buttonText: string; url: string }
  }): Promise<SendMessageResponse> {
    const body: CTAButtonInteractive = {
      action: {
        name: InteractiveTypes.CTAButton,
        parameters: { display_text: message.buttonText, url: message.url }
      },
      body: { text: message.text },
      type: InteractiveTypes.CTAButton
    }
    return await this.sendMessageRequest({ body: this.generateInteractiveBody(body), to })
  }

  async sendInteractiveListMessage({
    to,
    list
  }: {
    to: string
    list: { text: string; buttonText: string; list: { title: string; description: string }[] }
  }): Promise<SendMessageResponse> {
    const body: ListInteractive = {
      action: { button: list.buttonText, sections: [{ rows: [], title: list.buttonText }] },
      body: { text: list.text },
      type: InteractiveTypes.List
    }

    for (const listItem of list.list) {
      body.action.sections[0].rows.push({ id: listItem.description, ...listItem })
    }

    return await this.sendMessageRequest({ body: this.generateInteractiveBody(body), to })
  }

  async sendInteractiveSectionListMessage({
    to,
    list
  }: {
    to: string
    list: {
      text: string
      buttonText: string
      sections: { sectionTitle: string; list: { title: string; description: string }[] }[]
    }
  }): Promise<SendMessageResponse> {
    const body: ListInteractive = {
      action: { button: list.buttonText, sections: [] },
      body: { text: list.text },
      type: InteractiveTypes.List
    }

    for (let sectionIndex = 0; sectionIndex < list.sections.length; sectionIndex++) {
      body.action.sections.push({ rows: [], title: list.sections[sectionIndex].sectionTitle })

      for (const listItem of list.sections[sectionIndex].list) {
        body.action.sections[sectionIndex].rows.push({ id: listItem.description, ...listItem })
      }
    }

    return await this.sendMessageRequest({ body: this.generateInteractiveBody(body), to })
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
      action: {
        name: 'flow',
        parameters: {
          flow_action: flow.initDataExchange === true ? 'data_exchange' : 'navigate',
          flow_action_payload:
            flow.initDataExchange === true ? undefined : { screen: flow.defaultScreen },
          flow_cta: flow.ctaText,
          flow_id: flow.id,
          flow_message_version: '3',
          flow_token: flow.token,
          mode: draft === true ? 'draft' : 'published'
        }
      },
      body: { text: flow.text },
      type: InteractiveTypes.Flow
    }

    return await this.sendMessageRequest({ body: this.generateInteractiveBody(body), to })
  }

  async sendTypingIndicator({
    input
  }: {
    input: { messageId: string }
  }): Promise<SendMessageResponse> {
    const postBody = {
      message_id: input.messageId,
      messaging_product: 'whatsapp',
      status: 'read',
      typing_indicator: { type: 'text' }
    }

    const requestResponse = await this.sendRequest({
      body: postBody,
      id: 'phoneNumberId',
      method: 'POST',
      path: 'messages'
    })

    if (!requestResponse.success) {
      this.logger.error?.('Failed to send typing indicator', requestResponse.error)
    }

    return requestResponse as SendMessageResponse
  }

  // Media --------------------------------------------------------------------
  async mediaRequest(body: BodyInit): Promise<unknown> {
    const response = await this.http.request({
      body,
      id: 'phoneNumberId',
      method: 'POST',
      path: 'media'
    })

    if (!response.success) {
      this.logger.error?.('Failed to make media request', response.error)
      return false
    }

    return response.response
  }

  async uploadMedia({ media }: { media: Blob }): Promise<string> {
    if (
      !supportedFiles.image.includes(media.type) &&
      !supportedFiles.document.includes(media.type) &&
      !supportedFiles.audio.includes(media.type) &&
      !supportedFiles.video.includes(media.type)
    ) {
      throw new Error('Unsupported media type')
    }

    const formData = new FormData()
    formData.append('file', media)
    formData.append('type', media.type)
    formData.append('messaging_product', 'whatsapp')

    const mediaRequestResponse = (await this.mediaRequest(formData)) as { id: string }
    return mediaRequestResponse.id
  }

  async getMediaUrl({ mediaId }: { mediaId: string }): Promise<string> {
    if (typeof this.config.token !== 'string') {
      this.logger.error?.('Missing token for media request')
      return ''
    }

    const { apiVersion, token } = this.config

    const response = await this.http.fetchImpl(
      `https://graph.facebook.com/v${apiVersion}/${mediaId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!response.ok) {
      this.logger.error?.('Failed to get media url', { status: response.status })
      return ''
    }

    const parsed = (await response.json()) as { id: string; url: string }
    return parsed.url
  }

  async getMedia({ mediaUrl }: { mediaUrl: string }): Promise<Blob> {
    if (typeof this.config.token !== 'string') {
      throw new Error('Missing token for media download')
    }

    const { token } = this.config

    const response = await this.http.fetchImpl(mediaUrl, {
      headers: { Authorization: `Bearer ${token}` }
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
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          components: [{ parameters, type: 'body' }],
          language: { code: language, policy: 'deterministic' },
          name: templateName
        }
      },
      to
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
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          components: [
            { parameters: [headerParameters], type: 'header' },
            { parameters: bodyParameters, type: 'body' }
          ],
          language: { code: language, policy: 'deterministic' },
          name: templateName
        }
      },
      to
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
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          components: [
            { parameters: bodyParameters, type: 'body' },
            {
              index: '0',
              parameters: [{ action: flow, type: 'action' }],
              sub_type: 'flow',
              type: 'button'
            }
          ],
          language: { code: language, policy: 'deterministic' },
          name: templateName
        }
      },
      to
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
      body: {
        type: MessageTypes.Template,
        [MessageTypes.Template]: {
          components: [
            { parameters: [{ text: code, type: 'text' }], type: 'body' },
            {
              index: '0',
              parameters: [{ text: code, type: 'text' }],
              sub_type: 'url',
              type: 'button'
            }
          ],
          language: { code: language, policy: 'deterministic' },
          name: templateName
        }
      },
      to
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
  }): Promise<{ success: true; data: T } | { success: false; error: unknown }> {
    const requestResponse = await this.sendRequest({
      body,
      id: 'businessId',
      method: method as RequestMethod,
      path: 'message_templates',
      query
    })

    if (!requestResponse.success) {
      this.logger.error?.('Failed to handle template request', requestResponse.error)
      return requestResponse
    }

    return { data: requestResponse.response as T, success: true }
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
