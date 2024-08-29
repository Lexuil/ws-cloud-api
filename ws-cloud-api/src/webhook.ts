import type { MessageStatus } from './types/enums'
import type { WsRequest, WebhookSubscribeQuery } from './types/webhook'
import type { Message } from './types/webhook/messages'

type Source = 'user' | 'button' | 'list' | 'flow'

export function verifyWebhook (input: WebhookSubscribeQuery): {
  statusCode: 200 | 401
  body?: string
} {
  if (input['hub.mode'] !== 'subscribe' ||
  input['hub.verify_token'] !== process.env.WS_VERIFY_TOKEN) {
    return {
      statusCode: 401
    }
  }

  return {
    statusCode: 200,
    body: input['hub.challenge']
  }
}

export function handleWebhook (input: WsRequest): {
  type: 'statusUpdate'
  messageId: string
  userId: string
  status: MessageStatus.Read | MessageStatus.Delivered | MessageStatus.Sent | MessageStatus.Failed
} | {
  type: 'message'
  from: string
  message: string
  source: Source
} | {
  type: 'voiceAudio'
  from: string
  audio: {
    id: string
    mimeType: string
  }
} | {
  type: 'flowReply'
  from: string
  data: Record<string, unknown>
} | undefined {
  if (input.object === undefined) {
    return
  }

  // Prevent messages from other phone numbers
  if (
    input.entry[0].changes[0].value.metadata.phone_number_id !==
    process.env.WS_PHONE_NUMBER_ID
  ) {
    return
  }

  const webhookValue = input.entry[0].changes[0].value

  // Handle status updates
  if ('statuses' in webhookValue) {
    return {
      type: 'statusUpdate',
      messageId: webhookValue.statuses[0].id,
      userId: webhookValue.statuses[0].recipient_id,
      status: webhookValue.statuses[0].status
    }
  }

  const messageObject = webhookValue.messages[0]

  // Voce audio messages
  if (messageObject.type === 'audio' && messageObject.audio.voice) {
    return {
      type: 'voiceAudio',
      from: messageObject.from,
      audio: {
        id: messageObject.audio.id,
        mimeType: messageObject.audio.mime_type
      }
    }
  }

  // TODO: Add support for messages different than interactive and text
  if (
    messageObject.type !== 'interactive' &&
    messageObject.type !== 'text' &&
    messageObject.type !== 'button'
  ) {
    return
  }

  // Flow messages
  if (messageObject.type === 'interactive' &&
  messageObject.interactive.type === 'nfm_reply') {
    return {
      type: 'flowReply',
      from: messageObject.from,
      data: JSON.parse(messageObject.interactive.nfm_reply.response_json)
    }
  }

  return {
    type: 'message',
    from: messageObject.from,
    ...getMessageText(messageObject)
  }
}

function getMessageText (message: Message): {
  message: string
  source: Source
} {
  switch (message.type) {
    case 'text':
      return {
        message: message.text.body,
        source: 'user'
      }
    case 'interactive':
      if (message.interactive.type === 'nfm_reply') {
        return {
          message: 'Flow message',
          source: 'flow'
        }
      }

      if (message.interactive.type === 'list_reply') {
        return {
          message: message.interactive.list_reply.id,
          source: 'list'
        }
      }

      return {
        message: message.interactive.button_reply.id,
        source: 'button'
      }
    case 'button':
      return {
        message: message.button.payload,
        source: 'button'
      }
    default:
      return {
        message: 'Unsupported message type',
        source: 'user'
      }
  }
}
