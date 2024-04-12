import { sendMessageRequest } from './messaging'
import { MessageTypes } from './types/enums'

export async function sendTextTemplate (
  to: string,
  templateName: string,
  language: string
): Promise<boolean> {
  return await sendMessageRequest(
    to,
    {
      type: MessageTypes.Template,
      [MessageTypes.Template]: {
        name: templateName,
        language: {
          code: language,
          policy: 'deterministic'
        }
      }
    }
  )
}
