import { sendMessageRequest } from './messaging'
import { type wsConfig } from './types/config'
import { MessageTypes } from './types/enums'

export async function sendTextTemplate ({
  to,
  templateName,
  language,
  config
}: {
  to: string
  templateName: string
  language: string
  config?: wsConfig
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
        }
      }
    },
    config
  })
}
