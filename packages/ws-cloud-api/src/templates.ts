import { sendMessageRequest, type SendMessageResponse } from './messaging'
import { MessageTypes } from './types/enums'
import type { WsConfig } from './types/config'
import type {
  TemplateBodyParameter,
  TemplateHeaderParameter
} from './types/messages'
import { sendRequest } from './base'
import type { templateFields, Templates } from './types/templates'

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

export type SendTemplateRequestResponse = {
  success: true
  templates: Templates
} | {
  success: false
  error: unknown
}

export async function sendTemplateRequest({
  query,
  config
}: {
  query?: string
  config?: WsConfig
}): Promise<SendTemplateRequestResponse> {
  const requestResponse = await sendRequest({
    id: 'businessId',
    path: 'message_templates',
    method: 'GET',
    query,
    config
  })

  if (!requestResponse.success) {
    console.error('Failed to get templates')
    console.log(requestResponse.error)
    return requestResponse
  }
  else {
    return {
      success: true,
      templates: requestResponse.response as Templates
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
} = {}): Promise<SendTemplateRequestResponse> {
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
