import { InteractiveTypes } from './types/enums'
import type {
  ListInteractive,
  Button,
  ButtonInteractive
} from './types/messages'

// TODO: Remove any type in body
export async function sendMessageRequest (
  to: string,
  body: any
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

  console.log(JSON.stringify(await response.json(), null, 2))

  if (!response.ok) {
    console.error('Failed to send message')
  } else {
    console.log('Message sent successfully to user')
  }
}

export async function sendText (
  to: string,
  message: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'text',
      text: {
        body: message
      }
    }
  )
}

export async function sendImage (
  to: string,
  link: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'image',
      image: {
        link
      }
    }
  )
}

export async function sendVideo (
  to: string,
  link: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'video',
      video: {
        link
      }
    }
  )
}

export async function sendDocument (
  to: string,
  link: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'document',
      document: {
        link
      }
    }
  )
}

export async function sendAudio (
  to: string,
  link: string
): Promise<void> {
  await sendMessageRequest(
    to,
    {
      type: 'audio',
      audio: {
        link
      }
    }
  )
}

export async function sendButtonMessage (
  to: string,
  message: {
    text: string
    buttons: Button[]
  }
): Promise<void> {
  const body: {
    type: string
    interactive: ButtonInteractive
  } = {
    type: 'interactive',
    interactive: {
      type: InteractiveTypes.Button,
      body: {
        text: message.text
      },
      action: {
        buttons: []
      }
    }
  }

  for (let i = 0; i < message.buttons.length; i++) {
    body.interactive.action.buttons.push({
      type: 'reply',
      reply: message.buttons[i]
    })
  }

  await sendMessageRequest(to, body)
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
  const body: {
    type: string
    interactive: ListInteractive
  } = {
    type: 'interactive',
    interactive: {
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
  }

  for (let i = 0; i < interactive.list.length; i++) {
    body.interactive.action.sections[0].rows.push({
      id: interactive.list[i].description,
      ...interactive.list[i]
    })
  }

  await sendMessageRequest(to, body)
}
