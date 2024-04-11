import type { WsRequest, WebhookSubscribeQuery } from './types/webhook'
import type { Message } from './types/webhook/messages'

export function verifyWebhook (input: WebhookSubscribeQuery): {
  statusCode: 200 | 401
  body?: string
} {
  if (input['hub.mode'] !== 'subscribe' &&
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
} | {
  type: 'message'
  from: string
  message: string
} | undefined {
  if (input.object === undefined) {
    return
  }

  const webhookValue = input.entry[0].changes[0].value

  // Handle status updates
  if ('statuses' in webhookValue) {
    // TODO: Handle status updates
    return {
      type: 'statusUpdate'
    }
  }

  const messageObject = webhookValue.messages[0]

  // TODO: Add support for messages different than interactive and text
  if (messageObject.type !== 'interactive' && messageObject.type !== 'text') {
    return
  }

  return {
    type: 'message',
    from: messageObject.from,
    message: getMessageText(messageObject)
  }
}

function getMessageText (message: Message): string {
  switch (message.type) {
    case 'text':
      return message.text.body
    case 'interactive':
      return message.interactive.type === 'list_reply'
        ? message.interactive.list_reply.id
        : message.interactive.button_reply.id
    default:
      return ''
  }
}