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

async function sendMessageRequest (
  to: string,
  body: WSBody
): Promise<void> {
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
  } else {
    console.log(`${body.type} message sent successfully to user`)
  }
}

export async function sendText (
  to: string,
  message: string
): Promise<void> {
  await sendMessageRequest(
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
): Promise<void> {
  await sendMessageRequest(
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

export async function sendImage (to: string, link: string): Promise<void> {
  await sendSimpleMedia(to, MessageTypes.Image, link)
}

export async function sendVideo (to: string, link: string): Promise<void> {
  await sendSimpleMedia(to, MessageTypes.Video, link)
}

export async function sendDocument (to: string, link: string): Promise<void> {
  await sendSimpleMedia(to, MessageTypes.Document, link)
}

export async function sendAudio (to: string, link: string): Promise<void> {
  await sendSimpleMedia(to, MessageTypes.Audio, link)
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
): Promise<void> {
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

  await sendMessageRequest(to, generateInteractiveBody(body))
}

export async function sendCTAButtonMessage (
  to: string,
  message: {
    text: string
    buttonText: string
    url: string
  }
): Promise<void> {
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
  await sendMessageRequest(to, generateInteractiveBody(body))
}

export async function sendInteractiveListMessage (
  to: string,
  interactive: {
    text: string
    buttonText: string
    list: Array<{
      title: string
      description: string
    }>
  }
): Promise<void> {
  const body: ListInteractive = {
    type: InteractiveTypes.List,
    body: {
      text: interactive.text
    },
    action: {
      button: interactive.buttonText,
      sections: [
        {
          title: interactive.buttonText,
          rows: []
        }
      ]
    }
  }

  for (let i = 0; i < interactive.list.length; i++) {
    body.action.sections[0].rows.push({
      id: interactive.list[i].description,
      ...interactive.list[i]
    })
  }

  await sendMessageRequest(to, generateInteractiveBody(body))
}
