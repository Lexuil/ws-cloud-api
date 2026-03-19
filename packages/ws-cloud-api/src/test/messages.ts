import fs from 'fs'
import path from 'path'
import { WsApi } from 'ws-cloud-api'

const phoneNumberToTest = process.env.PHONE_NUMBER_RECIPIENT ?? ''
const [__, ___, messageType] = process.argv

const wsApi = new WsApi()

const messageFunctions: Record<string, () => Promise<boolean>> = {
  audio: async () => {
    const response = await wsApi.sendAudio({
      link: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  buttons: async () => {
    const response = await wsApi.sendButtonMessage({
      message: {
        buttons: [
          { id: '1', title: 'Button 1' },
          { id: '2', title: 'Button 2' }
        ],
        text: 'Test button'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  contact: async () => {
    const response = await wsApi.sendContact({
      contacts: [
        {
          name: { first_name: 'Test', formatted_name: 'Test 1', last_name: 'Test 1' },
          phones: [{ phone: '+57123456789', type: 'Mobile', wa_id: '57123456789' }]
        },
        {
          name: { first_name: 'Test', formatted_name: 'Test 2', last_name: 'Test 2' },
          phones: [{ phone: '+57123456780', type: 'Mobile', wa_id: '57123456780' }]
        }
      ],
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  'cta-button': async () => {
    const response = await wsApi.sendCTAButtonMessage({
      message: { buttonText: 'CTA button', text: 'CTA button', url: 'https://www.google.com' },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  document: async () => {
    const response = await wsApi.sendDocument({
      caption: 'Test document',
      filename: 'dummy.pdf',
      link: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  file: async () => {
    const image = new Blob([fs.readFileSync(path.join(__dirname, '/assets/kirby.jpg'))], {
      type: 'image/jpeg'
    })

    const response = await wsApi.sendFile({ file: image, to: phoneNumberToTest })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  flow: async () => {
    const response = await wsApi.sendFlowMessage({
      draft: true,
      flow: {
        ctaText: 'View flow',
        defaultScreen: process.env.FLOW_MESSAGE_DEFAULT_SCREEN ?? '',
        id: process.env.FLOW_MESSAGE_ID ?? '',
        text: 'Test flow',
        token: 'token'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  image: async () => {
    const response = await wsApi.sendImage({
      link: 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  list: async () => {
    const response = await wsApi.sendInteractiveListMessage({
      list: {
        buttonText: 'List button',
        list: [
          { description: 'Description 1', title: 'Element 1' },
          { description: 'Description 2', title: 'Element 2' }
        ],
        text: 'Test list'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  'section-list': async () => {
    const response = await wsApi.sendInteractiveSectionListMessage({
      list: {
        buttonText: 'Section list button',
        sections: [
          {
            list: [
              { description: 'Description 1', title: 'Element 1' },
              { description: 'Description 2', title: 'Element 2' }
            ],
            sectionTitle: 'Section 1'
          },
          {
            list: [
              { description: 'Description 3', title: 'Element 3' },
              { description: 'Description 4', title: 'Element 4' }
            ],
            sectionTitle: 'Section 2'
          }
        ],
        text: 'Test section list'
      },
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  text: async () => {
    const response = await wsApi.sendText({
      message: 'Test message from library',
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  'typing-indicator': async (): Promise<boolean> => {
    const response = await wsApi.sendTypingIndicator({ input: { messageId: 'wamid.HBgMNTczM' } })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  },
  video: async () => {
    const response = await wsApi.sendVideo({
      link: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      to: phoneNumberToTest
    })

    if (response.isErr()) {
      console.error('Error:', response.error)
    } else {
      console.log(response.value)
    }

    return response.isOk()
  }
}

if (messageType in messageFunctions) {
  messageFunctions[messageType]()
    .then((success) => {
      if (success) {
        console.log('Message sent')
      }
    })
    .catch(console.error)
} else if (messageType === undefined) {
  console.error(
    'Message type not provided\n\nAvailable types:\n -' + Object.keys(messageFunctions).join('\n -')
  )
} else {
  console.error(`Message type ${messageType} not found`)
}
