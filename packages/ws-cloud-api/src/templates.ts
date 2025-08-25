import { sendMessageRequest, type SendMessageResponse } from './messaging'
import { MessageTypes } from './types/enums'
import type { WsConfig } from './types/config'
import type {
  TemplateBodyParameter,
  TemplateHeaderParameter
} from './types/messages'
import { sendRequest } from './base'
import type {
  templateFields,
  CreateTemplate,
  Templates,
  CreateTemplateResponse
} from './types/templates'

export async function sendTextTemplate({
  to,
  templateName,
  language,
  parameters,
  config
}: {
  to: string
  templateName: string
  language: string
  parameters?: TemplateBodyParameter[]
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendMessageRequest({
    to,
    body: {
      type: MessageTypes.Template,
      [MessageTypes.Template]: {
        name: templateName,
        language: {
          code: language,
          policy: 'deterministic'
        },
        components: [{
          type: 'body',
          parameters
        }]
      }
    },
    config
  })
}

export async function sendMediaTemplate({
  to,
  templateName,
  language,
  headerParameters,
  bodyParameters,
  config
}: {
  to: string
  templateName: string
  language: string
  headerParameters: TemplateHeaderParameter
  bodyParameters?: TemplateBodyParameter[]
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendMessageRequest({
    to,
    body: {
      type: MessageTypes.Template,
      [MessageTypes.Template]: {
        name: templateName,
        language: {
          code: language,
          policy: 'deterministic'
        },
        components: [
          {
            type: 'header',
            parameters: [headerParameters]
          },
          {
            type: 'body',
            parameters: bodyParameters
          }
        ]
      }
    },
    config
  })
}

export async function sendAuthTemplate({
  to,
  templateName,
  language,
  code,
  config
}: {
  to: string
  templateName: string
  language: string
  code: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendMessageRequest({
    to,
    body: {
      type: MessageTypes.Template,
      [MessageTypes.Template]: {
        name: templateName,
        language: {
          code: language,
          policy: 'deterministic'
        },
        components: [
          {
            type: 'body',
            parameters: [{
              type: 'text',
              text: code
            }]
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [{
              type: 'text',
              text: code
            }]
          }
        ]
      }
    },
    config
  })
}

export type SendTemplateRequestResponse<T> = {
  success: true
  data: T
} | {
  success: false
  error: unknown
}

export async function sendTemplateRequest<T>({
  query,
  body,
  method = 'GET',
  config
}: {
  query?: string
  body?: string
  method?: string
  config?: WsConfig
}): Promise<SendTemplateRequestResponse<T>> {
  const requestResponse = await sendRequest({
    id: 'businessId',
    path: 'message_templates',
    method,
    body,
    query,
    config
  })

  if (!requestResponse.success) {
    console.error('Failed to create template')
    console.log(requestResponse.error)
    return requestResponse
  }
  else {
    return {
      success: true,
      data: requestResponse.response as T
    }
  }
}

export async function getTemplates({
  fields,
  limit,
  after,
  before,
  config
}: {
  fields?: templateFields[]
  limit?: number
  after?: string
  before?: string
  config?: WsConfig
} = {}): Promise<SendTemplateRequestResponse<Templates>> {
  const queryParams: {
    fields?: string
    limit?: string
    after?: string
    before?: string
  } = {}
  if (fields !== undefined) queryParams.fields = fields.join(',')
  if (limit !== undefined) queryParams.limit = limit.toString()
  if (after !== undefined) queryParams.after = after
  if (before !== undefined) queryParams.before = before
  return await sendTemplateRequest({
    query: new URLSearchParams(queryParams).toString(),
    config
  })
}

export async function createTemplate({
  template,
  config
}: {
  template: CreateTemplate
  config?: WsConfig
}): Promise<SendTemplateRequestResponse<CreateTemplateResponse>> {
  return await sendTemplateRequest({
    method: 'POST',
    body: JSON.stringify(template),
    config
  })
}
