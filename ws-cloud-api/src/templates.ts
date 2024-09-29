import { sendMessageRequest } from './messaging'
import { MessageTypes } from './types/enums'
import type { WsConfig } from './types/config'
import type { TemplateParameter } from './types/messages'

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
  parameters?: TemplateParameter[]
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
        components: parameters === undefined
          ? undefined
          : [{
              type: 'body',
              parameters
            }]
      }
    },
    config
  })
}
