import type { MessageStatus } from './types/enums'
import type { WsRequest, WebhookSubscribeQuery } from './types/webhook'
import type { Message } from './types/webhook/messages'

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
