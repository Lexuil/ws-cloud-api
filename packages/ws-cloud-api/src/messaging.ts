import { sendRequest } from './base'
import { uploadMedia } from './media'
import { type WsConfig } from './types/config'
import { InteractiveTypes, MessageTypes } from './types/enums'
import type {
  ListInteractive,
  Button,
  ButtonInteractive,
  Interactive,
  InteractiveBody,
  WSBody,
  MediaBody,
  CTAButtonInteractive,
  FlowInteractive,
  MessageResponse
} from './types/messages'

export type SendMessageResponse = {
  success: false
  error: unknown
} | {
  success: true
  response: MessageResponse
}

export async function sendMessageRequest({
  to,
  body,
  config
}: {
  to: string
  body: WSBody
  config?: WsConfig

}): Promise<SendMessageResponse> {
  const postBody = JSON.stringify({
    messaging_product: 'whatsapp',
    to,
    ...body
  })

  const requestResponse = await sendRequest({
    id: 'phoneNumberId',
    body: postBody,
    path: 'messages',
    method: 'POST',
    config
  })

  if (!requestResponse.success) {
    console.error(`Failed to send ${body.type} message`)
    console.error(JSON.stringify(await requestResponse.error, null, 2))
  }

  return requestResponse as SendMessageResponse
}

export async function sendText({
  to,
  message,
  previewUrl,
  config
}: {
  to: string
  message: string
  previewUrl?: boolean
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendMessageRequest({
    to,
    body: {
      type: MessageTypes.Text,
      [MessageTypes.Text]: {
        preview_url: previewUrl,
        body: message
      }
    },
    config
  })
}

async function sendSimpleMedia({
  to,
  type,
  link,
  filename,
  caption,
  config
}: {
  to: string
  type: MediaBody['type']
  link: string
  filename?: string
  caption?: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendMessageRequest({
    to,
    // FIXME: Typescript not identifying the type
    // @ts-expect-error Typescript not identifying the type
    body: {
      type,
      [type]: {
        link,
        filename,
        caption
      }
    },
    config
  })
}

export async function sendImage({
  to,
  link,
  config
}: {
  to: string
  link: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendSimpleMedia({ to, type: MessageTypes.Image, link, config })
}

export async function sendVideo({
  to,
  link,
  config
}: {
  to: string
  link: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendSimpleMedia({ to, type: MessageTypes.Video, link, config })
}

export async function sendDocument({
  to,
  link,
  filename,
  caption,
  config
}: {
  to: string
  link: string
  filename: string
  caption?: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendSimpleMedia({
    to,
    type: MessageTypes.Document,
    link,
    filename,
    caption,
    config
  })
}

export async function sendAudio({
  to,
  link,
  config
}: {
  to: string
  link: string
  config?: WsConfig
}): Promise<SendMessageResponse> {
  return await sendSimpleMedia({ to, type: MessageTypes.Audio, link, config })
}

export async function sendFile({
  to,
  file,
  config
}: {
  to: string
  file: Blob
  config?: WsConfig
}): Promise<SendMessageResponse> {
  try {
    const mediaId = await uploadMedia({ media: file, config })
    const mimeType = file.type.split('/')[0]
    const type = (mimeType === 'text' ||
      mimeType === 'application')
      ? MessageTypes.Document
      : mimeType as MediaBody['type']

    return await sendMessageRequest({
      to,
      // FIXME: Typescript not identifying the type
      // @ts-expect-error Typescript not identifying the type
      body: {
        type,
        [type]: {
          id: mediaId
        }
      },
      config
    })
  }
  catch (error) {
    console.error('Failed to send file')
    console.error(error)
    return {
      success: false,
      error
    }
  }
}

function generateInteractiveBody(input: Interactive): InteractiveBody {
  return {
    type: MessageTypes.Interactive,
    interactive: input
  }
}

export async function sendButtonMessage({
  to,
  message,
  config
}: {
  to: string
  message: {
    text: string
    buttons: Button[]
  }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  const body: ButtonInteractive = {
    type: InteractiveTypes.Button,
    body: {
      text: message.text
    },
    action: {
      buttons: []
    }
  }

  for (let i = 0; i < message.buttons.length; i++) {
    body.action.buttons.push({
      type: 'reply',
      reply: message.buttons[i]
    })
  }

  return await sendMessageRequest({
    to,
    body: generateInteractiveBody(body),
    config
  })
}

export async function sendCTAButtonMessage({
  to,
  message,
  config
}: {
  to: string
  message: {
    text: string
    buttonText: string
    url: string
  }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  const body: CTAButtonInteractive = {
    type: InteractiveTypes.CTAButton,
    body: {
      text: message.text
    },
    action: {
      name: InteractiveTypes.CTAButton,
      parameters: {
        display_text: message.buttonText,
        url: message.url
      }
    }
  }
  return await sendMessageRequest({
    to,
    body: generateInteractiveBody(body),
    config
  })
}

export async function sendInteractiveListMessage({
  to,
  list,
  config
}: {
  to: string
  list: {
    text: string
    buttonText: string
    list: Array<{
      title: string
      description: string
    }>
  }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  const body: ListInteractive = {
    type: InteractiveTypes.List,
    body: {
      text: list.text
    },
    action: {
      button: list.buttonText,
      sections: [
        {
          title: list.buttonText,
          rows: []
        }
      ]
    }
  }

  for (let i = 0; i < list.list.length; i++) {
    body.action.sections[0].rows.push({
      id: list.list[i].description,
      ...list.list[i]
    })
  }

  return await sendMessageRequest({
    to,
    body: generateInteractiveBody(body),
    config
  })
}

export async function sendInteractiveSectionListMessage({
  to,
  list,
  config
}: {
  to: string
  list: {
    text: string
    buttonText: string
    sections: Array<{
      sectionTitle: string
      list: Array<{
        title: string
        description: string
      }>
    }>
  }
  config?: WsConfig
}): Promise<SendMessageResponse> {
  const body: ListInteractive = {
    type: InteractiveTypes.List,
    body: {
      text: list.text
    },
    action: {
      button: list.buttonText,
      sections: []
    }
  }

  for (let i = 0; i < list.sections.length; i++) {
    body.action.sections.push({
      title: list.sections[i].sectionTitle,
      rows: []
    })

    for (let j = 0; j < list.sections[i].list.length; j++) {
      body.action.sections[i].rows.push({
        id: list.sections[i].list[j].description,
        ...list.sections[i].list[j]
      })
    }
  }

  return await sendMessageRequest({
    to,
    body: generateInteractiveBody(body),
    config
  })
}

export async function sendFlowMessage({
  to,
  flow,
  draft,
  config
}: {
  to: string
  flow: {
    id: string
    text: string
    token: string
    ctaText: string
    defaultScreen: string
    initDataExchange?: boolean
  }
  draft?: boolean
  config?: WsConfig
}): Promise<SendMessageResponse> {
  const body: FlowInteractive = {
    type: InteractiveTypes.Flow,
    body: {
      text: flow.text
    },
    action: {
      name: 'flow',
      parameters: {
        mode: draft === true ? 'draft' : 'published',
        flow_message_version: '3',
        flow_action: flow.initDataExchange === true
          ? 'data_exchange'
          : 'navigate',
        flow_token: flow.token,
        flow_id: flow.id,
        flow_cta: flow.ctaText,
        flow_action_payload: flow.initDataExchange === true
          ? undefined
          : {
              screen: flow.defaultScreen
            }
      }
    }
  }

  return await sendMessageRequest({
    to,
    body: generateInteractiveBody(body),
    config
  })
}
