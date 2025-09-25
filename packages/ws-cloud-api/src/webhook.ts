import { getMedia, getMediaUrl } from './media'
import type { MessageStatus } from './types/enums'
import type { WsRequest, WebhookSubscribeQuery } from './types/webhook'
import type { Message } from './types/webhook/messages'

type Source = 'user' | 'button' | 'list' | 'flow'

export function verifyWebhook(input: WebhookSubscribeQuery): {
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

export async function handleWebhook(input: WsRequest): Promise<{
  type: 'statusUpdate'
  messageId: string
  userId: string
  status: MessageStatus.Read | MessageStatus.Delivered | MessageStatus.Sent | MessageStatus.Failed
} | {
  type: 'message'
  from: string
  id: string
  message: string
  source: Source
} | {
  type: 'media'
  from: string
  id: string
  blob: Blob
  mimeType: string
  message: string
  source: Source
} | {
  type: 'flowReply'
  from: string
  id: string
  data: Record<string, unknown>
} | {
  type: 'reaction'
  from: string
  id: string
  emoji: string
} | undefined> {
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
  if (messageObject.type === 'reaction') {
    return {
      type: 'reaction',
      from: messageObject.from,
      id: messageObject.reaction.message_id,
      emoji: messageObject.reaction.emoji
    }
  }

  // Flow messages
  if (messageObject.type === 'interactive' &&
    messageObject.interactive.type === 'nfm_reply') {
    return {
      type: 'flowReply',
      from: messageObject.from,
      id: messageObject.id,
      data: JSON.parse(messageObject.interactive.nfm_reply.response_json) as {
        [key: string]: unknown
      }
    }
  }

  // Media messages
  if (['image', 'video', 'document', 'sticker', 'audio']
    .includes(messageObject.type)) {
    const media = {
      id: '',
      caption: '',
      mimeType: ''
    }
    switch (messageObject.type) {
      case 'image':
        media.id = messageObject.image.id
        media.caption = messageObject.image.caption
        media.mimeType = messageObject.image.mime_type
        break
      case 'video':
        media.id = messageObject.video.id
        media.caption = messageObject.video.caption
        media.mimeType = messageObject.video.mime_type
        break
      case 'document':
        media.id = messageObject.document.id
        media.caption = messageObject.document.caption
        media.mimeType = messageObject.document.mime_type
        break
      case 'sticker':
        media.id = messageObject.sticker.id
        media.mimeType = messageObject.sticker.mime_type
        break
      case 'audio':
        media.id = messageObject.audio.id
        media.mimeType = messageObject.audio.mime_type
        break
    }

    const mediaUrl = await getMediaUrl({ mediaId: media.id })

    const mediaBlob = await getMedia({ mediaUrl })

    return {
      type: 'media',
      from: messageObject.from,
      id: messageObject.id,
      blob: mediaBlob,
      mimeType: media.mimeType,
      message: media.caption,
      source: 'user'
    }
  }

  return {
    type: 'message',
    from: messageObject.from,
    ...getMessageText(messageObject)
  }
}

function getMessageText(message: Message): {
  id: string
  message: string
  source: Source
} {
  const id = message.id
  switch (message.type) {
    case 'text':
      return {
        id,
        message: message.text.body,
        source: 'user'
      }
    case 'interactive':
      if (message.interactive.type === 'nfm_reply') {
        return {
          id,
          message: 'Flow message',
          source: 'flow'
        }
      }

      if (message.interactive.type === 'list_reply') {
        return {
          id,
          message: message.interactive.list_reply.id,
          source: 'list'
        }
      }

      return {
        id,
        message: message.interactive.button_reply.id,
        source: 'button'
      }
    case 'button':
      return {
        id,
        message: message.button.payload,
        source: 'button'
      }
    default:
      return {
        id,
        message: 'Unsupported message type',
        source: 'user'
      }
  }
}
