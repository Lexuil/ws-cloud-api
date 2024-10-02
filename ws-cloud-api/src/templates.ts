import { sendMessageRequest } from './messaging'
import { MessageTypes } from './types/enums'
import type { WsConfig } from './types/config'
import type {
  TemplateBodyParameter,
  TemplateHeaderParameter
} from './types/messages'

export async function sendTextTemplate ({
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
}): Promise<boolean> {
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

export async function sendMediaTemplate ({
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
}): Promise<boolean> {
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
