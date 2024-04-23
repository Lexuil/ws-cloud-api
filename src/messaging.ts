import { InteractiveTypes, MessageTypes } from './types/enums'
import type {
  ListInteractive,
  Button,
  ButtonInteractive,
  Interactive,
  InteractiveBody,
  WSBody,
  MediaBody,
  CTAButtonInteractive
} from './types/messages'

export async function sendMessageRequest (
  to: string,
  body: WSBody
): Promise<boolean> {
  const postBody = JSON.stringify({
    messaging_product: 'whatsapp',
    to,
    ...body
  })

  const response = await fetch(
    `https://graph.facebook.com/v${process.env.WS_CA_VERSION ?? '19.0'}/${process.env.WS_PHONE_NUMBER_ID}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: postBody
    }
  )

  if (!response.ok) {
    console.error(`Failed to send ${body.type} message`)
    console.error(JSON.stringify(await response.json(), null, 2))
    return false
  } else {
    return true
  }
}

export async function sendText (
  to: string,
  message: string
): Promise<boolean> {
  return await sendMessageRequest(
    to,
    {
      type: MessageTypes.Text,
      [MessageTypes.Text]: {
        body: message
      }
    }
  )
}

async function sendSimpleMedia (
  to: string,
  type: MediaBody['type'],
  link: string
): Promise<boolean> {
  return await sendMessageRequest(
    to,
    // FIXME: Typescript not identifying the type
    // @ts-expect-error Typescript not identifying the type
    {
      type,
      [type]: {
        link
      }
    }
  )
}

export async function sendImage (to: string, link: string): Promise<boolean> {
  return await sendSimpleMedia(to, MessageTypes.Image, link)
}

export async function sendVideo (to: string, link: string): Promise<boolean> {
  return await sendSimpleMedia(to, MessageTypes.Video, link)
}

export async function sendDocument (to: string, link: string): Promise<boolean> {
  return await sendSimpleMedia(to, MessageTypes.Document, link)
}

export async function sendAudio (to: string, link: string): Promise<boolean> {
  return await sendSimpleMedia(to, MessageTypes.Audio, link)
}

function generateInteractiveBody (input: Interactive): InteractiveBody {
  return {
    type: MessageTypes.Interactive,
    interactive: input
  }
}

export async function sendButtonMessage (
  to: string,
  message: {
    text: string
    buttons: Button[]
  }
): Promise<boolean> {
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

  return await sendMessageRequest(to, generateInteractiveBody(body))
}

export async function sendCTAButtonMessage (
  to: string,
  message: {
    text: string
    buttonText: string
    url: string
  }
): Promise<boolean> {
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
  return await sendMessageRequest(to, generateInteractiveBody(body))
}

export async function sendInteractiveListMessage (
  to: string,
  list: {
    text: string
    buttonText: string
    list: Array<{
      title: string
      description: string
    }>
  }
): Promise<boolean> {
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

  return await sendMessageRequest(to, generateInteractiveBody(body))
}

export async function sendInteractiveSectionListMessage (
  to: string,
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
): Promise<boolean> {
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

  return await sendMessageRequest(to, generateInteractiveBody(body))
}
